<template>
  <div class="app-container">
    <select-equipment
      :equipmentid.sync="SelectEquipmentID"
      :selectallflage="false"
      @OnSelectEquipmentChange="OnChangeEquipmentID"
    />

    <el-date-picker
      v-model="SelectedDate"
      type="date"
      placeholder="請選取日期"
    />

    <el-time-picker
      v-model="SelectedTime"
      is-range
      range-separator="To"
      start-placeholder="開始時間"
      end-placeholder="結束時間"
    />

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="Config" name="first">
        <graph-config v-if="isActiveOne" ref="GraphConfig" :equipmentid="SelectEquipmentID" />
      </el-tab-pane>

      <el-tab-pane label="分析圖表" name="second">
        <graph-display
          v-if="isActiveTwo"
          ref="GraphDisplay"
          :equipmentid="SelectEquipmentID"
          :selected-date="SelectedDate"
          :selected-time="SelectedTime"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SelectEquipment from '@/components/SelectEquipment'
import GraphConfig from '@/components/GraphConfig'
import GraphDisplay from '@/components/GraphDisplay'

import { isNullOrEmpty } from '@/utils/validate'
import moment from 'moment'

export default {
  components: { SelectEquipment, GraphConfig, GraphDisplay },
  filters: {},
  data() {
    return {
      SelectEquipmentID: '',
      activeName: 'first',
      isActiveOne: true,
      isActiveTwo: false,
      chartIDList: [],
      SelectedDate: null,
      SelectedTime: null
    }
  },
  created() {
    if (!isNullOrEmpty(this.$route.params.EquipmentID)) {
      this.SelectEquipmentID = this.$route.params.EquipmentID
    }

    clearInterval(this.timer)
    this.timer = null
    this.setTimer()

    this.setDefaultDateTime()
  },
  mounted() {},
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    setTimer() {},

    OnChangeEquipmentID() {
      // console.log('OnChangeEquipmentID EquipmentID', this.SelectEquipmentID)
    },

    handleClick(tab) {
      // console.log('tab', tab)
      if (tab.index === '0') {
        this.activeName = 'first'
        this.isActiveOne = true
        this.isActiveTwo = false
        this.chartIDList = []
      } else {
        this.activeName = 'second'
        this.isActiveOne = false
        this.isActiveTwo = true
      }
    },

    /**
     * 設定預設日期時間
     */
    setDefaultDateTime() {
      const vm = this
      vm.SelectedDate = new Date()
      vm.SelectedTime = []

      vm.SelectedTime.push(moment(new Date()).add(-2, 'hours'))
      vm.SelectedTime.push(new Date())
    }
  }
}
</script>

<style scoped>
.chart-container {
  margin: 10px;
  width: 80%;
  clear: left;
  height: calc(100vh - 148px);
}
</style>
