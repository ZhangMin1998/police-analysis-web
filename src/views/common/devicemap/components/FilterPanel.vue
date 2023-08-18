<template>
  <div class="search-wrapper filterPanel">
    <filter-header
      :backgroundColor="'rgba(255, 255, 255, 0.04)'"
      v-model="selectedItem"
      @open="openFilter"
    >
      <template>
        <div style="width: 320px">
          <el-input
            v-model="params.searchKey"
            @keyup.enter.native="search"
            placeholder="请输入场所名称/设备名称"
          >
          </el-input>
        </div>
      </template>

      <template v-slot:filterBtn>
        <div class="search-btn">
          <div class="blank_button" @click="reset">重置</div>
          <div class="blank_button" @click="search($event)">搜索</div>
        </div>
      </template>
    </filter-header>

    <div class="selectPanel" v-if="isOpen">
      <filter-item v-model="params.accessTypes" label="经营性质:" :list="list.accessTypes" />
      <filter-item v-model="params.placeTypes" label="场所类型:" :list="list.placeTypes" />
      <filter-item v-model="params.deviceTypes" label="设备类型:" :list="list.deviceTypes" />
      <filter-item v-model="params.onLineStatus" label="在线状态:" :list="list.onLineStatus" />
    </div>
  </div>
</template>

<script>
import filterItem from '@/components/BasicComponents/FilterPanel/FilterItem'
import filterHeader from '@/components/BasicComponents/FilterPanel/FilterHeader'
import { getAllType } from '@/api/config'

const RATE_LIST = [
  {
    label: '在线',
    value: '1',
  },
  {
    label: '离线',
    value: '0',
  },
]

export default {
  components: {
    filterItem,
    filterHeader,
  },

  data () {
    return {
      // fatherWidth: 0, // 父级元素宽度
      isOpen: false,
      loadingbut: false,
      params: {
        placeTypes: [],
        accessTypes: [],
        deviceTypes: [],
        searchKey: '',
        onLineStatus: [],
      },
      list: {
        placeTypes: [],
        accessTypes: [],
        deviceTypes: [],
        onLineStatus: [],
      },
    }
  },

  computed: {
    selectedItem: {
      get () {
        const re = []
        for (let key in this.params) {
          const arr = this.params[key]

          if (arr.length != '0' && key != 'searchKey') {
            let list = this.list[key].filter(item => {
              return arr.indexOf(item.value) > -1
            })

            list = list.map(i => {
              return {
                label: i.label,
                type: i.value,
                key: key,
              }
            })

            re.push(...list)
          }
        }
        return re
      },
      set (newItem) {
        let index = this.params[newItem['key']].findIndex(i => i == newItem.type)
        if (index == -1) return
        this.params[newItem['key']].splice(index, 1)
      },
    },
  },

  mounted () {
    if (this.$route.query.device) {
      this.params.searchKey = this.$route.query.device
    }
    this.queryTypeList()
    document.addEventListener('click', this.bodyClick)
  },
  destroyed () {
    document.removeEventListener('click', this.bodyClick)
  },

  methods: {
    bodyClick (e) {
      // 点击页面其他地方，关闭过滤选择器
      let newFilterDiv = document.querySelector('.selectPanel')

      if (newFilterDiv &&!newFilterDiv.contains(e.target)) {
        this.isOpen = false
      }
    },
    /** 获取下拉列表数据*/
    queryTypeList () {
      Promise.all([getAllType()])
        .then(res => {
          this.list.placeTypes = this.formatType(res[0].PlaceType)
          this.list.accessTypes = this.formatType(res[0].AccessType)
          this.list.deviceTypes = this.formatType(res[0].DeviceType)
          this.list.onLineStatus = RATE_LIST
        })
        .catch(() => { })
    },

    formatType (list) {
      let arr = []
      arr = list.map(i => {
        return {
          label: i.dictDataValue,
          value: i.dictDataCode,
        }
      })
      return arr
    },

    openFilter () {
      this.isOpen = !this.isOpen
    },

    closeFilter () {
      this.isOpen = false
    },

    search (e) {
      if (e && e.target) {
        if (e.target.parentNode && e.target.parentNode.nodeName === 'BUTTON') {
          e.target.parentNode.blur()
        } else if (e.target.nodeName === 'BUTTON') {
          e.target.blur()
        }
      }
      this.$emit('filterSearch', this.params)
    },

    reset () {
      this.params = {
        placeTypes: [],
        accessTypes: [],
        deviceTypes: [],
        onLineStatus: [],
        searchKey: '',
      }
      this.$emit('filterSearch', this.params)
    },
  },
}
</script>

<style lang="less" scoped>
.search-wrapper {
  // background: rgba(32, 43, 63, 1);
  background: var(--bg-color-3);
  opacity: 0.95;
  overflow: visible;
}
.search-btn {
  display: flex;
  align-items: center;
  width: 160px;
  justify-content: space-between;
  .btn {
    padding: 10px 20px;
    box-sizing: border-box;
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: @font-color-3;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: #177ddc;
    }
  }
}
.filterPanel {
  position: relative;
  width: 100%;
  .selectPanel {
    margin: 0 5px;
    height: calc(100vh - 300px);
    box-sizing: border-box;
    position: absolute;
    top: 60px;
    background-color: var(--daochu-bg-color);
  }
}
</style>
