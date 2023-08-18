<template>
  <div>
    <el-popover v-if="showPop" placement="top-start" width="200" trigger="hover" :content="content">
      <div slot="reference">
        {{ content | ellipsis(wordsLength) }}
      </div>
    </el-popover>
    <div class="defaultValue" v-else>
      {{ content }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dataObj: {
      type: Object,
      default: () => {}
    },
    wordsLength: {
      type: [Number, String]
    },
    propStr: {
      type: String
    },
    value: {
      type: [Number, String]
    }
  },

  computed: {
    showPop () {
      const len = this.strCode(this.propStr ? this.dataObj[this.propStr] : this.value)
      return len > this.wordsLength
    },
    content () {
      return this.propStr
        ? this.dataObj[this.propStr]?.toString()?.trim() || '--'
        : this.value?.toString()?.trim() || '--'
    }
  },
  methods: {
    strCode (str) {
      if (!str) return 0
      //获取字符串的字节数
      var count = 0 //初始化字节数递加变量并获取字符串参数的字符个数
      if (str) {
        //如果存在字符串，则执行
        let len = str.length
        for (var i = 0; i < len; i++) {
          //遍历字符串，枚举每个字符
          if (str.charCodeAt(i) > 255) {
            //字符编码大于255，说明是双字节字符(即是中文)
            count += 2 //则累加2个
          } else {
            count++ //否则递加一次
          }
        }
        return count //返回字节数
      } else {
        return 0 //如果参数为空，则返回0个
      }
    }
  }
}
</script>

<style lang="less" scoped>
.defaultValue {
  color: var(--base-text-color-1);
}
</style>
