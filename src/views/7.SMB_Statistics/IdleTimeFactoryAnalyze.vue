<template>
  <div>
    <!-- 查詢表單 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="日期">
        <el-date-picker
          v-model="searchForm.dataRange"
          type="daterange"
          range-separator="To"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
        />
      </el-form-item>

      <el-form-item label="閒置原因">
        <el-select v-model="searchForm.codeList" multiple placeholder="請選閒置原因">
          <el-option v-for="item in idleList" :key="item.code" :label="item.comment" :value="item.code" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="searchIdleTimeStatistics()">查詢</el-button>
      </el-form-item>
    </el-form>

    <el-row>
      <el-col :span="12">
        <!-- 左圖表 -->
        <h3>機台閒置</h3>
        <IdleTimeAnalyze :statistics-list="statisticsList" />
      </el-col>
      <el-col :span="12">
        <!-- 右細節表格 -->
        <h3>機台閒置細節</h3>
        <el-table
          :data="statisticsList"
          border
          fit
          stripe
          highlight-current-row
          style="width: 100%"
          :default-sort="{ prop: 'id', order: 'ascending' }"
        >
          <el-table-column prop="comment" label="原因" sortable="custom">
            <template slot-scope="{ row }">
              <span>{{ row.comment }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="comment" label="時間" sortable="custom">
            <template slot-scope="{ row }">
              <span>{{ row.DiffSecond }}s</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getIPCList } from '@/api/SMBIPC'
import IdleTimeAnalyze from '@/components/SMBChart/IdleTimeAnalyzeChart.vue'
import axios from 'axios'

export default {
  components: { IdleTimeAnalyze },
  data() {
    return {
      ipcList: [],
      idleList: [],
      statisticsList: [],
      searchForm: {
        dataRange: {},
        startDate: null,
        endDate: null,
        code: null
      }
    }
  },

  created() {
    this.showIPCList()
    this.getCNCIdleCodeListFromIp()
  },

  methods: {
    /**
     * 列出IPC列表
     */
    showIPCList() {
      const vm = this
      const payload = {
        isEnable: null
      }
      getIPCList(payload)
        .then(response => {
          vm.ipcList = response.data.Payload
          this.getCNCIdleCodeListFromIp(vm.ipcList)
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 從IP列表取得資料
     */
    getCNCIdleCodeListFromIp(ipcList) {
      const vm = this
      ipcList.forEach(element => {
        const url = `http://${element.ip}/api/CNCIdleCode/GetList`
        axios.get(url).then(response => {
          var itemData = response.data.Payload
          itemData.forEach(subItem => {
            vm.idleList.push(subItem)
          })
        })
      })
    },

    /**
     * 搜尋全廠並撈出閒置資料
     */
    searchIdleTimeStatistics() {
      const vm = this
      vm.statisticsList = []
      const paylaod = this.searchForm
      vm.ipcList.forEach(element => {
        const url = `http://${element.ip}/api/Statistical/GetIdleTimeStatistics`
        console.log('url', url)
        axios.post(url, paylaod).then(response => {
          var itemData = response.data.Payload
          itemData.forEach(subItem => {
            const findStatisticsList = vm.statisticsList.find(findItem => findItem.code === subItem.code)
            if (findStatisticsList === undefined) {
              vm.statisticsList.push(subItem)
            } else {
              findStatisticsList.DiffSecond += subItem.DiffSecond
            }
          })
        })
      })
    }
  }
}
</script>
