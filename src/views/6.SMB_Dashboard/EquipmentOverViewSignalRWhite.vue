<!-- 設備總覽 米白色主題-->
<template>
  <div style="padding:20px">
    <span>
      <el-row>
        <el-col :span="6">
          <h3>設備總覽 Machine Status Overview</h3>
        </el-col>
        <el-col :span="18">
          <category-select @OnSelectCategoryChange="setCategory" />
        </el-col>
      </el-row>
    </span>

    <div class="box-container">
      <div
        v-for="dataItem in equipmentOverViewList"
        :key="dataItem.UpArea.device_id"
        class="card"
        :style="{ backgroundColor: dataItem.UpArea.device_status_color }"
        @click="clickEvent(dataItem.UpArea.device_id,dataItem.UpArea.Category,dataItem.UpArea.ip)"
      >
        <div class="title">
          <p class="equipmentStyle">{{ dataItem.UpArea.device_name }}</p>
          <p class="tag">{{ dataItem.UpArea.value }}</p>
        </div>
        <!-- <div class="bar" /> -->
        <div id="content" class="contentCard">
          <div v-for="detailItem in dataItem.DownArea" :key="detailItem" style="padding: 5px 0px 0px 0px;" class="detailItem">{{ detailItem }}<br></div>
        </div>
      </div>
    </div>

    <roboshot-dialog
      :is-visible="roboshotDialogVisible"
      :device-id="clickedDeviceId"
      :ip="clickedIp"
      @onDialogVisible="setRoboshotDialog"
    />

    <cnc-plc-dialog
      :is-visible="cncplcDialogVisible"
      :device-id="clickedDeviceId"
      :ip="clickedIp"
      @onDialogVisible="setCNCPLCDialog"
    />
  </div>
</template>

<script>
window.jQuery = jQuery
require('signalr')

import { equipmentOverView } from '@/api/SMBStatistical'
import CategorySelect from '@/components/DropDownList/CategorySelect'
import RoboshotDialog from '@/components/EquipmentOverViewDialig/RoboshotDialog'
import CncPlcDialog from '@/components/EquipmentOverViewDialig/CNCPLCDialog'
import { Howl } from 'howler'

export default {
  components: {
    CategorySelect,
    RoboshotDialog,
    CncPlcDialog
  },
  data() {
    return {
      equipmentOverViewList: [],
      roboshotDialogVisible: false,
      cncplcDialogVisible: false,
      clickedDeviceId: null,
      clickedIp: null,

      // 選取的設備類型
      selectedCategory: null
    }
  },

  mounted() {
    this.getEquipmentOverViewList()
  },

  created() {
    this.getEquipmentInfoView()
    this.testConnect()
  },

  methods: {
    /**
     * 設備種類設值
     */
    setCategory(source) {
      console.log('setCategory source', source)
      this.$store.dispatch('category/setCategory', source)

      this.getEquipmentOverViewList()
    },

    /**
     * 取得設備總覽
     */
    getEquipmentOverViewList() {
      const vm = this
      vm.selectedCategory = this.$store.state.category.selectedCategory
      console.log('getEquipmentOverViewList selectedCategory', vm.selectedCategory)

      const payload = {
        Category: vm.selectedCategory,
        Orderby: 'sequence',
        Power: 'asc'
      }

      equipmentOverView(payload).then(response => {
        console.log('equipmentOverView response.data.Payload', response.data.Payload)
        // console.log('更新時間', new Date())
        vm.equipmentOverViewList = response.data.Payload
      })
    },

    /**
     * 按下事件
     */
    clickEvent(device_id, Category, ip) {
      console.log('clickEvent device_id', device_id)
      console.log('clickEvent Category', Category)
      console.log('clickEvent ip', ip)

      if (isOpenMaterial && DialogOrRedirect === 'Dialog') {
        const vm = this
        switch (Category) {
          case 'ROBOSHOT':
            vm.roboshotDialogVisible = true
            console.log('vm.roboshotDialogVisible', vm.roboshotDialogVisible)
            break

          case 'CNC':
          case 'PLC':
            vm.cncplcDialogVisible = true
            break
        }
        vm.clickedDeviceId = device_id
        vm.clickedIp = ip
      } else if (DialogOrRedirect === 'Redirect') {
        var newUrl = '/equipmentStatus/' + Category
        const routeUrl = this.$router.resolve({
          path: newUrl,
          query: { deviceId: device_id }
        })
        window.open(routeUrl.href, '_blank')
      }
    },

    /**
     * 顯示或隱藏射出機對話框
     */
    setRoboshotDialog(visible) {
      console.log('setRoboshotDialog', visible)
      const vm = this
      vm.roboshotDialogVisible = visible
    },

    /**
     * 顯示或隱藏CNC/PLC對話框
     */
    setCNCPLCDialog(visible) {
      console.log('setCNCPLCDialog', visible)
      const vm = this
      vm.cncplcDialogVisible = visible
    },

    /**
     * SignalR呼叫警示音
     */
    getEquipmentInfoView() {
      const vm = this

      // 下面對應到網址的部份
      const hub = jQuery.hubConnection(WebApiUrl)

      // 下面對應了.net的DefaultHub
      const proxy = hub.createHubProxy('BroadcastHub')

      proxy.on('GetEquipmentInfoView', (data) => {
        console.log('GetEquipmentInfoView', data)
        if (data.UpArea.now_status === 'Down') {
          console.log('播放警報音，設備來源：', data)
          var sound = new Howl({
            src: ['alertSound.mp3']
          })
          sound.play()
        }
        const findDeviceIndex = vm.equipmentOverViewList.findIndex(element => element.UpArea.device_id === data.UpArea.device_id)
        console.log('findDevice', findDeviceIndex)
        this.$set(this.equipmentOverViewList, findDeviceIndex, data)
      })
      hub.start()
    },

    /**
     * 測試連線重連
     */
    testConnect() {
      const vm = this

      // 下面對應到網址的部份
      const hub = jQuery.hubConnection(WebApiUrl)

      // 下面對應了.net的DefaultHub
      const proxy = hub.createHubProxy('BroadcastHub')

      hub.starting(function() {
        console.log('starting', new Date())
      })

      hub.received(function() {
        console.log('received', new Date())
      })

      hub.connectionSlow(function() {
        console.log('connectionSlow', new Date())
      })

      hub.reconnecting(function() {
        console.log('reconnecting', new Date())
      })

      hub.reconnected(function() {
        console.log('reconnected ', new Date())
      })

      hub.disconnected(function() {
        console.log('disconnected  ', new Date())
      })

      hub.start()
    }
  }
}
</script>

<style scoped>
.box-container {
  display: flex;
  flex-wrap: wrap;
}

.card {
  flex-direction: column;
  align-items: center;
  min-width: 220px;
  background-color: #eae8ef;
  border-radius: 18px;
  margin:7px;
}

.title{
  display: relative;
}

.equipmentStyle{
  padding: 6px 0px 0px 0px;
  margin: 3px 0;
  min-width: 100px;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
}

.tag {
  padding: 0px 0px 0px 0px;
  margin: 3px 0;
  min-width: 100px;
  text-align: center;
  font-size: 18px;
}
.contentCard{
  flex-direction: column;
  align-items: center;
  background-color: rgb(252, 252, 252);
  border-bottom-left-radius:18px;
  border-bottom-right-radius:18px;
  margin:1px;
  padding: 6px 10px 8px 10px;
  font-family:Microsoft JhengHei;
  font-weight:500;
}
</style>
