<template>
  <div>
    <div v-if="pop.show" :class="customClass ? customClass : dataCenterDetail ? 'data_center_detail' : styleClass">
      <el-dialog
        :visible="pop.show"
        :close-on-click-modal="false"
        @close="beforeClose"
        :modal-append-to-body="false"
        :width="$pxToRem(pop.width)"
        :top="pop.top"
        :custom-class='dialogClass'
      >
        <div v-if="dataCenterDetail" slot="title">
          <div class='detail_title'>
            <img :src='require("@/assets/img/set-bg.png")' alt=''>
            <div>{{ pop.title }}</div>
          </div>
        </div>
        <div v-else slot="title" class="dialog-title">
          <div class="rule-content">
            <list-title :title="pop.title" />
          </div>
        </div>
        <slot></slot>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    pop: {
      type: Object,
      default: function () {
        return { show: false, title: '原始数据', width: '980px', top: '18vh' }
      },
    },
    customClass: {
      type: String,
    },
    dialogClass: {
      type: String,
      default: 'pop_dialog'
    },
    dataCenterDetail: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState('analysisJudgement', {
      screenHeight: 'screenHeight',
    }),
    styleClass () {
      return this.screenHeight > 936 ? 'addFeature' : 'pop'
    },
  },
  methods: {
    beforeClose () {
      this.$emit('beforeClose')
    },
    beforeOpen () {
      this.$emit('beforeOpen')
    },
  },
}
</script>

<style lang="less" scoped>
  .data_center_detail {
    /deep/.el-dialog__wrapper {
      .el-dialog {
        // background: #232A43 !important;
        background: var(--bg-color-4) !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        min-width: 450px !important;
        margin: 0 !important;
        .el-dialog__header {
          margin: 0 24px;
          padding: 20px 0 11px;
          border-bottom: 1px solid	rgba(61, 110, 255, .64);
          .el-dialog__headerbtn {
            top: 16px;
            right: 24px;
            font-size: 24px;
            i {
              color: #515C7C;
              font-weight: bold;
              &:hover{
                color: var(--active-color);
              }
            }

          }
          .detail_title {
            position: relative;
            height: 18px;
            line-height: 18px;
            font-size: 18px;
            color: var(--base-text-color-1);
            font-weight: bold;
            div {
              position: absolute;
              bottom: 0;
              margin-left: 10px;
            }
            img {
              width: 65px;
              height: 8px;
              margin-top: 14px;
            }
          }
        }
        .el-dialog__body {
          padding: 24px 28px 32px 36px !important;
          max-height: calc(100vh - 224px) !important;
          overflow-y: auto;
        }
        .rule-content {
          .title {
            background: url('~@/assets/img/device-list-title-bg-2.png') no-repeat;
          }
        }
      }
    }
  }
</style>
