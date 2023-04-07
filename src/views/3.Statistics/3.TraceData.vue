<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-date-picker v-model="SelectedDate" type="date" placeholder="請選取日期" />
        <el-time-picker
          v-model="SelectedTime"
          is-range
          range-separator="To"
          start-placeholder="開始時間"
          end-placeholder="結束時間"
        />
      </el-col>

      <el-col :span="12">
        <equipment-select
          :equipmentid.sync="SelectEquipmentID"
          :is-default-select="false"
          @OnSelectEquipmentChange="OnChangeEquipmentID"
        />
      </el-col>
    </el-row>

    <div style="clear: both">
      <!--<pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        style="float: left"
        @pagination="getResponseList"
      />-->
      <!--v-loading="listLoading"-->
      <el-table
        :data="listtrace"
        element-loading-text="Loading"
        border
        fit
        stripe
        highlight-current-row
        style="width: 100%"
        :max-height="tableHeight"
        :default-sort="{ prop: 'TriggerTime', order: 'descending' }"
        :row-style="rowStyle"
        @sort-change="changeTableSort"
      >
        <el-table-column prop="TriggerTime" label="觸發時間" width="170" sortable="custom">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.TriggerTime | formatDateFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="EquipmentID" label="設備" width="140" align="center" sortable="custom">
          <template slot-scope="scope">
            {{ scope.row.EquipmentID }}
          </template>
        </el-table-column>
        <el-table-column prop="FieldID" label="欄位ID" align="center" sortable="custom">
          <template slot-scope="scope">
            {{ scope.row.NodeName }}
          </template>
        </el-table-column>
        <el-table-column label="欄位名稱" align="center">
          <template slot-scope="scope">
            {{ scope.row.FieldName }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="TraceReportID" align="center">
          <template slot-scope="scope">
            {{ scope.row.ReportID }}
          </template>
        </el-table-column> -->
        <el-table-column label="新值" align="center">
          <template slot-scope="scope">
            <span :type="LimitFilter(scope.row)"> {{ scope.row.NewValue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="舊值" align="center">
          <template slot-scope="scope">
            {{ scope.row.OldValue }}
          </template>
        </el-table-column>

        <!-- <el-table-column width="100" align="center">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="small"
              @click="OnSetEdit('view', scope.row)"
            >View</el-button>
          </template>
        </el-table-column> -->
      </el-table>

      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getResponseList"
      />

      <molding-set-value-view-dialog
        :model="TraceItem"
        :is-visible="SetValueViewVisible"
        @onDialogVisible="OnSetValueViewDialogVisible"
      />
    </div>
  </div>
</template>

<script>
import { getHistoryList } from '@/api/History'
// import { getList as getMoldingBackup } from '@/api/MoldingBackup'

import { getEquipment } from '@/api/Equipments'
import { isNullOrEmpty, formatDate, changeBetweenDate } from '@/utils/validate'
import moment from 'moment'
import Pagination from '@/components/Pagination'
import EquipmentSelect from '@/components/DropDownList/EquipmentSelect'
import MoldingSetValueViewDialog from '@/components/MoldingSetValueViewDialog'

import { windowHeight } from '@/utils'

export default {
  components: {
    Pagination,
    EquipmentSelect,
    MoldingSetValueViewDialog
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        Setting: 'danger',
        Down: 'danger',
        Resetting: 'success'
      }
      return statusMap[status]
    },
    formatDateFilter(value) {
      return formatDate(value)
    }
  },
  data() {
    return {
      // listLoading: true,
      equipment: {},
      listtrace: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 50
      },
      SelectEquipmentID: '',

      order_prop: 'TriggerTime',
      desc_prop: 1,

      SelectedDate: null,
      SelectedTime: null,

      tableHeight: windowHeight() - 250,
      createTime: changeBetweenDate(formatDate(Date.now()), formatDate(Date.now())),

      // 檢視的dialog
      SetValueViewVisible: false,
      TraceItem: {},
      // 存檔的dialog
      SaveItemVisible: false,
      SaveItem: {}
    }
  },
  created() {
    clearInterval(this.timer)
    this.timer = null
    this.setTimer()
    this.SaveItemVisible = false
    // this.listLoading = true
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    setTimer() {
      this.timer = setInterval(() => {
        // console.log('this.SelectEquipmentID', this.SelectEquipmentID)
        if (!isNullOrEmpty(this.SelectEquipmentID)) {
          // loadingUI()
          this.GET_EquipmentsList(this.SelectEquipmentID).then(response => {
            this.equipment = response
            this.getResponseList()

            clearInterval(this.timer)
            this.timer = null
          })
        }
      }, 1000)
    },

    OnChangeEquipmentID(source) {
      console.log('OnChangeEquipmentID EquipmentID', source)
      this.SelectEquipmentID = source
      this.GET_EquipmentsList(this.SelectEquipmentID).then(response => {
        this.equipment = response
        this.getResponseList()
      })
    },

    getResponseList() {
      var params = {
        orderby_: this.order_prop,
        desc_: this.desc_prop,
        offset_: this.listQuery.page,
        fetch_: this.listQuery.limit,
        Code: 'Actual',
        EquipmentID: this.SelectEquipmentID,
        SelectedDate: moment(this.SelectedDate).format('YYYY/MM/DD'),
        SelectedStartTime: moment(this.SelectedTime[0]).format('YYYY/MM/DD HH:mm'),
        SelectedEndTime: moment(this.SelectedTime[1]).format('YYYY/MM/DD HH:mm')
      }

      getHistoryList(params).then(response => {
        this.listtrace = []

        response.data.Payload.map(x => {
          // console.log('x', x)

          var ff = this.equipment.Fields.find(f => {
            return f.FieldID === x.FieldID
          })

          x.FieldName = ff.FieldName
          x.NodeName = ff.NodeName

          x.IsLimit = ff.IsLimit
          x.UpperLimit = ff.UpperLimit
          x.LowerLimit = ff.LowerLimit

          this.listtrace.push(x)
        })

        this.total = response.data.Pagination.Total
        // this.listLoading = false
        // closeLoading()
      })
    },

    GET_EquipmentsList(equipment_id) {
      console.log('OnChangeEquipmentID EquipmentID', equipment_id)

      return new Promise((resolve, reject) => {
        getEquipment({
          EquipmentID: equipment_id,
          IsEnabled: 1,
          IsDisplay: 1
        })
          .then(response => {
            // 判斷是否 正確
            resolve(response.data.Payload)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    LimitFilter(row) {
      // console.log(row)
      if (row.IsLimit) {
        if (row.UpperLimit < row.newValue && row.LowerLimit > row.newValue) {
          return 'success'
        }
      }
      return 'danger'
    },

    rowStyle({ row, rowIndex }) {
      if (row.IsLimit) {
        if (row.UpperLimit < row.newValue && row.LowerLimit > row.newValue) {
          return 'color:green'
        }
      }
      return 'color:red'
    },

    changeTableSort(column) {
      if (column.order === 'ascending') {
        this.order_prop = column.prop
        this.desc_prop = 0
      } else if (column.order === 'descending') {
        this.order_prop = column.prop
        this.desc_prop = 1
      } else {
        this.order_prop = column.prop
        this.desc_prop = 0
      }
      this.getResponseList()
    },

    OnSetEdit(dialog, row) {
      console.log('OnSetEdit', dialog, row)
      //  <router-link :to="{ name: 'equipment', params: { EquipmentID: item.EquipmentID }}">
      this.$router.push({
        name: 'Molding',
        params: { EquipmentID: row.EquipmentID, ReportID: row.ReportID }
      })
      // if (dialog === 'view') {
      //   this.TraceItem = { Row: row, Eq: this.equipment }
      //   this.SetValueViewVisible = true
      // } else if (dialog === 'save') {
      //   console.log('save', dialog, row)
      // }
    },

    OnSetValueViewDialogVisible(visible, row) {
      this.SetValueViewVisible = visible
      console.log('OnSetValueViewDialogVisible', visible, row)
      this.getResponseList()
    },

    OnDateTimeRangeChange(val) {
      // 取得起迄日期
      if (val) {
        this.createTime = changeBetweenDate(formatDate(val[0]), formatDate(val[1]))
      } else {
        this.createTime = null
      }
      this.GET_EquipmentsList(this.SelectEquipmentID).then(response => {
        this.equipment = response
        this.getResponseList()
      })
    },

    // 設定值檢視
    showSetValue() {
      const { href } = this.$router.resolve({ name: 'Molding' })
      window.open(href, '_blank', 'toolbar=yes, width=1300, height=900')
    }
  }
}
</script>
