<template>
  <div>
    <!-- 查詢表單 -->
    <QueryForm :category="category" @sendSubmit="onSubmit" />

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="稼動狀況 & 生產狀況" name="first">
        <UtilizationGraph
          :device-id="selectedDeviceId"
          :utilization-graph-list="utilizationGraphList"
          :start-time="xAxisStartTime"
          :end-time="xAxisEndTime"
          height="250px"
          width="100%"
        />

        <!-- <ProduceQtyGraph :graph-list="produceQtyGraphList" height="250px" width="100%" /> -->
        <h3>生產次數累計</h3>
        <ProduceQtyBar :graph-list="produceQtyGraphList" height="300px" />

        <EquipmentStatusPartInfo
          :device-info="deviceInfo"
          :status-time-rate="sortInfoTimeRate"
          height="250px"
          width="100%"
        />
      </el-tab-pane>

      <el-tab-pane label="主軸實際轉速 ＆ 進給率百分比" name="second">
        <!-- 主軸實際轉速 -->
        <SquareChart
          :square-data="iotCNCDataList"
          :main-axis-th="cncMainAxisTh"
          field-item="spindlespeedth"
          title="主軸實際轉速"
        />

        <!-- 進給率百分比 -->
        <SquareChart
          :square-data="iotCNCDataList"
          :main-axis-th="cncMainAxisTh"
          field-item="feedrateoverrideth"
          title="進給率百分比"
        />

        <!-- 運轉時間、實際切削時間、實際稼動率-->
        <CNCStatusInfo :cnc-status-info="statusInfo" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { equipmentStatusHistory, getIOTCNCDataCollection } from '@/api/SMBStatistical'
import UtilizationGraph from '@/components/SMBChart/UtilizationGraph'
import ProduceQtyGraph from '@/components/SMBChart/ProduceQtyGraph'
import EquipmentStatusPartInfo from '@/components/SMBChart/EquipmentStatusPartInfo'
import QueryForm from '@/components/SMB/QueryForm'
import SquareChart from '@/components/SMBChart/SquareChart'
import CNCStatusInfo from '@/components/SMBChart/CNCStatusInfo'
import ProduceQtyBar from '@/components/SMBChart/ProduceQtyBar'
import moment from 'moment'

export default {
  components: { UtilizationGraph, ProduceQtyGraph, EquipmentStatusPartInfo, QueryForm, SquareChart, CNCStatusInfo, ProduceQtyBar },
  data() {
    return {
      searchForm: {
        date: null,
        classId: null,
        device: null,
        isNewVersion: true
      },
      activeName: 'first',

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
      category: null,

      iotCNCDataList: [],

      statusInfo: null,

      /** 機台主軸與進給門檻值 (CNC) */
      cncMainAxisTh: null
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
  },

  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },

    /**
     * 查詢
     */
    onSubmit(source) {
      const vm = this
      const payload = source
      vm.selectedDeviceId = payload.device
      payload.date = moment(payload.date).format('yyyy-MM-DD')
      vm.searchForm = payload
      console.log('payload', payload)

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

          this.getSquareData()
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 取得 主軸實際轉速 ＆ 進給率百分比 之圖表資料列表
     */
    getSquareData() {
      const vm = this
      const paylaod = {
        device: vm.selectedDeviceId,
        date: vm.searchForm.date
      }

      getIOTCNCDataCollection(paylaod)
        .then(response => {
          vm.iotCNCDataList = response.data.Payload.IOTCNCDataList
          vm.cncMainAxisTh = response.data.Payload.CNCMainAxis
          vm.statusInfo = response.data.Payload.StatusInfo
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
