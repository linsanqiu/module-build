<template>
  <div class="searchLevelBox">
    <h-simple-select
      v-model="keyWords"
      autoPlacement
      filterable
      clearable
      remote
      :placeholder="placeholderText"
      :remote-method="remoteSearchLabel"
      :loading="loadingLabelTab"
      :loading-text="loadText"
      :isComputed="isComputed"
      @on-change="changeSelectFn"
      searchIcon='search'
    >
      <h-select-block @on-scroll="scroll" :data="labelTableList"></h-select-block>
    </h-simple-select>
  </div>
</template>

<script>
export default {
  props: {
    placeholderText: "",
    searchUrl: "",
  },
  data() {
    return {
      isScrollStatus: false,
      isComputed: false,
      searchNameCopy: "",
      keyWords: "",
      loadingLabelTab: false,
      loadText: "加载中",
      labelTableList: [],
      labelTableListTemp: [],
      pagination: {
        current: 1,
        size: 100,
        total: 0
      }
    };
  },
  methods: {
    scroll(isBottom) {
      let _this = this;
      if (isBottom <= 1) {
        this.isScrollStatus = true;
        setTimeout(() => {
          if (
            this.pagination.size * this.pagination.current <
            this.pagination.total
          ) {
            _this.isComputed = false;
            _this.pagination.current = _this.pagination.current + 1;
            _this.searchLabelTabList(this.searchNameCopy);
          } else {
            _this.isComputed = true;
          }
        }, 20);
      }
    },
    remoteSearchLabel(query) {
      if (query !== "") {
        this.isComputed = false;
        this.isScrollStatus = false;
        this.loadingLabelTab = true;
        this.pagination.current = 1;
        setTimeout(() => {
          this.searchNameCopy = query;
          this.searchLabelTabList(query);
        }, 100);
      } else {
        this.labelTableList = [...this.labelTableListTemp];
      }
    },
    changeSelectFn(values) {
      this.$emit("changeSelectValue", values);
    },
    searchLabelTabList(query) {
      let url = this.searchUrl;
      let params = {
        dsSourceName: query,
        dsSourceType: 0,
        current: this.pagination.current,
        size: this.pagination.size
      };
      this.$http
        .post(url, params)
        .then(res => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            this.pagination.total = data.body.total;
            let records = data.body.records || []
            for (let item of records){
              item.label = item.dsSourceName
              item.value = item.dsSourceType
            }
            this.labelTableListTemp = records || [];
            if (this.isScrollStatus) {
              this.labelTableList = this.labelTableList.concat(
                this.labelTableListTemp
              );
            } else {
              this.labelTableList = JSON.parse(
                JSON.stringify(this.labelTableListTemp)
              );
            }
          } else {
            this.$hMessage.error({ content: data.msg });
          }
          this.loadingLabelTab = false;
        })
        .catch(err => {
          this.$hLoading.error();
          this.loadingLabelTab = false;
        });
    }
  },
  watch: {
    modelValue: {
      handler(newValue) {
        this.keyWords = newValue;
      },
      immediate: true
    }
  },
  mounted() {
    // this.searchLabelTabList("");
  }
};
</script>

<style scoped>
.searchLevelBox {
  width: 100%;
  display: inline-block;
}
</style>