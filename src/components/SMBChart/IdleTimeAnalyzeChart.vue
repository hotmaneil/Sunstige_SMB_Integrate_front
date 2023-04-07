<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '650px'
    },
    height: {
      type: String,
      default: '600px'
    },
    statisticsList: {
      type: Array,
      default: null
    }
  },

  data() {
    return {
      /** 數值 */
      dataList: [],

      /** Y軸標籤 */
      yAxisDataList: [],
      barChart: null
    }
  },

  watch: {
    statisticsList(newValue) {
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
    initChart() {
      var option = {
        xAxis: {
          max: 'dataMax'
        },
        yAxis: {
          type: 'category',
          data: this.yAxisDataList,
          inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300
        },
        series: [
          {
            realtimeSort: true,
            name: '秒(s)',
            type: 'bar',
            data: this.dataList,
            label: {
              show: true,
              position: 'right',
              valueAnimation: true
            }
          }
        ],
        legend: {
          show: true
        },
        animationDuration: 0,
        animationDurationUpdate: 3000,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear'
      }

      this.barChart = echarts.init(this.$el)
      this.barChart.setOption(option)
    },

    /**
     * 產生資料
     */
    generateData(source) {
      this.yAxisDataList = []
      this.dataList = []
      source.forEach(element => {
        this.yAxisDataList.push(element.comment)
        this.dataList.push(element.DiffSecond)
      })
    }
  }
}
</script>
