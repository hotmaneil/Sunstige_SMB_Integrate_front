<template>
  <el-dialog
    title=" "
    :visible.sync="dialog"
    width="100%"
    height="30px"
    @close="cancelEdit(formModel)"
  >
    <div slot="title" class="header-title">
      <span style="padding: 3px 0"> {{ formModel.EquipmentID }} </span>
      <span style="padding: 3px 0"> 成型條件 設定值檢視 </span>
      <span style="padding: 3px 0"> {{ formModel.ReportID }} </span>

      <el-button
        type="primary"
        @click="confirmEdit(formModel)"
      >保存到常用設定</el-button>
    </div>

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
    <div slot="footer" class="dialog-footer" />
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { isNullOrEmpty, formatDate } from '@/utils/validate'

import { addItem } from '@/api/MoldingBackup'
import { getList } from '@/api/TraceReport'
export default {
  components: {},
  filters: {
    FloatFilter(field1) {
      var vv = parseFloat(field1.Value)
      if (!isNaN(vv)) {
        // console.log(field1, vv, field1.Precision, vv.toFixed(field1.Precision))
        return vv.toFixed(field1.Precision)
      }

      return field1.Value
    },
    formatDateFilter(value) {
      return formatDate(value, 'MM-dd HH:mm:ss')
    }
  },
  props: {
    model: {
      type: Object,
      default: function() {
        return {}
      }
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formModel: {},
      dialog: false,
      groupdata: [],
      list: [],
      // listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      order_prop: 'TriggerTime',
      desc_prop: 1
    }
  },
  mutations: {
    // setDialogWidth() {
    //   const windowSize = document.body.clientWidth
    //   const defaultWidth = 450 // 預設寬度
    //   if (windowSize < defaultWidth) {
    //     this.dialogWidth = '100%'
    //   } else {
    //     this.dialogWidth = defaultWidth + 'px'
    //   }
    // }
  },
  computed: {
    ...mapGetters(['equipments'])
  },

  watch: {
    isVisible(newValue) {
      this.dialog = newValue

      if (newValue) {
        // console.log('watch model', this.model)
        // 1. 傳入 設定值 歷程記錄，內帶 TraceReportID
        // 2. 利用 ReportID: 6544 找出 Trace
        // 3. 撈出 所有 Trace Item ，取上下限 等 資料 存入 Mold 資料，並填入 模具編號等 資料
        // console.log('optionList', this.equipments.optionList)

        //  console.log('watch model', this.model.Row, this.model.Eq)

        this.formModel.EquipmentID = this.model.Eq.EquipmentID
        this.formModel.ReportID = this.model.Row.ReportID

        if (!isNullOrEmpty(this.model.Row.ReportID)) {
          var strAry = this.model.Row.ReportID.split('.')
          var params = {
            tablename_: strAry[0],
            ID: strAry[1],
            EquipmentID: this.model.Eq.EquipmentID
          }
          getList(params).then(async response => {
            this.total = response.data.Pagination.Total
            this.groupdata = []
            // console.log('TraceItems ', response.data.items[0].TraceItems[0])
            this.model.Eq.Fields.map(fd => {
              if (fd.GroupName === 'SetValue') {
                var nfd = Object.assign({}, fd)

                const titem = response.data.Payload[0].Fields.find(
                  x => x.FieldID === nfd.FieldID
                )

                nfd.Average = titem.Average
                nfd.BadSdMultiple = titem.BadSdMultiple
                nfd.IsLimit = titem.IsLimit
                nfd.LowerLimit = titem.LowerLimit
                nfd.SeriouslyBadSdMultiple = titem.SeriouslyBadSdMultiple
                nfd.StandardDifference = titem.StandardDifference
                nfd.TraceReportID = titem.TraceReportID
                nfd.UpperLimit = titem.UpperLimit
                nfd.Value = titem.Value

                this.groupdata.push(nfd)
              } else if (fd.GroupName === 'Actual') {
                // this.equipment.ActualFields.push(Object.assign({}, fd))
              }
            })

            await new Promise((resolve, reject) => {
              // console.log('groupdata', this.groupdata)

              if (this.groupdata.length === 0) {
                return []
              }

              // var _array = this.groupdata.filter(x => {
              //   if (x.IsDisplay === true) return true
              // })
              // 分類 欄位

              this.list = []

              this.groupdata.map(x => {
                if (
                  !this.list.some(cate => cate.SubCategory === x.SubCategory)
                ) {
                  this.list.push({ SubCategory: x.SubCategory, items: [] })
                }

                var Category = this.list.find(
                  s => s.SubCategory === x.SubCategory
                )

                x.styletype = 'info'

                if (x.IsLimit) {
                  if (x.GroupName === 'SetValue') {
                    if (x.UpperLimit >= x.Value && x.Value >= x.LowerLimit) {
                      x.styletype = 'success'
                    }
                    // console.log(
                    //   x.FieldName,
                    //   x.SubCategory,
                    //   `${x.UpperLimit} >= ${x.Value} >= ${x.LowerLimit}`,
                    //   x.styletype
                    // )
                  } else if (x.GroupName === 'Actual') {
                    if (
                      x.Average + x.StandardDifference * 2 >= x.Value &&
                      x.Value >= x.Average - x.StandardDifference * 2
                    ) {
                      x.styletype = 'success'
                    }
                    // console.log(x.FieldName, x.SubCategory, `${x.UpperLimit} >= ${x.Value} >= ${x.LowerLimit}  ${x.Average} ${x.StandardDifference}`, x.styletype)
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
              resolve(response.data.items)
            }).then(rawdatas => {
              this.listtrace = rawdatas
              this.total = response.data.total
            })
          })
        }
      }
    }
  },

  methods: {
    IsLimitFilter(row) {
      if (row.IsLimit) {
        return 'primary'
      }
      return 'info'
    },

    GetGroupdataChange() {
      return []
    },

    OnSetEdit(dialog, row) {
      console.log('OnSetEdit', dialog, row)
    },

    cancelEdit(row) {
      this.dialog = false
      this.$emit('onDialogVisible', false, null)
    },

    async confirmEdit(row) {
      console.log('confirmEdit', row)
      row.IsEnabled = this.IsEnabled

      await addItem(row)
        .then(response => {
          this.$message({
            message: 'The data has been update',
            type: 'success'
          })
          this.dialog = false
          this.$emit('onDialogVisible', false, row)
        })
        .catch(error => {
          console.error(error)
        })
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
