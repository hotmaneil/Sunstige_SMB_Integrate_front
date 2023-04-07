<template>
  <div>
    <el-checkbox-group
      v-model="listparameter"
      :min="0"
      :max="2"
      @change="OnSelectParameterChange(listparameter)"
    >
      <div
        v-for="(Groupdata, index) in GetGroupdataChange()"
        :key="index"
        style="margin: 1px; clear: both"
      >
        <ul>
          <div slot="header">
            <el-tag style="margin: 1px; clear: both">
              {{ Groupdata.SubCategory }}
            </el-tag>
          </div>
          <li
            v-for="(field, index2) in Groupdata.items"
            :key="index2"
            style="margin: 1px; clear: both"
          >
            <el-checkbox
              :type="IsLimitFilter(field)"
              style="margin: 1px; float: left"
              :label="field.FieldID"
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
          </li>
        </ul>
      </div>
    </el-checkbox-group>
  </div>
</template>

<script>
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
  props: {
    fielddata: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      listparameter: []
    }
  },
  computed: {
    ParameterId: {
      get() {
        return this.listparameter
      },
      set(val) {
        console.log(val)
        this.$emit('update:parameterid', val)
      }
    }
  },
  watch: {
    fielddata: {
      deep: true,
      handler(val) {
        console.log(val, this.listparameter)
        this.listparameter = []
      }
    }
  },
  methods: {
    GetGroupdataChange() {
      if (this.fielddata === undefined) {
        return []
      }

      if (this.fielddata.length === 0) {
        return []
      }
      var _array = this.fielddata.filter(x => {
        if (x.IsDisplay === true) return true
      })
      // 分類 欄位

      var totalArray = []

      _array.map(x => {
        if (!totalArray.some(cate => cate.SubCategory === x.SubCategory)) {
          totalArray.push({ SubCategory: x.SubCategory, items: [] })
        }

        var Category = totalArray.find(s => s.SubCategory === x.SubCategory)
        // console.log("SubCategory", x.GroupName, x.SubCategory, x.FieldName);

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

        Category.items.push(x)
      })

      totalArray.sort(function(a, b) {
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
    sortNum(a, b) {
      return a.SortID - b.SortID
    },

    OnSelectParameterChange(parameter) {
      this.$emit('OnSelectParameterChange', parameter)
    }
  }
}
</script>
