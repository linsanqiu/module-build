<template>
  <div style="position: relative">
    <h-spin fix v-if="detailLoading">
      <h-icon name="load-c" size="18" class="h-load-loop"></h-icon>
      <div>加载中...</div>
    </h-spin>
    <NewsDetail
      :specialNameList="specialNameList"
      :newsId="newsId"
      :newsType="newsType"
      :pageType="pageType"
      :commonFilters="commonFilters"
      :labelList="labelList"
      :industryTags="industryTags"
      :conceptTags="conceptTags"
      :indicatorTags="indicatorTags"
      :regionTags="regionTags"
      :secuTags="secuTags"
      :showBtns="showBtns"
      :hiddenItemArr="newsType == '2' ? hiddenItemArrFastNews : hiddenItemArrDefault"
      :isSpecialPage="true"
      :ruleInlineData="ruleInlineSpecial"
    ></NewsDetail>
  </div>
</template>

<script>
import vueCkeditor from "vue-ckeditor2";
import NewsDetail from "@/components/jintan_news_detail";
import { ArrToString, stringToArray } from "@/filters/index";
export default {
  components: { NewsDetail, vueCkeditor },
  data() {
    return {
      themeId: "",
      specialNameList: [],
      detailLoading: false,
      newsId: "",
      newsType: "1",
      id: '',
      pageType: "SPECIALVIEW",
      commonFilters: {},
      labelList: [],
      industryTags: [],
      conceptTags: [],
      indicatorTags: [],
      regionTags: [],
      secuTags: [],
      hiddenItemArrDefault: ["newsId"],
      hiddenItemArrFastNews: [
        "newsId",
        "dsNewsColumns",
        "tradingMarket",
        "mediaSource",
        "mediaSourceCode",
        "layoutNumber",
        "layoutInfo",
        "author",
        "authorOrg",
        "authorOrgCode",
        "rangePlus",
        "form",
        "subtitle",
        "summary",
        "labelListConcept",
        "labelListIndicator",
        "labelListIndustry",
        "conclusion",
        "opinionType"
      ],
      hiddenItemArr: [
        "themeId",
        "appIds",
        "dsNewsColumns",
        "tradingMarket",
        "mediaSource",
        "mediaSourceCode",
        "layoutNumber",
        "layoutInfo",
        "author",
        "authorOrg",
        "authorOrgCode",
        "rangePlus",
        "form",
        "subtitle",
        "summary",
        "labelListConcept",
        "labelListIndicator",
        "labelListIndustry",
        "conclusion",
        "opinionType"
      ],
      showBtns: ["pre", "next"],
      ruleInlineSpecial: {},
      opinionListComment: [],
      opinionListRecommend: []
    };
  },
  methods: {
    /**获取专题名称列表**/
    getSpecialNameList() {
      let url = "/tm/getThemesMap";
      this.$http
        .get(url)
        .then(res => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            let specialNameList = data.body.themeList || [];
            const newlist = specialNameList.map(item => {
              return {
                value: item.id,
                label: item.themeName
              };
            });
            this.specialNameList = [...newlist];
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch(err => {
          this.$hLoading.error();
        });
    },
    getSpecialDetail() {
      this.detailLoading = true;
      let url = `/tm/getThemeNewsInfos?id=${this.id}&lock=${false}`;
      // let url =
      //   "/tm/getThemeNewsDetail?newsId=" +
      //   this.newsId +
      //   "&themeId=" +
      //   this.themeId;
      this.$http
        .get(url)
        .then(res => {
          let data = res.data ? res.data : {};
          if (data.status == this.$api.SUCCESS) {
            let commonFilters = data.body || {};
            this.newsId = commonFilters.newsId;
            this.newsType = commonFilters.newsType;
            commonFilters.remark = stringToArray(commonFilters.remark, ";");
            //	 	                commonFilters.srcPublishTime =  commonFilters.srcPublishDate;
            commonFilters.sensitives = commonFilters.sensitiveWords;
            // commonFilters.dsSourceType = commonFilters.dsSourceName;
            commonFilters.sentimentLabel = commonFilters.sentimentsName;
            commonFilters.level = commonFilters.levelName;
            commonFilters.title = commonFilters.titleShow;
            commonFilters.areaCode = commonFilters.areaName;
            commonFilters.appIds = commonFilters.appName;
            //						commonFilters.authorOrgCode= commonFilters.authorOrgName;
            commonFilters.financial = commonFilters.financialName;
            commonFilters.financialPlus = commonFilters.financialPlusName;
            commonFilters.tradingMarket = commonFilters.tradingMarketName;
            commonFilters.form = commonFilters.formName;
            commonFilters.range = commonFilters.rangeName;
            commonFilters.rangePlus = commonFilters.rangePlusName;
            if (this.themeId == "32") {
              commonFilters.opinionList = this.opinionListComment; //股市评论
            } else if (this.themeId == "23") {
              commonFilters.opinionList = this.opinionListRecommend; //个股推荐
            }
            this.labelList = commonFilters.corpTags || [];
            this.industryTags = commonFilters.industryTags || [];
            this.conceptTags = commonFilters.conceptTags || [];
            this.indicatorTags = commonFilters.indicatorTags || [];
            this.regionTags = commonFilters.regionTags || [];
            this.secuTags = commonFilters.secuTags || [];
            this.commonFilters = { ...commonFilters };
          } else {
            this.$hMessage.error({
              content: data.msg,
              duration: 3
            });
          }
          this.detailLoading = false;
        })
        .catch(err => {
          this.detailLoading = false;
        });
    },
    getNewsDetail(newsId, type = "") {
      this.detailLoading = true;
      let url = "";
      if (!type) {
        url = "/tm/news/detail?newsId=" + newsId;
      } else {
        url = "/tm/news/lastDetail?newsId=" + newsId;
      }
      this.$http
        .get(url)
        .then(res => {
          let data = res.data ? res.data : {};
          if (data.status == this.$api.SUCCESS) {
            let commonFilters = {};
            commonFilters = data.body || {};
            this.newsId = data.body.newsId;
            //		 	                commonFilters.srcPublishTime =  commonFilters.srcPublishDateDesc +' '+ commonFilters.srcPublishTimeDesc;
            commonFilters.sensitives = ArrToString(commonFilters.sensitives);
            // commonFilters.remark = stringToArray(commonFilters.remark,';');
            commonFilters.appIds = commonFilters.appName.join();
            // commonFilters.dsSourceType = commonFilters.dsSourceName;
            commonFilters.sentimentLabel = commonFilters.sentimentsName;
            commonFilters.level = commonFilters.levelName;
            commonFilters.title = commonFilters.titleShow;
            commonFilters.areaCode = commonFilters.areaName;
            //							commonFilters.authorOrgCode=  commonFilters.authorOrgName;
            commonFilters.financial = commonFilters.financialName;
            commonFilters.financialPlus = commonFilters.financialPlusName;
            commonFilters.tradingMarket = commonFilters.tradingMarketName;
            commonFilters.form = commonFilters.formName;
            commonFilters.range = commonFilters.rangeName;
            commonFilters.rangePlus = commonFilters.rangePlusName;

            commonFilters.id = this.$route.query.id.toString() || ""; //专题资讯id
            commonFilters.themeId = this.$route.query.themeId.toString() || ""; //专题名称id
            let oneSpecialNews =
              JSON.parse(sessionStorage.getItem("oneSpecialNews")) || null;
            commonFilters.titleImgLink = oneSpecialNews.titleImgLink || "";
            commonFilters.publishStatusDesc =
              oneSpecialNews.publishStatusDesc || "";
            commonFilters.appIds = oneSpecialNews.appNames || "";
            commonFilters.special = oneSpecialNews.special;
            commonFilters.opinionType = oneSpecialNews.opinionType || "";
            commonFilters.conclusion = oneSpecialNews.conclusion || "";
            if (oneSpecialNews.themeId == "32") {
              commonFilters.opinionList = this.opinionListComment; //股市评论
            } else if (oneSpecialNews.themeId == "23") {
              commonFilters.opinionList = this.opinionListRecommend; //个股推荐
            }

            this.labelList = commonFilters.corpTags || [];
            this.industryTags = commonFilters.industryTags || [];
            this.conceptTags = commonFilters.conceptTags || [];
            this.indicatorTags = commonFilters.indicatorTags || [];
            this.secuTags = commonFilters.secuTags || [];
            this.commonFilters = { ...commonFilters };
          } else {
            this.$hMessage.error({
              content: data.msg,
              duration: 3
            });
          }
          this.detailLoading = false;
        })
        .catch(err => {
          this.detailLoading = false;
        });
    },
    changeHideItemArr(newsType) {
      this.newsType = newsType;
    }
  },
  created() {
    this.newsId = this.$route.query.newsId.toString() || "";
    this.themeId = this.$route.query.themeId.toString() || "";
    this.id = this.$route.query.id.toString() || "";
    this.getSpecialNameList();
    this.getSpecialDetail();
    this.$store.dispatch("getOpinionListComment", "opinionListComment");
    this.$store.dispatch("getOpinionListRecommend", "opinionListRecommend");
  }
};
</script>

