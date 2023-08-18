<template>
  <div class="Attrs" :style="$attrs.cusStyle">
    <TrendBox ref="children" :attrs="form.attrs" :groups="groups" @add="addEvent" @del="delEvent">
      <template v-slot:formBox0="props">
        <div class="key">数据类型</div>
        <div class="val">
          <el-select
            v-model="form.attrs[props.boxIndex].type"
            placeholder="请选择搜索类型"
            @change="handleChangeType($event, props.boxIndex)"
          >
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.typeName"
              :value="item.typeCode"
              size="small"
            >
            </el-option>
          </el-select>
        </div>
      </template>
      <template v-slot:formBox1="props">
        <div class="key">准确数值</div>
        <div class="val">
          <el-input
            v-model.trim="form.attrs[props.boxIndex].data"
            size="small"
            :placeholder="form.attrs[props.boxIndex].placeholder || '请输入您要查询的内容'"
          ></el-input>
        </div>
      </template>
    </TrendBox>
  </div>
</template>

<script>
import TrendBox from '@/components/VisualComponents/Form/trendBox'
export default {
  components: {
    TrendBox
  },
  data () {
    return {
      typeList: [],
      form: {
        attrs: [{ data: '', type: '' }]
      },
      activeIndex: -1, //当前点击框active css 效果
      groups: [0, 1] //一组有两个input框
    }
  },
  created () {
    this.$store.state.Dict.extrTypeList.forEach(item => {
      if (item.typeCode !== "attr_face_image_type") {
        this.typeList.push(item)
      }
    })
    if (!this.form.attrs[0].type && !this.form.attrs[0].data) {
      this.form.attrs[0].type = this.$store.state.Dict.extrTypeList?.[0].typeCode ?? ''
      this.form.attrs[0].placeholder =
        '请输入您要查询的' + this.$store.state.Dict.extrTypeList?.[0].typeName ?? '内容'
      return
    }
  },
  methods: {
    // 动态显示placeholder
    handleChangeType (value, index) {
      this.form.attrs[index].placeholder =
        '请输入您要查询的' +
        this.$store.state.Dict.extrTypeList.find(_c => _c.typeCode === value)?.typeName
    },
    // 新增 输入
    addEvent () {
      this.form.attrs.push({
        data: '',
        type:
          this.$store.state.Dict.extrTypeList && this.$store.state.Dict.extrTypeList.length
            ? this.$store.state.Dict.extrTypeList[0].typeCode
            : ''
      })
    },
    // 删除 输入
    delEvent (idx) {
      this.form.attrs.splice(idx, 1)
    }
  }
}
</script>

<style scoped>
.Attrs {
  height: calc(100vh - 540px);
  width: 100%;
  padding: 12px 0 12px 12px;
  box-sizing: border-box;
  overflow-y: auto;
}
.Attrs::-webkit-scrollbar {
  width: 0;
}
</style>
