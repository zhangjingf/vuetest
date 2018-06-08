<template>
  <div class="m-find">
    {{count}}
    <app-time></app-time>
  </div>
</template>

<script>
import appTime from '@/components/time'
export default { 
  props: ["options"],
  data() {
    return {}
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
