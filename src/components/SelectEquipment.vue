<template>
  <div>
    <el-form label-position="right" label-width="auto">
      <el-row :gutter="10">
        <el-col v-if="isdaterange" :xs="24" :sm="12" :md="12" :lg="8">
          <el-form-item label="日期區間">
            <el-date-picker
              v-model="DateTimeRange"
              type="daterange"
              range-separator="To"
              start-placeholder="開始日期"
              end-placeholder="結束日期"
              style="width: 100%"
              @change="OnDateTimeRangeChange()"
            />
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="12" :lg="6" :style="isdaterange ? 'float: left' : 'float: right'">
          <el-form-item label="設備">
            <el-select
              v-model="EquipmentId"
              placeholder="please select Equipment"
              style="width: 100%"
              @change="OnSelectEquipmentChange()"
            >
              <el-option
                v-for="item of equipment_list"
                :key="item.EquipmentID"
                :label="item.EquipmentID + ' ' + item.EquipmentName"
                :value="item.EquipmentID"
              >
                <span style="float: left">{{ item.EquipmentID }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.EquipmentName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { only } from '@/api/Equipments'
import { mapGetters } from 'vuex'
import { getSortFunc, isNullOrEmpty } from '@/utils/validate'
// import { loadingUI } from '@/utils/loading' // loading遮罩

export default {
  name: 'SelectEquipment',
  props: {
    equipmentid: {
      type: String,
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
    selectallflage: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    isdaterange: {
      type: Boolean,
      default: function() {
        return false
      }
    }
  },
  data() {
    return {
      equipment_list: [],
      order_prop: 'SortID',
      desc_prop: 0,
      DateTimeRange: null
    }
  },
  computed: {
    ...mapGetters(['equipments']),
    EquipmentId: {
      get() {
        if (isNullOrEmpty(this.equipmentid)) {
          this.$emit('update:equipmentid', this.equipments.select_equipment)
          return this.equipments.select_equipment
        } else {
          return this.equipmentid
        }
      },
      set(val) {
        // console.log(
        //   'EquipmentId',
        //   val,
        //   this.equipments.select_equipment,
        //   this.equipmentid
        // )

        if (val !== '') {
          this.$store.dispatch('equipments/toggleEquipment', val)
        }
        this.$emit('update:equipmentid', val)
      }
    }
  },
  created() {
    var sortfunc = getSortFunc(this.order_prop, 1, 'SortID', this.desc_prop)
    this.GET_EquipmentsList().then(response => {
      this.equipment_list = []

      response.sort(sortfunc).map(eq => {
        var newEq = Object.assign({}, eq)
        this.equipment_list.push(newEq)
      })
    })
  },
  methods: {
    GET_EquipmentsList() {
      return new Promise((resolve, reject) => {
        const payload = { Category: this.category }
        only(payload)
          .then(response => {
            resolve(response.data.Payload)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    OnSelectEquipmentChange() {
      // loadingUI()
      this.$emit('OnSelectEquipmentChange')
    },
    OnDateTimeRangeChange() {
      // loadingUI()
      this.$emit('OnDateTimeRangeChange', this.DateTimeRange)
    }
  }
}
</script>

<style scoped>
.pagination-container {
  margin: 10px;
}
.pagination-container.hidden {
  display: none;
}
/* .el-select {
  margin:  10px;
}*/
</style>
