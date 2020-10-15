<template>
  <div>
    <div style="margin-bottom: 10px;">
      <search-form>
        <ul slot="content">
          <li>
            <dl>
              <dt>业务类型：</dt>
              <dd>
                <h-select v-model="searchData.bizType" placeholder="请选择" @on-change="bizTypeChange">
                  <h-option
                    v-for="item in bizTypeList"
                    :value="item.entryValue"
                    :key="item.entryValue"
                  >{{ item.entryName }}</h-option>
                </h-select>
              </dd>
            </dl>
          </li>
          <li>
            <dl>
              <dt>业务属性：</dt>
              <dd>
                <h-select v-model="searchData.bizGroupCode" placeholder="请选择">
                  <h-option
                    v-for="item in bizGroupList"
                    :value="item.bizGroupCode"
                    :key="item.bizGroupCode"
                  >{{ item.bizGroupName }}</h-option>
                </h-select>
              </dd>
            </dl>
          </li>
          <li>
            <dl>
              <dt>字段名称：</dt>
              <dd>
                <h-input v-model="searchData.fieldName" placeholder="请输入" clearable></h-input>
              </dd>
            </dl>
          </li>

          <li>
            <dl>
              <dt>字段类型：</dt>
              <dd>
                <h-select v-model="searchData.fieldType" placeholder="请选择">
                  <h-option
                    v-for="item in fieldTypeList"
                    :value="item.entryValue"
                    :key="item.entryValue"
                  >{{ item.entryName }}</h-option>
                </h-select>
              </dd>
            </dl>
          </li>
          <li class="search-wrapper-but">
            <h-button type="primary" data-ref="init-btn" @click="onPageChange(1)">查询</h-button>
            <h-button type="info" @click="addFn">新增字段</h-button>
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
          </li>
        </ul>
      </search-form>
    </div>
    <div class="tab-box tag-relotion-tab-box">
      <h-table
        class="full-max-height-table"
        size="small"
        stripe
        :columns="commonTableCols"
        :data="commonTableDatas"
        :loading="tableLoading"
        :highlight-row="true"
        border
      ></h-table>
      <h-page
        highlight-row
        size="small"
        show-elevator
        show-total
        show-sizer
        placement="top"
        class="page-box"
        :total="total"
        :current="pagination.currentPage"
        :page-size-opts="pageSizeOpts"
        @on-page-size-change="onPageSizeChange"
        :page-size="pagination.pageSize"
        @on-change="onPageChange"
      ></h-page>
    </div>
    <ConfigModal
      ref="configModal"
      :groupList="bizGroupList"
      :bizTypeList="bizTypeList"
      :fieldTypeList="fieldTypeList"
      v-model="configModalShow"
      :DictItem="DictItem"
      :SearchDict="SearchDict"
      @changeAttr="changeAttr"
      @addAttr="addAttr"
      :isRuleAdd="isRuleAdd"
      :formValue="formValue"
      :fieldGroupTypeList="fieldGroupTypeList"
    ></ConfigModal>

    <h-msgBox
      title="校验规则"
      v-model="verifyModalShow"
      class-name="vertical-center-modal"
      width="800"
      height="400"
    >
      <Verification
        :dataList="verfiyList"
        @addVerify="addVerify"
        @deleteVerify="deleteVerify"
        ref="verifycation"
      ></Verification>
      <div slot="footer">
        <h-button @on-click="closeVerifyModal">取消</h-button>
        <h-button @on-click="saveVerifyRule" type="primary">确定</h-button>
      </div>
    </h-msgBox>
    <h-msgBox
      title="替换规则"
      v-model="replaceModalShow"
      class-name="vertical-center-modal"
      width="800"
      height="400"
    >
      <div v-for="(rule, index) in rules" :key="index">
        <ReplaceRules :rule="rule" :index="index" :ref="`replaceForm${index}`">
          <span
            slot="deleteBtn"
            title="删除"
            @click="deleteRule(index)"
            style="color: #F5222D"
            class="iconfont tab-icon-btn icon-t-b-delete"
          ></span>
          <!-- <div slot="deleteBtn" @click="deleteRule(index)" class="deleteBtn">删除</div> -->
        </ReplaceRules>
      </div>
      <h-button type="info" style="width:100%;" @on-click="addRule">+</h-button>
      <div slot="footer">
        <h-button @on-click="closeReplaceModal">取消</h-button>
        <h-button @on-click="changeReplaceRule" type="primary">确定</h-button>
      </div>
    </h-msgBox>
  </div>
</template>

<script>
import ConfigModal from "../components/configModal";
import Verification from "../components/verification";
import ReplaceRules from "../components/replaceRules";
import { copyDeep } from "@/filters/index";
import {
  getAttrList,
  getTempGroups,
  saveOrModifyRule,
  getRepRuleInfos,
  removeRule,
  savaOrModifyAttr,
  getDictList,
  getFieldVerify,
  saveOrModifyVerifyRule,
} from "../api/apiManager";
export default {
  name: "ProductionInfoRuleSettingList",
  components: { ConfigModal, Verification, ReplaceRules },
  data() {
    return {
      searchData: {
        bizType: "",
        bizGroupCode: "",
        fieldName: "",
        fieldType: "",
      },

      isAutoRefreshTable: true,
      pagination: {
        currentPage: 1,
        pageSize: 10,
      },
      pageSizeOpts: [10, 20, 50, 100],
      total: 0,
      tableLoading: false,
      commonTableDatas: [{}],
      bizTypeList: [],
      bizGroupList: [],
      fieldTypeList: [],
      DictItem: {},
      SearchDict: [],
      fieldGroupTypeList: [],
      commonTableCols: [
        {
          key: "bizTypeName",
          title: "业务类型",
          align: "left",
          width: 150,
        },
        {
          key: "fieldName",
          title: "字段名称",
          align: "left",
        },
        {
          key: "fieldCode",
          title: "字段编码",
          align: "left",
          width: 100,
        },
        {
          key: "bizGroupName",
          title: "业务属性（分组）",
          align: "left",
          width: 150,
        },
        {
          key: "fieldTypeDesc",
          title: "字段类型",
          align: "left",
          width: 100,
        },

        {
          key: "fieldDesc",
          title: "字段描述",
          align: "left",
          width: 100,
        },
        {
          key: "length",
          title: "字段长度",
          align: "left",
          width: 100,
        },
        {
          key: "requiredDesc",
          title: "是否必填",
          align: "left",
          width: 100,
        },
        {
          key: "remark",
          title: "备注",
          align: "left",
          width: 200,
        },
        {
          key: "operation",
          title: "操作",
          width: 150,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let index = params.index;
            let { id, fieldType, bizType } = params.row;
            return (
              <div>
                <span
                  title="编辑"
                  onClick={this.editAttr.bind(this, index)}
                  style="color: #298DFF"
                  class="iconfont tab-icon-btn icon-t-b-message"
                ></span>
                <span
                  title="检验规则"
                  onClick={this.editRuleVerify.bind(this, id, bizType)}
                  style="color: #298DFF"
                  class="iconfont tab-icon-btn icon-settings"
                ></span>
                {fieldType == 2 || fieldType == 7 ? (
                  <span
                    title="替换规则"
                    onClick={this.editReplaceRule.bind(this, index)}
                    style="color: #298DFF"
                    class="iconfont tab-icon-btn icon-ios-copy-outline"
                  ></span>
                ) : null}
                <span
                  title="删除"
                  onClick={this.deleteAttr.bind(this, index)}
                  style="color: #F5222D"
                  class="iconfont tab-icon-btn icon-t-b-delete"
                ></span>
              </div>
            );
          },
        },
      ],
      formValue: {
        id: "", //字段id
        bizType: "",
        fieldName: "", //字段名
        fieldCode: "", //字段编码
        fieldType: 2, //字段类型，1数字，2文本，3日期，4金额
        bizGroupCode: "",
        required: 0, //是否必填，1是，0否
        fieldDesc: "", //字段描述
        length: "", //字段长度
        remark: "", //备注
        defaultValue: "", //枚举类型
        fieldGroupType: 1,
      },
      configModalShow: false,
      isRuleAdd: false,
      verifyModalShow: false,
      verfiyList: [{}],
      replaceModalShow: false,
      rules: [],
      selectionIndex: -1,
      verifyDict: {},
    };
  },
  computed: {
    selectionItem() {
      return this.commonTableDatas[this.selectionIndex];
    },
  },
  methods: {
    // handleDbclick(data) {
    //   this.configModalShow = true;
    // },
    onPageChange(current) {
      this.pagination.currentPage = current;
      this.getInfoList();
    },
    onPageSizeChange(size) {
      this.pagination.pageSize = size;
      this.getInfoList();
    },
    addFn() {
      this.isRuleAdd = true;
      this.configModalShow = true;
      this.formValue = {
        id: "", //字段id
        bizType: "",
        fieldName: "", //字段名
        fieldCode: "", //字段编码
        fieldType: 2, //字段类型，1数字，2文本，3日期，4金额
        bizGroupCode: "",
        required: 0, //是否必填，1是，0否
        fieldDesc: "", //字段描述
        length: "", //字段长度
        remark: "", //备注
        defaultValue: "", //枚举类型
        fieldGroupType: 1,
      };
      this.$refs.configModal && this.$refs.configModal.resetFields();
    },
    editAttr(index) {
      this.isRuleAdd = false;
      this.configModalShow = true;
      this.formValue = copyDeep(this.commonTableDatas[index]);
      this.$refs.configModal && this.$refs.configModal.resetFields();
    },
    changeAttr(obj) {
      savaOrModifyAttr(obj)
        .then((data) => {
          this.configModalShow = false;
          this.getInfoList();
          this.$hMessage.success("修改成功");
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
        });
    },
    addAttr(obj) {
      savaOrModifyAttr(obj)
        .then((data) => {
          this.configModalShow = false;
          this.getInfoList();
          this.$hMessage.success("添加成功");
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
        });
    },
    handleDelete(url, id) {
      this.$http
        .get(url)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            this.$hMessage.success({
              content: "删除成功",
              duration: 3,
            });
            this.handleSearch();
          } else {
            this.$hMessage.error({ content: data.msg });
          }
          this.tableLoading = false;
        })
        .catch((err) => {
          this.$hLoading.error();
          this.tableLoading = false;
        });
    },
    getInfoList() {
      this.tableLoading = true;
      if (!this.tableLoading) return;
      let body = {
        ...this.searchData,
        ...this.pagination,
      };
      getAttrList(body)
        .then((data) => {
          let dataList = data.dataList || [];
          for (let item of dataList) {
            item.bizType = (item.bizType || "").toString();
          }
          this.commonTableDatas = dataList;
          this.total = data.totalSize;
          this.tableLoading = false;
        })
        .catch((error) => {
          this.tableLoading = false;
          this.$hMessage.error({ content: error.content });
        });
    },
    getBizType() {
      let url = "/pic/audit/sys/getDict?dictCode=BIZ_TYPE";
      this.$http
        .get(url)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            this.bizTypeList = data.body.dictList || [];
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch((err) => {
          this.$hLoading.error("获取业务类别失败！");
        });
    },
    getFieldTypeList() {
      let url = "/pic/audit/sys/getDict?dictCode=TMPL_FIELD_TYPE";
      this.$http
        .get(url)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            this.fieldTypeList = data.body.dictList || [];
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch((err) => {
          this.$hLoading.error("获取业务类别失败！");
        });
    },
    getBizGroupList(value='') {
      let body = {
        bizType: value
      };
      getTempGroups(body)
        .then((data) => {
          this.bizGroupList = data.bizGroups || [];
        })
        .catch((err) => {
          this.$hLoading.error(err.content);
        });
    },
    getDictItem() {
      let url = "/pic/audit/sys/getDictItem";
      this.$http
        .get(url)
        .then((res) => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            this.DictItem = oTmp.body.dictItem || {};
          } else {
            this.$hMessage.error(oTmp.msg);
          }
        })
        .catch((err) => {
          this.$hMessage.error("网络错误，获取枚举类型失败");
        });
    },
    getSearchDict() {
      let url = "/pic/audit/sys/getDict?dictCode=CONSTANT_SEARCH_TYPE";
      this.$http
        .get(url)
        .then((res) => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            let list = oTmp.body.dictList || [];
            this.SearchDict = list;
          } else {
            this.$hMessage.error(oTmp.msg);
          }
        })
        .catch((err) => {
          this.$hMessage.error("网络错误，获取常量搜索项下拉框失败");
        });
    },

    editRuleVerify(fieldId, bizType) {
      let body = {
        fieldId: fieldId,
        bizType: bizType,
      };
      getFieldVerify(body)
        .then((data) => {
          this.verifyModalShow = true;
          this.verfiyList = data.verifyRules || [];
          let verifyDict = {
            fieldId: fieldId,
            bizType: bizType,
          };
          this.verifyDict = verifyDict;
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
        });
    },
    closeVerifyModal() {
      this.verifyModalShow = false;
    },
    saveVerifyRule() {
      this.$refs.verifycation.checkTable((pass, allData) => {
        if (pass) {
          // 修改校验规则接口
          let { bizType, fieldId } = this.verifyDict;
          let body = {
            bizType: bizType,
            fieldId: fieldId,
            verifyRules: allData,
          };
          saveOrModifyVerifyRule(body)
            .then((data) => {
              this.$hMessage.success("修改成功");
              this.verifyModalShow = false;
            })
            .catch((error) => {
              this.$hMessage.error(error.content);
            });
        }
      });
    },
    addVerify(value, dataList) {
      dataList.push({});
      this.verfiyList = dataList;
    },
    deleteVerify(index, dataList) {
      dataList.splice(index, 1);
      this.verfiyList = dataList;
    },
    deleteRule(index) {
      this.$hMsgBox.confirm({
        isOkLeft: true,
        title: "提示",
        content: "是否删除该条替换规则",
        onOk: () => {
          this.rules.splice(index, 1);
        },
      });
    },
    addRule() {
      let { fieldId, bizType, fieldName } = this.selectionItem;
      this.rules.push({
        oldStr: "",
        newStr: "",
        id: "",
        fieldName: fieldName,
      });
    },
    editReplaceRule(index) {
      this.selectionIndex = index;
      let { id } = this.commonTableDatas[index];
      let body = {
        fieldId: id,
      };
      getRepRuleInfos(body)
        .then((data) => {
          for (let i = 0; i < this.rules.length; i++) {
            let formPass = this.$refs[`replaceForm${i}`][0].$refs[
              "replaceForm"
            ].resetFields();
          }
          this.replaceModalShow = true;
          this.rules = data.repRules || [];
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
        });
    },
    closeReplaceModal() {
      this.replaceModalShow = false;
    },
    changeReplaceRule() {
      let pass = true;
      for (let i = 0; i < this.rules.length; i++) {
        let formPass = this.$refs[`replaceForm${i}`][0].$refs[
          "replaceForm"
        ].validate((valid) => {
          if (!valid) {
            pass = false;
          }
        });
      }
      if (pass) {
        // 修改规则
        let { id, bizType } = this.selectionItem;
        let body = {
          bizType: bizType,
          fieldId: id,
          repRules: this.rules,
        };
        saveOrModifyRule(body)
          .then((data) => {
            this.replaceModalShow = false;
            this.$hMessage.success("修改成功");
          })
          .catch((error) => {
            this.$hMessage.error(error.content);
          });
      }
    },
    deleteAttr(index) {
      let { id, fieldName } = this.commonTableDatas[index];
      this.$hMsgBox.confirm({
        isOkLeft: true,
        title: "提示",
        content: `是否删除${fieldName}字段`,
        onOk: () => {
          let body = {
            id: id,
          };
          removeRule(body)
            .then((data) => {
              this.$hMessage.success("删除成功");
              this.getInfoList();
            })
            .catch((error) => {
              this.$hMessage.error(error.content);
            });
        },
      });
    },
    getBizGroupTypeList() {
      let body = {
        dictCode: "FIELD_GROUP_TYPE",
      };
      getDictList(body)
        .then((data) => {
          this.fieldGroupTypeList = data.dictList || [];
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
        });
    },
    bizTypeChange(value) {
      this.getBizGroupList(value)
    },
  },
  mounted() {
    this.getBizGroupTypeList();
    this.getBizType();
    this.getFieldTypeList();
    this.getBizGroupList();
    this.getDictItem();
    this.getSearchDict();
    this.getInfoList();
  },
  activated: function () {
    if (this.isAutoRefreshTable) {
      this.getInfoList();
    }
  },
};
</script>

<style>
</style>