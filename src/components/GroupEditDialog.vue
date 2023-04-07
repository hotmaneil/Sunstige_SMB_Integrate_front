<template>
  <el-dialog :visible.sync="dialog" width="80%" @close="CancelEdit(formModel)">
    <div slot="title" class="header-title">
      設定 成型條件
      <span style="padding: 3px 0"> {{ formModel.EquipmentID }} </span>
      <span style="padding: 3px 0"> {{ formModel.GroupName }} </span>
      <span style="padding: 3px 0"> {{ formModel.SubCategory }} </span>
    </div>
    <el-form :model="formModel">
      <ul>
        <li
          v-for="(field, index2) in formModel.fields"
          :key="index2"
          style="margin: 1px; clear: both"
        >
          <label style="margin: 1px; clear: both"> {{ field.FieldName }}</label>
          <!-- <el-tag
            :disable-transitions="false"
            :type="field.Value | valueFilter"
          >
            {{ field.Value }}
          </el-tag> -->
          <div class="block" style="margin: 10px 0 0 10px">
            <el-switch
              v-model="field.IsDisplay"
              active-color="#13ce66"
              active-text="顯示在總表"
              inactive-color="#ff4949"
              style="margin: 10px 0 0 10px; float: left"
            />

            <!-- <el-switch
              v-model="field.IsChart"
              active-color="#13ce66"
              active-text="顯示圖表"
              inactive-color="#ff4949"
              style="margin:10px 0 0 10px;float:left;"
            /> -->

            <el-switch
              v-model="field.IsLimit"
              active-color="#13ce66"
              active-text="管制"
              inactive-color="#ff4949"
              style="margin: 10px 0 0 10px; float: left"
            />

            <div
              v-if="formModel.GroupName == 'Actual' && field.IsLimit"
              class="block"
            >
              <el-form-item
                label="定義 不良 標準差倍數"
                style="margin: 0 0 10px 50px; float: left"
              >
                <el-input-number
                  v-model="formModel.BadSdMultiple"
                  :min="1"
                  :max="6"
                  size="small"
                  class="edit-input"
                />
              </el-form-item>
              <el-form-item
                label="定義 嚴重不良 標準差倍數"
                style="margin: 0 0 10px 50px; float: left"
              >
                <el-input-number
                  v-model="formModel.SeriouslyBadSdMultiple"
                  :min="1"
                  :max="6"
                  size="small"
                  class="edit-input"
                />
              </el-form-item>
            </div>
            <div
              v-if="formModel.GroupName == 'SetValue' && field.IsLimit"
              class="block"
            >
              <el-form-item
                label="UpperLimit"
                style="margin: 0 0 10px 50px; float: left"
              >
                <el-input-number
                  v-model="field.UpperLimit"
                  label="Sort"
                  size="small"
                  class="edit-input"
                  :precision="field.Precision"
                  :step="field.Precision | toStep"
                />
              </el-form-item>
              <el-form-item
                label="LowerLimit"
                style="margin: 0 0 10px 50px; float: left"
              >
                <el-input-number
                  v-model="field.LowerLimit"
                  label="Sort"
                  size="small"
                  class="edit-input"
                  :precision="field.Precision"
                  :step="field.Precision | toStep"
                />
              </el-form-item>
            </div>
          </div>
        </li>
      </ul>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialog = false">取 消</el-button>
      <el-button
        type="primary"
        @click="ConfirmEdit(formModel)"
      >保存到常用設定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateItemList } from '@/api/FieldName'
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
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [
        {
          value: 'INTEGER',
          label: '整數'
        },
        {
          value: 'DOUBLE',
          label: '浮點數'
        },
        {
          value: 'BOOL',
          label: '布林'
        },
        {
          value: 'STRING',
          label: '字串'
        },
        {
          value: 'Undecided',
          label: '未定'
        }
      ],
      options2: [
        {
          value: 'SetValue',
          label: 'SetValue'
        },
        {
          value: 'Actual',
          label: 'Actual'
        }
      ],
      equipment: {},
      formModel: {},
      fields: [],
      IsEnabled: false,
      value: '',
      dialog: false,
      formLabelWidth: '120px',
      activeNames: [],
      selectStyle: 'width:100%',

      groupFields: []
    }
  },
  computed: {
    GetProductTypeList() {
      if (this.equipments.optionList.length === 0) {
        return []
      }
      return this.equipments.optionList.filter(x => {
        if (x.OptionGroup === 'ProductType') return true
      })
    },
    GetMaterialList() {
      if (this.equipments.optionList.length === 0) {
        return []
      }
      return this.equipments.optionList.filter(x => {
        if (x.OptionGroup === 'Material') return true
      })
    }
  },

  watch: {
    isVisible(newValue) {
      this.dialog = newValue

      if (newValue) {
        this.fields = Object.assign([], this.model)
        // console.log('dialogFormVisible', this.fields)

        this.formModel.EquipmentID = this.fields[0].EquipmentID
        this.formModel.Device = this.fields[0].EquipmentID
        this.formModel.GroupName = this.fields[0].GroupName
        this.formModel.SubCategory = this.fields[0].SubCategory

        var _array = this.fields.filter(x => {
          if (x.IsDisplay === true) return true
        })

        this.formModel.fields = []
        _array.map(x => {
          this.formModel.fields.push(x)
        })
      }
    }
  },

  methods: {
    CancelEdit(row) {
      this.dialog = false
      console.log('onDialogVisible!', row)

      this.$emit('onDialogVisible', false, null)
    },

    ConfirmEdit(group) {
      this.UpAllDate(group)
    },

    UpAllDate(group) {
      // 改用 await 等待 Promise 內的工作全部完成
      const results = Promise.all(
        group.fields.map(async row => {
          const newrow = Object.assign({}, row)
          this.groupFields.push(newrow)
          console.log('this.groupFields', this.groupFields)
          return true
        })

      ).then(isOK => {
        this.post_updateItemList(this.groupFields)

        if (isOK.reduce((a, b) => a && b)) {
          this.$message({
            message: 'The data has been update',
            type: 'success'
          })
          this.dialog = false
        }
        this.listLoading = false
      }).catch(response => {
        console.log('catch', response)
        this.listLoading = false
      })

      return results
    },

    /**
     * 更新多筆欄位
     */
    post_updateItemList(dataList) {
      return new Promise((resolve, reject) => {
        updateItemList(dataList)
          .then(response => {
            console.log('post_updateItemList response', response)
            resolve(response)
          })
          .catch(error => {
            console.error(error)
            reject(error)
          })
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
  content: '';
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

ul {
  list-style-type: none;
}
</style>
