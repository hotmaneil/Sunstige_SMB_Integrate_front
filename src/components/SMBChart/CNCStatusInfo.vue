<template>
  <div class="app-container" style="background-color:#efefef">
    <el-row>
      <el-col :span="6">
        <h3>運轉時間</h3>
        <el-card class="box-card" :style="{ backgroundColor: actionTimeColor }">
          <span style="text-align: center;display:block;color: white;font-size:32px">
            {{ cncStatusInfo.OperationTime }}
          </span>
        </el-card>
      </el-col>

      <el-col :span="6">
        <h3>實際切削時間</h3>
        <el-card class="box-card" :style="{ backgroundColor: cncStatusInfo.device_status_color }">
          <span style="text-align: center;display:block;color: white;font-size:32px ">
            {{ cncStatusInfo.ActualCuttingTime }}
          </span>
        </el-card>
      </el-col>

      <el-col :span="6">
        <h3>實際稼動率</h3>
        <el-card class="box-card" :style="{ backgroundColor: cncStatusInfo.device_status_color }">
          <span style="text-align: center;display:block;color: white;font-size:32px">
            {{ cncStatusInfo.ActualUtilization }}
          </span>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'CNCStatusInfo',
  props: {
    cncStatusInfo: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      // statusInfo:null

      actionTimeColor: 'rgb(130, 217, 30)'
    }
  },

  watch: {
    cncStatusInfo(newValue) {
      // this.getData(newValue)
      console.log('cncStatusInfo', newValue)
    }
  },

  methods: {}
}
</script>
