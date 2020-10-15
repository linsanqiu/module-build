<template>
    <section>
        <div class="audit-common-header">
            <span class="audit-common-lable">热词名称</span>
            <span class="audit-common-lable-strong">
                {{passedLabelWord}}
            </span>
            <!-- <span class="audit-common-lable">热词热度</span>
            <span class="audit-common-lable-strong">
                <i data-icons="fire"></i>{{passedHotWordHeat}}
            </span> -->
            <!-- <span class="audit-common-lable-strong">
                🔥{{passedHotWordHeat}}
            </span> -->
            <!-- <span class="audit-common-lable">创建日期</span>
            <h-date-picker
                type="datetimerange"
                format="yyyy-MM-dd HH:mm:ss"
                aria-placeholder="创建日期"
                :placeholder="placeholders.publishDateRange"
                style="width: 330px"
                :value="commonFilters.publishDateRange"
                @on-change="onChangeDateRangePicker">
            </h-date-picker>
            <span class="audit-common-lable">创建人</span>
            <h-select
                aria-placeholder="创建人"
                placeholder="请选择创建人"
                style="width: 150px"
                v-model="commonFilters.createdUser"
                filterable
                clearable>
                <h-option
                    v-for="(item, i) in processingPersonnels"
                    :value="item.value"
                    :key="i">
                    {{item.title}}
                </h-option>
            </h-select> -->
            <!-- <span class="audit-common-lable">热词名称</span>
            <h-input
                aria-placeholder="热词名称"
                placeholder="请输入热词名称"
                style="width: 150px"
                v-model="commonFilters.hotWord"
                @on-change="onChangeInput(`hotWord`)"
                @on-enter="onChangeInputEnter(`hotWord`)"
                ref="hotWord"
                @on-click="shitClearableClick(`hotWord`)"
                :clearable="true"
                icon="android-close">
            </h-input>
            <span class="audit-common-lable-placeholder"></span>
            <h-button
                type="primary"
                icon="search"
                data-ref="init-btn"
                @click="onClickButton(`search`)">
                查询
            </h-button> -->
            <!-- <hr class="audit-common-padding" />
            <h-button
                type="primary"
                icon="add"
                data-ref="add-btn"
                @click="onClickButton(`add`)">
                新建
            </h-button>
            <span class="audit-common-lable-placeholder"></span>
            <h-button
                type="primary"
                icon="upload1"
                data-ref="upload-btn"
                @click="onClickButton(`upload`)">
                导入
            </h-button>
            <span class="audit-common-lable-placeholder"></span>
            <h-button
                type="primary"
                icon="t-b-download"
                data-ref="download-btn"
                @click="onClickButton(`download`)">
                导出
            </h-button> -->
        </div>
        <div class="audit-common-content">
            <h-row class-name="audit-common-row-padding" v-if="isDeletePermission">
                <h-col span="4">
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
            确认删除热词: <span data-font="remove-word">{{removeWordName}}</span>
            <hr class="audit-common-padding" />
            <span class="audit-common-lable">移除原因</span>
            <h-select
                aria-placeholder="热词移除原因"
                placeholder="请选择热词移除原因"
                style="width: 180px"
                ref="word-remove-reason"
                v-model="wordRemoveReason"
                filterable
                clearable>
                <h-option
                    v-for="(item, i) in wordRemoveReasons"
                    :value="item.value"
                    :key="i">
                    {{item.title}}
                </h-option>
            </h-select>
        </h-msgBox>
        <h-msgBox
            v-else
            title="批量删除操作"
            @on-ok="reSureDelete"
            v-model="modalDelete.showModal"
            :loading="modalDelete.modalLoading">
            二次确认: 批量删除
        </h-msgBox>
        <!-- add -->
        <h-msgBox
            title="新建操作"
            @on-ok="reSureAdd"
            v-model="modalAdd.showModal"
            :loading="modalAdd.modalLoading">
            <span class="audit-common-lable">热词名称</span>
            <h-input
                aria-placeholder="热词名称"
                placeholder="请输入要新建的热词名称"
                style="width: 250px"
                v-model="labelWord"
                @on-change="onInputChange(`labelWord`)"
                @on-enter="onInputEnter(`labelWord`)"
                ref="labelWord"
                @on-click="onInputClearable(`labelWord`)"
                icon="android-close">
            </h-input>
            <hr class="audit-common-padding" />
            <span class="audit-common-lable">资讯 ID</span>
            <h-input
                aria-placeholder="资讯 ID"
                placeholder="请输入热词关联的资讯 ID!"
                style="width: 250px"
                v-model="newsId"
                @on-change="onInputChange(`newsId`)"
                @on-enter="onInputEnter(`newsId`)"
                ref="newsId"
                @on-click="onInputClearable(`newsId`)"
                :clearable="true"
                icon="android-close">
            </h-input>
            <hr class="audit-common-padding" />
            <div slot="footer">
                <h-button
                    @click="reSureAddCancel">
                    取消
                </h-button>
                <h-tooltip
                    v-if="isEmptyLabelWord"
                    style="width: auto"
                    placement="top"
                    content="请输入新建热词名称!">
                    <h-button
                        type="primary"
                        :disabled="isEmptyLabelWord"
                        @click="reSureAdd">
                        确认
                    </h-button>
                </h-tooltip>
                <h-button
                    v-else
                    type="primary"
                    :disabled="isEmptyLabelWord"
                    @click="reSureAdd">
                    确认
                </h-button>
            </div>
        </h-msgBox>
        <!-- upload -->
        <h-msgBox
            title="导入操作"
            @on-ok="reSureUpload"
            v-model="modalUpload.showModal"
            :loading="modalUpload.modalLoading">
            <p data-style="p">请选择要导入的文件:</p>
            <input
                type="file"
                id="hot_upload_execel_file"
                ref="upload-file"/>
            <hr class="audit-common-padding" />
            <div slot="footer">
                <h-button
                    @click="reSureUploadCancel">
                    取消
                </h-button>
                <h-tooltip
                    v-if="isUploadFileEmpty"
                    style="width: auto"
                    placement="top"
                    content="请选择要上传的 Excel 文件!">
                    <h-button
                        type="primary"
                        :disabled="isUploadFileEmpty"
                        :loading="uploadButtonLoading"
                        @click="reSureUpload">
                        确认
                    </h-button>
                </h-tooltip>
                <h-button
                    v-else
                    type="primary"
                    :disabled="isUploadFileEmpty"
                    :loading="uploadButtonLoading"
                    @click="reSureUpload">
                    确认
                </h-button>
            </div>
        </h-msgBox>
        <!-- download -->
        <h-msgBox
            title="导出操作"
            @on-ok="reSureDownload"
            v-model="modalDownload.showModal"
            :loading="modalDownload.modalLoading">
            <p data-style="p">确认导出 Excel 文件!</p>
        </h-msgBox>
        <!-- modify -->
        <h-msgBox
            title="更新操作"
            @on-ok="reSureModify"
            v-model="modalModify.showModal"
            :loading="modalModify.modalLoading">
            <h-row class-name="common-handle-padding">
                <h-col span="12">
                    <h-row class-name="common-handle-padding">
                        <h-col span="4">
                            <span class="audit-common-lable-modify">热词名称</span>
                        </h-col>
                        <h-col span="16" offset="4">
                            <h-input
                                aria-placeholder="热词名称"
                                placeholder="请输入要更新的热词名称"
                                style="width: 250px"
                                v-model="passedHotWordName"
                                @on-change="onModifyInputChange(`passedHotWordName`)"
                                @on-enter="onModifyInputEnter(`passedHotWordName`)"
                                ref="passedHotWordName"
                                @on-click="onModifyInputClearable(`passedHotWordName`)"
                                icon="android-close">
                            </h-input>
                            <hr class="audit-common-padding" />
                        </h-col>
                    </h-row>
                    <h-row class-name="common-handle-padding">
                        <h-col span="4">
                            <span class="audit-common-lable-modify">热词 ID</span>
                        </h-col>
                        <h-col span="16" offset="4">
                            <h-input
                                aria-placeholder="热词 ID"
                                placeholder="请输入热词 ID!"
                                style="width: 250px"
                                v-model="passedHotWordId"
                                @on-change="onModifyInputChange(`passedHotWordId`)"
                                @on-enter="onModifyInputEnter(`passedHotWordId`)"
                                ref="passedHotWordId"
                                :clearable="false"
                                :disabled="true"
                                data-icon="android-close">
                            </h-input>
                            <hr class="audit-common-padding" />
                        </h-col>
                    </h-row>
                </h-col>
            </h-row>
            <hr class="audit-common-padding" />
            <div slot="footer">
                <h-button
                    @click="reSureModifyCancel">
                    取消
                </h-button>
                <h-tooltip
                    v-if="isModifyEmptyLabelWord"
                    style="width: auto"
                    placement="top"
                    content="请输入更新的热词名称!">
                    <h-button
                        type="primary"
                        :disabled="isModifyEmptyLabelWord"
                        :loading="asyncButtonLoading"
                        @click="reSureModify">
                        确认更新
                    </h-button>
                </h-tooltip>
                <h-button
                    v-else
                    type="primary"
                    :disabled="isModifyEmptyLabelWord"
                    :loading="asyncButtonLoading"
                    @click="reSureModify">
                    确认更新
                </h-button>
            </div>
        </h-msgBox>
    </section>
</template>

<script>
    /**
     *
     * @author xiagq
     * @copyright gildata
     *
     * @created 2019.02.27
     * @modified 2019.02.27
     *
     * @description 热词列表 hot-word-maintenance
     * @augments
     * @example
     *
     */
    import {
        TODAY,
        TODAY_Begin,
        TODAY_End,
        TODAY_TimeStamp,
    } from "@/utils/utils";
    export default {
        // name: "AuditNewsHot-word-maintenance",
        data () {
            return {
                asyncButtonLoading: false,
                isModifyEmptyLabelWord: true,
                passedHotWordId: "",
                passedHotWordName: "",
                passedHotWordHeat: "",
                passedLabelWord: "",
                wordRemoveIndex: "",
                wordRemoveId: "",
                uploadButtonLoading: false,
                isUploadFileEmpty: true,
                isEmptyLabelWord: true,
                newsId: "",
                labelWord: "",
                file: "",
                removeWord: "",
                removeWordName: "",
                wordRemoveReason: "",
                wordRemoveReasons: [],
                newsListTypes: [],
                newsListType: "",
                isBatchDelete: false,
                batchDeleteUids: [],
                modalAdd: {
                    modalLoading: true,
                    showModal: false,
                    maximize: true,
                    scrollable: true,
                    transfer: false,
                    title: "",
                },
                modalDownload: {
                    modalLoading: true,
                    showModal: false,
                    maximize: true,
                    scrollable: true,
                    transfer: false,
                    title: "",
                },
                modalUpload: {
                    modalLoading: true,
                    showModal: false,
                    maximize: true,
                    scrollable: true,
                    transfer: false,
                    title: "",
                },
                modalDelete: {
                    modalLoading: true,
                    showModal: false,
                    maximize: true,
                    scrollable: true,
                    transfer: false,
                    title: "",
                },
                modalModify: {
                    modalLoading: true,
                    showModal: false,
                    maximize: true,
                    scrollable: true,
                    transfer: false,
                    title: "",
                },
                processingPersonnels: [],
                newsIds: [],
                commonFilters: {
                    // publishDate: TODAY,
                    // publishDateEnd: TODAY,
                    // publishDateRange: [TODAY, TODAY],
                    publishDate: TODAY_Begin,
                    publishDateEnd: TODAY_End,
                    publishDateRange: [TODAY_Begin, TODAY_End],
                    createdUser: "",
                    // createUserName: "",
                    // createUserId: "",
                    hotWord: "",
                    wordType: 1,// HOT_WORD
                },
                commonFiltersPagination: {
                    publishDate: TODAY_Begin,
                    publishDateEnd: TODAY_End,
                    publishDateRange: [TODAY_Begin, TODAY_End],
                    createdUser: "",
                    // createUserName: "",
                    // createUserId: "",
                    hotWord: "",
                    wordType: 1,
                },
                placeholders: {
                    // publishDateRange: "开始日期    ~    结束日期",
                    publishDateRange: "开始日期                    ~                    结束日期",
                    publishDate: "请输入查询日期",
                },
                commonTableCols: [
                    {
                        type: "selection",
                        width: 60,
                        align: "center",
                        fixed: "left",
                    },
                    {
                        key: "hotWordId",
                        title: "热词 ID",
                        width: 200,
                        align: "center",
                        // fixed: "left",
                        // sortable: true,
                        // className: "disabled-user-selection",
                    },
                    {
                        key: "hotWordName",
                        title: "热词名称",
                        width: 150,
                        align: "left",
                        // sortable: true,
                        // className: "disabled-user-selection",
                    },
                    // {
                    //     key: "hotWordHeat",
                    //     title: "热词热度",
                    //     width: 100,
                    //     align: "center",
                    //     // sortable: true,
                    //     // className: "disabled-user-selection",
                    // },
                    {
                        key: "newsId",
                        title: "资讯 ID",
                        // sortable: true,
                        width: 200,
                        align: "left",
                        "row-class-name": "disabled-user-selection",
                        render: (h, params) => {
                            let uid = params.row.newsId;
                            return h("a", {
                                attrs: {
                                    title: "点击跳转到资讯处理列表!",
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
                                        // 处理 & autoSkip()
                                        // let url = `/audit/news/all-in-one#${uid}`;
                                        let url = `/audit/news/all-in-one/operate-view#${uid}`;
                                        // this.$router.push(url);
                                        this.getNewsListTypeById(uid);
                                    },
                                }
                            }, uid);
                        },
                    },
                    {
                        key: "createUserName",
                        title: "创建人",
                        width: 120,
                        align: "center",
                        // sortable: true,
                        // className: "disabled-user-selection",
                        render: (h, params) => {
                            let userName = params.row.createUserName;
                            if (userName) {
                                return h("div", [
                                    h("Icon", {
                                        props: {
                                            name: "person"
                                        }
                                    }),
                                    h("strong", userName),
                                ]);
                            } else {
                                return h("div", [
                                    h("strong", userName),
                                ]);
                            }
                        },
                    },
                    {
                        key: "createTime",
                        title: "创建时间",
                        // width: 150,
                        align: "center",
                        // sortable: true,
                        // className: "disabled-user-selection",
                    },
                    {
                        key: "updateTime",
                        title: "更新时间",
                        // width: 100,
                        align: "center",
                        // sortable: true,
                        // className: "disabled-user-selection",
                    },
                    {
                        key: "updateUser",
                        title: "更新人",
                        // width: 150,
                        align: "center",
                        // sortable: true,
                        // className: "disabled-user-selection",
                    },
                    {
                        key: "operation",
                        title: "操作",
                        width: 150,
                        align: "center",
                        fixed: "right",
                        render: (h, params) => {
                            // 编辑 / 删除
                            // let newsOperateVoList = params.row.newsOperateVoList;
                            let newsOperateVoList = [
                                {
                                    title: "编辑",
                                    url: "",
                                    type: 1,
                                },
                                {
                                    title: "删除",
                                    url: "",
                                    type: 0,
                                },
                            ];
                            let uid = params.row.newsId;
                            let {
                                hotWordId,
                                hotWordName,
                                index: wordRemoveIndex,
                            } = params.row;
                            let {
                                publishDate: startTime,
                                publishDateEnd: endTime,
                                createdUser: createUserId,
                                hotWord: word,
                                wordType,// HOT_WORD
                            } = this.commonFilters;
                            // 后端翻页
                            let {
                                current,
                                size,
                            } = this.pagination;
                            let flipObj = {
                                startTime,
                                endTime,
                                createUserId,
                                word,
                                wordType,
                                current,
                                size,
                                hotWordId,
                                hotWordName,
                            };
                            let links = [];
                            links = newsOperateVoList.map(
                                (obj, i) => {
                                    let {
                                        title: desc,
                                        type,
                                    } = obj;
                                    // let {
                                    //     operateDesc: desc,
                                    //     operateType: type,
                                    //     // operateUrl,// 前端路由定义
                                    // } = obj;
                                    let operateUrl = ``;
                                    let routerPath = ``;
                                    switch (type) {
                                        case 1:
                                            operateUrl = `/tm/tag/getWordList`;
                                            // operateUrl = `/tm/getNewsInfoById`;
                                            routerPath = `/audit/news/hot-word-maintenance/operate-handle`;
                                            break;
                                        case 2:
                                            operateUrl = `/tm/getNewsInfoById`;
                                            routerPath = `/audit/news/hot-word-maintenance/operate-view`;
                                            break;
                                        default:
                                            operateUrl = `#type=删除`;
                                            // routerPath = `/audit/news/operate-verify`;
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
                                                // 删除, 处理
                                                let options = {
                                                    path: routerPath,
                                                };
                                                if (type === 0) {
                                                    // let uids = [uid];
                                                    // this.batchDeleteUids = uids;
                                                    this.wordRemoveId = hotWordId;
                                                    this.wordRemoveIndex = wordRemoveIndex;
                                                    this.removeWord = hotWordId;
                                                    this.removeWordName = hotWordName;
                                                    // tm/tag/removeWord DELETE
                                                    // {"id":id,"removeType":removeType}
                                                    this.clickShowResureDeleteModal();
                                                } else {
                                                    // 1：处理； 2：查看；
                                                    let new_type = "";
                                                    switch (type) {
                                                        case 1:
                                                            new_type = "handle";
                                                            break;
                                                        case 2:
                                                            new_type = "view";
                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                    // set flip page object
                                                    // window.sessionStorage.setItem(`hot-word-maintenance_flipObj_${new_type}`, JSON.stringify(flipObj));
                                                    // let router_query = {
                                                    //     type,
                                                    //     // type: newsListType,
                                                    //     desc,
                                                    //     uid,
                                                    //     url: operateUrl,
                                                    // };
                                                    // window.sessionStorage.setItem(`hot-word-maintenance_route_query_${new_type}`, JSON.stringify(router_query));
                                                    if (type === 1) {
                                                        // this.$router.push(options);
                                                        this.$data.passedHotWordId = hotWordId;
                                                        this.$data.passedHotWordName = hotWordName;
                                                        this.showModify();
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
                    {
                        key: "hotWordId",
                        title: "热词 ID",
                        width: 200,
                        align: "center",
                        fixed: "left",
                        // sortable: true,
                        // className: "disabled-user-selection",
                    },
                    {
                        key: "hotWordName",
                        title: "热词名称",
                        width: 150,
                        align: "left",
                        // sortable: true,
                        // className: "disabled-user-selection",
                    },
                    // {
                    //     key: "hotWordHeat",
                    //     title: "热词热度",
                    //     width: 100,
                    //     align: "center",
                    //     // sortable: true,
                    //     // className: "disabled-user-selection",
                    // },
                    {
                        key: "newsId",
                        title: "资讯 ID",
                        // sortable: true,
                        width: 200,
                        align: "left",
                        "row-class-name": "disabled-user-selection",
                        render: (h, params) => {
                            let uid = params.row.newsId;
                            return h("a", {
                                attrs: {
                                    title: "点击跳转到资讯处理列表!",
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
                                        // 处理 & autoSkip()
                                        // let url = `/audit/news/all-in-one#${uid}`;
                                        let url = `/audit/news/all-in-one/operate-view#${uid}`;
                                        // this.$router.push(url);
                                        this.getNewsListTypeById(uid);
                                    },
                                }
                            }, uid);
                        },
                    },
                    {
                        key: "createUserName",
                        title: "创建人",
                        width: 120,
                        align: "center",
                        // sortable: true,
                        // className: "disabled-user-selection",
                        render: (h, params) => {
                            let userName = params.row.createUserName;
                            if (userName) {
                                return h("div", [
                                    h("Icon", {
                                        props: {
                                            name: "person"
                                        }
                                    }),
                                    h("strong", userName),
                                ]);
                            } else {
                                return h("div", [
                                    h("strong", userName),
                                ]);
                            }
                        },
                    },
                    {
                        key: "createTime",
                        title: "创建时间",
                        // width: 150,
                        align: "center",
                        // sortable: true,
                        // className: "disabled-user-selection",
                    },
                    {
                        key: "updateTime",
                        title: "更新时间",
                        // width: 150,
                        align: "center",
                        // sortable: true,
                        // className: "disabled-user-selection",
                    },
                    {
                        key: "updateUser",
                        title: "更新人",
                        // width: 150,
                        align: "center",
                        // sortable: true,
                        // className: "disabled-user-selection",
                    },
                    {
                        key: "operation",
                        title: "操作",
                        width: 150,
                        align: "center",
                        fixed: "right",
                        render: (h, params) => {
                            // 编辑 / 删除
                            // let newsOperateVoList = params.row.newsOperateVoList;
                            let newsOperateVoList = [
                                {
                                    title: "编辑",
                                    url: "",
                                    type: 1,
                                },
                                {
                                    title: "删除",
                                    url: "",
                                    type: 0,
                                },
                            ];
                            let {
                                hotWordId,
                                hotWordName,
                                index: wordRemoveIndex,
                            } = params.row;
                            let uid = params.row.newsId;
                            let {
                                publishDate: startTime,
                                publishDateEnd: endTime,
                                createdUser: createUserId,
                                hotWord: word,
                                wordType,// HOT_WORD
                            } = this.commonFilters;
                            // 后端翻页
                            let {
                                current,
                                size,
                            } = this.pagination;
                            let flipObj = {
                                startTime,
                                endTime,
                                createUserId,
                                word,
                                wordType,
                                current,
                                size,
                                hotWordId,
                                hotWordName,
                            };
                            let links = [];
                            links = newsOperateVoList.map(
                                (obj, i) => {
                                    let {
                                        title: desc,
                                        type,
                                    } = obj;
                                    // let {
                                    //     operateDesc: desc,
                                    //     operateType: type,
                                    //     // operateUrl,// 前端路由定义
                                    // } = obj;
                                    let operateUrl = ``;
                                    let routerPath = ``;
                                    switch (type) {
                                        case 1:
                                            operateUrl = `/tm/tag/getWordList`;
                                            // operateUrl = `/tm/getNewsInfoById`;
                                            routerPath = `/audit/news/hot-word-maintenance/operate-handle`;
                                            break;
                                        case 2:
                                            operateUrl = `/tm/getNewsInfoById`;
                                            routerPath = `/audit/news/hot-word-maintenance/operate-view`;
                                            break;
                                        default:
                                            operateUrl = `#type=删除`;// 4
                                            // routerPath = `/audit/news/operate-verify`;
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
                                                // 删除, 处理
                                                let options = {
                                                    path: routerPath,
                                                };
                                                if (type === 0) {
                                                    // let uids = [uid];
                                                    // this.batchDeleteUids = uids;
                                                    this.wordRemoveId = hotWordId;
                                                    this.wordRemoveIndex = wordRemoveIndex;
                                                    this.removeWord = hotWordId;
                                                    this.removeWordName = hotWordName;
                                                    this.clickShowResureDeleteModal();
                                                } else {
                                                    // 1：处理； 2：查看；
                                                    let new_type = "";
                                                    switch (type) {
                                                        case 1:
                                                            new_type = "handle";
                                                            break;
                                                        case 2:
                                                            new_type = "view";
                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                    // set flip page object
                                                    // window.sessionStorage.setItem(`hot-word-maintenance_flipObj_${new_type}`, JSON.stringify(flipObj));
                                                    // let router_query = {
                                                    //     type,
                                                    //     // type: newsListType,
                                                    //     desc,
                                                    //     uid,
                                                    //     url: operateUrl,
                                                    // };
                                                    // window.sessionStorage.setItem(`hot-word-maintenance_route_query_${new_type}`, JSON.stringify(router_query));
                                                    if (type === 1) {
                                                        // this.$router.push(options);
                                                        this.$data.passedHotWordId = hotWordId;
                                                        this.$data.passedHotWordName = hotWordName;
                                                        this.showModify();
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
            onModifyInputChange (type = ``) {
                let value = this[type];
                this[type] = value.trim();
                if (type === `passedHotWordName`) {
                    if (!value) {
                        this.$refs[type].focus();
                        this.isModifyEmptyLabelWord = true;
                        this.$hMessage.info(`热词不可以为空!`);
                    } else {
                        this.isModifyEmptyLabelWord = false;
                    }
                }
            },
            onModifyInputEnter (type = ``) {
                let value = this[type];
                this[type] = value.trim();
                if (value) {
                    if (type === "passedHotWordName") {
                        this.isModifyEmptyLabelWord = false;
                        // enter
                        this.asyncModifyHotWord();
                    } else {
                        // this.isModifyEmptyLabelWord = true;
                    }
                } else {
                    if (type === "passedHotWordName") {
                        this.isModifyEmptyLabelWord = true;
                    } else {
                        // this.isModifyEmptyLabelWord = false;
                    }
                }
            },
            onModifyInputClearable(type = ``) {
                this[type] = ``;
                this.$refs[type].focus();
                if (type === "passedHotWordName") {
                    this.isModifyEmptyLabelWord = true;
                }
            },
            showModify() {
                this.modalModify.showModal = true;
            },
            reSureModify() {
                this.modalModify.showModal = false;
                this.asyncModifyHotWord();
            },
            reSureModifyCancel () {
                this.modalModify.showModal = false;
                // this.passedHotWordName = ``;
                // this.passedHotWordId = ``;
            },
            // 更新热词
            asyncModifyHotWord() {
                let url = `/tm/tag/modifyHotWord`;
                let word = this.passedHotWordName || ``;
                let id = this.passedHotWordId || ``;
                this.asyncButtonLoading = true;
                this.$http
                .post(url, {
                    word,
                    id,
                })
                .then(res => res.data)
                .then((json)=>{
                     let {
                        status,
                        msg,
                        // body,
                    } = json;
                    if(status != this.$api.SUCCESS){
                        this.asyncButtonLoading = false;
                        this.modalModify.showModal = false;
                        this.$hMessage.error(msg);
                        return;
                    } else {
                        this.modalModify.showModal = false;
                        this.passedLabelWord = word;
                        setTimeout(() => {
                            this.asyncButtonLoading = false;
                            this.$hMessage.success(`更新热词成功!`);
                            this.onClickButton(`search`);
                        }, 500);
                    }
                }).catch(err => console.error(`更新热词  error`, err));;
            },
            autoClearInputFile() {
                // clear files[0] && clear input
                let upload = document.querySelector(`#hot_upload_execel_file`);
                upload.replaceWith(upload.val(``).clone(true));
            },
            autoBindUpload() {
                let that = this;
                let upload = document.querySelector(`#hot_upload_execel_file`);
                let isBind = upload.dataset.isBind || false;
                if (!isBind) {
                    upload.dataset.isBind = true;
                    upload.addEventListener(`change`, function() {
                        let file = this.files[0];
                        let {
                            name,
                        } = file;
                        if (file) {
                            if (name.includes(`.xlsx`)) {
                                that.isUploadFileEmpty = false;
                                that.file = file;
                            } else {
                                that.$hMessage.info(`请选择 Excel 文件上传!`);
                                that.isUploadFileEmpty = true;
                                that.file = "";
                            }
                        } else {
                            that.isUploadFileEmpty = true;
                            that.file = "";
                        }
                    }, false);
                } else {
                    console.info(`only need bind once!`);
                }
            },
            onInputChange (type = ``) {
                // console.log(`labelWord type =`, type);
                // console.log(`labelWord value =`, this[type]);
                let value = this[type];
                this[type] = value.trim();
                if (type === `labelWord`) {
                    if (!value.trim()) {
                        this.$refs[type].focus();
                        this.isEmptyLabelWord = true;
                        this.$hMessage.info(`热词不可以为空!`);
                    } else {
                        this.isEmptyLabelWord = false;
                    }
                }
            },
            onInputEnter (type = ``) {
                let value = this[type];
                this[type] = value.trim();
                if (value.trim()) {
                    if (type === "labelWord") {
                        this.isEmptyLabelWord = false;
                        // enter
                        // this.asyncAddHotWord();
                    } else {
                        // this.isEmptyLabelWord = true;
                    }
                } else {
                    if (type === "labelWord") {
                        this.isEmptyLabelWord = true;
                    } else {
                        // this.isEmptyLabelWord = false;
                    }
                }
            },
            onInputClearable(type = ``) {
                this[type] = ``;
                this.$refs[type].focus();
                if (type === "labelWord") {
                    this.isEmptyLabelWord = true;
                }
            },
            // 添加热词
            asyncAddHotWord() {
                let url = `/tm/tag/addWord`;
                let word = this.labelWord || "";
                let newsId = this.newsId || ``;
                this.$http
                .post(url, {
                    word,
                    newsId,
                })
                .then(res => res.data)
                .then((json)=>{
                     let {
                        status,
                        msg,
                        // body,
                    } = json;
                    if(status != this.$api.SUCCESS){
                        this.modalAdd.showModal = false;
                        this.$hMessage.error(msg);
                        return;
                    } else {
                        this.modalAdd.showModal = false;
                        this.$hMessage.success(`添加热词成功!`);
                        this.onClickButton(`search`);
                    }
                }).catch(err => console.error(`添加热词  error`, err));;
            },
            downloadFile() {
                let url = `/tm/tag/downLoadWord`;
                let {
                    publishDate: startTime,
                    publishDateEnd: endTime,
                    createdUser: createUserId,
                    hotWord: word,
                    wordType,// HOT_WORD
                }= this.commonFilters;
                let options = {
                    startTime,
                    endTime,
                    createUserId,
                    word,
                    wordType,
                };
                url += `?`;
                Object.keys(options).forEach(
                    (key, i) => {
                        if (i < 4) {
                            url += `${key}=${options[key] ? options[key] : ""}&`;
                        } else {
                            url += `${key}=${options[key] ? options[key] : ""}`;
                        }
                    }
                );
                const ip = window.parent.location.origin;
                url = ip + url;
                // Method 1: Open New Window
                // window.open(url, `热词`);
                // Method 2: Auto Click
                let alink = document.createElement(`a`);
                alink.href = url;
                alink.target = "_blank";
                alink.download = `热词_${TODAY_TimeStamp}.xlsx`;
                alink.click();
            },
            uploadFile(file = ``) {
                let url = `/tm/tag/uploadHotWord`;
                let formData = new FormData();
                formData.append("file", file);
                let options = {
                    body: formData,
                };
                this.$http
                .post(url, formData)
                .then(res => res.data)
                .then((json)=>{
                    let {
                        status,
                        msg,
                        body,
                    } = json;
                    if(status != this.$api.SUCCESS){
                        setTimeout(() => {
                            this.uploadButtonLoading = false;
                            this.$hMessage.error(msg);
                        }, 500);
                        return;
                    } else {
                        setTimeout(() => {
                            this.uploadButtonLoading = false;
                            this.$hMessage.success(`上传成功!`);
                        }, 500);
                    }
                }).catch(err => console.error(`upload error`, err));
            },
            showAdd() {
                this.modalAdd.showModal = true;
            },
            showUpload() {
                this.modalUpload.showModal = true;
                this.autoBindUpload();
            },
            showDownload() {
                this.modalDownload.showModal = true;
            },
            reSureAddCancel() {
                this.modalAdd.showModal = false;
                this.labelWord = "";
                this.newsId = ``;
            },
            reSureUploadCancel() {
                this.modalUpload.showModal = false;
                this.file = "";
                this.autoClearInputFile();
            },
            reSureAdd() {
                this.modalAdd.showModal = false;
                this.asyncAddHotWord();
            },
            reSureUpload() {
                this.modalUpload.showModal = false;
                let file = this.file;
                console.log(`uploading ...`, file);
                this.uploadFile(file);
            },
            reSureDownload() {
                this.modalDownload.showModal = false;
                console.log(`downloading ...`);
                this.downloadFile();
            },
            // modals
            reSureDelete () {
                // let uids = this.batchDeleteUids || [];
                // this.batchDeleteNewsIds(uids);
                let uid = this.wordRemoveId;
                this.deleteWordById(uid);
            },
            clickShowResureDeleteModal(isBatch = false) {
                this.wordRemoveReason = "";
                this.modalDelete.showModal = true;
                if (isBatch) {
                    this.isBatchDelete = true;
                } else {
                    this.isBatchDelete = false;
                }
                setTimeout(() => {
                    this.$refs["word-remove-reason"].focus();
                }, 500);
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
                this.commonFilters[type] = value.trim();
                // this.$hMessage.info(`${type} = ${value}`);
            },
            onChangeInputEnter (type = ``) {
                let value = this.commonFilters[type];
                this.commonFilters[type] = value.trim();
                // this.$hMessage.info(`${type} = ${value}`);
                this.onClickButton(`search`);
            },
            shitClearableClick(type = ``) {
                this.commonFilters[type] = ``;
                this.$refs[type].focus();
            },
            onChangeSelect (type = ``) {
                let value = this.commonFilters[type];
                // this.$hMessage.info(value);
            },
            onClickButton (type = ``) {
                let {
                    // publishDate: startTime,
                    // publishDateEnd: endTime,
                    // createdUser: createUserId,
                    hotWord: word,
                    wordType,// HOT_WORD
                }= this.commonFilters;
                let {
                    passedLabelWord,
                } = this.$data;
                this.commonFiltersPagination = {...this.commonFilters};
                // init
                this.pagination.current = 1;
                let {
                    current,
                    size,
                } = this.pagination;
                let options = {
                    // startTime,
                    // endTime,
                    // createUserId,
                    // word,
                    word: passedLabelWord,
                    wordType,
                    current,
                    size,
                };
                switch (type) {
                    case "add":
                        this.showAdd();
                        break;
                    case "upload":
                        this.showUpload();
                        break;
                    case "download":
                        this.showDownload();
                        break;
                    case "search":
                        this.getCommonTableDatas(options);
                        break;
                    default:
                        // this.getCommonTableDatas(options);
                        break;
                }
                // this.getCommonTableDatas(options);
            },
            getNewTableDatas (pagination = {}) {
                let {
                    // publishDate: startTime,
                    // publishDateEnd: endTime,
                    // createdUser: createUserId,
                    hotWord: word,
                    wordType,
                }= this.commonFiltersPagination;
                let {
                    passedLabelWord,
                } = this.$data;
                let {
                    current,
                    size,
                } = pagination;
                let options = {
                    // startTime,
                    // endTime,
                    // createUserId,
                    // word,
                    word: passedLabelWord,
                    wordType,
                    current,
                    size,
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
                // let idsString = JSON.stringify(ids);
                let id = this.wordRemoveId;
                let removeType = this.wordRemoveReason;
                let options = {
                    id,
                    removeType,
                };
                let url = `/tm/tag/removeWord`;
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
                        console.log(`资讯列表删除 json =`, JSON.stringify(json, null, 4));
                        this.$hMessage.error(msg);
                        this.modalDelete.showModal = false;
                        this.tableLoading = false;
                        return;
                    } else {
                        // this.$hMessage.success(msg);
                        this.$hMessage.success(this.isBatchDelete ? "批量删除成功" : "删除成功");
                        this.modalDelete.showModal = false;
                        this.tableLoading = false;
                        // this.onClickButton(`search`);
                    }
                }).catch(err => console.error(`删除 error`, err));
            },
            // 删除
            deleteWordById(uid = ``) {
                // let uid = this.deleteWordUid;
                let {
                    wordRemoveReason,
                } = this.$data;
                let options = {
                    id: uid,
                    removeType: wordRemoveReason,
                };
                let url = `/tm/tag/removeWord`;
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
                        console.log(`删除 json =`, JSON.stringify(json, null, 4));
                        this.$hMessage.error(msg);
                        this.modalDelete.showModal = false;
                        this.tableLoading = false;
                        return;
                    } else {
                        let index = this.wordRemoveIndex;
                        // console.log(`index`);
                        this.remove(index);
                        // this.$hMessage.success(msg);
                        this.$hMessage.success("删除成功");
                        this.modalDelete.showModal = false;
                        this.tableLoading = false;
                        // this.onClickButton(`search`);
                    }
                }).catch(err => console.error(`删除 error`, err));
            },
            // 热词移除原因 GET
            getRemoveReasonsBydictCode(listType = `wordRemoveReasons`, dictCode = 1008, debug = false){
                let url = `/tm/tbmDictList?dictCode=${dictCode}`;
                this.$http
                .get(url)
                .then(res => res.data)
                .then((json)=>{
                    // console.log(`热词移除原因 json =`, JSON.stringify(json, null, 4));
                    if (!json.body) {
                        console.log(`热词移除原因 json =`, JSON.stringify(json, null, 4));
                    } else {
                        let {
                            status,
                            msg,
                            body: {
                                tbmDictList: listDatas,
                            },
                        } = json;
                        listDatas = listDatas.map(
                            (obj, i) => {
                                let {
                                    entryName: title,
                                    dictEntry: value,
                                    // "entryName": "疑似近义词",
                                    // "dictName": "热词移除",
                                    // "sortNum": 0,
                                    // "dictEntry": "1"
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
                }).catch(err => console.error(`热词移除原因 error`, err));
            },
            // 处理人
            getProcessingPersonnelsByKeyWord(keyWord = ``, listType =``, debug = false){
                let url = "/tm/userListForWord";
                if (keyWord) {
                    url = `/tm/userListForWord?keyword=${keyWord}`;
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
                            result: listDatas,
                        } = body;
                        listDatas = listDatas.map(
                            (obj, i) => {
                                let {
                                    userName: title,
                                    userId: value,
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
            // hot-word-maintenance 资讯列表
            getCommonTableDatas (options = {}, debug = false) {
                this.tableLoading = true;
                // let url = `/tm/tag/getHotWordHeatList`;
                let url = `/tm/tag/getWordList`;
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
                        console.log(`hot-word-maintenance 资讯列表 json =`, JSON.stringify(json, null, 4));
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
                                this.commonTableCols = this.commonTableColsUnselection;
                            }
                            this.isDeletePermission = isDeletePermission;
                        }
                        this.commonTableCols = this.commonTableColsUnselection;
                        if (total) {
                            this.pagination.total = total;
                        } else {
                            this.pagination.total = 0;
                        }
                        if (Array.isArray(listDatas) && listDatas.length) {
                            this.initTableDatas = listDatas;
                            listDatas = listDatas.map(
                                (obj, i) => {
                                    let {
                                        createTime,
                                        // createUserId,
                                        createUserName,
                                        updateTime,
                                        // updateUserId,
                                        updateUserName: updateUser,
                                        id: hotWordId,
                                        word: hotWordName,
                                        newsId,
                                        wordType,
                                        // newsOperateVoList,
                                        hotWordHeat,
                                    } = obj;
                                    if (!newsId) {
                                        newsId = "";
                                    }
                                    if (!hotWordHeat) {
                                        hotWordHeat = "";
                                    }
                                    return {
                                        index: i,
                                        // index: i + 1,
                                        createTime,
                                        createUserName,
                                        updateTime,
                                        hotWordId,
                                        hotWordName,
                                        newsId,
                                        wordType,
                                        // newsOperateVoList,
                                        hotWordHeat,
                                        updateUser,
                                    };
                                }
                            );
                        } else {
                            listDatas = [];
                        }
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
                this.getRemoveReasonsBydictCode();
                // this.getProcessingPersonnelsByKeyWord(``, `processingPersonnels`);
                let {
                    current,
                    size,
                } = this.pagination;
                let {
                    passedLabelWord,
                } = this.$data;
                this.getCommonTableDatas({
                    // startTime: TODAY,
                    // endTime: TODAY,
                    // startTime: TODAY_Begin,
                    // endTime: TODAY_End,
                    // createUserId,
                    word: passedLabelWord,
                    wordType: 1,// HOT_WORD
                    current,
                    size,
                });
            },
            autoSkipLinks(type = `alink-uid`) {
                let that = this;
                let alinks = [...document.querySelector(`[data-alink="hot-word-uid"]`)];
                if (alinks.length) {
                    alinks.forEach(
                        (alink, i) => {
                            let flag = alink.dataset.isBind || false;
                            if (!flag) {
                                alink.dataset.isBind = true;
                                alink.addEventListener(`click`, () => {
                                    let uid = alink.dataset.uid;
                                    that.$router.push(`/audit/news/hot-word-maintenance#${uid}`);
                                });
                            }
                        }
                    );
                }
            },
            getNewsListTypeById(id = ``) {
                let url = `/tm/getNewsInfoById?newsId=${id}`;
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
                        this.$hMessage.error(msg);
                        return;
                    } else {
                        let {
                            dataType: newsListType,
                        } = body;
                        // console.log(`newsListType =`, newsListType);
                        let flipObj = {
                            newsId: id,
                            newsListType,
                            // current: 1,
                            // dataStatus: "0",
                            // dataType: "",
                            // fbsj: "2019-03-06 09:39:13",
                            // gkbz: "",
                            // handleUser: "",
                            // keyword: "",
                            // mtcc: "",
                            // newsId: "792019030601031654318005",
                            // newsType: "",
                            // publishTime: "2019-03-06",
                            // publishTimeEnd: "2019-03-06",
                            // size: 12,
                            // tag: "",
                            // xwbt: "",
                        };
                        let queryObj = {
                            "type": newsListType,
                            "desc": "查看",
                            "uid": id,
                            "url": "/tm/getNewsInfoById",
                        };
                        window.sessionStorage.setItem("all-in-one_flipObj_view", JSON.stringify(flipObj));
                        window.sessionStorage.setItem("all-in-one_route_query_view", JSON.stringify(queryObj));
                        let url = `/audit/news/all-in-one/operate-view#${id}`;
                        this.$router.push(url);
                    }
                }).catch(err => console.error(`NewsListType error`, err));
            },
        },
        mounted() {
            let flipObj = JSON.parse(window.sessionStorage.getItem(`hot-word-maintenance_flipObj_handle`));
            // console.log(`flipObj =`, JSON.stringify(flipObj, null, 4));
            if (Object.keys(flipObj).length) {
                let {
                    hotWordName,
                    hotWordHeat,
                } = flipObj;
                this.passedLabelWord = hotWordName || ``;
                this.passedHotWordHeat = hotWordHeat|| ``;
            } else {
                this.$hMessage.info(`未读取到热词!`);
                setTimeout(() => {
                    this.$router.push(`/audit/news/hot-word-maintenance`);
                }, 500);
            }
            this.init();
        },
        activated() {
            // console.log(`keep-alive 组件激活时调用`);
            // this.onClickButton(`search`);
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
    .audit-common-lable-long{
        @include common-lable($default-color);
        width: 75px !important;
    }
    .audit-common-lable-modify{
        @include common-lable($default-color);
        width: 75px !important;
        margin-top: 7px !important;
        padding-right: 5px !important;
        text-align: right !important;
        &::after{
            display: inline-block;
            content: ":";
        }
    }
    .audit-common-lable-placeholder{
        @include common-lable($default-color);
        width: 10px !important;
    }
    .audit-common-padding{
        display: block;
        padding-bottom: 10px;
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
    .audit-common-lable-strong{
        color: #298DFF;
        font-size: 16px;
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
    [data-font="remove-word"] {
        font-size: 14px !important;
        font-weight: bold;
        color: #000 !important;
        text-align: left;
    }
    [data-style="p"] {
        padding: 5px;
        margin: 3px;
        font-size: 14px !important;
        color: #000 !important;
    }
</style>


<style lang="scss" scoped>
    [data-icons="fire"] {
        display: inline-block;
        content: url("../icons/fire.png");
        width: 23px;
        height: 23px;
        /* width: 32px;
        height: 32px; */
        background: #fff;
    }
</style>
