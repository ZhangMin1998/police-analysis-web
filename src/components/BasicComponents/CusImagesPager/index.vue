<template>
  <div class="CusImagesPage cus">
    <Loading :isLoading.sync="isLoading" :loadingBg="loadingBg">
      <div class="CusImagesPager" v-if="list.length !== 0 || this.isFaceWarnList">
        <ul class="CusImagesPager-ul">
          <li v-if="addIsShow">
            <div class="CusImagesPager_item">
              <slot name="beforeLi"> </slot>
            </div>
          </li>

          <li v-for="(item, index) in list" :key="index">
            <div class="CusImagesPager_item" @click="clickCard(item)">
              <el-container>
                <slot name="cardBtn" :item="item"></slot>
                <el-header v-if="haveTitle">
                  <div class="CusImagesPager_title">
                    <slot name="CusImagesPager_title" :item="item"></slot>
                  </div>

                  <!-- 操作 -->
                  <div class="elBtn" v-if="btnRender && btnRender.length">
                    <el-button
                      v-for="(btnItem, btnIndex) in btnRender"
                      :key="btnIndex"
                      @click.prevent="btnItem.btnEvent(item)"
                      type="text"
                      size="small"
                    >
                      <img
                        width="20"
                        height="20"
                        :src="require('@/assets/img/' + btnItem.icon + '.png')"
                        :alt="btnItem.alt"
                        :title="btnItem.alt"
                      />
                    </el-button>
                  </div>
                </el-header>
                <el-main class="CusImagesPager_item_main">
                  <!-- 图片显示方式 -->
                  <div v-if="imgProp" @click.stop="clickImage">
                    <el-image
                      :src="origin + item[imgProp]"
                      :preview-src-list="item[imgProp] ? [origin + item[imgProp]] : []"
                      fit="cover"
                    >
                      <div slot="error" class="image-slot">
                        <img :src="errImg(item)" />
                      </div>
                    </el-image>
                  </div>

                  <div class="CusImagesPager_item_main_info">
                    <template v-for="(colItem, colIndex) in cardColumns">
                      <!-- 文字显示方式 -->
                      <div
                        class="CusImagesPager_item_main_info_item"
                        v-if="!colItem.type"
                        :key="colIndex + colItem"
                      >
                        <!-- <div class="label item_label">{{ colItem.label }}：</div> -->
                        <div class="label item_label">
                          {{
                            colItem.judge === 'cerTypeName' ? item[colItem.judge] : colItem.label
                          }}：
                        </div>
                        <div class="item-value item_label_value">
                          <el-popover
                            placement="top-start"
                            width="200"
                            trigger="hover"
                            :content="item[colItem.prop]"
                            :disabled="colItem.showColumnTip"
                          >
                            <div
                              v-if="
                                colItem.prop !== 'liveAddress' && colItem.prop !== 'houseAddress'
                              "
                              class="value"
                              slot="reference"
                              @mouseover="mouseOn($event, colIndex)"
                            >
                              {{ item[colItem.prop] || '--' }}
                            </div>
                            <div
                              v-else
                              class="liveAddressValue"
                              slot="reference"
                              @mouseover="mouseOn($event, colIndex)"
                            >
                              {{ item[colItem.prop] || '--' }}
                            </div>
                          </el-popover>
                        </div>
                      </div>

                      <!-- 单选方式 -->
                      <div
                        v-if="colItem.type === 'radio'"
                        class="CusImagesPager_item_main_info_item radioBox"
                        :key="colIndex + colItem"
                      >
                        <div class="label item_label">{{ colItem.label }}：</div>

                        <div class="value radioPadding">
                          <el-radio-group
                            size="mini"
                            v-model="item[colItem.prop]"
                            @change="colItem.handleChange($event, item)"
                            class="radioGroup"
                          >
                            <el-radio
                              v-for="(radioItem, radioIndex) in colItem.list"
                              :key="radioIndex"
                              :label="radioItem.value"
                              >{{ radioItem.label }}
                            </el-radio>
                          </el-radio-group>
                        </div>
                      </div>
                    </template>
                  </div>
                  <!-- <div v-if="haveButton">
                    <el-button
                      style="padding:0"
                      v-for="(btnItem, btnIndex) in btnRender"
                      :key="btnIndex"
                      @click.prevent="btnItem.btnEvent(item)"
                      type="text"
                      size="small"
                    >
                      <img
                        width="20"
                        height="20"
                        :src="require('@/assets/img/' + btnItem.icon + '.png')"
                        :alt="btnItem.alt"
                        :title="btnItem.alt"
                      />
                    </el-button>
                  </div> -->
                </el-main>
              </el-container>
            </div>
          </li>
        </ul>
      </div>

      <div class="empty_div" v-if="list.length === 0 && emptyIsShow">
        <EmptyData />
      </div>
      <!-- 展示分页 -->
      <div class="pagination" v-if="pageData">
        <div class="totals">总数：{{ pageData.total || 0 }}</div>
        <el-pagination
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
import EmptyData from '@/components/BasicComponents/EmptyData'
import { lightTheme, darkTheme } from '@/assets/js/variable'
import { mapState } from 'vuex'
export default {
  name: 'CusImagesPager',
  components: {
    Loading,
    EmptyData
  },
  props: {
    list: { type: Array },
    columns: { type: Array },
    btnRender: { type: Array },
    pageData: { type: Object },
    isLoading: { type: Boolean },
    itemSize: { type: String, default: '19.5em' },
    padding: { type: String, default: '20px' },
    emptyIsShow: { type: Boolean, default: true },
    addIsShow: { type: Boolean, default: false },
    isFaceWarnList: { type: Boolean, default: false },
    haveTitle: {
      type: Boolean,
      default: true
    },
    loadingBg: {
      type: String
    }
  },
  data() {
    return {
      imgProp: '',
      cardColumns: this.columns
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
    origin() {
      return window.location.origin + '/'
      // return 'http://192.168.1.182:9519/'
    }
  },
  watch: {
    // loadingBg(val){
    //   console.log(val);
    // }
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
  mounted() {
    // console.log('ss', window.lib)
    this.imgProp = this.columns.find(_c => _c.type === 'img')?.prop
    this.cardColumns.forEach(item => {
      this.$set(item, 'showColumnTip', true)
    })
  },
  methods: {
    errImg(item) {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      if (item.errorIcon) {
        return require('@/assets/img/' + item.errorIcon + '.png')
        // icon-morenHeader
      } else {
        // console.log(colorObj['--person-default-pic']);
        return colorObj['--person-default-pic']
      }
    },
    handleCurrentChange(pageNum) {
      this.$emit('handleCurrentChange', pageNum)
    },
    mouseOn(e, index) {
      if (e.target.scrollWidth > e.target.clientWidth) {
        this.cardColumns[index].showColumnTip = false
      } else if (e.target.scrollHeight > e.target.clientHeight) {
        this.cardColumns[index].showColumnTip = false
      } else {
        this.cardColumns[index].showColumnTip = true
      }
    },
    clickImage() {
      return
    },
    // 点击卡片
    clickCard(item) {
      this.$emit('clickCard', item)
    }
  }
}
</script>

<style lang="less" scoped>
.CusImagesPage {
  & > div {
    width: 100%;
    .CusImagesPager {
      overflow: auto;
      .CusImagesPager_item {
        background-color: rgba(255, 255, 255, 0.08);
        box-shadow: 1px -1px 12px 1px rgba(1, 47, 142, 0.08);
        width: 100%;
        height: 100%;
        &:hover {
          box-shadow: 0px 0px 12px 1px rgba(0, 0, 0, 0.16);
        }
        .el-container {
          width: 100%;
        }
        .el-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid transparent;
          height: 40px !important;
          padding: 0 16px;
          .CusImagesPager_title {
            display: flex;
            align-items: center;
          }
          .elBtn {
            ::v-deep .el-button {
              padding: 0;
            }
          }
        }

        .CusImagesPager_item_main {
          display: flex;
          /*align-items: center;*/
          padding: 24px 16px;
          width: 100%;
          overflow: hidden;
          .el-image {
            width: 146px;
            height: 182px;
            img {
              width: 146px;
              height: 182px;
            }
          }
          .CusImagesPager_item_main_info {
            margin-left: 14px;
            line-height: 1.5;
            flex: 1;
            width: calc(100% - 178px);
            overflow: hidden;
            .CusImagesPager_item_main_info_item {
              display: flex;
              // align-items: center;
              // white-space: nowrap;
              margin-bottom: 8px;
              &:last-child {
                margin-bottom: 0;
              }
              .label {
                color: var(--base-text-color-to-999999);
                flex: none;
                font-size: 14px;
                width: 75px;
                align-self: flex-start;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              // 火狐浏览器调整文字大小
              @media screen and (min-width: 1024px) and (max-width: 1365px) {
                .label {
                  font-size-adjust: 0.7;
                }
              }

              .item-value {
                color: var(--base-text-color-1);
                // flex: 1;
                font-size: 16px;
                width: calc(100% - 70px);
                .value {
                  width: 97%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  word-break: break-all;
                  white-space: nowrap;
                  // line-height: 22px !important;
                }
                .liveAddressValue {
                  width: 100%;
                  text-overflow: -o-ellipsis-lastline;
                  word-break: break-all;
                  overflow: hidden; //溢出内容隐藏
                  text-overflow: ellipsis; //文本溢出部分用省略号表示
                  display: -webkit-box; //特别显示模式
                  -webkit-line-clamp: 2; //行数
                  line-clamp: 2;
                  -webkit-box-orient: vertical; //盒子中内容竖直排列
                }
              }
              .value {
                font-size: 16px;
              }
               // 火狐浏览器调整文字大小
              @media screen and (min-width: 1024px) and (max-width: 1365px) {
                .value {
                  font-size-adjust: 0.7;
                }
              }
            }
            .radioBox {
              align-items: start;
            }
          }
          /* 针对火狐浏览器 */
           // 火狐浏览器调整行高
          @-moz-document url-prefix() {
            @media screen and (min-width: 1024px) and (max-width: 1365px) {
              .CusImagesPager_item_main_info {
                line-height: 1.8 !important;
              }
            }
          }
        }
      }
    }
  }
}
.empty_div {
  height: calc(100vh - 280px);
}

.CusImagesPager-ul {
  display: flex;
  flex-flow: wrap;
  justify-content: flex-start;
  margin: 4px 16px;
  @media (min-width: 967px) and (max-width: 1210px) {
    > li {
      width: calc((100% - 18px) / 2);
      margin-right: 16px;
      padding-top: 12px;
    }
    > li:nth-child(2n) {
      margin-right: 0;
    }
  }
  @media (min-width: 1210px) and (max-width: 1467px) {
    > li {
      width: calc((100% - 32px) / 3);
      margin-right: 16px;
      padding-top: 12px;
    }
    > li:nth-child(3n) {
      margin-right: 0;
    }
  }
  @media (min-width: 1467px) {
    > li {
      width: calc((100% - 48px) / 4);
      margin-right: 16px;
      padding-top: 12px;
    }
    > li:nth-child(4n) {
      margin-right: 0;
    }
  }
}
.radioGroup {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  // width: 150px;
}
.radioPadding {
  padding-top: 4px;
}
/deep/ .el-radio {
  width: 75px;
  line-height: 23px;
  // margin-right: 0;
}
@media only screen and (max-width: 1646px) {
  .CusImagesPager_item_main_info_item {
    .item_label {
      width: 60px !important;
    }
    .item_label_value {
      width: calc(100% - 60px) !important;
    }
  }
}
/deep/ .pagination .el-input__inner {
  border: 1px solid rgba(53, 62, 91, 0.64) !important;
}
.el-button {
  padding: 0;
  &.el-button--small {
    padding: 0;
  }
}
</style>
