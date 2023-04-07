<template>
  <div class="app-container">
    <h3>機台管理 (I/O模組)</h3>

    <!--table tools-->
    <div class="table-tools">
      <el-button type="success" plain icon="el-icon-edit" @click="callDataForm('create')">新增機台 </el-button>
    </div>

    <!-- Table -->
    <el-table
      :data="deviceList"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :default-sort="{ prop: 'id', order: 'ascending' }"
    >
      <el-table-column prop="id" label="機台代號" align="center" width="110">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="ip" label="機台IP" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.ip }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="機台名稱" align="center" width="110">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="catch_speed" label="catch速度" align="center" width="110">
        <template slot-scope="{ row }">
          {{ row.catch_speed }}
        </template>
      </el-table-column>

      <el-table-column
        prop="countchange_time"
        label="無燈號有效生產判斷時間(分)"
        align="center"
        sortable="custom"
        width="220"
      >
        <template slot-scope="{ row }">
          {{ row.countchange_time }}
        </template>
      </el-table-column>

      <el-table-column prop="isadam" label="是否ADAM" align="center" width="110">
        <template slot-scope="{ row }">
          {{ row.isadam|enableText }}
        </template>
      </el-table-column>

      <el-table-column prop="isEnable" label="啟用" align="isEnable" width="110">
        <template slot-scope="{ row }">
          <span>{{ row.isEnable | enableText }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="pdf" label="設備保養手冊" align="center">
        <template slot-scope="{ row }">
          <a :href="setHref(row)" target="_blank">{{ row.pdf }}</a>
        </template>
      </el-table-column>

      <el-table-column prop="sequence" label="順序" align="center">
        <template slot-scope="{ row }">
          {{ row.sequence }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="callDataForm('update', scope.row)" />

            <el-button v-show="scope.row.isadam===true" type="primary" size="small" icon="el-icon-edit" @click="callDataForm('DISetting', scope.row)">
              DI定義
            </el-button>

            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="callDataForm('statusSetting', scope.row)"
            >
              狀態設定
            </el-button>

            <el-button type="danger" size="small" icon="el-icon-delete" @click="confirmDialog(scope.row)" />

          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!--表單-->
    <el-dialog :title="dialogTitle" :visible.sync="formShow" width="700px">
      <el-form
        ref="deviceForm"
        :model="deviceForm"
        label-position="right"
        label-width="110px"
        style="padding-left:10px;padding-right:10px;"
        :rules="validateRules"
      >
        <el-form-item label="機台代號" prop="id">
          <el-input v-model="deviceForm.id" :readonly="formReadonly" />
        </el-form-item>
        <el-form-item label="機台IP" prop="ip">
          <el-input v-model="deviceForm.ip" />
        </el-form-item>
        <el-form-item label="機台名稱" prop="name">
          <el-input v-model="deviceForm.name" />
        </el-form-item>
        <el-form-item label="catch速度" prop="catch_speed">
          <el-input v-model="deviceForm.catch_speed" />
        </el-form-item>
        <el-form-item label="無燈號有效生產判斷時間" prop="countchange_time">
          <el-input v-model="deviceForm.countchange_time" />
        </el-form-item>
        <el-form-item label="使用ADAM設備" prop="isadam">
          <el-checkbox v-model="deviceForm.isadam">是</el-checkbox>
        </el-form-item>
        <el-form-item label="啟用" prop="isEnable">
          <el-checkbox v-model="deviceForm.isEnable">啟用</el-checkbox>
        </el-form-item>
        <el-form-item label="順序" prop="sequence">
          <el-input-number v-model="deviceForm.sequence" />
        </el-form-item>

        <el-form-item label="設備類型" prop="Category">
          <el-select
            v-model="deviceForm.Category"
            placeholder="please select category"
            style="width: 100%"
            @change="OnSelectCategoryChange()"
          >
            <el-option v-for="item in categoryList" :key="item.name" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="圖片" prop="DevicePicture">
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

        <el-form-item v-if="deviceForm.id!==null" label="設備保養手冊" prop="PDF">
          <el-upload
            class="upload-demo"
            :action="uploadPDFUrl"
            :on-preview="handlePreviewPDF"
            :on-remove="handleRemovePDF"
            :before-remove="beforeRemovePDF"
            :on-success="onSuccessPDF"
            multiple
            :limit="1"
            :on-exceed="handleExceedPDF"
            :file-list="pdfFileList"
          >
            <el-button size="small" type="primary">上傳設備保養手冊</el-button>
            <div slot="tip" class="el-upload__tip">只限pdf檔</div>
          </el-upload>
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
  getList,
  update,
  deleteDevice,
  deleteDeviceImages,
  getDeviceByID,
  deletePDF
} from '@/api/SMBDevice'

export default {
  components: {},
  filters: {
    /** 是否啟用顯示值 */
    enableText: function(value) {
      if (value) return 'Y'
      else return 'N'
    }
  },
  data() {
    return {
      deviceList: [],
      deviceForm: {},

      /** 顯示表單 */
      formShow: false,
      action: null,
      formReadonly: true,

      /** 驗證表單規則 */
      validateRules: {
        id: [{ required: true, message: '機台代號為必要項', trigger: 'blur' }],
        ip: [{ required: true, message: '機台名稱為必要項', trigger: 'blur' }],
        name: [{ required: true, message: '機台名稱為必要項', trigger: 'blur' }],
        catch_speed: [{ required: true, message: 'catch速度為必要項', trigger: 'blur' }],
        countchange_time: [{ required: true, message: '無燈號有效生產判斷時間', trigger: 'blur' }],
        Category: [{ required: true, message: '設備類型為必選', trigger: 'blur' }]
      },

      /**
       * 設備種類列表
       */
      categoryList: [],

      dialogTitle: '',

      /** 上傳圖片api */
      imageUrl: `http://${window.sunstige_conf.API_DOMAIN}//api/Device/UploadImage`,

      /** 檔案列表 */
      fileList: [],
      deleteFileList: [],
      deleteFileForm: {
        DeviceId: null,
        DevicePicList: []
      },

      /** 單一圖檔 */
      imageId: null,
      picture: null,
      dialogImageUrl: '',
      dialogVisible: false,
      successUpload: false,

      /** PDF用 */
      pdfFileList: [],
      uploadPDFUrl: null
    }
  },

  created() {
    this.getDeviceList()
    this.setCategoryList()
  },
  methods: {
    /**
     * 建立設備種類列表
     */
    setCategoryList() {
      const vm = this
      vm.categoryList.push({ name: '射出機', value: 'Roboshot' })
      vm.categoryList.push({ name: 'CNC', value: 'CNC' })
      vm.categoryList.push({ name: 'PLC', value: 'PLC' })
    },

    /**
     * 取得機台列表
     */
    getDeviceList() {
      const vm = this
      const paylaod = {
        isEnable: null
      }
      getList(paylaod)
        .then(response => {
          // console.log("response.Payload", response.data.Payload);
          vm.deviceList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 取得資料表單
     */
    callDataForm(action, row = {}) {
      console.log('action', action)

      switch (action) {
        case 'create':
          this.action = action
          this.formShow = true
          this.formReadonly = false
          this.resetData()
          this.dialogTitle = '新增機台'
          break

        case 'update':
          const new_obj = Object.assign({}, row)
          this.formShow = true
          this.action = action
          this.deviceForm = Object.assign({}, new_obj)
          this.formReadonly = true
          this.dialogTitle = '編輯機台'

          this.pdfFileList = []
          if (this.deviceForm.pdf === null || this.deviceForm.pdf === '') {
            console.log('無PDF')
          } else {
            var pdfFileUrl = {
              name: this.deviceForm.pdf,
              url: `http://${window.sunstige_conf.API_DOMAIN}/DevicePDF/${row.id}/${this.deviceForm.pdf}`
            }
            this.pdfFileList.push(pdfFileUrl)
          }

          this.uploadPDFUrl = `http://${window.sunstige_conf.API_DOMAIN}//api/Device/UploadPDF?DeviceId=${this.deviceForm.id}`

          this.fileList = []
          if (row.DevicePicList.length > 0) {
            row.DevicePicList.forEach(pic => {
              this.fileList.push({
                name: pic.Picture,
                url: `http://${window.sunstige_conf.API_DOMAIN}/Device/${row.id}/${pic.PicName}`
              })
            })
          }
          break

        case 'DISetting':
          const DISettingProps = this.$router.resolve({
            name: 'DeviceDI',
            params: { Id: row.id }
          })
          this.$router.push(DISettingProps.route.fullPath)
          break

        case 'statusSetting':
          const statusSettingProps = this.$router.resolve({
            name: 'DeviceStatusSetting',
            params: { Id: row.id }
          })
          console.log('statusSettingProps', statusSettingProps)
          this.$router.push(statusSettingProps.route.fullPath)
          break
      }
    },

    setHref(row = {}) {
      var href = `http://${window.sunstige_conf.API_DOMAIN}/DevicePDF/${row.id}/${row.pdf}`
      return href
    },

    /**
     * 送出表單
     */
    submitForm() {
      this.$refs['deviceForm']
        .validate()
        .then(() => {
          const payload = this.deviceForm
          switch (this.action) {
            case 'create':
              console.log('create deviceForm', this.deviceForm)
              this.updateDevice(payload)
              // update(payload)
              //   .then(response => {
              //     this.$notify({
              //       title: '成功',
              //       message: '新增成功',
              //       type: 'success',
              //       duration: 2000
              //     })
              //     this.resetData()
              //     this.getDeviceList()
              //     this.formShow = false
              //   })
              //   .catch(err => {
              //     console.log(err)
              //   })
              break

            case 'update':
              console.log('update deviceForm', this.deviceForm)
              this.deleteEquipmentImages()
              this.updateDevice(payload)
              // update(payload)
              //   .then(response => {
              //     this.$notify({
              //       title: '成功',
              //       message: '更新成功',
              //       type: 'success',
              //       duration: 2000
              //     })
              //     this.resetData()
              //     this.getDeviceList()
              //     this.formShow = false
              //   })
              //   .catch(err => {
              //     console.log(err)
              //   })
              break
            default:
              console.log(`undefined action: ${this.action}`)
          }
        })
        .catch(err => {
          console.log(err, '表單檢查未過!!')
          return false
        })
    },

    /**
     * 更新設備基本資料與上傳圖片
     */
    updateDevice(payload) {
      update(payload)
        .then(response => {
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
          this.resetData()
          this.getDeviceList()
          this.formShow = false

          // 取得該筆資料的ID
          this.imageId = response.data.Payload

          // 上傳圖片
          this.newSubmitForm()
        })
        .catch(err => {
          console.log('updateDevice err', err)
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
          Id: row.id
        }
        deleteDevice(payload)
          .then(response => {
            this.$notify({
              title: '成功',
              message: '刪除成功',
              type: 'success',
              duration: 2000
            })
            this.getDeviceList()
          })
          .catch(err => {
            console.log(err)
          })
      })
    },

    /**
     * 重設表單
     */
    resetData() {
      this.deviceForm = {
        id: null,
        ip: null,
        name: null,
        catch_speed: null,
        countchange_time: null,
        isadam: false,
        isEnable: false
      }
    },

    /** 上傳圖檔 */
    beforeUpload(file) {
      const formData = new FormData()
      if (file.uid !== undefined) {
        this.successUpload = true
      }
      formData.append('file', file)
      console.log('formData', formData)
      formData.append('DeviceId', this.imageId)
      // formData.append('ModelID', this.moldForm.ID)
      console.log('formData DeviceId', formData.get('DeviceId'))
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
          this.getDeviceList()
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
      this.formShow = false
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
     * 刪除設備圖片
     */
    deleteEquipmentImages() {
      const picList = this.deviceForm.DevicePicList
      if (this.deleteFileList.length > 0) {
        picList.forEach(pic => {
          this.deleteFileList.forEach(file => {
            const indexOfFirst = file.fileUrl.lastIndexOf('/')
            var str = file.fileUrl.substring(indexOfFirst + 1)
            if (str === pic.PicName) {
              this.deleteFileForm.DevicePicList.push(pic)
              this.deleteFileForm.DeviceId = this.deviceForm.id
            }
          })
        })

        console.log('deleteEquipmentImages deleteFileForm', this.deleteFileForm)

        deleteDeviceImages(this.deleteFileForm)
          .then(response => {
            this.deleteFileList = []
          })
          .catch(err => {
            const server_msg = err.response.data.Message
            alert('更新失敗 : ' + server_msg)
          })
      }
    },

    /** PDF function */
    handleRemovePDF(file, fileList) {
      console.log('handleRemovePDF')
      console.log(file, fileList)
      const vm = this
      const payload = {
        Id: vm.deviceForm.id
      }
      deletePDF(payload)
        .then(response => {
          console.log('deletePDF response', response)
          if (response.status === 200) {
            this.$message({
              type: 'success',
              message: '刪除檔案成功!'
            })

            getDeviceByID(payload)
              .then(response => {
                console.log('getDeviceByID response.data.Payload', response.data.Payload)
                vm.deviceForm.pdf = response.data.Payload.pdf
              })
              .catch(err => {
                console.log(err)
              })
          }
        }).catch(err => {
          console.log(err)
        })
    },
    handlePreviewPDF(file) {
      console.log('handlePreviewPDF', file)
    },
    handleExceedPDF(files, fileList) {
      this.$message.warning(`只限一個檔案, 你選的檔案數 ${files.length} , 已加進總共 ${files.length + fileList.length}檔案數超過限制 `)
    },
    beforeRemovePDF(file, fileList) {
      return this.$confirm(`確定移除該檔案 ${file.name} ?`)
    },

    /** 上傳PDF成功更新表單 */
    onSuccessPDF() {
      console.log('onSuccessPDF')
      const vm = this
      const paylaod = {
        Id: vm.deviceForm.id
      }

      getDeviceByID(paylaod)
        .then(response => {
          console.log('getDeviceByID response.data.Payload', response.data.Payload)
          vm.deviceForm.pdf = response.data.Payload.pdf
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
