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
              >{{ pdfInfo.linkAddress }}</a>
              <a v-else :title="downloadMd5Url" :href="downloadMd5Url">{{ downloadMd5Url }}</a>
            </span>
            <!--<h-input style="width:90%;display: inline-block;" v-model="formData.linkUrl" placeholder="请输入..."></h-input>-->
          </li>
          <li class="input-box">
            <span>公告标题：</span>
            <span
              :title="pdfInfo.title"
              class="input-box-title"
            >{{ pdfInfo.title ? pdfInfo.title : '-' }}</span>
          </li>
          <li class="input-box">
            <span>发布时间：</span>
            <span
              :title="releaseDate"
              class="input-box-title"
            >{{ releaseDate ? releaseDate : '暂未发布' }}</span>
          </li>
          <li class="input-box">
            <span>公告内容：</span>
            <template v-if="extensionShow">
              <h-button type="info" @click="reloadPdfFn">加载文件</h-button>
            </template>
            <template v-else>
              <span class="noPdfLink">{{ '当前页面不支持' + pdfInfo.extension + '格式，请打开源文件进行数据录入！' }}</span>
              <a
                class="noPdfLink-a"
                style="display: inline-block"
                :title="pdfInfo.linkAddress || downloadMd5Url"
                v-if="pdfInfo.linkAddress || downloadMd5Url"
                :href="pdfInfo.linkAddress || downloadMd5Url"
                target="_blank"
              >文件下载</a>
            </template>
          </li>
          <template v-if="extensionShow">
            <iframe
              ref="pdfIframeInfo"
              name="pdfIframe"
              :src="iframeUrl"
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
          <h-button type="info" @click="showViewHistory">查看相似数据</h-button>
          <span style="height:35px;font-size:25px;position:absolute;right:0;line-height:35px" class="countdown" v-show="lockTime && lockTimer">{{lockMinute+':'+lockSecond}}</span>

        </div>
        <div class="productList" v-for="(itemArr,index) in tableTemplateData">
          <TableTemplate
            @prodCodeChange="prodCodeChange($event, index)"
            @prodCodeClear="prodCodeClear($event, index)"
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
      <div class="title">相似数据</div>
      <div class="similar_filter">
        <div class="similar_filter_col">
          <div class="label">管理人：</div>
          <div class="value">
            <h-select
              v-model="similarManager"
              placeholder="请选择管理人"
              remote
              :loading="queryManagerLoading"
              @on-change="managerChange"
              :remote-method="queryManagerList"
              @on-scroll="managerScrollLoadMore"
              filterable
              clearable
              widthAdaption
              autoPlacement
              not-found-text="无">
              <h-option
                v-for="(option) in similarManagerList"
                :value="option.value"
                :key="option.value"
              >{{ option.label }}
              </h-option>
            </h-select>
          </div>
        </div>
        <div class="similar_filter_col">
          <div class="label">产品内码：</div>
          <div class="value">
            <h-select
              v-model="similarProductCode"
              placeholder="请选择产品内码"
              :disabled="!similarManager"
              filterable
              clearable
              not-found-text="无">
              <h-option
                v-for="(option) in similarProductCodeList"
                :value="option.businessValue"
                :key="option.businessValue"
              >{{ option.businessName }}
              </h-option>
            </h-select>
          </div>
        </div>
        <div class="similar_filter_col btn">
          <h-button type="primary" :disabled="!similarManager" @click="searchSimilarData()">查询</h-button>
        </div>
      </div>
      <div class="modalInner">
        <div class="productList" v-for="(itemArr,index) in historyTableTemplateData">
          <TableTemplate
            :viewPage="true"
            :isAdd="false"
            :templateData="tableTemplate"
            v-model="historyTableTemplateData[index]"
            :key="index"
            :onTitle="onTableName"
            :loading="historyLoading"
          ></TableTemplate>
        </div>
        <div v-if="!historyLoading && !historyTableTemplateData.length" style="text-align: center;margin-top: 30px">
          <h-icon v-if="false" name="clipboard"></h-icon>
          暂无相似数据!
        </div>
      </div>
      <h-page
        v-show="historyTableTemplateData.length"
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
import {mapState, mapActions} from "vuex";
import windowDrag from "@/components/windowDrag";
import TableTemplate from "../components/table";
import {
  getHistoryProductList,
  checkVerifyData,
  getProdData,
  deleteLock,
} from "../api/apiManager";

export default {
  components: {windowDrag, TableTemplate},
  name: "ProductionInfoNoticeDataDetail",
  data() {
    return {
      modalErrorShow: false,
      modalErrorMsg: "",

      historyLoading: false,
      historyPage: 1,
      historyPageTotal: 1,
      historyModalShow: false,
      releaseDate: '',//发布日期
      taskId: "",
      pdfUrl: "",
      tableTemplate: [],
      tableTemplateData: [], //模板字段
      manageCodeList: [], // 产品对应管理人列表
      bizType: '', // 业务类型
      templateDetail: {}, //模板信息
      historyTableTemplateData: [], //相似数据
      similarManager: '', // 相似数据 管理人过滤
      similarManagerPage: 1, // 相似数据 管理人过滤 页码
      similarManagerTotalPage: 1, // 相似数据 管理人过滤 总页码
      queryManagerLoading: false, // 相似数据 管理人过滤 loading
      similarManagerQuery: '', // 相似数据 管理人过滤 搜索名
      similarManagerList: [], // 相似数据 管理人过滤列表
      similarProductCode: '', // 相似数据 产品内码过滤
      similarProductCodeList: [], // 相似数据 产品内码过滤列表
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
      checkTimer: null,//校验后台倒计时计数器
      lockTimer: null,//倒计时计数器
      lockTime: null,
      lockMinute: '00',
      lockSecond: '00',
      watcher:null,//监听器
      saveTempObj: {},
      downUrlIsAllowFrame: false, // html 是否支持内嵌
    };
  },
  computed: {
    ...mapState(["maxTableHeight"]),
    // 是否支持 iframe 展示 pdf 或者 可内嵌 html
    extensionShow() {
      let type = this.pdfInfo.extension.toLocaleLowerCase();
      return type === 'pdf' || (this.downUrlIsAllowFrame && ['htm', 'html', 'shtml'].includes(type))
    },
    // iframe 显示链接
    iframeUrl () {
      let type = this.pdfInfo.extension.toLocaleLowerCase();
      return ['htm', 'html', 'shtml'].includes(type) && this.downUrlIsAllowFrame ? this.pdfInfo.linkAddress : this.pdfUrl
    },
    // md5 下载链接
    downloadMd5Url() {
      return `/resource/pdf/${this.pdfInfo.anncMd5}`
    },
  },
  methods: {
    // 删除产品
    delProduct(index) {
      this.$hMsgBox.confirm({
        title: "删除",
        content: "确定要删除吗?",
        onOk: () => {
          this.tableTemplateData.splice(index, 1);
          this.manageCodeList.splice(index, 1);
        },
      });
    },
    // 新增产品
    addProduct() {
      this.tableTemplateData.push([]);
      this.manageCodeList.push('');
    },
    onTableName(str) {
      if (this.$refs.pdfIframeInfo.contentWindow.goSearch) {
        this.$refs.pdfIframeInfo.contentWindow.goSearch(str);
      }
    },
    reloadPdfFn() {
      window.parent.frames.pdfIframe.location.reload();
    },
    // 校验html 是否支持iframe
    checkAllowFrame(url) {
      return this.$http.get('/tm/pic/audit/anncData/getAnncResHeaders', {
        params: {
          url: url
        }
      }).then((res) => {
        let responseData = res.data
        if (responseData.status === this.$api.SUCCESS) {
          let headers = responseData.body.headers.map(item => item.name);
          this.downUrlIsAllowFrame = !headers.includes('X-Frame-Options');
        }
      })
    },
    // 获取剩余时间
    getLockTime() {
      this.$http
        .get("/pic/audit/anncData/editAnncDetail?taskId=" + this.taskId)
        .then(async (res) => {
          let data = res.data;
          if (data.status === this.$api.SUCCESS) {
            let obj = data.body || {};
            this.lockTime = obj.lockTime || null;
            if(this.lockTime){
               this.lockMinute =  parseInt(this.lockTime / 60) < 10 ? '0'+parseInt(this.lockTime / 60): parseInt(this.lockTime / 60).toString();
               this.lockSecond =  parseInt(this.lockTime % 60) < 10 ? '0'+parseInt(this.lockTime % 60): parseInt(this.lockTime % 60).toString();
            }
          } else {
            this.$hMessage.error({content: data.msg});
          }
        })
        .catch(() => {
          this.$hLoading.error();
        });
    },
    getDetailData() {
      this.isFirst = true;
      this.$http
        .get("/pic/audit/anncData/editAnncDetail?taskId=" + this.taskId)
        .then(async (res) => {
          let data = res.data;
          if (data.status === this.$api.SUCCESS) {
            let obj = data.body || {};
            this.templateDetail = obj.tmplInfoDTO || {}; //模板信息
            this.tableTemplateData = obj.anncDataItemList || [];
            this.manageCodeList = obj.manageCodeList || [];
            this.bizType = obj.bizType || '';
            //模板数据信息
            this.lockTime = obj.lockTime;
            this.releaseDate = obj.releaseDate;
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
            if (['htm', 'html', 'shtml'].includes(extension.toLocaleLowerCase())) {
              await this.checkAllowFrame(linkAddress)
            }
            this.pdfUrl =
              "../../../../static/pdf/web/viewer.html?file=" +
              encodeURIComponent("/resource/pdf/" + anncMd5);
            this.$nextTick(() => {
              this.isFirst = false;
            });
          } else {
            this.$hMessage.error({content: data.msg});
          }
        }).catch(() => {
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
              if (data.status === this.$api.SUCCESS) {
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
                this.$hMessage.error({
                  content: data.msg,
                  duration: 3,
                });
              }
            })
            .catch((err) => {
            });
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
        bizType: this.bizType,
        manageCodeList: this.manageCodeList,
        anncDataItemList: [...this.tableTemplateData],
      };
      if(processTypeCode == 1){
        this.trueSaveInfo(type, processTypeCode, url, saveInfo)
        return
      }
      // 校验数据录入规则
      try {
        let returnData = await checkVerifyData(saveInfo)
        if (returnData.resultCode == 1) {
          // 成功
          this.trueSaveInfo(type, processTypeCode, url, saveInfo)
        } else if (returnData.resultCode == 0) {
          // 禁止校验
          this.saveTempObj = {
            type: type,
            processTypeCode: processTypeCode,
            url: url,
            saveInfo: saveInfo,
          }
          this.modalErrorShow = true;
          this.modalErrorMsg = returnData.resultMsg;
        } else {
          // 接口错误
          this.$hMessage.error({content: returnData.msg});
        }
      } catch (error) {
        this.$hMessage.error({content: error.content});
      }

    },

    trueSaveInfo(type, processTypeCode, url, saveInfo) {
      this.$http
        .post(url, saveInfo)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            let msg = "保存";
            if (type == "submit") {
              msg = "提交";
            } else if (type == "edit") {
              msg = "修改";
            }
            this.$hMessage.success({content: msg + "成功"});
            this.pdfInfo.processTypeCode = processTypeCode;
            this.modalErrorShow = false
            const watcher = this.watcher;
            watcher();
            this.watcher = null;
            this.setMsgContent(false);
            this.checkUpdate();
              } else {
                this.$hMessage.error({content: data.msg});
              }
            if (type == "submit" || type == "edit") {//在修改或提交之后，退回列表界面，后台已解锁，前端无需解锁处理
              this.$store.commit("DEL_TAB", this.$route.path);
              this.$router.push("/productionInfo/noticeData/list");
            }
        })
      // .catch((err) => {
      //   this.$hLoading.error();
      // });
    },
    forceSubmit() {
      this.$hMsgBox.confirm({
        title: "公开",
        content: "是否确认强制公开？",
        onOk: () => {
          let {type, processTypeCode, url, saveInfo} = this.saveTempObj
          this.trueSaveInfo(type, processTypeCode, url, saveInfo)
        },
      });
    },
    // 查看相似数据 similar data
    async showViewHistory() {
      this.historyPage = 1;
      this.historyTableTemplateData = [];
      this.similarManager = '';
      if (!this.historyModalShow) {
        // this.viewHistory();
        this.similarManagerPage = 1;
        let manager = '';
        this.manageCodeList.every(item => {
          if (item) {
            manager = item;
            return false
          }
          return true
        })
        await this.queryManagerList(manager);
        this.similarManager = manager;
        this.historyModalShow = true;
        if (!this.similarManager) {
          this.$hMessage.warning(("请选择管理人！"));
        } else {
          this.searchSimilarData();
        }
      } else {
        this.historyModalShow = false;
      }
    },
    // 检索相似数据
    searchSimilarData(isProductCode) {
      if (!this.similarManager) {
        return;
      }
      if (!isProductCode) {
        this.historyLoading = true;
      }
      let body = {
        bizType: this.bizType,
        templateId: this.templateDetail.id,
        prodCode: this.similarProductCode,
        manageCode: this.similarManager,
        pageSize: 1,
        currentPage: this.historyPage
      }
      this.$http
        .post("/tm/pic/audit/anncData/getSimilarProdData", body)
        .then((res) => {
          let data = res.data;
          if (data.status === this.$api.SUCCESS) {
            data = data.body;
            this.historyPageTotal = data.totalSize;
            let itemList = data.dataList || [];
            if (itemList.length > 0) {
              if (isProductCode) {
                this.similarProductCodeList = itemList[0]["prodCodeList"] || [];
              } else {
                this.historyTableTemplateData = [];
                this.$nextTick(() => {
                this.historyTableTemplateData = itemList[0]["anncDataItemList"] || [];
                })
              }
            }
          } else {
            this.$hMessage.error({
              content: data.msg,
              duration: 3,
            });
          }
          this.historyLoading = false;
        }).catch(() => {
        this.historyLoading = false;
        this.$hMessage.error("查询相似数据列表失败!");
      })
    },
    // 查询管理人列表
    queryManagerList(query) {
      this.similarManagerPage = 1;
      this.similarManagerList = [];
      return this.getManagerList(query)
    },
    // 获取管理人列表
    getManagerList(query, isScroll) {
      if (!isScroll) {
        this.queryManagerLoading = true;
      }
      this.similarManagerQuery = query;
      return this.$http
        .post("/tm/pic/audit/anncData/getPicCategory", {
          type: 'GLR',
          businessName: query,
          pageSize: 10,
          currentPage: this.similarManagerPage
        })
        .then(async (res) => {
          let data = res.data;
          if (data.status === this.$api.SUCCESS) {
            let list = this.similarManagerList;
            let value = data.body.dataList;
            list = list.concat(value);
            this.similarManagerList = list;
            this.similarManagerTotalPage = Math.ceil(data.body.totalSize / 10)
            // console.log(this.similarManagerList)
          } else {
            this.$hMessage.error({
              content: data.msg,
              duration: 3,
            });
          }
          this.queryManagerLoading = false;
        }).catch(() => {
          this.queryManagerLoading = false;
          this.$hMessage.error("查询管理人列表失败!");
        })
    },
    // 管理人滚动 加载更多
    managerScrollLoadMore(scroll) {
      if (scroll <= 1 && this.similarManagerPage < this.similarManagerTotalPage) {
        this.similarManagerPage++;
        this.getManagerList(this.similarManagerQuery, true)
      }
    },
    // 管理人 选择
    managerChange(data) {
      this.historyPage = 1;
      this.similarProductCode = '';
      this.searchSimilarData(true);
    },
    // 查询产品内码列表
    queryProductCodeList() {

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
            this.historyTableTemplateData = itemList[0]["anncDataItemList"] || [];
          }
          this.historyLoading = false;
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
          this.historyLoading = false;
        });
    },
    // 分页切换
    onPageChange(current) {
      this.historyPage = current;
      this.searchSimilarData();
      // this.viewHistory();
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
    prodCodeClear(value, index) {
      this.manageCodeList[index] = '';
    },
    // 产品内码修改
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
          let ancDataItem = data.anncDataItemList && data.anncDataItemList.length ? data.anncDataItemList[0] : [];
          let prodCode = data.manageCodeList && data.manageCodeList.length ? data.manageCodeList[0] : ''
          this.tableTemplateData.splice(index, 1, ancDataItem);
          this.manageCodeList.splice(index, 1, prodCode);
        } else {
          this.$hMsgBox.confirm({
            title: "是否覆盖当前数据",
            content: "",
            onOk: () => {
              let ancDataItem = data.anncDataItemList && data.anncDataItemList.length ? data.anncDataItemList[0] : [];
              let prodCode = data.manageCodeList && data.manageCodeList.length ? data.manageCodeList[0] : ''
              this.tableTemplateData.splice(index, 1, ancDataItem);
              this.manageCodeList.splice(index, 1, prodCode);
            },
            onCancel: () => {
              let prodCode = data.manageCodeList && data.manageCodeList.length ? data.manageCodeList[0] : ''
              this.manageCodeList.splice(index, 1, prodCode);
            }
          });
        }
      } catch (error) {
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
            .then((data) => {
            })
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
    // 设置关闭页面弹窗
    setMsgContent(show) {
      let _this = this;
      let obj = {
        url: this.$route.path,
        show: show,
        msg: "是否离开当前页，录入数据将不再保留？",
        fn: () => {
          let body = {
            taskId: this.taskId,
          };
          deleteLock(body)
            .then((data) => {
              console.log(data);
            })
            .catch((error) => {
              this.$hMessage.error(error.content);
            });
        },
      };
      this.$store.commit("SET_TAB_MSG", obj);
    },
    countdown() {
      //30分钟的倒计时
      let that = this;
      let minute = null;
      let second = null;
      this.getLockTime();
      this.checkTimer = setInterval(() => {
        that.getLockTime();
      }, 600000)
      if(this.lockTimer){
        console.log('存在lockTimer');
        clearInterval(this.lockTimer);
        this.lockTimer = null;
      }
      this.lockTimer = setInterval(() => {
        
        if(that.lockTime === null){
          clearInterval(that.lockTimer);
          that.lockTimer = null;
        }
        if (that.lockTime === 0) {
          if (that.tableTemplateData.length >= 0 && that.testFormRequired()) {
            that.saveFirstFn("save", 1);
          }
          clearInterval(that.lockTimer);
          that.lockTimer = null;
          let body = {
            taskId: that.taskId,
          };
          deleteLock(body)
            .then((data) => {
              that.$store.commit("DEL_TAB", this.$route.path);
              that.$router.push("/productionInfo/noticeData/list");
            })
            .catch((error) => {
              that.$hMessage.error(error.content);
            });
        } else {
          that.lockTime--;
          minute = parseInt(that.lockTime / 60);
          second = parseInt(that.lockTime % 60);
          minute < 10 ? that.lockMinute = '0'+minute : that.lockMinute = minute.toString();
          second < 10 ? that.lockSecond = '0'+second : that.lockSecond = second.toString();
        }
      }, 1000);
    },
    checkUpdate(){//检测数据是否被修改
      let timer = setTimeout(() => {
        console.log('start');
         this.watcher = this.$watch(
        "tableTemplateData",
        (oldArr,newArr) => {
          this.setMsgContent(true);
          console.log('change');
        },
        {deep: true}
      ); 
      }, 2000);
    }
  },
  mounted(){
    this.taskId = this.$route.query.taskId;
    this.getDetailData();
    this.checkUpdate();
    this.countdown();
    this.closeTabReleaseLock();
  },
  activated: function () {
    let taskId = this.$route.query.taskId;
    this.countdown();
    if (taskId == this.taskId) {
      return;
    } else {
      this.taskId = taskId;
      this.getDetailData();
      this.closeTabReleaseLock();
    }
  },
  deactivated() {
    clearInterval(this.lockTimer);
    clearInterval(this.checkTimer);
    this.lockTimer = null;
    this.checkTimer = null;
  },
  beforeDestroy() {
    clearInterval(this.lockTimer);
    clearInterval(this.checkTimer);
    this.lockTimer = null;
    this.checkTimer = null;
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
  margin: 5px 0;
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
  width: 50%;
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

  .similar_filter {
    display: flex;
    align-items: center;
    margin: 10px 0;
    flex-direction: row;

    .similar_filter_col {
      display: flex;
      flex: 1;
      margin-right: 10px;
      align-items: center;

      .label {
        margin-right: 10px;
        white-space: nowrap;
      }

      .value {
        flex: auto;
      }

      &.btn {
        flex: 0;
        margin-right: 0;
      }
    }
  }
}
.modalFooter{
  display: flex;
  justify-content: space-between;
}
</style>

