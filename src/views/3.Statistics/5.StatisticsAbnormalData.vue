<template>
  <div class="app-container">
    <select-equipment
      :equipmentid.sync="SelectEquipmentID"
      :selectallflage="false"
      :isdaterange="true"
      @OnSelectEquipmentChange="OnChangeEquipmentID"
      @OnDateTimeRangeChange="OnDateTimeRangeChange"
    />
    <div style="clear: both;">
      <!--<pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        style="float: left"
        @pagination="getResponseList"
      />-->
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
        <el-table-column prop="GroupName" label="群組名稱" align="center" sortable="custom">
          <template slot-scope="scope">
            {{ scope.row.GroupName }}
          </template>
        </el-table-column>
        <el-table-column prop="FieldName" label="欄位名稱" align="center" sortable="custom">
          <template slot-scope="scope">
            {{ scope.row.FieldName }}
          </template>
        </el-table-column>
        <el-table-column prop="AlarmCode" label="異常代碼" align="center" sortable="custom">
          <template slot-scope="scope">
            {{ scope.row.AlarmCode }}
          </template>
        </el-table-column>

        <el-table-column label="異常訊息" align="center">
          <template slot-scope="scope">
            {{ scope.row.AlarmMessage }}
          </template>
        </el-table-column>

        <el-table-column label="原因" align="center">
          <template slot-scope="scope">
            {{ scope.row.Reason }}
          </template>
        </el-table-column>

        <el-table-column label="值" align="center">
          <template slot-scope="scope">
            {{ scope.row.Value }}
          </template>
        </el-table-column>
      </el-table>

      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getResponseList"
      />

      <setting-dialog-field :model="fieldItem" :is-visible="fieldItemVisible" @onDialogVisible="OnFieldDialogVisible" />
    </div>
  </div>
</template>

<script>
import { getEquipment } from '@/api/Equipments'
import { getAbnormal } from '@/api/AlarmReport'
import { isNullOrEmpty, formatDate, changeBetweenDate } from '@/utils/validate'
import Pagination from '@/components/Pagination'
import SelectEquipment from '@/components/SelectEquipment'

import SettingDialogField from '@/components/SettingDialogField'
import { windowHeight } from '@/utils'
// import { loadingUI, closeLoading } from '@/utils/loading' // loading遮罩
// import MoldingViewDialog from '@/components/MoldingViewDialog'  //MoldingViewDialog,

export default {
  components: { Pagination, SelectEquipment, SettingDialogField },
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
      SetValueFields: [],
      listtrace: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 50
      },
      SelectEquipmentID: '',
      order_prop: 'TriggerTime',
      desc_prop: 1,
      groupItemVisible: false,
      groupItem: [],
      fieldItemVisible: false,
      fieldItem: {},
      tableHeight: windowHeight() - 250,
      createTime: changeBetweenDate(formatDate(Date.now()), formatDate(Date.now()))
    }
  },
  created() {
    clearInterval(this.timer)
    this.timer = null
    this.setTimer()
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

    OnChangeEquipmentID() {
      console.log('OnChangeEquipmentID EquipmentID', this.SelectEquipmentID)

      this.GET_EquipmentsList(this.SelectEquipmentID).then(response => {
        this.equipment = response
        this.getResponseList()
      })
    },

    getResponseList() {
      if (!isNullOrEmpty(this.SelectEquipmentID)) {
        var params = {
          orderby_: this.order_prop,
          desc_: this.desc_prop,
          offset_: this.listQuery.page,
          fetch_: this.listQuery.limit,
          GroupName: 'Actual',
          EquipmentID: this.SelectEquipmentID,
          CreateTime: this.createTime
        }

        // // console.log('params', params)

        getAbnormal(params).then(response => {
          this.listtrace = []
          response.data.Payload.map(x => {
            var ff = this.equipment.Fields.find(f => {
              return f.FieldID === x.FieldID
            })

            if (ff !== undefined) {
              x.FieldName = ff.FieldName
              x.NodeName = ff.NodeName
            }
            this.listtrace.push(x)
          })
          this.total = response.data.Pagination.Total
          // this.listLoading = false
          //   closeLoading()
        })
      }
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

    GET_EquipmentsList(equipment_id) {
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

    OnSetEdit(dialog, row) {
      console.log('OnSetEdit', dialog, row)

      if (dialog === 'group') {
        this.groupItem = row
        this.groupItemVisible = true
      } else if (dialog === 'field') {
        this.fieldItem = row
        this.fieldItemVisible = true
      }
    },
    OnMoldDialogVisible(visible, row) {
      this.moldDItemVisible = visible
      console.log('OnMoldDialogVisible', visible, row)
      this.getResponseList()
    },
    OnFieldDialogVisible(visible, row) {
      this.fieldItemVisible = visible
      console.log('OnFieldDialogVisible', visible, row)
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
    }
  }
}
</script>
