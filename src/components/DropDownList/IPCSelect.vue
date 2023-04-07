<template>
  <div class="ipcSelect">
    <el-form label-width="120px">
      <el-form-item label="切換IPC">
        <el-select v-model="frontUrl" placeholder="please select IPC" style="width: 100%" @change="OnSelectIPCChange()">
          <el-option v-for="item in ipcList" :key="item.frontUrl" :label="item.name" :value="item.frontUrl" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getIPCList } from '@/api/SMBIPC'

export default {
  name: 'IPCSelect',
  data() {
    return {
      frontUrl: null,
      ipcList: []
    }
  },

  mounted() {

  },

  created() {
    this.getIPCList()

    setTimeout(() => {
      this.setIp()
    }, 1000)
  },

  methods: {
    getIPCList() {
      const vm = this
      const payload = {
        isEnable: true
      }
      getIPCList(payload)
        .then(response => {
          vm.ipcList = response.data.Payload
          console.log('vm.ipcList', vm.ipcList)
        })
        .catch(err => {
          console.log(err)
        })
    },

    setIp() {
      const vm = this
      const host = location.host
      vm.frontUrl = host
      console.log('vm.frontUrl', vm.frontUrl)
    },

    /** 變更下拉選單值 */
    OnSelectIPCChange() {
      const vm = this
      this.$emit('OnSelectIPCChange', vm.frontUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
.ipcSelect {
  display: inline-block;
}
</style>
