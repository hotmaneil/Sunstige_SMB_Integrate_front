<template>
  <div>
    <ul
      v-for="(Groupdata, index) in GetGroupdataChange"
      :key="index"
      shadow="hover"
      style="margin: 1px; clear: both"
      :body-style="{ padding: '5px' }"
    >
      <div slot="header">
        <span v-if="Groupdata.SubCategory === 'SPC'">
          {{ Groupdata.SubCategory }}
        </span>
      </div>

      <li
        v-for="(field, index2) in Groupdata.items"
        :key="index2"
        style="margin: 1px; clear: both"
      >
        <el-checkbox
          v-model="field.IsChart"
          :type="IsLimitFilter(field)"
          style="margin: 1px; float: left"
          :label="field.FieldName"
          @change="handleCheckedCitiesChange(field)"
        >
          <i v-if="field.GroupName == 'SetValue'" class="el-icon-edit" />
          <i v-if="field.GroupName == 'Actual'" class="el-icon-info" />
          {{ field.FieldName }}
        </el-checkbox>

        <el-tag
          size="mini"
          :disable-transitions="false"
          :type="field.styletype"
          style="margin: 1px; float: left"
        >{{ field.Value }}
        </el-tag>
        <i class="el-icon-setting" @click="OnSetEdit('field', field)" />

        <div v-if="field.IsChart">
          {{ field.FieldID }}
          {{ field }}
          <bar-chart-mode2
            :id="field.FieldID"
            :eq="equipment"
            style="float: left"
            :chart-data="[]"
            :field="field"
          />
        </div>
        <!--<div v-if="field.IsChart">
          <display-mode2 :id="field.FieldID" :eq="equipment" style="float: left" :chart-data="[]" :field="field" />
        </div>-->
      </li>
    </ul>

    <setting-dialog-field
      :model="fieldItem"
      :is-visible="fieldItemVisible"
      @onDialogVisible="OnFieldDialogVisible"
    />
  </div>
</template>

<script>
import { getList as getListEquipments } from '@/api/Equipments'
import { updateItem } from '@/api/FieldName'
import SettingDialogField from '@/components/SettingDialogField'

import { formatDate, getSortFunc } from '@/utils/validate'

import BarChartMode2 from '@/components/BarChartMode2'
import { loadingUI, closeLoading } from '@/utils/loading' // loading遮罩

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
  components: { SettingDialogField, BarChartMode2 },
  filters: {
    statusFilter(value) {
      if (value.StandardDifference == null) {
        return 'warning'
      }
      if (value.Average == null) {
        return 'warning'
      }
      console.log(value, value.Average, value.StandardDifference)

      if (
        value.Value < value.Average + value.StandardDifference &&
        value > value.Average - value.StandardDifference
      ) {
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
      }
    }
  },
  computed: {
    GetGroupdataChange() {
      if (this.equipment.ActualFields === undefined) {
        return []
      }

      if (this.equipment.ActualFields.length === 0) {
        return []
      }

      var _array = this.equipment.ActualFields.filter(x => {
        if (x.IsDisplay === true) return true
      })
      // 分類 欄位

      var totalArray = []

      _array.map(x => {
        if (!totalArray.some(cate => cate.SubCategory === x.SubCategory)) {
          totalArray.push({ SubCategory: x.SubCategory, items: [] })
        }

        var Category = totalArray.find(s => s.SubCategory === x.SubCategory)
        // console.log(totalArray, Category)
        x.styletype = 'info'

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
        // 只顯示SPC
        if (x.SubCategory === 'SPC') {
          Category.items.push(x)
        }
      })

      totalArray.sort(function(a, b) {
        // console.log(a)
        var nameA = a.SubCategory.toUpperCase() // ignore upper and lowercase
        var nameB = b.SubCategory.toUpperCase() // ignore upper and lowercase
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }

        return 0
      })

      return totalArray
    }
  },
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
      // loadingUI()
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
      if (this.equipment === {}) {
        return
      }
      this.equipment.ActualFields = []

      await this.GET_EquipmentsList(this.equipmentid).then(response => {
        response.map(eq => {
          // 確保只有一個設備被取出
          this.equipment = Object.assign({}, eq)
          // this.equipment.SetValueFields = []
          this.equipment.ActualFields = []
          this.GetActualFields()
        })
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
          // closeLoading()
        })

      return results
    },

    GET_EquipmentsList(equipment_id) {
      return new Promise((resolve, reject) => {
        getListEquipments({
          EquipmentID: equipment_id,
          IsEnabled: 1,
          IsDisplay: 1
        })
          .then(response => {
            // 判斷是否 正確
            resolve(response.data.items)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    handleCheckedCitiesChange(item) {
      // loadingUI()
      console.log('handleCheckedCitiesChange', item)

      updateItem(item.FieldID, item)
        .then(response => {
          this.$message({
            message: 'The data has been update',
            type: 'success'
          })
          this.getResponseList()
        })
        .catch(error => {
          console.error(error)
        })
    },

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
