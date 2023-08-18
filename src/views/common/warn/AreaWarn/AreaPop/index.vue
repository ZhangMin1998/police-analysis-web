<template>
  <div>
    <div class="info_title">
      <div>
        {{ curAreaInfo.warningName }}
      </div>
      <div
        class="info_level"
        :style="{
          background: `linear-gradient(
      91deg,
      ${levelColorObj[curAreaInfo.fenceLevel]} 0%,
      rgba(227, 61, 86, 0.14) 100%
    )`
        }"
      >
        {{ levelObj[curAreaInfo.fenceLevel] }}
      </div>
      <div>
        <i
          v-if="curAreaInfo.id"
          class="el-icon-edit-outline"
          @click="
            $router.push({
              name: 'AreaWarnForm',
              query: { id: curAreaInfo.id }
            })
          "
        ></i>
      </div>
      <div>
        <i class="el-icon-delete" v-if="curAreaInfo.id" @click="handleDelArea(curAreaInfo.id)"></i>
      </div>
    </div>
    <ul>
      <li class="info_item" v-for="item in areaInfos" :key="item.label">
        <div>{{ item.label }}：</div>
        <div class="info_item_value">
          <Ellipsis :wordsLength="26" :value="curAreaInfo[item.prop]" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Ellipsis from '@/components/BasicComponents/Ellipsis'
import { mapState } from 'vuex'

export default {
  components: {
    Ellipsis
  },
  props: {
    curAreaInfo: {
      type: Object
    },
    areaInfos: {
      type: Array
    }
  },
  computed: {
    ...mapState('trackWarning', {
      levelColorObj: 'levelColorObj',
      levelObj: 'levelObj'
    })
  },
  methods: {
    handleDelArea (id) {
      this.$emit('handleDelArea', id)
    }
  }
}
</script>

<style lang="less" scoped>
.info_item {
  display: flex;
  align-items: center;
  line-height: 30px;
  color: var(--base-text-color-to-999999);
  .info_item_value {
    flex: 1;
  }
}
.info_title {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  color: var(--base-text-color-1);
  .info_level {
    width: 110px;
    height: 24px;
    color: #fff;
    line-height: 24px;
    font-size: 14px;
    margin-left: 24px;
    padding-left: 14px;
    box-sizing: border-box;
  }
  i {
    margin-left: 16px;
    font-size: 16px;
    cursor: pointer;
    &:hover {
      color: #228ffe;
    }
  }
}
</style>
