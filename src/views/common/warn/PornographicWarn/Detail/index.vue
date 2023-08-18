<template>
  <div class="PornographicWarn-detail">
    <el-container>
      <slot name="detailAside">
        <!-- <el-aside width="200px"> </el-aside> -->
      </slot>
      <el-main>
        <slot name="detailHeader" :row="dataObj"></slot>

        <ul>
          <li v-for="(item, index) in labelList" :key="index + '_' + item.label">
            <CusLineTitle :icon="item.icon" :title="item.label"></CusLineTitle>
            <ul class="PornographicWarn-detail-info">
              <li
                v-for="(childrenItem, childrenIndex) in item.children"
                :key="childrenIndex + '_' + childrenItem.prop"
              >
                <div class="label">{{ childrenItem.label }}：</div>
                <div class="value">
                  <!-- 超出文字 显示省略号 -->
                  <Ellipsis :wordsLength="26" :value="dataObj[childrenItem.prop]" />
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Ellipsis from '@/components/BasicComponents/Ellipsis'

export default {
  components: {
    Ellipsis
  },
  props: {
    dataObj: { type: Object },
    list: { type: Array },
    labelList: { type: Array }
  },
  created () {
    console.log(this.dataObj)
  }
}
</script>

<style lang="less" scoped>
.el-main {
  padding: 0 0 0 10px;
}
.PornographicWarn-detail {
  .PornographicWarn-detail-info {
    display: flex;
    flex-wrap: wrap;
    padding: 6px 0px 14px 10px;
    box-sizing: border-box;
    & > li {
      display: flex;
      width: 32%;
      padding-top: 12px;
      margin-right: 2%;
    }
    > li:nth-child(3n) {
      margin-right: 0;
    }
  }
}
</style>>

