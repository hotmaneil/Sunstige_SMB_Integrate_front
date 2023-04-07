<template>
  <div>
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline" :rule="validateRules">
      <el-form-item label="年月">
        <el-date-picker v-model="searchForm.YearMonth" type="month" placeholder="年月" prop="YearMonth" />
      </el-form-item>

      <el-form-item label="機台">
        <el-select v-model="searchForm.EquipmentIds" multiple placeholder="請選機台">
          <el-option v-for="item in deviceList" :key="item.id" :label="item.name" :value="item.id" />
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
export default {
  components: {},
  props: {
    category: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      searchForm: {
        YearMonth: null,
        EquipmentIds: [],
        allDevices: false
      },

      /** 機台列表 */
      deviceList: [],

      validateRules: {
        YearMonth: [{ required: true, message: '年月為必要項', trigger: 'blur' }]
      }
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

    SubmitForm() {
      const vm = this
      if (vm.searchForm.EquipmentIds.length === 0) {
        vm.searchForm.allDevices = true
        vm.deviceList.forEach(element => {
          vm.searchForm.EquipmentIds.push(element.id)
        })
      } else {
        vm.searchForm.allDevices = false
      }
      this.$emit('sendSubmit', vm.searchForm)
    },

    /** 清空查詢內的機台清單 */
    clearDevices() {
      this.searchForm.EquipmentIds = []
    }
  }
}
</script>
