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
          {{ scope.row.Monitor }}
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
      <el-table-column width="100" align="right">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="handleClick(scope.row)"
          >查看</el-button>
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
import { getList } from '@/api/EDCReport'
import Pagination from '@/components/Pagination'
import SelectEquipment from '@/components/SelectEquipment'
import SelectDateLimit from '@/components/SelectDateLimit'
import { isNullOrEmpty, formatDate, clearTime, addDate } from '@/utils/validate'

export default {
  components: { Pagination, SelectEquipment, SelectDateLimit },
  filters: {
    statusFilter(status) {
      const statusMap = {
        Run: 'warning',
        Down: 'danger',
        Idle: 'success'
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
      listedc: [],
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
  created() {
    this.fetchData()
  },
  beforeDestroy() {},
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

      if (!isNullOrEmpty(this.Select_EquipmentID)) {
        params.EquipmentID = this.Select_EquipmentID
      }

      getList(params).then(response => {
        this.listedc = response.data.items
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
