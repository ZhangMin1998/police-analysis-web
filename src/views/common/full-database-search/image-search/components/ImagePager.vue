<template>
  <div class="CusImagesPage cus">
    <Loading :isLoading.sync="isLoading">
      <!-- <div class="CusImagesPager" v-if="isShowLongbox && list.length">
        <ul class="CusImagesPager-ul">
          <li v-for="(item, index) in list" :key="index">
            <div>
              <div class="CusImagesPager_item">
                <el-container>
                  <el-header style="height: 40px">
                    <div class="newCusImagesPager_title">
                      <slot name="newCusImagesPager_title" :item="item.dataSources"></slot>
                    </div>
                  </el-header>

                  <el-main class="CusImagesPager_item_main">
                    <div v-if="imgProp">
                      <el-image
                        class="el-image"
                        :src="origin + item.faceSmallUrl"
                        :preview-src-list="item.faceSmallUrl ? [origin + item.faceSmallUrl] : []"
                        fit="contain"
                      >
                        <div slot="error" class="image-slot">
                          <el-image
                            style="height: 15vh; width: 100%"
                            :src="errImg(item)"
                            fit="cover"
                          ></el-image>
                        </div>
                      </el-image>
                    </div>
                    <div class="CusImagesPager_item_main_info">
                      <template v-for="(colItem, colIndex) in columns2">
                        <div
                          class="CusImagesPager_item_main_info_item"
                          v-if="!colItem.type"
                          :key="colIndex + colItem"
                        >
                          <div class="colItem-label">{{ colItem.label }}：</div>

                          <div class="value">
                            <Ellipsis :wordsLength="19" :value.sync="item[colItem.prop]" />
                          </div>
                        </div>
                      </template>
                    </div>
                  </el-main>
                </el-container>
              </div>
            </div>
          </li>
        </ul>
      </div> -->
      <!-- <div class="CusImagesPager" v-else-if="!isShowLongbox && list.length">
        <ul class="CusImagesPager-ul">
          <li v-for="(item, index) in list" :key="index">
            <div
              v-if="
                item.dataSources === '人物档案' ||
                item.dataSources === '银行业务' ||
                item.dataSources === '运营商业务'
              "
            >
              <div class="newCusImagesPager_item">
                <el-container>
                  <el-header style="height: 40px">
                    <div class="newCusImagesPager_title">
                      <slot name="newCusImagesPager_title" :item="item.dataSources"></slot>
                    </div>
                  </el-header>

                  <el-main class="newCusImagesPager_item_main">
                    <div v-if="imgProp">
                      <el-image
                        class="el-image"
                        :src="origin + item.faceSmallUrl"
                        :preview-src-list="item.faceSmallUrl ? [origin + item.faceSmallUrl] : []"
                        fit="contain"
                      >
                        <div slot="error" class="image-slot">
                          <el-image
                            style="height: 15vh; width: 100%"
                            :src="errImg(item)"
                            fit="cover"
                          ></el-image>
                        </div>
                      </el-image>
                    </div>
                    <div class="newCusImagesPager_item_main_info" @click="jumpPersonDetail(item)">
                      <template v-for="(colItem, colIndex) in columns3">
                        <div
                          class="newCusImagesPager_item_main_info_item"
                          v-if="!colItem.type"
                          :key="colIndex + colItem"
                        >
                          <div class="colItem-label">{{ colItem.label }}：</div>

                          <div class="value">
                            <Ellipsis :wordsLength="19" :value.sync="item[colItem.prop]" />
                          </div>
                        </div>
                      </template>
                    </div>
                  </el-main>
                </el-container>
              </div>
            </div>
            <div v-if="item.dataSources === '视频门禁'">
              <div class="videoCusImagesPager_item">
                <el-container>
                  <el-header style="height: 40px">
                    <div class="newCusImagesPager_title">
                      <slot name="newCusImagesPager_title" :item="item.dataSources"></slot>
                    </div>
                  </el-header>

                  <el-main class="videoCusImagesPager_item_main">
                    <div v-if="imgProp">
                      <el-image
                        class="el-image"
                        :src="origin + item.faceSmallUrl"
                        :preview-src-list="item.faceSmallUrl ? [origin + item.faceSmallUrl] : []"
                        fit="contain"
                      >
                        <div slot="error" class="image-slot">
                          <el-image
                            style="height: 15vh; width: 100%"
                            :src="errImg(item)"
                            fit="cover"
                          ></el-image>
                        </div>
                      </el-image>
                    </div>
                    <div class="videoCusImagesPager_item_main_info">
                      <template v-for="(colItem, colIndex) in columns2">
                        <div
                          class="videoCusImagesPager_item_main_info_item"
                          v-if="!colItem.type"
                          :key="colIndex + colItem"
                        >
                          <div class="colItem-label">{{ colItem.label }}：</div>

                          <div class="value">
                            <EllipsisPop :content="item[colItem.prop]" :rowNum="1"></EllipsisPop>
                          </div>
                        </div>
                      </template>
                    </div>
                  </el-main>
                </el-container>
              </div>
            </div>
            <div v-if="item.dataSources === '人脸抓拍'">
              <div class="newCusImagesPager_item">
                <el-container>
                  <el-header style="height: 40px">
                    <div class="newCusImagesPager_title">
                      <slot name="newCusImagesPager_title" :item="item.dataSources"></slot>
                    </div>
                  </el-header>

                  <el-main class="newCusImagesPager_item_main">
                    <div v-if="imgProp">
                      <el-image
                        class="el-image"
                        :src="origin + item.faceSmallUrl"
                        :preview-src-list="item.faceSmallUrl ? [origin + item.faceSmallUrl] : []"
                        fit="contain"
                      >
                        <div slot="error" class="image-slot">
                          <el-image
                            style="height: 15vh; width: 100%"
                            :src="errImg(item)"
                            fit="cover"
                          ></el-image>
                        </div>
                      </el-image>
                    </div>
                    <div class="newCusImagesPager_item_main_info">
                      <template v-for="(colItem, colIndex) in columns1">
                        <div
                          class="newCusImagesPager_item_main_info_item"
                          v-if="!colItem.type"
                          :key="colIndex + colItem"
                        >
                          <div class="colItem-label">{{ colItem.label }}：</div>

                          <div class="value">
                            <Ellipsis :wordsLength="19" :value.sync="item[colItem.prop]" />
                          </div>
                        </div>
                      </template>
                    </div>
                  </el-main>
                </el-container>
              </div>
            </div>
          </li>
        </ul>
      </div> -->
      <div class="CusImagesPager" v-if="list.length">
        <ul class="CusImagesPager-ul">
          <li v-for="(item, index) in list" :key="index">
            <div>
              <div class="CusImagesPager_item">
                <el-container>
                  <el-header style="height: 40px">
                    <div class="newCusImagesPager_title">
                      <slot name="newCusImagesPager_title" :item="item.dataSourcesCn"></slot>
                    </div>
                  </el-header>

                  <el-main class="CusImagesPager_item_main">
                    <div v-if="imgProp">
                      <el-image
                        class="el-image"
                        :src="origin + item.faceSmallUrl"
                        :preview-src-list="item.faceSmallUrl ? [origin + item.faceSmallUrl] : []"
                        fit="contain"
                      >
                        <div slot="error" class="image-slot">
                          <el-image
                            style="height: 15vh; width: 100%"
                            :src="errImg(item)"
                            fit="cover"
                          ></el-image>
                        </div>
                      </el-image>
                    </div>
                    <div class="CusImagesPager_item_main_info">
                      <template v-for="(colItem, colIndex) in columns2">
                        <div
                          class="CusImagesPager_item_main_info_item"
                          v-if="!colItem.type"
                          :key="colIndex + colItem"
                        >
                          <div class="colItem-label">{{ colItem.label }}：</div>

                          <div class="value">
                            <Ellipsis :wordsLength="19" :value.sync="item[colItem.prop]" />
                          </div>
                        </div>
                      </template>
                    </div>
                  </el-main>
                </el-container>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="empty_div" v-else-if="list.length === 0">
        <EmptyData />
      </div>
      <div class="pagination" v-if="pageData.total">
        <div class="totals">总数：{{ pageData.total || 0 }}</div>
        <el-pagination
          style="margin-right: 24px"
          background
          layout="prev, pager, next, jumper"
          :page-size="pageData.pageSize"
          :pager-count="pageData.pagerCount ? pageData.pagerCount : 7"
          :total="pageData.total"
          :current-page.sync="pageData.curPage"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </Loading>
  </div>
</template>

<script>
import Loading from '@/components/VisualComponents/Loading'
import Ellipsis from '@/components/BasicComponents/Ellipsis'
import EmptyData from '@/components/BasicComponents/EmptyData'
// import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
import { lightTheme, darkTheme } from "@/assets/js/variable";
import { mapState } from 'vuex';
export default {
  name: 'CusImagesPager',
  components: {
    Loading,
    Ellipsis,
    EmptyData,
    // EllipsisPop
  },
  props: {
    list: { type: Array },
    columns1: { type: Array },
    columns2: { type: Array },
    columns3: { type: Array },
    btnRender: { type: Array },
    pageData: { type: Object },
    isLoading: { type: Boolean },
    itemSize: { type: String, default: '325px' },
    padding: { type: String, default: '20px' },
    emptyIsShow: { type: Boolean, default: true },
    addIsShow: { type: Boolean, default: false },
    isShowLongbox: { type: Boolean, default: false }
  },
  data () {
    return {
      imgProp: '',
      pick: {
        startTime: '',
        endtime: ''
      }
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
    origin () {
      return window.location.origin + '/'
    }
  },
  watch: {
    // isLoading:{
    //   handler: function (val, oldval) {
    //     if (val != oldval && (this.pageData.total > this.pageData.pageSize)) {
    //       this.$nextTick(() => {
    //         document.getElementsByClassName("el-pagination__jump")[0].childNodes[0].nodeValue = "跳转"
    //       })
    //     }
    //   },
    //   immediate: true, //关键
    //   deep: true
    // }
  },
  created () {
    // console.log(this.list)
  },
  mounted () {
    this.imgProp = this.columns2.find(_c => _c.type === 'img')?.prop
    // console.log(this.imgProp)
  },
  methods: {
    errImg (item) {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      if (item.errorIcon) {
        return require('@/assets/img/' +
          item.errorIcon +
          '.png')
      } else {
        console.log(colorObj['--car-default-pic']);
        return colorObj['--car-default-pic']
      }
    },
    handleCurrentChange (pageNum) {
      this.$emit('handleCurrentChange', pageNum)
    },
    jumpPersonDetail (item) {
      // console.log(item)
      if (item.dataSources === '银行业务' || item.dataSources === '运营商业务') {
        return
      }
      // this.$router.push({ name: 'personCustomDetail', query: { id: item.personId, label: '自定义档案' } })
      if (!item.personAttrType) {
        this.$message.error('未找到该档案')
        return
      }
      let keyPersonArr = ['personDetainee', 'personDrugster', 'personSuspect', 'personTemporary']
      if (keyPersonArr.includes(item.personAttrType)) {
        if (this.$store.state.Common.permissionsArray.includes('important_human:human_detail')) {
          this.$messageTip.error('暂无权限！')
          return false
        }
        // 跳转自定义档案
        window.open(window.location.origin + '/ol/FileDetail?id=' + item.personId + '&label=重点人档案')
      } else if ((item.personAttrType).indexOf('personNormal') !== -1) {
        if (!this.$store.state.Common.permissionsArray.includes('normal_human:human_detail')) {
          this.$messageTip.error('暂无权限！')
          return false
        }
        window.open(window.location.origin + '/ol/FileDetail?id=' + item.personId + '&label=人物档案')
      } else {
        if (this.$store.state.Common.permissionsArray.includes('custom_human:human_detail')) {
          this.$messageTip.error('暂无权限！')
          return false
        }
        window.open(window.location.origin + '/ol/personCustomDetail?id=' + item.personId + '&label=自定义档案')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 1024px) and (max-width: 1366px) {
  /deep/.el-image {
    width: 100% !important;
    height: 100% !important;
    background-color: var(--bg-color-1) !important;
    img {
      width: 380px !important;
      height: 180px !important;
    }
  }
  .colItem-label {
    width: 120px;
    // font-size:14px
  }
  .CusImagesPager_item_main {
    height: 520px;
    .CusImagesPager_item_main_info {
      line-height: 32px;
    }
  }
  .newCusImagesPager_item_main {
    height: 400px;
    .newCusImagesPager_item_main_info {
      line-height: 36px;
    }
  }
  .videoCusImagesPager_item {
    .videoCusImagesPager_item_main {
      height: 400px;
      .videoCusImagesPager_item_main_info {
        line-height: 36px;
      }
    }
    &:hover {
      .videoCusImagesPager_item_main {
        height: 550px;
        .videoCusImagesPager_item_main_info {
          line-height: 36px;
        }
      }
    }
  }
}
@media screen and (min-width: 1366px) {
  /deep/.el-image {
    width: 244px !important;
    height: 137px !important;
    background-color: var(--bg-color-1) !important;
    img {
      width: 244px !important;
      height: 137px !important;
    }
  }
  .colItem-label {
    width: 75px;
    // font-size:14px
  }
  .CusImagesPager_item_main {
    height: 380px;
    .CusImagesPager_item_main_info {
      line-height: 28px;
    }
  }
  .newCusImagesPager_item_main {
    height: 315px; //322px
    .newCusImagesPager_item_main_info {
      line-height: 28px;
    }
  }
  .videoCusImagesPager_item {
    .videoCusImagesPager_item_main {
      height: 315px;
      .videoCusImagesPager_item_main_info {
        line-height: 28px;
      }
    }
    &:hover {
      .videoCusImagesPager_item_main {
        height: 435px;
        .videoCusImagesPager_item_main_info {
          line-height: 28px;
        }
      }
    }
  }
}
.CusImagesPage {
  margin-top: 12px;
  & > div {
    position: relative;
    width: 100%;
    min-height: calc(100vh - 360px);
    .CusImagesPager {
      min-height: calc(100vh - 450px) !important;
      .CusImagesPager-ul {
        display: flex;
        flex-flow: wrap;
        justify-content: flex-start;
        @media (max-width: 1365px) {
          > li {
            width: calc((100% - 95px) / 4);
            margin-right: 16px;
            padding-top: 16px;
          }
          > li:nth-child(4n) {
            margin-right: 0;
          }
        }
        @media (min-width: 1366px) {
          > li {
            width: calc((100% - 95px) / 6);
            margin-right: 16px;
            padding-top: 16px;
          }
          > li:nth-child(6n) {
            margin-right: 0;
          }
        }

        .CusImagesPager_item {
          background-color: var(--bg-color-2) !important;
          .el-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid rgba(31, 42, 63, 0.5);
            line-height: 40px;
            .newCusImagesPager_title {
              display: flex;
              align-items: center;
            }
          }
          .CusImagesPager_item_main {
            // height: 438px;
            padding: 16px 14px 0 14px;
            .CusImagesPager_item_main_info {
              margin-top: 17px;
              .CusImagesPager_item_main_info_item {
                display: flex;
                align-items: center;
                white-space: nowrap;
                .colItem-label {
                  font-size: 14px;
                }
              }
            }
          }
        }
        .newCusImagesPager_item {
          background-color: var(--bg-color-2);
          box-shadow: 0px -1px 12px 1px rgba(1, 47, 142, 0.08);
          overflow: hidden;
          .el-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--bg-color-1);
            line-height: 40px;
            .newCusImagesPager_title {
              display: flex;
              align-items: center;
            }
          }
          .newCusImagesPager_item_main {
            padding: 16px 14px 0px 14px;
            // display: flex;
            // align-items: center;
            .newCusImagesPager_item_main_info {
              // background: pink;
              // margin-left: 8px;
              margin-top: 17px;
              .newCusImagesPager_item_main_info_item {
                display: flex;
                align-items: center;
                white-space: nowrap;
                .colItem-label {
                  font-size: 14px;
                }
              }
            }
          }
        }
        .videoCusImagesPager_item {
          // overflow: hidden;
          background-color: var(--bg-color-2);
          z-index: 9;
          .el-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--bg-color-1);
            line-height: 40px;
            .newCusImagesPager_title {
              display: flex;
              align-items: center;
            }
          }
          .videoCusImagesPager_item_main {
            overflow: hidden;
            padding: 16px 14px 0px 14px;
            .videoCusImagesPager_item_main_info {
              margin-top: 17px;
              .videoCusImagesPager_item_main_info_item {
                display: flex;
                align-items: center;
                white-space: nowrap;
                .colItem-label {
                  font-size: 14px;
                }
              }
            }
          }
          &:hover {
            background: var(--bg-color-2) !important;
            position: absolute;
            z-index: 999;
            overflow: none !important;
            border: 1px solid rgba(61, 110, 255, 0.32);
            box-shadow: 0px 0px 12px 1px rgba(0, 0, 0, 0.16);
            .videoCusImagesPager_item_main {
              overflow: none !important;
              padding: 16px 14px 14px 14px;
              .colItem-label {
                font-size: 14px;
              }
            }
          }
        }
      }
    }
    .empty_div {
      height: calc(100vh - 450px);
    }
    .pagination {
      margin-top: 50px;
    }
  }
}
/deep/.el-container {
  display: flex;
  flex-direction: column;
}
.mainbox /deep/ .panel {
  position: relative;
  padding: 0px !important;
}
</style>
