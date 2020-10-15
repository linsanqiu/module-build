<template>
  <div>
    <search-form>
      <ul slot="content">
        <li>
          <dl>
            <dt>入库日期：</dt>
            <dd>
              <h-date-picker
                type="daterange"
                format="yyyy-MM-dd"
                aria-placeholder="入库日期"
                :placeholder="placeholders.createDateRange"
                :value="createDateRange"
                v-model="createDateRange"
                @on-change="onChangeCreateDateRangePicker"
              ></h-date-picker>
            </dd>
          </dl>
        </li>

        <li>
          <dl>
            <dt>公开标志：</dt>
            <dd>
              <h-select
                :readonly="readonlyFlag"
                placeholder="请选择公开标志"
                v-model="searchData.publishStatus"
                @on-change="onNewsListTypeSelectChange(`publishStatus`)"
              >
                <h-option
                  v-for="(item, i) in newsOpenFlags"
                  :value="item.dictEntry"
                  :key="item.dictEntry"
                >{{item.entryName}}</h-option>
              </h-select>
            </dd>
          </dl>
        </li>

        <li>
          <dl>
            <dt>范围：</dt>
            <dd>
              <h-select
                placeholder="请选择范围"
                v-model="searchData.range"
                @on-change="onNewsListTypeSelectChange(`range`)"
              >
                <h-option
                  v-for="(item, i) in rangeList"
                  :value="item.dictEntry"
                  :key="item.typeCode"
                >{{item.entryName}}</h-option>
              </h-select>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>范围细分：</dt>
            <dd>
              <h-select
                :placeholder="rangePlus.length == 0 ? '':'请选择'"
                v-model="searchData.rangePlus"
                @on-change="selectChangePlus(`rangePlus`,`range`)"
              >
                <h-option
                  v-for="(item, i) in rangePlus"
                  :value="item.typeCode"
                  :key="item.typeCode"
                >{{item.typeName}}</h-option>
              </h-select>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>所属项目：</dt>
            <dd>
              <h-select
                :readonly="readonlyFlag"
                :multiple="readonlyFlag"
                placeholder="请选择所属项目"
                v-model="searchData.appIds"
              >
                <h-option
                  v-for="item in appList"
                  :value="item.dictEntry"
                  :key="item.dictEntry"
                >{{item.entryName}}</h-option>
              </h-select>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>处理状态：</dt>
            <dd>
              <h-select
                :readonly="readonlyFlag"
                placeholder="请选择处理状态"
                v-model="searchData.handleStatus"
                @on-change="onNewsListTypeSelectChange(`handleStatus`)"
              >
                <h-option
                  v-for="(item, i) in processingStates"
                  :value="item.dictEntry"
                  :key="item.dictEntry"
                >{{item.entryName}}</h-option>
              </h-select>
            </dd>
          </dl>
        </li>

        <li>
          <dl>
            <dt>金融市场：</dt>
            <dd>
              <h-select
                :readonly="readonlyFlag"
                filterable
                placeholder="请选择金融市场"
                v-model="searchData.financial"
                @on-change="onNewsListTypeSelectChange(`financial`)"
              >
                <h-option
                  v-for="(item, i) in financialMarketList"
                  :value="item.dictEntry"
                  :key="item.dictEntry"
                >{{item.entryName}}</h-option>
              </h-select>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>金融市场细分：</dt>
            <dd>
              <h-select
                filterable
                :placeholder="financialPlus.length == 0 ? '':'请选择'"
                v-model="searchData.financialPlus"
                @on-change="selectChangePlus(`financialPlus`,`financial`, true)"
              >
                <h-option
                  v-for="(item, i) in financialPlus"
                  :value="item.typeCode"
                  :key="item.typeCode"
                >{{item.typeName}}</h-option>
              </h-select>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>媒体出处(常量)：</dt>
            <dd>
              <SimpleSelect
                action='/tm/business/getDictPage' 
                valueShow='dictEntry'
                nameShow='entryName'
                v-model='searchData.mediaSource'
                placeholder='媒体出处(常量)'
              ></SimpleSelect>
              <!-- <h-simple-select
                placeholder="媒体出处(常量)"
                filterable
                v-model="searchData.mediaSource"
                @on-change="onNewsListTypeSelectChange(`mediaSource`)"
              >
                <h-select-block :data="sourceList"></h-select-block>
              </h-simple-select> -->
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>资讯ID：</dt>
            <dd>
              <h-input
                type="int"
                :maxlength="19"
                placeholder="请输入资讯 ID"
                v-model="searchData.newsId"
                @on-enter="onChangeInputEnter(`newsId`)"
                icon="android-close"
                @on-click="shitClearableClick(`newsId`)"
              ></h-input>
            </dd>
          </dl>
        </li>
        <li v-if="readonlyFlag">
          <dl>
            <dt>资讯类型：</dt>
            <dd>
              <h-select placeholder="请选择资讯类型" v-model="searchData.newsType">
                <h-option
                  v-for="(item, i) in newsTypeList"
                  :value="item.dictEntry"
                  :key="item.dictEntry"
                >{{item.entryName}}</h-option>
              </h-select>
            </dd>
          </dl>
        </li>
        <li class="row0"></li>
        <li class="row2">
          <dl>
            <dt>资讯标题：</dt>
            <dd>
              <h-input
                placeholder="请输入资讯标题"
                v-model.trim="searchData.title"
                @on-enter="onChangeInputEnter(`title`)"
                icon="android-close"
                @on-click="shitClearableClick(`title`)"
              ></h-input>
            </dd>
          </dl>
        </li>

        <li>
          <dl>
            <dt>信息来源：</dt>
            <dd>
              <SearchInput placeholderText='请搜索信息来源' searchUrl='/tm/business/getDatasource'  @changeSelectValue="changeSearchInput($event, 'dsSourceType')"></SearchInput>
              <!-- <h-simple-select
                placeholder="请选择信息来源"
                filterable
                v-model="searchData.dsSourceType"
                @on-change="onNewsListTypeSelectChange(`dsSourceType`)"
              >
                <h-select-block :data="sourceList"></h-select-block>
              </h-simple-select> -->
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>撰写机构(常量)：</dt>
            <dd>
              <h-simple-select
                placeholder="请搜索撰写机构(常量)"
                :loading="loadingSearchAutorOrg"
                loadingText="加载中"
                :remote-method="remoteMethodAutorOrg"
                remote
                filterable
                v-model="searchData.authorOrgCode"
              >
                <h-select-block :data="autorOrgList"></h-select-block>
              </h-simple-select>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>信息地域：</dt>
            <dd>
              <h-simple-select placeholder="信息地域" filterable v-model="searchData.areaCode">
                <h-select-block :data="areaList"></h-select-block>
              </h-simple-select>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>信息发布日期：</dt>
            <dd>
              <h-date-picker
                type="daterange"
                format="yyyy-MM-dd"
                :placeholder="placeholders.publishDateRange"
                :value="publishDateRange"
                v-model="publishDateRange"
                @on-change="onChangeDateRangePicker"
              ></h-date-picker>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>信息级别：</dt>
            <dd>
              <h-select aria-placeholder="信息级别" placeholder="请选择信息级别" v-model="searchData.level">
                <h-option
                  v-for="(item, i) in infoLevelList"
                  :value="item.dictEntry"
                  :key="item.dictEntry"
                >{{item.dictEntry}}</h-option>
              </h-select>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>撰写作者：</dt>
            <dd>
              <h-input
                placeholder="请输入撰写作者"
                v-model="searchData.author"
                @on-enter="onChangeInputEnter(`author`)"
                icon="android-close"
                @on-click="shitClearableClick(`author`)"
              ></h-input>
            </dd>
          </dl>
        </li>
        <li class="row0"></li>
        <li class="row2">
          <dl>
            <dt>原始栏目：</dt>
            <dd>
              <h-input
                placeholder="请输入原始栏目"
                v-model="searchData.dsNewsColumns"
                @on-enter="onChangeInputEnter(`dsNewsColumns`)"
                icon="android-close"
                @on-click="shitClearableClick(`dsNewsColumns`)"
              ></h-input>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>修改日期：</dt>
            <dd>
              <h-date-picker
                type="daterange"
                format="yyyy-MM-dd"
                aria-placeholder="修改日期"
                :placeholder="placeholders.updateDateRange"
                :value="updateDateRange"
                @on-change="onChangeModDateRangePicker"
              ></h-date-picker>
            </dd>
          </dl>
        </li>

        <li>
          <dl>
            <dt>涉及证券：</dt>
            <dd>
              <SearchInputDup
                v-model="searchData.tagIds[0]"
                categoryId='101109'
              >
              </SearchInputDup>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>修改人员：</dt>
            <dd>
              <h-select
                :readonly="readonlyFlag"
                clearable
                placeholder="请选择"
                filterable
                v-model="searchData.handleUser"
              >
                <h-option
                  v-for="item in handleArr"
                  :value="item.id"
                  :key="item.id"
                >{{item.realName}}</h-option>
              </h-select>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>所属行业：</dt>
            <dd>
               <SearchInputDup
                v-model="searchData.tagIds[1]"
                categoryId='101101'
              >
              </SearchInputDup>
            </dd>
          </dl>
        </li>
        <li class="row0"></li>
        <li class="row2">
          <dl>
            <dt>链接地址：</dt>
            <dd>
              <h-input
                placeholder="请输入链接地址"
                v-model="searchData.newsUrl"
                icon="android-close"
                @on-enter="onChangeInputEnter(`newsUrl`)"
                @on-click="shitClearableClick(`newsUrl`)"
              ></h-input>
            </dd>
          </dl>
        </li>
				<li>
					<dl>
						<dt>入库时间：</dt>
						<dd>
							<h-select filterable clearable placeholder="请选择入库时间" v-model="searchData.timeType">
								<h-option v-for="(item, i) in timeTypeList" :value="item.dictEntry" :key="item.dictEntry">
									{{item.entryName}}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
        <li>
					<dl>
						<dt>删除类型：</dt>
						<dd>
							<h-select filterable clearable placeholder="请选择删除类型" v-model="searchData.deleteType">
								<h-option v-for="(item, i) in deleteTypeList" :value="item.dictEntry" :key="item.dictEntry">
									{{item.entryName}}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
        <li class="search-wrapper-but">
          <slot name="buttons"></slot>
        </li>
      </ul>
    </search-form>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import utils from "@/utils";
import SearchInput from "@/components/searchInput";
import SimpleSelect from "@/components/simpleSelect";
import SearchInputDup from "@/pages/tbm/components/searchInputDup";
const TODAY = utils.getToday();
export default {
  components: {SearchInput, SimpleSelect, SearchInputDup},
  props: {
    readonlyFlag: false,
    lazyload: false
  },
  data() {
    return {
      activeRoutersButton: this.$store.state.activeRoutersButton, //控制按钮权限
      isAutoRefreshTable: true,
      handleArr: [],
      updateDateRange: ["", ""],
      publishDateRange: ["", ""],
      createDateRange: [TODAY, TODAY], //入库日期
      placeholders: {
        publishDateRange: "开始日期 - 结束日期",
        publishDate: "请输入发布日期",
        updateDateRange: "开始日期 - 结束日期",
        updateDate: "请输入修改日期",
        createDateRange: "开始日期 - 结束日期",
        createDate: "请输入入库日期"
      },
      searchData: {
        handleStatus: "0",
        newsType: "1",
        newsId: "",
        title: "",
        updateTime: "",
        updateTimeEnd: "",
        publishDate: "",
        publishDateEnd: "",
        createDate: TODAY,
        createDateEnd: TODAY,
        publishStatus: "",
        mediaSource: "",
        dsNewsColumns: "",
        dsSourceType: "",
        handleUser: "",
        orderByWhich: "", //根据字段排序
        order: 0, //排序方式，0是降序，1是升序
        tagIds: ["", ""],
        areaCode: "",
        appIds: "",
        level: "",
        sentimentLabel: [], //情感类别
        range: "",
        rangePlus: "",
        financial: "",
        financialPlus: "",
        mediaSource: "",
        author: "",
        authorOrgCode: "",
        newsUrl: "",
        timeType: "",
        deleteType: "",//删除类型
      },
      rangePlus: [],
      financialPlus: [],
      timeTypeList: [],
      deleteTypeList: [],//删除类型下拉框选项
      loadingText: "加载中",
      loadingSearchAutorOrg: false
    };
  },
  methods: {
    remoteMethodAutorOrg(query) {
      if (query !== "") {
        this.loadingSearchAutorOrg = true;
        let queryStr = encodeURIComponent(query);
        this.$store.dispatch("getOrgAuthorList", query);
        setTimeout(() => {
          this.loadingSearchAutorOrg = false;
        }, 600);
      }
    },
    onChangeDateRangePicker(values) {
      this.publishDateRange = values;
      this.searchData.publishDate = values[0];
      this.searchData.publishDateEnd = values[1];
    },
    onChangeCreateDateRangePicker(values) {
      this.createDateRange = values;
      this.searchData.createDate = values[0];
      this.searchData.createDateEnd = values[1];
    },
    onChangeModDateRangePicker(values) {
      this.updateDateRange = values;
      this.searchData.updateTime = values[0];
      this.searchData.updateTimeEnd = values[1];
    },
    getHandleUser() {
      let url = "/tm/news/handleuserlist?newsType=" + this.searchData.newsType;
      this.$http
        .get(url)
        .then(res => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            this.handleArr = data.data || [];
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch(err => {
          this.$hLoading.error();
        });
    },
    getSelectOption(listType, dictCode) {
      let url = "/tm/tbmDictList?dictCode=" + dictCode;
      this.$http
        .get(url)
        .then(res => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            this[listType] = data.body.tbmDictList || [];
            if (listType == "sourceList") {
              const list = this.sourceList.map(item => {
                return {  
                  value: item.dictEntry,
                  label: item.entryName
                };
              });
              this[listType] = [...list];
            }
            sessionStorage.setItem(listType, JSON.stringify(this[ listType]));
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch(err => {
          this.$hLoading.error();
        });
    },
    selectChangePlus(type, typeParent, clear) {
      if (clear && this.searchData[type] == '' && this.readonlyFlag){
        this.searchData[typeParent] = ''
        return
      }
      this[type].forEach((item, i) => {
        if (item.typeCode == this.searchData[type]) {
          this.searchData[typeParent] = item.parentTypeCode;
        }
      });
    },
    changeSearchInput(values, type){
      this.searchData[type] = values
    },
    onNewsListTypeSelectChange(type) {
      let value = this.searchData[type];
      this.searchData[type] = value.trim();
      if (type == "range" || type == "financial") {
        let listName = "";
        if (type == "range") {
          listName = "rangePlus";
          value = value ? value : "0";
        } else {
          listName = "financialPlus";
          value = value ? value : "1";
        }
        this.getSubdivide(listName, value);
      }
    },
    getSubdivide(listName, code) {
      let url = "/tm/business/gettypepluslist?code=" + code;
      this.$http
        .get(url)
        .then(res => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            this[listName] = [...data.body.typeList];
            //	                	this[listName] = Object.assign([], [...data.body.typeList]);
            //	                	console.log(this[listName]);
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch(err => {
          this.$hLoading.error();
        });
    },
    shitClearableClick(type = ``) {
      this.searchData[type] = ``;
    },
    getCommonList() {
      this.$store.dispatch("getAppList", "appList");
      this.$store.dispatch("getNewsOpenFlags", "newsOpenFlags");
      this.$store.dispatch("getProcessingStates", "processingStates");

      this.$store.dispatch("getRangeList", "rangeList");
      this.$store.dispatch("getFinancialList", "financialMarketList");
      this.$store.dispatch("getInfoLevelList", "infoLevelList");
      this.$store.dispatch("getNewsTypeList", "newsTypeList");
    },
    getStorageFn() {
      let newsOpenFlagsStorage =
        JSON.parse(sessionStorage.getItem("newsOpenFlags")) || null; //获取下拉列表缓存
      let processingStatesStorage =
        JSON.parse(sessionStorage.getItem("processingStates")) || null; //获取下拉列表缓存
      let appListStorage =
        JSON.parse(sessionStorage.getItem("appList")) || null; //获取下拉列表缓存
      let infoLevelListStorage =
        JSON.parse(sessionStorage.getItem("infoLevelList")) || null; //获取下拉列表缓存

      let rangeListStorage =
        JSON.parse(sessionStorage.getItem("rangeList")) || null; //
      let financialListStorage =
        JSON.parse(sessionStorage.getItem("financialMarketList")) || null; //
      let newsTypeListStorage =
        JSON.parse(sessionStorage.getItem("newsTypeList")) || null; //
      if (
        !newsOpenFlagsStorage ||
        !processingStatesStorage ||
        !appListStorage ||
        !infoLevelListStorage ||
        !rangeListStorage ||
        !financialListStorage ||
        !newsTypeListStorage
      ) {
        this.getCommonList();
      } else {
        this.$store.commit("GET_APPLIST", appListStorage);
        this.$store.commit("GET_NEWSOPENFLAGS", newsOpenFlagsStorage);
        this.$store.commit("GET_PROCESSINGSTATES", processingStatesStorage);

        this.$store.commit("GET_RANGELIST", rangeListStorage);
        this.$store.commit("GET_INFOLEVELLIST", infoLevelListStorage);
        this.$store.commit("GET_FINANCIALLIST", financialListStorage);
        this.$store.commit("GET_NEWSTYPELIST", newsTypeListStorage);
      }
      // this.$store.dispatch("getSourceList", "sourceList");
      this.$store.dispatch("getAreaList", "areaList");
    },
    searchDatas() {
      this.getHandleUser();
      this.getSubdivide("rangePlus", "0"); //范围细分列表
      this.getSubdivide("financialPlus", "1"); //金融市场细分列表
      this.getSelectOption('timeTypeList','1129');//入库时间
      this.getSelectOption('deleteTypeList','1130');//删除类型
      this.getStorageFn();
    }
  },
  computed: {
    ...mapState([
      "appList",
      "infoLevelList",
      // "sourceList",
      "newsOpenFlags",
      "processingStates",
      "rangeList",
      "financialMarketList",
      "areaList",
      "autorOrgList",
      "newsTypeList"
    ])
  },
  mounted() {
    if (this.lazyload) {
      return;
    } else {
      this.searchDatas();
    }
  }
};
</script>

<style>
</style>