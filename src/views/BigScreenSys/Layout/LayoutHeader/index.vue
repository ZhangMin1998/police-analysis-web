<template>
  <div class="LayoutHeader">
    <h1 class="LayoutHeader-title">{{ '公安大数据联合实战平台' || title }}</h1>
    <div class="LayoutHeader-tab">
      <CusTab
        :tabList="[{ label: '监控中心', value: 'MonitoringCenter' }]"
        ref="CusTab"
        :CusTabUlCss="{ justifyContent: 'space-between', width: '54vw' }"
        @handleChangeTab="handleChangeTab"
      ></CusTab>
      <!--   { label: '研判中心', value: 'ResearchCenter' }, -->
    </div>

    <div class="LayoutHeader-btns">
      <ul class="LayoutHeader-btns-ul">
        <li
          v-for="(item, index) in btns"
          :key="index + '_' + item.text"
          @click="handleClick(item.text)"
        >
          <img
            class="LayoutHeader-li-img"
            :src="require(`@/assets/img/${item.icon}${isText === item.text ? '' : '-g'}.png`)"
            :title="item.text"
            :alt="item.text"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import CusTab from '@/components/BasicComponents/CusTab/index'

const btns = [
  { icon: 'icon-echart', text: '统计展示' },
  { icon: 'icon-logout', text: '退出系统' }
]
export default {
  name: 'LayoutHeader',
  components: {
    CusTab
  },
  data () {
    return {
      btns: Object.freeze(btns),
      isText: ''
    }
  },
  computed: {
    ...mapState('Dict', {
      title: 'title'
    }),

    curRouteName () {
      return this.$route.name
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.CusTab.checkedValue = 'MonitoringCenter'
    })
  },
  methods: {
    ...mapMutations('Common', {
      setEchatsState: 'setEchatsState'
    }),

    handleClick (text) {
      if (text === '退出系统') {
        this.isText = ''
        this.setEchatsState(false)
        this.LoginOut()
        return
      }
      if (this.isText === '统计展示') {
        this.isText = ''
        this.setEchatsState(false)
        return
      }

      if (text === '统计展示') {
        this.isText = '统计展示'
        this.setEchatsState(true)
      }
    },
    handleChangeTab (curTabValue) {
      this.$nextTick(() => {
        this.$refs.CusTab.checkedValue = curTabValue
      })
    },

    // 退出系统
    LoginOut () {
      this.$store.dispatch('Common/LoginOut').then(() => {
        sessionStorage.clear()
        this.$router.push({ name: 'bigScreenlogin' })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.LayoutHeader {
  display: flex;
  justify-content: center;
  position: relative;
  width: 100vw;
  height: 72px;
  min-height: 60px;
  background: url('~@/assets/img/Layout-bgHeader.png') no-repeat #161e31;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  .LayoutHeader-tab {
    padding-top: 30px;
  }
  .LayoutHeader-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    padding-top: 4px;
    font-size: 24px;
    font-weight: bold;
    color: #f1f4f8;
    text-shadow: 0px 0px 0 8px rgba(189, 203, 246, 0.42);
    letter-spacing: 4px;
    box-sizing: border-box;
  }
  .LayoutHeader-btns {
    position: absolute;
    top: 50%;
    right: 0;
    .LayoutHeader-btns-ul {
      display: flex;
      .LayoutHeader-li-img {
        cursor: pointer;
        width: 20px;
        height: 20px;
        margin-right: 24px;
      }
    }
  }
}
</style>
