<template>
  <div class="app-container">
    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="float: left"
      @pagination="getResponseList"
    />

    <select-equipment
      :equipmentid.sync="Select_EquipmentID"
      style="float: right"
      @OnSelectEquipmentChange="getResponseList"
    />

    <select-date-limit
      :datenow.sync="Select_DateLimit"
      style="float: right"
      @OnSelectDateChange="getResponseList"
    />

    <el-table
      v-loading="listLoading"
      :data="listalarm"
      element-loading-text="Loading"
      border
      fit
      stripe
      highlight-current-row
      :default-sort="{ prop: 'CreateTime', order: 'descending' }"
      @sort-change="changeTableSort"
    >
      <el-table-column label="AlarmCode" fixed>
        <template slot-scope="scope">
          {{ scope.row.AlarmCode }}
        </template>
      </el-table-column>
      <el-table-column
        prop="EquipmentID"
        label="Equipment"
        width="140"
        align="center"
        fixed
      >
        <template slot-scope="scope">
          <span>{{ scope.row.EquipmentID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="TriggerTime">
        <template slot-scope="scope">
          {{ scope.row.TriggerTime }}
        </template>
      </el-table-column>
      <el-table-column label="AlarmLevel">
        <template slot-scope="scope">
          {{ scope.row.AlarmLevel }}
        </template>
      </el-table-column>
      <el-table-column label="AlarmMessage">
        <template slot-scope="scope">
          {{ scope.row.AlarmMessage }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.Reason | statusFilter">{{
            scope.row.Reason
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="CreateTime"
        label="CreateTime"
        width="200"
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
      style="float: left"
      @pagination="getResponseList"
    />
  </div>
</template>

<script>
import { getList } from '@/api/AlarmReport'
import { mapGetters } from 'vuex'
import { isNullOrEmpty, formatDate, clearTime, addDate } from '@/utils/validate'
import Pagination from '@/components/Pagination'
import SelectEquipment from '@/components/SelectEquipment'
import SelectDateLimit from '@/components/SelectDateLimit'

export default {
  components: { Pagination, SelectEquipment, SelectDateLimit },
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
      listLoading: true,
      listalarm: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      Select_EquipmentID: null,
      Select_DateLimit: formatDate(Date.now()),
      order_prop: 'CreateTime',
      desc_prop: 1
    }
  },
  computed: {
    ...mapGetters(['equipments'])
  },
  created() {
    clearInterval(this.timer)
    this.timer = null
    this.setTimer()
    this.listLoading = true
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    setTimer() {
      setTimeout(() => {
        if (!isNullOrEmpty(this.Select_EquipmentID)) {
          this.getResponseList()
        } else {
          if (!isNullOrEmpty(this.equipments.select_equipment)) {
            this.Select_EquipmentID = this.equipments.select_equipment
            this.getResponseList()
          } else {
            this.listLoading = false
          }
        }
      }, 1000)
    },

    getResponseList() {
      var params = {
        orderby_: this.order_prop,
        desc_: this.desc_prop,
        offset_: this.listQuery.page,
        fetch_: this.listQuery.limit
      }

      if (!isNullOrEmpty(this.Select_DateLimit)) {
        var date_up = formatDate(clearTime(this.Select_DateLimit))
        var date_low = formatDate(addDate(date_up, 1))

        params.CreateTime = `${date_up}|${date_low}`
      }

      if (!isNullOrEmpty(this.Select_EquipmentID)) {
        params.EquipmentID = this.Select_EquipmentID
      }

      getList(params).then(response => {
        this.listalarm = response.data.items
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
