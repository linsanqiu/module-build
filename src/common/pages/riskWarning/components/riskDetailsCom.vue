<!--
 * @Author: your name
 * @Date: 2020-05-18 09:09:10
 * @LastEditTime: 2020-05-21 15:20:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /three-admin-ui/src/pages/riskWarning/violate/details.vue
-->

<template>
  <div class="mainContent">
    <windowDrag leftW="40%">
      <div class="boxLeftContent" slot="left">
        <template>
          <iframe :src="iframeUrl" width="100%" height="100%" frameborder="0"></iframe>
        </template>
      </div>
      <div class="boxRightContent" slot="right">
        <div class="mainHeader">
          <div class="mainHeaderLeft">
            <div class="headerLeftTop">
              <div style="display:flex">
                <span>公告源文件</span>
                <a v-if='downUrl' :href="downUrl" class="aTag" target="__blank">
                  <img src="../../../assets/img/irrow_down.png" alt="下载" class="downIcon" />
                </a>
              </div>
              <div class="publishStatus">
                公告状态：{{anncInfo.processStatusDesc}}
                <span
                  class="effect"
                  v-if="anncInfo.publishStatusDesc"
                >有效状态：{{anncInfo.publishStatusDesc}}</span>
              </div>
            </div>
            <a v-if="webUrl" :href="webUrl" class="webUrl" target="__blank">{{webUrl}}</a>
          </div>
          <div class="mainHeaderRight">
            <h-button @click="nextItem" v-if="nextBtnShow">下一条</h-button>
            <h-button
              type="primary"
              @click="noNeedToDeal"
              v-if="noDealBtnShow"
            >{{anncInfo.processStatus == 2 ? "需要处理":"无需处理"}}</h-button>
            <h-button type="success" @click="completeDeal" v-if="dealDoneBtnShow">处理完成</h-button>
            <h-button @click="goBack">返回</h-button>
          </div>
        </div>
        <div class="contentMain">
          <evnetInfo
            :isPageEditing="canEdit"
            @publishEvents="publishEvents"
            @changeLock="lockEvent"
            @refreshDetails='refreshDetails'
          ></evnetInfo>
          <div class="showContent">
            <div class="arrowContent">
              <h-icon
                :name="processShow?'chevron-up':'chevron-down'"
                @on-click="showArrow('processShow')"
                class="iconArrow"
              ></h-icon>
            </div>
            <div v-if="!processShow" class="title">事件进程</div>
            <div class="titlLine" v-if="!processShow" style="margin-top:8px"></div>
            <div v-show="processShow">
              <template v-for="(data, index) in eventProcesses">
                <eventProcess
                  :ref="`process${index}`"
                  :index="index"
                  :key="`process${index}`"
                  :canDelete="eventProcesses.length > 1"
                  :tableTemplateDataObj="data"
                  :isPageEditing="canEdit"
                ></eventProcess>
              </template>
            </div>
          </div>

          <div class="partyContent">
            <div class="partyHeader">
              <div class="title">当事人</div>
              <div class="arrowContent">
                <h-icon
                  :name="partyShow?'chevron-up':'chevron-down'"
                  @on-click="showArrow('partyShow')"
                  class="iconArrow"
                ></h-icon>
              </div>
              <div class="titlLine" v-if="!partyShow"></div>
            </div>
            <div v-show='partyShow'>
              <h-table
                :rowSelectOnly="true"
                :highlight-row="true"
                :maxHeight="eventParties.length ? '200': null"
                @on-row-click="handleClickRow"
                stripe
                size="small"
                border
                :columns="partyColumns"
                :data="eventParties"
              ></h-table>
              <eventPartyInfo
                ref='partyRef'
                :index="eventPartyIndex"
                :canDelete="eventParties.length > 1"
                :tableTemplateDataObj="eventParties[eventPartyIndex]"
                :isPageEditing="canEdit"
              ></eventPartyInfo>
            </div>
          </div>
          <div class="showContent">
            <div class="arrowContent">
              <h-icon
                :name="anncInfosShow?'chevron-up':'chevron-down'"
                @on-click="showArrow('anncInfosShow')"
                class="iconArrow"
              ></h-icon>
            </div>
            <div v-if="!anncInfosShow" class="title">关联公告</div>
            <div v-show="anncInfosShow">
              <template v-for="(data, index) in anncInfos">
                <eventRelationInfo
                  :showRemark="anncInfo.anncId === data.anncId"
                  :index="index"
                  :key="`relation${index}`"
                  :tableTemplateDataObj="data"
                  :isPageEditing="canEdit"
                   @refreshDetails='refreshDetails'
                   @changeLock="lockEvent"
                ></eventRelationInfo>
              </template>
            </div>
          </div>
        </div>
        <div class="eventsTabs">
          <h-button
            v-for="(item, index) in eventList"
            :key="index"
            @click="tabClick(index, item.eventInfo.eventId)"
            :type="index == eventSelectIndex?'primary':'ghost'"
          >{{`事件${index+1}`}}</h-button>
          <h-button @click="addEvent" v-if="addEventBtnShow">+新增事件</h-button>
        </div>
      </div>
    </windowDrag>
    <h-msgBox
      :isOkLeft="true"
      title="提示"
      v-model="modalCheckPublish"
      @on-ok="confirmCheckFun"
      ok-text="确定公开"
      class="mainModal"
    >
      <div class="modalContent">
        <div class="modalTitle">疑似错误</div>
        <p v-html="modalCheckPublishMsg"></p>
      </div>
    </h-msgBox>
    <h-msgBox
      :isOkLeft="true"
      title="请检查"
      v-model="modalErrorShow"
      @on-ok="hidenError"
      class="mainModal"
    >
      <div class="modalTitle">强制校验</div>
      <p v-html="modalErrorMsg"></p>
    </h-msgBox>
  </div>
</template>
<script>
import windowDrag from "@/components/windowDrag";
import evnetInfo from "../components/evnetInfo";
import { copyDeep } from "@/filters";
import eventProcess from "../components/eventProcess";
import eventRelationInfo from "../components/eventRelationInfo";
import eventPartyInfo from "../components/eventPartyInfo";
import { mapState, mapActions, mapGetters } from "vuex";
import {
  getViolateDetails,
  violateNext,
  retrnBack,
  noDealEvent,
  completeEvent,
  publushEvent as apiPublushEvent,
  checkPublish,
  judjeLockEvent,
  shouldDealAnnc,
} from "../api/apiManager";
export default {
  components: {
    windowDrag,
    evnetInfo,
    eventProcess,
    eventRelationInfo,
    eventPartyInfo,
  },
  props: {
    //   isPageEditing:flase (查看)， true (编辑)
    isPageEditing: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      processShow: true,
      anncInfosShow: true,
      partyShow: true,
      partyColumns: [
        {
          key: "partyName",
          title: "当事人",
          align: "left",
          width: 150,
        },
        {
          key: "partyNatureDesc",
          title: "当事人性质",
          align: "left",
          width: 100,
        },
        {
          key: "startDate",
          title: "开始日期",
          align: "left",
          width: 100,
        },
        {
          key: "closeDate",
          title: "截止日期",
          align: "left",
          width: 100,
        },
        {
          key: "punishOrgNames",
          title: "处罚机构",
          align: "left",
          width: 200,
        },
        {
          key: "punishedOrgCode",
          title: "被处罚机构编码",
          align: "left",
          width: 200,
          render: (h, params) => {
            let punishedOrgCode = params.row.punishedOrgCode || {};
            return <div>{punishedOrgCode.punishedOrgDesc || ""}</div>;
          },
        },
        {
          key: "punishTypeNames",
          title: "处罚类型",
          align: "left",
          width: 200,
        },
      ],
      activeEventIsLock: false,
      src: "",
      webUrl: "",
      downUrl: "",
      processStatusDesc: "",
      taskId: "",
      offset: "",
      modalCheckPublish: false,
      modalCheckPublishMsg: "",
      modalErrorShow: false,
      modalErrorMsg: "",
      nowEvent: {},
      // down Url是否允许iframe 访问
      downUrlIsAllowFrame: false
    };
  },
  computed: {
    ...mapGetters("riskWarning", {
      eventList: "getEventList",
      eventProcesses: "getEventProcesses",
      eventParties: "getEventParties",
      anncInfos: "getAnncInfos",
      eventSelectIndex: "getEventSelectIndex",
    }),
    ...mapState("riskWarning", {
      eventInfo: "eventInfo",
      anncInfo: "anncInfo",
      eventPartyIndex: "eventPartyIndex",
    }),
    // iframe 链接显示
    iframeUrl () {
      /**
       * 如果原始文件 originalExtension 为 htm 或者 html 直接显示downUrl
       */
      if (this.anncInfo.hasOwnProperty('originalExtension') && 'html'.includes(this.anncInfo.originalExtension) && this.downUrl) {
        return this.downUrlIsAllowFrame ? this.downUrl : this.src;
      }
      return this.src
    },
    canEdit() {
      if (this.anncInfo.publishStatus == 2) {
        return false;
      }
      if (this.activeEventIsLock) {
        return false;
      }
      // 公告状态为无需处理
      if (this.anncInfo.processStatus == 2) {
        return false;
      }
      if (this.isPageEditing) {
        return true;
      }
      return true;
    },
    isFromEventList() {
      if (this.$route.path.indexOf("publishEvents") != -1) {
        return true;
      } else {
        return false;
      }
    },
    nextBtnShow() {
      if (this.anncInfo.publishStatus == 2) {
        return false;
      }
      if (
        this.isPageEditing &&
        this.anncInfo.processStatus !== 1 &&
        this.anncInfo.processStatus !== 2 &&
        !this.isFromEventList
      ) {
        return true;
      }
      return false;
    },
    dealDoneBtnShow() {
      if (this.anncInfo.publishStatus == 2) {
        return false;
      }
      if (
        this.isPageEditing &&
        this.anncInfo.processStatus != 2 &&
        !this.isFromEventList
      ) {
        return true;
      }
      return false;
    },
    noDealBtnShow() {
      if (this.anncInfo.publishStatus == 2) {
        return false;
      }
      if (this.isPageEditing && !this.isFromEventList) {
        return true;
      }
      return false;
    },
    addEventBtnShow() {
      if (this.anncInfo.publishStatus == 2) {
        return false;
      }
      if (this.isPageEditing && this.anncInfo.processStatus != 2) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.init();
    this.lGetProcess();
    this.lMoneyType();
    this.lConstRelationList();
    this.lPunishType();
    this.lRiskOrganizationList();
    this.lRiskTypeList();
    this.lPartyType();
    this.lNoticeTypeList();
  },
  methods: {
    ...mapActions("riskWarning", {
      aSetViolateDetails: "setViolateDetails",
      aSetEventSelectIndex: "setEventSelectIndex",
      aAddEvent: "addEvent",
      aSaveEvent: "saveEvent",
      aSetAnncInfo: "setAnncInfo",
      coverNowEvent: "coverNowEvent",
      aSetPartyIndex: "setPartyIndex",
      aCoverParties: "coverParties",
    }),
    ...mapActions("constList", {
      lGetProcess: "eventProcessStatus",
      lMoneyType: "moneyType",
      lConstRelationList: "constRelationList",
      lPunishType: "punishType",
      lRiskOrganizationList: "riskOrganizationList",
      lRiskTypeList: "riskTypeList",
      lPartyType: "partyType",
      lNoticeTypeList: "noticeTypeList"
    }),
    refreshDetails(){
      if (this.eventId){
        this.$router.push(
          {
            path: 'details',
            query: {
              eventId: this.eventInfos[0].eventId,
              offset: this.offset,
              lock: true
            }
          }
        )
      }else{
        this.$router.push(
          {
            path: 'details',
            query: {
              taskId: this.taskId,
              offset: this.offset,
              lock: true
            }
          }
        )
      }

      this.init()
    },
    init() {
      let { taskId, offset, lock = false, eventId } = this.$route.query;
      this.taskId = taskId;
      this.offset = offset || 1;
      this.eventId = eventId;
      let body = {
        taskId: this.taskId,
        lock: lock,
      };
      if (eventId) {
        body = {
          eventId: this.eventId,
          lock: lock,
        };
      }
      getViolateDetails(body)
        .then( async (data) => {
          let { anncInfo, activeEventId, activeEventIsLock, eventInfos } = data;
          // this.pdfUrl =  '../../../../static/pdf/web/viewer.html?file=' + encodeURIComponent('/resource/pdf/'+anncMd5);
          let {
            downUrl,
            processStatus,
            webUrl,
            processStatusDesc,
            anncId,
            taskId,
            md5,
          } = anncInfo;
          this.taskId = taskId;
          this.downUrlIsAllowFrame = false;
          if (anncInfo.hasOwnProperty('originalExtension') && 'html'.includes(anncInfo.originalExtension) && downUrl) {
            await this.checkAllowFrame(downUrl)
          }
          this.downUrl = downUrl;
          // this.src = '../../../../static/pdf/web/viewer.html?file=' + encodeURIComponent(downUrl);
          this.src =
            "../../../../static/pdf/web/viewer.html?file=" +
            encodeURIComponent("/resource/pdf/" + md5);
          this.processStatusDesc = processStatusDesc;
          this.webUrl = webUrl;
          this.activeEventId = activeEventId;
          this.activeEventIsLock = activeEventIsLock;
          for (let i = 0; i < eventInfos.length; i++) {
            let eventInfo = eventInfos[i].eventInfo;
            if (eventInfo.eventId == activeEventId) {
              this.aSetEventSelectIndex({ index: i });
              break;
            }
          }
          this.aSetAnncInfo(anncInfo);
          this.aSetViolateDetails(eventInfos);
          this.aSetPartyIndex(0);
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
        });
    },
    // 校验html 是否支持iframe
    checkAllowFrame (url) {
      return this.$http.get('/tm/vac/anncEvent/getAnncResHeaders', {
        params: {
          url: url
        }
      }).then((res) => {
        let responseData = res.data
        if (responseData.status === this.$api.SUCCESS) {
          let headers = responseData.body.headers.map(item => item.name)
          this.downUrlIsAllowFrame = !headers.includes('X-Frame-Options');
        }
      })
    },
    nextItem() {
      // 下一条
      let body = {
        taskId: this.taskId,
        offset: this.offset,
      };
      violateNext(body)
        .then((data) => {
          this.toNext(data);
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
        });
    },
    toNext(data) {
      let { offset, taskId } = data;
      this.$router.push({
        query: {
          offset: offset,
          taskId: taskId,
          lock: this.$route.query.lock || false,
        },
        path: this.isPageEditing ? "details" : "view",
      });
      this.init();
    },
    tabClick(index, eventId) {
      if (this.eventSelectIndex == index) return;
      if (!this.isPageEditing) {
        let payload = {
          index: index,
        };
        this.aSetEventSelectIndex(payload);
        return;
      }
      if (this.activeEventIsLock) {
        this.lockEvent(index, eventId);
        return;
      }
      let { publishStatusCode } = this.eventInfo;
      if (
        publishStatusCode == "1" ||
        publishStatusCode == "2" ||
        this.anncInfo.processStatus == 2
      ) {
        this.lockEvent(index, eventId);
      } else {
        let pass = this.checkFormAllSave(false);
        if (!pass) {
          this.$hMsgBox.confirm({
            title: "温馨提示",
            content: "存在未保存表，是否切换事件",
            onOk: () => {
              this.lockEvent(index, eventId);
            },
          });
        } else {
          this.lockEvent(index, eventId);
        }
      }
    },
    lockEvent(index, eventId) {
      let body = { eventId: eventId };
      judjeLockEvent(body)
        .then((data) => {
          let payload = {
            index: index,
          };
          let { activeEventId, activeEventIsLock } = data;
          this.activeEventId = activeEventId;
          this.activeEventIsLock = activeEventIsLock;
          this.aSetPartyIndex(0)
          this.aSaveEvent();
          this.aSetEventSelectIndex(payload);
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
        });
    },
    addEvent() {
      let callback = (eventId) => {
        this.activeEventIsLock = false
        this.activeEventId = eventId
      }
      let payload = {
        callback: callback,
        anncId: this.anncInfo.anncId
      }
      this.aSaveEvent();
      this.aAddEvent(payload);
    },
    checkAnncAllSave() {
      let { anncInfos = [] } = this;
      let finallList = [...anncInfos];
      let editingList = finallList.filter((item) => {
        return item.editing;
      });
      if (editingList.length == 0) {
        return true;
      }
      this.$hMessage.warning({
        content: "存在关联公告未保存",
      });

      return false;
    },
    checkFormAllSave(toast = true) {
      let {
        eventProcesses = [],
        eventParties = [],
        anncInfos = [],
        eventInfo = [],
      } = this;
      let finallList = [
        ...eventProcesses,
        ...eventParties,
        ...anncInfos,
        eventInfo,
      ];
      let editingList = finallList.filter((item) => {
        return item.editing;
      });
      if (editingList.length == 0) {
        return true;
      }
      if (toast) {
        this.$hMessage.warning({
          content: "存在未保存表",
        });
      }

      return false;
    },
    checkAllForm() {
      let formPass = true;
      let refs = [];
      let { eventProcesses, eventParties } = this;
      for (let i = 0; i < eventProcesses.length; i++) {
        refs.push(`process${i}`);
      }
      for (let i = 0; i < refs.length; i++) {
        let refsName = refs[i];
        let ref = this.$refs[refsName];
        if (ref && ref.length > 0) {
          let pass = this.$refs[refsName][0].checkRequire();
          if (!pass) {
            formPass = pass;
            break;
          }
        }
      }
      let partyRef =  this.$refs['partyRef']
      let pass = partyRef.checkRequire();
      if (!pass){
        formPass = pass
      }
      return formPass;
    },
    publishEvents() {
      let pass = this.checkAllForm();
      if (!pass) return;
      pass = this.checkAnncAllSave();
      if (!pass) return;
      // this.confirmCheckFun();
      // return;
      this.$hMsgBox.confirm({
        isOkLeft: true,
        title: "公开事件",
        content: "确定公开事件吗？",
        onOk: () => {
          let { eventInfo, eventParties, anncInfos, eventProcesses } = this;
          let body = {
            anncId: this.anncInfo.anncId,
            eventInfo: {
              eventInfo: eventInfo,
              eventParties: eventParties,
              anncInfos: anncInfos,
              eventProcesses: eventProcesses,
            },
          };
          checkPublish(body)
            .then((data) => {
              if (data.checkCode == 1) {
                this.confirmCheckFun();
              } else if (data.checkCode == 0) {
                this.modalErrorShow = true;
                this.modalErrorMsg = data.checkMsg;
                // this.$hMessage.error(data.checkMsg);
              } else if (data.checkCode == 2) {
                this.modalCheckPublish = true;
                this.modalCheckPublishMsg = data.checkMsg;
              }
            })
            .catch((error) => {
              this.$hMessage.error(error.content);
            });
        },
      });
    },
    confirmCheckFun() {
      let { eventInfo, eventParties, anncInfos, eventProcesses } = this;
      let body = {
        anncId: this.anncInfo.anncId,
        eventInfo: {
          eventInfo: eventInfo,
          eventParties: eventParties,
          anncInfos: anncInfos,
          eventProcesses: eventProcesses,
        },
      };
      // 公开事件
      apiPublushEvent(body)
        .then((data) => {
          this.$hMessage.info("公开成功");
          this.coverNowEvent(data);
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
        });
    },
    goBack() {
      // 释放锁
      let body = {
        taskId: this.taskId,
      };
      retrnBack(body)
        .then((data) => {
          this.$store.commit("DEL_TAB", this.$route.path);
          if (this.isFromEventList) {
            this.$router.push("/riskWarning/publishEvents/list");
          } else {
            this.$router.push("/riskWarning/violate/list");
          }
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
        });
    },
    noNeedToDeal() {
      if (this.anncInfo.processStatus == 2) {
        // 需要处理
        let body = {
          taskId: this.taskId,
        };
        shouldDealAnnc(body)
          .then((data) => {
            let anncInfo = this.anncInfo;
            anncInfo.processStatus = 0;
            anncInfo.processStatusDesc = "待完成";
            this.aSetAnncInfo(anncInfo);
          })
          .catch((error) => {
            this.$hMessage.error(error.content);
          });
      } else {
        let body = {
          taskId: this.taskId,
          offset: this.offset,
        };
        noDealEvent(body)
          .then((data) => {
            this.toNext(data);
          })
          .catch((error) => {
            this.$hMessage.error(error.content);
          });
      }
    },
    hidenError() {
      this.modalErrorShow = false;
    },
    completeDeal() {
      // 判断所有表是否保存
      // let pass = this.checkFormAllSave();
      // if (pass) {
      let body = {
        taskId: this.taskId,
        offset: this.offset,
      };
      completeEvent(body)
        .then((data) => {
          this.toNext(data);
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
        });
      // }
    },
    handleClickRow(params) {
      let [row, index] = params;
      if (index == this.eventPartyIndex) {
        return;
      }
      let nowParty = this.eventParties[this.eventPartyIndex];
      if (nowParty.editing && this.eventInfo.publishStatusCode == 0) {
        this.heightRow(this.eventPartyIndex);
        this.$hMessage.warning("当前前当事人信息未保存，请先保存");
        return;
      }
      this.aSetPartyIndex(index);
    },
    heightRow(value) {
      for (let i = 0; i < this.eventParties.length; i++) {
        let item = this.eventParties[i];
        if (i == value) {
          item["_highlight"] = true;
          this.$set(this.eventParties, i, item);
        } else {
          item["_highlight"] = false;
          this.$set(this.eventParties, i, item);
        }
      }
    },
    showArrow(type) {
      this[type] = !this[type];
    },

  },
  activated() {
    let { taskId, offset, lock = false } = this.$route.query;
    this.taskId = taskId;
    this.offset = offset;
    this.init();
  },
  watch: {
    eventPartyIndex: {
      handler(value) {
        this.heightRow(value);
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.mainContent {
  height: 100%;
}
.mainContent /deep/ .h-form-item {
  margin-bottom: 4px !important;
  // flex-wrap: nowrap;
  // display: flex;
}
.mainContent /deep/ .h-form-item-label {
  // flex: 0 0 auto;
}
.mainContent /deep/ .title {
  font-size: 14px;
  width: 80px;
  text-align: left;
}
.mainContent /deep/ .h-btn {
  margin-left: 10px !important;
}
.boxLeftContent {
  min-width: 300px;
  height: 100%;
  border: 1px solid #dfdfdf;
}
.webUrl {
  max-width: 200px;
  //   white-space: nowrap;
  // 　overflow: hidden;
  // 　text-overflow: ellipsis;
  //   display: block;
  color: #298dff;
}
.boxRightContent {
  font-size: 14px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-left: none;
  position: relative;
  padding-top: 80px;
  padding-bottom: 60px;
  overflow: hidden;
  .contentMain {
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
    .showContent {
      position: relative;
      padding-top: 10px;
      padding-bottom: 10px;
      .title {
        width: 80px;
        text-align: left;
      }
      .arrowContent {
        position: absolute;
        right: 10px;
        top: 10px;
        .iconArrow {
          cursor: pointer;
        }
      }
    }
  }
  .eventsTabs {
    display: flex;
    position: absolute;
    left: 0;
    bottom: 0;
    align-items: center;
    width: 100%;
    padding-left: 20px;
    overflow-x: auto;
    overflow-y: hidden;
  }
}
.mainHeader {
  width: 100%;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
  padding: 8px 20px;
  height: 80px;
  position: absolute;
  left: 0;
  top: 0;
  .mainHeaderLeft {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    .aTag {
      color: #298dff;
      display: flex;
      align-items: center;
    }
    .headerLeftTop {
      display: flex;
      flex-direction: column;
      font-size: 18px;
      font-weight: bold;
      align-items: flex-start;
      .downIcon {
        cursor: pointer;
        width: 20px;
        height: 20px;
        margin-left: 10px;
      }
    }
  }
  .publishStatus {
    font-size: 14px;
    font-weight: normal;
    margin-right: 10px;
    .effect {
      font-size: 12px;
      color: #666;
      margin-left: 20px;
    }
  }
  .mainHeaderRight {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
  }
}
.mainModal /deep/ .modalTitle {
  font-size: 16px;
  margin-bottom: 10px;
  color: red;
  line-height: 24px;
}
.partyContent {
  .partyHeader {
    position: relative;
  }
  .arrowContent {
    position: absolute;
    right: 10px;
    top: 0px;
    .iconArrow {
      cursor: pointer;
    }
  }

  .title {
    // font-size: 18px;
    margin-bottom: 8px;
  }
}
.titlLine{
    border-bottom: 1px dashed #999;
}
</style>
