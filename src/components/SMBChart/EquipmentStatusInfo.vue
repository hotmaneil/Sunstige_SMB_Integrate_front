<template>
  <div class="app-container" style="background-color:#efefef">
    <!-- device_info -->
    <el-row>
      <el-col v-for="dataItem in info.device_info" :key="dataItem.field_name" :span="6">
        <h3>{{ dataItem.show_name }}</h3>
        <el-card class="box-card" :style="{ backgroundColor: dataItem.device_status_color }">
          <span style="text-align: center; display:block;color: white;font-size:32px">
            {{ dataItem.value }}
          </span>
        </el-card>
      </el-col>
    </el-row>

    <!-- status_time_rate -->
    <el-row>
      <el-col v-for="dataItem in sortInfoTimeRate" :key="dataItem.main_status_id" :span="6">
        <h3>{{ dataItem.main_status_id }}</h3>
        <el-card class="box-card" :style="{ backgroundColor: dataItem.device_status_color }">
          <span style="text-align: center; display:block;color: white;font-size:32px">
            {{ dataItem.time_length }}
          </span>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { equipmentStatus } from '@/api/SMBStatistical'
export default {
  name: 'EquipmentStatusInfo',
  props: {
    deviceId: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      info: []
    }
  },
  computed: {
    sortInfoTimeRate() {
      const sort = ['Run', 'Idle', 'Down', 'Offline', 'Disconnect']

      if (this.info.status_time_rate) {
        const obj = {}
        for (let i = 0; i < this.info.status_time_rate.length; i++) {
          const item = this.info.status_time_rate[i]
          obj[item.main_status_id] = item
        }

        return sort.map(sortItem => obj[sortItem]).filter(TimeRate => {
          return TimeRate !== undefined
        })
      } else {
        return []
      }
    }
  },

  watch: {
    deviceId(newValue) {
      this.getData(newValue)
    }
  },

  methods: {
    /**
     * 取得設備狀況與其他圖表資訊
     */
    getData(source) {
      const vm = this
      const payload = {
        Id: source
      }
      equipmentStatus(payload).then(response => {
        vm.info = response.data.Payload
      })
    }
  }
}
</script>
