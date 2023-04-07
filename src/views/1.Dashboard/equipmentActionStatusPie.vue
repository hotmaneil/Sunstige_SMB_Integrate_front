<template>
  <!--Dashboard/設備運行現況(新增)-->
  <div class="app-container">
    <category-select @OnSelectCategoryChange="getEquipmentPieChartDataCollection" />
    <el-row>
      <el-col v-for="item in pieChartDataCollection" :key="item.device_id" :span="8">
        <el-card>
          <div slot="header" style="text-align: center;">
            <span> {{ item.device_id }}</span>
          </div>
          <el-row>
            <el-col :span="6">
              <br><br><br><br><br><br>
              <h1>{{ item.utilization }}%</h1>
            </el-col>

            <el-col :span="18">
              <equipment-pie-chart :width="width" :height="height" :pie-chart-data="item.StatusTimeRateList" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDeviceForStatusTimeRateList } from '@/api/SMBDevice'
import equipmentPieChart from '@/components/FactoryEquipment/equipmentPieChart'
import CategorySelect from '@/components/DropDownList/CategorySelect'
export default {
  components: { equipmentPieChart, CategorySelect },
  data() {
    return {
      width: '300px',
      height: '350px',
      pieChartDataCollection: []
    }
  },

  created() {
    this.getDefaultEquipmentPieChartDataCollection()
  },

  beforeDestroy() {},

  methods: {
    getDefaultEquipmentPieChartDataCollection() {
      const vm = this
      vm.pieChartDataCollection = []
      const payload = {
        Category: ''
      }
      getDeviceForStatusTimeRateList(payload).then(response => {
        vm.pieChartDataCollection = response.data.Payload
      })
    },

    /**
     * 取得設備的圓餅圖資料集合
     */
    getEquipmentPieChartDataCollection(source) {
      const vm = this
      vm.pieChartDataCollection = []
      const payload = {
        Category: source
      }
      getDeviceForStatusTimeRateList(payload).then(response => {
        vm.pieChartDataCollection = response.data.Payload
      })
    }
  }
}
</script>
