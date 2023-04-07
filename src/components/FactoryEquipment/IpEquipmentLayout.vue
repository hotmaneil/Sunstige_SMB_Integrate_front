<!-- 給所有IP之全廠用的精簡無編輯之Layout-->
<template>
  <div style="width:80%;min-width:800px">
    <div class="padding-top-style">
      <div ref="workspace" class="workspaceReadOnly">
        <div class="action">
          <FreeTransform
            v-for="element in actionElements"
            :key="element.id"
            :x="element.x"
            :y="element.y"
            :scale-x="element.scaleX"
            :scale-y="element.scaleY"
            :width="element.width"
            :height="element.height"
            :angle="element.angle"
            :offset-x="offsetX"
            :offset-y="offsetY"
            :disable-scale="element.disableScale === true"
          >
            <div class="element" :style="getElementStyles(element)">
              <h2>{{ element.text }}</h2>
            </div>
          </FreeTransform>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FreeTransform from 'vue-free-transform'
import axios from 'axios'
import { getDeviceStatusCount } from '@/api/SMBDevice'

export default {
  name: 'IpEquipmentLayout',
  components: {
    FreeTransform
  },

  props: {
    selectIp: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      /** 運行中的圖層列表 */
      actionElements: [],
      offsetX: 0,
      offsetY: 0,

      /** 運行中的圖層狀態統計列表 */
      actionElementsDeviceStatusCountList: [],

      /** 設備狀態統計列表 */
      deviceStatusCountList: []
    }
  },

  mounted() {
    this.offsetX = this.$refs.workspace.offsetLeft
    this.offsetY = this.$refs.workspace.offsetTop
  },

  created() {
    this.getActionElementsFromIp()
    this.getActionElementsFromSignalrR()
  },

  methods: {
    /**
     * 取得元件Style
     */
    getElementStyles(element) {
      const styles = element.styles ? element.styles : {}
      return {
        width: `${element.width}px`,
        height: `${element.height}px`,
        ...styles
      }
    },

    /**
     * 依照狀態撈出正在運行機台圖
     * @param {*} actionElements
     * @param {*} status
     */
    findActionElementsByStatus(actionElements, status) {
      var findByStatus = actionElements.filter(function(element) {
        return element.now_status === status
      })
      console.log('findByStatus' + status, findByStatus)

      const addItem = {
        now_status: status,
        count: findByStatus.length
      }
      this.actionElementsDeviceStatusCountList.push(addItem)
    },

    /**
     * 從ip取得所有機台圖位置
     */
    getActionElementsFromIp() {
      const vm = this
      vm.actionElements = []
      const actionLayoutUrl = `http://${this.selectIp}/api/EquipmentLayout/GetActionList`
      axios.get(actionLayoutUrl).then(response => {
        vm.actionElements = response.data.Payload
      })
    },

    /**
     * 取得設備狀態統計數列表
     */
    getDeviceStatusCountList() {
      const vm = this
      getDeviceStatusCount().then(response => {
        vm.deviceStatusCountList = response.data.Payload
        console.log('getDeviceStatusCountList', vm.deviceStatusCountList)
      })
    },

    /**
     * 從SignalR更新機台Layout
     */
    getActionElementsFromSignalrR() {
      const vm = this

      // 下面對應到網址的部份
      const hub = jQuery.hubConnection(WebApiUrl)

      // 下面對應了.net的DefaultHub
      const proxy = hub.createHubProxy('BroadcastHub')

      proxy.on('GetEquipmentInfoView', (data) => {
        console.log('getActionElementsFromSignalrR GetEquipmentInfoView', data)

        vm.actionElements.forEach(element => {
          if (element.EquipmentID === data.UpArea.device_id) {
            element.now_status = data.UpArea.now_status
            element.styles.background = data.UpArea.device_status_color
          }
        })

        setTimeout(() => {
          this.checkDeviceStatusCount()
        }, 500)
      })
      hub.start()
    },

    /**
     * 檢查核對設備狀態統計數
     */
    checkDeviceStatusCount() {
      setTimeout(() => {
        this.actionElementsDeviceStatusCountList = []
        this.findActionElementsByStatus(this.actionElements, 'Run')
        this.findActionElementsByStatus(this.actionElements, 'Idle')
        this.findActionElementsByStatus(this.actionElements, 'Down')
        this.findActionElementsByStatus(this.actionElements, 'Disconnect')
        this.findActionElementsByStatus(this.actionElements, 'Offline')
      }, 500)

      this.getDeviceStatusCountList()

      setTimeout(() => {
        this.findAndComareToAction('Run')
        this.findAndComareToAction('Idle')
        this.findAndComareToAction('Down')
        this.findAndComareToAction('Disconnect')
        this.findAndComareToAction('Offline')
      }, 500)
    },

    /**
     * 找到並比對再做後續處理
     * @param {*} status
     */
    findAndComareToAction(status) {
      var findActionElementsBy = this.actionElementsDeviceStatusCountList.filter(function(element) {
        return element.now_status === status
      })
      console.log('findActionElementsBy', findActionElementsBy)

      var findDeviceStatusCountListBy = this.deviceStatusCountList.filter(function(element) {
        return element.name === status
      })
      console.log('findDeviceStatusCountListBy', findDeviceStatusCountListBy)

      var actionElementsCount = parseInt(findActionElementsBy[0].count)
      console.log('actionElementsCount', actionElementsCount)

      var deviceStatusCount = parseInt(findDeviceStatusCountListBy[0].value)
      console.log('deviceStatusCount', deviceStatusCount)

      if (actionElementsCount === deviceStatusCount) {
        console.log(status + '比對一樣，不用重整')
      } else {
        console.log(status + '比對不同，需要重整')
        this.getActionElementsFromIp()
      }
    }
  }
}
</script>

<style scoped>
.padding-top-style{
  position: relative;
  padding-top: 75%;
}
.workspaceReadOnly {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 98%;
  /* width: 800px;
  height: 600px; */
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
  background: #F8FAFC;
  background-image: url('/backgroundImg.png');
  pointer-events: none;
  border-width: 6px;
  border-color: rgba(238, 238, 245, 0.753);
}

* {
  box-sizing: border-box;
}

/** 運作中 */
.action .tr-transform__content {
  user-select: none;
}

.action .tr-transform__rotator {
  top: -45px;
  left: calc(50% - 7px);
}

.action .tr-transform__rotator,
.action .tr-transform__scale-point {
  background: #fff;
  width: 0px;
  height: 0px;
  border-radius: 50%;
  position: absolute;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: 0px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.tr-transform__rotator:hover,
.tr-transform__scale-point:hover {
  background: #f1f5f8;
}

.tr-transform__rotator:active,
.tr-transform__scale-point:active {
  background: #dae1e7;
}

.tr-transform__scale-point {
}

.tr-transform__scale-point--tl {
  top: -7px;
  left: -7px;
}

.tr-transform__scale-point--ml {
  top: calc(50% - 7px);
  left: -7px;
}

.tr-transform__scale-point--tr {
  left: calc(100% - 7px);
  top: -7px;
}

.tr-transform__scale-point--tm {
  left: calc(50% - 7px);
  top: -7px;
}

.tr-transform__scale-point--mr {
  left: calc(100% - 7px);
  top: calc(50% - 7px);
}

.tr-transform__scale-point--bl {
  left: -7px;
  top: calc(100% - 7px);
}

.tr-transform__scale-point--bm {
  left: calc(50% - 7px);
  top: calc(100% - 7px);
}

.tr-transform__scale-point--br {
  left: calc(100% - 7px);
  top: calc(100% - 7px);
}
</style>
