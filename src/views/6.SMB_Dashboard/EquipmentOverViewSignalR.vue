<template>
  <div style="padding:20px">
    <span>
      <el-row>
        <el-col :span="8">
          <h3>設備總覽 Machine Status Overview(即時測試版)</h3>
        </el-col>
        <el-col :span="16">
          <category-select @OnSelectCategoryChange="getEquipmentOverViewList" />
        </el-col>
      </el-row>
    </span>
    <div class="box-container">
      <div v-for="dataItem in equipmentOverViewList" :key="dataItem.UpArea.device_id" class="card" :style="{ backgroundColor: dataItem.UpArea.device_status_color }">
        <div class="title">
          <h3 style="margin-bottom:8px;text-align:center">{{ dataItem.UpArea.device_name }}</h3>
          <p class="tag">{{ dataItem.UpArea.value }}</p>
        </div>
        <div class="bar" />
        <div v-for="detailItem in dataItem.DownArea" :key="detailItem" style="margin-bottom:8px">{{ detailItem }}<br></div>
      </div>
    </div>
  </div>
</template>

<script>
window.jQuery = jQuery
require('signalr')

import { equipmentOverView } from '@/api/SMBStatistical'
import CategorySelect from '@/components/DropDownList/CategorySelect'

export default {
  components: { CategorySelect },
  data() {
    return {
      equipmentOverViewList: [],

      // 選取的設備類型
      selectedCategory: null
    }
  },

  mounted() {
    this.getEquipmentOverViewList()
  },

  created() {
    this.getEquipmentInfoView()
  },

  methods: {
    /**
     * 取得設備總覽
     */
    getEquipmentOverViewList(source) {
      this.selectedCategory = source
      const payload = {
        Category: source
      }
      this.setEquipmentOverView(payload)
    },

    /**
     * 取得資料建立設備總覽
     */
    setEquipmentOverView(payload) {
      const vm = this
      equipmentOverView(payload).then(response => {
        console.log('response.data.Payload', response.data.Payload)
        console.log('更新時間', new Date())
        vm.equipmentOverViewList = response.data.Payload
      })
    },

    /**
     * SignalR呼叫
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
          console.log('播放')
          this.playAlertSound()
        }
        const findDeviceIndex = vm.equipmentOverViewList.findIndex(element => element.UpArea.device_id === data.UpArea.device_id)
        console.log('findDevice', findDeviceIndex)
        this.$set(this.equipmentOverViewList, findDeviceIndex, data)
      })
      hub.start()
    },

    /**
     * 播放警告音效
     * @param {*} sound
     */
    playAlertSound() {
      var soundUrl = 'alertSound.mp3'
      var audio = new Audio(soundUrl)
      audio.play()
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
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 240px;
  min-width: 200px;
  background-color: #eae8ef;
  border-radius: 8px;
  margin:8px;
  /* box-shadow: -1rem 0 3rem #000; */
  /*   margin-left: -50px; */
  /* transition: 0.4s ease-out; */
  /* position: relative; */
  /* left: 0px; */
}
.tag {
  border:1px solid #eee;
  border-radius: 4px;
  padding: 4px 12px;
  margin: 8px 0;
  min-width: 100px;
  text-align: center;
}
/** 下面為動畫 */
/* .card:not(:first-child) {
  margin-left: -50px;
}

.card:hover {
  transform: translateY(-20px);
  transition: 0.4s ease-out;
}

.card:hover ~ .card {
  position: relative;
  left: 50px;
  transition: 0.4s ease-out;
} */

/** 標題與內文 */
.title {
  color: rgb(1, 8, 27);
  font-weight: 400;
  /* position: absolute;
  left: 20px;
  top: 15px; */
}

.bar {
  width: 90%;
  border-bottom:2px solid #2e3033;
  margin-bottom:12px;
}

</style>
