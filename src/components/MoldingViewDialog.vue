<template>
  <el-dialog title=" " :visible.sync="dialog" width="80%" @close=" cancelEdit (formModel) ">
    <div slot="title" class="header-title">
      <span style="padding: 3px 0">    設定 成型條件 </span>
      <span style="padding: 3px 0">  {{ formModel.EquipmentID }}  </span>
      <span style="padding: 3px 0">  {{ formModel.GroupName }}  </span>
      <span style="padding: 3px 0">  {{ formModel.SubCategory }}  </span>

    </div>
    <el-form ref="formModel" :model="formModel" label-width="120px" label-position="left">
      <el-form-item label="模具號" :label-width="formLabelWidth">
        <el-input v-model="formModel.MoldNumber" class="edit-input" size="small" />
      </el-form-item>

      <el-form-item label="產品別" :label-width="formLabelWidth">
        <el-select
          v-model="formModel.ProductType"
          placeholder="please select product type"
          style="width:100%"
        >
          <el-option
            v-for="(ProductType ) in GetProductTypeList"
            :key="ProductType.Name"
            :label="ProductType.Label"
            :value="ProductType.Name"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="材料" :label-width="formLabelWidth">
        <el-select
          v-model="formModel.Material"
          placeholder="please select material"
          style="width:100%"
        >
          <el-option
            v-for="(material ) in GetMaterialList"
            :key="material.Name"
            :label="material.Label"
            :value="material.Name"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="設備" :label-width="formLabelWidth">
        <el-input v-model="formModel.Device" class="edit-input" size="small" />
      </el-form-item>
      <el-form-item label="備註" :label-width="formLabelWidth">
        <el-input
          v-model="formModel.Remarks"
          type="textarea"
          :rows="2"
          placeholder="請輸入内容"
          size="small"
          class="edit-input"
        />
      </el-form-item>

      <el-form-item label="是否啟用管制" :label-width="formLabelWidth">
        <el-switch
          v-model="formModel.IsEnabled"
          :label-width="formLabelWidth"
          active-color="#13ce66"
          active-text="管制"
          inactive-color="#ff4949"
        /> </el-form-item>

      <ul
        v-for="(Groupdata,index) in formModel.fields"
        :key="index"
      >
        <li
          v-for="(field,index2) in Groupdata "
          :key="index2"
          style="margin:1px;clear:both;"
        >
          <label style="margin:10px 0 0 10px;float:left;"> {{ field.FieldName }}</label>
          <!-- <el-tag
            :disable-transitions="false"
            :type="field.Value | valueFilter"
          >
            {{ field.Value }}
          </el-tag> -->

          <el-switch
            v-model="field.IsLimit"
            active-color="#13ce66"
            active-text="isLimit"
            inactive-color="#ff4949"
            style="margin:10px 0 0 10px;float:left;"
          />

          <el-form-item label="UpperLimit" style="margin:0 0 10px 50px;float:left;">
            <el-input-number v-model="field.UpperLimit" label="Sort" size="small" class="edit-input" :precision="field.Precision" :step="field.Precision|toStep" />
          </el-form-item>
          <el-form-item label="LowerLimit" style="margin:0 0 10px 50px;float:left;">
            <el-input-number v-model="field.LowerLimit" label="Sort" size="small" class="edit-input" :precision="field.Precision" :step="field.Precision|toStep" />
          </el-form-item>
        </li>
      </ul>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialog=false">取 消</el-button>
      <el-button type="primary" @click=" confirmEdit (formModel) ">保存到常用設定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addItem } from '@/api/MoldingBackup'
import { mapGetters } from 'vuex'
import { formatDate } from '@/utils/validate'
export default {
  filters: {
    valueFilter(status) {
      return 'success'
    },

    formatDateFilter(value) {
      return formatDate(value, 'MM-dd HH:mm:ss')
    },

    smallformatDateFilter(value) {
      return formatDate(value, 'HH:mm:ss')
    },

    toStep(value) {
      return 1 / Math.pow(10, value)
    }
  },
  props: {
    model: {
      type: Array,
      default: function() {
        return []
      }
    },
    dialogFormVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [{
        value: 'INTEGER',
        label: '整數'
      }, {
        value: 'DOUBLE',
        label: '浮點數'
      }, {
        value: 'BOOL',
        label: '布林'
      }, {
        value: 'STRING',
        label: '字串'
      }, {
        value: 'Undecided',
        label: '未定'
      }],
      options2: [{
        value: 'SetValue',
        label: 'SetValue'
      }, {
        value: 'Actual',
        label: 'Actual'
      }],
      equipment: {},
      formModel: {},
      fields: [],
      value: '',
      dialog: false,
      formLabelWidth: '120px',
      activeNames: [],
      selectStyle: 'width:100%'

    }
  },
  computed: {
    ...mapGetters([
      'equipments'
    ]),
    GetProductTypeList() {
      if (this.equipments.optionList.length === 0) { return [] }
      return this.equipments.optionList.filter(x => { if (x.OptionGroup === 'ProductType') return true })
    },
    GetMaterialList() {
      if (this.equipments.optionList.length === 0) { return [] }
      return this.equipments.optionList.filter(x => { if (x.OptionGroup === 'Material') return true })
    }
  },

  watch: {
    dialogFormVisible(newValue) {
      this.dialog = newValue

      if (newValue) {
        this.fields = Object.assign([], this.model)
        this.formModel.EquipmentID = this.fields[0].EquipmentID
        this.formModel.Device = this.fields[0].EquipmentID
        this.formModel.GroupName = this.fields[0].GroupName
        this.formModel.SubCategory = this.fields[0].SubCategory

        var _array = this.fields.filter(x => { if (x.IsDisplay === true) return true })
        this.formModel.fields = {}
        _array.map(x => {
          if (!(x.SubCategory in this.formModel.fields)) {
            this.formModel.fields[x.SubCategory] = []
          }

          this.formModel.fields[x.SubCategory].push(x)
        })

        console.log(newValue, 'model', this.fields)
      }
    }
  },

  methods: {
    GetGroupdataChange() {
      if (this.fields.length === 0) { return [] }

      var _array = this.fields.filter(x => { if (x.IsDisplay === true) return true })
      // 分類 欄位

      var totalArray = {}

      _array.map(x => {
        if (!(x.SubCategory in totalArray)) {
          totalArray[x.SubCategory] = []
        }

        totalArray[x.SubCategory].push(x)
      })

      // console.log('totalArray', totalArray)

      return totalArray
    },

    cancelEdit(row) {
      this.dialog = false
      this.$emit('dialogVisible', false, null)
    },

    async confirmEdit(row) {
      this.equipment = this.equipments.list.find(x => x.EquipmentID === row.EquipmentID)

      // console.log('confirmEdit', row)

      await addItem(row)
        .then(response => {
          this.$message({
            message: 'The data has been update',
            type: 'success'
          })
          this.dialog = false
          this.$emit('dialogVisible', false, row)
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
font-size: 14px;
}

.item {
margin-top: 5px;
}

.clearfix:before,
.clearfix:after {
display: table;
content: "";
}
.clearfix:after {
clear: both;
}

.box-card {
  margin-bottom: 0px;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
padding: 0;
float: right;
}

.block {
  padding: 10px 8px;
  overflow: hidden;
  border-bottom: 1px solid #eff2f6;
}

.card-panel-col {
margin-bottom: 12px;
}

.card-panel {
  height: 108px;
  width: 300px;
  cursor: pointer;
  font-size: 16px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;

  &:hover {
    .icon-people {
      background: #40c9c6;
    }

    .icon-message {
      background: #36a3f7;
    }

    .icon-money {
      background: #f4516c;
    }

    .icon-shopping {
      background: #34bfa3;
    }
  }

  .icon-people {
    color: #000;
  }

  .icon-message {
    color: #36a3f7;
  }

  .icon-money {
    color: #f4516c;
  }

  .icon-shopping {
    color: #34bfa3;
  }

  .card-panel-description {
    float: right;
    font-weight: bold;
    margin: 26px;
    margin-left: 0px;

    .card-panel-ver {
      margin: 0px 0 0 0px;
      font-size: 14px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-text {
      color: rgba(204, 250, 0, 0.45);
      font-size: 18px;
      margin: 6px;
    }
    .card-panel-num {
      float: right;
      font-size: 36px;
      margin: 6px;
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
