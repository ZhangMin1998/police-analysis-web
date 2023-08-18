<template>
  <div class="persons" :style="`height:${offsetHeight}px;`">
    <div :class="`concactDes ${curPersonId == 0 ? 'isActive' : ''}`" v-if="tracksobj">
      <div class="borbtm" @click.prevent.stop="clickRound({ id: 0 })">
        <div class="concactTitle"><i class="el-icon-map-location"></i>关联轨迹</div>
        <div>{{ tracksobj.startTime }}-{{ tracksobj.endTime }}</div>
        <div>{{ tracksobj.startAdd }}{{ tracksobj.startAdd ? '-' : '' }}{{ tracksobj.endAdd }}</div>
      </div>
    </div>
    <div
      :class="`clickpersonItem ${curPersonId == item.id ? 'isActive' : ''}`"
      @click.prevent.stop="clickRound(item)"
      v-for="(item, idx) in list"
      :key="idx"
    >
      <div class="concactTitle"><i class="el-icon-user"></i>关联人物</div>
      <div class="personItem">
        <div class="personInfo">
          <div class="img">
            <img
              :src="require('@/assets/img/icon-morenHeader.png')"
              alt=""
              width="28"
              height="40"
            />
          </div>
          <div class="info">
            <div class="name">{{ item.name }}</div>
            <div>{{ item.idCardNumber || '身份证号' }}</div>
          </div>
        </div>
        <div v-if="btnRender && btnRender.length">
          <el-button
            v-for="(btnItem, btnIndex) in btnRender"
            :key="btnIndex"
            @click.native.prevent.stop="btnItem.btnEvent(item)"
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    btnRender: {
      type: Array,
      default: () => []
    },
    list: {
      type: Array,
      default: () => []
    },
    deHeight: {
      type: [String, Number],
      default: 0
    },
    tracksobj: {
      type: Object,
      default: function () {
        return null
      }
    }
  },
  data () {
    return {
      curPersonId: 0
    }
  },
  computed: {
    ...mapState('analysisJudgement', {
      screenHeight: 'screenHeight'
    }),
    offsetHeight () {
      return this.screenHeight - this.deHeight
    }
  },
  methods: {
    clickRound (item) {
      this.curPersonId = item.id
      this.$emit('clickRound', item)
    }
  }
}
</script>

<style lang="less" scoped>
.persons {
  overflow: auto;
  .concactTitle {
    padding-top: 14px;
    color: var(--base-text-color-1);
    font-size: 16px;
    margin-bottom: 6px;
    i {
      margin-right: 8px;
    }
  }
  .concactDes {
    padding: 0 16px;
    box-sizing: border-box;
    color: var(--base-text-color-to-999999);
    font-size: 16px;
    line-height: 26px;
    &.isActive {
      background-color: #3b4964;
      color: var(--base-text-color-1);
    }
    cursor: pointer;
    .borbtm {
      border-bottom: 2px solid #445268;
      padding-bottom: 15px;
    }
    &:hover {
      background-color: #3b4964;
      color: var(--base-text-color-1);
    }
  }
  .clickpersonItem {
    &.isActive {
      background-color: #3b4964;
      color: var(--base-text-color-1);
    }
    cursor: pointer;
    padding: 0 16px;
    padding-top: 15px;
    box-sizing: border-box;
    &:hover {
      background-color: #3b4964;
      color: var(--base-text-color-1);
    }
    .concactTitle {
      padding-top: 0px;
      margin-bottom: 15px;
    }
    .personItem {
      padding-bottom: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #445268;
      color: var(--base-text-color-to-999999);
      .personInfo {
        font-size: 16px;
        display: flex;
        align-items: center;
        .img {
          margin-right: 10px;
        }
        .info {
          flex: 1 1 auto;
          .name {
            margin-bottom: 7px;
          }
        }
      }
    }
  }
}
</style>
