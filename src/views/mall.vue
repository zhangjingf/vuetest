<template>
  <div class="m-mall">
    <div class="star">{{"★★★★★☆☆☆☆☆".slice(5 - rate, 10 - rate)}}</div>
    <div class="btn" @click="star">评分</div>
  </div>
</template>

<script>
export default {
  props: ["options"],
  data() {
    return {
      rate: 0
    }
  },
  methods: {
    star() {
      if(this.rate < 5) {
        this.rate++;
      } else {
        this.rate = 0;
      }
      
    }
  }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.m-mall {
  display: flex;
  align-items: center;
  .star {
    font-size: 20px;
    color: #ff9600;
  }
  .btn {
    font-size: 16px;
  }
}
</style>
