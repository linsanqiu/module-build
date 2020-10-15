<template>
  <h-simple-select
    :placeholder="placeholder"
    :loading-text="loadingText"
    :loading="searchLoading"
    :remote-method="remoteMethod"
    remote
    @on-change="selectChange"
    :value="innerValue"
    filterable
    searchIcon="search"
    widthAdaption
    autoPlacement
    :label-in-value="modelLabel"
  >
    <h-select-block :data="dataList" @on-scroll="scrollData"></h-select-block>
  </h-simple-select>
</template>
<script>
export default {
  props: {
    modelLabel: {
      type: Boolean,
      defalut() {
        return false;
      },
    },
    nameShow: {
      type: String,
      defalut() {
        return '';
      },
    },
    valueShow: {
      type: String,
      defalut() {
        return '';
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
      innerValue: '',
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
    value: {
      handler(value) {
        this.innerValue = value
      },
    },
  },
  mounted() {},
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
          dicKey: "",
          dicValue: query,
          current: this.pageNum,
          size: this.pageSize,
        };
        this.$http.post(this.action, body).then((res) => {
          let data = res.data.body.resPonsePage || {};
          this.searchLoading = false;
          let dataList = data.records || [];
          for (let item of dataList) {
            item.value = item[this.valueShow];
            item.label = item[this.nameShow];
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
        this.$emit("input", "");
        return;
      }
      this.$emit('selectChange', value)
      if (this.modelLabel) {
        this.$emit("input", value.label);
      } else {
        this.$emit("input", value);
      }
    },
  },
};
</script>
<style scoped lang='scss'>
</style>
