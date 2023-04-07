<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
import moment from 'moment'

export default {
  name: 'UtilizationGraph',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'utilizationChart'
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
      default: '200px'
    },
    deviceId: {
      type: String,
      default: ''
    },

    startTime: {
      type: String,
      default: ''
    },

    endTime: {
      type: String,
      default: ''
    },

    utilizationGraphList: {
      type: Array,
      default() {
        return []
      }
    }
  },

  data() {
    return {
      chart: null,
      categories: [],
      data: []
    }
  },

  watch: {
    deviceId(newValue, oldValue) {
      this.changeDeviceId(newValue)
      setTimeout(() => {
        this.initChart()
      }, 1000)
    },

    utilizationGraphList(newValue, oldValue) {
      this.generateData(newValue)
      setTimeout(() => {
        this.initChart()
      }, 1000)
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
    /**
     * 變更設備Id
     */
    changeDeviceId(newDeviceId) {
      const vm = this
      vm.categories = []
      vm.categories[0] = newDeviceId
    },

    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      this.chart.setOption({
        backgroundColor: '#efefef',
        title: {
          text: '設備稼動歷程',
          left: 'left'
        },

        tooltip: {
          formatter: function(params) {
            var labelName = params.name
            return labelName
          }
        },

        dataZoom: [
          {
            type: 'slider',
            filterMode: 'weakFilter',
            showDataShadow: false,
            top: 200,
            labelFormatter: ''
          },
          {
            type: 'inside',
            disabled: false,
            filterMode: 'weakFilter'
          }
        ],

        grid: {
          height: 100
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
          min: +new Date(this.startTime),
          max: +new Date(this.endTime),
          scale: true,
          axisLabel: {
            formatter: function(val) {
              return moment(val).format('HH:mm')
            }
          },
          interval: 3600 * 1000
        },
        yAxis: { data: this.categories },
        series: [
          {
            type: 'custom',
            stack: true,
            renderItem: this.renderItem,
            itemStyle: {
              opacity: 0.8
            },
            encode: {
              x: [1, 2],
              y: 0
            },
            data: this.data
          }
        ]
      })

      window.addEventListener('resize', function() {
        this.chart.resize()
      })
    },

    renderItem(params, api) {
      var categoryIndex = api.value(0)
      var start = api.coord([api.value(1), categoryIndex])
      var end = api.coord([api.value(2), categoryIndex])
      var height = api.size([0, 1])[1] * 0.6

      var rectShape = echarts.graphic.clipRectByRect(
        {
          x: start[0],
          y: start[1] - height / 2,
          width: end[0] - start[0],
          height: height
        },
        {
          x: params.coordSys.x,
          y: params.coordSys.y,
          width: params.coordSys.width,
          height: params.coordSys.height
        }
      )

      return (
        rectShape && {
          type: 'rect',
          transition: ['shape'],
          shape: rectShape,
          style: api.style()
        }
      )
    },

    /**
     * 參考範例
     */
    generateMockData() {
      // this.data.push({
      //   name: 'Run',
      //   value: [1, new Date('2021-05-06 9:00'), new Date('2021-05-06 9:10'), 10 * 60000],
      //   itemStyle: {
      //     normal: {
      //       color: '#75d874',
      //     },
      //   },
      // })

      // this.data.push({
      //   name: 'Down',
      //   value: [1, new Date('2021-05-06 9:10'), new Date('2021-05-06 9:15'), 5 * 60000],
      //   itemStyle: {
      //     normal: {
      //       color: '#bd6d6c',
      //     },
      //   },
      // })

      // this.data.push({
      //   name: '#64c051',
      //   value: [1, 1618560017000, 1618567916000, 7899000],
      //   itemStyle: {
      //     normal: {
      //       color: '#64c051'
      //     }
      //   }
      // })

      // this.data.push({
      //   name: '#64c051',
      //   value: [1, 1618567912000, 1618572855000, 4943000],
      //   itemStyle: {
      //     normal: {
      //       color: '#64c051'
      //     }
      //   }
      // })
    },

    /**
     * 產生資料
     */
    generateData(source) {
      this.data = []
      if (source === undefined) {
        console.log('utilizationGraphList source undefined')
      } else {
        source.forEach(element => {
          const graphDataItem = {
            name: moment(element.x).format('yyyy-MM-DD HH:mm') + '~' + moment(element.x2).format('yyyy-MM-DD HH:mm'), // element.color,
            value: [1, element.x, element.x2, element.period],
            itemStyle: {
              normal: {
                color: element.color
              }
            }
          }
          this.data.push(graphDataItem)
        })
        // var first = this.data[0].value[1]
        // console.log('+new Date(this.startTime)', +new Date(this.startTime))
        // console.log('first time', moment(first).format('yyyy-MM-DD HH:mm'))
      }
    }
  }
}
</script>
