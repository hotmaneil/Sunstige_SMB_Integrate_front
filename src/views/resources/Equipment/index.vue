<template>
  <div class="app-container">
    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getResponseList"
    />
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      stripe
      highlight-current-row
      :default-sort="{ prop: 'EquipmentID', order: 'ascending' }"
      @sort-change="changeTableSort"
    >
      <el-table-column
        prop="EquipmentID"
        label="ID"
        width="140"
        align="center"
        sortable="custom"
        fixed
      >
        <template slot-scope="scope">
          {{ scope.row.EquipmentID }}
        </template>
      </el-table-column>
      <el-table-column label="Name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.EquipmentName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Function" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.EquipmentFunction }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Type" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.EquipmentType }}
        </template>
      </el-table-column>
      <!-- <el-table-column class-name="status-cim" label="Cim" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.CimMode | statusFilter">{{ scope.row.CimMode }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-link" label="Link" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.LinkMode | statusFilter">{{ scope.row.LinkMode }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column
        class-name="status-col"
        label="Status"
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.Status | statusFilter">{{
            scope.row.Status
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="UpdateTime"
        label="UpdateTime"
        width="200"
        sortable="custom"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.UpdateTime | formatDateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="setEdit(scope.row)"
          >
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getResponseList"
    />

    <setting-dialog
      :model="nowitem"
      :dialog-form-visible="dialogFormVisible"
      @dialogVisible="dialogVisible"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatDate, getSortFunc } from '@/utils/validate'
import Pagination from '@/components/Pagination'
import SettingDialog from '@/components/SettingDialogEquipment'

export default {
  components: { Pagination, SettingDialog },
  filters: {
    statusFilter(status) {
      const statusMap = {
        Run: 'warning',
        Down: 'danger',
        Idle: 'success',
        On: 'success',
        Off: 'danger'
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
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      dialogFormVisible: false,
      nowitem: {},
      order_prop: 'SortID',
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
      if (this.timer == null) {
        this.timer = setInterval(() => {
          if (this.list.length === 0) {
            this.getResponseList()
          }
        }, 1000)
      }
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
    getResponseList() {
      this.listLoading = false
      // console.log('Loading...Equipments', this.equipments.list)

      var sortfunc = {}
      if (this.order_prop.indexOf('SortID') > -1) {
        sortfunc = getSortFunc(this.order_prop, 1, 'SortID', this.desc_prop)
      } else if (this.order_prop.indexOf('EquipmentID') > -1) {
        sortfunc = getSortFunc(
          this.order_prop,
          2,
          'EquipmentID',
          this.desc_prop
        )
      } else if (this.order_prop.indexOf('UpdateTime') > -1) {
        sortfunc = getSortFunc(this.order_prop, 2, 'UpdateTime', this.desc_prop)
      }

      this.equipments.list.sort(sortfunc)

      var offsetNum = this.listQuery.limit * (this.listQuery.page - 1)
      var finalNum = offsetNum + this.listQuery.limit
      this.list = this.equipments.list.slice(offsetNum, finalNum)
      // console.log('listField', this.list, offsetNum, finalNum)

      this.total = this.equipments.list.length
      this.listLoading = false
    },

    dialogVisible(newValue, row) {
      this.dialogFormVisible = newValue

      var index = this.equipments.list.findIndex(
        x => x.EquipmentID === row.EquipmentID
      )
      this.equipment = this.equipments.list[index]

      this.equipment.EquipmentName = row.EquipmentName
      this.equipment.SortID = row.SortID
      this.equipment.IsDisplay = row.IsDisplay
      this.equipment.IsEnabled = row.IsEnabled
      // console.log('dialogVisible', this.equipment)
      this.getResponseList()
    },

    setEdit(row) {
      // console.log('setEdit', row)
      this.nowitem = row
      this.dialogFormVisible = true
    }
  }
}
</script>
