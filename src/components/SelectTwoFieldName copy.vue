<template>
  <div>

    <el-checkbox-group
      v-model="listparameter"
      placeholder="please select Parameter"
      :min="1"
      :max="2"
      style="float: right; padding: 30px 0"
      @change="OnSelectParameterChange()"
    >
      <ul>
        <li v-for="(item) of GetGroupdataChange()" :key="item.FieldID">
          <el-checkbox
            :label="item.FieldID"
            :value="item.FieldID"
          >
            {{ item.FieldName }}
          </el-checkbox>
        </li>
      </ul>
    </el-checkbox-group>

  </div>
</template>

<script>

export default {
  props: {
    groupdata: {
      type: Array,
      default: function() {
        return []
      }
    },

    parameterid: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      listparameter: []
    }
  },
  computed: {
    ParameterId: {
      get() {
        return this.listparameter
      },
      set(val) {
        console.log(val)
        this.$emit('update:parameterid', val)
      }
    }
  },
  watch: {
    groupdata: {
      deep: true,
      handler(val) {
        if (val == null) return
      }
    }
  },
  methods: {
    sortNum(a, b) {
      return a.SortID - b.SortID
    },

    OnSelectParameterChange() {
      this.ParameterId = this.listparameter
      this.$emit('OnSelectParameterChange')
    },

    GetGroupdataChange() {
      if (this.groupdata !== null) {
        if (this.groupdata.length === 0) return []

        return this.groupdata
      }

      return []
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
    clear: both;
    cursor: pointer;
}
 .text {
   margin-top: 18px;
    font-size: 14px;
  }

  .item {

    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>
