<template>
  <div>
    <div v-for="(item, index) in chartidlist" :key="`bar-chart1-` + index">
      <line-chart-mode2
        :id="`bar-chart1-` + item.FieldID"
        :eq="equipment"
        style="float: left"
        :chart-data="[]"
        :field="item"
        :selected-date="selectedDate"
        :selected-time="selectedTime"
      />
      <bar-chart-mode2
        :id="`bar-chart2-` + item.FieldID"
        :eq="equipment"
        style="float: left"
        :chart-data="[]"
        :field="item"
        :selected-date="selectedDate"
        :selected-time="selectedTime"
      />
    </div>
  </div>
</template>

<script>
import { getEquipment } from '@/api/Equipments'
import LineChartMode2 from '@/components/LineChartMode2'
import BarChartMode2 from '@/components/BarChartMode2'

export default {
  components: { LineChartMode2, BarChartMode2 },
  props: {
    equipmentid: {
      type: String,
      default: null
    },

    selectedDate: {
      type: Date,
      default: ''
    },

    selectedTime: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      // listLoading: true,
      equipment: {},
      listQuery: {
        page: 1,
        limit: 300
      },
      order_prop: 'CreateTime',
      desc_prop: 1,

      tracedata: [],
      totalData: 0,

      fieldItemVisible: false,
      fieldItem: {},

      defaultProps: {
        children: 'Actual',
        label: 'FieldName'
      },
      chartidlist: [],
      listparameter: [],

      SelectedDate: null,
      SelectedTime: null
    }
  },
  computed: {},

  watch: {
    equipmentid: {
      handler(val) {
        if (val === null) {
          return
        }

        this.getResponseList()
      }
    }
  },
  created() {
    if (this.equipmentid) {
      this.getResponseList()
    }
  },
  beforeDestroy() {},
  methods: {
    IsLimitFilter(row) {
      if (row.IsLimit) {
        return 'primary'
      }
      return 'info'
    },
    ValueLimitFilter(row) {
      return 'info'
    },

    async getResponseList() {
      await this.GET_EquipmentsList(this.equipmentid).then(response => {
        this.equipment = response
        this.GetActualFields()
      })
    },

    async GetActualFields() {
      // var sortfunc = getSortFunc('SortID', 1, 'SortID')
      this.chartidlist = []

      // 改用 await 等待 Promise 內的工作全部完成
      const results = await Promise.all(
        this.equipment.Fields.map(async fd => {
          if (fd.GroupName === 'SetValue') {
            // this.equipment.SetValueFields.push(Object.assign({}, fd))
          } else if (fd.GroupName === 'Actual') {
            if (fd.IsChart) {
              this.chartidlist.push(Object.assign({}, fd))
            }
          }
          return true
        })
      ).then(isOK => {})
        .catch(response => {
          console.log('catch', response)
          // this.listLoading = false
        })
        .finally(() => {})

      return results
    },

    GET_EquipmentsList(equipment_id) {
      return new Promise((resolve, reject) => {
        getEquipment({
          EquipmentID: equipment_id,
          IsEnabled: 1,
          IsDisplay: 1
        })
          .then(response => {
            // 判斷是否 正確
            resolve(response.data.Payload)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
</script>

<style scoped></style>
