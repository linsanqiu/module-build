<template>
  <h-simple-select
    :placeholder="placeholder"
    :loading-text="loadingText"
    :loading="searchLoading"
    :remote-method="remoteMethod"
    remote
    filterable
    @on-change="selectChange"
    :value="value"
    searchIcon="search"
    widthAdaption
    autoPlacement
  >
    <h-select-block :data="dataList" @on-scroll="scrollData"></h-select-block>
  </h-simple-select>
</template>
<script>
export default {
  props: {
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
      type: String,
      defalut() {
        return '';
      },
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
  },
  data() {
    return {
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
      if (query === "") {
        return;
      }
      if (this.searchLoading && scroll) {
        return;
      }
      if (!scroll) {
        this.pageNum = 1;
        this.hasNoData = false;
      }
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.searchLoading = true;
      this.timer = setTimeout(() => {
        // 查询
        let body = {
          keyword: query,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        };
        this.$http.post(this.action, body).then((res) => {
          let data = res.data.data || {};
          this.searchLoading = false;
          let dataList = data.records || [];
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
              item.label = `${item[valueShow]}-${item[nameShow]}-${item[codeShow]}`;
            }else{
              item.label = `${item[valueShow]}-${item[nameShow]}`;
            }
          }
          let totalList = this.dataList;
          if (data.pages <= this.pageNum) {
            this.hasNoData = true;
          }
          if (scroll) {
            totalList = totalList.concat(dataList);
          } else {
            totalList = dataList;
          }
          this.dataList = totalList;
        });
      }, 200);
    },
    selectChange(value) {
      if (!value) {
        this.$emit("input", '');
        return;
      }
      this.$emit("input", value);
    },
  },
};
</script>
<style scoped lang='scss'>
</style>
