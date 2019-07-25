Vue.component("event", {
  props: ['event'],
  data: {
    now: new Date()
  },
  template: `
    <a :href="'event-page?id=' + event._id">
      <article class="box-minimal" style="height: 300px;">
        <h3 class="box-minimal-title">{{ event.time | time }}</h3>
        <div class="box-minimal-divider"></div>
        <h4>{{ event.title }}</h4>
        <br>
        <div v-if="new Date(event.time) < new Date()">
          <p style="color: red;">Семинар прошел</p>
        </div>
        <div v-else-if="!event.free">
          <p style="color: #FDDD51;">Стоимость: {{ event.price }} ₽</p>
          <div class="event-more-link">
            <a class="open-event-modal" href="#open-event-modal">Подробнее...</a>
          </div>
        </div>
        <div v-else>
          <p style="color: green;" v-if="event.isActive">Вход свободный</p>
          <p style="color: red;" v-else>Запись закрыта</p>
          <div class="event-more-link">
            <span>Подробнее...</span>
          </div>
        </div>
      </article>
    </a>
  `
});

Vue.filter('time', function (value) {
  return moment(value).locale('ru').format('LLL');
});

const app = new Vue({
  el: "#app",
  data: {
    loading: false,
    prevChunks: [],
    currChunks: [],
    nextChunks: [],
    prevMonthName: '',
    currMonthName: '', 
    nextMonthName: '', 
    event: {},
    name: '',
    tel: ''
  },
  methods: {
    log () {

    },
    changeModalData (evt) {
      this.event = evt;
    },
    getEvents () {
      NProgress.start();
      axios.get(`/api/get-events?type=by-month`)
        .then(res => {
          this.prevChunks = res.data.prevChunks;
          this.currChunks = res.data.currChunks;
          this.nextChunks = res.data.nextChunks;
          this.prevMonthName = res.data.prevMonthName;
          this.currMonthName = res.data.currMonthName;
          this.nextMonthName = res.data.nextMonthName;
          NProgress.done();
        })
        .catch(err => {
          showSnack('error', 'Не удалось загрузить список семинаров :(');
          NProgress.done();
        });
    },
    record (evt) {
      let record = {
        eid: evt._id,
        name: this.name,
        tel: this.tel
      };
      
      if (this.name && this.tel.length === 17) {
        axios.post('/api/create-event-record', { record })
          .then(res => {
            showSnack('success', 'Спасибо! Запись прошла успешно.');
          })
          .catch(err => {
            showSnack('error', 'Что-то пошло не так :(');
          });
      } else showSnack('error', 'Все поля обязательны');
    }
  },
  mounted () {
    this.getEvents();
  }
});