Vue.filter('time', function (value) {
  return moment(value).locale('ru').format('LLL');
});

const app = new Vue({
  el: "#app",
  data: {
    promos: []
  },
  methods: {
    getPromo () {
      NProgress.start();
      axios.get(`/api/get-promo`)
        .then(res => {
          NProgress.done();
        })
        .catch(err => {
          showSnack('error', 'Не удалось загрузить список акций :(');
          NProgress.done();
        });
    }
  },
  mounted () {
    this.getPromo();
  }
});