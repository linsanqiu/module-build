<template>
  <div class="mainContent">
    <search-form>
      <ul slot="content">
        <li>
          <dl>
            <dt>数据源编码：</dt>
            <dd>
              <SearchSelect placeholder="请输入数据源编码" v-model="searchData.dsCode" type='dsCode'></SearchSelect>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>媒体栏目：</dt>
            <dd>
              <SearchSelect placeholder="请输入媒体栏目" v-model="searchData.dsNewsColumns" type='dsNewsColumns'></SearchSelect>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>信息来源：</dt>
            <dd>
              <SearchSelect placeholder="请输入信息来源" v-model="searchData.dsSourceType" type='dsSourceName' valueKey='dsSourceType'></SearchSelect>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>所属项目：</dt>
            <dd>
              <h-simple-select
                placeholder="请选择所属项目"
                v-model="searchData.appId"
                clearable
                filterable
              >
                <h-select-block :data="appIdList"></h-select-block>
              </h-simple-select>
            </dd>
          </dl>
        </li>
        <li class="search-wrapper-but">
          <h-button type="primary" @click="onSearch">查询</h-button>
        </li>
      </ul>
    </search-form>

    <div>
      <h-edit-gird
        v-if='optionNum < 8 || tableLoading'
        class="full-max-height-table"
        :maxHeight="maxTableHeight"
        stripe
        border
        :columns="tableColum"
        size="small"
        :loading="tableLoading"
      ></h-edit-gird>
      <h-edit-gird
        v-if='optionNum >= 8 && !tableLoading'
        ref="editTable"
        class="full-max-height-table"
        :maxHeight="maxTableHeight"
        stripe
        border
        :columns="tableColum"
        :data="dataList"
        size="small"
        :loading="tableLoading"
        :option="tableOptions"
        @on-editselect-change="selectChange"
        :multiLevel="multiLevel"
      ></h-edit-gird>
      <h-page
        highlight-row
        size="small"
        class="page-box"
        :total="pagination.total"
        :current="pagination.currentPage"
        :page-size="pagination.pageSize"
        @on-change="onPageChange"
        @on-page-size-change="onChangePageSize"
        :page-size-opts="pageSizeOpts"
        show-elevator
        show-total
        show-sizer
        placement="top"
      ></h-page>
    </div>
  </div>
</template>
<script>
import {
  getInfos,
  getNewsType,
  modifyInfo,
} from "./api/apiManager";
import SearchSelect from "../components/searchSelect";
import { copyDeep } from '@/filters/index'
export default {
  components: { SearchSelect },
  data() {
    return {
      tableLoading: false,
      searchData: {
        dsCode: "",
        dsSourceCode: "",
        dsSourceName: "",
        dsNewsColumns: "",
        appId: "",
      },
      tableOptions: [],
      pageSizeOpts: [10, 20, 50],
      multiLevel: [
        {
          title: "",
          cols: 1,
          rows: 0,
          align: "center",
        },
        {
          title: "数据源基础信息",
          cols: 4,
          rows: 0,
          align: "center",
        },
        {
          title: "规则匹配",
          cols: 8,
          rows: 0,
          align: "center",
        },
      ],
      tableColum: [
        {
          key: "dsCode",
          title: "数据源编码",
          width: 100,
          viewValue: true,
        },

        {
          key: "dsSourceType",
          title: "信息来源类型（编码）",
          width: 180,
          viewValue: true,
        },
        {
          key: "dsSourceName",
          title: "信息来源名称",
          viewValue: true,
          width: 150
        },
        {
          key: "dsNewsColumns",
          title: "媒体栏目",
          viewValue: true,
          width: 200,
          ellipsis: true,
          render: (h, params) => {
            // jsx语法
            return (
              <span title={params.row.dsNewsColumns}>{params.row.dsNewsColumns}</span>
            );
          },
        },
        {
          key: "appNames",
          title: "所属项目",
          viewValue: true,
          width: 200,
          ellipsis: true,
          render: (h, params) => {
            // jsx语法
            return (
              <span title={params.row.appNames}>{params.row.appNames}</span>
            );
          },
        },
        {
          key: "ranges",
          title: "范围",
          width: 150,
          transfer: true,
          type: "select",
          multiple: true,
          option: [],
          filterMultiple: true,
          ellipsis: true,
        },
        {
          key: "rangePlus",
          title: "范围细分",
          width: 150,
          transfer: true,
          multiple: false,
          type: "select",
          singleShowLabel: true,
          option: [],
          filterable: true
        },
        {
          key: "financial",
          title: "金融市场",
          width: 150,
          transfer: true,
          multiple: false,
          type: "select",
          singleShowLabel: true,
          option: [],
          filterable: true
        },
        {
          key: "financialPlus",
          title: "金融市场细分",
          width: 150,
          transfer: true,
          multiple: false,
          type: "select",
          singleShowLabel: true,
          option: [],
          filterable: true
        },
        {

          // key: "ranges",
          // title: "范围",
          // width: 150,
          // transfer: true,
          // type: "select",
          // multiple: true,
          // option: [],
          // filterMultiple: true


          key: "infoAreas",
          title: "信息地域",
          width: 150,
          transfer: true,
          multiple: true,
          type: "select",
          option: [],
          filterMultiple: true,
          ellipsis: true,
        },
        {
          key: "infoLevel",
          title: "信息级别",
          width: 150,
          transfer: true,
          multiple: false,
          type: "select",
          option: [],
          filterable: true,
          singleShowLabel: true,
        },
         {
          key: "tradingMarket",
          title: "交易场所",
          width: 150,
          transfer: true,
          multiple: false,
          type: "select",
          singleShowLabel: true,
          option: [],
          filterable: true
        },
         {
          key: "form",
          title: "形态",
          width: 150,
          transfer: true,
          multiple: false,
          type: "select",
          singleShowLabel: true,
          option: [],
          filterable: true
        },
      ],
      dataList: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 1,
      },
      appIdList: [],
      keyList: [
        {
          key: "APP_ID",
          keyIndex: -1,
        },
        {
          key: "RANGE",
          keyIndex: 5,
        },
        {
          key: "RANGE_PLUS",
          keyIndex: 6,
        },
        {
          key: "FINANCIAL",
          keyIndex: 7,
        },
        {
          key: "FINANCIAL_PLUS",
          keyIndex: 8,
        },
        {
          key: "INFO_AREA",
          keyIndex: 9,
        },
        {
          key: "INFO_LEVEL",
          keyIndex: 10,
        },
        {
          key: "TRADING_MARKET",
          keyIndex: 11,
        },
        {
          key: "FORM",
          keyIndex: 12,
        },
      ],
      indexDict: {
        5: 'ranges',
        6: 'rangePlus',
        7: 'financial',
        8: 'financialPlus',
        9: 'infoAreas',
        10: 'infoLevel',
        11: 'tradingMarket',
        12: 'form',

      },
      optionNum: 0,
    };
  },
  computed: {
    maxTableHeight() {
      return this.$store.state.maxTableHeight;
    },
  },
  mounted() {
    for (let i = 0; i < this.keyList.length; i++) {
      let item = this.keyList[i];
      this.getOptionList(item);
    }
    this.getList();
  },
  methods: {
    getList() {
      this.tableLoading = true;
      let body = {
        ...this.searchData,
        currentPage: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      getInfos(body)
        .then((data) => {
          this.tableLoading = false;
          this.pagination.total = data.total;
          let records = data.records || []
          for (let item of records){
            let ranges = item.ranges || []
            item.ranges = ranges.join(',')
            let infoAreas = item.infoAreas || []
            item.infoAreas = infoAreas.join(',')
            item.rangePlus = (item.rangePlus || '').toString()
            item.dsSourceType = (item.dsSourceType || '').toString()
            item.financial = (item.financial || '').toString()
            item.financialPlus = (item.financialPlus || '').toString()
            item.form = (item.form || '').toString()
            item.tradingMarket = (item.tradingMarket || '').toString()
            
          }
          this.dataList = records;
        })
        .catch((error) => {
          this.tableLoading = false;
          this.hMessage.error(error.content);
        });
    },
    onSearch() {
      this.pagination.currentPage = 1;
      this.getList();
    },
    /*分页*/
    onPageChange(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getList();
    },
    onChangePageSize(pageSize) {
      this.pagination.currentPage = 1;
      this.pagination.pageSize = pageSize;
      this.getList();
    },
    getOptionList(itemValue) {
      let { key, keyIndex } = itemValue;
      let params = {
        type: key,
      };
      getNewsType(params).then((data) => {
        let options = [];
        for (let item of data.newsPro) {
          let _item = {
            label: item.proName || "",
            value: item.proCode || "",
          };
          options.push(_item);
        }
        if (keyIndex == -1){
          this.appIdList = options
        }else{
          this.$set(this.tableOptions, keyIndex, options);
        }
        this.optionNum = this.optionNum + 1
      });
    },
    selectChange(changeValue, i, j) {
      // value值， i横坐标， j纵坐标
      let _nowItem = copyDeep(this.dataList[j]) 
      let key = this.indexDict[i]
      if (i == 5 || i == 9){
        let valueList = []
        for (let item of changeValue){
          valueList.push(item.value)
        }
        _nowItem[key] = valueList
      }else{
        let {label, value} = changeValue
        _nowItem[key] = value
      }
      let ranges = _nowItem.ranges || []
      let infoAreas = _nowItem.infoAreas || []
      if (typeof ranges == 'string'){
        _nowItem['ranges'] = ranges.split(',') || []
      }else{
        _nowItem['ranges'] = ranges
      }
      if (typeof infoAreas == 'string'){
        _nowItem['infoAreas'] = infoAreas.split(',') || []
      }else{
         _nowItem['infoAreas'] = infoAreas
      }
      
      let body = {
        ..._nowItem
      }
      modifyInfo(body).then(
        data => {
          this.dataList[j] = _nowItem
        }
      ).catch(
        error => {
          this.$hMessage.error(error.content)
        }
      )
    },
  },
};
</script>
<style scoped lang='scss'>
.mainContent /deep/ .btnContent {
  display: flex;
  justify-content: center;
}
.formContent {
  width: 80%;
  margin: 0 auto;
}
.mainContent /deep/ .h-select-input{
  height: 30px!important;
}
.loadingTable{

}
</style>