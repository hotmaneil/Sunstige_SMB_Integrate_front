<template>
  <div :id="ip" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
import axios from 'axios'
import Cookies from 'js-cookie'

export default {
  name: 'EquipmentPiechartIp',
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    ip: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      pieChart: null,
      pieChartData: [],

      /** 每隔幾秒更新一次 */
      updateSecond: 10
    }
  },

  created() {
    this.getUpdateSecond()

    // 開始設計時器
    this.setTimer()
  },

  mounted() {
    this.$nextTick(() => {
      this.generateChart(this.ip)
    })
  },

  beforeDestroy() {
    if (!this.pieChart) {
      return
    }
    this.pieChart.dispose()
    this.pieChart = null
  },

  methods: {
    /**
     * 依照IP產生圓餅圖
     */
    generateChart(ip) {
      console.log('依照IP取得圓餅圖資料', ip)
      var dataList = []
      var colors = []
      const url = `http://${ip}/api/Device/GetDeviceStatusCount`
      axios.get(url).then(response => {
        this.pieChartData = response.data.Payload
        // console.log('pieChartData', this.pieChartData)
        this.pieChartData.forEach(element => {
          dataList.push({ name: element.name, value: element.value })
          colors.push(element.color)

          var option = {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              top: '5%',
              left: 'center'
            },
            series: [
              {
                name: '狀態',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 2
                },
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: '40',
                    fontWeight: 'bold',
                    formatter: '{d}%'
                  }
                },
                labelLine: {
                  show: false
                },
                color: colors,
                data: dataList
              }
            ]
          }
          this.pieChart = echarts.init(this.$el)
          this.pieChart.setOption(option)
        })
      })
    },

    /**
     * 從Cookie取得每隔幾秒更新一次參數
     */
    getUpdateSecond() {
      var cookieupdateSecond = Cookies.get('updateSecond')
      if (cookieupdateSecond === null || cookieupdateSecond === undefined) {
        this.updateSecond = 30
      } else {
        this.updateSecond = cookieupdateSecond
      }
    },

    setTimer() {
      if (this.timer == null) {
        this.timer = setInterval(() => {
          this.$nextTick(() => {
            this.generateChart(this.ip)
          })
        }, this.updateSecond * 1000)
      }
    }
  }
}
</script>
