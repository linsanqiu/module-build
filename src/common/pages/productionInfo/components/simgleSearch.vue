<template>
  <h-select
    ref='select'
    :placeholder="placeholder"
    :loading-text="loadingText"
    :loading="searchLoading"
    :remote-method="remoteMethod"
    remote
    filterable
    @on-change="selectChange"
    :value="value"
    widthAdaption
    autoPlacement
    :multiple='multiple'
    v-model='selectValue'
    :isCheckall='showCheckAll'
    :isSelectFilter='isCheckAll'
    @on-query-change="queryChange"
    multClearable
    @on-scroll="scrollData"
    :showBottom='isCheckAll?true:false'
    :maxDropWidth='350'
  >
    <h-option v-for="item in dataList" :value="item.value" :key="item.value">{{ item.label }}</h-option>
    <!-- <h-select-block :data="dataList" @on-scroll="scrollData"></h-select-block> -->
  </h-select>
</template>
<script>
export default {
  props: {
    special:{
      type: String,
      defalut() {
        return '';
      },
    },
    isCheckAll:{
      type: Boolean,
      defalut() {
        return false;
      },
    },
    empty: {
      type: Boolean,
      defalut() {
        return false;
      },
    },
    valueKey: {
      type: String,
      defalut() {
        return '';
      },
    },
    showKeyLabelKeyList: {
      type: Array,
      defalut() {
        return ["companyCode", "companyName"];
      },
    },
    value: {
      type: [String, Array],
    },
    disabled: {
      type: Boolean,
      defalut() {
        return false;
      },
    },
    action: {
      type: String,
      defalut() {
        return "";
      },
    },
    loadingText: {
      type: String,
      defalut() {
        return "加载中";
      },
    },
    placeholder: {
      type: String,
      defalut() {
        return "请输入";
      },
    },
    multiple: {
      type: Boolean,
      defalut() {
        return false;
      },
    }
  },
  data() {
    return {
      selectValue: [],
      showCheckAll: false,
      dataList: [],
      searchLoading: false,
      timer: null,
      pageNum: 1,
      pageSize: 50,
      hasNoData: false,
      scrollQuery: "",
    };
  },
  watch: {
  },
  mounted() {
    this.remoteMethod('')
  },
  methods: {
    scrollData(isBottom) {
      if (isBottom <= 1 && !this.hasNoData) {
        this.pageNum = this.pageNum + 1;
        this.remoteMethod(this.scrollQuery, true);
      }
    },
    remoteMethod(query, scroll = false) {
      this.scrollQuery = query;
      if (this.searchLoading && scroll) {
        return;
      }
      if (!scroll) {
        this.searchLoading = true;
        this.pageNum = 1;
        this.hasNoData = false;
      }
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        // 查询
        let body = {
          keyword: query,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
        };
        if (this.special == '1'){
          body = {
            dsNewsColumns: query,
            pageSize: this.pageSize,
            currentPage: this.pageNum,
          }
        }
        this.$http.post(this.action, body).then((res) => {
          let data = res.data.data || {};
          let dataList = data.records || [];
          if (this.special == '1'){
            data = res.data.body || {}
            dataList = data.dataList || []
          }
          this.searchLoading = false;
          let valueShow = this.showKeyLabelKeyList[0];
          let nameShow = this.showKeyLabelKeyList[1];
          let codeShow = this.showKeyLabelKeyList[2]||''
          for (let item of dataList) {
            if (this.valueKey){
              item.value = item[this.valueKey].toString();
            }else{
              item.value = item[valueShow].toString();
            }
            if (codeShow){
              if (!item[nameShow]){
                item.label = `${item[valueShow]}-${item[codeShow]}`;
              }else{
                item.label = `${item[valueShow]}-${item[nameShow]}-${item[codeShow]}`;
              }
             
            }else if (nameShow){
              item.label = `${item[valueShow]}-${item[nameShow]}`;
            }else{
              item.label = `${item[valueShow]}`
            }
          }
          let totalList = this.dataList;
          if (this.special == '1'){
            if (data.totalSize <= this.pageNum) {
              this.hasNoData = true;
            }
          }else{
            if (data.pages <= this.pageNum) {
              this.hasNoData = true;
            }
          }
 
          if (scroll) {
            totalList = totalList.concat(dataList);
          } else {
            if (this.empty && !this.special){
              dataList.unshift({
                value: '-1',
                label:'空值'
              })
            }
            totalList = dataList;
          }
          this.dataList = totalList;
        }).catch(
          this.searchLoading = false
        );
      }, 200);
    },
    selectChange(value) {
      if (!value) {
        this.$emit("input", '');
        return;
      }
      this.$emit("input", value);
    },
    queryChange(value){
      if (this.isCheckAll){
        if (value){
          this.showCheckAll = true
        }else{
          this.showCheckAll = false
        }
      }
    },
  },
};
</script>
<style scoped lang='scss'>
</style>
