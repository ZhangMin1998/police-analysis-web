<template>
  <div>
    <div class="info_title">
      <div>
        {{ curPersonInfo.personnelName || curPersonInfo.personName || curPersonInfo.warningName }}
        {{ curPersonInfo.sex ? '/' + curPersonInfo.sex : '' }}
      </div>
      <div
        class="info_level"
        :style="{
          background: `linear-gradient(
      91deg,
      ${levelColorObj[curPersonInfo.fenceLevel || curPersonInfo.warningLevel]} 0%,
      rgba(227, 61, 86, 0.14) 100%
    )`
        }"
      >
        {{ levelObj[curPersonInfo.fenceLevel || curPersonInfo.warningLevel] }}
      </div>
    </div>
    <ul>
      <li class="info_item" v-for="item in personInfos" :key="item.label">
        <div>{{ item.label }}：</div>
        <div class="info_item_value">
          <Ellipsis :wordsLength="26" :value="curPersonInfo[item.prop]" />
        </div>
      </li>

      <slot></slot>
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
    curPersonInfo: {
      type: Object
    },
    personInfos: {
      type: Array
    }
  },
  computed: {
    ...mapState('trackWarning', {
      levelColorObj: 'levelColorObj',
      levelObj: 'levelObj'
    })
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

/deep/.el-radio {
  margin-right: 12px;
}
/deep/.el-radio__label {
  font-size: 12px;
  padding-left: 2px;
}
</style>
