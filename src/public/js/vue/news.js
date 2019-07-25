Vue.component("item", { 
  props: ['item'],
  template: `
    <article class="product-classic product-classic-horizontal">
      <div class="product-classic-inner">
        <div class="product-classic-left">
          <div class="product-classic-media">
            <div class="owl-carousel" data-items="1" data-nav="false" data-stage-padding="0" data-loop="false" data-margin="0" data-mouse-drag="false">
              <img :src="'/' + item.image.path" alt="" />
            </div>
          </div>
        </div>
        <div class="product-classic-right">
          <h4 class="product-classic-title">
            <a :href="'/news/news-item?id=' + item._id">{{ item.title }}</a>
          </h4>
          <div class="product-classic-divider"></div>
          <div class="product-classic-text">
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
      <div class="product-classic-footer">
        <div class="row">
          <div class="col-sm-6">
            <ul class="product-classic-list">
              <li>
                <i class="fa fa-calendar"></i> &nbsp;&nbsp;{{ item.cdate | time }}
              </li>
            </ul>
          </div>
          <div class="col-sm-6">
            <ul class="product-classic-list">
              <li>
                <i class="fa fa-eye"></i> &nbsp;&nbsp;{{ item.views }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  `
});

Vue.filter('time', function (value) {
  return moment(value).locale('ru').format('LLL');
});

const app = new Vue({
  el: "#app",
  data: {
    loading: false,
    news: []
  },
  methods: {
    getNews () {
      let spiner = this.$refs.loadMoreBtn.firstChild;
      
      NProgress.start();
      spiner.classList.toggle('loading');
      axios.get(`/api/get-news?type=all&offset=${this.news.length}&amount=5`)
        .then(res => {
          let startTotal = this.news.length;
          let endTotal = null;

          res.data.news.forEach(item => {
            this.news.push(item);
          });
          spiner.classList.toggle('loading');
          NProgress.done();

          endTotal = this.news.length;
          if (endTotal === startTotal) {
            this.$refs.loadMoreBtn.hidden = true;
            showSnack('success', 'Больше новостей нет');
          }
        })
        .catch(err => {
          showSnack('error', 'Не удалось загрузить новости :(');
          NProgress.done();
        });
    }
  },
  mounted () {
    this.getNews();
  }
});