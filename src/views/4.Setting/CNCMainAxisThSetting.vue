<template>
  <div class="app-container">
    <h3>機台主軸與進給門檻值 (CNC)</h3>

    <!--table tools-->
    <div class="table-tools" style="margin-bottom:12px">
      <el-button type="success" plain icon="el-icon-edit" @click="dataForm('create')">新增 </el-button>
    </div>

    <!-- Table -->
    <el-table
      :data="CNCMainAxisThList"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :default-sort="{ prop: 'id', order: 'ascending' }"
    >
      <el-table-column prop="EquipmentID" label="機台" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.EquipmentID }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="spindlespeedth" label="主軸實際轉速門檻值">
        <template slot-scope="{ row }">
          <span>{{ row.spindlespeedth }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="feedrateoverrideth" label="進給率百分比門檻值" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.feedrateoverrideth }}</span>
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
    <el-dialog title="編輯機台主軸與進給門檻值 (CNC)" :visible.sync="formShow" width="700px">
      <el-form
        ref="CNCMainAxisThForm"
        :model="CNCMainAxisThForm"
        label-position="right"
        label-width="210px"
        style="padding-left:10px;padding-right:10px;"
        :rules="validateRules"
      >
        <el-form-item label="機台" prop="id">
          <!-- <el-input v-model="CNCMainAxisThForm.EquipmentID" readonly /> -->
          <el-select v-model="CNCMainAxisThForm.EquipmentID" placeholder="Select">
            <el-option v-for="item in deviceList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="主軸實際轉速門檻值" prop="spindlespeedth">
          <el-input-number v-model="CNCMainAxisThForm.spindlespeedth" />
        </el-form-item>
        <el-form-item label="進給率百分比門檻值" prop="feedrateoverrideth">
          <el-input-number v-model="CNCMainAxisThForm.feedrateoverrideth" />
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
import { getDeviceListByCategory } from '@/api/SMBDevice'
import { getList, update, deleteCNCMainAxisTh } from '@/api/CNC'
export default {
  components: {},

  data() {
    return {
      deviceList: [],

      CNCMainAxisThList: [],
      CNCMainAxisThForm: {},

      /** 顯示表單 */
      formShow: false,
      action: null
    }
  },

  created() {
    this.getDeviceList()
    this.getCNCMainAxisThList()
  },

  methods: {
    /** 取得機台列表 */
    getDeviceList() {
      const vm = this
      const payload = { Category: 'CNC' }
      getDeviceListByCategory(payload)
        .then(response => {
          vm.deviceList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 取得機台主軸與進給門檻值 (CNC)列表
     */
    getCNCMainAxisThList() {
      const vm = this
      getList()
        .then(response => {
          // console.log("response.Payload", response.data.Payload);
          vm.CNCMainAxisThList = response.data.Payload
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
          this.CNCMainAxisThForm = Object.assign({}, new_obj)
          break
      }
    },

    /**
     * 送出表單
     */
    submitForm() {
      this.$refs['CNCMainAxisThForm']
        .validate()
        .then(() => {
          const payload = this.CNCMainAxisThForm

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
              this.getCNCMainAxisThList()
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
      this.CNCMainAxisThForm = {}
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
            id: row.EquipmentID
          }

          deleteCNCMainAxisTh(payload)
            .then(response => {
              this.$message({
                type: 'success',
                message: '刪除成功'
              })
              this.getCNCMainAxisThList()
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
