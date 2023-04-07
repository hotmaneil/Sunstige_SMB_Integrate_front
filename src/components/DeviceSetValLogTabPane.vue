<template>
  <div>
    <el-table
      :data="list"
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
      <el-table-column
        prop="TriggerTime"
        label="觸發時間"
        width="170"
        sortable="custom"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.TriggerTime | formatDateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="EquipmentID"
        label="設備"
        width="140"
        align="center"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.EquipmentID }}
        </template>
      </el-table-column>
      <el-table-column
        prop="FieldID"
        label="欄位ID"
        align="center"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.NodeName }}
        </template>
      </el-table-column>
      <el-table-column label="欄位名稱" align="center">
        <template slot-scope="scope">
          {{ scope.row.FieldName }}
        </template>
      </el-table-column>
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
    </el-table>

    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getResponseList"
    />
  </div>
</template>

<script>
import { getHistoryList } from '@/api/History'
import { getEquipment } from '@/api/Equipments'
import { formatDate, changeBetweenDate } from '@/utils/validate'
import Pagination from '@/components/Pagination'
import { windowHeight } from '@/utils'
import moment from 'moment'

export default {
  components: { Pagination },
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
  props: {
    equipmentid: {
      type: String,
      default: null
    },

    startTime: {
      type: Date,
      default: function() {
        return null
      }
    },

    endTime: {
      type: Date,
      default: function() {
        return null
      }
    }
  },
  data() {
    return {
      list: [],
      equipment: {},
      total: 0,
      listQuery: {
        page: 1,
        limit: 50
      },
      order_prop: 'TriggerTime', desc_prop: 1,
      tableHeight: windowHeight() - 250
    }
  },
  watch: {
    equipmentid: {
      handler(val) {
        if (val === null) {
          return
        }

        this.GET_EquipmentsList(this.equipmentid).then(response => {
          this.equipment = response
          this.getResponseList()
        })
      }
    }
  },
  created() {
    if (this.equipmentid !== null) {
      this.GET_EquipmentsList(this.equipmentid).then(response => {
        this.equipment = response
        this.getResponseList()
      })
    }
  },
  methods: {
    async getResponseList() {
      // console.log('equipmentid', this.equipmentid)

      // this.listLoading = false
      var params = {
        orderby_: this.order_prop, desc_: this.desc_prop,
        offset_: this.listQuery.page,
        fetch_: this.listQuery.limit,
        Code: 'SetValue',
        EquipmentID: this.equipmentid,
        CreateTimeStart: moment(this.startTime).format('yyyy-MM-DD HH:mm:ss'),
        CreateTimeEnd: moment(this.endTime).format('yyyy-MM-DD HH:mm:ss')
      }

      await getHistoryList(params).then(response => {
        this.list = []

        response.data.Payload.map(x => {
          var ff = this.equipment.Fields.find(f => {
            return f.FieldID === x.FieldID
          })

          console.log('items', ff)

          if (ff !== undefined) {
            x.FieldName = ff.FieldName
            x.NodeName = ff.NodeName

            x.IsLimit = ff.IsLimit
            x.UpperLimit = ff.UpperLimit
            x.LowerLimit = ff.LowerLimit

            this.list.push(x)
          }
        })
        this.total = response.data.Pagination.Total
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

    GET_EquipmentsList(equipment_id) {
      return new Promise((resolve, reject) => {
        const payload = {
          EquipmentID: equipment_id,
          IsEnabled: 1,
          IsDisplay: 1
        }

        getEquipment(payload)
          .then(response => {
            // 判斷是否 正確
            resolve(response.data.Payload)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
</script>
