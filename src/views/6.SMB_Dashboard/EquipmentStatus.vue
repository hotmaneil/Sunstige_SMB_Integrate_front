<template>
  <div class="chart-container">
    <h3>設備運行狀況 Machine Status Tracking</h3>

    <equipment-select
      :is-default-select="false"
      :category="category"
      :float-value="floatValue"
      :equipment-id="selectedDeviceId"
      @OnSelectEquipmentChange="clickSelectDeviceId"
    />

    <!-- width="100%" -->
    <UtilizationGraph
      :is-default-select="false"
      :device-id="selectedDeviceId"
      :utilization-graph-list="utilizationGraphList"
      :start-time="xAxisStartTime"
      :end-time="xAxisEndTime"
      height="280px"
    />

    <!-- 換為柱狀圖如下-->
    <!-- <ProduceQtyGraph :graph-list="produceQtyGraphList" height="30%" width="100%" /> -->

    <h3>生產次數累計</h3>

    <ProduceQtyBar :graph-list="produceQtyGraphList" />

    <EquipmentStatusInfo :device-id="selectedDeviceId" height="30%" width="100%" />
  </div>
</template>

<script>
import { getDeviceListByCategory } from '@/api/SMBDevice'
import { graphInfo } from '@/api/SMBStatistical'
import UtilizationGraph from '@/components/SMBChart/UtilizationGraph'
// import ProduceQtyGraph from '@/components/SMBChart/ProduceQtyGraph' // 沒有用到暫時 hidden 起來
import EquipmentStatusInfo from '@/components/SMBChart/EquipmentStatusInfo'
import EquipmentSelect from '@/components/DropDownList/EquipmentSelect'
import ProduceQtyBar from '@/components/SMBChart/ProduceQtyBar'

export default {
  components: { UtilizationGraph, EquipmentStatusInfo, EquipmentSelect, ProduceQtyBar },
  data() {
    return {
      /** 設備列表 */
      deviceList: [],

      /** 選取的設備Id */
      selectedDeviceId: null,

      // x軸開始時間
      xAxisStartTime: null,

      // x軸結束時間
      xAxisEndTime: null,

      /** 稼動狀況用圖表資料 */
      utilizationGraphList: [],

      /** 生產狀況用圖表資料 */
      produceQtyGraphList: [],

      /** 設備種類 */
      category: null,

      floatValue: 'left'
    }
  },

  created() {
    // 讀取QueryString
    var getQuery = this.$route.query.deviceId
    this.$store.dispatch('device/setSelectedDeviceId', getQuery)

    this.setCategory()
    this.getdeviceList()
    this.timer = null
    this.setTimer()
  },

  methods: {
    /**
     * 取得設備總覽
     */
    getdeviceList() {
      const vm = this
      console.log('getdeviceList vm.selectedDeviceId', vm.selectedDeviceId)
      const payload = { Category: vm.category }
      getDeviceListByCategory(payload).then(response => {
        vm.deviceList = response.data.Payload
        if (vm.deviceList.length > 0) {
          if (vm.selectedDeviceId === null) {
            if (vm.$store.state.device.selectedDeviceId === null) {
              vm.selectedDeviceId = vm.deviceList[0].id
            } else {
              vm.selectedDeviceId = vm.$store.state.device.selectedDeviceId
            }
          }
        }
        this.getGraphInfo()
      })
    },

    /** 按下選取設備Id */
    clickSelectDeviceId(source) {
      const vm = this
      vm.selectedDeviceId = source
      this.$store.dispatch('device/setSelectedDeviceId', source)
      vm.fullscreenLoading = true
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(() => {
        loading.close()
        this.getGraphInfo()
      }, 1000)
    },

    /**
     * 取得稼動狀況與生產狀況之圖表
     */
    getGraphInfo() {
      const vm = this
      vm.utilizationGraphList = []
      vm.produceQtyGraphList = []
      const payload = {
        device: vm.selectedDeviceId,
        isNewVersion: true
      }

      graphInfo(payload).then(response => {
        console.log('getGraphInfo', response.data.Payload)
        vm.utilizationGraphList = response.data.Payload.UtilizationGraph
        vm.produceQtyGraphList = response.data.Payload.HourProduceQtyGraph
        vm.xAxisStartTime = response.data.Payload.StartTime
        vm.xAxisEndTime = response.data.Payload.EndTime
      })
    },

    /**
     * 設置設備種類
     */
    setCategory() {
      var routePath = this.$route.path
      const index = routePath.indexOf('/', 1)
      const catchString = routePath.substring(index + 1, routePath.length)
      console.log('catchString', catchString)
      this.category = catchString
    },

    /**
     * 定時更新
     */
    setTimer() {
      if (this.timer == null) {
        this.timer = setInterval(() => {
          this.getGraphInfo()
        }, 60000)
      }
    },

    /**
     * 切換時變更選擇的設備編號
     */
    changeSelectedDeviceId() {
      this.selectedDeviceId = this.$store.state.device.selectedDeviceId
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  /* height: calc(100vh - 84px); */
}
</style>
