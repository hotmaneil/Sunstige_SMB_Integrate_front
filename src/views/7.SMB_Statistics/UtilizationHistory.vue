<template>
  <div>
    <!-- 稼動率統計 查詢表單 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">

      <el-form-item label="日期">
        <el-date-picker
          v-model="selectDate"
          type="daterange"
          range-separator="To"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
          @change="selectDateToDistribute()"
        />
      </el-form-item>

      <el-form-item label="機台">
        <el-select v-model="searchForm.device_id" placeholder="請選機台">
          <el-option v-for="item in deviceList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查詢</el-button>
      </el-form-item>
    </el-form>

    <UtilizationHistoryChart :device-id="searchForm.device_id" :graph-list="chartData" height="300px" width="100%" />

    <div>
      <div style="float:right">
        <el-button v-if="dataList.length>0" type="primary" @click="exportExcel">匯出Excel</el-button>
      </div>

      <div v-for="dataItem in dataList" :key="dataItem.className">
        <h3>{{ dataItem.className }}機台狀況({{ dataItem.classTimeSpan }})</h3>
        <el-table
          :data="dataItem.device_info"
          style="width: 100%"
          border
          stripe
          :header-cell-style="{ background: '#679cec', color: '#06011b' }"
        >
          <el-table-column prop="cal_date" label="日期" />
          <el-table-column prop="run" label="Run時間">
            <template slot-scope="{ row }">
              <span>{{ findStatusToShowValue(row, 'Run') }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="idle" label="Idle時間">
            <template slot-scope="{ row }">
              <span>{{ findStatusToShowValue(row, 'Idle') }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="down" label="Down時間">
            <template slot-scope="{ row }">
              <span>{{ findStatusToShowValue(row, 'Down') }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="Offline" label="Offline時間">
            <template slot-scope="{ row }">
              <span>{{ findStatusToShowValue(row, 'Offline') }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="Disconnect" label="Disconnect時間">
            <template slot-scope="{ row }">
              <span>{{ findStatusToShowValue(row, 'Disconnect') }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="utilization" label="稼動率">
            <template slot-scope="{ row }">
              <span>{{ row.utilization }}%</span>
            </template>
          </el-table-column>
          <el-table-column prop="countchange" label="生產模次" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { utilizationHistory,
  getUtilizationStatisticalList,
  exportquipmentStatusAccumulativeDateDataExcel
} from '@/api/SMBStatistical'
import { getDeviceListByCategory } from '@/api/SMBDevice'
import moment from 'moment'

export default {
  components: {
    UtilizationHistoryChart: () => import('@/components/SMBChart/UtilizationHistoryChart'),
    utilizationHistory
  },
  data() {
    return {
      selectDate: [],

      searchForm: {
        startDate: null,
        endDate: null,
        device_id: null
      },

      chartData: [],

      /** 機台列表 */
      deviceList: [],

      dataList: []
    }
  },

  created() {
    this.setCategory()
    this.getDeviceList()
  },

  methods: {
    /**
     * 取得機台列表
     */
    getDeviceList() {
      const vm = this
      const payload = {
        Category: vm.category,
        Orderby: 'sequence',
        Power: 'asc'
      }
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
    onSubmit() {
      const vm = this
      const payload = this.searchForm

      utilizationHistory(payload)
        .then(response => {
          console.log('response', response.data.Payload)
          vm.chartData = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })

      this.UtilizationStatisticalList(payload)
    },

    /**
     * 選取雙日期範圍元件並分配值
     */
    selectDateToDistribute() {
      const vm = this
      vm.searchForm.startDate = moment(vm.selectDate[0]).format('yyyy-MM-DD')
      vm.searchForm.endDate = moment(vm.selectDate[1]).format('yyyy-MM-DD')
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
    },

    /**
     * 取得稼動率趨勢圖 列表
     */
    UtilizationStatisticalList() {
      const vm = this
      const payload = this.searchForm

      getUtilizationStatisticalList(payload)
        .then(response => {
          console.log('getUtilizationStatisticalList', response.data.Payload)
          vm.dataList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 依照狀態尋找 status_time_info並顯示值
     */
    findStatusToShowValue(source, statusName) {
      var findItem = source.status_time_info.find(element => element.id === statusName)
      if (findItem === undefined) {
        return ''
      } else {
        return findItem.value
      }
    },

    /**
     * 匯出狀態統計Excel
     */
    exportExcel() {
      const vm = this
      const payload = vm.searchForm

      exportquipmentStatusAccumulativeDateDataExcel(payload).then(response => {
        const fileName = vm.searchForm.device_id + '.xlsx'
        console.log('exportEquipmentStatusAccumulativeExcel fileName', fileName)

        var blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }, fileName)

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          console.log('navigator1')
          window.navigator.msSaveOrOpenBlob(blob, fileName)
        } else {
          console.log('navigator2')
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob)
          downloadElement.href = href
          downloadElement.download = response.fileName
          document.body.appendChild(downloadElement)
          downloadElement.click()
          document.body.removeChild(downloadElement)
          window.URL.revokeObjectURL(href)
        }
      })
    }
  }
}
</script>
