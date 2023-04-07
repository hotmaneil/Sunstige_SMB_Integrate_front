<template>
  <div class="app-container">
    <h3>模具庫格管理</h3>

    <!--tabs-->
    <el-tabs type="border-card">
      <el-tab-pane v-for="item in moldBlockList" :key="item.id" :label="item.name">
        <mold-grid-table :ref="item.code" :mold-block="item.id" />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import { getMoldBlockEnumList } from '@/api/Mold'
import MoldGridTable from '@/views/8.MaterialMold/components/MoldGridTable'
export default {
  components: {
    MoldGridTable
  },

  data() {
    return {
      /** 模具區塊列表 */
      moldBlockList: []
    }
  },

  created() {
    this.getMoldBlockList()
  },

  methods: {

    /** 取得模具區塊列表 */
    getMoldBlockList() {
      const vm = this
      getMoldBlockEnumList()
        .then(response => {
          vm.moldBlockList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
