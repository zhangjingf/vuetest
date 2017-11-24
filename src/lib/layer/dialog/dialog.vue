<template>
  <div class="m-mobile-dialog" :class="{'mobile-wait': myOption.wait}">
    <div class="dialog-wait vh-center" v-if="myOption.wait">
      <div class="loading"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
    </div>
    <div class="dialog-content" v-if="!myOption.wait" :class="{alert: myOption.alert}"><slot></slot></div>
    <div class="dialog-items" v-if="!myOption.wait && myOption.buts.length > 0">
      <span v-for="item in myOption.buts" @click="butClick(item.id, item)" :class="item.type == 'ok' ? 'q-btn q-ok' : 'q-btn'">{{ item.text }}</span>
    </div>
  </div>
</template>
<script>
    export default {
        props: {
            option: {
                type: Object,
                default () {
                    return {};
                }
            },
            fire: {
                type: Object,
                default () {
                    return {};
                }
            }
        },
        data () {
            return {
                myOption: {
                    alert: false,
                    wait: false,
                    buts: []
                }
            }
        },
        mounted () {
            this.$nextTick(() => {
                this.myOption = Object.assign(this.myOption, this.option);
            });
        },
        methods: {
            butClick (key, item) {
                this.$emit("click", {key: key, item: item});
            },
            closeDialog () {
                this.$emit("close");
            }
        }
    }
</script>
<style lang="scss" scoped>
  @import "../../../common/style/mixin";
  .m-mobile-dialog{//自定义弹出框
    @include radius(5px);
    box-sizing: border-box;
    @include max-width(560px);
    /*box-shadow: 0 19px 60px rgba(0,0,0,.298039), 0 15px 20px rgba(0,0,0,.219608);*/
    &.mobile-wait{
      background: none;
      box-shadow: none;
    }
    .dialog-msg{
      @include font-size(26px);
      @include lh(124px);
      padding: rem(0 80px);
      text-align: center;
      @extend %ellipsis-basic;
      @include max-width(100%);
    }
    .dialog-wait{
      @include wh(200px);
      @include radius(10px);
      .loading{
        position: relative;
        margin-bottom: rem(18px);
        i{
          display: block;
          @include height(20px);
          width: 4px;
          @include radius(4px);
          position: absolute;
        }
        i:nth-child(1){
          top: rem(25px);
          left: 0;
          @include animation(waitLoading 1s ease 0s infinite);
        }
        i:nth-child(2){
          top: rem(17px);
          left: rem(17px);
          @include rotate(-45deg);
          @include animation(waitLoading 1s ease -0.12s infinite);
        }
        i:nth-child(3){
          top: 0;
          left: rem(25px);
          @include rotate(-90deg);
          @include animation(waitLoading 1s ease -0.24s infinite);
        }
        i:nth-child(4){
          top: rem(-17px);
          left: rem(17px);
          @include rotate(45deg);
          @include animation(waitLoading 1s ease -0.36s infinite);
        }
        i:nth-child(5){
          top: rem(-25px);
          left: 0;
          @include animation(waitLoading 1s ease -0.48s infinite);
        }
        i:nth-child(6){
          top: rem(-17px);
          left: rem(-17px);
          @include rotate(-45deg);
          @include animation(waitLoading 1s ease -0.6s infinite);
        }
        i:nth-child(7){
          top: 0;
          left: rem(-25px);
          @include rotate(-90deg);
          @include animation(waitLoading 1s ease -0.72s infinite);
        }
        i:nth-child(8){
          top: rem(17px);
          left: rem(-17px);
          @include rotate(45deg);
          @include animation(waitLoading 1s ease -0.84s infinite);
        }
      }
    }
    .dialog-content{
      padding: rem(8px);
      @include width(560px);
      @include min-height(120px);
      word-break: break-all;
      @include font-size(26px);
      box-sizing: border-box;
      &.alert{
        text-align: center;
        padding: rem(50px 60px 0);
        word-break: break-all;
        line-height: rem(60px);
        @include font-size(34px);
      }
    }
    .dialog-items{
      text-align: center;
      @include height(120px);
      @include display-flex;
      @include justify-content(center);
      @include align-items(center);
      padding-bottom: rem(25px);
      .q-btn{
        @include wh(200px, 70px);
        @include display-flex;
        @include align-items(center);
        @include justify-content(center);
        @include radius(200px);
        @include box-sizing;
        @include font-size(30px);
        margin: rem(0 20px);
      }
    }
  }

  @include keyframes(waitLoading){
    50% {
      opacity: 0.1;
    }
    100% {
      opacity: 1;
    }
  }
</style>