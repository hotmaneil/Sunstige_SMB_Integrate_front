<template>
  <div class="app-container">
    <div style="display:flex;align-items:center">
      <h3 style="margin-right:24px">設備總覽顯示管理</h3>
      <el-button type="primary" style="height:40px" size="small" icon="el-icon-edit" @click="updateEquipmentOverviewField()">更新</el-button>
    </div>

    <!-- Table -->
    <el-table
      :data="equipmentOverviewFieldList"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :default-sort="{ prop: 'id', order: 'ascending' }"
    >
      <el-table-column prop="name" label="預設名稱" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="show_name" label="顯示名稱">
        <template slot-scope="{ row }">
          <el-input v-model="row.show_name" />
        </template>
      </el-table-column>

      <el-table-column prop="unit" label="單位" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.unit }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="field_name" label="欄位名稱" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.field_name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="up_show_flag" label="上方顯示" align="center">
        <template slot-scope="{ row }">
          <div v-if="row.field_name === 'id' || row.field_name === 'now_status'">
            <el-checkbox v-model="row.up_show_flag" disabled />
          </div>
          <div v-else>
            <div v-if="row.field_name==='work_no'||row.field_name==='mold_no'||row.field_name==='material_no'">
              <el-checkbox v-model="row.up_show_flag" disabled />
            </div>
            <div v-else>
              <input
                :id="row.field_name"
                v-model="radioCheckedValue"
                type="radio"
                :value="row.field_name"
                @change="changeFieldNameForRadio()"
              >
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="down_show_flag" label="下方顯示" align="center">
        <template slot-scope="{ row }">
          <el-checkbox v-model="row.down_show_flag" />
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { getManageList, update } from '@/api/SMBEquipmentOverviewField'
export default {
  components: {},
  filters: {},
  data() {
    return {
      /** 設備總覽欄位列表 */
      equipmentOverviewFieldList: [],

      /** 目前單選值 */
      radioCheckedValue: null
    }
  },

  created() {
    this.getEquipmentOverviewFieldList()
  },

  methods: {
    /**
     * 取得設備總覽欄位列表
     */
    getEquipmentOverviewFieldList() {
      const vm = this
      getManageList()
        .then(response => {
          vm.equipmentOverviewFieldList = response.data.Payload

          const exceptFieldNames = ['id', 'now_status']
          var filterDataList = vm.equipmentOverviewFieldList.filter(function(element) {
            return !exceptFieldNames.includes(element.field_name)
          })
          console.log('filterDataList', filterDataList)

          var findItem = filterDataList.find(element => element.up_show_flag === true)
          console.log('findItem', findItem)
          vm.radioCheckedValue = findItem.field_name
        })
        .catch(err => {
          console.log(err)
        })
    },

    /** 變更單選欄位名稱 */
    changeFieldNameForRadio() {
      const vm = this
      const exceptFieldNames = ['id', 'now_status']
      vm.equipmentOverviewFieldList.forEach(element => {
        if (!exceptFieldNames.includes(element.field_name)) {
          if (element.field_name === vm.radioCheckedValue) {
            element.up_show_flag = true
          } else {
            element.up_show_flag = false
          }
        }
      })
    },

    /**
     * 更新設備總覽欄位
     */
    updateEquipmentOverviewField() {
      const payload = this.equipmentOverviewFieldList
      update(payload).then(response => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
