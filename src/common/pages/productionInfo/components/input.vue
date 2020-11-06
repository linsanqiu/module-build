<template>
  <div :class="border?'inputBorder':'input'">
    <template v-if="type == 1">
      <h-input
        clearable
        :filterRE="/[^(^(\-)?\d+(\.\d+)$)]/g"
        :maxlength="getMaxLen"
        :disabled="disabled"
        v-model.trim="fieldValue"
        :placeholder="required ? '请输入数字（必填）' :'请输入数字'"
        @input="changeValue()"
      ></h-input>
    </template>
    <template v-else-if="type == 2">
      <h-input
        clearable
        :disabled="disabled"
        :maxlength="getMaxLen"
        v-model.trim="fieldValue"
        :placeholder="required ? '请输入文本（必填）' :'请输入文本'"
        @input="changeValue()"
        @on-blur="inputBlur"
      ></h-input>
    </template>
    <template v-else-if="type == 3">
      <h-date-picker
        autoPlacement
        clearOnIllegal
        editable
        transfer
        :disabled="disabled"
        :options="optionsDate"
        format="yyyy-MM-dd"
        :value="fieldValue"
        type="date"
        :placeholder="required ? '请选择日期（必填）' :'请选择日期'"
        @on-change="changeDate"
        @on-illegal-input="inputIllegalFn"
      ></h-date-picker>
    </template>
    <template v-else-if="type == 4">
      <h-typefield
        divided
        :disabled="disabled"
        suffixNum="10"
        notFillin
        :maxlength="getMaxLen"
        type="money"
        :placeholder="required ? '请输入金额（必填）' :'请输入金额'"
        v-model.trim="fieldValue"
        @input="changeValue()"
      ></h-typefield>
    </template>
    <template v-else-if="type == 5">
      <h-select
        filterable
        transfer
        autoPlacement
        :disabled="disabled"
        :placeholder="required ? '请选择（必填）' :'请选择'"
        v-model="fieldValue"
        @on-change="changeValue()"
        @on-keyup="onKeyUp"
      >
        <h-option
          v-for="(item, i) in select"
          :value="item.entryValue"
          :key="item.entryValue"
        >{{ item.entryName }}</h-option>
      </h-select>
    </template>
    <template v-else-if="type == 6">
      <h-simple-select
        :disabled="disabled"
        transfer
        remote
        filterable
        widthAdaption
        :isComputed="isComputed"
        :remote-method="changeQueryFn"
        :loading="loadingSelect"
        autoPlacement
        :placeholder="required ? '请选择（必填）' :'请输入'"
        :value="fieldValue"
        v-model="fieldValue"
        @on-change="changeSearch"
        @on-clear-select="clearSelect"
        @on-keyup="onKeyUp"
      >
        <h-select-block @on-scroll="scrollFn" :data="selectblock"></h-select-block>
      </h-simple-select>
    </template>
    <template v-else-if="type == 7">
      <h-input
        type="textarea"
        clearable
        :disabled="disabled"
        :maxlength="getMaxLen"
        v-model="fieldValue"
        :placeholder="required ? '请输入文本（必填）' :'请输入文本'"
        @input="changeValue()"
        @on-blur="inputBlur"
        :rows="4"
      ></h-input>
    </template>
    <template v-if="type == 8">
      <h-input
        type='int'
        clearable
        :maxlength="getMaxLen"
        :disabled="disabled"
        v-model.trim="fieldValue"
        :placeholder="required ? '请输入整数（必填）' :'请输入整数'"
        @input="changeValue()"
      ></h-input>
    </template>
    <template v-if="type == 9">
      <h-input
        type='text'
        clearable
        specialFilter
        :specialLength="getMaxLen"
        :disabled="disabled"
        v-model.trim="fieldValue"
        :placeholder="required ? '请输入数字（必填）' :'请输入数字'"
        @input="changeValue()"
      ></h-input>
    </template>
  </div>
</template>
<script>
import { searchProdList } from '../api/apiManager'
export default {
  props: {
    border: Boolean,
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
    maxLen: [String, Number],
    required: {
      type: Boolean,
      default: false,
    },
    value: String,
    repRules: Array,
  },
  data() {
    return {
      timer: null,
      fieldValue: this.value || '',
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
      monthDict: {
        十二: 12,
        十一: 11,
        十: 10,
        九: 9,
        八: 8,
        七: 7,
        六: 6,
        五: 5,
        四: 4,
        三: 3,
        二: 2,
        一: 1,
      },
      dayDict: {
        三十一: 31,
        三十: 30,
        二十九: 29,
        二十八: 28,
        二十七: 27,
        二十六: 26,
        二十五: 25,
        二十四: 24,
        二十三: 23,
        二十二: 22,
        二十一: 21,
        二十: 20,
        十九: 19,
        十八: 18,
        十七: 17,
        十六: 16,
        十五: 15,
        十四: 14,
        十三: 13,
        十二: 12,
        十一: 11,
        十: 10,
        九: 9,
        八: 8,
        七: 7,
        六: 6,
        五: 5,
        四: 4,
        三: 3,
        二: 2,
        一: 1,
      },
    };
  },
  computed: {
    getMaxLen() {
      if (this.maxLen) {
        return Number(this.maxLen);
      } else {
        return "";
      }
    },
  },
  watch: {
    value() {
      this.fieldValue = this.value;
    },
  },
  mounted() {
    if (this.selectDicCode) {
      this.selectWithOptions(this.fieldValue)
    }
  },
  methods: {
    inputIllegalFn(data) {
      /*将 M.d  M-d  MMDD 格式转化为合法日期*/
      let regNum = /^\d+$/;
      let len = data.length;
      // 单输入数字转日期
      if (len == 1 || len == 2) {
        if (regNum.test(data)) {
          if (data > 31) return;
          let defaultYear = new Date().getFullYear();
          let defaultMonth = new Date().getMonth() + 1;
          let defaultDate = data;
          defaultDate = this.fixNum(defaultDate, 2);
          this.fieldValue =
            defaultYear + "-" + defaultMonth + "-" + defaultDate;
          this.changeValue(this.fieldValue);
        }
        return;
      }
      // 五月二日这样的转年月日
      let newReg = /^(\D{1,2})月(\D{1,2})日$/;
      newReg.exec(data);
      let _month = RegExp.$1;
      let _day = RegExp.$2;
      if (_month && _day) {
        _month = this.monthDict[_month];
        _day = this.dayDict[_day];
        if (_month && _day) {
          let defaultYear = new Date().getFullYear();
          _month = this.fixNum(_month, 2);
          _day = this.fixNum(_day, 2);
          this.fieldValue = defaultYear + "-" + _month + "-" + _day;
          this.changeValue(this.fieldValue);
          return;
        }
      }
      //  9-5-3/9-0503/ 9/05/03  2000年开始算
      let suitList = data.split(/-|\//);
      if (suitList.length == 3) {
        let defaultYear = suitList[0];
        let defaultMonth = suitList[1];
        let defaultDate = suitList[2];
        if (
          !regNum.test(defaultYear) ||
          !regNum.test(defaultMonth) ||
          !regNum.test(defaultDate) ||
          (defaultMonth <= 12 && defaultDate <= 31)
        ) {
          defaultYear = parseInt(defaultYear) + 2000;
          defaultMonth = this.fixNum(defaultMonth, 2);
          defaultDate = this.fixNum(defaultDate, 2);
          this.fieldValue =
            defaultYear + "-" + defaultMonth + "-" + defaultDate;
          this.changeValue(this.fieldValue);
          return;
        }
      } else if (suitList.length == 2) {
        let defaultYear = suitList[0];
        if (suitList[1].length == 4) {
          let defaultMonth = suitList[1].substring(0, 2);
          let defaultDate = suitList[1].substring(2, 4);
          if (
            !regNum.test(defaultYear) ||
            !regNum.test(defaultMonth) ||
            !regNum.test(defaultDate) ||
            (defaultMonth <= 12 && defaultDate <= 31)
          ) {
            defaultYear = parseInt(defaultYear) + 2000;
            defaultMonth = this.fixNum(defaultMonth, 2);
            defaultDate = this.fixNum(defaultDate, 2);
            this.fieldValue =
              defaultYear + "-" + defaultMonth + "-" + defaultDate;
            this.changeValue(this.fieldValue);
            return;

          }
        }
      }

      if (len >= 3 && len <= 5) {
        let defaultYear = new Date().getFullYear();
        let defaultMonth = "",
          defaultDate = "";
        let arr = [];
        if (data.indexOf("-") > 0) {
          arr = data.split("-");
        } else if (data.indexOf(".") > 0) {
          arr = data.split(".");
        } else if (data.indexOf("/") > 0) {
          arr = data.split("/");
        } else {
          arr[0] = data.substring(0, 2);
          arr[1] = data.substring(2, 4);
        }
        if (
          !regNum.test(arr[0]) ||
          !regNum.test(arr[1]) ||
          arr[0] == "0" ||
          arr[0] == "00" ||
          arr[0] > 12 ||
          arr[1] == "0" ||
          arr[1] == "00" ||
          arr[1] > 31
        ) {
          return;
        }
        defaultMonth =
          arr[0] <= 9 && arr[0] > 0 && arr[0].length == 1
            ? "0" + arr[0]
            : arr[0];
        defaultDate =
          arr[1] <= 9 && arr[1] > 0 && arr[1].length == 1
            ? "0" + arr[1]
            : arr[1];
        this.fieldValue = defaultYear + "-" + defaultMonth + "-" + defaultDate;
        this.changeValue(this.fieldValue);
      }
    },
    fixNum(num, n) {
      return (Array(n).join(0) + num).slice(-n);
    },
    changeDate(data) {
      this.changeValue(data);
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
        this.selectWithOptions(query)
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
            this.selectWithOptions(this.search)
          } else {
            this.isComputed = true;
          }
        }, 200);
      }
    },
    selectWithOptions(query){
      if (this.selectCode == 'LCCPINBBM'){
        let options = {
          nameKey: ['productInnerCode', 'productCode', 'productName'],
          valueKey: 'productInnerCode',
          action: '/hos-api/pic/product/queryLike'
        }
        this.querySelectFromEs(query, options)
      }else if (this.selectCode == 'JYDS' || this.selectCode == 'TZGW') {
        let options = {
          nameKey: ['companyCode', 'companyName'],
          valueKey: 'companyCode',
          action: '/hos-api/pic/counterparty/queryLike'
        }
        this.querySelectFromEs(query, options)
      }else{
        this.querySelectList(query);
      }
    },
    querySelectList(query) {
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
        }).catch((err) => {
          this.$hLoading.error();
          this.loadingSelect = false;
        });
    },
    querySelectFromEs(query, options){
      let {nameKey, valueKey , action} = options
      let body = {
        pageSize: this.pagination.size,
        pageNum: this.pagination.current,
        keyword: query,
      }
      this.$http.post(action, body).then(
        res => {
          if (this.$api.SUCCESS == res.data.status){
            let data = res.data.data
            let dataList = [...data.records] || []
            for (let item of dataList){
              let nameList = []
              for (let _nameItem of nameKey){
                if (item[_nameItem]){
                  nameList.push(item[_nameItem])
                }
              }
              item.label = nameList.join('-')
              item.value = (item[valueKey] || '').toString()
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
          }else{
            this.$hLoading.error();
            this.loadingSelect = false;
          }
        }
      )
      .catch((err) => {
        this.$hLoading.error();
        this.loadingSelect = false;
      });
    },
    changeSearch(value){
      this.fieldValue = value
      this.changeValue()
    },
    // 清除选项
    clearSelect (value) {
      this.$emit("clear", value);
    },
    changeValue(value = false) {
      if (value !== false) {
        this.$emit("input", value);
      } else {
        this.$emit("input", this.fieldValue);
      }
    },
    onKeyUp(value, event) {
      let keyCode = event.keyCode;
      if (keyCode == 8) {
        this.fieldValue = "";
        this.$emit("input", "");
      }
    },
    inputBlur() {
      let fieldValue = this.fieldValue;
      fieldValue = this.ToDBC(fieldValue);
      fieldValue = fieldValue.replace(/[^\S\n]/g, "");
      let repRules = this.repRules || []
      for (let reRule of repRules){
        let {oldStr, newStr} = reRule
        fieldValue = fieldValue.replace(new RegExp(oldStr,'g'), newStr)
      }
      if (this.type == 7){
        fieldValue.replace(/\t/, "")
        fieldValue = "\t" + fieldValue
      }
      this.fieldValue = fieldValue;
      this.$emit("input", fieldValue);
    },
    ToDBC(txtstring) {
      var tmp = "";
      for (var i = 0; i < txtstring.length; i++) {
        let code = txtstring.charCodeAt(i);
        if ((code > 33 && code < 48) || (code > 57 && code < 65)) {
          tmp = tmp + String.fromCharCode(txtstring.charCodeAt(i) + 65248);
        } else {
          tmp += String.fromCharCode(txtstring.charCodeAt(i));
        }
      }
      return tmp;
    },
  },
};
</script>
<style scoped>
.input >>> .h-input-wrapper .h-input,
.input >>> .h-typefield .h-typefield-left,
.input >>> .h-select-single .h-select-selection {
  border: none;
}
.input >>> .h-selectTable-selection {
  border: none;
}
.input >>> .h-input-number {
  width: 100%;
}
.inputBorder >>> .h-input-number {
  width: 100%;
}
/* .inputBorder >>> textarea{
  text-indent:2em;
}
.input >>> textarea{
  text-indent:2em;
} */
</style>
