<template>
  <div class="detail">
    <ElImage :imgSet.sync="imgSet"></ElImage>

    <div class="detail-info">
      <div class="detail-info-name">
        李晓
        <span class="age">（22岁）</span>

        <span class="opt-img" @click="handleCheck(item)">
          <img
            :src="require('@/assets/img/icon-check.png')"
            alt="查看档案"
            title="查看档案"
            width="24"
            height="24"
          />
        </span>
      </div>

      <div class="detail-info-content">
        <el-row v-for="(item, index) in propList" :key="index">
          <el-col
            :span="8"
            v-for="(propItem, propIndex) in item"
            :key="propIndex + '_' + propItem.prop"
          >
            <div class="info-item">
              <div class="label">
                {{ propItem.label + '：' }}
              </div>

              <!-- 超出文字 显示省略号 -->
              <Ellipsis :dataObj.sync="data" :wordsLength="10" :propStr="propItem.prop" />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from '@vue/composition-api'
import ElImage from '@/components/BasicComponents/ElImage'
import Ellipsis from '@/components/BasicComponents/Ellipsis'

const propList = [
  {
    label: '出生日期',
    prop: 'birthday'
  },
  {
    label: '证件类型',
    prop: 'birthday'
  },
  {
    label: '证件号码',
    prop: 'birthday'
  },
  {
    label: '联系方式',
    prop: 'birthday'
  },
  {
    label: '场所名称',
    prop: 'birthday'
  },
  {
    label: '房屋详情',
    prop: 'birthday'
  },
  {
    label: '住户类型',
    prop: 'birthday'
  },
  {
    label: '进入设备',
    prop: 'birthday'
  },
  {
    label: '入口名称',
    prop: 'birthday'
  },
  {
    label: '进入时间',
    prop: 'birthday'
  }
]

const data = {
  birthday: '1111'
}

export default {
  props: {
    detailInfo: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    ElImage,
    Ellipsis
  },
  setup () {
    const state = reactive({
      propList: propList,
      data: data,
      imgSet: {
        src:
          'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1704665174,2104161556&fm=26&gp=0.jpg',
        errorSrc: '@/assets/img/icon-morenHeader.png',
        width: 170,
        height: 245
      }
    })

    const getNewArray = (arr, size) => {
      var result = []
      for (var i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size))
      }
      return result
    }

    const handleCheck = () => {}

    onMounted(() => {
      state.propList = getNewArray(state.propList, 3)
    })
    return {
      ...toRefs(state),
      handleCheck
    }
  }
}
</script>

<style lang="less" scoped>
.detail {
  display: flex;
  align-items: center;
  display: flex;
  .detail-info {
    flex: 1 1 auto;
    margin-left: 24px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    .detail-info-name {
      font-size: 20px;
      line-height: 20px;
      margin-bottom: 24px;
      color: var(--base-text-color-1);
      font-weight: 600;
      .age {
        font-size: 16px;
      }

      .opt-img {
        width: 24px;
        height: 24px;
        vertical-align: middle;
        cursor: pointer;
        margin-left: 12px;
      }
    }
    .info-item {
      display: flex;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>
