<template>
  <el-dialog :visible.sync="dialogFormVisible" class="formStyle" @close="cancelEdit()">
    <span slot="title">
      <!-- <img src="@/assets/SBD_logo_250.png" alt="logo"> -->
    </span>

    <el-form
      ref="form"
      :model="form"
      :rules="validateRules"
      label-width="120px"
    >
      <el-form-item label="工單編號" prop="workNo">
        <el-input v-model="form.workNo" />
      </el-form-item>

      <el-form-item label="Equipment ID" prop="equipmentid">
        <el-input v-model="form.equipmentid" @change="checkDevice()" />
      </el-form-item>

      <el-form-item label="Input User" prop="user">
        <el-input v-model="form.user" />
      </el-form-item>

      <el-form-item label="Materials ID" prop="material">
        <el-select
          v-model="form.material"
          placeholder="please select Materials ID"
          style="width: 100%"
        >
          <el-option v-for="item in materialsList" :key="item.prodt_id" :label="item.prodt_name" :value="item.prodt_id" />
        </el-select>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="success" @click="insertFieldNameList()">Materials Input</el-button>
      <el-button @click="cancelEdit()">Cancel</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDeviceByID } from '@/api/SMBDevice'
import { getProdtMaterialList } from '@/api/ProdtMaterials'
import { MultiUpdateFieldNameList } from '@/api/FieldName'

export default {
  components: {},
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

      materialsList: [],

      form: {},
      formLabelWidth: '100',

      /** 儲存按鈕是否Disabled */
      isDisabled: true,

      /** 是否存在設備 */
      isEquipmentExist: false,

      /** fieldName列表作為新增用 */
      fieldNameList: [],

      /** 設備IP */
      equipmentIp: null,

      validateRules: {
        // workNo: [{ required: true, message: '工單編號為必要項', trigger: 'blur' }],
        equipmentid: [{ required: true, message: 'Equipment ID為必要項', trigger: 'blur' }],
        material: [{ required: true, message: 'Materials ID為必要項', trigger: 'blur' }]
      }
    }
  },

  watch: {
    isVisible(newValue) {
      this.dialogFormVisible = newValue
    },

    deviceId(newValue) {
      this.clickedDeviceId = newValue
      this.form.equipmentid = newValue
    },

    ip(newValue) {
      this.equipmentIp = newValue
    }
  },

  created() {
    this.setMaterialList()
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
     * 建立物料列表
     */
    setMaterialList() {
      const vm = this
      const payload = {}
      getProdtMaterialList(payload).then(response => {
        vm.materialsList = response.data.Payload
      })
    },

    /**
     * 檢查設備
     */
    checkDevice() {
      const vm = this

      const equipmentPayload = {
        Id: vm.form.equipmentid
      }
      getDeviceByID(equipmentPayload)
        .then(response => {
          var equipment = response.data.Payload
          console.log('checkDeviceAndMold getDeviceByID', equipment)
          if (equipment.id === undefined || equipment.id === null) {
            vm.isEquipmentExist = false
            this.$message.error('機台錯誤!')
          } else {
            if (this.clickedDeviceId === vm.form.equipmentid) {
              vm.isEquipmentExist = true
            } else {
              vm.isEquipmentExist = false
              this.$message.error('機台錯誤!')
            }
          }
        })
        .finally(() => {
          this.judgeDisabled()
        })
    },

    /**
     * 判斷是否Disabled
     */
    judgeDisabled() {
      const vm = this
      if (vm.isEquipmentExist === true) {
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
      this.$refs['form']
        .validate()
        .then(() => {
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
            Value: 0
          }
          this.fieldNameList.push(fieldNameMold)

          // 材料編號
          var materialFieldID = commonPreId + 'Production.MaterialId'
          var fieldNamematerial = {
            FieldID: materialFieldID,
            EquipmentID: this.form.equipmentid,
            FieldName: '材料編號',
            Value: this.form.material
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
              message: 'Materials Input success',
              type: 'success'
            })
            this.dialogFormVisible = false
          })

          this.form = {}
        })
        .catch(err => {
          console.log('表單檢查未過!!', err)
          return false
        })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
