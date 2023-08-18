<template>
  <div>
    <el-container>
      <!-- ------------  标题  ------------- -->
      <el-header height="48">
        <div class="header-t">
          <div class="title">
            <list-title title="规则预警"></list-title>
          </div>
          <!-- <div class="device-mode" @click="goTo">预警地图</div> -->
          <BackPrevious @click="goTo"></BackPrevious></div
      ></el-header>

      <el-main class="main-nav">
        <!-- ------------ tab 导航  ------------- -->
        <el-row :gutter="10">
          <el-col
            :sm="12"
            :md="12"
            :lg="6"
            :xl="6"
            v-for="(item, index) in navList"
            :key="item.title"
          >
            <div
              :class="[
                'grid-content',
                ' bg-purple',
                'navBtn',
                'btn',
                { isActive: item.name === activeName },
                { boxShadow: theme === 'light' }
              ]"
              @click.prevent.stop="handleClick(item.name)"
            >
              <div class="img">
                <img
                  width="64"
                  height="64"
                  :src="require('@/assets/img/icon-rules-' + index + '.png')"
                  :alt="item.title"
                />
              </div>
              <div>
                <div class="title">{{ item.title }}</div>
                <div class="dec">{{ item.dec }}</div>
              </div>
            </div></el-col
          >
        </el-row>
        <!-- ------------ 导航内容 ------------- -->
        <div>
          <component :is="activeName"></component>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Track from '@/views/common/warn/MapWarn/Rules/Track/index'
import Feature from '@/views/common/warn/MapWarn/Rules/Feature/index'
import Analysis from '@/views/common/warn/MapWarn/Rules/Analysis'
import Area from '@/views/common/warn/MapWarn/Rules/Area'
import { mapState } from 'vuex';

const NAV_lIST = [
  {
    title: '聚集预警',
    dec: '通过设置场所和重点人数量，对重点人进行实时聚集监控，一旦重点人在特定时间内聚集，将可即时监控。',
    name: 'Track',
    key: 'rule_list:crowd _warning_rules'
  },
  {
    title: '特征预警',
    dec: '通过设置目标的MAC QQ 微信 手机号 邮箱 身份证号 车牌号的信息，对设置数据实时跟踪定位，并对出现的数据进行预警。',
    name: 'Feature',
    key: 'rule_list:feature_warning_rules'
  },
  {
    title: '作息预警',
    dec: '通过设置频繁夜出和昼伏夜出两种形式，对目标人群进行监控。',
    name: 'Analysis'
  },
  {
    title: '区域预警',
    dec: '通过设置区域范围内的徘徊人员，长期逗留人员和禁止进入人员，对其进行监控。',
    name: 'Area'
  }
]

export default {
  components: {
    Feature,
    Track,
    Analysis,
    Area
  },
  data () {
    return {
      activeName: 'Track',
      navList: Object.freeze(NAV_lIST)
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
    curMapWarnCurTab () {
      return window.localStorage.getItem('curMapWarnCurTab')
    }
  },

  created () {
    this.navList = this.$backPermissionsArray(NAV_lIST)
    this.navList = this.navList.filter(item =>
      this.$store.state.User.mapWarnShowList.includes(item.name)
    )

    // 刷新保存当前tab  复现时默认选中
    if (this.curMapWarnCurTab) {
      this.activeName = this.curMapWarnCurTab
    } else {
      // 初始进入
      this.activeName = this.navList[0].name
      window.localStorage.setItem('curMapWarnCurTab', this.activeName)
    }
  },

  beforeDestroy () {
    if (this.curMapWarnCurTab) {
      window.localStorage.setItem('curMapWarnCurTab', this.activeName)
    }
  },

  methods: {
    goTo () {
      this.$router.push({ name: 'MapWarn' })
    },

    handleClick (name) {
      this.activeName = name
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  color: var(--base-text-color-to-999999);
  .el-header {
    background-color: var(--bg-color-3);
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 1px;
    .header-t {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 0;
      .device-mode {
        background: #202b3f;
        width: 133px;
        height: 32px;
        line-height: 32px;
        color: #d8b733;
        font-weight: bold;
        font-size: 14px;
        padding-left: 17px;
        box-sizing: border-box;
        background: url('~@/assets/img/list-mode-bg.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }
  }
}
.main-nav {
  background-color: var(--bg-color-3);
  .el-row {
    margin-bottom: 20px;
    .el-col {
      border-radius: 4px;
      .grid-content {
        border-radius: 4px;
        height: 160px;
        overflow: auto;
      }
      .bg-purple {
        // background-color: #27344d;
        background-color: var(--bg-color-2);
        // box-shadow: var(--box-shadow);
        cursor: pointer;
      }
      .navBtn {
        padding: 14px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        .img {
          margin-right: 16px;
        }
        .title {
          color: var(--base-text-color-1);
          font-size: 18px;
          margin-bottom: 16px;
        }
        .dec {
          font-size: 14px;
          line-height: 22px;
        }
      }
    }
  }
  .btn {
    box-shadow: inset 0 0 8px rgba(255, 255, 255, 0);
    text-shadow: none;
    -webkit-transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
    transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
    &:hover {
      box-shadow: inset 0 0 2px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.2);
      text-shadow: 0px 0px 1px #427388;
    }
    &.isActive {
      box-shadow: inset 0 0 2px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.2);
      text-shadow: 0px 0px 1px #427388;
    }
  }
}
.boxShadow {
  &:hover {
    box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 0, 0, 0.2);
    text-shadow: 0px 0px 1px #427388;
  }
  &.isActive {
    box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 0, 0, 0.2);
    text-shadow: 0px 0px 1px #427388;
  }
}
</style>
