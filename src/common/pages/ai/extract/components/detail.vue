<template>
  <div class="bigContent">
      <div class="header-content">
        <div>解析html文件地址：<a :href="htmlLink" target="__blank" style="color: #298DFF">{{htmlLink}}</a></div>
      </div>

  <div class="detail">
    <div class="detail-left">
      <template v-if="src">
        <iframe ref="pdfIframe" :src="src" width="100%" height="100%" frameborder="0"></iframe>
      </template>
    </div>
    <div class="detail-right">
      <div class="table-bar">
        <h2>抽取结果</h2>
        <div v-if="list.length" class="switch">
          <h-switch v-model="extractTableType"
                    size="small"
                    :class="{'true-color': extractTableType, 'false-color': !extractTableType}"
          ></h-switch>
          <span>{{extractTableType ? '横向' : '竖向'}}</span>
        </div>
      </div>
      <div class="detail-table" :style="'height:' + maxTableHeight +'px'">
        <p v-if="!list.length">当前规则的抽取结果为空，请优化规则！</p>
        <div v-show="extractTableType">
          <h-table
            v-for="(item, k) in list"
            :key="k"
            no-data-text="当前规则的抽取结果为空，请优化规则！"
            size="small"
            :maxHeight="maxTableHeight -20"
            class="full-max-height-table"
            :columns="Table"
            :data="item"
            :highlight-row="false"
            border
          ></h-table>
        </div>
        <div v-show="!extractTableType">
          <h-table
            no-data-text="当前规则的抽取结果为空，请优化规则！"
            size="small"
            :maxHeight="maxTableHeight -50"
            class="full-max-height-table"
            :columns="verticalTable"
            :data="verticalList"
            :highlight-row="false"
            border
          ></h-table>
        </div>
      </div>
      <div class="pdf-detail-btn" v-if="isBtn">
        <template v-if="v">
          <!-- <h-button type="primary" @click="onSave(false)">保存</h-button> -->
          <h-button type="primary" @click="onChangeRule">规则入库</h-button>
          <h-button type="primary" @click="refreshTask">预览</h-button>
          <h-button type="primary" @click="onSave(true)">置为标准数据</h-button>
          <h-button type="primary" @click="judjeSame">下一篇</h-button>
        </template>
        <template v-else>
          <h-button type="primary" @click="onChangeRule">规则入库</h-button>
          <h-button type="primary" @click="getDetail()">预览</h-button>
          <h-button type="primary" @click="getNext">下一篇</h-button>
        </template>
      </div>
    </div>
    <h-spin fix v-if="isLoading">
      <h-icon name="load-c" size="18" class="h-load-loop"></h-icon>
      <div>加载中...</div>
    </h-spin>
    <h-msgBox
      title="修改规则"
      class-name="vertical-center-modal save-rule-msg"
      v-model="showMsgFn"
      :top="0"
      :mask-closable="false"
      width="820"
      :zIndex="999"
    >
      <ruleSetting
        ref="ruleSetting"
        :relyOnList="relyOnList"
        :strType="strType"
        :fnList="fnList"
        :fnIdDict="fnIdDict"
        :extractingRangeList="extractingRangeList"
        :ruleListDetail="ruleListDetail"
      ></ruleSetting>
      <div class="save-rule">
        <div class="title positionbox">
          字符定位
          <span @click="addPositionList" class="i add" title="新建"></span>
        </div>
        <div v-show="ruleListDetail.positionList && ruleListDetail.positionList.length > 0">
          <div class="position_tabs">
            <Tabs
              type="card"
              showArrow
              closable
              @on-click="onPositionTabs"
              @on-tab-remove="removePositionTabs"
              v-model="activePositionTabsKey"
            >
              <TabPane
                v-for="(tab,k) in ruleListDetail.positionList"
                :key="tab"
                :name="tab"
                :label="'定位' + (k+1)"
              ></TabPane>
            </Tabs>
          </div>
          <div class="position">
            <div class="list">
              <div class="title">
                目录定位
                <span @click="addPosition(1)" class="i add" title="新建"></span>
              </div>
              <div class="ztree-box">
                <p class="position-ps" v-show="activePosition.catalogPosition.length < 1">暂无数据</p>
                <ul
                  v-show="activePosition.catalogPosition.length"
                  :id="targetPositionTreeId"
                  class="ztree"
                ></ul>
              </div>
            </div>
            <div class="list">
              <div class="title">
                内容定位
                <span @click="addPosition(2)" class="i add" title="新建"></span>
              </div>
              <div class="ztree-box">
                <p class="position-ps" v-show="activePosition.contentPosition.length < 1">暂无数据</p>
                <ul
                  v-show="activePosition.contentPosition.length > 0"
                  :id="contentPositionTreeId"
                  class="ztree"
                ></ul>
              </div>
            </div>
          </div>
        </div>
        <div
          class="position-ps"
          v-show="!ruleListDetail.positionList || ruleListDetail.positionList.length == 0"
        >暂无数据</div>
      </div>
      <div slot="footer">
        <h-button type="text" @click="onSaveCancel">取消</h-button>
        <h-button type="info" @click="onSaveSubmit">保存</h-button>
      </div>
    </h-msgBox>
    <h-msgBox
      :title="positionName"
      v-model="isShowPositionBox"
      @on-close="onClosePositionMsgBox"
      class-name="vertical-center-modal"
      :top="0"
      width="620"
    >
      <div class="file-form">
        <h-form
          :model="positionContent"
          ref="positionForm"
          :rules="positionRule"
          label-position="right"
          :label-width="100"
          @submit.native.prevent
        >
          <h-form-item label="规则：" prop="text">
            <h-input type="textarea" v-model.trim="positionContent.text" :rows="6" placeholder="规则"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer" class="draggable-form-footer">
        <h-button @click="onClosePositionMsgBox">取消</h-button>
        <h-button @click="onSubmitPosition" type="primary">确定</h-button>
      </div>
    </h-msgBox>
  </div>
  </div>
</template>
<script>
require("@/assets/css/zTreeStyle.css");
require("@/assets/js/jquery-1.4.4.min.js");
require("@/assets/js/jquery.ztree.all.min.js");

/**
 * extract/rule/preview
 * extract/ personal test /preview
 */
import tagTextarea from "../components/tagTextarea";
import modalView from "../components/modalView";
import ruleSetting from "../components/ruleSetting";
import verticalTable from "../components/verticalTable";
import { copyDeep } from "@/filters/index";
export default {
  props: {
    data: Object,
    isBtn: {
      type: Boolean,
      default: true
    }
  },
  components: { tagTextarea, modalView, ruleSetting, verticalTable },
  data() {
    return {
      // 抽取表格类型  true 横向 false 竖向
      extractTableType: true,
      // 字符定位树 id
      targetPositionTreeId: 'targetPositionTree',
      contentPositionTreeId: 'contentPositionTree',
      htmlLink: "",
      src: "",
      Table: [],
      list: [],
      tmpList: [],
      v: "",
      ruleConfigId: "",
      fileMd5: "",
      isLoading: false,
      fileMd5s: [],
      fileId: "",
      trueData: [],
      isTrueArr: [],
      detail: {},
      showMsgFn: false,
      ruleListDetail: {
        fieldNumber: "1",
        fieldName: "#1",
        charType: "1",
        charTypeName: ["1"],
        fieldState: 1,
        fieldChName: "",
        fieldEnName: "",
        rules: [],
        positionList: [],
        filters: [],
        extractingRange: [],
        relyOnChar: ""
      },
      activePosition: {
        catalogPosition: [],
        contentPosition: []
      },
      activePositionTabsKey: "",
      ruleListContentRule: {},
      strType: [], //字符串类型
      extractingRangeList: [], // 抽取范围列表
      strTypeName: {},
      ruleContent: {
        ruleContent: {
          ruleList: [],
          positionRuleObj: {}
        }
      },
      positionName: "",
      isShowPositionBox: false,
      positionContent: {
        text: "",
        type: "",
        index: -1
      },
      positionRule: {
        text: [{ required: true, message: "请输入", trigger: "blur" }]
      },
      positionSetting: {
        data: {
          simpleData: {
            enable: true
          }
        },
        edit: {
          enable: true,
          showRemoveBtn: true,
          showRenameBtn: true,
          renameTitle: "编辑",
          removeTitle: "删除"
        },
        view: {
          showIcon: false,
          selectedMulti: false
        },
        callback: {
          beforeRemove: this.positionBeforeRemove,
          beforeEditName: this.positionBeforeEditName
        }
      },
      fnList: [],
      relyOnList: [],
      dataEnName: "",
      fnIdDict: {},
      verticalTableEditKey: '', // 竖向表格行内编辑下标
      horizontalTableEditKey: '', // 横向表格行内编辑下标
    };
  },
  computed: {
    maxTableHeight() {
      if (!this.isBtn) {
        return this.$store.state.maxTableHeight + 30;
      }
      return this.$store.state.maxTableHeight - 15;
    },
    verticalTable () {
      let tableSet = [];
      if (this.list.length) {
        const data = this.list[0];
        data.forEach((item, colIndex) => {
          let obj = {
            key: item.dataEnName,
            align: 'center',
            minWidth: 120,
            renderHeader: (h, params) => {
              return h(
                'div',
                {
                  style: {
                    wordBreak: 'break-all',
                    whiteSpace: 'wrap',
                    userSelect: 'none'
                  },
                  on: {
                    dblclick: () => {
                      this.dbClickRow(data[params.index])
                    }
                  }
                },
                [h(
                  "div",
                  {
                  },
                  item.dataName
                ),h(
                  "div",
                  {
                  },
                  item.dataEnName
                ),]
              )
            },
            render: (h, params) => {
              const { row } = params;
              const pageKey = `${row._index}_${colIndex}_pageCurrent`;
              const edit = `${row._index}_${colIndex}`
              const trueData = `${row._index}_${colIndex}_trueData`
              if (this.verticalTableEditKey === edit) {
                return h(
                  'Input',
                  {
                    props: {
                      type: "text",
                      value: row[trueData],
                      algin: 'center'
                    },
                    attrs: {
                      id: `${edit}_input`,
                      size: 'small'
                    },
                    style: {
                      display: 'inline-flex',
                      alignItems: 'center',
                      height: '30px'
                    },
                    on: {
                      input: (event) => {
                        this.tmpList[row._index][colIndex].trueData = event.replace(/(^\s*)|(\s*$)/g, "");
                        this.list[row._index][colIndex].trueData = event.replace(/(^\s*)|(\s*$)/g, "");
                      },
                      'on-blur': () => {
                        this.verticalTableEditKey = ''
                      }
                    }
                  }
                )
              }
              return h(
                'div',
                {
                  class: [],
                  style: {
                    minWidth: '100%',
                    minHeight: '20px',
                    cursor: this.v ? 'pointer' : 'default',
                    lineHeight: '20px'
                  },
                  on: {
                    click: () => {
                      this.onGoPDFPage(row[pageKey])
                    },
                    dblclick: () => {
                      if (this.v) {
                        this.verticalTableEditKey = edit;
                        setTimeout(() => {
                          this.$nextTick(() => {
                            document.getElementById(`${this.verticalTableEditKey}_input`).children[1].focus();
                          })
                        }, 10)
                      }
                    }
                  }
                },
                row[trueData]
              )
            }
          }
          tableSet.push(obj)
        })
      }
      return tableSet
    },
    verticalList () {
      let verticalList = [];
      if (this.list.length) {
        this.list.forEach((item, index) => {
          let obj = {
          };
          item.forEach((value, key) => {
            obj[`${index}_${key}_sourceStr`] = value.sourceStr;
            obj[`${index}_${key}_trueData`] = value.trueData;
            obj[`${index}_${key}_pageCurrent`] = value.pageCurrent;
          })
          verticalList.push(obj)
        })
      }
      return verticalList
    }
  },
  methods: {
    onChangeRule() {
      this.$hMsgBox.confirm({
        title: "温馨提示",
        content: "确定把预览规则更新到数据库？",
        onOk: () => {
          this.nextSave();
        }
      });
    },
    nextSave(close=false) {
      if (this.isLoading) return;
      this.isLoading = true;
      let ruleId = this.ruleId && this.ruleId != -1 ? this.ruleId : "";
      let url =
        "/tm/singlePreview/saveCacheRule?cacheId=" +
        this.ruleConfigId +
        "&ruleId=" +
        ruleId;
      if (this.v) {
        // 如果是个人测试页面
        url = `/tm/taskPreview/saveCacheTaskRule?taskId=${this.ruleConfigId}`;
      }
      this.$http
        .get(url)
        .then(res => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            this.setMsgContent(false);
            this.isLoading = false;
            this.ruleId = oTmp.body.id;
            this.$hMessage.success("保存成功");
            if (this.v || close) {
              return;
            }
            this.$router.push(
              "/extract/rule/preview?ruleConfigId=" +
                this.ruleConfigId +
                "&fileMd5=" +
                this.fileMd5 +
                "&ruleId=" +
                this.ruleId
            );
          } else {
            this.isLoading = false;
            this.$hMessage.error(oTmp.msg);
          }
        })
        .catch(err => {
          this.isLoading = false;
          this.$hMessage.error("网络错误，保存规则失败！");
        });
    },
    onSaveCancel() {
      this.showMsgFn = false;
    },
    onSaveSubmit() {
      if (this.isLoading) return;
      this.isLoading = true;
      let ruleContent = {
        ruleObj: this.ruleListDetail,
        positionRuleObj: this.ruleContent.ruleContent.positionRuleObj
      };
      ruleContent = JSON.stringify(ruleContent);
      let obj = {
        cacheId: this.ruleConfigId,
        fieldEnName: this.dataEnName,
        ruleContent: ruleContent
      };
      let url = "/tm/singlePreview/saveCacheFieldRule";
      // 如果是测试页进入
      if (this.v) {
        url = "/tm/taskPreview/cacheTaskFieldRule";
      }
      this.$http
        .post(url, obj)
        .then(res => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            this.$hMessage.success("保存成功");
            this.onSaveCancel();
            this.setMsgContent(true);
          } else {
            this.$hMessage.error(oTmp.msg);
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
          this.$hMessage.error("网络错误，保存规则失败！");
        });
    },
    // 设置关闭页面弹窗
    setMsgContent(isShow) {
      let _this = this;
      let obj = {
        url: this.$route.path,
        show: isShow,
        okText: '保存',
        cancelText: '关闭',
        isCloseUrl: true,
        msg: "抽取规则有修改，是否保存？",
        fn: () => {
          _this.nextSave(true);
        }
      };
      this.$store.commit("SET_TAB_MSG", obj);
    },
    getFnList() {
      let url = "/tm/ruleFunc/getTree";
      this.$http
        .get(url)
        .then(res => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            this.fnList = oTmp.body.data || [];
            this.delTree(this.fnList);
          } else {
            this.$hMessage.error(oTmp.msg);
          }
        })
        .catch(err => {
          this.$hMessage.error("获取函数失败");
        });
    },
    delTree(fnList) {
      let fnIdDict = {};
      for (let item of fnList) {
        let children = item.children;
        for (let _item of children) {
          let id = _item.id;
          _item.selectValue = [item.value, _item.value];
          fnIdDict[id] = _item;
        }
      }
      this.fnIdDict = fnIdDict;
    },
    positionBeforeRemove(treeId, treeNode) {
      let pId = treeNode.pId ? treeNode.pId : 0;
      if (treeId == this.targetPositionTreeId) {
        this.activePosition.catalogPosition.splice(pId);
        this.creationTargetTree();
      } else {
        this.activePosition.contentPosition.splice(pId);
        this.creationContentTree();
      }
      return false;
    },
    positionBeforeEditName(treeId, treeNode) {
      let pId = treeNode.pId ? treeNode.pId : 0;
      let type = 2;
      this.positionName = "内容定位";
      if (treeId.includes('targetPositionTree')) {
        this.positionName = "目录定位";
        type = 1;
      }
      this.positionContent = {
        text: treeNode.name,
        type: type,
        index: pId
      };
      this.isShowPositionBox = true;
      return false;
    },
    onClosePositionMsgBox() {
      this.positionContent = {
        text: "",
        type: "",
        index: -1
      };
      this.$refs["positionForm"].resetFields();
      this.isShowPositionBox = false;
    },
    addPosition(type) {
      this.positionName = "内容定位";
      if (type === 1) {
        this.positionName = "目录定位";
      }
      this.positionContent = {
        text: "",
        type: type,
        index: -1
      };
      this.$refs["positionForm"].resetFields();
      this.isShowPositionBox = true;
    },
    onSubmitPosition() {
      this.$refs["positionForm"].validate(valid => {
        if (valid) {
          let id = this.activePositionTabsKey;
          if (this.positionContent.type == 1) {
            if (this.positionContent.index >= 0) {
              this.activePosition.catalogPosition[
                this.positionContent.index
              ] = this.positionContent.text;
            } else {
              this.activePosition.catalogPosition.push(
                this.positionContent.text
              );
            }
            this.ruleContent.ruleContent.positionRuleObj[
              id
            ].catalogPosition = copyDeep(this.activePosition.catalogPosition);
            this.creationTargetTree();
            this.onClosePositionMsgBox();
          } else {
            if (this.positionContent.index >= 0) {
              this.activePosition.contentPosition[
                this.positionContent.index
              ] = this.positionContent.text;
            } else {
              this.activePosition.contentPosition.push(
                this.positionContent.text
              );
            }
            this.ruleContent.ruleContent.positionRuleObj[
              id
            ].contentPosition = copyDeep(this.activePosition.contentPosition);
            this.creationContentTree();
            this.onClosePositionMsgBox();
          }
        }
      });
    },
    formattingPositionArr(content) {
      let ary = copyDeep(content);
      let arr = [];
      for (let i = 0, len = ary.length; i < len; i++) {
        let obj = {
          pId: i,
          id: i + 1,
          name: ary[i],
          open: true
        };
        arr.push(obj);
      }
      return arr;
    },
    removePositionTabs(name) {
      let index = this.ruleListDetail.positionList.indexOf(name);
      if (index != -1) {
        this.ruleListDetail.positionList.splice(index, 1);
      }
      if (this.ruleContent.ruleContent.positionRuleObj[name]) {
        delete this.ruleContent.ruleContent.positionRuleObj[name];
      }
      this.changePositionData();
    },
    changePositionData() {
      let data = {};
      if (this.activePositionTabsKey && this.activePositionTabsKey > -1) {
        data = this.ruleContent.ruleContent.positionRuleObj[
          this.activePositionTabsKey
        ];
      }
      this.activePosition.catalogPosition = data.catalogPosition || [];
      this.activePosition.contentPosition = data.contentPosition || [];
      this.$nextTick(() => {
        this.creationTargetTree();
        this.creationContentTree();
      })
    },
    onPositionTabs(name) {
      this.activePositionTabsKey = name;
      this.changePositionData();
    },
    addPositionList() {
      let id = new Date().getTime().toString();
      if (!this.ruleListDetail.positionList) {
        this.ruleListDetail.positionList = [];
      }
      this.ruleListDetail.positionList.push(id);
      this.activePositionTabsKey = id;
      //this.changeRule();
      this.ruleContent.ruleContent.positionRuleObj[id] = {
        positionName: "",
        catalogPosition: [],
        contentPosition: []
      };
      this.changePositionData();
    },
    creationTargetTree() {
      let arr = this.formattingPositionArr(this.activePosition.catalogPosition);
      let tree = $.fn.zTree.init(
        $(`#${this.targetPositionTreeId}`),
        this.positionSetting,
        arr
      );
    },
    creationContentTree() {
      let arr = this.formattingPositionArr(this.activePosition.contentPosition);
      let tree = $.fn.zTree.init(
        $(`#${this.contentPositionTreeId}`),
        this.positionSetting,
        arr
      );
    },
    getRuleStringType() {
      let url = "/tm/ruleType/getTree";
      this.$http
        .get(url)
        .then(res => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            let list = oTmp.body.data || [];
            this.strTypeName = this.formattingStringType({}, list);
            this.strType = list;
          } else {
            this.$hMessage.error(oTmp.msg);
          }
          if (this.isLocalSto == 1) {
            setTimeout(() => {
              this.setDetailLocalStorage();
            }, 10);
          }
        })
        .catch(err => {
          if (this.isLocalSto == 1) {
            this.setDetailLocalStorage();
          }
          this.$hMessage.error("获取字符串类型失败");
        });
    },
    // 获取抽取范围树
    getExtractingRangeTree () {
      this.$http.get(`/tm/ruleType/getExtractRangeTree`).then(response => {
        const data = response.data;
        if (data.status === this.$api.SUCCESS) {
          this.extractingRangeList = copyDeep(data.body.data || []);
        } else {
          this.$hMessage.error(data.msg);
        }
      }).catch(() => {
        this.$hMessage.error("获取抽取范围失败");
      })
    },
    formattingStringType(obj, arr) {
      for (let i = 0, len = arr.length; i < len; i++) {
        obj[arr[i].value] = arr[i].label;
        if (arr[i].children && arr[i].children.length > 0) {
          this.formattingStringType(obj, arr[i].children);
        }
      }
      return obj;
    },
    dbClickRow(row) {
      this.dataEnName = row.dataEnName;
      if (this.v) {
        // 测试详情
        this.judjeHasChange(row.dataEnName, data => {
          if (data.editType === 0) {
            // 如果规则有变更
            this.$hMsgBox.confirm({
              title: "温馨提示",
              content: "规则有变更，如需修改，点击确定跳转到规则修改页面",
              onOk: () => {
                this.$router.push({
                  path: `/extract/rule/edit`,
                  query: {
                    id: data.ruleConfigId
                  }
                });
              }
            });
          } else {
            // 如果规则可以直接修改
            this.showRuleModal(data);
          }
        });
      } else {
        // 规则预览
        this.getCacheFieldRule();
      }
    },
    showRuleModal(data) {
      let ruleContent = data.ruleContent || "{}";
      let obj = JSON.parse(ruleContent);
      // 过滤表达式赋值
      obj.ruleObj.filters = obj.ruleObj.filters || [];
      // 抽取范围赋值 兼容历史数据
      obj.ruleObj.extractingRange = obj.ruleObj.extractingRange || [];
      this.ruleListDetail = obj.ruleObj || {};
      this.ruleContent.ruleContent.positionRuleObj = obj.positionRuleObj || {};
      this.relyOnList = obj.relyOnList || [];
      this.showMsgFn = true;
      // 树节点id 动态生成   keep alive 若同时存在两个组件会有相同的id节点
      this.contentPositionTreeId = `contentPositionTree${Date.now()}`
      this.targetPositionTreeId = `targetPositionTree${Date.now()}`
      if (obj.ruleObj.positionList && obj.ruleObj.positionList.length > 0) {
        this.activePositionTabsKey = obj.ruleObj.positionList[0].toString();
        this.changePositionData();
      }
      // 初始化过滤
      this.$nextTick(() => {
        this.$refs.ruleSetting.initFilter()
      })
    },
    judjeHasChange(enName, callback) {
      //需要修改
      // this.ruleConfigId
      // let taskId = '1279963990931382274'
      // enName = 'INBBM'
      let url = `/tm/taskPreview/getTaskFieldRule?taskId=${this.ruleConfigId}&fieldEnName=${enName}`;
      this.$http
        .get(url)
        .then(res => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            callback(oTmp.body);
          } else {
            this.$hMessage.error(oTmp.msg);
          }
        })
        .catch(error => {
          this.$hMessage.error("网络连接失败");
        });
    },
    // hasNoSave() {
    //   this.$hMsgBox.confirm({
    //     title: "温馨提示",
    //     content: "规则未入库，是否保存？",
    //     onOk: () => {
    //       // 保存
    //     }
    //   });
    // },
    getCacheFieldRule(dataEnName) {
      if (this.isLoading) return;
      this.isLoading = true;
      let url =
        "/tm/singlePreview/getCacheFieldRule?cacheId=" +
        this.ruleConfigId +
        "&fieldEnName=" +
        this.dataEnName;
      this.$http
        .get(url)
        .then(res => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            this.showRuleModal(oTmp.body);
            // let ruleContent = oTmp.body.ruleContent || "{}";
            // let obj = JSON.parse(ruleContent);
            // this.ruleListDetail = obj.ruleObj || {};
            // this.ruleContent.ruleContent.positionRuleObj =
            //   obj.positionRuleObj || {};
            // this.relyOnList = obj.relyOnList || [];
            // if (
            //   obj.ruleObj.positionList &&
            //   obj.ruleObj.positionList.length > 0
            // ) {
            //   this.activePositionTabsKey = obj.ruleObj.positionList[0].toString();
            //   this.changePositionData();
            // }
            // this.showMsgFn = true;
          } else {
            this.$hMessage.error(oTmp.msg);
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
          this.$hMessage.error("网络错误，获取规则详情失败！");
        });
    },
    onSave(isStandard = false) {
      let arr = this.isTrueArr;
      let isOk = true;
      let txt = "英文字段名：";
      let ary = [];
      for (let i = 0, len = this.tmpList.length; i < len; i++) {
        for (let k = 0, lens = this.tmpList[i].length; k < lens; k++) {
          if (!this.tmpList[i][k].trueData) {
            if (ary.indexOf(this.list[i][k].dataEnName) === -1) {
              ary.push(this.list[i][k].dataEnName);
            }
            isOk = false;
          }
        }
      }
      if (isOk) {
        if (isStandard) {
          this.$hMsgBox.confirm({
            title: "温馨提示",
            content: "<div style='color: red'>【置为标准数据请确认抽取结果已稽核，该操作直接影响到效果评估，请谨慎！】</div>",
            onOk: () => {
              this.setSave(isStandard);
            }
          });
        } else {
          this.setSave(isStandard);
        }
      } else {
        txt += ary.toString();
        if (isStandard) {
          txt += "存在空值，是否继续置为标准数据？<div style='color: red'>【置为标准数据请确认抽取结果已稽核，该操作直接影响到效果评估，请谨慎！】</div>";
        } else {
          txt += "的正确值未填写，是否提交？";
        }
        this.$hMsgBox.confirm({
          title: "温馨提示",
          content: txt,
          onOk: () => {
            // if (isStandard) return;
            this.setSave(isStandard);
          }
        });
      }
    },
    setSave(isStandard = false) {
      let url = "/tm/taskPreview/auditSaveResult";
      if (this.isLoading) return;
      this.isLoading = true;
      let obj = {
        id: this.taskId,
        auditResultVoList: this.tmpList
      };
      if (isStandard) {
        url = "/tm/standardData/saveStandardResult"; //标准数据
        obj.fileMD5 = this.detail.fileMD5;
        obj.id = this.detail.id;
        obj.taskId = this.detail.taskId;
      }
      this.$http
        .post(url, obj)
        .then(res => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            this.getNext();
            if (isStandard) {
              this.$hMessage.success("设置成功");
              return;
            }
            this.$hMessage.success("保存成功");
          } else {
            this.$hMessage.error(oTmp.msg);
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
          if (isStandard) {
            this.$hMessage.error("设置失败");
            return;
          }
          this.$hMessage.error("保存失败");
        });
    },
    refreshTask() {
      // 测试页，重新抽取
      let urls = `/tm/taskPreview/refreshTaskResult?taskId=${this.ruleConfigId}&fileMd5=${this.detail.fileMD5}&detailId=${this.detail.id}`;
      this.getDetail(urls, null, false, true);
    },
    getDetail(urls = null, cb = null, isGo = false, taskRefresh = false) {
      if (this.isLoading && !isGo) return;
      this.isLoading = true;
      let url = "/tm/singlePreview/getResult?";
      if (urls) {
        url = urls;
      } else if (this.v) {
        url += "relationId=" + this.taskId + "&versionNum=2";
      } else {
        url += "ruleId=" + this.ruleConfigId + "&fileMd5=" + this.fileMd5;
      }
      this.$http
        .get(url)
        .then(res => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            if (urls && !taskRefresh) {
              this.index = oTmp.body.current || 0;
              this.taskId = oTmp.body.id;
            }
            this.detail = oTmp.body || {};
            this.htmlLink = this.detail.htmlLink
            let list = oTmp.body.extractResultList
              ? oTmp.body.extractResultList
              : [];
            let search = "";
            for (let i = 0, len = list.length; i < len; i++) {
              for (let k = 0, lens = list[i].length; k < lens; k++) {
                // list[i][k].trueData = list[i][k].trueData || list[i][k].sourceStr;
                list[i][k].index_ = i;
                if (list[i][k].data) {
                  if (i != 0 || k != 0) {
                    search += "||";
                  }
                  search +=
                    list[i][k].sourceStr +
                    "|v|" +
                    list[i][k].pageCurrent.toString() +
                    "|v|" +
                    list[i][k].start;
                }
              }
            }
            let pageNum = oTmp.body.pageNum || 1;
            let Table = [
              {
                key: "dataName",
                title: "字符中文名称",
                minWidth: 110,
                fixed: "left",
                render: (h, params) => {
                  const { row } = params;
                  return h(
                    'span',
                    {
                      style: {
                        cursor:'pointer',
                      },
                      on: {
                        dblclick: () => {
                          this.dbClickRow(row)
                        }
                      }
                    },
                    row['dataName']
                  )
                }
              },
              {
                key: "dataEnName",
                title: "字符英文名称",
                minWidth: 110,
              },
              // {
              //   key: "sourceStr",
              //   title: "字符值"
              // },
              {
                key: "sourceStr",
                title: "字符值",
                minWidth: 120,
                render: (h, params) => {
                  const { row } = params;
                  const rowKey = `${row.index_}_${row._index}`;
                  if (this.horizontalTableEditKey === rowKey) {
                    return h(
                      'Input',
                      {
                        props: {
                          type: "text",
                          value: row['trueData'],
                          algin: 'left'
                        },
                        attrs: {
                          id: `${rowKey}_horizontal_input`,
                          size: 'small'
                        },
                        style: {
                          display: 'inline-flex',
                          alignItems: 'center',
                          height: '30px'
                        },
                        on: {
                          input: (event) => {
                            this.tmpList[row.index_][row._index].trueData = event.replace(/(^\s*)|(\s*$)/g, "");
                            this.list[row.index_][row._index].trueData = event.replace(/(^\s*)|(\s*$)/g, "");
                          },
                          'on-blur': () => {
                            this.horizontalTableEditKey = ''
                          }
                        }
                      }
                    )
                  }
                  return h(
                    'div',
                    {
                      class: [],
                      style: {
                        minWidth: '100%',
                        minHeight: '20px',
                        cursor: this.v ? 'pointer' : 'default',
                        lineHeight: '20px'
                      },
                      on: {
                        click: () => {
                          this.onGoPDFPage(row['pageCurrent'])
                        },
                        dblclick: () => {
                          if (this.v) {
                            this.horizontalTableEditKey = rowKey;
                            setTimeout(() => {
                              this.$nextTick(() => {
                                document.getElementById(`${this.horizontalTableEditKey}_horizontal_input`).children[1].focus();
                              })
                            }, 10)
                          }
                        }
                      }
                    },
                    row['trueData']
                  )
                }
              },
              {
                key: "pageCurrent",
                title: "页码",
                align: "center",
                width: 60,
                render: (h, params) => {
                  let row = params.row;
                  return h(
                    "span",
                    {
                      class: ["span-page"],
                      on: {
                        click: () => {
                          this.onGoPDFPage(row.pageCurrent);
                        }
                      }
                    },
                    row.pageCurrent ? row.pageCurrent.toString() : ""
                  );
                }
              }
            ];
            localStorage.pdf_wab_search_data = search;
            let time = new Date().getTime();
            if (this.v) {
              this.src =
                "/viewer.html?file=" +
                encodeURIComponent(
                  "/tm/singlePreview/downloadPDF?relationId=" +
                    this.taskId +
                    "&versionNum=" +
                    this.v
                ) +
                "&search=search&time=" +
                time +
                "#page=" +
                pageNum;
              // Table.push({
              //   key: "pageCurrent",
              //   title: "正确值",
              //   width: 150,
              //   render: (h, params) => {
              //     let row = params.row;
              //     return h("Input", {
              //       props: {
              //         type: "text",
              //         value: row.trueData
              //       },
              //       on: {
              //         input: event => {
              //           this.tmpList[row.index_][
              //             params.index
              //           ].trueData = event.replace(/(^\s*)|(\s*$)/g, "");
              //         }
              //       }
              //     });
              //   }
              // });
              // Table.push({
              //   key: "pageCurrent",
              //   title: "是否正确",
              //   fixed: "right",
              //   width: 90,
              //   render: (h, params) => {
              //     let row = params.row;
              //     return h(
              //       "h-switch",
              //       {
              //         props: {
              //           size: "large",
              //           value: row.checkResult == 1 ? true : false
              //         },
              //         on: {
              //           "on-change": status => {
              //             if (status) {
              //               this.tmpList[row.index_][
              //                 params.index
              //               ].checkResult = 1;
              //             } else {
              //               this.tmpList[row.index_][
              //                 params.index
              //               ].checkResult = 0;
              //             }
              //           }
              //         }
              //       },
              //       [
              //         h(
              //           "span",
              //           {
              //             slot: "open"
              //           },
              //           "正确"
              //         ),
              //         h(
              //           "span",
              //           {
              //             slot: "close"
              //           },
              //           "错误"
              //         )
              //       ]
              //     );
              //   }
              // });
            } else {
              this.src =
                "/viewer.html?file=" +
                encodeURIComponent(
                  "/tm/singlePreview/downloadPDF?fileMd5=" + this.fileMd5
                ) +
                "&search=search&time=" +
                time +
                "#page=" +
                pageNum;
            }
            this.Table = Table;
            this.list = list;
            this.tmpList = copyDeep(list);
            if (cb) {
              cb(oTmp.body.current);
            }
          } else {
            this.$hMessage.error(oTmp.msg);
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
          if (urls) {
            this.$hMessage.error("获取下一篇失败");
          } else {
            this.$hMessage.error("获取抽取结果失败");
          }
        });
    },
    onGoPDFPage(data) {
      if (data && data instanceof Array && data.length > 0) {
        this.$refs.pdfIframe.contentWindow.goPage(data[0]);
      }
    },
    judjeSame() {
      if (JSON.stringify(this.list) != JSON.stringify(this.tmpList)) {
        this.$hMsgBox.confirm({
          title: "温馨提示",
          content: "抽取结果有修改，是否保存本次稽核结果",
          onOk: () => {
            this.setSave(false);
          },
          onCancel: () => {
            this.getNext();
          }
        });
      } else {
        this.getNext();
      }
    },
    getNext() {
      let pathUrl = this.$route.path;
      if (this.v) {
        let url =
          "/tm/taskPreview/getNextResult?taskId=" +
          this.ruleConfigId +
          "&current=" +
          (parseInt(this.index) + 1);
        this.getDetail(
          url,
          index => {
            let data = {
              v: this.v,
              ruleConfigId: this.ruleConfigId,
              fileMd5: "",
              index: index,
              taskId: this.taskId,
              ruleId: ""
            };
            this.$emit("changeData", data);
            this.$router.push({
              path:
                pathUrl +
                "?ruleConfigId=" +
                this.ruleConfigId +
                "&v=2&taskId=" +
                this.taskId +
                "&index=" +
                index
            });
            this.isLoading = false;
          },
          true
        );
      } else {
        let len = this.fileMd5s.length;
        let index = this.fileMd5s.indexOf(this.fileMd5);
        if (len == 0 || index == -1 || index == len - 1) {
          this.$hMessage.error("没有下一篇了");
        } else {
          let id = this.fileMd5s[index + 1];
          this.$router.push({
            path:
              pathUrl + "?ruleConfigId=" + this.ruleConfigId + "&fileMd5=" + id
          });
          this.fileMd5 = id;
          this.getDetail();
        }
      }
    },
    initfileMd5s() {
      if (
        !localStorage.preview_detail_file_md5_arr ||
        localStorage.preview_detail_file_md5_arr == "undefined"
      ) {
        this.fileMd5s = [];
      } else {
        this.fileMd5s = JSON.parse(localStorage.preview_detail_file_md5_arr);
      }
    },
    //取消
    cancel() {
      this.$store.commit("DEL_TAB", this.$route.path);
      this.$router.push("/extract/rule");
    },
    init() {
      this.initfileMd5s();
      let { v, ruleConfigId, fileMd5, taskId, index, ruleId } = this.data;
      if (!v && !ruleConfigId && !fileMd5 && !taskId && !index) return;
      this.ruleId = ruleId;
      this.v = v;
      this.ruleConfigId = ruleConfigId;
      this.fileMd5 = fileMd5;
      this.taskId = taskId;
      this.index = index;
      this.getDetail();
    },
  },
  watch: {
    data: function() {
      this.init();
    }
  },
  mounted() {
    this.getRuleStringType();
    this.getExtractingRangeTree();
    this.init();
    this.getFnList();
  }
};
</script>
<style lang="scss" scoped>
.detail-table{
  /deep/ .h-table-cell {
    white-space: normal;
  }
}
.table-bar{
  display: flex;
  align-items: center;
  justify-content: space-between;
  .switch{
    display: flex;
    align-items: center;
    span{
      margin-left: 5px;
    }
  }
  /deep/ .true-color{
    background-color: #f56c6c;
    border-color: #f56c6c;
  }
  /deep/ .false-color{
    background-color: #13ce66;
    border-color: #13ce66;
  }
}
</style>
<style type="text/css" scoped>
.bigContent{
  height: 100%;
  position: relative;
}
.header-content{
  display: flex;
  font-size: 14px;
}
.pdf-detail-btn {
  text-align: center;
  position: relative;
  padding: 5px;
  z-index: 8;
}
.detail-table {
  overflow: auto;
}
.detail {
  font-size: 0;
  height: 100%;
  position: relative;
}
.detail-right {
  vertical-align: top;
  font-size: 14px;
  width: 420px;
  display: inline-block;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid #dfdfdf;
  border-left: none;
  padding: 5px;
}
.detail-right h2 {
  line-height: 32px;
  font-weight: 600;
}
.detail-left {
  width: calc(100% - 420px);
  display: inline-block;
  vertical-align: top;
  height: 100%;
  border: 1px solid #dfdfdf;
}
div >>> .h-table-wrapper {
  margin-top: 10px;
}
div >>> .h-table-wrapper:first-child {
  margin-top: 0;
}
.title {
  padding: 6px 0;
  font-weight: 600;
}
.title span {
  float: right;
  cursor: pointer;
  font-weight: normal;
  color: #298dff;
}
.i.add {
  line-height: 0;
  margin: 0;
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  border: 0 none;
  cursor: pointer;
  outline: none;
  background-color: transparent;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-image: url("../../../../assets/css/img/zTreeStandard.png");
  *background-image: url("../../../../assets/css/img/zTreeStandard.gif");
  background-position: -144px 0;
  font-size: 0;
}
.position {
  display: flex;
  background: #fff;
}
.position_tabs >>> .h-tabs-bar {
  margin-bottom: 0;
}
.position .list {
  margin-top: 0;
  width: 50%;
  border: 1px solid #dfdfdf;
  border-top: none;
}
.position .list:first-child {
  border-right: none;
}
.position .list .title {
  padding-left: 5px;
  padding-right: 5px;
  border-bottom: 1px dotted #dfdfdf;
  font-size: 12px;
}
.position .ztree-box {
  width: 100%;
  overflow: auto;
}
.position-ps {
  padding-left: 12px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
}
.add-fn {
  text-align: right;
}
.add-fn span {
  cursor: pointer;
  color: #298dff;
}
.ps {
  line-height: 1;
}
>>> .save-rule-msg .h-modal-body {
  max-height: 450px;
  overflow: auto;
  padding-top: 16px;
}
.detail >>> .span-page {
  display: block;
  cursor: pointer;
  line-height: 32px;
}
</style>
