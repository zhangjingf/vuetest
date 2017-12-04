<template>
  <div id="app">
    <my-header :path="this.path"/>
    <div class="pbd">
      <router-view></router-view>
    </div>
    <footer>
      <div><router-link :to="{ path: 'film' }" replace>page1</router-link></div>
      <div><router-link to="/find" replace>page2</router-link></div>
      <div><router-link to="/mall" replace>page3</router-link></div>
      <div><router-link to="/menu" replace>page4</router-link></div>
    </footer>
  </div>
</template>

<script type="text/ecmascript-6">
  import myHeader from '@/components/header';
  import URL from './lib/util/URL';

  export default {
    name: 'app',
    data() {
      return {
        path: null,
        name: null,
        index: 0
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
      value: function() {
        return this.index++;
      }
    },
    mounted () {
      const vm = this;
      vm.path= URL.parse(window.location.href).hash;
      //console.log(this.$el);
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
