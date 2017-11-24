<template>
  <transition name="fade">
    <div class="m-film" ref="film">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide"><img src="../../static/images/banner.jpg" alt=""></div>
          <div class="swiper-slide"><img src="../../static/images/banner.jpg" alt=""></div>
          <div class="swiper-slide"><img src="../../static/images/banner.jpg" alt=""></div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <div class="hot-film">
        <div v-for="item in movie">
          <div class="img"><img :src="item.imgUrl" alt=""></div>
          <div class="filmInfo">
            <div class="title">{{item.title}}
              <span>{{item.type}}</span>
            </div>
            <div class="tip">{{item.tip}}</div>
            <div class="actor">{{item.actor}}</div>
          </div>
          <div class="wantsee">
            <div>{{item.wantsee}}想看</div>
            <div>预售</div>
          </div>
        </div>
      </div>
      <scroll :node="node" :loading="loading" @pullDownLoad="pullDownLoad" @pullUpLoad="pullUpLoad"/>
    </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import scroll from '@/common/plugin/scroll';
  import Swiper from '../../static/js/swiper.min.js';
const ERR_OK = 0
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      movie: [],
      loading: false,
      node: null,
    }
  },
  components: {scroll},
  mounted() {
    let mySwiper = new Swiper('.swiper-container', {
      loop: true,
      autoplay: 5000,
      pagination: '.swiper-pagination',
      paginationClickable: true
    })

    mySwiper.startAutoplay();
    this.node = this.$refs.film;
    this.$nextTick(function() {
      this.$store.commit('increment', {count: 10});
      this.$store.dispatch('incrementAsync', {count: 10})

    })
  },
  created() {
    this.$http.get('/api/movie').then((response) => {
      response = response.body
      if (response.errno === ERR_OK) {
        this.movie = response.data
      }
    })
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      //console.log(vm);
    })
  },
  methods: {
    pullDownLoad() {

    },
    pullUpLoad() {

    }
  }
}
</script>

<style scoped>
.hot-film {
  padding-left: 1rem;
  overflow: auto;
}

.hot-film>div {
  padding: 1.5rem 1rem 1rem 0;
  display: flex;
  border-top: 1px solid #f5f5f5;
}

.hot-film .img {
  width: 6rem;
  height: 8rem;
  border-radius: .5rem;
  overflow: hidden;
}

.filmInfo {
  flex: 1;
  padding-left: 1rem;
}

.title {
  font-size: 1.3rem;
  color: #141413;
}

.tip {
  height: 3rem;
  max-width: 17rem;
  word-break: break-all;
  font-size: 1.1rem;
  line-height: 1.7rem;
  color: #797979;
  overflow: hidden;
}

.actor {
  font-size: 1rem;
  color: #b9b9b9;
}

.wantsee {
  position: relative;
}

.wantsee>div:nth-child(1) {
  font-size: 1.2rem;
  color: #ff9600;
}

.wantsee>div:nth-child(2) {
  position: absolute !important;
  right: 0;
  bottom: 0;
  text-align: center;
  font-size: 1.4rem;
  width: 4.9rem;
  line-height: 2.7rem;
  border: solid 1px #ff9600;
  border-radius: .5rem;
  color: #ff9600;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>
