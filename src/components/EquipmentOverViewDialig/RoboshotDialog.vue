<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    class="formStyle"
    @close="cancelEdit()"
  >
    <span slot="title">
      <!-- <img src="@/assets/SBD_logo_250.png" alt="logo"> -->
    </span>

    <el-row>
      <el-col :span="4">
        <span>工單編號</span>
      </el-col>
      <el-col :span="12"><el-input v-model="form.workNo" autocomplete="off" /></el-col>
    </el-row>

    <br>

    <el-row>
      <el-col :span="4">
        <span>Equipment ID</span>
      </el-col>
      <el-col :span="12">
        <el-input v-model="form.equipmentid" autocomplete="off" @change="checkDevice()" />
      </el-col>
      <el-col :span="8">
        <barcode value="ex" height="20" display-value="false">
          barcode
        </barcode>
      </el-col>
    </el-row>

    <br>

    <el-row>
      <el-col :span="4">
        <span>Mold Online User</span>
      </el-col>
      <el-col :span="12">
        <el-input v-model="form.user" autocomplete="off" />
      </el-col>
    </el-row>

    <br>

    <el-row>
      <el-col :span="4">
        <span>Mold ID</span>
      </el-col>
      <el-col :span="12">
        <el-input v-model="form.moldId" autocomplete="off" @change="checkMold()" />
      </el-col>
      <el-col :span="8">
        <barcode value="ex" height="20" display-value="false">
          barcode
        </barcode>
      </el-col>
    </el-row>

    <span slot="footer" class="dialog-footer">
      <el-button type="success" :disabled="isDisabled" @click="insertFieldNameList()">Online</el-button>
      <el-button @click="cancelEdit()">Cancel</el-button>
    </span>
  </el-dialog>

</template>

<script>
import VueBarcode from 'vue-barcode'
import { getDeviceByID } from '@/api/SMBDevice'
import { getCommoldByID } from '@/api/Mold'
import { MultiUpdateFieldNameList } from '@/api/FieldName'

export default ({
  components: { 'barcode': VueBarcode },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },

    deviceId: {
      type: String,
      default: ''
    },

    ip: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      dialogFormVisible: false,

      /** 按下的設備Id */
      clickedDeviceId: null,

      form: {
        equipmentid: '',
        moldId: '',
        workNo: null
      },
      formLabelWidth: '100',

      /** 儲存按鈕是否Disabled */
      isDisabled: true,

      /** 是否存在設備 */
      isEquipmentExist: false,

      /** 是否存在模具 */
      isMoldExist: false,

      /** fieldName列表作為新增用 */
      fieldNameList: [],

      /** 設備IP */
      equipmentIp: null
    }
  },

  watch: {
    isVisible(newValue) {
      this.dialogFormVisible = newValue
    },

    deviceId(newValue) {
      this.clickedDeviceId = newValue
    },

    ip(newValue) {
      this.equipmentIp = newValue
    }
  },

  methods: {
    /**
     * 取消編輯
     */
    cancelEdit() {
      this.dialogFormVisible = false
      this.$emit('onDialogVisible', this.dialogFormVisible)
    },

    /**
     * 檢查設備
     */
    checkDevice() {
      const vm = this

      const equipmentPayload = {
        Id: vm.form.equipmentid.trim()
      }
      getDeviceByID(equipmentPayload).then(response => {
        var equipment = response.data.Payload
        console.log('checkDeviceAndMold getDeviceByID', equipment)
        if (equipment.id === undefined || equipment.id === null) {
          vm.isEquipmentExist = false
          this.$message.error('機台錯誤!')
        } else {
          if (this.clickedDeviceId === vm.form.equipmentid.trim()) {
            vm.isEquipmentExist = true
          } else {
            vm.isEquipmentExist = false
            this.$message.error('機台錯誤!')
          }
        }
      }).finally(() => {
        this.judgeDisabled()
      })
    },

    /**
     * 檢查模具
     */
    checkMold() {
      const vm = this

      const moldPayload = {
        Id: vm.form.moldId
      }

      getCommoldByID(moldPayload).then(response => {
        var mold = response.data.Payload
        console.log('checkDeviceAndMold getCommoldByID', mold)
        if (mold.ModelID === undefined || mold.ModelID === null) {
          vm.isMoldExist = false
          this.$message.error('模具錯誤!')
        } else {
          vm.isMoldExist = true
        }
      }).finally(() => {
        this.judgeDisabled()
      })
    },

    /**
     * 判斷是否Disabled
     */
    judgeDisabled() {
      console.log('judgeDisabled')
      const vm = this
      if (vm.isEquipmentExist === true && vm.isMoldExist === true) {
        console.log('通過')
        vm.isDisabled = false
      } else {
        console.log('不通過')
        vm.isDisabled = true
      }
    },

    /**
     * 寫入三筆FieldName
     */
    insertFieldNameList() {
      var ipArray = []
      ipArray = this.equipmentIp.split('.')
      console.log('ipArray', ipArray)

      var newIpString = ''
      ipArray.forEach(element => {
        newIpString += element + '_'
      })
      console.log('newIpString', newIpString)

      var commonPreId = `ns=2;s=${this.clickedDeviceId}_${newIpString}`

      this.fieldNameList = []

      // 模具編號
      var moldFieldID = commonPreId + 'Production.MoldId'
      var fieldNameMold = {
        FieldID: moldFieldID,
        EquipmentID: this.form.equipmentid,
        FieldName: '模具編號',
        Value: this.form.moldId
      }
      this.fieldNameList.push(fieldNameMold)

      // 材料編號
      var materialFieldID = commonPreId + 'Production.MaterialId'
      var fieldNamematerial = {
        FieldID: materialFieldID,
        EquipmentID: this.form.equipmentid,
        FieldName: '材料編號',
        Value: 0
      }
      this.fieldNameList.push(fieldNamematerial)

      // 工單編號
      var workNoFieldID = commonPreId + 'Production.WorkPlanId'
      var fieldNameWorkNo = {
        FieldID: workNoFieldID,
        EquipmentID: this.form.equipmentid,
        FieldName: '工單編號',
        Value: this.form.workNo
      }
      this.fieldNameList.push(fieldNameWorkNo)

      MultiUpdateFieldNameList(this.fieldNameList).then(response => {
        console.log('MultiUpdateFieldNameList response.data.Payload', response.data.Payload)
        this.$message({
          message: 'Online success',
          type: 'success'
        })
        this.dialogFormVisible = false
      })

      this.form = {}
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
