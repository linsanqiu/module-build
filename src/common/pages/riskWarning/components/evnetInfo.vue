<!--
 * @Author: your name
 * @Date: 2020-05-19 13:07:25
 * @LastEditTime: 2020-05-21 11:20:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /three-admin-ui/src/pages/riskWarning/components/publishEventInfo.vue
--> 
<template>
  <div class="mainContainer">
    <div class="heder">
      <div class="headerLeft">
        <div class="title">事件信息</div>
        <h-button
          type="primary"
          @click="editEvents"
          size="small"
          v-if="isPageEditing && showEditigBtn"
          >{{ this.eventInfo.editing ? "保存" : "编辑" }}</h-button
        >
      </div>
      <div class="headerRight">
        <span style="font-size: 12px"
          >事件状态：{{ eventInfo.publishStatus }}</span
        >
        <h-button
          @click="showModal"
          type="primary"
          v-if="isPageEditing"
          size="small"
          >快捷选择</h-button
        >
        <h-button
          @click="deleteEvents"
          type="warning"
          v-if="isPageEditing"
          size="small"
          >删除事件</h-button
        >
        <h-button
          @click="publishEvents"
          type="error"
          v-if="isPageEditing"
          size="small"
          >公开事件</h-button
        >
      </div>
    </div>
    <div class="hanledHeader" v-if="eventInfo.updateOperator">
      <span>处理人：{{ eventInfo.updateOperator }}</span>
      <span>处理时间：{{ eventInfo.updateTime }}</span>
    </div>
    <div class="timeContent" v-if="eventInfo.latestProcess">
      最新事件进程：{{ eventInfo.latestProcess }}
    </div>
    <div class="timeContent" v-if="eventInfo.anncLatestReleaseTime">
      最新公告日期：{{ eventInfo.anncLatestReleaseTime }}
    </div>
    <div class="timeContent" v-if="eventInfo.anncFirstReleaseTime">
      首次信息发布日期：{{ eventInfo.anncFirstReleaseTime }}
    </div>
    <div class="content">
      <h-form :model="eventInfo" :label-width="85" label-position="left">
        <h-form-item prop="eventId" label="事件编号：">
          <h-input
            v-model="eventInfo.eventId"
            :disabled="true"
            placeholder="请输入事件编号"
          ></h-input>
        </h-form-item>
        <div class="formContent">
          <h-button
            type="primary"
            class="formatBtn"
            size="small"
            @click="formatText"
            >排版</h-button
          >
          <h-form-item prop="eventDesc" label="事项内容：">
            <div class="topAction">
              <h-input v-model="beforeText"></h-input>
              <div class="textContent">替换为</div>
              <h-input v-model="afterText"></h-input>
              <h-button
                type="primary"
                size="small"
                @click="replaceText"
                style="height: 25px"
                >替换</h-button
              >
            </div>
            <textarea
              placeholder="请输入事项内容（必填）"
              v-model="eventInfo.content"
              @dblclick="dbClick"
              :disabled="!isPageEditing || !eventInfo.editing"
              ref="eventContent"
              class="textArea"
            ></textarea>
          </h-form-item>
        </div>
        <div v-if="isEventInfoItemShow">
          <div
            v-for="(item, index) in eventSubs"
            :key="index"
            class="relationList"
          >
            <EventInfoItem
              changeValueKey="innerCode"
              valueKey="innerCode"
              nameKey="securityName"
              specKey="companyCode"
              action="/hos-api/vac/securities/queryLike"
              itemType="security"
              itemName="涉及证券："
              :editing="eventInfo.editing && isPageEditing"
              @addLabelInfoFn="addLabelInfoFn"
              :item="item"
              :index="index"
              :showKeyLabelKeyList="[
                'securitiesCode',
                'securitiesName',
                'companyCode',
              ]"
              placeholder="请选择涉及证券"
            ></EventInfoItem>
            <EventInfoItem
              valueKey="companyCode"
              nameKey="companyName"
              action="/hos-api/vac/company/queryLike"
              itemType="company"
              itemName="涉及公司："
              :editing="eventInfo.editing && isPageEditing"
              @addLabelInfoFn="addLabelInfoFn"
              :item="item"
              :index="index"
              :showKeyLabelKeyList="['companyCode', 'companyName']"
              placeholder="请选择涉及公司"
              :ref="`eventInfoItem${index}`"
            ></EventInfoItem>
            <div class="btnContainer">
              <i
                class="icon-t-b-add iconfont"
                title="新增"
                @click="addItem"
              ></i>
              <i
                class="icon-t-b-delete iconfont removebtn"
                title="移除"
                @click="removeItem(index)"
                v-if="eventSubs.length > 1"
              ></i>
            </div>
          </div>
        </div>
      </h-form>
    </div>
    <h-MsgBox
      v-model="modalShow"
      width="60%"
      :isOkLeft="true"
      title="设置数据源属性"
      ref="settingForm"
      label-width="100"
      @on-ok="okClick"
    >
      <search-form>
        <ul slot="content">
          <li class="row2">
            <dl>
              <dt>公告标题：</dt>
              <dd>
                <h-input
                  placeholder="请输入公告标题"
                  v-model="searchData.anncTitle"
                  clearable
                ></h-input>
              </dd>
            </dl>
          </li>
          <li class="row2" style="margin-right: 0">
            <dl>
              <dt>事件当事人姓名：</dt>
              <dd>
                <h-input
                  placeholder="请输入当事人姓名"
                  v-model="searchData.partyName"
                  clearable
                ></h-input>
              </dd>
            </dl>
          </li>
          <li class="row2">
            <dl>
              <dt>处罚类型：</dt>
              <dd>
                <h-simple-select
                  placeholder="请选择处罚类型"
                  filterable
                  v-model="searchData.punishType"
                  @on-change="valueChange"
                >
                  <h-select-block :data="searchPunishType"></h-select-block>
                </h-simple-select>
              </dd>
            </dl>
          </li>
          <li class="row2">
            <dl>
              <dt>涉及公司：</dt>
              <dd>
                <simgleSearch
                  action="/hos-api/vac/company/queryLike"
                  v-model="searchData.companyCode"
                  :showKeyLabelKeyList="['companyCode', 'companyName']"
                  placeholder="请选择涉及公司"
                ></simgleSearch>
              </dd>
            </dl>
          </li>
          <li class="search-wrapper-but">
            <h-button type="primary" @click="onSearch">查询</h-button>
          </li>
        </ul>
      </search-form>
      <h-table
        class="full-max-height-table"
        width="80%"
        :maxHeight="300"
        stripe
        border
        :columns="tableColum"
        :data="dataList"
        size="small"
        :loading="tableLoading"
      ></h-table>
      <h-page
        highlight-row
        size="small"
        class="page-box"
        :total="pagination.totalSize"
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
    </h-MsgBox>
  </div>
</template>
<script>
import EventInfoItem from "../components/eventInfoItem";
import { mapActions, mapGetters, mapState } from "vuex";
import { copyDeep } from "@/filters/index";
import {
  searchEventList,
  esSearchCompany,
} from "@/pages/riskWarning/api/apiManager";
import CascaderSelect from "./cascaderSelect";
import simgleSearch from "./simgleSearch";
export default {
  components: { EventInfoItem, CascaderSelect, simgleSearch },
  props: {
    isPageEditing: Boolean,
  },
  computed: {
    ...mapGetters("riskWarning", {
      eventInfo: "getEventInfo",
      eventList: "getEventList",
      eventSelectIndex: "getEventSelectIndex",
    }),
    ...mapState("riskWarning", {
      anncInfo: "anncInfo",
      anncInfos: "anncInfos",
      isEventInfoItemShow: "isEventInfoItemShow",
    }),
    ...mapState("constList", ["searchPunishType", "punishTypeDict"]),
    eventSubs() {
      return this.eventInfo.eventSubs;
    },
    showEditigBtn() {
      if (this.eventInfo) {
        let publishStatusCode = this.eventInfo.publishStatusCode;
        if (publishStatusCode == 0) {
          return true;
        } else {
          return false;
        }
      }
    },
    isFromEventList() {
      if (this.$route.path.indexOf("publishEvents") != -1) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    eventSelectIndex: {
      handler(newValue, oldValue) {
        if (oldValue == newValue) {
          return;
        }
        this.beforeText = "";
        this.afterText = "";
      },
    },
  },
  data() {
    return {
      beforeText: "",
      afterText: "",
      selectEventId: "",
      modalShow: false,
      tableLoading: false,
      searchData: {
        anncTitle: "",
        partyName: "",
        level1PunishType: "",
        level2PunishType: "",
        companyCode: "",
      },
      tableColum: [
        {
          key: "eventId",
          title: "事件编号",
          width: 100,
          align: "center",
        },
        {
          key: "companies",
          title: "涉及公司",
          width: 100,
          align: "center",
        },
        {
          key: "securities",
          title: "涉及证券",
          width: 100,
          align: "center",
        },
        {
          key: "publishStatus",
          title: "事件处理状态",
          width: 100,
          align: "center",
        },
        {
          key: "parties",
          title: "当事人",
          width: 100,
          align: "center",
        },
        {
          key: "updateOperator",
          title: "处理人",
          width: 100,
          align: "center",
        },
        {
          key: "updateTime",
          title: "处理时间",
          width: 100,
          align: "center",
        },
        {
          key: "anncTitles",
          title: "公告标题",
          align: "center",
          width: 400,
          ellipsis: true,
          render: (h, params) => {
            // jsx语法
            return (
              <span title={params.row.anncTitles}>{params.row.anncTitles}</span>
            );
          },
        },
        {
          key: "punishTypes",
          title: "处罚类型",
          width: 100,
          align: "center",
        },
        {
          key: "action",
          title: "操作",
          width: 100,
          fixed: "right",
          align: "center",
          render: (h, params) => {
            let row = params.row;
            return h("checkbox", {
              style: {},
              props: {
                value: this.selectEventId == row.eventId,
              },
              on: {
                "on-change": (value) => {
                  this.checkboxChange(value, row.eventId);
                },
              },
            });
          },
        },
      ],
      dataList: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalSize: 1,
      },
      pageSizeOpts: [10, 20, 50, 100],
    };
  },
  methods: {
    ...mapActions("riskWarning", {
      aSetEventInfo: "setEventInfo",
      aDeleteEventInfo: "deleteEventInfo",
      aSetEventItem: "setEventItem",
      aSetEventInfoNoApi: "setEventInfoNoApi",
      aAddEvent: "addEvent",
    }),
    ...mapActions("constList", {
      // 处罚类型
      getSearchPunishType: "searchPunishType",
    }),
    editEvents() {
      let data = copyDeep(this.eventInfo);
      if (data.editing) {
        let pass = this.checkRequire(data);
        if (!pass) return;
        let text = data.content;
        // text = this.trueFormatNoline(text)
        data.content = text;
      }
      data.editing = !data.editing;
      let payload = {
        data: data,
      };
      this.aSetEventInfo(payload);
    },
    deleteEvents() {
      let content = "是否删除事件？";
      if (this.anncInfos && this.anncInfos.length >= 2) {
        content = "是否删除事件及关联关系？";
      }
      this.$hMsgBox.confirm({
        isOkLeft: true,
        title: "删除事件",
        content: content,
        onOk: () => {
          let body = {
            anncId: this.anncInfo.anncId || "",
            eventId: this.eventInfo.eventId,
          };
          if (this.eventList.length == 1) {
            // 最后一个事件逻辑
            body.callback = () => {
              if (this.isFromEventList) {
                this.$store.commit("DEL_TAB", this.$route.path);
                this.$router.push("/riskWarning/publishEvents/list");
              } else {
                let anncId = this.anncInfo.anncId || "";
                this.aAddEvent({ anncId: anncId });
              }
            };
          } else {
            body.callback = () => {
              this.$emit("changeLock", 0, this.eventInfo.eventId);
            };
          }
          this.aDeleteEventInfo(body);
        },
      });
    },
    checkRequire() {
      if (this.eventInfo.content) {
        return true;
      } else {
        this.$hMessage.error("事项内容不能为空");
        return false;
      }
    },
    addLabelInfoFn(item, itemType, index) {
      let companyCode = item.companyCode;
      if (companyCode && itemType == "security") {
        item["securityIgsdm"] = companyCode;
        delete item["companyCode"];
        let body = {
          keyword: companyCode,
          pageNum: 1,
          pageSize: 50,
        };
        esSearchCompany(body).then((searchData) => {
          let records = searchData.records || [];
          let filterList = records.filter((item) => {
            return item.companyCode == companyCode;
          });
          let data = copyDeep(this.eventInfo);
          let { eventSubs } = data;
          let selectItem = {
            companyName: "",
            companyCode: "",
          };
          if (filterList.length > 0) {
            selectItem = {
              companyName: filterList[0].companyName,
              companyCode: filterList[0].companyCode,
            };
            // this.$refs[`eventInfoItem${index}`][0].$refs.serchInput.selectChangeing = true
          }
          eventSubs[index] = { ...eventSubs[index], ...selectItem };
          let payload = {
            data: data,
          };
          this.aSetEventInfoNoApi(payload);
        });
      }
      // else if (itemType == 'security'){
      //   let data = copyDeep(this.eventInfo);
      //   let { eventSubs } = data;
      //   let selectItem = {
      //     companyName: '',
      //     companyCode: '',
      //   }
      //   eventSubs[index] = { ...eventSubs[index], ...selectItem };
      //   let payload = {
      //     data: data,
      //   };
      // }
      if (!companyCode && itemType == 'security'){
         item = {
            companyName: '',
            companyCode: '',
          }
      }
      let data = copyDeep(this.eventInfo);
      let { eventSubs } = data;
      eventSubs[index] = { ...eventSubs[index], ...item };
      let payload = {
        data: data,
      };
      this.aSetEventInfoNoApi(payload);
    },
    publishEvents() {
      this.$emit("publishEvents", this.eventInfo.eventId);
    },
    addItem() {
      if (!this.eventInfo.editing) return;
      let data = copyDeep(this.eventInfo);
      let eventSubs = copyDeep(data.eventSubs);
      eventSubs.push({});
      data.eventSubs = eventSubs;
      let payload = {
        data: data,
      };
      this.aSetEventInfoNoApi(payload);
    },
    removeItem(index) {
      if (!this.eventInfo.editing) return;
      let data = copyDeep(this.eventInfo);
      let eventSubs = copyDeep(data.eventSubs);
      eventSubs.splice(index, 1);
      data.eventSubs = eventSubs;
      let payload = {
        data: data,
      };
      this.aSetEventInfoNoApi(payload);
    },
    showModal() {
      this.getList();
      this.modalShow = true;
    },
    onSearch() {
      this.pagination.currentPage = 1;
      this.getList();
    },
    okClick() {
      if (this.selectEventId) {
        let body = {
          eventId: this.selectEventId || "",
          anncId: this.anncInfo.anncId || "",
        };
        this.aSetEventItem(body);
      }
    },
    getList() {
      this.selectEventId = "";
      let body = {
        ...this.searchData,
        ...this.pagination,
      };
      searchEventList(body).then((data) => {
        this.dataList = data.dataList;
        this.pagination.totalSize = data.totalSize;
      });
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
    valueChange(values) {
      let item = this.punishTypeDict[values] || {};
      let level = item.bizLevel;
      if (level) {
        if (level == 1) {
          this.searchData.level1PunishType = values;
          this.searchData.level2PunishType = "";
        } else {
          this.searchData.level1PunishType = "";
          this.searchData.level2PunishType = values;
        }
      } else {
        this.searchData.level1PunishType = "";
        this.searchData.level2PunishType = "";
      }
    },
    checkboxChange(value, eventId) {
      if (value) {
        this.selectEventId = eventId;
      } else {
        this.selectEventId = "";
      }
    },
    formatText() {
      let data = copyDeep(this.eventInfo);
      let text = this.eventInfo.content;
      text = this.trueFormat(text);
      data.content = text;
      let payload = {
        data: data,
      };
      this.aSetEventInfoNoApi(payload);
    },
    trueFormatNoline(text) {
      text = this.ToCDB(text);
      text = text.replace(/\#\#/g, "\n\t");
      return text;
    },
    trueFormat(text) {
      text = text
        .replace(/\n\t/, "")
        .replace(/\n/g, "")
        .replace(/\r\n/g, "")
        .replace(/\r/, "")
        .replace(/\t/, "");
      text = this.ToCDB(text);
      let textList = text.split(/\#\#/g);
      let trueText = "";
      for (let i = 0; i < textList.length; i++) {
        let _text = textList[i];
        if (_text == "") continue;
        if (trueText == "") {
          trueText = "\t" + _text;
          continue;
        }
        trueText = trueText + "\n\t" + _text;
      }
      return trueText;
    },
    ToCDB(str) {
      var tmp = "";
      for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) == 12288) {
          tmp += String.fromCharCode(str.charCodeAt(i) - 12256);
          continue;
        }
        if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
          tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
        } else {
          tmp += String.fromCharCode(str.charCodeAt(i));
        }
      }
      return tmp;
    },
    replaceText() {
      let data = copyDeep(this.eventInfo);
      let text = this.eventInfo.content;
      let beforeText = this.escapeRegex(this.beforeText);
      let re = new RegExp(`${beforeText}`, "g");
      text = text.replace(re, this.afterText);
      data.content = text;
      let payload = {
        data: data,
      };
      this.aSetEventInfoNoApi(payload);
    },
    escapeRegex(string) {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    },
    dbClick() {
      let value = this.inertStr(this.$refs.eventContent, "##");
      let data = copyDeep(this.eventInfo);
      data.content = value;
      let payload = {
        data: data,
      };
      this.aSetEventInfoNoApi(payload);
    },
    inertStr(obj, str) {
      if (document.selection) {
        var sel = document.selection.createRange();
        sel.text = str;
      } else if (
        typeof obj.selectionStart === "number" &&
        typeof obj.selectionEnd === "number"
      ) {
        var startPos = obj.selectionStart,
          endPos = obj.selectionEnd,
          cursorPos = startPos,
          tmpStr = obj.value;
        obj.value =
          tmpStr.substring(0, startPos) +
          str +
          tmpStr.substring(startPos, tmpStr.length);
        cursorPos += str.length;
        obj.selectionStart = obj.selectionEnd = cursorPos;
      } else {
        obj.value += str;
      }
      return obj.value;
    },
  },
  mounted() {
    this.getSearchPunishType();
  },
};
</script>
<style lang="scss" scoped>
.mainContainer /deep/ .h-form-item-label {
  font-weight: 600;
}
.heder {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  .headerLeft {
    display: flex;
    align-items: center;
  }
  .headerRight {
    position: absolute;
    top: 100px;
    right: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    z-index: 99;
  }
}
.hanledHeader {
  font-size: 12px;
  color: #666;
  span {
    margin-right: 20px;
  }
}
.relationList {
  display: flex;
  width: 100%;
  // justify-content: center;
  align-items: center;
}
.removebtn {
  color: red;
  margin-left: 10px;
}
.btnContainer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  top: -5px;
}
.btnContainer i {
  color: #2e71f2;
}
.timeContent {
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 12px;
  color: #666;
}
.formContent {
  position: relative;
  .formatBtn {
    position: absolute;
    top: 30px;
    left: 0;
  }
  .topAction {
    display: flex;
    width: 300px;
    margin-bottom: 5px;
    margin-top: 10px;
    align-items: center;
  }
  .textContent {
    flex: 0 0 50px;
    text-align: center;
  }
}
.textArea:focus {
  outline: 0;
  box-shadow: 0 0 0 2px rgba(41, 141, 255, 0.2);
  border-color: #54a4ff !important;
}
.textArea:disabled {
  background-color: #f7f7f7;
  opacity: 1;
  cursor: not-allowed;
  color: #999;
}
.textArea {
  max-width: 100%;
  height: auto;
  vertical-align: bottom;
  font-size: 12px;
  overflow: auto;
  border: 1px solid #d7dde4;
  border-radius: 4px;
  color: #495060;
  background-color: #fff;
  background-image: none;
  display: inline-block;
  width: 100%;
  padding: 4px 8px;
  cursor: text;
}
</style>