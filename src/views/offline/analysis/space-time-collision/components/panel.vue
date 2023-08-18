<template>
  <div>
    <div class="space_container" @click="removeChildIsActive">
      <!-- <NoticePanel :width="434">
        <template v-slot:stepDot>

        </template>
      </NoticePanel> -->
      <drawer
        :drawer.sync="drawer"
        :cusStyle="{ top: '2%', height: '96%' }"
        :drawerTop="{ width: imgWidth, height: '5px' }"
        width="442px"
        oldLeft="20px"
        moveLeft="-442px"
        @handleClick="DrawerHandleClick"
      >
        <template v:slot>
          <StepDot :list="stepList">
            <template v-slot:step_content1>
              <div class="condition">
                <div>碰撞条件</div>
                <div class="tip">
                  <div class="icon">
                    <i class="el-icon-warning-outline"></i>
                  </div>
                  <div>
                    请在地图上搜索并选择地址，然后标记案发点，创建案发点信息（时间 地点描述
                    选择设备）；也可直接标记案发点，创建案发点信息。
                  </div>
                </div>
              </div>
              <div class="case_list">
                <div class="title">案发点列表</div>
                <CrimeList
                  :list.sync="caseList"
                  :btnRender="btnList"
                  v-on="$listeners"
                  ref="child"
                />
              </div>
            </template>
            <template v-slot:step_content2>
              <div class="searchBtn">
                <div>时空特征碰撞并查看结果</div>
                <div class="right">
                  <el-button
                    type="primary"
                    :class="`${caseList && caseList.length < 2 ? 'disabled' : 'submitButton'}`"
                    @click="submitEvent"
                    :loading="loadingbut"
                    >{{ loadingbuttext }}</el-button
                  >
                </div>
              </div>
            </template>
          </StepDot>
        </template>
      </drawer>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import NoticePanel from '@/components/Map/CommonMap/Analysis/noticePanel'
import Drawer from '@/components/BasicComponents/Drawer/newIndex'
import StepDot from '@/components/Map/CommonMap/Analysis/stepDot'
import CrimeList from './components/crimeList'

export default {
  components: {
    StepDot,
    CrimeList,
    // NoticePanel,
    Drawer
  },
  computed: {
    ...mapState('analysisJudgement', {
      caseList: 'caseList'
    })
  },

  data () {
    return {
      loadingbuttext: '碰撞',
      loadingbut: false, //分析提交加载中
      stepList: [1, 2],
      btnList: [
        {
          label: '编辑',
          type: 'success',
          icon: 'icon-doc-pen',
          btnEvent: this.edit,
          alt: '编辑'
        },
        {
          label: '删除',
          type: 'rodeLine',
          icon: 'icon-drop',
          btnEvent: this.delete,
          alt: '删除'
        }
      ],
      drawer: {
        isShow: true
      },
      imgWidth:''
    }
  },
  mounted () {
    this.$store.dispatch('analysisJudgement/queryCase')
    this.imgWidth = document.getElementsByClassName('drawerBoxOpen')[0].offsetWidth + 'px'
  },
  methods: {
    DrawerHandleClick () {
      this.drawer.isShow = !this.drawer.isShow
    },
    removeChildIsActive () {
      this.$refs.child.removeIsActive()
    },
    edit (e) {
      this.$emit('editCase', e)
    },
    delete (e) {
      this.$emit('deleteMarker', e)
    },
    // 碰撞
    submitEvent () {
      if (this.caseList && this.caseList.length > 1) {
        this.submiting()
        let caseIdList = this.caseList.map(item => {
          return {
            id: item.id,
            caseName: item.caseName
          }
        })
        this.$emit('submit', caseIdList)
        // setTimeout(() => {
        //   this.cancelSbmit()
        //   let caseIdList = this.caseList.map(item => {
        //     return {
        //       id: item.id,
        //       caseName: item.caseName
        //     }
        //   })
        //   // 碰撞请求成功， 触发submit 展开碰撞结果
        //   this.$emit('submit', caseIdList)
        // }, 800)
      }
    },
    submiting () {
      this.loadingbut = true
      this.loadingbuttext = '碰撞中...'
    },
    cancelSbmit () {
      this.loadingbut = false
      this.loadingbuttext = '碰撞'
    }
  }
}
</script>

<style lang="less" scoped>
.space_container {
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
  ::v-deep .DrawerContainer{
    .drawerBoxOpen{
      height: 100%;
    }
  }
  .title {
    padding: 0 16px;
    box-sizing: border-box;
    margin-bottom: 16px;
  }
}
.searchBtn {
  padding: 0 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .submitButton {
    padding: 7px 20px;
    background-color: #177ddc;
    display: inline-block;
    color: @font-color-3;
  }
  .submitButton:hover {
    background-color: rgb(80, 147, 223);
  }
  .disabled {
    background-color: #999 !important;
    color: #fff;
    border: none !important;
    cursor: not-allowed;
  }
}

.condition {
  margin-bottom: 24px;
  padding: 0 16px;
  box-sizing: border-box;
  .tip {
    display: flex;
    padding-top: 11px;
    font-size: 14px;
    color: var(--base-text-color-to-999999);
    line-height: 22px;
    .icon {
      margin-right: 5px;
      color: #2f8ae0;
    }
  }
}
/deep/.step_dot1 {
  flex: 1;
  .step_item {
    display: flex;
  }
  .item {
    display: flex;
    flex-direction: column;
    flex: 1;
    .case_list {
      display: flex;
      flex-direction: column;
      flex: 1;
      .case {
        // flex: 1;
      }
    }
  }
}
</style>
