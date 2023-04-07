<template>
  <div>
    <h5>程式列表</h5>
    <el-table
      :data="programList"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :default-sort="{ prop: 'id', order: 'ascending' }"
    >
      <el-table-column
        prop="id"
        label="ID"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="程式名稱" sortable="custom" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

       <el-table-column
        prop="Memo"
        label="備註"
        align="center"
        sortable="custom"
        width="220"
      >
        <template slot-scope="{ row }">
          {{ row.Memo }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="功能">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-download"
              @click="dataForm('update', scope.row)"
            >下載
            </el-button>
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <h5>上傳程式名稱</h5>
    <!-- action="" -->
    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="3"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <el-button size="small" type="primary">程式上傳</el-button>
      <div slot="tip" class="el-upload__tip"></div>
    </el-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
      programList:[
        {
          id:1,
          name:'機台測試程式'
        }
      ]
    }
  },

  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `The limit is 3, you selected ${files.length} files this time, add up to ${files.length +
          fileList.length} totally`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`Cancel the transfert of ${file.name} ?`)
    },
  },
}
</script>
