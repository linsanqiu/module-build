<template>
  <div class="mainList">
    <SearchHeader ref="searchHeader" @renderHeader="renderHeader">
      <h-button type="primary" @click="handleSearch">查询</h-button>
      <h-button type="primary" @click="deleteItemList">批量删除</h-button>
      <h-button type="primary" @click="editAll">批量编辑</h-button>
      <h-tooltip placement="top-end" content="请选择是否自动刷新表格的数据!">
        <h-switch size="large" v-model="isAutoRefreshTable">
          <div slot="open">
            <span>打开</span>
          </div>
          <div slot="close">
            <span>关闭</span>
          </div>
        </h-switch>
      </h-tooltip>
    </SearchHeader>
    <div class="tableBox">
      <h-table
        ref="editTable"
        class="full-max-height-table"
        :maxHeight="maxTableHeight"
        stripe
        :border="true"
        :columns="tablColumns"
        :data="dataList"
        size="small"
        :loading="tableLoading"
        @on-selection-change="selectChange"
        @on-select-cancel="cancelSelect"
        :show-header="true"
      ></h-table>
      <h-page
        highlight-row
        size="small"
        show-elevator
        show-total
        show-sizer
        placement="top"
        class="page-box"
        :total="pagination.totalSize"
        :current="pagination.currentPage"
        :page-size-opts="pageSizeOpts"
        @on-page-size-change="onPageSizeChange"
        :page-size="pagination.pageSize"
        @on-change="onPageChange"
      ></h-page>
      <div class="checkNum">
        {{ "当前已选择 " + selectIdArr.length + " 条" }}
      </div>
    </div>
    <!-- 多值编辑 -->
    <h-msgBox
      title="编辑"
      v-model="mutilEditModalShow"
      class-name="vertical-center-modal"
      width="800"
      height="600"
      :mask-closable="false"
    >
      <div class="tableHeader">
        <h-button type="info" @click="searchMutilLocal">搜索</h-button>
      </div>
      <div class="data-table">
        <table>
          <tbody>
          <tr>
            <th
              class="eidtSearchContent"
              v-for="(item, index) in optionsHeader"
              :key="index"
            >
              <span>{{ item.fieldName }}</span>
              <div class="editSearch">
                <HeaderInput
                  :type="item.fieldType"
                  @valueChange="editHeaderSearchDataChange($event, index)"
                  :maxLen="item.length"
                  :selectCode="item.fieldType == 6 ? item.defaultValue : ''"
                  :select="
                      item.fieldType == 5
                        ? selectObj[item.defaultValue]
                        : []
                    "
                ></HeaderInput>
              </div>
            </th>
          </tr>
          <tr v-for="(item, index) in filterList" :key="index">
            <td v-for="(header, indexJ) in optionsHeader" :key="indexJ">
              <Sinput
                :repRules="header.fieldRepRuleList"
                :type="header.fieldType"
                v-model="item[header.fieldCode]"
                :maxLen="header.length"
                :required="header.required ? true : false"
                :selectCode="header.fieldType == 6 ? header.defaultValue : ''"
                :select="
                    header.fieldType == 5 ? selectObj[header.defaultValue] : []
                  "
              ></Sinput>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div slot="footer">
        <h-button @on-click="closeMutilsModal">取消</h-button>
        <h-button @on-click="saveMutilData" type="primary">确定</h-button>
      </div>
    </h-msgBox>
    <!-- 竖向数据编辑 -->
    <h-msgBox
      title="编辑"
      v-model="otherEditModalShow"
      class-name="vertical-center-modal"
      width="800"
      maxHeight="500"
      :top="-80"
      :mask-closable="false"
    >
      <div class="data-table">
        <table>
          <thead>
          <tr>
            <th>
              <span>{{ mutilFiledTemp.fieldName }}</span>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in mutilSelectDataList" :key="index">
            <td>
              <Sinput
                :repRules="mutilFiledTemp.fieldRepRuleList"
                :type="mutilFiledTemp.fieldType"
                v-model="mutilSelectDataList[index]"
                :maxLen="mutilFiledTemp.length"
                :required="mutilFiledTemp.required ? true : false"
                :selectCode="
                    mutilFiledTemp.fieldType == 6
                      ? mutilFiledTemp.defaultValue
                      : ''
                  "
                :select="
                    mutilFiledTemp.fieldType == 5
                      ? selectObj[mutilFiledTemp.defaultValue]
                      : []
                  "
              ></Sinput>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div slot="footer">
        <h-button @on-click="closeOtherModal">取消</h-button>
        <h-button @on-click="saveOtherEdit" type="primary">确定</h-button>
      </div>
    </h-msgBox>
    <!-- 单条编辑 -->
    <h-msgBox
      title="编辑"
      v-model="editModalShow"
      class-name="vertical-center-modal"
      width="800"
      maxHeight="500"
      :top="-80"
      :mask-closable="false"
    >
      <h-form :rules="onlyEditRule" ref="onlyEditForm" :model="selectValue">
        <template v-for="(item, index) in headerData">
          <h-form-item
            :prop="item.fieldCode"
            v-if="item.fieldCode != 'prodCode' && item.bizGroupType != 1"
            :key="index"
            :label="item.fieldName"
            :label-width="100"
          >
            <Sinput
              :repRules="item.fieldRepRuleList"
              :border="true"
              :type="item.fieldType"
              v-model="selectValue[item.fieldCode]"
              :maxLen="item.length"
              :required="item.required ? true : false"
              :selectCode="item.fieldType == 6 ? item.defaultValue : ''"
              :select="item.fieldType == 5 ? selectObj[item.defaultValue] : []"
            ></Sinput>
          </h-form-item>
          <div class="data-table" :key='index' v-if='item.bizGroupType == 1' style="padding-left:36px;margin-bottom:20px">
            <div>分组名称：{{item.fieldName}}</div>
            <MutilTable :ref='`mutilTable${item.fieldCode}`' :fieldInfoList='item.fieldInfoList' :selectObj='selectObj' :dataObject='selectValue[item.fieldCode]' :prodCode='item.prodCode'></MutilTable>
          </div>
        </template>
      </h-form>
      <div slot="footer">
        <h-button @on-click="closeModal">取消</h-button>
        <h-button @on-click="saveOnlyEdit" type="primary">确定</h-button>
      </div>
    </h-msgBox>
    <!-- 相关公告 -->
    <h-msgBox
      title="相关公告"
      v-model="anncListModalShow"
      class-name="vertical-center-modal"
      width="800"
      maxHeight="600px"
      :mask-closable="false"
      :top="-80"
    >
      <h-table
        ref="editTable"
        class="full-max-height-table anncTable"
        :maxHeight="maxTableHeight"
        stripe
        border
        :columns="anncTablColumns"
        :data="anncDataList"
        size="small"
        :loading="anncTableLoading"
        :show-header="true"
      ></h-table>
      <h-page
        highlight-row
        size="small"
        show-total
        placement="top"
        class="page-box"
        :total="anncPageP.totalSize"
        :current="anncPageP.currentPage"
        :page-size="anncPageP.pageSize"
        @on-change="onAnncPageChange"
      ></h-page>
    </h-msgBox>
    <!-- 批量编辑 -->
    <h-msgBox
      title="批量编辑"
      v-model="editAllModalShow"
      class-name="vertical-center-modal"
      width="600"
      height="400"
      :mask-closable="false"
    >
      <h-form v-if='editAllModalShow'>
        <h-form-item label="字段选择：" :label-width="80">
          <h-select @on-change="allEditSelectChange" clearable filterable>
            <h-option
              v-for="(item, index) in headerData"
              :value="item.fieldCode"
              :key="index"
              :disabled="item.fieldCode == 'prodCode' || item.bizGroupType == 1"
            >{{ item.fieldName }}
            </h-option
            >
          </h-select>
        </h-form-item>
        <h-form-item label="修改值：" :label-width="80" v-if="allSelectItem">
          <Sinput
            :repRules="allSelectItem.fieldRepRuleList"
            border
            :type="allSelectItem.fieldType"
            v-model="selectItemValue"
            :maxLen="allSelectItem.length"
            :required="allSelectItem.required ? true : false"
            :selectCode="
              allSelectItem.fieldType == 6 ? allSelectItem.defaultValue : ''
            "
            :select="
              allSelectItem.fieldType == 5
                ? selectObj[allSelectItem.defaultValue]
                : []
            "
          ></Sinput>
        </h-form-item>
      </h-form>
      <div slot="footer">
        <h-button @on-click="closeAllEditModal">取消</h-button>
        <h-button @on-click="saveAllEdit" type="primary">确定</h-button>
      </div>
    </h-msgBox>
    <h-msgBox
      :isOkLeft="true"
      title="字段存在错误，请检查"
      v-model="modalErrorShow"
      :mask-closable="false"
    >
      <div slot='footer' class="modalFooter">
        <h-button @click='forceSubmit'>强制公开</h-button>
        <h-button type='info' @click='hidenError'>确认</h-button>
      </div>
      <p v-html="modalErrorMsg"></p>
    </h-msgBox>
  </div>
</template>
<script>
import SearchHeader from "../components/productDataHeader";
import Sinput from "../components/input";
import HeaderInput from "../components/headerInput";
import MutilTable from "../components/mutilTable";
import {
  getDictList,
  proDataList,
  saveProdData,
  getProdAnncPage,
  deleteProdData,
  getTableHeader,
  checkVerifyDataFromList
} from "../api/apiManager";
import {copyDeep, stringToArray} from "@/filters/index";

export default {
  name: "ProductionInfoProductDataList",
  components: {SearchHeader, Sinput, HeaderInput, MutilTable},
  computed: {
    maxTableHeight() {
      return this.$store.state.maxTableHeight;
    },
    bizType() {
      return this.$refs.searchHeader && this.$refs.searchHeader.bizType;
    }
  },
  data() {
    return {
      dataDict: {},
      onlyEditRule: {},
      selectValue: {},
      selectObj: {},
      isAutoRefreshTable: true,
      selectIdArr: [],
      tablColumns: [
        {
          type: "selection",
          align: "center",
          fixed: "left",
          width: 60,
        },
        {
          key: "prodCode",
          align: "center",
          fixed: "left",
          title: "产品内码",
          width: 100,
        },
        {
          align: "center",
          fixed: "left",
          title: "相关公告",
          width: 100,
          render: (h, params) => {
            let prodCode = params.row.prodCode;
            return (
              <div
                class="blueBtn"
                onClick={this.clickAnnc.bind(this, prodCode)}
              >
                公告列表
              </div>
            );
          },
        },
        {
          key: "operation",
          title: "操作",
          width: 80,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let index = params.index;
            let prodCode = params.row.prodCode;
            return (
              <div>
                <span
                  onClick={this.editAttr.bind(this, index)}
                  style="color: #298DFF"
                  class="iconfont tab-icon-btn icon-t-b-message"
                ></span>
                <span
                  title="删除"
                  onClick={this.deleteOneProdData.bind(this, prodCode)}
                  style="color: #F5222D"
                  class="iconfont tab-icon-btn icon-t-b-delete"
                ></span>
              </div>
            );
          },
        },
      ],
      dataList: [],
      tableLoading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
      },
      pageSizeOpts: [10, 20, 50, 100],
      otherEditModalShow: false,
      mutilFiledTemp: {},
      mutilGroupTemp: {},
      optionsHeader: [],
      mutilSelectDataList: [],
      mutilFormRules: [],
      editModalShow: false,
      tempSelect: [],
      editAllModalShow: false,
      anncListModalShow: false,
      anncPageP: {
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
      },
      anncTablColumns: [
        {
          key: "modifierName",
          align: "center",
          title: "操作人",
          width: 80,
        },
        {
          key: "handleTime",
          title: "操作时间",
          align: "center",
          width: 150,
        },
        {
          align: "center",
          title: "相关公告",
          render: (h, params) => {
            let {title, downloadUrl} = params.row;
            return (
              <a class="blueBtn" href={downloadUrl} target="_blank">
                {title}
              </a>
            );
          },
        },
      ],
      anncDataList: [],
      anncTableLoading: false,
      allSelectItem: null,
      selectItemValue: "",
      headerData: [], //请求数据回来的header，并带上筛选参数，关联字段
      selectHeaderData: [], //本地的header
      objHeaderData: [],  //计算头部下拉的header
      modalErrorShow: false,
      modalErrorMsg: "",
      saveTempObj: [],

      mutilEditModalShow: false, //多值编辑
      mutilEditData: [],
      filterList: [],

    };
  },
  methods: {
    renderHeader(headerData) {
      // this.headerData = headerData;
      this.selectHeaderData = headerData;
      this.getDataList();
    },
    getSelection() {
      let headerData = this.objHeaderData;
      for (let i = 0; i < headerData.length; i++) {
        let item = headerData[i];
        if (item.fieldType == 5) {
          let defaultValue = item.defaultValue;
          if (!defaultValue) {
            continue;
          }
          if (
            this.selectObj[defaultValue] &&
            this.selectObj[defaultValue].length > 0
          ) {
            continue;
          }
          setTimeout(() => {
            let body = {
              dictCode: defaultValue,
            };
            getDictList(body)
              .then((data) => {
                let list = data.dictList || [];
                this.$set(this.selectObj, defaultValue, list);
              })
              .catch((err) => {
                this.$hLoading.error(err.content);
              });
          }, 0);
        }
      }
    },
    // 计算头部下拉
    countObjHeader() {
      let objHeaderData = []
      for (let item of this.headerData) {
        if (item.bizGroupType == 1) {
          let {fieldInfoList} = item
          for (let info of fieldInfoList) {
            objHeaderData.push(info)
          }
        } else {
          objHeaderData.push(item)
        }
      }
      this.objHeaderData = objHeaderData
    },
    countSearchHeaderFromServer() {
      let beforeHeaderData = this.headerData;
      let dataDict = {};
      for (let item of beforeHeaderData) {
        dataDict[item.fieldCode] = {
          startParam: item.startParam,
          endParam: item.endParam,
        };
      }
      let bizType = this.bizType;
      let selectHeaderData =
        this.$refs.searchHeader && this.$refs.searchHeader.getHeaderData();
      this.selectHeaderData = selectHeaderData;
      let body = {
        bizType: bizType,
        prodDataFormList: selectHeaderData,
      };
      return getTableHeader(body).then((data) => {
        let prodTableField = data.prodTableField;
        this.headerData = prodTableField;
        this.countObjHeader()
        this.getSelection();
        let tablColumns = [
          {
            type: "selection",
            align: "center",
            fixed: "left",
            width: 60,
          },
          {
            key: "prodCode",
            align: "center",
            fixed: "left",
            title: "产品内码",
            width: 100,
          },
        ];
        let _dataDict = {};
        for (let i = 0; i < this.headerData.length; i++) {
          let {
            fieldCode,
            fieldName,
            defaultValue,
            fieldType,
            required,
            length,
          } = this.headerData[i];
          let dataDictItem = dataDict[fieldCode] || {};
          this.headerData[i].startParam = dataDictItem.startParam || "";
          this.headerData[i].endParam = dataDictItem.endParam || "";
          tablColumns.push({
            key: fieldCode,
            title: fieldName,
            align: "left",
            width: fieldCode == "prodCode" ? 300 : 200,
            renderHeader: (h, params) => {
              let {column, index} = params;
              let fieldItem = this.dataDict[column.key] || {};
              let bizGroupType = fieldItem.bizGroupType;
              return (
                <div class="sTitle">
                  <span class="sName">{column.title}</span>
                  {bizGroupType == 1 ? null : (
                    <HeaderInput
                      type={fieldType}
                      on-valueChange={this.valueChange.bind(this, i)}
                      maxLen={length}
                      selectCode={fieldType == 6 ? defaultValue : ""}
                      select={
                        fieldType == 5 ? this.selectObj[defaultValue] : []
                      }
                    ></HeaderInput>
                  )}
                </div>
              );
            },
            render: (h, params) => {
              let {row, index, column} = params;
              let fieldItem = this.dataDict[column.key] || {};
              let bizGroupType = fieldItem.bizGroupType;
              let title = row[column.key];
              let allTitle = row[column.key];
              if (fieldType == 5 || fieldType == 6) {
                title = row[`${column.key}Desc`];
              }
              if (fieldType == 4) {
                title = this.fomatMoney(title);
              }
              if (fieldType == 7) {
                title =
                  (title && title.length) >= 30
                    ? `${title.substring(0, 27)}...`
                    : title;
                allTitle =
                  (allTitle && allTitle.length) >= 60
                    ? `${allTitle.substring(0, 57)}...`
                    : allTitle;
              }
              let args = [this, fieldItem, row[column.key], row["prodCode"], index];
              return (
                <div>
                  {bizGroupType == 1 ? (
                    <div>
                      <span
                        class="blueBtn"
                        onClick={this.mutilGroupEditModalShow.bind(...args)}
                      >
                        多值
                      </span>
                      <span
                        onClick={this.mutilGroupEditModalShow.bind(...args)}
                        style="color: #298DFF;margin-left:10px"
                        class="iconfont tab-icon-btn icon-t-b-message"
                      ></span>
                    </div>
                  ) : (
                    <div>
                      {fieldType == 7 ? (
                        <div
                          title={allTitle}
                          onClick={this.otherEditModalShowClick.bind(...args)}
                        >
                          {title}
                        </div>
                      ) : (
                        <div
                          onClick={this.otherEditModalShowClick.bind(...args)}
                        >
                          {title}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            },
          });
          _dataDict[fieldCode] = this.headerData[i];
        }
        this.dataDict = _dataDict;
        tablColumns.push({
          align: "center",
          fixed: "left",
          title: "相关公告",
          width: 100,
          render: (h, params) => {
            let prodCode = params.row.prodCode;
            return (
              <div
                class="blueBtn"
                onClick={this.clickAnnc.bind(this, prodCode)}
              >
                公告列表
              </div>
            );
          },
        });
        tablColumns.push({
          key: "operation",
          title: "操作",
          width: 80,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let index = params.index;
            let prodCode = params.row.prodCode;
            return (
              <div>
                <span
                  onClick={this.editAttr.bind(this, index)}
                  style="color: #298DFF"
                  class="iconfont tab-icon-btn icon-t-b-message"
                ></span>
                <span
                  title="删除"
                  onClick={this.deleteOneProdData.bind(this, prodCode)}
                  style="color: #F5222D"
                  class="iconfont tab-icon-btn icon-t-b-delete"
                ></span>
              </div>
            );
          },
        });
        this.tablColumns = tablColumns;
      }).catch(
        error => {
          this.$hMessage.error(error.content)
        }
      );
    },
    fomatMoney(num) {
      num = (num || "").toString();
      let numArray = num.split(".");
      if (numArray.length == 0) {
        return "";
      } else if (numArray.length == 1) {
        num = numArray[0];
        return num.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
      } else if (numArray.length == 2) {
        num = numArray[0];
        let num2 = numArray[1];
        num = num.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
        return `${num}.${num2}`;
      }
    },
    async getDataList() {
      if (this.tableLoading) {
        return;
      }
      // 获取搜索条件
      // this.countSearchHeader();
      await this.countSearchHeaderFromServer();
      this.tableLoading = true;
      let bizType = this.bizType;
      let headerData = this.headerData;
      let prodDataFormList = [];
      // 将多值拆分出来传给后台
      for (let item of headerData) {
        let {bizGroupType, fieldInfoList} = item;
        if (bizGroupType == 1) {
          for (let info of fieldInfoList) {
            prodDataFormList.push(info);
          }
        } else {
          prodDataFormList.push(item);
        }
      }
      let body = {
        ...this.pagination,
        prodDataFormList: prodDataFormList,
        bizType: bizType,
      };
      proDataList(body)
        .then((data) => {
          let {dataList, totalSize} = data;
          dataList = dataList || [];
          let trueData = [];
          this.tableLoading = false;
          for (let item of dataList) {
            trueData.push(item.prodDataObj);
          }
          this.dataList = trueData || [];
          this.pagination.totalSize = totalSize;
        })
        .catch((error) => {
          this.tableLoading = false;
          this.$hMessage.error(error.content);
        });
    },
    handleSearch(e) {
      this.pagination.currentPage = 1;
      this.selectIdArr = [];
      this.getDataList();
    },
    handleSort(params) {
      let searchData = this.$refs.searchHeader.searchData;
      if (params.order == "normal") {
        searchData.order = 0;
        searchData.orderByWhich = "";
      } else {
        searchData.order = params.order == "asc" ? 1 : 0;
        searchData.orderByWhich = params.key;
      }
      this.handleSearch();
    },
    onPageSizeChange(size) {
      this.pagination.pageSize = pageSize;
      this.selectIdArr = [];
      this.getDataList();
    },
    onPageChange(currentPage) {
      this.pagination.currentPage = currentPage;
      this.selectIdArr = [];
      this.getDataList();
    },

    selectChange(selection) {
      let selectArr = selection;
      let selectArrId = [];
      selectArr.forEach((item, index) => {
        selectArrId.push(item.prodCode);
      });
      this.selectIdArr = selectArrId;
    },
    cancelSelect(selection, row) {
      //取消选择某一项
      let index = this.selectIdArr.indexOf(row.prodCode);
      if (index != -1) {
        this.selectIdArr.splice(index, 1);
      }
    },
    deleteItemList() {
      if (this.selectIdArr.length == 0) {
        this.$hMessage.warning("请先选择需要删除的数据");
      } else {
        this.$hMsgBox.confirm({
          isOkLeft: true,
          title: "删除",
          content: `共${this.selectIdArr.length}个数据，是否确认删除?`,
          onOk: () => {
            this.deleteBatchApi(this.selectIdArr);
          },
        });
      }
    },
    deleteOneProdData(prodCode) {
      this.$hMsgBox.confirm({
        isOkLeft: true,
        title: "删除",
        content: `确定删除产品内码为${prodCode}的产品?`,
        onOk: () => {
          this.deleteBatchApi([prodCode]);
        },
      });
    },
    deleteBatchApi(idList) {
      deleteProdData(idList)
        .then((data) => {
          this.$hMessage.success("删除成功");
          this.getDataList();
          this.selectIdArr = [];
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
        });
    },
    otherEditModalShowClick(fieldItem, dataList, prodCode, index) {
      fieldItem["prodCode"] = prodCode;
      fieldItem['index'] = index
      this.mutilFiledTemp = fieldItem;
      if (fieldItem.fieldCode == "prodCode") {
        return;
      }
      if (fieldItem.bizGroupType == 1) {
        if (!dataList) {
          this.mutilSelectDataList = [];
        } else {
          this.mutilSelectDataList = JSON.parse(dataList);
        }
      } else {
        if (!dataList) {
          this.mutilSelectDataList = [];
        } else {
          this.mutilSelectDataList = [dataList.toString()];
        }
      }
      this.otherEditModalShow = true;
    },
    mutilGroupEditModalShow(fieldItem, dataList, prodCode) {
      let {fieldInfoList} = fieldItem;
      // fieldCode
      // dataList对应k值
      fieldInfoList.forEach(item => {
        item.prodCode = prodCode
      })
      this.optionsHeader = fieldInfoList || [];
      let mutilEditData = [];
      let keyLength = dataList[fieldInfoList[0].fieldCode].length;
      // 字典List
      for (let i = 0; i < keyLength; i++) {
        let dict = {};
        for (let j = 0; j < fieldInfoList.length; j++) {
          let item = fieldInfoList[j];
          let {fieldCode} = item;
          dict[fieldCode] = dataList[fieldCode][i];
        }
        mutilEditData.push(dict);
      }
      this.mutilEditData = mutilEditData;
      this.filterList = mutilEditData;
      this.mutilEditModalShow = true;
    },
    closeOtherModal() {
      this.otherEditModalShow = false;
    },
    async saveOtherEdit() {
      let pass = true;
      let bodyList = [];
      let {
        fieldCode,
        fieldType,
        length,
        bizGroupType,
        bizType,
        defaultValue,
        fieldId,
        fieldName,
        fieldRepRuleList,
        required,
        prodCode,
        index,
      } = this.mutilFiledTemp;
      for (let i = 0; i < this.mutilSelectDataList.length; i++) {
        if (!this.mutilSelectDataList[i] && required == 1) {
          pass = false;
          break;
        }
      }
      if (!pass) {
        this.$hMessage.info("请输入必填字段");
      } else {
        let nowData = this.dataList[index]
        let headerData = this.headerData
        let prodDataList = []
        for (let item of headerData){
          if (item.bizGroupType == 2 && item.fieldCode != "prodCode"){
             let {
              fieldCode,
              fieldType,
              length,
              bizGroupType,
              bizType,
              defaultValue,
              fieldId,
              fieldName,
              fieldRepRuleList,
              required,
              prodCode,
              fieldValue,
              index,
            } = item;
            let objItem = {
                fieldCode: fieldCode,
                fieldType: fieldType,
                length: length,
                bizGroupType: bizGroupType,
                bizType: bizType,
                defaultValue: defaultValue,
                fieldId: fieldId,
                fieldName: fieldName,
                fieldRepRuleList: fieldRepRuleList,
                required: required,
                fieldValue: nowData[fieldCode],
            }
            if (item.fieldCode == this.mutilFiledTemp.fieldCode){
              objItem.fieldValue = (bizGroupType == 1? JSON.stringify(this.mutilSelectDataList) : this.mutilSelectDataList[0])
            }
            prodDataList.push(objItem)
          }
        }
        let body = [
          {
            prodCode: prodCode,
            bizType: this.bizType,
            prodDataList: prodDataList,
          },
        ];
        let checkPass = await this.checkProdData(body)
        if (!checkPass) {
          return
        }
        saveProdData(body)
          .then((data) => {
            this.otherEditModalShow = false;
            this.judjeShowModal(data);
          })
          .catch((error) => {
            this.$hMessage.error(error.content);
          });
      }
    },
    judjeShowModal(data) {
      this.$hMessage.success("修改成功");
      this.getDataList();
    },
    isEmptyObject(obj) {
      for (var key in obj) {
        return false;
      }
      return true;
    },
    editAttr(index) {
      let dataList = copyDeep(this.dataList)
      let selectValue = dataList[index];
      for (let key in selectValue) {
        if (selectValue[key] && selectValue[key].constructor.toString().indexOf("Object")>-1){
          // 字典，多值
          
        }else{
          selectValue[key] = (selectValue[key] || "").toString(); 
        }
      }
      this.selectValue = copyDeep(selectValue);
      let headerData = this.headerData;
      let onlyEditRule = {};
      for (let item of headerData) {
        let {required, fieldCode, fieldType} = item;
        if (required) {
          onlyEditRule[fieldCode] = [
            {
              required: true,
              message: fieldType == 5 || fieldType == 6 ? "请选择" : "请输入",
              trigger: "blur",
            },
          ];
        }
      }
      this.onlyEditRule = onlyEditRule;
      this.editModalShow = true;
      this.$nextTick(() => {
        this.$refs.onlyEditForm && this.$refs.onlyEditForm.resetValidate();
      });
    },
    closeModal() {
      this.editModalShow = false;
    },
    async saveOnlyEdit() {
      let bodyList = [];
      let dataList = [];
      for (let key in this.selectValue) {
        let item = this.dataDict[key] || "";
        if (!item) {
          continue;
        }
        let fieldValue = this.selectValue[key];
        let {
          fieldCode,
          fieldType,
          length,
          bizGroupType,
          bizType,
          defaultValue,
          fieldId,
          fieldName,
          fieldRepRuleList,
          required,
        } = item;
        if (bizGroupType == 1){
          // 多值
          let allData = []
          allData = this.$refs[`mutilTable${fieldCode}`][0].getAllData()
          dataList = dataList.concat(allData)
        }else{
          let _item = {
            fieldCode: fieldCode,
            fieldType: fieldType,
            length: length,
            bizGroupType: bizGroupType,
            bizType: bizType,
            defaultValue: defaultValue,
            fieldId: fieldId,
            fieldName: fieldName,
            fieldRepRuleList: fieldRepRuleList,
            required: required,
            fieldValue: fieldValue,
          };
          dataList.push(_item);
        }
       
      }
      bodyList[0] = {
        prodCode: this.selectValue.prodCode || "",
        prodDataList: dataList,
        bizType: this.bizType
      };
      let checkPass = await this.checkProdData(bodyList)
      if (!checkPass) {
        return
      }
      saveProdData(bodyList)
        .then((data) => {
          this.editModalShow = false;
          this.judjeShowModal(data);
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
        });
    },
    clickAnnc(prodCode) {
      this.anncListModalShow = true;
      this.anncPageP.currentPage = 1;
      this.getAnncList(prodCode);
    },
    onAnncPageChange(currentPage) {
      this.anncPageP.currentPage = currentPage;
      this.getAnncList();
    },
    getAnncList(prodCode) {
      let body = {
        prodCode: prodCode,
        ...this.anncPageP,
      };
      getProdAnncPage(body)
        .then((data) => {
          this.anncDataList = data.dataList || [];
          this.anncPageP.totalSize = data.totalSize;
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
        });
    },
    closeAllEditModal() {
      this.editAllModalShow = false;
    },
    async saveAllEdit() {
      let bodyList = [];
      let selectIdArr = this.selectIdArr;
      let allSelectItem = this.allSelectItem || {};
      let {
        fieldCode,
        fieldType,
        length,
        bizGroupType,
        bizType,
        defaultValue,
        fieldId,
        fieldName,
        fieldRepRuleList,
        required,
      } = allSelectItem;
      for (let i = 0; i < selectIdArr.length; i++) {
        let prodCode = selectIdArr[i];
        let _item = {
          bizType: bizType,
          defaultValue: defaultValue,
          bizGroupType: bizGroupType,
          fieldId: fieldId,
          fieldCode: fieldCode,
          fieldType: fieldType,
          fieldName: fieldName,
          fieldRepRuleList: fieldRepRuleList,
          length: length,
          fieldValue: this.selectItemValue,
          required: required,
        };
        bodyList.push({
          prodCode: prodCode,
          prodDataList: [_item],
          bizType: this.bizType
        });
      }
      let checkPass = await this.checkProdData(bodyList)
      if (!checkPass) {
        return
      }
      saveProdData(bodyList)
        .then((data) => {
          this.editAllModalShow = false;
          this.judjeShowModal(data);
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
        });
    },
    // 批量编辑
    editAll() {
      if (this.selectIdArr.length == 0) {
        this.$hMessage.warning("请先选择需要编辑的数据");
      } else {
        this.selectItemValue = "";
        this.editAllModalShow = true;
        let headerData = this.headerData;
      }
    },
    allEditSelectChange(fieldCode) {
      this.selectItemValue = "";
      let allSelectItem = null;
      for (let i = 0; i < this.headerData.length; i++) {
        if (this.headerData[i].fieldCode == fieldCode) {
          allSelectItem = this.headerData[i];
          break;
        }
      }
      this.allSelectItem = copyDeep(allSelectItem);
    },
    valueChange(index, value) {
      let agrType = value.index;
      let argValue = value.value;
      if (agrType == 3) {
        this.headerData[index].startParam = argValue[0];
        this.headerData[index].endParam = argValue[1];
        return;
      }
      if (agrType == 4) {
        this.headerData[index].startParam = JSON.stringify(argValue);
        return;
      }
      if (agrType == 1) {
        this.headerData[index].startParam = argValue;
      } else {
        this.headerData[index].endParam = argValue;
      }
    },
    editHeaderSearchDataChange(value, index) {
      let agrType = value.index;
      let argValue = value.value;
      if (agrType == 3) {
        this.optionsHeader[index].startParam = argValue[0];
        this.optionsHeader[index].endParam = argValue[1];
        return;
      }
      if (agrType == 4) {
        this.optionsHeader[index].startParam = JSON.stringify(argValue);
        return;
      }
      if (agrType == 1) {
        this.optionsHeader[index].startParam = argValue;
      } else {
        this.optionsHeader[index].endParam = argValue;
      }
    },
    searchMutilLocal() {
      let {optionsHeader, mutilEditData} = this;
      let filterList = copyDeep(mutilEditData);
      for (let options of optionsHeader) {
        let {fieldType, startParam, endParam, fieldCode} = options;
        switch (fieldType) {
          case 1:
          case 4:
          case 8:
          case 9:
            // 数字
            if (!startParam && !endParam) {
              break;
            }
            startParam = startParam || Number.MIN_VALUE;
            endParam = endParam || Number.MAX_VALUE;
            filterList = filterList.filter((item) => {
              return (
                item[fieldCode] >= startParam && item[fieldCode] <= endParam
              );
            });
            break;
          case 2:
          case 7:
            if (!startParam) {
              break;
            }
            // 文本
            filterList = filterList.filter((item) => {
              return item[fieldCode].indexOf(startParam) > 0;
            });
            break;
          case 3:
            // 日期
            if (!startParam && !endParam) {
              break;
            }
            filterList = filterList.filter((item) => {
              let value = Date.parse(item[fieldCode]);
              startParam = startParam || Number.MIN_VALUE;
              endParam = endParam || Number.MAX_VALUE;
              let startTime =
                Date.parse(new Date(startParam)) || Number.MIN_VALUE;
              let endTime = Date.parse(new Date(endParam)) || Number.MAX_VALUE;
              return value >= startTime && value <= endTime;
            });
            break;
          case 5:
          case 6:
            if (!startParam || startParam == '[]') {
              break;
            }
            startParam = JSON.parse(startParam)
            filterList = filterList.filter((item) => {
              return startParam.includes(item[fieldCode]);
            });
            break;
          default:
            break;
        }
      }
      this.filterList = filterList;
    },
    closeMutilsModal() {
      this.mutilEditModalShow = false
    },
    async saveMutilData() {
      let filterList = this.filterList
      let optionsHeader = this.optionsHeader
      let {prodCode, bizType} = optionsHeader[0]
      let dataList = []
      let prodDataList = []
      for (let item of optionsHeader) {
        let valueList = []
        for (let _item of filterList) {
          valueList.push(_item[item.fieldCode])
        }
        prodDataList.push(
          {
            ...item,
            fieldValue: JSON.stringify(valueList)
          }
        )
      }
      dataList.push(
        {
          prodCode: prodCode,
          bizType: bizType,
          prodDataList: prodDataList,
        }
      )
      let checkPass = await this.checkProdData(dataList)
      if (!checkPass) {
        return
      }
      saveProdData(dataList).then(
        data => {
          this.mutilEditModalShow = false
          this.$hMessage.success("修改成功");
          this.getDataList();
        }
      )
    },
    hidenError() {
      this.modalErrorShow = false;
    },
    forceSubmit() {
      let self = this
      this.$hMsgBox.confirm({
        title: "公开",
        content: "是否确认强制公开？",
        onOk: () => {
          saveProdData(self.saveTempObj).then(
            data => {
              this.editModalShow = false;
              this.mutilEditModalShow = false
              this.modalErrorShow = false
              this.otherEditModalShow = false
              this.$hMessage.success("修改成功");
              this.getDataList();
            }
          )
        },
      });
    },
    checkProdData(dataList) {
      return new Promise((resolve, reject) => {
        checkVerifyDataFromList(dataList).then(
          data => {
            if (data.resultCode == 1) {
              // 校验通过
              resolve(true)
            } else if (data.resultCode == 0) {
              // 强制校验
              this.saveTempObj = dataList
              this.modalErrorShow = true;
              this.modalErrorMsg = data.resultMsg;
              resolve(false)
            }else{
              this.$hMessage.error({ content: data.resultMsg });
            }
          }
        ).catch(
          error =>{
            this.$hMessage.error({ content: error.content });
          }
        )
      })
    }
  },
  activated: function () {
    if (this.isAutoRefreshTable) {
      this.getDataList();
    }
  },
};
</script>
<style scoped lang='scss'>
.tableBox {
  position: relative;
}

.mainList /deep/ .sTitle {
  padding: 8px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.mainList /deep/ .sName {
  margin-right: 5px;
}

.mainList /deep/ .blueBtn,
.anncTable /deep/ .blueBtn {
  color: #298dff;
  cursor: pointer;
}

.mainList /deep/ .blueBtn:hover,
.anncTable /deep/ .blueBtn:hover {
  color: #0067dc;
}

table {
  position: relative;
  border-collapse: collapse;
  border: none;
  table-layout: fixed;
  width: 100%;
}

th {
  background: #f0f3f5;
}

tr,
th,
td {
  border: 1px solid #dce1e7;
  height: 32px;
}

th,
td {
  width: 150px;
}

tbody th {
  padding: 0 10px;
}

th span {
  cursor: pointer;
  padding: 10px;
}

.data-table {
  width: 100%;
  overflow-x: auto;


}
.tableHeader {
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-end;
}
.eidtSearchContent {
  padding: 10px;

  .editSearch {
    display: flex;

    .title {
      width: 80px;
    }
  }
}
.modalFooter{
  display: flex;
  justify-content: space-between;
}
</style>

