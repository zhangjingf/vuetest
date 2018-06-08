<template>
  <div class="m-mine">
    <my-echart></my-echart>
  </div>
</template>

<script>
import myEchart from './echart';
export default { 
  props: ["options"],
  data() {
    return {}
  },
  components: { myEchart },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
