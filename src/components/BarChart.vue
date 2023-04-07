<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
// import { isNullOrEmpty, formatDate } from '@/utils/validate'
export default {
  mixins: [resize],
  props: {
    id: {
      type: String,
      default: 'barChart'
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
      type: Object,
      required: true
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
        // console.log(val)
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
      this.setOptions(this.chartData)
    },
    setOptions({ field, histogram } = {}) {
      this.chart.setOption({
        xAxis: [{
          type: 'value',
          data: histogram.value,
          axisLabel: {
            formatter: '{value}'
          }
        }],
        yAxis: [{
          type: 'category',
          data: histogram.map(function(item) {
            return item.key
          }),
          axisLabel: {
            formatter: '{value}'
          },
          boundaryGap: true
        }],
        grid: {
          left: 50,
          right: 70,
          bottom: 20,
          top: 40,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        toolbox: {
          show: true,
          feature: {
            dataView: {
              title: 'Data View',
              lang: ['Data View', 'Close', 'Refresh'],
              optionToContent: function(opt) {
                var series = opt.series[0].data
                console.log(series)
                var table = '<table style="width:100%;text-align:center"><tbody><tr>' +
                 '<td>數值</td>' +
                 '<td>數量</td>' +
                 '</tr>'
                for (var i = 0, l = series.length; i < l; i++) {
                  table += '<tr>' +
                 '<td>' + series[i].key + '</td>' +
                 '<td>' + series[i].value + '</td>' +
                 '</tr>'
                }
                table += '</tbody></table>'

                return table
              }
            },
            restore: {
              title: 'Restore'
            },
            saveAsImage: {
              title: 'Save as Image',
              lang: ['Right Click to Save Image']
            }
          }
        },
        series: [{
          name: 'Count',
          type: 'bar',
          data: histogram
        }]
      })
    }
  }
}
</script>
