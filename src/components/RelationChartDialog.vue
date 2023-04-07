<template>
  <el-dialog title="Setting" :visible.sync="dialog" width="80%" top="10vh" @close="$emit('cancelEdit', chartmodel)">

    <div slot="title" class="header-title">
      <span style="padding: 3px 0">  {{ field.EquipmentID }}  </span>
      <span style="padding: 3px 0">  {{ field.FieldID }}  </span>
      <span style="padding: 3px 0">  {{ field.FieldName }}  </span>
      <!-- <span style="padding: 3px 0">  {{ field.Offset }}  </span> -->
      <span style="padding: 3px 0">  {{ field.Unit }}  </span>
      <span style="padding: 3px 0">  {{ field.Average }}  </span>
      <span style="padding: 3px 0">  {{ field.LowerLimit }}  </span>
      <span style="padding: 3px 0">  {{ field.UpperLimit }}  </span>
    </div>
    <div class="chart-container">

      <relation-chart style="float: right" height="100%" width="100%" :chart-data="chartmodel" />

    </div>
  </el-dialog>
</template>

<script>
import RelationChart from '@/components/RelationChart'
export default {
  components: { RelationChart },
  props: {
    model: {
      type: Object,
      required: true
    },
    dialogFormVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      field: {},
      chartmodel: { field: {}, expected: [] },
      dialog: false
    }
  },
  computed: {

  },
  watch: {
    dialogFormVisible(val) {
      this.dialog = val

      if (val) {
        console.log(this.model)
        this.chartmodel = Object.assign({}, this.model)
        this.field = this.chartmodel.field
      }
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.chart-container{
  margin: 10px;
  width: 90%;
  clear: left;
  height: calc(100vh - 200px);
}
</style>
