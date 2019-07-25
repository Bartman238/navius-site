/* eslint-disable indent */
"use strict";
require('dotenv').config();
// -----------------------------------------------------------
// Variables
// -----------------------------------------------------------
const port = process.env.PORT || 3001
      ,express = require('express')
      ,app = express()
      ,apiAdmin = express.Router()
      ,server = require('http').Server(app)
      ,bodyParser = require('body-parser')
      ,cors = require('cors')
      ,morgan = require('morgan')
      ,request = require('request')
      ,moment = require('moment')
      ,passwordHash = require('password-hash-node')
      ,jwt = require('jsonwebtoken')
      ,cookieParser = require('cookie-parser')

      // Security
      ,helmet = require('helmet')

      // File system
      ,fs = require('fs')
      ,multer = require('multer')
      ,path = require('path')

      // DB Init
      ,mongoose = require('mongoose')
      ,db = mongoose.connection
      ,ObjectId = require('mongoose').Types.ObjectId
      
      // Error logger
      // ,logStream = fs.createWriteStream(__dirname + '/logs/node_error.log', { flags:'a' })

      // Sending emails
      ,nodemailer = require('nodemailer')
      ,transporter = nodemailer.createTransport({
        service: 'Yandex',
        auth: {
               user: process.env.EMAIL_USER,
               pass: process.env.EMAIL_PASSWORD
           }
       })
       ,mailTemplates = require('./mail-templates')

      // DB Models
      ,User = require('./models/user')
      ,Post = require('./models/post')
      ,_Event = require('./models/event')
      ,CMB = require('./models/call-me-back')
      ,Question = require('./models/question')
      ,Subscriber = require('./models/subscriber')
      ,Docs = require('./models/doc')
      ,Log = require('./models/log')
      ,Setting = require('./models/setting')
      ,Promo = require('./models/promo')
      ,News = require('./models/site-news');

//--------------------------------------------------------------
// Functions
//--------------------------------------------------------------
/**
 * Make first letter capital
 * @param {string} name String to capitalize
 * @return {string} Capitalized string
 */
const capitalize = (name) => { 
  return name.charAt(0).toUpperCase() + name.slice(1); 
};

/**
 * Split array by chunks
 * @param {array} array Array to split
 * @param {number} size Size of chunks
 * @return {array} Multidimensional array
 */
const splitChunks = (array, size) => {
  let chunks = [];
  for (let i = 0; i < Math.ceil(array.length / +size); i++) {
    chunks.push(array.slice(+size * i, +size * (i + 1)));
  }
  return chunks;
};

/**
 * Nodemailer send email
 * @param {string} to Address to
 * @param {string} subject Email subject
 * @param {string} html Email body
 * @param {array} attachments Email attachments
 */
const sendMail = (to, subject, html, attachments) => {
  const mailOptions = { 
    from: 'Центр сделок с недвижимостью <no-reply@centr-sdelok.ru>', 
    to, subject, html, attachments
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) writeLog(undefined,  err, 'transporter.sendMail');
  });
};

/**
 * Write log to mongodb
 * @param {object} req Route request or undefined
 * @param {object} err Error object
 * @param {string} desc Description
 */
const writeLog = (req, err, desc) => {
  let log = new Log({
    cdate: new Date(),
    route: req === undefined ? req : 
             req.originalUrl ? req.originalUrl : req.url,
    description: desc,
    err: err ? err.toString() : ''
  });
  log.save();
};

/**
 * Shuffle array
 * @param {array} a Array to shuffle
 * @return {array} Shuffled array
 */
const shuffleArray = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Route send status
 * @param {object} res Route response
 * @param {number} errNum Error  code
 * @param {object} json Route answer
 * @param {object} err Error object
 */
const status = (res, errNum, json, err) => {
  if (json === null) {
    json = { success: false, message: "Something went wrong :(", err };
  }
  res.status(+errNum).json(json);
};

/**
 * Get manager email from global site settings
 */
const getManagerEmail = () => {
  return Setting.findOne({ '_id': new ObjectId('5bfd5d245944b4ff66114a4b') })
    .then(result => {
      return result.global.managerEmail;
    })
    .catch(err => {
      writeLog(req, err, 'Setting.findOne');
      res.status(503).render('site/pages/503');
    });
};

/**
 * MIDDLEWARE Get site settings
 */
const getSiteSettings = (req, res, next) => {
  Setting.findOne({ '_id': new ObjectId('5bfd5d245944b4ff66114a4b') })
  .then(result => {
    app.locals.siteVars = result;
    next();
  })
  .catch(err => {
    writeLog(req, err, 'Setting.findOne');
    res.status(503).render('site/pages/503');
  });
};

/**
 * MIDDLEWARE Protect api routes with token
 * @param {object} req Request
 * @param {object} res Response
 * @param {object} next Next route
 */
const tokenProtect = (req, res, next) => {
  // Check header or url parameters or post parameters for token
  let token = req.cookies['x-access-token'];

  if (token) {
    // Verifying secret and expire date
    jwt.verify(token, app.get('tokenSecret'), (err, decoded) => {
      if (err) {
        // let json = { success: false, message: "Failed to authenticate token." };
        res.render('admin/page-login');
      } else {
        // if everything is good, save decoded token to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // If no token found
    // let json = { success: false, message: "No token provided." };
    // status(res, 403, json);
    res.render('admin/page-login');
  }
};

// -----------------------------------------------------------
// Application configuration
// -----------------------------------------------------------

// Pass moment to pug and set locale
moment.locale('ru');
app.locals.moment = require('moment');

app.use(helmet({
  frameguard: false
}));
app.use(morgan('dev', 
  { skip: (req, res) => { return res.statusCode < 400; }}
));  
app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.urlencoded({ limit: '15mb', extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(getSiteSettings);

app.set('view engine', 'pug');
app.set('tokenSecret', process.env.TOKEN_SECRET);

// -----------------------------------------------------------
// MongoDB Connection
// -----------------------------------------------------------
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true });
db.on("error", console.error.bind(console, "Something wrong, my friend :("));
db.once("open", () => {
  console.log("DB Connection Succeeded");
});

// ------------------------------------------------------------
// Testing
// ------------------------------------------------------------
// app.get('/api/test', (req, res) => {
//   let email = getManagerEmail().then(result => {
//     res.status(200).json({ success: true });
//   });
// });
// app.get('/api/test2', tokenProtect,(req, res) => {
//   res.status(200).json({ success: true, msg: 'protected' });
// });

// -----------------------------------------------------------
// Admin API
// -----------------------------------------------------------
app.post('/api/auth', (req, res) => {
  User.findOne(
    { login: req.body.login },
    { 'passwordHash': 1 })
  .then(user => {
    if (!user) {
      // If user not found, send success false and 404
      let json = { success: false, message: "Authentication failed. User not found." };
      status(res, 404, json);
    } else if (user) {
      // If user found, check if password matches
      const isValidPassword = passwordHash.verify(req.body.password, user.passwordHash);

      if (!isValidPassword) {
        // If password is not valid, send success false and 422
        let json = { success: false, message: "Authentication failed. Wrong password." };
        status(res, 422, json);
      } else {
        // If password is valid and user found, create a token with user id in payload
        const payload = { uid: user._id };
        
        // Sign token and set expire date to 1 week
        const token = jwt.sign(payload, app.get('tokenSecret'), {
          expiresIn: 7 * 24 * 60 * 60
        });
        let options = {
          // httpOnly: true,
          expire: 7 * 24 * 60 * 60,
          path: '/wtf'
        };
        res.cookie('x-access-token', token, options);
        let json = { success: true, message: "Here is your token, bro ;)", token: token };
        status(res, 200, json);
      }
    }
  })
  .catch(err => {
    // If error, send success false and 503
    status(res, 503, null, err);
  });
});

// -----------------------------------------------------------
// Users API
// -----------------------------------------------------------
app.post('/api/check-recaptcha', (req, res) => {
  let secretKey = process.env.RECAPTCHA_SECRET;

  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    res.status(200).json({ success: false });
  } else {
    let verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    request(verificationUrl, (err, response, body) => {
      body = JSON.parse(body);
      if (body.success) res.status(200).json({ success: true });
      else res.status(200).json({ success: false });
    });
  }
});

app.post('/api/call-me-back', (req, res) => {
  let call = new CMB({
    cdate: new Date(),
    name: req.body.name,
    tel: req.body.tel
  });

  call.save(err => {
    if (err) {
      writeLog(req, err, 'call.save');
      res.status(200).json({ success: false });
    }
    else {
      let subj = 'Заявка на обратный звонок'
          ,html = mailTemplates.callMeBack(call);

      getManagerEmail()
      .then(to => {
        sendMail(to, subj, html);
        res.status(200).json({ success: true });
      })
      .catch(err => {
        writeLog(req, err, 'getManagerEmail');
        res.status(200).json({ success: false });
      });
    }
  });
});

app.post('/api/repeat-event', (req, res) => {
  let subj = 'Заявка на повтор семинара'
      ,html = mailTemplates.repeatEvent(req.body);

  getManagerEmail()
  .then(to => {
    sendMail(to, subj, html);
    res.status(200).json({ success: true });
  })
  .catch(err => {
    writeLog(req, err, 'getManagerEmail');
    res.status(200).json({ success: false });
  });
});

app.post('/api/create-subscriber', (req, res) => {
  
  Subscriber.findOne({ 'email': req.body.email })
  .then(sub => {
    if (!sub) {
      let subscriber = new Subscriber({
        cdate: new Date(),
        email: req.body.email
      });
      
      subscriber.save(err => {
        if (err) {
          writeLog(req, err, 'subscriber.save');
          res.status(200).json({ success: false });
        } else res.status(200).json({ success: true, double: false });
      });
    } else res.status(200).json({ success: false, double: true });
  })
  .catch(err => {
    writeLog(req, err, 'Subscriber.findOne');
    res.status(200).json({ success: false });
  });
});

let resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/private/resume');
  },
  filename: (req, file, cb) => {
    cb(null, Math.random().toString(36).substring(7) + Date.now() + path.extname(file.originalname)); // Appending extension
  }
});
let resumeUpload = multer({ storage: resumeStorage });

app.post('/api/send-resume', resumeUpload.array('files[]', 1), (req, res) => {
  let subj = 'Резюме с сайта'
      ,html = mailTemplates.resume(req.body)
      ,attach = [
        {
          filename: req.files[0].originalname,
          content: fs.createReadStream(`./src/private/resume/${req.files[0].filename}`)
        }
      ];
  getManagerEmail()
  .then(to => {
    sendMail(to, subj, html, attach);
    res.status(200).json({ success: true });
  })
  .catch(err => {
    writeLog(req, err, 'getManagerEmail');
    res.status(200).json({ success: false });
  });
});

app.post('/api/create-question', (req, res) => {
  let question = new Question({
    cdate: new Date(),
    name: req.body.name,
    tel: req.body.tel,
    email: req.body.email,
    question: req.body.question
  });

  question.save(err => {
    if (err) {
      writeLog(req, err, 'question.save');
      res.status(200).json({ success: false });
    } else {
      let subj = `Вопрос с сайта от ${question.name}`
          ,html = mailTemplates.question(question);

      getManagerEmail()
      .then(to => {
        sendMail(to, subj, html);
        res.status(200).json({ success: true });
      })
      .catch(err => {
        writeLog(req, err, 'getManagerEmail');
        res.status(200).json({ success: false });
      });
    }
  });
});

app.post('/api/create-record', (req, res) => {
  _Event.findOne({ '_id': new ObjectId(req.body.id) })
  .then(event => {
    let index = event.records.map(rec => { 
      return rec.tel; }).indexOf(req.body.tel);

    if (index === -1) {
      let data = req.body;

      delete data.id;
      event.records.push(data);
      event.save(err => {
        if (err) {
          writeLog(req, err, 'event.save');
          res.status(200).json({ success: false });
        } else {
          let subj = 'Вы записаны на семинар'
              ,html = mailTemplates.recEvent(event);
          
          sendMail(data.email, subj, html);
          res.status(200).json({ success: true, double: false });
        }
      });
    } else res.status(200).json({ success: false, double: true });
  })
  .catch(err => {
    writeLog(req, err, '_Event.findOne');
    res.status(200).json({ success: false });
  });
});

app.get('/api/get-posts', (req, res) => {
  switch (req.query.type) {
    case 'all':
      Post.countDocuments({})
      .then(total => {
        Post.aggregate([
          { $match: {} },
          { $project: { 'content': 0 } },
          { $sort: { 'cdate': -1 } },
          { $skip: +req.query.offset },
          { $limit: +req.query.amount }
        ])
        .then(posts => {
          res.status(200).json({ success: true, posts, total });
        })
        .catch(err => {
          writeLog(req, err, 'Post.aggregate');
          res.status(200).json({ success: false });
        });
      })
      .catch(err => {
        writeLog(req, err, 'Post.countDocuments');
        res.status(200).json({ success: false });
      });
      break;
    case 'one':
      Post.findOne({ '_id': new ObjectId(req.query.id) })
      .then(post => {
        res.status(200).json({ success: true, post });
      })
      .catch(err => {
        writeLog(req, err, 'Post.findOne');
        res.status(200).json({ success: false });        
      });
  }
});

app.get('/api/get-news', (req, res) => {
  switch (req.query.type) {
    case 'all':
      News.countDocuments({})
      .then(total => {
        News.aggregate([
          { $match: {} },
          { $project: { 'content': 0 } },
          { $sort: { 'cdate': -1 } },
          { $skip: +req.query.offset },
          { $limit: +req.query.amount }
        ])
        .then(news => {
          res.status(200).json({ success: true, news, total });
        })
        .catch(err => {
          writeLog(req, err, 'News.aggregate');
          res.status(200).json({ success: false });
        });
      })
      .catch(err => {
        writeLog(req, err, 'News.countDocuments');
        res.status(200).json({ success: false });
      });
      break;
    case 'one':
      News.findOne({ '_id': new ObjectId(req.query.id) })
      .then(item => {
        res.status(200).json({ success: true, item });
      })
      .catch(err => {
        writeLog(req, err, 'News.findOne');
        res.status(200).json({ success: false });        
      });
  }
});

app.get('/api/get-promos', (req, res) => {
  switch (req.query.type) {
    case 'all':
      Promo.countDocuments({})
      .then(total => {
        Promo.aggregate([
          { $match: {} },
          // { $project: { 'content': 0 } },
          { $sort: { 'cdate': -1 } },
          { $skip: +req.query.offset },
          { $limit: +req.query.amount }
        ])
        .then(promos => {
          res.status(200).json({ success: true, promos, total });
        })
        .catch(err => {
          writeLog(req, err, 'Promo.aggregate');
          res.status(200).json({ success: false });
        });
      })
      .catch(err => {
        writeLog(req, err, 'Promo.countDocuments');
        res.status(200).json({ success: false });
      });
      break;
    case 'one':
      Promo.findOne({ '_id': new ObjectId(req.query.id) })
      .then(promo => {
        res.status(200).json({ success: true, promo });
      })
      .catch(err => {
        writeLog(req, err, 'Promo.findOne');
        res.status(200).json({ success: false });        
      });
  }
});

app.get('/api/get-events', (req, res) => {
  let now = new Date()
    ,prevMonth = moment().subtract(1, 'M').month() + 1
    ,currMonth = moment().month() + 1
    ,nextMonth = moment().add(1, 'M').month() + 1
    ,currMonthName = capitalize(String(moment(now).format('MMMM YYYY')))
    ,prevMonthName = capitalize(String(moment(now.setMonth(prevMonth - 1)).format('MMMM YYYY')))
    ,nextMonthName = capitalize(String(moment(now.setMonth(nextMonth - 1)).format('MMMM YYYY')));

  switch (req.query.type) {
    case 'all':
      _Event.countDocuments({})
      .then(total => {
        _Event.aggregate([
          { $match: {} },
          { $sort: { 'time': -1 } },
          { $skip: +req.query.offset },
          { $limit: +req.query.amount }
        ])
        .then(events => {
          res.status(200).json({ success: true, events, total });
        })
        .catch(err => {
          writeLog(req, err, '_Event.aggregate 1');
          res.status(200).json({ success: false });
        });
      })
      .catch(err => {
        writeLog(req, err, '_Event.countDocuments');
        res.status(200).json({ success: false });
      });
      break;
    case 'by-month':
      _Event.aggregate([
        { $addFields: { "month" : { $month: '$time' } } },
        { $match: { $or: [{ month: prevMonth }, { month: currMonth }, { month: nextMonth }]} },
        { $sort: { 'time': 1 } }
      ])
      .then(events => {
        let currEvents = [], prevEvents = [], nextEvents = [];
        
        events.forEach(evt => {
          if (evt.month == currMonth) currEvents.push(evt);
          else if (evt.month == prevMonth) prevEvents.push(evt);
          else nextEvents.push(evt);
        });
        res.status(200).json({
          success: true,
          prevChunks: splitChunks(prevEvents, 3),
          currChunks: splitChunks(currEvents, 3),
          nextChunks: splitChunks(nextEvents, 3),
          currMonthName, 
          prevMonthName,
          nextMonthName
        });
      })
      .catch(err => {
        writeLog(req, err, '_Event.aggregate 2');
        res.status(200).json({ success: false });
      });
      break;
    case 'one':
      _Event.findOne({ '_id': new ObjectId(req.query.id) })
        .then(event => {
          res.status(200).json({ success: true, event });
        })
        .catch(err => {
          res.status(200).json({ success: false });
        });
        break;
  }
});



// -----------------------------------------------------------
// Routes
// -----------------------------------------------------------
app.get('/', (req, res) => {
  res.render('site/pages/index');
});

app.get('/about', (req, res) => {
  res.render('site/pages/about-us');
});

app.get('/services', (req, res) => {
  res.render('site/pages/services');
});

app.get('/events', (req, res) => {
  res.render('site/pages/events');
});

app.get('/event-page', (req, res) => {
  _Event.findOne({ '_id': new ObjectId(req.query.id) })
  .then(event => {
    event ? res.render('site/pages/event-page', { event }) : res.status(404).render('site/pages/404');
  })
  .catch(err => {
    writeLog(req, err, '_Event.findOne');
    res.status(503).render('site/pages/503');
  });
});

app.get('/blog', (req, res) => {
  Post.find({}, { 'content': 0 })
  .then(posts => {
    res.render('site/pages/blog');
  })
  .catch(err => {
    writeLog(req, err, 'Post.find');
    res.status(503).render('site/pages/503');
  });
});

app.get('/blog/blog-post', (req, res) => {
  Post.findOne({ '_id': new ObjectId(req.query.id) })
  .then(post => {
    Post.aggregate([
      { $match: {} },
      { $project: { 'content': 0 } },
    ])
    .then(posts => {
      let shuffled = shuffleArray(posts)
          ,randomPosts = [];

      for (let i = 0; i < 3; i++) {
        randomPosts.push(shuffled[i]);
      }
      post ? res.render('site/pages/blog-post', { post, randomPosts }) : res.status(404).render('site/pages/404');
    })
    .catch(err => {
      writeLog(req, err, 'Post.aggregate');
      res.status(503).render('site/pages/503');
    });
  })
  .catch(err => {
    writeLog(req, err, 'Post.findOne');
    res.status(503).render('site/pages/503');
  });
});

app.get('/news/news-item', (req, res) => {
  News.findOne({ '_id': new ObjectId(req.query.id) })
  .then(item => {
    if (item) {
      item.set('views', Number(item.views) + 1);
      item.save();
      res.render('site/pages/news-item', { item });
    } else res.status(404).render('site/pages/404');
  })
  .catch(err => {
    writeLog(req, err, 'News.findOne');
    res.status(503).render('site/pages/503');
  });
});

app.get('/promo', (req, res) => {
  Promo.find({}, {}, { sort: { "cdate": -1 } })
  .then(promos => {
    res.render('site/pages/promo', { promos });
  })
  .catch(err => {
    writeLog(req, err, 'Promo.find');
    res.status(503).render('site/pages/503');
  });
});

app.get('/career', (req, res) => {
  res.render('site/pages/careers');
});

app.get('/contacts', (req, res) => {
  res.render('site/pages/contact-us');
});

app.get('/lk', (req, res) => {
  res.render('site/pages/coming-soon');
});

app.get('/news', (req, res) => {
  News.find({}, { 'content': 0 })
    .then(news => {
      res.render('site/pages/news');
    })
    .catch(err => {
      writeLog(req, err, 'News.find');
      res.status(503).render('site/pages/503');
    });
});

app.get('/docs', (req, res) => {
  Docs.find({})
  .then(docs => {
    res.render('site/pages/docs', { docs });
  })
  .catch(err => {
    res.status(503).render('site/pages/503');
  });
});



// -----------------------------------------------------------
// Admin API
// -----------------------------------------------------------
app.use('/wtf/', apiAdmin);
apiAdmin.use(tokenProtect);

apiAdmin.get('/api/get-logs', (req, res) => {
  Log.aggregate([
    { $match: {} },
    { $sort: { 'cdate': -1 } },
    { $skip: +req.query.offset },
    { $limit: +req.query.amount }
  ])
  .then(logs => {
    res.status(200).json({ success: true, logs });
  })
  .catch(err => {
    writeLog(req, err, 'Log.aggregate');
    res.status(503).render('admin/503');
  });
});

apiAdmin.get('/api/get-settings', (req, res) => {
  Setting.findOne({ '_id': new ObjectId('5bfd5d245944b4ff66114a4b') })
  .then(settings => {
    switch (req.query.type) {
      case 'global':
        res.status(200).json({ success: true, global: settings.global });
        break;
      default:
        res.status(200).json({ success: true, settings });
        break;
    }
  })
  .catch(err => {
    writeLog(req, err, 'Setting.findOne');
    res.status(503).render('admin/503');
  });
});

apiAdmin.post('/api/set-settings', (req, res) => {
  Setting.findOne({ '_id': new ObjectId('5bfd5d245944b4ff66114a4b') })
  .then(settings => {
    if (req.body.hasOwnProperty('global')) {
      settings.set('global', req.body.global);
      settings.save();
    }
    res.status(200).json({ success: true });
  })
  .catch(err => {
    writeLog(req, err, 'Settings.findOne');
    res.status(503).render('admin/503');
  });
});

apiAdmin.post('/api/create-event', (req, res) => {
  let event = new _Event(req.body);

  event.save(err => {
    if (err) {
      writeLog(req, err, 'event.save');
      res.status(503).render('admin/503');
    } else res.status(200).json({ success: true });
  });
});

apiAdmin.post('/api/modify-event', (req, res) => {
  _Event.findOne({ '_id': new ObjectId(req.body.eid) })
    .then(event => {
      event.set('title', req.body.title);
      event.set('time', req.body.time);
      event.set('price', req.body.price);
      event.set('free', req.body.free);
      event.set('content', req.body.content);
      event.save(err => {
        if (err) {
          writeLog(req, err, 'event.save');
          res.status(503).render('admin/503');
        } else res.status(200).json({ success: true });
      });
    })
    .catch(err => {
      writeLog(req, err, '_Event.findOne');
      res.status(503).render('admin/503');
    });
});

apiAdmin.post('/api/delete-event', (req, res) => {
  _Event.findOne({ '_id': new ObjectId(req.body.eid) }).remove().exec();
  res.status(200).json({ success: true });
});

apiAdmin.post('/api/create-post', (req, res) => {
  let post = new Post(req.body);

  post.save(err => {
    if (err) {
      writeLog(req, err, 'post.save');
      res.status(503).render('admin/503');
    } else res.status(200).json({ success: true });
  });
});

apiAdmin.post('/api/create-news', (req, res) => {
  let item = new News(req.body);

  item.save(err => {
    if (err) {
      writeLog(req, err, 'item.save');
      res.status(503).render('admin/503');
    } else res.status(200).json({ success: true });
  });
});

apiAdmin.post('/api/create-promo', (req, res) => {
  let promo = new Promo(req.body);

  promo.save(err => {
    if (err) {
      writeLog(req, err, 'promo.save');
      res.status(503).render('admin/503');
    } else res.status(200).json({ success: true });
  });
});

apiAdmin.post('/api/modify-post', (req, res) => {
  Post.findOne({ '_id': new ObjectId(req.body.pid) })
    .then(post => {
      post.set('title', req.body.title);
      post.set('content', req.body.content);
      post.set('description', req.body.description);
      post.set('image', req.body.image);
      post.save(err => {
        if (err) {
          writeLog(req, err, 'post.save');
          res.status(503).render('admin/503');
        } else res.status(200).json({ success: true });
      });
    })
    .catch(err => {
      writeLog(req, err, '_Post.findOne');
      res.status(503).render('admin/503');
    });
});

apiAdmin.post('/api/modify-news', (req, res) => {
  News.findOne({ '_id': new ObjectId(req.body.nid) })
    .then(item => {
      item.set('title', req.body.title);
      item.set('content', req.body.content);
      item.set('description', req.body.description);
      item.set('image', req.body.image);
      item.save(err => {
        if (err) {
          writeLog(req, err, 'item.save');
          res.status(503).render('admin/503');
        } else res.status(200).json({ success: true });
      });
    })
    .catch(err => {
      writeLog(req, err, 'News.findOne');
      res.status(503).render('admin/503');
    });
});

apiAdmin.post('/api/modify-promo', (req, res) => {
  Promo.findOne({ '_id': new ObjectId(req.body.pid) })
    .then(promo => {
      promo.set('title', req.body.title);
      promo.set('toDate', req.body.toDate);
      promo.set('conditions', req.body.conditions);
      promo.set('description', req.body.description);
      promo.set('image', req.body.image);
      promo.save(err => {
        if (err) {
          writeLog(req, err, 'promo.save');
          res.status(503).render('admin/503');
        } else res.status(200).json({ success: true });
      });
    })
    .catch(err => {
      writeLog(req, err, 'Promo.findOne');
      res.status(503).render('admin/503');
    });
});

apiAdmin.post('/api/delete-post', (req, res) => {
  Post.findOne({ '_id': new ObjectId(req.body.pid) }).remove().exec();
  res.status(200).json({ success: true });
});

apiAdmin.post('/api/delete-news', (req, res) => {
  News.findOne({ '_id': new ObjectId(req.body.nid) }).remove().exec();
  res.status(200).json({ success: true });
});

apiAdmin.post('/api/delete-promo', (req, res) => {
  Promo.findOne({ '_id': new ObjectId(req.body.pid) }).remove().exec();
  res.status(200).json({ success: true });
});

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/public/upload');
  },
  filename: (req, file, cb) => {
    cb(null, Math.random().toString(36).substring(7) + Date.now() + path.extname(file.originalname)); // Appending extension
  }
});
let upload = multer({ storage });

apiAdmin.post('/api/upload', upload.array('files[]', 10), (req, res) => {
  req.files.forEach(file => {
    file.path = file.path.substring(11);
  });
  res.status(200).json({ success: true, files: req.files });
});

apiAdmin.post('/api/toggle-event-records', (req, res) => {
  _Event.findOne({ '_id': new ObjectId(req.body.eid) })
  .then(evt => {
    evt.isActive = req.body.isActive;
    evt.save();
    res.status(200).json({ success: true });
  })
  .catch(err => {
    writeLog(req, err, '_Event.findOne');
    res.status(503).render('admin/503');
  });
});

// -----------------------------------------------------------
// Admin Routes
// -----------------------------------------------------------
apiAdmin.get('/', (req, res) => {
  res.render('admin/settings-pages/global-settings');
});

apiAdmin.get('/blog', (req, res) => {
  res.render('admin/blog');
});

apiAdmin.get('/news', (req, res) => {
  res.render('admin/news');
});

apiAdmin.get('/blog/add-post', (req, res) => {
  res.render('admin/add-post');
});

apiAdmin.get('/news/add-news', (req, res) => {
  res.render('admin/add-news');
});

apiAdmin.get('/events', (req, res) => {
  res.render('admin/events');
});

apiAdmin.get('/promo', (req, res) => {
  res.render('admin/promo');
});

apiAdmin.get('/promo/add-promo', (req, res) => {
  res.render('admin/add-promo');
});

apiAdmin.get('/events/add-event', (req, res) => {
  res.render('admin/add-event');
});

apiAdmin.get('/events/edit-event', (req, res) => {
  _Event.findOne({ '_id': new ObjectId(req.query.id) })
  .then(evt => {
    evt ? res.render('admin/edit-event', { evt }) : res.status(404).render('admin/404');
  })
  .catch(err => {
    writeLog(req, err, '_Event.findOne');
    res.status(503).render('admin/503');
  });
});

apiAdmin.get('/blog/edit-post', (req, res) => {
  Post.findOne({ '_id': new ObjectId(req.query.id) })
  .then(post => {
    post ? res.render('admin/edit-post', { post }) : res.status(404).render('admin/404');
  })
  .catch(err => {
    writeLog(req, err, 'Post.findOne');
    res.status(503).render('admin/503');
  });
});

apiAdmin.get('/news/edit-news', (req, res) => {
  News.findOne({ '_id': new ObjectId(req.query.id) })
  .then(item => {
    item ? res.render('admin/edit-news', { item }) : res.status(404).render('admin/404');
  })
  .catch(err => {
    writeLog(req, err, 'News.findOne');
    res.status(503).render('admin/503');
  });
});

apiAdmin.get('/promo/edit-promo', (req, res) => {
  Promo.findOne({ '_id': new ObjectId(req.query.id) })
  .then(promo => {
    promo ? res.render('admin/edit-promo', { promo }) : res.status(404).render('admin/404');
  })
  .catch(err => {
    writeLog(req, err, 'Promo.findOne');
    res.status(503).render('admin/503');
  });
});

apiAdmin.get('/settings/global', tokenProtect, (req, res) => {
  res.render('admin/settings-pages/global-settings');
});

apiAdmin.get('/logs', tokenProtect, (req, res) => {
  res.render('admin/logs');
});

// -----------------------------------------------------------
// Other routes
// -----------------------------------------------------------
app.use("/wtf/*", (req,res) => {
  res.status(404).render('admin/404');
});
app.use("*", (req,res) => {
  res.status(404).render('site/pages/404');
});
// -----------------------------------------------------------
// Start server
// -----------------------------------------------------------
server.listen(port, () => {
  console.log('Listening on port ' + port);
});