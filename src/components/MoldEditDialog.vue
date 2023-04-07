<template>
  <div>
    <el-dialog title=" " :visible.sync="dialog" width="80%" @close=" cancelEdit (formModel) ">
      <div slot="title" class="header-title">
        設定 成型條件
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

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit(formModel)">取 消</el-button>
        <el-button type="primary" @click=" confirmEdit (formModel) ">保存到常用設定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { updateItem } from '@/api/MoldingBackup'
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
      type: Object,
      default: function() {
        return {}
      }
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      equipment: {},
      formModel: {},
      dialog: false,
      formLabelWidth: '120px'
    }
  },
  computed: {
    ...mapGetters([
      'equipments'
    ]),
    GetProductTypeList() {
      if (this.equipments.optionList.length === 0) { return [] }
      console.log(this.equipments.optionList)
      return []
      // return this.equipments.optionList.filter(x => { if (x.OptionGroup === 'ProductType') return true })
    },
    GetMaterialList() {
      if (this.equipments.optionList.length === 0) { return [] }
      console.log(this.equipments.optionList)
      return []
      // return this.equipments.optionList.filter(x => { if (x.OptionGroup === 'Material') return true })
    }
  },

  watch: {
    isVisible(newValue) {
      this.dialog = newValue

      if (newValue) {
        console.log('watch', this.model)
        this.formModel = Object.assign({}, this.model)

        // var _array = this.formModel.MoldingFields.filter(x => {
        //   if (x.IsDisplay === true) return true
        // })

        this.formModel.fields = []
        this.formModel.MoldingFields.map(x => {
          if (x.LowerLimit === 0) {
            x.LowerLimit = x.Value - x.Value * 0.1
          }

          if (x.UpperLimit === 0) {
            x.UpperLimit = x.Value + x.Value * 0.1
          }

          this.formModel.fields.push(x)
        })
      }
    }
  },

  methods: {
    cancelEdit(row) {
      this.dialog = false
      this.$emit('onDialogVisible', false, null)
    },

    async confirmEdit(row) {
      await updateItem(row.ID, row)
        .then(response => {
          this.$message({
            message: 'The data has been update',
            type: 'success'
          })
          this.dialog = false
          this.$emit('onDialogVisible', false, row)
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
}
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
