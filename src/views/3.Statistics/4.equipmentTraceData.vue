<template>
  <div class="app-container">
    <select-equipment
      :equipmentid.sync="SelectEquipmentID"
      :selectallflage="false"
      :isdaterange="true"
      @OnSelectEquipmentChange="OnChangeEquipmentID"
      @OnDateTimeRangeChange="OnDateTimeRangeChange"
    />

    <!--<pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="float: left"
      @pagination="getResponseList"
    />-->

    <table-column :tabledata="listtrace" :columns="cols" />

    <!-- <el-table
      v-loading="listLoading"
      :data="listtrace"
      element-loading-text="Loading"
      border
      fit
      stripe
      highlight-current-row
      :default-sort="{prop: 'TriggerTime', order: 'descending'}"
      @sort-change="changeTableSort"
    >
      <el-table-column align="center" prop="TriggerTime" label="TriggerTime" width="170" sortable>
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.TriggerTime | formatDateFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Fields" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.Fields }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100" align="right">
        <template slot-scope="scope">
          <el-button size="small" @click="handleClick(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table> -->
    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getResponseList"
    />
  </div>
</template>

<script>
import { getList as getListEquipments } from '@/api/Equipments'
import { getList } from '@/api/TraceReport'
import Pagination from '@/components/Pagination'
import TableColumn from '@/components/TableColumn'
import SelectEquipment from '@/components/SelectEquipment'
// import SelectDateLimit from '@/components/SelectDateLimit'
import { isNullOrEmpty, formatDate, changeBetweenDate } from '@/utils/validate'
// import { loadingUI, closeLoading } from '@/utils/loading' // loading遮罩

export default {
  //, SelectDateLimit
  components: { Pagination, TableColumn, SelectEquipment },
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
      // listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      SelectEquipmentID: '',
      Select_DateLimit: formatDate(Date.now()),
      order_prop: 'TriggerTime',
      desc_prop: 1,
      createTime: changeBetweenDate(
        formatDate(Date.now()),
        formatDate(Date.now())
      )
    }
  },
  created() {
    clearInterval(this.timer)
    this.timer = null
    this.setTimer()
    // this.listLoading = true
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
          // loadingUI()
          this.GET_EquipmentsList(this.SelectEquipmentID).then(response => {
            response.map(eq => {
              console.log(' Equipment ', eq)

              // 確保只有一個設備被取出
              this.equipment = Object.assign({}, eq)

              this.getResponseList()

              clearInterval(this.timer)
              this.timer = null
            })
          })
        }
      }, 1000)
    },

    OnChangeEquipmentID() {
      console.log('OnChangeEquipmentID EquipmentID', this.SelectEquipmentID)

      this.GET_EquipmentsList(this.SelectEquipmentID).then(response => {
        response.map(eq => {
          // 確保只有一個設備被取出
          this.equipment = Object.assign({}, eq)

          this.getResponseList()
        })
      })
    },
    getResponseList() {
      var params = {
        orderby_: this.order_prop, desc_: this.desc_prop,
        offset_: this.listQuery.page,
        fetch_: this.listQuery.limit,
        GroupName: 'Actual',
        EquipmentID: this.SelectEquipmentID,
        CreateTime: this.createTime
      }

      getList(params).then(async response => {
        this.listtrace = []
        this.cols = [
          {
            ID: 'TriggerTime',
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

        // console.log('response.data.items', response.data.items)

        await new Promise((resolve, reject) => {
          var rawdatas = response.data.items.map(x => {
            const fids = x.Fields.split(',')
            const rows = x.RowData.split(',')
            const sd = x.StandardDifference.split(',')
            const avg = x.Average.split(',')
            // // console.log('items', this.equipment.Fields, fids)// 拆出 欄位陣列
            var rawdata = { ID: x.ID, TriggerTime: x.TriggerTime, Items: [] }
            for (var i = 0; i < fids.length; i++) {
              this.setListTrace(i, fids, rows, sd, avg, rawdata)
            }

            return rawdata
          })
          resolve(rawdatas)
        }).then(rawdatas => {
          this.listtrace = rawdatas
          // // console.log(' this.cols', this.cols)// 拆出 欄位陣列
          // // console.log('this.listtrace', this.listtrace)

          this.total = response.data.total
          // this.listLoading = false
          //   closeLoading()
        })
      })
    },

    setListTrace(i, fids, rows, sd, avg, rawdata) {
      // // console.log('x', i, fids[i], rows[i])
      const ff = this.equipment.Fields.find(f => f.ID === parseInt(fids[i]))
      // // console.log('ff', ff)
      var fff = Object.assign({}, ff)

      if (fff != null) {
        if (!this.cols.some(c => c.FieldName === fff.FieldName)) {
          this.cols.push({
            ID: fids[i],
            EquipmentID: fff.EquipmentID,
            FieldID: fff.FieldID,
            FieldName: fff.FieldName,
            FieldType: fff.FieldType,
            FunctionID: fff.FunctionID,
            GroupName: fff.GroupName,
            IsChart: fff.IsChart,
            IsDisplay: fff.IsDisplay,
            IsDraw: fff.IsDraw,
            IsEdit: fff.IsEdit,
            IsEnabled: fff.IsEnabled,
            IsLimit: fff.IsLimit,
            NodeName: fff.NodeName,
            Precision: fff.Precision,
            SortID: fff.SortID,
            UpperLimit: fff.UpperLimit,
            LowerLimit: fff.LowerLimit
          })
        }

        rawdata.Items[fids[i]] = {
          Field: this.cols.find(x => x.ID === fids[i]),
          Value: this.TryParseDouble(rows[i]),
          StandardDifference: this.TryParseDouble(sd[i]),
          Average: this.TryParseDouble(avg[i])
        }
      }
    },

    GET_EquipmentsList(equipment_id) {
      return new Promise((resolve, reject) => {
        getListEquipments({
          EquipmentID: equipment_id,
          IsEnabled: 1,
          IsDisplay: 1
        })
          .then(response => {
            // 判斷是否 正確
            resolve(response.data.items)
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

    OnDateTimeRangeChange(val) {
      // 取得起迄日期
      if (val) {
        this.createTime = changeBetweenDate(
          formatDate(val[0]),
          formatDate(val[1])
        )
      } else {
        this.createTime = null
      }
      this.GET_EquipmentsList(this.SelectEquipmentID).then(response => {
        response.map(eq => {
          // 確保只有一個設備被取出
          this.equipment = Object.assign({}, eq)

          this.getResponseList()
        })
      })
    }
  }
}
</script>
