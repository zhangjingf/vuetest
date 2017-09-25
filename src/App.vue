<template>
  <div id="app">
    <myHeader></myHeader>
    <div class="pbd">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide"><img src="../static/images/banner.jpg" alt=""></div>
          <div class="swiper-slide"><img src="../static/images/banner.jpg" alt=""></div>
          <div class="swiper-slide"><img src="../static/images/banner.jpg" alt=""></div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <router-view></router-view>
    </div>
    <footer>
      <div><router-link :to="{ path: 'film' }">电影</router-link></div>
      <div><router-link to="/find">发现</router-link></div>
      <div><router-link to="/mall">商城</router-link></div>
      <div><router-link to="/menu">我的</router-link></div>
    </footer>
  </div>
</template>

<script type="text/ecmascript-6">
  import myHeader from '@/views/header'
  import Swiper from '../static/js/swiper.min.js'
  export default {
    name: 'app',
    components: { myHeader },
    watch: {
      '$route' (to, from) {
        document.querySelector('.title').innerHTML = to.name
      }
    },
    methods: {
      buttonClick () {
        console.log(this)
      }
    },
    computed: {

    },
    mounted () {
      let mySwiper = new Swiper('.swiper-container', {
        loop: true,
        autoplay: 5000,
        pagination: '.swiper-pagination',
        paginationClickable: true
      })
      mySwiper.startAutoplay()
    },
    created () {

    },
    ready () {

    }
  }
</script>

<style>
@import '../static/css/animate.min.css';
@import '../static/css/swiper.css';
html {
  height: 100%;
}
body {
  height: 100%;
}
img {
  width: 100%;
}
#app {
 height: 100%;
  display: flex;
  flex-direction: column;
}
.pbd {
  height: 100%;
  overflow: auto;
}
.swiper-pagination-bullet {
  margin: 0 1rem;
  width: .8rem;
  height: .8rem;
  display: inline-block;
  border-radius: 50%;
  background: #cdcdcd;
}
.swiper-pagination-bullet-active {
  background: #fff;
}
footer {
  display: flex;
  height: 4rem;
  background-color: #ffffff;
}
footer>div {
  flex: 1;
  font-size: 1rem;
  line-height: 4rem;
  text-align: center;

}
</style>
