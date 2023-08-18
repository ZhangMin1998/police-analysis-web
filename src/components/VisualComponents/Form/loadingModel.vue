<template>
  <div>
    <div class="loading_text" v-if="num != -1">{{ localStr }}</div>
    <div dia_laoding :style="{ height: `${fatherHeight * 0.5}px` }">
      <sync-loading
        ref="progressRef"
        :loading="true"
        :strokeWidth="11"
        :backgroundColor="'transparent'"
      >
      </sync-loading>
    </div>
    <div class="flex_right">
      <span
        v-if="hasCancel"
        class="p-button"
        style="padding: 9px 20px; margin-right: 10px"
        @click="cancelLoading"
        >取消</span
      >
      <slot name="addJobBtn"></slot>
    </div>
  </div>
</template>

<script>
import SyncLoading from '@/components/VisualComponents/Table/progress'
const localList = [
  'Creating a new SqlSession',
  'Registering transaction synchronization for SqlSession',
  ' [org.apache.ibatis.session.defaults.DefaultSqlSession@4257ee09]',
  'JDBC Connection [org.postgresql.jdbc.',
  'PgConnection@1ee5c7d3] will be managed by Spring',
  '==>  Preparing: select * from db ',
  '==> Parameters: 10(Long), 0(Long)',
  '<==    Columns: id, time_on, time_off, last_',
  'update_time, signal_strength, mobile_mac, company, hotpos_position,',
  'hotpos_ap_mac, hotpos_ap_channel, hotpos_tencrypt_type, ',
  'x_coordinate, y_coordinate, equipment_code, equipment_longitude,',
  'equiment_latitude, netbar_wacode, ',
  'collection_equipment_mac, status, deviceName,',
  'placeName, equipmentLongitude, equimentLatitude',
  '<==      Total: 10',
  'Releasing transactional SqlSession ',
  '[org.apache.ibatis.session.defaults.DefaultSqlSession@27ece4bd]'
]
export default {
  components: {
    SyncLoading
  },
  props: {
    hasCancel: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      fatherHeight: 0, // 父级元素高度
      localStr: '',
      localList: localList,
      changeStr: null,
      num: -1
    }
  },

  mounted () {
    this.fatherHeight = this.$el.parentNode.offsetHeight
    this.num = 0
    this.changeStr = setInterval(
      () => {
        this.num += 1
        if (this.num == this.localList.length) {
          this.num = 0
        }
        this.localStr = this.localList[this.num]
      },
      this.num < 10 ? '70' : this.num >= 10 && this.num < 50 ? '200' : '80'
    )
  },

  beforeDestroy () {
    this.num = -1
    clearInterval(this.changeStr)
  },

  methods: {
    cancelLoading () {
      this.$emit('cancelLoading')
    },
    restetPercentage () {
      this.$refs.progressRef.percentage = 0
    }
  }
}
</script>

<style lang="less" scoped>
.dia_laoding {
  display: flex;
  justify-content: center;
}
.loading_text {
  color: var(--base-text-color-to-999999);
  padding-left: 5%;
}
.flex_right {
  display: flex;
  justify-content: flex-end;
}
</style>
