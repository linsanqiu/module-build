<template>
  <div class="outerBox" :style="isFixedBtn ? 'padding-top:50px' : 'padding-top:0'">
    <h-spin fix v-if="detailLoading">
      <h-icon name="load-c" size=18 class="h-load-loop"></h-icon>
      <div>加载中...</div>
    </h-spin>

    <div class="butBox" v-if="showTopBtn && !isEventPage" :class="{'butBoxFix':isFixedBtn}">
      <NewsFormItemBtn
        :newsType='newsType'
        :handleStatus='handleStatus'
        :pageType='pageType'
        :loadingArr="loadingArr"
        :showBtns="showBtns"
        :showSimilar="showSimilar"
        :addPublic="addPublic"
        :overplusSecs="overplusSecs"
        @handleSimilarNews="handleSimilarNews"
        @handleDelet="handleDelet"
        @handleSaveInfo="handleCheckSaveInfo"
        @handlePublic="handleCheckPublish"
        @handlePreId="handlePreId"
        @discardFn="discardFn"
        @handleNextId="handleNextId(true)"
        @handleCopyDetail="handleCopyDetail"
        @handleAllLabelFn="handleAllLabelFn"
        @handleOverProcessFn="handleOverProcessFn"
        :isTimeOut="isTimeOut"
      >
      </NewsFormItemBtn>
    </div>
    <h-form class="formSearchBox" ref="formInline" :rules="ruleInlineData ? ruleInlineData : ruleInline"
            :model="commonFiltersCopy" :label-width="112">
      <div class="newsDetailBox"
           :style="{'height':!isEventPage ? maxTableHeight+'px' : maxTableHeight+60+'px','min-height':maxTableHeight+'px'}">
        <windowDrag :leftW="isEventPage ? '0px' : '370px'" :canDrag="false">
          <div class="box-left-content" slot="left">
            <template v-if="!isEventPage">
              <div class="detailLeft">
                <div :class="isEventPage ? 'searchBoxEvent': 'searchBox'">
                  <h-form-item v-if="hiddenItemArr.indexOf('themeId') <0" class="selectItem" prop="themeId"
                               label="专题名称：">
                    <h-simple-select :readonly="pageType == 'SPECIALVIEW'" placeholder="请选择专题名称" filterable
                                     v-model="commonFiltersCopy.themeId" @on-change="changeSpecialName">
                      <h-select-block :data="specialNameList"></h-select-block>
                    </h-simple-select>
                  </h-form-item>
                  <h-form-item v-if="isSpecialPage" prop="newsId" label="资讯ID：">
                    <h-button style="text-align: left;color:#0067dc" v-if="pageType=='SPECIALADD'"
                              @on-click="handleSelectNewsId" type="ghost" class="viewPage">
                      {{ commonFiltersCopy.newsId ? commonFiltersCopy.newsId : '-' }}
                    </h-button>
                    <div class="viewPage" v-else>{{ commonFiltersCopy.newsId ? commonFiltersCopy.newsId : '-' }}</div>
                  </h-form-item>
                  <NewsFormItem v-if="hiddenItemArr.indexOf('appIds') <0" :readonlyFlag="pageType=='ADD'"
                                formItemType="checkbox" :pageType='pageType' itemName="appIds" labelName="所属项目："
                                :commonFilters="commonFiltersCopy" :itemSelectList="appList"></NewsFormItem>
                  <NewsFormItem v-if="hiddenItemArr.indexOf('srcPublishDate') <0" formItemType="datepicker"
                                :pageType='pageType' itemName="srcPublishDate" labelName="信息发布时间："
                                :commonFilters="commonFiltersCopy"
                                @onChangeDatePicker="onChangeDatePicker"></NewsFormItem>
                  <NewsFormItem v-if="hiddenItemArr.indexOf('publishStatusDesc') <0" :readonlyFlag="true"
                                className="readonlyItem" formItemType="input" :pageType='pageType'
                                itemName="publishStatusDesc" labelName="公开标志："
                                :commonFilters="commonFiltersCopy"></NewsFormItem>
                  <NewsFormItem v-if="hiddenItemArr.indexOf('newsId') <0" :readonlyFlag="true" className="readonlyItem"
                                formItemType="input" :pageType='pageType' itemName="newsId" labelName="资讯ID："
                                :commonFilters="commonFiltersCopy"></NewsFormItem>
                  <h-form-item v-if="hiddenItemArr.indexOf('dsSourceType') <0" class="selectItem" prop="dsSourceType"
                               label="信息来源：">
                    <h-simple-select
                      :readonly="(pageType=='VIEW' || pageType=='SPECIALVIEW' || pageType=='SPECIALEDIT'|| pageType=='SPECIALADD') ? true :false"
                      placeholder="" :loading="loadingSearchDsSource"
                      :loading-text="loadingSearchTxt? loadingSearchTxt :'请输入搜索'" :remote-method="remoteMethodDsSource"
                      remote filterable v-model="commonFiltersCopy.dsSourceType" @on-change='changeSelectFn'
                      label-in-value>
                      <h-select-block :data="dsSourceList"></h-select-block>
                    </h-simple-select>
                  </h-form-item>
                  <NewsFormItem v-if="hiddenItemArr.indexOf('dsNewsColumns') <0" @focusFn="onFocusFn"
                                formItemType="input" ref="input0" inputIndex="0" :pageType='pageType'
                                itemName="dsNewsColumns" labelName="原始栏目："
                                :commonFilters="commonFiltersCopy"></NewsFormItem>
                  <NewsFormItem v-if="hiddenItemArr.indexOf('mediaSource') <0" @focusFn="onFocusFn" formItemType="input"
                                inputIndex="1" :pageType='pageType' itemName="mediaSource" labelName="媒体出处："
                                :commonFilters="commonFiltersCopy"
                                @changeInput="changeMediaSourceInputFn"></NewsFormItem>
                  <!-- <NewsFormItem v-if="hiddenItemArr.indexOf('mediaSourceCode') <0"  :readonlyFlag="pageType == 'VIEW' || pageType == 'SPECIALVIEW' || pageType == 'SPECIALEDIT' || pageType == 'SPECIALADD'" formItemType="selectblock" pageType='HANDLE' itemName="mediaSourceCode" labelName="媒体出处(常量)：" :commonFilters="commonFiltersCopy" :itemSelectList="sourceList" ></NewsFormItem> -->
                  <h-form-item v-if="hiddenItemArr.indexOf('mediaSourceCode') <0" class="selectItem"
                               prop="mediaSourceCode" label="媒体出处(常量)">
                    <h-simple-select
                      :readonly="(pageType=='VIEW' || pageType=='SPECIALVIEW' || pageType=='SPECIALEDIT'|| pageType=='SPECIALADD') ? true :false"
                      placeholder="" :loading="loadingSearchMediaSourceCode"
                      :loading-text="loadingSearchTxt? loadingSearchTxt :'请输入搜索'"
                      :remote-method="remoteMethodMediaSource" remote filterable
                      v-model="commonFiltersCopy.mediaSourceCode">
                      <h-select-block :data="mediaSourceList"></h-select-block>
                    </h-simple-select>
                  </h-form-item>
                  <NewsFormItem v-if="hiddenItemArr.indexOf('layoutNumber') <0" @focusFn="onFocusFn"
                                formItemType="input" inputIndex="2" :pageType='pageType' itemName="layoutNumber"
                                labelName="版面号：" :commonFilters="commonFiltersCopy"></NewsFormItem>
                  <NewsFormItem v-if="hiddenItemArr.indexOf('layoutInfo') <0" @focusFn="onFocusFn" formItemType="input"
                                inputIndex="3" :pageType='pageType' itemName="layoutInfo" labelName="版面信息："
                                :commonFilters="commonFiltersCopy"></NewsFormItem>
                  <NewsFormItem v-if="hiddenItemArr.indexOf('author') <0" @focusFn="onFocusFn" formItemType="input"
                                inputIndex="4" :pageType='pageType' itemName="author" labelName="撰写作者："
                                :commonFilters="commonFiltersCopy"></NewsFormItem>
                  <NewsFormItem v-if="hiddenItemArr.indexOf('authorOrg') <0" @focusFn="onFocusFn" formItemType="input"
                                inputIndex="5" :pageType='pageType' itemName="authorOrg" labelName="撰写机构："
                                :commonFilters="commonFiltersCopy"></NewsFormItem>
                  <h-form-item v-if="hiddenItemArr.indexOf('authorOrgCode') <0" class="selectItem" prop="authorOrgCode"
                               label="撰写机构(常量)：">
                    <h-simple-select
                      :readonly="pageType == 'VIEW' || pageType == 'SPECIALVIEW' || pageType == 'SPECIALEDIT' || pageType == 'SPECIALADD'"
                      placeholder="" :loading="loadingSearchAutorOrg"
                      :loading-text="loadingSearchTxt? loadingSearchTxt :'请输入搜索'" :remote-method="remoteMethodAutorOrg"
                      remote filterable v-model="commonFiltersCopy.authorOrgCode">
                      <h-select-block :data="autorOrgList"></h-select-block>
                    </h-simple-select>
                  </h-form-item>
                  <NewsFormItem v-if="hiddenItemArr.indexOf('range') <0" formItemType="select" :pageType='pageType'
                                itemName="range" labelName="范围：" :commonFilters="commonFiltersCopy"
                                :itemSelectList="rangeList" @selectChangeFn="selectChangeFn"></NewsFormItem>
                  <NewsFormItem v-if="hiddenItemArr.indexOf('rangePlus') <0" formItemType="selecttree"
                                :pageType='pageType' itemName="rangePlus" labelName="范围(细分)："
                                :commonFilters="commonFiltersCopy" :itemSelectList="rangePlus"
                                @selectChangeTreeFn="selectChangePlus"></NewsFormItem>
                  <NewsFormItem v-if="hiddenItemArr.indexOf('financial') <0" formItemType="select" :pageType='pageType'
                                itemName="financial" labelName="金融市场：" :commonFilters="commonFiltersCopy"
                                :itemSelectList="financialMarketList" @selectChangeFn="selectChangeFn"></NewsFormItem>
                  <NewsFormItem v-if="hiddenItemArr.indexOf('financialPlus') <0" formItemType="selecttree"
                                :pageType='pageType' itemName="financialPlus" labelName="金融市场(细分)："
                                :commonFilters="commonFiltersCopy" :itemSelectList="financialPlus"
                                @selectChangeTreeFn="selectChangePlus"></NewsFormItem>
                  <NewsFormItem v-if="hiddenItemArr.indexOf('tradingMarket') <0" formItemType="select"
                                :pageType='pageType' itemName="tradingMarket" labelName="交易场所："
                                :commonFilters="commonFiltersCopy" :itemSelectList="tradingMarketList"></NewsFormItem>
                  <NewsFormItem v-if="hiddenItemArr.indexOf('form') <0" formItemType="select" :pageType='pageType'
                                itemName="form" labelName="形态：" :commonFilters="commonFiltersCopy"
                                :itemSelectList="formList"></NewsFormItem>
                  <!--<NewsFormItem v-if="hiddenItemArr.indexOf('sentimentLabel') <0" formItemType="select" :pageType='pageType' itemName="sentimentLabel" labelName="情感方向：" :commonFilters="commonFiltersCopy" :itemSelectList="emotionList"></NewsFormItem>-->
                  <!--<NewsFormItem v-if="hiddenItemArr.indexOf('areaCode') <0" formItemType="selectblock" :pageType='pageType' itemName="areaCode" labelName="信息地域：" :commonFilters="commonFiltersCopy" :itemSelectList="areaList"></NewsFormItem>-->
                  <NewsFormItem v-if="hiddenItemArr.indexOf('level') <0" formItemType="select" :pageType='pageType'
                                itemName="level" labelName="信息级别：" :commonFilters="commonFiltersCopy"
                                :itemSelectList="infoLevelList"></NewsFormItem>
                  <NewsFormItem v-if="commonFiltersCopy.sensitives" :title="commonFiltersCopy.sensitives"
                                className="sensitives" inputType="textarea" :readonlyFlag="true" formItemType="input"
                                :pageType='pageType' itemName="sensitives" labelName="敏感词："
                                :commonFilters="commonFiltersCopy"></NewsFormItem>
                  <NewsFormItem v-if="hiddenItemArr.indexOf('opinionType') <0 && commonFiltersCopy.special"
                                :readonlyFlag="pageType == 'SPECIALVIEW'" formItemType="select" pageType='HANDLE'
                                itemName="opinionType" labelName="意见类型：" :commonFilters="commonFiltersCopy"
                                :itemSelectList="commonFiltersCopy.opinionList"></NewsFormItem>
                  <NewsFormItem v-if="hiddenItemArr.indexOf('conclusion') <0 && commonFiltersCopy.special"
                                className="conclusionBox " :readonlyFlag="pageType == 'SPECIALVIEW'"
                                inputType="textarea" formItemType="input" pageType='HANDLE' itemName="conclusion"
                                labelName="结论：" :commonFilters="commonFiltersCopy"></NewsFormItem>

                </div>
                <div
                  v-if="hiddenItemArr.indexOf('remark') <0  &&(pageType!='ADD' && commonFiltersCopy.remark && commonFiltersCopy.remark.length) && (pageType!='SPECIALADD')">
                  <h-form-item prop="remark" label="处理记录：">
                    <ul class="handleRemark">
                      <li :title="item" v-for="(item,index) in commonFiltersCopy.remark" :key='index'>
                        {{ item }}
                      </li>

                    </ul>
                    <div class="remarkBtnContent">
                      <h-button size='small' type="info" @click="remarkClick">查看更多</h-button>
                    </div>
                  </h-form-item>
                </div>
              </div>
            </template>

          </div>
          <div class="box-right-content" slot="right">
            <div :class="isEventPage?'detailRight detailRightLog':'detailRight'">
              <template>
                <slot name="eventFormItem"></slot>
              </template>
              <NewsFormItem v-if="hiddenItemArr.indexOf('newsUrl') <0" className="titleItem readonlyItem"
                            formItemType="input" linkType="true" :pageType='pageType == "ADD" ? "ADD" : "VIEW"'
                            itemName="newsUrl" labelName="链接地址：" :commonFilters="commonFiltersCopy"></NewsFormItem>
              <NewsFormItem v-if="hiddenItemArr.indexOf('title') <0" className="titleItem"
                            :formItemType='pageType=="ADD" ? "input" : "titlediv"' :pageType='pageType' itemName="title"
                            itemNameIpt="titleShow" labelName="资讯标题：" :commonFilters="commonFiltersCopy"
                            @changeTitle="changeTitle"></NewsFormItem>
              <NewsFormItem v-if="hiddenItemArr.indexOf('subTitle') <0" className="titleItem" formItemType="input"
                            :pageType='pageType' itemName="subTitle" labelName="副标题："
                            :commonFilters="commonFiltersCopy"></NewsFormItem>
              <NewsFormItem v-if="hiddenItemArr.indexOf('summary') <0" className="summaryBox" inputType="textarea"
                            formItemType="input" itemName="summary" :pageType='pageType' labelName="摘要："
                            :commonFilters="commonFiltersCopy"></NewsFormItem>
              <template v-if="hiddenItemArr.indexOf('content') <0">
                <div v-if="newsType == '1' || pageType=='VIEW' || isSpecialPage" class="contentTextBoxWrap">
                  <h-button v-if="newsType == '1' && (pageType == 'HANDLE' || pageType == 'ADD')" class="syncBtn"
                            size="small" type="info" @click="syncTxt">同步TXT
                  </h-button>
                  <h-form-item prop="content" label="资讯内容：">
                    <template v-if="showVueCkeditor">
                      <vueCkeditor v-if="pageType!='VIEW'" :instanceReadyCallback="instanceReadyCallback"
                                   v-model="commonFiltersCopy.content" :config="config"
                                   @input='contentChange'></vueCkeditor>
                      <vueCkeditor v-else :instanceReadyCallback="instanceReadyCallback"
                                   v-model="commonFiltersCopy.content" :config="configView"></vueCkeditor>
                    </template>
                  </h-form-item>
                </div>
                <div class="contentTextBoxWrap"
                     v-if="hiddenItemArr.indexOf('contentText') <0 && newsType == '2' && (pageType=='HANDLE' || pageType=='ADD') ">
                  <h-button v-if="pageType == 'HANDLE' || pageType == 'ADD'" size="small" type="info"
                            @click="formContentTextFn">排版
                  </h-button>
                  <NewsFormItem className="contentTextBox" inputType="textarea" formItemType="input"
                                itemName="contentText" pageType='HANDLE' labelName="资讯内容(TXT)："
                                :commonFilters="commonFiltersCopy" @changeInput="onBlurContentText"></NewsFormItem>
                </div>
              </template>
              <template>
                <NewsLabelList
                  :pageType='pageType'
                  labelListType='labelListSecurity'
                  labelListName='涉及证券：'
                  columnsShowflag='security'
                  :labelListData='labelListSecurity'
                  :hiddenItemArr='hiddenItemArr'
                  :isSpecialPage='isSpecialPage'
                  :isEventPage='isEventPage'
                  @handleAddLabel="handleAddLabel"
                  @handleDelLabelFn="handleDelLabelFn"
                  @addLabelInfoFn="addLabelInfoFn"
                ></NewsLabelList>
                <NewsLabelList
                  :pageType='pageType'
                  labelListType='labelListCorp'
                  labelListName='涉及公司：'
                  columnsShowflag='corp'
                  :labelListData='labelListCorp'
                  :hiddenItemArr='hiddenItemArr'
                  :isSpecialPage='isSpecialPage'
                  :isEventPage='isEventPage'
                  @handleAddLabel="handleAddLabel"
                  @handleDelLabelFn="handleDelLabelFn"
                  @addLabelInfoFn="addLabelInfoFn"

                ></NewsLabelList>
                <NewsLabelList
                  :pageType='pageType'
                  labelListType='labelListIndustry'
                  labelListName='所属行业：'
                  columnsShowflag='industry'
                  :labelListData='labelListIndustry'
                  :hiddenItemArr='hiddenItemArr'
                  :isSpecialPage='isSpecialPage'
                  :isEventPage='isEventPage'
                  @handleAddLabel="handleAddLabel"
                  @handleDelLabelFn="handleDelLabelFn"
                  @addLabelInfoFn="addLabelInfoFn"

                ></NewsLabelList>
                <NewsLabelList
                  :pageType='pageType'
                  labelListType='labelListConcept'
                  labelListName='概念板块：'
                  columnsShowflag='industry'
                  :labelListData='labelListConcept'
                  :hiddenItemArr='hiddenItemArr'
                  :isSpecialPage='isSpecialPage'
                  :isEventPage='isEventPage'
                  @handleAddLabel="handleAddLabel"
                  @handleDelLabelFn="handleDelLabelFn"
                  @addLabelInfoFn="addLabelInfoFn"

                ></NewsLabelList>
                <NewsLabelList
                  :pageType='pageType'
                  labelListType='labelListIndicator'
                  labelListName='经济指标：'
                  columnsShowflag='industry'
                  :labelListData='labelListIndicator'
                  :hiddenItemArr='hiddenItemArr'
                  :isSpecialPage='isSpecialPage'
                  :isEventPage='isEventPage'
                  @handleAddLabel="handleAddLabel"
                  @handleDelLabelFn="handleDelLabelFn"
                  @addLabelInfoFn="addLabelInfoFn"

                ></NewsLabelList>
                <NewsLabelList
                  :pageType='pageType'
                  labelListType='labelListArea'
                  labelListName='信息地域：'
                  columnsShowflag='industry'
                  :labelListData='labelListArea'
                  :hiddenItemArr='hiddenItemArr'
                  :isSpecialPage='isSpecialPage'
                  :isEventPage='isEventPage'
                  @handleAddLabel="handleAddLabel"
                  @handleDelLabelFn="handleDelLabelFn"
                  @addLabelInfoFn="addLabelInfoFn"

                ></NewsLabelList>
              </template>
              <template>
                <h-form-item prop="content" label="资讯内容："
                             v-if="newsType == '2' && (pageType=='HANDLE' || pageType=='ADD' || isSaveAs) ">
                  <template v-if="showVueCkeditor">
                    <vueCkeditor v-if="pageType!='VIEW'" :instanceReadyCallback="instanceReadyCallback"
                                 v-model="commonFiltersCopy.content" :config="config"></vueCkeditor>
                    <vueCkeditor v-else :instanceReadyCallback="instanceReadyCallback"
                                 v-model="commonFiltersCopy.content" :config="configView"></vueCkeditor>
                  </template>
                </h-form-item>
                <div class="contentTextBoxWrap"
                     v-if="hiddenItemArr.indexOf('contentText') <0 && newsType == '1' || pageType=='VIEW'  || isSpecialPage">
                  <h-button v-if="pageType == 'HANDLE' || pageType == 'ADD'" size="small" type="info"
                            @click="formContentTextFn">排版
                  </h-button>
                  <NewsFormItem v-if="!isEventPage" className="contentTextBox" inputType="textarea" formItemType="input"
                                itemName="contentText" pageType='HANDLE' labelName="资讯内容(TXT)："
                                :commonFilters="commonFiltersCopy"></NewsFormItem>
                  <h-form-item v-if="isEventPage" prop="contentText" label="资讯内容(TXT)：" :label-width="90"
                               :label-wrap="true">
                    <div class="contentTextBoxEvent" v-html="commonFiltersCopy.contentText"></div>
                  </h-form-item>
                  <h-form-item v-if="isEventPage" prop="content" label="资讯内容：" :label-width="90" :label-wrap="true">
                    <div class="contentTextBoxEvent" v-html="commonFiltersCopy.content"></div>
                  </h-form-item>
                </div>
              </template>


            </div>
            <div class="eventPageRemark"
                 v-if="commonFiltersCopy.remark && commonFiltersCopy.remark.length && isEventPage">
              <h-form-item prop="remark" label="处理记录：">
                <ul class="handleRemark">
                  <li :title="item" v-for="(item,index) in commonFiltersCopy.remark">
                    {{ item }}
                  </li>
                  <div class="remarkBtnContent">
                    <h-button size='small' type="info" @click="remarkClick">查看更多</h-button>
                  </div>
                </ul>
              </h-form-item>
            </div>
          </div>
        </windowDrag>

      </div>
      <div>
        <h-form-item v-if="hiddenItemArr.indexOf('imageUrl') <0" class="uploadImg-form-item" prop="imageUrl"
                     label="标题图片：">
          <div class="uploadImg" v-if="pageType!='VIEW' && pageType!='SPECIALVIEW'">
            <img ref="imgLink" v-if="commonFiltersCopy.titleImgLink" title="查看原图" @click="handleView" class="defaultImg"
                 :src="commonFiltersCopy.titleImgLink" alt=""/>
            <span @click="handleClearImg" class="delIcon" v-if="commonFiltersCopy.titleImgLink">×</span>
            <template>
              <div class="uploadImgBox" @click="showImgModal" v-if="commonFiltersCopy.titleImgLink">
                <div class="addIconBox">
                  <span>+</span>
                  <i>上传图片</i>
                  <i>仅支持png/jpg格式,<br/>大小不超过500KB</i>
                </div>
              </div>
              <div class="uploadImgBoxNoImg" @click="showImgModal" v-else>
                <div class="addIconBox">
                  <span>+</span>
                  <!--<i>上传图片</i>-->
                  <i>仅支持png/jpg格式,大小不超过500KB</i>
                </div>
              </div>
            </template>

          </div>
          <div class="uploadImg" v-else>
            <img v-if="commonFiltersCopy.titleImgLink" title="查看原图" @click="handleView" class="defaultImg"
                 :src="commonFiltersCopy.titleImgLink" alt=""/>
            <span v-else>暂无</span>
          </div>
        </h-form-item>
        <div v-if="commonFiltersCopy.contentSource && hiddenItemArr.indexOf('contentSource') <0">
          <h-form-item prop="contentSource" label="原始内容：">
            <h-button size="small" v-if="!contentShow" @click="contentShow = true">点击查看原文</h-button>
            <template v-else>
              <h-button size="small" @click="contentShow = false">收起原文</h-button>
              <div class="contentSource" v-html="commonFiltersCopy.contentSource"></div>
            </template>
          </h-form-item>
        </div>

      </div>
    </h-form>


    <!--添加标签modal-->
    <h-msgBox
      title="添加标签"
      class-name="modalAddLabel"
      v-model="modalAddLabel"
      width="700"
      :height="modalAdd.modalHeight"
      footerHide>
      <div style="position: relative;">
        <h-spin fix v-if="modalAdd.modalLoading">
          <h-icon name="load-c" size=18 class="h-load-loop"></h-icon>
          <div>加载中...</div>
        </h-spin>
        <ul class="handleBox">
          <li>
            <span>标签分类:</span>
            <h-select-tree filterable :onlyChild="true" formatValue='id' v-model="modalAdd.categoryId"
                           style="width:210px" :data="selectBaseData"
                           @on-select-change="selectCategory"></h-select-tree>
          </li>
          <li>
            <span>标签名称:</span>
            <h-input style="width:210px" aria-placeholder="标签名称(必填)" placeholder="请输入标签名称" v-model="modalAdd.tagValue"
                     @on-enter="onChangeInputEnter(`tagValue`)" @on-click="shitClearableClick(`tagValue`)"></h-input>
          </li>
          <li>
            <h-button @click="handleSearchLabel" type="info">查询</h-button>
          </li>
        </ul>
        <ul class="labelNameList" v-if="labelTableList.length>0">
          <li>
            <h-table
              :columns="labelColums"
              :data="labelTableList"
              :loading="loadingLabelTab"
              size="small"
              border
              stripe
            >
            </h-table>
          </li>
          <li style="float:right;">
            <h-page
              @on-change="onPageChange"
              :total="pagination.total"
              :page-size="pagination.size"
              :current="pagination.current"
              show-elevator
              size="small"
              show-total>
            </h-page>
          </li>
        </ul>
      </div>
    </h-msgBox>
    <div class="butBox butBoxBottom" v-if="toBottom && !isEventPage">
      <NewsFormItemBtn
        :pageType='pageType'
        :loadingArr="loadingArr"
        :showBtns="showBtns"
        :showSimilar="showSimilar"
        :addPublic="addPublic"
        @handleSimilarNews="handleSimilarNews"
        @handleDelet="handleDelet"
        @handleSaveInfo="handleCheckSaveInfo"
        @handlePublic="handleCheckPublish"
        @handlePreId="handlePreId"
        @discardFn="discardFn"
        @handleNextId="handleNextId"
        @handleCopyDetail="handleCopyDetail"
        @handleAllLabelFn="handleAllLabelFn">
      </NewsFormItemBtn>
    </div>
    <h-msgBox
      :isOkLeft="true"
      title="提示"
      v-model="modalCheckPublish"
      @on-ok="confirmCheckFun"
      @on-cancel="cancelCheckFun">
      <p v-html="modalCheckPublishMsg"></p>
    </h-msgBox>
    <h-msgBox
      :isOkLeft="true"
      title="提示"
      v-model="modalCheckAmbigulty"
      @on-ok="confirmAmbigultyFn"
      @on-cancel="cancelAmbigultyFn">
      <p>存在歧义标签，提交后歧义标签将直接废弃，是否继续？</p>
    </h-msgBox>
    <h-msgBox
      title="标签核对"
      width="80%"
      :footerHide="true"
      v-model="modalCheckLabel"
    >
      <div>
        <LabelCheckModal :labelListData="checkArrBatch" @handleDelLabelFn="handleDelLabelFn"
                         @labelMain="labelMainFn"></LabelCheckModal>
      </div>
    </h-msgBox>
    <h-msgBox
      :isOkLeft="true"
      class="modalSimilarBox"
      title="相似资讯"
      v-model="modalSimilar"
      width="85%"
      height="300px"
      footerHide>
      <div>
        <SimilarList v-if="modalSimilar" :similarList="similarList"
                     @deleteSimilarItem='deleteSimilarItem'></SimilarList>
      </div>
    </h-msgBox>
    <h-msgBox
      :isOkLeft="true"
      class="modalImgSelect"
      width="80%"
      title="图片选择"
      v-model="modalSelectImg"
      @on-ok="confirmCheckImg"
    >
      <div>
        <h-spin fix v-if="modalSelectImgLoading">
          <h-icon name="load-c" size=18 class="h-load-loop"></h-icon>
          <div>加载中...</div>
        </h-spin>
        <div>
          <ImgList @loadingImg="loadingImg" @imageName="getImageName" :imgDataFile="imgDataFile"
                   :initShowFile="modalSelectImg"></ImgList>
        </div>
      </div>
    </h-msgBox>
    <h-msgBox
      :isOkLeft="true"
      v-model="remarkModalShow"
      title="处理记录"
      width="60%"
    >
      <div slot='footer'></div>
      <remarkModal :remarkList="remarkList"></remarkModal>
    </h-msgBox>
    <!-- 公开主表相似资讯 -->
    <h-msgBox
      :isOkLeft="true"
      class="modalSimilarBox"
      title="相似资讯"
      v-model="publishModalSimilar"
      width="85%"
      height="300px"
      @on-ok="publishSimilarOk"
      okText="继续公开"
    >
      <div>
        <publishSimilarList v-if="publishModalSimilar && publishLikeLyNews.length>0" :similarList="publishLikeLyNews"
                            @changeDup="changeDup">
        </publishSimilarList>
      </div>
    </h-msgBox>
  </div>
</template>

<script>
import windowDrag from '@/components/windowDrag';
//import vueCkeditor from 'vue-ckeditor2';
import vueCkeditor from '@/components/vueCkeditor';
import NewsFormItem from '@/components/news_formItem';
import NewsFormItemBtn from '@/components/news_formItem_btn';
import SimilarList from '@/pages/tbm/news/similar';
import publishSimilarList from '@/pages/tbm/news/publishSimilar';
import ImgList from '@/pages/tbm/news/titleimg';
import NewsLabelList from '@/components/news_labelList'
import LabelCheckModal from '@/components/labelCheckModal';
import remarkModal from '@/components/remarkModal';
import SimpleSelect from '@/components/simpleSelect';
import {mapState, mapActions} from "vuex";
import {ArrToString, stringToArray, copyDeep} from "@/filters/index";

export default {
  components: {
    vueCkeditor,
    NewsFormItem,
    NewsFormItemBtn,
    SimilarList,
    ImgList,
    NewsLabelList,
    LabelCheckModal,
    windowDrag,
    remarkModal,
    publishSimilarList,
    SimpleSelect
  },
  name: 'JintanNewsDetail',
  props: {
    showBtns: Array,
    pageType: String,
    newsId: String,
    id: String,
    newsType: String,
    commonFilters: Object,
    secuTags: Array,
    labelList: Array,
    industryTags: Array,
    conceptTags: Array,
    indicatorTags: Array,
    regionTags: Array,
    hiddenItemArr: Array,
    specialNameList: Array,
    opinionListRecommend: {
      type: Array,
      required: false,
      default: function () {
        return []
      }
    },
    opinionListComment: {
      type: Array,
      required: false,
      default: function () {
        return []
      }
    },
    isSpecialPage: false,
    ruleInlineData: null,
    isEventPage: false,
    isSaveAs: false,//另存为id
    isProcess: false,//是否为进入流程

  },
  data() {
    return {
      myCkeditor: null,
      searchDataObj: null,
      searchDataObjFast: null,
      ckeditorReady: false,//ckEditor加载完成
      contentReady: false,//编辑器内容加载完成
      contentReadyData: '',//请求返回数据content
      loadingSearchAutorOrg: true,
      loadingSearchDsSource: true,
      loadingSearchMediaSourceCode: true,
      loadingSearchTxt: '请输入搜索',
      inputIndex: 0,
      modalSimilar: false,
      showSimilar: false,
      imgDataFile: [],
      modalSelectImg: false,
      modalSelectImgLoading: false,
      titleImgLink: '',
      titleImgLinkSelect: '',
      publishStatusDesc: '',
      appNames: '',
      delLabelStatus: false,
      addLabelType: 'labelListCorp',
      delLabeltype: 'labelListCorp',
      newsIdLists: [],
      newsIdListsSimilar: [],
      checkPublishInfo: {},
      modalCheckPublish: false,
      modalCheckPublishMsg: '',
      modalCheckAmbigulty: false,
      addPublic: false,
      newsIdAddSave: '',//新建后生成的id
      checkType: 'save',
      optionsDate: {
        disabledDate(date) {
          return date && date.valueOf() >= Date.now();
        }
      },
      isFixedBtn: false,//是否固定操作按钮
      showTopBtn: true,//是否显示顶部按钮
      toBottom: false,//到达底部状态
      loadingArr: {
        loadingBtnPre: false,
        loadingBtnNext: false,
        loadingDel: false,
        loadingBtnPub: false,
        loadingBtnSave: false,
      },
      contentShow: false,
      publishDateRange: ['', ''],
      newsIdCopy: '',
      idCopy: '',
      newsIdAddSpecial: '',
      labelListSecurity: [],
      labelListCorp: [],
      labelListIndustry: [],
      labelListConcept: [],
      labelListIndicator: [],
      labelListArea: [],
      rangePlus: [],
      financialPlus: [],
      tradingMarketList: [],//交易场所列表
      commonFiltersCopy: {},
      beforeCommonFilters: {},
      detailLoading: false,
      modalAdd: {
        modalLoading: false,
        categoryId: '',
        categoryName: '',
        tagValue: '',
        modalHeight: 300
      },
      categoryId: {
        labelListSecurity: '101109',
        labelListCorp: '101102',
        labelListIndustry: '101101',
        labelListConcept: '101111',
        labelListIndicator: '101112',
        labelListArea: '101110'
      },
      linkLabelId: {
        'macro': '1005000004',//宏观
        'industry': '1005000005',//产经
        'corp': '1005000006',//公司
        'bond': '1005000011',//债券市场
        'forex': '1005000014',//外汇市场
        'derivative': '1005000016',//衍生品市场
        'assets': '1005000017',//资产管理市场
        'american': '1005000085',//美股
        'hk': '1005000086'//港股
      },
      initChange: true,//数据请求成功后再触发change
      selectBaseData: [],
      selectBaseDataAll: [],
      modalAddLabel: false,
      imgName: '',
      showVueCkeditor: true,
      config: {
        bodyClass: 'ckeditorContents',
        height: "300px",
        width: "100%",
        toolbar: [
          ['Source', 'NewPage', 'DocProps', 'Preview', '-', 'Templates', 'Table'],
          ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'],
          ['Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt'],
          ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'],
          ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
          ['Maximize'], ['Image'],
          ['Styles', 'Format', 'Font', 'FontSize', 'lineheight'],
          ['TextColor', 'BGColor'],
          ['ShowBlocks', 'labelAdd', 'paragraphFormat', '-', 'About'],
          //					['ShowBlocks', 'labelAdd', '-', 'About'],
        ],//工具栏选项
        filebrowserUploadUrl: "/tm/news/editorUpload",//图片上传地址
        allowedContent: true,//允许为内容标签添加class
        keystrokes: [[CKEDITOR.CTRL + 69, 'labelCheckKeyCode']],
        extraPlugins: 'paragraphFormat,labeloperate,,labelAdd,labelmain,labelCancelMain,labelCheck,labelCheckKeyCode'
      },
      configView: {
        bodyClass: 'ckeditorContents',
        height: "300px",
        width: "100%",
        toolbar: [
          ['NewPage', 'DocProps', 'Preview', '-', 'Templates'],
          ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'],
          ['Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt'],
          ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'],
          ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
          ['Maximize'], ['Image'],
          ['Styles', 'Format', 'Font', 'FontSize', 'lineheight'],
          ['TextColor', 'BGColor'],
          ['ShowBlocks', '-', 'About']
        ],//工具栏选项
        allowedContent: true,//允许为内容标签添加class
        readOnly: true,
        toolbarStartupExpanded: false//工具栏默认是否展开
      },
      commonHandle: {
        newsBrief: ""
      },
      ruleInline: {
        newsId: [
          {required: false, message: '资讯ID不能为空', trigger: 'change'}
        ],
        srcPublishDate: [
          {required: true, message: '发布时间不能为空', trigger: 'change'}
        ],
        dsSourceType: [
          {required: true, message: '信息来源不能为空', trigger: 'change'}
        ],
        appIds: [
          {required: true, type: 'array', min: 1, message: '所属项目为必选项', trigger: 'change'}
        ],
        dsNewsColumns: [
          {required: true, message: '资讯原始栏目不能为空', trigger: 'change'}
        ],
        title: [
          {required: true, message: '资讯标题不能为空', trigger: 'change'}
        ],
        content: [
          {required: true, message: '资讯内容不能为空', trigger: 'change'}
        ],
        contentText: [
          {required: true, message: '资讯内容(TXT)不能为空', trigger: 'change'}
        ],
        mediaSource: [
          {required: true, message: '媒体出处不能为空', trigger: 'change'}
        ],
        mediaSourceCode: [
          {required: true, message: '媒体出处(常量)不能为空', trigger: 'change'}
        ],
//				sentimentLabel:[
//					{ required: true, message: '情感方向不能为空', trigger: 'change' }
//				],
//				areaCode:[
//					{ required: true, message: '信息地域不能为空', trigger: 'change' }
//				],
        level: [
          {required: true, message: '信息级别不能为空', trigger: 'change'}
        ],

      },
      newsListTypes: [],
      newsListType: "",
      loadingSearchLabel: false,
      loadingText: '加载中',
      //添加标签modal
      heightValue: null,
      pagination: {
        current: 1,
        size: 5,
        total: 0,
      },
      loadingLabelTab: false,
      labelTableList: [],
      addTags: [],//modal添加标签
      delTags: [],//modal删除标签
      delArrBatch: [],
      checkArrBatch: [],
      modalCheckLabel: false,//显示核对标签弹框
      remarkModalShow: false, //显示处理记录弹窗
      remarkList: [],
      labelColums: [
        {
          key: "tag_value",
          title: "标签名称",
          align: "center",
          width: 250
        },
        {
          title: '关联信息',
          key: 'relationInfo',
        },
        {
          key: "categoryNames",
          title: "标签分类",
          align: "center",
          width: 200
        },
        {
          key: "operation",
          title: "操作",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h('div', [
              h('span', {
                class: {
                  'iconfont': true,
                  'icon-android-add': true,
                  'tab-icon-btn': true,
                },
                style: {
                  color: '#298DFF'
                },
                attrs: {
                  title: '添加'
                },
                on: {
                  click: () => {
                    let addInfo = params.row;
                    let tag_category_id = addInfo.tag_category_ids[1];
                    this.addLabelType = this.findCategoryId(tag_category_id, 'addLabelType');
                    let repeatFlag = this.isLabelRepeat(addInfo.other_obj.business_id);
                    if (repeatFlag) {
                      this.$hMessage.error({content: '标签列表已存在，请勿重复添加！'})
                    } else {
                      this.addLabelInfo(addInfo);
                    }
                  }

                }
              })
            ])
          },
        },
      ],
      publishModalSimilar: false, //公开相似资讯
      publishLikeLyNews: [],
      dupNewsId: '',
      overplusSecs: 0,
      overplusTime: '',
      similarList: [],
      detailIsChange: false, //是否相等
      checkFirst: true
    }
  },
  methods: {
    handleDelLabelFn(params, modalFlag = false) {
      this.delLabelType = this.findCategoryId(params.row.categoryCode, 'delLabelType');
      if (!modalFlag) {
        this.handleDelLabel(this.delLabelType, params.row, params.index);
      } else {
        //弹框传的index值不匹配
        this[this.delLabelType].forEach((item, index) => {
          if (item.categoryCode == params.row.categoryCode) {
            this.handleDelLabel(this.delLabelType, params.row, index);
          }
        })

      }
    },
    labelMainFn(item) {
      let labelType = this.findCategoryId(item.categoryCode, 'delLabelType');
      this[labelType].forEach((labelItem, i) => {
        if (labelItem == item.categoryCode) {
          this[labelType][i] = {...item};
        }
      });
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
    remoteMethodAutorOrg(query) {
      if (query !== '') {
        this.loadingSearchTxt = '加载中'
        this.loadingSearchAutorOrg = true;
        let queryStr = encodeURIComponent(query);
        this.$store.dispatch('getOrgAuthorList', query);
      }
    },
    remoteMethodDsSource(query) {
      if (query !== '') {
        this.loadingSearchTxt = '加载中'
        this.loadingSearchDsSource = true;
        let queryStr = encodeURIComponent(query);
        this.$store.dispatch('getDsSourceList', query);
      }
    },
    remoteMethodMediaSource(query) {
      if (query !== '') {
        this.loadingSearchTxt = '加载中'
        this.loadingSearchMediaSourceCode = true;
        let queryStr = encodeURIComponent(query);
        this.$store.dispatch('getMediaSourceList', query);
      }
    },
    changeSelectFn(values) {
      if (values.label == values.value) {
        return
      }
      this.commonFiltersCopy.dsSourceName = values.label
    },
    handleSelectNewsId() {
      let {themeId, appIdsCopy} = {...this.commonFiltersCopy}
      sessionStorage.setItem('themeId_appIds', JSON.stringify({themeId, appIdsCopy}));
      this.$emit('handleSelectNewsId');
    },
    onChangeDatePicker(values) {
      this.commonFiltersCopy.srcPublishDate = values;
    },
    changeTitle(title) {
      let data = title.replace(/<\/?.+?\/?>/g, '').replace(/\&nbsp;/g, " ");
      this.commonFiltersCopy.title = data;
    },
    selectChangeFn(itemName) {
      if (this.initChange) return;
      let value = this.commonFiltersCopy[itemName];
      /**
       *【范围】=宏观(1005000004)： 金融市场、金融市场（细分）、所属行业--清空
       *【范围】=产经(1005000005)： 金融市场、金融市场（细分）---清空
       *【范围】=公司(1005000006)：所属行业 ---清空
       ;      *【范围】=产经、公司、null：经济指标---清空
       *【金融市场】=债券市场1005000011、外汇市场005000014、衍生品市场1005000016、资产管理市场1005000017：所属行业 清空
       **/
      if (itemName == 'range' || itemName == 'financial') {
        let listName = '';
        if (itemName == 'range') {
          switch (value) {
            case this.linkLabelId['macro']:
              this.commonFiltersCopy.financial = '';
              this.commonFiltersCopy.financialPlus = '';
              this.labelListIndustry = [];
              break;
            case this.linkLabelId['industry']:
              this.commonFiltersCopy.financial = '';
              this.commonFiltersCopy.financialPlus = '';
              this.labelListIndicator = [];
              break;
            case this.linkLabelId['corp']:
              this.labelListIndustry = [];
              this.labelListIndicator = [];
              break;
            default:
              this.labelListIndicator = [];
              break;
          }
          ;
          this.delTags = [];//清空删除标签
          this.addTags = [];
          listName = 'rangePlus';
          value = value ? value : '0';

        } else {
          if (value == this.linkLabelId['bond'] || value == this.linkLabelId['forex'] || value == this.linkLabelId['derivative'] || value == this.linkLabelId['assets']) {
            this.labelListIndustry = [];
            this.delTags = [];//清空删除标签
            this.addTags = [];
          }
          ;
          listName = 'financialPlus';
          value = value ? value : '1';
        }
        ;
        if (!this.commonFiltersCopy[itemName]) {
          this.commonFiltersCopy[listName] = '';
          this.commonFiltersCopy[listName + 'Name'] = '';
        }
        ;
        this.getSubdivide(listName, value);
      }
    },
    selectChangePlus(data) {
      let typeParent = data.selecItem == 'rangePlus' ? 'range' : 'financial';
      this.commonFiltersCopy[typeParent] = data.parentId;
      /**【金融市场细分】=美股1005000085  信息地域划分联动赋值：美国（原来无此值时）
       【金融市场细分】=港股  信息地域划分联动赋值：中国香港特别行政区（原来无此值时）
       **/
      if (data.id == this.linkLabelId['american'] || data.id == this.linkLabelId['hk']) {
        let labelAmerica = {
          businessCode: "337000000",
          categoryNames: "",
          category_id: "101110337000000",
          groupInfo: "美国",
          other_obj: {business_id: "530127285238"},
          relationInfo: null,
          tag_category_ids: ["101", "101110", "101110337000000"],
          tag_categorys: ["文本标签", "地域"],
          tag_id: "101110530127285238",
          tag_value: "美国"
        };
        let labelHongkong = {
          businessCode: "144430000",
          categoryNames: "",
          category_id: "101110144430000",
          groupInfo: "中国香港特别行政区",
          other_obj: {business_id: "530127285393"},
          relationInfo: null,
          tag_category_ids: ["101", "101110", "101110144430000"],
          tag_categorys: ["文本标签", "地域"],
          tag_id: "101110530127285393",
          tag_value: "中国香港特别行政区"
        };
        this.labelListArea = [];
        let labelDataType = data.id == this.linkLabelId['american'] ? {...labelAmerica} : {...labelHongkong};
        // let repeatFlag = this.isLabelRepeat(labelDataType.other_obj.business_id);
        // this.addLabelInfoFn(labelDataType,false);
        // if(!repeatFlag){
        // 	this.addLabelInfoFn(labelDataType,false);
        // }
        let tag_category_id = labelDataType.tag_category_ids[1];
        this.addLabelType = this.findCategoryId(tag_category_id, 'addLabelType');
        this.addLabelInfo(labelDataType, false);
        this.changeLabelLight();//改变编辑器高亮
      } else {
        let changelightFlag = false;
        this.labelListArea.forEach((item, index) => {
          if (item.tagId == '101110530127285393' || item.tagId == '101110530127285238') {
            this.labelListArea.splice(index, 1);
            changelightFlag = true;
          }
        });
        if (changelightFlag) {
          this.changeLabelLight();//改变编辑器高亮
        }
      }
      ;
    },
    findParent(objectList, parentId) {
      for (i = 0; i < objectList.length; i++) {
        let o = objectList[i];
        if (o['RegionId'] == parentId) {
          parentArray.push(o)
        } else {
          childList = o['Children']
          if (childList.length > 0) {
            return findParent(childList, parentId)
          }
        }
      }
    },
    typeTreeForEach(list) {
      let treeList = [];
      list.forEach((item, i) => {
        let childrens = [];
        if (item.children && item.children.length > 0) {
          childrens = this.typeTreeForEach(item.children);
        }
        let obj = {
          id: item.typeCode,
          title: item.typeName,
          parentTypeCode: item.parentTypeCode,
          expand: item.expand,
          categoryLevel: item.categoryLevel,
          children: childrens
        };
        treeList.push(obj);
      });
      return treeList;
    },
    getSubdivide(listName, code) {
      let url = '/tm/business/gettypetreelist?code=' + code;
      return this.$http.get(url).then((res) => {
        let data = res.data;
        if (data.status == this.$api.SUCCESS) {
          this[listName] = data.body.typeTree || [];
//              	this[listName] = this.typeTreeForEach(list);
        } else {
          this.$hMessage.error({content: data.msg});
        }
      })
        .catch(err => {
          this.$hLoading.error();
        })
    },
    isLabelRepeat(addId) {
      let flag = false;
      let arrAll = this[this.addLabelType].concat(this.addTags);
      if (arrAll.length > 0) {
        arrAll.forEach((item, index) => {
          if (item.businessId == addId) {
            flag = true
          }
        });
      }
      return flag
    },
    delLabelNameHtml(myeditor, labelNameHtml, labelName) {
      var editorhtml = myeditor.getData();
      var reg = new RegExp(labelNameHtml, "gi");
      editorhtml = editorhtml.replace(reg, labelName);
      myeditor.setData(editorhtml);
    },
    handleDelLabelBatch(delArrBatch) {
      let delArr = [];
      if (delArrBatch.length == 0) return;
      for (let k = 0; k < delArrBatch.length; k++) {
        let arrDelet = delArrBatch[k].data;
        let labelArr = delArrBatch[k].findArr;
        for (let i = arrDelet.length - 1; i >= 0; i--) {
          let items = arrDelet[i];
          delArr.push(items.data);
          this.delTags = delArr;
          this.addTags = [];
          labelArr.splice(items.index, 1);
          this.operateTagsFlag = true;
        }
      }
      ;
      if (this.pageType != 'ADD') {
        this.changeLabelLight();//取消编辑器高亮
      }
      setTimeout(() => {
        this.$hMessage.success('标签已删除');
        this.delArrBatch = [];
      }, 10)
    },
    //删除标签
    handleDelLabel(labelArrType, data, index) {
      let labelNameInfo = data.tagName || '';
      let labelNameHtml = '<span class="info-label-color">' + labelNameInfo + '</span>';//匹配编辑器中标签
      let delArr = [];
      delArr.push(data);
      this.delTags = delArr;
      this.addTags = [];
      setTimeout(() => {
        this[labelArrType].splice(index, 1);
        this.operateTagsFlag = true;
        this.$hMessage.success('标签已删除');
        if (this.pageType != 'ADD') {
          this.changeLabelLight();//取消编辑器高亮
        }
      }, 10)
    },
    changeLabelLight() {//取消编辑器高亮
      let url = '/tm/news/content';
      let tags = [...this.labelListSecurity, ...this.labelListCorp, ...this.labelListIndustry, ...this.labelListConcept, ...this.labelListIndicator, ...this.labelListArea];
      this.$http.post(url, {
        newsId: this.commonFiltersCopy.newsId,
        content: this.commonFiltersCopy.content,
        tags: tags
      }).then((res) => {
        let data = res.data;
        if (data.status == this.$api.SUCCESS) {
          this.commonFiltersCopy.content = data.body.content || '';
        } else {
          this.$hMessage.error({content: data.msg})
        }
      }).catch(err => {
        this.$hLoading.error();
      })
    },
    textContent() {//咨询内容校验
      let content = this.commonFiltersCopy.content;
      if (null != content) {
        content = content.replace(/<[^>]+>|&[^>]+;/g, "").trim(); //去除HTML tag
      }
      if (!content) {
        this.$hMessage.warning({content: '资讯内容不能为空'});
        return false;
      }
      ;
      return true
    },
    handleCheckRequired() {
      let requiredItem = {
        srcPublishDate: this.commonFiltersCopy.srcPublishDate,
        dsSourceType: this.commonFiltersCopy.dsSourceType,
        mediaSourceCode: this.commonFiltersCopy.mediaSourceCode,
        mediaSource: this.commonFiltersCopy.mediaSource,
        level: this.commonFiltersCopy.level,
        title: this.commonFiltersCopy.title,
        contentText: this.commonFiltersCopy.contentText,
      };
      if (this.newsTypeCopy == '1') {
        let appIds = this.commonFiltersCopy.appIds ? this.commonFiltersCopy.appIds.join() : '';
        requiredItem.appIds = appIds;
        requiredItem.dsNewsColumns = this.commonFiltersCopy.dsNewsColumns;
      }
      ;
      Object.values(requiredItem).map((value) => {
        if (value == '' || value == null) {
          this.$hMessage.warning({content: '请补充必填项!'});
        }
      });

    },
    handleCheckAmbigulty() {
      let alltags = [...this.labelListSecurity, ...this.labelListCorp, ...this.labelListIndustry, ...this.labelListConcept, ...this.labelListIndicator, ...this.labelListArea];
      if (this.newsTypeCopy == '2') {
        alltags = [...this.labelListSecurity, ...this.labelListCorp, ...this.labelListArea];
      }
      ;
      let flag = false;
      alltags.forEach((item, index) => {
        if (item.nedType == 2) {
          flag = true;
        }
      });
      return flag;
    },
    /**公开校验**/
    handleCheckPublish() {
      if (this.isSpecialPage) {
        this.handlePublicSpecial();
        return
      }
      ;
      if (!this.textContent()) return;//资讯内容校验
      this.handleCheckRequired();//必填字段校验校验
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          /**公开校验歧义标签**/
          this.checkType = 'public';
          let ambigultyFlag = this.handleCheckAmbigulty();
          if (ambigultyFlag) {
            this.modalCheckAmbigulty = true;
          } else {
            this.handlePublic(this.pageType);
          }

        }
      })
    },
    changeDup(dupNewsId) {
      this.dupNewsId = dupNewsId
      // this.dupNewsId = dupNewsId
    },
    /**公开**/
    handlePublic(pageType) {
      let publishTip = '确定要公开该条资讯';
      if (this.commonFiltersCopy.handleStatus == 1) {
        publishTip = '该资讯已被公开过，确认再次公开？'
      }
      ;
      this.$hMsgBox.confirm({
        isOkLeft: true,
        title: '公开资讯',
        content: publishTip,
        onOk: () => {
          this.loadingArr.loadingBtnPub = true;
          let url = '/tm/news/publish';
          this.commonFiltersCopy.mainTags = this.isMainTag([...this.labelListCorp, ...this.labelListSecurity]);
          this.commonFiltersCopy.newsType = this.newsTypeCopy;
          this.commonFiltersCopy.tags = this.filterAmbiguilty();//过滤歧义标签
          if (this.newsTypeCopy == '2') {
            this.commonFiltersCopy.tags = [...this.commonFiltersCopy.tags, ...this.labelListIndustry, ...this.labelListConcept, ...this.labelListIndicator];
          }
          ;
          let saveInfo = {...this.commonFiltersCopy};
          if (pageType == 'ADD') {
            url = '/tm/news/createPublish';
            saveInfo.newsId = this.newsIdCopy;
            if (this.isSaveAs) {
              saveInfo.stdNewsId = '1';
            }
          }
          this.checkPublishInfo = {
            url: url,
            saveInfo: saveInfo,
            pageType: pageType,
          };
          if (this.isProcess) {
            saveInfo.workflowFlag = 1
          } else {
            saveInfo.workflowFlag = 2
          }
          this.doPublish(url, saveInfo, pageType);
        }
      })
    },
    publishSimilarOk() {
      this.checkCanPublish(this.checkPublishInfo.url, this.checkPublishInfo.saveInfo, this.checkPublishInfo.pageType);
      this.publishModalSimilar = false
    },
    confirmCheckFun() {
      this.modalCheckPublish = false;
      this.getLikelyNew().then(
        likeData => {
          if (likeData && likeData.length > 1) {
            // 有相似资讯
            this.publishLikeLyNews = likeData || []
            this.publishModalSimilar = true
          } else {
            this.checkCanPublish(this.checkPublishInfo.url, this.checkPublishInfo.saveInfo, this.checkPublishInfo.pageType);
          }
        }).catch(
        error => {
          this.loadingArr.loadingBtnPub = false;
          this.$hMessage.error({content: data.msg})
        })
    },
    cancelCheckFun() {
      this.modalCheckPublish = false;
      this.loadingArr.loadingBtnPub = false;
    },
    confirmAmbigultyFn() {
      if (this.checkType == 'save') {
        this.handleSaveInfo(this.pageType);
      } else {
        this.handlePublic(this.pageType);
      }

    },
    cancelAmbigultyFn() {
      this.modalCheckAmbigulty = false;
    },
    getLikelyNew() {
      this.dupNewsId = ''
      let requestUrl = '/tm/news/realTimeQueryDuplicate';
      let {
        newsId,
        contentText,
        mediaSource,
        title,
        newsUrl,
        srcPublishDate,
        dsSourceName,
      } = this.commonFiltersCopy
      let body = {
        dsSourceName: dsSourceName,
        mediaSource: mediaSource,
        content: contentText,
        id: this.pageType == 'ADD' ? "" : newsId,
        pushDate: srcPublishDate,
        title: title,
        url: newsUrl,
      }
      return new Promise((reslove, reject) => {
        // 只有主表资讯需要判断相似
        if (this.newsTypeCopy != '1') {
          reslove([])
          return
        }
        this.$http.post(requestUrl, body).then(res => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            let realTimeQueryDupDetails = data.body.realTimeQueryDupDetails
            for (let item of realTimeQueryDupDetails) {
              item.handleStatus = item.handleStatus || '未公开'
              item.contentText = this.formContentSimilarFn(item.contentText) || ''
              // item.newsId = item.newsId || '-'
              // item.titleSimilarity = item.titleSimilarity || '-'
              // item.contentSimilarity = item.contentSimilarity || '-'
            }
            reslove(realTimeQueryDupDetails)
          } else {
            this.loadingArr.loadingBtnPub = false;
            this.$hMessage.error({content: data.msg})
          }

        }).catch(err => {
          this.loadingArr.loadingBtnPub = false;
          this.$hLoading.error();
        })
      })
    },
    checkFormData(saveInfo, cb) {
      let url = '/tm/news/checkPublish';
      this.$http.post(url, saveInfo).then((res) => {
        let data = res.data;
        if (data.status == this.$api.SUCCESS) {
          this.getLikelyNew().then(
            likeData => {
              if (likeData && likeData.length > 1) {
                // 有相似资讯
                this.publishLikeLyNews = likeData || []
                this.publishModalSimilar = true
              } else {
                cb(true);
              }
            }
          ).catch(
            error => {
              this.loadingArr.loadingBtnPub = false;
              this.$hMessage.error({content: data.msg})
            }
          )
        } else if (data.status == '101') {
          this.modalCheckPublish = true;
          this.modalCheckPublishMsg = data.msg;
        } else {
          cb(false);
          this.$hMessage.error({content: data.msg})
        }
        this.loadingArr.loadingBtnPub = false;
      }).catch(err => {
        cb(false);
        this.loadingArr.loadingBtnPub = false;
        this.$hLoading.error();
      })
    },
    checkCanPublish(url, saveInfo, pageType) {
      saveInfo.dupNewsId = this.dupNewsId
      this.$http.post(url, saveInfo).then((res) => {
        let data = res.data;
        if (data.status == this.$api.SUCCESS) {
          this.$hMessage.success({content: '公开成功'});
          this.commonFiltersCopy.handleStatus = 1;
          this.commonFiltersCopy.publishStatusDesc = '公开';
          if (pageType != 'ADD') {
            setTimeout(() => {
              this.handleNextId();
            }, 500);
          } else {
            if (!this.isSaveAs) {
              this.handleEmptyItem();//清空部分内容的值
            }
          }
        } else {
          this.$hMessage.error({content: data.msg})
        }
        this.loadingArr.loadingBtnPub = false;
      }).catch(err => {
        this.loadingArr.loadingBtnPub = false;
        this.$hLoading.error();
      })
    },
    handleLock(newsId, cb) {
      let url = '/tm/news/lock?newsId=' + newsId;
      if (this.pageNumType == 1 || this.pageNumType == 2) {
        url = `/tm/news/lock?newsId=${newsId}&type=1`;
      }
      this.$http.get(url).then((res) => {
        let data = res.data;
        if (data.status == this.$api.SUCCESS) {
          cb(true);
        } else {
          this.$hMessage.error({content: data.msg});
          cb(false);
        }
        ;
      })
        .catch(err => {
          this.$hLoading.error();
        })
    },
    doPublish(url, saveInfo, pageType) {
      // 请求接口校验信息
      this.checkFormData(saveInfo, (res) => {
        if (res) {
          this.$http.post(url, saveInfo).then((res) => {
            let data = res.data;
            if (data.status == this.$api.SUCCESS) {
              this.$hMessage.success({content: '公开成功'});
              //this.commonFiltersCopy.publishType = '2';
              this.commonFiltersCopy.handleStatus = 1;
              this.commonFiltersCopy.publishStatusDesc = '公开';
              if (pageType != 'ADD') {
                setTimeout(() => {
                  this.handleNextId();
                }, 500)
              } else {
                if (!this.isSaveAs) {
                  this.handleEmptyItem();//清空部分内容的值
                }
              }
            } else {
              this.$hMessage.error({content: data.msg})
            }
            this.loadingArr.loadingBtnPub = false;
          }).catch(err => {
            this.loadingArr.loadingBtnPub = false;
            this.$hLoading.error();
          })
        } else {
          this.loadingArr.loadingBtnPub = false;
        }
      })
    },

    handleCopyDetail() {
      this.commonFiltersCopy.corpTags = this.labelListCorp;
      this.commonFiltersCopy.industryTags = this.labelListIndustry;
      this.commonFiltersCopy.conceptTags = this.labelListConcept;
      this.commonFiltersCopy.indicatorTags = this.labelListIndicator;
      this.commonFiltersCopy.secuTags = this.labelListSecurity;
      this.commonFiltersCopy.regionTags = this.labelListArea;
      this.commonFiltersCopy.mainTags = this.isMainTag([...this.labelListCorp, ...this.labelListSecurity]);
      this.commonFiltersCopy.newsType = this.newsTypeCopy;
//			this.commonFiltersCopy.srcPublishDate = this.commonFiltersCopy.srcPublishTime;
      this.commonFiltersCopy.titleShow = this.commonFiltersCopy.title;
      sessionStorage.setItem("infoDetailStorage", JSON.stringify({...this.commonFiltersCopy}));
      sessionStorage.setItem('freshSaveAsDetail', true);

      let pathURL = '';
      if (this.newsTypeCopy == '1') {
        pathURL = '/tbm/news/saveas';
      } else if (this.newsTypeCopy == '2') {
        pathURL = '/tbm/fast-news/saveas';
      }
      this.$router.push({path: pathURL});
    },
    isMainTag(corpArr) {
      let mainTags = [];
      corpArr.forEach((item, i) => {
        if (item.main == 1 || (this.commonFiltersCopy.handleStatus == 1 && item.main == 0)) {
          //第二次公开将 主体标签 main 0 和1 都要传
          mainTags.push(item);
        }
      });
      return mainTags;
    },
    filterAmbiguilty() {
      let alltags = [...this.labelListSecurity, ...this.labelListCorp, ...this.labelListIndustry, ...this.labelListConcept, ...this.labelListIndicator, ...this.labelListArea];
      if (this.newsTypeCopy == '2') {
        alltags = [...this.labelListSecurity, ...this.labelListCorp, ...this.labelListArea];//快讯页面只展示三类标签
      }
      ;
      alltags = alltags.filter((item) => {
        return item.nedType != 2;
      });
      return alltags;
    },
    /**保存/新增保存校验**/
    handleCheckSaveInfo() {
      if (this.isSpecialPage) {
        this.handleAddSaveSpecial();
        return
      }
      ;
      if (!this.textContent()) return;//资讯内容校验
      this.handleCheckRequired();//必填字段校验
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          /**公开校验歧义标签**/
          this.checkType = 'save';
          let ambigultyFlag = this.handleCheckAmbigulty();
          if (ambigultyFlag) {
            this.modalCheckAmbigulty = true;
          } else {
            this.handleSaveInfo(this.pageType)
          }
        }
      });
    },
    htmlEscape(text) {
      return text.replace(/[<>"&]/g, function (match) {
        switch (match) {
          case "<":
            return "&lt;";
          case ">":
            return "&gt;";
          case "&":
            return "&amp;";
          case "\"":
            return "&quot;";
        }
      });
    },
    handleSaveInfo(pageType) {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          this.loadingArr.loadingBtnSave = true;
          let url = '/tm/news/save';
          this.commonFiltersCopy.mainTags = this.isMainTag([...this.labelListCorp, ...this.labelListSecurity]);//主体标签
          this.commonFiltersCopy.newsType = this.newsTypeCopy;
          this.commonFiltersCopy.tags = this.filterAmbiguilty();//过滤歧义标签
          if (this.newsTypeCopy == '2') {
            this.commonFiltersCopy.tags = [...this.commonFiltersCopy.tags, ...this.labelListIndustry, ...this.labelListConcept, ...this.labelListIndicator];
          }
          let saveInfo = {...this.commonFiltersCopy};
          if (pageType == 'ADD' && !this.newsIdAddSave) {
            url = '/tm/news/create';//初次保存
            saveInfo.copyrightStatus = 0;
          } else if (pageType == 'ADD' && this.newsIdAddSave) {
            saveInfo.newsId = this.newsIdAddSave;//保存之后调用修改保存接口
            saveInfo.handleStatus = 0;//默认为0
          }
          ;
          this.$http.post(url, saveInfo).then((res) => {
            let data = res.data
            if (data.status == this.$api.SUCCESS) {
              if (pageType == 'ADD') {
                if (!this.newsIdAddSave) {
                  this.newsIdCopy = data.body.newsId;//保存成功后，再公开需要newsId
                  this.newsIdAddSave = data.body.newsId;
                } else {
                  this.newsIdCopy = this.newsIdAddSave;
                }
              }
              ;
              this.$hMessage.success({content: '保存成功'});
            } else {
              this.$hMessage.error({content: data.msg})
            }
            this.loadingArr.loadingBtnSave = false;
          }).catch(err => {
            this.loadingArr.loadingBtnSave = false;
            this.$hLoading.error();
          })
        }
      });
    },
    handleEmptyItem() {
      let requiredItemKeys = ['newsType', 'appIds', 'publishStatusDesc', 'srcPublishDate', 'dsSourceType', 'dsSourceName', 'dsNewsColumns', 'mediaSourceCode', 'mediaSource', 'level', 'layoutNumber', 'layoutInfo'];
      let minuskeys = Object.keys(this.commonFiltersCopy).filter((item) => {
        return requiredItemKeys.indexOf(item) < 0;
      });
      minuskeys.forEach((itemKey, i) => {
        if (this.commonFiltersCopy[itemKey]) {
          this.commonFiltersCopy[itemKey] = '';//新建保存/公开后，清空非必填项
          if (itemKey == 'tags') {
            this.commonFiltersCopy[itemKey] = [];
          }
        }
      });
      this.labelListCorp = [];
      this.labelListIndustry = [];
      this.labelListConcept = [];
      this.labelListIndicator = [];
      this.labelListSecurity = [];
      this.labelListArea = [];
      this.addTags = [];//添加标签缓存清空（判断重复）
      //this.commonFiltersCopy.publishType = '1';
      this.commonFiltersCopy.handleStatus = 0;
      this.commonFiltersCopy.publishStatusDesc = '未公开';
      this.newsIdCopy = '';
      this.newsIdAddSave = '';//公开成功后重新新建
      setTimeout(() => {
        this.$refs['formInline'].resetValidateField('title');
        this.$refs['formInline'].resetValidateField('contentText');
      }, 10);
    },
    handlePreIdView(newsIdLists) {
      let currentIndex = newsIdLists.indexOf(this.newsIdCopy);
      if (currentIndex == 0 || currentIndex == -1) {
        this.$hMessage.warning({content: '没有上一条了!'});
      } else if (currentIndex != -1) {
        let nextNewsId = newsIdLists[currentIndex - 1];
        this.$emit('toPreDetail', nextNewsId);
      }
    },
    handlePreIdEdit() {
      let saveObj = {
        currentNewsId: this.newsIdCopy
      };
      let searchDataObj = this.newsTypeCopy == '1' ? JSON.parse(sessionStorage.getItem("searchData")) : JSON.parse(sessionStorage.getItem("searchDataFast"));
      if (this.isProcess) {
        searchDataObj = this.newsTypeCopy == '1' ? JSON.parse(sessionStorage.getItem("searchDataProcess")) : JSON.parse(sessionStorage.getItem("searchDataProcessFast"));//获取列表页缓存查询条件
      }
      ;
      let url = '/tm/news/last';
      this.$http.post(url, {...saveObj, ...searchDataObj}).then((res) => {
        let data = res.data;
        if (data.status == this.$api.SUCCESS) {
          let newsId = data.body.newsId || '';
          this.$emit('toPreDetail', newsId);
          // this.handleLock(newsId,(res)=>{
          // 	if(res){
          // 		this.$emit('toPreDetail',newsId);
          // 	}
          // });

        } else if (data.status == 101) {
          this.$hMessage.warning({content: data.msg})
        } else {
          this.$hMessage.error({content: data.msg})
        }
//				this.loadingArr.loadingBtnPre = false;
      }).catch(err => {
        this.$hLoading.error();
//					this.loadingArr.loadingBtnPre = false;
      })
    },
    handlePreId() {
      if (this.isSpecialPage) {
        this.handlePreIdSpecial();
        return
      }
      ;
      if (this.pageType == 'VIEW') {
        this.handlePreIdView(this.newsIdLists)
      } else {
        if (this.newsTypeCopy == '1' && this.pageType == 'HANDLE') {
          if (this.detailIsChange) {
            this.$hMsgBox.confirm({
              title: "温馨提示",
              content: "已公开过资讯再次编辑只能公开，退出后修改内容不会被保存",
              onOk: () => {
                this.handlePreIdEdit();
              },
            });
          } else {
            this.handlePreIdEdit();
          }
        } else {
          this.handlePreIdEdit();
        }
      }
    },
    discardFn() {
      this.$hMsgBox.confirm({
        isOkLeft: true,
        title: '放弃任务',
        content: '确定要放弃任务?',
        onOk: () => {
          let newsId = this.newsIdCopy.split();
          let url = '/tm/news/discard?newsId=' + newsId + '&newsType=' + this.newsTypeCopy;
          this.$http.get(url).then((res) => {
            let data = res.data;
            if (data.status == this.$api.SUCCESS) {
              this.handleNextId();
            } else {
              this.$hMessage.error({content: data.msg})
            }
          }).catch(err => {
            this.$hLoading.error();

          })
        },
      })
    },
    getEditNextIds() {
      let searchDataObj = this.newsTypeCopy == '1' ? JSON.parse(sessionStorage.getItem("searchData")) : JSON.parse(sessionStorage.getItem("searchDataFast"));
      let url = '/tm/news/nextList';
      this.$http.post(url, {
        ids: this.newsIdLists,
        newsId: this.newsIdCopy,
        handleStatus: searchDataObj.handleStatus || '',
        viewFlag: this.pageType == 'HANDLE' ? '0' : '1',//查看页跳转不加锁
        appIds: searchDataObj.appIds || ''
      }).then((res) => {
        let data = res.data;
        if (data.status == this.$api.SUCCESS) {
          this.newsIdLists = data.body.ids || [];
          let nextNewsId = data.body.newsId || '';
          if (nextNewsId) {
            if (this.pageType == 'HANDLE') {
              this.$emit('toNextDetail', nextNewsId)
              // this.handleLock(nextNewsId,(res)=>{
              // 	if(res){
              // 		this.$emit('toNextDetail',nextNewsId)
              // 	}
              // });
            } else {
              this.$emit('toNextDetail', nextNewsId)
            }

          }
        } else {
          this.$hMessage.error({content: data.msg});
        }
      }).catch(err => {
        this.$hLoading.error();
      })
    },
    getPreNextIds() {
      let searchDataObj = this.newsTypeCopy == '1' ? JSON.parse(sessionStorage.getItem("searchData")) : JSON.parse(sessionStorage.getItem("searchDataFast"));
      if (this.isProcess) {
        searchDataObj = this.newsTypeCopy == '1' ? JSON.parse(sessionStorage.getItem("searchDataProcess")) : JSON.parse(sessionStorage.getItem("searchDataProcessFast"));//获取列表页缓存查询条件
      }
      ;

      if (!searchDataObj) return;
      let url = '/tm/news/getNewsIdList';
      this.$http.post(url, {...searchDataObj}).then((res) => {
        let data = res.data;
        if (data.status == this.$api.SUCCESS) {
          this.newsIdLists = data.body.newsIdList || [];
        } else {
          this.$hMessage.error({content: data.msg})
        }
      }).catch(err => {
        this.$hLoading.error();
      })
    },
    /*处理资讯后自动跳转*/
    handleNextIdEdit() {
      this.loadingArr.loadingBtnNext = true;
      let searchDataObj = this.newsTypeCopy == '1' ? JSON.parse(sessionStorage.getItem("searchData")) : JSON.parse(sessionStorage.getItem("searchDataFast"));
      if (this.isProcess) {
        searchDataObj = this.newsTypeCopy == '1' ? JSON.parse(sessionStorage.getItem("searchDataProcess")) : JSON.parse(sessionStorage.getItem("searchDataProcessFast"));//获取列表页缓存查询条件
      }
      ;

      let saveObj = {currentNewsId: this.newsIdCopy};
      let url = '/tm/news/next';
      this.$http.post(url, {...saveObj, ...searchDataObj}).then((res) => {
        let data = res.data;
        if (data.status == this.$api.SUCCESS) {
          let newsId = data.body.newsId || '';
          this.$emit('toNextDetail', newsId)
          // this.handleLock(newsId,(res)=>{
          // 	if(res){
          // 		this.$emit('toNextDetail',newsId)
          // 	}
          // });

        } else if (data.status == 101) {
          this.$hMessage.warning({content: data.msg})
        } else {
          this.$hMessage.error({content: data.msg})
        }
        this.loadingArr.loadingBtnNext = false;
      }).catch(err => {
        this.$hLoading.error();
        this.loadingArr.loadingBtnNext = false;
      })
    },
    handleNextId(isButton = false) {
      if (this.isSpecialPage) {
        this.handleNextIdSpecial();
        return
      }
      ;
      /*查看页下一条按钮跳转*/
      if (this.pageType == 'VIEW' || (this.pageType == 'HANDLE' && !this.isProcess)) {
        if (isButton && this.detailIsChange) {
          this.$hMsgBox.confirm({
            title: "温馨提示",
            content: "已公开过资讯再次编辑只能公开，退出后修改内容不会被保存",
            onOk: () => {
              this.getEditNextIds();
            },
          });
        } else {
          this.getEditNextIds()//编辑页下一条
        }
      } else {
        if (isButton && this.detailIsChange) {
          this.$hMsgBox.confirm({
            title: "温馨提示",
            content: "已公开过资讯再次编辑只能公开，退出后修改内容不会被保存",
            onOk: () => {
              this.handleNextIdEdit();
            },
          });
        } else {
          this.handleNextIdEdit();//进入流程下一条
        }
      }
    },
    handleAllLabelFn() {//一键打标函数
      if (!this.textContent()) return;
      if (!this.commonFiltersCopy.title) {
        this.$hMessage.warning({content: '标题不能为空！'});
        return
      }
      ;
      this.$hMsgBox.confirm({
        isOkLeft: true,
        title: '一键打标',
        content: '【一键打标】后，相关标签将被新建或覆盖，请确认是否继续？',
        onOk: () => {
          this.$http.post('/tm/news/identifiedTags', {
            dsCode: this.commonFiltersCopy.dsCode || '',
            content: this.commonFiltersCopy.content,
            title: this.commonFiltersCopy.title
          }).then((res) => {
            let data = res.data;
            if (data.status == this.$api.SUCCESS) {
              let infoLabelList = data.body || {};
              this.commonFiltersCopy.content = data.body.content || '';
              if (this.commonFiltersCopy.titleShow) {
                this.commonFiltersCopy.titleShow = data.body.titleShow.replace(/ /g, '&nbsp;').replace(/d&nbsp;class/g, 'd class'); //匹配标题中的空格
              }
              ;
              this.addTags = [];//清空缓存
              this.getLabelListsAll(infoLabelList, false);
              this.$hMessage.success({content: '一键打标完成！'});
            } else {
              this.$hMessage.error({content: data.msg})
            }
          }).catch(err => {
            this.$hLoading.error();
          })
        }
      })

    },
    handleOverProcessFn() {
      this.$store.commit("DEL_TAB", this.$route.path);
      if (this.newsTypeCopy == '1') {
        this.$router.push({path: '/tbm/news/list'});
      } else {
        this.$router.push({path: '/tbm/fast-news/index'});
      }
    },
    // handleOverProcessFn(){
    // 	let url = '/tm/news/back?newsId='+this.newsIdCopy;
    // 	this.$http.get(url).then((res) => {
    //     	let data = res.data;
    //         if(data.status == this.$api.SUCCESS){
    //         	this.$store.commit("DEL_TAB", this.$route.path);
    //         	if(this.newsTypeCopy == '1'){
    //         		this.$router.push({ path: '/tbm/news/list'});
    //         	}else{
    //         		this.$router.push({ path:'/tbm/fast-news/index'});
    //         	};

    //         }else{
    //             this.$hMessage.error({content: data.msg})
    //         }
    //     }).catch(err=>{
    //         this.$hLoading.error();
    //     })
    // },
    handleCopy() {
      this.$router.push({path: '/tbm/news/copydetail'});
    },
    /*专题选择变更所属项目*/
    changeSpecialName() {
      let themeId = this.commonFiltersCopy.themeId;
      if (themeId) {
        this.getAppIdBySpecialName(themeId);
        if (themeId == '32') {
          this.commonFiltersCopy.special = true;//是否显示意见类型
          this.commonFiltersCopy.opinionList = [...this.opinionListComment];//股市评论
        } else if (themeId == '23') {
          this.commonFiltersCopy.special = true;//是否显示意见类型
          this.commonFiltersCopy.opinionList = [...this.opinionListRecommend];//个股推荐
        } else {
          this.commonFiltersCopy.special = false;
        }
      }
    },
    getAppIdBySpecialName(themeId) {
      let url = '/tm/getAppsMap?themeId=' + themeId;
      this.$http.get(url).then((res) => {
        let data = res.data;
        if (data.status == this.$api.SUCCESS) {
          this.commonFiltersCopy.appIds = data.body.appNames || '';
          this.commonFiltersCopy.appIdsCopy = data.body.appIds || '';
        } else {
          this.$hMessage.error({content: data.msg})
        }
      }).catch(err => {
        this.$hLoading.error();
      })
    },
    /**专题公开**/
    handlePublicSpecial() {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          let publistTip = '确定要公开该条专题资讯?';
          if (this.commonFiltersCopy.publishStatus == '1') {
            publistTip = '该专题资讯已被公开过，确认再次公开？'
          }
          this.$hMsgBox.confirm({
            isOkLeft: true,
            title: '公开专题资讯',
            content: publistTip,
            onOk: () => {
              this.detailLoading = true;
              this.loadingArr.loadingBtnPub = true;
              let saveInfo = {};
              let url = '/tm/publishThemeNews';

              saveInfo.themeId = this.commonFiltersCopy.themeId;
              saveInfo.titleImgLink = this.commonFiltersCopy.titleImgLink;
              saveInfo.opinionType = this.commonFiltersCopy.opinionType;
              saveInfo.conclusion = this.commonFiltersCopy.conclusion;
              saveInfo.appIds = this.commonFiltersCopy.appIdsCopy;
              saveInfo.author = this.commonFiltersCopy.author;//股市评论和个股评论时校验
              saveInfo.authorOrg = this.commonFiltersCopy.authorOrg;//股市评论和个股评论时校验
              if (this.pageType == "SPECIALADD") {
                saveInfo.newsId = this.commonFiltersCopy.newsId;
                if (this.newsIdAddSpecial) {
                  saveInfo.id = this.newsIdAddSpecial;
                }
              } else {
                saveInfo.id = this.commonFiltersCopy.id;
              }
              this.$http.post(url, saveInfo).then((res) => {
                let data = res.data
                if (data.status == this.$api.SUCCESS) {
                  this.$hMessage.success({content: '公开成功'});
                  this.commonFiltersCopy.publishStatus = '2';
                  this.commonFiltersCopy.publishStatusDesc = '公开';
                  this.$emit('updateNewsId', saveInfo.newsId, saveInfo.themeId);//下次进入页面时自动刷新
                  this.newsIdAddSpecial = '';
                  if (this.pageType == "SPECIALADD") {
                    this.addPublic = true;
                    this.$emit('closePublishDetail');
                  } else {
                    this.handleNextId();
                  }
                } else {
                  this.$hMessage.error({content: data.msg})
                }
                ;
                this.loadingArr.loadingBtnPub = false;
                this.detailLoading = false;
              }).catch(err => {
                this.loadingArr.loadingBtnPub = false;
                this.detailLoading = false;
                this.$hLoading.error();
              })
            }
          })
        }
      })

    },
    handleAddSaveSpecial() {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          this.loadingArr.loadingBtnSave = true;
          this.detailLoading = true;
          let saveInfo = {};
          let url = '';
          if (this.pageType == "SPECIALADD") {
            url = '/tm/createSaveThemeNewsInfo';
            saveInfo.newsId = this.commonFiltersCopy.newsId;
          } else {
            url = '/tm/editSaveThemeNewsInfo';
            saveInfo.id = this.commonFiltersCopy.id;
          }
          ;
          saveInfo.themeId = this.commonFiltersCopy.themeId;
          saveInfo.titleImgLink = this.commonFiltersCopy.titleImgLink;
          saveInfo.opinionType = this.commonFiltersCopy.opinionType;
          saveInfo.conclusion = this.commonFiltersCopy.conclusion;
          saveInfo.appIds = this.commonFiltersCopy.appIdsCopy;
          this.$http.post(url, saveInfo).then((res) => {
            let data = res.data
            if (data.status == this.$api.SUCCESS) {
              if (this.pageType == "SPECIALADD") {
                this.newsIdAddSpecial = data.body.id || '';
              }
              this.$emit('updateNewsId', this.commonFiltersCopy.newsId, saveInfo.themeId);//下次进入页面时自动刷新
              this.$hMessage.success({content: '保存成功'});
            } else {
              this.$hMessage.error({content: data.msg});
            }
            ;
            this.loadingArr.loadingBtnSave = false;
            this.detailLoading = false;
          }).catch(err => {
            this.$hLoading.error();

            this.loadingArr.loadingBtnSave = false;
            this.detailLoading = false;
          })
        }
      })
    },
    handlePreIdSpecial() {
      this.detailLoading = true;
//			this.loadingArr.loadingBtnPre = true;
      let saveObj = {
        id: this.commonFiltersCopy.id,
        lock: this.pageType == 'SPECIALVIEW' ? false : true
      };
      let searchDataObj = JSON.parse(sessionStorage.getItem("searchDataSpecial"));//获取列表页缓存查询条件
      let url = '/tm/getPreviousThemeNews';
      this.$http.post(url, {...saveObj, ...searchDataObj}).then((res) => {
        let data = res.data;
        if (data.status == this.$api.SUCCESS) {
          let commonFilters = data.body || {};
          this.getSpecialDetailItem(commonFilters);
          let pathUrl = '/tbm/special-news/handle/edit';
          if (this.pageType == 'SPECIALVIEW') {
            pathUrl = '/tbm/special-news/handle/view';
            this.$router.push({
              path: pathUrl,
              query: {newsId: commonFilters.newsId, themeId: commonFilters.themeId, id: commonFilters.id}
            });
          } else {
            this.$router.push({
              path: pathUrl,
              query: {newsId: commonFilters.newsId, themeId: commonFilters.themeId, id: commonFilters.id}
            });
          }
        } else if (data.status == 101) {
          this.$hMessage.warning({content: data.msg})
        } else {
          this.$hMessage.error({content: data.msg})
        }
//				this.loadingArr.loadingBtnPre = false;
        this.detailLoading = false;
      }).catch(err => {
        this.$hLoading.error();
//					this.loadingArr.loadingBtnPre = false;
        this.detailLoading = false;
      })
    },
    handleNextIdSpecial() {
      this.detailLoading = true;
      this.loadingArr.loadingBtnNext = true;
      let saveObj = {
        id: this.commonFiltersCopy.id,
        lock: this.pageType == 'SPECIALVIEW' ? false : true
      };
      let searchDataObj = JSON.parse(sessionStorage.getItem("searchDataSpecial"));//获取列表页缓存查询条件
      let url = '/tm/getNextThemeNews';
      this.$http.post(url, {...saveObj, ...searchDataObj}).then((res) => {
        let data = res.data;
        if (data.status == this.$api.SUCCESS) {
          let commonFilters = data.body || {};
          this.getSpecialDetailItem(commonFilters);
          let pathUrl = '/tbm/special-news/handle/edit';
          if (this.pageType == 'SPECIALVIEW') {
            pathUrl = '/tbm/special-news/handle/view';
            this.$router.push({
              path: pathUrl,
              query: {newsId: commonFilters.newsId, themeId: commonFilters.themeId, id: commonFilters.id}
            });
          } else {
            this.$router.push({
              path: pathUrl,
              query: {newsId: commonFilters.newsId, themeId: commonFilters.themeId, id: commonFilters.id}
            });
          }
          ;

        } else if (data.status == 101) {
          this.$hMessage.warning({content: data.msg})
        } else {
          this.$hMessage.error({content: data.msg})
        }
        this.loadingArr.loadingBtnNext = false;
        this.detailLoading = false;
      }).catch(err => {
        this.$hLoading.error();
        this.loadingArr.loadingBtnNext = false;
        this.detailLoading = false;
      })
    },
    handleSimilarNews() {
      this.modalSimilar = true;
    },
    handleDeletSpecial() {
      this.loadingBtnDel = true;
      this.$hMsgBox.confirm({
        isOkLeft: true,
        title: '删除',
        content: '确定要删除该条专题资讯:' + this.commonFiltersCopy.id + '?',
        onOk: () => {
          let IdArr = this.commonFiltersCopy.id.split();
          let url = '/tm/deleteThemeNews';
          this.$http.post(url, IdArr).then((res) => {
            let data = res.data;
            if (data.status == this.$api.SUCCESS) {
              this.$hMessage.success({content: '删除成功'});
              this.handleNextIdSpecial();
            } else {
              this.$hMessage.error({content: data.msg})
            }
            this.loadingBtnDel = false;
          }).catch(err => {
            this.$hLoading.error();
            this.loadingBtnDel = false;
          })
        }
      })

    },
    handleDelet() {
      if (this.isSpecialPage) {
        this.handleDeletSpecial();
        return
      }
      ;
      this.loadingBtnDel = true;
      this.$hMsgBox.confirm({
        isOkLeft: true,
        title: '删除资讯',
        content: '确定要删除该条资讯:' + this.newsIdCopy + '?',
        onOk: () => {
          let url = '/tm/news/deleteOne?newsId=' + this.newsIdCopy;
          this.$http.get(url).then((res) => {
            let data = res.data;
            if (data.status == this.$api.SUCCESS) {
              this.$hMessage.success({content: '删除成功'});
              this.$emit('updateNewsId', this.newsIdCopy);//下次进入页面时自动刷新
              this.handleNextId();
            } else {
              this.$hMessage.error({content: data.msg})
            }
            this.loadingBtnDel = false;
          }).catch(err => {
            this.$hLoading.error();
            this.loadingBtnDel = false;
          })
        }
      })

    },
    handleView(name) {
      window.open(this.commonFiltersCopy.titleImgLink)
    },
    handleClearImg() {
      this.$hMsgBox.confirm({
        isOkLeft: true,
        title: '删除标题图片',
        content: '确定要删除该图片?',
        onOk: () => {
          this.commonFiltersCopy.titleImgLink = '';
        }
      })
    },
    confirmCheckImg() {
      this.commonFiltersCopy.titleImgLink = this.titleImgLinkSelect;
    },
    getImageName(fileName) {
      this.titleImgLinkSelect = fileName;
    },
    loadingImg(flag) {
      this.modalSelectImgLoading = flag
    },
    showImgModal() {
      this.modalSelectImg = true;
      this.modalSelectImgLoading = true;
      let url = '/tm/news/allDir?fileName=NewsPic';
      this.$http.get(url).then((res) => {
        let data = res.data;
        if (data.status == this.$api.SUCCESS) {
          this.imgDataFile = data.data || [];
        }
        ;
        this.modalSelectImgLoading = false;
      }).catch(err => {
        this.$hLoading.error();
        this.modalSelectImgLoading = false;
      })

    },
    handleMainLabel(labelName, operateFlag) {
      let flag = false;
      for (let i = 0, len = this.labelListCorp.length; i < len; i++) {
        let item = this.labelListCorp[i];
        let regTest = new RegExp(labelName.trim(), "gi");
        let synonym = item.synonym ? item.synonym.join() : '';
        if (regTest.test(item.tagName) || regTest.test(synonym)) {
          flag = true;//企业标签列表找到匹配标签
          item.main = operateFlag;
          break;
        }
      }
      ;
      if (!flag || (this.labelListCorp.length == 0)) {
        this.$hMessage.warning({content: '未找到匹配的企业标签！'});
      }
    },
    handleAddLabel(addLabelType) {
      this.addLabelType = addLabelType;
      this.modalAddLabel = true;
      this.modalAdd.categoryId = '';
      this.modalAdd.tagValue = '';
      this.getLabelList();//获取添加标签分类
      this.labelTableList = [];
    },
    labelCheckFn(labelName) {
      let flag = false;
      let findArr = [...this.labelListSecurity, ...this.labelListCorp, ...this.labelListIndustry, ...this.labelListConcept, ...this.labelListIndicator, ...this.labelListArea];
      if (findArr.length == 0) return flag;//被查找的标签
      let arrCheck = [];//要删除的标签
      for (let i = 0, len = findArr.length; i < len; i++) {
        let item = findArr[i];
        let synonym = item.synonym ? item.synonym.join().toLowerCase() : '';
        let relationInfo = item.relationInfo.toLowerCase();
        let tagName = item.tagName.toLowerCase();
        labelName = labelName.toLowerCase().replace(/\s/g, '');
        if (tagName && tagName.indexOf(labelName) != -1 || synonym && synonym.indexOf(labelName) != -1 || relationInfo && relationInfo.indexOf(labelName) != -1) {
          arrCheck.push(item);
          flag = true;
        }
        ;
      }
      ;
      this.checkArrBatch = arrCheck;
      return flag;
    },
    handleParagraphFormat(editor) {
      var myeditor = editor;
      var editorhtml = editor.getData();
      if (myeditor.mode == "wysiwyg") {
        var tempimg = new Array();
        var temptable = new Array();
        var tempobject = new Array();
        var isPart = false; //暂时无法实现局部格式化
        if (!isPart) {
          var tmpDiv = document.createElement("DIV");
          var editorhtml = myeditor.getData();
//	                editorhtml = editorhtml.replace(/&nbsp;/ig,'').replace(/\s/g,' ').replace(/\<div>/g, "<div class='paragraphFormat'>").replace(/\<[p|P]>/g, "<p class='paragraphFormat'>");
//	                editorhtml = editorhtml.replace(/<div style="page-break-after: always;?">\s*<span style="display: none;?">&nbsp;<\/span>\s*<\/div>/gi, '<p>[page]</p>');  //将div span标签替换为p 标签
          // .replace(/\s/gi, ' ')
          // .replace(/\ {2,}/gi,'')
          editorhtml = editorhtml.replace(/&nbsp;/gi, '').replace(/\s{2,}/gi, '').replace(/<div/gi, '<p').replace(/<\/div/gi, '</p').replace(/<br \/>/gi, '</p><p>').replace(/\<[p|P]>/g, "<p class='paragraphFormat'>");     //移除空格标签，div替换为p标签。
          tmpDiv.innerHTML = editorhtml;
          if (window.navigator.userAgent.toLowerCase().indexOf("msie") > 0) {
            tmpDiv.innerHTML = tmpDiv.innerHTML.replace(/<\/p>/gi, '<br /><\/p>');      //每个段落相隔一行
          }
          var html = this.processFormatText(tmpDiv.innerHTML);
          while (html.indexOf("</p></p>") != -1) html = html.replace("</p></p>", "</p>");
          while (html.indexOf('<p><p align="center">') != -1) html = html.replace('<p><p align="center">', '<p align="center">');
          html = html.replace(/<p><\/p>/gi, '').replace(/<p class="paragraphFormat"><\/p>/gi, '')
            .replace(/<p class="paragraphFormat">&nbsp;<\/p>/gi, '').replace(/<p class="paragraphFormat"> <\/p>/gi, '').replace(/<div><\/div>/gi, '').replace(/<p>&nbsp;<\/p>/gi, '').replace(/<([a-z]+?)(?:\s+?[^>]*?)?>\s*?<\/\1>/gi, '')
          myeditor.setData(html);
        }
      }
    },
    processFormatText(textContext) {
      var text = this.dbc2Sbc(textContext);
      var tmps = text.split("\n");
      var html = "";
      for (var i = 0; i < tmps.length; i++) {
        var tmp = tmps[i].trim();
        var reg = /#Format[A-Za-z]+_\d+#/gi;
        var f = reg.exec(tmp);
        if (f != null) {
          tmp = tmp.replace(/#Format[A-Za-z]+_\d+#/gi, '');
          html += f;
          if (tmp != "")
            html += "<p align=\"center\">" + tmp + "</p>\n";
        } else {
          html += tmp;
        }
      }
      return html;
    },
    dbc2Sbc(str) {
      var result = '';
      for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        // “65281”是“！”，“65373”是“｝”，“65292”是“，”。不转换"，"

        if (code >= 65281 && code < 65373 && code != 65292 && code != 65306) {
          //  “65248”是转换码距
          result += String.fromCharCode(str.charCodeAt(i) - 65248);
        } else {
          result += str.charAt(i);
        }
      }
      return result;
    },
    getViewDetail() {
      this.commonFiltersCopy.appIds = this.commonFiltersCopy.appName.join();
      this.commonFiltersCopy.dsSourceType = this.commonFiltersCopy.dsSourceName;
      this.commonFiltersCopy.sentimentLabel = this.commonFiltersCopy.sentimentsName;
      this.commonFiltersCopy.level = this.commonFiltersCopy.levelName;
      this.commonFiltersCopy.title = this.commonFiltersCopy.titleShow;
      this.commonFiltersCopy.areaCode = this.commonFiltersCopy.areaName;
      this.commonFiltersCopy.financial = this.commonFiltersCopy.financialName;
      this.commonFiltersCopy.financialPlus = this.commonFiltersCopy.financialPlusName;
      this.commonFiltersCopy.tradingMarket = this.commonFiltersCopy.tradingMarketName;
      this.commonFiltersCopy.form = this.commonFiltersCopy.formName;
      this.commonFiltersCopy.range = this.commonFiltersCopy.rangeName;
      this.commonFiltersCopy.rangePlus = this.commonFiltersCopy.rangePlusName;
    },
    getSpecialDetailItem(commonFilters) {
      this.$emit('updateNewsId', commonFilters.newsId, commonFilters.themeId);//更新资讯id、专题id，下次进入页面时自动刷新
      this.isSpecailPage = true;
      this.newsTypeCopy = commonFilters.newsType;
      if (commonFilters.titleShow) {
        commonFilters.titleShow = commonFilters.titleShow.replace(/ /g, '&nbsp;').replace(/d&nbsp;class/g, 'd class'); //匹配标题中的空格
      }
      ;
      commonFilters.sensitives = commonFilters.sensitiveWords;
      // commonFilters.dsSourceType = commonFilters.dsSourceName;
      commonFilters.sentimentLabel = commonFilters.sentimentsName;
      commonFilters.remark = stringToArray(commonFilters.remark);
      commonFilters.level = commonFilters.levelName;
      commonFilters.title = commonFilters.titleShow;
      commonFilters.areaCode = commonFilters.areaName;
      commonFilters.authorOrgCode = commonFilters.authorOrgName;
      commonFilters.financial = commonFilters.financialName;
      commonFilters.financialPlus = commonFilters.financialPlusName;
      commonFilters.tradingMarket = commonFilters.tradingMarketName;
      commonFilters.form = commonFilters.formName;
      commonFilters.range = commonFilters.rangeName;
      commonFilters.rangePlus = commonFilters.rangePlusName;
      commonFilters.appIdsCopy = commonFilters.appIds;
      commonFilters.appIds = commonFilters.appName;
      if (commonFilters.themeId == '32') {
        commonFilters.opinionList = this.opinionListComment;//股市评论
      } else if (commonFilters.themeId == '23') {
        commonFilters.opinionList = this.opinionListRecommend;//个股推荐
      }
      this.getLabelListsAll(commonFilters);
      this.commonFiltersCopy = {...commonFilters};
      this.formContentTextFn();//专题上一条、下一条格式化纯文本
      this.remoteMethodDsSource(commonFilters.dsSourceName)
    },
    getLabelListsAll(commonFilters, updateflag = true) {
      this.labelListSecurity = commonFilters.secuTags || [];
      this.labelListCorp = commonFilters.corpTags || [];
      this.labelListIndustry = commonFilters.industryTags || [];
      this.labelListConcept = commonFilters.conceptTags || [];
      this.labelListIndicator = commonFilters.indicatorTags || [];
      if (updateflag) {
        this.labelListArea = commonFilters.regionTags || [];
        this.commonFiltersCopy = {...commonFilters};
      } else {
        if (commonFilters.regionTags.length > 0) {
          this.labelListArea = commonFilters.regionTags || [];//地域标签存在
        }
        ;
        //this.changeLabelLight();
      }
      ;
    },
    findSelectBaseData(arr) {
      arr.forEach((item, index) => {
        if (item.id && this.categoryId[this.addLabelType] == item.id) {
          this.selectBaseData = [{...item}];
        }
      });
      return this.selectBaseData;
    },
    getLabelList() {
      this.modalAdd.modalLoading = true;
      let url = '/tm/queryTagCategory?appId=' + this.$api.APPID.JINTAN + '&newsType=' + this.newsTypeCopy;
      this.$http.get(url).then((res) => {
        let data = res.data;
        if (data.status == this.$api.SUCCESS) {
          let obj = data.body || {};
          let selectBaseDataAll = [...obj.children] || [];
          if (this.addLabelType == '') {
            this.selectBaseData = selectBaseDataAll;//编辑器右键快捷添加
          } else {
            this.selectBaseData = this.findSelectBaseData(selectBaseDataAll);
          }
          this.findSelectBaseData(selectBaseDataAll);
        } else {
          this.$hMessage.error({content: data.msg})
        }
        this.modalAdd.modalLoading = false;
      }).catch(err => {
        this.modalAdd.modalLoading = false;
        this.$hLoading.error();
      })
    },
    addLabelInfoFn(addInfo, msg = true) {
      let tag_category_id = addInfo.tag_category_ids[1];
      this.addLabelType = this.findCategoryId(tag_category_id, 'addLabelType');
      let repeatFlag = this.isLabelRepeat(addInfo.other_obj.business_id);
      if (repeatFlag) {
        if (msg) {
          this.$hMessage.error({content: '标签列表已存在，请勿重复添加！'});
        }
        ;
      } else {
        this.addLabelInfo(addInfo, msg);
      }
    },
    addLabelInfo(addInfo, msg = true) {
      let addobj = {
        businessCode: addInfo.businessCode,
        businessId: addInfo.other_obj.business_id,
        categoryCode: addInfo.category_id,
        categoryName: addInfo.tag_categorys,
        categoryNames: addInfo.categoryNames,
        id: "",
        synonym: [],
        tagId: addInfo.tag_id,
        tagName: addInfo.tag_value,
        tagWeight: "1.0",
        relationInfo: addInfo.relationInfo,
        nedType: 0
      };
      if (this.addLabelType == 'labelListCorp' || this.addLabelType == 'labelListSecurity') {
        addobj.main = 0;
      }
      ;
      this.addTags = [{...addobj}];
      this[this.addLabelType] = copyDeep(this[this.addLabelType].concat(this.addTags));
      if (msg) {
        this.$hMessage.success('添加成功');
        if (this.pageType != 'ADD') {
          this.changeLabelLight();//取消编辑器高亮
        }
      }
      ;
    },
    changeMediaSourceInputFn(currentInput) {
      this.$store.dispatch('allSourceList')
      for (let i = 0, len = this.sourceList.length; i < len; i++) {
        if (this.sourceList[i].label == currentInput) {
          this.commonFiltersCopy.mediaSourceCode = this.sourceList[i].value;
          break;
        } else {
          this.commonFiltersCopy.mediaSourceCode = '500000000';
        }
      }
    },
    selectCategory(data) {
      if (data.length > 0) {
        this.modalAdd.categoryName = data[0].title || '';
        this.modalAdd.categoryId = data[0].id || '';
        this.addLabelType = this.findCategoryId(data[0].id, 'addLabelType');
      }
    },
    /*自动填充资讯内容*/
    onBlurContentText(currentInput) {
      if (this.newsTypeCopy == '2' && this.pageType == 'ADD') {
        var tmps = currentInput ? currentInput.split("\n") : [];
        var html = "";
        for (var i = 0; i < tmps.length; i++) {
          let tmp = tmps[i].replace(/\s/g, '&nbsp');
          html += "<p>" + tmp + "</p>\n";
        }
        ;
        this.commonFiltersCopy.content = html;
      }
    },
    onChangeInputEnter(value) {
      this.pagination.current = 1;
      this.searchLabelTabList();
    },
    handleSearchLabel() {
      this.pagination.current = 1;
      this.searchLabelTabList();
    },
    shitClearableClick(value) {
      this.modalAdd[value] = '';
    },
    onPageChange(current) {
      this.pagination.current = current;
      this.searchLabelTabList();
    },
    searchLabelTabList() {
      this.loadingLabelTab = true;
      let url = '/tm/queryTagsByTagValueLikePost'
      this.$http.post(url, {
        pageSize: this.pagination.size,
        pageNum: this.pagination.current,
        tagValue: this.modalAdd.tagValue,
        categoryId: this.modalAdd.categoryId
      }).then((res) => {
        let data = res.data;
        if (data.status == this.$api.SUCCESS) {
          this.labelTableList = data.body.tag_objects || [];
          this.pagination.total = data.body.total_num || 0;
          let len = this.labelTableList.length;
          if (len == 0) {
            this.$hMessage.info({content: '暂无标签信息！'})
          } else if (this.pagination.total >= 5) {
            this.modalAdd.modalHeight = 375
          }
        } else {
          this.$hMessage.error({content: data.msg})
        }
        this.loadingLabelTab = false;
      }).catch(err => {
        this.loadingLabelTab = false;
        this.$hLoading.error();
      })
    },
    getSelectOption(listType, dictCode) {
      let url = '/tm/business/gettypelist?code=' + dictCode;
      this.$http.get(url).then((res) => {
        let data = res.data;
        if (data.status == this.$api.SUCCESS) {
          this[listType] = data.body.typeList || [];
          this[listType] = this[listType].map(item => {
            return {
              dictEntry: item.typeCode,
              entryName: item.typeName
            };
          });
        } else {
          this.$hMessage.error({content: data.msg})
        }
      })
        .catch(err => {
          this.$hLoading.error();
        })
    },
    findLabelName(labelName, findArr) {
      let flag = false;
      if (findArr.length == 0) return flag;//被查找的标签
      let arrDelet = [];//要删除的标签
      for (let i = 0, len = findArr.length; i < len; i++) {
        let item = findArr[i];
//				let regTest = new RegExp(labelName.trim(), "gi");
        let synonym = item.synonym ? item.synonym.join() : '';
        if (item.tagName == labelName || synonym == labelName) {
          flag = true; //标签列表找到匹配标签
          arrDelet.push({data: item, index: i});
        }
        ;
      }
      ;
      if (arrDelet.length > 0) {
        this.delArrBatch.push({findArr: findArr, data: arrDelet});//批量删除的标签
      }
      return flag;
    },
    matchLableHtml(myeditor) {
      let labelName = myeditor.getSelection().getSelectedText();
      let reg = /<span style=".*?">/gi;//匹配带有style样式的span标签
      let labelNameHtml = myeditor.getSelectedHtml().getHtml().replace(/<(?!span|\/span).*?>/ig, "");
      if (reg.test(labelNameHtml)) {
        labelNameHtml = labelNameHtml.replace(reg, '').replace(/<\/span>/, '');
      }
      ;
      if (labelName) {
        this.delLabelFn(labelName);//删除标签
      }
    },
    delLabelFn(labelName) {
      let testSecurity = this.findLabelName(labelName, this.labelListSecurity);
      let testCorp = this.findLabelName(labelName, this.labelListCorp);
      let testIndustry = this.findLabelName(labelName, this.labelListIndustry);
      let testConcept = this.findLabelName(labelName, this.labelListConcept);
      let testIndicator = this.findLabelName(labelName, this.labelListIndicator);
      let testArea = this.findLabelName(labelName, this.labelListArea);
      if (!testSecurity && !testCorp && !testIndustry && !testConcept && !testIndicator && !testArea) {
        this.$hMessage.warning({content: '未找到要删除的标签！'});
      } else {
        this.handleDelLabelBatch(this.delArrBatch);
      }
    },
    instanceReadyCallback({editor}) {
      let _this = this;
      this.myCkeditor = editor;
      this.ckeditorReady = true;
      /**页面初始化内容为空，如果内容更新为A，但instanceReadyCallback 还没执行，vueCkeditor里的update监听的value赋值为A，后续等待instanceReadyCallback执行后，update的value依然为A，不触发setDate**/
      /*缓存：页面初始化内容为空，页面原有值为A，新的内容B触发监听，空值变为B， update将内容setData为B，instanceReadyCallback执行setData value会setData为A， change执行 this.instanceValue变为A update不触发*/
      if (this.contentReady) {
        //console.log('instanceReadyCallback');
        //保证已经完成数据更新，将缓存的内容赋值，触发编辑器update里面的setData
        this.commonFiltersCopy.content = this.contentReadyData;
      }
      ;
      if (this.pageType == 'VIEW') return;
      editor.commands.labeloperate.exec = function (e) {
        let labelName = editor.getSelection().getSelectedText();
        _this.delLabelFn(labelName);//删除标签
      };
      editor.commands.labelAdd.exec = function (e) {
        let labelName = editor.getSelection().getSelectedText();
        _this.handleAddLabelInEditor('', labelName);
      },
        editor.commands.labelmain.exec = function (e) {
          let myeditor = editor;
          var labelName = editor.getSelection().getSelectedText();
          if (labelName) {
            _this.handleMainLabel(labelName, 1);
          }
        },
        editor.commands.labelCancelMain.exec = function (e) {
          let myeditor = editor;
          var labelName = editor.getSelection().getSelectedText();
          if (labelName) {
            _this.handleMainLabel(labelName, 0);
          }
        },

        editor.commands.paragraphFormat.exec = function (e) {
          let myeditor = editor;
          _this.handleParagraphFormat(myeditor);
        },
        editor.commands.labelCheck.exec = function (e) {
          let myeditor = editor;
          _this.handleLabelCheck(myeditor)
        }
      editor.commands.labelCheckKeyCode.exec = function (e) {
        let myeditor = editor;
        let labelName = editor.getSelection().getSelectedText();
        if (labelName) {
          _this.handleLabelCheck(myeditor)
        }
      }
    },
    handleLabelCheck(editor) {
      if ((this.pageType == 'HANDLE' || this.pageType == 'ADD') && !this.isEventPage && !this.isSpecialPage) {
        var labelName = editor.getSelection().getSelectedText();
        if (labelName) {
          let flag = this.labelCheckFn(labelName);
          if (!flag) {
            this.$hMessage.warning({content: '暂无匹配的标签！'});
          } else {
            this.modalCheckLabel = true;
          }
        }
      }
    },
    setCkeditorContentReady(data) {
      if (this.ckeditorReady) {
        this.commonFiltersCopy.content = data;
        this.myCkeditor.setData(data);
        this.showVueCkeditor = true;
        setTimeout(() => {
          if (!this.commonFiltersCopy.content) {
            this.setCkeditorContentReady(this.commonFilters.content)
          }
        }, 300)
      } else {
        setTimeout(() => {
          this.setCkeditorContentReady(data);
        }, 300)
      }
    },
    initCkeditor() {
      if (CKEDITOR.instances[this.editorX]) {
        CKEDITOR.instances[this.editorX].destroy();//如果CKEDITOR已经创建存在则执行destroy
      }
      ;
      this.myCkeditor = CKEDITOR.replace(this.editorX);

    },
    syncTxt(contentInner) {
      let content = this.commonFiltersCopy.content || contentInner
      if (!content) return;
      let body = {
        'htmlContent': content
      }
      this.$http.post('/tm/convertHtmltoTxt', body).then(
        res => {
          let data = res.data
          if (data.status == this.$api.SUCCESS) {
            this.commonFiltersCopy.contentText = data.body.txtContent || ''
            this.formContentTextFn()
          } else {
            this.$hMessage.error({content: data.msg});
          }
        }
      )
        .catch(error => {
          this.$hMessage.error('同步失败');
        })
    },
    formContentTextFn(init = false) {
      if (!this.commonFiltersCopy.contentText) return;
      let contentStr = this.commonFiltersCopy.contentText.replace(/(\r\n)+|(\n)+/g, '\n');
      let contentArr = contentStr.split('\n');
      if (contentArr[contentArr.length - 1].replace(/(^\s*)|(\s*$)/g, "").replace(/(^\n*)|(^\r\n*)|(\r\n*$)|(\n*$)/g, "") == '') {
        contentArr.pop();//去除末尾换行符
      }
      let arr = [];
      let spaceStr = this.newsType == '1' ? `        ` : '';
      contentArr.forEach((item) => {
        if (item.replace(/\s+/gi, '') != '') {
          arr.push(spaceStr + `${item.trim()}` + `\n`);
        }
      });
      if (init) {
        this.beforeCommonFilters.contentText = arr.join('\n');
      }
      this.commonFiltersCopy.contentText = arr.join('\n');
    },
    formContentSimilarFn(conSimilar) {
      if (!conSimilar) return;
      let contentStr = conSimilar.replace(/\n+/g, '\n');
      let contentArr = contentStr.split('\n');
      if (contentArr[contentArr.length - 1].replace(/(^\s*)|(\s*$)/g, "") == '') {
        contentArr.pop();//去除末尾换行符
      }
      ;
      if (contentArr[0].replace(/(^\s*)|(\s*$)/g, "") == '') {
        contentArr.shift();//去除末尾换行符
      }
      ;
      let arr = [];
      contentArr.forEach((item) =>
        arr.push(`    ` + `${item.trim()}`)
      );
      return conSimilar = arr.join('\n');
    },
    handleAddLabelInEditor(addLabelType, label) {
      this.addLabelType = addLabelType;
      this.modalAddLabel = true;
      this.modalAdd.categoryId = '';
      this.modalAdd.tagValue = label;
      this.getLabelList();// 获取添加标签分类
      this.labelTableList = [];
    },
    isShowSimilarFn() {
      let realTimeQueryDupDetails = this.commonFiltersCopy.realTimeQueryDupDetails || [];
      for (let item of realTimeQueryDupDetails) {
        item.handleStatus = item.handleStatus || '未公开'
        item.contentText = this.formContentSimilarFn(item.contentText) || ''
      }
      this.similarList = realTimeQueryDupDetails
      this.showSimilar = (realTimeQueryDupDetails.length > 1) ? true : false;
      this.modalSimilar = (realTimeQueryDupDetails.length > 1) ? true : false;
    },
    deleteSimilarItem(data) {
      let {index} = data
      this.similarList.splice(index, 1)
    },
    handleScroll() {
      let timer = null;
      let outerBox = document.querySelectorAll('#scroll')[0];
      let scrollTop_outerBox = outerBox.scrollTop;
      let allHeight = document.querySelectorAll('.outerBox')[0] && document.querySelectorAll('.outerBox')[0].offsetHeight || '';
      let clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
      if (timer) {
        clearTimeout(timer)
      }
      ;
      if (allHeight - clientHeight + 67 < 20) {
        if (scrollTop_outerBox <= 20) {
          this.isFixedBtn = false;
          this.showTopBtn = true;
          this.toBottom = false;
        } else if (scrollTop_outerBox > 22) {
          this.isFixedBtn = true;
          this.showTopBtn = true;
        }
        return
      }
      ;
      timer = setTimeout(() => {
        if (allHeight <= clientHeight + scrollTop_outerBox - 100) {
          //文档总高度 == 可视区高度+滚动高度---到底了
          this.toBottom = true;
          this.showTopBtn = false;
          this.isFixedBtn = false;
          return
        }
        if (scrollTop_outerBox <= 20) {
          this.isFixedBtn = false;
          this.showTopBtn = true;
          this.toBottom = false;
        } else if (scrollTop_outerBox > 22) {
          this.isFixedBtn = true;
          this.showTopBtn = true;
        }
      }, 50)

    },
    onFocusFn(inputIndex) {
      this.inputIndex = Number(inputIndex);
    },
    handleKeyCodeFn(e) {
      var keyCode = e.keyCode || e.which || e.charCode;
      var ctrlKey = e.ctrlKey || e.metaKey;
      if (ctrlKey && keyCode == 83 && (this.pageType == 'HANDLE' || this.pageType == 'ADD' || this.isSpecialPage) && !this.isEventPage) {
        this.handleCheckSaveInfo();//ctrl + s 保存
        e.preventDefault();
      }
      if (ctrlKey && keyCode == 68 && (this.isSpecialPage || !this.isEventPage)) {
        if (this.pageType == 'SPECIALADD') return
        this.handlePreId();//ctrl + d 上一条
        e.preventDefault();
      }
      if (ctrlKey && keyCode == 70 && (this.pageType == 'VIEW' || this.isSpecialPage) && !this.isEventPage) {
        if (this.pageType == 'SPECIALADD') return
        this.handleNextId();//ctrl + f 下一条
        e.preventDefault();
      }
      return false;
    },
    getCommonList() {
      this.$store.dispatch('getAppList', 'appList');
      // this.$store.dispatch('getSourceList','sourceList');
      this.$store.dispatch('getRangeList', 'rangeList');
      this.$store.dispatch('getFinancialList', 'financialMarketList');
      this.$store.dispatch('getInfoLevelList', 'infoLevelList');
      this.$store.dispatch('getFormList', 'formList');
    },
    getStorageFn() {
      let appListStorage = JSON.parse(sessionStorage.getItem("appList")) || null;//获取下拉列表缓存
      let infoLevelListStorage = JSON.parse(sessionStorage.getItem("infoLevelList")) || null;//获取下拉列表缓存
      let rangeListStorage = JSON.parse(sessionStorage.getItem("rangeList")) || null;//
      let financialListStorage = JSON.parse(sessionStorage.getItem("financialMarketList")) || null;//
      let formListStorage = JSON.parse(sessionStorage.getItem("formList")) || null;//
//			let opinionListCommentStorage = JSON.parse(sessionStorage.getItem("opinionListComment")) || null;//
//			let opinionListRecommendStorage = JSON.parse(sessionStorage.getItem("opinionListRecommend")) || null;//
      if (!appListStorage || !infoLevelListStorage || !rangeListStorage || !financialListStorage || !formListStorage) {
        this.getCommonList();
      } else {
        this.$store.commit('GET_INFOLEVELLIST', infoLevelListStorage);
        this.$store.commit('GET_RANGELIST', rangeListStorage);
        this.$store.commit('GET_FINANCIALLIST', financialListStorage);
        this.$store.commit('GET_FORMLIST', formListStorage);
        this.$store.commit('GET_APPLIST', appListStorage);
//				this.$store.commit('GET_OPINIONLISTRECOMMEND',opinionListRecommendStorage);
//				this.$store.commit('GET_OPINIONLISTCOMMENT',opinionListCommentStorage);
      }
      ;
      if (this.pageType == 'ADD') {
        this.getSubdivide('rangePlus', '0');//范围细分列表
        this.getSubdivide('financialPlus', '1');//金融市场细分列表
      }
      ;
      this.getSelectOption('tradingMarketList', 1005000081);
      // this.$store.dispatch('getSourceList','sourceList');

    },
    remarkClick() {
      let url = "/tm/news/getNewsOperateLogPage";
      let body = {
        current: 1,
        newsId: this.pageNumType == 3 ? this.idCopy : this.newsIdCopy,
        size: 999,
        type: this.pageNumType
      };
      this.$http.post(url, body).then(res => {
        let data = res.data
        if (data.status == this.$api.SUCCESS) {
          this.remarkList = data.body.records
          this.remarkModalShow = true
        } else {
          this.$hMessage.error({content: data.msg});
        }
      });
    },
    initDetail() {
      window.focus();
      document.querySelectorAll('#scroll')[0].addEventListener('scroll', this.handleScroll);
      document.addEventListener('keydown', this.handleKeyCodeFn);
      this.newsIdCopy = this.newsId;
      this.idCopy = this.id;
      this.newsTypeCopy = this.newsType;
      if (this.isSpecailPage) {
        this.$store.dispatch('getOpinionListComment', 'opinionListComment');//专题资讯-意见评论
        this.$store.dispatch('getOpinionListRecommend', 'opinionListRecommend');//专题资讯-个股推荐
      }
      ;
      let isProcess = this.$route.query.isProcess || false;
      if (!isProcess && !this.isSpecailPage && !this.isEventPage) {
        this.getPreNextIds();//主表资讯请求查看100条数据
      }
      ;
      if (this.pageType == 'ADD') {
        this.$nextTick(() => {
          this.initChange = false;//加载页面后触发范围、金融市场change
        });
      }
    },
    timeToDown() {
      if (!this.overplusTime) {
        return
      }
      // 时间转时间戳
      let date = new Date(this.overplusTime);
      let time = parseInt(date.getTime() / 1000 - new Date().getTime() / 1000);
      this.overplusSecs = time
      this.timeDown()
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
    // 设置关闭页面弹窗
    setMsgContent(show) {
      let _this = this;
      let obj = {
        url: this.$route.path,
        show: show,
        msg: "已公开过资讯再次编辑只能公开，退出后修改内容不会被保存",
        fn: () => {

        }
      };
      this.$store.commit("SET_TAB_MSG", obj);
    },
    contentChange(content) {
      if (this.checkFirst) {
        this.beforeCommonFilters.content = content
        this.checkFirst = false
      }
    },
    initReset() {
      this.initChange = true;
    },
  },
  computed: {
    ...mapState(['maxTableHeight', 'appList', 'infoLevelList', 'rangeList', 'financialMarketList', 'formList', 'autorOrgList', 'dsSourceList', 'mediaSourceList', 'sourceList']),
    pageNumType() {
      let _type = 1
      if (this.isEventPage) {
        _type = 4
      } else if (this.isSpecialPage) {
        _type = 3
      } else {
        _type = this.newsTypeCopy
      }
      return parseInt(_type)
    },
    handleStatus() {
      return (this.commonFilters.handleStatus || 0).toString()
    },
    isTimeOut() {
      let pageType = this.pageType || 'HANDLE'
      let newsTypeCopy = this.newsTypeCopy || this.newsType
      if (pageType == 'HANDLE' && newsTypeCopy == '1') {
        return this.overplusSecs == 0
      } else {
        return false
      }
    },
  },
  watch: {
    secuTags(newArr) {
      if (newArr) {
        this.labelListSecurity = newArr;
      }
    },
    labelList(newArr) {
      if (newArr) {
        this.labelListCorp = newArr;
      }
    },
    industryTags(newArr) {
      if (newArr) {
        this.labelListIndustry = newArr;
      }
    },
    conceptTags(newArr) {
      if (newArr) {
        this.labelListConcept = newArr;
      }
    },
    indicatorTags(newArr) {
      if (newArr) {
        this.labelListIndicator = newArr;
      }
    },
    regionTags(newArr) {
      if (newArr) {
        this.labelListArea = newArr;
      }
    },
    newsId(newId) {
      this.newsIdCopy = newId;
    },
    id(id) {
      this.idCopy = id;
    },
    newsTypeCopy(newType) {
      this.newsTypeCopy = newType
    },
    autorOrgList(newArr) {
      if (newArr.length > 0) {
        this.loadingSearchAutorOrg = false;
        this.loadingSearchTxt = ''
      } else {
        if (this.loadingSearchTxt == '加载中') {
          this.loadingSearchTxt = '暂无匹配数据';
        } else {
          this.loadingSearchAutorOrg = true;
          this.loadingSearchTxt = '请输入搜索';
        }
      }
    },
    dsSourceList(newArr) {
      if (newArr.length > 0) {
        this.loadingSearchDsSource = false;
        this.loadingSearchTxt = ''
      } else {
        if (this.loadingSearchTxt == '加载中') {
          this.loadingSearchTxt = '暂无匹配数据';
        } else {
          this.loadingSearchDsSource = true;
          this.loadingSearchTxt = '请输入搜索';
        }
      }
    },
    mediaSourceList(newArr) {
      if (newArr.length > 0) {
        this.loadingSearchMediaSourceCode = false;
        this.loadingSearchTxt = ''
      } else {
        if (this.loadingSearchTxt == '加载中') {
          this.loadingSearchTxt = '暂无匹配数据';
        } else {
          this.loadingSearchDsSource = true;
          this.loadingSearchTxt = '请输入搜索';
        }
      }
    },

    commonFilters: {
      handler(newObj, old) {
        this.beforeCommonFilters = {};
        this.commonFiltersCopy = {};
        let tempObj = copyDeep(newObj);
        if (!this.ckeditorReady) {
          // tempObj.content = '';
          this.contentReadyData = tempObj.content;//编辑器未加载完成，缓存新的内容，待加载完成后赋值
        } else {
          // this.commonFiltersCopy = tempObj;//编辑器加载完成，直接赋值，触发编辑器update
        }
        this.contentReady = true;
        this.checkFirst = true
        let rangeValue = tempObj['range'] || '0';
        let financialValue = tempObj['financial'] || '1';
        let a = this.getSubdivide('rangePlus', rangeValue);//范围细分列表
        let b = this.getSubdivide('financialPlus', financialValue);//金融市场细分列表
        Promise.all([a, b]).then(() => {
          this.beforeCommonFilters = {...tempObj};
          this.commonFiltersCopy = {...tempObj};
          this.addTags = [];
          this.showTopBtn = true;
          this.$nextTick(() => {
            this.initChange = false;//加载页面后触发范围、金融市场change
          });
          if (this.commonFiltersCopy.authorOrgName) {
            this.$store.dispatch('getOrgAuthorList', this.commonFiltersCopy.authorOrgName);
          } else {
            this.$store.commit('GET_AUTORORGLIST', []);
          }
          if (this.commonFiltersCopy.dsSourceName) {
            this.$store.dispatch('getDsSourceList', this.commonFiltersCopy.dsSourceName);
          } else {
            this.$store.commit('GET_DSSOURCELIST', []);
          }
          if (this.commonFiltersCopy.mediaSource) {
            if (this.sourceList.length > 0) {
              this.$store.commit('ALL_SOURCE_LIST');
            } else {
              this.$store.dispatch('getSourceList');
            }
          } else {
            this.$store.dispatch('getSourceList');
          }
          this.formContentTextFn(true);//格式化纯文本
          if (this.newsTypeCopy == '1' && this.pageType == 'HANDLE') {
            this.isShowSimilarFn();	//是否显示相似资讯弹框
          }
          if (this.newsTypeCopy == '1' && this.pageType == 'HANDLE') {
            this.overplusTime = this.commonFiltersCopy.overplusTime
            this.timeToDown()
          }
          if (this.pageType == 'ADD' && this.isSaveAs && this.newsTypeCopy == '1') {
            this.syncTxt(newObj.content)
          }
        })
      },
      deep: true
    },
    commonFiltersCopy: {
      handler(obj) {
        this.detailIsChange = false;
        this.setMsgContent(false)
        // 只有主表编辑
        if (this.handleStatus == '1' && this.pageType == 'HANDLE' && this.newsTypeCopy == '1') {
          let beforemd5 = this.$md5(JSON.stringify(this.beforeCommonFilters).replace(/null/g, '""').replace(/\n/g, ''))
          let objmd5 = this.$md5(JSON.stringify(obj).replace(/null/g, '""').replace(/\n/g, ''))
          if (beforemd5 != objmd5) {
            this.detailIsChange = true
            this.setMsgContent(true)
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    this.labelListSecurity = [...this.secuTags];
    this.labelListCorp = [...this.labelList];
    this.labelListIndustry = [...this.industryTags];
    this.labelListConcept = [...this.conceptTags];
    this.labelListIndicator = [...this.indicatorTags];
    this.labelListArea = [...this.regionTags];
    this.commonFiltersCopy = {...this.commonFilters};
    this.getStorageFn();
    this.initDetail();
  },
  destroyed() {
    document.querySelectorAll('#scroll')[0].removeEventListener('scroll', this.handleScroll);   //离开页面清除（移除）滚轮滚动事件
    document.removeEventListener('keydown', this.handleKeyCodeFn);
    this.timer && clearInterval(this.timer)
  },

  activated: function () {
    this.ckeditorReady = false,//初始化ckEditor加载完成标记
      this.contentReady = false,//初始化编辑器内容加载完成标记
      this.contentReadyData = '';//编辑器内容加载完成
    this.showVueCkeditor = true;
    ;//解决tab切换白屏问题
    this.initChange = true;//范围 金融市场change不触发
    this.loadingSearchAutorOrg = this.autorOrgList.length ? false : true;//初始化撰写机构提示框
    this.loadingSearchTxt = this.autorOrgList.length ? '' : '请输入搜索';//初始化撰写机构提示框
    this.initDetail();
    this.timeToDown()
  },
  deactivated: function () {
    document.removeEventListener('keydown', this.handleKeyCodeFn);
    this.showVueCkeditor = false;
    this.timer && clearInterval(this.timer)
  },
}
</script>
<style>
.audit-common-lable .h-input-wrapper {
  display: inline-block;
  width: 90%;
}

.audit-common-lable .h-input-wrapper textarea {
  padding: 4px 8px !important;
  resize: none;
  height: 250px;
}

.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}

.demo-upload-list img {
  width: 100%;
  height: 100%;
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}

.sensitives .h-input {
  color: red !important;
  resize: none;
  height: 32px;
  padding: 4px 8px;
}

.sensitives textarea {
  padding: 4px 8px !important;
}

.sensitives .viewPage {
  color: red !important;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}

.summaryBox textarea {
  resize: none;
  height: 60px;
  padding: 4px 8px !important;
}

.summaryBox .viewPage {
  min-height: 60px;
  width: 100% !important;
  overflow-y: auto !important;
  white-space: inherit !important;
  text-overflow: inherit !important;
}

.conclusionBox textarea {
  resize: none;
  height: 120px;
  padding: 4px 8px !important;
}

.conclusionBox .viewPage {
  min-height: 120px;
}

.contentTextBoxWrap {
  position: relative;
}

.contentTextBoxWrap .h-btn {
  position: absolute;
  left: 60px;
  top: 30px;
  z-index: 100;
}

.syncBtn {
  position: absolute;
  left: 40px !important;
  top: 30px;
  z-index: 100;
}

.contentTextBoxEvent {
  background-color: rgb(199, 238, 206, 0.4);
  font-size: 13px !important;
  min-height: 150px;
  max-height: 300px;
  padding: 4px 8px;
  border: 1px solid #dce1e7;
  border-radius: 5px;
  overflow: auto;
}

.contentTextBox textarea {
  min-height: 150px;
  max-height: 300px;
  padding: 4px 8px;
  background-color: rgb(199, 238, 206, 0.4);
  font-size: 13px !important;
  line-height: 20px;
}

.highLightColor .info-replace-color {
  background: #ff9999; /*粉色-替换词*/
}

.highLightColor .info-highlight-color {
  background: #66ffff; /*天蓝色-高亮*/
}

.highLightColor .info-label-color {
  background: #ffff00; /*-黄色-标签*/
}

.highLightColor .info-label-like-color {
  background: #f39c12; /*橙色疑似标签*/
}

.mediaSourceConst .h-form-item-label {
  /*width: 85px !important;*/
}

.h-form .h-form-item-label {
  /*color: #000000 !important;
  font-size: 13px;*/
  padding: 0 5px 0 0 !important;
}

.searchBox .selectItem .h-select {
  width: 215px;
}

.searchBox .h-form-item .h-input, .searchBox .h-form-item .h-selectTable-input {
  width: 215px;
  padding: 0 8px;
}

.searchBox .twoColItem .h-input {
  width: 445px;
}

.searchBox .twoColItem .h-selectTable-input {
  width: 445px;
}

.searchBox .addItemColItem .h-selectTable-input {
  width: 215px;
}

.searchBox .mediaSourceConst .h-selectTable-single .h-selectTable-input {
  width: 215px;
}

.linkUrlItem {
  border: 1px solid #D7DDE4;
  padding: 0 8px;
  border-radius: 3px;
  width: 445px;
}

.linkUrlItem a {
  text-decoration: none;
  color: #298DFF;
}

.readonlyItem .h-form-item-label {
  color: #666;
}

.readonlyItem .h-form-item-label:before {
  color: #999;
}

.modalSimilarBox .h-modal-content {
  left: 7.5% !important;
}

.modalSimilarBox .h-modal-body {
  padding: 10px 30px !important;
}

.modalImgSelect .h-modal-body {
  height: 350px !important;
  overflow-y: scroll;
}

.modalImgSelect .h-modal-content {
  left: 10% !important;
}

/*.modalAddLabel{
	z-index: 99999!important;
}*/
</style>
<style scoped>
.butBox {
  margin-bottom: 10px;
  padding: 5px 0;
  text-align: center;
  overflow: hidden;
}

.butBoxBottom {
  margin: 20px 0;
}

.butBoxFix {
  margin: 10px 0;
  padding: 7px 20px 10px 0;
  background: #fff;
  border-bottom: 1px solid #d7dde4;
  border-top: 1px solid #d7dde4;
  width: calc(100% - 200px);
  position: fixed;
  top: 78px;
  right: 0;
  z-index: 100;
}

.viewPage {
  border: 1px solid #dce1e7;
  border-radius: 5px;
  padding: 0 5px;
  height: 32px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 215px;
  cursor: pointer;
}

.twoColItem .viewPage {
  width: 445px;
}

.linkUrl {
  display: inline-block;
}

.edit-content {
  padding: 10px;
}

.uploadImg {
  padding: 0 10px;
  margin: 10px 0;
}

.uploadImg img {
  cursor: pointer;
}

.uploadImg .delIcon {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  display: inline-block;
  text-align: center;
  line-height: 16px;
  background: rgba(102, 102, 102, 0.3);
  cursor: pointer;
  font-size: 13px;
  color: #666;
  position: relative;
  right: 22px;
  top: -75px;
}

.uploadImg .delIcon:hover {
  color: #000;
  background: rgba(102, 102, 102, 0.6);
}

.defaultImg {
  height: 90px;
  width: 160px;
  cursor: pointer;
}

.uploadImgBox {
  border: 1px #ccc dashed;
  width: 160px;
  height: 90px;
  text-align: center;
  display: inline-block;
  vertical-align: top;
}

.addIconBox {
  height: 90px;
  line-height: 16px;
  width: 100%;
}

.uploadImgBoxNoImg {
  border: 1px #ccc dashed;
  width: 220px;
  height: 45px;
  text-align: center;
  display: inline-block;
  vertical-align: top;
}

.uploadImgBoxNoImg .addIconBox {
  height: 90px;
  line-height: 14px;
  width: 100%;
}

.uploadImg .h-upload {
  height: 80px;
  width: 160px !important;
  vertical-align: top;
}

.addIconBox span {
  display: block;
  color: #979797;
  border: 1px solid #979797;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  line-height: 14px;
  text-align: center;
  margin: 4px auto;
}

.addIconBox i {
  margin: 0 auto;
  display: block;
  font-style: normal;
  color: #989894;
}

.addIconBox i:first-of-type {
  color: #666;
}

.tab-box {
  padding: 10px 20px;
}

.label-btn-box {
  padding-bottom: 5px;
}

.topBox {
  width: 100%;
  height: 150px;
  position: relative;
}

.newsDetailBox .h-form-item {
  margin-bottom: 5px !important;
}

.searchBox .h-form-item {
  margin-bottom: 5px !important;
  display: inline-block;
}

.uploadImg-form-item {
  margin: 10px 0 !important;
}

.linkContent {
  color: #0072f5;
  cursor: pointer;
  font-size: 14px;
}

.contentSource {
  background: #f7f7f7;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 0 10px;
  font-size: 14px;
}

.modalAddLabel ul {
  margin-bottom: 20px;
}

.modalAddLabel .handleBox li {
  display: inline-block;
  margin-right: 10px;
}

.modalAddLabel .labelNameList li {
  margin-bottom: 10px;
}

.handleRemark {
  width: 215px;
  border: 1px solid #d7dde4;
  max-height: 160px;
  overflow: auto;
  padding: 5px 0;
}

.handleRemark li {
  padding: 5px;
  width: 100%;
  line-height: 18px;
}

.handleRemark li:nth-child(2n) {
  background: #fff;
}

.eventPageRemark {
  margin-top: 30px;
}

.eventPageRemark .handleRemark {
  width: 100% !important;
}

.outerBox {
  position: relative;
}

.outerBox .h-input {
  /*font-size: 13px;
  color: #000;*/
}

.toTop {
  cursor: pointer;
  position: fixed;
  right: 2%;
  bottom: 2%;
}

.labelTableBox {
  /*margin-bottom: 10px;*/
}

.newsDetailBox {
  overflow: hidden;
  width: 100%;
  height: 100%;
  border: 1px solid #dce1e7;
}

.detailLeft, .detailRight {
  padding: 10px 7px;
  /*overflow-y: auto;*/
}

.detailRightLog {
  overflow-y: auto;
  max-height: 600px;
}

.detailLeft {
  /*float:left;*/
  min-width: 350px;
  width: 100%;
  /*border-right: 0.5px solid #dce1e7;	*/
}

.detailRight {
  /*margin-left:370px;*/
  overflow-x: hidden;
  /*border-left: 0.5px solid #dce1e7;*/
}

.remarkBtnContent {
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;
  margin-top: 10px;
}
</style>

