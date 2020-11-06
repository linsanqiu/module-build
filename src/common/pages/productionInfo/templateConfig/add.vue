<template>
  <div ref="templateConfig" class="templateConfig">
    <div>
      <dl>
        <dt>业务类型：</dt>
        <dd>
          <Select
            v-model="req.bizType"
            :disabled="req && req.id ? true : false"
            placeholder="请选择业务类型"
            style="width: 242px"
            not-found-text="无"
            @on-change="changeBizType"
          >
            <Option
              v-for="(option, index) in bizTypeList"
              :value="option.entryValue"
              :key="option.entryOrder"
            >{{ option.entryName }}
            </Option>
          </Select>
        </dd>
      </dl>
      <dl>
        <dt>公告类别：</dt>
        <dd>
          <Select
            v-model="req.anncType"
            :disabled="req && req.id ? true : false"
            placeholder="请选择模板"
            style="width: 242px"
            not-found-text="无"
          >
            <Option
              v-for="(option, index) in template"
              :value="option.entryValue"
              :key="option.entryValue"
              v-if="(req && req.id) || option.status == 0"
            >{{ option.entryName }}
            </Option>
          </Select>
          <span
            class="red"
            v-if="(!req || !req.id) && NotSelectedtemplate.length == 0 && isShowTips"
          >当前没有新的公告类型，无法添加模板。</span>
        </dd>
      </dl>
      <dl>
        <dt></dt>
        <dd>
          <h-button type="info" @click="onImport">导入模板数据</h-button>
          <h-button type="info" @click="addGroup">新增分组</h-button>
        </dd>
      </dl>
      <dl>
        <dt>模板配置：</dt>
        <dd>
          <div class="config-wrapper" v-for="(item,k) in configs" :key="k">
            <div>
              <h-form
                :ref="'detailForms'+k"
                :model="item"
                label-position="right"
                :label-width="80"
                @submit.native.prevent
              >
                <h-form-item
                  label="业务属性："
                  :rules="{ validator: (rule, value, callback)=>{ validateDefaultValue(rule, item.bizGroupCode, callback, k)
								}, trigger:'blur'}"
                  prop="name"
                >
                  <Select
                    class="grouping"
                    v-model="item.bizGroupCode"
                    placeholder="请选择业务属性"
                    :clearable="false"
                    :disabled='configs[k].rowList.length > 0 || configs[k].colList.length > 0 || !req.bizType'
                    @on-change='bizGroupCodeChange($event, k)'
                  >
                    <Option
                      v-for="(option, index) in bizGroups"
                      :value="option.bizGroupCode"
                      :key="index"
                    >{{ option.bizGroupName }}
                    </Option>
                  </Select>
                  <span
                    v-if='configs.length > 1'
                    title="删除"
                    @click="deleteGroup(k, item)"
                    style="color: #F5222D"
                    class="iconfont tab-icon-btn icon-t-b-delete"
                  ></span>
                </h-form-item>
              </h-form>
            </div>
            <config
              v-model="configs[k]"
              :index="k"
              :bizTmplGroups="bizGroups"
              :bizTypeList='bizTypeList'
              :fieldTypeList="fieldType"
              :attrList='bizGroups'
              :DictItem="DictItem"
              :SearchDict="SearchDict"
              :bizGroupTypeList='bizGroupTypeList'
            ></config>
          </div>
        </dd>
      </dl>
      <!-- <dl>
				<dt>替换规则：</dt>
				<dd>
					<div v-for='(rule, index) in rules' :key='index'>
						<ReplaceRules :rule='rule'>
							<div slot='deleteBtn' @click='deleteRule(index)' class="deleteBtn">删除</div>
						</ReplaceRules>
					</div>
					<h-button type="info" style="width:100%;" @on-click="addRule">+</h-button>
				</dd>
			</dl>
			<dl>
				<dt>前台校验：</dt>
				<dd>
					<Verification
						:dataList='verfiyList'
						@addVerify='addVerify'
						@editVerify='editVerify'
						@deleteVerify='deleteVerify'
					></Verification>
				</dd>
      </dl>-->
    </div>
    <div class="btn">
      <h-button
        type="info"
        :disabled="!(req.anncType && configs[0] && (configs[0].rowList.length > 0 || configs[0].colList.length >0))"
        @click="onSubmit()"
      >保存
      </h-button>
      <h-button
        type="info"
        :disabled="!(configs[0] && (configs[0].rowList.length > 0 || configs[0].colList.length >0))"
        @click="onSubmit(true)"
      >预览
      </h-button>
    </div>
    <h-msgBox
      title="预览"
      v-model="isPreview"
      @on-close
      class-name="vertical-center-modal"
      :top="0"
      width="820"
    >
      <div class="preview-msg-box">
        <template v-if="isPreview">
          <tableTem :templateData="previewData" :tableTemplateData="[]" :tableType="req.type"></tableTem>
        </template>
      </div>
      <div slot="footer"></div>
    </h-msgBox>
    <h-msgBox
      title="导入模板数据"
      v-model="isImportMsg"
      @on-close
      class-name="vertical-center-modal"
      :top="0"
      width="820"
    >
      <div class="import-msg-box">
        <div>
          <h-table
            class="full-max-height-table"
            size="small"
            :maxHeight="350"
            :columns="commonTableCols"
            :data="commonTableDatas"
            :highlight-row="false"
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
        <h-spin fix v-if="tableLoading">
          <h-icon name="load-c" size="18" class="h-load-loop"></h-icon>
          <div>加载中...</div>
        </h-spin>
      </div>
      <div slot="footer"></div>
    </h-msgBox>
    <h-spin fix v-if="isLoading">
      <h-icon name="load-c" size="18" class="h-load-loop"></h-icon>
      <div>加载中...</div>
    </h-spin>
  </div>
</template>
<script type="text/javascript">
import tableTemplate from "@/components/tableTemplate";
import tableTem from "../components/table";
import config from "../components/config";
import Verification from "../components/verification";
import ReplaceRules from "../components/replaceRules";
import $ from "jquery";
import {copyDeep} from "@/filters/index";
import {
  getTempGroups,
  getDictList
} from "../api/apiManager";

export default {
  name: "ProductionInfoTemplateConfigAdd",
  components: {tableTemplate, config, tableTem, Verification, ReplaceRules},
  data() {
    return {
      maxSum: 100,
      template: [],
      NotSelectedtemplate: [],
      isShowTips: false,
      configs: [
        {
          rowList: [],
          colList: [],
          bizGroupCode: "",
          bizGroupType: "",
        },
      ],
      alltemplate: [],
      rowList: [],
      colList: [],
      isMenu: false,
      itemName: "",
      isShowSave: false,
      activeItem: "",
      activeInex: "",
      isDisabled: "",
      req: {
        id: "",
        anncType: "",
        bizType: "",
        groupList: [],
      },
      previewData: [],
      isPreview: false,
      isLoading: false,
      isMax: false,
      DictItem: {},
      SearchDict: [],
      bizTypeList: [],
      bizTypeObj: {},
      isImportMsg: false,
      commonTableCols: [
        {
          key: "bizName",
          title: "业务类型",
          align: "left",
        },
        {
          key: "anncName",
          title: "公告类别",
          align: "left",
        },
        {
          key: "modifierName",
          title: "修改人",
          width: 200,
          align: "center",
        },
        {
          key: "operation",
          title: "操作",
          width: 80,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let row = params.row;

            let btn = h("span", {
              attrs: {
                title: "导入",
              },
              class: ["icon-reply", "iconfont", "tab-icon-btn"],
              on: {
                click: () => {
                  this.getImport({
                    anncType: row.anncType,
                    bizType: row.bizType,
                  });
                },
              },
            });
            return h(
              "div",
              {
                class: ["tab-operation"],
              },
              [btn]
            );
          },
        },
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        anncType: "",
        bizType: "",
      },
      pageSizeOpts: [10, 20, 50, 100],
      total: 0,
      commonTableDatas: [],
      tableLoading: false,
      fieldType: [],
      // rules: [
      // 	{
      // 		before:'aaa',
      // 		after: 'bbb'
      // 	}
      // ],
      // verfiyList: [],
      bizGroups: [],
      bizGroupTypeList: [],
    };
  },
  methods: {
    validateName(index, name) {
      for (let k = 0, len = this.configs.length; k < len; k++) {
        if (index != k) {
          let a = this.configs[k].rowList;
          let b = this.configs[k].colList;
          for (let i = 0, len = a.length; i < len; i++) {
            if (a[i].fieldName == name) {
              return true;
            }
          }
          for (let i = 0, len = b.length; i < len; i++) {
            if (b[i].fieldName == name) {
              return true;
            }
          }
        }
      }
      return false;
    },
    del(k) {
      this.configs.splice(k, 1);
    },
    validateDefaultValue(rule, value, callback, index) {
      for (let k = 0, len = this.configs.length; k < len; k++) {
        if (value == this.configs[k].bizGroupCode && index != k && value) {
          callback(new Error("已存在"));
          return;
        }
      }
      callback();
    },
    addGroup() {
      this.configs.push({
        bizGroupCode: "",
        bizGroupType: "",
        colList: [],
        rowList: [],
        bizGroupName: "",
      });
    },
    closeImport() {
      this.isImportMsg = false;
    },
    getImport(obj) {
      if (this.tableLoading) return;
      this.tableLoading = true;
      this.getDetail(true, obj, (data) => {
        this.tableLoading = false;
        if (data) {
          this.closeImport();
        }
      });
    },
    onPageChange(current) {
      this.pagination.currentPage = current;
      this.getInfoList();
    },
    onPageSizeChange(size) {
      this.pagination.pageSize = size;
      this.onPageChange(1);
    },
    getInfoList(go = false) {
      if (this.tableLoading && !go) return;
      this.tableLoading = true;
      let url = "/pic/audit/tmpl/listByPage";
      this.pagination.bizType = this.req.bizType
      // this.pagination.anncType = this.req.anncType
      this.$http
        .post(url, this.pagination)
        .then((res) => {
          let obj = res.data;
          if (obj.status == this.$api.SUCCESS) {
            let data = obj.body || {};
            let total = data.totalSize || 0;
            if (total && (!data.dataList || data.dataList.length == 0)) {
              this.pagination.currentPage = Math.ceil(
                total / this.pagination.pageSize
              );
              this.getInfoList(true);
              return;
            }
            this.commonTableDatas = data.dataList || [];
            this.total = total;
          } else {
            this.$hMessage.error({content: data.msg});
          }
          this.tableLoading = false;
        })
        .catch((err) => {
          this.$hLoading.error();
          this.tableLoading = false;
        });
    },
    onImport() {
      this.getInfoList()
      this.isImportMsg = true;
    },
    changeBizType(value) {
      this.configs.forEach(item => {
        item.bizGroupCode = ''
      })
      if (!value) return
      this.template = this.bizTypeObj[value.toString()];
    },
    // 获取业务属性
    getBizGroups() {
      getTempGroups({}).then(
        data => {
          this.bizGroups = data.bizGroups || []
        }
      ).catch(
        error => {
          this.$hMessage.error(error.content)
        }
      )
    },
    bizGroupCodeChange(value, index) {
      if (this.bizGroups.length == 0) {
        return
      }
      let bizGroupType = 1
      let bizGroupName = ''
      for (let item of this.bizGroups) {
        if (item.bizGroupCode == value) {
          bizGroupType = item.bizGroupType
          bizGroupName = item.bizGroupName
        }
      }
      this.configs[index].bizGroupName = bizGroupName
      this.configs[index].bizGroupType = bizGroupType
    },
    getBizGroupTypeList() {
      let body = {
        dictCode: 'FIELD_GROUP_TYPE',
      };
      getDictList(body).then(
        data => {
          this.bizGroupTypeList = data.dictList || []
        }
      ).catch(
        error => {
          this.$hMessage.error(error.content)
        }
      )
    },
    verifyConfigs(isPreview) {
      for (let k = 0, len = this.configs.length; k < len; k++) {
        let colList = this.configs[k].colList;
        let rowList = this.configs[k].rowList;
        for (let i = 0, lens = colList.length; i < lens; i++) {
          if (!colList[i].fieldCode) {
            this.$hMessage.error("有字段属性未填写，请检查。");
            return;
          }
        }
        for (let i = 0, lens = rowList.length; i < lens; i++) {
          if (!rowList[i].fieldCode) {
            this.$hMessage.error("有字段属性未填写，请检查。");
            return;
          }
        }
      }
      if (isPreview) {
        this.previewData = copyDeep(this.configs);
        this.isPreview = true;
      } else {
        this.setSubmit();
      }
    },
    onSubmit(isPreview = false) {
      let configs = this.configs;
      let okSum = 0;
      let len = configs.length;
      if (len == 0) {
        this.$hMessage.error("请先添加分组模板配置");
        return;
      }
      for (let k = 0; k < len; k++) {
        let name = "detailForms" + k;
        this.$refs[name][0].validate((valid) => {
          okSum += 1;
          if (okSum == len) {
            this.verifyConfigs(isPreview);
          }
        });
      }
    },
    setSubmit() {
      if (this.isLoading) return;
      this.isLoading = true;
      let url = "/pic/audit/tmpl/saveOrModify";
      let submitData = {
        ...this.req,
        groupList: this.configs,
      };
      this.$http
        .post(url, submitData)
        .then((res) => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            this.$hMessage.success("保存成功");
            this.cancel();
          } else {
            this.$hMessage.error(oTmp.msg);
          }
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.$hMessage.error("网络错误，保存失败！");
        });
    },
    getDetail(isImport = false, obj = null, cb = null) {
      let anncType = this.req.anncType;
      let bizType = this.req.bizType;
      if (isImport && obj) {
        anncType = obj.anncType;
        bizType = obj.bizType;
        this.$set(this.req, 'bizType', bizType.toString())
      } else {
        if (this.isLoading) return;
        this.isLoading = true;
      }
      let url =
        "/pic/audit/tmpl/getTmplInfo?anncType=" +
        anncType +
        "&bizType=" +
        bizType;
      this.$http
        .get(url)
        .then((res) => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            let data = oTmp.body || {};
            if (isImport && obj) {
            } else {
              data.anncType = data.anncType ? data.anncType.toString() : "";
              data.bizType = data.bizType ? data.bizType.toString() : "";
              this.req = data;
              if (data.bizType) {
                this.template = this.bizTypeObj[data.bizType.toString()] || [];
              }
            }
            if (!data.groupList || data.groupList.length == 0) {
              this.configs = [{bizGroupCode: "", colList: [], rowList: []},]
            } else {
              this.configs = copyDeep(data.groupList)
            }
            if (cb) {
              cb(true);
            }

          } else {
            if (cb) {
              cb(false);
            }
            this.$hMessage.error(oTmp.msg);
          }
          this.isLoading = false;
        })
        .catch((err) => {
          if (cb) {
            cb(false);
          }
          this.isLoading = false;
          this.$hMessage.error("网络错误，获取详情失败");
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
    getBizType() {
      let url = "/pic/audit/tmpl/getTmplDictTree";
      this.$http
        .get(url)
        .then((res) => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            let list = oTmp.body.tmplDictTree || [];
            for (let i = 0, len = list.length; i < len; i++) {
              this.bizTypeObj[list[i].entryValue] = list[i].children || [];
            }
            this.bizTypeList = list;
            if (this.req.bizType) {
              this.template =
                this.bizTypeObj[this.req.bizType.toString()] || [];
            }
          } else {
            this.$hMessage.error(oTmp.msg);
          }
        })
        .catch((err) => {
          this.$hMessage.error("网络错误，获取业务类型失败");
        });
    },
    setRouteName(pathName) {
      this.$store.commit("SAVE_TAB_NAME", {
        path: this.$route.path,
        name: pathName,
      });
    },
    init() {
      let {anncType, bizType} = this.$route.query;
      if (anncType) {
        this.setRouteName("【编辑】公告模板");
        if (this.req.anncType == anncType && this.req.bizType == bizType)
          return;
        this.req.anncType = anncType;
        this.req.bizType = bizType;
        this.getDetail();
      } else {
        this.setRouteName("【新增】公告模板");
        if (this.req.anncType == "") return;
        (this.req = {
          id: "",
          anncType: "",
          type: "",
          tmplFieldList: [],
          bizType: "",
        }),
          (this.configs = [
            {
              rowList: [],
              colList: [],
              bizGroupCode: "",
              bizGroupType: 1,
            },
          ]);
      }
    },
    //取消
    cancel() {
      // this.$store.commit("DEL_TAB", this.$route.path);
      // this.$router.push("/productionInfo/templateConfig/list");
    },
    getDict() {
      let url = "/pic/audit/sys/getDict?dictCode=TMPL_FIELD_TYPE";
      this.$http
        .get(url)
        .then((res) => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            let list = oTmp.body.dictList || [];
            this.fieldType = list;
          } else {
            this.$hMessage.error(oTmp.msg);
          }
        })
        .catch((err) => {
          this.$hMessage.error("网络错误，获取字段格式失败");
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
    deleteGroup(index, item) {
      this.$hMsgBox.confirm({
        isOkLeft: true,
        title: '删除业务分组',
        content: `是否删除${item.bizGroupName}业务分组`,
        onOk: () => {
          this.configs.splice(index, 1)
        }
      })
    }
    // deleteRule(index){
    // 	this.$hMsgBox.confirm({
    // 		isOkLeft:true,
    // 		title: '提示',
    // 		content: '是否删除该条替换规则',
    // 		onOk: () => {
    // 			this.rules.splice(index, 1)
    // 		}
    // 	})
    // },
    // addRule(){
    // 	this.rules.push(
    // 		{
    // 			after:'',
    // 			before: '',
    // 		}
    // 	)
    // },
    // addVerify(formData ){
    // 	this.verfiyList.push(formData)
    // },
    // editVerify(formData, index){
    // 	this.verfiyList.splice(index, 1, formData)
    // },
    // deleteVerify(index){
    // 	this.verfiyList.splice(index, 1)
    // }
  },
  mounted() {
    this.getBizGroupTypeList()
    this.getBizGroups();
    this.getBizType();
    this.getDictItem();
    this.getInfoList();
    this.init();
    this.getDict();
    this.getSearchDict();
  },
  activated: function () {
    this.init();
  },
};
</script>
<style type="text/css" scoped>
dl + dl {
  margin-top: 20px;
}

dt,
dd {
  display: inline-block;
  vertical-align: top;
}

dt {
  line-height: 30px;
  width: 60px;
}

dd {
  width: calc(100% - 64px);
}

.table-box {
  position: relative;
}

.table-wrapper {
  overflow-x: auto;
}

.table-wrapper-max table {
  width: 100%;
}

table {
  table-layout: fixed;
}

table td {
  border: 1px solid #dce1e7;
  width: 120px;
  height: 30px;
  text-align: center;
}

table thead td:first-child {
  background: #fff;
}

td div {
  height: 100%;
  width: 100%;
  line-height: 30px;
  position: relative;
}

td div span {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  padding: 0 3px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu {
  position: absolute;
  padding: 5px 10px;
  line-height: 22px;
  z-index: 99;
  background-color: #fff;
  border-radius: 2px;
  border: 1px solid #dfdfdf;
  box-shadow: 1px 1px 2px #ccc;
  color: #000;
}

.menu li:hover {
  color: #2e71f2;
  cursor: pointer;
}

.menu li.disabled,
.menu li.disabled:hover {
  color: #ccc;
  cursor: auto;
}

.add {
  background: #2e71f2;
  color: #fff;
  cursor: pointer;
}

.btn {
  padding: 20px;
  text-align: center;
}

td div {
  background: palegreen;
}

td div.err {
  background-color: rgb(244, 115, 120);
}

.red {
  color: red;
}

.templateConfig {
  min-height: 99%;
  position: relative;
}

.preview-msg-box {
  overflow: auto;
  max-height: 350px;
}

>>> .import-msg-box .tab-operation {
  transform: rotatex(180deg);
}

.config-wrapper {
  padding: 10px;
  border: 1px solid #dfdfdf;
}

.grouping {
  width: 200px;
}

.config-wrapper .icon-t-b-delete {
  margin-left: 5px;
  cursor: pointer;
}

.config-wrapper .icon-t-b-delete:hover {
  color: rgb(245, 34, 45);
}

.deleteBtn {
  color: #298dff;
  cursor: pointer;
}

.deleteBtn:hover {
  color: #0067dc;
}
</style>
