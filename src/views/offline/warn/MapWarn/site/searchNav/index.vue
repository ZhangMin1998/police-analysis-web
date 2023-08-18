<template>
  <div class="search" v-clickout="handleClickOut">
    <div class="serach-inner">
      <el-select class="mode-select" v-model="modeVal" placeholder="请选择">
        <el-option
          v-for="item in modeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-input
        clearable
        placeholder="请输入场所"
        suffix-icon="el-icon-search"
        v-model="siteVal"
        @keyup.enter.native="handleClk"
        @click.native="handleClk"
      >
      </el-input>
    </div>
    <inputPannel :list="searchList" v-if="isShow" />
  </div>
</template>

<script>
// import Selector from '_com/selector'
// import { mapState, mapMutations } from 'vuex'

import inputPannel from './inputPannel'
import { findPageBySearchKey } from '@/api/warn'
import clickout from '@/directives/clickout'

const defaultMode = [
  { label: '地址', value: '0' },
  { label: '场所', value: '1' },
]

export default {
  components: {
    inputPannel,
  },
  props: {
    modeList: {
      type: [Array, Object],
      default: () => defaultMode,
    },
  },
  directives: {
    clickout,
  },
  data () {
    return {
      loading: false,
      siteList: [],
      siteVal: '',
      modeVal: '1',
      param: {
        pageNum: 1,
        pageSize: 10,
        searchKey: '',
        type: 1,
      },
      searchList: [],
      isShow: false,
    }
  },
  methods: {
    handleClk () {
      if (!this.siteVal) return
      this.param.searchKey = this.siteVal
      // 1 是场所 2 地址
      if (this.modeVal === '1') {
        findPageBySearchKey(this.param).then(res => {
          this.searchList = res.content
        })
      } else {
        this.addressSearch()
      }
      this.isShow = true
    },
    // 点击搜索框外面，关闭搜索结束面板
    handleClickOut () {
      this.isShow = false
    },
    // 地址搜索
    addressSearch () {
      /* eslint-disable */
      AMap.plugin(['AMap.Autocomplete'], () => {
        const autocomplete = new AMap.Autocomplete({
          /* eslint-enable */
          city: '肇庆市',
          citylimit: true, // 限制在同一城市搜索
        })
        autocomplete.search(this.siteVal, (status, res) => {
          if (status == 'complete') {
            const list = res.tips
            this.searchList = list.map(item => {
              return {
                factory: item.name,
                placeName: item.address,
                longitude: item.location.lng,
                latitude: item.location.lat,
                id: item.id,
              }
            })
          } else {
            // this.showSearchList = false
          }
        })
      })
    },
  },
  watch: {
    modeVal: function (val) {
      this.param.type = val
    },
  },
}
</script>

<style lang="less" scoped>
.search {
  position: absolute;
  z-index: 11;
  margin-top: 16px;
  margin-left: 16px;
}

/deep/ .mode-select {
  width: 100px;
}

/deep/ .el-input {
  width: 300px;
}
</style>
