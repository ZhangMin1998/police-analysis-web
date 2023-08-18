<template>
  <div class="file-detail-content" v-if="info">
    <el-form :model="form" class="text-list" v-show="isEditable" label-width="100px">
      <el-form-item
        class="text-list-item"
        v-for="item in infoList"
        :key="item.label"
        :prop="item.prop"
        :label="item.label + '：'"
      >
        <el-input
          v-if="item.type == 'input'"
          v-model="form[item.prop]"
          :disabled="item.isUnAllow"
          :placeholder="`${item.placeholder || '请输入' + item.label}`"
        ></el-input>

        <!-- 选择框 -->
        <el-select
          v-else-if="item.type == 'select'"
          v-model="form[item.prop]"
          :disabled="item.isUnAllow"
          :placeholder="`${item.placeholder || '请选择' + item.label}`"
          :filterable="item.filterable"
          style="width: 100%"
        >
          <el-option
            v-for="i in item.option"
            :key="i.value"
            :value="i.value"
            :label="i.label"
          ></el-option>
        </el-select>

        <el-date-picker
          v-else-if="item.type == 'date'"
          v-model="form[item.prop]"
          type="date"
          :disabled="item.isUnAllow"
          :editable='false'
          :placeholder="`${item.placeholder || '请选择' + item.label}`"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <div class="text-list-item"></div>
      <div class="text-list-item"></div>

      <div class="text-list-item lastItem">
        <el-button type="primary" class="editBtn" @click="cancelEdit">取消</el-button>
        <el-button type="primary" class="editBtn" @click="saveEdit">保存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { updateCustomPerson } from '@/api/allArchives'
export default {
  props: {
    info: {
      type: Object,
      default: () => ({})
    },
    infoList: {
      type: Array,
      require: true
    },
    isEditable: {
      type: Boolean,
      default: false
    },
    inputInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      form: {}
    }
  },
  created () {
    this.form = { ...this.inputInfo }
  },
  methods: {
    cancelEdit () {
      // 解决图片回显问题,点击取消的时候,应该把之前上传的图片路径更改回原来的
      this.$parent.personInfo.headPic = this.$parent.personInfo.avatar
      this.$emit('update:isEditable', false)
    },
    /** 基础信息 - 保存个人编辑 */
    saveEdit () {
      this.$nextTick(() => {
        // 把修改后的头像带上
        this.form.headPic = this.inputInfo.headPic
        updateCustomPerson(this.form).then(() => {
          this.$parent.$parent.obtainInfo()
          this.$messageTip.success('修改成功！')
          this.$emit('update:isEditable', false)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.file-detail-content {
  display: flex;
  // width: calc(100vw - 240px);
}
.lastItem {
  align-items: center;
  display: block !important;
  text-align: left;
  .editBtn {
    &:nth-child(1) {
      margin: 16px 5px 5px 110px;
    }
  }
}
.file-detail-content .text-list {
  // flex: 1 1 auto;
  // column-count: 5;
  // column-gap: 16px;
  // -moz-column-count: 5; /* Firefox */
  // -webkit-column-count: 5; /* Safari 和 Chrome */
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.file-detail-content .text-list-item {
  // display: flex;
  // font-size: 16px;
  // line-height: 36px;
  display: flex;
  width: 25%;
  // height: 18px;
  font-size: 16px;
}

.file-detail-content .text-list-item .label {
  white-space: nowrap;
  color: var(--base-text-color-to-999999);
}

.file-detail-content .text-list-item span {
  flex: 1 1 auto;
}

/deep/ .el-image-viewer__close {
  top: 230px;
  right: 20vw;
}

/deep/ .el-image .el-icon-circle-close {
  font-size: 50px !important;
  color: var(--base-text-color-1) !important;
  &:hover {
    color: #5288d8 !important;
  }
}
/deep/.el-form-item__content {
  margin-bottom: 8px;
  margin-left: 0px !important;
}

.text-list /deep/.el-input.is-disabled .el-input__inner {
  background-color: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  color: #7e8188 !important;
  cursor: not-allowed !important;
}

.text-list /deep/.el-input.is-disabled .el-input__inner::placeholder {
  color: #7e8188 !important;
}

/deep/.el-form-item__content,
/deep/.el-date-editor.el-input,
/deep/.el-date-editor.el-input__inner {
  width: 163px;
}
.iconUrl {
  margin-right: 16px;
}
</style>
