<template>
  <div class="tag-group">
    <div v-for="item in pieChartData" :id="item.name" :key="item.name">
      <span class="box" :style="{ backgroundColor: item.color}">
        {{ item.value }}
      </span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'EquipmentCountTag',
  props: {
    ip: {
      type: String,
      default: ''
    },

    /** 若ip沒有則用此資料代替 */
    replaceData: {
      type: Array,
      default: null
    }
  },

  data() {
    return {
      pieChartData: []
    }
  },

  watch: {
    replaceData(newValue) {
      this.getData(newValue)
    }

  },

  created() {
  },

  methods: {
    /**
     * 依照IP取得圓餅圖資料
     */
    generateChart(ip) {
      console.log('依照IP取得圓餅圖資料 tag', ip)
      const vm = this
      const url = `http://${ip}/api/Device/GetDeviceStatusCount`
      axios.get(url).then(response => {
        vm.pieChartData = response.data.Payload
      })
    },

    /**
     * 若沒有IP則從上層取資料
     */
    getData(source) {
      const vm = this
      vm.pieChartData = source
    }
  }
}
</script>

<style scoped>
.tag-group{
  display: flex;
  justify-content: center;
  align-items: center;
}
.box{
  /* height:30px; */
  /* width:30px; */
  padding: 0px 10px;
  font-size: 24px;
  margin-right: 8px;
  border-radius: 4px;
  color: aliceblue;
}
</style>
