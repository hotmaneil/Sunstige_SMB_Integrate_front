<template>
  <div class="chart-container">
    <h3>機台稼動歷程 Machine Status History</h3>

    <!-- 查詢表單 -->
    <QueryForm :category="category" @sendSubmit="onSubmit" />

    <UtilizationGraph
      :device-id="selectedDeviceId"
      :utilization-graph-list="utilizationGraphList"
      :start-time="xAxisStartTime"
      :end-time="xAxisEndTime"
      height="250px"
      width="100%"
    />

    <h3>生產次數累計</h3>
    <ProduceQtyBar :graph-list="produceQtyGraphList" height="300px" />
    <!-- <ProduceQtyGraph :graph-list="produceQtyGraphList" height="250px" width="100%" /> -->

    <EquipmentStatusPartInfo :device-info="deviceInfo" :status-time-rate="sortInfoTimeRate" height="250px" width="100%" />
  </div>
</template>

<script>
import { equipmentStatusHistory } from '@/api/SMBStatistical'
import UtilizationGraph from '@/components/SMBChart/UtilizationGraph'
import ProduceQtyGraph from '@/components/SMBChart/ProduceQtyGraph'
import EquipmentStatusPartInfo from '@/components/SMBChart/EquipmentStatusPartInfo'
import QueryForm from '@/components/SMB/QueryForm'
import moment from 'moment'
import ProduceQtyBar from '@/components/SMBChart/ProduceQtyBar'

export default {
  components: { UtilizationGraph, ProduceQtyGraph, EquipmentStatusPartInfo, QueryForm, ProduceQtyBar },
  data() {
    return {
      /** 機台稼動歷史資料集合 */
      iotDataStructData: {},

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

      deviceInfo: [],

      statusTimeRate: [],

      /** 設備種類 */
      category: null
    }
  },

  computed: {
    sortInfoTimeRate() {
      const sort = ['Run', 'Idle', 'Down', 'Offline', 'Disconnect']

      if (this.statusTimeRate) {
        const obj = {}
        for (let i = 0; i < this.statusTimeRate.length; i++) {
          const item = this.statusTimeRate[i]
          obj[item.main_status_id] = item
        }

        return sort.map(sortItem => obj[sortItem]).filter(TimeRate => {
          return TimeRate !== undefined
        })
      } else {
        return []
      }
    }
  },

  created() {
    this.setCategory()
    this.getClassList()
    this.getDeviceList()
  },

  methods: {
    /**
     * 取得班別列表
     */
    getClassList() {
      const vm = this
      GetClassList()
        .then(response => {
          vm.classList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 取得機台列表
     */
    getDeviceList() {
      const vm = this
      const payload = { Category: vm.category }
      getDeviceListByCategory(payload)
        .then(response => {
          vm.deviceList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 查詢
     */
    onSubmit(source) {
      const vm = this
      const payload = source
      vm.selectedDeviceId = payload.device
      payload.date = moment(payload.date).format('yyyy-MM-DD')

      equipmentStatusHistory(payload)
        .then(response => {
          console.log('response', response.data.Payload)
          vm.iotDataStructData = response.data.Payload
          vm.utilizationGraphList = vm.iotDataStructData.UtilizationGraph
          vm.produceQtyGraphList = vm.iotDataStructData.HourProduceQtyGraph
          vm.xAxisStartTime = vm.iotDataStructData.StartTime
          vm.xAxisEndTime = vm.iotDataStructData.EndTime
          vm.deviceInfo = vm.iotDataStructData.device_info
          vm.statusTimeRate = vm.iotDataStructData.status_time_rate
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 設置設備種類
     */
    setCategory() {
      var routePath = this.$route.path
      const index = routePath.indexOf('/', 16)
      const catchString = routePath.substring(index + 1, routePath.length)
      console.log('catchString', catchString)
      this.category = catchString
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>
