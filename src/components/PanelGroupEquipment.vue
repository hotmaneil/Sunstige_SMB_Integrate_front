<template>
  <div>
    <el-card
      v-for="item in EquipmentFields"
      :key="item.EquipmentID"
      class="box-card"
      shadow="hover"
      :body-style="{ padding: '1px' }"
    >

      <div slot="header">
        <span>
          <router-link :to="{ name: 'equipment', params: { EquipmentID: item.EquipmentID }}">

            <el-tag size="mini" effect="dark" style="margin: 1px">{{
              item.EquipmentID
            }}</el-tag>
            <el-tag size="mini" effect="dark" style="margin: 1px">{{
              item.EquipmentFunction
            }}</el-tag>
            <!-- <el-tag size="mini" effect="dark" style="margin : 1px;">{{ item.EquipmentType }}</el-tag> -->
            <el-badge
              :hidden="parseInt(item.AlarmCount) == 0"
              :value="parseInt(item.AlarmCount)"
              :max="99"
              class="mark"
            />
          </router-link>
          <i
            class="el-icon-setting"
            style="float: right"
            @click="HandleSetData('equipment', item)"
          />
        </span>
      </div>
      <router-link :to="{ name: 'equipment', params: { EquipmentID: item.EquipmentID }}">

        <div style="margin-left: -20px">

          <ul>
            <li
              v-for="(field, findex) in item.SliceFields"
              :key="findex"
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
                {{ field.UpdateTime | smallformatDateFilter }}
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

          <div class="bottom">
            <el-tag
              size="mini"
              effect="dark"
              :type="item.Status | statusFilter"
              style="margin: 1px"
            >{{ item.UpdateTime | formatDateFilter }}</el-tag>
            <el-tag
              size="mini"
              effect="dark"
              :type="item.Status | statusFilter"
              style="margin: 1px"
            >{{ item.Status }}</el-tag>
          <!-- <el-tag size="mini" :type="item.CimMode | statusFilter" style="float: right; margin-left : 1px;">{{ item.CimMode }}</el-tag>
        <el-tag size="mini" :type="item.LinkMode | statusFilter" style="float: right; margin-left : 1px;">{{ item.LinkMode }}</el-tag> -->
          </div>
        </div>

      </router-link>

    </el-card>

  </div>
</template>

<script>
import { formatDate } from '@/utils/validate'
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
  filters: {
    FloatFilter(field1) {
      var vv = parseFloat(field1.Value)
      if (!isNaN(vv)) {
        return vv.toFixed(field1.Precision)
      }

      return field1.Value
    },

    statusFilter(status) {
      var keys = Object.keys(statusMap)
      if (keys.indexOf(status) > -1) {
        return statusMap[status]
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
    groupdata: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      EquipmentFields: []

    }
  },
  watch: {
    groupdata: {
      deep: true,
      handler(val) {
        if (val === []) { return }

        this.EquipmentFields = val.filter(v => {
          if (v.IsDisplay === true) return true
          return false
        })

        this.EquipmentFields.map(eq => {
          eq.SliceFields.map(x => {
            x.styletype = 'info'

            // if (x.IsLimit) {
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
            } else if (x.GroupName === 'Actual') {
              // console.log('x.FieldName', x.FieldName)
              // console.log('x.Average', x.Average)
              // console.log('x.StandardDifference', x.StandardDifference)
              // console.log('x.Value', x.Value)

              var condotion1 = (parseFloat(x.Average) + parseFloat(x.StandardDifference) * 2) >= parseFloat(x.Value)
              var condition2 = parseFloat(x.Value) >= (parseFloat(x.Average) - parseFloat(x.StandardDifference) * 2)

              // console.log('condotion1', condotion1)
              // console.log('condition2', condition2)

              if (condotion1 && condition2) {
                x.styletype = 'success'
              }
            }
            // }
          })
        })
      }
    }
  },
  methods: {
    IsLimitFilter(row) {
      if (row.IsLimit) {
        return 'primary'
      }
      return 'info'
    },
    HandleSetData(type, item) {
      this.$emit('onHandleSetData', type, item)
    },
    HandleClose(header, fields) {
      fields.IsDisplay = false
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
  content: "";
}
.clearfix:after {
  content: " "; /* Older browser do not support empty content */
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}

.box-card {
  height: 250px;
  width: 320px;
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
