<template>
  <div class="dashboard-editor-container">
    <!--v-loading="listLoading"-->
    <panel-group :groupdata="equipmentList" @onHandleSetData="setEdit" />

    <setting-dialog-equipment
      :model="equipmentItem"
      :is-visible="equipmentItemVisible"
      @onDialogVisible="OnEquipmentDialogVisible"
    />

    <setting-dialog-field
      :model="fieldItem"
      :is-visible="fieldItemVisible"
      @onDialogVisible="OnFieldDialogVisible"
    />
  </div>
</template>
<script>
import { getListOnlyEquipmentDashboard as getListEquipments } from '@/api/Equipments'

import { getSortFunc, sortStr } from '@/utils/validate'

import PanelGroup from '@/components/PanelGroupEquipment'
import SettingDialogEquipment from '@/components/SettingDialogEquipment'
import SettingDialogField from '@/components/SettingDialogField'

// import { loadingUI, closeLoading } from '@/utils/loading' // loading遮罩
export default {
  components: { PanelGroup, SettingDialogEquipment, SettingDialogField },
  data() {
    return {
      // listLoading: true,
      equipmentList: [],
      listQuery: {
        page: 1,
        limit: 50
      },
      equipmentItemVisible: false,
      equipmentItem: {},
      fieldItemVisible: false,
      fieldItem: {},
      order_prop: 'SortID'
    }
  },
  created() {
    clearInterval(this.timer)
    this.timer = null
    this.getResponseList()
    this.setTimer()
    // this.listLoading = true
    // loadingUI()
  },
  mounted() {
    // setTimeout(() => {
    //   closeLoading()
    // }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    setTimer() {
      this.timer = setInterval(() => {
        this.getResponseList()
      }, 10000)
    },
    async getResponseList() {
      // this.listLoading = false
      var sortfunc = getSortFunc(this.order_prop, 1, 'SortID')
      await this.GET_EquipmentsList().then(response => {
        this.equipmentList = []
        // console.log('GET_EquipmentsList', response)

        response.sort(sortfunc).map(eq => {
          var newEq = Object.assign({}, eq)
          newEq.SliceFields = []
          if (eq.Fields !== null) {
            eq.Fields
              .sort(sortStr)
              .slice(0, 5)
              .map(fd => {
                if (fd.IsDisplay === true) {
                  newEq.SliceFields.push(fd)
                }
              })
          }
          this.equipmentList.push(newEq)
        })
      })
    },
    GET_EquipmentsList() {
      return new Promise((resolve, reject) => {
        getListEquipments({ IsEnabled: 1, IsDisplay: 1 })
          .then(response => {
            resolve(response.data.items)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    setEdit(dialog, row) {
      if (dialog === 'equipment') {
        this.equipmentItem = row
        this.equipmentItemVisible = true
      } else if (dialog === 'field') {
        // this.fieldItem = row
        // this.fieldItemVisible = true
      }
    },

    OnEquipmentDialogVisible(visible, row) {
      this.equipmentItemVisible = visible
      this.getResponseList()
    },
    OnFieldDialogVisible(visible, row) {
      this.fieldItemVisible = visible
      this.getResponseList()
    }
  }
}
</script>
<style lang="scss" scoped>
.dashboard-editor-container {
  position: relative;
  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
