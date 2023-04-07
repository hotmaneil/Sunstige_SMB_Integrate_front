<template>
  <div class="app-container">
    <h3>模具區塊管理</h3>

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
      :data="moldblockList"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :default-sort="{ prop: 'id', order: 'ascending' }"
    >
      <el-table-column prop="code" label="代號" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名稱" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
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

    <!--表單-->
    <el-dialog :title="title" :visible.sync="formShow">
      <el-form
        ref="moldBlockForm"
        :model="moldBlockForm"
        :rules="validateRules"
      >
        <el-form-item label="代號" prop="code">
          <el-input v-model="moldBlockForm.code" />
        </el-form-item>

        <el-form-item label="名稱" prop="name">
          <el-input v-model="moldBlockForm.name" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()">
          儲存
        </el-button>
        <el-button @click="formShow = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import {
  getMoldBlockEnumList,
  updateMoldBlock,
  deleteMoldBlock
} from '@/api/Mold'

export default {
  name: 'MoldblockManage',
  data() {
    return {
      action: null,
      formShow: false,
      moldblockList: [],
      moldBlockForm: {},
      title: null,

      validateRules: {
        code: [{ required: true, message: '代號為必要項', trigger: 'blur' }],
        name: [{ required: true, message: '名稱為必要項', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.getList()
  },

  methods: {
    getList() {
      const vm = this
      getMoldBlockEnumList()
        .then(response => {
          vm.moldblockList = response.data.Payload
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
          this.title = '新增模具區塊'
          this.resetData()
          break

        case 'update':
          const new_obj = Object.assign({}, row)
          this.formShow = true
          this.action = action
          this.title = '更新模具區塊'
          this.moldBlockForm = Object.assign({}, new_obj)
          break
      }
    },

    /**
     * 送出表單
     */
    submitForm() {
      this.$refs['moldBlockForm']
        .validate()
        .then(() => {
          const payload = this.moldBlockForm

          updateMoldBlock(payload)
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

    /**
     * 確認刪除視窗
     */
    confirmDeleteDialog(row = {}) {
      this.$confirm('確定要刪除?', '注意！確定要刪除?', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        const payload = {
          Id: row.id
        }
        deleteMoldBlock(payload).then(response => {
          this.$message({
            type: 'success',
            message: '刪除成功'
          })
          this.getList()
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消刪除'
        })
      })
    },

    /**
     * 重設表單
     */
    resetData() {
      this.moldBlockForm = {}
    }
  }
}
</script>
