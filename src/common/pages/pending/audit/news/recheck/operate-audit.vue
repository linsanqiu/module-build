<template>
    <section>
        <div class="audit-common-header">
            <h-row class-name="common-handle-padding">
                <h-col span="10" push="1">
                    <h-row class-name="common-handle-padding">
                        <h-col span="4">
                            <h-button @click="returnParentPage">
                                <h-icon name="return" />返回
                            </h-button>
                        </h-col>
                        <!-- <h-col span="6">
                            <h-button>
                                <h-icon name="android-checkbox" />保存
                            </h-button>
                        </h-col> -->
                        <!-- <h-col span="6" v-if="commonHandle.openFlag">
                            <h-button @click="clickShowResureModal(`open`)">
                                <h-icon name="unlock" />公开
                            </h-button>
                        </h-col>
                        <h-col span="6" v-else>
                            <h-button @click="clickShowResureModal(`close`)">
                                <h-icon name="lock" />屏蔽
                            </h-button>
                        </h-col> -->
                        <h-col span="6">
                            <!-- <h-button @click="clickShowNewAddModal" v-if="isNewsHandleFinsihed"> -->
                            <h-button
                                @click="clickShowNewAddModal">
                                <h-icon name="success" />复核通过
                            </h-button>
                        </h-col>
                        <h-col span="6">
                            <h-button
                                @click="clickShowResureModal(`passed`)">
                                <h-icon name="success" />返回修正
                            </h-button>
                        </h-col>
                        <h-col span="4">
                            <h-button
                                :disabled="isFirstNews"
                                ref="recheck_audit_prev"
                                data-btn="recheck_audit_prev"
                                @click="clickGetNewsInfos(`prev`)">
                                上一条
                            </h-button>
                        </h-col>
                        <h-col span="4">
                            <h-button
                                :disabled="isLastNews"
                                ref="recheck_audit_next"
                                data-btn="recheck_audit_next"
                                @click="clickGetNewsInfos(`next`)">
                                下一条
                            </h-button>
                        </h-col>
                    </h-row>
                </h-col>
                <!-- <h-col span="10" offset="2">
                    <h-row class-name="common-handle-padding">
                        <h-row class-name="common-handle-padding">
                            <h-col span="24">
                                <h-button @click="clickShowModal">
                                + 添加标签
                                </h-button>
                            </h-col>
                        </h-row>
                    </h-row>
                </h-col> -->
                <h-col span="10" offset="2">
                    <h-row class-name="common-handle-padding"></h-row>
                    <h-row class-name="common-handle-padding"></h-row>
                    <h-row class-name="common-handle-padding">
                        <h-col span="4">
                            <span class="audit-common-lable">
                                标签列表
                            </span>
                        </h-col>
                    </h-row>
                </h-col>
            </h-row>
        </div>
        <div class="audit-common-content">
            <h-row class-name="common-handle-padding">
                <h-col span="12">
                    <h-row class-name="common-handle-padding" v-if="!showHighLightTitle">
                        <h-col span="24">
                            <span class="audit-common-lable common-handle-required">资讯标题</span>
                            <h-input
                                aria-placeholder="资讯标题"
                                placeholder="请输入资讯标题"
                                style="width: 80%"
                                v-model="commonHandle.newsTitle"
                                @on-change="onChangeInput(`newsTitle`)"
                                @on-enter="onChangeInput(`newsTitle`)"
                                disabled>
                            </h-input>
                        </h-col>
                    </h-row>
                    <h-row class-name="common-handle-padding" v-else>
                        <h-col span="24">
                            <span class="audit-common-lable common-handle-required">资讯标题</span>
                            <div class="news-highlight-title-wrapper">
                                <span
                                    ref="highlight-title"
                                    class="news-highlight-title news-highlight-title-left news-highlight-title-disabled"
                                    data-dom="highlight-title">
                                </span>
                            </div>
                        </h-col>
                    </h-row>
                    <h-row class-name="common-handle-padding">
                        <h-col span="24">
                            <span class="audit-common-lable">链接地址</span>
                            <!-- <h-input
                                aria-placeholder="链接地址"
                                placeholder="链接地址"
                                style="width: 70%;"
                                v-model="commonHandle.newsLink"
                                @on-change="onChangeInput(`newsLink`)"
                                @on-enter="onChangeInput(`newsLink`)"
                                disabled>
                            </h-input> -->
                            <h-input
                                aria-placeholder="链接地址"
                                placeholder="链接地址"
                                style="width: 70%;"
                                ref="newsLink"
                                data-uid="newsLink"
                                title="点击复制, 资讯链接地址!"
                                v-model="commonHandle.newsLink"
                                @on-change="onChangeInput(`newsLink`)"
                                @on-enter="onChangeInput(`newsLink`)"
                                :readonly="true">
                            </h-input>
                            <a
                                :href="commonHandle.newsLink"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="common-handle-link"
                                style="width: 10%;"
                                icon="link">
                                打开链接
                            </a>
                        </h-col>
                    </h-row>
                    <h-row class-name="common-handle-padding">
                        <h-col span="24">
                            <span class="audit-common-lable">资讯摘要</span>
                            <h-input
                                aria-placeholder="资讯摘要"
                                placeholder="资讯摘要"
                                style="width: 80%"
                                type="textarea"
                                v-model="commonHandle.newsBrief"
                                @on-change="onChangeInput(`newsBrief`)"
                                @on-enter="onChangeInput(`newsBrief`)"
                                disabled>
                            </h-input>
                        </h-col>
                    </h-row>
                    <h-row class-name="common-handle-padding">
                        <h-col span="12">
                            <span class="audit-common-lable">创建日期</span>
                            <h-input
                                aria-placeholder="创建日期"
                                placeholder="创建日期"
                                style="width: 60%;"
                                v-model="commonHandle.publishDate"
                                @on-change="onChangeInput(`publishDate`)"
                                @on-enter="onChangeInput(`publishDate`)"
                                disabled>
                            </h-input>
                            <!-- <h-date-picker
                                aria-placeholder="创建日期"
                                :placeholder="placeholders.publishDate"
                                style="width: 60%"
                                :value="commonHandle.publishDate"
                                @on-change="onChangeDatePicker"
                                disabled>
                            </h-date-picker> -->
                        </h-col>
                        <h-col span="12">
                            <span class="audit-common-lable">发布时间</span>
                            <h-input
                                aria-placeholder="发布时间"
                                placeholder=""
                                style="width: 60%;"
                                v-model="commonHandle.newsPublishTime"
                                @on-change="onChangeInput(`newsPublishTime`)"
                                @on-enter="onChangeInput(`newsPublishTime`)"
                                disabled>
                            </h-input>
                        </h-col>
                    </h-row>
                    <h-row class-name="common-handle-padding">
                        <h-col span="12">
                            <span class="audit-common-lable">资讯 ID</span>
                            <h-tooltip
                                style="width: 60%"
                                placement="top"
                                content="点击复制, 资讯 ID!">
                                <h-input
                                    aria-placeholder="资讯 ID"
                                    placeholder="请输入资讯 ID"
                                    style="width: 100%"
                                    ref="newsId"
                                    data-uid="newsId"
                                    v-model="commonHandle.newsId"
                                    @on-change="onChangeInput(`newsId`)"
                                    @on-enter="onChangeInput(`newsId`)"
                                    :readonly="true"
                                    :disabled="false">
                                </h-input>
                            </h-tooltip>
                            <!-- <h-input
                                aria-placeholder="资讯 ID"
                                placeholder="请输入资讯 ID"
                                style="width: 80%"
                                v-model="commonHandle.newsId"
                                @on-change="onChangeInput(`newsId`)"
                                @on-enter="onChangeInput(`newsId`)"
                                disabled>
                            </h-input> -->
                        </h-col>
                        <h-col span="12">
                            <span class="audit-common-lable">处理状态</span>
                            <h-input
                                aria-placeholder="处理状态"
                                placeholder="处理状态"
                                style="width: 60%; color: #f00 !important;"
                                class="common-handle-status"
                                v-model="commonHandle.newsStatus"
                                @on-change="onChangeInput(`newsStatus`)"
                                @on-enter="onChangeInput(`newsStatus`)"
                                disabled>
                            </h-input>
                        </h-col>
                    </h-row>
                    <h-row class-name="common-handle-padding">
                        <h-col span="12">
                            <span class="audit-common-lable">媒体出处</span>
                            <h-tooltip
                                style="width: 60%"
                                placement="top"
                                :content="commonHandle.mediaSource">
                                <h-input
                                    aria-placeholder="媒体出处"
                                    placeholder="请输入媒体出处"
                                    style="width: 100%"
                                    v-model="commonHandle.mediaSource"
                                    @on-change="onChangeInput(`mediaSource`)"
                                    @on-enter="onChangeInput(`mediaSource`)"
                                    disabled>
                                </h-input>
                            </h-tooltip>
                        </h-col>
                        <h-col span="12">
                            <span class="audit-common-lable">作者</span>
                            <h-input
                                aria-placeholder="作者"
                                placeholder="请输入作者"
                                style="width: 60%"
                                v-model="commonHandle.newsAuthor"
                                @on-change="onChangeInput(`newsAuthor`)"
                                @on-enter="onChangeInput(`newsAuthor`)"
                                disabled>
                            </h-input>
                        </h-col>
                    </h-row>
                    <!-- <h-row class-name="common-handle-padding">
                        <h-col span="12">
                            <span class="audit-common-lable">处理人</span>
                            <div class="h-input-wrapper h-input-type" style="width: 60%;">
                                <span class="x-input">{{commonHandle.newsAuditor}}</span>
                            </div>
                        </h-col>
                        <h-col span="12">
                            <span class="audit-common-lable">处理时间</span>
                            <div class="h-input-wrapper h-input-type" style="width: 60%;">
                                <span class="x-input">{{commonHandle.auditDate}}</span>
                            </div>
                        </h-col>
                    </h-row> -->
                    <!-- <h-row class-name="common-handle-padding">
                        <h-col span="12">
                            <span class="audit-common-lable">处理人</span>
                            <h-input
                                aria-placeholder="处理人"
                                placeholder="请输入处理人"
                                style="width: 60%"
                                v-model="commonHandle.newsAuditor"
                                @on-change="onChangeInput(`newsAuditor`)"
                                @on-enter="onChangeInput(`newsAuditor`)"
                                disabled>
                            </h-input>
                        </h-col>
                        <h-col span="12">
                            <span class="audit-common-lable">处理时间</span>
                            <h-input
                                aria-placeholder="处理时间"
                                placeholder="请输入处理时间"
                                style="width: 60%"
                                v-model="commonHandle.auditDate"
                                @on-change="onChangeInput(`auditDate`)"
                                @on-enter="onChangeInput(`auditDate`)"
                                disabled>
                            </h-input>
                        </h-col>
                    </h-row> -->
                    <h-row class-name="common-handle-padding">
                        <h-col span="24">
                            <span class="audit-common-lable">敏感词</span>
                            <h-input
                                aria-placeholder="请输入敏感词"
                                placeholder="请输入敏感词"
                                style="width: 80%; color: #f00 !important;"
                                class="common-handle-status"
                                type="textarea"
                                v-model="commonHandle.sensitiveWords"
                                @on-change="onChangeInput(`sensitiveWords`)"
                                @on-enter="onChangeInput(`sensitiveWords`)"
                                disabled>
                            </h-input>
                        </h-col>
                    </h-row>
                    <h-row class-name="common-handle-padding">
                        <h-col span="12">
                            <span class="audit-common-lable">公开标志</span>
                            <h-input
                                aria-placeholder="公开标志"
                                placeholder="请输入公开标志"
                                style="width: 60%"
                                v-model="commonHandle.publicFlag"
                                @on-change="onChangeInput(`publicFlag`)"
                                @on-enter="onChangeInput(`publicFlag`)"
                                disabled>
                            </h-input>
                        </h-col>
                        <h-col span="12" v-if="isShowMachineShield">
                            <span class="audit-common-lable-super-long">机器屏蔽原因: </span>
                            <h-input
                                aria-placeholder="机器屏蔽原因"
                                placeholder=""
                                style="width: 60%; transform: translateX(-22px);"
                                v-model="commonHandle.machineShield"
                                @on-change="onChangeInput(`machineShield`)"
                                @on-enter="onChangeInput(`machineShield`)"
                                disabled>
                            </h-input>
                        </h-col>
                    </h-row>
                    <h-row class-name="common-handle-padding">
                        <h-col span="24" v-if="!isEmptyCommonLogs">
                            <span class="audit-common-lable">处理记录</span>
                            <div
                                class="h-input-wrapper"
                                aria-placeholder="处理记录"
                                style="width: 80%;">
                                <div
                                    id="audit-common-handle-logs"
                                    >
                                </div>
                            </div>
                        </h-col>
                    </h-row>
                </h-col>
                <h-col span="12">
                    <h-row class-name="common-handle-padding">
                        <h-col span="24">
                            <!-- <h-row class-name="common-handle-padding">
                                <h-col span="4">
                                    标签列表
                                </h-col>
                            </h-row> -->
                            <h-row class-name="common-handle-padding">
                                <h-col span="24">
                                    <h-table
                                        :columns="commonHandleTableCols"
                                        :data="commonHandleTableDatas"
                                        :loading="tableLoading"
                                        :maxHeight="tableFixedHeight"
                                        size="small"
                                        border>
                                    </h-table>
                                </h-col>
                            </h-row>
                            <h-row class-name="common-handle-padding" v-if="isShowBidTable">
                                <h-col span="4">
                                    <!-- BID 列表 -->
                                    重名标签列表
                                </h-col>
                            </h-row>
                            <h-row class-name="common-handle-padding" v-if="isShowBidTable">
                                <h-col span="24">
                                    <!-- <h-table
                                        :columns="bidHandleTableCols"
                                        :data="bidHandleTableDatas"
                                        :loading="bidTableLoading"
                                        :maxHeight="tableFixedHeight"
                                        size="small"
                                        border>
                                    </h-table> -->
                                    <!-- tagIndex -->
                                    <section>
                                        <h-row class-name="bid-table-header">
                                            <h-col span="8" class-name="audit-bid-lable">
                                                <span class="audit-common-bid-lable">标签名称</span>
                                            </h-col>
                                            <h-col span="8" class-name="audit-bid-lable">
                                                <span class="audit-common-bid-lable">标签分类</span>
                                            </h-col>
                                            <h-col span="8" class-name="audit-bid-lable">
                                                <span class="audit-common-bid-lable">BID</span>
                                            </h-col>
                                        </h-row>
                                        <h-row class-name="bid-table-content" v-if="!isBidTagsEmpty">
                                            <h-col span="24">
                                                <div v-for="(obj, index) in bidHandleTableDatas" :key="index">
                                                    <h-col span="8" class-name="bid-table-rows">
                                                        <span class="audit-common-bid-lable">{{obj.tagName}}</span>
                                                    </h-col>
                                                    <h-col span="8" class-name="bid-table-row">
                                                        <span class="audit-common-bid-lable">{{obj.tagCategory}}</span>
                                                    </h-col>
                                                    <h-col span="8" class-name="bid-table-row">
                                                        <span class="audit-common-bid-lable">
                                                            <!--  暂时隐藏 -->
                                                            <!-- {{obj.tagBid}} -->
                                                        </span>
                                                    </h-col>
                                                </div>
                                            </h-col>
                                        </h-row>
                                        <h-row class-name="bid-table-content" v-else>
                                            <h-col span="24">
                                                <div>
                                                    <p data-none="no-data-p">
                                                        <span data-none="no-data-span">暂无数据</span>
                                                    </p>
                                                </div>
                                            </h-col>
                                        </h-row>
                                    </section>
                                </h-col>
                            </h-row>
                            <h-row class-name="common-handle-padding">
                                <h-col span="12">
                                    <!-- <span class="audit-common-lable">备注</span>
                                    <h-input
                                        aria-placeholder="备注"
                                        placeholder="请输入备注"
                                        style="width: 60%"
                                        v-model="commonHandle.newsNotes"
                                        @on-change="onChangeInput(`newsNotes`)"
                                        @on-enter="onChangeInput(`newsNotes`)">
                                    </h-input> -->
                                    <span class="audit-common-lable">复核意见</span>
                                    <h-input
                                        aria-placeholder="复核意见"
                                        placeholder="请输入复核意见"
                                        style="width: 60%"
                                        ref="newsNotes"
                                        v-model="commonHandle.newsNotes"
                                        @on-change="onChangeInput(`newsNotes`)"
                                        @on-enter="onChangeInput(`newsNotes`)">
                                    </h-input>
                                    <!-- <h-select
                                        aria-placeholder="备注"
                                        placeholder="请选择备注"
                                        style="width: 60%"
                                        v-model="commonHandle.newsEmotion"
                                        filterable
                                        clearable>
                                        <h-option
                                            v-for="(item, index) in newsEmotions"
                                            :value="item.value"
                                            :key="index">
                                            {{item.title}}
                                        </h-option>
                                    </h-select> -->
                                </h-col>
                            </h-row>
                        </h-col>
                    </h-row>
                </h-col>
            </h-row>
            <h-row class-name="common-handle-padding">
                <h-col span="24">
                    <span>原始文本:</span>
                    <hr class="audit-common-padding" />
                </h-col>
            </h-row>
            <h-row class-name="common-handle-padding">
                <!-- <h-col span="24">
                    <h-input
                        placeholder="请输入..."
                        type="textarea"
                        v-model="commonHandle.textArea"
                        data-input="textarea"
                        :canResize="canResize"
                        :autosize="textareaAutoSize"
                        :disabled="textAreaDisabled"
                        readonly>
                    </h-input>
                </h-col> -->
                <h-col span="24">
                    <div
                        class="h-input-wrapper"
                        aria-placeholder="原始文本"
                        style="width: 100%;">
                        <div
                            id="audit-common-handle-text"
                            >
                        </div>
                    </div>
                </h-col>
            </h-row>
        </div>
        <!-- modal -->
        <h-msgBox
            title="复核通过"
            @on-ok="asyncNewAdd"
            v-model="modalNewAdd.showModal"
            :loading="modalNewAdd.modalLoading">
            确认复核通过<br/>
            复核意见: {{commonHandle.newsNotes}}
       </h-msgBox>
        <h-msgBox
            title="返回修正"
            @on-ok="reSureOK"
            v-model="modalResure.showModal"
            :loading="modalResure.modalLoading">
            确认返回修正<br/>
            修正原因: {{commonHandle.newsNotes}}
       </h-msgBox>
        <h-msgBox
            title="查询标签"
            @on-ok="asyncOK"
            v-model="modalNew.showModal"
            :loading="modalNew.modalLoading"
            top="50"
            width="800"
            height="520"
            footerHide>
            <div class="audit-common-footer">
                <h-row class-name="common-handle-padding">
                    <h-col span="24">
                        <h-row class-name="common-handle-padding">
                            <h-col span="10">
                                <h-row class-name="common-handle-padding">
                                    <h-col span="24">
                                        <span style="padding-left: 10px;">标签分类: </span>
                                        <h-select-tree
                                            v-model="labelCategoryModal"
                                            ref="labelCategoryModal"
                                            aria-placeholder="标签分类"
                                            placeholder="标签分类(默认值: 文本标签)"
                                            style="width: 70%"
                                            :data="labelCategories"
                                            @on-click="shitClearableSelect(`labelCategoryModal`)"
                                            icon="android-close"
                                            @on-select-change="onSelectTreeChange"
                                            :expanLevel="expandLevel"
                                            :clearable="false">
                                        </h-select-tree>
                                    </h-col>
                                </h-row>
                            </h-col>
                            <h-col span="8">
                                <h-row>
                                    <h-col span="24">
                                        <h-input
                                            aria-placeholder="标签名称"
                                            placeholder="请输入标签名称"
                                            style="width: 80%"
                                            v-model="searchValue"
                                            @on-change="onInputChange(`searchValue`)"
                                            @on-enter="onChangeInputEnter(`searchValue`)"
                                            icon="android-close"
                                            ref="searchValue"
                                            @on-click="shitClearableClick(`searchValue`)"
                                            clearable>
                                        </h-input>
                                    </h-col>
                                </h-row>
                            </h-col>
                            <h-col span="3">
                                <h-row>
                                    <h-col span="24">
                                        <h-tooltip
                                            placement="top"
                                            :disabled="!isEmptySearch"
                                            content="查询标签不可为空">
                                            <h-button
                                                :loading="modalLabelCheck.modalLoading"
                                                @click="onClickSearch"
                                                :disabled="isEmptySearch"
                                                type="primary">
                                                查询
                                            </h-button>
                                        </h-tooltip>
                                    </h-col>
                                </h-row>
                            </h-col>
                        </h-row>
                        <!-- v-if="modalNewAdd.isNewAdd" -->
                        <h-row class-name="common-handle-padding">
                            <h-col span="24" v-if="!isNewAddLabel">
                                <h-row class-name="common-handle-padding">
                                    <h-col span="4" offset="0" style="padding-left: 10px;">
                                        标签名称列表:
                                    </h-col>
                                </h-row>
                                <h-row class-name="common-handle-padding">
                                    <h-col span="24" offset="0" style="padding-left: 10px;">
                                        <h-table
                                            :disabled="!isEmptySearch"
                                            :columns="commonHandleModalTableCols"
                                            :data="commonHandleModalTableDatas"
                                            :loading="tableLoading"
                                            :maxHeight="modalTableFixedHeight"
                                            size="small"
                                            border>
                                        </h-table>
                                    </h-col>
                                </h-row>
                                <h-row class-name="audit-common-row-padding">
                                    <h-col span="24">
                                        <div style="float: right;">
                                            <h-page
                                                @on-change="onPageChange"
                                                @on-page-size-change="onPageSizeChange"
                                                :total="pagination.total"
                                                :page-size="pagination.size"
                                                :current="pagination.current"
                                                show-elevator
                                                size="small"
                                                show-total>
                                            </h-page>
                                        </div>
                                    </h-col>
                                </h-row>
                            </h-col>
                        </h-row>
                    </h-col>
                </h-row>
            </div>
        </h-msgBox>
        <!-- <h-msgBox
            title="新增标签"
            @on-ok="asyncNewAdd"
            v-model="modalNewAdd.showModal"
            :loading="modalNewAdd.modalLoading">
            <h-row>
                <h-col span="12">
                    <span>行业类别: {{labelNewAddType}}</span>,
                    <span>标签名称: {{labelNewAddName}}</span>
                </h-col>
            </h-row>
       </h-msgBox>
        <h-msgBox
            title="添加标签"
            @on-ok="asyncAdd"
            v-model="modalAdd.showModal"
            :loading="modalAdd.modalLoading">
            <h-row>
                <h-col span="12">
                    <span>行业类别: {{labelAddType}}</span>,
                    <span>标签名称: {{labelAddName}}</span>
                </h-col>
            </h-row>
        </h-msgBox> -->
        <!-- <h-msgBox
            title="添加热词"
            @on-ok="asyncAddHotWord"
            v-model="modalHotWord.showModal"
            :loading="modalHotWord.modalLoading">
            <h-row>
                <h-col span="24">
                    <span>热词名称: <strong>{{labelHotWord}}</strong></span>
                </h-col>
            </h-row>
        </h-msgBox> -->
        <section data-uid="menus" class="hidden-menus">
            <h-row>
                <h-col span="24">
                    <h-button
                        type="primary"
                        data-ref="init-btn"
                        class="hidden-menus-btn-primary"
                        @click="clickShowAdd">
                        <h-icon name="search"></h-icon>查询标签
                    </h-button>
                </h-col>
                <!-- <h-col span="24">
                    <span class="hidden-menus-space" />
                </h-col>
                <h-col span="24">
                    <h-button
                        type="primary"
                        data-ref="init-btn"
                        class="hidden-menus-btn-primary"
                        @click="clickShowHotWord">
                        + 添加热词
                    </h-button>
                </h-col> -->
            </h-row>
        </section>
    </section>
</template>

<script>
    /**
     *
     * @author xiagq
     * @copyright gildata
     *
     * @created 2019.01.02
     * @modified 2019.01.02
     *
     * @description 复核 operateAudit
     * @augments
     * @example
     *
     */

    import {
        TODAY,
        UQSTO,
        getPosition,
        positionMenu,
    } from "@/utils/utils";
    export default {
        data () {
            return {
                showHighLightTitle: false,
                newsHighLightTitle: "",// showXwbt
                expandLevel: 1,
                // autoSpanSize
                autoSpanTreeSize: 10,
                autoSpanButtonSize: 3,
                autoMaxModalWidth: 1000,
                // autoMaxModalWidth: 800,
                // 关联信息
                personTagRelationInfo: "",
                isShowPersonTagRelationInfo: false,
                isShowBidTable: false,
                isNewsHandleFinsihed: true,// 处理状态
                isFirstNews: false,
                isLastNews: false,
                prevNewsId: "",
                nextNewsId: "",
                pageFlipObj: {},
                // activeRoutersButton: this.$store.state.activeRoutersButton,
                labelNewAddType: "食品",
                labelNewAddName: "new label of food",
                labelAddType: "生活用品",
                labelAddName: "箱包",
                handleUpdateType: "",// open / close / passed
                textareaAutoSize: {
                    minRows: 12,
                    maxRows: 27,
                },
                textareaAutoSizeModal: {
                    minRows: 27,
                    maxRows: 37,
                },
                canResize: true,
                textAreaDisabled: false,
                labelCategories: [],
                newsEmotions: [],
                tableFixedHeight: 240,
                modalNew: {
                    modalLoading: true,
                    showModal: false,
                    maximize: true,
                    scrollable: true,
                    transfer: false,
                },
                modalAdd: {
                    modalLoading: true,
                    showModal: false,
                    maximize: true,
                    scrollable: true,
                    transfer: false,
                },
                modalLabelCheck: {
                    modalLoading: false,
                    showModal: false,
                },
                isFirstLoad: true,
                labelCategories: [],
                // labelCategories: [],// {value: "Kinematix", label: ""}
                // labelCategories: [],// {value: "{"title":"Maxent","value":{"zxid":"632019011201031…,"dlid":"101105","bqywdm":null},"disabled":false}", label: ""}
                labelCategorySelects: [],
                labelCategoryModal: "",// 101
                labelCategorySelect: "",
                labelCategoryName: "",
                labelCategoryText: "",
                labelCategoryId: "101",
                // labelCategoryId: "",
                // isNewAddLabel: false,
                isNewAddLabel: true,
                // searchValue: {},// 箱包
                searchValue: "",
                searchBackupValue: "",
                isEmptySearch: true,modalTableFixedHeight: 370,
                // modalTableFixedHeight: 450,
                commonHandleModalTableCols: [
                    // {
                    //     type: "selection",
                    //     width: 60,
                    //     align: "center",
                    // },
                    // {
                    //     key: "index",
                    //     title: "序号",
                    //     width: 60,
                    //     align: "center",
                    // },
                    {
                        key: "labelName",
                        title: "标签名称",
                        // sortable: true,
                        // width: 200,
                        align: "center",
                        render: (h, params) => {
                            let {
                                bqmc: labelName,
                            } = params.row;
                            return h("div", {
                                    attrs: {
                                        "title": `${labelName}`,
                                        "data-title": `${labelName}`,
                                    },
                                },
                                [
                                    h("span", {
                                        attrs: {
                                            disabled: true,
                                            "aria-placeholder": "标签名称",
                                            placeholder: "请输入标签名称",
                                        },
                                        on: {
                                            // click: this.clickHandler,
                                        },
                                    }, labelName),
                                ]
                            );
                        },
                    },
                    {
                        key: "labelCategory",
                        title: "标签分类",
                        // width: 80,
                        align: "center",
                        render: (h, params) => {
                            let {
                                // tagCategory: labelCategory,
                                // bqlb: labelCategory,
                                bqlb: labelCategories,
                            } = params.row;
                            let labelCategory = " ";
                            if (labelCategories) {
                                // labelCategory = labelCategories[1];
                                // if (labelCategories[1] === "机构") {
                                //     labelCategory = labelCategories[2] || "";
                                // }
                                labelCategory = labelCategories.slice(1).toString();
                            }
                            // labelCategory = labelCategory.toString();
                            return h("div", {
                                    attrs: {
                                        "title": `${labelCategory}`,
                                        "data-title": `${labelCategory}`,
                                    },
                                },
                                [
                                    h("span", {
                                        attrs: {
                                            disabled: true,
                                            "aria-placeholder": "标签名称",
                                            placeholder: "请输入标签名称",
                                        },
                                        on: {
                                            // click: this.clickHandler,
                                        },
                                    }, labelCategory),
                                ]
                            );
                        },
                    },
                ],
                commonHandleModalTableColsWithAlias: [
                    // {
                    //     type: "selection",
                    //     width: 60,
                    //     align: "center",
                    // },
                    // {
                    //     key: "index",
                    //     title: "序号",
                    //     width: 60,
                    //     align: "center",
                    // },
                    {
                        key: "labelName",
                        title: "标签名称",
                        // sortable: true,
                        // width: 200,
                        align: "center",
                        render: (h, params) => {
                            let {
                                bqmc: labelName,
                            } = params.row;
                            return h("div", {
                                    attrs: {
                                        "title": `${labelName}`,
                                        "data-title": `${labelName}`,
                                    },
                                },
                                [
                                    h("span", {
                                        attrs: {
                                            disabled: true,
                                            "aria-placeholder": "标签名称",
                                            placeholder: "请输入标签名称",
                                        },
                                        on: {
                                            // click: this.clickHandler,
                                        },
                                    }, labelName),
                                ]
                            );
                        },
                    },
                    {
                        key: "labelAlias",
                        title: "关联信息",
                        // sortable: true,
                        // width: 200,
                        align: "center",
                        render: (h, params) => {
                            let {
                                alias: labelAlias,
                            } = params.row;
                            // console.log(`alias `, JSON.stringify(params.row, null, 4));
                            return h("div", {
                                    attrs: {
                                        "title": `${labelAlias}`,
                                        "data-title": `${labelAlias}`,
                                    },
                                },
                                [
                                    h("span", {
                                        attrs: {
                                            disabled: true,
                                            "aria-placeholder": "标签名称",
                                            placeholder: "请输入标签名称",
                                        },
                                        on: {
                                            // click: this.clickHandler,
                                        },
                                    }, labelAlias),
                                ]
                            );
                        },
                    },
                    {
                        key: "labelCategory",
                        title: "标签分类",
                        // width: 80,
                        align: "center",
                        render: (h, params) => {
                            let {
                                // tagCategory: labelCategory,
                                // bqlb: labelCategory,
                                bqlb: labelCategories,
                            } = params.row;
                            let labelCategory = " ";
                            if (labelCategories) {
                                // labelCategory = labelCategories[1];
                                // if (labelCategories[1] === "机构") {
                                //     labelCategory = labelCategories[2] || "";
                                // }
                                labelCategory = labelCategories.slice(1).toString();
                            }
                            // labelCategory = labelCategory.toString();
                            return h("div", {
                                    attrs: {
                                        "title": `${labelCategory}`,
                                        "data-title": `${labelCategory}`,
                                    },
                                },
                                [
                                    h("span", {
                                        attrs: {
                                            disabled: true,
                                            "aria-placeholder": "标签名称",
                                            placeholder: "请输入标签名称",
                                        },
                                        on: {
                                            // click: this.clickHandler,
                                        },
                                    }, labelCategory),
                                ]
                            );
                        },
                    },
                ],
                commonHandleModalTableDatas: [],
                modalNewAdd: {
                    modalLoading: true,
                    showModal: false,
                    maximize: true,
                    scrollable: true,
                    transfer: false,
                    // modalNewAdd.isNewAdd
                    isNewAdd: true,
                },
                modalResure: {
                    modalLoading: true,
                    showModal: false,
                    maximize: true,
                    scrollable: true,
                    transfer: false,
                    title: "",
                },
                labelCategoryModal: "",
                searchValue: "",
                searchBackupValue: "",
                isEmptySearch: true,
                mediaSources: [],
                columnCategories: [],
                priorities: [],
                newsIds: [],
                commonHandle: {
                    newsStatus: "",
                    newsTitle: "",
                    newsLink: "",
                    newsBrief: "",
                    newsSource: "",
                    // publishDate: TODAY,
                    // publishDate: "2018-12-29",
                    publishDate: "",
                    newsPublishTime: "",
                    // priority: "",
                    newsId: "",
                    mediaSource: "",
                    newsAuthor: "",
                    newsEmotion: "",
                    textArea: "",
                    textAreaModal: "",
                    openFlag: false,
                    newsLogs: [],
                    newsHandleLogs: "",
                    sensitiveWords: "",
                    publicFlag: "",
                    // newsRemark: "",
                    newsNotes: "",
                    newsAuditor: "",
                    auditDate: "",
                    machineShield: "",
                },
                // isShowMachineShield: true,
                isShowMachineShield: false,
                placeholders: {
                    publishDate: "请输入查询日期",
                    // publishDate: "开始日期    ~    结束日期",
                },
                tableLoading: false,
                commonHandleTableCols: [
                    // {
                    //     type: "selection",
                    //     width: 60,
                    //     align: "center",
                    // },
                    {
                        key: "index",
                        title: "序号",
                        width: 40,
                        align: "center",
                        fixed: "left",
                        className: "mini-cell-width",
                    },
                    {
                        key: "labelName",
                        title: "标签名称",
                        // sortable: true,
                        width: 120,
                        align: "center",
                        // render: (h, params) => {
                        //     let {
                        //         labelName,
                        //     } = params.row;
                        //     return h("div", {
                        //             attrs: {
                        //                 "title": `${labelName}`,
                        //                 "data-title": `${labelName}`,
                        //             },
                        //         },
                        //         [
                        //             h("h-input", {
                        //                 props: {
                        //                     value: labelName,
                        //                 },
                        //                 attrs: {
                        //                     disabled: true,
                        //                     "aria-placeholder": "标签名称",
                        //                     placeholder: "请输入标签名称",
                        //                 },
                        //                 on: {
                        //                     // click: this.clickHandler,
                        //                     // change: this.onChangeInput("labelName"),
                        //                     // enter: this.onChangeInput("labelName"),
                        //                 },
                        //             }),
                        //         ]
                        //     );
                        // },
                    },
                    {
                        key: "labelWeight",
                        title: "权重值",
                        // sortable: true,
                        width: 80,
                        align: "center",
                        render: (h, params) => {
                            let {
                                labelWeight,
                            } = params.row;
                            return h("span",
                                {
                                    attrs: {
                                        disabled: true,
                                        "aria-placeholder": "标签权重值",
                                    },
                                    on: {
                                        // click: this.clickHandler,
                                    },
                                },
                                labelWeight
                            );
                        },
                    },
                    {
                        key: "labelAlias",
                        title: "标签关联信息",
                        // sortable: true,
                        width: 120,
                        align: "center",
                        render: (h, params) => {
                            let {
                                labelAlias,
                            } = params.row;
                            return h("div", {
                                    attrs: {
                                        "title": `${labelAlias}`,
                                        "data-title": `${labelAlias}`,
                                    },
                                },
                                [
                                    h("span", {
                                        attrs: {
                                            disabled: true,
                                            "aria-placeholder": "标签关联信息",
                                            placeholder: "请输入标签关联信息",
                                        },
                                        on: {
                                            // click: this.clickHandler,
                                        },
                                    }, labelAlias),
                                ]
                            );
                        },
                    },
                    {
                        key: "synonyms",
                        title: "标签近义词",
                        // width: 80,
                        align: "center",
                    },
                    {
                        key: "labelCategory",
                        title: "标签分类",
                        // width: 80,
                        align: "center",
                        // render: (h, params) => {
                        //     let {
                        //         tagCategory: labelCategory,
                        //     } = params.row;
                        //     return h("div", {
                        //             attrs: {
                        //                 "title": `${labelCategory}`,
                        //                 "data-title": `${labelCategory}`,
                        //             },
                        //         },
                        //         [
                        //             h("h-input", {
                        //                 props: {
                        //                     value: labelCategory ? labelCategory : "",
                        //                 },
                        //                 attrs: {
                        //                     disabled: true,
                        //                     "aria-placeholder": "标签分类",
                        //                     placeholder: "请输入标签分类",
                        //                 },
                        //                 on: {
                        //                     // click: this.clickHandler,
                        //                     // change: this.onChangeInput("labelName"),
                        //                     // enter: this.onChangeInput("labelName"),
                        //                 },
                        //             }, labelCategory),
                        //         ]
                        //     );
                        // },
                    },
                    // {
                    //     key: "operation",
                    //     title: "操作",
                    //     width: 80,
                    //     align: "center",
                    //     render: (h, params) => {
                    //         let type = `common-handle-delete`;
                    //         return h("div", [
                    //             h("a", {
                    //                 attrs: {
                    //                     "data-type": type,
                    //                 },
                    //                 class: [
                    //                     "audit-common-link",
                    //                 ],
                    //                 style: {
                    //                     color: "#298DFF !important",
                    //                     textDecoration: "none",
                    //                     cursor: "pointer",
                    //                     marginRight: "5px",
                    //                 },
                    //                 on: {
                    //                     click: () => {
                    //                         // 删除
                    //                         this.remove(params.index);
                    //                     },
                    //                 }
                    //             }, "删除"),
                    //         ]);
                    //     },
                    // },
                ],
                commonHandleTableDatas: [],
                commonHandleSearchLabels: [],
                isEmptyCommonLogs: true,
                pagination: {
                    current: 1,
                    size: 10,
                    total: 0,
                },
                bidTableLoading: false,
                // table & select
                isBidTagsEmpty: false,
                bidHandleTableDatas: [],
                initBidTags: [],
                bidTagsNames: [],
                // bidTags: [],
                // bidTagsIds: [],
                initCommonHandleTableDatas: [],
            }
        },
        methods: {
            // fixed router url query bug
            sessionRouterQuery(id = ``) {
                let router_query = JSON.parse(window.sessionStorage.getItem(`recheck_route_query_audit`));
                let {
                    type,
                    desc,
                    // uid,
                    // url: path,
                    url,
                } = router_query;
                let new_router_query = {
                    type,
                    desc,
                    uid: id,
                    url,
                    // url: operateUrl,
                };
                window.sessionStorage.setItem(`recheck_route_query_audit`, JSON.stringify(new_router_query));
            },
            sessionFilterObj(id = ``) {
                let pageFlipObj = JSON.parse(window.sessionStorage.getItem("recheck_flipObj_audit"));
                // this.pageFlipObj = pageFlipObj || {};
                this.pageFlipObj.newsId = id;
                // pageFlipObj
                let new_pageFlipObj = Object.assign({}, this.pageFlipObj);
                window.sessionStorage.setItem(`recheck_flipObj_audit`, JSON.stringify(new_pageFlipObj));
            },
            getBidsByClickSelect (bid_obj = ``, index = 0) {
            // getBidsByClickSelect (bid_name = ``, index = 0) {
                // console.log(`bid_name =`, bid_name, index);
                let {
                    tagName,
                    tagType,
                } = obj;
                let url = `/tm/getBids?bqmc=${tagName}&filterType=${tagType}`;
                // let url = `/tm/getBids?bqmc=${bid_name}`;
                let that = this;
                this.$http
                .get(url)
                .then(res => res.data)
                .then((json)=>{
                     let {
                        status,
                        msg,
                        body,
                    } = json;
                    if(status != this.$api.SUCCESS){
                        // console.log(`获取 bids =`, JSON.stringify(json, null, 4));
                        this.$hMessage.error(msg);
                        return;
                    } else {
                        let {
                            result,
                        } = body;
                        let bids = result || [];
                        if (bids.length) {
                            // this.$hMessage.success(`获取 bids 成功!`);
                            // console.log(`result bids =`, JSON.stringify(bids, null, 4));
                            that.bidHandleTableDatas[index].tagOptions = bids;
                        } else {
                            // this.$hMessage.error(msg);
                        }
                    }
                }).catch(err => console.error(`获取 bids error`, err));
            },
            onBidSelectChange(e, index) {
                // console.log(`bid select index =`, index);
                // console.log(`bid select =`, e);
                // console.log(`bid select =`, e.target);
                // console.log(`bid select =`, e.target.value);
                let bid = e.target.value;
                this.initBidTags[index].bid = bid;
                // console.log(`new this.initBidTags`, JSON.stringify(this.initBidTags, null, 4));
            },
            // 鼠标滑词
            mouseSlipGetWords() {
                const getSelectionText = () => {
                    let selectedTextWithTrim = ``;
                    if (window.getSelection){
                        // all modern browsers and IE9+
                        selectedTextWithTrim = window.getSelection().toString().trim();
                        // console.log(`you selected text with trim() =`, selectedTextWithTrim);
                    } else {
                        console.error(`鼠标滑词 selectedText is empty!`);
                    }
                    return selectedTextWithTrim;
                };
                let textarea = document.querySelector(`#audit-common-handle-text`);
                let that = this;
                textarea.addEventListener("mousedown", function(e) {
                    if (e.button === 0) {
                        // console.log("Left mouse button pressed!");
                        that.clickAutoClose();
                    } else if (e.button === 1) {
                        // console.log("Middle mouse button pressed!");
                        that.clickAutoClose();
                    } else if (e.button === 2) {
                        // console.log("Right mouse button pressed!");
                    }
                }, false);
                if (document.addEventListener) {
                    // IE >= 9; other browsers
                    textarea.addEventListener('contextmenu', function(e) {
                        let value = getSelectionText() || "";
                        if (value) {
                            that.isEmptySearch = false;
                        } else {
                            that.isEmptySearch = true;
                        }
                        // console.log(`this.isEmptySearch 1=`, this.isEmptySearch);
                        let menus = document.querySelector(`[data-uid="menus"]`);
                        let position = getPosition(e);
                        positionMenu(e, menus);
                        if (value) {
                            that.pagination.current = 1;
                            that.$hMessage.success(`滑动选取的单词: ${value}`);
                            menus.style.display = "block";
                            that.labelHotWord = value.trim();
                            // data-uid="menus"
                        } else {
                            console.log(`selected text is empty!`);
                            // that.$hMessage.error(`滑动选取的单词不可为空`);
                            that.$hMessage.info(`滑动选取的单词不可为空`);
                            that.clickAutoClose();
                        }
                        e.preventDefault();
                    }, false);
                } else {
                    // IE < 9
                    document.attachEvent('oncontextmenu', function() {
                        window.event.returnValue = false;
                    });
                }
            },
            clickAutoClose() {
                let menus = document.querySelector(`[data-uid="menus"]`);
                menus.style.display = "none";
            },
            clickShowAdd() {
                // init
                this.pagination.current = 1;
                this.clickAutoClose();
                let that = this;
                that.commonHandleModalTableData = [];
                that.searchValue = that.labelHotWord;
                // that.searchValue = value;
                that.labelAddType = `文本标签`;
                if (this.isFirstLoad) {
                    // only once
                    this.getLabelCategories(``, ``);
                    this.isFirstLoad = false;
                }
                that.onClickSearch();
                setTimeout(() => {
                    // show modal with delay
                    that.modalNew.showModal = true;
                }, 0);
            },
            onSelectTreeChange (value) {
                // console.log(`value`, value);
                // console.log(`value`, JSON.stringify(value, null, 4));
                // checked ??? selected
                let obj = value[0] || {};
                // console.log(`obj`, JSON.stringify(obj, null, 4));
                // console.log(`obj`, obj);
                // console.log(`obj`, obj.id);
                // console.log(`value`, value);
                let isSelected = obj.selected;
                // console.log(`isSelected =`, isSelected);
                let {
                    id,
                    title,
                } = obj;
                // 人物 101107 && 2019.02.21
                if (id === "101107") {
                    // this.autoMaxModalWidth = 1000;
                    this.autoSpanTreeSize = 8;
                    this.autoSpanButtonSize = 2;
                    this.isShowPersonTagRelationInfo = true;
                } else {
                    // this.autoMaxModalWidth = 800;
                    this.autoSpanTreeSize = 10;
                    this.autoSpanButtonSize = 3;
                    this.isShowPersonTagRelationInfo = false;
                }
                if (id) {
                    this.labelCategoryId = id;
                    this.labelAddType = title || "文本标签";
                } else {
                    this.labelCategoryId = "101";
                    this.labelAddType = "文本标签";
                }
            },
            onInputChange (type = ``) {
                let value = this[type];
                // this.searchValue = value.trim();
                this[type] = value.trim();
                // this.$hMessage.info(`${type} = ${value}`);
                // console.log(`searchValue =`, value);
                // this.labelCategoryText = value;
                if (value) {
                    if (type === "searchValue") {
                        this.isEmptySearch = false;
                    } else {
                        // this.isEmptySearch = true;
                    }
                } else {
                    if (type === "searchValue") {
                        this.isEmptySearch = true;
                    } else {
                        // this.isEmptySearch = false;
                    }
                }
            },
            onChangeInputEnter (type = ``) {
                let value = this[type];
                // this.searchValue = value.trim();
                 this[type] = value.trim();
                // this.$hMessage.info(`${type} = ${value}`);
                // console.log(`searchValue =`, value);
                // this.labelCategoryText = value;
                if (value) {
                    if (type === "searchValue") {
                        this.isEmptySearch = false;
                        // enter
                        this.onClickSearch();
                    } else {
                        // this.isEmptySearch = true;
                    }
                } else {
                    if (type === "searchValue") {
                        this.isEmptySearch = true;
                    } else {
                        // this.isEmptySearch = false;
                    }
                }
                // search
            },
            shitClearableClick(type = ``) {
                // searchValue
                // http://192.168.58.189:8080/hui/#/components/input
                // shiy api
                // this.$hMessage.info("icon点击事件");
                this[type] = ``;
                this.$refs[type].focus();
                // disabled
                // this.isEmptySearch = true;
                if (type === "searchValue") {
                    this.isEmptySearch = true;
                }
            },
            //pagination
            getNewTableDatas (pagination = {}) {
                let {
                    id,
                    value,
                    tagRelation,
                } = this.commonFiltersPagination;
                let {
                    current,
                    size,
                } = pagination;
                let options = {
                    id,
                    value,
                    current,
                    size,
                    tagRelation,
                };
                this.getSearchLabels(options);
            },
            onPageChange (current = 1) {
                this.pagination.current = current;
                // console.log(`current =`, current);
                let {
                    size,
                } = this.pagination;
                this.getNewTableDatas({
                    current,
                    size,
                });
            },
            onPageSizeChange (size = 10) {
                this.pagination.size = size;
                let {
                    current,
                } = this.pagination;
                this.getNewTableDatas({
                    current,
                    size,
                });
            },
            // pagination
            // 鼠标滑词
            // shortcut keys
            keyboardShortcutKeys() {
                // // get flip page object
                let that = this;
                let body = document.querySelector(`body`);
                let bindFlag = body.dataset.bindFlag;
                if (bindFlag === "true") {
                    // console.log(`only need binding once!`);
                } else {
                    body.dataset.bindFlag = "true";
                    // bind once
                    body.addEventListener("keyup", function(e) {
                        let key = e.which || e.keyCode;
                        if(e.which === 17) {
                            // init
                            this.isCtrlPressed = false;
                        }
                    });
                    body.addEventListener("keydown", function(e) {
                        let key = e.which || e.keyCode;
                        if(e.which === 17) {
                            this.isCtrlPressed = true;
                        }
                        let isCtrl = this.isCtrlPressed;
                        // if(e.which === 83 && isCtrl) {
                        //     if (that.onClickButton) {
                        //         that.onClickButton(`save`);
                        //     }
                        // }
                        if(e.which === 68 && isCtrl) {
                            if (that.clickGetNewsInfos) {
                                if (!that.isFirstNews) {
                                    that.clickGetNewsInfos(`prev`);
                                } else {
                                    // btn bug
                                    console.log(`prev btn bug!`);
                                }
                            }
                        }
                        if(e.which === 70 && isCtrl) {
                            if (that.clickGetNewsInfos) {
                                if (!that.isLastNews) {
                                    that.clickGetNewsInfos(`next`);
                                } else {
                                    // btn bug
                                    console.log(`next btn bug!`);
                                }
                            }
                        }
                        // if(e.which === 88 && isCtrl) {
                        //     if (that.clickShowResureModal) {
                        //         that.clickShowResureModal(`passed`);
                        //     }
                        // }
                    });
                }
            },
            clickGetNewsInfos (type = ``) {
                // console.log(`button type =`, type);
                let {
                    dataStatus,
                    // dataType,
                    newsListType,
                    gkbz,
                    handleUser,
                    mtcc,
                    newsId,
                    xwbt,
                    fbsj,
                    publishTime,
                    publishTimeEnd,
                    current,
                    size,
                } = this.pageFlipObj;
                let options = {
                    dataStatus,
                    // dataType,
                    newsListType,
                    gkbz,
                    handleUser,
                    mtcc,
                    newsId,
                    xwbt,
                    fbsj,
                    publishTime,
                    publishTimeEnd,
                    current,
                    size,
                };
                // operType: "1",// 0 上一页； 1 下一页
                let operType = "1";
                if (type === "prev") {
                    operType = "0";
                }
                options.operType = operType;
                // console.log(`new options =`, JSON.stringify(options, null, 4));
                if (Object.values(options).length) {
                    this.getNewsInfos(options, type);
                }
            },
            getNewsInfos(options = {}, type = ``) {
                let url = `/tm/getAdjacentNewsLogInfo`;
                this.$http
                .post(url, options)
                .then(res => res.data)
                .then((json)=>{
                     let {
                        status,
                        msg,
                        body,// null
                    } = json;
                    // console.log(`0 上一页； 1 下一页 json =`, JSON.stringify(json, null, 4));
                    if(status != this.$api.SUCCESS){
                        this.$hMessage.error(msg);
                    } else {
                        // this.$hMessage.success(`上一页/下一页: ${msg}`);
                        let that = this;
                        if (body === null) {
                            if (type === "prev") {
                                this.isFirstNews = true;
                                // console.log(`prev null`);
                                this.$hMessage.info(`上一条不存在!`);
                            } else {
                                this.isLastNews= true;
                                // console.log(`next null`);
                                this.$hMessage.info(`下一条不存在!`);
                            }
                        } else {
                            if (type === "next") {
                                this.isFirstNews = false;
                            } else {
                                this.isLastNews= false;
                            }
                            // update infos
                            // console.log(`body`, JSON.stringify(body, null, 4));
                            let {
                                newsId,
                                publishTime,
                                current: new_current,
                            } = body;
                            this.pageFlipObj.current = new_current;
                            this.pageFlipObj.newsId = newsId;
                            this.pageFlipObj.fbsj = publishTime;
                            // router url query
                            this.sessionRouterQuery(newsId);
                            this.sessionFilterObj(newsId);
                            this.getHandleInfos(newsId);
                        }
                    }
                }).catch(err => console.error(`获取 0 上一页； 1 下一页  error`, err));
            },
            // 上一条/下一条
            clickGetNewsLink(data_ref = `newsLink`) {
                let that = this;
                let newsLink = document.querySelector(`[data-uid="${data_ref}"]`);
                // let newsLink = document.querySelector(`[data-uid="newsLink"]`);
                if (newsLink) {
                    let result = that.commonHandle.newsLink || ``;
                    let input = newsLink.lastElementChild;
                    input.addEventListener(`click`, (e) => {
                        try {
                            if (result) {
                                input.select();
                                document.execCommand("copy");
                                that.$hMessage.success(`资讯链接地址, 复制成功!`);
                            } else {
                                that.$hMessage.info(`资讯链接地址, 无法复制!`);
                            }
                        } catch (err) {
                            console.log(`click copy error =`, err);
                            that.$hMessage.error(`你的浏览器太古老了，暂时不支持点击复制的功能!`);
                        }
                    });
                }
            },
            clickGetNewsId() {
                let that = this;
                let newsID = document.querySelector(`[data-uid="newsId"]`);
                if (newsID) {
                    let result = that.commonHandle.newsId || ``;
                    let input = newsID.lastElementChild;
                    // input.style = `width: 100%; min-width: 217px; color: #000; cursor: pointer !important;`;
                    input.addEventListener(`click`, (e) => {
                        try {
                            if (result) {
                                input.select();
                                document.execCommand("copy");
                                that.$hMessage.success(`资讯 ID, 复制成功!`);
                            } else {
                                that.$hMessage.info(`资讯 ID 为空, 无法复制!`);
                            }
                        } catch (err) {
                            console.log(`click copy error =`, err);
                            that.$hMessage.error(`你的浏览器太古老了，暂时不支持点击复制的功能!`);
                        }
                    });
                } else {
                    //
                }
            },
            returnParentPage () {
                let path = `/audit/news/recheck/operate-audit`;
                this.$store.commit("DEL_TAB", path);
                // re-direct
                this.$router.push(`/audit/news/recheck`);
            },
            // filter methods
            onChangeDatePicker (value) {
                this.commonHandle.publishDate = value;
            },
            onChangeInput (type = ``) {
                let value = this.commonHandle[type];
                // this.$hMessage.info(`${type} = ${value}`);
            },
            onChangeSelect (type = ``) {
                let value = this.commonHandle[type];
                // this.$hMessage.info(value);
            },
            onClickButton (type = ``) {
                // close modal first
                this.modalResure.showModal = false;
                let {
                    newsNotes: remark,
                    newsId,
                }= this.commonHandle;
                let options = {
                    newsId,
                    remark,
                };
                // console.log(`${type === "audit" ? "复核" : "修正"} =`, JSON.stringify(options, null, 4));
                let url = ``;
                switch (type) {
                    case "audit":
                        url = `/tm/auditPassedByNewsId`;
                        break;
                    case "modify":
                        url = `/tm/returnModifyByNewsId`;
                        break;
                    default:
                        break;
                }
                // 复核通过 /auditPassedByNewsId
                // 返回修正 /returnModifyByNewsId
                this.commonAudit(url, options, type);
            },
            commonAudit (url, options, type) {
                this.$http
                .post(url, options)
                .then(res => res.data)
                .then((json)=>{
                    let {
                        status,
                        msg,
                        body,
                    } = json;
                    // console.log(`复核 json =`, JSON.stringify(json, null, 4));
                    if(status != this.$api.SUCCESS){
                        // console.log(`复核 json =`, JSON.stringify(json, null, 4));
                        this.$hMessage.error(msg);
                        // let that = this;
                        // setTimeout(() => {
                        //     that.returnParentPage();
                        // }, 500);
                        return;
                    } else {
                        let message = (type === "audit") ? "复核通过成功!" : "返回修正成功!"
                        this.$hMessage.success(message);
                        // let that = this;
                        // setTimeout(() => {
                        //     let path = `/audit/news/common/operate-audit`;
                        //     that.$store.commit("DEL_TAB", path);
                        //     that.returnParentPage();
                        // }, 0);
                        let that = this;
                        setTimeout(() => {
                            that.clickGetNewsInfos(`next`);
                        }, 0);
                    }
                }).catch(err => console.error(`复核  error`, err));
            },
            onSave (type = ``) {
                // let {
                //     publishDate: publishTime,
                //     newsTitle: xwbt,
                //     mediaSource: mtcc,
                //     columnCategory: lmfl,
                //     // priority: yxj,
                //     processingStatus: dataStatus,
                //     processingPersonnel: handleUser,
                //     newsId,
                // }= this.commonHandle;
                // this.getCommonTableDatas(options);
                //POST
                let url = `/tm/modifyById`;
                // let url = `/tm/prePublicByNewsId`;
                // let url = `/tm/shieldByNewsId`;
                // let url = `/tm/processedByNewsId`;
                this.$http
                .post(url, {
                    // options
                })
                .then(res => res.data)
                .then((json)=>{
                    console.log(`save 标签 json =`, JSON.stringify(json, null, 4));
                    // if (!json.body) {
                    //     console.log(`save 标签 json =`, JSON.stringify(json, null, 4));
                    // } else {
                    //     let {
                    //         status,
                    //         msg,
                    //         body: {
                    //             classification: listDatas,
                    //         },
                    //     } = json;
                    //     listDatas = listDatas.map(
                    //         (obj, i) => {
                    //             let {
                    //                 clms: title,
                    //                 dm: value,
                    //                 //lb: 7
                    //             } = obj;
                    //             return {
                    //                 title,
                    //                 value,
                    //             };
                    //         }
                    //     );
                    //     if(status != this.$api.SUCCESS){
                    //         this.$hMessage.error(msg);
                    //         return;
                    //     } else {
                    //         this[listType] = listDatas;
                    //         this.labelCategoryModal = listDatas;
                    //     }
                    // }
                }).catch(err => console.error(`save 标签 error`, err));
            },
            deleteTag(index = 0) {
                console.log(`tag index =`, index);
            },
            remove (index) {
                this.commonHandleTableDatas.splice(index, 1);
            },
            asyncOK () {
                setTimeout(() => {
                    this.modalNew.showModal = false;
                }, 2000);
            },
            asyncNewAdd () {
                let type = `audit`;
                this.onClickButton(type);
                setTimeout(() => {
                    this.modalNewAdd.showModal = false;
                }, 1000);
            },
            asyncAdd () {
                setTimeout(() => {
                    this.modalAdd.showModal = false;
                }, 2000);
            },
            reSureOK () {
                let type = `modify`;
                // let type = this.handleUpdateType;
                this.onClickButton(type);
                // setTimeout(() => {
                //     this.modalResure.showModal = false;
                // }, 2000);
            },
            clickShowModal() {
                // delay load tree
                if (this.isFirstLoad) {
                    // only once
                    this.getLabelCategories(``, ``);
                    this.isFirstLoad = false;
                }
                // this.getLabelCategories(``, ``);
                // show text
                setTimeout(() => {
                    this.modalNew.showModal = true;
                    // let textArea = this.commonHandle.textArea;
                    // let text = document.querySelector(`#audit-common-handle-modal-text`);
                    // text.innerHTML = "";
                    // text.insertAdjacentHTML(`beforeend`, textArea);
                }, 0);
            },
            clickShowAddModal() {
                this.modalAdd.showModal = true;
            },
            clickShowNewAddModal() {
                this.modalNewAdd.showModal = true;
            },
            clickShowResureModal(type = ``) {
                this.modalResure.showModal = true;
                // console.log(`button type =`, type);
                this.handleUpdateType = type;
            },
            onClickSearch() {
                // init
                this.pagination.current = 1;
                // let labelCategory = this.labelCategoryModal;
                // this.getSearchLabels(labelCategoryId, searchValue);
                this.modalLabelCheck.modalLoading = true;
                let searchValue = this.searchValue;
                let labelCategoryId = this.labelCategoryId || `101`;
                let personTagRelationInfo = this.personTagRelationInfo;
                let options = {
                    tagRelation: personTagRelationInfo,
                    id: labelCategoryId,
                    value: searchValue,
                    size: 10,
                    current: 1,
                };
                // update state
                this.commonFiltersPagination = {...options};
                this.getSearchLabels(options);
            },
            onSearchValueChange(obj = ``) {
                let {
                    value,
                    // title,
                    label,
                } = obj
                // console.log(`search obj =`, obj);
                this.searchValue = value.trim();
                // this.searchBackupValue = value.trim();
                if (label) {
                    this.modalNewAdd.isNewAdd = false;
                } else {
                    this.modalNewAdd.isNewAdd  = true;
                }
            },
            // onSearchValueChange(value = ``) {
            //     console.log(`searchValue =`, value);
            //     this.searchValue = value.trim();
            //     this.searchBackupValue = value.trim();
            //     if (value) {
            //         this.isEmptySearch = false;
            //     }
            // },
            onSearchValueQueryChange(value = ``) {
                // console.log(`searchValueQuery =`, value);
                this.searchValue = value.trim();
                // this.searchBackupValue= value.trim();
                if (value) {
                    this.isEmptySearch = false;
                } else {
                    this.isEmptySearch = true;
                }
            },
            // onRemoteSearchValueChange(value =``) {
            //     console.log(`searchValue =`, value);
            //     this.searchValue = value.trim();
            // },
            // remoteMethod1 (query) {
            //     if (query !== '') {
            //         this.loading1 = true;
            //         setTimeout(() => {
            //             this.loading1 = false;
            //             const list = this.list.map(item => {
            //                 return {
            //                     value: item,
            //                     label: item
            //                 };
            //             });
            //             this.options1 = list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
            //         }, 200);
            //     } else {
            //         this.options1 = [];
            //     }
            // },
            onClickAdd() {
                // this.getSearchLabels();
            },
            // 栏目分类
            getColumnCategoryByKeyWord(lb = 7, keyWord = ``, listType =``, debug = false){
                if (debug) {
                    console.log(`listType =`, listType);
                }
                // let url = `/tm/classification?lb=${lb}`;
                // if (keyWord) {
                //     url = `/tm/classification?lb=${lb}&keyWord=${keyWord}`;
                // }
                let url = `/tm/classification?lb=${lb}&keyWord=${keyWord}`;
                this.$http
                .get(url)
                .then(res => res.data)
                .then((json)=>{
                    if (!json.body) {
                        console.log(`栏目分类 json =`, JSON.stringify(json, null, 4));
                    } else {
                        let {
                            status,
                            msg,
                            body: {
                                classification: listDatas,
                            },
                        } = json;
                        listDatas = listDatas.map(
                            (obj, i) => {
                                let {
                                    clms: title,
                                    dm: value,
                                    //lb: 7
                                } = obj;
                                return {
                                    title,
                                    value,
                                };
                            }
                        );
                        if(status != this.$api.SUCCESS){
                            this.$hMessage.error(msg);
                            return;
                        } else {
                            this[listType] = listDatas;
                        }
                    }
                }).catch(err => console.error(`栏目分类  error`, err));
            },
            // 标签分类
            getLabelCategories (level = 8, rootId = `101`) {
                // let url = `/tm/queryTagCategory`;
                let url = `/tm/queryTagCategory`;
                // let url = `/tm/queryTagCategory?categoryLevel=${level}&parentCategoryId=${rootId}`;
                this.$http
                .get(url)
                .then(res => res.data)
                .then((json)=>{
                    // console.log(`标签分类 json =`, JSON.stringify(json, null, 4));
                    let {
                        status,
                        msg,
                        body,
                    } = json;
                    if (!json.body) {
                        console.log(`标签分类 json =`, JSON.stringify(json, null, 4));
                    } else {
                        let labelCategories = [];
                        // labelCategories.push(body);
                        let {
                            children,
                        } = body;
                        // filter
                        // "id": "101108", "title": "产品"
                        let new_children = [];
                        if (children.length) {
                            children.forEach(
                                (obj, i) => {
                                    let {
                                        id,
                                    } = obj;
                                    if (id !== "101108") {
                                        new_children.push(obj);
                                    }
                                }
                            );
                        }
                        let new_body = {
                            expand: true,
                            // children: [],
                            children: new_children,
                            id: "101",
                            title: "文本标签",
                        };
                        labelCategories.push(new_body);
                        if(status != this.$api.SUCCESS){
                            this.$hMessage.error(msg);
                            return;
                        } else {
                            this.labelCategories = labelCategories;
                            // this.labelCategoryModal = listDatas;
                        }
                    }
                }).catch(err => console.error(`标签分类  error`, err));
            },
            // 标签查询
            getSearchLabels (options = {}) {
                let {
                    id: tagId,
                    value: tagValue,
                    size: pageSize,
                    current: pageNum,
                    tagRelation,
                } = options;
                if (!tagId) {
                    tagId = `101`;
                }
                if (!tagValue) {
                    tagValue = `箱包`;
                }
                if (!tagRelation) {
                    tagRelation = ``;
                }
                let url = `/tm/queryTagsByTagValueLike`;
                if (tagId) {
                    // url += `?categoryId=${tagId}&tagValue=${tagValue}&pageSize=${pageSize}&pageNum=${pageNum}`;
                    url += `?categoryId=${tagId}&tagValue=${tagValue}&pageSize=${pageSize}&pageNum=${pageNum}&tagRelation=${tagRelation}`;
                }
                // url = `/tm/queryTagsByTagValueLike?categoryId=${tagId}&tagValue=${tagValue}`;
                this.tableLoading = true;
                this.sNewAddLabel = false;
                this.$http
                .get(url)
                .then(res => res.data)
                .then((json)=>{
                    let {
                        status,
                        msg,
                        body,
                    } = json;
                    if(status != this.$api.SUCCESS){
                        this.pagination.total = 0;
                        this.pagination.current = 1;
                        this.sNewAddLabel = true;
                        this.tableLoading = false;
                        this.modalLabelCheck.modalLoading = false;
                        // server bug
                        this.labelCategorySelects =  [];
                        this.commonHandleModalTableDatas = [];
                        // this.commonHandleModalTableDatasWithAlias = [];
                        // console.log(`标签查询 json =`, JSON.stringify(json, null, 4));
                        this.$hMessage.error(msg);
                        return;
                    } else {
                        this.modalLabelCheck.modalLoading = false;
                        let {
                            total_num: total,
                            tag_objects: listDatas,
                            flag: aliasFlag,
                        } = body;
                        // 0 = 展示
                        if (aliasFlag === 0) {
                            this.commonHandleModalTableCols = this.commonHandleModalTableColsWithAlias;
                        }
                        this.pagination.total = total || 0;
                        let commonHandleModalTableDatas = [];
                        // let commonHandleModalTableDatasWithAlias = [];
                        if (listDatas.length) {
                            this.$hMessage.success(`查询标签成功!`);
                            listDatas = listDatas.map(
                                (obj, i) => {
                                    let {
                                        tag_value: title,
                                        // tag_value: value,
                                        // tag_id: value,
                                        // tag_value: bqmc,
                                        category_id: dlid,
                                        // tag_categorys: tagCategories,
                                        tag_categorys: bqlb,
                                        tag_id: bqdm,
                                        other_obj: {
                                            business_id: bid,
                                        },
                                        relationInfo: alias,
                                    } = obj;
                                    // let tagCategory = [];
                                    // if (tagCategories) {
                                    //     if (tagCategories[1] === "机构") {
                                    //         if (tagCategories[2]) {
                                    //             tagCategory.push(tagCategories[2]);
                                    //         }
                                    //     } else {
                                    //         tagCategory.push(tagCategories[1]);
                                    //     }
                                    // }
                                    // let tagCategory = " ";
                                    // if (tagCategories) {
                                    //     tagCategory = tagCategories[1];
                                    //     if (tagCategories[1] === "机构") {
                                    //         tagCategory = tagCategories[2] || "";
                                    //     }
                                    // }
                                    // add label
                                    let tag_obj = {
                                        zxid: this.commonHandle.newsId,
                                        bqmc: title,
                                        bqdm,
                                        bqlb,
                                        dlid,
                                        bqywdm: bid ? bid : null,
                                        alias,
                                    };
                                    // console.log(`标签分类 =`, bqlb);
                                    commonHandleModalTableDatas.push(tag_obj);
                                    // console.log(`标签 list =`, JSON.stringify(commonHandleModalTableDatas, null, 4));
                                    // alias && aliasFlag
                                    return {
                                        uid: bqdm,
                                        title,
                                        label: title,
                                        alias,// new add
                                        // value: bqdm,
                                        // tag_obj: {
                                        //     zxid: this.commonHandle.newsId,
                                        //     bqmc: title,
                                        //     bqdm,
                                        //     bqlb,
                                        //     dlid,
                                        //     bqywdm: bid ? bid : null,
                                        // },
                                        value: JSON.stringify(tag_obj),// String || Number && no support Object
                                        // disabled: false,
                                    };
                                }
                            );
                            this.labelCategorySelects = listDatas;
                            this.commonHandleModalTableDatas = commonHandleModalTableDatas;
                            // console.log(`SearchLabels[0] =`, JSON.stringify(listDatas[0], null, 4));
                            this.isNewAddLabel = false;
                            this.modalNewAdd.isNewAdd = false;
                            // setTimeout(() => {
                            //     this.$refs["labelCategorySelect"].focus();
                            // }, 500);
                        }else {
                            // console.log(`no data!`);
                            this.$hMessage.info(`未查询到标签!`);
                            this.modalNewAdd.isNewAdd = true;
                            this.isNewAddLabel = true;
                        }
                        this.tableLoading = false;
                        this.isEmptySearch = false;
                        // this.labelCategoryModal = JSON.stringify(listDatas[0]);
                        // this.commonHandleSearchLabels = listDatas;
                        // 箱包
                        // console.log(`SearchLabels =`, JSON.stringify(listDatas, null, 4));
                        // setTimeout(() => {
                        //     console.log(`searchBackupValue =`, this.searchBackupValue);
                        //     this.searchValue = this.searchBackupValue;
                        // }, 0);
                        // setTimeout(() => {
                        //     this.searchValue = JSON.stringify(listDatas[0]);
                        //     // this.searchValue = JSON.stringify(this.commonHandleSearchLabels[0]);
                        // }, 1000);
                    }
                }).catch(err => console.error(`标签查询  error`, err));
            },
            filterLabelsTableDatas (listDatas = []) {
                if (Array.isArray(listDatas) && listDatas.length) {
                    listDatas = listDatas.map(
                        (obj, i) => {
                            // let {
                            //     zxid: newsId,
                            //     bqmc: labelName,
                            //     bqdm: labelCode,
                            //     bqlb: tagCategories,// array[1]
                            //     id: tag_id,
                            // } = obj;
                            // let tagCategory = " ";
                            // if (tagCategories) {
                            //     tagCategory = tagCategories[1];
                            // }
                            // return {
                            //     index: i + 1,
                            //     newsId,
                            //     labelName,
                            //     labelCode,
                            //     tagCategory,
                            //     tag: obj,
                            //     tag_id,
                            // };
                            let {
                                zxid: newsId,
                                bqmc: labelName,
                                bqdm: labelCode,
                                bqlb: tagCategories,// array[1]
                                // id: tag_id,
                                relationInfo: labelAlias,
                                // bqqz: labelWeight,
                                showBqqz: labelWeight,
                            } = obj;
                            if (!labelWeight) {
                                labelWeight = "";
                            } else {
                                labelWeight = parseFloat(labelWeight).toFixed(3);
                            }
                            let tagCategory = " ";
                            // if (tagCategories) {
                            //     tagCategory = tagCategories[1];
                            //     if (tagCategories[1] === "机构") {
                            //         tagCategory = tagCategories[2] || "";
                            //     }
                            // }
                            if (tagCategories) {
                                tagCategory = tagCategories.slice(1).toString();
                            }
                            // if (labelCode) {
                            //     uniqueTagsIds.push(labelCode);
                            // }
                            return {
                                index: i + 1,
                                newsId,
                                labelName,
                                labelCode,
                                tagCategory,
                                tag: obj,
                                tag_id: labelCode,
                                labelAlias,
                                labelWeight,
                            };
                        }
                    );
                } else {
                    listDatas = [];
                    // setTimeout(() => {
                    //     this.$hMessage.info(`标签列表不可以为空!`);
                    // }, 1000);
                }
                this.commonHandleTableDatas = listDatas;
            },
            // 获取一般资讯: 处理详情
            getHandleInfos(uniqueNewsId = ``) {
                let router_query = JSON.parse(window.sessionStorage.getItem(`recheck_route_query_audit`));
                let {
                    type,
                    desc,
                    uid,
                    url: path,
                } = router_query;
                // let {
                //     type,
                //     desc,
                //     uid,
                //     url: path,
                // } = this.$route.query;
                let url = `${path}?newsId=${uid}`;
                if (uniqueNewsId) {
                    url = `${path}?newsId=${uniqueNewsId}`;
                }
                // this.tableLoading = true;
                this.$http
                .get(url)
                .then(res => res.data)
                .then((json)=>{
                    let {
                        status,
                        msg,
                        body,
                    } = json;
                    if(status != this.$api.SUCCESS){
                        // console.log(`一般资讯: 处理详情 json =`, JSON.stringify(json, null, 4));
                        let that = this;
                        setTimeout(() => {
                            that.returnParentPage();
                        }, 500);
                        return;
                    } else {
                        let {
                            showXwbt: newsHighLightTitle,
                            xwbt: newsTitle,
                            ljdz: newsLink,
                            zxzy: newsBrief,
                            dataStatusDesc: newsStatus,
                            dataStatus,
                            // zxly: newsSource,
                            fbsj: publishDate,
                            xxfbsj: newsPublishTime,
                            // lmfl: columnCategory,
                            // yxj: priority,
                            mtcc: mediaSource,
                            zxzz: newsAuthor,
                            xgry: newsAuditor,
                            xgsj: auditDate,
                            newsId,
                            zxnr: textArea,
                            tags: listDatas,
                            qgzfm: newsEmotion,
                            qgzfmSet: newsEmotions,
                            gkbz: openFlag,// 屏蔽 0, 公开 1
                            remark: newsNotes,
                            proInfo: newsLogs,
                            sensitives: sensitiveWords,
                            personTag: bidTags,
                            machineShieldDesc: machineShield,// 机器屏蔽原因
                        } = body;
                        if (machineShield === "") {
                            this.isShowMachineShield = false;
                        } else {
                            this.isShowMachineShield = true;
                        }
                        // this.isShowMachineShield = true;
                        if (newsHighLightTitle.includes(`span`)) {
                            this.showHighLightTitle = true;
                            setTimeout(() => {
                                let highLightTitle = document.querySelector(`[data-dom="highlight-title"]`);
                                highLightTitle.innerHTML = ``;
                                highLightTitle.insertAdjacentHTML(`beforeend`, newsHighLightTitle);
                            }, 0);
                        } else {
                            this.showHighLightTitle = false;
                        }
                        if (!bidTags.length) {
                            bidTags = [];
                            this.isShowBidTable = false;
                        } else {
                            this.isShowBidTable = true;
                        }
                        this.initBidTags = bidTags || [];
                        // shaped bidTags
                        if (Array.isArray(bidTags) && bidTags.length) {
                            let bidTagsNames = [];
                            let bidHandleTableDatas = [];
                            bidTags.forEach((obj, index) => {
                                let {
                                    bqmc: tagName,
                                    // id: tagId,
                                    filterTypeDesc: tagCategory,
                                    filterType: tagType,
                                } = obj;
                                if (!tagCategory) {
                                    tagCategory = "";
                                }
                                if (!tagName) {
                                    tagName = "";
                                }
                                if (!tagType) {
                                    tagType = "";
                                }
                                let newBidTag = {
                                    index,
                                    tagIndex: index,
                                    // tagIndex: tagId,
                                    tagName,
                                    tagCategory,// filterTypeDesc
                                    tagValue: "",
                                    tagOptions: [],
                                };
                                // async get bids
                                bidTagsNames.push({
                                    tagName,
                                    tagType,
                                });
                                // bidTagsNames.push(tagName);
                                bidHandleTableDatas.push(newBidTag);
                            });
                            this.bidTagsNames = bidTagsNames;
                            this.bidHandleTableDatas = bidHandleTableDatas;
                            this.isBidTagsEmpty = false;
                            let that = this;
                            setTimeout(() => {
                                if (bidTagsNames.length) {
                                    // bidTagsNames.forEach(
                                    //     (obj, i) => {
                                    //         // tagOptions
                                    //         that.getBidsByClickSelect(obj, i);
                                    //     }
                                    // );
                                    // bidTagsNames.forEach(
                                    //     (name, i) => {
                                    //         // tagOptions
                                    //         that.getBidsByClickSelect(name, i);
                                    //     }
                                    // );
                                }
                            }, 0);
                        } else {
                            this.bidHandleTableDatas = [];
                            this.bidTagsNames = [];
                            this.isBidTagsEmpty = true;
                        }
                        if(dataStatus === 0) {
                            this.isNewsHandleFinsihed = true;
                        }
                        if(dataStatus === 1) {
                            this.isNewsHandleFinsihed = false;
                        }
                        if (!sensitiveWords) {
                            sensitiveWords = "";
                        }else {
                            sensitiveWords = sensitiveWords.toString();
                        }
                        let publicFlag = ``;
                        if (openFlag === 0) {
                            // 1 === open
                            openFlag = true;
                            publicFlag = "屏蔽";
                        } else if (openFlag === 1){
                            // 0 === close
                            openFlag = false;
                            publicFlag = "公开";
                        }
                        if (newsEmotions) {
                            let emotions = [];
                            newsEmotions.forEach(
                                (obj, i) => {
                                    let {
                                        qgzfm: value,
                                        qgzfmDesc: title,
                                    } = obj;
                                    emotions.push({
                                        value: value.toString(),
                                        title,
                                    });
                                }
                            );
                            this.newsEmotions = emotions;
                        }
                        let newsHandleLogs = ``;
                        if (newsLogs.length) {
                            this.isEmptyCommonLogs = false;
                            newsLogs.forEach(
                                (str, i) => {
                                    if (i % 2 === 0) {
                                        // h-tooltip
                                        newsHandleLogs += `
                                            <span
                                                data-title="${str}"
                                                class="audit-common-handle-logs-row-color-odd">
                                                ${str}
                                            </span><br/>
                                        `;
                                    } else {
                                        newsHandleLogs += `
                                            <span
                                                data-title="${str}"
                                                class="audit-common-handle-logs-row-color-event">
                                                ${str}
                                            </span><br/>
                                        `;
                                    }
                                }
                            );
                        } else {
                            this.isEmptyCommonLogs = true;
                        }
                        setTimeout(() => {
                            let flag = this.isEmptyCommonLogs;
                            if (!flag) {
                                let logs = document.querySelector(`#audit-common-handle-logs`);
                                logs.innerHTML = "";
                                logs.insertAdjacentHTML(`beforeend`, newsHandleLogs);
                            }
                        }, 0);
                        let newText = "";
                        if (textArea) {
                            let textArr = textArea.split(`\\n`);
                            let noImgArr = [];
                            textArr.forEach(
                                (item, i) => {
                                    if (!item.includes("hsjyimg")) {
                                        noImgArr.push(item);
                                    } else {
                                        // replaceAll
                                        let newItem = item.replace(/hsjyimg/ig, ``);
                                        noImgArr.push(newItem);
                                    }
                                }
                            );
                            noImgArr.forEach(
                                (item, i) => {
                                    if (i % 4 === 0) {
                                        i === 0 ? item = `${item}<br />` : item = `${item}<br /><hr style="margin: 10px;"/>`;
                                    } else {
                                        item = `${item}<br />`;
                                    }
                                    newText += item;
                                }
                            );
                        }
                        setTimeout(() => {
                            let text = document.querySelector(`#audit-common-handle-text`);
                            text.innerHTML = "";
                            // text.insertAdjacentHTML(`beforeend`, textArea);
                            text.insertAdjacentHTML(`beforeend`, newText);
                        }, 0);
                        this.textAreaDisabled = true;
                        this.commonHandle = {
                            textArea,
                            textAreaModal: textArea,
                            newsId,
                            newsTitle,
                            newsLink,
                            newsBrief,
                            newsStatus,
                            // newsSource,
                            // publishDate: TODAY,
                            publishDate,
                            newsPublishTime,
                            // columnCategory,
                            // priority,
                            mediaSource,
                            newsAuthor,
                            newsAuditor,
                            auditDate,
                            newsEmotion: newsEmotion ? newsEmotion.toString() : "",// select number bug!
                            openFlag,
                            newsHandleLogs,
                            sensitiveWords,
                            publicFlag,
                            newsNotes,
                            machineShield,
                        };
                        if (Array.isArray(listDatas) && listDatas.length) {
                            listDatas = listDatas.map(
                                (obj, i) => {
                                    let {
                                        zxid: newsId,
                                        bqmc: labelName,
                                        bqdm: labelCode,
                                        bqlb: tagCategories,// array[1]
                                        // id: tag_id,
                                        relationInfo: labelAlias,
                                        // bqqz: labelWeight,
                                        showBqqz: labelWeight,
                                        synonym: synonyms,
                                    } = obj;
                                    if (!synonyms.length) {
                                        synonyms = "";
                                    } else {
                                        synonyms = synonyms.join();
                                        // synonyms = synonyms.join(`,`);
                                    }
                                    // if (!labelWeight) {
                                    //     labelWeight = "";
                                    // } else {
                                    //     labelWeight = parseFloat(labelWeight).toFixed(3);
                                    // }
                                    let tagCategory = " ";
                                    if (tagCategories) {
                                        // tagCategory = tagCategories[1];
                                        // if (tagCategories[1] === "机构") {
                                        //     tagCategory = tagCategories[2] || "";
                                        // }
                                        tagCategory = tagCategories.slice(1).toString();
                                    }
                                    return {
                                        index: i + 1,
                                        newsId,
                                        labelName,
                                        labelCode,
                                        labelCategory: tagCategory,
                                        labelAlias,
                                        labelWeight,
                                        synonyms,
                                    };
                                }
                            );
                        } else {
                            listDatas = [];
                        }
                        // this.initTableDatas = listDatas;
                        this.commonHandleTableDatas = listDatas;
                    }
                    this.clickGetNewsId();
                    this.clickGetNewsLink();
                    setTimeout(() => {
                        this.$refs["newsNotes"].focus();
                    }, 500);
                    // auto bind
                    // this.keyboardShortcutKeys();
                    // this.tableLoading = false;
                }).catch(err => console.error(`获取一般资讯: 处理详情  error`, err));
            },
            init() {
                // get flip page object
                let pageFlipObj = JSON.parse(window.sessionStorage.getItem("recheck_flipObj_audit"));
                // console.log(`common handle pageFlipObj init =`, JSON.stringify(pageFlipObj, null, 4));
                this.pageFlipObj = pageFlipObj || {};
                // init
                // this.getColumnCategoryByKeyWord(7, ``, `columnCategories`);
                this.getHandleInfos();
                // this.getLabelCategories(``, ``);
                // setTimeout(() => {
                //     this.$refs["newsNotes"].focus();
                // }, 500);
            },
            showRedColor() {
                let input = document.querySelector(`[placeholder="处理状态"]`);
                input.setAttribute("data-color", "red");
                // input.style.color = "#f0f";
                input.style.color = "#f5222d";
            },
        },
        mounted() {
            this.init();
            setTimeout(() => {
                let newsID = document.querySelector(`[data-uid="newsId"]`);
                if (newsID) {
                    let input = newsID.lastElementChild;
                    // input.style = `width: 100%; min-width: 217px; color: #000; cursor: pointer !important;`;
                }
                this.showRedColor();
                this.mouseSlipGetWords();
            }, 0);
        },
    }
</script>

<style lang="scss" scoped>
    /* scss variables */
    $default-color: #000;
    // mixin
    @mixin common-lable($color) {
        color: $color;
        display: inline-block;
        width: 55px;
        text-align: center;
    }
    .audit-common-lable{
        @include common-lable($default-color);
        &::after{
            display: inline-block;
            content: ":";
        }
    }
    .audit-common-lable-placeholder{
        @include common-lable($default-color);
    }
    .audit-common-padding{
        display: block;
        padding-bottom: 5px;
        border: 0;
    }
    .audit-common-content{
        margin-top: 10px;
    }
    .audit-common-link,
    .audit-common-link:hover{
        color: #298DFF !important;
        text-decoration: none;
        cursor: pointer;
    }
    /* new */
    .common-handle-padding{
        margin-bottom: 5px;
    }
    .common-handle-link,
    .common-handle-link:hover{
        color: #298DFF !important;
        text-decoration: none;
        cursor: pointer;
    }
    .common-handle-required{
        position: relative;
    }
    .common-handle-required::before {
        position: absolute;
        content: "*";
        display: inline-block;
        margin-right: 2px;
        line-height: 0;
        font-family: SimSun;
        font-size: 12px;
        color: #F5222D;
        top: 50%;
        left: -5px;
    }
    .vertical-center-modal{
        display: flex;
        align-items: center;
        /* height: 70%;
        width: 80%; */
        /* min-height: 500px;
        min-width: 600px; */
        /* margin: 10px auto;
        top: 50px; */
    }
    .audit-common-lable-super-long{
        display: inline-block;
        width: 78px;
        transform: translateX(-22px);
    }
</style>

<style lang="scss">
    /* global css & overwrite h_ui css */
    .common-handle-status > input.h-input-disabled{
        color: #f5222d;
        /* color: #f00 !important; */
    }
    .x-input{
        display: inline-block;
        width: 100%;
        height: 32px;
        padding: 4px 12px;
        font-size: 12px;
        border: 1px solid #D7DDE4;
        border-radius: 4px;
        color: #495060;
        overflow-y: auto;
        vertical-align: middle;
        padding-top: 6px;
    }
    .audit-common-handle-logs-row-color-odd{
        color: #999;
    }
    .audit-common-handle-logs-row-color-event{
        color: #505c6b;
    }
    #audit-common-handle-logs,
    #audit-common-handle-text,
    #audit-common-handle-modal-text {
        border: 1px solid #dfe4e9;
        background-color: #F7F7F7;
        opacity: 1;
        color: #333;
        font-size: 14px;
        overflow: auto !important;
        padding: 10px;
        border-radius: 4px;
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
    }
    #audit-common-handle-logs{
        min-height: 100px;
        max-height: 300px;
    }
    #audit-common-handle-text,
    #audit-common-handle-modal-text {
        min-height: 200px;
        max-height: 300px;
    }
    #audit-common-handle-modal-text {
        min-height: 300px;
        max-height: 500px;
    }
    .audit-label-highlight-color{
        background-color: #ff0;
        /* color: #f0f; */
        padding: 0 3px;
        font-weight: bold;
        font-size: 13px;
    }
    .bid-table-header{
        border: 1px solid #dfe4e9;
        background-color: #F7F7F7;
        opacity: 1;
        color: #999;
        overflow: auto !important;
        padding: 10px;
        /* border-radius: 4px; */
        text-align: center;
        margin-top: 10px;
        border-bottom: 0;
    }
    .bid-table-header > .audit-bid-lable:nth-of-type(1){
        border-right: 1px solid #dfe4e9;
        padding-right: 10px;
    }
    .bid-table-header > .audit-bid-lable:nth-of-type(2){
        border-right: 1px solid #dfe4e9;
    }
    .bid-table-content{
        /* border: 1px solid #dfe4e9; */
        /* background-color: #F7F7F7; */
        opacity: 1;
        color: #999;
        overflow: auto !important;
        padding: 0;
        /* border-radius: 4px; */
        margin-top: 0;
        border-bottom: 0;
        border-top: 1px solid #dfe4e9;
    }
    .bid-table-content > .bid-table-row {
        /* border: 1px solid #dfe4e9 !important; */
        /* margin: 0; */
        margin: 2px 0px;
        text-align: center;
        /* vertical-align: middle; */
        /* width: 120%; */
        height: 32px;
        text-align: center;
        vertical-align: middle;
        border-right: 1px solid #dfe4e9 !important;
    }
    .bid-table-content > div > div {
        border-bottom: 1px solid #dfe4e9 !important;
        border-right: 1px solid #dfe4e9 !important;
        border-left: 1px solid #dfe4e9 !important;
        /* border: 1px solid #dfe4e9 !important; */
        display: block;
        height: 100%;
        min-height: 50px;
        padding: 10px 0;
        margin: 0;
    }
    /* .shit-h_ui-table-cell > .h-table-cell {
        color: #f0f;
      overflow-y: auto !important;
    }
    .h-table-cell {
      overflow-y: auto !important;
    } */
    .audit-common-bid-lable {
        color: #000;
        display: inline-block;
        width: 100%;
        text-align: center;
    }
</style>


<style lang="scss" scoped>
    .common-handle-status > input.h-input-disabled,
    .common-handle-status > textarea.h-input-disabled {
        color: #f5222d;
    }
</style>

<style lang="scss" scoped>
    .hidden-menus{
        display: none;
        position: absolute;
        background: #fff;
        color: #fff;
        width: 102px;
        height: 44px;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 5px;
    }
    .hidden-menus-space{
        display: block;
        height: 2px;
        width: 100%;
    }
    .hidden-menus-btn {
        width: 100%;
        color: #fff;
        background-color: #298DFF;
        margin: 1px auto;
        border: 1px solid #298DFF;
        border-radius: 3px;
        cursor: pointer;
        user-select: none;
        /* padding: 6px 15px; */
        font-size: 12px;
        display: inline-block;
        margin-bottom: 0;
        font-weight: normal;
        text-align: center;
        vertical-align: middle;
    }
    .audit-common-row-padding{
        margin-bottom: 5px;
    }
</style>

<style lang="scss">
    .mini-cell-width > div.h-table-cell{
        padding-left: 5px !important;
        padding-right: 5px !important;
    }
    .news-highlight-title-wrapper {
        display: inline-block;
        width: 80%;
        position: relative;
        vertical-align: middle;
        height: 32px;
    }
    .news-highlight-title{
        display: inline-block;
        width: 100%;
        /* width: 80%; */
        /* width: calc(100% - 100px); */
        height: 32px;
        padding: 4px 12px;
        font-size: 12px;
        border: 1px solid #D7DDE4;
        border-radius: 4px;
        color: #495060;
        background-color: #fff;
        background-image: none;
        position: relative;
        cursor: text;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        -webkit-transition: border 0.2s ease-in-out, background 0.2s ease-in-out, -webkit-box-shadow 0.2s ease-in-out;
        transition: border 0.2s ease-in-out, background 0.2s ease-in-out, -webkit-box-shadow 0.2s ease-in-out;
        transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out, -webkit-box-shadow 0.2s ease-in-out;
    }
    .news-highlight-title-left {
        text-align: left;
    }
    .news-highlight-title-disabled{
        background-color: #F7F7F7;
        opacity: 1;
        cursor: not-allowed;
        color: #999;
    }
</style>
