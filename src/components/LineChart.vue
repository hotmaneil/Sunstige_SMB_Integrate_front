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
      default: 'lineChart'
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
      // console.log(this.chartData)
      this.chart = echarts.init(document.getElementById(this.id))
      this.setOptions(this.chartData)
    },
    // initField(field, expected) {
    //   if (isNullOrEmpty(field.FieldID)) { return }

    //   var totalData = 0

    //   expected.map(x => {
    //     totalData += parseFloat(x.value)
    //   })

    //   // // console.log('totalData', totalData)

    //   field.Average = parseFloat((totalData / expected.length).toFixed(2))

    //   // // console.log('Average', field.Average)

    //   field.MinValue = expected.reduce(function(min, val) {
    //     var newmin = Math.min(min, val.value)
    //     return newmin
    //   }, 65535)

    //   field.LowerLimit = parseFloat((field.Average - Math.abs(field.Average - field.MinValue) * 2).toFixed(2))
    //   // // console.log('field.LowerLimit', field.LowerLimit)

    //   field.MaxValue = expected.reduce(function(max, val) {
    //     var newmax = Math.max(max, val.value)
    //     return newmax
    //   }, -65535)

    //   field.UpperLimit = parseFloat((field.Average + Math.abs(field.Average - field.MaxValue) * 2).toFixed(2))
    //   // // console.log('field.UpperLimit', field.UpperLimit)
    // },
    setOptions({ field, expected } = {}) {
      if (expected.length < 1) { return }

      // console.log(field, expected)
      // this.initField(field, expected)

      this.chart.setOption({
        xAxis: {
          name: '',
          type: 'category',
          data: expected.map(function(item) {
            return formatDate(item.time, 'HH:mm:ss')
          })
        },
        yAxis: {
          name: '',
          type: 'value',
          min: field.LowerLimit,
          max: field.UpperLimit,
          minorTick: {
            show: true
          },
          splitLine: {
            lineStyle: {
              color: '#999'
            }
          },
          minorSplitLine: {
            show: true,
            lineStyle: {
              color: '#ddd'
            }
          }
        },
        grid: {
          left: 40,
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
                 '<td>Time</td>' +
                 '<td>Shorts</td>' +
                 '<td>Value</td>' +
                 '</tr>'
                for (var i = 0, l = series.length; i < l; i++) {
                  table += '<tr>' +
                 '<td>' + series[i].time + '</td>' +
                 '<td>' + series[i].shots + '</td>' +
                 '<td>' + series[i].value + '</td>' +
                 '</tr>'
                }
                table += '</tbody></table>'

                return table
              }
            },
            dataZoom: {
              title: {
                zoom: 'Zoom',
                back: 'Zoom Reset'
              }
            },
            magicType: {
              title: {
                line: 'Switch to Line Chart',
                bar: 'Switch to Bar Chart',
                stack: 'Stack',
                tiled: 'Tile'
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
                { lable: 'average',
                  yAxis: field.Average
                },
                // {
                //   lable: 'Min',
                //   yAxis: field.MinValue
                // },
                // {
                //   lable: 'Max',
                //   yAxis: field.MaxValue
                // },
                {
                  lable: 'UpperLimit',
                  yAxis: field.UpperLimit
                },
                {
                  lable: 'LowerLimit',
                  yAxis: field.LowerLimit
                }
              ]
            },
            animationDuration: 700,
            animationEasing: 'cubicInOut'
          }
        ]
      })
    }
  }
}
</script>
