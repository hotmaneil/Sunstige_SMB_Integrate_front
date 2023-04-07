<template>
  <!-- 查詢表單 -->
  <div>
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline" :rule="validateRules">
      <el-form-item label="機台">
        <el-select v-model="searchForm.EquipmentIds" multiple placeholder="請選機台">
          <el-option v-for="item in deviceList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="日期">
        <el-date-picker
          v-model="searchForm.SelectDate"
          type="date"
          placeholder="請選擇日期"
          :picker-options="pickerOptions"
          prop="SelectDate"
        />
      </el-form-item>

      <el-form-item label="班別">
        <el-select v-model="searchForm.ClassIds" multiple placeholder="請選班別">
          <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="searchGroupCNCDataCollection()">查詢</el-button>
      </el-form-item>
    </el-form>

    <!-- 柱狀圖 -->
    <GroupCNCChart :group-data="groupCNCData" />

    <!-- Table -->
    <div style="text-align:right">
      <p style="color:gray">備註：稼動率以毫秒精度計</p>
    </div>
    <DxDataGrid
      :data-source="dataSource"
      :remote-operations="true"
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
        data-field="equipmentsid"
        caption="機台"
        data-type="string"
      />
      <DxColumn
        data-field="DateString"
        caption="日期"
        data-type="string"
        :allow-sorting="false"
      />
      <DxColumn
        data-field="classinfoname"
        caption="班別"
        data-type="string"
      />
      <DxColumn
        data-field="controllerpathprogrammainno"
        caption="主程式號碼"
        data-type="string"
      />
      <DxColumn
        data-field="controllertimepowerTime"
        caption="通電時間"
        data-type="string"
        :allow-sorting="false"
      />
      <DxColumn
        data-field="controllertimeoperationTime"
        caption="運轉時間"
        data-type="string"
        :allow-sorting="false"
      />
      <DxColumn
        data-field="controllertimecuttingTime"
        caption="切削時間"
        data-type="string"
        :allow-sorting="false"
      />
      <DxColumn
        data-field="timeinvalidTime"
        caption="無效時間"
        data-type="string"
        :allow-sorting="false"
      />
      <DxColumn
        data-field="productionquantity"
        caption="生產數量"
        data-type="string"
      />
      <DxColumn
        data-field="normalutilization"
        caption="一般稼動率"
        data-type="string"
        :customize-text="percentageFormatText"
      />
      <DxColumn
        data-field="effectivelutilization"
        caption="有效稼動率"
        data-type="string"
        :customize-text="percentageFormatText"
      />

      <DxSearchPanel
        :visible="true"
        :highlight-case-sensitive="true"
      />
      <DxPager
        :visible="true"
        :allowed-page-sizes="pageSizes"
        :show-page-size-selector="true"
      />
      <DxPaging
        :page-size="10"
        :page-index="0"
      />
    </DxDataGrid>
  </div>
</template>

<script>
import { getDeviceListByCategory } from '@/api/SMBDevice'
import { getList } from '@/api/SMBClassInfo'
import GroupCNCChart from '@/components/SMBChart/GroupCNCChart.vue'
import { getGroupCNCDataCollection, exportDayReportExcel } from '@/api/SMBStatistical'
import moment from 'moment'
import 'devextreme/dist/css/dx.light.css'
import {
  DxDataGrid,
  DxColumn,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxExport,
  DxSelection,
  DxColumnChooser
} from 'devextreme-vue/data-grid'
import CustomStore from 'devextreme/data/custom_store'
import { Workbook } from 'exceljs'
import { exportDataGrid } from 'devextreme/excel_exporter'
import { saveAs } from 'file-saver-es'

export default {
  components: {
    GroupCNCChart,
    DxDataGrid,
    DxColumn,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxExport,
    DxSelection,
    DxColumnChooser
  },
  filters: {
    percentageFormat(value) {
      return value + '%'
    }
  },

  data() {
    return {
      category: 'CNC',

      /** 機台列表 */
      deviceList: [],

      /** 班別列表 */
      classList: [],

      /** 日期下拉選項 */
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },

      /** 搜尋表單 */
      searchForm: {
        EquipmentIds: [],
        SelectDate: moment(new Date()).format('YYYY/MM/DD'),
        ClassIds: []
      },

      /** 柱狀圖 */
      groupCNCData: null,

      /** 分頁參數 */
      pageSizes: [5, 10, 20],

      /** 報表 */
      iotCNCReportDataList: null,
      dataSource: null,

      validateRules: {
        SelectDate: [{ required: true, message: '日期為必要項', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.getDeviceList()
    this.getClassList()
  },

  methods: {
    /**
     * 依照搜尋條件取得柱狀圖之CNC資料集合
     */
    searchGroupCNCDataCollection() {
      this.$refs['searchForm'].validate().then(() => {
        const vm = this

        // 先清空
        vm.groupCNCData = []
        vm.iotCNCReportDataList = []

        if (vm.searchForm.SelectDate === null) {
          this.$message.error('請選日期!')
          return
        }

        ~(async function() {
          const searchForStore = new CustomStore({
            key: 'equipmentsid',
            load: function(loadOptions) {
              console.log('loadOptions', loadOptions)
              const paylaod = {
                EquipmentIds: vm.searchForm.EquipmentIds,
                SelectDate: moment(vm.searchForm.SelectDate).format('YYYY/MM/DD'),
                orderby_: loadOptions.sort === null ? null : loadOptions.sort[0].selector,
                desc_: loadOptions.sort === null ? null : loadOptions.sort[0].desc,
                offset_: null,
                fetch_: loadOptions.take,
                skip: loadOptions.skip
              }

              var dataResult = getGroupCNCDataCollection(paylaod).then(response => {
                vm.groupCNCData = response.data.Payload.GroupCNCData
                vm.iotCNCReportDataList = response.data.Payload.IOTCNCReportDataList
                return response.data
              })
                .then((data) => (
                  {
                    data: data.Payload.IOTCNCReportDataList,
                    totalCount: data.Pagination.Total,
                    summary: data.summary,
                    groupCount: data.groupCount
                  }))
                .catch(() => {
                  throw new Error('Data Loading Error')
                })
              console.log('dataResult', dataResult)
              return dataResult
            }
          })
          vm.dataSource = await searchForStore
        }())
      })
    },

    /**
     * 匯出日稼動率報表Excel(隱藏)
     */
    exportExcel() {
      const vm = this
      const paylaod = {
        EquipmentIds: vm.searchForm.EquipmentIds,
        SelectDate: moment(vm.searchForm.SelectDate).format('YYYY/MM/DD'),
        ClassIds: vm.searchForm.ClassIds
      }

      exportDayReportExcel(paylaod).then(response => {
        var blob = new Blob([response.data], {
          type: 'application/vnd.ms-excel;charset=utf-8'
        })

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, response.fileName)
        } else {
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
     * 取得班別列表
     */
    getClassList() {
      const vm = this
      getList()
        .then(response => {
          vm.classList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
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
      const selectDate = moment(this.searchForm.SelectDate).format('YYYYMMDD')
      const fileName = 'DayReport_' + selectDate

      const workbook = new Workbook()
      const worksheet = workbook.addWorksheet(selectDate)

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
