<template>
  <div :id="id" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'ProduceQtyBar',
  props: {
    id: {
      type: String,
      default: 'produceQtyBar'
    },
    width: {
      type: String,
      default: '100%'
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

  created() {},
  mounted() {
    this.initChart()
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
      this.chart = echarts.init(document.getElementById(this.id))

      var option = {
        // backgroundColor: '#efefef',
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
          type: 'category',
          data: this.timeList
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.countChangeList,
            type: 'bar',
            itemStyle: {
              color: '#0EBE3A'
            },
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }

      this.chart.setOption(option)

      window.addEventListener('resize', function() {
        this.chart.resize()
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
          this.timeList.push(element.x + ':00')
          this.countChangeList.push(element.y)
        })
      }
    }
  }
}
</script>
