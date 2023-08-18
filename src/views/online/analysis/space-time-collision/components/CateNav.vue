<template>
  <div class="tab-nav">
    <ul class="device-list-nav">
      <li v-for="(item, index) in deviceList" :key="index" @click="toggle(index)">
        <img
        draggable="false"
          :src="
            require('@/assets/img/icon-tab-' +
              (!item.isGrey ? 'big-' : 'big-') +
              (index + 1) + (!item.isGrey ? '' : '-g') +
              '.png')
          "
          alt=""
        />

      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      deviceList: [
        {index: 1, type: 'wifi', isGrey: false },
        {index: 2, type: 'wifi', isGrey: false },
        {index: 3, type: 'wifi', isGrey: false },
        {index: 4, type: 'wifi', isGrey: false },
        {index: 5, type: 'wifi', isGrey: false },
        {index: 6, type: 'wifi', isGrey: false },
        {index: 7, type: 'wifi', isGrey: false },
        {index: 8, type: 'wifi', isGrey: false },
      ],
    }
  },
  methods: {
    toggle (index) {
      this.deviceList[index].isGrey = !this.deviceList[index].isGrey
      const curStatus = this.deviceList[index].isGrey
      const highArr = this.deviceList.filter(_c => !_c.isGrey).map(_c => _c.index)
      this.$emit('shiftSelect', { index: index + 1, activeList: highArr, status: !curStatus } )
    },
  },
}
</script>

<style scoped>
.tab-nav {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  display: flex;
  align-items: center;
}
ul {
  user-select: none;
  display: flex;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 40px;
}
ul li {
  /* background: url("../../assets/img/icon-bg.png") no-repeat; */
  background-size: 100% 100%;
  margin-right: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
ul li:last-child {
  margin-right: 0;
}
ul li img {
  width: 54px;
  height: 54px;
}
.tab-nav > div {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  margin-left: 16px;
}
</style>
