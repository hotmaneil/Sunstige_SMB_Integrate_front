<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
import moment from 'moment'

export default {
  name: 'ProduceQtyGraph',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'line'
    },
    id: {
      type: String,
      default: 'produceQtyChart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
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

      timeList: [],
      countChangeList: []
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
        backgroundColor: '#efefef',
        title: {
          top: 20,
          text: '生產次數累計',
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
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['CMCC', 'CTCC', 'CUCC'],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            data: this.timeList
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '(%)',
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
                color: '#57617B'
              }
            }
          }
        ],
        series: [
          {
            name: '數量',
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
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(137, 189, 27, 0.3)'
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(137, 189, 27, 0)'
                    }
                  ],
                  false
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(137,189,27)',
                borderColor: 'rgba(137,189,2,0.27)',
                borderWidth: 12
              }
            },
            data: this.countChangeList
          }
        ]
      })
    },

    /**
     * 產生資料
     */
    generateData(source) {
      this.timeList = []
      this.countChangeList = []

      if (source === undefined) {
        console.log('ProduceQtyGraphList source undefined')
      } else {
        source.forEach(element => {
          const timeLabel = moment(element.x).format('HH:mm')
          this.timeList.push(timeLabel)
          this.countChangeList.push(element.y)
        })
      }
    }
  }
}
</script>
