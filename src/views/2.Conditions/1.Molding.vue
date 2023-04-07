<template>
  <div class="app-container">
    <equipment-select
      :equipmentid.sync="SelectEquipmentID"
      @OnSelectEquipmentChange="OnChangeEquipmentID"
    />

    <span style="padding: 3px 3px"> 設備編號 : {{ equipment.EquipmentID }} </span>
    <span style="padding: 3px 3px"> 記錄編號 : {{ ReportID }} </span>
    <span style="padding: 3px 3px"> 紀錄時間 : {{ ReportTime }} </span>

    <el-button type="primary" @click="OnSetEdit('group', null)">保存到常用設定</el-button>
    <!--v-loading="listLoading"-->
    <div style="clear: both">
      <el-card
        v-for="(Groupdata, index) in list"
        :key="index"
        class="box-card"
        shadow="hover"
        :body-style="{ padding: '5px' }"
      >
        <div slot="header">
          <span>
            {{ Groupdata.SubCategory }}
          </span>
        </div>

        <div style="margin-left: -20px">
          <ul>
            <li
              v-for="(field, index2) in Groupdata.items"
              :key="index2"
              style="margin: 1px; clear: both"
              @click="OnSetEdit('field', field)"
            >
              <el-tag
                size="mini"
                :disable-transitions="false"
                :type="IsLimitFilter(field)"
                style="margin: 1px; float: left"
              >
                <i v-if="field.GroupName == 'SetValue'" class="el-icon-edit" />
                <i v-if="field.GroupName == 'Actual'" class="el-icon-info" />
                {{ field.FieldName }}
              </el-tag>

              <el-tag
                size="mini"
                :disable-transitions="false"
                :type="field.styletype"
                style="margin: 1px; float: left"
              >{{ field | FloatFilter }}
              </el-tag>
            </li>
          </ul>
        </div>
      </el-card>
    </div>
    <mold-add-dialog :model="groupItem" :is-visible="groupItemVisible" @onDialogVisible="OnGroupItemVisible" />

    <setting-dialog-field :model="fieldItem" :is-visible="fieldItemVisible" @onDialogVisible="OnFieldDialogVisible" />
  </div>
</template>

<script>
import { getEquipment } from '@/api/Equipments'

import { getList } from '@/api/TraceReport'
import { isNullOrEmpty, formatDate } from '@/utils/validate'

// import Pagination from '@/components/Pagination'
import EquipmentSelect from '@/components/DropDownList/EquipmentSelect'
import MoldAddDialog from '@/components/MoldAddDialog'

import SettingDialogField from '@/components/SettingDialogField'

// import { loadingUI, closeLoading } from '@/utils/loading' // loading遮罩

// import MoldingViewDialog from '@/components/MoldingViewDialog'  //MoldingViewDialog,

export default {
  components: {
    MoldAddDialog,
    SettingDialogField,
    EquipmentSelect
  },
  filters: {
    FloatFilter(field1) {
      var vv = parseFloat(field1.Value)
      if (!isNaN(vv)) {
        // console.log(field1, vv, field1.Precision, vv.toFixed(field1.Precision))
        return vv.toFixed(field1.Precision)
      }

      return field1.Value
    },
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
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 50
      },

      SelectEquipmentID: '',
      ReportID: '',
      ReportTime: '',
      order_prop: 'TriggerTime',
      desc_prop: 1,

      groupItemVisible: false,
      groupItem: {},
      fieldItemVisible: false,
      fieldItem: {}
    }
  },
  created() {
    if (!isNullOrEmpty(this.$route.params.EquipmentID)) {
      this.SelectEquipmentID = this.$route.params.EquipmentID
    }

    if (!isNullOrEmpty(this.$route.params.ReportID)) {
      this.ReportID = this.$route.params.ReportID
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
    IsLimitFilter(row) {
      if (row.IsLimit) {
        return 'primary'
      }
      return 'info'
    },
    OnChangeEquipmentID(source) {
      this.SelectEquipmentID = source
      console.log('OnChangeEquipmentID EquipmentID', this.SelectEquipmentID)
      this.getResponseList()
    },

    async getResponseList() {
      this.equipment.ActualFields = []
      await this.GET_EquipmentsList(this.SelectEquipmentID).then(response => {
        this.equipment = response
        this.equipment.SetValueFields = []
        this.equipment.ActualFields = []
        this.GetSetValueFields()
      })
    },

    /**
     * 取得TraceReport列表資料
     */
    async GetSetValueFields() {
      const params = {
        EquipmentID: this.equipment.EquipmentID,
        SelectedDate: new Date()
      }
      getList(params).then(async response => {
        this.total = response.data.Pagination.Total
        this.groupdata = []

        if (response.data.Payload[0] !== undefined) {
          this.ReportTime = formatDate(response.data.Payload[0].TriggerTime, 'yyyy-MM-dd HH:mm:ss')
        }

        console.log('this.equipment.Fields', this.equipment.Fields)
        this.equipment.Fields.map(fd => {
          if (fd.GroupName === 'SetValue') {
            var nfd = Object.assign({}, fd)
            if (response.data.Payload[0] !== undefined) {
              var titem = response.data.Payload[0].TraceItems.find(x => x.FieldID === nfd.FieldID)
              nfd.Average = titem.Average
              nfd.BadSdMultiple = titem.BadSdMultiple
              nfd.IsLimit = titem.IsLimit
              nfd.LowerLimit = titem.LowerLimit
              nfd.SeriouslyBadSdMultiple = titem.SeriouslyBadSdMultiple
              nfd.StandardDifference = titem.StandardDifference
              nfd.TraceReportID = titem.TraceReportID
              nfd.UpperLimit = titem.UpperLimit
              nfd.Value = titem.Value

              console.log('TraceItems', nfd, titem)
            }

            if (fd.IsDisplay === true) {
              this.groupdata.push(nfd)
            }
          } else if (fd.GroupName === 'Actual') {
            // this.equipment.ActualFields.push(Object.assign({}, fd))
          }
        })

        await new Promise((resolve, reject) => {
          console.log('groupdata', this.groupdata)

          if (this.groupdata.length === 0) {
            return []
          }

          // 分類 欄位
          this.list = []
          this.groupdata.map(x => {
            if (!this.list.some(cate => cate.SubCategory === x.SubCategory)) {
              this.list.push({ SubCategory: x.SubCategory, items: [] })
            }

            var Category = this.list.find(s => s.SubCategory === x.SubCategory)
            x.styletype = 'info'

            // 若有上下限警示設定
            if (x.IsLimit) {
              switch (x.GroupName) {
                case 'SetValue':
                  if (parseFloat(x.UpperLimit) >= parseFloat(x.Value) && parseFloat(x.Value) >= parseFloat(x.LowerLimit)) {
                    x.styletype = 'success'
                  } else {
                    x.styletype = 'danger'
                  }
                  break

                case 'Actual':
                  if (x.Average + x.StandardDifference * 2 >= x.Value && x.Value >= x.Average - x.StandardDifference * 2) {
                    x.styletype = 'success'
                  } else {
                    x.styletype = 'danger'
                  }
                  break
              }
            }

            Category.items.push(x)
          })

          this.list.map(x => {
            x.items.sort(function(a, b) {
              var nameA = a.SortID // ignore upper and lowercase
              var nameB = b.SortID // ignore upper and lowercase
              if (nameA < nameB) {
                return -1
              }
              if (nameA > nameB) {
                return 1
              }
              return 0
            })
          })

          this.list.sort(function(a, b) {
            var nameA = a.SubCategory.toUpperCase() // ignore upper and lowercase
            var nameB = b.SubCategory.toUpperCase() // ignore upper and lowercase
            if (nameA < nameB) {
              return -1
            }
            if (nameA > nameB) {
              return 1
            }

            return 0
          })
          resolve(response.data.Payload)
        })
      })
    },

    GET_EquipmentsList(equipment_id) {
      return new Promise((resolve, reject) => {
        const payload = {
          EquipmentID: equipment_id,
          IsEnabled: 1,
          IsDisplay: 1
        }

        getEquipment(payload)
          .then(response => {
            // 判斷是否 正確
            resolve(response.data.Payload)
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
        this.groupItem = {}
        this.groupItem.EquipmentID = this.SelectEquipmentID
        this.groupItem.ReportID = this.ReportID
        this.groupItem.ReportTime = this.ReportTime
        // 還需要當下 最新的 TraceReportID
        this.groupItemVisible = true
      } else if (dialog === 'field') {
        this.fieldItem = row
        this.fieldItemVisible = true
      }
    },
    OnGroupItemVisible(visible, row) {
      this.groupItemVisible = visible
      console.log('groupItemVisible', visible, row)
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
<style lang="scss" scoped>
.el-card > .el-card__body {
  padding: 6px;
}
.el-card > .el-card__header {
  padding: 8px 8px;
  border-bottom: 1px solid #ebeef5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 16px;
  background-color: lightgrey;
}

.text {
  font-size: 14px;
}

.item {
  margin-top: 5px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  content: ' '; /* Older browser do not support empty content */
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}

.box-card {
  position: absolute;
  width: 300px;
  cursor: pointer;
  font-size: 16px;
  position: relative;
  overflow: hidden;
  color: rgb(3, 3, 3);
  background: rgb(255, 255, 255);
  margin: 6px;
  border: 2px #ccc solid;
  border-radius: 10px;
  float: left;
}

.bottom {
  position: absolute;
  bottom: 5px;
  right: 10px;
  line-height: 15px;
  float: right;
}

.button {
  padding: 0;
  float: right;
}

ul {
  list-style-type: none;
}

</style>
