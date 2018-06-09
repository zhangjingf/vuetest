<template>
  <div class="m-find">
    {{count}}
    <app-time :props="timeParam"  @handleSelected="handleSelected"></app-time>
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
      }
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
