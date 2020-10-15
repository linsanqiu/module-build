<template>
  <div class="vertical_table" :class="{'noBorder': data.length < 3}">
    <div class="table_left">
      <div v-for="(col, index) in tableList"
           :key="index"
           :class="{'header': !index}"
           :style="{height: heightArr[index] + 'px'}"
           class="table_row">
        <span>{{tableTemplate(index)}}</span>
      </div>
    </div>
    <div ref="tableContainer" class="table_container">
      <div v-for="(col, index) in tableList"
           :key="index"
           :class="{'header': !index}"
           class="table_row">
        <div v-for="(item, key) in col"
             :key="key"
             @dblclick="showEdit(index, key)"
             :style="{minWidth: colWidth}"
             :class="{'pointer': !index}"
             class="table_col">
          <template v-if="index === 0">
            <div class="block">{{item.dataName}}</div>
            <div>{{item.dataEnName}}</div>
          </template>
          <template v-if="index === 1">
            <div>{{item.sourceStr}}</div>
          </template>
          <template v-if="index === 2">
            <div @click="goPage(item.pageCurrent)" class="pointer">{{ (item.pageCurrent && item.pageCurrent.toString()) || ''}}</div>
          </template>
          <template v-if="index === 3">
            <div>22</div>
          </template>
          <template v-if="index === 4">
            <h-switch :value="Boolean(item.checkResult && Number(item.checkResult) === 1)"
                      @on-change="checkResultChange(key, arguments)"
                      size="large">
              <span slot="open">正确</span>
              <span slot="close">错误</span>
            </h-switch>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "verticalTable",
  props: {
    data: Array,
    show: Boolean,
    allowEdit: {
      type: Boolean,
      default: false
    },
    colWidth: {
      type: String,
      default: '120px'
    }
  },
  data () {
    return {
      heightArr: [], // 表格每行高度
    }
  },
  computed: {
    tableList () {
      let list = [];
      if (this.data && this.data.length) {
        list.push(this.data.map(value => {
          return {
            dataEnName: value.dataEnName,
            dataName: value.dataName,
          }
        }))
        list.push(this.data.map(value => {
          return {
            sourceStr: value.sourceStr
          }
        }))
        list.push(this.data.map(value => {
          return {
            pageCurrent: value.pageCurrent
          }
        }))
        if (this.allowEdit) {
          list.push(this.data.map(value => {
            return {
              trueData: value.trueData
            }
          }))
          list.push(this.data.map(value => {
            return {
              checkResult: value.checkResult
            }
          }))
        }
      }
      return list
    }
  },
  watch: {
    tableList: {
      immediate: true,
      handler () {
        this.sumHeight()
      }
    },
    show () {
      this.sumHeight();
    }
  },
  mounted() {
  },
  methods: {
    //高度计算
    sumHeight () {
      this.$nextTick(() => {
        const nodes = this.$refs.tableContainer.children;
        let heightArr = [];
        for (let item in nodes) {
          heightArr.push(nodes[item].offsetHeight);
        }
        this.heightArr = heightArr;
      })
    },
    // pdf 页面跳转
    goPage (page) {
      this.$emit('goPage', page)
    },
    // 是否正确开关
    checkResultChange (key, arr) {
      this.data[key].checkResult = arr[0] ? 1 : 0;
    },
    // 双击显示修改弹窗
    showEdit (index, key) {
      if (index) return ;
      this.$emit('editTable', this.data[key])
    },
    // 表格模板
    tableTemplate (index) {
      let text = ''
      switch (index) {
        case 0:
          text = '字符名称';
          break
        case 1:
          text = '字符值';
          break
        case 2:
          text = '页码';
          break
        case 3:
          text = '正确值';
          break
        case 4:
          text = '是否正确';
          break
        default:
          text = '名称'
      }
      return text;
    }
  }
}
</script>

<style lang="scss" scoped>
.pointer{
  cursor: pointer;
}
.vertical_table{
  font-size: 12px;
  color: #495060;
  margin-top: 10px;
  background: white;
  border: 1px solid #DCE1E7;
  box-sizing: border-box;
  position: relative;
  &.noBorder{
    border-bottom: none;
  }
  .table_left{
    width: 100px;
    height: calc(100% - 10px);
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    box-sizing: border-box;
    box-shadow: 2px 0 6px -2px rgba(0, 0, 0, 0.2);
    background: white;
    z-index: 2;
    .table_row{
      min-height: 35px;
      padding: 5px;
      border-right: 1px solid #DCE1E7;
      border-bottom: 1px solid #DCE1E7;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      span{
      }
      &.header{
        background: #f0f3f5;
      }
      &:last-child{
        //border-bottom: none;
      }
    }
  }
  .table_container{
    max-width: 100%;
    overflow: auto;
    box-sizing: border-box;
    .table_row{
      white-space: nowrap;
      width: auto;
      display: inline-flex;
      align-items: flex-start;
      justify-items: flex-start;
      box-sizing: border-box;
      border-bottom: 1px solid #DCE1E7;
      padding-left: 100px;
      min-width: 100%;
      &.header{
        background: #f0f3f5;
      }
      .table_col{
        border-left: 1px solid #DCE1E7;
        display: inline-flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        vertical-align: top;
        text-align: center;
        min-height: 35px;
        padding: 5px;
        box-sizing: border-box;
        word-break: break-all;
        .block{
          flex-basis: 100%;
        }
        &:first-child{
          border-left: none;
        }
      }
    }
  }
}
</style>
