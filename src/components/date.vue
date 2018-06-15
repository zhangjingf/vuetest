<template>
    <div class="date_picker">
        <div class="mask"></div>
        <div class="content">
            
        </div>
    </div> 
</template>
<script>
export default {
    props: ["props"],
    data() {
        return {

        }
    },
    mounted() {

    },
    methods: {

    }
}
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
}
</style>

