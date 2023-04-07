<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
import { mapGetters } from 'vuex'

// import { isNullOrEmpty, formatDate } from '@/utils/validate'
export default {
  components: {},
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
      type: Object,
      required: true,
      default: function() { return [] }
    }
  },
  data() {
    return {
      chart: null,

      Select_FieldId: null,

      chartmodel: { field: {}, expected: [] },
      dialog: false
    }
  },
  computed: {
    ...mapGetters(['equipments'])
  },

  watch: {
    chartData: {
      deep: true,
      handler(val) {
        console.log(val)
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
    setOptions({ field1, field2, expected } = {}) {
      console.log(field1, field2, expected)
      var option = {
        animation: false,
        grid: {
          top: 40,
          left: 90,
          right: 90,
          bottom: 40
        },
        xAxis: {
          name: field1.FieldName,
          type: 'value',
          // min: field1.LowerLimit,
          // max: field1.UpperLimit,
          scale: true,
          axisLabel: {
            formatter: '{value}' + field1.Unit
          },
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
        yAxis: {
          name: field2.FieldName,
          type: 'value',
          // min: field2.LowerLimit,
          // max: field2.UpperLimit,
          scale: true,
          axisLabel: {
            formatter: '{value}' + field2.Unit
          },
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
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        dataZoom: [
          {
            show: true,
            type: 'inside',
            filterMode: 'none',
            xAxisIndex: [0]
          },
          {
            show: true,
            type: 'inside',
            filterMode: 'none',
            yAxisIndex: [0]
          }
        ],
        series: [
          {
            type: 'scatter',
            showSymbol: false,
            clip: true,
            data: expected,
            markLine: {
              lineStyle: {
                type: 'solid'
              },
              data: [
                { type: 'average', name: '平均值' },
                { xAxis: field1.Average }
              ]
            }
          }
        ]
      }

      this.chart.setOption(option)
    },

    setFieldChart() {}
  }
}
</script>
