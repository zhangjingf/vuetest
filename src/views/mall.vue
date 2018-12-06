<template>
  <div class="m-mall">
    <div class="star" @click="star">{{"★★★★★☆☆☆☆☆".slice(5 - rate, 10 - rate)}}</div>
    <div class="btn" @click="star">评分</div>
    <div class="bnt" @click="indicator">提示</div>
  </div>
</template>

<script>
import { Toast, Indicator } from 'mint-ui';
export default {
  props: ["options"],
  data() {
    return {
      rate: 0
    }
  },
  mounted () {
    Toast('提示信息');
  },
  methods: {
    star() {
      if(this.rate < 5) {
        this.rate++;
      } else {
        this.rate = 0;
      }
    },
    indicator () {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      setTimeout(() => {
        Indicator.close()
      }, 5000);
    }
  }
 }
</script>
<style lang="scss" scoped>
.m-mall {
  display: flex;
  align-items: center;
  .star {
    font-size: 20px;
    color: #ff9600;
    letter-spacing: 10px;
  }
  .btn {
    font-size: 16px;
  }
}
</style>
