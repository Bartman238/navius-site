let tinymceOptions = {
  selector: "textarea",
  height: 420,
  menubar: false,
  plugins: ["autolink lists link charmap print preview hr", "searchreplace wordcount visualblocks visualchars code", "nonbreaking save table directionality", "emoticons paste textpattern codesample toc"],
  toolbar1: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link code",
  toolbar2: "print preview | forecolor backcolor emoticons",
  valid_elements: "*[*]",
  content_css: "//www.tinymce.com/css/codepen.min.css",
  branding: false,
  language: 'ru',
  // images_upload_url: "postAcceptor.php",
  // images_upload_base_path: "/some/basepath",
  // images_upload_credentials: !0,
  // images_upload_handler: function (e, t, n) {
  //   var o, i;
  //   (o = new XMLHttpRequest).withCredentials = !1, o.open("POST", "postAcceptor.php"), o.onload = function () {
  //     var e;
  //     200 == o.status ? (e = JSON.parse(o.responseText)) && "string" == typeof e.location ? t(e.location) : n("Invalid JSON: " + o.responseText) : n("HTTP Error: " + o.status);
  //   }, (i = new FormData).append("file", e.blob(), fileName(e)), o.send(i);
  // },
  // image_title: !0,
  // automatic_uploads: !0,
  // file_picker_types: "image",
  // file_picker_callback: function (e, t, n) {
  //   var o = document.createElement("input");
  //   o.setAttribute("type", "file"), o.setAttribute("accept", "image/*"), o.onchange = function () {
  //     var t = this.files[0],
  //       n = "blobid" + (new Date).getTime(),
  //       o = tinymce.activeEditor.editorUpload.blobCache,
  //       i = o.create(n, t);
  //     o.add(i), e(i.blobUri(), {
  //       title: t.name
  //     });
  //   }, o.click();
  // }
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
        && this.conditions;
    }
  },
  data: {
    tinymceOptions,
    title: '',
    description: '',
    conditions: '',
    image: {},
    b64: '',
    showProgress: false,
    uploadProgress: 0,
    loading: false
  },
  methods: {
    savePromo () {
      let tempImg = {
        path: 'images/centr-sdelok/main-top1.jpg'
      };
      let payload = {
        cdate: new Date(),
        title: this.title,
        description: this.description,
        conditions: this.conditions,
        image: this.image.path ? this.image : tempImg
      };
      
      this.loading = true;
      axios.post('/wtf/api/create-promo', payload)
        .then(res => {
          window.location.href = '/wtf/promo';
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