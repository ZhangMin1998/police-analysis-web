<template>
  <div class="modalForm">
    <el-form :rules="rules" :ref="formName" :model="form" label-width="120px">
      <div class="item_div" v-for="item in formList" :key="item.key">
        <el-form-item :label="item.label + '：'" :prop="item.prop">
          <!-- 输入框 -->
          <el-input
            v-if="item.type == 'input'"
            v-model="form[item.prop]"
            :placeholder="`${item.placeholder || '请输入' + item.label}`"
          ></el-input>

          <!-- 带树形结构的输入框 -->
          <div class="tree_input_tree_box" v-if="item.type == 'tree_input'">
            <el-input
              v-model="form[item.prop]"
              @focus="focus"
              :placeholder="`${item.placeholder || '请输入' + item.label}`"
            ></el-input>
            <div class="tree_box" v-show="treeShow">
              <div class="tree">
                <el-tree
                  :data="treeData"
                  :props="defaultProps"
                  @node-click="(data, node, cur) => nodeClick(data, node, cur, item.prop)"
                  default-expand-all
                  node-key="id"
                  ref="inputTree"
                  :expand-on-click-node="false"
                >
                  <span class="custom-tree-node" slot-scope="{ node }">
                    <span class="em-tree-text" :title="node.label">{{ node.label }}</span>
                  </span>
                </el-tree>
              </div>
              <div class="close_btn">
                <el-button type="primary" @click="closeBox">关闭</el-button>
              </div>
            </div>
          </div>

          <!-- 选择框 -->
          <el-select
            v-else-if="item.type == 'select'"
            v-model="form[item.prop]"
            :placeholder="`${'请选择' + item.label}`"
            style="width: 100%"
            @change="selectChange($event)"
          >
            <el-option
              v-for="i in item.option"
              :key="i.value"
              :value="{
                parentId: i.label,
                parentName: i.value,
                moduleId: i.moduleId
              }"
              :label="i.value"
            ></el-option>
          </el-select>

          <!-- 开关 -->
          <el-switch
            v-else-if="item.type == 'switch'"
            v-model="form[item.prop]"
            :active-text="item.activeText"
          >
          </el-switch>
        </el-form-item>
      </div>
    </el-form>
    <div class="right formBtn">
      <div class="blank_button mr16" @click="close">取消</div>
      <el-button type="primary" @click="submit" :loading="loadingBtnObj.loading">{{
        loadingBtnObj.loading ? loadingBtnObj.loadingText : loadingBtnObj.text
      }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rules: {
      type: Object,
      default: () => { },
    },
    formList: {
      type: Array,
      default: () => [],
    },
    form: {
      type: Object,
      default: () => { },
    },
    loadingBtnObj: {
      type: Object,
      default: () => {
        return {
          loading: false,
          text: '确定',
          loadingText: '提交中'
        }
      },
    },
    formName: {
      type: String,
      default: '',
    },
    treeData: {
      type: Array
    }
  },
  data () {
    return {
      treeShow: false,
      defaultProps: {
        children: 'list',
        label: 'itemName'
      },
    }
  },
  mounted () {
    if (this.formName === 'menuThreeForm' && this.form.parentId) {
      this.$nextTick(() => {
        this.setTreeStatus()
      })
    }
  },
  methods: {
    setTreeStatus () {
      this.$refs.inputTree[0].setCurrentKey(this.form.parentId)
      this.treeShow = true
      this.$nextTick(() => {
        document.querySelector(".is-current").firstChild.click()
        this.treeShow = false
      })
    },
    selectChange (data) {
      this.form['parentId'] = data.parentId
      this.form['parentName'] = data.parentName
      this.form['moduleParentId'] = data.moduleId
    },
    nodeClick (data, node, cur, prop) {
      this.form[prop] = data.itemName
      this.form['parentId'] = data.id
      this.form['moduleParentId'] = data.moduleId
      this.$refs[this.formName].clearValidate(prop)
      this.treeShow = false
    },
    closeBox () {
      this.treeShow = false
    },
    close () {
      this.$emit('close')
    },
    submit () {
      this.$emit('submit')
    },
    focus () {
      this.treeShow = true
    },
  },
}
</script>

<style lang="less" scoped>
.modalForm {
  .el-form {
    display: flex;
    flex-wrap: wrap;
  }
  .el-form .item_div {
    margin-right: 8%;
  }
  .tree_input_tree_box {
    position: relative;
    margin-right: 0 !important;
  }
  .tree_box {
    width: 100%;
    position: absolute;
    top: 45px;
    left: 0;
    background-color: #445575;
    z-index: 9999;
    .tree {
      height: calc(100vh - 600px);
      overflow: scroll;
    }
    .close_btn {
      display: flex;
      justify-content: flex-end;
    }
  }
}

.right {
  &.formBtn {
    display: flex;
    justify-content: flex-end;
  }
  // .submitButton {
  //   padding: 8px 20px;
  //   background-color: transparent;
  //   border: 1px solid rgba(255, 255, 255, 0.2);
  //   display: inline-block;
  //   color: @font-color-3;
  //   &.out {
  //     background-color: #177ddc;
  //     margin-right: 16px;
  //     &:hover {
  //       background-color: rgb(80, 147, 223);
  //     }
  //   }
  //   &.cancle {
  //     margin-right: 8px;
  //     border-radius: 4px;
  //     cursor: pointer;
  //   }
  //   &:hover {
  //     background-color: #177ddc;
  //   }
  // }
}
/deep/ .el-form-item {
  margin-bottom: 24px !important;
  width: 410px;
}
</style>
