Vue.component("resume", {
  data () {
    return {
      resumeFile: {}
    };
  },
  methods: {
    clickInput () {
      this.$refs.fileInput.click();
    },
    processFile (event) {
      let reader = new FileReader();
      let file = event.target.files[0];

      reader.readAsDataURL(file);
      reader.onload = function (e) {
        this.resumeFile = file;
        this.$emit('attached', { file });
      }.bind(this);
    }
  },
  template: `
  <div>
    <form id="fileInput">
      <input ref="fileInput" type="file" @change="processFile" accept=".pdf,.doc,.docx" hidden />
    </form>
    <div v-if="!resumeFile.name">
      <i class="fa fa-paperclip"></i> <span @click="clickInput" style="cursor: pointer;">Прикрепить резюме</span>
    </div>
    <div v-else>
      <p><span class="icon fas fa-file"></span>&nbsp;{{ resumeFile.name }}</p>
    </div>
  </div>
  `
});
const app = new Vue({
  el: "#app",
  data () {
    return {
      resumeFile: {},
      name: '',
      tel: '',
      uploadProgress: 0
    };
  },
  methods: {
    attach (payload) {
      this.resumeFile = payload.file;
    },
    sendResume () {
      let redata = { 'g-recaptcha-response': grecaptcha.getResponse($("#recaptcha-resume").attr('data-widget-id')) };
      
      if (this.name && this.tel.length === 17 && this.resumeFile.name && grecaptcha.getResponse($("#recaptcha-resume").attr('data-widget-id'))) {
        axios.post('/api/check-recaptcha', redata)
          .then(res => {
            let resumeData = new FormData();
      
            resumeData.append('name', this.name);
            resumeData.append('tel', this.tel);
            resumeData.append('files[]', this.resumeFile);
      
            axios.post('/api/send-resume', resumeData, {
              onUploadProgress: e => { this.uploadProgress = Math.floor((e.loaded * 100) / e.total);}
            })
              .then(res => {
                $.magnificPopup.close();
                showSnack('success', 'Резюме успешно отправлено');
              })
              .catch(err => {
                showSnack('error', 'Что-то пошло не так');
              });
          })
          .catch(err => {
            showSnack('error', 'Проверка не пройдена');
          });
      } else showSnack('error', 'Все поля обязательны');
    }
  }
});