<template>
    <section>
        <div class="audit-common-content">
            <h-row class-name="common-handle-padding" v-if="!isPageDataLoaded">
                <h-col span="12">
                    <h-row class-name="common-handle-padding">
                        <h-col span="24">
                            <span class="audit-common-lable common-handle-required">资讯标题</span>
                            <h-input
                                aria-placeholder="资讯标题"
                                placeholder=""
                                style="width: 80%"
                                v-model="commonHandle.newsTitle"
                                :disabled="true">
                            </h-input>
                        </h-col>
                    </h-row>
                    <h-row class-name="common-handle-padding">
                        <h-col span="23">
                            <span>原始文本:</span>
                            <hr class="audit-common-padding" />
                        </h-col>
                    </h-row>
                    <h-row class-name="common-handle-padding">
                        <h-col span="23">
                            <div
                                class="h-input-wrapper"
                                aria-placeholder="原始文本"
                                style="width: 100%;">
                                <div id="audit-labels-statistics-operate-view-text"></div>
                            </div>
                        </h-col>
                    </h-row>
                </h-col>
                <h-col span="12">
                    <h-row class-name="common-handle-padding">
                        <h-col span="24">
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
                            <!-- <h-row class-name="common-handle-padding" v-if="isShowBidTable">
                                <h-col span="4">
                                    重名标签列表
                                </h-col>
                            </h-row>
                            <h-row class-name="common-handle-padding" v-if="isShowBidTable">
                                <h-col span="24">
                                    <section>
                                        <h-row class-name="bid-table-header">
                                            <h-col span="6" class-name="audit-bid-lable">
                                                <span class="audit-common-bid-lable">标签名称</span>
                                            </h-col>
                                            <h-col span="6" class-name="audit-bid-lable">
                                                <span class="audit-common-bid-lable">权重值</span>
                                            </h-col>
                                            <h-col span="6" class-name="audit-bid-lable">
                                                <span class="audit-common-bid-lable">标签分类</span>
                                            </h-col>
                                            <h-col span="6" class-name="audit-bid-lable">
                                                <span class="audit-common-bid-lable">BID</span>
                                            </h-col>
                                        </h-row>
                                        <h-row class-name="bid-table-content" v-if="!isBidTagsEmpty">
                                            <h-col span="24">
                                                <div v-for="(obj, index) in bidHandleTableDatas" :key="index">
                                                    <h-col span="6" class-name="bid-table-rows">
                                                        <span class="audit-common-bid-lable">{{obj.tagName}}</span>
                                                    </h-col>
                                                    <h-col span="6" class-name="bid-table-rows">
                                                        <span class="audit-common-bid-lable">{{obj.bidLabelWeight}}</span>
                                                    </h-col>
                                                    <h-col span="6" class-name="bid-table-row">
                                                        <span class="audit-common-bid-lable">{{obj.tagCategory}}</span>
                                                    </h-col>
                                                    <h-col span="6" class-name="bid-table-row">
                                                        <span class="audit-common-bid-lable"></span>
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
                            </h-row> -->
                        </h-col>
                    </h-row>
                </h-col>
            </h-row>
        </div>
        <!-- :loading="isPageDataLoaded" -->
        <h-row style="width: 80vw; height: 80vh;">
            <Spin fix v-if="isPageDataLoaded">
                <h-icon name="load-c" :size=18 class="h-load-loop"></h-icon>
                <div>加载中...</div>
            </Spin>
        </h-row>
    </section>
</template>


<script>
    /**
     *
     * @author xiagq
     * @copyright gildata
     *
     * @created 2019.03.08
     * @modified 2019.03.08
     *
     * @description 查看打标 operate-view & LabelsStatisticsOperateView
     * @augments
     * @example
     *
     */
    import {
        TODAY,
        // UQSTO,
        // getPosition,
        // positionMenu,
        TODAY_Begin,
        TODAY_End,
        TODAY_TimeStamp,
    } from "@/utils/utils";
    export default {
        // name: "AuditNewsLabels-statisticsOperate-view",
        data () {
            return {
                isPageDataLoaded: true,
                asyncButtonLoading: false,
                commonHandle: {
                    newsTitle: "",
                    newsContent: "",
                    tags: [],
                },
                tableFixedHeight: 300,
                commonHandleTableCols: [
                    // {
                    //     type: "selection",
                    //     width: 60,
                    //     align: "center",
                    // },
                    {
                        key: "index",
                        title: "序号",
                        width: 60,
                        align: "center",
                    },
                    {
                        key: "labelName",
                        title: "标签名称",
                        // sortable: true,
                        // width: 200,
                        align: "center",
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
                        // width: 200,
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
                        key: "labelCategory",
                        title: "标签分类",
                        // width: 80,
                        align: "center",
                    },
                ],
                commonHandleTableDatas: [],
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
            };
        },
        methods: {
            // 查看打标
            getTagsById(newsId = ``, debug = false){
                let url = "/tm/getIdentifiedTagsInfo";
                if (newsId) {
                    url = `/tm/getIdentifiedTagsInfo?newsId=${newsId}`;
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
                        console.log(`查看打标 json =`, JSON.stringify(json, null, 4));
                        this.isPageDataLoaded = true;
                        this.$hMessage.error(msg);
                        return;
                    } else {
                        this.isPageDataLoaded = false;
                        let {
                            tags: listDatas,
                            newsTitle,
                            newsContent: textArea,
                        } = body;
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
                            let text = document.querySelector(`#audit-labels-statistics-operate-view-text`);
                            text.innerHTML = "";
                            text.insertAdjacentHTML(`beforeend`, newText);
                        }, 0);
                        // this.initTableDatas = listDatas;
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
                                    } = obj;
                                    if (!labelWeight) {
                                        labelWeight = "";
                                    } else {
                                        labelWeight = labelWeight;
                                        // labelWeight = parseFloat(labelWeight).toFixed(3);
                                    }
                                    let tagCategory = " ";
                                    if (tagCategories) {
                                        tagCategory = tagCategories[1];
                                        if (tagCategories[1] === "机构") {
                                            tagCategory = tagCategories[2] || "";
                                        }
                                    }
                                    return {
                                        index: i + 1,
                                        newsId,
                                        labelName,
                                        labelCode,
                                        labelCategory: tagCategory,
                                        labelAlias,
                                        labelWeight,
                                    };
                                }
                            );
                        } else {
                            listDatas = [];
                        }
                        this.commonHandle = {
                            newsTitle,
                            newsContent: textArea,
                        };
                        this.commonHandleTableDatas = listDatas;
                    }
                }).catch(err => console.error(`查看打标 error`, err));
            },
            getWindowMaxWidth() {
                let maxWidth = window.screen.width || 1366;
                if (maxWidth < 1920) {
                    this.pagination.size = 12;
                } else {
                    this.pagination.size = 21;
                }
            },
            getSkipUID() {
                let uid = window.parent.location.hash.replace(`#`, ``) || ``;
                return uid;
            },
            getViewInfos() {
                let newsId = this.getSkipUID();
                if (newsId) {
                    this.getTagsById(newsId);
                } else {
                    this.$hMessage.info(`newsId 不可为空!`);
                }
            },
            // init
            init () {
                this.getWindowMaxWidth();
                // let {
                //     current,
                //     size,
                // } = this.pagination;
                this.getViewInfos();
            },
        },
        mounted() {
            this.init();
        },
        activated() {
            // console.log(`keep-alive 组件激活时调用`);
            // this.onClickButton(`search`);
            this.getViewInfos();
        },
    };
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
</style>

<style lang="scss">
    /* global css & overwrite h_ui css */
    .common-handle-status > input.h-input-disabled,
    .common-handle-status > textarea.h-input-disabled{
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
    #audit-labels-statistics-operate-view-text,
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
    #audit-labels-statistics-operate-view-text,
    #audit-common-handle-modal-text {
        min-height: 300px;
        max-height: 600px;
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
    .audit-sensitives-highlight-color{
        color: #f00;
        /* background-color: #ff0; */
        padding: 0 3px;
        font-weight: bold;
        font-size: 13px;
    }
</style>
