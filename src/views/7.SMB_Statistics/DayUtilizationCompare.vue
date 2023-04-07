<template>
  <div>
    <query-form2 ref="queryForm2" :category="category" @sendSubmit="onSubmit" />

    <histogram-stack :chart-data="chartData" />
    <DxDataGrid
      :data-source="reportList"
      :remote-operations="false"
      :allow-column-reordering="true"
      :row-alternation-enabled="true"
      :show-borders="true"
      @exporting="onExporting"
    >
      <DxColumnChooser :enabled="true" mode="select" />
      <DxSelection mode="multiple" />
      <DxExport
        :enabled="true"
        :allow-export-selected-data="true"
      />
      <DxColumn
        data-field="device_id"
        caption="機台"
        data-type="string"
      />
      <DxColumn
        data-field="runTimeString"
        caption="Run時間"
        data-type="string"
      />
      <DxColumn
        data-field="runPercentageString"
        caption="Run百分比"
        data-type="string"
      />
      <DxColumn
        data-field="idleTimeString"
        caption="Idle時間"
        data-type="string"
      />
      <DxColumn
        data-field="idlePercentageString"
        caption="Idle百分比"
        data-type="string"
      />
      <DxColumn
        data-field="downTimeString"
        caption="Down時間"
        data-type="string"
      />
      <DxColumn
        data-field="downPercentageString"
        caption="Down百分比"
        data-type="string"
      />
      <DxColumn
        data-field="offlineTimeString"
        caption="Offline時間"
        data-type="string"
      />
      <DxColumn
        data-field="offlinePercentageString"
        caption="Offlinen百分比"
        data-type="string"
      />
      <DxColumn
        data-field="disconnectTimeString"
        caption="Disconnect時間"
        data-type="string"
      />
      <DxColumn
        data-field="disconnectPercentageString"
        caption="Disconnectn百分比"
        data-type="string"
      />
      <DxColumn
        data-field="utilization"
        caption="稼動率"
        data-type="string"
        :customize-text="percentageFormatText"
      />
      <DxColumn
        data-field="countchange"
        caption="目前生產總量"
        data-type="string"
      />
      <DxSearchPanel
        :visible="true"
        :highlight-case-sensitive="true"
      />
    </DxDataGrid>
  </div>
</template>

<script>
import HistogramStack from '@/components/SMBChart/HistogramStack'
import QueryForm2 from '@/components/SMB/QueryForm2'
import { getDayUtilization, getDeviceStatusTimeRateList } from '@/api/SMBStatistical'
import moment from 'moment'
import 'devextreme/dist/css/dx.light.css'
import {
  DxDataGrid,
  DxColumn,
  DxSearchPanel,
  DxExport,
  DxSelection,
  DxColumnChooser
} from 'devextreme-vue/data-grid'
import { Workbook } from 'exceljs'
import { exportDataGrid } from 'devextreme/excel_exporter'
import { saveAs } from 'file-saver-es'

export default {
  components: {
    HistogramStack,
    QueryForm2,
    DxDataGrid,
    DxColumn,
    DxSearchPanel,
    DxExport,
    DxSelection,
    DxColumnChooser
  },
  data() {
    return {
      /** 設備種類 */
      category: null,

      chartData: [],

      /** 下方列表 */
      reportList: []
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

    /**
     * 查詢
     */
    onSubmit(source) {
      const vm = this

      if (source.date === null) {
        this.$message.error('請選日期!')
        if (source.allDevices) {
          this.$refs['queryForm2'].clearDevices()
        }
        return
      }

      const payload = source
      payload.date = moment(payload.date).format('yyyy-MM-DD')

      getDayUtilization(payload)
        .then(response => {
          console.log('response', response.data.Payload)
          vm.chartData = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })

      getDeviceStatusTimeRateList(payload)
        .then(response => {
          console.log('response', response.data.Payload)
          vm.reportList = response.data.Payload
        })
        .then(() => {
          if (source.allDevices && vm.reportList.length > 0) {
            console.log('清空deviceList')
            this.$refs['queryForm2'].clearDevices()
          }
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
    },

    /**
     * 百分比文字格式
     * @param {*} cellInfo
     */
    percentageFormatText(cellInfo) {
      return cellInfo.value + '%'
    },

    /**
     * 匯出Excel
     * @param {*} e
     */
    onExporting(e) {
      const nowTime = moment(new Date()).format('YYYYMMDDHHmm')
      const fileName = 'DayUtilicationReport_' + nowTime

      const workbook = new Workbook()
      const worksheet = workbook.addWorksheet('DayUtilicationReport')

      exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName + '.xlsx')
        })
      })
      e.cancel = true
    }
  }
}
</script>
