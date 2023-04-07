<template>
  <el-dialog title=" " :visible.sync="dialog" width="80%" @close=" cancelEdit (formModel) ">
    <div slot="title" class="header-title">
      新增 下拉選項
    </div>

    <el-form ref="formModel" :model="formModel" label-width="120px" label-position="left">

      <el-form-item label="OptionGroup" :label-width="formLabelWidth">
        <!-- <el-input v-model="formModel.OptionGroup" class="edit-input" size="small" /> -->
        <el-select
          v-model="formModel.OptionGroup"
          placeholder="please select OptionGroup"
          style="width:100%"
        >
          <el-option
            v-for="item in optionGroupList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="OptionID" :label-width="formLabelWidth">
        <el-input v-model="formModel.OptionID" class="edit-input" size="small" />
      </el-form-item>

      <el-form-item label="Name" :label-width="formLabelWidth">
        <el-input v-model="formModel.Name" class="edit-input" size="small" />
      </el-form-item>

      <el-form-item label="Lable" :label-width="formLabelWidth">
        <el-input v-model="formModel.Lable" class="edit-input" size="small" />
      </el-form-item>

      <el-form-item label="是否顯示" :label-width="formLabelWidth">
        <el-switch
          v-model="formModel.IsDisplay"
          :label-width="formLabelWidth"
          active-color="#13ce66"
          active-text="顯示"
          inactive-color="#ff4949"
        />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialog=false">取 消</el-button>
      <el-button type="primary" @click=" confirmEdit (formModel) ">Create</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { createOrUpdateItem } from '@/api/Options'
import { mapGetters } from 'vuex'
import { formatDate } from '@/utils/validate'
export default {
  filters: {
    valueFilter(status) {
      return 'success'
    },

    formatDateFilter(value) {
      return formatDate(value, 'MM-dd HH:mm:ss')
    },

    smallformatDateFilter(value) {
      return formatDate(value, 'HH:mm:ss')
    },

    toStep(value) {
      return 1 / Math.pow(10, value)
    }
  },
  props: {
    model: {
      type: Object,
      default: function() {
        return {}
      }
    },
    dialogFormVisible: {
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
      selectStyle: 'width:100%',
      optionGroupList: ['ProductType', 'Material']
    }
  },
  computed: {
    ...mapGetters([
      'equipments'
    ])

  },

  watch: {
    dialogFormVisible(newValue) {
      this.dialog = newValue

      if (newValue) {
        this.formModel = Object.assign({}, this.model)
        // console.log('dialogFormVisible', this.formModel)
      }
    }
  },

  methods: {

    cancelEdit(row) {
      this.dialog = false
      this.$emit('dialogVisible', false, null)
    },

    async confirmEdit(row) {
      // console.log('confirmEdit', row)

      await createOrUpdateItem(row)
        .then(response => {
          this.$message({
            message: 'The data has been create',
            type: 'success'
          })
          this.$store.dispatch('equipments/start', this.$message)
          this.dialog = false
          this.$emit('dialogVisible', false, row)
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
font-size: 14px;
}

.item {
margin-top: 5px;
}

.clearfix:before,
.clearfix:after {
display: table;
content: "";
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
