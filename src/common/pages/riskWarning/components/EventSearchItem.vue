<template>
  <div class="searchBox-div">
    <h-simple-select
      autoPlacement
      placeholder="添加标签"
      v-model="innerValue"
      :readonly="!editing"
      filterable
      @on-change="changeSelectFn"
      @on-scroll="scroll"
      clearable
      remote
      remoteIcon="search"
      :remote-method="remoteSearchLabel"
      :loading="loadingLabelTab"
      :loading-text="loadText"
    >
      <h-select-block :data="labelTableList"></h-select-block>
    </h-simple-select>
    <!-- <h-select
      :disabled="!editing"
      autoPlacement
      label-in-value
      placeholder="添加标签"
      v-model="innerValue"
      filterable
      @on-change="changeSelectFn"
      @on-scroll="scroll"
      clearable
      remote
      remoteIcon="search"
      :remote-method="remoteSearchLabel"
      :isComputed="isComputed"
      :loading="loadingLabelTab"
      :loading-text="loadText"
    >
      <h-option
        @on-keyup="enterOptions"
        v-for="(option ,i) in labelTableList"
        :value="option.value"
        :key="option.value"
      >{{ `${option.label}`}}</h-option>
    </h-select>-->
  </div>
</template>

<script>
export default {
  props: {
    categoryId: "", // 搜索标签分类id
    editing: false,
    tagName: String,
    tagId: String,
  },
  data() {
    return {
      innerValue: "",
      searchNameCopy: "",
      loadingLabelTab: false,
      loadText: "正在加载中",
      isComputed: false,
      isScrollStatus: false,
      labelTableList: [],
      labelTableListTemp: [],
      pagination: {
        current: 1,
        size: 50,
        total: 0,
      },
    };
  },
  methods: {
    scroll(isBottom) {
      let _this = this;
      if (isBottom <= 1) {
        this.isScrollStatus = true;

        setTimeout(() => {
          if (_this.labelTableListTemp.length > 0) {
            _this.isComputed = false;
            _this.pagination.current = _this.pagination.current + 1;
            _this.searchLabelTabList(this.searchNameCopy);
          } else {
            _this.isComputed = true;
            //this.isScrollStatus = false;
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
    changeSelectFn(value) {
      if (value) {
        this.labelTableList.forEach((item, i) => {
          if (item.business_id == value) {
            this.$emit("addLabelInfoFn", item); //添加标签
          }
        });
      }else{
         this.$emit("addLabelInfoFn", {}); //添加标签
      }
    },
    // enterOptions(value) {
    //   if (value) {
    //     this.labelTableList.forEach((item, i) => {
    //       if (item.business_id == value) {
    //         this.$emit("addLabelInfoFn", item); //添加标签
    //       }
    //     });
    //   } else if (this.labelTableList.length > 0) {
    //     let item = this.labelTableList[0];
    //     this.$emit("addLabelInfoFn", item);
    //   }
    // },

    searchLabelTabList(searchName) {
      let url = "/tagid/queryTagsByTagValueLikeList";
      this.$http
        .post(url, {
          page_size: this.pagination.size,
          page_num: this.pagination.current,
          tag_value: searchName,
          category_id_list: [this.categoryId],
        })
        .then((res) => {
          let obj = res.data.return_value || {};
          let _list = obj.records || [];
          for (let item of _list) {
            item.value = (item.business_id).toString();
            item.business_id = (item.business_id).toString();
            item.label = item.tag_value;
          }
          this.labelTableListTemp = _list;
          // this.labelTableListTemp = [...data.body.tag_objects] || [];
          if (this.isScrollStatus) {
            this.labelTableList = this.labelTableList.concat(
              this.labelTableListTemp
            );
          } else {
            this.labelTableList = JSON.parse(
              JSON.stringify(this.labelTableListTemp)
            );
          }
          this.loadingLabelTab = false;
        });
      // .catch(err => {
      //   this.$hLoading.error();
      //   this.loadingLabelTab = false;
      // });
    },
  },
  mounted() {
    // this.searchLabelTabList('')
  },
  watch: {
    tagName: {
      immediate: true,
      handler(value) {
        this.searchLabelTabList(value);
      },
    },
    tagId: {
      immediate: true,
      handler(value) {
        this.innerValue = value;
      },
    },
  },
};
</script>

<style lang='scss' scoped>
.searchBox-div {
  width: 100%!important;
  // min-width: 250px;
  // display: inline-block;
}
.searchLabelBox /deep/ input:disabled {
  color: #999;
}
</style>