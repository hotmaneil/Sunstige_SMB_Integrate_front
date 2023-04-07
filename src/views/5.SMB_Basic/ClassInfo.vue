<template>
  <div class="app-container">
    <h3>班別管理 Class Manager </h3>

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

    <!-- Table -->
    <el-table
      :data="classList"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :default-sort="{ prop: 'id', order: 'ascending' }"
    >
      <el-table-column
        prop="id"
        label="ID"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="ip" label="名稱" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="start_time"
        label="開始時間"
        align="center"
        width="110"
      >
        <template slot-scope="{ row }">
          <span>{{ row.start_time }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="end_time"
        label="結束時間"
        align="center"
        width="110"
      >
        <template slot-scope="{ row }">
          {{ row.end_time }}
        </template>
      </el-table-column>

      <el-table-column
        prop="EnableDate"
        label="啟用日期"
        align="center"
        width="220"
      >
        <template slot-scope="{ row }">
          {{ row.EnableDate }}
        </template>
      </el-table-column>

      <el-table-column
        prop="DisableDate"
        label="停用日期"
        align="center"
        width="110"
      >
        <template slot-scope="{ row }">
          <span>{{ row.DisableDate }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="WorkMinute"
        label="計劃工時(分)"
        align="center"
        width="220"
      >
        <template slot-scope="{ row }">
          {{ row.WorkMinute }}
        </template>
      </el-table-column>

      <el-table-column
        prop="Memo"
        label="備註"
        align="center"
        width="220"
      >
        <template slot-scope="{ row }">
          {{ row.Memo }}
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
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!--表單-->
    <el-dialog title="編輯機台" :visible.sync="formShow" width="700px">
      <el-form
        ref="classForm"
        :model="classForm"
        label-position="right"
        label-width="110px"
        style="padding-left:10px;padding-right:10px;"
        :rules="validateRules"
      >
        <el-form-item label="名稱" prop="name">
          <el-input v-model="classForm.name" :readonly="action==='update'" />
        </el-form-item>
        <el-form-item label="開始時間" prop="start_time">
          <el-time-picker
            v-model="classForm.start_time"
            placeholder="請選開始時間"
            format="HH:mm"
          />
        </el-form-item>
        <el-form-item label="結束時間" prop="end_time">
          <el-time-picker
            v-model="classForm.end_time"
            placeholder="請選結束時間"
            format="HH:mm"
          />
        </el-form-item>
        <el-form-item label="啟用日期" prop="EnableDate">
          <el-date-picker
            v-model="classForm.EnableDate"
            type="date"
            placeholder="請選啟用日期"
          />
        </el-form-item>
        <el-form-item label="停用日期" prop="disableDate">
          <el-date-picker
            v-model="classForm.disableDate"
            type="date"
            placeholder="請選停用日期"
          />
        </el-form-item>
        <el-form-item label="計劃工時(分)" prop="WorkMinute">
          <el-input v-model="classForm.WorkMinute" />
        </el-form-item>
        <el-form-item label="備註" prop="Memo">
          <el-input v-model="classForm.Memo" />
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
import { getList, update } from '@/api/SMBClassInfo'
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      /** 班別列表 */
      classList: [],

      /** 班別表單 */
      classForm: {},

      action: null,

      formShow: false,

      validateRules: {
        name: [
          { required: true, message: '名稱為必要項', trigger: 'blur' }
        ],
        start_time: [
          { required: true, message: '開始時間為必要項', trigger: 'blur' }
        ],
        end_time: [
          { required: true, message: '結束時間為必要項', trigger: 'blur' }
        ],
        EnableDate: [
          { required: true, message: '啟用日期為必要項', trigger: 'blur' }
        ],
        disableDate: [
          { required: true, message: '停用日期為必要項', trigger: 'blur' }
        ],
        WorkMinute: [
          { required: true, message: '計劃工時(分)為必要項', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.getClassList()
  },

  methods: {
    /**
     * 取得班別列表
     */
    getClassList() {
      const vm = this
      getList()
        .then(response => {
          // console.log("response.Payload", response.data.Payload);
          vm.classList = response.data.Payload
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
          this.formShow = true
          this.resetData()
          break

        case 'update':
          const new_obj = Object.assign({}, row)
          this.formShow = true
          this.action = action
          this.classForm = Object.assign({}, new_obj)
          const now = new Date()
          console.log('now', moment(now).format('yyyy-MM-DD'))
          this.classForm.start_time = moment(moment(now).format('yyyy-MM-DD') + ' ' + this.classForm.start_time)
          this.classForm.end_time = moment(moment(now).format('yyyy-MM-DD') + ' ' + this.classForm.end_time)
          this.classForm.disableDate = this.classForm.DisableDate
          break
      }
    },

    /**
     * 送出表單
     */
    submitForm() {
      this.$refs['classForm']
        .validate()
        .then(() => {
          this.classForm.start_time = moment(this.classForm.start_time).format('HH:mm')
          this.classForm.end_time = moment(this.classForm.end_time).format('HH:mm')
          console.log('start_time', this.classForm.start_time)
          console.log('end_time', this.classForm.end_time)

          const payload = this.classForm

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
              this.getClassList()
              this.formShow = false
            })
            .catch(err => {
              console.log('errvi', err)
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
      this.classForm = {}
    }
  }
}
</script>
