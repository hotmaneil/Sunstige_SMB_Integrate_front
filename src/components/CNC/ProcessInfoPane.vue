<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>訊息</span>
          </div>

          <div class="text item">
            觸發時間
            <span class="dataItem"> {{ processData.triggertime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
          </div>

          <div class="text item">
            目前警報
            <span class="dataItem"> {{ processData.alarmcode }}</span>
          </div>

          <div class="text item">
            目前狀態
            <span class="dataItem"> {{ processData.statuscode }}</span>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>元件資料</span>
          </div>
          <div class="text item">
            加工零件總數
            <span class="dataItem"> {{ processData.totalqty }}</span>
          </div>
          <div class="text item">
            加工零件數
            <span class="dataItem"> {{ processData.countqty }}</span>
          </div>
          <div class="text item">
            所需零件數
            <span class="dataItem"> {{ processData.requiredqty }}</span>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>機台時間</span>
          </div>
          <div class="text item">
            通電時間
            <span class="dataItem"> {{ processData.powerontime }}</span>
          </div>
          <div class="text item">
            切削時間
            <span class="dataItem"> {{ processData.cuttingtime }}</span>
          </div>
          <div class="text item">
            運轉時間
            <span class="dataItem"> {{ processData.runningtime }}</span>
          </div>
          <div class="text item">
            循環時間
            <span class="dataItem"> {{ processData.cycletime }}</span>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>執行程式</span>
          </div>
          <div class="text item">
            目前執行單節
            <span class="dataItem"> {{ processData.executionblock }}</span>
          </div>
          <div class="text item">
            主程式號碼
            <span class="dataItem"> {{ processData.mainprogram }}</span>
          </div>
          <div class="text item">
            執行中程式號碼
            <span class="dataItem"> {{ processData.executionprogram }}</span>
          </div>
          <div class="text item">
            目前執行序列號
            <span class="dataItem"> {{ processData.executionsequence }}</span>
          </div>
          <div class="text item">
            巨集指令
            <span class="dataItem"> {{ processData.marcocmd }}</span>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>伺服</span>
          </div>
          <div class="text item">
            伺服軸負載
            <span class="dataItem">
              <div v-for="data in servoload" :key="data.item">{{ data.item }}:{{ data.value }}</div>
            </span>
          </div>
          <div class="text item">
            伺服軸實際電流
            <span class="dataItem"> {{ processData.servocurrent }}</span>
          </div>
          <div class="text item">
            伺服軸名稱
            <span class="dataItem"> {{ processData.servonames }}</span>
          </div>
          <div class="text item">
            控制器狀態列
            <span class="dataItem"> {{ processData.systemmessage }}</span>
          </div>
          <div class="text item">
            最大控制軸數
            <span class="dataItem"> {{ processData.axescountmax }}</span>
          </div>
          <div class="text item">
            目前軸數
            <span class="dataItem"> {{ processData.axescountnow }}</span>
          </div>
          <div class="text item">
            所有軸名稱
            <span class="dataItem"> {{ processData.axesnames }}</span>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>主軸</span>
          </div>
          <div class="text item">
            主軸實際電流
            <span class="dataItem"> {{ processData.servocurrent }}</span>
          </div>
          <div class="text item">
            主軸負載
            <span class="dataItem"> {{ processData.spindleload }}</span>
          </div>
          <div class="text item">
            主軸實際轉速
            <span class="dataItem"> {{ processData.realspindlespeed }}</span>
            RPM
          </div>
          <div class="text item">
            主軸命令轉速
            <span class="dataItem"> {{ processData.cmdspindlespeed }}</span>
            RPM
          </div>
          <div class="text item">
            主軸轉速百分比
            <el-progress :percentage="processData.overridespindlespeed" color="#409eff" />
          </div>

          <div class="text item">
            實際進給率
            <span class="dataItem"> {{ processData.realfeedrate }}</span>
            mm/min
          </div>

          <div class="text item">
            命令進給率
            <span class="dataItem"> {{ processData.cmdfeedrate }}</span>
            mm/min
          </div>

          <div class="text item">
            進給率百分比
            <el-progress :percentage="processData.overridefeedrate" color="#409eff" />
          </div>
          <div class="text item">
            進給率單位
            <span class="dataItem"> {{ processData.feedrateunit }}</span>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>加工</span>
          </div>
          <div class="text item">
            刀槽號碼
            <span class="dataItem"> {{ processData.toolno }}</span>
          </div>
          <div class="text item">
            Modal Code
            <span class="dataItem"> {{ processData.modalcode }}</span>
          </div>
          <div class="text item">
            自動模式選項
            <span class="dataItem"> {{ processData.machinemode }}</span>
          </div>

          <div class="text item">
            絕對座標
            <span class="dataItem">
              <div v-for="data in absolutepos" :key="data.item">{{ data.item }}:{{ data.value }}</div>
            </span>
          </div>

          <div class="text item">
            相對座標
            <span class="dataItem">
              <div v-for="data in relativepos" :key="data.item">{{ data.item }}:{{ data.value }}</div>
            </span>
          </div>

          <div class="text item">
            機械座標
            <span class="dataItem">
              <div v-for="data in machinepos" :key="data.item">{{ data.item }}:{{ data.value }}</div>
            </span>
          </div>

          <div class="text item">
            剩餘距離
            <span class="dataItem">
              <div v-for="data in distancelen" :key="data.item">{{ data.item }}:{{ data.value }}</div>
            </span>
          </div>

          <div class="text item">
            座標單位
            <span class="dataItem"> {{ processData.axisunit }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getL2CNCLastData } from '@/api/CNC'

export default {
  props: {
    equipmentid: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      processData: {},

      /** 絕對座標   */
      absolutepos: [],

      /** 伺服軸負載  */
      servoload: [],

      /** 相對座標 */
      relativepos: [],

      /** 機械座標 */
      machinepos: [],

      /** 剩餘距離 */
      distancelen: []
    }
  },

  watch: {
    equipmentid(newValue) {
      console.log('equipmentid newValue', newValue)
      this.GetL2CNCLastData(newValue)
    }
  },

  created() {},

  methods: {
    GetL2CNCLastData(source) {
      const vm = this
      const payload = {
        device: source
      }

      getL2CNCLastData(payload)
        .then(response => {
          vm.processData = response.data.Payload

          console.log('vm.processData', vm.processData)

          if (vm.processData.absolutepos !== null) {
            if (vm.processData.absolutepos === '') {
              console.log('vm.processData.absolutepos')
            } else {
              vm.absolutepos = JSON.parse(vm.processData.absolutepos)
            }
          }

          if (vm.processData.servoload !== null) {
            if (vm.processData.servoload === '') {
              console.log('vm.processData.servoload空的')
            } else {
              vm.servoload = JSON.parse(vm.processData.servoload)
            }
          }

          if (vm.processData.relativepos !== null) {
            if (vm.processData.relativepos === '') {
              console.log('vm.processData.relativepos')
            } else {
              vm.relativepos = JSON.parse(vm.processData.relativepos)
            }
          }

          if (vm.processData.machinepos !== null) {
            if (vm.processData.machinepos === '') {
              console.log('vm.processData.machinepos')
            } else {
              vm.machinepos = JSON.parse(vm.processData.machinepos)
            }
          }
        })
        .catch(err => {
          console.log('err')
          console.log(err)
        })
    }
  }
}
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.header {
  background-color: #62696a;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 300px;
}

.dataItem {
  color: #409eff;
}
</style>
