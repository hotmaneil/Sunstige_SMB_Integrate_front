<template>
  <div class="app-container">
    <!--<pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="float: left"
      @pagination="getResponseList"
    />-->

    <el-button
      type="primary"
      size="small"
      icon="el-icon-edit"
      @click="setEdit('Add', null)"
    >
      Add Option
    </el-button>

    <br><br>

    <!--v-loading="listLoading"-->
    <el-table
      :data="listitem"
      element-loading-text="Loading"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :max-height="tableHeight"
      :default-sort="{ prop: 'OptionID', order: 'ascending' }"
      @sort-change="changeTableSort"
    >
      <el-table-column align="center" label="Actions" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="setEdit('Edit', scope.row)"
          >
            Edit
          </el-button>

          <el-popconfirm
            title="您確定要刪除?"
            @onConfirm="setEdit('Delete', scope.row)"
          >
            <el-button
              slot="reference"
              type="danger"
              size="small"
              icon="el-icon-remove"
            >
              Delete
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>

      <el-table-column min-width="10" label="ID" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.ID }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="OptionGroup" label="OptionGroup" align="center">
        <template slot-scope="{ row }">
          {{ row.OptionGroup }}
        </template>
      </el-table-column>

      <el-table-column label="OptionID" align="center" sortable="custom">
        <template slot-scope="{ row }">
          <span>{{ row.OptionID }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="Name"
        label="Name"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.Name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="Lable"
        label="Lable"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.Lable }}</span>
        </template>
      </el-table-column>

      <el-table-column label="IsDisplay">
        <template slot-scope="{ row }">
          <template v-if="row.IsDisplay">
            <i class="el-icon-check" />
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

    <setting-dialog
      :model="nowitem"
      :dialog-form-visible="dialogFormVisible"
      @dialogVisible="dialogVisible"
    />
    <setting-create-dialog
      :model="nowitem2"
      :dialog-form-visible="dialogFormVisible2"
      @dialogVisible="dialogVisible"
    />
  </div>
</template>

<script>
import { getList, removeItem } from '@/api/Options'

import { mapGetters } from 'vuex'
import { formatDate } from '@/utils/validate'

import Pagination from '@/components/Pagination'

import SettingDialog from '@/components/OptionsEditDialog'
import SettingCreateDialog from '@/components/OptionsCreateDialog'

import { windowHeight } from '@/utils'

// import { loadingUI, closeLoading } from '@/utils/loading' // loading遮罩

export default {
  components: { Pagination, SettingDialog, SettingCreateDialog },
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
      order_prop: 'OptionID',
      desc_prop: 1,
      dialogFormVisible: false,
      nowitem: {},
      dialogFormVisible2: false,
      nowitem2: {},
      tableHeight: windowHeight() - 200
    }
  },
  computed: {
    ...mapGetters(['equipments'])
  },
  created() {
    this.getResponseList()
    // this.listLoading = true
    // loadingUI()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    getResponseList() {
      var params = {
        orderby_: this.order_prop, desc_: this.desc_prop,
        offset_: this.listQuery.page,
        fetch_: this.listQuery.limit
      }
      // console.log('getResponseList', params)
      getList(params).then(response => {
        this.listitem = response.data.Payload
        this.total = response.data.Pagination.Total
        // this.listLoading = false
        //     closeLoading()
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

    dialogVisible(newValue, row) {
      this.dialogFormVisible = newValue
      this.dialogFormVisible2 = newValue

      if (row == null) {
        return
      }

      // console.log('dialogVisible', row)
      this.getResponseList()
    },
    async setEdit(type, row) {
      // console.log('setEdit', type, row)
      if (type === 'Edit') {
        this.nowitem = row
        this.dialogFormVisible = true
      } else if (type === 'Add') {
        this.nowitem2 = {
          Lable: '',
          Level: '1',
          Message: '',
          Name: '',
          OptionGroup: '',
          OptionID: ''
        }
        this.dialogFormVisible2 = true
      } else {
        await removeItem(row.ID, row)
          .then(response => {
            this.$message({
              message: 'The data has been remove',
              type: 'success'
            })
            this.$store.dispatch('equipments/start', this.$message)
            this.getResponseList()
          })
          .catch(error => {
            console.error(error)
          })
      }
    }
  }
}
</script>
