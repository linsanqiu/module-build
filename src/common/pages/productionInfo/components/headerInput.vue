<template>
  <div class="input">
    <template v-if="type == 1">
      <!-- <span>数值范围：</span> -->
      <h-input
        clearable
        :filterRE="/[^(^(\-)?\d+(\.\d+)$)]/g"
        :disabled="disabled"
        @input="changeValue($event,1)"
        placeholder="请输入"
      ></h-input>
        <span class="mark">-</span>
        <h-input
        clearable
        :filterRE="/[^(^(\-)?\d+(\.\d+)$)]/g"
        :disabled="disabled"
        @input="changeValue($event, 2)"
        placeholder="请输入"
      ></h-input>
    </template>
    <template v-else-if="type == 2">
      <h-input
        clearable
        :disabled="disabled"
        placeholder="请输入"
        @input="changeValue($event, 1)"
      ></h-input>
    </template>
    <template v-else-if="type == 3">
        <!-- <span>日期范围</span> -->
        <h-date-picker
            transfer
            :disabled="disabled"
            autoPlacement
            :options="optionsDate"
            type="daterange"
            format="yyyy-MM-dd"
            aria-placeholder="发布时间"
            placeholder="请选择日期范围"
            @on-change="changeValue($event, 3)"
        ></h-date-picker>
    </template>
    <template v-else-if="type == 4">
      <h-typefield
        divided
        :disabled="disabled"
        suffixNum="10"
        notFillin
        type="money"
        @input="changeValue($event, 1)"
        placeholder="请输入"
      ></h-typefield>
      <span class="mark">-</span>
      <h-typefield
        divided
        :disabled="disabled"
        suffixNum="10"
        notFillin
        type="money"
        @input="changeValue($event, 2)"
        placeholder="请输入"
      ></h-typefield>
    </template>
    <template v-else-if="type == 5">
      <h-select
        v-model='selectValue'
        filterable
        transfer
        multClearable
        autoPlacement
        :disabled="disabled"
        placeholder="请选择"
        @on-change="changeValue($event, 4)"
        multiple
        collapseTags
        widthAdaption
      >
        <h-option
          v-for="(item, i) in select"
          :value="item.entryValue"
          :key="item.entryValue"
        >{{ item.entryName }}</h-option>
      </h-select>
    </template>
    <template v-else-if="type == 6">
       <h-select
        v-model='selectValue'
        :disabled="disabled"
        transfer
        remote
        :isComputed="isComputed"
        :remote-method="changeQueryFn"
        :loading="loadingSelect"
        autoPlacement
        placeholder="请搜索字段内容"
        @on-change="changeValue($event, 4)"
        multiple
        @on-scroll="scrollFn"
        collapseTags
        multClearable
        filterable
        widthAdaption
      >
        <h-option
            v-for="(item, i) in selectblock"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}
        </h-option>
       </h-select>
    </template>
    <template v-else-if="type == 7">
      <h-input
        type="textarea"
        clearable
        :disabled="disabled"
        :placeholder="required ? '请输入文本（必填）' :'请输入文本'"
        @input="changeValue($event, 1)"
      ></h-input>
    </template>
    <template v-if="type == 8 || type == 9">
      <!-- <span>数值范围：</span> -->
        <h-input
          type='int'
          clearable
          :disabled="disabled"
          @input="changeValue($event,1)"
          placeholder="请输入"
        ></h-input>
        <span class="mark">-</span>
        <h-input
          type='int'
          clearable
          :disabled="disabled"
          @input="changeValue($event, 2)"
          placeholder="请输入"
      ></h-input>
    </template>
  </div>
</template>
<script>
import { searchProdList } from '../api/apiManager'
export default {
  props: {
    // 1数字，2文本，3日期，4金额, 5下拉框
    type: {
      type: [String, Number],
      default: "1",
    },
    select: Array,
    selectCode: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      timer: null,
      optionsDate: {
        disabledDate(date) {},
      },
      /*搜索常量*/
      selectDicCode: this.selectCode,
      search: "",
      loadingSelect: false,
      isScrollStatus: false,
      isComputed: false,
      selectblock: [],
      selectblockTemp: [],
      pagination: {
        current: 1,
        size: 10,
        total: 0,
      },
      selectValue: []
    };
  },
  computed: {

  },
  watch: {
  },
  mounted() {
    // if (this.selectDicCode) {
    //   if (this.selectCode == 'LCCPINBBM'){
    //     this.querySelectFromEs()
    //   }else{
    //     this.querySelectList();
    //   }
    // }
  },
  methods: {
    fixNum(num, n) {
      return (Array(n).join(0) + num).slice(-n);
    },
    changeQueryFn(query) {
      this.loadingSelect = true;
      this.isComputed = false;
      this.isScrollStatus = false;
      this.pagination.current = 1;
      this.search = query;
      let timer = this.timer;
      if (timer) {
        clearTimeout(timer);
      }
      this.timer = setTimeout(() => {
        if (this.selectCode == 'LCCPINBBM'){
          this.querySelectFromEs(query)
        }else{
          this.querySelectList(query);
        }
      }, 200);
    },
    scrollFn(isBottom) {
      if (isBottom <= 1) {
        this.isScrollStatus = true;
        setTimeout(() => {
          if (
            this.pagination.size * this.pagination.current <
            this.pagination.total
          ) {
            this.isComputed = false;
            this.pagination.current = this.pagination.current + 1;
            if (this.selectCode == 'LCCPINBBM'){
              this.querySelectFromEs(this.search)
            }else{
              this.querySelectList(this.search);
            }
          } else {
            this.isComputed = true;
          }
        }, 200);
      }
    },
    querySelectList(query) {
      if(!query){
        this.loadingSelect = false;
        return
      }
      let url = "/pic/audit/anncData/getPicCategory";
      this.$http
        .post(url, {
          pageSize: this.pagination.size,
          currentPage: this.pagination.current,
          businessName: query,
          type: this.selectCode,
        })
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            this.selectblockTemp = [...data.body.dataList] || [];
            this.pagination.total = data.body.totalSize;
            if (this.isScrollStatus) {
              this.selectblock = this.selectblock.concat(this.selectblockTemp);
            } else {
              this.selectblock = JSON.parse(
                JSON.stringify(this.selectblockTemp)
              );
            }
          } else {
            this.$hMessage.error({ content: data.msg });
          }
          this.loadingSelect = false;
        })
        .catch((err) => {
          this.$hLoading.error();
          this.loadingSelect = false;
        });
    },
    querySelectFromEs(query){
      if(!query){
        this.loadingSelect = false;
        return
      }
      let body = {
        pageSize: this.pagination.size,
        pageNum: this.pagination.current,
        keyword: query,
      }
      searchProdList(body)
        .then((data) => {
          let dataList = [...data.records] || []
          for (let item of dataList){
            let {productInnerCode, productCode, productName} = item
            if(!productCode){
              item.label = `${productInnerCode}-${productName}`
            }else{
              item.label = `${productInnerCode}-${productCode}-${productName}`
            }
            item.value = productInnerCode.toString()
          }
          this.selectblockTemp = dataList;
          this.pagination.total = data.pages;
          if (this.isScrollStatus) {
            this.selectblock = this.selectblock.concat(this.selectblockTemp);
          } else {
            this.selectblock = JSON.parse(
              JSON.stringify(this.selectblockTemp)
            );
          }
          this.loadingSelect = false;
        })
        .catch((err) => {
          this.$hLoading.error();
          this.loadingSelect = false;
        });
    },
    changeValue(value = false, index) {
      let data = {
        value: value,
        index: index
      }
      // 多选优化
      this.$emit('valueChange', data)
    },
  },
};
</script>
<style scoped>
.input{
    display: flex;
    align-items: center;
    margin-top: 5px;
    width: 100%;
}
.mark{
    margin-left: 2px;
    margin-right: 2px;
}
.input >>> .h-input-number {
  width: 100%;
}
</style>
