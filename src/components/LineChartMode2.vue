<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
// isNullOrEmpty, formatDate, TryParseDouble, addDate,isString
import { isNullOrEmpty, formatDate, TryParseDouble } from '@/utils/validate'
import { getTraceList } from '@/api/FieldName'
import moment from 'moment'

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
      default: '50%'
    },
    height: {
      type: String,
      default: '20em'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array,
      required: true,
      default: function() {
        return []
      }
    },
    field: {
      type: Object,
      required: true,
      default: function() {
        return {}
      }
    },
    eq: {
      type: Object,
      default: function() {
        return {}
      }
    },

    selectedDate: {
      type: Date,
      default: ''
    },

    selectedTime: {
      type: Array,
      default: function() {
        return {}
      }
    }
  },

  data() {
    return {
      chart: null,
      option: {},
      equipment: {},
      listLoading: true,
      listtrace: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 300
      },
      maxTriggerTime: 0,

      order_prop: 'TriggerTime',
      desc_prop: 1
    }
  },

  watch: {
    selectedDate(newValue) {
      this.initChart()
    },

    selectedTime(newValue) {
      this.initChart()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  created() {
    clearInterval(this.timer)
    this.timer = null
    this.setTimer()
    this.listLoading = true
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null

    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    setTimer() {
      // if (this.timer == null) {
      //   this.timer = setInterval(() => {
      //     if (this.field === {} || this.listtrace.length === 0) {
      //       return
      //     }
      //     this.getResponseList()
      //   }, 10000)
      // }
    },

    initChart() {
      if (this.field === {}) {
        return
      }
      this.chart = echarts.init(document.getElementById(this.id))
      this.equipment = this.eq

      this.option = {
        title: {
          text: this.field.FieldName
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            formatter: function(value, index) {
              var date = new Date(value)
              return formatDate(date, 'MM/dd HH:mm:ss')
            }
          },
          splitLine: {
            show: true
          },
          name: '時間',
          nameLocation: 'middle',
          nameTextStyle: {
            padding: [10, 0, 0, 0]
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter:
              '{value}'
          },
          boundaryGap: ['.5', '.5'],
          splitLine: {
            show: true
          },
          name: `${this.field.Unit == null ? '' : this.field.Unit}`
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            params = params[0]
            return (
              formatDate(params.name, 'yyyy/MM/dd HH:mm:ss') +
              ' => ' +
              params.value[1]
            )
          },
          axisPointer: {
            animation: false
          }
        },
        grid: {
          left: 40,
          right: 70,
          bottom: 20,
          top: 55,
          containLabel: true
        },

        series: [
          {
            name: '參數數據',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: [],
            markLine: {
              data: [
                {
                  lable: 'average',
                  yAxis: this.field.Average
                }
              ]
            }
          }
        ]
      }

      this.getResponseList()
    },

    getResponseList() {
      var params = {
        orderby_: 'TriggerTime',
        desc_: 1,
        offset_: this.listQuery.page,
        fetch_: this.listQuery.limit,
        Mode: this.field.FieldID,
        select_: 'TriggerTime,RawData',
        SelectedDate: moment(this.selectedDate).format('YYYY/MM/DD'),
        SelectedStartTime: moment(this.selectedTime[0]).format('YYYY/MM/DD HH:mm'),
        SelectedEndTime: moment(this.selectedTime[1]).format('YYYY/MM/DD HH:mm')
      }

      console.log('getTraceList()', params)

      getTraceList(params).then(response => {
        this.listtrace = []
        response.data.Payload.reverse().map(x => {
          if (new Date(x.TriggerTime) > this.maxTriggerTime) {
            this.maxTriggerTime = new Date(x.TriggerTime)
          }

          // 判定 數值 種類

          var vv = parseFloat(x.RawData)
          if (isNaN(vv)) {
            if (!isNullOrEmpty(x.RawData)) {
              this.option.yAxis.type = 'category'

              this.listtrace.push({
                name: formatDate(x.TriggerTime, 'yyyy-MM-dd HH:mm:ss'),
                value: [
                  formatDate(x.TriggerTime, 'yyyy-MM-dd HH:mm:ss'),
                  x.RawData
                ]
              })
            }
          } else {
            this.option.yAxis.type = 'value'
            this.listtrace.push({
              name: formatDate(x.TriggerTime, 'yyyy-MM-dd HH:mm:ss'),
              value: [
                formatDate(x.TriggerTime, 'yyyy-MM-dd HH:mm:ss'),
                TryParseDouble(x.RawData)
              ]
            })
          }
        })

        this.total = response.data.total
        this.listLoading = false

        if (this.listtrace.length > 0) {
          this.setOptions(this.listtrace)
        } else {
          this.$message({
            message: `${this.field.FieldName}:沒資料可繪折線圖！`,
            type: 'warning'
          })
        }
        console.log('this.listtrace', response.data, this.listtrace, this.field)
      })
    },

    setOptions(expected) {
      // // console.log('expected', expected)
      this.option.series = [
        {
          name: '參數數據',
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: expected
        }
      ]
      this.chart.setOption(this.option)
    }
  }
}
</script>
