<template>
    <div class="date_picker">
        <div class="mask"></div>
        <div class="date">
            <div ref="day" class="swiper-container day_wrapper">
                <div class="swiper-wrapper day_content">
                    <template v-for="(item, index) in this.dayList">
                        <div class="swiper-slide" :key="index">{{item.value}}</div>
                    </template>
                </div>
            </div>
            <div ref="hour" class="hour_warpper">
                <div class="hour_content">
                    <template v-for="(item, index) in this.data[1]">
                        <div :key="index">{{item.value}}</div>
                    </template>
                </div>
            </div>
            <div ref="minute" class="minute_warpper">
                <div class="minute_content">
                    <template v-for="(item, index) in this.data[2]">
                        <div :key="index">{{item.value}}</div>
                    </template>
                </div>
            </div>
        </div>
        <div class="line"></div>
    </div>
</template>
<script>
import Swiper from '../../static/js/swiper.min.js';
export default {
    props: ['props'],
    data() {
        return {
            data: [[],{},{}],
            dayList: null,
            hourList: null,
            minuteList: null,
        }
    },
    components: {
       
    },
    mounted () {
        const vm = this;
        const DAY_COUNT = 3;
        const now = new Date();
        var day = now.getDate();
        var hour = now.getHours();
        var minute = Math.floor(now.getMinutes());
        for(var i = 0; i < DAY_COUNT; i++) {
            vm.data[0][i] = {
                value: day
            }
            var diffHour = !!i ? 24 : 24-hour;
            var hour = diffHour == 24 ? 0 : hour;
            vm.data[1][day] = new Array();
            vm.data[2][day] = new Object();
            for(var y = 0; y < diffHour; y++) {
                vm.data[1][day].push({value: hour}) 
                var diffMinute = (i && y) ? 12 : (60 - minute)/5;
                var baseMinute = diffMinute == 12 ? 0 : (minute % 5 ? minute + (5 - minute % 5) : minute);
                vm.data[2][day][hour] = new Array();
                for(var z = 0; z < diffMinute; z++) {
                    if(baseMinute != 60) {
                        vm.data[2][day][hour].push({value: baseMinute})
                    }
                    baseMinute = baseMinute + 5;
                }
                hour++;
            }
            day++;
        }
        this.dayList = this.data[0];
        this.$nextTick(()=> {
            let hourSwiper = new Swiper('.day_wrapper', {
                direction : 'vertical',
                slidesPerView: 2,
                slideToClickedSlide:true,
                centeredSlides: true,
                onInit: function(ev) {
                    vm.$refs.day.style.lineHeight = ev.height/2 + 'px';
                    console.log(ev)
                }
            })
        })
    },
    methods: {
    
    },
    created() {
    }
}
</script>
<style lang="scss">
@import '../common/style/mixin';
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
    // .line {
    //     position: absolute;
    //     bottom: 2rem;
    //     width: 100%;
    //     height: 2rem;
    //     border-top: .05rem solid #16fc16;
    //     border-bottom: .05rem solid #16fc16;
    // }
    .date {
        position: absolute;
        bottom: 0;
        left: 0;
        background: #ffffff;
        width: 100%;
        //height: 6rem;
        padding: 1.5rem 0;
        text-align: center;
        @include display-flex();
        @include justify-content(space-around);
        .swiper-slide {
            font-size: 1.5rem;
        }
    }
}
</style>

