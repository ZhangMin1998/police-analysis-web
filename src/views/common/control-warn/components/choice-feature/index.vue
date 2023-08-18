<template>
<div class='choice_feature_wrap'>
  <div class='feature_tree'>
    <div class='left_tree'>
      <el-tree
        class="filter-tree el-tree-addordel"
        :data="choiceFeatureTree"
        show-checkbox
        highlight-current
        :check-on-click-node="true"
        node-key="treeId"
        default-expand-all
        :props="treeProps"
        ref="tree"
        @check-change='handleCheck'
      >
        <span class="custom-tree-node" slot-scope="{ node }">
          <el-image
            v-if='node.data.type === "entity_person" && node.data.isValue'
            class="el-image"
            :src="origin + node.label"
            :preview-src-list="[ origin + node.label ]"
            fit="cover"
          >
            <div slot="error" class="image-slot">
              <i class='iconfont icon-jiazaishibai'></i>
            </div>
          </el-image>
          <EllipsisPop v-else class="em-tree-text" :content="node.label"></EllipsisPop>
        </span>
      </el-tree>
    </div>
    <div class='right_choice'>
      <div class='right_title'>已选特征：</div>
      <div v-for='item in choiceFeature' :key='item.treeId' class='choice_tag'>
        <div v-if='item.type !== "entity_person"' class='value'>{{ item.label }}</div>
        <el-image
          v-else
          class="el-image"
          :src="origin + item.label"
          :preview-src-list="[ origin + item.label ]"
          fit="cover"
        >
          <div slot="error" class="image-slot">
            <i class='iconfont icon-jiazaishibai'></i>
          </div>
        </el-image>
        <i class='iconfont icon-xiangqingguanbi' @click='delChoice(item)'></i>
      </div>
    </div>
  </div>
  <div class='floor'>
    <div class='blank_button' @click='$emit("closeFDialog")'>取消</div>
    <el-button type="primary" @click='submit'>确定</el-button>
  </div>
</div>
</template>

<script>
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
export default {
  name: 'ChoiceFeature',
  components: {
    EllipsisPop
  },
  props: {
    choiceFeatureTree: {
      type: Array,
      default: () => []
    },
    isChoiceFeature: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      treeProps: {
        children: 'children',
        label: 'label'
      },
      /*popTreeData: [
        {
          treeId: 1,
          label: '张三/440302198905061234',
          disabled: true,
          children: [
            {
              treeId: 2,
              label: '手机',
              disabled: true,
              children: [
                {
                  treeId: 5,
                  label: '13894561234'
                }
              ]
            },
            {
              treeId: 3,
              label: '车牌',
              disabled: true,
              children: [
                {
                  treeId: 6,
                  label: '粤B123456'
                }
              ]
            },
            {
              treeId: 4,
              label: '人脸',
              disabled: true,
            },
          ]
        }
      ],*/
      choiceFeature: [] // 当前选中的特征列表
    }
  },
  computed: {
    origin () {
      return window.location.origin + '/'
    }
  },
  mounted () {
    // this.choiceFeature = this.isChoiceFeature
    let isCheck = this.isChoiceFeature.map(checkItem => checkItem.treeId)
    this.$refs.tree.setCheckedKeys(isCheck)
  },
  methods: {
    // 确定需要通过$emit把数据传递给add-feature
    submit () {
      this.$emit('choiceFSubmit', this.choiceFeature)
      this.$emit('closeFDialog')
    },
    // 左边树选中时
    handleCheck (item, check) {
      if (!item.disabled) {
        if (check) {
          this.choiceFeature.push(item)
        } else {
          let index = this.choiceFeature.findIndex(delItem => delItem.treeId === item.treeId)
          index > -1 && this.choiceFeature.splice(index, 1)
        }
      }
    },
    // 右边选中栏删除特征时
    delChoice (item) {
      let index = this.choiceFeature.findIndex(delItem => delItem.treeId === item.treeId)
      if (index > -1) {
        this.choiceFeature.splice(index, 1)
        let isCheck = this.choiceFeature.map(checkItem => checkItem.treeId)
        this.$refs.tree.setCheckedKeys(isCheck)
      }
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.choice_feature_wrap {
  .feature_tree {
    display: flex;
    .left_tree,
    .right_choice {
      height: 640px;
      flex: 1;
      background: var(--bg-color-6);
      overflow-y: auto;
    }
    .left_tree {
      margin-right: 12px;
    }
    .right_choice {
      .right_title {
        padding: 12px 24px 10px;
        font-size: 14px;
        line-height: 19px;
        color: var(--base-text-color-1);
      }
      .choice_tag {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 12px 0 24px;
        font-size: 14px;
        line-height: 32px;
        color: var(--base-text-color-1);
        background: var(--record-library-tree);
        margin-bottom: 1px;
        i {
          font-size: 16px;
          cursor: pointer;
          color: var(--button-plain-border-color);
          &:hover {
            color: var(--active-color);
          }
        }
      }
    }
    /deep/.el-tree {
      padding: 0 24px;
    }
    .custom-tree-node {
      display: flex;
      flex: 1;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      padding-right: 24px;
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .em-tree-text {
        display: inline-block; //block一样
        overflow: hidden;
        white-space: nowrap;
        width: 100%;
        text-overflow: ellipsis;
      }
    }
  }
  .floor {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    .blank_button {
      margin-right: 16px;
    }
  }
}
/deep/.el-tree .el-tree-node.is-current > .el-tree-node__content,
/deep/.el-tree .el-tree-node__content:hover {
  background: transparent;
}
/deep/.el-image {
  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 40px;
    background: var(--warn-error-image-bg);
    color: var(--base-text-color-2);
    i {
      font-size: 16px;
    }
  }
  img {
    width: 32px;
    height: 40px;
  }
}
/deep/.el-tree .el-tree-node__content {
  height: auto;
  min-height: 32px;
}
</style>
