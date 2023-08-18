<template>
  <div class="CusImagesPage cus">
    <Loading :isLoading.sync="isLoading">
      <div class="empty_div" v-if="list.length === 0 && emptyIsShow">
        <EmptyData />
      </div>
      <div v-else class="CusImagesPager">
        <ul class="CusImagesPager-ul">
          <li v-for="(item, index) in list" :key="index">
            <div class="CusImagesPager_item">
              <el-container>
                <div v-if="imgProp">
                  <el-image
                    class="el-image"
                    :src="origin + item[imgProp]"
                    :preview-src-list="item[imgProp] ? [origin + item[imgProp]] : []"
                    fit="cover"
                  >
                    <div slot="error" class="image-slot">
                      <el-image class="el-image" :src="errImg(item)" fit="cover"></el-image>
                    </div>
                  </el-image>
                </div>
                <el-main class="CusImagesPager_item_main">
                  <div class="CusImagesPager_item_main_info">
                    <template v-for="(colItem, colIndex) in columns">
                      <div
                        class="CusImagesPager_item_main_info_item"
                        v-if="!colItem.type"
                        :key="colIndex + colItem"
                      >
                        <div class="colItem-label">{{ colItem.label }}：</div>

                        <div class="value">
                          <Ellipsis :wordsLength="18" :value.sync="item[colItem.prop]" />
                        </div>
                      </div>
                    </template>
                  </div>
                </el-main>
                <el-footer class="el-footer">
                  <i
                    v-permission="'car_archive:car_detail'"
                    class="iconfont icon-xiangqing"
                    title="详情"
                    @click.prevent="openDetail(item)"
                  ></i>
                  <i
                    v-permission="'car_archive:car_pics'"
                    class="iconfont icon-tuji"
                    :class="{ no_active: !item.haveData }"
                    title="车辆图集"
                    @click.prevent="openCarAtlas(item)"
                  ></i>
                  <i
                    v-permission="'car_archive:car_trajectory'"
                    class="iconfont icon-guiji"
                    :class="{ no_active: !item.haveData }"
                    title="车辆轨迹"
                    @click.prevent="openCarTrail(item)"
                  ></i>
                </el-footer>
              </el-container>
            </div>
          </li>
        </ul>
      </div>
    </Loading>
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
  </div>
</template>

<script>
import Loading from '@/components/VisualComponents/Loading'
import Ellipsis from '@/components/BasicComponents/Ellipsis'
import EmptyData from '@/components/BasicComponents/EmptyData'
import { lightTheme, darkTheme } from "@/assets/js/variable";
import { mapState } from 'vuex';
export default {
  name: 'CusImagesPager',
  components: {
    Loading,
    Ellipsis,
    EmptyData
  },
  props: {
    list: { type: Array },
    columns: { type: Array },
    btnRender: { type: Array },
    pageData: { type: Object },
    isLoading: { type: Boolean },
    itemSize: { type: String, default: '325px' },
    padding: { type: String, default: '20px' },
    emptyIsShow: { type: Boolean, default: true },
    addIsShow: { type: Boolean, default: false }
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
    },
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
    this.imgProp = this.columns.find(_c => _c.type === 'img')?.prop
  },
  methods: {
    errImg (item) {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      if (item.errorIcon) {
        return require('@/assets/img/' +
          item.errorIcon +
          '.png')
      } else {
        // console.log(colorObj['--car-default-pic']);
        return colorObj['--car-default-pic']
      }
    },
    handleCurrentChange (pageNum) {
      this.$emit('handleCurrentChange', pageNum)
    },
    openDetail (item) {
      this.$emit('openDetail', item)
    },
    openCarAtlas (item) {
      if (!item.haveData) return
      this.$emit('openCarAtlas', item)
    },
    openCarTrail (item) {
      if (!item.haveData) return
      this.$emit('openCarTrail', item)
    }
  }
}
</script>

<style lang="less" scoped>
.CusImagesPage {
  & > div {
    position: relative;
    width: 100%;
    .CusImagesPager {
      .CusImagesPager-ul {
        display: flex;
        flex-flow: wrap;
        justify-content: flex-start;
        > li {
          width: calc((100% - 80px) / 6);
          margin-right: 16px;
          padding-top: 16px;
        }
        > li:nth-child(6n) {
          margin-right: 0;
        }
        .CusImagesPager_item {
          background: var(--bg-color-2);
          &:hover {
            box-shadow: 0px 0px 12px 1px rgba(0, 0, 0, 0.16);
          }
          .CusImagesPager_item_main {
            .CusImagesPager_item_main_info {
              .CusImagesPager_item_main_info_item {
                display: flex;
                align-items: center;
                white-space: nowrap;
                .colItem-label {
                  width: 80px;
                  font-size: 14px;
                }
                .value {
                  font-size: 16px;
                }
              }
            }
          }
          .el-footer {
            height: 46px !important;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            i {
              font-size: 16px;
              color: var(--base-text-color-to-999999);
              cursor: pointer;
              margin-left: 10px;
              &.no_active {
                opacity: 0.4;
              }
            }
            img {
              width: 16px;
              height: 16px;
            }
          }
        }
      }
    }
    .empty_div {
      height: calc(100vh - 280px);
    }
  }
}
.mainbox /deep/ .panel {
  position: relative;
  padding: 0px !important;
}
/deep/ .pagination .el-input__inner {
  border: 1px solid rgba(53, 62, 91, 0.64) !important;
}
</style>
