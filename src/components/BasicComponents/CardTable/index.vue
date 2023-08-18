<template>
  <div class="CardTable">
    <div class="CardTable_cards" :style="{ height: heightTable }">
      <div class="CardTable_cards_row">
        <div class="CardTable_cards_col" v-for="item in list" :key="item.id">
          <ThingCard
            v-if="
              item.typeCode !== 'attr_identity_card_type' && item.typeCode !== 'attr_phone_type'
            "
            :item="item"
            @handleCheck="handleCheck"
          ></ThingCard>
          <PhoneCard
            v-if="item.typeCode === 'attr_phone_type'"
            :item="item"
            @handleCheck="handleCheck"
          ></PhoneCard>
          <Card
            v-if="item.typeCode === 'attr_identity_card_type'"
            :item="item"
            @handleCheck="handleCheck"
          ></Card>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="CardTable_pager" v-if="pager">
      <div class="totals">总数：{{ pager.total || 0 }}</div>
      <el-pagination
        v-if="pager.total > pager.pageSize"
        background
        layout="prev, pager, next"
        :page-size="pager.pageSize"
        :pager-count="pager.pagerCount ? pager.pagerCount : 7"
        :total="pager.total"
        :current-page.sync="pager.curPage"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Card from '@/components/BasicComponents/Card'
import ThingCard from '@/components/BasicComponents/Card/ThingCard.vue'
import PhoneCard from '@/components/BasicComponents/Card/PhoneCard.vue'

export default {
  name: 'CardTable',
  components: {
    Card,
    ThingCard,
    PhoneCard
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    pager: {
      type: Object,
      default: () => { }
    },
    subHeight: {
      type: [Number, String],
      default: 480
    }
  },
  setup (prop, context) {
    // 分页
    const handleCurrentChange = pageIndex => {
      context.emit('handleCurrentChange', pageIndex)
    }

    const handleCheck = item => {
      context.emit('handleCheck', item)
    }

    const heightTable = `calc(100vh - ${prop.subHeight}px)`

    return {
      handleCurrentChange,
      handleCheck,
      heightTable
    }
  }
}
</script>

<style lang="less" scoped>
.CardTable {
  width: 1677px;
  .CardTable_cards {
    overflow: auto;
    .CardTable_cards_row {
      display: flex;
      flex-wrap: wrap;
      .CardTable_cards_col {
        margin-bottom: 16px;
        margin-right: 18px;
        &:last-child {
          margin-bottom: 0;
        }
        &:nth-child(6) {
          margin-right: 0px;
        }
      }
    }
  }

  .CardTable_pager {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
/deep/ .pagination .el-input__inner {
  border: 1px solid rgba(53,62,91,0.64) !important;
}
</style>
