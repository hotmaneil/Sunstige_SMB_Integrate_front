<template>
  <div class="app-container">
    <h3>物料基本資料維護</h3>

    <!--search tools-->
    <el-row>
      <el-col :span="12">
        <el-form :model="searchForm" :inline="true">
          <el-form-item label="產品編號">
            <el-input v-model="searchForm.prodt_id" />
          </el-form-item>

          <el-form-item label="產品名稱">
            <el-input v-model="searchForm.prodt_name" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getList()">搜尋</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--table tools-->
    <el-row>
      <el-col :span="12">
        <div class="table-tools">
          <el-button type="success" plain icon="el-icon-edit" @click="dataForm('create')">新增</el-button>
        </div>
      </el-col>
    </el-row>

    <br>

    <!-- Table -->
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
      <el-table-column prop="prodt_id" label="產品編號" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.prodt_id }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="productTypeName" label="產品種類" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.productTypeName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="prodt_name" label="產品名稱" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.prodt_name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="Specification" label="產品規格說明" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.Specification }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="prodt_netWeight" label="產品淨重(g)" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.prodt_netWeight }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="stock_grossWeight" label="料架庫格產品實際總重(g)" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.stock_grossWeight }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="stock_warringWeight" label="料架庫格設定產品補料水位重量(g)" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.stock_warringWeight }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="stock_alarmWeight" label="料架庫格設定產品低存量重量(g)" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.stock_alarmWeight }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="stock_updateTime" label="料架更新產品重量時間" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.stock_updateTime|moment('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="total_warringWeight" label="料架上產品補料設定的總重量(g)" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.total_warringWeight }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="total_alarmWeight" label="料架上產品低存量設定的總重量(g)" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.total_alarmWeight }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="total_limitWeight" label="料架上產品最高上限設定的總重量(g)" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.total_limitWeight }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="hourly_count" label="產品每小時標準產量" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.hourly_count }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="dataForm('update', scope.row)" />
            <el-button type="danger" size="small" icon="el-icon-delete" @click="confirmDialog(scope.row)" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="result_obj.total>0" :total="result_obj.total" :page.sync="result_obj.now_page" :limit.sync="result_obj.per_page" @pagination="getList" />

    <!--表單-->
    <el-dialog :title="dialogTitle" :visible.sync="formShow" width="700px">
      <el-form
        ref="materialForm"
        :model="materialForm"
        label-position="right"
        label-width="230px"
        style="padding-left:10px;padding-right:10px;"
        :rules="validateRules"
      >
        <el-form-item label="產品編號" prop="prodt_id">
          <el-input v-model="materialForm.prodt_id" />
        </el-form-item>
        <el-form-item label="產品名稱" prop="prodt_name">
          <el-input v-model="materialForm.prodt_name" />
        </el-form-item>
        <el-form-item label="產品種類" prop="prodt_type">
          <el-select v-model="materialForm.prodt_type" placeholder="請選擇產品種類">
            <el-option v-for="item in ProductTypeList" :key="item.id" :label="item.value" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="產品規格說明" prop="Specification">
          <el-input v-model="materialForm.Specification" />
        </el-form-item>
        <el-form-item label="產品淨重" prop="prodt_netWeight">
          <el-input-number v-model="materialForm.prodt_netWeight" />
        </el-form-item>
        <el-form-item label="料架庫格產品實際總重" prop="stock_grossWeight">
          <el-input-number v-model="materialForm.stock_grossWeight" />
        </el-form-item>
        <el-form-item label="料架庫格設定產品補料水位重量" prop="stock_warringWeight">
          <el-input-number v-model="materialForm.stock_warringWeight" />
        </el-form-item>
        <el-form-item label="料架庫格設定產品低存量重量" prop="stock_alarmWeight">
          <el-input-number v-model="materialForm.stock_alarmWeight" />
        </el-form-item>
        <el-form-item label="料架更新產品重量時間" prop="stock_updateTime">
          <el-date-picker
            v-model="materialForm.stock_updateTime"
            type="datetime"
            placeholder="料架更新產品重量時間"
          />
        </el-form-item>
        <el-form-item label="料架上產品補料設定的總重量" prop="total_warringWeight">
          <el-input-number v-model="materialForm.total_warringWeight" />
        </el-form-item>
        <el-form-item label="料架上產品低存量設定的總重量" prop="total_alarmWeight">
          <el-input-number v-model="materialForm.total_alarmWeight" />
        </el-form-item>
        <el-form-item label="料架上產品最高上限設定的總重量" prop="total_limitWeight">
          <el-input-number v-model="materialForm.total_limitWeight" />
        </el-form-item>
        <el-form-item label="產品每小時標準產量" prop="hourly_count">
          <el-input-number v-model="materialForm.hourly_count" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formShow = false">
          取消
        </el-button>
        <el-button type="primary" @click="submitForm()">
          送出
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getProdtMaterialList,
  updateProdtMaterial,
  deleteProdtMaterial,
  getProductTypeList
} from '@/api/ProdtMaterials'
import Pagination from '@/components/Pagination'
export default {
  name: 'MaterialManage',
  components: { Pagination },
  data() {
    return {
      result_obj: {
        total: 0,
        now_page: 1,
        per_page: 10,
        page_data: [],
        show_loading: false
      },

      searchForm: {},
      materialForm: {},

      /** 顯示表單 */
      formShow: false,
      action: null,
      dialogTitle: null,

      validateRules: {
        prodt_id: [{ required: true, message: '產品編號為必要項', trigger: 'blur' }],
        prodt_name: [{ required: true, message: '產品名稱為必要項', trigger: 'blur' }],
        prodt_type: [{ required: true, message: '產品種類為必要項', trigger: 'blur' }],
        Specification: [{ required: true, message: '產品規格說明為必要項', trigger: 'blur' }]
      },

      ProductTypeList: []
    }
  },

  created() {
    this.getList()
    this.setProductTypeList()
  },

  methods: {

    /**
     * 取得物料列表
     */
    getList() {
      const vm = this
      const payload = {
        prodt_id: vm.searchForm.prodt_id,
        prodt_name: vm.searchForm.prodt_name,
        PageSize: vm.result_obj.per_page,
        CurrentPage: vm.result_obj.now_page
      }
      getProdtMaterialList(payload)
        .then(response => {
          vm.result_obj.total = response.data.Pagination.Total
          vm.result_obj.page_data = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 取得產品種類列表
     */
    setProductTypeList() {
      const vm = this
      getProductTypeList()
        .then(response => {
          vm.ProductTypeList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 取得資料表單
     */
    dataForm(action, row = {}) {
      console.log('action', action)
      switch (action) {
        case 'create':
          this.action = action
          this.formShow = true
          this.dialogTitle = '新增物料'
          this.materialForm = {}
          break

        case 'update':
          const new_obj = Object.assign({}, row)
          this.formShow = true
          this.action = action
          this.dialogTitle = '更新物料'
          this.materialForm = Object.assign({}, new_obj)
          break
      }
    },

    /**
     * 送出表單
     */
    submitForm() {
      this.$refs['materialForm']
        .validate()
        .then(() => {
          const payload = this.materialForm
          switch (this.action) {
            case 'create':
              console.log('create materialForm', this.materialForm)
              updateProdtMaterial(payload)
                .then(response => {
                  this.$notify({
                    title: '成功',
                    message: '新增成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.formShow = false
                  this.getList()
                })
                .catch(err => {
                  console.log(err)
                })
              break

            case 'update':
              console.log('update materialForm', this.materialForm)
              updateProdtMaterial(payload)
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
              break

            default:
              console.log(`undefined action: ${this.action}`)
          }
        })
        .catch(err => {
          console.log('表單檢查未過!!', err)
          return false
        })
    },

    /**
     * 刪除設備
     */
    confirmDialog(row = {}) {
      this.$confirm('確定要刪除?', '警告！', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const payload = {
          Id: row.prodt_id
        }
        deleteProdtMaterial(payload)
          .then(response => {
            this.$notify({
              title: '成功',
              message: '刪除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
          .catch(err => {
            console.log(err)
          })
      })
    }
  }
}
</script>
