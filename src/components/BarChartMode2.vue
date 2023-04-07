<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import { mapGetters } from 'vuex'
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
import { getTraceList } from '@/api/FieldName'
import moment from 'moment'

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
      listtrace: [],
      listQuery: {
        page: 1,
        limit: 300
      },
      chartField: [],
      chartVal: [],
      timer: null,

      /** 從api取得資料 */
      dataList: []
    }
  },
  computed: {
    ...mapGetters(['equipments'])
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
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.getResponseList()
    },

    getResponseList() {
      const vm = this

      var params = {
        orderby_: 'TriggerTime',
        desc_: 1,
        offset_: vm.listQuery.page,
        fetch_: vm.listQuery.limit,
        Mode: vm.field.FieldID,
        select_: 'TriggerTime,RawData',
        SelectedDate: moment(this.selectedDate).format('YYYY/MM/DD'),
        SelectedStartTime: moment(this.selectedTime[0]).format('YYYY/MM/DD HH:mm'),
        SelectedEndTime: moment(this.selectedTime[1]).format('YYYY/MM/DD HH:mm')
      }

      getTraceList(params).then(response => {
        // 取得distinct的List
        var allvalue = 0.0
        var maxv = null
        var minv = null

        vm.dataList = response.data.Payload

        response.data.Payload.reduce((obj, item) => {
          if (obj[item.RawData] >= 1) {
            obj[item.RawData] += 1
          } else {
            obj[item.RawData] = 1
          }

          var vv = parseFloat(item.RawData)
          if (!isNaN(vv)) {
            if (maxv == null) maxv = vv
            else if (minv == null) minv = vv
            else if (vv > maxv) maxv = vv
            else if (minv > vv) minv = vv
            allvalue += vv
          }

          return obj
        }, {})

        vm.chartVal = []

        // 1. 找出 最大 最小，按照 平均 與 兩端的 間距 切分，如果 變動幅度 不大 不用切太多，最多 切9份
        // 2. 例如 100 ~ 400 ，共 30 筆 以平均值 做 中線，平均 200
        // 3. 則 間距 為 (200-100) / 4  (400 -200) / 4 ，兩者取大的 或是 其他考量...
        // 4. 得出      400 350 300 250 200 150 100 ，再把數值 分配到每個 Buffer
        var pan = 4
        if (response.data.Payload.length < 10) {
          pan = 2
        }
        var avg = allvalue / response.data.Payload.length
        var ganArray = []

        if (vm.dataList.length > 0) {
          var IndexValue = maxv
          var gan = Math.abs((maxv - avg) / pan)
          for (var i = 0; i < pan + 1; i++) {
            ganArray.push({
              Index: i,
              Max: IndexValue,
              Min: IndexValue - gan,
              Value: []
            })
            IndexValue = IndexValue - gan
          }

          gan = Math.abs((avg - minv) / pan)
          for (i = pan + 1; i < pan * 2 + 1; i++) {
            ganArray.push({
              Index: i,
              Max: IndexValue,
              Min: IndexValue - gan,
              Value: []
            })
            IndexValue = IndexValue - gan
          }

          response.data.Payload.reduce((obj, item) => {
            var vv = parseFloat(item.RawData)
            if (!isNaN(vv)) {
              var ganItem = obj.find(x => x.Max >= vv && vv > x.Min)
              if (ganItem == null) {
                // console.log(item)
              } else {
                ganItem.Value.push(vv)
              }
            }

            return obj
          }, ganArray)

          vm.listtrace = []

          ganArray
            .sort(function(b, a) {
              var nameA = a.Index
              var nameB = b.Index
              if (nameA < nameB) {
                return -1
              }
              if (nameA > nameB) {
                return 1
              }

              return 0
            })
            .forEach(function(parm, index, array) {
              var num = parm.Max
              if (parm.Max % 1 !== 0) {
                num = parm.Max.toFixed(2)
              }

              vm.listtrace.push({
                name: num + ' ~ ',
                value: parm.Value.length
              })
            })

          if (vm.listtrace.length > 0) {
            vm.setOptions(vm.listtrace)
          }
        } else {
          this.$message({
            message: `${this.field.FieldName}:沒資料可繪長條圖！`,
            type: 'warning'
          })
        }
      })
    },

    // 計算相同值的次數
    getCollectionRepeat(box, key) {
      var counter = {}

      box.forEach(function(x) {
        counter[x] = (counter[x] || 0) + 1
      })
      var val = counter[key]
      if (key === undefined) {
        return counter
      }
      return val === undefined ? 0 : val
    },

    setOptions(expected) {
      this.chart.setOption({
        xAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            },
            boundaryGap: true,
            name: '筆數',
            nameLocation: 'middle'
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: expected.map(function(item) {
              return item.name
            }),
            axisLabel: {
              formatter: '{value}'
            },
            name: `${this.field.Unit == null ? '' : this.field.Unit}`
          }

        ],
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
        series: [
          {
            name: 'Count',
            type: 'bar',
            data: expected
          }
        ]
      })
    }
  }
}
</script>
