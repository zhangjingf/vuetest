<template>
  <transition name="fade" @afterLeave="afterLeave">
    <div class="m-overlay" v-show="show" @click="handlerClick" :style="style"></div>
  </transition>
</template>
<script>
    import { getUniqueId, getZIndex, fire } from 'lib/comp/bus';
    export default {
        props: {
            opacity: {
                type: Number,
                default: 0.4
            },
            color: {
                type: String,
                default: '#000'
            }
        },
        data () {
            return {
                show: false,
                zIndex: getZIndex(),
                fire: {
                    overlayClick: getUniqueId()
                }
            }
        },
        computed: {
            style () {
                return {
                    'opacity': this.opacity,
                    'background-color': this.color,
                    'z-index': this.zIndex
                }
            }
        },
        methods: {
            get (key) {
                return this.fire[key];
            },
            afterLeave () {
                document.body.removeChild(this.$el);
                this.$destroy();
            },
            setStyle (option){
                this.color = option.color;
                this.opacity = option.opacity;
                this.zIndex = option.zIndex;
            },
            handlerClick () {
                fire(this.get("overlayClick"), {type: "overlay"});
            }
        }
    }
</script>
<style lang="css" scoped>
  .m-overlay {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #000;
    opacity: .4;
    z-index: 1000;
  }

  .fade-enter-active,.fade-leave-active{
    transition: all .3s linear;
  }
  .fade-enter,.fade-leave-to {
    opacity: 0 !important;
  }
</style>
