<template>
  <div class="form">
    <ul v-for="(boxItem, boxIndex) in list" :key="boxIndex" v-clickout="clickout">
      <li
        class="box_item"
        v-for="(groupItem, groupIndex) in groups"
        :key="groupIndex"
        @click.stop="clickTrendBox(groupIndex, boxIndex)"
      >
        <div
          :class="[
            'trendBox_item',
            { isActive: curindex == groupIndex && boxIndex == curBoxIndex }
          ]"
        >
          <template>
            <slot :name="'formBox' + groupIndex" :boxIndex="boxIndex"></slot>
          </template>
        </div>

        <div class="operate" v-show="groupIndex == 0">
          <i
            v-show="boxIndex + 1 == list.length"
            class='iconfont icon-tianjia'
            @click="addRequire()"
          ></i>
          <i
            v-show="list.length > 1"
            class='iconfont icon-shanchu'
            @click="deRequire(boxIndex)"
          ></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    groups: {
      type: Array,
      default: () => [1]
    },
    attrs: {
      type: Array,
      default: () => [{ data: '', type: '' }]
    }
  },
  data () {
    return {
      list: [0],
      curindex: -1,
      curBoxIndex: -1
    }
  },
  watch: {
    attrs: {
      handler: function (val) {
        this.list = val?.map((_c, index) => {
          return index
        }) ?? [0]
      },
      immediate: true, //关键
      deep: true
    }
  },
  methods: {
    setList (attrs) {
      this.list = attrs?.map((_c, index) => {
        return index
      }) ?? [0]
    },
    handleMouseleave () {
      this.curBoxIndex = -1
    },
    clickout () {
      this.removeClick()
    },
    // 类型和数值 input框动态添加
    addRequire (boxIndex) {
      this.list.push(boxIndex + 1)
      this.$emit('add', boxIndex)
    },
    // 类型和数值 input框动态减少
    deRequire (boxIndex) {
      this.list.splice(boxIndex, 1)
      this.$emit('del', boxIndex)
    },
    removeClick () {
      this.curindex = -1
      this.curBoxIndex = -1
    },
    clickTrendBox (idx, boxIndex) {
      this.curindex = idx
      this.curBoxIndex = boxIndex
    }
  }
}
</script>

<style lang="less" scoped>
.box_item {
  display: flex;
  align-items: center;
  .trendBox_item {
    width: 92%;
    margin-bottom: 16px;
    padding: 10px 12px 4px 12px;
    box-sizing: border-box;
    // border: 1px solid #4e596d;
    border: 1px solid var(--border-color-input);
    &.isActive {
      // border: 1px solid #5288d8;
      border: 1px solid var(--active-color);
    }
    &:hover {
      // border: 1px solid #5288d8;
      border: 1px solid var(--active-color);
    }
    .key {
      color: var(--base-text-color-to-999999);
    }
    .val {
      height: 40px;
      line-height: 40px;
    }
  }
  .operate {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 16px;
    margin-left: 8px;
    i {
      display: inline-block;
      font-size: 16px;
      color: var(--base-text-color-to-999999);
      margin-bottom: 16px;
      cursor: pointer;
    }
  }
}
</style>
