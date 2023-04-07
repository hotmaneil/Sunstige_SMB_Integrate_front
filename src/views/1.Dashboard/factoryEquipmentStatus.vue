<template>
  <div class="app-container">
    <div class="pie-chart">
      <div style="margin-bottom:12px;display:flex">
        <el-button round style="margin-right:24px" @click="selectIP = ''">觀看全廠</el-button>
        <el-select v-model="selectIP" placeholder="請選擇廠區" @change="clickToGetIP(selectIP)">
          <el-option
            v-for="item in ipcList"
            :key="item.ip"
            :label="item.name"
            :value="item.ip"
          />
        </el-select>
      </div>
      <!-- 全廠 -->
      <div style="overflow:auto; height:100%; padding-bottom:20px">
        <el-card style="margin-bottom:12px">
          <p style="margin-top:4px;margin-bottom:4px">全廠</p>
          <equipment-pie-chart :pie-chart-data="pieChartData" />
          <equipment-count-tag :replace-data="pieChartData" />
        </el-card>

        <!-- 本廠區及其他廠區 -->
        <div v-if="ipcList.length>1">
          <el-card v-for="item in ipcList" :key="item.ip" style="margin-bottom:12px">
            <p style="margin-top:4px;margin-bottom:4px">{{ item.name }}</p>
            <equipment-piechart-ip :ip="item.ip" />
            <equipment-count-tag :ip="item.ip" />
          </el-card>
        </div>
      </div>
    </div>

    <!-- 點選某廠區顯示該廠的機台Layout -->
    <div class="machine-layout">
      <h3 style="margin-bottom:12px;margin-top:12px">機台Layout：{{ selectIP }}</h3>
      <equipment-layout-ip
        v-if="isshowSingleFactoryLayout"
        :equipment-list="equipmentList"
        :elements="elements"
        :action-elements="actionElements"
        :select-ip="selectIP"
        @updateLayout="clickToGetIP(selectIP)"
      />
      <allEquipmentLayout v-show="!isshowSingleFactoryLayout" :click-value="isshowSingleFactoryLayout" @tab-ipc-ip="selectTabIpcIp" />
    </div>
  </div>
</template>

<script>
window.jQuery = jQuery
require('signalr')

import { getDeviceStatusCount } from '@/api/SMBDevice'
import { getIPCList } from '@/api/SMBIPC'
import equipmentLayoutIp from '@/components/FactoryEquipment/equipmentLayoutIp'
import equipmentPieChart from '@/components/FactoryEquipment/equipmentPieChart'
import equipmentPiechartIp from '@/components/FactoryEquipment/equipmentPiechartIp'
import allEquipmentLayout from '@/components/FactoryEquipment/allEquipmentLayout'
import equipmentCountTag from '@/components/FactoryEquipment/equipmentCountTag'
import axios from 'axios'
import { Howl } from 'howler'

export default {
  components: {
    equipmentPiechartIp,
    equipmentPieChart,
    equipmentLayoutIp,
    allEquipmentLayout,
    equipmentCountTag
  },
  data() {
    return {
      /** IPC列表 */
      ipcList: [],

      /** 圓餅圖資料 */
      pieChartData: [],

      /** 選取的IP */
      selectIP: '',

      /** 設備列表 */
      equipmentList: [],

      /** 編輯圖層列表 */
      elements: [],

      /** 運行中的圖層列表 */
      actionElements: [],

      /** tab 所選到的工廠 ip */
      tabIpcIp: '',

      /** 已經存在的位置圖之機台清單 */
      existEquipment: []
    }
  },
  computed: {
    // 是否顯示單獨廠Layout
    isshowSingleFactoryLayout() {
      const arrIp = this.ipcList.map(ipc => ipc.ip)
      return arrIp.includes(this.selectIP)
    }
  },
  created() {
    setTimeout(() => {
      this.showIPCList()
      this.$store.dispatch('factoryPie/initPieChartData')
      this.pieChartData = []
    }, 1000)
    this.getEquipmentInfoView()
  },

  mounted() {
    const loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    setTimeout(() => {
      this.pieChartData = this.$store.state.factoryPie.pieChartData
      loading.close()
    }, 2000)
  },

  methods: {
    selectTabIpcIp(tabIp) {
      this.tabIpcIp = tabIp
    },
    /**
     * 列出IPC列表
     */
    showIPCList() {
      const vm = this
      const payload = {
        isEnable: true
      }
      getIPCList(payload)
        .then(response => {
          vm.ipcList = response.data.Payload
          this.getFactoryDeviceStatusCountList(vm.ipcList)
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 從IPC列表取得設備狀態統計數列表
     */
    getFactoryDeviceStatusCountList(ipcList) {
      ipcList.forEach(element => {
        console.log('getFactoryDeviceStatusCountList ip', element)
        const url = `http://${element.ip}/api/Device/GetDeviceStatusCount`
        axios.get(url).then(response => {
          var initData = response.data.Payload
          console.log('getFactoryDeviceStatusCountList data', initData)
          this.$store.dispatch('factoryPie/addToPieChartData', initData)
        })
      })
    },

    /**
     * 取得設備狀態統計數列表
     */
    getDeviceStatusCountList() {
      const vm = this
      getDeviceStatusCount().then(response => {
        vm.pieChartData = response.data.Payload
      })
    },

    /** 按下取得IP */
    clickToGetIP(ip) {
      const vm = this
      vm.elements = []
      vm.actionElements = []
      console.log('clickToGetIP', ip)
      vm.selectIP = ip

      // 設備列表
      const url = `http://${ip}/api/Device/GetList`
      const paylaod = {
        isEnable: true
      }
      axios.post(url, paylaod).then(response => {
        vm.equipmentList = response.data.Payload
      })

      const layoutUrl = `http://${ip}/api/EquipmentLayout/GetList`
      axios.get(layoutUrl).then(response => {
        vm.elements = response.data.Payload
      }).then(result => {
        this.filterEquipmentList()
      })

      const actionLayoutUrl = `http://${ip}/api/EquipmentLayout/GetActionList`
      axios.get(actionLayoutUrl).then(response => {
        vm.actionElements = response.data.Payload
      }).then(result => {
        this.filterEquipmentList()
      })
    },

    /**
     * 找已經存在的位置圖之機台清單並將機台下拉選單過濾掉
     */
    filterEquipmentList() {
      const vm = this
      vm.existEquipment = []
      console.log('找已經存在的位置圖之機台清單並將機台下拉選單過濾掉', vm.elements)
      vm.elements.forEach(element => {
        console.log('element.text', element.text)
        vm.existEquipment.push(element.text)
      })

      vm.existEquipment.forEach(element => {
        console.log('search', element)
        var findElementIndex = vm.equipmentList.findIndex(item => item.name === element)
        if (findElementIndex > -1) {
          vm.equipmentList.splice(findElementIndex, 1)
        }
      })
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
          console.log('從廠區運行總攬播放警報音，設備來源：', data)
          var sound = new Howl({
            src: ['alertSound.mp3']
          })
          sound.play()
        }

        // 更新圓餅圖資料
        var initFunction = new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log('initFunction')
            this.$store.dispatch('factoryPie/initPieChartData')
            this.pieChartData = []
          }, 500)
        })

        var nextFunction = new Promise((resolve, reject) => {
          setTimeout(() => {
            this.getFactoryDeviceStatusCountList(vm.ipcList)
            resolve('finish nextFunction')
          }, 500)
        })

        var lastFunction = new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log('this.$store.state.factoryPie.pieChartData', this.$store.state.factoryPie.pieChartData)
            this.pieChartData = this.$store.state.factoryPie.pieChartData
          }, 1000)
        })

        async() => {
          await initFunction()
          await nextFunction()
          await lastFunction()
        }
      })
      hub.start()
    }
  }
}
</script>
<style lang='scss' scoped>
.app-container {
  display: flex;
  .pie-chart{
    width: 30%;
    margin-right: 12px;
    height: calc(100vh - 100px);
    padding:12px;
  }
  .machine-layout{
    flex: 1 1 0%;
  }
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
</style>
