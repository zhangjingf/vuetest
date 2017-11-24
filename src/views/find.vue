<template>
  <div class="m-find">{{count}}</div>
</template>

<script>
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
