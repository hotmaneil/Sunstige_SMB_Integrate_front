<template>
  <div class="app-container">

    <el-row>
      <el-col :span="22">
        <h3>{{ this.$route.params.Id }}</h3>
      </el-col>
      <el-col :span="2">
        <el-button @click="back()">返回</el-button>
      </el-col>
    </el-row>

    <!-- Table -->
    <el-table
      :data="deviceDIList"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :default-sort="{ prop: 'id', order: 'ascending' }"
    >
      <el-table-column
        prop="sequence"
        label="順序"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.sequence }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="purpose" label="用途" sortable="custom">
        <template slot-scope="{ row }">
          <el-input v-model="row.purpose" />
          <!-- <span>{{ row.purpose }}</span> -->
        </template>
      </el-table-column>

      <el-table-column
        prop="type"
        label="型態"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <el-select v-model="row.type.value" placeholder="Select">
            <el-option
              v-for="item in typeOptionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="confirmDialog(scope.row)"
            >更新
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 確認對話框 -->
    <!-- <el-dialog
      title="Tips"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>確定要更新?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >確定</el-button
        >
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { getDIByID, updateDI } from '@/api/SMBDevice'

export default {
  components: {},
  data() {
    return {
      deviceDIList: [],

      /** 型態下拉選單 */
      typeOptionList: [
        {
          value: 1,
          label: 'DI'
        },
        {
          value: 2,
          label: 'Counter'
        }
      ],

      dialogVisible: false,

      deviceId: null
    }
  },

  created() {
    this.getDeviceDIList()
  },

  methods: {
    /**
     * 依照機台ID取得機台DI列表
     */
    getDeviceDIList() {
      console.log('this.$route.params.Id', this.$route.params.Id)
      const vm = this
      const paylaod = {
        Id: this.$route.params.Id
      }
      getDIByID(paylaod)
        .then(response => {
          vm.deviceDIList = response.data.Payload
          vm.deviceId = this.$route.params.Id
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 確認視窗
     */
    confirmDialog(row = {}) {
      this.$confirm('確定要更新?', '警告！', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const payload = {
            id: row.id,
            device_id: this.deviceId,
            sequence: row.sequence,
            purpose: row.purpose,
            type: row.type.value
          }

          console.log('payload', payload)

          updateDI(payload)
            .then(response => {
              this.$message({
                type: 'success',
                message: '更新成功'
              })
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消更新'
          })
        })
    },

    /** 回上一頁 */
    back() {
      history.go(-1)
    }

  }
}
</script>
