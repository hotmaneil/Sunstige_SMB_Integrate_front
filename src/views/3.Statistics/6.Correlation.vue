<template>
  <div class="app-container">

    <el-row>
      <el-col :span="12">
        <el-date-picker v-model="SelectedDate" type="date" placeholder="請選取日期" />
        <el-time-picker
          v-model="SelectedTime"
          is-range
          range-separator="To"
          start-placeholder="開始時間"
          end-placeholder="結束時間"
        />
      </el-col>

      <el-col :span="12">
        <equipment-select :equipmentid.sync="SelectEquipmentID" @OnSelectEquipmentChange="OnChangeEquipmentID" />
      </el-col>

    </el-row>

    <el-row>
      <el-col :span="12">
        <select-two-fieldName :fielddata="GetFields()" @OnSelectParameterChange="ParameterChange" />
      </el-col>
      <el-col :span="12">
        <relation-chart :expected="expected" :xname="xName" :yname="yName" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getEquipment } from '@/api/Equipments'

import SelectTwoFieldName from '@/components/SelectTwoFieldName'
import RelationChart from '@/components/RelationChart'
// import { getTraceList } from '@/api/FieldName'
import { getCorrelationList as getTraceList } from '@/api/TraceReport'
import { isNullOrEmpty, formatDate, getSortFunc } from '@/utils/validate'
import EquipmentSelect from '@/components/DropDownList/EquipmentSelect'
import moment from 'moment'

export default {
  components: {
    EquipmentSelect,
    SelectTwoFieldName,
    RelationChart
  },
  filters: {
    formatDateFilter(value) {
      return formatDate(value)
    }
  },
  data() {
    return {
      listLoading: true,
      listedc: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 300
      },
      order_prop: 'CreateTime',
      desc_prop: 1,
      equipment: {},
      SelectEquipmentID: '',

      Select_DateLimit: formatDate(Date.now()),
      Select_FieldId: null,
      Fields: [],
      expected: [],
      dialog: false,
      xName: null, // x軸名稱
      yName: null, // y軸名稱

      SelectedDate: null,
      SelectedTime: null
    }
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
  },
  methods: {
    setTimer() {
      this.timer = setInterval(() => {
        // console.log('this.SelectEquipmentID', this.SelectEquipmentID)
        if (!isNullOrEmpty(this.SelectEquipmentID)) {
          this.GET_EquipmentsList(this.SelectEquipmentID).then(response => {
            this.equipment = response
            this.getResponseList()

            clearInterval(this.timer)
            this.timer = null
          })
        }
      }, 1000)
    },

    OnChangeEquipmentID(source) {
      console.log('OnChangeEquipmentID EquipmentID', source)
      this.SelectEquipmentID = source
      this.GET_EquipmentsList(source).then(response => {
        this.equipment = response
        this.Fields = []
        this.expected = []

        this.getResponseList()
      })
    },

    GetFields() {
      return this.Fields
    },

    getResponseList() {
      this.Fields = []

      if (this.SelectEquipmentID === '') {
        return []
      }
      if (this.equipment.Fields === null) {
        return []
      }

      var sortfunc = getSortFunc('SortID', 1, 'SortID')

      this.equipment.Fields.map(x => {
        if (x.GroupName === 'SetValue') {
          return
        } else if (x.GroupName === 'Actual') {
          this.Fields.push(Object.assign({}, x))
        }
      })
      this.Fields.sort(sortfunc)
    },
    ParameterChange(fieldId) {
      // console.log('fieldId', fieldId)

      if (fieldId[0] == null) {
        return
      }
      if (fieldId[1] == null) {
        return
      }

      this.SetAllFields(fieldId[0], fieldId[1])

      // 取得x軸 和 y軸 的名稱
      this.xName = this.equipment.Fields.find(f => f.FieldID === fieldId[0]).FieldName
      this.yName = this.equipment.Fields.find(f => f.FieldID === fieldId[1]).FieldName
    },

    async SetAllFields(fid1, fid2) {
      this.expected = await this.SetFields(fid1, fid2)
    },

    SetFields(fid1, fid2) {
      return new Promise((resolve, reject) => {
        var params = {
          orderby_: this.order_prop,
          desc_: this.desc_prop,
          offset_: this.listQuery.page,
          fetch_: this.listQuery.limit,
          Code: 'CurrentModulus',
          EquipmentID: this.equipment.EquipmentID,
          SelectedDate: moment(this.SelectedDate).format('YYYY/MM/DD'),
          SelectedStartTime: moment(this.SelectedTime[0]).format('YYYY/MM/DD HH:mm'),
          SelectedEndTime: moment(this.SelectedTime[1]).format('YYYY/MM/DD HH:mm')
        }

        getTraceList(params)
          .then(response => {
            // console.log('response.data.items', response.data.items)
            var rtn = []
            response.data.Payload.map(x => {
              // const fids = x.Fields.split(',')
              // const rows = x.RowData.split(',')
              // const sd = x.StandardDifference.split(',')
              // const avg = x.Average.split(',')

              var rowdata = { x: 0, y: 0, ok: 0 }
              x.TraceItems.map(t => {
                if (t.FieldID === fid1) {
                  rowdata.x = parseFloat(t.Value)
                  rowdata.ok += 1
                } else if (t.FieldID === fid2) {
                  rowdata.y = parseFloat(t.Value)
                  rowdata.ok += 1
                }

                if (rowdata.ok === 2) {
                  rtn.push({
                    value: [rowdata.x, rowdata.y],
                    time: x.TriggerTime
                  })
                }
              })
            })

            resolve(rtn)
          })
          .catch(response => {
            // // console.log('response', response)
            reject(response)
          })
      })
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
    },

    TryParseDouble(v) {
      var vv = parseFloat(v)
      if (!isNaN(vv)) return vv
      return v
    }
  }
}
</script>
<style lang="scss" scoped>
.chart-container {
  margin: 10px;
  width: 90%;
  clear: left;
  height: calc(100vh - 200px);
}
</style>
