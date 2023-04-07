<template>
  <div>
    <el-form label-position="right" label-width="auto">
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="12"
          :md="12"
          :lg="6"
          :style="isdaterange ? 'float: left' : 'float: right'"
        >
          <el-form-item label="欄位">
            <el-select
              v-model="FiedlID"
              placeholder="please select FiedlID"
              style="width: 100%;"
              @change="OnSelectEquipmentChange()"
            >
              <el-option
                v-for="item of field_list"
                :key="item.FieldID"
                :label="item.FieldName"
                :value="item.FieldID"
              >
                <span style="float: left">{{ item.FieldID }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.FieldName
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getListFields } from '@/api/FieldName'
import { mapGetters } from 'vuex'
import { getSortFunc, isNullOrEmpty } from '@/utils/validate'
import { loadingUI } from '@/utils/loading' // loading遮罩

export default {
  name: 'SelectEquipment',
  props: {
    equipmentid: {
      type: String,
      default: function() {
        return ''
      }
    },
    fieldid: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  data() {
    return {
      field_list: [],
      order_prop: 'SortID',
      DateTimeRange: null
    }
  },
  computed: {
    ...mapGetters(['equipments']),
    Fieldid: {
      get() {
        if (isNullOrEmpty(this.fieldid)) {
          this.$emit('update:fieldid', this.equipments.select_fieldid)
          return this.equipments.select_fieldid
        } else {
          return this.fieldid
        }
      },
      set(val) {
        // console.log('EquipmentId', val, this.equipments.select_equipment, this.equipmentid)

        if (val !== '') {
          this.$store.dispatch('equipments/toggleFieldid', val)
        }
        this.$emit('update:fieldid', val)
      }
    }
  },
  created() {
    var sortfunc = getSortFunc(this.order_prop, 1, 'SortID', this.desc_prop)

    this.GET_FieldList().then(response => {
      this.field_list = []

      response.sort(sortfunc).map(fd => {
        var newfd = Object.assign({}, fd)
        this.field_list.push(newfd)
      })
    })
  },
  methods: {
    GET_FieldList() {
      return new Promise((resolve, reject) => {
        getListFields({
          EquipmentID: this.equipmentid,
          IsEnabled: 1,
          select_:
            'EquipmentID,GroupName,SubCategory,FieldName,FieldType,SortID'
        })
          .then(response => {
            resolve(response.data.items)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    OnSelectEquipmentChange() {
      // loadingUI()
      this.$emit('OnSelectFieldChange')
    }
  }
}
</script>

<style scoped>
.pagination-container {
  margin: 10px;
}
.pagination-container.hidden {
  display: none;
}
/* .el-select {
  margin:  10px;
}*/
</style>
