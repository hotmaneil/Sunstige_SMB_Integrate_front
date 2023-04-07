<template>
  <div>
    <!-- 查詢表單 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="日期">
        <!-- <el-date-picker v-model="searchForm.date" type="date" placeholder="請選日期"> </el-date-picker> -->

        <el-date-picker
          v-model="searchForm.dataRange"
          type="daterange"
          range-separator="To"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
        />
      </el-form-item>

      <el-form-item label="機台">
        <el-select v-model="searchForm.device" placeholder="請選機台">
          <el-option v-for="item in deviceList" :key="item.id" :label="item.name" :value="item.id" />
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
import { getIdleTimeStatistics } from '@/api/SMBStatistical'
import { getDeviceListByCategory } from '@/api/SMBDevice'
import IdleTimeAnalyze from '@/components/SMBChart/IdleTimeAnalyzeChart.vue'
export default {
  components: { IdleTimeAnalyze },
  data() {
    return {
      category: 'CNC',
      deviceList: [],
      searchForm: {
        // date: null,
        dataRange: {},
        startDate: null,
        endDate: null,
        device: null
      },

      statisticsList: []
    }
  },

  created() {
    this.getDeviceList()
  },

  methods: {
    /**
     * 取得機台列表
     */
    getDeviceList() {
      const vm = this
      const payload = {
        Category: vm.category,
        Orderby: 'sequence',
        Power: 'asc'
      }
      getDeviceListByCategory(payload)
        .then(response => {
          vm.deviceList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 搜尋閒置時間分析之統計資料
     */
    searchIdleTimeStatistics() {
      const vm = this

      const paylaod = this.searchForm
      getIdleTimeStatistics(paylaod).then(response => {
        vm.statisticsList = response.data.Payload
      })
    }
  }
}
</script>
