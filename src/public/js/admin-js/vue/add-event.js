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
            && this.date
            && this.time
            && this.content;
    }
  },
  data: {
    tinymceOptions: tinymceOptions,
    title: '',
    date: '',
    time: '16:00',
    free: true,
    price: 0,
    content: '',
    loading: false
  },
  methods: {
    saveEvent () {
      let d = this.date.split('/')
        ,t = this.time.split(':')
        ,date = new Date(d[2], d[1] - 1, d[0], t[0], t[1]);

      let payload = {
        title: this.title,
        time: date,
        content: this.content,
        price: this.price === 0 ? undefined : this.price,
        free: this.free,
        records: []
      };
      
      this.loading = true;
      axios.post('/wtf/api/create-event', payload)
        .then(res => {
          window.location.href = '/wtf/events';
        })
        .catch(err => {
          this.loading = false;
          showSnack('danger', err.toString());
        });
    },
    init () {
      let _this = this;
      $('#date').datepicker({
        format: "dd/mm/yyyy",
        autoclose: true,
        todayHighlight: true,
        language: 'ru'
      });
      $('#date').datepicker().on('hide', function(e) {
        _this.date = $(this).val();
      });
      $('#time').timepicker({
        explicitMode: true,
        showMeridian: false,
        defaultTime: '16:00',
        icons: {
          up: 'fa fa-angle-up',
          down: 'fa fa-angle-down'
        }
      });
      $('#time').timepicker().on('changeTime.timepicker', function(e) {
        _this.time = e.time.value;
      });
    }
  },
  mounted () {
    $(document).ready(this.init);
  }
});