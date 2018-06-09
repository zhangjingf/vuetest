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
            <div ref="hour" class="swiper-container hour_wrapper">
                <div class="swiper-wrapper hour_content">
                    <template v-for="(item, index) in this.hourList">
                        <div class="swiper-slide" :key="index">
                            <template v-if="item.value.toString().length == 1">
                                0{{item.value}}
                            </template>
                            <template v-else>
                                {{item.value}}
                            </template>
                        </div>
                    </template>
                </div>
            </div>
            <div ref="minute" class="minute_wrapper">
                <div class="swiper-wrapper minute_content">
                    <template v-for="(item, index) in this.minuteList">
                        <div class="swiper-slide" :key="index">
                            <template v-if="item.value.toString().length == 1">
                                0{{item.value}}
                            </template>
                            <template v-else>
                                {{item.value}}
                            </template>
                        </div>
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
            data: [[],{}],
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
            for(var y = 0; y < diffHour; y++) {
                vm.data[1][day].push({value: hour}) 
                hour++;
            }
            day++;
        }
        vm.dayList = vm.data[0];
        vm.$nextTick(()=> {
            let daySwiper = new Swiper('.day_wrapper', {
                direction : 'vertical',
                slidesPerView: 3,
                slideToClickedSlide:true,
                centeredSlides: true,
                slideActiveClass: "active",
                observer:true,
                observeParents:true,
                onInit: function(ev) {
                    vm.hourList = vm.data[1][vm.data[0][ev.activeIndex].value];
                    //vm.minuteList = vm.data[2][vm.data[0][ev.activeIndex].value][vm.hourList[ev.activeIndex].value];
                },
                onSlideChangeEnd: function(ev) {
                    console.log(ev.activeIndex)
                    vm.hourList = vm.data[1][vm.data[0][ev.activeIndex].value];
                }
            });
            let hourSwiper = new Swiper('.hour_wrapper', {
                direction: 'vertical',
                slidesPerView: 3,
                slideToClickedSlide: true,
                centeredSlides: true,
                slideActiveClass: "active",
                observer: true,
                observeParents: false,
                onSlideChangeEnd: function(ev) {
                   vm.minuteData(ev.slides[ev.activeIndex].innerText);
                }
            })
            let minuteSwiper = new Swiper('.minute_wrapper', {
                direction: 'vertical',
                slidesPerView: 3,
                slideToClickedSlide: true,
                centeredSlides: true,
                slideActiveClass: "active",
                freeMode: true,
                observer:true,
                observeParents: false,
                onSlideChangeEnd: function(ev) {
                   console.log(ev);
                }
            })
            
        })
    },
    methods: {
        hourData() {

        },
        minuteData(val) {
            console.log(~~val)
            var now = new Date();
            var hour = now.getHours();
            var minute = Math.floor(now.getMinutes());
            if(val) {
                
            }
            // var diffMinute = (i && y) ? 12 : (60 - minute)/5;
            // var baseMinute = diffMinute == 12 ? 0 : (minute % 5 ? minute + (5 - minute % 5) : minute);
            // for(var z = 0; z < diffMinute; z++) {
            //     if(baseMinute != 60) {
                    
            //     }
            //     baseMinute = baseMinute + 5;
            // }
        }

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
        .day_wrapper, .hour_wrapper, .minute_wrapper {
            height: 10rem;
            @include flex(1);
        }
        .swiper-slide {
            font-size: 1.5rem;
        }
    }
    .active {
        color: #16c124;
    }
}
</style>

