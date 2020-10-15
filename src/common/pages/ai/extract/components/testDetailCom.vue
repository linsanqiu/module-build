<template>
  <div class="test">
    <div>
      <search-form :title="name">
        <ul slot="content">
          <li>
            <dl>
              <dt>是否稽核：</dt>
              <dd>
                <h-select placeholder="请选择" v-model="req.checkState">
                  <h-option value="0">未稽核</h-option>
                  <h-option value="1">已稽核</h-option>
                </h-select>
              </dd>
            </dl>
          </li>
          <li>
            <dl>
              <dt>是否正确：</dt>
              <dd>
                <h-select placeholder="请选择" v-model="req.checkResult">
                  <h-option value="0">错误</h-option>
                  <h-option value="1">正确</h-option>
                </h-select>
              </dd>
            </dl>
          </li>
          <li>
            <dl>
              <dt>标准数据：</dt>
              <dd>
                <h-select placeholder="请选择" v-model="req.standard">
                  <h-option value="0">否</h-option>
                  <h-option value="1">是</h-option>
                </h-select>
              </dd>
            </dl>
          </li>
          <li class="search-wrapper-but">
            <h-button type="primary" @click="onPageChange(1)">查询</h-button>
            <h-button type="primary" @click="getResultReport()">评估报告</h-button>
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
    <div class="table-content">
      <h-table
        size="small"
        :maxHeight="(maxTableHeight - 50)"
        class="full-max-height-table"
        :columns="table"
        :data="list"
        :highlight-row="false"
        border
      ></h-table>
      <div class="tab-box">
        <h-page
          highlight-row
          size="small"
          show-total
          show-elevator
          show-sizer
          placement="top"
          class="page-box"
          :page-size-opts="pageSizeOpts"
          :total="total"
          :current="req.current"
          :page-size="req.size"
          @on-change="onPageChange"
          @on-page-size-change="onPageSizeChange"
        ></h-page>
      </div>
      <h-spin fix v-if="isGetList">
        <h-icon name="load-c" size="18" class="h-load-loop"></h-icon>
        <div>加载中...</div>
      </h-spin>
    </div>
    <h-msgBox
      title="评估报告"
      v-model="isShowResultReport"
      @on-close
      class-name="vertical-center-modal"
      :top="0"
      width="700"
    >
      <div class="rf-box">
        <p class="tips">抽取总数：{{ rfTotal }}条，当前规则人工审核共{{ auditNumber }}条；字段报告如下表</p>
        <h-table
          size="small"
          :maxHeight="300"
          class="full-max-height-table"
          :columns="rftable"
          :data="resultReportFieldList"
          :highlight-row="false"
          border
        ></h-table>
        <h-spin fix v-if="isResultReport">
          <h-icon name="load-c" size="18" class="h-load-loop"></h-icon>
          <div>加载中...</div>
        </h-spin>
      </div>
      <div slot="footer"></div>
    </h-msgBox>
  </div>
</template>
<script>
import { copyDeep } from "@/filters/index";
export default {
  props: {
    // 是否从个人测试页面进入
    isPersonal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isAutoRefreshTable: true,
      isGetList: false,
      id: "",
      name: "",
      req: {
        current: 1,
        size: 10,
        standard: "",
        checkResult: "",
        checkState: ""
      },
      total: 0,
      pageSizeOpts: [10, 20, 50, 100],
      list: [],
      table: [],
      page: 1,
      rfTotal: 0,
      auditNumber: 0,
      trueNumber: 0,
      rftable: [
        {
          title: "字段名",
          key: "fieldChName"
        },
        {
          title: "字段正确数",
          key: "trueNumber",
          align: "center"
        },
        {
          title: "漏抽取数",
          key: "blankNumber",
          align: "center"
        },
        {
          title: "召回率(%)",
          key: "recall",
          align: "center"
        },
        {
          title: "准确率(%)",
          key: "acc",
          align: "center"
        }
      ],
      resultReportFieldList: [],
      isResultReport: false,
      isShowResultReport: false,
      isMounted: false
    };
  },
  computed: {
    maxTableHeight() {
      return this.$store.state.maxTableHeight;
    }
  },
  methods: {
    onPageChange(val) {
      this.req.current = val;
      this.getList();
    },
    onPageSizeChange(size) {
      this.req.size = size;
      this.onPageChange(1);
    },
    getList() {
      if (this.isGetList) return;
      this.isGetList = true;
      let url = "/tm/taskPreview/getResultPage?taskId=" + this.id;
      let req = this.req;
      for (let a in req) {
        url += "&" + a + "=" + req[a];
      }
      this.$http
        .get(url)
        .then(res => {
          let _this = this;
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            let data = oTmp.body || {};
            this.page = data.current;
            let arr = [
              {
                title: "序号",
                width: 60,
                align: "center",
                fixed: "left",
                render: (h, params) => {
                  let index =
                    params.index + 1 + (_this.page - 1) * _this.req.size;
                  params.row.index = index;
                  return h("div", index);
                }
              },
              {
                title: "文件名称",
                key: "fileName",
                fixed: "left"
              }
            ];
            let head = data.resultColumns || [];
            for (let i = 0, len = head.length; i < len; i++) {
              let width = 120;
              let lens = head[i].chName.length;
              if (lens > 5) {
                width = 20 * lens;
              }
              let obj = {
                key: head[i].enName,
                title: head[i].chName,
                align: "center",
                width: width
              };
              arr.push(obj);
            }
            arr.push({
              title: "抽取状态",
              width: 80,
              align: "center",
              key: "checkResult",
              fixed: "right",
              render: (h, params) => {
                let row = params.row;
                if (row.status == 1) {
                  return h("div", "成功");
                } else {
                  return h("div", "失败：" + row.statusDesc);
                }
              }
            });
            arr.push({
              title: "是否正确",
              width: 80,
              align: "center",
              key: "checkResult",
              fixed: "right"
            });
            arr.push({
              title: "是否稽核",
              width: 80,
              align: "center",
              key: "checkState",
              fixed: "right"
            });
            arr.push({
              title: "标准数据",
              width: 80,
              align: "center",
              key: "standardState",
              fixed: "right"
            });
            arr.push({
              title: "操作",
              width: 60,
              align: "center",
              fixed: "right",
              render: (h, params) => {
                let row = params.row;
                let viewBtn = h("span", {
                  attrs: {
                    title: "查看抽取详情"
                  },
                  class: ["icon-view", "iconfont", "tab-icon-btn"],
                  on: {
                    click: () => {
                      if (this.isPersonal) {
                        this.$router.push(
                          "/extract/personaltest/preview?ruleConfigId=" +
                            this.id +
                            "&v=2&taskId=" +
                            row.id +
                            "&index=" +
                            row.index
                        );
                      } else {
                        this.$router.push(
                          "/extract/rule/preview?ruleConfigId=" +
                            this.id +
                            "&v=2&taskId=" +
                            row.id +
                            "&index=" +
                            row.index
                        );
                      }
                    }
                  }
                });
                return h(
                  "div",
                  {
                    class: ["tab-operation"]
                  },
                  [viewBtn]
                );
              }
            });
            this.list = data.resultDatas || [];
            this.total = data.total || 0;
            this.table = arr;
          } else {
            this.$hMessage.error(oTmp.msg);
          }
          this.isGetList = false;
        })
        .catch(err => {
          this.isGetList = false;
          this.$hMessage.error("获取列表失败");
        });
    },
    getResultReport() {
      if (this.isResultReport) return;
      this.isResultReport = true;
      this.isShowResultReport = true;
      let url = "/tm/taskPreview/getResultReport?taskId=" + this.id;
      this.$http
        .get(url)
        .then(res => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            let data = oTmp.body || {};
            this.rfTotal = data.total || 0;
            this.auditNumber = data.auditNumber || 0;
            this.trueNumber = data.trueNumber || 0;
            this.resultReportFieldList = data.resultReportFieldList || [];
          } else {
            this.$hMessage.error(oTmp.msg);
          }
          this.isResultReport = false;
        })
        .catch(err => {
          this.isResultReport = false;
          this.$hMessage.error("网络错误，获取评估报告失败");
        });
    },
    init() {
      let { id, name } = this.$route.query;
      if (id == this.id) {
        if (!this.isMounted && this.isAutoRefreshTable) {
          this.getList();
        }
        return;
      }
      this.req.current = 1;
      this.id = id;
      this.name = name || "";
      this.getList();
    }
  },
  mounted() {
    this.isMounted = true;
    this.init();
    let pathName = "配置规则 - 测试结果"
    if (this.isPersonal){
      pathName = "个人测试任务-测试结果"
    }
    this.$store.commit("SAVE_TAB_NAME", {
      path: this.$route.path,
      name: pathName
    });
  },
  activated: function() {
    this.isMounted = false;
    this.init();
  }
};
</script>
<style type="text/css" scoped>
.fileSourceContent {
  margin-top: 10px;
}
>>> .text-file-msg .h-modal-body {
  overflow-y: unset !important;
}
.table-content {
  position: relative;
}
.search-auto {
  width: auto !important;
}
.search-form-name {
  line-height: 28px;
  font-weight: 600;
}
.rf-box {
  position: relative;
}
.rf-box .tips {
  color: #000;
  margin-bottom: 10px;
}
</style>
