<template>
  <!-- id="main" -->
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'SquareChart',
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '1024px'
    },
    height: {
      type: String,
      default: '300px'
    },

    title: {
      type: String,
      default: ''
    },

    fieldItem: {
      type: String,
      default: ''
    },

    squareData: {
      type: Array,
      default() {
        return []
      }
    },

    mainAxisTh: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      squareChart: null,

      legendData: ['source', 'threshold'],

      /** X軸時間軸 */
      xAxisData: [],

      /** 資料來源 */
      seriesData: [],

      /** 門檻值 */
      thresholdData: []
    }
  },

  watch: {
    squareData(newValue) {
      this.xAxisData = []
      this.seriesData = []
      this.thresholdData = []
      this.generateData(newValue)
      this.initChart()
    }
  },

  created() {},

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },

  beforeDestroy() {
    if (!this.squareChart) {
      return
    }
    this.squareChart.dispose()
    this.squareChart = null
  },

  methods: {
    initChart() {
      var option = {
        title: {
          text: this.title
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.legendData
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          data: this.xAxisData // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '門檻值',
            type: 'line',
            step: 'threshold',
            data: this.thresholdData
          },
          {
            name: this.title,
            type: 'line',
            step: 'source',
            data: this.seriesData
          }
        ]
      }

      this.squareChart = echarts.init(this.$el)
      this.squareChart.setOption(option)
    },

    /**
     * 產生資料
     */
    generateData(source) {
      if (source === undefined) {
        console.log('squareChart source undefined')
      } else {
        switch (this.fieldItem) {
          case 'spindlespeedth':
            console.log('this.fieldItem', this.fieldItem)
            source.forEach(element => {
              this.seriesData.push(element.axesspindlespeedactual)
              this.xAxisData.push(element.catchTime)
              this.thresholdData.push(this.mainAxisTh.spindlespeedth)
            })
            break
          case 'feedrateoverrideth':
            source.forEach(element => {
              this.seriesData.push(element.controllerpathfeedrateoverride)
              this.xAxisData.push(element.catchTime)
              this.thresholdData.push(this.mainAxisTh.feedrateoverrideth)
            })
            break
          case 'spindleload':
            source.forEach(element => {
              this.seriesData.push(element.spindleload)
              this.xAxisData.push(element.catchTime)
            })
            break
        }
      }
    }
  }
}
</script>
