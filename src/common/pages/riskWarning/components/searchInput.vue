<template>
  <h-simple-select
    class="searchSelect"
    :placeholder="placeholder"
    :loading-text="loadingText"
    :loading="searchLoading"
    :remote-method="remoteMethod"
    remote
    filterable
    @on-change="selectChange"
    :disabled="disabled"
    :value="nowItem[valueKey]"
    label-in-value
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
    changeValueKey:{
      type: String,
      defalut() {
        return "";
      },
    },
    showKeyLabelKeyList: {
      type: Array,
      defalut() {
        return [];
      },
    },
    valueKey: {
      type: String,
      defalut() {
        return "";
      },
    },
    nameKey: {
      type: String,
      defalut() {
        return "";
      },
    },
    specKey: {
      type: String,
      defalut() {
        return "";
      },
    },
    value: {
      type: Object,
      defalut() {
        return {};
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
      nowItem: {},
      selectChangeing: false
    };
  },
  watch: {
    value: {
      handler(value={}, oldValue = {}) {
        let nValue = value[this.valueKey];
        let oValue = oldValue[this.valueKey];
        // if (!nValue){
        //   this.nowItem = {
        //     [this.valueKey]: "",
        //     [this.nameKey]: "",
        //   }
        //   return
        // }
        if (nValue == oValue) {
          return;
        }
        let obj = {
          [this.valueKey]: value[this.valueKey] || '',
          [this.nameKey]: value[this.nameKey] || '',
        }
        if (this.changeValueKey){
          obj[this.changeValueKey] = value[this.changeValueKey] || ''
        }
        this.nowItem = obj
        if (this.selectChangeing){
          this.selectChangeing = false
          return
        }else{
          this.remoteMethod(nValue);
          this.selectChangeing = false
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    // this.remoteMethod(this.value[this.nameKey]);
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
          let codeShow = this.showKeyLabelKeyList[2] || '';
          for (let item of dataList) {
            if (codeShow){
              item.label = `${item[valueShow]}-${item[nameShow]}-${item[codeShow]}`;
            }else{
              item.label = `${item[valueShow]}-${item[nameShow]}`;
            }
            item.value = item[valueShow];
            if (this.changeValueKey){
              item.value = item[this.changeValueKey].toString()
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
            if (dataList.length == 0){
              this.nowItem = {
                [this.valueKey]: "",
                [this.nameKey]: "",
              }
            }
          }
          this.dataList = totalList;
        });
      }, 100);
    },
    selectChange(obj) {
      let { value, label } = obj;
      if (!value || !label) {
        let _obj = {
          [this.valueKey]: "",
          [this.nameKey]: "",
        };
        if (this.changeValueKey){
          _obj[this.changeValueKey] = ""
        }
        this.$emit("input", _obj);
        this.$emit("selectChange", _obj);
        return;
      } else if (value == label) {
        return;
      }
      let nowItem = {}
      for (let i = 0; i < this.dataList.length;i++){
        if (this.dataList[i].value == value){
          nowItem = this.dataList[i]
          break
        }
      }
      let name = nowItem[this.showKeyLabelKeyList[1]] || label.split("-")[1];
      let newObj = {
        [this.valueKey]: value,
        [this.nameKey]: name,
      };
      if (this.changeValueKey){
        newObj[this.changeValueKey] = value
      }
      if (this.specKey){
        newObj[this.specKey] = nowItem[this.specKey] || label.split("-")[2];
      }
      this.selectChangeing = true
      this.$emit("input", newObj);
      this.$emit("selectChange", newObj);
    },
  },
};
</script>
<style scoped lang='scss'>
.searchSelect /deep/ input:disabled {
  color: #999;
}
</style>
