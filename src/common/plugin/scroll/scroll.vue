<template>
    <transition name="fade" @after-leave="afterLeave">
        <div class="m-scroll-load" v-if="loading">
            <div>{{text}}</div>
        </div>
    </transition>
</template>
<script>
export default {
    props: {
        data: {
            type: Number,
            default: null,
        },
        loading: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            default: '正在加载'
        },
        node: null
    },
    mounted() {
        const vm = this;
        //console.log(window.innerHeight);
    },
    watch: {
        node(node) {
            const vm = this;
            vm.bindNode = vm.getScrollNode(node);
            vm.scrollNode = vm.bindNode === window ? document.body : this.bindNode;
            vm.bind();
        }
    },
    methods: {
        afterLeave() {

        },
        pos () {
            const clientHeight = this.scrollNode === document.body ? document.documentElement.clientHeight : this.scrollNode.clientHeight;
            const scrollTop = this.scrollNode.scrollTop;
            const top = this.scrollNode.scrollHeight - clientHeight;
            return {height: clientHeight, scrollTop: scrollTop, top: top};
        },
        getScrollNode(node) {
            if(node.nodeType != 1) return;
            if(this.isScroll(getComputedStyle(node))) {
                return node;
            } else if(this.isScroll(getComputedStyle(node.parentNode))) {
                return node.parentNode;
            }
        },
        isScroll(data) {
            return data["overflow"] == "auto" || data["overflow-y"] == "auto" || data["overflow"] == "scroll" || data["overflow-y"] == "scroll";
        },
        bind() {
            this.bindNode.addEventListener("scroll", this.hanlder);
        },
        unbind() {
            this.bindNode.removeEventListener("scroll", this.hanlder);
        },
        hanlder(ev) {
            let posData = this.pos();
            //console.log(posData);
        }
    }
}
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s
}

.fade-enter,
.fade-leave-active {
    opacity: 0
}
</style>
