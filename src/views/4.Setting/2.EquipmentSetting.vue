<template>
  <div class="app-container">
    <el-table
      :data="equipmentList"
      element-loading-text="Loading"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :max-height="tableHeight"
      :default-sort="{ prop: 'SortID', order: 'ascending' }"
      @sort-change="changeTableSort"
    >
      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="setEdit('equipment', scope.row)">
            Edit
          </el-button>
        </template>
      </el-table-column>

      <el-table-column prop="EquipmentID" label="ID" width="140" align="center" sortable="custom" fixed>
        <template slot-scope="scope">
          {{ scope.row.EquipmentID }}
        </template>
      </el-table-column>
      <el-table-column label="Name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.EquipmentName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Type" align="center">
        <template slot-scope="scope">
          {{ scope.row.EquipmentType }}
        </template>
      </el-table-column>

      <el-table-column prop="SortID" label="Sort" align="center" sortable="custom">
        <template slot-scope="{ row }">
          <template v-if="row.isEdit">
            <el-input-number v-model="row.SortID" :min="1" :max="10" label="SortID" size="small" class="edit-input" />
          </template>
          <span v-else>{{ row.SortID }}</span>
        </template>
      </el-table-column>

      <el-table-column label="IsDisplay">
        <template slot-scope="{ row }">
          <template v-if="row.IsDisplay">
            <i class="el-icon-check" />
          </template>
        </template>
      </el-table-column>

      <el-table-column label="Category">
        <template slot-scope="scope">
          {{ scope.row.Category | categoryFilter }}
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
      :model="equipmentItem"
      :is-visible="equipmentItemVisible"
      @onDialogVisible="OnEquipmentDialogVisible"
    />
  </div>
</template>

<script>
import { getEquipmentList } from '@/api/Equipments'
import { formatDate, getSortFunc, sortStr } from '@/utils/validate'
import Pagination from '@/components/Pagination'
import SettingDialog from '@/components/SettingDialogEquipment'
import { windowHeight } from '@/utils'
// import { loadingUI, closeLoading } from '@/utils/loading' // loading遮罩

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
    },
    categoryFilter(value) {
      switch (value) {
        case 'ROBOSHOT':
          return 'ROBOSHOT'
        case 'CNC':
          return 'CNC'
        case 'PLC':
          return 'PLC'
      }
    }
  },
  data() {
    return {
      // listLoading: true,
      equipmentList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 50
      },
      equipmentItemVisible: false,
      equipmentItem: {},
      order_prop: 'SortID',
      desc_prop: 1,
      tableHeight: windowHeight() - 250
    }
  },
  created() {
    clearInterval(this.timer)
    this.timer = null
    this.getResponseList()
    // this.setTimer()
    // this.listLoading = true
    // loadingUI()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    setTimer() {
      if (this.timer == null) {
        this.timer = setInterval(() => {
          if (this.equipmentList.length === 0) {
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

    /** 以這個為主 */
    async getResponseList() {
      var sortfunc = {}
      if (this.order_prop.indexOf('SortID') > -1) {
        sortfunc = getSortFunc(this.order_prop, 1, 'SortID', this.desc_prop)
      } else if (this.order_prop.indexOf('EquipmentID') > -1) {
        sortfunc = getSortFunc(this.order_prop, 2, 'EquipmentID', this.desc_prop)
      } else if (this.order_prop.indexOf('UpdateTime') > -1) {
        sortfunc = getSortFunc(this.order_prop, 2, 'UpdateTime', this.desc_prop)
      }

      await this.GET_EquipmentsList().then(response => {
        this.equipmentList = []

        this.total = response.length

        response.sort(sortfunc).map(eq => {
          var newEq = Object.assign({}, eq)
          newEq.SliceFields = []
          if (eq.Fields !== null) {
            eq.Fields.filter(x => {
              if (x.IsLimit === true) return true
            })
              .sort(sortStr)
              .slice(0, 5)
              .map(fd => {
                newEq.SliceFields.push(fd)
              })
          }
          this.equipmentList.push(newEq)
        })
      })
    },

    GET_EquipmentsList() {
      return new Promise((resolve, reject) => {
        getEquipmentList()
          .then(response => {
            resolve(response.data.Payload)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    setEdit(dialog, row) {
      if (dialog === 'equipment') {
        this.equipmentItem = row
        this.equipmentItemVisible = true
      } else if (dialog === 'field') {
        this.fieldItem = row
        this.fieldItemVisible = true
      }
    },

    OnEquipmentDialogVisible(visible, row) {
      this.equipmentItemVisible = visible
      this.getResponseList()
    }
  }
}
</script>
