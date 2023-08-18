<template>
  <div class="CusSelect">
    <div class="CusSelect-checked" @click="handleOpen">
      <div class="icon-filter"></div>
      <div class="CusSelect-title">{{ title }}</div>
      <div class="CusSelect-line"></div>
      <ul class="CusSelect-checked-ul">
        <li
          class="CusSelect-checked-li"
          v-for="(item, index) in checked"
          :key="index + '_' + item.label"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>

    <div :class="['CusSelect-mode', { isShow: show }]">
      <ul class="CusSelect-mode-main">
        <li class="CusSelect-mode-main-li" v-for="(item, index) in list" :key="index">
          <ul class="CusSelect-mode-main-ul">
            <li
              :class="['CusSelect-mode-item', { isActive: isActive(listItem.value) }]"
              v-for="(listItem, listIndex) in item.list"
              :key="listIndex + '_' + item.label"
              @click="handleChoose({ ...listItem, outIndex: index })"
            >
              {{ listItem.label }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CusSelect',
  props: { list: Array, title: String, checkList: Array },
  data () {
    return {
      show: false,
      checked: []
    }
  },
  mounted () {
    this.checked = [...this.checkList]
  },
  methods: {
    isActive (value) {
      return this.checked.some(_c => _c.value === value)
    },
    handleOpen () {
      this.show = !this.show
    },
    handleChoose (item) {
      const { outIndex, value, label } = item
      const has = this.checked.some(_c => _c.value === value)
      if (has) return

      this.checked.push({
        label,
        value
      })

      const otherItem = this.list[outIndex].list.filter(_c => _c.value !== value)

      this.checked = this.checked.filter(item => !otherItem.some(ele => ele.value === item.value))

      this.$emit('handleChecked', this.checked)
    }
  }
}
</script>

<style lang="less" scoped>
.CusSelect {
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 2px;
  box-sizing: border-box;
  .CusSelect-checked {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    margin-bottom: 4px;
    background: linear-gradient(
      40deg,
      rgba(22, 30, 49, 0) 0%,
      rgba(22, 30, 49, 0.5) 12%,
      #161e31 80%
    );
    .icon-filter {
      width: 16px;
      height: 16px;
      margin-right: 16px;
      background: url('~@/assets/img/map-shuaixuan.png') no-repeat;
      background-size: 100% 100%;
    }
    .CusSelect-line {
      width: 2px;
      height: 12px;
      margin: 0 16px;
      background-color: #96a7d3;
    }
    .CusSelect-title {
      font-size: 18px;
      color: #ffdaa6;
    }
    .CusSelect-checked-ul {
      display: flex;
      .CusSelect-checked-li {
        padding: 4px 16px;
        margin-right: 12px;
        color: var(--base-text-color-to-999999);
        background: linear-gradient(40deg, rgba(46, 54, 85, 0) 0%, rgba(46, 54, 85, 0.7) 12%);
        border-radius: 6%;
      }
    }
  }

  .CusSelect-mode {
    min-height: 50px;
    font-size: 14px;
    color: var(--base-text-color-to-999999);
    box-sizing: border-box;
    opacity: 0;
    background: linear-gradient(
      40deg,
      rgba(22, 30, 49, 0) 0%,
      rgba(22, 30, 49, 0.5) 12%,
      #161e31 80%
    );
    transition: opacity 0.4s linear;
    &.isShow {
      opacity: 1;
      transition: opacity 0.4s linear;
    }
    .CusSelect-mode-main {
      padding: 0 10px;
      .CusSelect-mode-main-li {
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        &:last-child {
          border: none;
        }
        .CusSelect-mode-main-ul {
          display: flex;
          padding: 10px 20px;
          .CusSelect-mode-item {
            cursor: pointer;
            padding: 8px 20px;
            border-radius: 45%;
            &.isActive {
              box-shadow: 0px 0px 10px rgba(23, 125, 220) inset;
              border: 1px solid rgba(23, 125, 220, 0.5);
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
