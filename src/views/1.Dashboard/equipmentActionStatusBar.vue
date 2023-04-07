<template>
  <!--Dashboard/設備運行現況(長條圖)-->
  <div class="app-container">
    <category-select @OnSelectCategoryChange="getEquipmentPieChartDataCollection" />
    <EquipmentStatusBar :width="width" :height="height" :chart-data="chartDataCollection" />
  </div>
</template>

<script>
import { getDeviceStatusTimeLengthForBarList } from '@/api/SMBDevice'
import EquipmentStatusBar from '@/components/SMBChart/EquipmentStatusBar'
import CategorySelect from '@/components/DropDownList/CategorySelect'

export default {
  components: { EquipmentStatusBar, CategorySelect },
  data() {
    return {
      width: '100%',
      height: '800px',
      chartDataCollection: []
    }
  },

  created() {
    this.getDefaultEquipmentPieChartDataCollection()
  },

  beforeDestroy() {},

  methods: {
    getDefaultEquipmentPieChartDataCollection() {
      const vm = this
      vm.chartDataCollection = []
      const payload = {
        Category: ''
      }
      getDeviceStatusTimeLengthForBarList(payload).then(response => {
        vm.chartDataCollection = response.data.Payload
      })
    },

    /**
     * 取得設備的圓餅圖資料集合
     */
    getEquipmentPieChartDataCollection(source) {
      const vm = this
      vm.chartDataCollection = []
      const payload = {
        Category: source
      }
      getDeviceStatusTimeLengthForBarList(payload).then(response => {
        vm.chartDataCollection = response.data.Payload
      })
    }
  }
}
</script>
