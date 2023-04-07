<template>
  <div>
    <el-select
      v-model="ParameterId"
      placeholder="please select Parameter"
      class="ParameterSelect"
      @change="OnSelectParameterChange()"
    >
      <el-option
        v-for="(item) of GetGroupdataChange"
        :key="item.FieldID"
        :label="item.FieldID + ' ' + item.FieldName"
        :value="item.FieldID"
      >
        <span style="float: left">{{ item.FieldID }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.FieldName }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'SelectParameter',
  props: {
    groupdata: {
      type: Array,
      default: function() {
        return []
      }
    },

    parameterid: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  data() {
    return {
      options: [{
        value: 'Monitor',
        label: 'Monitor'
      }, {
        value: 'Setting',
        label: 'Setting'
      }],
      listparameter: []
    }
  },
  computed: {

    ParameterId: {
      get() {
        return this.parameterid
      },
      set(val) {
        this.$emit('update:parameterid', val)
      }
    },

    GetGroupdataChange() {
      return this.options.slice(0)
    }
  },
  methods: {
    sortNum(a, b) { // 排序方法
      return a.SortID - b.SortID
    },
    OnSelectParameterChange() {
      this.$emit('OnSelectParameterChange')
    }
  }
}
</script>

<style scoped>
.pagination-container {
  margin:  10px ;
}
.pagination-container.hidden {
  display: none;
}
.ParameterSelect {
    width: 300px;
    cursor: pointer;
}
</style>
