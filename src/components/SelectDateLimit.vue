<template>
  <div>
    <div class="block">

      <el-date-picker
        v-model="TheDay"
        type="date"
        placeholder="Select the day"
        @change="OnSelectDateChange()"
      >
        />
      </el-date-picker></div>
  </div>
</template>

<script>
import { formatDate } from '@/utils/validate'

export default {
  name: 'SelectDateLimit',
  props: {
    datenow: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  computed: {
    TheDay: {
      get() {
        return this.datenow
      },
      set(val) {
        this.$emit('update:datenow', formatDate(val, 'yyyy-MM-dd HH:mm:ss'))
      }
    }
  },
  methods: {
    OnSelectDateChange() {
      this.$emit('OnSelectDateChange')
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
</style>
