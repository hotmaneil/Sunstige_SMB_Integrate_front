<template>
  <div>
    <el-checkbox-group v-model="GroupDataChecked" @change="OnSelectParameterChange(GroupDataChecked)">
      <div v-for="(Groupdata, index) in GroupData" :key="index" style="margin: 1px; clear: both">
        <div slot="header">
          <el-tag style="margin: 1px; clear: both">
            {{ Groupdata.SubCategory }}
          </el-tag>
        </div>

        <el-row>
          <el-col v-for="(field, index2) in Groupdata.items" :key="index2" :span="6">
            <el-checkbox
              :type="IsLimitFilter(field)"
              style="margin: 1px; float: left"
              :label="field.FieldID"
              @change="checked => handleCheckedCitiesChange(field, checked)"
            >
              <i v-if="field.GroupName == 'SetValue'" class="el-icon-edit" />
              <i v-if="field.GroupName == 'Actual'" class="el-icon-info" />
              {{ field.FieldName }}
            </el-checkbox>

            <el-tag
              v-if="field.Value !== null"
              size="mini"
              :disable-transitions="false"
              :type="field.styletype"
              style="margin: 1px; float: left"
            >{{ field.Value }}
            </el-tag>
          </el-col>
        </el-row>
      </div>
    </el-checkbox-group>

    <setting-dialog-field :model="fieldItem" :is-visible="fieldItemVisible" @onDialogVisible="OnFieldDialogVisible" />
  </div>
</template>

<script>
import { getEquipment } from '@/api/Equipments'
import { SetShowChart } from '@/api/FieldName'
import SettingDialogField from '@/components/SettingDialogField'

import { formatDate, getSortFunc } from '@/utils/validate'

const statusMap = {
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
}
export default {
  components: { SettingDialogField },
  filters: {
    statusFilter(value) {
      if (value.StandardDifference == null) {
        return 'warning'
      }
      if (value.Average == null) {
        return 'warning'
      }
      // console.log(value, value.Average, value.StandardDifference)

      if (value.Value < value.Average + value.StandardDifference && value > value.Average - value.StandardDifference) {
        return 'success'
      } else {
        return 'danger'
      }
    },
    formatDateFilter(value) {
      return formatDate(value, 'HH:mm:ss')
    }
  },
  props: {
    equipmentid: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // listLoading: true,
      equipment: {},
      listQuery: {
        page: 1,
        limit: 300
      },
      order_prop: 'CreateTime',
      desc_prop: 1,

      tracedata: [],
      totalData: 0,

      fieldItemVisible: false,
      fieldItem: {},

      defaultProps: {
        children: 'Actual',
        label: 'FieldName'
      },

      listparameter: [],
      GroupDataChecked: [],
      GroupData: []
    }
  },
  computed: {},
  watch: {
    equipmentid: {
      handler(val) {
        if (val === null) {
          return
        }

        this.getResponseList()
      }
    }
  },
  created() {
    if (this.equipmentid) {
      this.getResponseList()
    }
  },
  beforeDestroy() {},
  methods: {
    IsLimitFilter(row) {
      if (row.IsLimit) {
        return 'primary'
      }
      return 'info'
    },
    ValueLimitFilter(row) {
      return 'info'
    },

    async getResponseList() {
      await this.GET_EquipmentsList(this.equipmentid).then(response => {
        this.equipment = response
        this.equipment.ActualFields = []
        this.GetActualFields()
      })
    },

    async GetActualFields() {
      var sortfunc = getSortFunc('SortID', 1, 'SortID')

      // 改用 await 等待 Promise 內的工作全部完成
      const results = await Promise.all(
        this.equipment.Fields.map(async fd => {
          if (fd.GroupName === 'SetValue') {
            // this.equipment.SetValueFields.push(Object.assign({}, fd))
          } else if (fd.GroupName === 'Actual') {
            this.equipment.ActualFields.push(Object.assign({}, fd))
          }
          return true
        })
      )
        .then(isOK => {
          if (isOK.reduce((a, b) => a && b)) {
            this.equipment.ActualFields.sort(sortfunc)
          }
          // this.listLoading = false
        })
        .catch(response => {
          console.log('catch', response)
          // this.listLoading = false
        })
        .finally(() => {
          var _array = this.equipment.ActualFields.filter(x => {
            if (x.IsDisplay === true) return true
          })
          // 分類 欄位

          this.GroupData = []
          this.GroupDataChecked = []
          _array.map(x => {
            if (!this.GroupData.some(cate => cate.SubCategory === x.SubCategory)) {
              this.GroupData.push({ SubCategory: x.SubCategory, items: [] })
            }

            var Category = this.GroupData.find(s => s.SubCategory === x.SubCategory)
            // console.log(totalArray, Category)
            x.styletype = 'info'
            // 只顯示SPC的部分
            // if (x.SubCategory === 'SPC' ) {
            if (x.IsLimit) {
              var keys = Object.keys(statusMap)
              if (keys.indexOf(x.Value) > -1) {
                x.styletype = statusMap[x.Value]
              } else {
                x.styletype = 'danger'
              }

              if (x.GroupName === 'SetValue') {
                if (x.UpperLimit >= x.Value && x.Value >= x.LowerLimit) {
                  x.styletype = 'success'
                }
                // console.log(x.FieldName, x.SubCategory, `${x.UpperLimit} >= ${x.Value} >= ${x.LowerLimit}`, x.styletype)
              } else if (x.GroupName === 'Actual') {
                if (
                  x.Average + x.StandardDifference * 2 >= x.Value &&
                  x.Value >= x.Average - x.StandardDifference * 2
                ) {
                  x.styletype = 'success'
                }
                // console.log(x.FieldName, x.SubCategory, `${x.UpperLimit} >= ${x.Value} >= ${x.LowerLimit}  ${x.Average} ${x.StandardDifference}`, x.styletype)
              }
            }

            if (x.IsChart) {
              this.GroupDataChecked.push(x.FieldID)
            }
            Category.items.push(x)

            // console.log('this.GroupData', x.FieldName, x.IsChart)
            // }
          })

          // 判斷目前已勾選的 存到listparameter
        })

      return results
    },

    GET_EquipmentsList(equipment_id) {
      return new Promise((resolve, reject) => {
        getEquipment({
          EquipmentID: equipment_id,
          IsEnabled: 1,
          IsDisplay: 1
        })
          .then(response => {
            // 判斷是否 正確
            resolve(response.data.Payload)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // handleCheckedCitiesChange(item) {
    //   // loadingUI()
    //   console.log('handleCheckedCitiesChange', item)

    //   SetShowChart(item.FieldID, item)
    //     .then(response => {
    //       // this.$message({
    //       //   message: 'The data has been update',
    //       //   type: 'success'
    //       // })
    //       this.getResponseList()
    //     })
    //     .catch(error => {
    //       console.error(error)
    //     })
    // },

    OnSetEdit(dialog, row) {
      console.log('OnSetEdit', dialog, row)

      if (dialog === 'group') {
        this.groupItem = row
        this.groupItemVisible = true
      } else if (dialog === 'field') {
        this.fieldItem = row
        this.fieldItemVisible = true
      }
    },
    OnFieldDialogVisible(visible, row) {
      this.fieldItemVisible = visible
      console.log('OnFieldDialogVisible', visible, row)
      this.getResponseList()
    },

    OnSelectParameterChange(parameter) {
      // parameter.forEach(x => {
      //   var Category = this.GroupData.find(s => s.SubCategory === x.SubCategory)
      //   var Field = Category.items.find(s => s.FieldID === x.FieldID)
      //   console.log('Field', Field)
      //   Field.IsChart = !Field.IsChart
      //   SetShowChart({ FieldID: x.FieldID, IsChart: x.IsChart })
      //     .then(response => {
      //       console.log('response', response)
      //     })
      //     .catch(error => {
      //       console.error(error)
      //     })
      // })
      // const item = this.fieldData[this.fieldData.length - 1]
      // item.field.IsChart = !item.field.IsChart
      // var putData = []
      // parameter.forEach(x => {
      //   putData.push({ FieldID: x.fieldID, IsChart: x.field.IsChart })
      //   console.log('putData', putData)
      //   SetShowChart(putData)
      //     .then(response => {
      //     // this.$message({
      //     //   message: 'The data has been update',
      //     //   type: 'success'
      //     // })
      //     // this.getResponseList()
      //     })
      //     .catch(error => {
      //       console.error(error)
      //     })
      // })
      // this.$emit('OnSelectParameterChange', parameter, this.fieldData)
    },

    handleCheckedCitiesChange(field, val) {
      // console.log('val', field, val)
      var x = field
      var Category = this.GroupData.find(s => s.SubCategory === x.SubCategory)

      var Field = Category.items.find(s => s.FieldID === x.FieldID)

      if (!val) {
        const index = this.GroupDataChecked.indexOf(x.FieldID)
        if (index > -1) {
          this.GroupDataChecked.splice(index, 1)
        }
      } else {
        this.GroupDataChecked.push(x.FieldID)
      }

      // console.log('this.GroupDataChecked', this.GroupDataChecked)
      Field.IsChart = val

      SetShowChart({ FieldID: x.FieldID, IsChart: val })
        .then(response => {
          // console.log('response', response)
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

<style scoped>
.chart-container-small {
  margin: 10px;
  width: 90%;
  clear: right;
  float: left;
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
}
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

ul {
  list-style-type: none;
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
  }
}
</style>
