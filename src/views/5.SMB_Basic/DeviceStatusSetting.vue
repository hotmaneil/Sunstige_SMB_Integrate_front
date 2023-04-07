<template>
  <div class="app-container">

    <el-row>
      <el-col :span="22">
        <h3>機台狀態設定 {{ deviceId }} Machine Status Setting</h3>
      </el-col>
      <el-col :span="2">
        <el-button @click="back()">返回</el-button>
      </el-col>
    </el-row>

    <!--table tools-->
    <div class="table-tools">
      <el-button
        type="success"
        plain
        icon="el-icon-edit"
        @click="dataForm('create')"
      >新增狀態
      </el-button>
    </div>

    <br>

    <!-- Table -->
    <el-table
      :data="deviceStatusList"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :default-sort="{ prop: 'id', order: 'ascending' }"
    >
      <el-table-column
        prop="name"
        label="狀態名稱"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="main_status_id" label="Status" sortable="custom">
        <template slot-scope="{ row }">
          <!-- <el-input v-model="row.main_status_id" /> -->
          <span>{{ row.main_status_id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="condition"
        label="條件"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.condition | conditionText }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="dataForm('update', scope.row)"
            >編輯狀態
            </el-button>

            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="openCondition(scope.row)"
            >條件
            </el-button>

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

    <!--編輯狀態之表單-->
    <el-dialog title="編輯狀態" :visible.sync="editFormShow" width="700px">
      <el-form
        ref="devicestatusForm"
        :model="devicestatusForm"
        label-position="right"
        label-width="110px"
        style="padding-left:10px;padding-right:10px;"
        :rules="validateRules"
      >
        <el-form-item label="狀態名稱" prop="name">
          <el-input v-model="devicestatusForm.name" />
        </el-form-item>
        <el-form-item label="Status" prop="main_status_id">
          <el-select
            v-model="devicestatusForm.main_status_id"
            placeholder="Select"
          >
            <el-option
              v-for="item in mainStatusList"
              :key="item.statusId"
              :label="item.statusId"
              :value="item.statusId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormShow = false">
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
import {
  getStatusList,
  updateStatus,
  getStatusByID,
  deleteStatus
} from '@/api/SMBDevice'
import { getList } from '@/api/MainStatus'

export default {
  components: {},
  filters: {
    /**
     * 回傳條件文字值
     */
    conditionText: function(json) {
      const actionArr = ['1.亮2.閃3.熄4.Counter', '亮', '閃', '熄', 'Counter']
      var text = ''
      json.forEach(element => {
        text += `di${element.di}(${element.purpose}) ${
          actionArr[element.status]
        } ${element.status_condition}\n`
      })
      return text
    }
  },
  data() {
    return {
      deviceStatusList: [],
      deviceId: null,

      /** 編輯狀態對話框顯示 */
      editFormShow: false,
      action: null,

      /** 狀態表單 */
      devicestatusForm: {},

      /** 驗證表單規則 */
      validateRules: {
        name: [{ required: true, message: '狀態名稱為必要項', trigger: 'blur' }]
      },

      /** 狀態下拉選單 */
      mainStatusList: [],

      /** 條件對話框顯示 */
      conditionDialogShow: false,

      /** 條件對話框標題 */
      conditionDialogTitle: null,

      /** 機台狀態 條件Id  */
      deviceStatusConditionId: null
    }
  },

  created() {
    this.getDeviceStatusSetting()
    this.getMainStatusDropDownList()
  },

  methods: {
    /**
     * 依照機台Id取得機台狀態設定列表
     */
    getDeviceStatusSetting() {
      console.log('this.$route.params.Id', this.$route.params.Id)
      const vm = this
      const paylaod = {
        Id: this.$route.params.Id
      }

      getStatusList(paylaod)
        .then(response => {
          console.log('response.data.Payload', response.data.Payload)
          vm.deviceStatusList = response.data.Payload
          vm.deviceId = this.$route.params.Id
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
          this.action = action
          this.editFormShow = true
          this.devicestatusForm.device_id = this.deviceId
          break

        case 'update':

          const payload = {
            device_status_id: row.device_status_id
          }

          getStatusByID(payload).then(response => {
            this.devicestatusForm = response.data.Payload
          })

          this.editFormShow = true
          this.action = action
          break

        case 'delete':
          this.action = 'delete'
          this.confirmDeleteDialog(row)
          break
      }
    },

    /**
     * 取得狀態下拉選單用
     */
    getMainStatusDropDownList() {
      const vm = this
      getList()
        .then(response => {
          vm.mainStatusList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 送出表單
     */
    submitForm() {
      this.$refs['devicestatusForm']
        .validate()
        .then(() => {
          switch (this.action) {
            case 'create':
            case 'update':
              const payload = this.devicestatusForm
              updateStatus(payload)
                .then(response => {
                  this.$notify({
                    title: '成功',
                    message: '更新成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.resetData()
                  this.getDeviceStatusSetting()
                  this.editFormShow = false
                })
                .catch(err => {
                  console.log(err)
                })
              break
            default:
              console.log(`undefined action: ${this.action}`)
          }
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
          console.log('del row', row)

          const payload = {
            device_status_id: row.device_status_id
          }

          deleteStatus(payload)
            .then(response => {
              this.$message({
                type: 'success',
                message: '刪除成功'
              })
              this.getDeviceStatusSetting()
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
    },

    /**
     * 開啟條件導向頁面
     */
    openCondition(dataItem) {
      console.log('dataItem', dataItem)

      const settingProps = this.$router.resolve({
        name: 'StatusConditionSetting',
        params: { device_status_id: dataItem.device_status_id }
      })
      this.$router.push(settingProps.route.fullPath)
    },

    /** 回上一頁 */
    back() {
      history.go(-1)
    }
  }
}
</script>
