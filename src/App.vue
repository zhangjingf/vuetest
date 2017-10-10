<template>
  <div id="app">
    <my-header/>
    <div class="pbd">
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
    },
    created () {

    },
    ready () {

    }
  }
</script>

<style lang="scss">
@import './common/style/icon.css';
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
