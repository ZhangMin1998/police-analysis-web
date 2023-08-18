<template>
  <div class="card">
    <div v-if="item.typeCode !== 'attr_mac_type'">
      <div class="card_name">{{ item.index || '--' }}</div>
      <div class="card_label">
        <Ellipsis :wordsLength="9" :value="getTypeName(item.typeCode) || ''" />：
        <Ellipsis :wordsLength="13" :value="item.index || ''" />
      </div>
    </div>
    <div v-if="item.typeCode === 'attr_mac_type'">
      <div class="card_name">{{ item.mac || '--' }}</div>
      <div class="card_label">
        <!-- 超出文字 显示省略号 -->
        {{ getTypeName(item.typeCode) }} ：<Ellipsis :wordsLength="9" :value="item.mac || ''" />
      </div>
    </div>

    <div class="card_optImg" @click="handleCheck(item)">
      <img
        :src="require('@/assets/img/icon-check.png')"
        alt="详情"
        title="详情"
        width="24"
        height="24"
      />
    </div>
  </div>
</template>

<script>
// import { reactive, toRefs } from '@vue/composition-api'
import Ellipsis from '@/components/BasicComponents/Ellipsis'

export default {
  name: 'ThingCard',
  components: {
    Ellipsis
  },
  props: {
    item: {
      type: Object,
      default: () => { }
    }
  },
  methods: {
    getTypeName (type) {
      const tempFilterArr = this.$store.state.Dict.extrTypeList.filter((item) => {
        if (item.typeCode === type) {
          return item
        }
      })
      return tempFilterArr[0].typeName
    }
  },
  setup (prop, context) {
    const handleCheck = item => {
      context.emit('handleCheck', item)
    }
    return {
      handleCheck
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px;
  background-color: var(--table-head-bg-color);
  width: 260px;
  height: 135px;
  box-sizing: border-box;
  position: relative;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .card_name {
    font-size: 18px;
    font-weight: 600;
    color: var(--base-text-color-1);
    margin-bottom: 10px;
  }
  .card_label {
    display: flex;
    color: var(--base-text-color-to-999999);
    line-height: 28px;
    > span {
      color: var(--base-text-color-1);
    }
    .value {
      color: var(--base-text-color-1);
    }
  }
  .card_optImg {
    cursor: pointer;
    position: absolute;
    top: 16px;
    right: 16px;
  }
}
</style>
