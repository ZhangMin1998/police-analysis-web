<template>
  <div class="MapSwitchType">
    <ul class="MapSwitchType-ul">
      <li
        class="MapSwitchType-li"
        v-for="(item, index) in typeList"
        :key="index + '_' + item.value"
        @click="handleClick(item.value)"
      >
        <img
          class="MapSwitchType-li-img"
          :src="require(`@/assets/img/${theme === 'light' ?  item.url + '-light' : item.url}${checked.includes(item.value) ? '' : '-g'}.png`)"
          :title="item.text"
          :alt="item.text"
        />
      </li>
    </ul>

    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { deviceTypeList } from '@/utils/common.js'
import { mapState } from 'vuex'
export default {
  name: 'MapSwitchType',
  data () {
    return {
      typeList: Object.freeze(deviceTypeList),
      checked: []
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    })
  },
  mounted () {
    this.checked = this.typeList.map(_c => _c.value)
  },
  methods: {
    handleClick (value) {
      const index = this.checked.findIndex(_c => _c === value)
      if (index !== -1) {
        this.checked.splice(index, 1)
      } else {
        this.checked.push(value)
      }
      // console.log(this.checked);
      this.$emit('handleClick', this.checked)
    }
  }
}
</script>

<style lang="less" scoped>
.MapSwitchType {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 14px;
  display: flex;
  align-items: center;
  z-index: 10;
  .MapSwitchType-ul {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    border-radius: 40px;
    background-color: rgba(255, 255, 255, 0.1);
    .MapSwitchType-li {
      cursor: pointer;
      width: 48px;
      height: 54px;
      margin-right: 24px;
      &:last-child {
        margin-right: 0.025rem;
      }
      .MapSwitchType-li-img {
        width: 54px;
        height: 54px;
      }
    }
  }
}
</style>
