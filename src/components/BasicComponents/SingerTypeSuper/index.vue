<template>
  <div>
    <el-form>
      <BorderBox v-for="item in list" :key="item.label">
        <template v-slot:title>
          {{ item.title }}
        </template>
        <template v-slot:containers>
          <div v-if="item.type == 'select'">
            <el-select
              :disabled="item.isDisable"
              v-model="item.value"
              @change="change"
              :placeholder="`请选择${item.title}`"
            >
              <el-option
                v-for="i in item.options"
                :key="i.id"
                :label="i.label"
                :value="i.value"
                size="small"
              >
              </el-option>
            </el-select>
          </div>
          <div v-else-if="item.type == 'input'">
            <el-input
              :disabled="item.isDisable"
              v-model="item.value"
              size="small"
              :placeholder="`请输入${item.title}`"
            ></el-input>
          </div>
        </template>
      </BorderBox>

      <!-- 查询 -->
      <div class="btn" v-if="btns && btns.length > 0">
        <div v-for="(btnItem, btnIndex) in btns" :key="btnIndex">
          <span
            v-if="btnItem.type == 'normal'"
            class="p-button"
            @click.prevent.stop="btnItem.btnEvent"
            >{{ btnItem.text }}</span
          >
          <el-button
            v-else
            type="primary"
            :class="`${btnItem.isLoading ? 'disabled' : 'submitButton'}`"
            @click.prevent.stop="btnItem.btnEvent"
            :loading="btnItem.isLoading"
            >{{ btnItem.isLoading ? btnItem.isLoadingText : btnItem.text }}</el-button
          >
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import BorderBox from '@/components/BasicComponents/BorderBox'

export default {
  components: {
    BorderBox,
  },

  props: {
    list: {
      type: Array,
    },
    btns: {
      type: Array,
    },
  },
  mounted (){
  },
  methods:{
    change (val){
      let filterItem = this.list[0].options.filter((item)=>{
        return item.value === val
      })
      this.$emit('valueChange',filterItem[0].label)
    }
  }
}
</script>

<style lang="less" scoped>
.btn {
  padding: 15px 0;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.p-button {
  margin-right: 12px;
}
</style>
