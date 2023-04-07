<template>
  <div class="app-container">
    <select-equipment
      :equipmentid.sync="SelectEquipmentID"
      @OnSelectEquipmentChange="OnChangeEquipmentID"
    />
    <!--v-loading="listLoading"-->
    <el-table
      :data="fieldList"
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
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="setEdit('field', scope.row)"
          >
            Edit
          </el-button>
        </template>
      </el-table-column>

      <el-table-column
        prop="NodeName"
        min-width="150"
        label="NodeName"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.NodeName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="FieldName"
        min-width="200"
        label="FieldName"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.FieldName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="EquipmentID"
        label="Equipment"
        width="140"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.EquipmentID }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="GroupName"
        label="GroupName"
        width="140"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.GroupName }}
        </template>
      </el-table-column>

      <el-table-column
        prop="SubCategory"
        label="SubCategory"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          {{ row.SubCategory }}
        </template>
      </el-table-column>

      <el-table-column label="Unit" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Unit }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="SortID"
        label="Sort"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.SortID }}</span>
        </template>
      </el-table-column>

      <el-table-column label="IsDisplay">
        <template slot-scope="{ row }">
          <template v-if="row.IsDisplay">
            <i class="el-icon-check" />
          </template>
        </template>
      </el-table-column>

      <el-table-column label="IsLimit">
        <template slot-scope="{ row }">
          <template v-if="row.IsLimit">
            <p>UpperLimit:{{ row.UpperLimit }}</p>
            <p>LowerLimit:{{ row.LowerLimit }}</p>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getResponseList"
    />

    <setting-dialog-field
      :model="fieldItem"
      :is-visible="fieldItemVisible"
      @onDialogVisible="OnFieldDialogVisible"
    />
  </div>
</template>

<script>
import { getEquipment } from '@/api/Equipments'
import { isNullOrEmpty, formatDate, getSortFunc } from '@/utils/validate'

import Pagination from '@/components/Pagination'
import SelectEquipment from '@/components/SelectEquipment'

import SettingDialogField from '@/components/SettingDialogField'

import { windowHeight } from '@/utils'

// import { loadingUI, closeLoading } from '@/utils/loading' // loading遮罩

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

      fieldList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 50
      },

      SelectEquipmentID: '',

      equipmentItemVisible: false,
      equipmentItem: {},
      fieldItemVisible: false,
      fieldItem: {},
      order_prop: 'SortID',
      desc_prop: 0,
      tableHeight: windowHeight() - 250
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
          //  loadingUI()
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
      // console.log('Loading...Fields', this.equipment.Fields)

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
      } else if (this.order_prop.indexOf('SubCategory') > -1) {
        sortfunc = getSortFunc(
          this.order_prop,
          2,
          'SubCategory',
          this.desc_prop
        )
      } else if (this.order_prop.indexOf('NodeName') > -1) {
        sortfunc = getSortFunc(this.order_prop, 2, 'NodeName', this.desc_prop)
      } else if (this.order_prop.indexOf('FieldName') > -1) {
        sortfunc = getSortFunc(this.order_prop, 2, 'FieldName', this.desc_prop)
      }

      if (this.equipment.Fields !== null) {
        this.equipment.Fields.sort(sortfunc)
      }

      var offsetNum = this.listQuery.limit * (this.listQuery.page - 1)
      var finalNum = offsetNum + this.listQuery.limit

      // console.log('listField', dataList, offsetNum, finalNum)
      if (this.equipment.Fields === null) {
        this.fieldList = []
      } else {
        var dataList = this.equipment.Fields.slice(offsetNum, finalNum)
        this.fieldList = dataList
        this.total = this.equipment.Fields.length
      }
    },

    GET_EquipmentsList(equipment_id) {
      console.log('OnChangeEquipmentID EquipmentID', equipment_id)

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
    },
    OnFieldDialogVisible(visible, row) {
      this.fieldItemVisible = visible
      this.getResponseList()
    }
  }
}
</script>
