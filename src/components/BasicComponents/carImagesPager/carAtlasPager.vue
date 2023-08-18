<template>
  <div class="carAtlasPage cus">
    <Loading :isLoading.sync="isLoading">
      <div class="carAtlasPager" v-if="list.length">
        <!-- <DatePick :isShowTimeType="false" :type="type" ref="DatePick"></DatePick> -->
        <ul class="carAtlasPager-ul">
          <li v-for="(item, index) in list" :key="index">
            <div class="carAtlasPager_item" @click="clickCard(item)">
              <el-container>
                <el-main class="carAtlasPager_item_main">
                  <div class="carAtlasPager_item_main_info">
                    <template v-for="(colItem, colIndex) in columns">
                      <div
                        class="carAtlasPager_item_main_info_item"
                        v-if="!colItem.type && colItem.show"
                        :key="colIndex + colItem"
                      >
                        <div class="colItem-label">{{ colItem.label }}：</div>

                        <div class="value">
                          <Ellipsis :wordsLength="19" :value.sync="item[colItem.prop]" />
                        </div>
                      </div>
                    </template>
                  </div>
                  <div v-if="imgProp" @click.stop="clickImage">
                    <el-image
                      class="el-image"
                      :src="origin + item[imgProp]"
                      :preview-src-list="item[imgProp] ? [origin + item[imgProp]] : []"
                      fit="cover"
                    >
                      <div slot="error" class="image-slot">
                        <el-image
                          class="el-image"
                          :src="errImg(item)"
                          fit="cover"
                        ></el-image>
                      </div>
                    </el-image>
                  </div>
                </el-main>
              </el-container>
            </div>
          </li>
        </ul>
      </div>

      <div class="empty_div" v-else>
        <EmptyData />
      </div>

      <div class="pagination" v-if="pageData && pageData.total">
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
import Ellipsis from '@/components/BasicComponents/Ellipsis'
import EmptyData from '@/components/BasicComponents/EmptyData'
import { lightTheme, darkTheme } from "@/assets/js/variable";
import { mapState } from 'vuex';
export default {
  name: 'carAtlasPager',
  components: {
    Loading,
    Ellipsis,
    EmptyData
  },
  props: {
    list: { type: Array },
    columns: { type: Array },
    pageData: { type: Object },
    isLoading: { type: Boolean },
    itemSize: { type: String, default: '250px' },
    padding: { type: String, default: '20px' },
    emptyIsShow: { type: Boolean, default: true }
  },
  data () {
    return {
      imgProp: '',
      isShowLabel: true
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
  watch:{
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
  created (){
    // console.log(this.columns)
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
        console.log(colorObj['--car-default-pic']);
        return colorObj['--car-default-pic']
      }
    },
    handleCurrentChange (pageNum) {
      this.$emit('handleCurrentChange', pageNum)
    },
    clickCard (row) {
      this.$emit('toCarFile', row)
    },
    clickImage () {
      return
    }
  }
}
</script>

<style lang="less" scoped>
.carAtlasPage {
  & > div {
    position: relative;
    width: 100%;
    min-height: calc(100vh - 260px);
    .carAtlasPager {
      .carAtlasPager-ul {
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
        .carAtlasPager_item {
          background: var(--bg-color-2);
          box-shadow: 1px -1px 12px 1px rgba(1, 47, 142, 0.08);
          &:hover {
            box-shadow: 0px 0px 12px 1px rgba(0, 0, 0, 0.16);
          }

          .carAtlasPager_item_main {
            padding: 16px;
            // padding: 20px 20px 20px 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            // align-items: center;
            .carAtlasPager_item_main_info {
              margin-bottom: 16px;
              line-height: 28px;
              .carAtlasPager_item_main_info_item {
                display: flex;
                align-items: center;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }
    .empty_div {
      height: calc(100vh - 300px);
    }
  }
}
.mainbox /deep/ .panel {
  position: relative;
  padding: 0px !important;
}
/deep/ .pagination .el-input__inner {
  border: 1px solid rgba(53,62,91,0.64) !important;
}
</style>
