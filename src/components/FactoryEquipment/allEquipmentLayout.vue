<template>
  <el-tabs v-model="ipcIp" type="border-card">
    <el-tab-pane v-for="item in ipcList" :key="item.ip" :label="item.name" :name="item.ip">
      <IpEquipmentLayout :select-ip="item.ip" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import IpEquipmentLayout from '@/components/FactoryEquipment/IpEquipmentLayout'
import { getIPCList } from '@/api/SMBIPC'
export default {
  components: { IpEquipmentLayout },
  props: {
    clickValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      /** IPC列表 */
      ipcList: [],
      ipcIp: ''
    }
  },

  watch: {
    /** 查看按下有無更動 */
    clickValue(newValue) {
      console.log('clickValue', newValue)
      this.showIPCList()
    },
    ipcIp(newValue) {
      this.$emit('tab-ipc-ip', newValue)
    }
  },

  created() {
    this.showIPCList()
  },

  methods: {
    /**
     * 列出IPC列表
     */
    showIPCList() {
      const vm = this
      vm.ipcList = []
      const payload = {
        isEnable: true
      }
      getIPCList(payload)
        .then(response => {
          vm.ipcList = response.data.Payload
          this.ipcIp = this.ipcList[0].ip
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
