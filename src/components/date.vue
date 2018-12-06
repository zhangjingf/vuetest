<template>
    <div class="date_picker">
        <div class="mask"></div>
        <div class="content">
            <div class="picker-content">
                <div class="mask-top border-bottom-1px"></div>
                <div class="mask-bottom border-top-1px"></div>
                <div class="wheel-wrapper" ref="wheelWrapper">
                  <div class="wheel" v-for="data in pickerData">
                      <ul class="wheel-scroll">
                      <li v-for="item in data" class="wheel-item">{{item.value}}</li>
                      </ul>
                  </div>
                </div>
            </div>
        </div>
    </div> 
</template>
<script>
import BScroll from "better-scroll";

export default {
  props: ["props"],
  data() {
    return {
      pickerData: [[], {}],
      wheels: []
    };
  },
  mounted() {
    const vm = this;
    const wheelWrapper = Array.prototype.slice.call(this.$refs.wheelWrapper.children);
    for (let index in wheelWrapper) {
      let scroll = wheelWrapper[index].querySelector(".wheel-scroll");
      console.log(scroll);
      this.wheels[index] = new BScroll(scroll, {
        wheel: {
          selectedIndex: this.pickerSelectedIndex[0],
          /** 默认值就是下面配置的两个，为了展示二者的作用，这里再配置一下 */
          wheelWrapperClass: "wheel-scroll",
          wheelItemClass: "wheel-item"
        },
        probeType: 3
      });
    }
  },
  methods: {
    initData() {
      const vm = this;
      const DAY_COUNT = 3;
      const now = new Date();
      var day = now.getDate();
      var hour = now.getHours();
      var minute = Math.floor(now.getMinutes());
      for (var i = 0; i < DAY_COUNT; i++) {
        vm.pickerData[0][i] = {
          value: day
        };
        var diffHour = !!i ? 24 : 24 - hour;
        var hour = diffHour == 24 ? 0 : hour;
        vm.pickerData[1][day] = new Array();
        for (var y = 0; y < diffHour; y++) {
          vm.pickerData[1][day].push({ value: hour });
          hour++;
        }
        day++;
      }
      vm.dayList = vm.pickerData[0];
      vm.showFlag = vm.show;
    },
  },
  created() {
    this.initData();
  }
};
</script>
<style lang="scss" scoped>
.date_picker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .mask {
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.5;
    z-index: 100;
  }
  .content {
    background: #ffffff;
    height: 4rem;
  }
}
</style>

