<template>
  <div class="certificate-box">
    <div class="certificate-list">
      <div
        :class="['certificate-item', { isActive: isActiveIndex == index }]"
        v-for="(item, index) in list"
        :key="item.id"
        @mouseover="handeleOver(index)"
        @mouseleave="handeleLeave"
      >
        <div class="label">{{ item.cerTypeName }}：</div>
        <div class="value">{{ item.cerNumber || '--' }}</div>
        <div class="btns" v-permission="'custom_human:add_edit_del_human'" v-show="isActiveIndex == index && isEditAble && item.cerTypeName!=='身份证'">
          <i class="el-icon-edit" @click="handleEdit(item)"></i>
          <i class="el-icon-delete" @click="handleDel(item)"></i>
        </div>
      </div>
      <div class="certificate-item last-item">
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api'
export default {
  props: {
    list: {
      list: Array,
      default: () => []
    },

    isEditAble: {
      type: Boolean,
      default: false
    }
  },

  setup (props, context) {
    const isActiveIndex = ref(-1)

    const handeleOver = index => {
      isActiveIndex.value = index
    }

    const handeleLeave = () => {
      isActiveIndex.value = -1
    }

    const handleEdit = item => {
      console.log(item);
      context.emit('handleEdit', item)
    }

    const handleDel = item => {
      context.emit('handleDel', item)
    }

    return {
      isActiveIndex,
      handeleOver,
      handeleLeave,
      handleEdit,
      handleDel
    }
  }
}
</script>

<style lang="less" scoped>
.certificate-box {
  .certificate-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .certificate-item {
      padding: 2px 4px 2px 0px;
      margin-top: 10px;
      box-sizing: border-box;
      position: relative;
      display: flex;
      width: 30%;
      min-width: 200px;
      &.isActive {
        background-color: var(--table-head-bg-color);
      }
      .value{
        color: var(--base-text-color-1);
      }
      .btns {
        position: absolute;
        right: 2px;
        top: 50%;
        transform: translateY(-50%);
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
    .last-item{
      padding: 0;
      margin-top: 0;
    }
  }
}
</style>
