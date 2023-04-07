<template>
  <div>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline" :rule="validateRules">
      <el-form-item label="機台">
        <el-select v-model="searchForm.devices" multiple placeholder="請選機台">
          <el-option v-for="item in deviceList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="日期">
        <el-date-picker
          v-model="searchForm.date"
          type="date"
          placeholder="請選日期"
          :picker-options="pickerOptions"
          prop="SelectDate"
        />
      </el-form-item>

      <el-form-item label="班別">
        <el-select v-model="searchForm.classIds" multiple placeholder="請選班別">
          <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="SubmitForm()">查詢</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { getDeviceListByCategory } from '@/api/SMBDevice'
import { getList as GetClassList } from '@/api/SMBClassInfo'
export default {
  props: {
    category: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      searchForm: {
        date: null,
        classIds: [],
        devices: [],
        allDevices: false
      },

      /** 班別列表 */
      classList: [],

      /** 機台列表 */
      deviceList: [],

      /** 日期下拉選項 */
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },

      validateRules: {
        SelectDate: [{ required: true, message: '日期為必要項', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.getClassList()
    this.getDeviceList()
  },

  methods: {
    /**
     * 取得班別列表
     */
    getClassList() {
      const vm = this
      GetClassList()
        .then(response => {
          vm.classList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

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

    SubmitForm() {
      const vm = this
      if (vm.searchForm.devices.length === 0) {
        vm.searchForm.allDevices = true
        vm.deviceList.forEach(element => {
          vm.searchForm.devices.push(element.id)
        })
      } else {
        vm.searchForm.allDevices = false
      }
      this.$emit('sendSubmit', vm.searchForm)
    },

    /** 清空查詢內的機台清單 */
    clearDevices() {
      this.searchForm.devices = []
    }
  }
}
</script>
