<!--
 * @Author: your name
 * @Date: 2020-05-18 09:10:40
 * @LastEditTime: 2020-05-22 15:06:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /three-admin-ui/src/pages/riskWarning/components/searchHeader.vue
--> 
<template>
  <div>
    <search-form>
      <ul slot="content">
        <li>
          <dl>
            <dt>事件编号：</dt>
            <dd>
              <h-input placeholder="请输入事件编号" v-model="searchData.eventId" clearable></h-input>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>事件进程：</dt>
            <dd>
              <h-simple-select
                placeholder="请选择事件进程"
                filterable
                v-model="searchData.eventProcessCode"
              >
                <h-select-block :data="eventProcessStatus"></h-select-block>
              </h-simple-select>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>违规类型：</dt>
            <dd>
              <h-simple-select placeholder="请选择违规类型" filterable v-model="searchData.vioType">
                <h-select-block :data="searchRiskTypeList"></h-select-block>
              </h-simple-select>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>处罚机构：</dt>
            <dd>
              <h-simple-select placeholder="请选择处罚机构" filterable v-model="searchData.punishOrg">
                <h-select-block :data="searchRiskOrganizationList"></h-select-block>
              </h-simple-select>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>公告类型：</dt>
            <dd>
              <h-simple-select placeholder="请选择公告类型" filterable v-model="searchData.anncType">
                <h-select-block :data="noticeTypeList"></h-select-block>
              </h-simple-select>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>最新公告日期：</dt>
            <dd>
              <h-date-picker
                type="daterange"
                format="yyyy-MM-dd"
                aria-placeholder="事件公告日期"
                placeholder="请输入日期"
                v-model="latestReleaseTime"
                @on-change="onChangeDateRangePicker($event, 'latestReleaseTime')"
                autoPlacement
              ></h-date-picker>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>事件进程日期：</dt>
            <dd>
              <h-date-picker
                type="daterange"
                format="yyyy-MM-dd"
                aria-placeholder="事件进程日期"
                placeholder="请输入日期"
                v-model="eventProcessTime"
                @on-change="onChangeDateRangePicker($event, 'eventProcessTime')"
                autoPlacement
              ></h-date-picker>
            </dd>
          </dl>
        </li>

        <li>
          <dl>
            <dt>关联关系：</dt>
            <dd>
              <h-simple-select placeholder="请选择关联关系" filterable v-model="searchData.relationType">
                <h-select-block :data="searchConstRelationList"></h-select-block>
              </h-simple-select>
            </dd>
          </dl>
        </li>

        <li>
          <dl>
            <dt>被处罚机构编码：</dt>
            <dd>
              <simgleSearch
                action="/hos-api/vac/company/queryLike"
                v-model="searchData.punishedOrgCode"
                :showKeyLabelKeyList="['companyCode', 'companyName']"
                placeholder="请选择涉及公司"
              ></simgleSearch>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>公告标题：</dt>
            <dd>
              <h-input placeholder="请输入公告标题" v-model.trim="searchData.title"></h-input>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>首次发布信息日期：</dt>
            <dd>
              <h-date-picker
                type="daterange"
                format="yyyy-MM-dd"
                aria-placeholder="首次发布信息日期"
                placeholder="请输入日期"
                v-model="firstReleaseTime"
                @on-change="onChangeDateRangePicker($event, 'firstReleaseTime')"
                autoPlacement
              ></h-date-picker>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>当事人：</dt>
            <dd>
              <h-input placeholder="请选择当事人" v-model="searchData.partyName" clearable></h-input>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>关联公司：</dt>
            <dd>
              <simgleSearch
                action="/hos-api/vac/company/queryLike"
                v-model="searchData.businessId"
                :showKeyLabelKeyList="['companyCode', 'companyName']"
                placeholder="请选择关联公司"
              ></simgleSearch>
  
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>处罚类型：</dt>
            <dd>
              <h-simple-select placeholder="请选择处罚类型" filterable v-model="searchData.punishType">
                <h-select-block :data="searchPunishType"></h-select-block>
              </h-simple-select>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>公告日期：</dt>
            <dd>
              <h-date-picker
                type="daterange"
                format="yyyy-MM-dd"
                aria-placeholder="公告日期"
                placeholder="请输入日期"
                v-model="releaseTime"
                @on-change="onChangeDateRangePicker($event, 'releaseTime')"
                autoPlacement
              ></h-date-picker>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>最新事件进程：</dt>
            <dd>
              <h-simple-select
                placeholder="请选择最新事件进程"
                filterable
                v-model="searchData.latestEventProcess"
              >
                <h-select-block :data="eventProcessStatus"></h-select-block>
              </h-simple-select>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>当事人性质：</dt>
            <dd>
              <h-simple-select placeholder="请选择当事人性质" filterable v-model="searchData.partyNature">
                <h-select-block :data="partyType"></h-select-block>
              </h-simple-select>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>开始日期：</dt>
            <dd>
              <h-date-picker
                type="daterange"
                format="yyyy-MM-dd"
                aria-placeholder="开始日期"
                placeholder="请输入日期"
                v-model="startDate"
                @on-change="onChangeDateRangePicker($event, 'startDate')"
                autoPlacement
              ></h-date-picker>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>罚款金额币种：</dt>
            <dd>
              <h-simple-select placeholder="请选择罚款金额币种" filterable v-model="searchData.currency">
                <h-select-block :data="moneyType"></h-select-block>
              </h-simple-select>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>行政文号：</dt>
            <dd>
              <h-input placeholder="请输入行政文号" v-model.trim="searchData.admNo"></h-input>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>涉及公司：</dt>
            <dd>
              <simgleSearch
                action="/hos-api/vac/company/queryLike"
                v-model="searchData.company"
                :showKeyLabelKeyList="['companyCode', 'companyName']"
                placeholder="请选择涉及公司"
              ></simgleSearch>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>当事人编码：</dt>
            <dd>
              <simgleSearch
                action="/hos-api/vac/company/queryLike"
                v-model="searchData.partyCode"
                :showKeyLabelKeyList="['companyCode', 'companyName']"
                placeholder="请选择涉及公司"
              ></simgleSearch>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>截止日期：</dt>
            <dd>
              <h-date-picker
                type="daterange"
                format="yyyy-MM-dd"
                aria-placeholder="截止日期"
                placeholder="请输入日期"
                v-model="closeDate"
                @on-change="onChangeDateRangePicker($event, 'closeDate')"
                autoPlacement
              ></h-date-picker>
            </dd>
          </dl>
        </li>

        <li>
          <dl>
            <dt>处理人员：</dt>
            <dd>
              <h-simple-select placeholder="请选择处理人员" filterable v-model="searchData.processor">
                <h-select-block :data="dealUserList"></h-select-block>
              </h-simple-select>
            </dd>
          </dl>
        </li>

        <li>
          <dl>
            <dt>涉及证券：</dt>
            <dd>
              <simgleSearch
                valueKey='innerCode'
                action="/hos-api/vac/securities/queryLike"
                v-model="searchData.security"
                :showKeyLabelKeyList="['securitiesCode', 'securitiesName', 'companyCode']"
                placeholder="请选择涉及证券"
              ></simgleSearch>
            </dd>
          </dl>
        </li>
        <!-- QuzjCode begin -->
        <li>
          <dl>
            <dt>最后处理时间：</dt>
            <dd>
              <h-date-picker
                type="daterange"
                format="yyyy-MM-dd"
                aria-placeholder="最后处理时间"
                placeholder="请输入日期"
                v-model="handleDate"
                @on-change="onChangeDateRangePicker($event, 'handleDate')"
                autoPlacement
              ></h-date-picker>
            </dd>
          </dl>
        </li>
        <!-- QuzjCode end -->
        <li class="search-wrapper-but">
          <slot></slot>
        </li>
      </ul>
    </search-form>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { copyDeep } from "@/filters/index";
import simgleSearch from "./simgleSearch";
export default {
  components: { simgleSearch },
  data() {
    return {
      latestReleaseTime: [],
      eventProcessTime: [],
      firstReleaseTime: [],
      handleDate: [],//最后处理时间 QuzjCode
      startDate: [],
      releaseTime: [],
      closeDate: [],
      orginalData: {},
      searchData: {
        handleDateStart: "",//最后处理时间开始段 QuzjCode
        handleDateEnd: "",//最后处理时间结束段 QuzjCode
        eventId: "",
        eventProcessCode: "",
        vioType: "",
        punishOrg: "",
        anncType: "",
        relationType: "",
        punishedOrgCode: "",
        partyName: "",
        businessId: "",
        punishType: "",
        releaseTimeStart: "",
        releaseTimeEnd: "",
        latestReleaseTimeStart: "",
        latestReleaseTimeEnd: "",
        eventProcessTimeStart: "",
        eventProcessTimeEnd: "",
        firstReleaseTimeStart: "",
        firstReleaseTimeEnd: "",
        startDateStart: "",
        startDateEnd: "",
        closeDateStart: "",
        closeDateEnd: "",
        currency: "",
        admNo: "",
        company: "",
        partyCode: "",
        processor: "",
        security: "",
      },
      loadingSearchLabelSecurity: false,
      loadingSearchLabel: false,
      selectBaseDataSecurity: [],
      selectBaseDataCategory: [],
    };
  },
  computed: {
    ...mapState("constList", [
      // 最新事件进程/事件进程
      "eventProcessStatus",
      // 违规类型
      "searchRiskTypeList",
      // 处罚机构
      "searchRiskOrganizationList",
      // 公告类型
      "noticeTypeList",
      //关联关系
      "searchConstRelationList",
      //处罚类型
      "searchPunishType",
      // 当事人性质
      "partyType",
      // 罚款金额币种
      "moneyType",
      // 处理人员
      "dealUserList",
      // 涉及证券
      "involvingSecuritiesList",
    ]),
  },

  methods: {
    ...mapActions("riskWarning", {}),
    ...mapActions("constList", {
      // 事件进程
      getProcessStatus: "eventProcessStatus",
      // 违规类型
      getSearchRiskTypeList: "searchRiskTypeList",
      // 处罚机构
      getSearchRiskOrganizationList: "searchRiskOrganizationList",
      // 公告类型
      getNoticeTypeList: "noticeTypeList",
      // 关联关系
      getSearchConstRelationList: "searchConstRelationList",
      // 处罚类型
      getSearchPunishType: "searchPunishType",
      // 当事人性质
      getPartyType: "partyType",
      // 处罚币种
      getMoneyType: "moneyType",
      // 处理人员
      getDealUserList: "dealUserList",
    }),
    onChangeDateRangePicker(values, types) {
      this.searchData[`${types}Start`] = values[0];
      this.searchData[`${types}End`] = values[1];
    },
    onStatusChange() {},
    onReSetData() {
      this.searchData = copyDeep(this.orginalData);
    },
    handleSearch() {
      this.$emit("handleSearch", {});
    },
    remoteMethod(query) {
      let timeoutflag = null;
      if (timeoutflag != null) {
        clearTimeout(timeoutflag);
      }
      this.loadingSearchLabel = true;
      timeoutflag = setTimeout(() => {
        this.getCategoryLabelList(query, "selectBaseDataCategory", [
          "101102101",
        ]);
      }, 100);
    },
    remoteMethodSecurity(query) {
      let timeoutflag = null;
      if (timeoutflag != null) {
        clearTimeout(timeoutflag);
      }
      this.loadingSearchLabelSecurity = true;
      timeoutflag = setTimeout(() => {
        this.getCategoryLabelList(query, "selectBaseDataSecurity", [
          "101109112",
        ]);
      }, 100);
    },
    getCategoryLabelList(searchName, listType, categoryId) {
      let url = "/tagid/queryTagsByTagValueLikeList";
      this.$http
        .post(url, {
          category_id_list: categoryId,
          page_num: 1,
          page_size: 20,
          tag_value: searchName,
        })
        .then((res) => {
          let obj = res.data.return_value || {};
          let selectBaseDataCategory = obj.records || [];
          const list = selectBaseDataCategory.map((item) => {
            let labelName = item.tag_value || "";
            if (listType == "selectBaseDataSecurity") {
              if (item.inner_code) {
                labelName = item.inner_code + "-" + item.tag_value;
                if (item.business_code) {
                  labelName =
                    item.inner_code +
                    "-" +
                    item.business_code +
                    "-" +
                    item.tag_value;
                }
              }
            }
            return {
              value: item.business_id,
              label: labelName,
            };
          });
          if (listType == "selectBaseDataCategory") {
            this.loadingSearchLabel = false;
          } else {
            this.loadingSearchLabelSecurity = false;
          }
          this[listType] = [...list];
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
  },
  mounted() {
    this.orginalData = copyDeep(this.searchData);
    // 事件进程
    this.getProcessStatus();
    // 违规类型
    this.getSearchRiskTypeList();
    // 处罚机构
    this.getSearchRiskOrganizationList();
    // 公告类型
    this.getNoticeTypeList();
    // 关联关系
    this.getSearchConstRelationList();
    // 处罚类型
    this.getSearchPunishType();
    // 当事人性质
    this.getPartyType();
    // 处罚币种
    this.getMoneyType();
    // 处理人员
    this.getDealUserList();
    // 涉及公司
    this.getCategoryLabelList("", "selectBaseDataCategory", ["101102101"]);
    // 涉及证券
    this.getCategoryLabelList("", "selectBaseDataSecurity", ["101109112"]);
  },
};
</script>
<style lang="scss" scoped>
</style>