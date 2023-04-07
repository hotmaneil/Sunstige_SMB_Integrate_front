<template>
  <div class="app-container">
    <h3>IPC管理</h3>

    <!--table tools-->
    <el-row>
      <el-col :span="12">
        <div class="table-tools">
          <el-button type="success" plain icon="el-icon-edit" @click="dataForm('create')">新增</el-button>
        </div>
      </el-col>
      <el-col :span="12">
        同步至
        <el-select v-model="selectIPC" placeholder="請選IPC">
          <el-option v-for="item in ipcDropDownList" :key="item.ip" :label="item.name" :value="item.ip" />
        </el-select>
        <el-button type="primary" size="small" icon="el-icon-s-help" @click="confirmSyncDialog()">確定</el-button>
      </el-col>
    </el-row>

    <br>

    <!-- Table -->
    <el-table
      :data="ipcList"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :default-sort="{ prop: 'id', order: 'ascending' }"
    >
      <el-table-column prop="name" label="名稱" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="ip" label="IP">
        <template slot-scope="{ row }">
          <span>{{ row.ip }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="frontUrl" label="frontUrl">
        <template slot-scope="{ row }">
          <span>{{ row.frontUrl }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="isEnable" label="啟用" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.isEnable }}</span>
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
    <el-dialog title="編輯IPC" :visible.sync="formShow" width="700px">
      <el-form
        ref="ipcForm"
        :model="ipcForm"
        label-position="right"
        label-width="210px"
        style="padding-left:10px;padding-right:10px;"
        :rules="validateRules"
      >
        <el-form-item label="名稱" prop="name">
          <el-input v-model="ipcForm.name" />
        </el-form-item>

        <el-form-item label="ip" prop="ip">
          <el-input v-model="ipcForm.ip" />
        </el-form-item>

        <el-form-item label="frontUrl" prop="frontUrl">
          <el-input v-model="ipcForm.frontUrl" />
        </el-form-item>

        <el-form-item label="啟用" prop="isEnable">
          <el-checkbox v-model="ipcForm.isEnable">啟用</el-checkbox>
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
import { getIPCList, update, deleteIPC, Sync } from '@/api/SMBIPC'
import axios from 'axios'

export default {
  data() {
    return {
      ipcList: [],
      ipcForm: {},

      ipcDropDownList: [],

      selectIPC: null,
      inputList: [],

      /** 顯示表單 */
      formShow: false,
      action: null,

      validateRules: {
        name: [{ required: true, message: '名稱為必要項', trigger: 'blur' }],
        ip: [{ required: true, message: 'IP為必要項', trigger: 'blur' }],
        frontUrl: [{ required: true, message: 'frontUrl為必要項', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.getList()
    this.getIpcDropDownList()
  },

  methods: {
    /**
     * 取得IPC列表
     */
    getList() {
      const vm = this
      const payload = {
        isEnable: null
      }
      getIPCList(payload)
        .then(response => {
          vm.ipcList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 取得IPC下拉選單
     */
    getIpcDropDownList() {
      const vm = this
      const payload = {
        isEnable: true
      }
      getIPCList(payload)
        .then(response => {
          vm.ipcDropDownList = response.data.Payload
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
          this.resetData()
          break

        case 'update':
          const new_obj = Object.assign({}, row)
          this.formShow = true
          this.action = action
          this.ipcForm = Object.assign({}, new_obj)
          break
      }
    },

    /**
     * 送出表單
     */
    submitForm() {
      this.$refs['ipcForm']
        .validate()
        .then(() => {
          const payload = this.ipcForm

          switch (this.action) {
            case 'create':
              payload.id = 0
              break
            case 'update':
              break
            default:
              console.log(`undefined action: ${this.action}`)
          }

          update(payload)
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
      this.ipcForm = {}
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
            Id: row.id
          }

          deleteIPC(payload)
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
    },

    confirmSyncDialog(row = {}) {
      this.$confirm('確定要同步?', '注意！確定要同步?', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'danger'
      })
        .then(() => {
          console.log('this.inputList', this.ipcList)
          const payload = this.ipcList

          const url = `http://${this.selectIPC}/api/Ipc/Sync`
          axios
            .post(url, payload)
            .then(response => {
              this.$message({
                type: 'success',
                message: '同步成功'
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
            message: '取消同步'
          })
        })
    }
  }
}
</script>
