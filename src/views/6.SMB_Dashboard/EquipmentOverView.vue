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
          <h3 style="margin-bottom:8px;text-align:center">{{ dataItem.UpArea.device_name }}</h3>
          <p class="tag">{{ dataItem.UpArea.value }}</p>
        </div>
        <div class="bar" />
        <div v-for="detailItem in dataItem.DownArea" :key="detailItem" style="margin-bottom:8px">{{ detailItem }}<br></div>
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
import { equipmentOverView } from '@/api/SMBStatistical'
import CategorySelect from '@/components/DropDownList/CategorySelect'
import RoboshotDialog from '@/components/EquipmentOverViewDialig/RoboshotDialog'
import CncPlcDialog from '@/components/EquipmentOverViewDialig/CNCPLCDialog'

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
    clearInterval(this.timer)
    this.timer = null
    this.setTimer()
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
        Category: vm.selectedCategory
      }

      equipmentOverView(payload).then(response => {
        console.log('equipmentOverView response.data.Payload', response.data.Payload)
        console.log('更新時間', new Date())
        vm.equipmentOverViewList = response.data.Payload
      })
    },

    setTimer() {
      if (this.timer == null) {
        this.timer = setInterval(() => {
          this.getEquipmentOverViewList()
        }, 30000)
      }
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
        this.$router.push({ path: newUrl, query: { deviceId: device_id }})
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
