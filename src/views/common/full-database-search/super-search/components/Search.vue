<template>
  <div class="search">
    <div class="search-container">
      <el-input
        v-model.trim="tempSearch"
        @change="change"
        :placeholder="placeholderText"
        clearable
        @clear="clear"
        @input="input"
        :maxlength="50"
        @focus="isShowHistory = true"
        @blur="blur"
        @keyup.enter.native="handleSearch"
      ></el-input>

      <!-- 搜索按钮 -->
      <div class="btn-box">
        <el-button type="primary" class="btn searchBtn" :loading="btnLoading" @click="handleSearch($event)">{{btnLoading?'搜索中':'搜索'}}</el-button>
      </div>
      <div class="search-list" v-if="isShowHistory && searchList.length">
        <ul>
          <li class="tip"><div>
            最近搜索</div></li>
          <li
            v-for="(item, index) in searchList"
            @mousedown="down"
            class="search-item"
            @click="liClick(item)"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    searchKey: {
      type: String,
      default: ''
    },
    btnLoading:{
      type:Boolean,
      default:false
    },
    placeholderText: {
      type: String,
      default: '请输入'
    },
  },
  data () {
    return {
      tempSearch: '',
      searchList: JSON.parse(window.localStorage.getItem('searchList')) || [],
      isShowHistory: false
    }
  },
  watch: {
    searchKey: {
      handler (val) {
        this.tempSearch = val
      },
      immediate: true
    }
  },
  methods: {
    input (val){
      if(!val){
        this.$emit('inputNoData')
      }
    },
    clear (){
      this.$emit('clear')
    },
    down (e) {
      e.preventDefault()
    },
    change (search) {
      if (!search) { return }
      this.$emit('update:searchKey', search)
    },
    liClick (item) {
      this.tempSearch = item
      this.$emit('historyClick')
      this.handleSearch()
      this.useCodeBlur()
    },
    useCodeBlur () {
      var input = document.querySelector(".el-input__inner");
      input.blur();
    },
    blur () {
      // debugger
      this.isShowHistory = false
    },
    handleSearch (e) {
      if (e && e.target) {
        if (e.target.parentNode && e.target.parentNode.nodeName === 'BUTTON') {
          e.target.parentNode.blur()
        } else if (e.target.nodeName === 'BUTTON') {
          e.target.blur()
        }
      }
      // if (!this.tempSearch) return
      this.useCodeBlur()
      this.$emit('update:searchKey', this.tempSearch)
      if (this.tempSearch) {
        if (this.searchList && this.searchList.length) {
          let index = this.searchList.findIndex((item) => {
            return item === this.tempSearch
          })
          if (index !== -1) {
            this.searchList.splice(index, 1)
            this.searchList.unshift(this.tempSearch)
          } else {
            this.searchList.unshift(this.tempSearch)
          }
          if (this.searchList.length > 10) {
            this.searchList.pop()
          }
          window.localStorage.setItem('searchList', JSON.stringify(this.searchList))
        } else {
          this.searchList = []
          this.searchList.unshift(this.tempSearch)
          window.localStorage.setItem('searchList', JSON.stringify(this.searchList))
        }
      }

      this.$emit('handleSearch')
    },
  }

}
</script>

<style lang="less" scoped>
.search {
  ::v-deep .el-input {
     width: 682px;
    .el-input__suffix {

      display: flex;
      align-items: center;
      .el-icon-circle-close:before {
        content: '×';
        transform: scale(1.5);
        display: inline-block;
        position: absolute;
        top: 0;
        left: -10px;
        color: rgba(152, 167, 185, 0.5);
      }
    }
    .el-input__inner {
      height: 48px;
      line-height: 48px;
      padding-left: 24px;
      font-size: 20px;
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
      color: var(--base-text-color-1);
      background-color: var(--bg-color-3) !important;
      border: 1px solid var(--table-pageHeader-bg-color) !important;
      &:focus {
        border: 1px solid var(--active-color) !important;
        // border-bottom: 2px solid transparent !important;
      }
    }
  }
  .search-container {
    position: relative;
    display: flex;
    justify-content: flex-start;
    .btn-box {
      z-index: 12;

      margin-left: -2px;
      .searchBtn {
        width: 120px;
        height: 48px;
        // border-top-right-radius: 4px  !important;
        // border-bottom-right-radius: 4px !important;
        //  overflow: hidden;
        padding: 6px 10px !important;
        font-size: 20px;
        text-align: center;
      }
    }
    .search-list {
      position: absolute;
      top: 46px;
      left: 0;
      z-index: 888888;
      background-color: var(--bg-color-3);
      border: 1px solid var(--active-color);
      border-bottom-left-radius: 2px;
      border-bottom-right-radius: 2px;
      border-top: 0;
      width: 679px;
      ul {
        li{
          height: 40px;
          line-height: 40px;
          padding: 0 24px;
        }
        .tip{
          font-size: 14px;
          color: var(--base-text-color-to-999999);
          div{
            border-top: 1px solid rgba(255, 255, 255, 0.06);
          }
        }
        .search-item {
          cursor: pointer;
          font-size: 16px;
          color: var(--base-text-color-1);
          &:hover {
            background-color: var(--search-input-hover-bg);
          }
        }
      }
    }
  }
}
::v-deep .el-button--primary {
  background: var(--active-color) !important;
  border: 0;
  border-radius: 0 2px 2px 0 !important;
}
</style>
