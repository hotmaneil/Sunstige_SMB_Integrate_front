<template>
  <div class="app-container">
    <h3>設備保養</h3>

    <!--table tools-->
    <el-row>
      <el-col :span="12">
        <div class="table-tools">
          <el-button type="success" plain icon="el-icon-edit" @click="dataForm('create')">新增</el-button>
        </div>
        <br>

        <el-button type="success" circle />月保
        <el-button type="warning" circle />季保
        <el-button type="primary" circle />年保
        <img src="@/assets/breakDownIcon.png" alt="breakDown" height="5%" width="5%">
        故障
      </el-col>
    </el-row>

    <el-table
      :data="equipmentMaintainPlanList.filter(data=>!search||data.EquipmentId.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
    >
      <el-table-column prop="equipmentImage" label="設備圖" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="loadImage(scope.row)"
            fit="fill"
          />
        </template>
      </el-table-column>

      <el-table-column prop="EquipmentId" label="設備" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.EquipmentId }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="January" label="1月" align="center">
        <template slot-scope="{ row }">
          <el-button
            v-for="item in row.MonthMaintainPeriodTypeList"
            v-if="item.Month===1"
            :key="item.EquipmentmaintainplanId"
            :type="customCircleByType(item,1)"
            circle
            @click="dataForm('update',row,1,item.EquipmentmaintainplanId)"
          />
          <img v-if="customiClass(row,1)" src="@/assets/breakDownIcon.png" alt="breakDown" height="50%" width="50%">
        </template>
      </el-table-column>

      <el-table-column prop="February" label="2月" align="center">
        <template slot-scope="{ row }">
          <el-button
            v-for="item in row.MonthMaintainPeriodTypeList"
            v-if="item.Month===2"
            :key="item.EquipmentmaintainplanId"
            :type="customCircleByType(item,2)"
            circle
            @click="dataForm('update',row,2,item.EquipmentmaintainplanId)"
          />
          <img v-if="customiClass(row,2)" src="@/assets/breakDownIcon.png" alt="breakDown" height="50%" width="50%">
        </template>
      </el-table-column>

      <el-table-column prop="March" label="3月" align="center">
        <template slot-scope="{ row }">
          <el-button
            v-for="item in row.MonthMaintainPeriodTypeList"
            v-if="item.Month===3"
            :key="item.EquipmentmaintainplanId"
            :type="customCircleByType(item,3)"
            circle
            @click="dataForm('update',row,3,item.EquipmentmaintainplanId)"
          />
          <img v-if="customiClass(row,3)" src="@/assets/breakDownIcon.png" alt="breakDown" height="50%" width="50%">
        </template>
      </el-table-column>

      <el-table-column prop="April" label="4月" align="center">
        <template slot-scope="{ row }">
          <el-button
            v-for="item in row.MonthMaintainPeriodTypeList"
            v-if="item.Month===4"
            :key="item.EquipmentmaintainplanId"
            :type="customCircleByType(item,4)"
            circle
            @click="dataForm('update',row,4,item.EquipmentmaintainplanId)"
          />
          <img v-if="customiClass(row,4)" src="@/assets/breakDownIcon.png" alt="breakDown" height="50%" width="50%">
        </template>
      </el-table-column>

      <el-table-column prop="May" label="5月" align="center">
        <template slot-scope="{ row }">
          <el-button
            v-for="item in row.MonthMaintainPeriodTypeList"
            v-if="item.Month===5"
            :key="item.EquipmentmaintainplanId"
            :type="customCircleByType(item,5)"
            circle
            @click="dataForm('update',row,5,item.EquipmentmaintainplanId)"
          />
          <img v-if="customiClass(row,5)" src="@/assets/breakDownIcon.png" alt="breakDown" height="50%" width="50%">
        </template>
      </el-table-column>

      <el-table-column prop="June" label="6月" align="center">
        <template slot-scope="{ row }">
          <el-button
            v-for="item in row.MonthMaintainPeriodTypeList"
            v-if="item.Month===6"
            :key="item.EquipmentmaintainplanId"
            :type="customCircleByType(item,6)"
            circle
            @click="dataForm('update',row,6,item.EquipmentmaintainplanId)"
          />
          <img v-if="customiClass(row,6)" src="@/assets/breakDownIcon.png" alt="breakDown" height="50%" width="50%">
        </template>
      </el-table-column>

      <el-table-column prop="July" label="7月" align="center">
        <template slot-scope="{ row }">
          <el-button
            v-for="item in row.MonthMaintainPeriodTypeList"
            v-if="item.Month===7"
            :key="item.EquipmentmaintainplanId"
            :type="customCircleByType(item,7)"
            circle
            @click="dataForm('update',row,7,item.EquipmentmaintainplanId)"
          />
          <img v-if="customiClass(row,7)" src="@/assets/breakDownIcon.png" alt="breakDown" height="50%" width="50%">
        </template>
      </el-table-column>

      <el-table-column prop="August" label="8月" align="center">
        <template slot-scope="{ row }">
          <el-button
            v-for="item in row.MonthMaintainPeriodTypeList"
            v-if="item.Month===8"
            :key="item.EquipmentmaintainplanId"
            :type="customCircleByType(item,8)"
            circle
            @click="dataForm('update',row,8,item.EquipmentmaintainplanId)"
          />
          <img v-if="customiClass(row,8)" src="@/assets/breakDownIcon.png" alt="breakDown" height="50%" width="50%">
        </template>
      </el-table-column>

      <el-table-column prop="September" label="9月" align="center">
        <template slot-scope="{ row }">
          <el-button
            v-for="item in row.MonthMaintainPeriodTypeList"
            v-if="item.Month===9"
            :key="item.EquipmentmaintainplanId"
            :type="customCircleByType(item,9)"
            circle
            @click="dataForm('update',row,9,item.EquipmentmaintainplanId)"
          />
          <img v-if="customiClass(row,9)" src="@/assets/breakDownIcon.png" alt="breakDown" height="50%" width="50%">
        </template>
      </el-table-column>

      <el-table-column prop="October" label="10月" align="center">
        <template slot-scope="{ row }">
          <el-button
            v-for="item in row.MonthMaintainPeriodTypeList"
            v-if="item.Month===10"
            :key="item.EquipmentmaintainplanId"
            :type="customCircleByType(item,10)"
            circle
            @click="dataForm('update',row,10,item.EquipmentmaintainplanId)"
          />
          <img v-if="customiClass(row,10)" src="@/assets/breakDownIcon.png" alt="breakDown" height="50%" width="50%">
        </template>
      </el-table-column>

      <el-table-column prop="November" label="11月" align="center">
        <template slot-scope="{ row }">
          <el-button
            v-for="item in row.MonthMaintainPeriodTypeList"
            v-if="item.Month===11"
            :key="item.EquipmentmaintainplanId"
            :type="customCircleByType(item,11)"
            circle
            @click="dataForm('update',row,11,item.EquipmentmaintainplanId)"
          />
          <img v-if="customiClass(row,11)" src="@/assets/breakDownIcon.png" alt="breakDown" height="50%" width="50%">
        </template>
      </el-table-column>

      <el-table-column prop="December" label="12月" align="center">
        <template slot-scope="{ row }">
          <el-button
            v-for="item in row.MonthMaintainPeriodTypeList"
            v-if="item.Month===12"
            :key="item.EquipmentmaintainplanId"
            :type="customCircleByType(item,12)"
            circle
            @click="dataForm('update',row,12,item.EquipmentmaintainplanId)"
          />
          <img v-if="customiClass(row,12)" src="@/assets/breakDownIcon.png" alt="breakDown" height="50%" width="50%">
        </template>
      </el-table-column>

      <el-table-column>
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="搜尋"
          />
        </template>
        <template slot-scope="scope" align="center">
          <el-button-group>
            <el-button
              size="mini"
              :type="scope.row.pdf===null?'':'primary'"
              :disabled="scope.row.pdf===null"
              @click="openPDF(scope.row)"
            >保養手冊
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="openFaultForm(scope.row)"
            >故障標記
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!--表單-->
    <el-dialog :title="title" :visible.sync="formShow">
      <el-form
        ref="equipmentMaintainPlanForm"
        :model="equipmentMaintainPlanForm"
        label-position="right"
        label-width="210px"
        style="padding-left:0px;padding-right:10px;"
        :rules="validateRules"
      >
        <el-form-item label="保養類型" prop="MaintainPeriodType">
          <el-select v-model="equipmentMaintainPlanForm.MaintainPeriodType" placeholder="請選擇保養類型">
            <el-option v-for="item in maintainPeriodTypeEnumList" :key="item.id" :label="item.value" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="保養月份" prop="Month">
          <el-select v-model="equipmentMaintainPlanForm.Month" placeholder="請選擇保養月份">
            <el-option v-for="item in monthList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="設備" prop="EquipmentId">
          <el-select v-model="equipmentMaintainPlanForm.EquipmentId" placeholder="請選擇設備">
            <el-option v-for="item in equipmentList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="預排保養時間" prop="PlanMaintainTime">
          <el-date-picker
            v-model="equipmentMaintainPlanForm.PlanMaintainTime"
            type="datetime"
            placeholder="預排保養時間"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="action==='update'" type="danger" @click="submitDeleteForm()">
          刪除
        </el-button>
        <el-button @click="formShow = false">
          取消
        </el-button>
        <el-button type="primary" @click="submitForm()">
          送出
        </el-button>
      </div>
    </el-dialog>

    <!--故障標記表單-->
    <el-dialog :title="faultTitle" :visible.sync="faultFormShow">
      <el-form
        ref="faultForm"
        :model="faultForm"
        label-position="right"
        label-width="210px"
        style="padding-left:0px;padding-right:10px;"
        :rules="validateRules"
      >
        <el-form-item label="故障日期時間" prop="FaultTime">
          <el-date-picker
            v-model="faultForm.FaultTime"
            type="datetime"
            placeholder="故障日期時間"
          />
        </el-form-item>

        <el-form-item label="設備" prop="EquipmentId">
          <el-select v-model="faultForm.EquipmentId" placeholder="請選擇設備">
            <el-option v-for="item in equipmentList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="故障原因" prop="FaultReason">
          <el-input v-model="faultForm.FaultReason" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="faultForm.ID!==0" type="danger" @click="submitDeleteFaultForm()">
          刪除
        </el-button>
        <el-button @click="faultFormShow = false">
          取消
        </el-button>
        <el-button type="primary" @click="submitFaultForm()">
          送出
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from '@/api/SMBDevice'
import {
  getEquipmentMaintainPlanList,
  getEquipmentmaintainPlan,
  updateEquipmentMaintainPlan,
  maintainPeriodTypeEnumList,
  deleteEquipmentMaintainPlan
} from '@/api/EquipmentMaintainPlan'
import moment from 'moment'

export default {
  data() {
    return {

      /** 顯示表單 */
      formShow: false,
      title: null,

      /** 設備保養計畫列表 */
      equipmentMaintainPlanList: [],

      /** 設備保養表單 */
      equipmentMaintainPlanForm: {},

      /** 故障表單 */
      faultForm: {},
      faultFormShow: false,
      faultTitle: null,

      /** 保養週期類型列表 */
      maintainPeriodTypeEnumList: [],

      /** 設備列表 */
      equipmentList: [],

      monthList: [],

      validateRules: {},

      search: '',

      action: null,

      iconImgSrc: '@/assets/breakDownIcon.png'
    }
  },

  created() {
    this.getList()
    this.initEquipmentsList()
    this.initMonthList()
    this.getMaintainPeriodTypeEnumList()
  },

  methods: {

    /**
     * 取得設備保養計畫列表
     */
    getList() {
      const vm = this
      getEquipmentMaintainPlanList()
        .then(response => {
          vm.equipmentMaintainPlanList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 取得資料表單
     */
    dataForm(action, row = {}, month = null, equipmentmaintainplanId) {
      console.log('action', action)

      switch (action) {
        case 'create':
          this.action = action
          this.formShow = true
          this.title = '新增設備保養排程計畫'
          this.equipmentMaintainPlanForm = {}
          break

        case 'update':
          console.log('month', month)
          console.log('row', row)
          console.log('EquipmentmaintainplanId', equipmentmaintainplanId)
          this.formShow = true
          this.action = action
          this.title = '編輯設備保養排程計畫'

          // 從月份和設備編號查
          this.setEquipmentmaintainPlan(month, row.EquipmentId, equipmentmaintainplanId)
          break
      }
    },

    /**
     * 故障表單資料
     */
    openFaultForm(row = {}) {
      this.faultForm = {}
      console.log('openFaultForm row', row)
      this.faultFormShow = true
      this.faultTitle = '故障標記'
      this.faultForm.ID = 0
      this.setFaultForm(row.EquipmentId)
      this.faultForm.EquipmentId = row.EquipmentId
    },

    /** 取得保養週期類型enum列表 */
    getMaintainPeriodTypeEnumList() {
      const vm = this
      maintainPeriodTypeEnumList()
        .then(response => {
          vm.maintainPeriodTypeEnumList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 送出表單
     */
    submitForm() {
      this.$refs['equipmentMaintainPlanForm']
        .validate()
        .then(() => {
          const payload = this.equipmentMaintainPlanForm
          console.log('submitForm payload', payload)
          if (payload.PlanMaintainTime === null || payload.PlanMaintainTime === undefined) {
            console.log('PlanMaintainTime result', payload.PlanMaintainTime)
          } else {
            payload.PlanMaintainTime = moment(payload.PlanMaintainTime).format('YYYY-MM-DD HH:mm')
          }
          updateEquipmentMaintainPlan(payload)
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
    },

    /** 送交刪除表單 */
    submitDeleteForm() {
      this.$confirm('確定要刪除?', '注意！確定要刪除?', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        const payload = {
          ID: this.equipmentMaintainPlanForm.ID
        }
        deleteEquipmentMaintainPlan(payload)
          .then(response => {
            this.$notify({
              title: '成功',
              message: '刪除成功',
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
    },

    /** 送交刪除故障表單 */
    submitDeleteFaultForm() {
      this.$confirm('確定要刪除?', '注意！確定要刪除?', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        const payload = {
          ID: this.faultForm.ID
        }
        deleteEquipmentMaintainPlan(payload)
          .then(response => {
            this.$notify({
              title: '成功',
              message: '刪除成功',
              type: 'success',
              duration: 2000
            })
            this.resetData()
            this.getList()
            this.faultFormShow = false
          })
          .catch(err => {
            console.log(err)
          })
      })
    },

    /**
     * 送交故障表單
     */
    submitFaultForm() {
      this.$refs['faultForm']
        .validate()
        .then(() => {
          const payload = this.faultForm
          payload.FaultTime = moment(payload.FaultTime).format('YYYY-MM-DD HH:mm')
          payload.MaintainPeriodType = 'Fault'
          updateEquipmentMaintainPlan(payload)
            .then(response => {
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
              this.faultFormShow = false
              this.faultForm = {}
            })
            .catch(err => {
              console.log(err)
            })
        })
    },

    /**
     * 重設表單
     */
    resetData() {
      this.formShow = false
      this.equipmentMaintainPlanForm = {}
    },

    /**
     * 依照參數產生不同顏色圓圈（單一圈）
     */
    customCircle(row, Month) {
      var result = ''
      row.MonthMaintainPeriodTypeList.forEach(element => {
        if (element.Month === Month) {
          switch (element.MaintainPeriodType) {
            case 'Month':
              result = 'success'
              break
            case 'Quarterly':
              result = 'warning'
              break
            case 'Year':
              result = 'primary'
              break
          }
        }
      })
      return result
    },

    /**
     * 依照參數產生不同顏色圓圈（多重圈）
     */
    customCircleByType(item, month) {
      var result = ''
      if (item.Month === month) {
        switch (item.MaintainPeriodType) {
          case 'Month':
            result = 'success'
            break
          case 'Quarterly':
            result = 'warning'
            break
          case 'Year':
            result = 'primary'
            break
        }
      }
      return result
    },

    /**
     * 故障標記
     */
    customiClass(row, Month) {
      var result = false
      row.MonthMaintainPeriodTypeList.forEach(element => {
        if (element.Month === Month) {
          return result
        } else {
          if (element.Month === 0 && element.MaintainPeriodType === 'Fault') {
            var currentMonth = moment(element.FaultTime).format('M')
            if (currentMonth == Month) {
              result = true
            }
          }
        }
      })
      return result
    },

    /**
     * 初始取得設備列表
     */
    initEquipmentsList() {
      const paylaod = {
        isEnable: null
      }
      getList(paylaod)
        .then(response => {
          const vm = this
          vm.equipmentList = response.data.Payload
        }).catch(err => {
          console.log(err)
        })
    },

    /**
     * 初始化月份列表
     */
    initMonthList() {
      const vm = this
      for (var num = 1; num <= 12; num++) {
        vm.monthList.push(num)
      }
    },

    /**
     * 取得一筆設備保養紀錄
     */
    setEquipmentmaintainPlan(month, equipmentId, id) {
      console.log('setEquipmentmaintainPlan month', month)
      console.log('setEquipmentmaintainPlan equipmentId', equipmentId)
      console.log('setEquipmentmaintainPlan id', id)
      const vm = this
      const paylaod = {
        Month: month,
        EquipmentId: equipmentId,
        ID: id
      }
      getEquipmentmaintainPlan(paylaod)
        .then(response => {
          vm.equipmentMaintainPlanForm = response.data.Payload

          if (vm.equipmentMaintainPlanForm.Month === null || vm.equipmentMaintainPlanForm.Month === 0) {
            vm.equipmentMaintainPlanForm.Month = month
          }

          if (this.equipmentMaintainPlanForm.EquipmentId === null) {
            this.equipmentMaintainPlanForm.EquipmentId = equipmentId
          }
        }).catch(err => {
          console.log(err)
        })
    },

    /**
     * 故障表單給值
     */
    setFaultForm(equipmentId) {
      const vm = this
      const paylaod = {
        Month: 0,
        EquipmentId: equipmentId
      }
      getEquipmentmaintainPlan(paylaod)
        .then(response => {
          var dataResult = response.data.Payload
          console.log('setFaultForm dataResult', dataResult)
          if (dataResult.ID !== 0) {
            vm.faultForm = dataResult
          }
        }).catch(err => {
          console.log(err)
        })
    },

    /** 載入圖片 */
    loadImage(row = {}) {
      let url = null
      if (row.DevicePicList.length > 0) {
        row.DevicePicList.forEach(pic => {
          url = `http://${window.sunstige_conf.API_DOMAIN}/Device/${row.EquipmentId}/${pic.PicName}`
        })
      }
      return url
    },

    /**
     * 開啟PDF
     */
    openPDF(row = {}) {
      var href = `http://${window.sunstige_conf.API_DOMAIN}/DevicePDF/${row.EquipmentId}/${row.pdf}`
      window.open(href)
    }
  }

}
</script>
