<template>
  <div class="Messages" @scroll="discuzScroll($event)">
    <ul class="Messages_ul">
      <li
        :class="['Messages_li', { isActive: index === curIndex }]"
        v-for="(item, index) in list"
        :key="index + '_' + JSON.stringify(item.location)"
        @click="handleClick(index, item)"
      >
        <div class="Messages_title"><span class="line"></span>{{ item.warningTypeName }}</div>
        <div class="Messages_title_name">
          {{ item.warningName }}
          <span
            class="Messages_level"
            :style="{ backgroundColor: levelColor[item.warningLevel] }"
            >{{ item.warningLevelName }}</span
          >
        </div>
        <ul class="Messages_li_attrs">
          <li
            class="Messages_li_attrs_li"
            v-for="attrItem in item.warningTypeName === '聚集预警' ? attrTrackList : attrList"
            :key="attrItem.prop"
          >
            <div class="Messages_li_attrs_key">{{ attrItem.label }}：</div>
            <div class="Messages_li_attrs_value">{{ item[attrItem.prop] }}</div>
          </li>
        </ul>
      </li>

      <!-- 暂无显示区域 -->
      <p v-if="!list.length" class="data_empty">暂无预警</p>
      <p v-else-if="messageState === 'isLoad'" style="text-align: center">
        <i class="el-icon-loading"></i> 加载中...
      </p>
      <p v-else-if="messageState === 'finished'" style="text-align: center">
        <i class="el-icon-finished"></i> 没有更多了
      </p>
    </ul>
  </div>
</template>

<script>
const levelColor = {
  GENERAL_LEVEL: 'rgba(69, 150, 230,0.5)',
  MEDIUM_LEVEL: 'rgba(216, 183, 51,0.5)',
  EMPHASIS_LEVEL: 'rgba(240, 63, 88,0.5)'
}

export default {
  name: 'Messages',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    attrList: {
      type: Array,
      default: () => []
    },
    attrTrackList: {
      type: Array,
      default: () => []
    },
    messageState: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      levelColor: Object.freeze(levelColor),
      curIndex: -1
    }
  },
  methods: {
    handleClick (index, item) {
      this.curIndex = index
      this.$emit('handleClick', item)
    },
    //下拉加载
    discuzScroll (e) {
      let ele = e.srcElement ? e.srcElement : e.target
      if (
        ele.scrollTop + ele.offsetHeight === ele.scrollHeight &&
        this.messageState !== 'isLoad' &&
        this.messageState !== 'finished'
      ) {
        //监听滚动到div底部
        this.$emit('discuzScroll')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.Messages {
  height: calc(100vh - 268px);
  overflow: auto;
  .Messages_ul {
    .Messages_li {
      background-color: rgba(93, 108, 140, 0.2);
      padding: 12px;
      margin-bottom: 8px;
      cursor: pointer;
      &:hover {
        background-color: rgba(93, 108, 140, 0.4);
      }
      .Messages_title {
        color: var(--base-text-color-1);
        font-size: 16px;
        margin-bottom: 8px;
      }
      .Messages_title_name {
        color: var(--base-text-color-to-999999);
        font-size: 15px;
        margin-bottom: 4px;
        .Messages_level {
          display: inline-block;
          color: #fff;
          font-size: 12px;
          padding: 5px 7px;
          border-radius: 2px;
          margin-left: 4px;
        }
      }
      .Messages_li_attrs {
        font-size: 14px;
        line-height: 22px;
        .Messages_li_attrs_li {
          display: flex;
          // line-height: 24px;
          .Messages_li_attrs_key {
            color: var(--base-text-color-1);
          }
          .Messages_li_attrs_value {
            color: var(--base-text-color-to-999999);
          }
        }
      }
    }
  }
}
.line {
  display: inline-block;
  background-color: var(--base-text-color-1);
  width: 3px;
  height: 14px;
  margin-right: 6px;
  border-radius: 2px;
}

&.isActive {
  background-color: rgba(93, 108, 140, 0.6) !important;
  .Messages_title,
  .Messages_title_name {
    color: #ceab23 !important;
    .line {
      background-color: #ceab23 !important;
    }
  }
}

.data_empty {
  text-align: center;
  line-height: calc(100vh - 500px);
}
</style>
