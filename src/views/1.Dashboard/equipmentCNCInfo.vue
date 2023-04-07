<template>
  <div class="app-container">
    <EquipmentTimeSelect
      :equipmentid.sync="SelectEquipmentID"
      :category="category"
      :is-default-select="false"
      :start-time.sync="SelectTime.StartTime"
      :end-time.sync="SelectTime.EndTime"
      :active-name="activeName"
      @OnQuery="OnQuery"
    />

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="加工資訊" name="ProcessInfo">
        <!-- 主軸負載 -->
        <SquareChart
          v-show="isShowSquareChart()"
          :square-data="iotCNCDataList"
          :main-axis-th="cncMainAxisTh"
          field-item="spindleload"
          title="主軸負載"
        />

        <!-- 看板 -->
        <ProcessInfoPane :equipmentid="SelectEquipmentID" />
      </el-tab-pane>

      <el-tab-pane label="狀態歷程" name="StatusLog">
        <device-status-tab-pane
          v-if="isStatusLog"
          ref="statusTab"
          :equipmentid="SelectEquipmentID"
          :start-time="SelectTime.StartTime"
          :end-time="SelectTime.EndTime"
        />
      </el-tab-pane>

      <el-tab-pane label="錯誤發生歷程" name="ErrorLog">
        <device-alarm-tab-pane
          v-if="isErrorLog"
          ref="alarmTab"
          :equipmentid="SelectEquipmentID"
          :start-time="SelectTime.StartTime"
          :end-time="SelectTime.EndTime"
        />
      </el-tab-pane>

      <!-- 暫時隱藏 -->
      <!-- <el-tab-pane label="上傳／下載程式" name="UploadDownload">
        <upload-download-program />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import DeviceStatusTabPane from '@/components/DeviceStatusTabPane'
import DeviceAlarmTabPane from '@/components/DeviceAlarmTabPane'
import EquipmentTimeSelect from '@/components/DropDownList/EquipmentTimeSelect'
import ProcessInfoPane from '@/components/CNC/ProcessInfoPane'
import UploadDownloadProgram from '@/components/CNC/UploadDownloadProgram'
import SquareChart from '@/components/SMBChart/SquareChart'
import { getIOTCNCDataCollection } from '@/api/SMBStatistical'
import { SumDataReduce } from '@/utils/tool'

export default {
  components: {
    DeviceStatusTabPane,
    DeviceAlarmTabPane,
    EquipmentTimeSelect,
    ProcessInfoPane,
    UploadDownloadProgram,
    SquareChart
  },

  data() {
    return {
      iotCNCDataList: [],

      statusInfo: null,

      SelectEquipmentID: '',

      SelectTime: {
        StartTime: null,
        EndTime: null
      },

      /** 設備種類 */
      category: null,

      /** 機台主軸與進給門檻值 (CNC) */
      cncMainAxisTh: null,

      isProcessInfo: true,
      isUploadDownload: false,
      isStatusLog: false,
      isSetValueLog: false,
      isErrorLog: false,

      activeName: 'ProcessInfo'
    }
  },

  created() {
    this.setCategory()
  },

  mounted() {
    this.getSquareData()
  },

  methods: {
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
     * Tab切換
     */
    handleClick(tab) {
      // // console.log('tab', tab)
      this.isProcessInfo = false
      this.isUploadDownload = false
      this.isStatusLog = false
      this.isErrorLog = false
      switch (tab.index) {
        case '0':
          this.activeName = 'ProcessInfo'
          this.isProcessInfo = true
          break
        case '1':
          this.activeName = 'StatusLog'
          this.isStatusLog = true
          break
        case '2':
          this.activeName = 'ErrorLog'
          this.isErrorLog = true
          break
        case '3':
          this.activeName = 'UploadDownload'
          this.isUploadDownload = true
          break
      }
    },

    /**
     * 取得主軸負載之圖表資料列表
     */
    getSquareData(source) {
      const vm = this
      vm.SelectEquipmentID = source.EquipmentId
      const paylaod = {
        device: vm.SelectEquipmentID
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

    OnQuery(source) {
      console.log('OnQuery source', source)

      this.SelectEquipmentID = source.EquipmentId
      this.SelectTime.StartTime = source.StartTime
      this.SelectTime.EndTime = source.EndTime

      setTimeout(() => {
        console.log('非同步事件延遲100毫秒')
        switch (this.activeName) {
          case 'ProcessInfo':
            this.getSquareData(source)
            break

          case 'StatusLog':
            this.$refs.statusTab.getResponseList()
            break

          case 'ErrorLog':
            this.$refs.alarmTab.getResponseList()
            break
        }
      }, 100)
    },

    /**
     * 依照主軸負載加總結果判斷是否顯示主軸負載圖表
     */
    isShowSquareChart() {
      var result = false
      if (this.iotCNCDataList.length > 0) {
        var seriesData = []
        this.iotCNCDataList.forEach(element => {
          seriesData.push(element.spindleload)
        })

        var sumSeriesData = SumDataReduce(seriesData)
        if (sumSeriesData === 0) {
          result = false
        } else {
          result = true
        }
      } else {
        result = false
      }
      return result
    }
  }
}
</script>
