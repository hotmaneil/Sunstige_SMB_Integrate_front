<template>
  <div>
    <el-form label-position="right" label-width="auto">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="12" :lg="10" :style="styleValue">
          <el-form-item label="設備">
            <el-select
              v-model="EquipmentId"
              placeholder="please select Equipment"
              style="width: 100%"
              @change="OnSelectEquipmentChange()"
            >
              <el-option
                v-for="item in equipmentList"
                :key="item.id"
                :label="item.id + ' ' + item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getDeviceListByCategory } from '@/api/SMBDevice'
export default {
  name: 'EquipmentSelect',
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
    }
  },

  data() {
    return {
      EquipmentId: null,
      equipmentList: [],
      order_prop: 'SortID',
      desc_prop: 0,
      styleValue: null
    }
  },

  watch: {
    floatValue(newValue) {
      this.styleValue = 'float: ' + newValue
    },

    equipmentId(newValue) {
      this.EquipmentId = newValue
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
              this.EquipmentId = this.equipmentList[0].EquipmentID
            } else {
              this.EquipmentId = this.equipmentId
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    },

    /**
     * 變更下拉選單值
     */
    OnSelectEquipmentChange() {
      // loadingUI()
      const vm = this
      console.log('OnSelectEquipmentChange vm.EquipmentId', vm.EquipmentId)
      this.$emit('OnSelectEquipmentChange', vm.EquipmentId)
    }
  }
}
</script>
