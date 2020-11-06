<!--
 * @Author: your name
 * @Date: 2020-05-18 09:10:40
 * @LastEditTime: 2020-05-18 17:12:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /three-admin-ui/src/pages/riskWarning/components/searchHeader.vue
-->
<template>
  <div class="mainContent">
    <search-form>
      <ul slot="content">
        <li>
          <dl>
            <dt>业务类型：</dt>
            <dd>
              <h-select v-model="bizType" clearable filterable @on-change="bizTypeChange">
                <h-option
                  v-for="item in bizTypeList"
                  :value="item.entryValue"
                  :key="item.entryValue"
                >{{ item.entryName }}</h-option>
                <!-- <div slot="footer" class="selectFooter">
                  <h-button type="primary" size="small">确定</h-button>
                  <h-button type="ghost" size="small">取消</h-button>
                </div>-->
              </h-select>
            </dd>
          </dl>
        </li>
        <li class="row4"></li>
        <li v-if='selectList.length == 0'>
          <dl>
            <dt></dt>
            <dd>无法找到匹配的分组</dd>
          </dl>
        </li>
        <li v-for="(item, index) in selectList" :key="index">
          <dl>
            <dt>{{item.bizGroupName}}：</dt>
            <dd>
              <h-select
                :placeholder="`请选择${item.bizGroupName}`"
                filterable
                v-model="searchData[item.bizGroupCode]"
                multiple
                multClearable
                collapseTags
                autoPlacement
                widthAdaption
                showBottom
                isCheckall
              >
                <h-option
                  v-for="item in item.fieldInfoList"
                  :value="item.value"
                  :key="item.value"
                >
                {{item.label}}
                </h-option>
              </h-select>
              <!-- <h-simple-select
                :placeholder="`请选择${item.bizGroupName}`"
                filterable
                v-model="searchData[item.bizGroupCode]"
                multiple
                multClearable
                collapseTags
                autoPlacement
                widthAdaption
              >
                <h-select-block :data="item.fieldInfoList"></h-select-block>
              </h-simple-select> -->
            </dd>
          </dl>
        </li>
        <li class="search-wrapper-but">
          <slot></slot>
        </li>
      </ul>
    </search-form>
  </div>
</template>
<script>
import { getRowListFromBusinessCode, getBizTypeList } from "../api/apiManager";
export default {
  props: {},
  computed: {},
  data() {
    return {
      bizType: "2",
      bizTypeList: [],
      selectList: [],
      searchData: {},
      fieldCodeDict: {},
      filterSelectAllSecletDict: {}
    };
  },
  methods: {
    bizTypeChange() {
      let body = {
        bizType: this.bizType,
      };
      getRowListFromBusinessCode(body).then((data) => {
        let oData = data.bizGroupList || [];
        let fieldCodeDict = {};
        let renderHeader = [];
        this.selectList = oData || [];
        for (let i = 0; i < oData.length; i++) {
          let item = oData[i];
          let { fieldInfoList = [], bizGroupCode, bizGroupName } = item;
          let defaultSelect = [];
          for (let op of fieldInfoList) {
            op.label = op.fieldName
            op.value = op.fieldCode
            // if (op.required) {
            //   defaultSelect.push(op.fieldCode);
            //   renderHeader.push(op);
            // }
            fieldCodeDict[op.fieldCode] = op;
          }
          this.fieldCodeDict = fieldCodeDict;
          this.$set(this.searchData, bizGroupCode, defaultSelect);
        }
        this.$emit("renderHeader", renderHeader);
      });
    },
    getTypeList() {
      getBizTypeList().then((data) => {
        this.bizTypeList = data.dictList || [];
      });
    },
    getHeaderData() {
      let data = [];
      let searchData = this.searchData;
      for (let item of this.selectList) {
        let selectItem = searchData[item.bizGroupCode] || [];
        for (let _item of selectItem) {
          let {
            fieldId,
            bizType,
            fieldName,
            fieldCode,
            fieldType,
            startParam = "",
            endParam = "",
            length = 9999,
            defaultValue,
            required,
            bizGroupType,
            fieldRepRuleList,
          } = this.fieldCodeDict[_item] || {};
          data.push({
            fieldId:fieldId,
            bizType: bizType,
            fieldRepRuleList:fieldRepRuleList,
            fieldName: fieldName,
            fieldCode: fieldCode,
            fieldType: fieldType,
            startParam: startParam,
            endParam: endParam,
            length: length,
            defaultValue: defaultValue,
            required: required,
            bizGroupType: bizGroupType,
          });
        }
      }
      return data;
    },
    queryChange(query, bizGroupCode){
      if (query) {
        this.$set(this.filterSelectAllSecletDict, bizGroupCode, true)
      } else {
         this.$set(this.filterSelectAllSecletDict, bizGroupCode, false)
      }
    },
  },
  mounted() {
    this.getTypeList();
    this.bizTypeChange();
  },
};
</script>
<style lang="scss" scoped>
.mainContent /deep/ .innerContent {
  display: flex;
}
.selectFooter {
  align-self: center;
  display: flex;
  justify-content: space-between;
  padding: 10px;
}
</style>
