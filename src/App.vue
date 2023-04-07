<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    this.$store.dispatch('equipments/start', this.$message)
  },
  beforeDestroy() {
    this.$store.dispatch('equipments/stop')
  }
}
</script>

<style scoped>

/* 表格框線對齊 */
body .el-table th.gutter {
  display: table-cell !important
}

/* 解決：Unable to preventDefault inside passive event listener invocation. */
* {
  touch-action: pan-y
}

</style>
