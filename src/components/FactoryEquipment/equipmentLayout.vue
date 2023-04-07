<template>
  <div class="App">
    <el-row>
      <el-col :span="12">
        <el-button type="primary" size="small" icon="el-icon-edit" @click="changeWorkspaceStatus()">
          {{ editBtnName }}
        </el-button>
      </el-col>

      <!-- 暫時不放上傳功能 -->
      <!-- <el-col :span="24">
        <el-upload
          v-show="workspaceStatus"
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
          <el-button v-show="workspaceStatus" size="small" type="primary">上傳底圖</el-button>
          <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 2MB</div>
        </el-upload>
      </el-col>-->
    </el-row>

    <el-row>
      <el-col :span="4">
        <el-select v-show="workspaceStatus" v-model="addEquipmentDivName" placeholder="Select">
          <el-option v-for="item in equipmentList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-col>
      <el-col :span="20">
        <el-button
          v-show="workspaceStatus"
          type="primary"
          size="small"
          icon="el-icon-document-add"
          @click="addEquipmentDiv()"
        >
          新增機台
        </el-button>
      </el-col>
    </el-row>

    <div class="wrapper">
      <div ref="workspace" :class="changeWorkspace()">

        <div class="action">
          <FreeTransform
            v-for="element in actionElements"
            v-show="!workspaceStatus"
            :key="element.id"
            :x="element.x"
            :y="element.y"
            :scale-x="element.scaleX"
            :scale-y="element.scaleY"
            :width="element.width"
            :height="element.height"
            :angle="element.angle"
            :offset-x="offsetX"
            :offset-y="offsetY"
            :disable-scale="element.disableScale === true"
          >
            <div class="element" :style="getElementStyles(element)">
              <h2>{{ element.text }}</h2>
            </div>
          </FreeTransform>

        </div>

        <div class="edit">
          <FreeTransform
            v-for="element in elements"
            v-show="workspaceStatus"
            :key="element.id"
            :x="element.x"
            :y="element.y"
            :scale-x="element.scaleX"
            :scale-y="element.scaleY"
            :width="element.width"
            :height="element.height"
            :angle="element.angle"
            :offset-x="offsetX"
            :offset-y="offsetY"
            :disable-scale="element.disableScale === true"
            @dblclick="confirmDelete(element.text)"
            @update="update(element.id, $event)"
          >
            <div class="element" :style="getElementStyles(element)">
              {{ element.text }}
            </div>
          </FreeTransform>

        </div>

      </div>
    </div>

    <el-row>
      <el-col :span="24">
        <el-button v-show="workspaceStatus" type="primary" size="small" icon="el-icon-document-add" @click="submit()">
          更新機台位置圖
        </el-button>
      </el-col>
    </el-row>

    <el-dialog title="警告!" :visible.sync="dialogDelVisible" width="30%" center>
      <span>您確定要刪除嗎？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelVisible = false">取消</el-button>
        <el-button type="primary" @click="deleteEquipmentDiv()">確定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FreeTransform from 'vue-free-transform'
import { getList, update, getActionList } from '@/api/EquipmentLayout'
import { getList as getDeviceList } from '@/api/SMBDevice'

export default {
  name: 'EquipmentLayout',
  components: {
    FreeTransform
  },

  data() {
    return {
      addEquipmentDivName: '',

      /** 設備列表 */
      equipmentList: [],

      defaultElement: {
        id: '',
        x: 50,
        y: 50,
        scaleX: 1,
        scaleY: 1,
        width: 100,
        height: 100,
        angle: 0,
        classPrefix: 'tr',
        styles: {
          background: 'linear-gradient(135deg, #0FF0B3 0%,#036ED9 100%)'
        },
        text: ''
      },

      /** 編輯圖層列表 */
      elements: [
        // 範例
        // {
        //   id: 'el-2',
        //   x: 225,
        //   y: 225,
        //   scaleX: 1,
        //   scaleY: 1,
        //   width: 100,
        //   height: 100,
        //   angle: 45,
        //   classPrefix: 'tr2',
        //   text: '機台2',
        //   styles: {
        //     padding: `5px`,
        //     background: 'linear-gradient(135deg, #fad961 0%,#f76b1c 100%)'
        //   }
        // },
      ],

      /** 運行中的圖層列表 */
      actionElements: [],

      offsetX: 0,
      offsetY: 0,

      fileList: [],

      workspaceStatus: false, // false代表唯讀，true代表可編輯

      /** 是否顯示刪除對話框 */
      dialogDelVisible: false,

      /** 欲刪除之機台Id */
      toDeleteEquipmentId: '',

      /** 編輯按鈕名稱 */
      editBtnName: '啟用編輯'
    }
  },

  mounted() {
    this.offsetX = this.$refs.workspace.offsetLeft
    this.offsetY = this.$refs.workspace.offsetTop
  },

  created() {
    this.getEquipmentList()
    this.loadLayout()
  },

  methods: {
    /**
     * 更新圖層相關欄位資訊例如：位置
     */
    update(id, payload) {
      this.elements = this.elements.map(item => {
        if (item.id === id) {
          return {
            ...item,
            ...payload
          }
        }
        return item
      })
    },

    /**
     * 取得元件Style
     */
    getElementStyles(element) {
      const styles = element.styles ? element.styles : {}
      return {
        width: `${element.width}px`,
        height: `${element.height}px`,
        ...styles
      }
    },

    /**
     * 加入機台圖層
     */
    addEquipmentDiv() {
      const vm = this
      var num = vm.elements.length + 1
      vm.defaultElement.id = 'el_' + num
      vm.defaultElement.text = vm.addEquipmentDivName
      vm.elements.push(vm.defaultElement)
    },

    // 以下為檔案上傳功能函式
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

    /**
     * 變更css之class工作區為唯讀或可編輯
     */
    changeWorkspace() {
      if (this.workspaceStatus) {
        return 'workspace'
      } else {
        return 'workspaceReadOnly'
      }
    },

    /**
     * 變更工作區為唯讀或可編輯
     */
    changeWorkspaceStatus() {
      if (this.workspaceStatus) {
        this.editBtnName = '啟用編輯'
        this.workspaceStatus = false
      } else {
        this.editBtnName = '關閉編輯'
        this.workspaceStatus = true
      }
    },

    /**
     * 載入設備位置圖
     */
    loadLayout() {
      const vm = this
      getList()
        .then(response => {
          vm.elements = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })

      getActionList()
        .then(response => {
          vm.actionElements = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 確認刪除
     */
    confirmDelete(equipmentId) {
      // alert('選取' + id)
      this.dialogDelVisible = true
      this.toDeleteEquipmentId = equipmentId
    },

    /**
     * 刪除機台圖層Div
     */
    deleteEquipmentDiv() {
      this.elements.forEach(element => {
        if (element.text === this.toDeleteEquipmentId) {
          this.elements.pop(element)
        }
      })
      this.dialogDelVisible = false
    },

    /**
     * 取得設備列表
     */
    getEquipmentList() {
      const vm = this
      getDeviceList()
        .then(response => {
          vm.equipmentList = response.data.Payload
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 送出更新
     */
    submit() {
      const payload = this.elements
      console.log('payload', payload)
      payload.forEach(element => {
        element.background = element.styles.background
        element.id = element.text
      })

      update(payload)
        .then(response => {
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
          this.loadLayout()
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
#app {
  display: flex;
  background: #f8fafc;
}

.wrapper {
  flex: 1;
}

.workspaceReadOnly {
  width: 800px;
  height: 600px;
  margin: 25px auto;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgb(41, 69, 92);
  background-image: url('');
  pointer-events: none;
}

.workspace {
  width: 800px;
  height: 600px;
  margin: 25px auto;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgb(13, 46, 73);
  background-image: url('');
}

* {
  box-sizing: border-box;
}

/** 運作中 */
.action .tr-transform__content {
  user-select: none;
}

.action .tr-transform__rotator {
  top: -45px;
  left: calc(50% - 7px);
}

.action .tr-transform__rotator,
.action .tr-transform__scale-point {
  background: #fff;
  width: 0px;
  height: 0px;
  border-radius: 50%;
  position: absolute;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: 0px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

/** 編輯 */
.tr-transform__content {
  user-select: none;
}

.tr-transform__rotator {
  top: -45px;
  left: calc(50% - 7px);
}

.tr-transform__rotator,
.tr-transform__scale-point {
  background: #fff;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  position: absolute;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.tr-transform__rotator:hover,
.tr-transform__scale-point:hover {
  background: #f1f5f8;
}

.tr-transform__rotator:active,
.tr-transform__scale-point:active {
  background: #dae1e7;
}

.tr-transform__scale-point {
}

.tr-transform__scale-point--tl {
  top: -7px;
  left: -7px;
}

.tr-transform__scale-point--ml {
  top: calc(50% - 7px);
  left: -7px;
}

.tr-transform__scale-point--tr {
  left: calc(100% - 7px);
  top: -7px;
}

.tr-transform__scale-point--tm {
  left: calc(50% - 7px);
  top: -7px;
}

.tr-transform__scale-point--mr {
  left: calc(100% - 7px);
  top: calc(50% - 7px);
}

.tr-transform__scale-point--bl {
  left: -7px;
  top: calc(100% - 7px);
}

.tr-transform__scale-point--bm {
  left: calc(50% - 7px);
  top: calc(100% - 7px);
}

.tr-transform__scale-point--br {
  left: calc(100% - 7px);
  top: calc(100% - 7px);
}
</style>
