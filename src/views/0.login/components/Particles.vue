<template>
  <div>
    <vue-particles
      class="container"
      color="#11C3FF"
      :particle-opacity="0.8"
      :particles-number="100"
      shape-type="circle"
      :particle-size="3"
      lines-color="#11C3FF"
      :line-linked="true"
      :line-opacity="0.1"
      :lines-distance="150"
      :move-speed="2"
      :hover-effect="true"
      hover-mode="grab"
      :click-effect="true"
      click-mode="push"
    />
  </div>
</template>

<script>
export default {
  name: 'Particles'
}
</script>

<style scoped>
.container {
  height: 100vh;
}
</style>
