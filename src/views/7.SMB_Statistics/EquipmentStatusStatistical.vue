<template>
  <div>
    <!-- 狀態統計 查詢表單 -->
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="日期">
        <el-date-picker v-model="searchForm.date" type="date" placeholder="請選日期" prop="SelectDate" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查詢</el-button>
        <el-button type="primary" @click="exportExcel">匯出Excel</el-button>
      </el-form-item>
    </el-form>

    <div>
      <div v-for="dataItem in dataList" :key="dataItem.className">
        <h3>{{ dataItem.className }}機台狀況 {{ searchFormDate }} ({{ dataItem.classTimeSpan }})</h3>
        <el-table
          :data="dataItem.device_info"
          style="width: 100%"
          border
          :header-cell-style="{ background: '#679cec', color: '#06011b' }"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="device_id" label="機台" />
          <el-table-column prop="run" label="Run時間">
            <template slot-scope="{ row }">
              <span>{{ findStatusToShowValue(row, 'Run') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="run_percentage" label="Run/時間百分比" :render-header="renderHeader">
            <template slot-scope="{ row }">
              <span>{{ findStatusToShowValue(row, 'Run_percentage') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="idle" label="Idle時間">
            <template slot-scope="{ row }">
              <span>{{ findStatusToShowValue(row, 'Idle') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="idle_percentage" label="Idle/時間百分比" :render-header="renderHeader">
            <template slot-scope="{ row }">
              <span>{{ findStatusToShowValue(row, 'Idle_percentage') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="down" label="Down時間">
            <template slot-scope="{ row }">
              <span>{{ findStatusToShowValue(row, 'Down') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="down_percentage" label="Down/時間百分比" :render-header="renderHeader">
            <template slot-scope="{ row }">
              <span>{{ findStatusToShowValue(row, 'Down_percentage') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Offline" label="Offline時間">
            <template slot-scope="{ row }">
              <span>{{ findStatusToShowValue(row, 'Offline') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="offline_percentage" label="Offline/時間百分比" :render-header="renderHeader">
            <template slot-scope="{ row }">
              <span>{{ findStatusToShowValue(row, 'Offline_percentage') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Disconnect" label="Disconnect時間">
            <template slot-scope="{ row }">
              <span>{{ findStatusToShowValue(row, 'Disconnect') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="disconnect_percentage" label="Disconnect/時間百分比" :render-header="renderHeader">
            <template slot-scope="{ row }">
              <span>{{ findStatusToShowValue(row, 'Disconnect_percentage') }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="utilization" label="設備稼動率">
            <template slot-scope="{ row }">
              <span>{{ row.utilization }}%</span>
            </template>
          </el-table-column>
          <el-table-column prop="countchange" label="生產次數累計" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  equipmentStatusStatistical,
  exportEquipmentStatusAccumulativeExcel
} from '@/api/SMBStatistical'
import moment from 'moment'

export default {
  data() {
    return {
      searchForm: {
        date: null
      },

      dataList: [],

      /** 設備種類 */
      category: null,

      searchFormDate: null,

      validateRules: {
        SelectDate: [{ required: true, message: '日期為必要項', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.setCategory()
  },

  methods: {

    /**
    * 標題換行
    * @param {*} header
    * @param {*} param1
    */
    renderHeader(header, { column }) {
      return header('span', {}, [
        header('span', {}, column.label.split('/')[0]),
        header('br'),
        header('span', {}, column.label.split('/')[1])
      ])
    },

    onSubmit() {
      const vm = this
      const payload = this.searchForm

      if (payload.date === null) {
        this.$message.error('請選日期!')
        return
      }

      payload.date = moment(payload.date).format('yyyy-MM-DD')
      vm.searchFormDate = payload.date
      payload.Category = this.category

      equipmentStatusStatistical(payload)
        .then(response => {
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
      if (findItem !== undefined) {
        return findItem.value
      }
    },

    headerStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: lightblue;color: #fff;font-weight: 500;'
      }
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
     * 匯出狀態統計Excel
     */
    exportExcel() {
      const vm = this
      const paylaod = {
        date: moment(vm.searchForm.date).format('YYYY-MM-DD'),
        Category: vm.category
      }

      exportEquipmentStatusAccumulativeExcel(paylaod).then(response => {
        const fileName = paylaod.date + '.xlsx'
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
    },

    /**
     * 稼動率
     * 50%以上使用45號顏色
     * 未滿50%使用白色
     */
    tableRowClassName({ row }) {
      if (parseFloat(row.utilization) >= parseFloat(50)) {
        console.log('tableRowClassName row.utilization', row.utilization)
        return 'utilization_ok'
      }
    }
  }
}
</script>

<style>
 .el-table .utilization_ok {
    background: #3cc73c;
  }
</style>
