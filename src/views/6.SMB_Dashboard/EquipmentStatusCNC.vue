<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="稼動狀況 & 生產狀況" name="first">
      <equipmentStatus ref="equipmentStatus" />
    </el-tab-pane>
    <el-tab-pane label="主軸實際轉速 ＆ 進給率百分比" name="second">
      <squareChartCNC ref="squareChartCNC" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import equipmentStatus from './EquipmentStatus'
import squareChartCNC from './SquareChartCNC'

export default {
  components: { equipmentStatus, squareChartCNC },
  data() {
    return {
      activeName: 'first'
    }
  },
  created() {
    // 讀取QueryString
    var getQuery = this.$route.query.deviceId
    this.$store.dispatch('device/setSelectedDeviceId', getQuery)
  },

  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)

      console.log('tab.name', tab.name)

      switch (tab.name) {
        case 'first':
          this.$refs.equipmentStatus.changeSelectedDeviceId()
          break
        case 'second':
          this.$refs.squareChartCNC.changeSelectedDeviceId()
          break
      }
    }
  }
}
</script>
