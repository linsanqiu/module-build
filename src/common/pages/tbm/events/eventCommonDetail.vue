<template>
  <div>
    <div class="detailItemBox">
      <h-spin fix v-if="detailLoading">
        <h-icon name="load-c" size="18" class="h-load-loop"></h-icon>
        <div>加载中...</div>
      </h-spin>
      <div class="eventBtns">
        <template v-if="eventPageType == 'HANDLE'">
          <h-button style="margin-right: 10px;" @click="handleNewAdd" :disabled="isTimeOut">
            <h-icon name="android-add" />新建事件
          </h-button>
          <h-button
            style="margin-right: 10px;"
            @click="handlePublishInfo"
            type="info"
            :disabled="isTimeOut"
          >
            <h-icon name="android-unlock" />公开
          </h-button>
          <h-button
            style="margin-right:10px;"
            type="success"
            @click="onSaveNews"
            :disabled="isTimeOut"
            v-if="publishTypeCopy != 1"
          >
            <h-icon name="android-checkbox" />保存
          </h-button>
          <h-button
            style="margin-right: 10px;"
            v-if="!isProcess"
            type="ghost"
            @click="handleNextIdByButton"
          >
            <h-icon name="android-arrow-forwar" />下一条
          </h-button>
          <h-button
            style="margin-right: 10px;"
            v-if="isProcess"
            type="ghost"
            @click="handleOverProcessFn"
            :disabled="isTimeOut"
          >
            <h-icon name="label" />结束流程
          </h-button>
          <h-button
            style="margin-right: 10px;"
            type="ghost"
            @click="handleTransferFn"
            :disabled="isTimeOut"
          >
            <h-icon name="label" />任务转移
          </h-button>
          <h-button
            style="margin-right: 10px;"
            type="ghost"
            @click="handleDeleteEvent"
            :disabled="isTimeOut"
            v-if="publishTypeCopy != 1 && showDeleteBtn"
          >
            <h-icon name="delete" />删除
          </h-button>
          <div
            class="timerContainer"
            v-if="overplusSecs&&overplusSecs<=180&&overplusSecs>0"
          >{{leftTime}}</div>
        </template>
        <template v-else>
          <h-button type="ghost" style="margin-right: 10px;" @click="handlePreIdView">
            <h-icon name="android-arrow-back" />上一条
          </h-button>
          <h-button type="ghost" @click="handleNextId">
            <h-icon name="android-arrow-forwar" />下一条
          </h-button>
        </template>
      </div>
      <div class="detailItem">
        <h2>事件列表</h2>
        <div class="eventContainer">
          <div class="eventTableContainer">
            <h-table
              :rowSelectOnly="true"
              :row-class-name="rowClassName"
              :maxHeight="eventListCopy.length ? '200': null"
              @on-row-click="handleClickRow"
              :highlight-row='true'
              stripe
              size="small"
              border
              :columns="columnsHead"
              :data="eventListCopy"
            ></h-table>
          </div>

          <!-- <div class="actionContainer">
            <div class="actionItem">操作</div>
            <div>
              <div v-for="(item, index) in eventListCopy" :key="index" class="actionItem">
                <input
                  type="checkbox"
                  :checked="item.isCheck == 1? false: true"
                  @change="eventRowCheck($event, index)"
                  :ref="`eventCheckbox${index}`"
                />
              </div>
            </div>
          </div> -->
        </div>
      </div>
      <div class="detailItem">
        <h2>{{detailItemTitle}}</h2>
        <template v-if="isShowDetail">
          <div class="eventBtns" v-if="eventPageType == 'HANDLE'">
            <h-button
              style="margin-right:10px;"
              type="success"
              @click="handleSaveInfo(false)"
              :disabled="isTimeOut"
            >
              <h-icon name="android-checkbox" />更新
            </h-button>
            <h-button
              v-if="eventListCopy.length >0"
              style="margin-right:10px;"
              type="info"
              @click="handleCopyDetail"
              :disabled="isTimeOut"
            >
              <h-icon name="max" />另存为
            </h-button>
            <!-- <h-button
              style="margin-right:10px;"
              type="ghost"
              @click="handleDelet"
              :disabled="isTimeOut"
            >
              <h-icon color="red" name="android-delete" />删除
            </h-button>-->
            <h-button
              style="margin-right:10px;"
              type="ghost"
              @click="handleEmptyFn"
              :disabled="isTimeOut"
            >
              <h-icon name="android-radio-button" />清空
            </h-button>
          </div>
          <h-form
            class="formSearchBox"
            ref="formInline"
            :rules="ruleInlineData"
            :model="detailData"
            :label-width="112"
          >
            <div class="searchBox searchBoxEventBox">
              <NewsFormItem
                formItemType="input"
                class="readonlyItem"
                :pageType="eventPageType"
                itemName="id"
                labelName="事件编码："
                :readonlyFlag="true"
                :commonFilters="detailData"
              ></NewsFormItem>
              <h-form-item class="readonlyItem search-form-item" prop label="事件类别：">
                <h-button
                  :disabled="eventPageType=='VIEW'"
                  size="small"
                  style="text-align: left;"
                  @on-click="handleSelectLevelClick"
                  type="info"
                >快捷选择</h-button>
              </h-form-item>

              <NewsFormItem
                :showMessage="false"
                formItemType="selectblock"
                :pageType="eventPageType"
                itemName="eventFirstLevelCode"
                labelName="类别(一级)："
                :commonFilters="detailData"
                :itemSelectList="eventTypeListFirst"
                :remotFlag="true"
                :loadingLabelTab="loadingLabelTabFirst"
                @changeSelectSource="changeEventFirstLevel"
                @changeQueryFn="changeQueryFnFirst"
              ></NewsFormItem>
              <DateFormItem
                :pageType="eventPageType"
                :srcPublishDate="srcPublishDate"
                @changeDate="changeDate"
                :detailData="detailData"
                :changeItemFlag="changeItemFlag"
              >
                <NewsFormItem
                  slot="second"
                  :showMessage="false"
                  formItemType="selectblock"
                  :pageType="eventPageType"
                  itemName="eventSecondLevelCode"
                  labelName="类别(二级)："
                  :commonFilters="detailData"
                  :itemSelectList="eventTypeListSecond"
                  :remotFlag="true"
                  :loadingLabelTab="loadingLabelTabSecond"
                  @changeSelectSource="changeEventSecondLevel"
                  @changeQueryFn="changeQueryFnSecond"
                ></NewsFormItem>
                <NewsFormItem
                  slot="third"
                  :showMessage="false"
                  formItemType="selectblock"
                  :pageType="eventPageType"
                  itemName="eventThirdLevelCode"
                  labelName="类别(三级)："
                  :commonFilters="detailData"
                  :itemSelectList="eventTypeListThree"
                  :remotFlag="true"
                  :loadingLabelTab="loadingLabelTabThree"
                  @changeSelectSource="changeEventThreeLevel"
                  @changeQueryFn="changeQueryFnThree"
                ></NewsFormItem>
              </DateFormItem>
              <!-- <NewsFormItem  formItemType="datepicker" :pageType='eventPageType' datepickerType="date" itemName="eventDate" labelName="事件日期：" :commonFilters="detailData"  @onChangeDatePicker="onChangeDatePicker"></NewsFormItem> -->
              <NewsFormItem
                :showMessage="false"
                formItemType="selectblock"
                :pageType="eventPageType"
                itemName="eventFourthLevelCode"
                labelName="类别(四级)："
                :commonFilters="detailData"
                :itemSelectList="eventTypeListFourth"
                :remotFlag="true"
                :loadingLabelTab="loadingLabelTabFourth"
                @changeSelectSource="changeEventFourthLevel"
                @changeQueryFn="changeQueryFnFourth"
              ></NewsFormItem>
              <NewsFormItem
                formItemType="select"
                :pageType="eventPageType"
                itemName="sentimentLabel"
                labelName="情感方向："
                :commonFilters="detailData"
                :itemSelectList="emotionList"
                @selectChangeFn="changeEmotionList"
              ></NewsFormItem>
              <NewsFormItem
                formItemType="select"
                readonlyFlag
                :pageType="eventPageType"
                itemName="sentimentLevelDefault"
                labelName="默认情感："
                :commonFilters="detailData"
                :itemSelectList="feelingLevelList"
              ></NewsFormItem>
              <NewsFormItem
                formItemType="select"
                :pageType="eventPageType"
                itemName="sentimentLevel"
                labelName="情感级别："
                :commonFilters="detailData"
                :itemSelectList="feelingLevelList"
                @selectChangeFn="changeFeelingLevelList"
              ></NewsFormItem>
              <!--<h-form-item class="readonlyItem search-form-item" prop="newsId" label="资讯ID：">
						                <h-button style="text-align: left;" @on-click="handleClickNewsId" type="ghost" class="linkDetailItem">{{detailData.newsId ? detailData.newsId : '-'}}</h-button>
              </h-form-item>-->
            </div>
            <NewsLabelList
              :pageType="eventPageType"
              labelListType="labelListSecurity"
              labelListName="涉及证券："
              columnsShowflag="security"
              :labelListData="labelListSecurity"
              :hiddenItemArr="hiddenItemArr"
              @handleDelLabelFn="handleDelLabelFn"
              @handleModLabel="handleModLabel"
              @addLabelInfoFn="addLabelInfoFn"
              :isEventPage="true"
            ></NewsLabelList>
            <NewsLabelList
              :pageType="eventPageType"
              labelListType="labelListCorp"
              labelListName="所属公司："
              columnsShowflag="corp"
              :labelListData="labelListCorp"
              :hiddenItemArr="hiddenItemArr"
              @handleDelLabelFn="handleDelLabelFn"
              @handleModLabel="handleModLabel"
              @addLabelInfoFn="addLabelInfoFn"
              :isEventPage="true"
            ></NewsLabelList>
            <div class="companyNameBox">
              <NewsFormItem
                class="companyName"
                inputType="textarea"
                formItemType="input"
                :pageType="eventPageType"
                itemName="eventBasis"
                labelName="事件依据："
                :commonFilters="detailData"
              ></NewsFormItem>
            </div>
          </h-form>
        </template>
        <template v-else>
          <div class="noDataBox">暂无事件详情</div>
        </template>
      </div>
    </div>
    <h-msgBox
      :isOkLeft="true"
      title="提示"
      v-model="modalCheckPublish"
      @on-ok="confirmCheckFun"
      @on-cancel="cancelCheckFun"
    >
      <p v-html="modalCheckPublishMsg"></p>
    </h-msgBox>
    <h-msgBox :isOkLeft="true" v-model="modalShow" title="任务转移" footerHide>
      <h-form
        ref="formInlineTransfer"
        :rules="ruleInlineTransfer"
        :model="transferData"
        :label-width="100"
      >
        <div>
          <h-form-item style="display:inline-block" prop="receiverId" label="接收人：">
            <h-select
              style="width:150px"
              label-in-value
              filterable
              clearable
              placeholder="请选择"
              v-model="transferData.receiverId"
              @on-change="changeReceiver"
            >
              <h-option
                v-for="item in transferManList"
                :value="item.id"
                :key="item.id"
              >{{item.realName}}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="transferInstruction" label="转移说明：">
            <h-input
              type="textarea"
              style="width:300px;"
              v-model.trim="transferData.transferInstruction"
              placeholder="请输入转移说明"
            ></h-input>
          </h-form-item>
        </div>
      </h-form>
      <div class="footerBox">
        <h-button @click="cancelTransfer">取消</h-button>
        <h-button style="margin-left: 10px" type="info" @click="handleSaveFn">确定</h-button>
      </div>
    </h-msgBox>
    <h-msgBox :isOkLeft="true" width="70%" v-model="modalLevelShow" title="事件类别" footerHide>
      <div>
        <ul class="selectSearchBox">
          <li class="selectSearchItem">
            <dl>
              <dt>
                <!--<h-simple-select clearable filterable placeholder="类别(一级)"  v-model="selectData['1']" @on-change="onSelectLevelChangeFirst" @on-query-change="changeQueryFirstLevel">
							    	<h-select-block focusAllSelect :data="eventTypeListFirstSelect"></h-select-block>
                </h-simple-select>-->
                <SearchLevel
                  :modelValue="selectData['1']"
                  categoryLevel="1"
                  placeholderText="类别(一级)"
                  :defaultList="eventTypeListFirstSelect"
                  @changeSelectValue="onSelectLevelChangeFirst"
                ></SearchLevel>
              </dt>
              <dd class="optionListBox" v-if="showFirstList">
                <div
                  class="optionList"
                  :class="currentClickIndex['1'] == index ? 'optionListActive' : ''"
                  v-for="(item,index) in eventTypeListFirstTemp"
                  @click="changeLevelClick('allLevelList','eventTypeListSecondTemp','1',index, item)"
                  :title="item.label"
                >{{item.label}}</div>
              </dd>
            </dl>
          </li>
          <li class="selectSearchItem">
            <dl>
              <dt>
                <!--<h-simple-select clearable filterable placeholder="类别(二级)"  v-model="selectData['2']" @on-change="onSelectLevelChangeSecond">
							    	<h-select-block focusAllSelect :data="eventTypeListSecondSelect"></h-select-block>
                </h-simple-select>-->
                <SearchLevel
                  :modelValue="selectData['2']"
                  categoryLevel="2"
                  placeholderText="类别(二级)"
                  :defaultList="eventTypeListSecondSelect"
                  @changeSelectValue="onSelectLevelChangeSecond"
                ></SearchLevel>
              </dt>
              <dd class="optionListBox" v-if="showSecondList">
                <div
                  class="optionList"
                  :class="currentClickIndex['2'] == index? 'optionListActive' : ''"
                  v-for="(item,index) in eventTypeListSecondTemp"
                  @click="changeLevelClick('eventTypeListSecondTemp','eventTypeListThreeTemp','2',index, item)"
                  :title="item.label"
                >{{item.label}}</div>
              </dd>
            </dl>
          </li>
          <li class="selectSearchItem">
            <dl>
              <dt>
                <!--<h-simple-select clearable filterable placeholder="类别(三级)"  v-model="selectData['3']" @on-change="onSelectLevelChangeThree">
							    	<h-select-block focusAllSelect :data="eventTypeListThreeSelect"></h-select-block>
                </h-simple-select>-->
                <SearchLevel
                  :modelValue="selectData['3']"
                  categoryLevel="3"
                  placeholderText="类别(三级)"
                  :defaultList="eventTypeListThreeSelect"
                  @changeSelectValue="onSelectLevelChangeThree"
                ></SearchLevel>
              </dt>
              <dd class="optionListBox" v-if="showSecondList">
                <div
                  class="optionList"
                  :class="currentClickIndex['3'] == index ? 'optionListActive' : ''"
                  v-for="(item,index) in eventTypeListThreeTemp"
                  @click="changeLevelClick('eventTypeListThreeTemp','eventTypeListFourthTemp','3',index, item)"
                  :title="item.label"
                >{{item.label}}</div>
              </dd>
            </dl>
          </li>
          <li class="selectSearchItem">
            <dl>
              <dt>
                <!--<h-simple-select clearable filterable placeholder="类别(四级)"  v-model="selectData['4']"  @on-change="onSelectLevelChangeFourth">
							    	<h-select-block focusAllSelect :data="eventTypeListFourthSelect"></h-select-block>
                </h-simple-select>-->
                <SearchLevel
                  :modelValue="selectData['4']"
                  categoryLevel="4"
                  placeholderText="类别(四级)"
                  :defaultList="eventTypeListFourthSelect"
                  @changeSelectValue="onSelectLevelChangeFourth"
                ></SearchLevel>
              </dt>
              <dd class="optionListBox" v-if="showSecondList">
                <div
                  class="optionList"
                  :class="currentClickIndex['4'] == index ? 'optionListActive' : ''"
                  v-for="(item,index) in eventTypeListFourthTemp"
                  @click="changeLevelClick('eventTypeListFourthTemp','','4',index, item)"
                  :title="item.label"
                >{{item.label}}</div>
              </dd>
            </dl>
          </li>
        </ul>
      </div>
      <div class="footerBox">
        <h-button @click="modalLevelShow = false">取消</h-button>
        <h-button style="margin-left: 10px" type="info" @click="handleSelectConfirmFn">确认填入</h-button>
      </div>
      <div class="eventDescContent">
        <div>{{eventDescTitle}}</div>
        <h-input type="textarea" v-model="eventDesc"></h-input>
      </div>
    </h-msgBox>
    <h-msgBox width="70%" v-model="similarModalShow" title="相似资讯" footerHide>
      <EventSimilar
        :initBusinessId="initBusinessId"
        :similarAllList="similarAllList"
        :similarCompanyList="similarCompanyList"
        :sureSimilarPublish="sureSimilarPublish"
        v-if="similarModalShow"
      >
        <div slot="footer">
          <h-button type="primary" @on-click="cancelSimilarPublish">取消公开</h-button>
          <h-button type="primary" @on-click="goStillPublish">继续公开</h-button>
        </div>
      </EventSimilar>
    </h-msgBox>
  </div>
</template>
<script>
import { copyDeep } from "@/filters/index";
import { mapState } from "vuex";
import NewsFormItem from "@/components/news_formItem";
import DateFormItem from "../components/dateFormItem";
import NewsLabelList from "@/components/news_labelList";
import SearchLevel from "./searchLevel";
import { batchDeleteEvent, checkSimilarEvent } from "./api/apiManager";
import { pathName } from "@/filters";
import EventSimilar from "../components/eventSimilar";
export default {
  components: {
    NewsFormItem,
    NewsLabelList,
    SearchLevel,
    DateFormItem,
    EventSimilar,
  },
  props: {
    eventPageType: String,
    eventList: Array,
    labelList: Array,
    secuTags: Array,
    labelListNews: Array,
    labelListNewsSecurity: Array,
    newsId: "",
    eventNewsId: "",
    publishType: 0,
    hiddenItemArr: Array,
    showEventBtns: Array,
    isProcess: false,
    newsDup: Object,

    overplusSecs: Number,
    srcPublishDate: String,
    commonFilters: Object,
  },
  data() {
    return {
      allowStarRules: true, // 是否允许 changeDate 计算规则  2 s 以后
      firstLoading: true,
      allLevelListObj: {},
      isSaveAs: false,
      modalCheckPublish: false,
      modalCheckPublishMsg: "",
      newsIdCopy: "",
      eventNewsIdCopy: "",
      delLabelStatus: false,
      clickDelStatus: false,
      selectBaseData: [],
      isShowDetail: false,
      detailLoading: false,
      addClickStatus: false,
      currentIndex: 0,
      changeItemFlag: false, //切换事件标志
      changeFourthFlag: false, //切换四级标志
      modalAddLabel: false,
      modalHeight: 380,
      isChangeCurrent: false,
      clickRowFlag: false,
      loadingArr: {
        loadingBtnPre: false,
        loadingBtnNext: false,
        loadingDel: false,
        loadingBtnPub: false,
        loadingBtnSave: false,
      },
      newsIdLists: [], //查看页上一条下一条数据
      delTags: [],
      addTags: [],
      saveInfo: {},
      savePublishInfo: {},
      checkPublish: false,
      publishTypeCopy: 0,
      detailItemTitle: "事件详情",
      columnsHead: [
        {
          key: "id",
          title: "事件编码",
          align: "left",
          width: 160,
        },
        {
          key: "eventThirdLevel",
          title: "类别(三级)",
          align: "left",
          minWidth: 140,
        },
        {
          key: "eventFourthLevel",
          title: "类别(四级)",
          align: "left",
          minWidth: 140,
        },
        {
          key: "sentimentLabelDesc",
          title: "情感方向",
          align: "left",
          width: 120,
        },
        {
          key: "sentimentLevelDesc",
          title: "情感级别",
          align: "left",
          width: 110,
        },
        {
          key: "sentimentLevelDesc",
          title: "情感级别",
          align: "left",
          width: 110,
        },
        {
          key: "acton",
          title: "操作",
          align: "left",
          fixed: "right",
          width: 50,
          render: (h, params) => {
            let {row, index} = params
            return(
              <div>
                <h-checkbox value={row.isDelete === 1? false: true} on-on-change={this.eventRowCheck.bind(this, index)} on-on-click={this.checkBoxClick.bind(this)}/>
              </div>
            )
          }
        },
      ],
      ruleInlineData: {
        eventDateType: [
          {
            required: true,
            message: "事件日期类型不能为空",
            trigger: "change",
          },
        ],
        newsId: [
          { required: true, message: "资讯ID不能为空", trigger: "change" },
        ],
        id: [
          { required: true, message: "事件编码不能为空", trigger: "change" },
        ],
        eventFirstLevelCode: [
          { required: true, message: "请选择类别(一级)", trigger: "change" },
        ],
        eventSecondLevelCode: [
          { required: true, message: "请选择类别(二级)", trigger: "change" },
        ],
        eventThirdLevelCode: [
          { required: true, message: "请选择类别(三级)", trigger: "change" },
        ],
        eventFourthLevelCode: [
          { required: true, message: "请选择类别(四级)", trigger: "change" },
        ],
        sentimentLabel: [
          { required: true, message: "请选择事件情感方向", trigger: "change" },
        ],
        sentimentLevel: [
          { required: true, message: "请选择事件情感级别", trigger: "change" },
        ],
        eventBasis: [
           { required: true, message: "请输入事件依据", trigger: "change" },
        ],

      },
      ruleInlineDataSave: {
        eventDateType: [
          {
            required: true,
            message: "事件日期类型不能为空",
            trigger: "change",
          },
        ],
        newsId: [
          { required: true, message: "资讯ID不能为空", trigger: "change" },
        ],
        id: [
          { required: true, message: "事件编码不能为空", trigger: "change" },
        ],
        eventFirstLevelCode: [
          { required: true, message: "请选择类别(一级)", trigger: "change" },
        ],
        eventSecondLevelCode: [
          { required: true, message: "请选择类别(二级)", trigger: "change" },
        ],
        eventThirdLevelCode: [
          { required: true, message: "请选择类别(三级)", trigger: "change" },
        ],
        eventFourthLevelCode: [
          { required: true, message: "请选择类别(四级)", trigger: "change" },
        ],
        sentimentLabel: [
          { required: true, message: "请选择事件情感方向", trigger: "change" },
        ],
        sentimentLevel: [
          { required: true, message: "请选择事件情感级别", trigger: "change" },
        ],
        eventBasis: [
           { required: true, message: "请输入事件依据", trigger: "change" },
        ],
      },
      feelingLevelList: [],
      detailData: {},
      detailDataCompare: {},
      currentClickIndex: {
        1: -1,
        2: -1,
        3: -1,
        4: -1,
      },
      selectData: {
        1: "",
        2: "",
        3: "",
        4: "",
      },
      loadingLabelTabFirst: false,
      loadingLabelTabSecond: false,
      loadingLabelTabThree: false,
      loadingLabelTabFourth: false,
      selectDataConfirmArr: {
        eventFirstLevelCode: "",
        eventSecondLevelCode: "",
        eventThirdLevelCode: "",
        eventFourthLevelCode: "",
        sentimentLabel: "",
        sentimentLevel: "",
        sentimentLevelDefault: "",
      },
      eventTypeListFirst: [],
      eventTypeListSecond: [],
      eventTypeListThree: [],
      eventTypeListFourth: [],
      eventTypeListFirstTemp: [],
      eventTypeListSecondTemp: [],
      eventTypeListThreeTemp: [],
      eventTypeListFourthTemp: [],
      eventTypeListFirstSelect: [],
      eventTypeListSecondSelect: [],
      eventTypeListThreeSelect: [],
      eventTypeListFourthSelect: [],
      allLevelList: [],
      showFirstList: true,
      showSecondList: false,
      columnsCorp: [
        {
          title: "标签名称",
          key: "tagName",
          width: 250,
        },
        {
          title: "标签关联信息",
          key: "relationInfo",
          width: 150,
        },
        {
          title: "权重值",
          key: "tagWeight",
          width: 80,
        },
        {
          title: "标签近义词",
          key: "synonym",
          width: 120,
          render: (h, params) => {
            let synonym = params.row.synonym;
            if (!synonym || synonym.length == 0) {
              synonym = "";
            } else {
              synonym = synonym.join();
            }
            return h("div", synonym);
          },
        },
        {
          title: "标签分类",
          key: "categoryNames",
          //						width: 160
        },
        {
          key: "operation",
          title: "操作",
          width: 80,
          align: "center",
          fixed: "right",
          hiddenCol: this.eventPageType == "VIEW",
          render: (h, params) => {
            return h("div", [
              h("span", {
                class: {
                  iconfont: true,
                  "icon-t-b-delete": true,
                  "tab-icon-btn": true,
                },
                style: {
                  color: "red",
                },
                attrs: {
                  title: "删除",
                },
                on: {
                  click: () => {
                    this.handleDelLabel(
                      this.delLabelType,
                      params.row,
                      params.index
                    );
                  },
                },
              }),
            ]);
          },
        },
      ],
      eventListCopy: [],
      labelListCorp: [],
      labelListSecurity: [],
      addLabelType: "labelListCorp",
      delLabeltype: "labelListCorp",
      categoryId: {
        labelListSecurity: "101109",
        labelListCorp: "101102",
        labelListIndustry: "101101",
        labelListConcept: "101111",
        labelListIndicator: "101112",
        labelListArea: "101110",
      },
      modalShow: false, //任务转移弹框
      modalLevelShow: false,
      ruleInlineTransfer: {
        receiverId: [
          { required: true, message: "接收人不能为空", trigger: "change" },
        ],
        transferInstruction: [
          { required: true, message: "转移说明不能为空", trigger: "change" },
        ],
      },
      transferManList: [],
      transferData: {
        receiverId: "",
        receiverName: "",
        transferInstruction: "",
      },
      eventDesc: "",
      eventDescTitle: "",
      timer: null,
      newsDupCopy: null,
      countNum: 0,
      showDeleteBtn: true,
      similarModalShow: false,
      similarCompanyList: [],
      initBusinessId: "",
      similarAllList: [],
    };
  },
  methods: {
    rowClassName(row, index) {
      if (index === 0 && this.currentIndex === 0) {
        //                  return 'table-default-highlight';
      } else {
        return "";
      }
    },
    handleClickNewsId() {
      this.$router.push({
        path: "/tbm/news/handle",
        query: { newsId: this.detailData.newsId },
      });
    },
    handleSelectLevelClick() {
      this.modalLevelShow = true;
      this.getEventTypeList("eventTypeListSecondSelect", "2", "");
      this.getEventTypeList("eventTypeListThreeSelect", "3", "");
      this.getEventTypeList("eventTypeListFourthSelect", "4", "");
    },
    // 格式化 null 成 空字符串
    formattingData(detailDataCompare) {
      detailDataCompare = copyDeep(detailDataCompare);
      for (let i in detailDataCompare) {
        detailDataCompare[i] = detailDataCompare[i] || "";
      }
      return detailDataCompare;
    },
    // 点击事件列表
    handleClickRow(rowdata) {
      if (this.currentIndex == rowdata[1]) {
        return;
      }
      if (this.isSaveAs) {
        this.$hMessage.warning({
          content: "当前事件信息未保存，请保存后再操作！",
        });
        this.highLightItem(this.currentIndex);
        this.$set(
          this.eventListCopy,
          rowdata[1],
          this.eventListCopy[rowdata[1]]
        );
        this.$set(
          this.eventListCopy,
          this.currentIndex,
          this.eventListCopy[this.currentIndex]
        );
        return;
      }
      this.changeItemFlag = true;
      let beforeData = this.detailData;
      let detailDataCompare = this.formattingData(this.detailDataCompare);
      let detailData = this.formattingData(this.detailData);
      if (
        this.$md5(JSON.stringify(detailData)) !==
          this.$md5(JSON.stringify(detailDataCompare)) &&
        this.eventPageType != "VIEW"
      ) {
        this.$hMsgBox.confirm({
          content:
            "当前事件信息未保存，如需保存，请点击【保存】，否则信息将会丢失，确定继续？",
          onOk: () => {
            this.detailItemTitle = "事件详情";
            this.currentIndex = rowdata[1];
            this.detailData = { ...rowdata[0] };
            this.detailDataCompare = copyDeep(this.detailData);
            this.labelListCorp = this.detailData.companyTags
              ? [...this.detailData.companyTags]
              : [];
            this.labelListSecurity = this.detailData.securityTags
              ? [...this.detailData.securityTags]
              : [];
            this.addTags = []; //清空添加标签标记
            this.addClickStatus = false;
            if (this.eventPageType == "VIEW") {
              this.getViewDetaiItemName(this.detailData);
            }
            // 修复第四级不联动情感方向跟星级问题
            if (
              beforeData.eventFourthLevel == this.detailData.eventFourthLevel
            ) {
              this.changeItemFlag = false;
            }
          },
          onCancel: () => {
            this.highLightItem(this.currentIndex);
            this.$set(
              this.eventListCopy,
              rowdata[1],
              this.eventListCopy[rowdata[1]]
            );
            this.$set(
              this.eventListCopy,
              this.currentIndex,
              this.eventListCopy[this.currentIndex]
            );
          },
        });
        return;
      }
      setTimeout(() => {
        this.detailItemTitle = "事件详情";
        this.currentIndex = rowdata[1];
        this.highLightItem(this.currentIndex)
        let details = { ...rowdata[0] };
        if (!details.eventFourthLevelCode || !details.eventFourthLevelCode) {
          details.eventFourthLevelCode = "";
          details.eventFourthLevel = "";
        }
        if (!details.eventDateText) {
          details.eventDateText = "";
        }
        if (!details.eventTimeText) {
          details.eventTimeText = "";
        }
        this.detailData = details;
        this.detailDataCompare = copyDeep(details);
        this.addTags = []; //清空添加标签标记
        this.labelListCorp = this.detailData.companyTags
          ? [...this.detailData.companyTags]
          : [];
        this.labelListSecurity = this.detailData.securityTags
          ? [...this.detailData.securityTags]
          : [];
        if (this.eventPageType == "VIEW") {
          this.getViewDetaiItemName(this.detailData);
        }
        // 修复第四级不联动情感方向跟星级问题
        if (beforeData.eventFourthLevel == this.detailData.eventFourthLevel) {
          this.changeItemFlag = false;
        }
      }, 50);
    },
    isLabelRepeat(addId) {
      let flag = false;
      let arrAll = this[this.addLabelType].concat(this.addTags);
      if (arrAll.length > 0) {
        arrAll.forEach((item, index) => {
          if (item.businessId == addId) {
            flag = true;
          }
        });
      }
      return flag;
    },
    findCategoryId(tag_category_id, labelType) {
      let arrValues = Object.values(this.categoryId);
      let arrKeys = Object.keys(this.categoryId);
      arrValues.forEach((item, i) => {
        if (tag_category_id.startsWith(item)) {
          this[labelType] = arrKeys[i];
        }
      });
      return this[labelType];
    },
    addLabelInfoFn(addInfo) {
      //				this.isChangeCurrent = true;
      let tag_category_id = addInfo.tag_category_ids[1];
      this.addLabelType = this.findCategoryId(tag_category_id, "addLabelType");
      let repeatFlag = this.isLabelRepeat(addInfo.other_obj.business_id);
      if (repeatFlag) {
        this.$hMessage.error({ content: "标签列表已存在，请勿重复添加！" });
      } else {
        this.addLabelInfo(addInfo);
      }
    },
    addLabelInfo(addInfo) {
      let addobj = {
        businessCode: addInfo.businessCode,
        businessId: addInfo.other_obj.business_id,
        categoryCode: addInfo.category_id,
        categoryName: addInfo.tag_categorys,
        categoryNames: addInfo.categoryNames,
        //					tagCategorys: addInfo.tag_categorys,
        //					categoryName: addInfo.categoryNames,
        id: "",
        synonym: [],
        tagId: addInfo.tag_id,
        tagName: addInfo.tag_value,
        tagWeight: "1.0",
        relationInfo: addInfo.relationInfo,
        flag: 9,
        mainBasis: "",
        registerTagId: addInfo.tag_id,
      };
      this.addTags = [{ ...addobj }];
      this[this.addLabelType] = this[this.addLabelType].concat(this.addTags);
      this.changeDetailDataLabel(this.addLabelType);
      this.$hMessage.success("添加成功");
    },
    getLabelList() {
      this.$refs.modalAddLabel.modalAdd.modalLoading = true;
      let url = "/tm/queryTagCategory?appId=" + this.$api.APPID.JINTAN;
      this.$http
        .get(url)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            let obj = data.body || {};
            this.selectBaseData =
              obj.children && obj.children[1]
                ? [{ ...obj.children[1] }, { ...obj.children[2] }]
                : [];
          } else {
            this.$hMessage.error({ content: data.msg });
          }
          this.$refs.modalAddLabel.modalAdd.modalLoading = false;
        })
        .catch((err) => {
          this.$refs.modalAddLabel.modalAdd.modalLoading = false;
          this.$hLoading.error();
        });
    },
    handleDelLabelFn(params) {
      this.delLabelType = this.findCategoryId(
        params.row.categoryCode,
        "delLabelType"
      );
      this.handleDelLabel(this.delLabelType, params.row, params.index);
    },
    handleModLabel(params) {
      let modType = this.findCategoryId(
        params.row.categoryCode,
        "delLabelType"
      );
      this.$set(this[modType], params.index, params.row);
      this.changeDetailDataLabel(modType);
    },
    //删除标签
    handleDelLabel(labelArrType, data, index) {
      let labelNameInfo = data.tagName || "";
      let delArr = [];
      delArr.push(data);
      this.delTags = delArr;
      this.addTags = [];
      setTimeout(() => {
        this[labelArrType].splice(index, 1);
        this.changeDetailDataLabel(labelArrType);
        this.$hMessage.success("标签已删除");
      }, 10);
    },
    changeDetailDataLabel(labelType) {
      /***改动标签同步detailData ---切换事件时需要判断改动*/
      if (labelType == "labelListCorp") {
        this.detailData.companyTags = copyDeep(this[labelType]);
      } else {
        this.detailData.securityTags = copyDeep(this[labelType]);
      }
    },
    changeQueryFnFirst(query) {
      this.queryListFn(
        query,
        "1",
        "",
        "",
        "eventTypeListFirst",
        "loadingLabelTabFirst"
      );
    },
    changeQueryFnSecond(query) {
      let parentCode = this.detailData.eventFirstLevelCode;
      let parentLevel = "1";
      this.queryListFn(
        query,
        "2",
        parentCode,
        parentLevel,
        "eventTypeListSecond",
        "loadingLabelTabSecond"
      );
    },
    changeQueryFnThree(query) {
      let parentCode = this.detailData.eventSecondLevelCode;
      let parentLevel = "2";
      if (!parentCode) {
        if (this.detailData.eventFirstLevelCode) {
          parentCode = this.detailData.eventFirstLevelCode;
          parentLevel = "1";
        } else {
          parentLevel = "";
          parentCode = "";
        }
      }
      this.queryListFn(
        query,
        "3",
        parentCode,
        parentLevel,
        "eventTypeListThree",
        "loadingLabelTabThree"
      );
    },
    changeQueryFnFourth(query) {
      let parentCode = this.detailData.eventThirdLevelCode;
      let parentLevel = "3";
      if (!parentCode) {
        if (this.detailData.eventSecondLevelCode) {
          parentCode = this.detailData.eventSecondLevelCode;
          parentLevel = "2";
        } else if (this.detailData.eventFirstLevelCode) {
          parentCode = this.detailData.eventFirstLevelCode;
          parentLevel = "1";
        } else {
          parentCode = "";
          parentLevel = "";
        }
      }
      if (query == "") {
        this.detailData.eventFourthLevel = "";
        this.changeItemFlag = false;
      }
      this.queryListFn(
        query,
        "4",
        parentCode,
        parentLevel,
        "eventTypeListFourth",
        "loadingLabelTabFourth"
      );
    },
    queryListFn(query, level, parentCode, parentLevel, listName, loading) {
      if (this.firstLoading) return; //首次进入页面不请求
      this[loading] = true;
      let url = "/tm/event/queryCategoryLike";
      this.$http
        .post(url, {
          categoryLevel: level,
          eventName: query,
          parentCode: parentCode,
          parentLevel: parentLevel,
          pageSize: 1000,
          pageNum: 1,
        })
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            let list = data.body.records;
            for (let i = 0, len = list.length; i < len; i++) {
              if (
                this.allLevelListObj[list[i].categoryCode].categoryLevel ==
                level
              ) {
                //				        		list[i].sentimentLabel = this.allLevelListObj[list[i].categoryCode].sentimentLabel;
                //				        		list[i].sentimentLevel = this.allLevelListObj[list[i].categoryCode].sentimentLevel;
                list[i].nextCategoryList = this.allLevelListObj[
                  list[i].categoryCode
                ].nextCategoryList;
              }
            }
            this[listName] = this.typeTreeForEach(data.body.records);
          } else {
            this.$hMessage.error({ content: data.msg });
          }
          this[loading] = false;
        })
        .catch((err) => {
          this.$hLoading.error();
          this[loading] = false;
        });
    },
    changeEventFirstLevel(levelCode) {
      if (levelCode) {
        this.getLabelName(
          this.eventTypeListFirst,
          "eventFirstLevel",
          levelCode,
          "value",
          "label"
        );
        //获取二、三、四
        this.allLevelList.forEach((item, index) => {
          if (item.value == levelCode) {
            this.eventTypeListSecond = copyDeep(item.nextCategoryList);
          }
        });
        //					this.eventTypeListThree =  this.getAllNextCategoryList(this.eventTypeListSecond);
        //					this.eventTypeListFourth = this.getAllNextCategoryList(this.eventTypeListThree);
        if (this.detailData.eventSecondLevelCode) {
          let flag = false;
          this.eventTypeListSecond.forEach((item, index) => {
            if (item.value == this.detailData.eventSecondLevelCode) {
              flag = true;
            }
          });
          if (!flag) this.detailData.eventSecondLevelCode = "";
        } else {
          this.eventTypeListThree = this.getAllNextCategoryList(
            this.eventTypeListSecond
          );
          this.eventTypeListFourth = this.getAllNextCategoryList(
            this.eventTypeListThree
          );
        }
      } else {
        this.detailData.eventSecondLevelCode = "";
        this.getEventTypeList("eventTypeListSecond", "2", "");
        this.getEventTypeList("eventTypeListThree", "3", "");
        this.getEventTypeList("eventTypeListFourth", "4", "");
      }
    },
    changeEventSecondLevel(levelCode) {
      if (levelCode) {
        this.getLabelName(
          this.eventTypeListSecond,
          "eventSecondLevel",
          levelCode,
          "value",
          "label"
        );
        //获取三、四
        this.eventTypeListSecond.forEach((item, index) => {
          if (item.value == levelCode) {
            this.eventTypeListThree = copyDeep(item.nextCategoryList);
          }
        });
        //					this.eventTypeListFourth = this.getAllNextCategoryList(this.eventTypeListThree);
        if (this.detailData.eventThirdLevelCode) {
          let flag = false;
          this.eventTypeListThree.forEach((item, index) => {
            if (item.value == this.detailData.eventThirdLevelCode) {
              flag = true;
            }
          });
          if (!flag) this.detailData.eventThirdLevelCode = "";
        } else {
          this.eventTypeListFourth = this.getAllNextCategoryList(
            this.eventTypeListThree
          );
        }
        this.getParentLevelCode("2", levelCode);
      } else {
        this.detailData.eventThirdLevelCode = "";
        if (this.detailData.eventFirstLevelCode) {
          this.eventTypeListThree = this.getAllNextCategoryList(
            this.eventTypeListSecond
          );
          this.eventTypeListFourth = this.getAllNextCategoryList(
            this.eventTypeListThree
          );
        }
      }
    },
    changeEventThreeLevel(levelCode) {
      if (levelCode) {
        this.getLabelName(
          this.eventTypeListThree,
          "eventThirdLevel",
          levelCode,
          "value",
          "label"
        );
        this.eventTypeListThree.forEach((item, index) => {
          if (item.value == levelCode) {
            this.eventTypeListFourth = copyDeep(item.nextCategoryList);
          }
        });
        if (this.detailData.eventFourthLevelCode) {
          let flag = false;
          this.eventTypeListFourth.forEach((item, index) => {
            if (item.value == this.detailData.eventFourthLevelCode) {
              flag = true;
            }
          });
          if (!flag) {
            this.detailData.eventFourthLevelCode = "";
          }
        }
        this.getParentLevelCode("3", levelCode, "deailData");
      } else {
        this.detailData.eventFourthLevelCode = "";
        if (
          this.detailData.eventSecondLevelCode ||
          this.detailData.eventFirstLevelCode
        ) {
          this.eventTypeListFourth = this.getAllNextCategoryList(
            this.eventTypeListThree
          );
        }
      }
    },
    changeEventFourthLevel(levelCode) {
      // console.log('fourChange', this.allowStarRules)
      if (!this.allowStarRules) return;
      this.changeFourthFlag = true;
      if (levelCode) {
        this.getLabelName(
          this.eventTypeListFourth,
          "eventFourthLevel",
          levelCode,
          "value",
          "label"
        );
        this.getParentLevelCode("4", levelCode, "deailData");
      }
    },
    changeEmotionList(itemName) {
      this.getLabelName(
        this.emotionList,
        "sentimentLabelDesc",
        this.detailData[itemName]
      );
    },
    changeFeelingLevelList(itemName) {
      this.getLabelName(
        this.feelingLevelList,
        "sentimentLevelDesc",
        this.detailData[itemName]
      );
    },
    // 当下拉框值变化时同步修改对应标签名
    getLabelName(
      listArr,
      labelName,
      code,
      codeType = "dictEntry",
      labelNameType = "entryName"
    ) {
      listArr.forEach((item, i) => {
        if (item[codeType] == code) {
          this.detailData[labelName] = item[labelNameType];
        }
      });
    },
    onChangeDatePicker(values) {
      this.detailData.eventDate = values || "";
    },
    changeDate(valueDict) {
      // console.log('change', this.allowStarRules)
      this.detailData = { ...this.detailData, ...valueDict };
      if (this.allowStarRules) {
        this.starRules(); // 重新计算降星
      }
    },
    changeAfterFn() {
      this.$nextTick(function () {
        if (this.clickRowFlag) {
          this.clickRowFlag = false;
          this.isChangeCurrent = false;
          return;
        }
      });
    },
    // handleOverProcessFn() {
    //   let url = "/tm/news/popFeel/back?newsId=" + this.newsIdCopy;
    //   this.$http
    //     .get(url)
    //     .then((res) => {
    //       let data = res.data;
    //       if (data.status == this.$api.SUCCESS) {
    //         this.$store.commit("DEL_TAB", this.$route.path);
    //         this.$router.push({ path: "/tbm/events/index" });
    //       } else {
    //         this.$hMessage.error({ content: data.msg });
    //       }
    //     })
    //     .catch((err) => {
    //       this.$hLoading.error();
    //     });
    // },
    // 结束流程
    handleOverProcessFn() {
      this.$store.commit("DEL_TAB", this.$route.path);
      this.$router.push({ path: "/tbm/events/index" });
    },
    changeReceiver(data) {
      this.transferData.receiverName = data.label; //获取接收人名字
      this.transferData.receiverId = data.value;
    },
    handleSaveFn() {
      this.$refs["formInlineTransfer"].validate((valid) => {
        if (valid) {
          let url = "/tm/event/taskTransfer";
          this.$http
            .post(url, {
              newsId: this.newsIdCopy,
              receiverId: this.transferData.receiverId,
              receiverName: this.transferData.receiverName,
              transferInstruction: this.transferData.transferInstruction,
            })
            .then((res) => {
              let data = res.data;
              if (data.status == this.$api.SUCCESS) {
                this.$refs["formInlineTransfer"].resetFields();
                this.modalShow = false;
                this.$hMessage.success({ content: "任务转移成功" });
                this.$emit("freshEditPage", this.currentIndex);
                setTimeout(() => {
                  this.handleNextId();
                }, 1000);
              } else {
                this.$hMessage.error({ content: data.msg });
              }
            })
            .catch((err) => {
              this.$hLoading.error();
            });
        }
      });
    },
    cancelTransfer() {
      this.modalShow = false;
      this.$refs["formInlineTransfer"].resetFields();
    },
    /*获取1,2,3,4级选中的项*/
    handleSelectConfirmFn() {
      for (let name in this.selectDataConfirmArr) {
        this.detailData[name] = ""; /**初始化详情1234级数据**/
        if (this.selectDataConfirmArr[name]) {
          this.detailData[name] = this.selectDataConfirmArr[name];
        }
      }
      /**初始化弹框数据**/
      this.showSecondList = false;
      for (let name in this.selectData) {
        this.selectData[name] = "";
        this.currentClickIndex[name] = -1;
      }
      this.modalLevelShow = false;
    },
    /*任务转移*/
    handleTransferFn() {
      this.modalShow = true;
    },

    handleDeleteEvent() {
      this.$hMsgBox.confirm({
        isOkLeft: true,
        title: "删除资讯",
        content: `确定删除该条资讯:${this.newsIdCopy}`,
        onOk: () => {
          batchDeleteEvent([this.eventNewsId])
            .then((data) => {
              // 删除资讯
              this.handleNextId();
            })
            .catch((error) => {
              this.$hMessage.error(error.content);
            });
        },
      });
    },
    handleLock(newsId, cb) {
      let url = "/tm/event/lock?newsId=" + newsId;
      this.$http
        .get(url)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            cb(true);
          } else {
            this.$hMessage.error({ content: data.msg });
            cb(false);
          }
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
    handleSaveInfo(eventSave = true) {
      this.checkPublish = false;
      this.ruleInlineData = { ...this.ruleInlineDataSave };
      setTimeout(() => {
        this.$refs["formInline"].validate((valid) => {
          if (valid) {
            let saveInfo = copyDeep(this.detailData);
            saveInfo.tags = [...this.labelListCorp, ...this.labelListSecurity];
            this.saveInfo = saveInfo;
            if (eventSave) {
              this.doSaveFn(saveInfo);
            } else {
              this.onlyLocalSave(saveInfo);
            }
          }
        });
      }, 20);
    },
    onlyLocalSave(saveInfo, isSave) {
      saveInfo.companyTags = this.labelListCorp;
      saveInfo.securityTags = this.labelListSecurity;
      if (!isSave){
        saveInfo.isDelete = 0
      }
      if (this.addClickStatus) {
        this.eventListCopy.unshift(saveInfo);
        this.currentIndex = 0;
      } else {
        if (!isSave){
          // this.$set(this.eventListCopy, this.currentIndex, saveInfo);
          this.eventListCopy.splice(this.currentIndex, 1);
          this.eventListCopy.unshift(saveInfo);
          for (let i = 0;i< this.eventListCopy.length;i++){
            if (saveInfo.id == this.eventListCopy[i].id){
              this.currentIndex = i
              break
            }
          }
          this.highLightItem(this.currentIndex);
        }else{
          this.$set(this.eventListCopy, this.currentIndex, saveInfo);
          this.highLightItem(this.currentIndex);
        }
      }
      this.detailDataCompare = copyDeep(this.detailData);
      this.detailData = copyDeep(this.detailData);
      this.detailLoading = false;
      this.detailItemTitle = "事件详情";
      this.isSaveAs = false;
      this.addClickStatus = false;
    },
    onSaveNews() {
      // warm，未完成，需要更改保存资讯流程
      // 保存资讯
      let saveInfo = { ...this.detailData };
      let id = saveInfo.id
      let filterList = this.eventListCopy.filter((item)=>{
        return item.id == id
      })
      if (filterList && filterList.length > 0){
        saveInfo.isDelete = filterList[0].isDelete
      }
      saveInfo.tags = [...this.labelListCorp, ...this.labelListSecurity];
      this.savePublishInfo = { ...saveInfo };
      this.onlyLocalSave(saveInfo, true);
      this.handleSaveInfo();
    },
    doSaveFn(saveInfo, cb = null) {
      this.detailLoading = true;
      let url = "/tm/event/saveBatch";
      // let url = "/tm/event/save";
      // if (this.isSaveAs) {
      //   this.currentIndex = 0;
      //   url = "/tm/event/copySave";
      // }
      let eventList = this.eventListCopy;
      for (let item of eventList) {
        item.tags = [...item.companyTags, ...item.securityTags];
      }
      this.$http
        .post(url, eventList)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            saveInfo.companyTags = this.labelListCorp;
            saveInfo.securityTags = this.labelListSecurity;
            if (this.addClickStatus) {
              this.eventListCopy.unshift(saveInfo);
              this.currentIndex = 0;
            } else {
              this.$set(this.eventListCopy, this.currentIndex, saveInfo);
              this.highLightItem(this.currentIndex);
            }
            this.detailDataCompare = copyDeep(this.detailData);
            this.detailLoading = false;
            this.detailItemTitle = "事件详情";
            this.$emit("freshEditPage", this.currentIndex);
            if (cb) {
              let checkUrl = `/tm/event/publish?newsId=${this.detailData.newsId}&type=1`;
              this.$http
                .get(checkUrl)
                .then((res) => {
                  let data = res.data;
                  if (data.status == this.$api.SUCCESS) {
                    cb(true);
                    // 相似校验
                  } else if (data.status == "101") {
                    this.modalCheckPublish = true;
                    this.modalCheckPublishMsg = data.msg;
                  } else {
                    this.detailLoading = false;
                    this.$hMessage.error({ content: data.msg });
                  }
                })
                .catch((error) => {
                  this.detailLoading = false;
                  this.$hMessage.error({ content: data.msg });
                });
            } else {
              this.$hMessage.success({ content: "保存成功" });
              this.isSaveAs = false;
            }
          } else {
            this.detailLoading = false;
            this.$hMessage.error({ content: data.msg });
          }
          this.addClickStatus = false;
        })
        .catch((err) => {
          this.$hLoading.error();
          this.addClickStatus = false;
        });
    },
    sureSimilarPublish(cb) {
      this.truePublish({}, cb);
    },
    goStillPublish() {
      this.truePublish({});
    },
    cancelSimilarPublish() {
      this.similarModalShow = false;
    },
    showSimilarModal() {
      let similarCompanyList = this.similarCompanyList;
      let allList = [];
      for (let similar of similarCompanyList) {
        let businessId = similar.value;
        let eventList = [];
        for (let item of this.eventListCopy) {
          let pass = false;
          let { companyTags, securityTags } = item;
          for (let i = 0; i < companyTags.length; i++) {
            let itemBusinessId = companyTags[i].businessId;
            let flag = companyTags[i].flag;
            if (itemBusinessId == businessId && flag == 9) {
              pass = true;
              break;
            }
          }
          for (let i = 0; i < securityTags.length; i++) {
            let itemBusinessId = securityTags[i].businessId;
            let flag = securityTags[i].flag;
            if (itemBusinessId == businessId && flag == 9) {
              pass = true;
              break;
            }
          }
          if (pass) {
            let {
              newsId: _newsId,
              eventThirdLevelCode,
              eventThirdLevel,
              sentimentLabel,
              sentimentLevel,
              sentimentLevelDefault,
              sentimentLabelDesc,
              sentimentLevelDesc,
            } = item;
            eventList.push({
              newsId: _newsId,
              eventThirdLevelCode: eventThirdLevelCode,
              eventThirdLevelDesc: eventThirdLevel,
              sentimentLabel: sentimentLabel,
              sentimentLevel: sentimentLevel,
              sentimentLevelDefault: sentimentLevelDefault,
              sentimentDesc: `${sentimentLabelDesc}${sentimentLevelDesc}`,
            });
          }
        }
        allList.push({
          newsId: this.newsIdCopy,
          businessId: businessId,
          similarEventInfoList: eventList,
        });
      }
      checkSimilarEvent(allList)
        .then((data) => {
          if (data.checkResult === 1) {
            let businessId = data.businessId;
            this.initBusinessId = businessId;
            this.similarAllList = allList;
            this.similarModalShow = true;
          } else {
            this.truePublish({});
          }
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
        });
    },
    // 相似校验
    judjeSimilar() {
      let currentIndex = this.currentIndex == -1 ? 0 : this.currentIndex;
      this.eventListCopy[currentIndex].companyTags = this.labelListCorp;
      this.eventListCopy[currentIndex].securityTags = this.labelListSecurity;
      //   this.similarModalShow = true;
      let idDict = {};
      let similarCompanyList = [];
      for (let item of this.eventListCopy) {
        let eventPass = false;
        let companyTags = item.companyTags;
        let securityTags = item.securityTags;
        for (let company of companyTags) {
          if (!idDict[company.businessId] && company.flag == 9) {
            company.label = company.tagName;
            company.value = company.businessId;
            similarCompanyList.push(company);
            idDict[company.businessId] = company;
          }
        }
        for (let security of securityTags) {
          if (!idDict[security.businessId] && security.flag == 9) {
            security.label = security.tagName;
            security.value = security.businessId;
            similarCompanyList.push(security);
            idDict[security.businessId] = security;
          }
        }
      }
      this.similarCompanyList = similarCompanyList;
      this.showSimilarModal();
    },
    highLightItem(currentIndex) {
      this.eventListCopy.forEach((item, index) => {
        if (index !== currentIndex) {
          this.eventListCopy[index]["_highlight"] = false;
        } else {
          this.eventListCopy[currentIndex]["_highlight"] = true;
        }
      });
    },
    handleCopyDetail() {
      if (this.addClickStatus || this.isSaveAs) {
        this.$hMessage.warning({
          content: "当前事件信息还未保存，请保存后再操作！",
        });
        return;
      }
      this.eventListCopy.forEach((item, index) => {
        item["_highlight"] = false;
        this.$set(this.eventListCopy, index, item);
      });
      this.$http
        .get("/tm/event/create?newsId=" + this.newsIdCopy)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            let eventId = data.body.eventId;
            let detailData = copyDeep(this.detailData);
            this.detailData.companyTags = copyDeep(this.labelListCorp);
            detailData.securityTags = copyDeep(this.labelListSecurity);
            detailData.newsId = this.newsId;
            detailData.id = eventId;
            this.detailData = copyDeep(detailData);
            // 另存 复制 涉及证券 指向重置
            // this.labelListSecurity = this.detailData.securityTags;
            this.labelListSecurity = copyDeep(this.detailData.securityTags);
            this.labelListCorp = copyDeep(this.detailData.companyTags);
            this.eventListCopy.unshift(copyDeep(detailData));
            this.currentIndex = 0;
            this.eventListCopy[0]["_highlight"] = true;
            this.isSaveAs = true;
            //						sessionStorage.setItem("eventDetailStorage", JSON.stringify({detailData:detailData,currentIndex:this.currentIndex}));
            //						this.$router.push({ path:'/tbm/events/saveas?newsId='+this.newsId});
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
    handleDelet() {
      if (this.eventListCopy.length == 0) {
        this.$hMessage.warning({ content: "没有要删除的事件，请先进行创建！" });
        return;
      }
      if (this.addClickStatus) {
        this.$hMessage.warning({
          content: "当前页面信息还未保存，不能进行删除操作！",
        });
        return;
      }
      if (this.isSaveAs) {
        this.eventListCopy.shift();
        this.isSaveAs = false;
        this.currentIndex = 0; //高亮第一个
        this.highLightItem(0); //高亮第一个
        this.detailData = { ...this.eventListCopy[0] };
        this.detailDataCompare = copyDeep(this.detailData);
        return;
      }
      this.clickDelStatus = true;
      this.$hMsgBox.confirm({
        isOkLeft: true,
        title: "删除事件",
        content: "确定要删除该事件？",
        onOk: () => {
          if (!this.clickDelStatus) return;

          this.$hMessage.success({ content: "删除成功" });
          this.currentIndex = 0; //高亮第一个
          this.eventListCopy.forEach((item, index) => {
            if (item.id == this.detailData.id) {
              this.eventListCopy.splice(index, 1);
            }
          });
          if (this.eventListCopy == 0) {
            this.isShowDetail = false;
          } else {
            this.detailData = { ...this.eventListCopy[0] };
            this.detailDataCompare = copyDeep(this.detailData);
            this.labelListCorp = this.detailData.companyTags
              ? [...this.detailData.companyTags]
              : [];
            this.labelListSecurity = this.detailData.securityTags
              ? [...this.detailData.securityTags]
              : [];
            this.currentIndex = 0; //高亮第一个
            this.highLightItem(0); //高亮第一个
            this.eventListCopy[0]["_highlight"] = true;
          }
          this.changeItemFlag = true;
          this.clickDelStatus = false;
          this.$hMsgBox.remove();

          // let url =
          //   "/tm/event/deletePopularFeelings?eventId=" +
          //   this.detailData.id +
          //   "&newsId=" +
          //   this.detailData.newsId;
          // this.$http
          //   .get(url)
          //   .then((res) => {
          //     let data = res.data;
          //     if (data.status == this.$api.SUCCESS) {
          //       this.$hMessage.success({ content: "删除成功" });
          //       this.currentIndex = 0; //高亮第一个
          //       this.eventListCopy.forEach((item, index) => {
          //         if (item.id == this.detailData.id) {
          //           this.eventListCopy.splice(index, 1);
          //         }
          //       });
          //       if (this.eventListCopy == 0) {
          //         this.isShowDetail = false;
          //       } else {
          //         this.detailData = { ...this.eventListCopy[0] };
          //         this.detailDataCompare = copyDeep(this.detailData);
          //         this.labelListCorp = this.detailData.companyTags
          //           ? [...this.detailData.companyTags]
          //           : [];
          //         this.labelListSecurity = this.detailData.securityTags
          //           ? [...this.detailData.securityTags]
          //           : [];
          //       }
          //       this.changeItemFlag = true;
          //       this.$emit("freshEditPage", this.currentIndex);
          //     } else {
          //       this.$hMessage.error({ content: data.msg });
          //     }
          //     this.clickDelStatus = false;
          //     this.$hMsgBox.remove();
          //   })
          //   .catch((err) => {
          //     this.$hLoading.error();
          //     this.clickDelStatus = false;
          //   });
        },
        loading: true,
      });
    },
    handleEmptyFn() {
      let eventId = this.detailData.id;
      this.detailData = {
        eventDate: "",
        eventFirstLevelCode: "",
        eventSecondLevelCode: "",
        eventThirdLevelCode: "",
        eventFourthLevelCode: "",
        srcPublishTime: "",
        //          		progress:'',
        sentimentLabel: "",
        sentimentLevel: "",
        sentimentLevelDefault: "",
        eventBasis: "",
      };
      this.$refs["formInline"].resetFields();
      this.detailData.id = eventId;
      this.detailData.newsId = this.newsIdCopy;
      this.addTags = []; //清空添加标签标记
      this.labelListCorp = copyDeep(this.labelListNews);
      this.labelListSecurity = copyDeep(this.labelListNewsSecurity);
    },
    checkReuiredItem() {
      this.eventListCopy.forEach((item, i) => {
        if (
          !item.newsId ||
          !item.id ||
          !item.eventFirstLevel ||
          !item.eventSecondLevel ||
          !item.sentimentLabel ||
          !item.sentimentLevel
        ) {
          this.$hMessage.warning({
            content: "事件(" + item.id + ")存在必填字段为空，请填写后再公开！",
          });
          return false;
        }
      });
    },
    confirmCheckFun() {
      this.judjeSimilar();
      this.modalCheckPublish = false;
      this.detailLoading = false;
    },
    cancelCheckFun() {
      this.modalCheckPublish = false;
      this.detailLoading = false;
    },
    handlePublishInfo() {
      this.checkPublish = true;
      if (this.eventListCopy.length == 0 && !this.isShowDetail) {
        this.$hMessage.warning({
          content: "没有要公开的舆情事件，请先进行创建！",
        });
        return;
      }
      this.ruleInlineData = { ...this.ruleInlineDataSave };
      setTimeout(() => {
        this.$refs["formInline"].validate((valid) => {
          if (valid) {
            let publishTip = "确定要公开该舆情资讯";
            if (this.publishTypeCopy == 1) {
              publishTip = "该舆情资讯已被公开过，确认再次公开？";
            }
            // let flag = false;
            // for (let item of this.eventListCopy) {
            //   if (item.id == this.detailData.id) {
            //     if (
            //       !this.detailData.eventFourthLevelCode ||
            //       !this.detailData.eventFourthLevelCode
            //     ) {
            //       flag = true;
            //     }
            //   } else {
            //     if (!item.eventFourthLevel && !item.eventFourthLevelCode) {
            //       flag = true;
            //     }
            //   }
            // }
            // if (flag) {
            //   publishTip = `四级分类确认是否为空，${publishTip}`;
            // }
            this.$hMsgBox.confirm({
              isOkLeft: true,
              title: "公开",
              content: publishTip,
              onOk: () => {
                let saveInfo = { ...this.detailData };
                saveInfo.tags = [
                  ...this.labelListCorp,
                  ...this.labelListSecurity,
                ];

                let id = saveInfo.id
                let filterList = this.eventListCopy.filter((item)=>{
                  return item.id == id
                })
                if (filterList && filterList.length > 0){
                  saveInfo.isDelete = filterList[0].isDelete
                }
                this.savePublishInfo = { ...saveInfo };
                this.onlyLocalSave(saveInfo, true);
                this.doPublish(saveInfo);
              },
            });
          }
        });
      }, 20);
    },
    doPublish(saveInfo) {
      this.doSaveFn(saveInfo, (res) => {
        if (res) {
          this.judjeSimilar();
        }
      });
    },
    truePublish(saveInfo = {}, cb = null) {
      let workflowFlag = 2;
      if (this.isProcess) {
        workflowFlag = 1;
      }
      let newsId = saveInfo.newsId || this.detailData.newsId;
      let url =
        "/tm/event/publish?newsId=" + newsId + "&workflowFlag=" + workflowFlag;
      this.$http
        .get(url)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            this.detailItemTitle = "事件详情";
            this.$hMessage.success({ content: "公开成功" });
            if (cb) {
              cb();
              return;
            }
            this.similarModalShow = false;
            this.$emit("freshEditPage", this.currentIndex);
            this.publishTypeCopy = 1;
            setTimeout(() => {
              this.handleNextId();
            }, 1000);
          } else {
            this.$hMessage.error({ content: data.msg });
          }
          this.addClickStatus = false;
          this.isSaveAs = false;
        })
        .catch((err) => {
          this.addClickStatus = false;
          this.isSaveAs = false;
          this.$hLoading.error();
        });
    },
    handlePreIdView() {
      let currentIndex = this.newsIdLists.indexOf(this.newsIdCopy);
      if (currentIndex == 0 || currentIndex == -1) {
        this.$hMessage.warning({ content: "没有上一条了!" });
      } else if (currentIndex != -1) {
        let nextNewsId = this.newsIdLists[currentIndex - 1];
        this.newsIdCopy = nextNewsId;
        this.$emit("onhandlePreNewsId", {
          newsId: this.newsIdCopy,
          ref: this.$md5(`${nextNewsId}TBM-COMPOSE`),
        });
      }
    },
    handleNextIdByButton() {
      this.handleNextId();
      // if (this.publishType == 1 && this.eventPageType == "HANDLE") {
      //   if (
      //     this.$md5(JSON.stringify(this.detailData)) !==
      //       this.$md5(JSON.stringify(this.detailDataCompare)) &&
      //     this.eventPageType != "VIEW"
      //   ) {
      //     this.$hMsgBox.confirm({
      //       title: "温馨提示",
      //       content: "已公开过资讯再次编辑只能公开，退出后修改内容不会被保存",
      //       onOk: () => {
      //         this.handleNextId();
      //       },
      //     });
      //   } else {
      //     this.handleNextId();
      //   }
      // } else {
      //   this.handleNextId();
      // }
    },
    handleNextId() {
      let noticeFlag = this.$route.query.noticeFlag || null;
      if (noticeFlag) {
        this.newsIdLists = [this.newsIdCopy]; //消息通知跳转页面不存在下一条
      }
      let url = "/tm/news/popFeel/getNext";
      let body = {
        ids: this.newsIdLists,
        newsId: this.newsIdCopy,
        lock: this.eventPageType == "HANDLE" ? true : false, //查看页跳转不加锁
      };
      let searchDataObj =
        JSON.parse(sessionStorage.getItem("searchDataEvents")) || null; //获取列表页缓存查询条件
      if (this.isProcess) {
        url = "/tm/news/popFeel/getNextNewsId";
        body = { ...searchDataObj };
      } else {
        body["handleStatus"] = searchDataObj.handleStatus || "";
      }
      let preNewsId = this.newsIdCopy;
      this.$http
        .post(url, body)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            this.newsIdLists = data.body.ids || [];
            let nextNewsId = data.body.newsId || "";
            let ref = data.body.ref;
            this.newsIdCopy = nextNewsId;
            if (nextNewsId) {
              if (this.eventPageType == "HANDLE") {
                if (this.isProcess) {
                  this.handleLock(nextNewsId, (res) => {
                    if (res) {
                      this.$emit("onhandleNextNewsId", {
                        newsId: nextNewsId,
                        preNewsId: preNewsId,
                        ref: ref,
                      });
                    }
                  });
                } else {
                  this.$emit("onhandleNextNewsId", {
                    newsId: nextNewsId,
                    preNewsId: preNewsId,
                    ref: ref,
                  });
                }
              } else {
                this.$emit("onhandleNextNewsId", {
                  newsId: this.newsIdCopy,
                  ref: ref,
                });
              }
            }
          } else {
            this.$hMessage.error({ content: data.msg });
            //this.getNewsDetail(this.newsIdCopy);//没有下一条,更新当前页信息
          }
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
    handleNextIdView() {
      let preNewsId = this.newsIdCopy;
      let currentIndex = this.newsIdLists.indexOf(this.newsIdCopy);
      let len = this.newsIdLists.length;
      if (currentIndex >= len - 1 || currentIndex == -1) {
        this.$hMessage.warning({ content: "没有下一条了!" });
      } else if (currentIndex != -1) {
        let nextNewsId = this.newsIdLists[currentIndex + 1];
        if (nextNewsId) {
          this.newsIdCopy = nextNewsId;
          if (this.eventPageType == "VIEW") {
            this.$emit("onhandleNextNewsId", {
              newsId: this.newsIdCopy,
              ref: this.$md5(`${nextNewsId}TBM-COMPOSE`),
            });
          } else {
            this.$emit("onhandleNextNewsId", {
              newsId: this.newsIdCopy,
              preNewsId: preNewsId,
              ref: this.$md5(`${nextNewsId}TBM-COMPOSE`),
            });
            // this.handleLock(nextNewsId,(res)=>{
            // 	if(res){
            // 		this.$emit('onhandleNextNewsId',{newsId:this.newsIdCopy,preNewsId:preNewsId});
            // 	}
            // });
          }
        }
      }
    },
    getViewDetaiItemName(detailData) {
      this.detailData.eventFirstLevelCode = detailData.eventFirstLevel;
      this.detailData.eventSecondLevelCode = detailData.eventSecondLevel;
      this.detailData.eventThirdLevelCode = detailData.eventThirdLevel;
      this.detailData.eventFourthLevelCode = detailData.eventFourthLevel;
      //				this.detailData.progress= detailData.progressDesc;
      this.detailData.sentimentLabel = detailData.sentimentLabelDesc;
      this.detailData.sentimentLevel = this.detailData.sentimentLevelDesc;
      this.detailData.sentimentLevelDefault = this.detailData.sentimentLevelDefaultDesc;
    },
    handleNewAdd() {
      if (this.addClickStatus || this.isSaveAs) {
        this.$hMessage.warning({
          content: "当前另存为事件信息还未保存，请保存后再进行新建！",
        });
        return;
      }
      this.detailItemTitle = "新建事件";
      this.isShowDetail = true;
      this.addClickStatus = true;
      this.ruleInlineData = {};
      this.eventListCopy.forEach((item, index) => {
        item["_highlight"] = false;
        this.$set(this.eventListCopy, index, item);
      });
      let {
        eventFourthLevelCode,
        eventThirdLevelCode,
        eventSecondLevelCode,
      } = this.detailData;
      this.$http
        .get("/tm/event/create?newsId=" + this.newsIdCopy)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            let newsId = this.detailData.newsId;
            this.detailData = {
              newsId: newsId,
              id: data.body.eventId || "",
              eventDate: "",
              eventFirstLevelCode: "",
              eventSecondLevelCode: "",
              eventThirdLevelCode: "",
              eventFourthLevelCode: "",
              srcPublishTime: "",
              sentimentLabel: "",
              sentimentLevel: "",
              sentimentLevelDefault: "",
              eventBasis: "",
              eventTimeText: "",
              eventDateText: "",
              eventDateType: "4",
              isDelete: 0,
            };
            this.addTags = []; //清空添加标签标记
            this.currentIndex = -1;
            this.$refs["formInline"].resetFields();
            this.ruleInlineData = copyDeep(this.ruleInlineDataSave);
            this.labelListCorp = copyDeep(data.body.companyTags);
            this.labelListSecurity = copyDeep(data.body.securityTags);
            if (!eventFourthLevelCode) {
              this.changeQueryFnFourth("");
            }
            if (!eventThirdLevelCode) {
              this.changeQueryFnThree("");
            }
            if (!eventSecondLevelCode) {
              this.changeQueryFnSecond("");
            }
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
    // 选择类别一级
    onSelectLevelChangeFirst(levelcode) {
      this.selectData["1"] = levelcode;
      this.selectDataConfirmArr.eventFirstLevelCode = levelcode;
      if (!levelcode) {
        this.currentClickIndex["2"] = -1;
        this.selectData["2"] = "";
        return;
      }
      if (!this.selectData["2"]) {
        this.currentClickIndex["3"] = -1;
        this.selectData["3"] = "";
      }
      if (!this.selectData["3"]) {
        this.currentClickIndex["4"] = -1;
        this.selectData["4"] = "";
      }
      this.allLevelList.forEach((item, index) => {
        if (item.value == levelcode) {
          this.showSecondList = true;
          this.highLightCurrentItem(
            "allLevelList",
            "eventTypeListSecondTemp",
            "1",
            levelcode
          );
        }
      });
    },
    onSelectLevelChangeSecond(levelcode) {
      this.selectData["2"] = levelcode;
      this.selectDataConfirmArr.eventSecondLevelCode = levelcode;
      if (!levelcode) {
        this.currentClickIndex["3"] = -1;
        this.selectData["3"] = "";
        return;
      }
      if (!this.selectData["3"]) {
        this.currentClickIndex["4"] = -1;
        this.selectData["4"] = "";
      }
      //   this.setLevelDesc('2', levelcode)
      this.getParentLevelCodeModel("2", levelcode, () => {
        setTimeout(() => {
          this.highLightCurrentItem(
            "eventTypeListSecondTemp",
            "eventTypeListThreeTemp",
            "2",
            levelcode
          );
        }, 0);
      });
    },
    onSelectLevelChangeThree(levelcode) {
      this.selectData["3"] = levelcode;
      this.selectDataConfirmArr.eventThirdLevelCode = levelcode;
      if (!levelcode) {
        this.currentClickIndex["4"] = -1;
        this.selectData["4"] = "";
        return;
      }
      //   this.setLevelDesc('3', levelcode)
      this.getParentLevelCodeModel("3", levelcode, () => {
        setTimeout(() => {
          this.highLightCurrentItem(
            "eventTypeListThreeTemp",
            "eventTypeListFourthTemp",
            "3",
            levelcode
          );
        }, 0);
      });
    },
    onSelectLevelChangeFourth(levelcode) {
      this.selectData["4"] = levelcode;
      this.selectDataConfirmArr.eventFourthLevelCode = levelcode;
      if (!levelcode) return;
      //   this.setLevelDesc('4', levelcode)
      this.getParentLevelCodeModel("4", levelcode, () => {
        setTimeout(() => {
          this.highLightCurrentItem(
            "eventTypeListFourthTemp",
            "",
            "4",
            levelcode
          );
        }, 0);
      });
    },
    // 设置描述
    setLevelDesc() {
      let selectData = this.selectData;
      let length = 0;
      for (let key in selectData) {
        if (selectData[key] != "") {
          length += 1;
        }
      }
      let levelCode = selectData[length.toString()];
      let timer = this.timer;
      if (timer) {
        clearTimeout(timer);
      }
      this.timer = setTimeout(() => {
        let itemList = [];
        switch (length) {
          case 1:
            itemList = this.eventTypeListFirstTemp;
            break;
          case 2:
            itemList = this.eventTypeListSecondTemp;
            break;
          case 3:
            itemList = this.eventTypeListThreeTemp;
            break;
          case 4:
            itemList = this.eventTypeListFourthTemp;
            break;
          default:
            break;
        }
        let _categoryName = "";
        for (let index = 0; index < itemList.length; index++) {
          let item = itemList[index];
          let { categoryCode, categoryName } = item;
          if (categoryCode == levelCode) {
            _categoryName = categoryName;
            break;
          }
        }
        this.getEventDesc(levelCode, _categoryName);
      }, 200);
    },
    getParentLevelCodeModel(level, code, callback) {
      /**根据level code 反推所有上级code**/
      let url =
        "/tm/event/category/getParent?categoryCode=" + code + "&level=" + level;
      this.$http
        .get(url)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            let categoryList = data.body.categoryList || [];
            categoryList.forEach((item, index) => {
              let categoryLevel = item.categoryLevel
                ? item.categoryLevel.toString()
                : "";
              let { categoryName } = item;
              if (categoryLevel == level) {
                switch (level) {
                  case "4":
                    this.selectData["3"] = item.tertiaryLevel || "";
                    this.selectData["2"] = item.secondaryLevel || "";
                    this.selectData["1"] = item.firstLevel || "";
                    break;
                  case "3":
                    this.selectData["2"] = item.secondaryLevel || "";
                    this.selectData["1"] = item.firstLevel || "";
                    break;
                  case "2":
                    this.selectData["1"] = item.firstLevel || "";
                    break;
                }
              }
            });
            if (callback) {
              callback();
            }
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
    // 日期格式化
    dateFormat(fmt, date) {
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString(), // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
          );
        }
      }
      return fmt;
    },
    /**
     * 降星规则
     * 1.【事件日期类型】=将来事件 或 历史事件统一降一星
     * 2.【事件日期】为一个月以前的降两星（统一按信息发布日期-30天计算对比,资讯信息发布日期-30天>事件日期）
     * 如果已经是0星则不需要降，非0星的降到0星为止，降一星的情况：3-》2；2-》1；1-》0；降两星的情况：3-》1；2-》0；1-》0
     * 选择 类别四级  事件日期 事件日期类型
     */
    starRules() {
      // console.log('重新计算降星规则')
      let {
        sentimentLevelDefault,
        eventDateType,
        eventTimeText,
      } = this.detailData;
      if (sentimentLevelDefault === "") return;
      sentimentLevelDefault =
        (sentimentLevelDefault && Number(sentimentLevelDefault)) || 0;
      if (sentimentLevelDefault === 0) {
        this.detailData["sentimentLevel"] = String(sentimentLevelDefault);
        this.changeFeelingLevelList("sentimentLevel");
        return;
      }
      eventDateType = String(eventDateType);
      if (eventTimeText) {
        if (typeof eventTimeText === "object") {
          eventTimeText = this.dateFormat(
            "yyyy-MM-dd",
            new Date(eventTimeText)
          );
        }
        eventTimeText = new Date((eventTimeText += " 00:00:00")).getTime();
        let srcPublishDate = this.commonFilters["srcPublishDate"];
        srcPublishDate = srcPublishDate && new Date(srcPublishDate).getTime();
        if (srcPublishDate - 1000 * 3600 * 24 * 30 > eventTimeText) {
          sentimentLevelDefault =
            sentimentLevelDefault === 1 ? 0 : sentimentLevelDefault - 2;
        } else {
          if (eventDateType && "1/3".includes(eventDateType)) {
            sentimentLevelDefault--;
          }
        }
      } else {
        if (eventDateType && "1/3".includes(eventDateType)) {
          sentimentLevelDefault--;
        }
      }
      this.detailData["sentimentLevel"] = String(sentimentLevelDefault);
      this.changeFeelingLevelList("sentimentLevel");
    },
    // 事件详情类别 切换时联动 获取父级
    getParentLevelCode(level, code) {
      /**根据level code 反推所有上级code**/
      let url =
        "/tm/event/category/getParent?categoryCode=" + code + "&level=" + level;
      this.$http
        .get(url)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            let categoryList = data.body.categoryList || [];
            categoryList.forEach((item, index) => {
              let categoryLevel = item.categoryLevel
                ? item.categoryLevel.toString()
                : "";
              if (categoryLevel == level) {
                switch (level) {
                  case "4":
                    this.detailData.eventThirdLevelCode =
                      item.tertiaryLevel || "";
                    this.detailData.eventSecondLevelCode =
                      item.secondaryLevel || "";
                    this.detailData.eventFirstLevelCode = item.firstLevel || "";
                    if (!this.changeItemFlag && this.changeFourthFlag) {
                      /**切换事件不触发更新级别和方向、不切换只改变四级 触发改变**/
                      this.changeFourthFlag = false;
                      this.detailData["sentimentLevel"] =
                        item.sentimentLevel || "";
                      this.detailData["sentimentLevelDefault"] =
                        item.sentimentLevelDefault || "";
                      this.detailData["sentimentLevelDesc"] =
                        item.sentimentLevelDesc || "";
                      this.detailData["sentimentLevelDefaultDesc"] =
                        item.sentimentLevelDefaultDesc || "";
                      this.detailData["sentimentLabel"] =
                        item.sentimentLabel || "";
                      this.detailData["sentimentLabelDesc"] =
                        item.sentimentLabelDesc || "";
                      this.starRules(); // 情感级别计算降星
                    }
                    this.changeItemFlag = false;
                    break;
                  case "3":
                    this.detailData.eventSecondLevelCode = item.secondaryLevel;
                    this.detailData.eventFirstLevelCode = item.firstLevel || "";
                    break;
                  case "2":
                    this.detailData.eventFirstLevelCode = item.firstLevel;
                    break;
                }
              }
            });
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
    getParentIndex(pArr, plevel, plevelCode) {
      /**获取上级index**/
      pArr.forEach((item, i) => {
        if (item.value == plevelCode) {
          this.currentClickIndex[plevel] = i; //匹配父级并高亮
        }
      });
    },
    highLightCurrentItem(parentList, nextList, level, levelcode) {
      if (parentList) {
        this[parentList].forEach((item, i) => {
          if (item.categoryLevel == level && item.value == levelcode) {
            this.currentClickIndex[level] = i; //点亮自己
            if (
              nextList &&
              item.nextCategoryList &&
              item.nextCategoryList.length > 0
            ) {
              this[nextList] = copyDeep(item.nextCategoryList);
            }
          }
        });
      }
      let flag = {};
      switch (level) {
        case "1":
          flag[level] = false;
          this[nextList].forEach((item, index) => {
            if (this.selectData["2"] == item.value) {
              this.currentClickIndex["2"] = index; //点亮下一级
              this.selectDataConfirmArr.eventFirstLevelCode =
                item.firstLevel || "";
              flag[level] = true;
            }
          });
          if (!flag[level]) {
            this.currentClickIndex["2"] = -1;
            this.selectData["2"] = "";
          }
          this.eventTypeListThreeTemp = this.getAllNextCategoryList(
            this[nextList]
          );
          this.eventTypeListFourthTemp = this.getAllNextCategoryList(
            this.eventTypeListThreeTemp
          );
          break;
        case "2":
          flag[level] = false;
          this[nextList].forEach((item, index) => {
            if (this.selectData["3"] == item.value) {
              this.currentClickIndex["3"] = index; //点亮下一级
              this.selectDataConfirmArr.eventFirstLevelCode =
                item.firstLevel || "";
              this.selectDataConfirmArr.eventSecondLevelCode =
                item.secondaryLevel || "";
              this.selectDataConfirmArr.eventThirdLevelCode =
                item.tertiaryLevel || "";
              flag[level] = true;
            }
          });
          if (!flag[level]) {
            this.currentClickIndex["3"] = -1;
            this.selectData["3"] = "";
          }
          this.eventTypeListFourthTemp = this.getAllNextCategoryList(
            this[nextList]
          );
          break;
        case "3":
          flag[level] = false;
          this[nextList].forEach((item, index) => {
            if (this.selectData["4"] == item.value) {
              this.currentClickIndex["4"] = index; //点亮下一级
              this.selectDataConfirmArr = {
                eventFirstLevelCode: item.firstLevel || "",
                eventSecondLevelCode: item.secondaryLevel || "",
                eventThirdLevelCode: item.tertiaryLevel || "",
                eventFourthLevelCode: item.fourLevel,
                sentimentLabel: item.sentimentLabel || "",
                sentimentLevel: item.sentimentLevel || "",
                sentimentLevelDefault: item.sentimentLevelDefault || "",
              };
              flag[level] = true;
            }
          });
          if (!flag[level]) {
            this.currentClickIndex["4"] = -1;
            this.selectData["4"] = "";
          }
          break;
        case "4":
          break;
      }
      this.setLevelDesc();
    },
    changeLevelClick(parentList, nextList, levelType, index, item) {
      if (this.currentClickIndex[levelType] == index) return;
      let { categoryName, categoryCode } = item;
      // this.eventDesc = categoryName
      // this.eventDescTitle = categoryName
      this.getEventDesc(categoryCode, categoryName);
      this.currentClickIndex[levelType] = index;
      let levelCode = parentList ? this[parentList][index].value : "";
      if (parentList) {
        this[parentList].forEach((item, i) => {
          if (item.categoryLevel == levelType && item.value == levelCode) {
            this.showSecondList = true;
            if (
              nextList &&
              item.nextCategoryList &&
              item.nextCategoryList.length > 0
            ) {
              this[nextList] = copyDeep(item.nextCategoryList);
            }
          }
        });
      }
      /*清空下级所有选中项*/

      switch (levelType) {
        case "1":
          this.currentClickIndex["2"] = -1;
          this.currentClickIndex["3"] = -1;
          this.currentClickIndex["4"] = -1;
          this.selectData["1"] = "";
          this.selectData["2"] = "";
          this.selectData["3"] = "";
          this.selectData["4"] = "";
          this.eventTypeListThreeTemp = this.getAllNextCategoryList(
            this[nextList]
          );
          this.eventTypeListFourthTemp = this.getAllNextCategoryList(
            this.eventTypeListThreeTemp
          );
          this.selectDataConfirmArr = {
            eventFirstLevelCode: levelCode,
          };
          break;
        case "2":
          this.currentClickIndex["3"] = -1;
          this.currentClickIndex["4"] = -1;
          this.selectData["2"] = "";
          this.selectData["3"] = "";
          this.selectData["4"] = "";
          this.currentClickIndex["2"] = index;
          this.eventTypeListFourthTemp = this.getAllNextCategoryList(
            this[nextList]
          );
          let item2 = this.eventTypeListSecondTemp[index];
          this.getParentIndex(
            this.eventTypeListFirstTemp,
            "1",
            item2.firstLevel
          );
          this.selectDataConfirmArr = {
            eventFirstLevelCode: item2.firstLevel,
            eventSecondLevelCode: levelCode,
          };
          break;
        case "3":
          this.currentClickIndex["4"] = -1;
          this.selectData["3"] = "";
          this.selectData["4"] = "";

          let item3 = this.eventTypeListThreeTemp[index];
          this.getParentIndex(
            this.eventTypeListSecondTemp,
            "2",
            item3.secondaryLevel
          );
          this.getParentIndex(
            this.eventTypeListFirstTemp,
            "1",
            item3.firstLevel
          );
          this.selectDataConfirmArr = {
            eventFirstLevelCode: item3.firstLevel,
            eventSecondLevelCode: item3.secondaryLevel,
            eventThirdLevelCode: levelCode,
          };
          break;
        case "4":
          this.selectData["4"] = "";
          let item4 = this.eventTypeListFourthTemp[index];
          let sentimentLabel = item4.sentimentLabel;
          let sentimentLevel = item4.sentimentLevel;
          this.getParentIndex(
            this.eventTypeListThreeTemp,
            "3",
            item4.tertiaryLevel
          );
          this.getParentIndex(
            this.eventTypeListSecondTemp,
            "2",
            item4.secondaryLevel
          );
          this.getParentIndex(this.eventTypeListFirst, "1", item4.firstLevel);
          this.selectDataConfirmArr = {
            eventFirstLevelCode: item4.firstLevel,
            eventSecondLevelCode: item4.secondaryLevel,
            eventThirdLevelCode: item4.tertiaryLevel,
            eventFourthLevelCode: levelCode,
            sentimentLabel: item4.sentimentLabel,
            sentimentLevelDefault: item4.sentimentLevelDefault,
            sentimentLevel: item4.sentimentLevel,
          };
          break;
      }
    },
    getAllNextCategoryList(parentArr) {
      let allNextArr = [];
      parentArr.forEach((item, i) => {
        allNextArr = allNextArr.concat(copyDeep(item.nextCategoryList));
      });
      return allNextArr;
    },
    getEventTreeList() {
      /***获取所有级别树*/
      this.$http
        .get("/tm/event/treeList")
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            let listArr = data.body.eventCategoryTree || [];
            new Promise((resolve, reject) => {
              this.allLevelList = this.typeTreeForEach(listArr);
              resolve(this.allLevelList);
            }).then((res) => {
              if (res.length > 0) {
                this.eventTypeListFirst = copyDeep(this.allLevelList);
                this.eventTypeListFirstSelect = copyDeep(
                  this.eventTypeListFirst
                );
                this.eventTypeListFirstTemp = copyDeep(this.eventTypeListFirst);
                /**如果对应级别有值，加载对应下一级列表**/
                this.getNextChildrenAll();
              }
            });
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
    getEventTypeList(listType, level, code) {
      let _list = this[listType];
      if (_list.length > 0) {
        // 如果有数据，就不请求
        return;
      }
      /***获取指定级别所有选项*/
      this.$http
        .get(
          "/tm/event/getEventCategory?level=" + level + "&categoryCode=" + code
        )
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            let listArr = data.body.categoryList || [];
            const newlist = listArr.map((item) => {
              let nextCategoryList = this.allLevelListObj[item.categoryCode]
                ? this.allLevelListObj[item.categoryCode].nextCategoryList
                : [];
              return {
                value: item.categoryCode,
                label: item.categoryName,
                nextCategoryList: nextCategoryList,
              };
            });

            this[listType] = [...newlist];
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
    typeTreeForEach(list) {
      let treeList = [];
      list.forEach((item, i) => {
        let nextCategoryList = [];
        if (item.nextCategoryList && item.nextCategoryList.length > 0) {
          nextCategoryList = this.typeTreeForEach(item.nextCategoryList);
        }
        let obj = {
          categoryCode: item.categoryCode,
          categoryName: item.categoryName,
          value: item.categoryCode,
          label: item.categoryName,
          categoryLevel: item.categoryLevel,
          sentimentLabel: item.sentimentLabel,
          sentimentLevelDefault: item.sentimentLevelDefault,
          sentimentLevel: item.sentimentLevel,
          nextCategoryList: nextCategoryList || [],
          firstLevel: item.firstLevel,
          secondaryLevel: item.secondaryLevel,
          tertiaryLevel: item.tertiaryLevel,
          fourLevel: item.fourLevel,
        };

        treeList.push(obj);
        this.allLevelListObj[item.categoryCode] = obj;
        /*if(item.categoryCode == 'FBT000000036'){

						let objelse = [copyDeep(obj)];
						objelse[0].nextCategoryList = copyDeep(obj);
						objelse[0].nextCategoryList = [];
						objelse[0].nextCategoryList[0] = copyDeep(obj);
						objelse[0].nextCategoryList[0].nextCategoryList = [];
						objelse[0].nextCategoryList[0].nextCategoryList[0] = copyDeep(obj);
						this.allLevelListObj[item.categoryCode].nextCategoryList = objelse;
					}*/
      });
      return treeList;
    },
    getNextChildrenAll() {
      if (this.detailData.eventFirstLevelCode) {
        this.getNextChildrenList(
          this.allLevelList,
          this.eventTypeListSecond,
          this.detailData.eventFirstLevelCode
        ).then((res) => {
          this.eventTypeListSecond = copyDeep(res);
          if (this.detailData.eventSecondLevelCode) {
            this.getNextChildrenList(
              res,
              this.eventTypeListThree,
              this.detailData.eventSecondLevelCode
            ).then((res) => {
              this.eventTypeListThree = copyDeep(res);
              if (this.detailData.eventThirdLevelCode) {
                this.getNextChildrenList(
                  res,
                  this.eventTypeListFourth,
                  this.detailData.eventThirdLevelCode
                ).then((res) => {
                  this.eventTypeListFourth = copyDeep(res);
                });
              } else {
                this.getEventTypeList("eventTypeListFourth", "4", "");
              }
            });
          } else {
            this.getEventTypeList("eventTypeListThree", "3", "");
          }
        });
      } else {
        this.getEventTypeList("eventTypeListSecond", "2", "");
        this.getEventTypeList("eventTypeListThree", "3", "");
        this.getEventTypeList("eventTypeListFourth", "4", "");
      }
    },
    getNextChildrenList(parentArr, childArr, code) {
      return new Promise((resolve, reject) => {
        parentArr.forEach((item, index) => {
          if (item.value == code) {
            childArr = copyDeep(item.nextCategoryList);
          }
        });
        resolve(childArr);
      });
    },
    getSelectOption(listType, dictCode) {
      let url = "/tm/tbmDictList?dictCode=" + dictCode;
      this.$http
        .get(url)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            this[listType] = data.body.tbmDictList || [];
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
    getHandleUser() {
      let url = "/tm/event/handleUserList";
      this.$http
        .get(url)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            this.transferManList = data.body.userList || [];
            this.transferManList.forEach((item, index) => {
              item.id = item.id.toString();
            });
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
    getPreNextIds() {
      let searchDataObj =
        JSON.parse(sessionStorage.getItem("searchDataEvents")) || null; //获取列表页缓存查询条件
      if (!searchDataObj) return;
      let url = "/tm/news/popFeel/getNewsIdList";
      this.$http
        .post(url, { ...searchDataObj })
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            this.newsIdLists = data.body.newsIdList || [];
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
    getEventDesc(code, categoryName) {
      // this.$http.get(`/tm/getEventDesc?code=FBT0000000BV`).then(
      // 	res => {
      // 		let data = res.data;
      // 		if (data.status == this.$api.SUCCESS) {
      // 			this.eventDesc = data.body.eventDesc
      // 		} else {
      // 			this.$hMessage.error({ content: data.msg })
      // 		}
      // 	}
      // ).catch(err => {
      // 	this.$hLoading.error();
      // })
      this.eventDescTitle = `【${categoryName}】说明：`;
      this.$http
        .get(`/tm/getEventDesc?code=${code}`)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            this.eventDesc = data.body.eventDesc;
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
    handleKeyCodeFnEvent(e) {
      var keyCode = e.keyCode || e.which || e.charCode;
      var ctrlKey = e.ctrlKey || e.metaKey;
      if (ctrlKey && keyCode == 83 && this.eventPageType == "HANDLE") {
        this.handleSaveInfo(false); //ctrl + s 保存
        e.preventDefault();
      }
      if (ctrlKey && keyCode == 68 && this.eventPageType == "VIEW") {
        this.handlePreIdView(); //ctrl + d 上一条
        e.preventDefault();
      }
      if (ctrlKey && keyCode == 70 && this.eventPageType == "VIEW") {
        this.handleNextIdView(); //ctrl + f 下一条
        e.preventDefault();
      }
      if (keyCode == 13) {
        //enter
      }

      return false;
    },
    initOperateState() {
      this.addClickStatus = false; //新增状态
      this.currentIndex = 0;
      this.isSaveAs = false; //另存为状态
      this.addTags = []; //清空添加标签标记
      this.getEventTreeList(); //获取一级类别
    },
    init() {
      this.labelListCorp = [...this.labelList];
      this.labelListSecurity = [...this.secuTags];
      this.eventListCopy = [...this.eventList];
      this.newsIdCopy = this.newsId;
      this.detailData = { ...this.eventList[0] } || {};
      this.getSelectOption("feelingLevelList", 1116);
      this.$store.dispatch("getEmotionList", "emotionList");
      this.getHandleUser();
      this.getPreNextIds();
    },
    validateDateType(rule, value, callback) {
      if (value === "") {
        callback(new Error("请选择日期类型"));
      } else {
      }
    },
    // 设置关闭页面弹窗
    setMsgContent(show) {
      let _this = this;
      let obj = {
        url: this.$route.path,
        show: show,
        msg: "已公开过资讯再次编辑只能公开，退出后修改内容不会被保存",
        fn: () => {},
      };
      this.$store.commit("SET_TAB_MSG", obj);
    },
    checkBoxClick(e){
      e.stopPropagation()
    },
    //  <input type='checkbox'  checked={row.isDelete == 1? false: true} on-change={this.eventRowCheck.bind(this, index)}/>
    eventRowCheck(index, value) {
      let eventList = copyDeep(this.eventListCopy);
      let id = eventList[this.currentIndex].id;
      let eventItem = copyDeep(eventList[index]);
      eventItem.isDelete = value ? 0 : 1;
      if (value) {
        eventList.splice(index, 1);
        eventList.unshift(eventItem);
      } else {
        eventList.splice(index, 1, eventItem);
        let checkList = eventList.filter( (item, index) => {
          return item.isDelete == 0
        })
        let unCheckList = eventList.filter( (item, index) => {
          return item.isDelete == 1
        })
        eventList = [...checkList, ...unCheckList]
      }
      this.eventListCopy = []
      this.$nextTick(()=>{
        this.eventListCopy = eventList;
      })
      for (let i = 0;i< eventList.length;i++){
        if (id == eventList[i].id){
          this.currentIndex = i
          break
        }
      }
    },
  },
  watch: {
    detailData: {
      handler(obj, oldObj) {
        if (this.publishType == 1 && this.eventPageType == "HANDLE") {
          if (
            this.$md5(JSON.stringify(obj)) ==
            this.$md5(JSON.stringify(this.detailDataCompare))
          ) {
            this.setMsgContent(false);
          } else {
            this.setMsgContent(true);
          }
        } else {
          this.setMsgContent(false);
        }
      },
      deep: true,
    },
    newsId(newValue) {
      this.newsIdCopy = newValue;
    },
    eventNewsId(newValue) {
      this.eventNewsIdCopy = newValue;
    },
    labelList(newArr) {
      if (newArr) {
        this.labelListCorp = [...newArr];
      }
    },
    secuTags(newArr) {
      if (newArr) {
        this.labelListSecurity = [...newArr];
      }
    },
    publishType(newValue) {
      this.publishTypeCopy = newValue;
    },
    eventList(arr) {
      this.allowStarRules = false;
      setTimeout(() => {
        this.allowStarRules = true;
      }, 1000);
      let newArr = copyDeep(arr);
      let btnPower = this.$store.state.routersButton["TbmEventsIndex"];
      if (btnPower.indexOf("event_delBtn") != -1) {
        this.showDeleteBtn = true;
      } else {
        this.showDeleteBtn = false;
      }
      if (newArr && newArr.length > 0) {
        this.eventListCopy = [...newArr];
        // this.detailData = {...newArr[0]} || {};
        let detailData = { ...newArr[0] } || {};
        if (!detailData.eventFourthLevel || !detailData.eventFourthLevelCode) {
          detailData.eventFourthLevel = "";
          detailData.eventFourthLevelCode = "";
        }
        // if (!detailData.eventDateText){
        // 	detailData.eventDateText = ''
        // }
        // if (!detailData.eventTimeText){
        // 	detailData.eventTimeText = ''
        // }
        if (this.eventPageType != "VIEW") {
          this.initOperateState(); //重置初始状态
          this.detailDataCompare = copyDeep(detailData); //切换事件列表，用来比较是否修改
        }
        this.detailData = detailData;
        this.isShowDetail = true;
        if (this.eventPageType == "VIEW") {
          this.getViewDetaiItemName(detailData);
        }
      } else {
        this.eventListCopy = [];
        this.detailData = {
          newsId: this.newsIdCopy,
        };
        this.isShowDetail = false;
        if (this.eventPageType != "VIEW") {
          this.initOperateState();
          this.detailDataCompare = {};
        }
      }
    },
  },
  computed: {
    ...mapState(["emotionList"]),
    isTimeOut() {
      if (this.eventPageType == "HANDLE") {
        return this.overplusSecs == 0;
      } else {
        return false;
      }
    },
    leftTime() {
      let second = this.overplusSecs % 60;
      let mins = Math.floor(this.overplusSecs / 60);
      if (second < 10) {
        second = `0${second}`;
      }
      return `${mins}:${second}`;
    },
  },
  mounted() {
    this.init();
    window.focus();
    document.addEventListener("keydown", this.handleKeyCodeFnEvent);
    this.$nextTick(() => {
      setTimeout(() => {
        this.firstLoading = false;
      }, 1000);
    });
  },
  destroyed() {
    document
      .querySelectorAll("#scroll")[0]
      .removeEventListener("scroll", this.handleScroll); //离开页面清除（移除）滚轮滚动事件
    document.removeEventListener("keydown", this.handleKeyCodeFnEvent);
  },
  activated: function () {
    // this.allowStarRules = false;
    // setTimeout(() => {
    //   this.allowStarRules = true;
    // }, 1000)
    this.getPreNextIds(); //获取下一条id
    this.addClickStatus = false;
    this.isSaveAs = false;
    this.currentIndex = 0;
  },
};
</script>
<style>
.searchBoxEventBox .search-form-item {
  display: inline-block;
  width: 49%;
  margin-bottom: 5px !important;
}
.searchBoxEventBox .selectItem .h-select {
  width: 100% !important;
}
.searchBoxEventBox .search-form-item .h-select {
  width: 100% !important;
}
.searchBoxEventBox .search-form-item .h-input,
.searchBoxEventBox .search-form-item .h-selectTable-input {
  width: 100% !important;
  padding: 0 8px;
}

.searchBoxEventBox
  .mediaSourceConst
  .h-selectTable-single
  .h-selectTable-input {
  width: 100% !important;
}
.searchBoxEventBox .viewPage {
  width: 100% !important;
}
.linkDetailItem {
  width: 100%;
  padding: 6px 8px;
  color: #298dff;
}
</style>
<style scoped>
.eventBtns {
  text-align: center;
  margin: 5px 0;
  white-space: nowrap;
}
.detailItemBox {
  padding: 0 10px;
  position: relative;
}
.detailItem h2 {
  font-size: 14px;
  font-weight: bold;
  padding-top: 5px;
}
.noDataBox {
  text-align: center;
  padding: 20px 0;
  border: 1px #ccc dashed;
}
.companyNameBox {
  width: 100%;
}
.companyNameBox >>> .search-form-item .viewPage {
  width: 100%;
  height: auto;
  line-height: 18px;
  min-height: 42px !important;
  max-height: 100px !important;
  overflow-y: auto;
  white-space: normal;
  word-wrap: normal;
  padding: 5px;
}
.companyNameBox >>> .search-form-item textarea {
  max-height: 100px !important;
}
.detailItem >>> .h-table-row-highlight td,
.detailItem >>> .h-table-row-checked td,
.detailItem >>> .h-table tr.h-table-row-highlight.h-table-row-hover td,
.detailItem >>> .h-table tr.h-table-row-checked.h-table-row-hover td,
.detailItem
  >>> .h-table-stripe
  .h-table-body
  tr.h-table-row-highlight:nth-child(2n)
  td,
.detailItem
  >>> .h-table-stripe
  .h-table-fixed-body
  tr.h-table-row-highlight:nth-child(2n)
  td,
.detailItem
  >>> .h-table-stripe
  .h-table-body
  tr.h-table-row-checked:nth-child(2n)
  td,
.detailItem
  >>> .h-table-stripe
  .h-table-fixed-body
  tr.h-table-row-checked:nth-child(2n)
  td {
  background-color: lightblue !important;
}
.detailItem >>> .table-default-highlight td,
.detailItem >>> .h-table-row-checked td,
.detailItem >>> .h-table tr.h-table-row-highlight.h-table-row-hover td,
.detailItem >>> .h-table tr.h-table-row-checked.h-table-row-hover td,
.detailItem
  >>> .h-table-stripe
  .h-table-body
  tr.h-table-row-highlight:nth-child(2n)
  td,
.detailItem
  >>> .h-table-stripe
  .h-table-fixed-body
  tr.h-table-row-highlight:nth-child(2n)
  td,
.detailItem
  >>> .h-table-stripe
  .h-table-body
  tr.h-table-row-checked:nth-child(2n)
  td,
.detailItem
  >>> .h-table-stripe
  .h-table-fixed-body
  tr.h-table-row-checked:nth-child(2n)
  td {
  background-color: lightblue !important;
}
.footerBox {
  text-align: center;
  margin-top: 10px;
}
.eventDescContent {
  margin-top: 30px;
}
.eventDescContent >>> textarea {
  margin-top: 10px;
  min-height: 230px;
}
.selectSearchBox .selectSearchItem {
  display: inline-block;
  width: 22%;
  margin-right: 20px;
  vertical-align: top;
}
.selectSearchBox .selectSearchItem .searchLevelBox {
  display: inline-block;
  width: 100%;
  margin-right: 20px;
  vertical-align: top;
}
.selectSearchBox .optionListBox {
  border: 1px solid #ccc;
  padding: 10px;
  height: 205px;
  overflow-y: auto;
}
.optionList {
  text-align: left;
  line-height: 18px;
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
}
.optionListActive {
  text-align: left;
  line-height: 20px;
  background: #298dff;
  color: #fff;
}
.optionActive {
  color: blue;
}
.timerContainer {
  font-size: 20px;
  display: inline-block;
  position: relative;
  top: 4px;
  box-sizing: border-box;
  height: 32px;
  padding-left: 20px;
  padding-right: 20px;
}
.timerContainer >>> .h-progress-inner {
  background: #fff;
}
.eventContainer {
  display: flex;
}
.eventTableContainer {
  width: calc(100% - 50px);
}
.actionContainer {
  width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.actionItem {
  height: 35px;
  line-height: 35px;
}
</style>
