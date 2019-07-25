Vue.component("post", { 
  props: ['post'],
  template: `
    <article class="post-default">
      <a :href='"/blog/blog-post?id=" + post._id' class="post-default-image" target="_blank">
        <img :src='"/" + post.image.path' alt="" />
      </a>
      <div class="post-default-body">
        <div class="post-default-title">
          <h4><a :href='"/blog/blog-post?id=" + post._id' target="_blank">{{ post.title }}</a></h4>
        </div>
        <div class="post-default-divider"></div>
        <div class="post-default-text">
          <p>{{ post.description }}</p>
        </div>
        <div class="post-default-time">
          <span class="icon mdi mdi-clock"></span>
          <span>{{ post.cdate | time }}</span>
        </div>
      </div>
    </article>
  `
});

Vue.filter('time', function (value) {
  return moment(value).locale('ru').format('LL');
});

const app = new Vue({
  el: "#app",
  data: {
    loading: false,
    posts: []
  },
  methods: {
    getPosts () {
      let spiner = this.$refs.loadMoreBtn.firstChild;
      
      NProgress.start();
      spiner.classList.toggle('loading');
      axios.get(`/api/get-posts?type=all&offset=${this.posts.length}&amount=6`)
        .then(res => {
          let startTotal = this.posts.length;
          let endTotal = null;

          res.data.posts.forEach(post => {
            this.posts.push(post);
          });
          spiner.classList.toggle('loading');
          NProgress.done();

          endTotal = this.posts.length;
          if (endTotal === startTotal) {
            this.$refs.loadMoreBtn.hidden = true;
            showSnack('success', 'Больше статей нет');
          }
        })
        .catch(err => {
          showSnack('error', 'Не удалось загрузить статьи :(');
          NProgress.done();
        });
    }
  },
  mounted () {
    this.getPosts();
  }
});