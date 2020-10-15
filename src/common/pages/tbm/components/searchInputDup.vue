<template>
  <div>
    <h-select
      autoPlacement
      placeholder="请选择"
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
        v-for="(option ,i) in labelTableList"
        :value="option.tag_id"
        :key="option.tag_id"
      >{{option.groupInfo}}</h-option>
    </h-select>
  </div>
</template>

<script>
export default {
  props: {
    categoryId: "", // 搜索标签分类id
  },
  data() {
    return {
      timer: '',
      searchName: "",
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
      like_query: 0,
      like_start_page: 0,
      add_like_count: 0,
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
            _this.searchLabelTabList(this.searchName);
          } else {
            _this.isComputed = true;
            //this.isScrollStatus = false;
          }
        }, 200);
      }
    },
    remoteSearchLabel(query) {
      if (query !== "") {
        this.isComputed = false;
        this.isScrollStatus = false;
        this.loadingLabelTab = true;
        this.pagination.current = 1;
        if (this.timer){
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.searchName = query;
          this.searchLabelTabList(query);
        }, 200);
      } else {
        let _list =  [...this.labelTableListTemp]
        let result = [];
        let listDict = {};
        for (var i = 0; i < _list.length; i++) {
          let item = _list[i];
          let tag_id = item.tag_id;
          if (!listDict[tag_id]) {
            listDict[tag_id] = true;
            result.push(item);
          }
        }
        this.labelTableList = result;
        this.initLike();
      }
    },
    initLike() {
      this.like_query = 0;
      this.like_start_page = 0;
      this.add_like_count = 0;
    },
    changeSelectFn(value) {
      this.$emit('input', value)
    },
    searchLabelTabList(searchName) {
      let url = "/tm/queryTagsByTagValueLikePost";
      if (!this.isScrollStatus) {
        this.initLike();
      }
      if (this.categoryId == '101109' || this.categoryId == '101102'){
        this.pagination.size = 20
      }
      this.$http
        .post(url, {
          pageSize: this.pagination.size,
          pageNum: this.pagination.current,
          tagValue: searchName,
          categoryId: this.categoryId,
          like_query: this.like_query,
          like_start_page: this.like_start_page,
          add_like_count: this.add_like_count,
        })
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            let {
              like_query,
              like_start_page,
              add_like_count,
              tag_objects = [],
            } = data.body;
            this.labelTableListTemp = [...tag_objects] || [];
            let labelTableList = [];
            if (this.isScrollStatus) {
              labelTableList = this.labelTableList.concat(
                this.labelTableListTemp
              );
            } else {
              labelTableList = JSON.parse(
                JSON.stringify(this.labelTableListTemp)
              );
            }
            this.like_query = like_query;
            this.like_start_page = like_start_page;
            this.add_like_count = add_like_count;
            let result = [];
            let listDict = {};
            for (var i = 0; i < labelTableList.length; i++) {
              let item = labelTableList[i];
              let tag_id = item.tag_id;
              if (!listDict[tag_id]) {
                listDict[tag_id] = true;
                result.push(item);
              }
            }
            this.labelTableList = result;
          } else {
            this.$hMessage.error({ content: data.msg });
          }
          this.loadingLabelTab = false;
        })
        .catch((err) => {
          this.$hLoading.error();
          this.loadingLabelTab = false;
        });
    },
  },
  mounted() {
  },
};
</script>

<style>
</style>