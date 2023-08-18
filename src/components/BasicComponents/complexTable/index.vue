<template>
  <div class="fileShowTable">
    <div class="list" v-for="(item, idx) in info" :key="idx + item">
      <div class="items" v-for="(_item, _idx) in item" :key="_idx">
        <div class="label" v-if="labels[_item.key] != undefined">
          {{ labels[_item.key] + (_idx + 1) + ':' }}
        </div>
        <div class="desc" v-if="labels[_item.key] != undefined">{{ _item.value || '--' }}</div>
      </div>
    </div>

    <div class="emptyBox" v-if="emptyIsShow">
      <EmptyData />
    </div>
  </div>
</template>

<script>
import EmptyData from '@/components/BasicComponents/EmptyData'

export default {
  name: 'complexTable',
  components: {
    EmptyData,
  },
  props: {
    info: {
      type: Object,
      // required: true
      default: () => { }
    },
    labels: {
      type: Object
    },
    isAdd: {
      type: Boolean
    }
  },
  data () {
    return {
      activeIdx: -1,
      emptyIsShow: null,
    }
  },
  watch: {
    info (val) {
      this.info = val
    },
    deep: true
  },
  created () {
    if (Object.keys(this.info).length === 0 && !this.isAdd) {
      this.emptyIsShow = true
    }
  },
  methods: {
  },
}
</script>

<style lang="less" scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  .items {
    display: flex;
    flex: 0 0 50%;
    margin-bottom: 25px;

    .desc {
      width: 200px;
      color: var(--base-text-color-1);
    }
    .label {
      width: 100px;
    }
  }
}

.emptyBox {
  height: calc(100vh - 258px);
}
</style>
