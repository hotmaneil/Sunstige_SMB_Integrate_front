<template>
  <div>
    <el-card
      v-for="(Groupdata, index) in list"
      :key="index"
      class="box-card"
      shadow="hover"
      :body-style="{ padding: '5px' }"
    >
      <div slot="header">
        <span>
          {{ Groupdata.SubCategory }}
          <i class="el-icon-setting" style="float: right" @click="HandleSetData('group', Groupdata.items)" />
        </span>
      </div>
      <div style="margin-left: -20px">
        <ul>
          <li
            v-for="(field, index2) in Groupdata.items"
            :key="index2"
            style="margin: 1px; clear: both"
            @click="HandleSetData('field', field)"
          >
            <el-tag
              size="mini"
              :disable-transitions="false"
              :type="IsLimitFilter(field)"
              style="margin: 1px; float: left"
            >
              <i v-if="field.GroupName == 'SetValue'" class="el-icon-edit" />
              <i v-if="field.GroupName == 'Actual'" class="el-icon-info" />
              {{ field.FieldName }}
            </el-tag>

            <el-tag
              size="mini"
              :disable-transitions="false"
              :type="field.styletype"
              style="margin: 1px; float: left"
            >{{ field | FloatFilter }}
            </el-tag>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getEquipment } from '@/api/Equipments'
import { formatDate } from '@/utils/validate'
const statusMap = {
  run: 'primary',
  down: 'warning',
  idle: 'success',
  offline: 'warning',
  alarm: 'danger',
  manual: 'info',
  automatic: 'primary',
  semi_automatic: 'primary',
  on: 'success',
  off: 'danger',
  true: 'success',
  false: 'danger'
}

// const typesMap = {
//   string: 'info',
//   number: 'success',
//   bigint: 'success',
//   boolean: 'primary',
//   object: 'primary',
//   undfined: 'danger',
//   symbol: 'danger',
//   function: 'danger'
// }
export default {
  filters: {
    FloatFilter(field1) {
      var vv = parseFloat(field1.Value)
      if (!isNaN(vv)) {
        // console.log(field1, vv, field1.Precision, vv.toFixed(field1.Precision))
        return vv.toFixed(field1.Precision)
      }

      return field1.Value
    },

    statusFilter(status) {
      var keys = Object.keys(statusMap)
      if (keys.indexOf(status.toLowerCase()) > -1) {
        return statusMap[status.toLowerCase()]
      }

      return 'success'
    },
    valueFilter(status) {
      var f = parseFloat(status)
      if (isNaN(f)) {
        var skeys = Object.keys(statusMap)
        if (skeys.indexOf(status.toLowerCase()) > -1) {
          return 'success'
        }
      }

      return 'info'
    },

    formatDateFilter(value) {
      return formatDate(value, 'MM-dd HH:mm:ss')
    },

    smallformatDateFilter(value) {
      return formatDate(value, 'HH:mm:ss')
    }
  },
  components: {},
  props: {
    equipmentid: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [],
      equipment: {}
    }
  },
  watch: {
    equipmentid: {
      handler(val) {
        if (val === null) {
          return
        }
        if (this.equipmentid) {
          this.getResponseList()
        }
      }
    }
  },
  created() {
    if (this.equipmentid) {
      this.getResponseList()
    }
  },
  methods: {
    async getResponseList() {
      this.list = []
      this.groupdata = []

      this.GET_EquipmentsList(this.equipmentid).then(response => {
        this.equipment = response

        console.log('this.equipment.Fields', this.equipment.Fields)
        if (this.equipment.Fields !== null) {
          this.equipment.Fields.map(fd => {
            if (fd.GroupName === 'SetValue') {
              // this.groupdata.push(Object.assign({}, fd))
            } else if (fd.GroupName === 'Actual') {
              this.groupdata.push(Object.assign({}, fd))
            }
          })
        }
        this.GetGroupdataChange()
      })
    },

    GetGroupdataChange() {
      if (this.groupdata.length === 0) {
        return []
      }

      var _array = this.groupdata.filter(x => {
        if (x.IsDisplay === true) return true
      })
      // 分類 欄位

      _array.map(x => {
        if (!this.list.some(cate => cate.SubCategory === x.SubCategory)) {
          this.list.push({ SubCategory: x.SubCategory, items: [] })
        }

        var Category = this.list.find(s => s.SubCategory === x.SubCategory)

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
            if (x.Average + x.StandardDifference * 2 >= x.Value && x.Value >= x.Average - x.StandardDifference * 2) {
              x.styletype = 'success'
            }
            // console.log(x.FieldName, x.SubCategory, `${x.UpperLimit} >= ${x.Value} >= ${x.LowerLimit}  ${x.Average} ${x.StandardDifference}`, x.styletype)
          }
        }

        Category.items.push(x)
      })

      this.list.map(x => {
        x.items.sort(function(a, b) {
          var nameA = a.SortID // ignore upper and lowercase
          var nameB = b.SortID // ignore upper and lowercase
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }
          return 0
        })
      })

      this.list.sort(function(a, b) {
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
    },

    IsLimitFilter(row) {
      if (row.IsLimit) {
        return 'primary'
      }
      return 'info'
    },
    ValueLimitFilter(row) {
      return 'info'
    },

    HandleSetData(type, item) {
      console.log('onHandleSetData', type, item)
      this.$emit('onHandleSetData', type, item)
    },
    HandleClose(header, fields) {
      fields.IsDisplay = false
    },

    ShortCodeFilter(code) {
      if (code === null) {
        return 0
      } else {
        return parseInt(code)
      }
    },

    GET_EquipmentsList(equipment_id) {
      return new Promise((resolve, reject) => {
        const payload = {
          EquipmentID: equipment_id,
          IsEnabled: 1,
          IsDisplay: 1
        }

        getEquipment(payload)
          .then(response => {
            // 判斷是否 正確
            resolve(response.data.Payload)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card > .el-card__body {
  padding: 6px;
}
.el-card > .el-card__header {
  padding: 8px 8px;
  border-bottom: 1px solid #ebeef5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 16px;
  background-color: lightgrey;
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
  content: ' '; /* Older browser do not support empty content */
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}

.box-card {
  position: absolute;
  width: 300px;
  cursor: pointer;
  font-size: 16px;
  position: relative;
  overflow: hidden;
  color: rgb(3, 3, 3);
  background: rgb(255, 255, 255);
  margin: 6px;
  border: 2px #ccc solid;
  border-radius: 10px;
  float: left;
}

.bottom {
  position: absolute;
  bottom: 5px;
  right: 10px;
  line-height: 15px;
  float: right;
}

.button {
  padding: 0;
  float: right;
}

ul {
  list-style-type: none;
}
</style>
