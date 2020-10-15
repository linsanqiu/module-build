<template>
  <div class="event-box">
    <h-spin fix v-if="detailLoadingBox">
      <h-icon name="load-c" size="18" class="h-load-loop"></h-icon>
      <div>加载中...</div>
    </h-spin>
    <windowDrag rightW="50%">
      <div class="box-left-content" slot="left">
        <NewsDetail
          :newsId="newsId"
          :newsType="newsType"
          :pageType="pageType"
          :commonFilters="commonFilters"
          :labelList="labelListNewsCorp"
          :industryTags="industryTags"
          :conceptTags="conceptTags"
          :indicatorTags="indicatorTags"
          :regionTags="regionTags"
          :secuTags="labelListNewsSecurity"
          :hiddenItemArr="hiddenItemArr"
          :showBtns="showBtns"
          :isEventPage="true"
          @updateNewsId="updateNewsId"
        >
          <div slot="eventFormItem" class="eventFormItem">
            <div class="item-left">
              <NewsFormItem
                :readonlyFlag="true"
                class="readonlyItem"
                formItemType="input"
                :pageType="pageType"
                itemName="newsId"
                labelName="资讯ID："
                :commonFilters="commonFilters"
              ></NewsFormItem>
              <NewsFormItem
                :pageType="pageType"
                itemName="dsNewsColumns"
                labelName="原始栏目："
                :commonFilters="commonFilters"
              ></NewsFormItem>
              <NewsFormItem
                :readonlyFlag="true"
                formItemType="select"
                :pageType="pageType"
                itemName="range"
                labelName="范围："
                :commonFilters="commonFilters"
              ></NewsFormItem>
            </div>
            <div class="item-right">
              <NewsFormItem
                formItemType="datepicker"
                :pageType="pageType"
                itemName="srcPublishDate"
                labelName="信息发布时间："
                :commonFilters="commonFilters"
              ></NewsFormItem>
              <NewsFormItem
                :pageType="pageType"
                itemName="mediaSource"
                labelName="媒体出处："
                :commonFilters="commonFilters"
              ></NewsFormItem>
              <NewsFormItem
                :pageType="pageType"
                itemName="modifyName"
                labelName="修改人员："
                :commonFilters="commonFilters"
              ></NewsFormItem>
            </div>
          </div>
        </NewsDetail>
      </div>
      <div class="box-right-content" slot="right">
        <EventDetail
          ref="eventDetailPage"
          :eventNewsId="eventNewsId"
          :newsId="newsId"
          :labelList="labelList"
          :labelListNews="labelListNewsCorp"
          :secuTags="secuTags"
          :labelListNewsSecurity="labelListNewsSecurity"
          :labelListArea="regionTags"
          :eventPageType="eventPageType"
          :publishType="publishType"
          :eventList="eventData"
          :hiddenItemArr="hiddenItemArrEvent"
          @onhandleNextNewsId="onhandleNextNewsId"
          @freshEditPage="freshEditPage"
          :isProcess="isProcess"
          :overplusSecs="overplusSecs"
          @handleTimeDown="handleTimeDown"
          :srcPublishDate='commonFilters.srcPublishDate'
          :commonFilters='commonFilters'
        ></EventDetail>
      </div>
    </windowDrag>
  </div>
</template>
<script>
//  :overplusSecs="commonFilters.overplusSecs"
import windowDrag from "@/components/windowDrag";
import NewsDetail from "@/components/jintan_news_detail";
import NewsFormItem from "@/components/news_formItem";
import vueCkeditor from "vue-ckeditor2";
import EventDetail from "./eventCommonDetail";
import { ArrToString, stringToArray } from "@/filters/index";
import { mapState } from "vuex";
import { copyDeep } from "@/filters/index";
export default {
  name: "TbmEventsDetail",
  components: {
    NewsDetail,
    vueCkeditor,
    EventDetail,
    NewsFormItem,
    windowDrag
  },
  data() {
    return {
      //主表资讯数据
      detailLoadingBox: false,
      newsId: "",
      ref: '',
      newsType: "1",
      pageType: "VIEW",
      commonFilters: {},
      labelList: [],
      labelListNewsCorp: [],
      labelListNewsSecurity: [],
      industryTags: [],
      conceptTags: [],
      indicatorTags: [],
      regionTags: [],
      secuTags: [],
      hiddenItemArr: [
        "themeId",
        "conclusion",
        "opinionType",
        "imageUrl",
        "summary",
        "subTitle",
        "content",
        "contentSource",
        "labelListCorp",
        "labelListSecurity",
        "labelListIndustry",
        "labelListConcept",
        "labelListIndicator",
        "contentText",
        "form"
      ],
      hiddenItemArrEvent: [],
      showBtns: [],
      //舆情资讯数据
      eventNewsId: "",
      eventPageType: "HANDLE",
      eventData: [],
      publishType: 0,
      updateFlag: false,
      isProcess: false,
      timer: null,
      overplusSecs: 0,
      overplusTime: "",
    };
  },
  methods: {
    getNewsDetail(newsId, preNewsId = "", cb = null, ref) {
      this.detailLoadingBox = true;
      let url = "/tm/event/detail?newsId=" + newsId + "&oldNewsId=" + preNewsId + '&ref=' + ref;
      this.$http
        .get(url)
        .then(res => {
          let data = res.data ? res.data : {};
          if (data.status == this.$api.SUCCESS) {
            let commonFilters = data.body || {};
            this.newsId = data.body.newsId;
            this.ref = data.body.ref;
            commonFilters.remark = stringToArray(commonFilters.remark, ";");
            commonFilters.contentText = this.formContentTextFn(
              commonFilters.contentText
            );
            this.publishType =
              commonFilters.publishType || commonFilters.publishType == 0
                ? commonFilters.publishType
                : "";
            this.eventData = copyDeep(commonFilters.eventList) || [];
            this.eventNewsId = commonFilters.id || "";
            this.labelListNewsCorp = copyDeep(commonFilters.companyTags) || []; //资讯详情页企业标签
            this.labelListNewsSecurity =
              copyDeep(commonFilters.securityTags) || []; //资讯详情页证券标签
            if (this.eventData.length > 0) {
              this.eventData[0]["_highlight"] =
                this.eventData.length > 0 ? true : false;
            }
            this.secuTags =
              this.eventData.length > 0 && this.eventData[0].securityTags
                ? copyDeep(this.eventData[0].securityTags)
                : [];
            this.labelList =
              this.eventData.length > 0 && this.eventData[0].companyTags
                ? copyDeep(this.eventData[0].companyTags)
                : [];
            // commonFilters.overplusSecs = 10;
            this.commonFilters = { ...commonFilters };
            this.overplusTime = commonFilters.overplusTime;
            // 倒计时
            this.timeToDown()
            if (cb) {
              cb(true);
            }
          } else {
            this.$hMessage.error({
              content: data.msg,
              duration: 3
            });
          }
          this.detailLoadingBox = false;
        })
        .catch(err => {
          this.detailLoadingBox = false;
        });
    },
    freshEditPage(currentIndex) {
      let url = "/tm/event/detail?newsId=" + this.newsId + "&viewStatus=1" + '&ref=' + this.ref;
      this.$http
        .get(url)
        .then(res => {
          let data = res.data ? res.data : {};
          if (data.status == this.$api.SUCCESS) {
            let commonFilters = data.body || {};
            this.newsId = data.body.newsId;
            this.ref = data.body.ref;
            this.commonFilters.remark = stringToArray(
              commonFilters.remark,
              ";"
            );
            this.commonFilters.contentText = this.formContentTextFn(
              commonFilters.contentText
            );
            this.publishType =
              commonFilters.publishType || commonFilters.publishType == 0
                ? commonFilters.publishType
                : "";
            this.eventNewsId = commonFilters.id || "";
            let eventData = copyDeep(commonFilters.eventList) || [];
            let beforeEventList = copyDeep(this.$refs["eventDetailPage"].eventListCopy)
            let beforeId = beforeEventList[currentIndex].id
            for (let i = 0; i<eventData.length;i++){
              if (eventData[i].id == beforeId){
                currentIndex = i
                this.$refs["eventDetailPage"].currentIndex = i 
                break
              }
            }
            this.$refs["eventDetailPage"].eventListCopy = copyDeep(eventData);
            if (eventData.length > 0) {
              this.$refs["eventDetailPage"].eventListCopy[currentIndex][
                "_highlight"
              ] = true;
            }
            this.overplusTime = commonFilters.overplusTime;
            // 倒计时
            this.timeToDown()
          } else {
            this.$hMessage.error({
              content: data.msg,
              duration: 3
            });
          }
          this.detailLoadingBox = false;
        })
        .catch(err => {
          this.detailLoadingBox = false;
        });
    },
    timeToDown() {
      // 时间转时间戳
      if (!this.overplusTime){
        return
      }
      let date = new Date(this.overplusTime);
      let time = parseInt(date.getTime() / 1000 - new Date().getTime() / 1000);
      this.overplusSecs = time;
      this.timeDown();
    },
    timeDown() {
      this.timer && clearInterval(this.timer);
      if (!this.overplusSecs && this.overplusSecs <= 0) {
        return;
      }
      this.timer = setInterval(() => {
        this.overplusSecs = this.overplusSecs - 1;
        if (this.overplusSecs <= 0) {
          clearInterval(this.timer);
          return;
        }
      }, 1000);
    },
    formContentTextFn(contentText) {
      if (!contentText) return;
      let contentStr = contentText.replace(/(\r\n)+|(\n)+/g, "\n");
      let contentArr = contentStr.split("\n");
      if (
        contentArr[contentArr.length - 1]
          .replace(/(^\s*)|(\s*$)/g, "")
          .replace(/(^\n*)|(^\r\n*)|(\r\n*$)|(\n*$)/g, "") == ""
      ) {
        contentArr.pop(); //去除末尾换行符
      }
      let arr = [];
      contentArr.forEach(item => {
        arr.push(`<p style="text-indent:2em">` + `${item.trim()}` + `</p>`);
      });
      return (contentText = arr.join("\n"));
    },
    onhandleNextNewsId({ newsId, preNewsId }) {
      let ref = this.$md5(`${newsId}TBM-COMPOSE`);
      this.getNewsDetail(newsId, preNewsId, res => {
        if (res) {
          if (this.isProcess) {
            this.$router.push({
              path: "/tbm/events/detail",
              query: { newsId: this.newsId, isProcess: 1, ref: ref}
            });
          } else {
            this.$router.push({
              path: "/tbm/events/detail",
              query: { newsId: this.newsId, ref: ref }
            });
          }
        }
      }, ref);
    },
    updateNewsId(newsId) {
      this.newsId = newsId;
      this.ref = this.$md5(`${newsId}TBM-COMPOSE`)
      this.updateFlag = true;
    },
    handleTimeDown(time) {
      this.overplusSecs = time;
    },
    init() {
      this.isProcess = this.$route.query.isProcess || false; //判断是否是否从流程进入编辑页面
      this.newsId = this.$route.query.newsId;
      this.ref = this.$route.query.ref
      this.getNewsDetail(this.newsId, '', '', this.ref);
      sessionStorage.removeItem("freshDetailEvent");
    }
  },
  computed: {
    ...mapState(["maxTableHeight"])
  },
  mounted() {
    this.init();
  },
  activated: function() {
    let noticeFlag = this.$route.query.noticeFlag || null;
    let freshDetail = sessionStorage.getItem("freshDetailEvent") || null;
    if (freshDetail || noticeFlag) {
      this.init();
    }else{
      this.timeToDown()
    }
  },
  deactivated(){
    this.timer && clearInterval(this.timer);
  },
  destroyed() {
    this.timer && clearInterval(this.timer);
  }
};
</script>
<style >
</style>
<style scoped>
.event-box >>> .hrNodrag {
  display: none;
}
.event-box {
  overflow: hidden;
  border: 1px solid #ccc;
  position: relative;
  height: 100%;
}
.event-box >>> .searchBoxEvent .search-form-item .viewPage {
  border: 1px solid #dce1e7;
  border-radius: 5px;
  padding: 0 5px;
  height: 32px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100% !important;
  cursor: pointer;
}
.event-box >>> .box-left-content .detailLeft {
  min-width: 240px;
}
.event-box >>> .detailRight .h-form-item .h-form-item-label,
.event-box >>> .detailLeft .h-form-item .h-form-item-label {
  width: 105px !important;
}
.event-box >>> .detailRight .h-form-item .h-form-item-content,
.event-box >>> .detailLeft .h-form-item .h-form-item-content {
  margin-left: 105px !important;
}
.box-right-content {
  height: 100%;
  max-width: 920px;
  min-width: 550px;
  overflow: auto;
}
.box-left-content {
  min-width: 560px;
}
.eventFormItem {
  overflow: hidden;
}
.item-left {
  max-width: 50%;
  float: left;
}
.item-right {
  max-width: 50%;
  float: right;
}
.item-left >>> .search-form-item,
.item-right >>> .search-form-item {
  margin-bottom: -5px !important;
}
.item-left >>> .viewPage,
.item-right >>> .viewPage {
  display: inline-block;
  border: 1px solid #dce1e7;
  border-radius: 5px;
  padding: 0 5px;
  height: 32px;
  line-height: 32px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 160px;
  cursor: pointer;
}
</style>
