<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'EquipmentPieChart',
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
    pieChartData: {
      type: Array,
      default() {
        return []
      }
    }
  },

  data() {
    return {
      pieChart: null,
      dataList: [],
      colors: []
    }
  },

  watch: {
    pieChartData(newValue) {
      this.dataList = []
      console.log('pieChartData newValue', newValue)
      newValue.forEach(element => {
        this.dataList.push({ name: element.name, value: element.value })
        this.colors.push(element.color)
      })
      this.initChart()
    }
  },

  created() {
    this.generateData()
  },

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },

  beforeDestroy() {
    if (!this.pieChart) {
      return
    }
    this.pieChart.dispose()
    this.pieChart = null
  },

  methods: {
    initChart() {
      var option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '狀態',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold',
                formatter: '{d}%'
              }
            },
            labelLine: {
              show: false
            },
            color: this.colors,
            data: this.dataList
          }
        ]
      }
      this.pieChart = echarts.init(this.$el)
      this.pieChart.setOption(option)
    },

    generateData() {
      this.pieChartData.forEach(element => {
        this.dataList.push({ name: element.name, value: element.value })
        this.colors.push(element.color)
      })
    }
  }
}
</script>
