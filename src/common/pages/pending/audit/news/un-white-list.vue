<template>
    <section>
        <div class="audit-common-header">
            <span class="audit-common-lable">发布日期</span>
            <h-date-picker
                type="datetimerange"
                aria-placeholder="发布日期"
                format="yyyy-MM-dd"
                :placeholder="placeholders.publishDateRange"
                style="width: 205px"
                :value="commonFilters.publishDateRange"
                @on-change="onChangeDateRangePicker">
            </h-date-picker>
            <span class="audit-common-lable">公开标志</span>
            <h-select
                aria-placeholder="公开标志"
                placeholder="请选择公开标志"
                style="width: 150px"
                v-model="commonFilters.newsOpenFlag"
                @on-change="onChangeSelect(`newsOpenFlag`)"
                filterable
                :clearable="true">
                <h-option
                    v-for="(item, i) in newsOpenFlags"
                    :value="item.value"
                    :key="i">
                    {{item.title}}
                </h-option>
            </h-select>
            <span class="audit-common-lable">处理状态</span>
            <h-select
                aria-placeholder="处理状态"
                placeholder="请选择处理状态"
                style="width: 150px"
                v-model="commonFilters.processingStatus"
                @on-change="onChangeSelect(`processingStatus`)"
                filterable
                clearable>
                <h-option
                    v-for="(item, i) in processingStates"
                    :value="item.value"
                    :key="i">
                    {{item.title}}
                </h-option>
            </h-select>
            <span class="audit-common-lable">优先级</span>
            <h-select
                aria-placeholder="优先级"
                placeholder="请选择优先级"
                style="width: 150px"
                v-model="commonFilters.priority"
                filterable
                clearable>
                <h-option
                    v-for="(item, i) in priorities"
                    :value="item.value"
                    :key="i">
                    {{item.title}}
                </h-option>
            </h-select>
            <span class="audit-common-lable">资讯 ID</span>
             <h-input
                type="text"
                aria-placeholder="资讯 ID"
                placeholder="请输入资讯 ID"
                style="width: 150px"
                v-model="commonFilters.newsId"
                @on-change="onChangeInput(`newsId`)"
                @on-enter="onChangeInputEnter(`newsId`)"
                icon="android-close"
                ref="newsId"
                @on-click="shitClearableClick(`newsId`)">
            </h-input>
            <hr class="audit-common-padding" />
            <span class="audit-common-lable">处理人员</span>
            <h-select
                aria-placeholder="处理人员"
                placeholder="请选择处理人员"
                style="width: 150px"
                v-model="commonFilters.processingPersonnel"
                filterable
                clearable>
                <h-option
                    v-for="(item, i) in processingPersonnels"
                    :value="item.value"
                    :key="i">
                    {{item.title}}
                </h-option>
            </h-select>
            <span class="audit-common-lable">资讯标题</span>
            <h-input
                aria-placeholder="资讯标题"
                placeholder="请输入资讯标题"
                style="width: 150px"
                v-model="commonFilters.newsTitle"
                @on-change="onChangeInput(`newsTitle`)"
                @on-enter="onChangeInputEnter(`newsTitle`)"
                :clearable="true"
                icon="android-close"
                ref="newsTitle"
                @on-click="shitClearableClick(`newsTitle`)">
            </h-input>
            <span class="audit-common-lable">媒体出处</span>
            <h-input
                aria-placeholder="媒体出处"
                placeholder="请输入媒体出处"
                style="width: 150px"
                v-model="commonFilters.mediaSource"
                @on-change="onChangeInput(`mediaSource`)"
                @on-enter="onChangeInputEnter(`mediaSource`)"
                icon="android-close"
                ref="mediaSource"
                @on-click="shitClearableClick(`mediaSource`)">
            </h-input>
            <!-- newsKeyword / newsTagName 关键字/标签名 -->
            <!-- <span class="audit-common-lable">关键字</span>
            <h-input
                type="text"
                aria-placeholder="关键字"
                placeholder="请输入关键字"
                style="width: 150px"
                v-model="commonFilters.newsKeyword"
                @on-change="onChangeInput(`newsKeyword`)"
                @on-enter="onChangeInputEnter(`newsKeyword`)"
                icon="android-close"
                ref="newsKeyword"
                @on-click="shitClearableClick(`newsKeyword`)">
            </h-input> -->
            <span class="audit-common-lable">标签名</span>
            <h-input
                type="text"
                aria-placeholder="标签名"
                placeholder="请输入标签名"
                style="width: 150px"
                v-model="commonFilters.newsTagName"
                @on-change="onChangeInput(`newsTagName`)"
                @on-enter="onChangeInputEnter(`newsTagName`)"
                icon="android-close"
                ref="newsTagName"
                @on-click="shitClearableClick(`newsTagName`)">
            </h-input>
            <!-- <hr class="audit-common-padding" /> -->
            <h-button
                type="primary"
                icon="search"
                data-ref="init-btn"
                @click="onClickButton(`search`)">
                查询
            </h-button>
        </div>
        <div class="audit-common-content">
            <h-row class-name="audit-common-row-padding" v-if="isDeletePermission">
                <h-col span="8">
                    <h-tooltip
                        placement="right"
                        :disabled="!isIndexesEmpty"
                        content="请先选择要批量删除的行">
                        <h-button
                            type="error"
                            icon="delete"
                            data-ref="init-btn"
                            @click="onClickBatchDelete(`delete`)"
                            :disabled="isIndexesEmpty">
                            批量删除
                        </h-button>
                    </h-tooltip>
                </h-col>
            </h-row>
            <h-row class-name="audit-common-row-padding">
                <!-- row-class-name="row-disabled-user-selection" -->
                <h-col span="24">
                    <h-table
                        :columns="commonTableCols"
                        :data="commonTableDatas"
                        :loading="tableLoading"
                        @on-selection-change="selectChange"
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
                            <!-- show-sizer -->
                        </h-page>
                    </div>
                </h-col>
            </h-row>
        </div>
        <!-- modal -->
        <h-msgBox
            v-if="!isBatchDelete"
            title="删除操作"
            @on-ok="reSureDelete"
            v-model="modalDelete.showModal"
            :loading="modalDelete.modalLoading">
            二次确认: 删除
        </h-msgBox>
        <h-msgBox
            v-else
            title="批量删除操作"
            @on-ok="reSureDelete"
            v-model="modalDelete.showModal"
            :loading="modalDelete.modalLoading">
            二次确认: 批量删除
        </h-msgBox>
    </section>
</template>

<script>
    /**
     *
     * @author xiagq
     * @copyright gildata
     *
     * @created 2019.01.28
     * @modified 2019.01.28
     *
     * @description 非白名单资讯列表 UnWhiteListNews
     * @augments
     * @example
     *
     */
    import { TODAY } from "./utils";
    export default {
        name: "AuditNewsUn-white-list",
        data () {
            return {
                isBatchDelete: false,
                batchDeleteUids: [],
                modalDelete: {
                    modalLoading: true,
                    showModal: false,
                    maximize: true,
                    scrollable: true,
                    transfer: false,
                    title: "",
                },
                // activeRoutersButton: this.$store.state.activeRoutersButton,
                mediaSources: [],
                columnCategories: [],
                priorities: [],
                processingStates: [],
                processingPersonnels: [],
                newsIds: [],
                newsOpenFlags: [
                    {
                        title: "屏蔽",
                        value: "0",
                    },
                    {
                        title: "公开",
                        value: "1",
                    },
                    // {
                    //     title: "全部",
                    //     value: 2,
                    //     // value: null,
                    //     // value: " ",
                    // },
                ],
                commonFilters: {
                    // publishDateRange: TODAY,
                    publishDate: TODAY,
                    publishDateEnd: TODAY,
                    publishDateRange: [TODAY, TODAY],
                    newsTitle: "",
                    mediaSource: "",
                    columnCategory: "",
                    priority: "",
                    processingStatus: "0",
                    processingPersonnel: "",
                    newsId: "",
                    newsOpenFlag: "",
                    newsKeyword: "",
                    newsTagName: "",
                },
                commonFiltersPagination: {
                    publishDate: TODAY,
                    publishDateEnd: TODAY,
                    publishDateRange: [TODAY, TODAY],
                    newsTitle: "",
                    mediaSource: "",
                    columnCategory: "",
                    priority: "",
                    processingStatus: "0",
                    processingPersonnel: "",
                    newsId: "",
                    newsOpenFlag: "",
                    newsKeyword: "",
                    newsTagName: "",
                },
                placeholders: {
                    publishDateRange: "开始日期    ~    结束日期",
                    publishDate: "请输入查询日期",
                },
                commonTableCols: [
                    {
                        type: "selection",
                        width: 60,
                        align: "center",
                        fixed: "left",
                    },
                    // {
                    //     key: "index",
                    //     title: "序号",
                    //     width: 60,
                    //     align: "center",
                    // },
                    {
                        key: "processingStatus",
                        title: "处理状态",
                        width: 100,
                        align: "center",
                        className: "disabled-user-selection",
                        render: (h, params) => {
                            let key = params.row.processingStatus;
                            let title = params.row.processingStatusDesc;
                            let icon = "";
                            switch (key) {
                                // UI ???
                                case 0:
                                    icon = "unlock";
                                    break;
                                case 1:
                                    icon = "lock";
                                    break;
                                case 2:
                                    icon = "unlock";
                                    break;
                                case 3:
                                    icon = "lock";
                                    break;
                                case 4:
                                    icon = "unlock";
                                    break;
                                case 5:
                                    icon = "lock";
                                    break;
                                case 6:
                                    icon = "unlock";
                                    break;
                                case 7:
                                    icon = "lock";
                                    break;
                                case 8:
                                    icon = "unlock";
                                    break;
                                default:
                                    break;
                            }
                            return h("div", {
                                    // all properties === attributes
                                    attrs: {
                                        "title": `${title}`,
                                        "data-title": `${title}`,
                                    },
                                },
                                [
                                    h("Icon", {
                                        props: {
                                            name: icon,
                                            // name: "lock",// .icon-lock
                                        }
                                    }),
                                    h("span", title),
                                ]
                            );
                        },
                    },
                    {
                        key: "priority",
                        // key: "priorityDesc",
                        title: "优先级",
                        // sortable: true,
                        width: 100,
                        align: "center",
                        // className: "disabled-user-selection",
                    },
                    {
                        key: "newsTitle",
                        title: "资讯标题",
                        // width: 300,
                        width: 410,
                        align: "left",
                        className: "audit-row-min-width-350",
                        // className: "disabled-user-selection audit-row-min-width-350",
                    },
                    {
                        key: "newsId",
                        title: "资讯 ID",
                        // sortable: true,
                        width: 200,
                        align: "left",
                        // className: "disabled-user-selection",
                    },
                    {
                        key: "publishTime",
                        title: "发布日期",
                        width: 150,
                        align: "center",
                        className: "disabled-user-selection",
                    },
                    {
                        key: "mediaSource",
                        title: "媒体出处",
                        width: 150,
                        align: "center",
                        className: "audit-row-min-width-150",
                        // className: "disabled-user-selection audit-row-min-width-150",
                    },
                    // {
                    //     key: "priority",
                    //     title: "优先级",
                    // },
                    // {
                    //     key: "columnCategory",
                    //     title: "栏目分类",
                    //     width: 100,
                    //     align: "center",
                    // },
                    {
                        key: "flag",
                        title: "公开标志",
                        width: 100,
                        align: "center",
                        className: "disabled-user-selection",
                    },
                    {
                        key: "keyword",
                        title: "关键字",
                        width: 100,
                        align: "center",
                        // className: "disabled-user-selection",
                    },
                    {
                        key: "auditPersonnel",
                        title: "复核人员",
                        width: 100,
                        align: "center",
                        className: "disabled-user-selection",
                    },
                    {
                        key: "auditTime",
                        title: "复核时间",
                        width: 150,
                        align: "center",
                        className: "disabled-user-selection",
                    },
                    {
                        key: "processingPersonnel",
                        title: "处理人员",
                        width: 120,
                        align: "center",
                        className: "disabled-user-selection",
                        render: (h, params) => {
                            return h("div", [
                                h("Icon", {
                                    props: {
                                        name: "person"
                                    }
                                }),
                                h("strong", params.row.processingPersonnel),
                            ]);
                        },
                    },
                    {
                        key: "operation",
                        title: "操作",
                        width: 150,
                        align: "center",
                        fixed: "right",
                        className: "disabled-user-selection",
                        render: (h, params) => {
                            let newsOperateVoList = params.row.newsOperateVoList;
                            let uid = params.row.newsId;
                            // 上一页； 1 下一页
                            let fbsj = params.row.publishTime;
                            // let publishTime = params.row.publishTime;
                            // let flipObj = {
                            //     "operType": "1",// 0 上一页； 1 下一页
                            //     "dataType": "1",// 0 一般资讯； 见 rap
                            //     "publishTime": "2019-01-22 14:19:43",// 时间：精确到时分秒
                            //     "newsId": "06201901220103421659891",
                            //     "handleUser": "",// 处理人
                            //     "dataStatus": "",// 处理状态
                            //     "mtcc": "",// 媒体出处
                            //     "xwbt": "",// 资讯标题
                            //     "gkbz": "",// 公开标志
                            // };
                            let {
                                processingStatus: dataStatus,
                                processingPersonnel: handleUser,
                                newsTitle: xwbt,
                                mediaSource: mtcc,
                                newsOpenFlag: gkbz,
                                publishDate: publishTime,
                                publishDateEnd: publishTimeEnd,
                            } = this.commonFilters;
                            let flipObj = {
                                // operType: "1",// 0 上一页； 1 下一页
                                // dataType: "0",//  一般资讯
                                newsListType: "6",
                                newsId: uid,
                                dataStatus,
                                handleUser,
                                xwbt,
                                mtcc,
                                gkbz,
                                fbsj,
                                publishTime,
                                publishTimeEnd,
                            };
                            // console.log(`passed flipObj =`, JSON.stringify(flipObj, null, 4));
                            let links = [];
                            links = newsOperateVoList.map(
                                (obj, i) => {
                                    let {
                                        operateDesc: desc,
                                        operateType: type,
                                        // operateUrl,// 前端路由定义
                                    } = obj;
                                    let operateUrl = ``;
                                    let routerPath = ``;
                                    switch (type) {
                                        case 1:
                                            operateUrl = `/tm/getNewsInfoById`;
                                            routerPath = `/audit/news/un-white-list/operate-handle`;
                                            break;
                                        case 2:
                                            operateUrl = `/tm/getNewsInfoById`;
                                            routerPath = `/audit/news/un-white-list/operate-audit`;
                                            break;
                                        case 3:
                                            operateUrl = `/tm/getNewsInfoById`;
                                            routerPath = `/audit/news/un-white-list/operate-verify`;
                                            break;
                                        case 5:
                                            operateUrl = `/tm/getNewsInfoById`;
                                            routerPath = `/audit/news/un-white-list/operate-view`;
                                            break;
                                        default:
                                            operateUrl = `#type=删除`;
                                            // case: 4
                                            // routerPath = `/audit/news/operate-delete`;
                                            break;
                                    }
                                    return h("a", {
                                        attrs: {
                                            "data-url": operateUrl,
                                            "data-type": type,
                                        },
                                        class: [
                                            "audit-common-link",
                                        ],
                                        style: {
                                            color: "#298DFF !important",
                                            textDecoration: "none",
                                            cursor: "pointer",
                                            marginRight: "5px",
                                        },
                                        on: {
                                            click: (e) => {
                                                let alink = e.target;
                                                alink.style.color = "red";
                                                // 删除, 复核, 审核, 处理
                                                let options = {
                                                    path: routerPath,
                                                    // query: {
                                                    //     type,
                                                    //     desc,
                                                    //     uid,
                                                    //     url: operateUrl,
                                                    // },
                                                };
                                                if (type === 4) {
                                                    let uids = [uid];
                                                    this.batchDeleteUids = uids;
                                                    this.clickShowResureDeleteModal();
                                                } else {
                                                    // 1：处理； 2：稽核； 3：审核； 4：删除； 5：查看；
                                                    let new_type = "";
                                                    switch (type) {
                                                        case 1:
                                                            new_type = "handle";
                                                            break;
                                                        case 2:
                                                            new_type = "audit";
                                                            break;
                                                        // case 3:
                                                        //     new_type = "review";
                                                        //     break;
                                                        case 5:
                                                            new_type = "view";
                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                    // set flip page object
                                                    window.sessionStorage.setItem(`un-white-list_flipObj_${new_type}`, JSON.stringify(flipObj));
                                                    let router_query = {
                                                        type,
                                                        desc,
                                                        uid,
                                                        url: operateUrl,
                                                    };
                                                    window.sessionStorage.setItem(`un-white-list_route_query_${new_type}`, JSON.stringify(router_query));
                                                    if (type === 5) {
                                                         // 查看
                                                         this.$router.push(options);
                                                    } else {
                                                        // tryLock & POST
                                                        this.checkLockState(uid, options);
                                                    }
                                                }
                                            },
                                        }
                                    }, desc);
                                }
                            );
                            return h("div", links);
                        },
                    },
                ],
                commonTableColsUnselection: [
                    // {
                    //     type: "selection",
                    //     width: 60,
                    //     align: "center",
                    //     fixed: "left",
                    // },
                    // {
                    //     key: "index",
                    //     title: "序号",
                    //     width: 60,
                    //     align: "center",
                    // },
                    {
                        key: "processingStatus",
                        title: "处理状态",
                        width: 100,
                        align: "center",
                        fixed: "left",
                        className: "disabled-user-selection",
                        render: (h, params) => {
                            let key = params.row.processingStatus;
                            let title = params.row.processingStatusDesc;
                            let icon = "";
                            switch (key) {
                                // UI ???
                                case 0:
                                    icon = "unlock";
                                    break;
                                case 1:
                                    icon = "lock";
                                    break;
                                case 2:
                                    icon = "unlock";
                                    break;
                                case 3:
                                    icon = "lock";
                                    break;
                                case 4:
                                    icon = "unlock";
                                    break;
                                case 5:
                                    icon = "lock";
                                    break;
                                case 6:
                                    icon = "unlock";
                                    break;
                                case 7:
                                    icon = "lock";
                                    break;
                                case 8:
                                    icon = "unlock";
                                    break;
                                default:
                                    break;
                            }
                            return h("div", {
                                    // all properties === attributes
                                    attrs: {
                                        "title": `${title}`,
                                        "data-title": `${title}`,
                                    },
                                },
                                [
                                    h("Icon", {
                                        props: {
                                            name: icon,
                                            // name: "lock",// .icon-lock
                                        }
                                    }),
                                    h("span", title),
                                ]
                            );
                        },
                    },
                    {
                        key: "priority",
                        // key: "priorityDesc",
                        title: "优先级",
                        // sortable: true,
                        width: 100,
                        align: "center",
                        // className: "disabled-user-selection",
                    },
                    {
                        key: "newsTitle",
                        title: "资讯标题",
                        // width: 300,
                        width: 470,
                        align: "left",
                        className: "audit-row-min-width-350",
                        // className: "disabled-user-selection audit-row-min-width-350",
                    },
                    {
                        key: "newsId",
                        title: "资讯 ID",
                        // sortable: true,
                        width: 200,
                        align: "left",
                        // className: "disabled-user-selection",
                    },
                    {
                        key: "publishTime",
                        title: "发布日期",
                        width: 150,
                        align: "center",
                        className: "disabled-user-selection",
                    },
                    {
                        key: "mediaSource",
                        title: "媒体出处",
                        width: 150,
                        align: "center",
                        className: "audit-row-min-width-150",
                        // className: "disabled-user-selection audit-row-min-width-150",
                    },
                    // {
                    //     key: "priority",
                    //     title: "优先级",
                    // },
                    // {
                    //     key: "columnCategory",
                    //     title: "栏目分类",
                    //     width: 100,
                    //     align: "center",
                    // },
                    {
                        key: "flag",
                        title: "公开标志",
                        width: 100,
                        align: "center",
                        className: "disabled-user-selection",
                    },
                    {
                        key: "keyword",
                        title: "关键字",
                        width: 100,
                        align: "center",
                        // className: "disabled-user-selection",
                    },
                    {
                        key: "auditPersonnel",
                        title: "复核人员",
                        width: 100,
                        align: "center",
                        className: "disabled-user-selection",
                    },
                    {
                        key: "auditTime",
                        title: "复核时间",
                        width: 150,
                        align: "center",
                        className: "disabled-user-selection",
                    },
                    {
                        key: "processingPersonnel",
                        title: "处理人员",
                        width: 120,
                        align: "center",
                        className: "disabled-user-selection",
                        render: (h, params) => {
                            return h("div", [
                                h("Icon", {
                                    props: {
                                        name: "person"
                                    }
                                }),
                                h("strong", params.row.processingPersonnel),
                            ]);
                        },
                    },
                    {
                        key: "operation",
                        title: "操作",
                        width: 150,
                        align: "center",
                        fixed: "right",
                        className: "disabled-user-selection",
                        render: (h, params) => {
                            let newsOperateVoList = params.row.newsOperateVoList;
                            let uid = params.row.newsId;
                            let fbsj = params.row.publishTime;
                            // let publishTime = params.row.publishTime;
                            let {
                                processingStatus: dataStatus,
                                processingPersonnel: handleUser,
                                newsTitle: xwbt,
                                mediaSource: mtcc,
                                newsOpenFlag: gkbz,
                                publishDate: publishTime,
                                publishDateEnd: publishTimeEnd,
                            } = this.commonFilters;
                            let flipObj = {
                                // operType: "1",// 0 上一页； 1 下一页
                                // dataType: "0",//  一般资讯
                                newsListType: "6",
                                newsId: uid,
                                dataStatus,
                                handleUser,
                                xwbt,
                                mtcc,
                                gkbz,
                                fbsj,
                                publishTime,
                                publishTimeEnd,
                            };
                            let links = [];
                            links = newsOperateVoList.map(
                                (obj, i) => {
                                    let {
                                        operateDesc: desc,
                                        operateType: type,
                                        // operateUrl,// 前端路由定义
                                    } = obj;
                                    let operateUrl = ``;
                                    let routerPath = ``;
                                    switch (type) {
                                        case 1:
                                            operateUrl = `/tm/getNewsInfoById`;
                                            routerPath = `/audit/news/un-white-list/operate-handle`;
                                            break;
                                        case 2:
                                            operateUrl = `/tm/getNewsInfoById`;
                                            routerPath = `/audit/news/un-white-list/operate-audit`;
                                            break;
                                        case 3:
                                            operateUrl = `/tm/getNewsInfoById`;
                                            routerPath = `/audit/news/un-white-list/operate-verify`;
                                            break;
                                        case 5:
                                            operateUrl = `/tm/getNewsInfoById`;
                                            routerPath = `/audit/news/un-white-list/operate-view`;
                                            break;
                                        default:
                                            operateUrl = `#type=删除`;
                                            // case: 4
                                            // routerPath = `/audit/news/operate-delete`;
                                            break;
                                    }
                                    return h("a", {
                                        attrs: {
                                            "data-url": operateUrl,
                                            "data-type": type,
                                        },
                                        class: [
                                            "audit-common-link",
                                        ],
                                        style: {
                                            color: "#298DFF !important",
                                            textDecoration: "none",
                                            cursor: "pointer",
                                            marginRight: "5px",
                                        },
                                        on: {
                                            click: (e) => {
                                                let alink = e.target;
                                                alink.style.color = "red";
                                                // 删除, 复核, 审核, 处理
                                                let options = {
                                                    path: routerPath,
                                                    // query: {
                                                    //     type,
                                                    //     desc,
                                                    //     uid,
                                                    //     url: operateUrl,
                                                    // },
                                                };
                                                if (type === 4) {
                                                    let uids = [uid];
                                                    this.batchDeleteUids = uids;
                                                    this.clickShowResureDeleteModal();
                                                } else {
                                                    // 1：处理； 2：稽核； 3：审核； 4：删除； 5：查看；
                                                    let new_type = "";
                                                    switch (type) {
                                                        case 1:
                                                            new_type = "handle";
                                                            break;
                                                        case 2:
                                                            new_type = "audit";
                                                            break;
                                                        // case 3:
                                                        //     new_type = "review";
                                                        //     break;
                                                        case 5:
                                                            new_type = "view";
                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                    // set flip page object
                                                    window.sessionStorage.setItem(`un-white-list_flipObj_${new_type}`, JSON.stringify(flipObj));
                                                    let router_query = {
                                                        type,
                                                        desc,
                                                        uid,
                                                        url: operateUrl,
                                                    };
                                                    window.sessionStorage.setItem(`un-white-list_route_query_${new_type}`, JSON.stringify(router_query));
                                                    if (type === 5) {
                                                        this.$router.push(options);
                                                    } else {
                                                        // tryLock & POST
                                                        this.checkLockState(uid, options);
                                                    }
                                                }
                                            },
                                        }
                                    }, desc);
                                }
                            );
                            return h("div", links);
                        },
                    },
                ],
                commonTableDatas: [],
                initTableDatas: [],
                pagination: {
                    current: 1,
                    size: 12,
                    total: 0,
                    // total: 100,
                },
                tableLoading: false,
                isIndexesEmpty: true,
                isDeletePermission: false,
            }
        },
        methods: {
            reSureDelete () {
                let uids = this.batchDeleteUids || [];
                this.batchDeleteNewsIds(uids);
            },
            clickShowResureDeleteModal(isBatch = false) {
                this.modalDelete.showModal = true;
                if (isBatch) {
                    this.isBatchDelete = true;
                } else {
                    this.isBatchDelete = false;
                }
            },
            checkLockState (uid = ``, options = {}) {
                // POST
                let url = `/tm/tryLock?newsId=${uid}`;
                this.$http
                .post(url)
                .then(res => res.data)
                .then((json)=>{
                    let {
                        status,
                        msg,
                        // body,
                    } = json;
                    if(status != this.$api.SUCCESS){
                        console.log(`lock 状态 json =`, JSON.stringify(json, null, 4));
                        this.$hMessage.error(msg);
                        return;
                    } else {
                        if (status === 1) {
                            // re-direct
                            this.$router.push(options);
                        }
                    }
                }).catch(err => console.error(`lock 状态  error`, err));
            },
            // filter methods
            onChangeDateRangePicker (values) {
                // console.log(`range values`, values);
                this.commonFilters.publishDateRange = values;
                this.commonFilters.publishDate = values[0];
                this.commonFilters.publishDateEnd = values[1];
            },
            onChangeDatePicker (value) {
                this.commonFilters.publishDate = value;
            },
            onChangeInput (type = ``) {
                let value = this.commonFilters[type];
                // console.log(`input value =`, value);
                // console.log(`this.commonFilters[type] =`, this.commonFilters[type]);
                this.commonFilters[type] = value.trim();
                // this.commonFilters[type] = encodeURIComponent(value.trim());
                // console.log(`trim value =`, value.trim());console.log(`this.commonFilters[type] =`, this.commonFilters[type]);
                // this.$hMessage.info(`${type} = ${value}`);
                // console.log(`input this.commonFiltersPagination bug =`, JSON.stringify(this.commonFiltersPagination, null, 4));
            },
            onChangeInputEnter (type = ``) {
                let value = this.commonFilters[type];
                this.commonFilters[type] = value.trim();
                // this.$hMessage.info(`${type} = ${value}`);
                this.onClickButton();
            },
            shitClearableClick(type = ``) {
                // http://192.168.58.189:8080/hui/#/components/input
                // shiy api
                // this.$hMessage.info("icon点击事件");
                this.commonFilters[type] = ``;
                this.$refs[type].focus();
            },
            onChangeSelect (type = ``) {
                let value = this.commonFilters[type];
                // this.$hMessage.info(value);
            },
            onClickButton (type = ``) {
                let {
                    publishDate: publishTime,
                    publishDateEnd: publishTimeEnd,
                    newsTitle: xwbt,
                    mediaSource: mtcc,
                    columnCategory: lmfl,
                    // priority: yxj,
                    processingStatus: dataStatus,
                    processingPersonnel: handleUser,
                    newsId,
                    newsOpenFlag: gkbz,
                    newsKeyword: keyword,
                    newsTagName: tag,
                    priority,
                }= this.commonFilters;
                this.commonFiltersPagination = {...this.commonFilters};
                let {
                    // current,
                    size,
                } = this.pagination;
                // init
                this.pagination.current = 1;
                let options = {
                    publishTime,
                    publishTimeEnd,
                    xwbt,
                    mtcc,
                    // lmfl,
                    // yxj,
                    dataStatus,
                    handleUser,
                    newsId,
                    current: 1,
                    size,
                    gkbz,
                    keyword,
                    tag,
                    priority,
                };
                this.getCommonTableDatas(options);
            },
            getNewTableDatas (pagination = {}) {
                let {
                    publishDate: publishTime,
                    publishDateEnd: publishTimeEnd,
                    newsTitle: xwbt,
                    mediaSource: mtcc,
                    columnCategory: lmfl,
                    // priority: yxj,
                    processingStatus: dataStatus,
                    processingPersonnel: handleUser,
                    newsId,
                    newsOpenFlag: gkbz,
                    newsKeyword: keyword,
                    newsTagName: tag,
                    priority,
                }= this.commonFiltersPagination;
                let {
                    current,
                    size,
                } = pagination;
                let options = {
                    publishTime,
                    publishTimeEnd,
                    xwbt,
                    mtcc,
                    // lmfl,
                    // yxj,
                    dataStatus,
                    handleUser,
                    newsId,
                    current,
                    size,
                    gkbz,
                    keyword,
                    tag,
                    priority,
                };
                this.getCommonTableDatas(options);
            },
            onPageChange (current = 1) {
                this.pagination.current = current;
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
            // table methods
            show (index) {
                this.$hMsgBox.info({
                    title: "资讯信息",
                    content: `
                        资讯 ID: ${this.commonTableDatas[index].newsId}<br/>
                        资讯标题: ${this.commonTableDatas[index].newsTitle}<br/>
                        媒体来源: ${this.commonTableDatas[index].mediaSource}<br/>
                    `,
                })
            },
            remove (index) {
                this.commonTableDatas.splice(index, 1);
            },
            tableSelectionChange(selection) {
                let indexes = [];
                let ids = [];
                if (selection.length) {
                    ids = selection.map(
                        (obj, i) => {
                            if (obj) {
                                let {
                                    newsId,
                                } = obj;
                                return newsId;
                            }
                        }
                    );
                    indexes = selection.map(
                        (obj, i) => {
                            if (obj) {
                                let {
                                    index,
                                } = obj;
                                return index;
                            }
                        }
                    );
                    this.isIndexesEmpty = false;
                } else {
                    this.isIndexesEmpty = true;
                }
                this.batchDeleteUids = ids;
            },
            selectChange(selection) {
                this.tableSelectionChange(selection);
            },
            getTrueTableIndex(datas = [], key = ``) {
                let trueTableIndex = ``;
                datas.forEach(
                    (obj, i) => {
                        let {
                            index,
                        } = obj;
                        if (key === index) {
                            trueTableIndex = i;
                        }
                    }
                );
                return trueTableIndex;
            },
            onClickBatchDelete(type = `delete`) {
                this.clickShowResureDeleteModal(true);
            },
            // 批量删除 / 删除
            batchDeleteNewsIds(ids = []) {
                let idsString = JSON.stringify(ids);
                let options = {
                    idList: ids,
                };
                let url = `/tm/removeBatchByIdList`;
                this.tableLoading = true;
                this.$http
                .delete(url, {
                    data: options,
                })
                .then(res => res.data)
                .then((json)=>{
                    let {
                        status,
                        msg,
                        body,
                    } = json;
                    if(status != this.$api.SUCCESS){
                        // console.log(`资讯列表删除 json =`, JSON.stringify(json, null, 4));
                        this.$hMessage.error(msg);
                        this.modalDelete.showModal = false;
                        this.tableLoading = false;
                        return;
                    } else {
                        // this.$hMessage.success(msg);
                        this.$hMessage.success(this.isBatchDelete ? "批量删除成功" : "删除成功");
                        this.modalDelete.showModal = false;
                        this.tableLoading = false;
                        this.pagination.current = 1;
                        this.onClickButton();
                    }
                }).catch(err => console.error(`删除 error`, err));
            },
            categoriesFilter (key = 1) {
                let result = ``;
                let categories = this.columnCategories;
                try {
                    if (categories) {
                        categories.forEach(
                            (obj, i) => {
                                let {
                                    title,
                                    value,
                                } = obj;
                                if (value === key) {
                                    result = title;
                                }
                            }
                        );
                    }
                } catch (err) {
                    console.error(`no categories error`, err);
                }
                return result;
            },
            // 优先级
            getPriorityByDictCode(dictCode = `1006`, debug = false){
                // let url = `/tm/tbmDictList?dictCode=1006`;
                let url = `/tm/tbmDictList?dictCode=${dictCode}`;
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
                        console.log(`优先级 json =`, JSON.stringify(json, null, 4));
                        this.$hMessage.error(msg);
                        return;
                    } else {
                        let {
                            tbmDictList: listDatas,
                        } = body;
                        listDatas = listDatas.map(
                            (obj, i) => {
                                let {
                                    entryName: title,
                                    dictEntry: value,
                                } = obj;
                                return {
                                    title,
                                    value,
                                };
                            }
                        );
                        this.priorities = listDatas;
                    }
                }).catch(err => console.error(`优先级 error`, err));
            },
            // 处理状态
            getDictByDictCode(dictCode = ``, listType = ``, debug = false){
                if (debug) {
                    console.log(`listType =`, listType);
                }
                let url = `/tm/tbmDictList?dictCode=${dictCode}`;
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
                        console.log(`处理状态 json =`, JSON.stringify(json, null, 4));
                        this.$hMessage.error(msg);
                        return;
                    } else {
                        let {
                            tbmDictList: listDatas,
                        } = body;
                        listDatas = listDatas.map(
                            (obj, i) => {
                                let {
                                    entryName: title,
                                    dictEntry: value,
                                } = obj;
                                return {
                                    title,
                                    value,
                                };
                            }
                        );
                        this[listType] = listDatas;
                    }
                }).catch(err => console.error(`处理状态  error`, err));
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
            // 处理人
            getProcessingPersonnelsByKeyWord(keyWord = ``, listType =``, debug = false){
                if (debug) {
                    console.log(`listType =`, listType);
                }
                let url = "/tm/handlerList";
                if (keyWord) {
                    url = `/tm/handlerList?keyword=${keyWord}`;
                }
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
                        console.log(`处理人 json =`, JSON.stringify(json, null, 4));
                        this.$hMessage.error(msg);
                        return;
                    } else {
                        let {
                            handlerList: listDatas,
                        } = body;
                        listDatas = listDatas.map(
                            (obj, i) => {
                                let {
                                    realName: title,
                                    id: value,
                                } = obj;
                                return {
                                    title,
                                    value,
                                };
                            }
                        );
                        this[listType] = listDatas;
                    }
                }).catch(err => console.error(`处理人  error`, err));
            },
            // 一般资讯列表
            getCommonTableDatas (options = {}, debug = false) {
                // let {
                //     publishTime,
                //     publishTimeEnd,
                //     xwbt,
                //     mtcc,
                //     // lmfl,
                //     // yxj,
                //     dataStatus,
                //     handleUser,
                //     newsId,
                //     current,
                //     size,
                //     // newsOpenFlag: gkbz,
                //     gkbz,
                //     keyword,
                //     tag,
                // } = options;
                // 非白名单资讯列表
                options.newsListType = "6";
                this.tableLoading = true;
                let url = `/tm/getNonWhiteNewsLogVoList`;
                this.$http
                .post(url, options)
                .then(res => res.data)
                .then((json)=>{
                    let {
                        status,
                        msg,
                        body,
                    } = json;
                    if(status != this.$api.SUCCESS){
                        console.log(`一般资讯列表 json =`, JSON.stringify(json, null, 4));
                        // this.$hMessage.error(msg);
                        this.initTableDatas = [];
                        this.commonTableDatas = [];
                        this.tableLoading = false;
                        return;
                    } else {
                        let {
                            current,
                            total,
                            pages,
                            size,
                            records: listDatas,
                            permitDelete: isDeletePermission,
                        } = body;
                        if (isDeletePermission === undefined) {
                            isDeletePermission = false;
                        } else {
                            if (!isDeletePermission) {
                                console.log(`new cols`, isDeletePermission);
                                this.commonTableCols = this.commonTableColsUnselection;
                            }
                            this.isDeletePermission = isDeletePermission;
                        }
                        if (total) {
                            this.pagination.total = total;
                        } else {
                            this.pagination.total = 0;
                        }
                        if (Array.isArray(listDatas) && listDatas.length) {
                            listDatas = listDatas.map(
                                (obj, i) => {
                                    let {
                                        newsId,
                                        // gkbz: flag,
                                        gkbzDesc: flag,
                                        fbsj: publishTime,
                                        mtcc: mediaSource,
                                        xwbt: newsTitle,
                                        // yxj: priority,
                                        // priorityDesc,
                                        priorityDesc: priority,
                                        keyword,
                                        lmfl: columnCategory,
                                        handleTime,
                                        handleUserName: processingPersonnel,
                                        dataStatus: processingStatus,
                                        dataStatusDesc: processingStatusDesc,
                                        auditTime,
                                        auditUserName: auditPersonnel,
                                        sensitives,
                                        newsOperateVoList,
                                    } = obj;
                                    if (columnCategory) {
                                        columnCategory = this.categoriesFilter(columnCategory);
                                    }
                                    return {
                                        index: i,
                                        // index: i + 1,
                                        flag,
                                        newsId,
                                        publishTime,
                                        mediaSource,
                                        newsTitle,
                                        columnCategory,
                                        processingStatus,
                                        processingStatusDesc,
                                        processingPersonnel,
                                        auditTime,
                                        auditPersonnel,
                                        newsOperateVoList,
                                        priority,
                                        keyword,
                                    };
                                }
                            );
                        } else {
                            listDatas = [];
                        }
                        this.initTableDatas = listDatas;
                        this.commonTableDatas = listDatas;
                        this.tableLoading = false;
                    }
                }).catch(err => console.error(`处理状态  error`, err));
            },
            getWindowMaxWidth() {
                let maxWidth = window.screen.width || 1366;
                if (maxWidth < 1920) {
                    this.pagination.size = 12;
                } else {
                    this.pagination.size = 21;
                }
            },
            // init
            init () {
                this.getWindowMaxWidth();
                this.getDictByDictCode(1005, "processingStates");
                this.getColumnCategoryByKeyWord(7, ``, `columnCategories`);
                this.getProcessingPersonnelsByKeyWord(``, `processingPersonnels`);
                this.getPriorityByDictCode();
                let {
                    current,
                    size,
                } = this.pagination;
                this.getCommonTableDatas({
                    publishTime: TODAY,
                    publishTimeEnd: TODAY,
                    current,
                    size,
                    dataStatus: "0",
                });
            },
            globalBindKeyboardShortcuts() {
                let body = document.querySelector(`body`);
                let bindFlag = body.dataset.bindFlag;
                let isCtrlPressed = false;
                let isAltPressed = false;
                if (bindFlag === "true") {
                    console.log(`un-white-list, body no need binding again!`);
                } else {
                    console.log(`un-white-list, body only need binding once!`);
                    body.dataset.bindFlag = "true";
                    // bind once
                    body.addEventListener("keyup", function(e) {
                        let key = e.which || e.keyCode;
                        if(e.which === 17) {
                            isCtrlPressed = false;
                        }
                        if(e.which === 18) {
                            isAltPressed = false;
                        }
                    }, false);
                    body.addEventListener("keydown", function(e) {
                        let key = e.which || e.keyCode;
                        if(e.which === 17) {
                            isCtrlPressed = true;
                        }
                        if(e.which === 18) {
                            isAltPressed = true;
                        }
                        let isCtrl = isCtrlPressed;
                        let isAlt = isAltPressed;
                        let KSN_Obj = JSON.parse(window.sessionStorage.getItem(`keyboard_shortcuts_names_obj`));
                        let {
                            prev_name,
                            next_name
                        } = KSN_Obj;
                        let prev_btn = document.querySelector(`[data-btn="${prev_name}"]`);
                        let next_btn = document.querySelector(`[data-btn="${next_name}"]`);
                        // let save_btn = document.querySelector(`[data-btn="${save_name}"]`);
                        // let passed_btn = document.querySelector(`[data-btn="${passed_name}"]`);
                        if(e.which === 83 && isCtrl && isAlt) {
                            // if (save_btn) {
                            //     save_btn.click();
                            // }
                        }
                        if(e.which === 68 && isCtrl && isAlt) {
                            if (prev_btn) {
                                prev_btn.click();
                            }
                        }
                        if(e.which === 70 && isCtrl && isAlt) {
                            if (next_btn) {
                                next_btn.click();
                            }
                        }
                        if(e.which === 88 && isCtrl && isAlt) {
                            // if (passed_btn) {
                            //     passed_btn.click();
                            // }
                        }
                    }, false);
                }
            },
        },
        mounted() {
            this.init();
            let isGobalBindKS = window.sessionStorage.getItem(`isGobalBindKeyboardShortcuts`);
            // isGobalBindKS === "true"
            if (isGobalBindKS) {
                // only bind once
                console.warn(`un-white-list, KeyboardShortcuts, only need bind once!`, isGobalBindKS);
            } else {
                // init bind
                console.info(`un-white-list, KeyboardShortcuts, bind once!`, isGobalBindKS);
                this.globalBindKeyboardShortcuts();
                window.sessionStorage.setItem(`isGobalBindKeyboardShortcuts`, true);
            }
        },
        activated() {
            // keep-alive 组件激活时调用。
            // this.$hMessage.success(`keep-alive 组件激活时调用`);
            // console.log(`keep-alive 组件激活时调用`);
            this.onClickButton(`search`);
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
    .audit-common-row-padding{
        margin-bottom: 5px;
    }
</style>

<style lang="scss">
    .disabled-user-selection > .h-table-cell > div > span,
    .disabled-user-selection > .h-table-cell > div > strong,
    .disabled-user-selection > .h-table-cell > div,
    .disabled-user-selection > .h-table-cell > span,
    .disabled-user-selection > .h-table-cell {
        -webkit-user-select: none !important; /* Safari 3.1+ */
        -moz-user-select: none !important; /* Firefox 2+ */
        -ms-user-select: none !important; /* IE 10+ */
        user-select: none !important; /* Standard syntax */
    }
    .audit-common-lable-margin-left{
        margin-left: 30px;
    }
    /* .audit-row-min-width-150 > .h-table-cell{
      width: 100px;
      text-emphasis: emphasis;
      word-wrap: none;
      word-break: el
    } */
    /* .audit-row-min-width-350 > .h-table-cell{
      min-width: 500px;
    } */
</style>
