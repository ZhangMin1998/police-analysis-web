<template>
  <div class="RelationEditForm">
    <el-form :model="tableForm" ref="nameForm" label-position="left" label-width="80px">
      <div v-for="(val, key) in editItems" :key="key">
        <el-form-item
          v-for="(item, idx) in val"
          :key="idx + 1 + item"
          :label="item.label + (idx + 1)"
        >
          <el-input v-model="item.value" @input="inpChange(item)"></el-input>
          <div class="handleBtns">
            <i
              v-if="idx + 1 == editItems[key].length"
              class="el-icon-circle-plus-outline addBtn"
              @click="addItem(item.key, item.label)"
            ></i>
            <i
              v-if="editItems[key].length > 1"
              class="el-icon-remove-outline delBtn"
              @click="delItem(idx, item.key)"
            ></i>
          </div>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>


export default {
  name: 'RelationEditForm',
  props: {
    tableForm: {
      type: Object
    },
    editLabels: {
      type: Object
    },
    tableName: {
      type: String
    }
  },
  data () {
    return {
      editItems: {},
    }
  },
  created () {
    this.editItems = { ...this.editLabels };
  },
  watch:{
    editLabels (val){
      this.editItems = val
    }
  },
  methods: {
    addItem (v, label) {
      this.editItems[v].push({
        label,
        value: '',
        key: v,
        isChanged: true
      })
    },
    delItem (i, key) {
      this.editItems[key].splice(i, 1)
    },
    handleDel (item) {
      this.$emit('handleDel', item)
    },
    inpChange (item) {
      item.isChanged = true
    }
  },
}
</script>

<style lang="less" scoped>
/deep/.el-form {
  display: flex;
  flex-wrap: wrap;
  max-width: 870px;
}
/deep/.el-input__inner {
  width: 281px;
  height: 32px;
}
/deep/.el-form-item__content {
  position: relative;
  width: 350px;
}

.handleBtns {
  position: absolute;
  top: 0;
  right: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 14px;
  height: 35px;
  cursor: pointer;
}
</style>
