<template>
  <div>
    <h-simple-select
      v-model="value"
      remote
      filterable
      :loading="isLoading"
      :remote-method="remoteMethod"
      @on-change="valueChange"
      clearable
      :placeholder='placeholder'
      searchIcon="search"
    >
      <h-select-block :data="remoteData" @on-scroll='scrollData'></h-select-block>
    </h-simple-select>
  </div>
</template>
<script>
import { getSearchData } from '../api/apiManager'
export default {
  props: {
      type: String,
      placeholder: String,
      valueKey: String
  },
  data() {
    return {
      value: "",
      isLoading: false,
      remoteData: [],
      timer: null,
      pageSize: 50,
      currentPage: 1,
      scrollQuery: '',
      hasNoData: false
    };
  },
  methods: {
    scrollData(isBottom){
      if (isBottom <= 1 && !this.hasNoData) {
        this.currentPage = this.currentPage + 1
        this.remoteMethod(this.scrollQuery, true)
      }
    },
    valueChange(value){
      this.$emit('input', value)
    },
    remoteMethod(query, scroll=false) {
      this.scrollQuery = query
      if (query !== "") {
        if (this.isLoading && scroll){
          return
        }
        if (!scroll){
          this.currentPage = 1;
          this.hasNoData = false
        }
        this.isLoading = true;
        if (this.timer){
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
            let body = {
              [this.type]: query,
              pageSize: this.pageSize,
              currentPage: this.currentPage
            }
            getSearchData(body).then(
                data => {
                    this.isLoading = false;
                    let records = data.records
                    for (let item of records){
                      item.label = item[this.type],
                      item.value = this.valueKey?item[this.valueKey]: item[this.type]
                    }
                    let totalList = this.remoteData
                    if (data.pages <= this.currentPage){
                        this.hasNoData = true
                    }
                    if(scroll){
                      totalList = totalList.concat(records)
                    }else{
                      totalList = records
                    }
                    this.remoteData = totalList
                }
            )
            .catch(
                error => {
                    this.isLoading = false;
                    this.$hMessage.error(error.content)
                }
            )
        }, 200);
      } else {
        // this.remoteData = [];
      }
    },
  },
};
</script>
<style scoped lang='scss'>
</style>>