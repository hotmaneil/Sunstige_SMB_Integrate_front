<template>
  <div class="app-container">
    <h3>狀態管理 Status Manager</h3>

    <!--table tools-->
    <div class="table-tools">
      <el-button
        type="success"
        plain
        icon="el-icon-edit"
        @click="dataForm('create')"
      >新增
      </el-button>
    </div>

    <br>

    <!-- Table -->
    <el-table
      :data="statusList"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :default-sort="{ prop: 'id', order: 'ascending' }"
    >
      <el-table-column
        prop="statusId"
        label="機台狀態"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.statusId }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="ip" label="顯示顏色">
        <template slot-scope="{ row }">
          <span>
            <el-color-picker v-model="row.color" disabled />
            {{ row.color }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="狀態"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.isStatus | isStatusText }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="isEnable"
        label="啟用"
        align="isEnable"
      >
        <template slot-scope="{ row }">
          <span>{{ row.isEnable | enableText }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="功能">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="dataForm('update', scope.row)"
            />

            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="dataForm('delete', scope.row)"
            />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!--表單-->
    <el-dialog title="編輯狀態" :visible.sync="formShow" width="700px">
      <el-form
        ref="statusForm"
        :model="statusForm"
        label-position="right"
        label-width="110px"
        style="padding-left:10px;padding-right:10px;"
        :rules="validateRules"
      >
        <el-form-item label="機台狀態" prop="statusId">
          <el-input v-model="statusForm.statusId" :readonly="action === 'update'" />
        </el-form-item>
        <el-form-item label="顯示顏色" prop="color">
          <el-color-picker v-model="statusForm.color" />
        </el-form-item>
        <el-form-item label="狀態" prop="isStatus">
          <el-checkbox v-model="statusForm.isStatus" />
        </el-form-item>
        <el-form-item label="啟用" prop="isEnable">
          <el-checkbox v-model="statusForm.isEnable" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formShow = false">
          取消
        </el-button>
        <el-button type="primary" @click="submitForm()">
          送出
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, update, deleteStatus } from '@/api/MainStatus'

export default {
  components: {},
  filters: {
    isStatusText: function(value) {
      if (value) return 'Y'
      else return 'N'
    },

    /** 是否啟用顯示值 */
    enableText: function(value) {
      if (value) return 'Y'
      else return 'N'
    }
  },

  data() {
    return {
      statusList: [],
      statusForm: {},

      /** 顯示表單 */
      formShow: false,

      /** 動作是新增還是修改 */
      action: null,

      /** 驗證表單規則 */
      validateRules: {}
    }
  },

  created() {
    this.getStatusList()
  },

  methods: {
    /**
     * 取得狀態列表
     */
    getStatusList() {
      const vm = this
      getList()
        .then(response => {
          vm.statusList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 取得資料表單
     */
    dataForm(action, row = {}) {
      switch (action) {
        case 'create':
          this.action = 'create'
          this.formShow = true
          this.statusForm = {}
          break

        case 'update':
          this.action = 'update'
          const new_obj = Object.assign({}, row)
          this.formShow = true
          this.statusForm = Object.assign({}, new_obj)
          break

        case 'delete':
          this.action = 'delete'
          this.confirmDeleteDialog(row)
          break
      }
    },

    /**
     * 送出表單
     */
    submitForm() {
      this.$refs['statusForm']
        .validate()
        .then(() => {
          console.log('update statusForm', this.statusForm)
          const payload = this.statusForm
          update(payload)
            .then(response => {
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.resetData()
              this.getStatusList()
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
      })
        .then(() => {
          const payload = {
            id: row.statusId
          }

          deleteStatus(payload)
            .then(response => {
              this.$message({
                type: 'success',
                message: '刪除成功'
              })
              this.getStatusList()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消刪除'
          })
        })
    },

    /**
     * 重設表單
     */
    resetData() {
      this.statusForm = {}
    }
  }
}
</script>
