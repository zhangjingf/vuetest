<template>
  <div class="m-find">
    {{count}}
    <div @click="dateShow">日期选择</div>
    <app-time :options="timeParam" :show="this.show" @close="close"  @handleSelected="handleSelected"></app-time>
  </div>
</template>

<script>
import appTime from '@/components/time'
export default { 
  props: ["options"],
  data() {
    return {
      timeParam :{
        cancel: '取消',
        confrim: '确认',
        title: '请选择',
      },
      show: false,
    }
  },
  computed: {
    count() {
      console.log(this.$store.getters.doneTodos);
      console.log(this);
      return this.$store.state.count;
    }
  },
  components: {
    appTime
  },
  methods: {
    handleSelected(val) {
      console.log(val);
    },
    dateShow() {
      this.show = true;
    },
    close() {
      this.show = false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
