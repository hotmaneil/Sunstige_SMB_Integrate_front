<template>
  <div class="app-container">
    <EquipmentTimeSelect
      :equipmentid.sync="SelectEquipmentID"
      :category="category"
      :is-default-select="false"
      :start-time.sync="SelectTime.StartTime"
      :end-time.sync="SelectTime.EndTime"
      :active-name="activeName"
      @OnQuery="OnChangeEquipmentID"
    />

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="實際值" name="ActualValue">
        <div v-if="isActualValue" style="clear: both">
          <span style="padding: 3px 0"><!-- 實際值 --></span>
          <!--v-loading="listLoading"-->
          <panel-group-field-actual
            :equipmentid="SelectEquipmentID"
            @onHandleSetData="OnSetEdit"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="設定值" name="SetValue">
        <div v-if="isSetValue" style="clear: both">
          <span style="padding: 3px 0"><!-- 設定值 --></span>
          <!--v-loading="listLoading"-->
          <panel-group-field-set-value
            :equipmentid="SelectEquipmentID"
            @onHandleSetData="OnSetEdit"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="狀態歷程" name="StatusLog">
        <device-status-tab-pane
          v-if="isStatusLog"
          ref="statusTab"
          :equipmentid="SelectEquipmentID"
          :start-time="SelectTime.StartTime"
          :end-time="SelectTime.EndTime"
        />
      </el-tab-pane>

      <el-tab-pane label="設定值歷程記錄" name="SetValueLog">
        <device-set-val-log-tab-pane
          v-if="isSetValueLog"
          ref="settingHistoryTab"
          :equipmentid="SelectEquipmentID"
          :start-time="SelectTime.StartTime"
          :end-time="SelectTime.EndTime"
        />
      </el-tab-pane>

      <el-tab-pane label="錯誤發生歷程" name="ErrorLog">
        <device-alarm-tab-pane
          v-if="isErrorLog"
          ref="alarmTab"
          :equipmentid="SelectEquipmentID"
          :start-time="SelectTime.StartTime"
          :end-time="SelectTime.EndTime"
        />
      </el-tab-pane>
    </el-tabs>

    <group-edit-dialog
      :model="groupItem"
      :is-visible="groupItemVisible"
      @onDialogVisible="OnGroupDialogVisible"
    />

    <setting-dialog-field
      :model="fieldItem"
      :is-visible="fieldItemVisible"
      @onDialogVisible="OnFieldDialogVisible"
    />
  </div>
</template>

<script>
import { isNullOrEmpty } from '@/utils/validate'
import EquipmentSelect from '@/components/DropDownList/EquipmentSelect'
import EquipmentTimeSelect from '@/components/DropDownList/EquipmentTimeSelect'
import GroupEditDialog from '@/components/GroupEditDialog'
import SettingDialogField from '@/components/SettingDialogField'

import DeviceStatusTabPane from '@/components/DeviceStatusTabPane'
import DeviceSetValLogTabPane from '@/components/DeviceSetValLogTabPane'
import DeviceAlarmTabPane from '@/components/DeviceAlarmTabPane'
import PanelGroupFieldActual from '@/components/PanelGroupFieldActual.vue'
import PanelGroupFieldSetValue from '@/components/PanelGroupFieldSetValue.vue'

export default {
  components: {
    GroupEditDialog,
    SettingDialogField,
    DeviceStatusTabPane,
    DeviceSetValLogTabPane,
    DeviceAlarmTabPane,
    PanelGroupFieldSetValue,
    PanelGroupFieldActual,
    EquipmentSelect,
    EquipmentTimeSelect
  },

  data() {
    return {
      // listLoading: true,
      activeName: 'ActualValue',
      isActualValue: true,
      isSetValue: false,
      isStatusLog: false,
      isSetValueLog: false,
      isErrorLog: false,
      order_prop: 'TriggerTime',
      desc_prop: 1,
      // equipment: {},
      listtrace: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 50
      },

      SelectEquipmentID: '',

      groupItemVisible: false,
      groupItem: [],

      fieldItemVisible: false,
      fieldItem: {},
      historyList: [],

      /** 設備種類 */
      category: null,

      SelectTime: {
        StartTime: null,
        EndTime: null
      }
    }
  },
  created() {
    this.setCategory()

    if (!isNullOrEmpty(this.$route.params.EquipmentID)) {
      this.SelectEquipmentID = this.$route.params.EquipmentID
    }

    clearInterval(this.timer)
    this.timer = null
  },
  mounted() {},
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    OnChangeEquipmentID(source) {
      console.log('OnChangeEquipmentID source', source)

      const vm = this
      vm.SelectEquipmentID = source.EquipmentId
      vm.SelectTime.StartTime = source.StartTime
      vm.SelectTime.EndTime = source.EndTime

      setTimeout(() => {
        console.log('非同步事件延遲100毫秒')
        switch (this.activeName) {
          case 'StatusLog':
            this.$refs.statusTab.getResponseList()
            break

          case 'SetValueLog':
            this.$refs.settingHistoryTab.getResponseList()
            break

          case 'ErrorLog':
            this.$refs.alarmTab.getResponseList()
            break
        }
      }, 100)
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
    OnGroupDialogVisible(visible, row) {
      this.groupItemVisible = visible
      console.log('OnGroupDialogVisible', visible, row)
    },
    OnFieldDialogVisible(visible, row) {
      this.fieldItemVisible = visible
      console.log('OnFieldDialogVisible', visible, row)
    },

    handleClick(tab) {
      // // console.log('tab', tab)
      this.isActualValue = false
      this.isSetValue = false
      this.isStatusLog = false
      this.isSetValueLog = false
      this.isErrorLog = false
      switch (tab.index) {
        case '0':
          this.activeName = 'ActualValue'
          this.isActualValue = true
          break
        case '1':
          this.activeName = 'SetValue'
          this.isSetValue = true
          break
        case '2':
          this.activeName = 'StatusLog'
          this.isStatusLog = true
          break
        case '3':
          this.activeName = 'SetValueLog'
          this.isSetValueLog = true
          break
        case '4':
          this.activeName = 'ErrorLog'
          this.isErrorLog = true
          break
      }
    },

    /**
     * 設置設備種類
     */
    setCategory() {
      var routePath = this.$route.path
      const index = routePath.indexOf('/', 1)
      const catchString = routePath.substring(index + 1, routePath.length)
      console.log('catchString', catchString)
      this.category = catchString
    }
  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
</style>
