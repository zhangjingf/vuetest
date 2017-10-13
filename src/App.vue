<template>
  <div id="app">
    <my-header :path="this.path"/>
    <div class="pbd">
      <router-view></router-view>
    </div>
    <footer>
      <div><router-link :to="{ path: 'film' }" replace>电影</router-link></div>
      <div><router-link to="/find" replace>发现</router-link></div>
      <div><router-link to="/mall" replace>商城</router-link></div>
      <div><router-link to="/menu" replace>我的</router-link></div>
    </footer>
  </div>
</template>

<script type="text/ecmascript-6">
  import myHeader from '@/components/header'
  import URL from './lib/util/URL';
  import BScroll from 'better-scroll'
  export default {
    name: 'app',
    data() {
      return {
        path: null,
        name: null,
        scroll: null,
        options: {
          click: true,
          bounce: true
        }
      }
    },
    components: { myHeader },
    watch: {
      '$route' (to, from) {
        this.path = to.path;
      }
    },
    methods: {
      
    },
    computed: {

    },
    mounted () {
      const vm = this;
      vm.path= URL.parse(window.location.href).hash;
      vm.scorll = new BScroll('.pbd', vm.options);
    },
    created () {
      this.$router.push({path: '/film'});
    }
  }
</script>

<style lang="scss">
@import './common/style/icon.css';
@import '../static/css/animate.min.css';
@import '../static/css/swiper.css';
html,body {
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
