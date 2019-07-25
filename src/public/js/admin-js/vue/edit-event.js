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
      // e.editor.setContent(this.content);
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
    eid: '',
    title: '',
    date: '',
    time: '16:00',
    free: true,
    price: 0,
    content: '',
    isActive: false,
    showEdit: false,
    loading: false
  },
  methods: {
    log (evt) {
      console.dir(this.$refs.toggleIsActive.checked);
      // $("#date").datepicker("update", '12/12/2018');
      // $('#time').timepicker('setTime', '12:45');
      // tinymce.activeEditor.setContent('<p>yeah!</p>');
    },
    deleteEvent () {
      swal({
        title: "Точно?",
        text: "Удалишь и не восстановить, такие правила :)",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Да да, удали!",
        cancelButtonText: "Опа, не надо!",
        closeOnConfirm: false,
        closeOnCancel: true
      }, (isConfirm) => {
        if (isConfirm) {
          axios.post('/wtf/api/delete-event', { eid: this.eid })
            .then(res => {
              swal({
                title: "Удалено!", 
                text: "Семинар удален, не будем скучать по нему :)", 
                type: "success"
              }, (confirm) => {
                window.location.href = '/wtf/events';
              });
            })
            .catch(err => {
              swal("Ошибка", err.toString(), "error");
            });
        }
      });
    },
    toggleIsActive () {
      axios.post('/wtf/api/toggle-event-records', { 
        isActive: this.$refs.toggleIsActive.checked,
        eid: this.eid
      })
        .then(res => {

        })
        .catch(err => {
          showSnack('danger', err.toString());
        });
    },
    modifyEvent () {
      let d = this.date.split('/')
        ,t = this.time.split(':')
        ,date = new Date(d[2], d[1] - 1, d[0], t[0], t[1]);

      let payload = {
        eid: this.eid,
        title: this.title,
        time: date,
        content: this.content,
        price: this.price === 0 ? undefined : this.price,
        free: this.free
      };
      
      this.loading = true;
      axios.post('/wtf/api/modify-event', payload)
        .then(res => {
          showSnack('success', 'Изменения успешно сохранены!');
          this.showEdit = false;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          showSnack('danger', err.toString());
        });
    },
    initEvent () {
      let id = getQueryVar('id');
      this.eid = id;
      axios.get(`/api/get-events?type=one&id=${id}`)
        .then(res => {
          let event = res.data.event
            ,date = new Date(event.time)
            ,y = date.getFullYear()
            ,m = date.getMonth() + 1
            ,d = date.getDate()
            ,h = date.getHours()
            ,min = date.getMinutes();

          this.$refs.toggleIsActive.checked = event.isActive;
          this.title = event.title;
          this.free = event.free;
          this.price = event.price ? event.price : 0;
          this.date = `${d}/${m}/${y}`;
          this.time = `${h}:${min}`;
          $("#date").datepicker("update", `${d}/${m}/${y}`);
          $('#time').timepicker('setTime', `${h}:${min}`);
          this.content = event.content;
        })
        .catch(err => {
          showSnack('danger', err.toString());
        });
    }
  },
  mounted () {
    $(document).ready(() => {
      this.initEvent();
      let _this = this;
      $('#date').datepicker({
        format: "dd/mm/yyyy",
        autoclose: true,
        todayHighlight: true
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
    });
  }
});