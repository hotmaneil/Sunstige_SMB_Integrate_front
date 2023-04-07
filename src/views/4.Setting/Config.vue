<template>
  <div class="app-container">
    <h3>系統設定管理</h3>

    <el-form :model="configForm">

      <el-form-item label="紅燈警報">
        <el-switch
          v-model="configForm.RedAlert.isRedAlert"
          inline-prompt
          inactive-text="否"
          active-text="是"
        />
      </el-form-item>

      <hr>

      <el-form-item label="黃燈警報">
        <el-switch
          v-model="configForm.YellowAlert.isYellowAlert"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <el-form-item v-show="configForm.YellowAlert.isYellowAlert" label="黃燈時間">
        <el-input-number v-model="configForm.YellowAlert.yellowMinute" :min="1" :max="1440" />
        分鐘
      </el-form-item>

      <hr>

      <el-form-item label="設備稼動率警報">
        <el-switch
          v-model="configForm.UtilizationAlert.isUtilizationAlert"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>

      <el-form-item v-show="configForm.UtilizationAlert.isUtilizationAlert" label="設備稼動率">
        <el-input-number v-model="configForm.UtilizationAlert.equipmentUtilization" :min="1" :max="100" />
        %
      </el-form-item>

      <hr>

      <el-form-item label="警示重複發送間隔">
        <el-input-number v-model="configForm.AlertReSend.alertReSendIntervalMinute" :min="1" :max="1440" />
        分鐘
      </el-form-item>

      <hr>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新設定</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getConfigList, updateConfig } from '@/api/SMBConfig'
export default {
  data() {
    return {
      configForm: {
        RedAlert: {
          /** 是否啟用 紅燈警報*/
          isRedAlert: false
        },

        YellowAlert: {
          /** 是否啟用 黃燈警報*/
          isYellowAlert: false,

          /** 黃燈分鐘數 */
          yellowMinute: 10
        },

        UtilizationAlert: {
          /** 是否啟用 設備稼動率 */
          isUtilizationAlert: false,

          /** 設備稼動率 */
          equipmentUtilization: 80
        },

        AlertReSend: {
          /** 警示重複發送間隔分鐘 */
          alertReSendIntervalMinute: 30
        }
      }
    }
  },

  created() {
    this.getData()
  },

  methods: {
    /**
     * 取得設定列表
     */
    getData() {
      getConfigList()
        .then(response => {
          // console.log('response', response.data.Payload)
          const dataList = response.data.Payload
          var isRedAlert = this.pasrseJsonValue(dataList, 'RedAlert', 'isRedAlert')
          this.configForm.RedAlert.isRedAlert = isRedAlert

          var isYellowAlert = this.pasrseJsonValue(dataList, 'YellowAlert', 'isYellowAlert')
          this.configForm.YellowAlert.isYellowAlert = isYellowAlert

          var yellowMinute = this.pasrseJsonValue(dataList, 'YellowAlert', 'yellowMinute')
          this.configForm.YellowAlert.yellowMinute = yellowMinute

          var isUtilizationAlert = this.pasrseJsonValue(dataList, 'UtilizationAlert', 'isUtilizationAlert')
          this.configForm.UtilizationAlert.isUtilizationAlert = isUtilizationAlert

          var equipmentUtilization = this.pasrseJsonValue(dataList, 'UtilizationAlert', 'equipmentUtilization')
          this.configForm.UtilizationAlert.equipmentUtilization = equipmentUtilization

          var alertReSendIntervalMinute = this.pasrseJsonValue(dataList, 'AlertReSend', 'alertReSendIntervalMinute')
          this.configForm.AlertReSend.alertReSendIntervalMinute = alertReSendIntervalMinute
        })
    },

    /**
     * 解析JSON字串並抓取值
     * @param {*} dataSource
     * @param {*} name
     * @param {*} property
     */
    pasrseJsonValue(dataSource, name, property) {
      var data = dataSource.filter(element => element.name === name)
      var dataValue = data[0].value
      var parseValue = JSON.parse(dataValue)
      var result = parseValue[property]
      return result
    },

    /**
     * 送交更新
     * */
    onSubmit() {
      var payload = []

      // 紅燈警報
      const redPayload = {
        name: 'RedAlert',
        value: JSON.stringify(this.configForm.RedAlert),
        remark: ''
      }
      payload.push(redPayload)

      // 黃燈警報
      const yellowPayload = {
        name: 'YellowAlert',
        value: JSON.stringify(this.configForm.YellowAlert),
        remark: ''
      }
      payload.push(yellowPayload)

      // 設備稼動率警報
      const utilizationAlertPayload = {
        name: 'UtilizationAlert',
        value: JSON.stringify(this.configForm.UtilizationAlert),
        remark: ''
      }
      payload.push(utilizationAlertPayload)

      const alertReSendIntervalMinutePayload = {
        name: 'AlertReSend',
        value: JSON.stringify(this.configForm.AlertReSend),
        remark: ''
      }
      payload.push(alertReSendIntervalMinutePayload)

      updateConfig(payload)
        .then(response => {
          console.log('response', response)
          if (response.data.StatusCode === 200) {
            this.$message({
              type: 'success',
              message: '更新設定成功'
            }).catch(err => {
              console.log(err)
            })
          }
        })
    }
  }
}
</script>
