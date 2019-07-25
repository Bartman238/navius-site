let tinymceOptions = {
  selector: "textarea",
  height: 420,
  menubar: false,
  plugins: ["autolink lists link image charmap print preview hr", "searchreplace wordcount visualblocks visualchars code", "nonbreaking save table directionality", "emoticons paste textpattern codesample toc"],
  toolbar1: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link code",
  toolbar2: "print preview | forecolor backcolor emoticons | image",
  valid_elements: "*[*]",
  content_css: "//www.tinymce.com/css/codepen.min.css",
  branding: false,
  language: 'ru',
  file_picker_types: "image",
  file_picker_callback: function(callback, value, meta) {
    if (meta.filetype == 'image') {
      $('#upload').trigger('click');
      $('#upload').on('change', function() {
        var file = this.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
          callback(e.target.result, {
            alt: ''
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }
};

Vue.component("vue-tinymce", {
  template: "<textarea>{{value}}</textarea>",
  props: ["value", "options"],
  mounted: function () {
    var e = this,
      t = $.extend(!0, {}, tinymceOptions);
    t.selector = void 0, t.target = e.$el;
    var n = t.setup || function () {};
    t.setup = function (t) {
      n(t), t.on("keyup change", function (n) {
        var o = t.getContent();
        e.$emit("input", o);
      }), t.on("blur", function () {
        e.allowSetContent = !0;
      }), t.on("focus", function () {
        e.allowSetContent = !1;
      });
    }, tinymce.init(t).then(function (t) {
      e.editor = t[0];
    });
  },
  watch: {
    value: function (e) {
      this.editor && this.allowSetContent && this.editor.setContent(e);
    }
  }
});
// function htmlEntities(str) {
//   return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// }
// function sanitizeHTML(object) {
//   object.value.replace("<embed>.*?</embed>", "");
// }
let app = new Vue({
  el: "#app",
  computed: {
    isAllValid () {
      return this.title
            && this.description
            && this.content;
    }
  },
  data: {
    tinymceOptions: tinymceOptions,
    title: '',
    description: '',
    content: '',
    image: {},
    b64: '',
    showProgress: false,
    uploadProgress: 0,
    loading: false
  },
  methods: {
    saveNews () {
      let tempImg = {
        path: 'images/centr-sdelok/main-top1.jpg'
      };
      let payload = {
        cdate: new Date(),
        title: this.title,
        description: this.description,
        content: this.content,
        image: this.image.path ? this.image : tempImg,
        views: 0
      };
      
      this.loading = true;
      axios.post('/wtf/api/create-news', payload)
        .then(res => {
          window.location.href = '/wtf/news';
        })
        .catch(err => {
          this.loading = false;
          showSnack('danger', err.toString());
        });
    },
    processImage (event) {
      let reader = new FileReader();
      let file = event.target.files[0];

      reader.readAsDataURL(file);
      reader.onload = function (e) {
        let image = new FormData();

        image.append('files[]', file);
        this.showProgress = true;
        axios.post('/wtf/api/upload', image, {
          onUploadProgress: e => this.uploadProgress = Math.floor((e.loaded * 100) / e.total)
        })
          .then(res => {
            this.image = res.data.files[0];
            this.b64 = e.target.result;
            this.showProgress = false;
            this.uploadProgress = 0;
          })
          .catch(err => {
            showSnack('danger', err.toString());
          });
      }.bind(this);
    }
  }
});