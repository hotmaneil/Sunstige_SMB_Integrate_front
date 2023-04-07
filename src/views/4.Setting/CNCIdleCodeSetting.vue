<template>
  <div class="app-container">
    <h3>閒置代碼(CNC)</h3>

    <!--table tools-->
    <div class="table-tools" style="margin-bottom:12px">
      <el-button type="success" plain icon="el-icon-edit" @click="dataForm('create')">新增 </el-button>
    </div>

    <!-- Table -->
    <el-table
      :data="CNCIdleCodeList"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :default-sort="{ prop: 'id', order: 'ascending' }"
    >
      <el-table-column prop="code" label="狀態代碼" align="center" sortable="custom">
        <template slot-scope="{ row }">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="comment" label="說明" align="center" sortable="custom">
        <template slot-scope="{ row }">
          <span>{{ row.comment }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="dataForm('update', scope.row)" />
            <el-button type="danger" size="small" icon="el-icon-delete" @click="confirmDeleteDialog(scope.row)" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!--表單-->
    <el-dialog title="編輯閒置代碼 (CNC)" :visible.sync="formShow" width="700px">
      <el-form
        ref="CNCIdleCodeForm"
        :model="CNCIdleCodeForm"
        label-position="right"
        label-width="210px"
        style="padding-left:10px;padding-right:10px;"
        :rules="validateRules"
      >
        <el-form-item label="狀態代碼" prop="code">
          <el-input v-model="CNCIdleCodeForm.code" />
        </el-form-item>

        <el-form-item label="說明" prop="comment">
          <el-input v-model="CNCIdleCodeForm.comment" />
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
import { UpdateCNCIdleCode, getCNCIdleCodeList, deleteCNCIdleCode } from '@/api/CNC'
export default {
  data() {
    return {
      deviceList: [],

      CNCIdleCodeList: [],
      CNCIdleCodeForm: {},

      /** 顯示表單 */
      formShow: false,
      action: null,

      validateRules: {
        code: [
          { required: true, message: '狀態代碼為必要項', trigger: 'blur' }
        ],
        mode: [
          { required: true, message: '閒置代碼為必要項', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.getList()
  },

  methods: {
    /**
     * 取得閒置代碼(CNC)列表
     */
    getList() {
      const vm = this
      getCNCIdleCodeList()
        .then(response => {
          vm.CNCIdleCodeList = response.data.Payload
        })
        .catch(err => {
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
          break

        case 'update':
          const new_obj = Object.assign({}, row)
          this.formShow = true
          this.action = action
          this.CNCIdleCodeForm = Object.assign({}, new_obj)
          break
      }
    },

    /**
     * 送出表單
     */
    submitForm() {
      this.$refs['CNCIdleCodeForm']
        .validate()
        .then(() => {
          const payload = this.CNCIdleCodeForm

          switch (this.action) {
            case 'create':
              payload.id = 0
              break
            case 'update':
              break
            default:
              console.log(`undefined action: ${this.action}`)
          }

          UpdateCNCIdleCode(payload)
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
     * 重設表單
     */
    resetData() {
      this.CNCIdleCodeForm = {}
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
            id: row.id
          }

          deleteCNCIdleCode(payload)
            .then(response => {
              this.$message({
                type: 'success',
                message: '刪除成功'
              })
              this.getList()
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
    }
  }
}
</script>
