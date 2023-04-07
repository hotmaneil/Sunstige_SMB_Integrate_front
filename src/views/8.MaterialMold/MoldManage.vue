<template>
  <div class="app-container">
    <h3>模具基本資料維護</h3>

    <!--search tools-->
    <el-row>
      <el-col :span="12">
        <el-form :model="searchForm" :inline="true">
          <el-form-item label="模具編號">
            <el-input v-model="searchForm.ModelID" />
          </el-form-item>

          <el-form-item label="模具名稱">
            <el-input v-model="searchForm.ModelName" />
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

      <el-table-column prop="ProductName" label="產品名稱" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.ProductName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="IsEnabled" label="啟用/停用" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.IsEnabled|isEnabledFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="MoldStockID" label="模具庫格編號" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.MoldStockID }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="Hold" label="模具穴數" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.Hold }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="CycleTime" label="標準週期(秒)" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.CycleTime }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="MoldStatusName" label="模具健康狀態" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.MoldStatusName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="UpdateTime" label="模具資料更新時間" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.UpdateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="MoldMaxLifeCycle" label="模具最大壽命限制" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.MoldMaxLifeCycle }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="MoldMaxLimit" label="模具最大射出模數" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.MoldMaxLimit }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="dataForm('update', scope.row)" />
            <el-button type="danger" size="small" icon="el-icon-delete" @click="confirmDeleteDialog(scope.row)" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="result_obj.total>0" :total="result_obj.total" :page.sync="result_obj.now_page" :limit.sync="result_obj.per_page" @pagination="getList" />

    <!--表單-->
    <el-dialog :title="title" :visible.sync="formShow" width="1024px">
      <el-form
        ref="moldForm"
        :inline="true"
        :model="moldForm"
        label-position="right"
        label-width="210px"
        style="padding-left:0px;padding-right:10px;"
        :rules="validateRules"
        class="demo-form-inline"
      >
        <el-form-item label="模具編號" prop="ModelID">
          <el-input v-model="moldForm.ModelID" />
        </el-form-item>

        <el-form-item label="模具名稱" prop="Name">
          <el-input v-model="moldForm.Name" />
        </el-form-item>

        <el-form-item label="模具區塊" prop="MoldBlock">
          <el-select v-model="moldForm.MoldBlock" placeholder="請選擇模具區塊">
            <el-option v-for="item in moldBlockList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="模具健康狀態" prop="MoldStatus">
          <el-select v-model="moldForm.MoldStatus" placeholder="請選擇模具健康狀態" disabled>
            <el-option v-for="item in moldStatusList" :key="item.Id" :label="item.Name" :value="item.Id" />
          </el-select>
        </el-form-item>

        <el-form-item label="模具穴數" prop="Hold">
          <el-input-number v-model="moldForm.Hold" />
        </el-form-item>

        <el-form-item label="標準週期(秒)" prop="CycleTime">
          <el-input-number v-model="moldForm.CycleTime" />
        </el-form-item>

        <el-form-item label="噸數" prop="Tonnage">
          <el-input-number v-model="moldForm.Tonnage" />
        </el-form-item>

        <el-form-item label="可用次數" prop="CanUseCount">
          <el-input-number v-model="moldForm.CanUseCount" />
        </el-form-item>

        <el-form-item label="安全存量" prop="SafetyStock">
          <el-input-number v-model="moldForm.SafetyStock" />
        </el-form-item>

        <el-form-item label="保養工時" prop="MaintainWorkHour">
          <el-input-number v-model="moldForm.MaintainWorkHour" />
        </el-form-item>

        <!--隱藏起來-->
        <!-- <el-form-item label="設備" prop="MoldMachineList">
          <el-select v-model="moldForm.MachineList" multiple placeholder="請選擇設備">
            <el-option v-for="item in deviceList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item> -->

        <el-form-item label="圖片" prop="moldPicture">
          <el-upload
            ref="upload"
            style="width:700px;hight:270px"
            :action="imageUrl"
            list-type="picture-card"
            accept="image/png, image/jpg, image/jpeg"
            :before-upload="beforeUpload"
            :on-change="fileChange"
            :on-success="handleAvatarSuccess"
            :on-error="error"
            :on-remove="handleRemove"
            :on-preview="handlePictureCardPreview"
            :auto-upload="false"
            :file-list="fileList"
            :before-remove="beforeRemove"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>

        <el-form-item label="啟用/停用" prop="mold_IsEnabled">
          <el-checkbox v-model="moldForm.IsEnabled">啟用</el-checkbox>
        </el-form-item>

        <el-divider />

        <el-form-item label="供應商編號" prop="VendorCode">
          <el-input v-model="moldForm.VendorCode" />
        </el-form-item>

        <el-form-item label="供應商名稱" prop="VendorName">
          <el-input v-model="moldForm.VendorName" />
        </el-form-item>

        <el-form-item label="客戶編號" prop="CustomerCode">
          <el-input v-model="moldForm.CustomerCode" />
        </el-form-item>

        <el-form-item label="客戶名稱" prop="CustName">
          <el-input v-model="moldForm.CustName" />
        </el-form-item>

        <el-form-item label="模具庫格編號" prop="MoldStockID">
          <el-input v-model="moldForm.MoldStockID" />
        </el-form-item>

        <el-form-item label="模具庫格啟用/停用" prop="mold_MoldStockEnabled">
          <el-checkbox v-model="moldForm.MoldStockEnabled">啟用</el-checkbox>
        </el-form-item>

        <el-form-item label="產品編號" prop="ProdId">
          <el-select v-model="moldForm.ProdId" placeholder="Select">
            <el-option v-for="item in productList" :key="item.prodt_id" :label="item.prodt_name" :value="item.prodt_id" />
          </el-select>
        </el-form-item>

        <el-divider />

        <el-form-item label="模具最大射出模數" prop="MoldMaxLimit">
          <el-input-number v-model="moldForm.MoldMaxLimit" />
        </el-form-item>

        <el-form-item label="模具最大壽命限制" prop="MoldMaxLifeCycle">
          <el-input-number v-model="moldForm.MoldMaxLifeCycle" />
        </el-form-item>

        <el-form-item label="單次射出模數" prop="MoldInjection">
          <el-input-number v-model="moldForm.MoldInjection" disabled />
        </el-form-item>

        <el-form-item label="累計實際總射出數" prop="MoldTotalInjection">
          <el-input-number v-model="moldForm.MoldTotalInjection" disabled />
        </el-form-item>

        <el-form-item label="備註" prop="Remark">
          <el-input v-model="moldForm.Remark" type="textarea" />
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
  getCommoldList,
  getMoldBlockEnumList,
  getMoldStatusEnumList,
  update,
  deleteMold,
  deleteImages } from '@/api/Mold'
import { getProdtMaterialList } from '@/api/ProdtMaterials'
import { getList } from '@/api/SMBDevice'
import Pagination from '@/components/Pagination'
export default {
  name: 'MoldManage',
  components: { Pagination },
  filters: {
    isEnabledFilter(value) {
      if (value === true) {
        return '是'
      } else {
        return '否'
      }
    }
  },
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

      title: null,
      moldForm: {},

      productList: [],

      /** 設備列表 */
      deviceList: [],

      /** 模具區塊列表 */
      moldBlockList: [],

      /** 模具狀態列表 */
      moldStatusList: [],

      /** 顯示表單 */
      formShow: false,
      action: null,

      validateRules: {
        ModelID: [{ required: true, message: '模具編號為必要項', trigger: 'blur' }],
        Name: [{ required: true, message: '模具名稱為必要項', trigger: 'blur' }],
        MoldBlock: [{ required: true, message: '請選擇模具區塊', trigger: 'blur' }]
      },

      imageUrl: `http://${window.sunstige_conf.API_DOMAIN}//api/Commold/UploadImage`,

      /** 檔案列表 */
      fileList: [],
      deleteFileList: [],
      deleteFileForm: {
        MoldID: null,
        MoldpicList: []
      },

      /** 單一圖檔 */
      imageId: null,
      picture: null,
      dialogImageUrl: '',
      dialogVisible: false,
      successUpload: false
    }
  },

  created() {
    this.getList()
    this.getDeviceList()
    this.getProductList()
    this.getMoldBlockList()
    this.getMoldStatusList()
  },

  methods: {
    /**
     * 取得模具列表
     */
    getList() {
      const vm = this
      const payload = {
        ModelID: vm.searchForm.ModelID,
        ModelName: vm.searchForm.ModelName,
        PageSize: vm.result_obj.per_page,
        CurrentPage: vm.result_obj.now_page
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
          this.title = '新增模具'
          this.moldForm = {}
          this.fileList = []
          break

        case 'update':
          const new_obj = Object.assign({}, row)
          this.formShow = true
          this.action = action
          this.title = '更新模具'
          this.moldForm = Object.assign({}, new_obj)

          this.fileList = []
          if (row.MoldPicList.length > 0) {
            row.MoldPicList.forEach(pic => {
              this.fileList.push({
                name: pic.Picture,
                url: `http://${window.sunstige_conf.API_DOMAIN}/Mold/${row.ID}/${pic.PicName}`
              })
            })
          }
          break
      }
    },

    /**
     * 送出表單
     */
    submitForm() {
      this.$refs['moldForm']
        .validate()
        .then(() => {
          switch (this.action) {
            case 'create':
              console.log('create new record')
              this.updateMold()
              break
            case 'update':
              console.log('update record')
              this.deleteMoldImages()
              this.updateMold()
              break
          }
        })
        .catch(err => {
          console.log(err, '表單檢查未過!!')
          return false
        })
    },

    /**
     * 更新模具基本資料與上傳圖片
     */
    updateMold() {
      const payload = this.moldForm
      update(payload)
        .then(response => {
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
          this.resetData()
          this.getList()
          this.formShow = false

          // 取得該筆資料的ID
          this.imageId = response.data.Payload

          // 上傳圖片
          this.newSubmitForm()
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 重設表單
     */
    resetData() {
      this.formShow = false
      this.moldForm = {}
    },

    /**
     * 確認刪除視窗
     */
    confirmDeleteDialog(row = {}) {
      this.$confirm('確定要刪除?', '注意！確定要刪除?', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'danger'
      })
        .then(() => {
          const payload = {
            Id: row.ID
          }
          deleteMold(payload)
            .then(response => {
              this.$message({
                type: 'success',
                message: '刪除成功'
              })
              this.getList()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消刪除'
          })
        })
    },

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
    },

    /** 取得模具健康狀態enum列表 */
    getMoldStatusList() {
      const vm = this
      getMoldStatusEnumList()
        .then(response => {
          vm.moldStatusList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /** 上傳圖檔 */
    beforeUpload(file) {
      const formData = new FormData()
      if (file.uid !== undefined) {
        this.successUpload = true
      }
      formData.append('file', file)
      console.log('formData', formData)
      formData.append('ModelID', this.imageId)
      // formData.append('ModelID', this.moldForm.ID)
      console.log('formData ModelID', formData.get('ModelID'))
      const url = this.imageUrl
      this.$http
        .post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(response => {
          console.log(response.data)
          this.resetData()
          this.getList()
        })
    },

    newSubmitForm() {
      this.$refs.upload.submit()
    },

    /** 檔案上傳變更觸發 */
    fileChange(file, fileList) {
      this.fileList = fileList
    },

    handleAvatarSuccess(response, file, fileList) {
      this.dataForm.show = false
    },

    error(err, file, fileList) {
      console.log('error', err)
      // this.$message.error('圖片上傳失敗')
    },

    handleRemove(file) {
      console.log('handleRemove file', file)
      this.deleteFileList.push({ fileUrl: file.url })
      this.dialogVisible = false
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    beforeRemove(file) {
      return this.$confirm('確定刪除此圖片嗎?', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '刪除成功'
        })
        true
      }).catch(() => {
        return Promise.reject()
      })
    },

    /**
     * 刪除模具圖片
     */
    deleteMoldImages() {
      const picList = this.moldForm.MoldPicList
      if (this.deleteFileList.length > 0) {
        picList.forEach(pic => {
          this.deleteFileList.forEach(file => {
            const indexOfFirst = file.fileUrl.lastIndexOf('/')
            var str = file.fileUrl.substring(indexOfFirst + 1)
            if (str === pic.PicName) {
              this.deleteFileForm.MoldpicList.push(pic)
              this.deleteFileForm.MoldID = this.moldForm.ID
            }
          })
        })

        deleteImages(this.deleteFileForm)
          .then(response => {
            this.deleteFileList = []
          })
          .catch(err => {
            const server_msg = err.response.data.Message
            alert('更新失敗 : ' + server_msg)
          })
      }
    }
  }
}
</script>
