<template>

  <div :id="id" :class="className" :style="{height:height,width:width}" />

</template>

<script>
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
import { formatDate } from '@/utils/validate'
export default {
  mixins: [resize],
  props: {
    id: {
      type: String,
      default: 'chart'
    },
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
      default: '100%'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array,
      required: true,
      default: function() { return [] }
    },
    field: {
      type: Object,
      required: true,
      default: function() { return {} }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        if (val === []) { return }
        // // console.log('chartData', val)
        this.setOptions(val)
      }
    }
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
      this.chart = echarts.init(document.getElementById(this.id))
      if (this.chartData === []) { return }
      // console.log('chartData', this.chartData)
      this.setOptions(this.chartData)
    },
    setOptions(expected) {
      if (expected.length <= 0) { return }
      // console.log('setOptions', this.field, expected)
      this.chart.setOption({
        xAxis: {
          name: '',
          type: 'category'
          // data: expected.map(function(item) {
          //   return formatDate(item.time, 'HH:mm:ss')
          // })
        },
        yAxis: {
          name: '',
          // max: field.UpperLimit,
          // min: field.LowerLimit,
          type: 'value'

        },
        grid: {
          left: 40,
          right: 70,
          bottom: 1,
          top: 10,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },

        series: [
          {
            name: 'value',
            itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: expected,
            markLine: {
              data: [
                {
                  lable: 'average'
                  // yAxis: this.field.Average
                }
              ]
            }
          }
        ]
      })
    }
  }
}
</script>
