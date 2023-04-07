<template>
  <el-dialog
    title="DataMonitor"
    :visible.sync="dialog"
    width="80%"
    top="10vh"
    @close="$emit('cancelEdit', null)"
  >
    <div slot="title" class="header-title">
      <span style="padding: 3px 0"> {{ field.EquipmentID }} </span>
      <span style="padding: 3px 0"> {{ field.FieldID }} </span>
      <span style="padding: 3px 0"> {{ field.FieldName }} </span>
      <!-- <span style="padding: 3px 0">  {{ field.Offset }}  </span> -->
      <span style="padding: 3px 0"> {{ field.Unit }} </span>
      <span style="padding: 3px 0"> {{ field.Average }} </span>
      <span style="padding: 3px 0"> {{ field.LowerLimit }} </span>
      <span style="padding: 3px 0"> {{ field.UpperLimit }} </span>
    </div>
    <div class="app-container">
      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        style="float: left"
        @pagination="getResponseList"
      />

      <el-table
        v-loading="listLoading"
        :data="listedc"
        element-loading-text="Loading"
        border
        fit
        stripe
        highlight-current-row
        :default-sort="{ prop: 'CreateTime', order: 'descending' }"
        @sort-change="changeTableSort"
      >
        <el-table-column label="ShotsCode" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.ShotsCode }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="EquipmentID"
          label="Equipment"
          width="140"
          align="center"
          sortable="custom"
          fixed
        >
          <template slot-scope="scope">
            {{ scope.row.EquipmentID }}
          </template>
        </el-table-column>
        <el-table-column label="Monitor" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.Monitor | statusFilter(scope.row)">{{
              scope.row.Monitor
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="StandardDifference" align="center">
          <template slot-scope="scope">
            {{ scope.row.StandardDifference }}
          </template>
        </el-table-column>
        <el-table-column label="Average" align="center">
          <template slot-scope="scope">
            {{ scope.row.Average }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="CreateTime"
          label="CreateTime"
          width="170"
          sortable
        >
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.CreateTime | formatDateFilter }}</span>
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
  </el-dialog>
</template>

<script>
import { getList } from '@/api/EDCReport'
import Pagination from '@/components/Pagination'
import { isNullOrEmpty, formatDate, clearTime, addDate } from '@/utils/validate'

export default {
  components: { Pagination },
  filters: {
    statusFilter(value, row) {
      if (row.StandardDifference == null) {
        return 'warning'
      }
      if (row.Average == null) {
        return 'warning'
      }

      if (
        value < row.Average + row.StandardDifference &&
        value > row.Average - row.StandardDifference
      ) {
        return 'success'
      } else {
        return 'danger'
      }
    },
    formatDateFilter(value) {
      return formatDate(value)
    }
  },
  props: {
    model: {
      type: Object,
      default: null
    },

    dialogFormVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listLoading: true,
      listedc: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      order_prop: 'CreateTime',
      desc_prop: 1,
      Select_DateLimit: formatDate(Date.now()),
      field: {},
      dialog: false
    }
  },
  watch: {
    dialogFormVisible(newValue) {
      this.dialog = newValue
      if (newValue) {
        this.field = Object.assign({}, this.model)
        this.fetchData()
      }
    }
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.getResponseList()
    },

    getResponseList() {
      var params = {
        orderby_: this.order_prop, desc_: this.desc_prop,
        offset_: this.listQuery.page,
        fetch_: this.listQuery.limit
      }

      if (!isNullOrEmpty(this.Select_DateLimit)) {
        var date_up = formatDate(clearTime(this.Select_DateLimit))
        var date_low = formatDate(addDate(date_up, 1))

        params.CreateTime = `${date_up}|${date_low}`
      }

      if (!isNullOrEmpty(this.field.EquipmentID)) {
        params.EquipmentID = this.field.EquipmentID
      }

      getList(params).then(response => {
        // console.log(response.data.items)

        this.listedc = response.data.items.map(x => {
          return {
            CreateTime: x.CreateTime,
            CreateUser: x.CreateUser,
            EquipmentID: x.EquipmentID,
            ID: x.ID,
            Monitor: parseFloat(x.Monitor.split(',')[this.field.Offset]),
            StandardDifference: parseFloat(
              x.StandardDifference.split(',')[this.field.Offset]
            ),
            Average: parseFloat(x.Average.split(',')[this.field.Offset]),
            ShotsCode: x.ShotsCode,
            TriggerTime: x.TriggerTime
          }
        })
        // this.listedc = response.data.items
        this.total = response.data.total
        this.listLoading = false
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
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-container {
  margin: 10px;
  width: 90%;
  clear: left;
  height: calc(100vh - 200px);
}
</style>
