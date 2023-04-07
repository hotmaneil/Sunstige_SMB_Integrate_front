<template>
  <div>
    <el-form label-position="right" label-width="auto">
      <el-row>
        <el-col :span="6">
          <el-form-item label="設備">
            <el-select
              v-model="formData.EquipmentId"
              placeholder="please select Equipment"
              style="width: 100%"
            >
              <el-option
                v-for="item of equipmentList"
                :key="item.id"
                :label="item.id + ' ' + item.name"
                :value="item.id"
              >
                <span style="float: left">{{ item.id }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item v-if="activeName!=='ProcessInfo'" label="日期時間">
            <el-date-picker
              v-model="formData.StartTime"
              type="datetime"
              placeholder="開始時間"
            />
            <el-date-picker
              v-model="formData.EndTime"
              type="datetime"
              placeholder="結束時間"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="OnQuery()">查詢</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getDeviceListByCategory } from '@/api/SMBDevice'
export default {
  name: 'EquipmentTimeSelect',
  props: {

    /**
     * 設備編號
     */
    equipmentId: {
      type: String,
      default: function() {
        return ''
      }
    },

    /**
     * 開始時間
     */
    startTime: {
      type: Date,
      default: function() {
        return ''
      }
    },

    /**
     * 結束時間
     */
    endTime: {
      type: Date,
      default: function() {
        return ''
      }
    },

    /**
     * 是否預設選取
     */
    isDefaultSelect: {
      type: Boolean,
      default: function() {
        return ''
      }
    },

    category: {
      type: String,
      default: function() {
        return ''
      }
    },

    floatValue: {
      type: String,
      default: function() {
        return 'right'
      }
    },

    activeName: {
      type: String,
      default: function() {
        return ''
      }
    }
  },

  data() {
    return {
      equipmentList: [],
      order_prop: 'SortID',
      desc_prop: 0,
      styleValue: null,

      formData: {
        EquipmentId: null,
        StartTime: null,
        EndTime: null
      }
    }
  },

  watch: {
    floatValue(newValue) {
      this.styleValue = 'float: ' + newValue
    },

    equipmentId(newValue) {
      this.formData.EquipmentId = newValue
    },

    startTime(newValue) {
      this.formData.StartTime = newValue
    },

    endTime(newValue) {
      this.formData.EndTime = newValue
    }
  },

  created() {
    this.getEquipmentsList()
  },

  methods: {
    /**
     * 取得設備列表
     */
    getEquipmentsList() {
      const payload = {
        Category: this.category,
        Orderby: 'sequence',
        Power: 'asc'
      }
      getDeviceListByCategory(payload)
        .then(response => {
          this.equipmentList = response.data.Payload
          if (this.equipmentList.length > 0) {
            if (this.isDefaultSelect === true) {
              this.formData.EquipmentId = this.equipmentList[0].EquipmentID
            } else {
              this.formData.EquipmentId = this.equipmentId
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    },

    /**
     * 查詢動作
     */
    OnQuery() {
      const vm = this
      this.$emit('OnQuery', vm.formData)
    }
  }
}
</script>
