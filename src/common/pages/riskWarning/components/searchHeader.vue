<!--
 * @Author: your name
 * @Date: 2020-05-18 09:10:40
 * @LastEditTime: 2020-05-18 17:12:12
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
            <dt>发布时间：</dt>
            <dd>
              <h-date-picker
                type="daterange"
                format="yyyy-MM-dd"
                aria-placeholder="发布时间"
                :placeholder="placeholders.dateRange"
                v-model="publishDateRange"
                @on-change="onChangeDateRangePicker"
              ></h-date-picker>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>处理状态：</dt>
            <dd>
              <h-select
                :placeholder="placeholders.status"
                v-model="searchData.processTypeList"
              >
                <h-option
                  v-for="(item, i) in statusList"
                  :value="item.entryValue"
                  :key="item.entryValue"
                >{{item.entryName}}</h-option>
              </h-select>
            </dd>
          </dl>
        </li>

        <li>
          <dl>
            <dt>涉及证券：</dt>
            <dd>
              <simgleSearch
                  valueKey='innerCode'
                  action='/hos-api/vac/securities/queryLike'
                  v-model='searchData.anncSecurity'
                  :showKeyLabelKeyList="['securitiesCode', 'securitiesName', 'companyCode']"
                  placeholder="请选择涉及证券"
              ></simgleSearch>
              <!-- <h-simple-select
                :widthAdaption="true"
                :placeholder="placeholders.bond"
                icon="android-close"
                loadingText="加载中"
                :loading="loadingSearchLabelSecurity"
                loading-text="搜索关键字查询"
                :remote-method="remoteMethodSecurity"
                remote
                filterable
                v-model="searchData.anncSecurity"
              >
                <h-select-block :data="selectBaseDataSecurity"></h-select-block>
              </h-simple-select> -->
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>涉及公司：</dt>
            <dd>
              <simgleSearch
                  action='/hos-api/vac/company/queryLike'
                  v-model='searchData.anncCompany'
                  :showKeyLabelKeyList="['companyCode', 'companyName']"
                  placeholder="请选择涉及公司"
              ></simgleSearch>
              <!-- <h-simple-select
                :placeholder="placeholders.company"
                icon="android-close"
                loadingText="加载中"
                :loading="loadingSearchLabel"
                loading-text="搜索关键字查询"
                :remote-method="remoteMethod"
                remote
                filterable
                v-model="searchData.anncCompany"
              >
                <h-select-block :data="selectBaseDataCategory"></h-select-block>
              </h-simple-select> -->
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>公告类别：</dt>
            <dd>
              <h-select
                :placeholder="placeholders.announcement"
                v-model="searchData.anncTypeList"
                filterable
              >
                <h-option
                  v-for="(item, i) in noticeTypeList"
                  :value="item.value"
                  :key="item.value"
                >{{item.label}}</h-option>
              </h-select>
            </dd>
          </dl>
        </li>

        <li>
          <dl>
            <dt>链接地址：</dt>
            <dd>
              <h-input :placeholder="placeholders.linkP" v-model="searchData.linkAddress" clearable></h-input>
            </dd>
          </dl>
        </li>

        <li class="row0"></li>
        <li class="row2">
          <dl>
            <dt>媒体出处：</dt>
            <dd>
              <h-simple-select :placeholder='placeholders.mediaSource' filterable v-model="searchData.mediaSourceList" >
								<h-select-block :data="mediaSourceList"></h-select-block>
							</h-simple-select>
              <!-- <h-select
                :placeholder="placeholders.mediaSource"
                v-model="searchData.mediaSourceList"
              >
                <h-option
                  v-for="(item, i) in mediaSourceList"
                  :value="item.name"
                  :key="item.name"
                >{{item.name}}</h-option>
              </h-select> -->
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>公告标题：</dt>
            <dd>
              <h-input :placeholder="placeholders.title" v-model.trim="searchData.title" clearable></h-input>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>最后处理人员：</dt>
            <dd>
              <h-simple-select
                :placeholder="placeholders.dealName"
                filterable
                v-model="searchData.processor"
              >
                <h-select-block :data="dealUserList"></h-select-block>
              </h-simple-select>
            </dd>
          </dl>
        </li>
        <!-- QuzjCode begin -->
        <li>
          <dl>
            <dt>公告ID：</dt>
            <dd>
              <h-input placeholder="请输入公告ID" v-model="searchData.anncId" clearable></h-input>
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
  components:{simgleSearch},
  props: {},
  computed: {
    ...mapState("constList", [
      "statusList",
      "noticeTypeList",
      "dealUserList",
      "mediaSourceList",
      // "companyList",
      // "involvingSecuritiesList",
    ])
  },
  data() {
    return {
      placeholders: {
        dateRange: "开始日期-结束日期",
        status: "请选择处理状态",
        bond: "涉及证券",
        announcement: "请选择公告类别",
        linkP: "请输入链接地址",
        dealName: "请选择最后处理人员",
        company: "请选择涉及公司",
        mediaSource: "请选择媒体出处",
        title: "请选择公告标题",
        businessType: "请选择业务类型"
      },
      publishDateRange: [], //发布时间范围
      searchData: {
        title: "",
        processTypeList: "",
        anncCompany: "",
        anncSecurity: "",
        anncId: "",//QuzjCode(公告ID)
        startTime: "",
        endTime: "",
        mediaSourceList: "",
        linkAddress: "",
        anncTypeList: "",
        processor: "",
        order: 0,
        orderByWhich: ""
      },
      orginalData: {
        title: "",
        processTypeList: "",
        anncCompany: "",
        anncSecurity: "",
        anncId: "",//QuzjCode(公告ID)
        startTime: "",
        endTime: "",
        mediaSourceList: "",
        linkAddress: "",
        anncTypeList: "",
        processor: "",
        order: 0,
        orderByWhich: ""
      },
      loadingSearchLabelSecurity: false,
      loadingSearchLabel: false,
      selectBaseDataSecurity: [],
      selectBaseDataCategory: []
    };
  },
  methods: {
    ...mapActions("constList", {
      getStatusList: "statusList",
      getNoticeTypeList: "noticeTypeList",
      getDealUserList: "dealUserList",
      getMediaSourceList: "mediaSourceList",
    }),
    onChangeDateRangePicker(values) {
      this.publishDateRange = values;
      this.searchData.startTime = values[0];
      this.searchData.endTime = values[1];
    },
    onChangeHandDatePicker(values, types) {//QuzjCode
      this.searchData[`${types}Start`] = values[0];
      this.searchData[`${types}End`] = values[1];
    },
    restData() {
      this.searchData = copyDeep(this.orginalData);
    },
    remoteMethod(query) {
      let timeoutflag = null;
      if (timeoutflag != null) {
        clearTimeout(timeoutflag);
      }
      this.loadingSearchLabel = true;
      timeoutflag = setTimeout(() => {
        this.getCategoryLabelList(query, "selectBaseDataCategory", [
          "101102101"
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
          "101109112"
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
          tag_value: searchName
        })
        .then(res => {
          let obj = res.data.return_value || {};
          let selectBaseDataCategory = obj.records || [];
          const list = selectBaseDataCategory.map(item => {
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
              label: labelName
            };
          });
          if (listType == "selectBaseDataCategory") {
            this.loadingSearchLabel = false;
          } else {
            this.loadingSearchLabelSecurity = false;
          }
          this[listType] = [...list];
        })
        .catch(err => {
          this.$hLoading.error();
        });
    }
  },
  mounted() {
    this.orginalData = copyDeep(this.searchData);
    this.getStatusList();
    this.getNoticeTypeList();
    this.getDealUserList();
    this.getCategoryLabelList('','selectBaseDataCategory',['101102101']);
    this.getCategoryLabelList('','selectBaseDataSecurity',['101109112']);
    this.getMediaSourceList();
  }
};
</script>
<style lang="scss" scoped>
</style>