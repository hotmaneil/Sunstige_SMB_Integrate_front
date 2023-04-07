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
      :selectallflage="false"
      @OnSelectEquipmentChange="getResponseList"
    />

    <select-date-limit
      :datenow.sync="Select_DateLimit"
      style="float: right"
      @OnSelectDateChange="getResponseList"
    />

    <el-table
      v-loading="listLoading"
      :data="listtrace"
      element-loading-text="Loading"
      border
      fit
      stripe
      highlight-current-row
      :default-sort="{ prop: 'CreateTime', order: 'descending' }"
      @sort-change="changeTableSort"
    >
      <el-table-column
        align="center"
        prop="TriggerTime"
        label="TriggerTime"
        width="170"
        sortable
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.TriggerTime | formatDateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="EquipmentID"
        label="Equipment"
        width="140"
        align="center"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.EquipmentID }}
        </template>
      </el-table-column>
      <el-table-column label="NodeName" align="center">
        <template slot-scope="scope">
          {{ scope.row.NodeName }}
        </template>
      </el-table-column>
      <el-table-column label="FieldName" align="center">
        <template slot-scope="scope">
          {{ scope.row.FieldName }}
        </template>
      </el-table-column>
      <el-table-column label="TraceReportID" align="center">
        <template slot-scope="scope">
          {{ scope.row.ReportID }}
        </template>
      </el-table-column>
      <el-table-column label="NewValue" align="center">
        <template slot-scope="scope">
          {{ scope.row.NewValue }}
        </template>
      </el-table-column>
      <el-table-column label="OldValue" align="center">
        <template slot-scope="scope">
          {{ scope.row.OldValue }}
        </template>
      </el-table-column>

      <!-- <el-table-column width="100" align="right">
        <template slot-scope="scope">
          <el-button size="small" @click="handleClick(scope.row)">查看</el-button>
        </template>
      </el-table-column> -->
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
import { getList } from '@/api/History'

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
      equipment: {},
      listtrace: [],
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

      var index = this.equipments.list.findIndex(
        x => x.EquipmentID === this.Select_EquipmentID
      )
      this.equipment = this.equipments.list[index]

      getList(params).then(response => {
        response.data.items.map(x => {
          var findex = this.equipment.Fields.findIndex(
            f => f.FieldID === x.FieldID
          )
          var ff = this.equipment.Fields[findex]

          x.FieldName = ff.FieldName
          x.NodeName = ff.NodeName

          this.listtrace.push(x)
        })
        this.total = response.data.total
        this.listLoading = false

        // console.log('this.listtrace', this.listtrace)
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
