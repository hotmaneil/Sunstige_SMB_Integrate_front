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
      default: '300px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    expected: {
      type: Array,
      default: function() {
        return []
      }
    },
    xname: {
      type: String,
      default: ''
    },
    yname: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    ...mapGetters(['equipments'])
  },
  watch: {
    expected: {
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
      this.setOptions(this.expected)
    },
    setOptions(expected) {
      // console.log(expected)
      var option = {
        animation: false,
        grid: {
          top: 40,
          left: 90,
          right: 90,
          bottom: 40
        },
        xAxis: {
          name: this.xname,
          type: 'value',
          scale: true,
          axisLabel: {
            formatter: '{value}'
          },
          // x軸標題的文字樣式
          nameTextStyle: {
            // color: ['red'],
            fontSize: 16,
            align: 'center',
            padding: [0, 100, -60, 0]
          }
        },
        yAxis: {
          name: this.yname,
          type: 'value',
          scale: true,
          axisLabel: {
            formatter: '{value}'
          },
          // y軸標題的文字樣式
          nameTextStyle: {
            fontSize: 16
          }
        },

        series: [
          {
            name: 'scatter',
            type: 'scatter',
            data: expected
          }
        ],

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
        ]
      }

      this.chart.setOption(option)
    }
  }
}
</script>
