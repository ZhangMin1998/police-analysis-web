<template>
  <div class="superSearch">
    <div class="reverse-rotate"></div>
    <div class="rotate"></div>
    <div class="base"></div>
    <div></div>
    <div class="left-brackets"></div>
    <div class="right-brackets"></div>
    <div class="center-bg"></div>
    <main class="main">
      <Search :searchKey.sync="searchKey" @handleSearch="handleSearch"></Search>
    </main>
  </div>
</template>

<script>
import Search from './components/Search'
export default {
  name: 'SuperSearch',
  components: {
    Search
  },
  data () {
    return {
      searchKey: '',
      isSearch: false
    }
  },
  mounted () {
    //  document.body.style.overflow = 'hidden'
  },
  beforeDestroy () {
    // document.body.style.overflow = 'auto'
  },
  methods: {
    handleSearch () {
      if (!this.searchKey) return
      this.isSearch = true
      this.$router.push({
        name: 'superSearchDetail',
        query: { searchKey: this.searchKey,searchCount :0 }
      })
    }
  },
  activated () {
    if (this.searchKey && this.isSearch) {
      this.$router.push({
        name: 'superSearchDetail',
        query: { searchKey: this.searchKey,searchCount :0 }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .superSearch {
    width: 100%;
    display: flex;
    height: calc(100vh - 100px);
    overflow: hidden;
    position: relative;
    justify-content: center;
    box-sizing: border-box;
    .main {
      margin-top: 238px;
    }
    .rotate {
      width: 623px;
      height: 623px;
      position: absolute;
      top: 146px;
      // top: calc(176 / 1920 * 100%);
      left: 531px;
      // left: calc(531 / 1920 * 100%);
      background: url(~@/assets/img/supersearch-rotate.png);
      background-size: 100% 100%;
      -webkit-transition-property: -webkit-transform;
      -webkit-transition-duration: 3s;
      -moz-transition-property: -moz-transform;
      -moz-transition-duration: 3s;
      -webkit-animation: rotate 9s linear infinite;
      -moz-animation: rotate 9s linear infinite;
      -o-animation: rotate 9s linear infinite;
      animation: rotate 9s linear infinite;
    }
    .reverse-rotate {
      width: 90px;
      height: 445px;
      position: absolute;
      top: 230px;
      left: 798px;
      // left: calc(798 / 1920 * 100%);
      background: url(~@/assets/img/supersearch-reverse-rotate.png);
      background-size: 100% 100%;
      animation: circling 9s linear 0s infinite;
    }

    @keyframes circling {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(-360deg);
      }
    }
    .base {
      width: 473px;
      height: 473px;
      position: absolute;
      top: 222px;
      left: 606px;
      // left: calc(606 / 1920 * 100%);
      background: url(~@/assets/img/supersearch-base-bg.png);
      background-size: 100% 100%;
    }
    .left-brackets {
      //  width: 10px;
      // height: 100px;
      position: absolute;
      width: 83px;
      height: 693px;
      top: 112px;
      //  top: 410px;
      // opacity: 0;
      background: url(~@/assets/img/supersearch-left.png);
      background-size: 100% 100%;
      // background-size: contain;
      // background-repeat: no-repeat;
      animation: moveright  0.5s ease-in;
      animation-fill-mode: forwards;
    }
    @keyframes moveright {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(-720px);
        width: 83px;
        height: 693px;
        top: 112px;
        // opacity: 1;
      }
    }
    .right-brackets {
      position: absolute;
      width: 83px;
      height: 693px;
      top: 112px;
      // opacity: 0;
      background: url(~@/assets/img/supersearch-right.png);
      background-size: 100% 100%;
      // background-size: contain;
      // background-repeat: no-repeat;
      animation: moveleft  0.5s ease-in;
      animation-fill-mode: forwards;
    }
    @keyframes moveleft {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(720px);
        width: 83px;
        height: 693px;
        top: 112px;
        // opacity: 1;
      }
    }
    .center-bg {
      width: 1100px;
      height: 761px;
      position: absolute;
      top: 77px;
      left: 293px;
      // left: calc(293 / 1920*100%);
      background: url(~@/assets/img/supersearch-arrow.png);
      background-size: 100% 100%;
      animation: shine 0.4s linear;
    }
    @keyframes shine {
      0% {
        opacity: 0;
      }
      25% {
        opacity: 1;
      }
      50% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }
</style>
