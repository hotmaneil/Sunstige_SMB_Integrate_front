<template>
  <div class="app-container">
    <h3>模具故障維護</h3>

    <!--search tools-->
    <el-form :model="searchForm" :inline="true">

      <el-form-item label="模具維護單號">
        <el-input v-model="searchForm.maintain_id" />
      </el-form-item>

      <el-form-item label="模具編號">
        <el-input v-model="searchForm.ModelID" />
      </el-form-item>

      <el-form-item label="模具維護類型">
        <el-select v-model="searchForm.maintenance_type" placeholder="Select">
          <el-option
            v-for="item in maintenanceTypeAllList"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList()">搜尋</el-button>
      </el-form-item>
    </el-form>

    <!--table tools-->
    <el-row>
      <el-col :span="12">
        <div class="table-tools">
          <el-button type="success" plain icon="el-icon-edit" @click="dataForm('create')">新增</el-button>
        </div>
      </el-col>
    </el-row>

    <br>

    <!-- Table -->
    <el-table
      v-loading="result_obj.show_loading"
      :data="result_obj.page_data"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :default-sort="{ prop: 'id', order: 'ascending' }"
    >
      <el-table-column prop="maintain_id" label="模具維護單號" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.maintain_id }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="mold_id" label="模具編號" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.mold_id }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="moldName" label="模具名稱" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.moldName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="maintenanceTypeName" label="模具維護類型" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.maintenanceTypeName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="maintenance_datetime" label="預排程保養時間" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.maintenance_datetime|moment('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="maintenance_vendor" label="維護廠商" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.maintenance_vendor }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="create_datetime" label="維護資料建立日期" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.create_datetime|moment('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="ok_datetime" label="維護完成日期" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.ok_datetime|moment('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button v-if="scope.row.maintain_ok===false" type="primary" size="small" icon="el-icon-edit" @click="dataForm('update', scope.row)" />
            <el-button v-if="scope.row.maintain_ok===false" type="danger" size="small" icon="el-icon-delete" @click="confirmDeleteDialog(scope.row)" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="result_obj.total>0" :total="result_obj.total" :page.sync="result_obj.now_page" :limit.sync="result_obj.per_page" @pagination="getList" />

    <!--表單-->
    <el-dialog :title="title" :visible.sync="formShow">
      <el-form
        ref="maintainForm"
        :model="maintainForm"
        label-position="right"
        label-width="210px"
        style="padding-left:0px;padding-right:10px;"
        :rules="validateRules"
      >
        <el-form-item label="模具編號" prop="mold_id">
          <el-select v-model="maintainForm.mold_id" filterable placeholder="Select">
            <el-option
              v-for="item in moldList"
              :key="item.ModelID"
              :label="item.Name"
              :value="item.ModelID"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="模具維護類型" prop="maintenance_type">
          <el-select v-model="maintainForm.maintenance_type" placeholder="Select">
            <el-option
              v-for="item in maintenanceTypeList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="維護廠商" prop="maintenance_vendor">
          <el-input v-model="maintainForm.maintenance_vendor" />
        </el-form-item>

        <el-form-item label="預排程保養時間" prop="maintenance_datetime">
          <el-date-picker
            v-model="maintainForm.maintenance_datetime"
            type="datetime"
            placeholder="選擇日期和時間"
          />
        </el-form-item>

        <el-form-item label="維護原因附記" prop="matintenance_reason">
          <el-input v-model="maintainForm.matintenance_reason" />
        </el-form-item>

        <el-form-item label="維護完成日期" prop="ok_datetime">
          {{ maintainForm.ok_datetime|okDatetimeFormat }}
        </el-form-item>

        <el-form-item label="維護資料建立日期" prop="mold_injection">
          {{ maintainForm.create_datetime |moment('YYYY-MM-DD HH:mm') }}
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button v-if="showSaveBtnCondition(maintainForm)" type="primary" @click="submitForm()">
          儲存
        </el-button>
        <el-button @click="formShow = false">
          取消
        </el-button>
        <el-button v-if="maintainForm.maintain_ok===false" type="warning" @click="confirmResetDialog()">
          Reset
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getCommoldList
} from '@/api/Mold'
import {
  getMoldMaintenanceList,
  getMaintenanceTypeEnumList,
  updateMoldMaintenance,
  deleteMoldMaintenance,
  moldReset } from '@/api/MoldMaintenance'
import Pagination from '@/components/Pagination'
import moment from 'moment'

export default {
  name: 'MoldMaintenance',
  components: { Pagination },

  filters: {
    okDatetimeFormat: function(value) {
      if (value !== undefined && value !== null) {
        if (value.includes('0001')) {
          return ''
        } else {
          return moment(value).format('YYYY-MM-DD HH:mm')
        }
      }
    }
  },
  data() {
    return {
      result_obj: {
        total: 0,
        now_page: 1,
        per_page: 10,
        page_data: [],
        show_loading: false
      },

      /** 模具列表 */
      moldList: [],

      /** 模具維護類型含全部之列表 */
      maintenanceTypeAllList: [],

      /** 模具維護類型列表 */
      maintenanceTypeList: [],

      searchForm: {},

      /** 顯示表單 */
      formShow: false,

      maintainForm: {},
      title: null,

      validateRules: {
        mold_id: [{ required: true, message: '模具編號為必要項', trigger: 'blur' }],
        maintenance_type: [{ required: true, message: '模具維護類型為必要項', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.getList()
    this.getMoldList()
    this.getMaintenanceTypeList()
  },

  methods: {

    /**
     * 取得模具維護列表
     */
    getList() {
      const vm = this
      const payload = {
        maintain_id: vm.searchForm.maintain_id,
        ModelID: vm.searchForm.ModelID,
        maintenance_type: vm.searchForm.maintenance_type,
        PageSize: vm.result_obj.per_page,
        CurrentPage: vm.result_obj.now_page
      }
      getMoldMaintenanceList(payload)
        .then(response => {
          vm.result_obj.total = response.data.Pagination.Total
          vm.result_obj.page_data = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /** 取得模具維護類型enum列表 */
    getMaintenanceTypeList() {
      const vm = this

      // 含全選
      const payload = {
        IsAll: true
      }
      getMaintenanceTypeEnumList(payload)
        .then(response => {
          vm.maintenanceTypeAllList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })

      // 不含全選
      const param = {
        IsAll: false
      }
      getMaintenanceTypeEnumList(param)
        .then(response => {
          vm.maintenanceTypeList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 取得模具列表
     */
    getMoldList() {
      const vm = this
      getCommoldList({})
        .then(response => {
          vm.moldList = response.data.Payload
          vm.moldList.forEach(element => {
            element.Name = element.ModelID + '-' + element.Name
          })
        }).catch(err => {
          console.log(err)
        })
    },

    /**
     * 取得資料表單
     */
    dataForm(action, row = {}) {
      console.log('action', action)

      switch (action) {
        case 'create':
          this.action = action
          this.formShow = true
          this.title = '新增模具維護'
          this.resetData()
          break

        case 'update':
          const new_obj = Object.assign({}, row)
          this.formShow = true
          this.action = action
          this.title = '更新模具維護'
          this.maintainForm = Object.assign({}, new_obj)
          break
      }
    },

    /**
     * 送出表單
     */
    submitForm() {
      this.$refs['maintainForm']
        .validate()
        .then(() => {
          const payload = this.maintainForm
          payload.maintenance_datetime = moment(payload.maintenance_datetime).format('YYYY-MM-DD HH:mm')

          updateMoldMaintenance(payload)
            .then(response => {
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.resetData()
              this.getList()
              this.formShow = false
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
          console.log(err, '表單檢查未過!!')
          return false
        })
    },

    /**
     * 確認刪除視窗
     */
    confirmDeleteDialog(row = {}) {
      this.$confirm('確定要刪除?', '注意！確定要刪除?', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        const payload = {
          Id: row.maintain_id
        }
        deleteMoldMaintenance(payload).then(response => {
          this.$message({
            type: 'success',
            message: '刪除成功'
          })
          this.getList()
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消刪除'
        })
      })
    },

    /**
     * 確認重置視窗
     */
    confirmResetDialog() {
      this.$confirm('確定要重置?', '注意！確定要重置?', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const payload = {
          maintain_id: this.maintainForm.maintain_id,
          mold_id: this.maintainForm.mold_id
        }

        moldReset(payload).then(response => {
          if (response.status === 200) {
            this.$message({
              type: 'success',
              message: '重置成功'
            })
            this.formShow = false
            this.getList()
          } else {
            this.$message({
              type: 'danger',
              message: response.message
            })
          }
        }).catch(err => {
          console.log(err)
        })
      })
    },

    /**
     * 重設表單
     */
    resetData() {
      this.maintainForm = {}
    },

    /**
     * 顯示儲存按鈕之條件
     */
    showSaveBtnCondition(maintainForm) {
      console.log('maintainForm', maintainForm)
      if (maintainForm === null) {
        // console.log('showSaveBtnCondition maintainForm null')
        return true
      } else {
        if (maintainForm.maintain_ok === undefined) {
          // console.log('showSaveBtnCondition maintain_ok undefined')
          // console.log('maintainForm.maintain_id', maintainForm.maintain_id)
          if (maintainForm.maintain_id === undefined) {
            // console.log('showSaveBtnCondition maintain_id undefined')
            return true
          } else {
            // console.log('showSaveBtnCondition maintain_id ok')
            return false
          }
        } else {
          // console.log('showSaveBtnCondition maintain_ok exist')
          // console.log('maintainForm.maintain_ok', maintainForm.maintain_ok)

          if (maintainForm.maintain_ok === true) {
            return false
          } else {
            return true
          }
        }
      }
    }
  }
}
</script>
