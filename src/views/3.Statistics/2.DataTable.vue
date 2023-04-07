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
        <equipment-select :is-default-select="false" :equipmentid.sync="SelectEquipmentID" @OnSelectEquipmentChange="OnChangeEquipmentID" />
      </el-col>
    </el-row>

    <div style="float: right">
      <el-button type="primary" @click="DownloadCsvReport('group', null)">下載 今日 CSV 報表</el-button>
      <el-button type="primary" @click="DownloadExcel()">下載 今日 Excel 報表</el-button>
    </div>

    <table-column :tabledata="listtrace" :columns="cols" />

    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getResponseList"
    />
  </div>
</template>

<script>
import { getEquipment } from '@/api/Equipments'
import { getList, getListCsv, downloadExcel } from '@/api/TraceReport'
import Pagination from '@/components/Pagination'
import TableColumn from '@/components/TableColumn'
import EquipmentSelect from '@/components/DropDownList/EquipmentSelect'
import { isNullOrEmpty, formatDate, changeBetweenDate } from '@/utils/validate'
import moment from 'moment'

export default {
  //, SelectDateLimit
  components: { Pagination, TableColumn, EquipmentSelect },
  filters: {
    statusFilter(status) {
      const statusMap = {
        Run: 'warning',
        Down: 'danger',
        Idle: 'success'
      }
      return statusMap[status]
    },
    formatDateFilter(value) {
      return formatDate(value)
    }
  },
  data() {
    return {
      equipment: {},
      cols: [],
      listtrace: [],
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      SelectEquipmentID: '',
      Select_DateLimit: formatDate(Date.now()),
      order_prop: 'TriggerTime',
      desc_prop: 1,
      SelectedDate: null,
      SelectedTime: null,
      rangeTime: null
    }
  },
  created() {
    clearInterval(this.timer)
    this.timer = null
    this.setTimer()
    this.listLoading = true
    this.setDefaultDateTime()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    setTimer() {
      this.timer = setInterval(() => {
        if (!isNullOrEmpty(this.SelectEquipmentID)) {
          // loadingUI()
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
      this.GET_EquipmentsList(this.SelectEquipmentID).then(response => {
        this.equipment = response
        this.getResponseList()
      })
    },

    getResponseList() {
      var params = {
        orderby_: this.order_prop,
        desc_: this.desc_prop,
        offset_: this.listQuery.page,
        fetch_: this.listQuery.limit,
        GroupName: 'Actual',
        EquipmentID: this.SelectEquipmentID,
        SelectedDate: moment(this.SelectedDate).format('YYYY/MM/DD'),
        SelectedStartTime: moment(this.SelectedTime[0]).format('YYYY/MM/DD HH:mm'),
        SelectedEndTime: moment(this.SelectedTime[1]).format('YYYY/MM/DD HH:mm')
      }

      getList(params).then(async response => {
        this.listtrace = []
        this.cols = [
          {
            ID: -1,
            EquipmentID: '',
            FieldID: 'TriggerTime',
            FieldName: '',
            FieldType: 'DateTime',
            FunctionID: '',
            GroupName: '',
            IsChart: true,
            IsDisplay: true,
            IsDraw: true,
            IsEdit: true,
            IsEnabled: true,
            IsLimit: true,
            NodeName: 'TriggerTime',
            Precision: 2,
            SortID: 0
          }
        ]

        await new Promise((resolve, reject) => {
          var rawdatas = response.data.Payload.map(x => {
            var rawdata = {
              ID: x.ID,
              TriggerTime: x.TriggerTime,
              Items: x.TraceItems
            }

            if (x.TraceItems !== undefined && x.TraceItems != null) {
              // console.log('x.TraceItems', x.TraceItems)

              x.TraceItems.map(item => {
                // console.log('x.TraceItems', item)

                if (this.equipment.Fields !== undefined) {
                  const ff = this.equipment.Fields.find(f => f.FieldID === item.FieldID)

                  var fff = Object.assign({}, ff)
                  // console.log('x.TraceItems fff', fff)
                  if (fff != null) {
                    if (fff.IsDisplay === true) {
                      if (!this.cols.some(c => c.FieldName === fff.FieldName)) {
                        // console.log('x.TraceItems fff', fff)
                        this.cols.push(fff)
                      }
                    }
                    item.FID = fff.ID
                    item.Field = fff
                  }
                }
              })
            }

            return rawdata
          })

          resolve(rawdatas)
          console.log('rawdatas', rawdatas)
        }).then(rawdatas => {
          this.listtrace = rawdatas
          // console.log(' listtrace  ', this.listtrace)
          this.total = response.data.Pagination.Total
          this.listLoading = false
        }).finally(() => {
          //  closeLoading()F
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
    },

    DownloadCsvReport(dialog, row) {
      console.log('DownloadCsvReport', this.listtrace, this.cols)

      var params = {
        orderby_: this.order_prop,
        desc_: this.desc_prop,
        GroupName: 'Actual',
        EquipmentID: this.SelectEquipmentID,
        SelectedDate: moment(this.SelectedDate).format('YYYY/MM/DD'),
        SelectedStartTime: moment(this.SelectedTime[0]).format('YYYY/MM/DD HH:mm'),
        SelectedEndTime: moment(this.SelectedTime[1]).format('YYYY/MM/DD HH:mm')
      }

      getListCsv(params).then(response => {
        console.log(response)
        const url = window.URL.createObjectURL(new Blob([response.data.Payload.csv]))
        const link = document.createElement('a')
        link.href = url
        console.log('response.data.Payload.fileName', response.data.Payload.fileName)
        link.setAttribute('download', response.data.Payload.fileName + '.csv')
        document.body.appendChild(link)
        link.click()
      })
    },

    /**
     * 下載Excel
     * @param {*} dialog
     * @param {*} row
     */
    DownloadExcel() {
      var params = {
        orderby_: this.order_prop,
        desc_: this.desc_prop,
        GroupName: 'Actual',
        EquipmentID: this.SelectEquipmentID,
        SelectedDate: moment(this.SelectedDate).format('YYYY/MM/DD'),
        SelectedStartTime: moment(this.SelectedTime[0]).format('YYYY/MM/DD HH:mm'),
        SelectedEndTime: moment(this.SelectedTime[1]).format('YYYY/MM/DD HH:mm')
      }

      downloadExcel(params).then(response => {
        console.log('response', response)

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = `${this.SelectEquipmentID}_${moment(this.SelectedDate).format('YYYY-MM-DD')}.xlsx`
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
      })
    },

    createCsvFile(csvdata) {
      this.rangeTime =
        moment(this.SelectedTime[0]).format('YYYY/MM/DD HH:mm') +
        '~' +
        moment(this.SelectedTime[1]).format('YYYY/MM/DD HH:mm')

      console.log(' createCsvFile  ', csvdata)
      var fileName = this.rangeTime + '.zip' // 匯出的檔名
      var link = window.document.createElement('a')
      link.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csvdata))
      link.setAttribute('download', fileName)
      link.click()
    },

    /**
     * 設定預設日期時間
     */
    setDefaultDateTime() {
      const vm = this
      vm.SelectedDate = new Date()
      vm.SelectedTime = []

      vm.SelectedTime.push(moment(new Date()).add(-2, 'hours'))
      vm.SelectedTime.push(new Date())
    }
  }
}
</script>
