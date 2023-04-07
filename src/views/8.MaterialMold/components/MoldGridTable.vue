<template>
  <div>
    <!--search tools-->
    <el-form :model="searchForm" :inline="true">
      <el-form-item label="模具編號">
        <el-input v-model="searchForm.ModelID" />
      </el-form-item>

      <el-form-item label="模具名稱">
        <el-input v-model="searchForm.ModelName" />
      </el-form-item>

      <el-form-item label="模具庫格編號">
        <el-input v-model="searchForm.MoldStockID" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList()">搜尋</el-button>
      </el-form-item>
    </el-form>

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
      <el-table-column prop="MoldStockID" label="模具庫格編號" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.MoldStockID }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="ModelID" label="模具編號" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.ModelID }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="Name" label="模具名稱" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.Name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="ProdId" label="產品編號" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.ProdId }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="ProductName" label="產品名" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.ProductName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="Hold" label="模具穴數" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.Hold }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="MoldMaxLimit" label="模具最大射出模數" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.MoldMaxLimit }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="MoldInjection" label="單次射出模數" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.MoldInjection }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="MoldMaxLifeCycle" label="模具最大壽命限制" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.MoldMaxLifeCycle }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="MoldTotalInjection" label="累計實際總射出數" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.MoldTotalInjection }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="MoldStatusName" label="模具健康狀態" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.MoldStatus===1" type="success" circle />
          <el-button v-if="scope.row.MoldStatus===2" type="warning" circle />
          <el-button v-if="scope.row.MoldStatus===4" type="danger" circle />
        </template>
      </el-table-column>

      <el-table-column prop="MoldTotalInjection" label="圖片" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="loadImage(scope.row)"
            fit="fill"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" @click="clickDataForm(scope.row)">模具詳細資訊</el-button>
            <el-button
              :type="resetConditionForResetBtnType(scope.row)"
              :disabled="resetConditionForResetBtnDisabled(scope.row)"
              @click="resetMold(scope.row)"
            >Reset</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="result_obj.total>0" :total="result_obj.total" :page.sync="result_obj.now_page" :limit.sync="result_obj.per_page" @pagination="getList" />

    <!--對話框-->
    <el-dialog :title="title" :visible.sync="formShow" width="600px">
      <el-form
        ref="moldForm"
        :model="moldForm"
        label-position="right"
        label-width="210px"
        style="padding-left:0px;padding-right:10px;"
      >
        <el-form-item label="模具庫格編號" prop="MoldStockID">
          <el-input v-model="moldForm.MoldStockID" />
        </el-form-item>

        <el-form-item label="模具編號" prop="ModelID">
          <el-input v-model="moldForm.ModelID" :disabled="true" />
        </el-form-item>

        <el-form-item label="模具名稱" prop="Name">
          <el-input v-model="moldForm.Name" :disabled="true" />
        </el-form-item>

        <el-form-item label="產品編號" prop="ProdId">
          <el-select v-model="moldForm.ProdId" placeholder="Select" :disabled="true">
            <el-option
              v-for="item in productList"
              :key="item.prodt_id"
              :label="item.prodt_name"
              :value="item.prodt_id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="模具穴數" prop="Hold">
          <el-input-number v-model="moldForm.Hold" :disabled="true" />
        </el-form-item>

        <el-form-item label="模具最大壽命限制" prop="MoldMaxLifeCycle">
          <el-input-number v-model="moldForm.MoldMaxLifeCycle" :disabled="true" />
        </el-form-item>

        <el-form-item label="模具累計實際總射出數" prop="MoldTotalInjection">
          <el-input-number v-model="moldForm.MoldTotalInjection" :disabled="true" />
        </el-form-item>

        <el-form-item label="模具最大射出模數" prop="MoldMaxLimit">
          <el-input-number v-model="moldForm.MoldMaxLimit" :disabled="true" />
        </el-form-item>

        <el-form-item label="模具累計射出模數" prop="MoldInjection">
          <el-input-number v-model="moldForm.MoldInjection" :disabled="true" />
        </el-form-item>

        <el-form-item label="啟用/停用" prop="mold_IsEnabled">
          <el-checkbox v-model="moldForm.IsEnabled" :disabled="true">啟用</el-checkbox>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="formShow = false">
          取消
        </el-button>
        <el-button type="primary" @click="submitForm()">
          送出
        </el-button>
        <el-button :type="ResetBtnType" :disabled="ResetBtnDisabled" @click="resetFormMold()">
          Reset
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCommoldList, update, updateMoldRelationData } from '@/api/Mold'
import { getProdtMaterialList } from '@/api/ProdtMaterials'
import Pagination from '@/components/Pagination'
export default {
  name: 'MoldTable',
  components: { Pagination },
  props: {
    moldBlock: {
      type: Number,
      default: function() {
        return 0
      }
    }
  },

  data() {
    return {
      title: null,

      result_obj: {
        total: 0,
        now_page: 1,
        per_page: 10,
        page_data: [],
        show_loading: false
      },

      productList: [],

      searchForm: {},

      moldForm: {},
      formShow: false,

      ResetBtnType: '',
      ResetBtnDisabled: true
    }
  },

  watch: {
    moldBlock(newValue) {
      this.moldBlock = newValue
    }
  },

  created() {
    this.getList()
    this.getProductList()
  },

  methods: {
    getList() {
      const vm = this
      const payload = {
        MoldBlock: vm.moldBlock,
        PageSize: vm.result_obj.per_page,
        CurrentPage: vm.result_obj.now_page,
        ModelID: vm.searchForm.ModelID,
        ModelName: vm.searchForm.ModelName,
        MoldStockID: vm.searchForm.MoldStockID
      }
      getCommoldList(payload)
        .then(response => {
          vm.result_obj.total = response.data.Pagination.Total
          vm.result_obj.page_data = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /** 表單對話框 */
    dataForm(row = {}) {
      this.title = '模具詳細資訊'
      this.formShow = true
      const new_obj = Object.assign({}, row)
      this.moldForm = Object.assign({}, new_obj)

      this.resetCondition()
    },

    /** 載入圖片 */
    loadImage(row = {}) {
      let url = null
      if (row.MoldPicList.length > 0) {
        row.MoldPicList.forEach(pic => {
          url = `http://${window.sunstige_conf.API_DOMAIN}/Mold/${row.ID}/${pic.PicName}`
        })
      }
      return url
    },

    /** 按下跳出對話框表單 */
    clickDataForm(row = {}) {
      this.dataForm(row)
    },

    condition1(row = {}) {
      // MoldTotalInjection（模具累計實際總射出數）達到MoldMaxLifeCycle（模具最大壽命限制）的80%
      var moldMaxLifeCycleUpper = row.MoldMaxLifeCycle * (80 / 100)
      var condition1 = row.MoldTotalInjection >= moldMaxLifeCycleUpper && moldMaxLifeCycleUpper !== 0
      return condition1
    },

    condition2(row = {}) {
      // MoldInjection（模具累計射出模數）大於等於MoldMaxLimit(模具最大射出模數設定值)
      var condition2 = row.MoldInjection >= row.MoldMaxLimit && row.MoldMaxLimit !== 0
      return condition2
    },

    condition3(row = {}) {
      // 模具狀態設定為故障送廠及需要保養
      var condition3 = row.MoldStatus === 2 || row.MoldStatus === 4
      return condition3
    },

    /**
     * Reset按鈕顯示條件
     */
    resetConditionForResetBtnType(row = {}) {
      if (this.condition1(row) || this.condition2(row) || this.condition3(row)) {
        return 'warning'
      } else {
        return ''
      }
    },

    /**
     * Reset按鈕啟用條件
     */
    resetConditionForResetBtnDisabled(row = {}) {
      if (this.condition1(row) || this.condition2(row) || this.condition3(row)) {
        return false
      } else {
        return true
      }
    },

    /** 重置 */
    resetMold(row = {}) {
      this.$confirm('確定要重置?', '注意！確定要重置?', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.condition1(row)) {
          row.MoldTotalInjection = 0
          row.MoldInjection = 0
        } else {
          if (this.condition2(row)) {
            row.MoldInjection = 0
          }
        }

        row.MoldStatus = 1
        const payload = row
        updateMoldRelationData(payload)
          .then(response => {
            this.$notify({
              title: '成功',
              message: '重置更新成功',
              type: 'success',
              duration: 2000
            })
            this.formShow = false
            this.getList()
          })
          .catch(err => {
            console.log(err)
          })
      })
    },

    /**
     * 送出表單
     */
    submitForm() {
      this.$refs['moldForm']
        .validate()
        .then(() => {
          const payload = this.moldForm

          update(payload)
            .then(response => {
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.formShow = false
              this.getList()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
          console.log(err, '表單檢查未過!!')
          return false
        })
    },

    /** 重置 */
    resetFormMold() {
      this.$confirm('確定要重置?', '注意！確定要重置?', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const vm = this

        if (this.formCondition1()) {
          vm.moldForm.MoldTotalInjection = 0
          vm.moldForm.MoldInjection = 0
        } else {
          if (this.formCondition2()) {
            vm.moldForm.MoldInjection = 0
          }
        }

        vm.moldForm.MoldStatus = 1
        const payload = vm.moldForm
        updateMoldRelationData(payload)
          .then(response => {
            this.$notify({
              title: '成功',
              message: '重置更新成功',
              type: 'success',
              duration: 2000
            })
            this.formShow = false
            this.getList()
          })
          .catch(err => {
            console.log(err)
          })
      })
    },

    formCondition1() {
      // MoldTotalInjection（模具累計實際總射出數）達到MoldMaxLifeCycle（模具最大壽命限制）的80%
      var moldMaxLifeCycleUpper = this.moldForm.MoldMaxLifeCycle * (80 / 100)
      var condition1 = this.moldForm.MoldTotalInjection >= moldMaxLifeCycleUpper && moldMaxLifeCycleUpper !== 0
      return condition1
    },

    formCondition2() {
      // MoldInjection（模具累計射出模數）大於等於MoldMaxLimit(模具最大射出模數設定值)
      var condition2 = this.moldForm.MoldInjection >= this.moldForm.MoldMaxLimit && this.moldForm.MoldMaxLimit !== 0
      return condition2
    },

    formCondition3() {
      // 模具狀態設定為故障送廠及需要保養
      var condition3 = this.moldForm.MoldStatus === 2 || this.moldForm.MoldStatus === 4
      return condition3
    },

    /**
     * Reset按鈕啟用條件
     */
    resetCondition() {
      if (this.formCondition1() || this.formCondition2() || this.formCondition3()) {
        this.ResetBtnType = 'warning'
        this.ResetBtnDisabled = false
      } else {
        this.ResetBtnType = ''
        this.ResetBtnDisabled = true
      }
    },

    /**
     * 取得產品列表
     */
    getProductList() {
      const vm = this
      const payload = {}
      getProdtMaterialList(payload)
        .then(response => {
          vm.productList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

