<template>
<div class='trail_attr_table'>
  <div class='add' v-if="dataManageTagIsEdit === 'true'">
    <el-button type="primary" @click='add'>新建</el-button>
  </div>
  <div class='entity_table'>
    <el-table
      :data='list'
      height='100%'
    >
      <el-table-column
        type="index"
        width="120"
        :label="'序号'"
        :resizable="true"
      ></el-table-column>
      <el-table-column
        prop="entityId"
        label="实体"
        min-width="63.24%"
        :show-overflow-tooltip="true"
        :resizable="true"
        class-name='entity_item'
      >
        <template slot-scope="{ row }">
          <div v-show='!row.isEdit'>{{
              entityAttrObj[row.entityId + ''] ?
                entityAttrObj[row.entityId + '']['entityName'] ?
                  entityAttrObj[row.entityId + '']['entityName'] : '--' : '--' }}</div>
          <div v-show='row.isEdit'>
            <el-select v-model="row.editEntityId" placeholder="请选择">
              <el-option
                v-for="(value, key) in entityAttrObj"
                :key="key"
                :label="value.entityName"
                :value="value.id + ''">
              </el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="操作时间"
        min-width="16.95%"
        :show-overflow-tooltip="true"
        :resizable="true"
      >
        <template slot-scope="{ row }">
          <span>{{ row.updateTime ? new Date(row.updateTime).toLocaleString() : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="operator"
        label="操作人"
        min-width="11.85%"
        :show-overflow-tooltip="true"
        :resizable="true"
      >
        <template slot-scope="{ row }">
          <span>{{ row.operator ? row.operator : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="9.23%"
        :resizable="false"
        class-name="opt"
        v-if="dataManageTagIsEdit === 'true'"
      >
        <template slot-scope="{ row, $index }">
          <div class='opera_btn' v-show='!row.isEdit'>
            <i
              class='iconfont icon-bianji'
              :class='{"have_opacity": !row.editableFlag}'
              title='编辑'
              @click='editAttr(row)'
            ></i>
            <i
              class='iconfont icon-delete'
              :class='{"have_opacity": !row.editableFlag}'
              title='删除'
              @click='delAttr(row)'
            ></i>
          </div>
          <div class='opera_btn' v-show='row.isEdit'>
            <span :class='{ "no_click": !row.editEntityId }' @click='submit(row)'>确定</span>
            <span @click='cancelEdit(row, $index)'>取消</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</div>
</template>

<script>
import { operaTrailAttr, delTrailAttr } from '@/api/sysSetting'
import { mapState } from 'vuex'
export default {
  name: 'TrailAttrTable',
  props: {
    tableList: {
      type: Array,
      default: () => []
    },
    entityAttrObj: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('User', {
      dataManageTagIsEdit:'dataManageTagIsEdit',
    }),
    list: {
      get () {
        return this.tableList
      },
      set (value) {
        this.$emit('update:tableList', value)
      }
    },
    haveAddItem () {
      return this.list.some(item => item.isAdd)
    }
  },
  methods: {
    editAttr (row) {
      if (!row.editableFlag) return
      row['editEntityId'] = row.entityId + '' || ''
      row['isEdit'] = true
    },
    delAttr (row) {
      if (!row.editableFlag) return
      this.$policeComfirm(`您确定要删除该标签吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        delTrailAttr({
          id: row.id
        }).then(() => {
          this.$message.success('删除成功！')
          this.$emit('getTrailList', 'attr')
        })
      })
    },
    cancelEdit (row, index) {
      if (row.isAdd) {
        this.list.splice(index, 1)
      } else {
        row['editEntityId'] = ''
        row['isEdit'] = false
      }
    },
    add () {
      if (this.haveAddItem) return
      this.list.push({
        entityId: '',
        editEntityId: '',
        isEdit: true,
        isAdd: true
      })
    },
    submit (row) {
      if (!row.editEntityId) return
      let params = {
        entityId: +row.editEntityId
      }
      let way = 'update'
      if (row.isAdd) {
        params['elementType'] = 'attr'
        way = 'insert'
      } else {
        params['id'] = row.id
      }
      operaTrailAttr(params, way).then(() => {
        if (row.isAdd) {
          this.$message.success('新建成功！')
        } else {
          this.$message.success('修改成功！')
        }
        this.$emit('getTrailList', 'attr')
      })
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.trail_attr_table {
  height: 100%;
  .add {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }
  .entity_table {
    height: calc(100% - 48px);
  }
  .opera_btn {
    i {
      font-size: 16px;
      color: var(--base-text-color-to-999999);
      cursor: pointer;
      margin-right: 8px;
    }
    .have_opacity {
      opacity: 0.4;
      cursor: not-allowed;
    }
    span {
      cursor: pointer;
      margin-right: 8px;
      &:hover {
        color: var(--active-color);
      }
      &.no_click {
        cursor: not-allowed;
        &:hover {
          color: var(--base-text-color-1);
        }
      }
    }
  }
  /deep/.el-table__cell {
    &.entity_item {
      padding: 12px 0 !important;
      .cell {
        line-height: 23px !important;
      }
    }
  }
  /deep/.el-select .el-input .el-input__inner {
    height: 23px;
    line-height: 23px;
    font-size: 14px;
  }
  /deep/.el-select {
    .el-input {
      .el-input__suffix {
        line-height: 22px !important;
        .el-input__icon {
          line-height: 22px;
        }
      }
    }
  }
}
</style>
