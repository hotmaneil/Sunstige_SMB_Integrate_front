<template>
  <el-dialog v-loading="listLoading" title="Setting" :visible.sync="dialog" width="80%" @close="CancelEdit(formModel)">
    <div slot="title" class="header-title">
      <span style="padding: 3px 0"> {{ formModel.EquipmentID }} </span>
      <span style="padding: 3px 0"> {{ formModel.EquipmentName }} </span>
      <span style="padding: 3px 0"> {{ formModel.EquipmentType }} </span>
    </div>

    <el-form ref="formModel" :model="formModel" label-width="120px">
      <el-form-item label="Name" :label-width="formLabelWidth">
        <el-input v-model="formModel.EquipmentName" class="edit-input" size="small" />
      </el-form-item>

      <el-form-item label="Sort" :label-width="formLabelWidth">
        <el-input-number
          v-model="formModel.SortID"
          :min="1"
          :max="99999"
          label="Sort"
          size="small"
          class="edit-input"
        />
      </el-form-item>

      <el-form-item label="顯示" :label-width="formLabelWidth">
        <el-switch
          v-model="formModel.IsDisplay"
          :label-width="formLabelWidth"
          active-color="#13ce66"
          active-text="顯示在總表"
          inactive-color="#ff4949"
        />
      </el-form-item>

      <el-form-item label="種類" :label-width="formLabelWidth">
        <el-select v-model="formModel.Category" placeholder="please select category" style="width: 100%">
          <el-option v-for="item in categoryList" :key="item.name" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialog = false">取 消</el-button>
      <el-button type="primary" @click="ConfirmEdit(formModel)">確 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateItem, updateEquipment } from '@/api/Equipments'

export default {
  props: {
    model: {
      type: Object,
      default: null
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      formModel: {},
      dialog: false,
      formLabelWidth: '120px',
      activeNames: [],
      listLoading: false,

      /**
       * 設備種類列表
       */
      categoryList: []
    }
  },
  watch: {
    isVisible(newValue) {
      this.dialog = newValue
      if (newValue) {
        console.log('isVisible', this.model)
        this.formModel = Object.assign({}, this.model)
      }
    }
  },

  created() {
    this.setCategoryList()
  },

  methods: {
    CancelEdit(row) {
      this.dialog = false
      this.$emit('onDialogVisible', false, null)
    },
    async ConfirmEdit(row) {
      console.log('ConfirmEdit', row)
      var newrow = Object.assign({}, row)

      this.listLoading = true
      const payload = {
        EquipmentID: newrow.EquipmentID,
        EquipmentName: newrow.EquipmentName,
        IsDisplay: newrow.IsDisplay,
        SortID: newrow.SortID,
        Category: newrow.Category
      }
      await updateEquipment(payload)
        .then(response => {
          this.$message({
            message: 'The data has been update',
            type: 'success'
          })
          this.listLoading = false
          this.dialog = false
          this.$emit('onDialogVisible', false, newrow.EquipmentID)
        })
        .catch(error => {
          console.error(error)
          this.listLoading = false
        })
    },

    /**
     * 建立設備種類列表
     */
    setCategoryList() {
      const vm = this
      vm.categoryList.push({ name: 'ROBOSHOT', value: 'ROBOSHOT' })
      vm.categoryList.push({ name: 'CNC', value: 'CNC' })
      vm.categoryList.push({ name: 'PLC', value: 'PLC' })
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
}

.text {
  font-size: 14px;
}

.item {
  margin-top: 5px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.box-card {
  margin-bottom: 0px;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.block {
  padding: 10px 8px;
  overflow: hidden;
  border-bottom: 1px solid #eff2f6;
}

.card-panel-col {
  margin-bottom: 12px;
}

.card-panel {
  height: 108px;
  width: 300px;
  cursor: pointer;
  font-size: 16px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;

  &:hover {
    .icon-people {
      background: #40c9c6;
    }

    .icon-message {
      background: #36a3f7;
    }

    .icon-money {
      background: #f4516c;
    }

    .icon-shopping {
      background: #34bfa3;
    }
  }

  .icon-people {
    color: #000;
  }

  .icon-message {
    color: #36a3f7;
  }

  .icon-money {
    color: #f4516c;
  }

  .icon-shopping {
    color: #34bfa3;
  }

  .card-panel-description {
    float: right;
    font-weight: bold;
    margin: 26px;
    margin-left: 0px;

    .card-panel-ver {
      margin: 0px 0 0 0px;
      font-size: 14px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-text {
      color: rgba(204, 250, 0, 0.45);
      font-size: 18px;
      margin: 6px;
    }
    .card-panel-num {
      float: right;
      font-size: 36px;
      margin: 6px;
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
