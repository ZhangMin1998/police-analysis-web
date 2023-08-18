<template>
  <div class="Collapse">
    <el-collapse v-model="collapse.activeNames">
      <template v-for="(item, index) in collapse.list">
        <el-collapse-item
          v-if="item.isShow === undefined ? true : item.isShow"
          :name="item.id"
          :key="index + '_' + item.id"
        >
          <!-- 标题 -->
          <template slot="title">
            <div :class="{ isActiveGroup: collapse.activeNames.includes(item.id) }">
              {{ item.label }}
            </div>
          </template>

          <!-- 滚动区域 -->
          <div
            class="scroll"
            :style="{ maxHeight: `calc(100vh - ${curDHeight}px)` }"
            @scroll="discuzScroll($event, index)"
          >
            <!-- 数据循环 -->
            <div
              :class="['childItem', { isActive: isActiveId == childItem.id }]"
              :id="'scollId' + childItem.id"
              v-for="(childItem, childIdx) in item.children"
              :key="childIdx + '_' + childItem.id"
              @click="handleClick(childItem, childIdx)"
            >
              <!-- 标题1 -->
              <div class="childItem-header" v-if="childItem.parentTitle">
                <div class="line"></div>
                <div>{{ childItem.parentTitle }}</div>
              </div>

              <!-- 标题2 -->
              <div class="childItem-header">
                <div class="line"></div>
                <div>
                  {{ childItem.title
                  }}<span
                    class="sign"
                    :style="{ backgroundColor: childItem.color }"
                    v-if="childItem.sign"
                    >{{ childItem.sign }}</span
                  >
                </div>
              </div>

              <!-- 内容循环 -->
              <div v-for="infoItem in item.infoList" :key="infoItem.prop">
                <div class="infoItem" v-if="infoItem.type === 'status'">
                  <div class="label">
                    {{ infoItem.label }}
                  </div>
                  <div
                    class="value"
                    :style="{
                      color: childItem['formatterStatus'].color
                    }"
                  >
                    {{ childItem['formatterStatus'].text }}
                  </div>
                </div>

                <div class="infoItem" v-else-if="infoItem.type === 'keyList'">
                  <div class="label">
                    {{ infoItem.label }}
                  </div>
                  <div class="value">
                    <div class="'infoItem'" v-if="childItem.keyList && childItem.keyList.length">
                      <div v-for="(keyItem, keyIndex) in childItem.keyList" :key="keyIndex">
                        <div
                          class="item-color"
                          v-for="propItem in childItem.propList"
                          :key="propItem"
                        >
                          {{ keyItem[propItem] }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="infoItem" v-else-if="infoItem.type === 'searchTime'">
                  <template v-if='!childItem.isCollision'>
                    <div class="label">
                      {{ infoItem.label }}
                    </div>
                    <div class="value">
                      {{ childItem[infoItem.prop] }}
                    </div>
                  </template>
                </div>

                <div class="infoItem" v-else>
                  <div class="label">
                    {{ infoItem.label }}
                  </div>
                  <div class="value">
                    {{ childItem[infoItem.prop] }}
                  </div>
                </div>
              </div>

              <!-- footer 循环 -->
              <div v-if="childItem.list && childItem.list.length > 0">
                <div
                  :class="['infoItem', 'between']"
                  v-for="(tItem, tIdx) in childItem.list"
                  :key="tIdx"
                >
                  <div class="item-color">
                    {{ tItem[tItem.propO] }}
                  </div>
                  <div class="item-color">
                    {{ tItem[tItem.propT] }}
                  </div>
                </div>
              </div>

              <div
                class="btnRender"
                v-if="
                  childItem.showBtn
                    ? collapse.btnRender && childItem.formatterStatus.text === '已完成'
                    : collapse.btnRender
                "
              >
                <el-button
                  v-for="(btnItem, btnIndex) in collapse.btnRender"
                  :key="btnIndex"
                  @click.prevent="btnItem.btnEvent(childItem)"
                  type="text"
                  size="small"
                >
                  <img
                    width="20"
                    height="20"
                    :src="require('@/assets/img/' + btnItem.icon + '.png')"
                    :alt="btnItem.alt"
                    :title="btnItem.alt"
                  />
                </el-button>
              </div>
            </div>

            <!-- 暂无显示区域 -->
            <p v-if="item.children && item.children.length === 0" style="text-align: center">
              暂无预警
            </p>
            <p v-if="item.isLoad" style="text-align: center">
              <i class="el-icon-loading"></i> 加载中...
            </p>
            <p v-if="item.isFinish" style="text-align: center">
              <i class="el-icon-finished"></i> 没有更多了
            </p>
          </div>
        </el-collapse-item>
      </template>
    </el-collapse>
  </div>
</template>

<script>
export default {
  props: {
    collapse: {
      type: Object
    },
    dHeight: {
      type: [String, Number],
      default: 450
    }
  },
  data () {
    return {
      isActiveId: -1
    }
  },

  computed: {
    showListLength () {
      let items = this.collapse.list.filter(i => i.isShow)
      return items.length
    },
    curDHeight () {
      if (this.showListLength === 1) {
        return this.dHeight - 100
      }
      return this.dHeight
    }
  },

  methods: {
    //下拉加载
    discuzScroll (e, index) {
      let ele = e.srcElement ? e.srcElement : e.target

      if (
        ele.scrollTop + ele.offsetHeight > ele.scrollHeight - 30 &&
        !this.collapse.list[index].isLoad &&
        !this.collapse.list[index].isFinish
      ) {
        //监听滚动到div底部
        this.$emit('discuzScroll', index)
      }
    },

    handleClick (item, idx) {
      this.isActiveId = item.id
      this.$emit('handleClick', item, idx)
    },

    loadMore (id) {
      this.$emit('load', id)
    },

    scrollShow (id) {
      this.$nextTick(() => {
        if (!document.getElementById('scollId' + id)) return false
        if (!this.$el.querySelector('#scollId' + id)) return false
        this.$el.querySelector('#scollId' + id).scrollIntoView({
          behavior: 'smooth', // 平滑过渡
          block: 'start' // 上边框与视窗顶部平齐。默认值
        })

        this.isActiveId = id
      })
    }
  }
}
</script>

<style lang="less" scoped>
.Collapse {
  height: 100%;
  .isActiveGroup {
    color: #ceab23;
  }
  .childItem {
    position: relative;
    padding: 10px 15px;
    cursor: pointer;
    &:hover {
      background-color: var(--table-head-bg-color);
    }

    &.isActive {
      background-color: var(--table-head-bg-color);
      .childItem-header {
        color: #ceab23;
        .line {
          background-color: #ceab23;
        }
      }
    }
    .childItem-header {
      display: flex;
      align-items: center;
      .line {
        background-color: var(--base-text-color-1);
        width: 3px;
        height: 16px;
        margin-right: 6px;
        border-radius: 2px;
      }
    }
  }
}

/deep/.el-collapse {
  overflow: hidden;
  overflow-y: scroll !important;
  height: calc(100% - 50px);
  &::-webkit-scrollbar {
    display: none;
  }

  -ms-scroll-chaining: chained;
  -ms-overflow-style: none;
  -ms-content-zooming: zoom;
  -ms-scroll-rails: none;
  -ms-content-zoom-limit-min: 100%;
  -ms-content-zoom-limit-max: 500%;
  -ms-scroll-snap-type: proximity;
  -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
}
.infoItem {
  display: flex;
  .label {
    color: var(--base-text-color-to-999999);
  }
  .value {
    flex: 1 1 auto;
    flex: 1;
  }
}

.scroll {
  overflow: hidden;
  overflow-y: auto !important;

  // max-height: calc(100vh - 450px);
}

.between {
  display: flex;
  justify-content: space-between;
  .item-color {
    color: var(--base-text-color-1);
  }
}

.sign {
  font-size: 12px;
  line-height: 16px;
  padding: 2px 6px;
  color: #fff;
  margin-left: 8px;
}

.btnRender {
  position: absolute;
  bottom: 5px;
  right: 16px;
}
</style>
