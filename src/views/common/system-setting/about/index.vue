<template>
  <div class="about_container">
    <div class="img">
      <img :src="require('@/assets/img/syset-0.png')" width="80" height="80" />
    </div>
    <div class="h2">{{ title }}</div>
    <div class="h3">Version 1.8.2 (M)</div>
    <div>
      <div class="tab">
        <div class="tab_item" v-for="(item, idx) in tabList" :key="item">
          <span v-if="idx != 0" class="line">|</span>
          <span
            :class="`val ${activeName == item ? 'isActive' : ''}`"
            @click.prevent.stop="handleClick(item)"
            >{{ item }}</span
          >
        </div>
      </div>
      <div class="introduce" v-show="activeName == '功能介绍'">
        <div class="e2">
          广道多维数据AI研判平台是深圳市广道高新技术股份有限公司（以下简称“广道集团”）历时三年打磨开发，经过五大团队配合铸造而成，专为公安提供研判分析和联合实战的大数据架构系统应用，以数据收集出发，以“人、事、物、地、组织”关联人物档案为核心，通过AI机器学习，探索新型犯罪模式；以警种数据融通为基础，优化警种数据共享模式，赋予联合实战新机制；为城市公共安全赋予感知与犯罪预判能力，让城市更安全，为天下创太平。
        </div>
        <br />
        <div class="e2 w">【版本介绍】</div>

        <div class="e2">
          多维数据研判平台是广道集团为公安局特定打造的城市感知与分析系统，主要以卡口数据为基础，对人员轨迹和案情研判做分析，其共计五大模块，十三大功能，帮助公安快速找到线索，为社会安全赋予追溯能力。
        </div>
        <br />
        <div class="e2 w">【新增功能】</div>

        <div class="e2">
          一级菜单 设备地图 数据中心 分析研判 防控预警 系统设置 二级菜单 / WiFi热点 时空碰撞
          特征预警 用户管理 探针数据 时空轨迹 / 系统日志 / 作息分析 个人信息 同行关系 关于平台
        </div>
        <br />
        <div class="e2 w">【功能介绍】</div>

        <div class="e2">1 设备地图</div>
        <div class="e3">›对设备在GIS地图中进行分类展示。</div>
        <div class="e3">
          ›对设备状态在【离线/在线】GIS地图中进行实时更新展示。
        </div>
        <div class="e3">›对场所进行实时监控展示。</div>
        <div class="e3">›对设备和场所进行列表展示，并展示场所与设备详细情况。</div>
        <div class="e3">›对所有设备和场所进行模糊查询。</div>

        <div class="e2">
          2 数据中心
        </div>
        <div class="e3">›针对多维数据研判平台的整体数据进行检索，并还原源数据内容。</div>
        <div class="e3">›对数据类型进行分类并实时更新数据。</div>
        <div class="e3">›对数据源进行详情展示，查看具体的数据信息。</div>
        <div class="e2">3 分析研判</div>
        <div class="e3">
          3.1 时空碰撞
        </div>
        <div class="e4">
          ›利用数据建立案发模型，通过多个时间段和区域范围，找出对应轨迹的源数据。
        </div>
        <div class="e4">›对源数据进行深度查询找到对应人员。</div>
        <div class="e3">
          3.2 时空轨迹
        </div>
        <div class="e4">›通过多要素和时间地点定位方式添加时空坐标，分析嫌疑人轨迹。</div>
        <div class="e4">›结合案发情况调查嫌疑人路径。</div>
        <div class="e3">3.3 同行分析</div>
        <div class="e4">›利用人物档案的关系性，通过一个单一要素或多个要素分析出行人员的轨迹。</div>
        <div class="e4">›找出同行人的档案和轨迹。</div>
        <div class="e3">3.4 作息分析</div>
        <div class="e4">
          ›通过设置作息规律条件，按时间段对应类型的数据，把该数据在该时间段内出现的场所和次数展示出来，通过选择查看以小时为一次或一天为一次，展示不同的次数，点击点位查看具体出现的时间和时长。
        </div>
        <div class="e4">›查看出现在该现场的作息时间规律。</div>
        <div class="e2">4 异常预警</div>

        <div class="e3">4.1 特征预警</div>
        <div class="e4">
          ›此功能需要对单一或多个数据进行设置、标识和建立预警规则，再通过前端感知设备返回数据进行匹配，从而达到预警效果。
        </div>

        <div class="e2">5 系统设置</div>
        <div class="e3">5.1 用户管理</div>
        <div class="e4">
          ›系统设置可用于对用户列表进行增、删、改、查的操作，通过权限列表设置角色的一级与二级菜单使用权；超级管理员并对系统的使用日志进行查看和查询，对用户自己拥有信息修正作用。
        </div>
        <div class="e4"></div>
        <div class="e4"></div>
        <div class="e4"></div>

        <div class="e3">5.2 系统日志 ›系统管理也称为系统日志，对系统的操作进行记录。</div>

        <div class="e3">5.3 个人信息 ›对输入信息“名称、职位和部门”进行修正。</div>
        <div class="e3">5.4 关于平台</div>
        <div class="e4">›该功能主要是对版本号和操作方式进行记录。</div>

        <br />
        <div class="e2 w">【咨询联系】</div>
        <div class="e2">
          如对版本内容不明白或需要说明的用户可同于以下四类方式联系我们，在接到求助后，第一时间与您联系，感谢支持！
        </div>
        <div class="e2">
          官网留言：https://www.suntang.com/ 公司固话：400-881-2626 0755-86656287
        </div>
        <div class="e2">公司邮箱：Office@suntang.com</div>
        <div class="e2">其他方式：请联系广道集团当地服务商，我们将第一时间提供技术支持。</div>
        <div class="e2"></div>
      </div>
      <div class="introduce" v-show="activeName == '检查新版本'">
        新版本
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      activeName: '功能介绍',
      tabList: ['功能介绍'],
    }
  },
  computed: {
    title () {
      return this.$store.state.User.title
    },
    // searchCity() {
    //   return this.$store.state.User.searchCity
    // },
  },
  methods: {
    handleClick (item) {
      this.activeName = item
    },
  },
}
</script>

<style lang="less" scoped>
.about_container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
  .img {
    margin-bottom: 14px;
  }
  .h2 {
    font-size: 20px;
    color: var(--base-text-color-1);
    line-height: 28px;
  }
  .h3 {
    color: var(--input-placehold-color);
    margin-bottom: 14px;
  }
  .tab {
    display: flex;
    color: var(--base-text-color-to-999999);
    cursor: pointer;
    height: 40px;
    justify-content: center;
    .tab_item {
      .val {
        &:hover {
          color: var(--active-color);
        }
        &.isActive {
          color: var(--active-color);
        }
      }

      .line {
        margin: 0 10px;
      }
    }
  }
  .introduce {
    background-color: var(--bg-color-3);
    margin: 0 auto;
    width: calc(100vw - 400px);
    max-height: 53vh;
    overflow: auto;
    min-height: 216px;
    padding: 24px 32px;
    box-sizing: border-box;
    color: var(--base-text-color-1);
    line-height: 28px;
  }
}
.e2 {
  text-indent: 2em;
}
.e3 {
  text-indent: 3em;
}
.e4 {
  padding-left: 4em;
}
.w {
  font-weight: 600;
  color: var(--active-color);
}
</style>
