<template>
  <div class="app-container">
    <div style="clear: both">
      <select-equipment
        :equipmentid.sync="SelectEquipmentID"
        :selectallflage="false"
        :isdaterange="true"
        @OnSelectEquipmentChange="OnChangeEquipmentID"
        @OnDateTimeRangeChange="OnDateTimeRangeChange"
      />

      <el-table
        :data="listitem"
        element-loading-text="Loading"
        border
        fit
        stripe
        highlight-current-row
        style="width: 100%"
        :max-height="tableHeight"
        :default-sort="{ prop: 'SubCategory', order: 'ascending' }"
        @sort-change="changeTableSort"
      >
        <el-table-column prop="UpdateTime" label="更新時間" width="170" sortable="custom">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.UpdateTime | formatDateFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="EquipmentID" label="設備" width="140" align="center" sortable="custom">
          <template slot-scope="scope">
            {{ scope.row.EquipmentID }}
          </template>
        </el-table-column>
        <el-table-column prop="SubCategory" label="子種類" align="center" sortable="custom">
          <template slot-scope="scope">
            {{ scope.row.SubCategory }}
          </template>
        </el-table-column>
        <el-table-column prop="MoldNumber" label="模具號" align="center" sortable="custom">
          <template slot-scope="scope">
            {{ scope.row.MoldNumber }}
          </template>
        </el-table-column>
        <el-table-column prop="ProductType" label="產品別" align="center" sortable="custom">
          <template slot-scope="scope">
            {{ scope.row.ProductType }}
          </template>
        </el-table-column>
        <el-table-column label="設備名稱" align="center">
          <template slot-scope="scope">
            {{ scope.row.Device }}
          </template>
        </el-table-column>
        <el-table-column label="備註" align="center">
          <template slot-scope="scope">
            {{ scope.row.Remarks }}
          </template>
        </el-table-column>
        <el-table-column label="啟用">
          <template slot-scope="{ row }">
            <template v-if="row.IsEnabled">
              <i class="el-icon-check" />
            </template>
            <template v-if="!row.IsEnabled">
              <el-button size="small" @click="setEdit('LimitEnable', row)">套用此設定值</el-button>
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="setEdit('View', scope.row)">檢視</el-button>

            <el-button type="primary" size="small" icon="el-icon-edit" @click="setEdit('Edit', scope.row)">
              編輯
            </el-button>

            <el-button type="danger" size="small" icon="el-icon-remove" @click="setEdit('Delete', scope.row)">
              刪除
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

      <mold-edit-dialog :model="groupItem" :is-visible="groupItemVisible" @onDialogVisible="OnGroupItemVisible" />

      <setting-dialog-field :model="fieldItem" :is-visible="fieldItemVisible" @onDialogVisible="OnFieldDialogVisible" />
    </div>
  </div>
</template>

<script>
import { getEquipment } from '@/api/Equipments'
import { getList, removeItem, applyItem } from '@/api/MoldingBackup'

import { isNullOrEmpty, formatDate, changeBetweenDate } from '@/utils/validate'

import Pagination from '@/components/Pagination'
import SelectEquipment from '@/components/SelectEquipment'
import MoldEditDialog from '@/components/MoldEditDialog'
import SettingDialogField from '@/components/SettingDialogField'
import { windowHeight } from '@/utils'

export default {
  components: {
    SelectEquipment,
    Pagination,
    MoldEditDialog,
    SettingDialogField
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
      listitem: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 50
      },

      SelectEquipmentID: '',

      order_prop: 'UpdateTime DESC',

      groupItemVisible: false,
      groupItem: {},
      fieldItemVisible: false,
      fieldItem: {},
      tableHeight: windowHeight() - 250,
      rangeTime: null // changeBetweenDate(formatDate(Date.now()), formatDate(Date.now()))
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
      var params = {
        orderby_: this.order_prop,
        desc_: this.desc_prop,
        offset_: this.listQuery.page,
        fetch_: this.listQuery.limit,
        EquipmentID: this.SelectEquipmentID
      }

      // console.log('params', params)
      getList(params).then(response => {
        this.listitem = []

        response.data.Payload.map(x => {
          x.MoldingFields.map(y => {
            var ff = this.equipment.Fields.find(f => {
              return f.FieldID === y.FieldID
            })

            y.FieldName = ff.FieldName
            y.NodeName = ff.NodeName
            y.Precision = ff.Precision
          })

          // console.log('items', x.ID, x)
          this.listitem.push(x)
        })

        this.total = response.data.Pagination.Total
        // this.listLoading = false
        //  closeLoading()
      })
    },

    GET_EquipmentsList(equipment_id) {
      console.log('OnChangeEquipmentID EquipmentID', equipment_id)

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

    async setEdit(type, row) {
      console.log('setEdit', type, row)
      if (type === 'View') {
        this.$router.push({
          name: 'Molding',
          params: { EquipmentID: row.EquipmentID, ReportID: row.ReportID }
        })
      } else if (type === 'Edit') {
        // 載入 子項
        this.groupItem = row
        this.groupItemVisible = true
      } else if (type === 'LimitEnable') {
        console.log('LimitEnable', type, row)
        await applyItem(row.ID, row)
          .then(response => {
            this.$message({
              message: 'The data has been update',
              type: 'success'
            })
            this.$store.dispatch('equipments/start', this.$message)
          })
          .catch(error => {
            console.error(error)
          })

        this.getResponseList()
      } else if (type === 'Delete') {
        await removeItem(row.ID, row)
          .then(response => {
            this.$message({
              message: 'The data has been remove',
              type: 'success'
            })
            this.$store.dispatch('equipments/start', this.$message)
          })
          .catch(error => {
            console.error(error)
          })

        this.getResponseList()
      }
    },

    OnGroupItemVisible(visible, row) {
      this.groupItemVisible = visible
      console.log('OnGroupItemVisible', visible, row)
      this.getResponseList()
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
        this.rangeTime = changeBetweenDate(formatDate(val[0]), formatDate(val[1]))
      } else {
        this.rangeTime = null
      }
      this.GET_EquipmentsList(this.SelectEquipmentID).then(response => {
        this.equipment = response
        this.getResponseList()
      })
    }
  }
}
</script>
