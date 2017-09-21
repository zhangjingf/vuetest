<template>
  <div class="header">
    <div @cilck="back">
      <span class="icon-right-arrow"></span>
    </div>
    <div class="title" node-name="title"></div>
    <div></div>
  </div>
</template>

<script>
export default {
  methods: {
    back(event) {
      console.log(this)
    }
  }
}
</script>
<style scoped>
.header {
  position: absolute;
  align-items: center;
  padding: 0 1rem;
  font-size: 1.2rem;
  line-height: 4.4rem;
  color: #6f6456;
}

.header>div {
  flex: 1;
}

span {
  display: inline-block;
  transform: rotate(180deg);
}

.title {
  text-align: center;
}
</style>
