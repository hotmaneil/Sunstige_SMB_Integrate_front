<template>
  <div class="app-container">
    <h3>警示訊息通知歷史紀錄</h3>

    <!--search tools-->
    <el-row>
      <el-col :span="12">
        <el-form :model="searchForm" :inline="true">
          <el-form-item label="機台代號">
            <el-select v-model="searchForm.device_id" clearable>
              <el-option v-for="item in deviceList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <!-- <el-input v-model="searchForm.device_id" /> -->
          </el-form-item>

          <el-form-item label="訊息類型">
            <el-select v-model="searchForm.type" clearable>
              <el-option v-for="item in typeList" :key="item.Id" :label="item.Name" :value="item.Id" />
            </el-select>
          </el-form-item>

          <el-form-item label="訊息關鍵字">
            <el-input v-model="searchForm.message" />
          </el-form-item>

          <el-form-item label="日期時間">
            <el-date-picker
              v-model="SelectedTime"
              type="datetimerange"
              range-separator="To"
              start-placeholder="開始日期時間"
              end-placeholder="結束日期時間"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getLogList()">搜尋</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--table-->
    <el-table
      v-loading="result_obj.show_loading"
      :data="result_obj.page_data"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :default-sort="{ prop: 'id', order: 'ascending' }"
    >
      <el-table-column prop="device_id" label="機台代號" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.device_id }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="typeName" label="訊息類型" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.typeName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="message" label="訊息" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.message }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="日期時間" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.createTime |formatDateFilter }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="result_obj.total>0"
      :total="result_obj.total"
      :page.sync="result_obj.now_page"
      :limit.sync="result_obj.per_page"
      @pagination="getLogList"
    />

  </div>

</template>

<script>
import Pagination from '@/components/Pagination'
import { getList } from '@/api/SMBDevice'
import { getAlertlogList, getAlertTypeList } from '@/api/AlertLog'
import moment from 'moment'
import { formatDate } from '@/utils/validate'

export default {
  name: 'MessageAlertLog',
  components: { Pagination },
  filters: {
    formatDateFilter(value) {
      console.log(value)
      return formatDate(value, 'yyyy-MM-dd HH:mm:ss')
    }
  },
  data() {
    return {
      searchForm: {},
      result_obj: {
        total: 0,
        now_page: 1,
        per_page: 10,
        page_data: [],
        show_loading: false
      },

      /** 機台下拉選單 */
      deviceList: [],

      /** 訊息類型下拉選單 */
      typeList: [],

      /** 選取的日期時間範圍 */
      SelectedTime: null
    }
  },

  created() {
    this.getDeviceList()
    this.getAlertTypeDropdownList()
  },

  methods: {
    /**
     * 取得記錄列表
     */
    getLogList() {
      const vm = this
      const payload = {
        device_id: vm.searchForm.device_id,
        type: vm.searchForm.type,
        message: vm.searchForm.message,
        SelectedStartTime: vm.SelectedTime === null
          ? null : moment(vm.SelectedTime[0]).format('YYYY/MM/DD HH:mm'),
        SelectedEndTime: vm.SelectedTime === null
          ? null : moment(vm.SelectedTime[1]).format('YYYY/MM/DD HH:mm'),
        PageSize: vm.result_obj.per_page,
        CurrentPage: vm.result_obj.now_page
      }

      console.log('payload', payload)

      getAlertlogList(payload)
        .then(response => {
          vm.result_obj.total = response.data.Pagination.Total
          vm.result_obj.page_data = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 取得設備列表
     */
    getDeviceList() {
      const vm = this
      const payload = {
        isEnable: true
      }
      getList(payload)
        .then(response => {
          vm.deviceList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 警示訊息類型下拉選單
     */
    getAlertTypeDropdownList() {
      getAlertTypeList()
        .then(response => {
          this.typeList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

