<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'HistogramStack',
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '1520'
    },
    height: {
      type: String,
      default: '500px'
    },
    chartData: {
      type: Object,
      default() {
        return null
      }
    }
  },

  data() {
    return {
      sourceData: [],
      histogramStackList: [],
      histogramStackChart: [],
      endNumber: 0,
      barWidth: 0
    }
  },

  watch: {
    chartData(newValue) {
      this.sourceData = []
      this.sourceData = newValue
      this.calculateEndNumber()
      this.generateData()
      this.initChart()
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },

  beforeDestroy() {
    if (!this.histogramStackChart) {
      return
    }
    this.histogramStackChart.dispose()
    this.histogramStackChart = null
  },

  methods: {
    initChart() {
      console.log('initChart')
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }

        },
        legend: {
          data: this.sourceData.MainStatusList
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: false, readOnly: false },
            magicType: { show: false, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: false },
            saveAsImage: { show: true }
          }
        },
        xAxis: {
          name: '機台',
          type: 'category',
          data: this.sourceData.DeviceList
        },
        yAxis: {
          name: '狀態時間百分比',
          type: 'value',
          min: 0,
          max: 100,
          nameTextStyle: {
            align: 'left'
          }
        },
        dataZoom: [
          {
            type: 'slider',
            start: 0,
            end: this.endNumber,
            height: 15,
            zoomLock: false,
            zoomOnMouseWheel: true,
            moveOnMouseMove: true
          }
        ],
        series: this.histogramStackList
      }

      this.histogramStackChart = echarts.init(this.$el)
      this.histogramStackChart.setOption(option)
    },

    generateData() {
      console.log('generateData')
      const vm = this

      // 範例
      // {
      //   name: 'Run',
      //   type: 'bar',
      //   stack: 'total',
      //   label: {
      //     show: true
      //   },
      //   emphasis: {
      //     focus: 'series'
      //   },
      //   data: [320, 302, 301, 334, 390, 330, 320]
      // },

      //   {
      //     name: '稼動率',
      //     type: 'custom',
      //     data: [90, 90, 90, 90, 90, 90, 90],
      //     markLine: {
      //       data: [{ type: 'max', name: '稼動率' }]
      //     }
      //   },

      vm.histogramStackList = []
      vm.sourceData.StatusLengthList.forEach(element => {
        var histogramData = {
          name: element.main_status_id,
          type: 'bar',
          barWidth: this.barWidth,
          stack: 'total',
          label: {
            show: true,
            fontSize: 12,
            fontWeight: 'bold',
            formatter: function(data) {
              if (data.value === 0) {
                return ''
              } else {
                return data.value + '%'
              }
            },
            position: 'inside'
          },
          emphasis: {
            focus: 'series',
            label: {
              show: true,
              fontWeight: 'bold',
              formatter: '{c}%'
            }
          },
          data: element.percentages,
          itemStyle: {
            color: element.color
          }
        }
        vm.histogramStackList.push(histogramData)
      })

      // 加進平均稼動率橫線=>暫時拿掉
      // var utilizationData = {
      //   name: '稼動率',
      //   type: 'custom',
      //   data: [vm.sourceData.Utilization],
      //   markLine: {
      //     data: [{ type: 'max', name: '稼動率' }]
      //   }
      // }
      // vm.histogramStackList.push(utilizationData)

      if (this.histogramStackChart !== undefined) {
        this.histogramStackChart.dispose()
        this.histogramStackChart = null
      }
    },

    /**
     * 判斷圖表軸百分比與Bar寬度
     */
    calculateEndNumber() {
      console.log('calculateEndNumber this.sourceData.DeviceList', this.sourceData.DeviceList)
      if (this.sourceData.DeviceList.length >= 18) {
        this.endNumber = 55
        this.barWidth = 50
      } else if (this.sourceData.DeviceList.length < 18 &&
      this.sourceData.DeviceList.length > 10) {
        this.endNumber = 100
        this.barWidth = 60
      } else if (this.sourceData.DeviceList.length < 11 &&
      this.sourceData.DeviceList.length > 7) {
        this.endNumber = 100
        this.barWidth = 80
      } else if (this.sourceData.DeviceList.length < 8 &&
      this.sourceData.DeviceList.length > 3) {
        this.endNumber = 100
        this.barWidth = 100
      } else {
        this.endNumber = 100
        this.barWidth = 200
      }
    }
  }
}
</script>
