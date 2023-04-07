<template>
  <!-- 查詢表單 -->
  <div>
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline" :rule="validateRules">
      <el-form-item label="年月">
        <el-date-picker v-model="searchForm.YearMonth" type="month" placeholder="年月" prop="YearMonth" />
      </el-form-item>

      <el-form-item label="機台">
        <el-select v-model="searchForm.EquipmentIds" multiple placeholder="請選機台">
          <el-option v-for="item in deviceList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="searchMonthGroupCNCDataCollection()">查詢</el-button>
      </el-form-item>
    </el-form>

    <!-- 柱狀圖 -->
    <GroupCNCChart :group-data="groupCNCData" />

    <!-- Table -->
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
import GroupCNCChart from '@/components/SMBChart/GroupCNCChart.vue'
import { getMonthGroupCNCDataCollection } from '@/api/SMBStatistical'
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

      /** 搜尋表單 */
      searchForm: {
        EquipmentIds: [],
        YearMonth: null
      },

      /** 柱狀圖 */
      groupCNCData: {},

      /** 分頁參數 */
      pageSizes: [5, 10, 20],

      /** 報表 */
      iotCNCReportDataList: null,
      dataSource: null,

      validateRules: {
        YearMonth: [{ required: true, message: '年月為必要項', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.getDeviceList()
  },

  methods: {
    /**
     * 依照搜尋條件取得柱狀圖之CNC月報表資料集合
     */
    searchMonthGroupCNCDataCollection() {
      this.$refs['searchForm'].validate().then(() => {
        const vm = this

        // 先清空
        vm.groupCNCData = {}
        vm.iotCNCReportDataList = []

        if (vm.searchForm.YearMonth === null) {
          this.$message.error('請選年月!')
          return
        }

        if (vm.searchForm.EquipmentIds.length === 0) {
          this.$message.error('請選機台!')
          return
        }

        ~(async function() {
          const searchForStore = new CustomStore({
            key: 'equipmentsid',
            load: function(loadOptions) {
              console.log('loadOptions', loadOptions)
              const paylaod = {
                EquipmentIds: vm.searchForm.EquipmentIds,
                YearMonth: moment(vm.searchForm.YearMonth).format('YYYY/MM/DD'),
                orderby_: loadOptions.sort === null ? null : loadOptions.sort[0].selector,
                desc_: loadOptions.sort === null ? null : loadOptions.sort[0].desc,
                offset_: null,
                fetch_: loadOptions.take,
                skip: loadOptions.skip
              }

              var dataResult = getMonthGroupCNCDataCollection(paylaod)
                .then((response) => {
                  vm.groupCNCData = response.data.Payload.GroupCNCDataMonth
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
      const selectYearMonth = moment(this.searchForm.YearMonth).format('YYYYMM')
      const fileName = 'YearMonthReport_' + selectYearMonth

      const workbook = new Workbook()
      const worksheet = workbook.addWorksheet(selectYearMonth)

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
