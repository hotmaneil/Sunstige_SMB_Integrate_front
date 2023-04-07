<template>
  <el-dialog
    title="Setting"
    :visible.sync="dialog"
    width="80%"
    @close="CancelEdit(formModel)"
  >
    <div slot="title" class="header-title">
      <span style="padding: 3px 0"> {{ formModel.EquipmentID }} </span>
      <span style="padding: 3px 0"> {{ formModel.FieldID }} </span>
      <span style="padding: 3px 0"> {{ formModel.FieldName }} </span>
      <!-- <span style="padding: 3px 0">  {{ formModel.Offset }}  </span> -->
      <span style="padding: 3px 0"> {{ formModel.Unit }} </span>
      <span style="padding: 3px 0"> {{ formModel.Average }} </span>
      <span style="padding: 3px 0"> {{ formModel.LowerLimit }} </span>
      <span style="padding: 3px 0"> {{ formModel.UpperLimit }} </span>
    </div>

    <el-form ref="formModel" :model="formModel" label-width="120px">
      <div class="block">
        <el-form-item label="Name" :label-width="formLabelWidth">
          <el-input
            v-model="formModel.FieldName"
            class="edit-input"
            size="small"
          />
        </el-form-item>

        <el-form-item label="SubCategory" :label-width="formLabelWidth">
          <el-input
            v-model="formModel.SubCategory"
            class="edit-input"
            size="small"
          />
        </el-form-item>

        <el-form-item label="Sort" :label-width="formLabelWidth">
          <el-input-number
            v-model="formModel.SortID"
            :min="1"
            :max="99999"
            label="Sort"
            size="small"
            class="edit-input"
          />
        </el-form-item>
      </div>

      <div class="block">
        <el-form-item label="顯示" :label-width="formLabelWidth">
          <el-switch
            v-model="formModel.IsDisplay"
            :label-width="formLabelWidth"
            active-color="#13ce66"
            active-text="顯示在總表"
            inactive-color="#ff4949"
          />
        </el-form-item>

        <el-form-item label="是否顯示圖表" :label-width="formLabelWidth">
          <el-switch
            v-model="formModel.IsChart"
            :label-width="formLabelWidth"
            active-color="#13ce66"
            active-text="顯示圖表"
            inactive-color="#ff4949"
          />
        </el-form-item>

        <!-- <el-form-item label="繪圖型態" :label-width="formLabelWidth">
            <el-select
              v-model="formModel.FieldType"
              placeholder="please select FieldType"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
        <el-form-item label="型態" :label-width="formLabelWidth">
          <el-select
            v-model="formModel.FieldType"
            placeholder="please select FieldType"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!--  <el-form-item label="群組" :label-width="formLabelWidth">
          <el-select
              v-model="formModel.GroupName"
              placeholder="please select GroupName"
            >
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>-->
        <el-form-item label="單位" :label-width="formLabelWidth">
          <el-input v-model="formModel.Unit" class="edit-input" size="small" />
        </el-form-item>
        <el-form-item label="小數點精度" :label-width="formLabelWidth">
          <el-input-number
            v-model="formModel.Precision"
            :min="0"
            :max="10"
            label="Sort"
            size="small"
            class="edit-input"
          />
        </el-form-item>
      </div>
      <div class="block">
        <div v-if="formModel.GroupName == 'Actual'" class="block">
          <el-form-item label="標準差設定" :label-width="formLabelWidth">
            <el-switch
              v-model="formModel.IsLimit"
              active-color="#13ce66"
              active-text="isLimit"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item
            label="定義 不良 標準差倍數"
            :label-width="formLabelWidth"
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
            :label-width="formLabelWidth"
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
        <div v-if="formModel.GroupName == 'SetValue'" class="block">
          <el-form-item label="上下限警示設定" :label-width="formLabelWidth">
            <el-switch
              v-model="formModel.IsLimit"
              active-color="#13ce66"
              active-text="isLimit"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item label="UpperLimit" :label-width="formLabelWidth">
            <el-input-number
              v-model="formModel.UpperLimit"
              size="small"
              class="edit-input"
              :precision="formModel.Precision"
              :step="formModel.Precision | toStep"
            />
          </el-form-item>
          <el-form-item label="LowerLimit" :label-width="formLabelWidth">
            <el-input-number
              v-model="formModel.LowerLimit"
              size="small"
              class="edit-input"
              :precision="formModel.Precision"
              :step="formModel.Precision | toStep"
            />
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialog = false">取 消</el-button>
      <el-button
        type="primary"
        @click="ConfirmEdit(formModel)"
      >確 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateItem } from '@/api/FieldName'
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
      default: null
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
          value: 'System.Int32',
          label: '整數'
        },
        {
          value: 'System.Double',
          label: '浮點數'
        },
        {
          value: 'System.Boolean',
          label: '布林'
        },
        {
          value: 'System.String',
          label: '字串'
        },
        {
          value: 'System.Object',
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
      value: '',
      dialog: false,
      formLabelWidth: '120px',
      activeNames: []
    }
  },
  watch: {
    isVisible(newValue) {
      this.dialog = newValue

      if (newValue) {
        this.formModel = Object.assign({}, this.model)

        if (this.formModel.LowerLimit === 0) {
          this.formModel.LowerLimit =
            this.formModel.Value - this.formModel.Value * 0.1
        }

        if (this.formModel.UpperLimit === 0) {
          this.formModel.UpperLimit =
            this.formModel.Value + this.formModel.Value * 0.1
        }

        console.log(
          'formModel',
          this.formModel,
          this.formModel.Value,
          this.formModel.UpperLimit,
          this.formModel.LowerLimit
        )
      }
    }
  },
  methods: {
    CancelEdit(row) {
      this.dialog = false
      this.$emit('onDialogVisible', false, null)
    },

    async ConfirmEdit(row) {
      console.log('ConfirmEdit', row)
      this.model.SortID = row.SortID

      this.model.FieldName = row.FieldName
      this.model.FieldType = row.FieldType
      this.model.Unit = row.Unit
      this.model.Precision = row.Precision
      this.model.Offset = row.Offset
      this.model.GroupName = row.GroupName
      this.model.SubCategory = row.SubCategory
      this.model.IsDisplay = row.IsDisplay
      this.model.IsEnabled = row.IsEnabled
      this.model.IsLimit = row.IsLimit
      this.model.IsChart = row.IsChart

      this.model.BadSdMultiple = row.BadSdMultiple
      this.model.SeriouslyBadSdMultiple = row.SeriouslyBadSdMultiple

      this.model.LowerLimit = row.LowerLimit
      this.model.UpperLimit = row.UpperLimit

      var newrow = Object.assign({}, this.model)
      console.log('updateItem', newrow)
      this.listLoading = true
      await updateItem(newrow)
        .then(response => {
          this.$message({
            message: 'The data has been update',
            type: 'success'
          })
          this.dialog = false
          this.listLoading = false
          this.$emit('onDialogVisible', false, newrow)
        })
        .catch(error => {
          this.listLoading = false
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
