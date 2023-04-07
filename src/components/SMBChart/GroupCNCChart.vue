<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'GroupCNCChart',
  props: {
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
      default: '300px'
    },
    groupData: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      barChart: null,
      legendData: [],
      xAxisData: [],
      seriesData: [],
      posList: [
        'left',
        'right',
        'top',
        'bottom',
        'inside',
        'insideTop',
        'insideLeft',
        'insideRight',
        'insideBottom',
        'insideTopLeft',
        'insideTopRight',
        'insideBottomLeft',
        'insideBottomRight'
      ]
    }
  },

  watch: {
    groupData(newValue) {
      this.generateData(newValue)
      this.initChart()
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },

  methods: {
    optionSetting() {},

    initChart() {
      var app = {}

      app.configParameters = {
        rotate: {
          min: -90,
          max: 90
        },
        align: {
          options: {
            left: 'left',
            center: 'center',
            right: 'right'
          }
        },
        verticalAlign: {
          options: {
            top: 'top',
            middle: 'middle',
            bottom: 'bottom'
          }
        },
        position: {
          options: this.posList.reduce(function(map, pos) {
            map[pos] = pos
            return map
          }, {})
        },
        distance: {
          min: 0,
          max: 100
        }
      }

      app.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15,
        onChange: function() {
          var labelOption = {
            normal: {
              rotate: app.config.rotate,
              align: app.config.align,
              verticalAlign: app.config.verticalAlign,
              position: app.config.position,
              distance: app.config.distance
            }
          }

          this.barChart.setOption({
            series: [
              {
                label: labelOption
              },
              {
                label: labelOption
              },
              {
                label: labelOption
              },
              {
                label: labelOption
              }
            ]
          })
        }
      }

      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: this.legendData
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
            name: '機台_主程式號碼',
            nameLocation: 'center',
            nameTextStyle: {
              lineHeight: 80
            },
            type: 'category',
            axisTick: {
              show: false
            },
            data: this.xAxisData,
            axisLabel: {
              formatter: function(value, index) {
                var strs = value.split('_')
                var newStr = strs[0] + '\n' + strs[1] + '\n'
                if (strs[2] !== undefined) { newStr += strs[2] }
                return newStr
              }
            }
          }
        ],
        yAxis: [
          {
            name: '稼動率%',
            type: 'value'
          }
        ],
        series: this.seriesData
      }

      this.barChart = echarts.init(this.$el)
      this.barChart.setOption(option, true)
    },

    /**
     * 產生資料
     */
    generateData(source) {
      var app = {}
      var posList = [
        'left',
        'right',
        'top',
        'bottom',
        'inside',
        'insideTop',
        'insideLeft',
        'insideRight',
        'insideBottom',
        'insideTopLeft',
        'insideTopRight',
        'insideBottomLeft',
        'insideBottomRight'
      ]

      app.configParameters = {
        rotate: {
          min: -90,
          max: 90
        },
        align: {
          options: {
            left: 'left',
            center: 'center',
            right: 'right'
          }
        },
        verticalAlign: {
          options: {
            top: 'top',
            middle: 'middle',
            bottom: 'bottom'
          }
        },
        position: {
          options: posList.reduce(function(map, pos) {
            map[pos] = pos
            return map
          }, {})
        },
        distance: {
          min: 0,
          max: 100
        }
      }

      app.config = {
        rotate: 0,
        align: 'center',
        verticalAlign: 'middle',
        position: 'top',
        distance: 15,
        onChange: function() {
          var labelOption = {
            normal: {
              rotate: app.config.rotate,
              align: app.config.align,
              verticalAlign: app.config.verticalAlign,
              position: app.config.position,
              distance: app.config.distance
            }
          }
          this.barChart.setOption({
            series: [
              {
                label: labelOption
              },
              {
                label: labelOption
              },
              {
                label: labelOption
              },
              {
                label: labelOption
              }
            ]
          })
        }
      }

      var labelOption = {
        show: true,
        position: app.config.position,
        distance: app.config.distance,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        rotate: app.config.rotate,
        // formatter: '{c}  {name|{a}}',
        fontSize: 16,
        rich: {
          name: {}
        }
      }

      if (source === undefined || Object.keys(source).length === 0) {
        console.log('squareChart source undefined')
      } else {
        this.seriesData = []

        this.legendData = source.UtilizationTypeList
        this.xAxisData = source.xAxisDataList
        //
        this.seriesData = source.series.map(data => {
          return {
            name: data.LabelName,
            type: 'bar',
            label: labelOption,
            emphasis: {
              focus: 'series'
            },
            data: data.UtilizationList,
            showBackground: false
          }
        })
      }
    }
  }
}
</script>
