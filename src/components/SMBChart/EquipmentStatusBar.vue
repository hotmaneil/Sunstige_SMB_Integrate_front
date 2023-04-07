<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'EquipmentStatusBar',
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },

    chartData: {
      type: Array,
      default() {
        return []
      }
    }
  },

  data() {
    return {
      chart: null,
      equipmentData: [],
      serialData: []
    }
  },

  watch: {
    chartData(newValue) {
      this.serialData = []
      this.equipmentData = newValue.DeviceIdList
      newValue.StatusTimeLengthList.forEach(element => {
        const dataItem = {
          name: element.StatusName,
          itemStyle: {
            color: element.Color
          },
          type: 'bar',
          stack: 'total',
          label: {
            show: true,
            formatter: function(data) {
              if (data.value === 0) {
                return ''
              } else {
                return data.value + '%'
              }
            }
          },
          emphasis: {
            focus: 'series'
          },
          data: element.TimeLengthList
        }
        this.serialData.push(dataItem)
      })
      this.initChart()
    }
  },

  created() {
    this.generateData()
  },

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },

  methods: {

    initChart() {
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          name: '狀態時間百分比(%)',
          nameTextStyle: {
            lineHeight: 30
          },
          nameLocation: 'center',
          type: 'value',
          max: 100
        },
        yAxis: {
          name: '機台',
          type: 'category',
          data: this.equipmentData
        },
        series: this.serialData
      }
      this.chart = echarts.init(this.$el)
      this.chart.setOption(option)
    },

    generateData() {
      this.equipmentData = this.chartData.DeviceIdList
      this.chartData.StatusTimeLengthList.forEach(element => {
        const dataItem = {
          name: element.StatusName,
          itemStyle: {
            color: element.Color
          },
          type: 'bar',
          stack: 'total',
          label: {
            show: true,
            formatter: function(data) {
              if (data.value === 0) {
                return ''
              } else {
                return data.value + '%'
              }
            }
          },
          emphasis: {
            focus: 'series'
          },
          data: element.TimeLengthList
        }
        this.serialData.push(dataItem)
      })
    }
  }
}
</script>
