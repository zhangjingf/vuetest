<template>
  <div class="m-find">
    {{count}}
  </div>
</template>

<script>
import appTime from '@/components/time'
import appDate from "@/components/date"
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
    appTime,
    appDate
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
    },
    dateVisible() {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
