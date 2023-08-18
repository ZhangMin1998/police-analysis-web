<template>
  <div class="CusSuggest">
    <div v-if="cusSuggest.show">
      <el-dialog
        :show-close="false"
        :visible="cusSuggest.show"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :width="cusSuggest.width"
        :top="cusSuggest.top"
        :style="{ height: cusSuggest.height || '' }"
        :custom-class="cusSuggest.class || ''"
        @close="beforeClose"
      >
        <template v-slot:title
          ><el-header
            ><div>{{ cusSuggest.title || '提示' }}</div>
            <div @click="beforeClose">
              <i class="el-icon-close"></i></div></el-header
        ></template>

        <el-main
          ><div><i class="el-icon-warning"></i></div>
          <div><slot></slot></div>
        </el-main>

        <el-footer v-if="cusSuggest.btn && cusSuggest.btn.length">
          <CusButton :btnList="cusSuggest.btn"></CusButton>
        </el-footer>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import CusButton from '@/components/BasicComponents/CusButton'
export default {
  name: 'CusSuggest',
  components: {
    CusButton
  },
  props: {
    cusSuggest: {
      type: Object,
      default: () => {}
    }
  },

  methods: {
    beforeClose () {
      this.$emit('beforeClose')
    },
    beforeOpen () {
      this.$emit('beforeOpen')
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-dialog {
  margin-left: 40% !important;
  background-color: rgba(32, 48, 76, 0.87) !important;
}
/deep/.v-modal {
  background-color: rgba(32, 43, 63, 0.95);
}
/deep/.el-dialog__body {
  padding: 0 !important;
}
/deep/.el-dialog__header {
  padding: 0 !important;
}

.el-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--base-text-color-1);
  height: 48px;
  .el-icon-close {
    font-size: 24px;
    color: #737b8b;
    cursor: pointer;
    &:hover {
      color: #177ddc;
    }
  }
}

.el-main {
  display: flex;
  color: var(--base-text-color-1);
  line-height: 32px;
  padding: 28px 42px;
  box-sizing: border-box;
  .el-icon-warning {
    padding-top: 4px;
    font-size: 24px;
    color: #177ddc;
    margin-right: 16px;
  }
}
</style>
