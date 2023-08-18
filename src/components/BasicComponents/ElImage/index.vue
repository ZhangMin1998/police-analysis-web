<template>
  <div>
    <el-image
      :src="imgSet.src || ''"
      :fit="imgSet.fit || 'fill'"
      :style="{width: imgSet.width ? imgSet.width +'px' : '' , height: imgSet.height?  imgSet.height + 'px' :'218px'}"
      :preview-src-list="imgSet.list || [imgSet.src]"
    >
      <div slot="error" class="image-slot">
        <img
          :src="require('@/assets/img/' + (imgSet.errorSrc || 'icon-morenHeader') + '.png')"
          :width="imgSet.errorWidth || imgSet.width"
          :height="imgSet.errorHeight || imgSet.height || 'auto'"
        />
      </div>
    </el-image>
  </div>
</template>

<script>
export default {
  props: {
    imgSet: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="less" scoped>
// ::v-deep img.el-image__inner.el-image__preview {
//     height: 218px;
//     width: auto;
// }
</style>
