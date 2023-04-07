<template>
  <!-- 主要來自機台稼動歷史提供的部份資料 -->
  <div class="app-container" style="background-color:#efefef">
    <!-- device_info -->
    <el-row>
      <el-col v-for="dataItem in deviceInfo" :key="dataItem.field_name" :span="6">
        <h3>{{ dataItem.field_name | showName }}</h3>
        <el-card class="box-card" :style="{ backgroundColor: dataItem.device_status_color }">
          <span style="text-align: center; display:block;color: white;font-size:32px">
            {{ dataItem.value }}
          </span>
        </el-card>
      </el-col>
    </el-row>

    <!-- status_time_rate -->
    <el-row>
      <el-col v-for="dataItem in statusTimeRate" :key="dataItem.main_status_id" :span="6">
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
export default {
  name: 'EquipmentStatusPartInfo',

  filters: {
    showName(value) {
      switch (value) {
        case 'countchange':
          return '生產次數累計'
        case 'utilization':
          return '設備稼動率'
      }
    }
  },
  props: {
    deviceInfo: {
      type: Array,
      default() {
        return []
      }
    },

    statusTimeRate: {
      type: Array,
      default() {
        return []
      }
    }
  },

  data() {
    return {}
  },

  watch: {
    device_info(newValue) {},

    status_time_rate(newValue) {}
  },

  destroyed() {},

  methods: {}
}
</script>
