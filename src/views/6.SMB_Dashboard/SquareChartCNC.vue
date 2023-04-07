<template>
  <div class="chart-container">

    <equipment-select
      :is-default-select="false"
      :category="category"
      :float-value="floatValue"
      :equipment-id="selectedDeviceId"
      @OnSelectEquipmentChange="clickSelectDeviceId"
    />

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
  </div>
</template>

<script>
import { only } from '@/api/Equipments'
import { getDeviceListByCategory } from '@/api/SMBDevice'
import SquareChart from '@/components/SMBChart/SquareChart'
import CNCStatusInfo from '@/components/SMBChart/CNCStatusInfo'
import { getIOTCNCDataCollection } from '@/api/SMBStatistical'
import EquipmentSelect from '@/components/DropDownList/EquipmentSelect'

export default {
  components: { SquareChart, CNCStatusInfo, EquipmentSelect },
  props: {},
  data() {
    return {
      /** 設備列表 */
      deviceList: [],

      iotCNCDataList: [],

      statusInfo: null,

      /** 機台主軸與進給門檻值 (CNC) */
      cncMainAxisTh: null,

      /** 設備種類 */
      category: null,

      /** 選取的設備Id */
      selectedDeviceId: null,

      floatValue: 'left',

      equipmentList: [],

      EquipmentId: null,

      styleValue: null
    }
  },

  created() {
    this.setCategory()
    this.getdeviceList()
    this.getEquipmentsList()
    // this.getSquareData()
  },

  methods: {
    /**
     * 取得設備總覽
     */
    getdeviceList() {
      const vm = this
      const payload = { Category: vm.category }
      getDeviceListByCategory(payload).then(response => {
        vm.deviceList = response.data.Payload
        if (vm.deviceList.length > 0) {
          if (vm.selectedDeviceId === null) {
            vm.selectedDeviceId = vm.deviceList[0].id
          } else {
            vm.selectedDeviceId = vm.$store.state.device.selectedDeviceId
          }
        }
        this.getGraphInfo()
      })
    },

    /**
     * 按下選取設備Id
     * @param {*} source
     */
    clickSelectDeviceId(source) {
      console.log('clickSelectDeviceId source', source)
      const vm = this
      vm.selectedDeviceId = source
      this.$store.dispatch('device/setSelectedDeviceId', source)
      this.getSquareData()
    },

    /**
     * 取得 主軸實際轉速 ＆ 進給率百分比 之圖表資料列表
     */
    getSquareData() {
      const vm = this
      const paylaod = {
        device: vm.selectedDeviceId
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
      const index = routePath.indexOf('/', 1)
      const catchString = routePath.substring(index + 1, routePath.length)
      console.log('catchString', catchString)
      this.category = catchString
    },

    /**
     * 取得設備列表
     */
    getEquipmentsList() {
      const payload = { Category: this.category }
      only(payload)
        .then(response => {
          this.equipmentList = response.data.Payload
        })
        .catch(error => {
          console.log(error)
        })
    },

    /**
     * 切換時變更選擇的設備編號
     */
    changeSelectedDeviceId() {
      this.selectedDeviceId = this.$store.state.device.selectedDeviceId
      this.getSquareData()
    }
  }
}
</script>
