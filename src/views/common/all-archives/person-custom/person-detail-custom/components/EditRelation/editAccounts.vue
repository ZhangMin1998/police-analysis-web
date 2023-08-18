<template>
  <div class="editAccounts">
    <!-- <el-button @click="addAccounts" plain>添加数据aaaaaaaaaaaaa</el-button> -->
    <div class="relationList" v-for="(item, idx) in typeList" :key="item.typeName + '_' + idx">
      <div class="infoItem">
        <img :src="require('@/assets/img/' + typeIconMap[item.typeCode] + '.png')" />
        <span class="item-title">{{ item.typeName }}</span>
        <i :class="['el-icon-plus']" @click="addAccounts(item)"></i>
      </div>
      <div class="infoContent" @mouseover="handeleOverFirst(idx)">
        <div
          :class="[
            'BaseRehab-chirldren-item',
            { isActive: isActiveIndex == index && firstIndex == idx }
          ]"
          v-for="(value, index) in item.list"
          :key="index + '_' + value.id"
          @mouseover="handeleOver(index)"
          @mouseleave="handeleLeave"
        >
          <!-- 这里的次数,还需要再改一下,暂时用id来代替 -->
          <div class="singleItem">
            <div class="singleItemText">{{ value.index }}</div>
            <div class="btns" v-show="isActiveIndex == index && firstIndex == idx">
              <i class="el-icon-edit" @click="handleEdit(value)"></i>
              <i class="el-icon-delete" @click="handleDel(value)"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { typeIconMap } from '@/views/common/all-archives/person-custom/relation-atlas/Charts/mock.js'
export default {
  props: {
    list: {
      type: Object
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      typeIconMap: Object.freeze(typeIconMap),
      isActiveIndex: -1,
      firstIndex: -1
    }
  },
  computed: {
    typeList () {
      if (!this.list || JSON.stringify(this.list) === '{}') return []
      let list = []
      Object.keys(this.list).forEach(val => {
        if (!this.list[val] || this.list[val].length === 0) return
        const obj = {
          typeCode: this.list[val][0].typeCode,
          typeName:
            this.$store.getters['Dict/usefulRelationTypeListMap'][this.list[val][0].typeCode],
          list: this.list[val]
        }
        list.push(obj)
      })
      return list
    }
  },
  methods: {
    handeleOver (index) {
      this.isActiveIndex = index
    },
    handeleOverFirst (val) {
      this.firstIndex = val
    },
    handeleLeave () {
      this.isActiveIndex = -1
    },
    // 编辑
    handleEdit (val, type) {
      this.$emit('handleEdit', val, this.index, type)
    },
    // 删除
    handleDel (val) {
      this.$emit('handleDel', val)
    },
    // 新增
    addAccounts (item) {
      this.$emit('handleAdd', item)
    }
  }
}
</script>

<style lang="less" scoped>
.editAccounts {
  .relationList {
    margin-bottom: 24px;
    .infoItem {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 10px 0;
      img {
        width: 24px;
        height: 24px;
      }
      .item-title {
        margin-left: 8px;
      }
    }
  }

  .infoContent {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    font-size: 14px;
    color: var(--base-text-color-1);
    .BaseRehab-chirldren-item {
      width: 21%;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 5px 49px 5px 0;
      padding: 4px 8px 4px 0px;
      &.isActive {
        background-color: var(--table-head-bg-color);
      }
      .singleItem {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        .singleItemText {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .btns {
          margin-left: 12px;
          width: 80px;
          i {
            margin-left: 8px;
            cursor: pointer;
            &:hover {
              color: #409eff;
            }
            &.isActive {
              color: #409eff;
            }
          }
        }
      }
    }
  }
}
.el-icon-plus {
  cursor: pointer;
  margin-left: 16px;
  &:hover {
    color: #409eff;
  }
  &.isActive {
    color: #409eff;
  }
}
</style>
