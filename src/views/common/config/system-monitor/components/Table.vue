<template>
  <div class="Table">
    <TableGrid
      :haveHeader='false'
      :haveSearchInput='false'
      :isSearchTime='false'
      :tableColumns='columns'
      :data="tableData"
      :haveFloor="false"
      :pagination="false"
      reqMethod="post"
      :url='url'
      :haveIndex="haveIndex"
    >
      <!-- 两个灯 -->
      <div class="statusLight" slot="syncFlag" slot-scope="{ row }">
        <div class="content">
          <div class="name">连接</div>
          <div :class="[row.syncFlag ? 'greenlight' : 'redlight']"></div>
          <!-- <img v-if="row.syncFlag" src="@/assets/img/car-start.png"/>
          <img v-else src="@/assets/img/car-end.png"/> -->
        </div>
        <div class="content">
          <div class="name">运行</div>
          <div :class="[row.syncFlag ? 'greenlight' : 'redlight']"></div>
        </div>
      </div>
      <!-- 一个灯 -->
      <div class="statusLight" slot="oneLight" slot-scope="{ row }">
        <div class="content">
          <div class="name">连接</div>
          <div :class="[row.syncFlag ? 'greenlight' : 'redlight']"></div>
        </div>
      </div>
      <!-- 就一个灯   连接-->
      <div class="statusLight" slot="conn" slot-scope="{ row }">
        <div class="content">
          <div :class="[row.conn ? 'greenlight' : 'redlight']"></div>
        </div>
      </div>
       <!-- 就一个灯 运行--->
       <div class="statusLight" slot="running" slot-scope="{ row }">
        <div class="content">
          <div :class="[row.running ? 'greenlight' : 'redlight']"></div>
        </div>
      </div>
    </TableGrid>
  </div>
</template>

<script>
import TableGrid from '@/components/VisualComponents/TableGrid'
export default {
  name: 'Table',
  components: {
    TableGrid
  },
  props: {
    tableData:{
      type: Array,
      default: () => []
    },
    url: {
      type: String,
      default: ''
    },
    columns: {
      type: Array,
      default: () => []
    },
    haveIndex: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {

    }
  },
  created () {
    // console.log(this.url)
  }
}
</script>

<style lang="less" scoped>
.Table{
  padding: 24px 24px;
  overflow: auto;
  // min-height: 100px;
  position: relative;
  margin-bottom: 20px;
  background: var(--bg-color-2);
}
.statusLight{
  display: flex;
  .content{
    display: flex;
    align-items: center;
    line-height: 16px;
    margin-right: 40px;
    .name{
      margin-right: 8px;
    }
    .redlight{
      // margin-left: 8px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #FF106E;
    }
    .greenlight{
      // margin-left: 8px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #0CBF7E;
    }
  }
}
/deep/.is-scrolling-none {
  height: 100% !important;
}
</style>
