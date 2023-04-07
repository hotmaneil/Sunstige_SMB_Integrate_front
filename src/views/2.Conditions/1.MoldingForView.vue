<template>
  <div class="app-container">
    <select-equipment
      :equipmentid.sync="SelectEquipmentID"
      :selectallflage="false"
      @OnSelectEquipmentChange="OnChangeEquipmentID"
    />
    <div style="clear: both;">
      <span style="padding: 3px 0"> 設定 成型條件 </span>

      <!--v-loading="listLoading"-->
      <panel-group-field
        :groupdata="equipment.SetValueFields"
        @onHandleSetData="OnSetEdit"
      />

      <mold-add-dialog
        :model="groupItem"
        :is-visible="groupItemVisible"
        @onDialogVisible="OnMoldDialogVisible"
      />

      <setting-dialog-field
        :model="fieldItem"
        :is-visible="fieldItemVisible"
        @onDialogVisible="OnFieldDialogVisible"
      />
    </div>
  </div>
</template>

<script>
import { getList as getListEquipments } from '@/api/Equipments'
import { isNullOrEmpty, formatDate, getSortFunc } from '@/utils/validate'

// import Pagination from '@/components/Pagination'
import SelectEquipment from '@/components/SelectEquipment'

import PanelGroupField from '@/components/PanelGroupField'
import MoldAddDialog from '@/components/MoldAddDialog'

import SettingDialogField from '@/components/SettingDialogField'

// import { loadingUI, closeLoading } from '@/utils/loading' // loading遮罩

// import MoldingViewDialog from '@/components/MoldingViewDialog'  //MoldingViewDialog,

export default {
  components: {
    SelectEquipment,
    MoldAddDialog,
    PanelGroupField,
    SettingDialogField
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        Setting: 'danger',
        Down: 'danger',
        Resetting: 'success'
      }
      return statusMap[status]
    },
    formatDateFilter(value) {
      return formatDate(value)
    }
  },
  data() {
    return {
      // listLoading: true,
      equipment: {},
      SetValueFields: [],
      listtrace: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 50
      },

      SelectEquipmentID: '',

      order_prop: 'TriggerTime',
      desc_prop: 1,

      groupItemVisible: false,
      groupItem: [],
      fieldItemVisible: false,
      fieldItem: {}
    }
  },
  created() {
    if (!isNullOrEmpty(this.$route.params.EquipmentID)) {
      this.SelectEquipmentID = this.$route.params.EquipmentID
    }

    clearInterval(this.timer)
    this.timer = null
    this.setTimer()
  },
  mounted() {},
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
          this.getResponseList()

          clearInterval(this.timer)
          this.timer = null
        }
      }, 1000)
    },

    OnChangeEquipmentID() {
      console.log('OnChangeEquipmentID EquipmentID', this.SelectEquipmentID)
      this.getResponseList()
    },

    // getNowFieldsList() {
    //   if (!isNullOrEmpty(this.Select_EquipmentID)) {
    //     var index = this.equipments.list.findIndex(x => x.EquipmentID === this.Select_EquipmentID)
    //     this.equipment = this.equipments.list[index]

    //     var Fields = this.equipment.Fields.filter(x => { if (x.GroupName === 'SetValue') return true })
    //     // var Fields = this.equipment.Fields
    //     this.SetValueFields = []

    //     Fields.map(x => {
    //       // if (x.IsLimit) { // console.log('SetValueFields', x) }
    //       this.SetValueFields.push(Object.assign({}, x))
    //     })

    //     var sortfunc = getSortFunc('SortID', 1, 'SortID')
    //     this.SetValueFields.sort(sortfunc)

    //     this.listLoading = false
    //   }
    // },

    async getResponseList() {
      this.equipment.ActualFields = []

      await this.GET_EquipmentsList(this.SelectEquipmentID).then(response => {
        response.map(eq => {
          // 確保只有一個設備被取出
          this.equipment = Object.assign({}, eq)
          this.equipment.SetValueFields = []
          this.equipment.ActualFields = []
          this.GetSetValueFields()
        })
      })
    },

    async GetSetValueFields() {
      var sortfunc = getSortFunc('SortID', 1, 'SortID')

      // 改用 await 等待 Promise 內的工作全部完成
      const results = await Promise.all(
        this.equipment.Fields.map(async fd => {
          if (fd.GroupName === 'SetValue') {
            this.equipment.SetValueFields.push(Object.assign({}, fd))
          } else if (fd.GroupName === 'Actual') {
            this.equipment.ActualFields.push(Object.assign({}, fd))
          }
          return true
        })
      )
        .then(isOK => {
          if (isOK.reduce((a, b) => a && b)) {
            this.equipment.SetValueFields.sort(sortfunc)
            this.equipment.ActualFields.sort(sortfunc)
          }
        })
        .catch(response => {
          console.log('catch', response)
        })

      return results
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

    LimitFilter(row) {
      // console.log(row)
      if (row.IsLimit) {
        if (row.UpperLimit < row.newValue && row.LowerLimit > row.newValue) {
          return 'success'
        }
      }
      return 'danger'
    },

    rowStyle({ row, rowIndex }) {
      if (row.IsLimit) {
        if (row.UpperLimit < row.newValue && row.LowerLimit > row.newValue) {
          return 'color:green'
        }
      }
      return 'color:red'
    },

    changeTableSort(column) {
      if (column.order === 'ascending') {
        this.order_prop = column.prop
        this.desc_prop = 0
      } else if (column.order === 'descending') {
        this.order_prop = column.prop
        this.desc_prop = 1
      } else {
        this.order_prop = column.prop
        this.desc_prop = 0
      }
      // this.getResponseList()
    },

    OnSetEdit(dialog, row) {
      console.log('OnSetEdit', dialog, row)

      if (dialog === 'group') {
        this.groupItem = row
        this.groupItemVisible = true
      } else if (dialog === 'field') {
        this.fieldItem = row
        this.fieldItemVisible = true
      }
    },
    OnMoldDialogVisible(visible, row) {
      this.moldDItemVisible = visible
      console.log('OnMoldDialogVisible', visible, row)
      this.getResponseList()
    },
    OnFieldDialogVisible(visible, row) {
      this.fieldItemVisible = visible
      console.log('OnFieldDialogVisible', visible, row)
      this.getResponseList()
    }
  }
}
</script>
