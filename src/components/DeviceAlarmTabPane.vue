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
      <el-table-column prop="AlarmCode" label="警示代碼" align="center" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.AlarmCode }}
        </template>
      </el-table-column>
      <el-table-column prop="AlarmLevel" label="警示層級" align="center" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.AlarmLevel }}
        </template>
      </el-table-column>
      <el-table-column prop="Reason" label="原因" align="center" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.Reason }}
        </template>
      </el-table-column>
      <el-table-column prop="AlarmMessage" label="警示訊息" align="center" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.AlarmMessage }}
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
import { alarm } from '@/api/Equipments'
import { formatDate } from '@/utils/validate'
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
      total: 0,
      listQuery: {
        page: 1,
        limit: 50
      },
      order_prop: 'TriggerTime',
      desc_prop: 1,
      tableHeight: windowHeight() - 250
    }
  },
  watch: {
    equipmentid: {
      handler(val) {
        if (val === null) {
          return
        }

        // console.log('equipmentid', val)

        this.getResponseList()
      }
    }
  },
  created() {
    if (this.equipmentid) {
      this.getResponseList()
    }
  },
  methods: {
    getResponseList() {
      // this.listLoading = false
      this.GET_EquipmentAlarmList().then(response => {
        // console.log('getEquipmentAlarm', response)
        this.list = response.Payload
        this.total = response.Pagination.Total
      })
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

    GET_EquipmentAlarmList() {
      return new Promise((resolve, reject) => {
        // var params = { orderby_: this.order_prop,desc_: this.desc_prop, offset_: this.listQuery.page, fetch_: this.listQuery.limit, Mode: this.field.FieldID, select_: 'TriggerTime,RawData' }

        const payload = {
          EquipmentID: this.equipmentid,
          orderby_: this.order_prop,
          desc_: this.desc_prop,
          offset_: this.listQuery.page,
          fetch_: this.listQuery.limit,
          select_: 'AlarmCode,EquipmentID,TriggerTime,Reason,AlarmLevel,AlarmMessage',
          CreateTimeStart: moment(this.startTime).format('yyyy-MM-DD HH:mm:ss'),
          CreateTimeEnd: moment(this.endTime).format('yyyy-MM-DD HH:mm:ss')
        }

        alarm(payload)
          .then(response => {
            // 判斷是否 正確
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
</script>
