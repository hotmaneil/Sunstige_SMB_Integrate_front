<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'

export default {
  name: 'UtilizationHistoryChart',
  mixins: [resize],
  props: {
    deviceId: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: 'line'
    },
    id: {
      type: String,
      default: 'historyChart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '300px'
    },
    graphList: {
      type: Array,
      default() {
        return []
      }
    }
  },

  data() {
    return {
      chart: null,
      legendList: [],
      timeList: [],

      /** 整天資料 */
      allList: [],

      /** 早班資料 */
      morningList: [],

      /** 晚班資料 */
      nightList: []
    }
  },

  watch: {
    graphList(newValue) {
      this.generateData(newValue)
      this.initChart()
    }
  },
  created() {
    this.generateData()
    this.initChart()
  },
  mounted() {},
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      this.chart.setOption({
        backgroundColor: '#fff',
        title: {
          top: 20,
          text: `${this.deviceId} 查詢結果`,
          textStyle: {
            fontWeight: 'bold',
            fontSize: 18,
            color: '#05053e'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 10,
          itemHeight: 5,
          itemGap: 13,
          data: this.legendList,
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#0A0F34'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
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
        xAxis: [
          {
            name: '日期',
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            nameTextStyle: {
              align: 'center'
            },
            data: this.timeList
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '稼動率(%)',
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            splitLine: {
              lineStyle: {
                color: '#DDE3EA'
              }
            }
          }
        ],
        series: [
          {
            name: '整天',
            type: 'line',
            smooth: false,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(137,189,27)',
                borderColor: 'rgba(137,189,2,0.27)',
                borderWidth: 6
              }
            },
            data: this.allList
          },

          {
            name: '早班',
            type: 'line',
            smooth: false,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: '#1F7FE1',
                borderColor: '#1F7FE1',
                borderWidth: 6
              }
            },
            data: this.morningList
          },

          {
            name: '晚班',
            type: 'line',
            smooth: false,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: '#291E6C',
                borderColor: '#291E6C',
                borderWidth: 6
              }
            },
            data: this.nightList
          }
        ]
      })
    },

    /**
     * 產生資料
     */
    generateData(source) {
      this.timeList = []
      this.legendList = []

      this.allList = []
      this.morningList = []
      this.nightList = []

      if (source === undefined) {
        console.log('UtilizationHistoryChart source undefined')
      } else {
        this.timeList = source.CategoryList
        this.allList = source.AllDay

        source.classInfo.forEach(element => {
          this.legendList.push(element.className)

          element.value.forEach(valueItem => {
            switch (element.className) {
              case '早班':
                this.morningList.push(valueItem)
                break
              case '晚班':
                this.nightList.push(valueItem)
            }
          })
        })
        this.legendList.push('整天')
      }
    }
  }
}
</script>
