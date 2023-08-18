<template>
  <el-date-picker
    v-model="time"
    @change="changeValue"
    :default-time="['00:00:00', '23:59:59']"
    type="daterange"
    value-format="timestamp"
    :picker-options="pickerOptions"
    :editable='false'
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    align="right"
    v-bind="$attrs"
  >
  </el-date-picker>
</template>

<script>
import { options } from "./data";

export default {
  props: {
    value: Array,
  },
  data () {
    return {
      pickerOptions: options,
      time:[]
    };
  },
  watch: {
    value: {
      handler: function (val) {
        this.time = val
      },
      immediate: true, //关键
      deep: true
    }
  },
  methods: {
    changeValue (e) {
      this.$emit("changeValue", e);
    },
  },
};
</script>

<style>
</style>
