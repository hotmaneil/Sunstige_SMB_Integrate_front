<template>
  <div>
    <h3>狀態條件設定 Status Condition Setting -{{ title }}</h3>

    <!--table tools-->
    <div class="table-tools">
      <el-row>
        <el-col :span="22">
          <el-button type="success" plain icon="el-icon-edit" @click="dataForm('create')">新增 </el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="back()">返回</el-button>
        </el-col>
      </el-row>

    </div>

    <el-table :data="conditionDataList">
      <el-table-column property="sequence" label="條件順序" />

      <el-table-column property="di" label="DI">
        <template slot-scope="scope">
          <span>{{ scope.row | diText }}</span>
        </template>
      </el-table-column>

      <el-table-column property="status" label="Action">
        <template slot-scope="{ row }">
          <span>{{ row.status | actionText }}</span>
        </template>
      </el-table-column>
      <el-table-column property="status_condition" label="Condition" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="dataForm('update', scope.row)" />

            <el-button type="danger" size="small" icon="el-icon-delete" @click="dataForm('delete', scope.row)" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!--表單-->
    <el-dialog title="編輯狀態條件設定" :visible.sync="formShow" width="700px">
      <el-form
        ref="conditionForm"
        :model="conditionForm"
        label-position="right"
        label-width="110px"
        style="padding-left:10px;padding-right:10px;"
        :rules="validateRules"
      >
        <el-form-item label="條件順序" prop="sequence">
          <el-input-number v-model="conditionForm.sequence" :readonly="action === 'update'" />
        </el-form-item>
        <el-form-item label="Di" prop="Di">
          <el-select v-model="conditionForm.di" placeholder="Select">
            <el-option
              v-for="item in diList"
              :key="item.sequence"
              :label="`${item.sequence}(${item.purpose})`"
              :value="item.sequence"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Action" prop="status">
          <el-select v-model="conditionForm.status" placeholder="Select">
            <el-option v-for="item in actionList" :key="item.value" :label="item.text" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Trigger" prop="triggerCh">
          <el-checkbox v-model="conditionForm.triggerCh" />
        </el-form-item>
        <el-form-item label="Condition" prop="Condition">
          <el-select v-model="conditionForm.status_condition" placeholder="Select">
            <el-option v-for="item in conditionList" :key="item.value" :label="item.text" :value="item.value" />
          </el-select>
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
import {
  getStatusConditionByID,
  getStatusByID,
  getDIByID,
  getDeviceStatusConditionById,
  updateStatusCondition,
  deleteStatusCondition
} from '@/api/SMBDevice'
export default {
  components: {},
  filters: {
    diText: function(row) {
      const text = `d${row.di}(${row.purpose})`
      return text
    },

    actionText: function(value) {
      switch (value) {
        case 0:
          return ''
        case 1:
          return '亮'
        case 2:
          return '閃'
        case 3:
          return '熄'
        case 4:
          return 'Counter'
      }
    }
  },
  data() {
    return {
      /** 機台狀態 Id */
      device_status_id: null,

      /** 條件資料列表 */
      conditionDataList: [],

      /** 機台狀態 */
      deviceStatus: null,

      title: null,

      /** 顯示表單 */
      formShow: false,

      /** 動作是新增還是修改 */
      action: null,

      /** 條件表單 */
      conditionForm: {},

      /** 驗證表單規則 */
      validateRules: {},

      /** 機台 Di List */
      diList: [],

      /**
       * 1.亮2.閃3.熄
       */
      actionList: [
        { value: 1, text: '亮' },
        { value: 2, text: '閃' },
        { value: 3, text: '熄' }
      ],

      conditionList: [
        { value: 'and', text: 'and' },
        { value: 'then', text: 'then' },
        { value: 'end', text: 'end' }
      ]
    }
  },

  created() {
    this.getDeviceStatus()
    this.getConditionDataList()
  },

  methods: {
    /**
     * 取得機台狀態資料
     */
    getDeviceStatus() {
      const vm = this
      const paylaod = {
        device_status_id: this.$route.params.device_status_id
      }

      getStatusByID(paylaod)
        .then(response => {
          vm.deviceStatus = response.data.Payload
          vm.title = `${vm.deviceStatus.name}(${vm.deviceStatus.main_status_id})`
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 取得狀態條件設定列表
     */
    getConditionDataList() {
      const vm = this
      const paylaod = {
        device_status_id: this.$route.params.device_status_id
      }

      getStatusConditionByID(paylaod)
        .then(response => {
          vm.conditionDataList = response.data.Payload
          vm.device_status_id = this.$route.params.device_status_id
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 取得機台Di列表
     */
    getDiList() {
      const vm = this
      const paylaod = {
        Id: vm.deviceStatus.device_id
      }

      getDIByID(paylaod)
        .then(response => {
          vm.diList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 取得資料表單
     */
    dataForm(action, row = {}) {
      this.getDiList()
      switch (action) {
        case 'create':
          this.action = 'create'
          this.formShow = true
          this.conditionForm = {}
          this.conditionForm.device_status_id = this.$route.params.device_status_id
          break

        case 'update':
          this.action = 'update'
          this.formShow = true

          const paylaod = {
            Id: row.id
          }

          getDeviceStatusConditionById(paylaod)
            .then(response => {
              this.conditionForm = response.data.Payload
            })
            .catch(err => {
              console.log(err)
            })
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
      this.$refs['conditionForm']
        .validate()
        .then(() => {
          switch (this.action) {
            case 'create':
            case 'update':
              const payload = this.conditionForm
              updateStatusCondition(payload)
                .then(response => {
                  this.$notify({
                    title: '成功',
                    message: '更新成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.resetData()
                  this.getConditionDataList()
                  this.formShow = false
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
          const payload = {
            id: row.id
          }

          deleteStatusCondition(payload)
            .then(response => {
              this.$message({
                type: 'success',
                message: '刪除成功'
              })
              this.getConditionDataList()
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
      this.conditionForm = {}
    },

    /** 回上一頁 */
    back() {
      history.go(-1)
    }
  }
}
</script>
