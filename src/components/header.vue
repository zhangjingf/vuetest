<template>
  <div class="header" v-if="this.path != '/film'">
    <div @click="back">
      <span class="icon-right-arrow"></span>
    </div>
    <template v-if="this.path == '/find'">
      <div class="title">发现</div>
    </template>
    <template v-else-if="this.path == '/menu'">
      <div class="title">我的</div>
    </template>
    <template v-else-if="this.path == '/mall'">
      <div class="title">商城</div>
    </template>
    <div></div>
  </div>
</template>

<script>
export default {
  props: {
    path: null
  },
  mounted() {
    const vm = this;
  },
  methods: {
    back () {
      this.$router.push({path: '/film'});
      console.log(this.$router);
    },
    next () {
      console.log(111);
    }
  },
  watch: {
    path(val) {
     // console.log(val);
    }
  }
}
</script>
<style scoped>
.header {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 0 1rem;
  font-size: 1.2rem;
  line-height: 4.4rem;
  color: #6f6456;
}

.header>div {
  flex: 1;
}

span {
  display: inline-block;
  transform: rotate(180deg);
}

.title {
  text-align: center;
}
</style>
