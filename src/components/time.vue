<template>
    <div class="date_picker" v-show="showFlag">
        <div class="mask"></div>
        <div class="date">
            <div class="title"><div @click="handleCancel">{{cancel}}</div><div>{{title}}</div><div @click="handleConfrim">{{confrim}}</div></div>
            <div class="content">
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
                <div ref="minute" class="swiper-container minute_wrapper">
                    <div class="swiper-wrapper minute_content">
                        <template v-for="(item, index) in this.minuteList">
                            <div class="swiper-slide" :key="index">
                                <template v-if="item.toString().length == 1">
                                    0{{item}}
                                </template>
                                <template v-else>
                                    {{item}}
                                </template>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="line"></div>
    </div>
</template>
<script>
import Swiper from '../../static/js/swiper.min.js';
export default {
    props: {
        options: {
            type: Object,
            default() {
                return {}
            }
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            data: [[],{}],
            dayList: null,
            hourList: null,
            minuteList: null,
            dateArr: [],
            cancel: this.options.cancel ? this.options.cancel : 'cancel',
            title:  this.options.title ? this.options.title : 'title',
            confrim: this.options.confrim ? this.options.confrim : 'confrim',
            showFlag: false,
        }
    },
    mounted () {
        const vm = this;
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
                    vm.hourList = vm.data[1][vm.data[0][0].value];
                    vm.dateArr[0] = ev.slides[0].innerText;
                    vm.minuteList = vm.minuteData(vm.hourList[0].value);
                    vm.dateArr[1] = vm.hourList[0].value;
                    minuteSwiper = vm.minuteSwiper();
                },
                onSlideChangeEnd: function(ev) {
                    vm.hourList = vm.data[1][vm.data[0][ev.activeIndex].value];
                    vm.dateArr[0] = ev.slides[ev.activeIndex].innerText;
                    vm.minuteList = vm.minuteData(vm.hourList[0].value);
                    vm.dateArr[1] = vm.hourList[0].value;
                    minuteSwiper = vm.minuteSwiper();
                    hourSwiper.slideTo(0);
                }
            });
            let minuteSwiper = null;
            let hourSwiper = new Swiper('.hour_wrapper', {
                direction: 'vertical',
                slidesPerView: 3,
                slideToClickedSlide: true,
                centeredSlides: true,
                slideActiveClass: "active",
                observer: true,
                observeParents: false,
                onSlideChangeEnd: function(ev) {
                    vm.minuteList = vm.minuteData(ev.slides[ev.activeIndex].innerText);
                    vm.dateArr[1] = ev.slides[ev.activeIndex].innerText;
                    minuteSwiper = vm.minuteSwiper();
                }
            }) 
        })
    },
    methods: {
        initData() {
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
            vm.showFlag = vm.show;
        },
        minuteSwiper() {
            const vm = this;
            return new Swiper('.minute_wrapper', {
                direction: 'vertical',
                slidesPerView: 3,
                slideToClickedSlide: true,
                centeredSlides: true,
                slideActiveClass: "active",
                observer:true,
                observeParents: false,
                onInit: function(ev) {
                    vm.dateArr[2] = vm.minuteList[0];
                },
                onSlideChangeEnd: function(ev) {
                    vm.dateArr[2] = ev.slides[ev.activeIndex].innerText;
                }
            })
        },
        minuteData(val) {
            var vm = this;
            var now = new Date();
            var day = now.getDate();
            var hour = now.getHours();
            var minute = Math.floor(now.getMinutes());
            if(day == vm.dateArr[0] && hour == ~~val) {
                var diffMinute = (60 - minute)/5;
                var baseMinute = diffMinute == 12 ? 0 : (minute % 5 ? minute + (5 - minute % 5) : minute);
                var arr = [];
                for(var z = 0; z < diffMinute; z++) {
                    if(baseMinute != 60) {
                        arr.push(baseMinute);
                    }
                    baseMinute = baseMinute + 5;
                }
                return arr;
            } else {
                return [0,5,10,15,20,25,30,35,40,45,50,55];
            }
        },
        handleCancel() {
            this.showFlag = false;
            this.$emit("close");
        },
        handleConfrim() {
            this.showFlag = false;
            this.$emit("close");
            this.$emit("handleSelected", this.dateArr);
        }
    },
    created() {
        this.initData();
    },
    watch: {
        show(val) {
            if(!val) return; 
            this.initData();
        }
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
        .title {
            @include display-flex();
            font-size: 1.2rem;
            padding: 0 .5rem;
            padding-bottom: 1rem;
            &>div:nth-child(2) {
                @include flex(1);
            }
        }
        .content{
            @include display-flex();
            @include justify-content(space-around);
        }
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

