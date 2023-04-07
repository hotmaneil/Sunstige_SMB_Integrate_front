<template>
  <div class="app-container">
    <h3>設備保養</h3>

    <!--table tools-->
    <el-row>
      <el-col :span="12">
        <div class="table-tools">
          <el-button type="success" plain icon="el-icon-edit" @click="dataForm('create')">填寫保養</el-button>
          <el-upload
            v-if="isEnableImportMaintainPlan"
            class="upload-demo"
            :action="uploadMaintainPlanUrl"
            :on-preview="handlePreviewExcel"
            multiple
            :limit="1"
            :on-exceed="handleExceedExcel"
            :file-list="excelFileList"
          >
            <el-button size="small" type="primary">上傳設備保養計畫</el-button>
            <div slot="tip" class="el-upload__tip">只限Excel檔</div>
          </el-upload>
        </div>
        <br>

        <img src="/maintainPeriodTypeImg/1_M_Finish.png" width="10%" height="10%">月保
        <img src="/maintainPeriodTypeImg/Q_Finish.png" width="7%" height="7%">季保
        <img src="/maintainPeriodTypeImg/Y_Finish.png" width="5%" height="5%">年保
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

      <el-table-column prop="EquipmentId" label="故障標記" align="center">
        <template slot-scope="{ row }">
          <img v-if="customBreakdown(row)" src="@/assets/breakDownIcon.png" alt="breakDown" height="30%" width="30%">
        </template>
      </el-table-column>

      <el-table-column prop="January" label="1月" align="center">
        <template slot-scope="{ row }">
          <img :src="judgeShowImg(row.MonthMaintainPeriodTypeList,1,row.EquipmentId)" @click="dataForm('update',row,1,null)">
        </template>
      </el-table-column>

      <el-table-column prop="February" label="2月" align="center">
        <template slot-scope="{ row }">
          <img :src="judgeShowImg(row.MonthMaintainPeriodTypeList,2,row.EquipmentId)" @click="dataForm('update',row,2,null)">
        </template>
      </el-table-column>

      <el-table-column prop="March" label="3月" align="center">
        <template slot-scope="{ row }">
          <img :src="judgeShowImg(row.MonthMaintainPeriodTypeList,3,row.EquipmentId)" @click="dataForm('update',row,3,null)">
        </template>
      </el-table-column>

      <el-table-column prop="April" label="4月" align="center">
        <template slot-scope="{ row }">
          <img :src="judgeShowImg(row.MonthMaintainPeriodTypeList,4,row.EquipmentId)" @click="dataForm('update',row,4,null)">
        </template>
      </el-table-column>

      <el-table-column prop="May" label="5月" align="center">
        <template slot-scope="{ row }">
          <img :src="judgeShowImg(row.MonthMaintainPeriodTypeList,5,row.EquipmentId)" @click="dataForm('update',row,5,null)">
        </template>
      </el-table-column>

      <el-table-column prop="June" label="6月" align="center">
        <template slot-scope="{ row }">
          <img :src="judgeShowImg(row.MonthMaintainPeriodTypeList,6,row.EquipmentId)" @click="dataForm('update',row,6,null)">
        </template>
      </el-table-column>

      <el-table-column prop="July" label="7月" align="center">
        <template slot-scope="{ row }">
          <img :src="judgeShowImg(row.MonthMaintainPeriodTypeList,7,row.EquipmentId)" @click="dataForm('update',row,7,null)">
        </template>
      </el-table-column>

      <el-table-column prop="August" label="8月" align="center">
        <template slot-scope="{ row }">
          <img :src="judgeShowImg(row.MonthMaintainPeriodTypeList,8,row.EquipmentId)" @click="dataForm('update',row,8,null)">
        </template>
      </el-table-column>

      <el-table-column prop="September" label="9月" align="center">
        <template slot-scope="{ row }">
          <img :src="judgeShowImg(row.MonthMaintainPeriodTypeList,9,row.EquipmentId)" @click="dataForm('update',row,9,null)">
        </template>
      </el-table-column>

      <el-table-column prop="October" label="10月" align="center">
        <template slot-scope="{ row }">
          <img :src="judgeShowImg(row.MonthMaintainPeriodTypeList,10,row.EquipmentId)" @click="dataForm('update',row,10,null)">
        </template>
      </el-table-column>

      <el-table-column prop="November" label="11月" align="center">
        <template slot-scope="{ row }">
          <img :src="judgeShowImg(row.MonthMaintainPeriodTypeList,11,row.EquipmentId)" @click="dataForm('update',row,11,null)">
        </template>
      </el-table-column>

      <el-table-column prop="December" label="12月" align="center">
        <template slot-scope="{ row }">
          <img :src="judgeShowImg(row.MonthMaintainPeriodTypeList,12,row.EquipmentId)" @click="dataForm('update',row,12,null)">
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
        :rules="formValidateRules"
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

        <!-- 暫時隱藏 -->
        <!-- <el-form-item label="預排保養時間" prop="PlanMaintainTime">
          <el-date-picker
            v-model="equipmentMaintainPlanForm.PlanMaintainTime"
            type="datetime"
            placeholder="預排保養時間"
          />
        </el-form-item> -->

        <el-form-item label="完成保養" prop="IsFinished">
          <el-switch v-model="equipmentMaintainPlanForm.IsFinished" />
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
  deleteEquipmentMaintainPlan,
  updateByParam
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

      formValidateRules: {
        MaintainPeriodType: [{ required: true, message: '保養類型為必要項', trigger: 'blur' }],
        Month: [{ required: true, message: '保養月份為必要項', trigger: 'blur' }],
        EquipmentId: [{ required: true, message: '設備為必要項', trigger: 'blur' }]
      },

      validateRules: {},

      search: '',

      action: null,

      iconImgSrc: '@/assets/breakDownIcon.png',

      /** 是否啟用匯入設備保養計畫之按鈕 */
      isEnableImportMaintainPlan: window.sunstige_conf.IsEnableImportMaintainPlan,

      /** 上傳Excel相關參數 */
      uploadMaintainPlanUrl: `http://${window.sunstige_conf.API_DOMAIN}//api/EquipmentMaintainPlan/ImportEquipmentMaintainPlanExcel`,
      excelFileList: []
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
          this.title = '填寫設備保養排程計畫'
          this.equipmentMaintainPlanForm = {}
          break

        case 'update':
          console.log('month', month)
          console.log('row', row)
          console.log('EquipmentmaintainplanId', equipmentmaintainplanId)
          this.formShow = true
          this.action = action
          this.title = '填寫要完成的設備保養排程計畫'

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
          updateByParam(payload)
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
     * 判斷並顯示對應的圖片
     */
    judgeShowImg(row, Month, EquipmentId) {
      var valueList = []
      console.log('judgeShowImg', row)
      row.forEach(element => {
        if (element.Month === Month) {
          if (element.MaintainPeriodType === 'Month') {
            var value1 = {
              EquipmentId: EquipmentId,
              MaintainPeriodType: 'Month',
              IsFinished: element.IsFinished
            }
            valueList.push(value1)
          }

          if (element.MaintainPeriodType === 'Quarterly') {
            var value2 = {
              EquipmentId: EquipmentId,
              MaintainPeriodType: 'Quarterly',
              IsFinished: element.IsFinished
            }
            valueList.push(value2)
          }

          if (element.MaintainPeriodType === 'Year') {
            var value3 = {
              EquipmentId: EquipmentId,
              MaintainPeriodType: 'Year',
              IsFinished: element.IsFinished
            }
            valueList.push(value3)
          }
        }
      })
      console.log('valueList', valueList)

      const monthTrue = valueList.filter(element => element.MaintainPeriodType === 'Month' && element.IsFinished === true)
      const quarterlyTrue = valueList.filter(element => element.MaintainPeriodType === 'Quarterly' && element.IsFinished === true)
      const yearTrue = valueList.filter(element => element.MaintainPeriodType === 'Year' && element.IsFinished === true)

      if (valueList.length === 3 && monthTrue.length === 0 && quarterlyTrue.length === 0 && yearTrue.length === 0) {
        return '/maintainPeriodTypeImg/YQM_Space.png'
      } else if (valueList.length === 2 && monthTrue.length === 0 && quarterlyTrue.length === 0 && yearTrue.length === 0) {
        return '/maintainPeriodTypeImg/QM_Space.png'
      } else if (valueList.length === 1 && monthTrue.length === 0 && quarterlyTrue.length === 0 && yearTrue.length === 0) {
        return '/maintainPeriodTypeImg/M_Space.png'
      } else if (valueList.length === 1 && monthTrue.length > 0) {
        return '/maintainPeriodTypeImg/1_M_Finish.png'
      } else if (valueList.length === 1 && yearTrue.length === 0) {
        return '/maintainPeriodTypeImg/Y_Space.png'
      } else if (valueList.length === 2 && monthTrue.length === 0 && quarterlyTrue.length > 0 && yearTrue.length === 0) {
        return '/maintainPeriodTypeImg/2_Q_Finish.png'
      } else if (valueList.length === 1 && yearTrue.length > 0) {
        return '/maintainPeriodTypeImg/Y_Finish.png'
      } else if (valueList.length === 1 && quarterlyTrue.length > 0) {
        return '/maintainPeriodTypeImg/Q_Finish.png'
      } else if (valueList.length === 2 && monthTrue.length > 0 && quarterlyTrue.length === 0 && yearTrue.length === 0) {
        return '/maintainPeriodTypeImg/2_M_Finish.png'
      } else if (valueList.length === 2 && monthTrue.length > 0 && quarterlyTrue.length > 0) {
        return '/maintainPeriodTypeImg/2_QM_Finish.png'
      } else if (valueList.length === 2 && monthTrue.length > 0 && yearTrue.length > 0) {
        return '/maintainPeriodTypeImg/2_MY_Finish.png'
      } else if (valueList.length === 2 && monthTrue.length > 0 && quarterlyTrue.length === 0 && yearTrue.length === 0) {
        return '/maintainPeriodTypeImg/2_MFYS.png'
      } else if (valueList.length === 2 && monthTrue.length === 0 && quarterlyTrue.length === 0 && yearTrue.length > 0) {
        return '/maintainPeriodTypeImg/2_MSYF.png'
      } else if (valueList.length === 2 && monthTrue.length === 0 && yearTrue.length === 0) {
        return '/maintainPeriodTypeImg/2_MY_Space.png'
      } else if (valueList.length === 2 && quarterlyTrue.length > 0 && yearTrue.length > 0) {
        return '/maintainPeriodTypeImg/2_QY_Finish.png'
      } else if (valueList.length === 2 && monthTrue.length === 0 && quarterlyTrue.length > 0 && yearTrue.length === 0) {
        return '/maintainPeriodTypeImg/2_QFYS.png'
      } else if (valueList.length === 2 && quarterlyTrue.length === 0 && yearTrue.length > 0) {
        return '/maintainPeriodTypeImg/2_QSYF.png'
      } else if (valueList.length === 2 && quarterlyTrue.length === 0 && yearTrue.length === 0) {
        return '/maintainPeriodTypeImg/2_QY_Space.png'
      } else if (valueList.length === 3 && monthTrue.length > 0 && quarterlyTrue.length === 0 && yearTrue.length === 0) {
        return '/maintainPeriodTypeImg/3_M_Finish.png'
      } else if (valueList.length === 3 && monthTrue.length === 0 && quarterlyTrue.length > 0 && yearTrue.length === 0) {
        return '/maintainPeriodTypeImg/3_Q_Finish.png'
      } else if (valueList.length === 3 && monthTrue.length > 0 && quarterlyTrue.length > 0 && yearTrue.length === 0) {
        return '/maintainPeriodTypeImg/3_QM_Finish.png'
      } else if (valueList.length === 3 && monthTrue.length === 0 && quarterlyTrue.length === 0 && yearTrue.length > 0) {
        return '/maintainPeriodTypeImg/3_Y_Finish.png'
      } else if (valueList.length === 3 && monthTrue.length === 0 && quarterlyTrue.length > 0 && yearTrue.length > 0) {
        return '/maintainPeriodTypeImg/3_QY_Finish.png'
      } else if (valueList.length === 3 && monthTrue.length > 0 && quarterlyTrue.length > 0 && yearTrue.length > 0) {
        return '/maintainPeriodTypeImg/3_YQM_Finish.png'
      } else if (valueList.length === 3 && monthTrue.length > 0 && quarterlyTrue.length === 0 && yearTrue.length > 0) {
        return '/maintainPeriodTypeImg/3_MY_Finish.png'
      }
    },

    /**
     * 依照月份找出故障標記
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
     * 新欄位之故障標記
     */
    customBreakdown(row) {
      var result = false
      row.MonthMaintainPeriodTypeList.forEach(element => {
        if (element.Month === 0 && element.MaintainPeriodType === 'Fault') {
          result = true
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
    },

    handlePreviewExcel(file) {
      console.log('handlePreviewExcel', file)
    },

    handleExceedExcel(files, fileList) {
      this.$message.warning(`只限一個檔案, 你選的檔案數 ${files.length} , 已加進總共 ${files.length + fileList.length}檔案數超過限制 `)
    }
  }

}
</script>
