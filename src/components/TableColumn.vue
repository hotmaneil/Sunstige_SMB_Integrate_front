<template>
  <div>
    <el-table
      :data="dataArray"
      element-loading-text="Loading"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :max-height="tableHeight"
      :default-sort="{ prop: 'TriggerTime', order: 'descending' }"
      @sort-change="changeTableSort"
    >
      <el-table-column
        v-for="(field, index) in colsArray"
        :key="index"
        :prop="field.FieldID"
        :label="field.FieldName+field.Unit"
        :width="setWidth(field)"
        :fixed="index === 0"
      >
        <template slot="header" slot-scope="scope">
          <span v-if="field.ID === -1" class="info">
            {{ scope.column.label==='undefined'?'TriggerTime':scope.column.label }}
          </span>

          <div style="text-align:center;">
            <span
              v-if="field.ID !== -1"
              style="writing-mode:vertical-lr; font-size:16px;"
              :class="field.styletype"
              @click="handleSetData('field', field)"
            >
              <el-tooltip placement="top">
                <div slot="content">
                  {{ field.EquipmentID }} {{ field.GroupName }}
                  {{ field.FieldName }} IsLimit:{{ field.IsLimit }}
                </div>
                <i v-if="field.GroupName == 'SetValue'" class="el-icon-edit" />
                <i v-if="field.GroupName == 'Actual'" class="el-icon-info" />
              </el-tooltip>
              {{ scope.column.label }}
            </span>
          </div>
        </template>

        <!-- <template v-if="field.sort===0" slot-scope="scope">
          {{ scope.row[field.prop] }}    {{ scope.row[field.prop] | formatDateFilter }}
        </template> -->

        <template slot-scope="scope">
          <div v-if="field.ID === -1" class="info" style="font-size:14px;">
            {{ scope.row[field.ID].Value | formatDateFilter }}
          </div>
          <div v-if="field.ID !== -1" :class="formatFontColor(scope.row[field.ID])" style="font-size:14px;">
            {{ scope.row[field.ID].Value }}
          </div>
        </template>
      </el-table-column>

      <!-- <el-table-column
          v-if="field.type==='sort'"
          :prop="field.prop"
          sortable
        >
          <template scope="scope">
            <el-tag type="primary">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column> -->
    </el-table>

    <setting-dialog-field
      :model="fieldnowitem"
      :dialog-form-visible="fielddialogFormVisible"
      @dialogVisible="fielddialogVisible"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatDate } from '@/utils/validate'
import SettingDialogField from '@/components/SettingDialogField'
import { windowHeight } from '@/utils'

/* const statusMap = {
  RUN: 'primary',
  Down: 'warning',
  IDLE: 'success',
  OFFLINE: 'warning',
  ALARM: 'danger',
  MANUAL: 'info',
  AUTOMATIC: 'primary',
  SEMI_AUTOMATIC: 'primary',
  On: 'success',
  Off: 'danger',
  True: 'success',
  False: 'danger'
}*/

export default {
  components: { SettingDialogField },
  filters: {
    FloatFilter(field1) {
      var vv = parseFloat(field1.Value)
      if (!isNaN(vv)) {
        // console.log(field1.Field, vv, field1.Precision, vv.toFixed(field1.Precision))
        return vv.toFixed(field1.Field.Precision)
      }

      return field1.Value
    },

    statusFilter(value) {
      // console.log(value)
      return ''
    },
    formatDateFilter(value) {
      // console.log(value)
      return formatDate(value, 'MM-dd HH:mm:ss')
    }
  },
  props: {
    tabledata: {
      type: Array,
      required: true,
      default: function() {
        return []
      }
    },
    columns: {
      type: Array,
      required: true,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      dataArray: [],
      colsArray: [],

      fielddialogFormVisible: false,
      fieldnowitem: {},
      tableHeight: windowHeight() - 250
    }
  },
  computed: {
    ...mapGetters(['equipments'])
  },
  watch: {
    tabledata: {
      deep: true,
      handler() {
        this.GetColumnsChange()
      }
    }
  },

  created() {},
  beforeDestroy() {},
  methods: {
    IsLimitFilter(field) {
      if (field.IsLimit) {
        return 'primary'
      }
      return 'info'
    },
    TryParseDouble(v) {
      var vv = parseFloat(v)
      if (!isNaN(vv)) return vv
      return v
    },
    GetColumnsChange() {
      this.colsArray = []

      if (this.columns.length > 0) {
        this.columns.map(x => {
          x.styletype = this.IsLimitFilter(x)
          this.colsArray.push(Object.assign({}, x))
        })

        this.colsArray.sort(function(a, b) {
          return a.SortID - b.SortID
        })

        // console.log('colsArray', this.colsArray)
      }

      this.dataArray = []

      if (this.tabledata.length > 0) {
        this.tabledata.map(row => {
          var newrow = {}

          newrow[-1] = {
            Average: 0,
            Field: null,
            StandardDifference: 0,
            Value: row.TriggerTime
          }

          row.Items.map(x => {
            if (x.FieldID) {
              var vv = parseFloat(x.Value)
              if (!isNaN(vv)) {
                x.Value = vv.toFixed(x.Field.Precision)
              }
              newrow[x.FID] = Object.assign({}, x)
              // console.log('newrow', newrow[x.FID].Value, x.FID)
            }
          })
          this.dataArray.push(newrow)
        })
      }
    },
    handleSetData(type, item) {
      // console.log('setEdit', type, item)

      if (type === 'group') {
        this.groupitems = item
        this.dialogFormVisible = true
      } else if (type === 'field') {
        this.fieldnowitem = item
        this.fielddialogFormVisible = true
      } else if (type === 'checkbox') {
        // console.log('is Chart', type, item)
      }
    },
    changeTableSort(column) {
      if (column.order === 'ascending') {
        this.order_prop = column.prop
        this.desc_prop = 0
      } else if (column.order === 'descending') {
        this.order_prop = column.prop
        this.desc_prop = 1
      } else {
        this.order_prop = column.prop
        this.desc_prop = 0
      }
      this.GetColumnsChange()
    },

    fielddialogVisible(newValue, row) {
      this.fielddialogFormVisible = newValue

      // console.log('dialogVisible', row)
    },

    setWidth(field) {
      if (field.ID === -1 || field.FieldName === '操作模式') {
        return '150%'
      }
    },

    /**
     * FieldName/Value < FieldName/Average - (FieldName/StandDifferences * 不良 標準差倍數,定義 )
      FieldName/Value > FieldName/Average + (FieldName/StandDifferences * 不良 標準差倍數,定義 )

      FieldName/Value < FieldName/Average - (FieldName/StandDifferences * 嚴重不良 標準差倍數)
      FieldName/Value > FieldName/Average + (FieldName/StandDifferences * 嚴重不良 標準差倍數)
     *
     * FieldName/Value < FieldName/Average - (FieldName/StandDifferences * 下拉倍率 (1~6))
     * FieldName/Value > FieldName/Average + (FieldName/StandDifferences * 下拉倍率 (1~6))
     */

    /**
     * 依照條件判斷字顏色格式
     */
    formatFontColor(source) {
      if (source.IsLimit === true) {
        const badLower = parseFloat(source.Average) - parseFloat(source.StandardDifference * source.BadSdMultiple)
        const badUpper = parseFloat(source.Average) + parseFloat(source.StandardDifference * source.BadSdMultiple)

        const seriousBadLower = parseFloat(source.Average) - parseFloat(source.StandardDifference * source.SeriouslyBadSdMultiple)
        const seriousBadUpper = parseFloat(source.Average) + parseFloat(source.StandardDifference * source.SeriouslyBadSdMultiple)

        if (source.Value > badUpper || source.Value < badLower) {
          if (source.Value > seriousBadUpper || source.Value < seriousBadLower) {
            return 'danger'
          } else {
            return 'warning'
          }
        } else {
          return 'success'
        }
      }
    }
  }
}
</script>

<style scoped>
.primary {
  font-size: 12px;
  color: #409eff;
}
.success {
  font-size: 12px;
  color: #67c23a;
}
.warning {
  font-size: 12px;
  color: #e6a23c;
}
.danger {
  font-size: 12px;
  color: #f56c6c;
}
.info {
  font-size: 12px;
  color: #909399;
}
</style>
