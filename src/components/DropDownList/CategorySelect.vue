<template>
  <el-form label-position="right" label-width="auto">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="12" :lg="6" style="float: right">
        <el-form-item label="設備類型">
          <el-select
            v-model="Category"
            placeholder="please select category"
            style="width: 100%"
            @change="OnSelectCategoryChange()"
          >
            <el-option v-for="item in categoryList" :key="item.name" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: {

  },

  data() {
    return {
      Category: '',

      /**
       * 設備種類列表
       */
      categoryList: []
    }
  },

  created() {
    this.setCategoryList()
  },

  methods: {
    /**
     * 建立設備種類列表
     */
    setCategoryList() {
      const vm = this

      if (CategoryOpenSetting.Roboshot) {
        vm.categoryList.push({ name: '射出機', value: 'Roboshot' })
      }

      if (CategoryOpenSetting.PLC) {
        vm.categoryList.push({ name: 'PLC', value: 'PLC' })
      }

      if (CategoryOpenSetting.CNC) {
        vm.categoryList.push({ name: 'CNC', value: 'CNC' })
      }

      vm.categoryList.push({ name: '全部', value: '' })
    },

    /**
     * 變更下拉選單值
     */
    OnSelectCategoryChange() {
      const vm = this
      this.$emit('OnSelectCategoryChange', vm.Category)
    }
  }
}
</script>
