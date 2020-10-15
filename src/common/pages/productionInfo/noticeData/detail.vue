<template>
  <div id="detailBox">
    <windowDrag leftW="50%">
      <div class="box-left-content" slot="left">
        <ul id="pdfBox">
          <li class="input-box input-box-link">
            <span>公告链接：</span>
            <span>
              <a
                :title="pdfInfo.linkAddress"
                v-if="pdfInfo.linkAddress"
                :href="pdfInfo.linkAddress"
                target="_blank"
              >{{pdfInfo.linkAddress}}</a>
              <i v-else>-</i>
            </span>
            <!--<h-input style="width:90%;display: inline-block;" v-model="formData.linkUrl" placeholder="请输入..."></h-input>-->
          </li>
          <li class="input-box">
            <span>公告标题：</span>
            <span
              :title="pdfInfo.title"
              class="input-box-title"
            >{{pdfInfo.title? pdfInfo.title : '-'}}</span>
          </li>
          <li class="input-box">
            <span>公告内容：</span>
            <template v-if="pdfInfo.extension == 'pdf' || pdfInfo.extension == 'PDF'">
              <h-button type="info" @click="reloadPdfFn">加载文件</h-button>
            </template>
            <template v-else>
              <span class="noPdfLink">{{'当前页面不支持'+pdfInfo.extension+'格式，请打开源文件进行数据录入！'}}</span>
              <a
                class="noPdfLink-a"
                style="display: inline-block"
                :title="pdfInfo.linkAddress"
                v-if="pdfInfo.linkAddress"
                :href="pdfInfo.linkAddress"
                target="_blank"
              >文件下载</a>
            </template>
          </li>
          <template v-if="pdfInfo.extension == 'pdf' || pdfInfo.extension == 'PDF'">
            <iframe
              ref="pdfIframeInfo"
              name="pdfIframe"
              :src="pdfUrl"
              width="100%"
              :height="maxTableHeight-50"
              frameborder="0"
            ></iframe>
          </template>
        </ul>
      </div>
      <div class="box-right-content" slot="right">
        <div class="add_btn">
          <h-button type="info" @click="addProduct">新增产品</h-button>
          <h-button type="info" @click="showViewHistory">查看历史数据</h-button>
        </div>
        <div class="productList" v-for="(itemArr,index) in tableTemplateData">
          <TableTemplate
            @prodCodeChange="prodCodeChange($event, index)"
            :templateData="tableTemplate"
            v-model="tableTemplateData[index]"
            :onTitle="onTableName"
          ></TableTemplate>
          <div class="btn">
            <h-button type="error" @click="delProduct(index)">删除产品</h-button>
          </div>
        </div>
        <div class="saveBox">
          <!-- //0未处理，1处理中，2已发布，  4已下架 5已删除-->
          <template v-if="pdfInfo.processTypeCode == 0 || pdfInfo.processTypeCode == 1">
            <h-button type="info" @click="saveFirstFn('save',1)">保存</h-button>
            <h-button type="info" @click="saveSubmitFn('submit',2)">提交</h-button>
          </template>
          <template v-else>
            <h-button type="info" @click="saveEditFn('edit',pdfInfo.processTypeCode)">修改</h-button>
            <h-button type="ghost" @click="saveOffFn('下架',3)">下架</h-button>
          </template>
        </div>
      </div>
    </windowDrag>
    <div class="historyModal" v-show="historyModalShow" v-selfDrag="[true,false,false]">
      <h-icon name="android-close" @on-click="showViewHistory" class="closeModal"></h-icon>
      <div class="title">历史数据</div>
      <div class="modalInner">
        <div class="productList" v-for="(itemArr,index) in historyTableTemplateData">
          <TableTemplate
            :viewPage="true"
            :isAdd="false"
            :templateData="tableTemplate"
            v-model="historyTableTemplateData[index]"
            :onTitle="onTableName"
            :loading="historyLoading"
          ></TableTemplate>
        </div>
      </div>
      <h-page
        class="page"
        size="small"
        placement="top"
        :current="historyPage"
        @on-change="onPageChange"
        :total="historyPageTotal"
        show-total
        :page-size="1"
      ></h-page>
    </div>
    <h-msgBox
      :isOkLeft="true"
      title="字段存在错误，请检查"
      v-model="modalErrorShow"
      @on-ok="hidenError"
      ok-text="确认"
    >
      <p v-html="modalErrorMsg"></p>
    </h-msgBox>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import windowDrag from "@/components/windowDrag";
import TableTemplate from "../components/table";
import {
  getHistoryProductList,
  checkVerifyData,
  getProdData,
  deleteLock,
} from "../api/apiManager";
export default {
  components: { windowDrag, TableTemplate },
  name: "ProductionInfoNoticeDataDetail",
  data() {
    return {
      modalErrorShow: false,
      modalErrorMsg: "",

      historyLoading: false,
      historyPage: 1,
      historyPageTotal: 1,
      historyModalShow: false,

      taskId: "",
      pdfUrl: "",
      tableTemplate: [],
      tableTemplateData: [], //模板字段
      templateDetail: {}, //模板信息
      historyTableTemplateData: [], //历史数据
      pdfInfo: {
        anncMd5: "",
        anncType: "",
        linkAddress: "",
        title: "",
        processTypeCode: "",
        templateId: "",
        extension: "",
      },
      tableData: [],
      reuiredName: "",
      isFirst: false,
    };
  },
  computed: {
    ...mapState(["maxTableHeight"]),
  },
  methods: {
    delProduct(index) {
      this.$hMsgBox.confirm({
        title: "删除",
        content: "确定要删除吗?",
        onOk: () => {
          this.tableTemplateData.splice(index, 1);
        },
      });
    },
    addProduct() {
      this.tableTemplateData.push([]);
    },
    onTableName(str) {
      if (this.$refs.pdfIframeInfo.contentWindow.goSearch) {
        this.$refs.pdfIframeInfo.contentWindow.goSearch(str);
      }
    },
    reloadPdfFn() {
      window.parent.frames.pdfIframe.location.reload();
    },
    getDetailData() {
      this.isFirst = true;
      this.$http
        .get("/pic/audit/anncData/editAnncDetail?taskId=" + this.taskId)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            let obj = data.body || {};
            if (obj.resultCode == 1) {
              let obj = data.body || {};
              this.templateDetail = obj.tmplInfoDTO || {}; //模板信息
              this.tableTemplateData = obj.anncDataItemList || [];
              //模板数据信息
              let list = this.templateDetail.groupList || [];
              this.$set(this, "tableTemplate", list);
              //模板字段信息
              let {
                anncMd5,
                anncType,
                linkAddress,
                title,
                processTypeCode,
                templateId,
                extension,
                anncId,
              } = obj;
              this.pdfInfo = {
                anncMd5,
                anncType,
                linkAddress,
                title,
                processTypeCode,
                templateId,
                extension,
                anncId,
              };
              this.pdfUrl =
                "../../../../static/pdf/web/viewer.html?file=" +
                encodeURIComponent("/resource/pdf/" + anncMd5);
              this.$nextTick(() => {
                this.isFirst = false;
              });
            } else {
              this.$hMessage.error({ content: obj.resultMsg });
            }
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
    onChangeInput(arr) {
      this.tableData = arr;
    },
    onChangeSelect(arr) {
      this.tableData = arr;
    },
    testFormRequired() {
      /**校验必填字段**/
      let testFlag = true;
      if (this.tableTemplate.length > 0) {
        for (let n = 0, len = this.tableTemplateData.length; n < len; n++) {
          let data = this.tableTemplateData[n];
          for (let i = 0, len = this.tableTemplate.length; i < len; i++) {
            if (this.tableTemplate[i].rowList.length > 0) {
              for (
                let k = 0, lens = this.tableTemplate[i].rowList.length;
                k < lens;
                k++
              ) {
                for (let j = 0, lenj = data[i].length; j < lenj; j++) {
                  let valueRow = data[i][j][k] ? data[i][j][k] : "";
                  if (this.tableTemplate[i].rowList[k].required && !valueRow) {
                    this.reuiredName = this.tableTemplate[i].rowList[
                      k
                    ].fieldName;
                    return false;
                  }
                }
              }
            } else {
              for (
                let k = 0, lens = this.tableTemplate[i].colList.length;
                k < lens;
                k++
              ) {
                for (let j = 0, lenj = data[i][k].length; j < lenj; j++) {
                  let valueCol = data[i][k][j] ? data[i][k][j] : "";
                  if (this.tableTemplate[i].colList[k].required && !valueCol) {
                    this.reuiredName = this.tableTemplate[i].colList[
                      k
                    ].fieldName;
                    return false;
                  }
                }
              }
            }
          }
        }
      }
      return testFlag;
    },
    saveOffFn(type, processTypeCode) {
      this.$hMsgBox.confirm({
        title: "下架",
        content: "是否确认下架？",
        onOk: () => {
          let url = "/pic/audit/anncData/lowerAnncDetail?taskId=" + this.taskId;
          this.$http
            .get(url)
            .then((res) => {
              let data = res.data ? res.data : {};
              if (data.status == this.$api.SUCCESS) {
                if (data.body.resultCode == 1) {
                  this.$hMessage.info({
                    content: type + "成功",
                    duration: 3,
                  });
                  setTimeout(() => {
                    this.$router.push({
                      path: "/productionInfo/noticeData/list",
                    });
                  }, 200);
                } else {
                  this.$hMessage.error({ content: data.body.resultMsg });
                }
              } else {
                this.$hMessage.error({
                  content: data.msg,
                  duration: 3,
                });
              }
            })
            .catch((err) => {});
        },
      });
    },
    saveEditFn(type, processTypeCode) {
      let url = "/pic/audit/anncData/modifyAnncDetail";
      this.$hMsgBox.confirm({
        title: "修改",
        content: "是否确认修改？",
        onOk: () => {
          this.saveFn(type, processTypeCode, url);
        },
      });
    },
    saveSubmitFn(type, processTypeCode) {
      // 提交
      let url = "/pic/audit/anncData/publishedAnncDetail";
      this.$hMsgBox.confirm({
        title: "提交",
        content: "是否确认提交？",
        onOk: () => {
          this.saveFn(type, processTypeCode, url);
        },
      });
    },
    saveFirstFn(type, processTypeCode) {
      let url = "/pic/audit/anncData/saveAnncDetail";
      this.saveFn(type, processTypeCode, url);
    },
    async saveFn(type, processTypeCode, url) {
      if (this.tableTemplateData.length == 0) {
        this.$hMessage.error("请新增产品!");
        return;
      }
      //保存 传1；提交传2；修改：你传返回的处理状态
      if (!this.testFormRequired()) {
        this.$hMessage.warning({
          content: this.reuiredName + ":请输入必填字段",
        });
        return;
      }

      let saveInfo = {
        taskId: this.taskId,
        processType: processTypeCode, //0未处理，1处理中，2已发布 3已下架
        templateId: this.templateDetail.id, //模板id
        anncId: this.pdfInfo.anncId,
        anncDataItemList: [...this.tableTemplateData],
      };
      // 校验数据录入规则
      // let returnData = await checkVerifyData(saveInfo)
      this.$http
        .post(url, saveInfo)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            if (data.body.resultCode === 1) {
              let msg = "保存";
              if (type == "submit") {
                msg = "提交";
              } else if (type == "edit") {
                msg = "修改";
              }
              this.$hMessage.success({ content: msg + "成功" });
              this.pdfInfo.processTypeCode = processTypeCode;
              // setTimeout(() => {
              //   this.$router.push({ path: "/productionInfo/noticeData/list" });
              // }, 500);
            } else if (data.body.resultCode === 0) {
              // 禁止校验
              this.modalErrorShow = true;
              this.modalErrorMsg = data.body.resultMsg;
            } else {
              this.$hMessage.error({ content: data.body.resultMsg });
            }
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
    showViewHistory() {
      this.historyModalShow = !this.historyModalShow;
      this.historyPage = 1;
      if (this.historyModalShow) {
        this.viewHistory();
      }
    },
    viewHistory() {
      this.historyLoading = true;
      let body = {
        templateId: this.templateDetail.id,
        currentPage: this.historyPage,
      };
      getHistoryProductList(body)
        .then((data) => {
          this.historyPageTotal = data.totalSize;
          let itemList = data.dataList || [];
          if (itemList.length > 0) {
            this.historyTableTemplateData = itemList[0]["anncDataItemList"];
          }
          this.historyLoading = false;
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
          this.historyLoading = false;
        });
    },
    onPageChange(current) {
      this.historyPage = current;
      this.viewHistory();
    },
    isMutilArrayEmpty(mutilArray) {
      let empty = true;
      for (let i = 0; i < mutilArray.length; i++) {
        let iArray = mutilArray[i];
        for (let j = 0; j < iArray.length; j++) {
          if (j === 0) {
            continue;
          }
          let jArray = iArray[j];
          for (let k = 0; k < jArray.length; k++) {
            if (jArray[k] != "") {
              empty = false;
            }
          }
        }
      }
      return empty;
    },
    async prodCodeChange(value, index) {
      if (this.isFirst) {
        return;
      }
      try {
        let body = {
          templateId: this.templateDetail.id,
          prodCode: value,
        };
        let data = await getProdData(body);
        let empty = this.isMutilArrayEmpty(this.tableTemplateData[index]);
        if (empty) {
          if (data.resultCode == 1) {
            let anncDataItem =
              data.anncDataItemList.length > 0 ? data.anncDataItemList[0] : [];
            console.log(anncDataItem)
            this.tableTemplateData.splice(index, 1, anncDataItem);
          }
        } else {
          this.$hMsgBox.confirm({
            title: "是否覆盖当前数据",
            content: "",
            onOk: () => {
              if (data.resultCode == 1) {
                let anncDataItem =
                  data.anncDataItemList.length > 0
                    ? data.anncDataItemList[0]
                    : [];
                this.tableTemplateData.splice(index, 1, anncDataItem);
              }
            },
          });
        }
      } 
      catch (error) {
        this.$hMessage.error(error.content);
      }
    },
    closeTabReleaseLock() {
      let _this = this;
      let obj = {
        url: this.$route.path,
        release: true,
        fn: () => {
          let body = {
            taskId: this.taskId,
          };
          deleteLock(body)
            .then((data) => {})
            .catch((error) => {
              this.$hMessage.error(error.content);
            });
        },
      };
      this.$store.commit("SET_TAB_MSG", obj);
    },
    hidenError() {
      this.modalErrorShow = false;
    },
  },
  mounted() {
    this.taskId = this.$route.query.taskId;
    this.getDetailData();
    this.closeTabReleaseLock();
  },
  activated: function () {
    let taskId = this.$route.query.taskId;
    if (taskId == this.taskId) {
      return;
    } else {
      this.taskId = taskId;
      this.getDetailData();
      this.closeTabReleaseLock();
    }
  },
};
</script>

<style scoped lang='scss'>
#detailBox /deep/ .right {
  padding-top: 35px;
  padding-bottom: 42px;
  position: relative;
}
.add_btn {
  height: 35px;
  border-bottom: 1px solid #dfdfdf;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  padding: 0 10px;
}
.productList {
  padding: 10px;
  border: 1px solid #ccc;
  margin: 5px;
}
.productList .btn {
  text-align: center;
}
#detailBox {
  height: 100%;
}
.box-left-content {
  min-width: 350px;
  height: 100%;
}
.box-right-content {
  height: 100%;
  overflow: auto;
}
#pdfBox {
  width: 100%;
  height: 100%;
  min-width: 350px;
}
#tableBox {
  height: 100%;
  width: 98%;
  padding: 20px;
  min-width: 375px;
}
.input-box {
  margin-bottom: 7px;
}
.input-box-link a {
  text-decoration: none;
  color: #0076cb;
  font-size: 14px;
  width: 85%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
  position: relative;
  top: 6px;
}
.input-box .input-box-title {
  display: inline-block;
  width: 85%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  position: relative;
  top: 6px;
  cursor: pointer;
}
.saveBox {
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-top: 1px solid #dfdfdf;
  height: 42px;
  padding-top: 8px;
}
.saveBox .h-btn {
  margin-right: 10px;
}
.noPdfLink {
  font-size: 14px;
  color: #ffac2d;
}
.noPdfLink-a {
  text-decoration: none;
  color: #0076cb;
  font-size: 14px;
}
.historyModal {
  background: #fff;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 40%;
  height: 80%;
  z-index: 10;
  overflow: auto;
  border: 1px solid #dfdfdf;
  padding: 30px;
  box-sizing: border-box;
  .page {
    margin-top: 10px;
  }
  .modalInner {
    overflow: auto;
    //   height: 100%;
  }
  .title {
    font-size: 16px;
  }
  .closeModal {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 24px;
    cursor: pointer;
  }
}
</style>