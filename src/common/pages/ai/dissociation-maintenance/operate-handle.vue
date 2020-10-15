<template>
    <section>
        <section>
            <span class="audit-common-lable-long">待消歧词</span>
            <h-input
                aria-placeholder="待消歧词"
                placeholder="请输入待消歧词"
                style="width: 150px"
                v-model="filterObj.dissociationWord"
                @on-change="onChangeInput(`dissociationWord`)"
                @on-enter="onChangeInputEnter(`dissociationWord`)"
                ref="dissociationWord"
                @on-click="shitClearableClick(`dissociationWord`)"
                :clearable="true"
                icon="android-close">
            </h-input>
            <hr data-space="hr">
            <span class="audit-common-lable-long">范围</span>
            <h-select
                aria-placeholder="公开标志"
                placeholder="请选择公开标志"
                style="width: 150px"
                v-model="filterObj.eliminateScope"
                @on-change="onChangeSelect(`eliminateScope`)"
                filterable
                :clearable="false">
                <h-option
                    v-for="(item, i) in eliminateScopes"
                    :value="item.value"
                    :key="i">
                    {{item.title}}
                </h-option>
            </h-select>
            <hr data-space="hr">
            <span class="audit-common-lable-long">指示词</span>
            <hr data-space="hr">
            <div data-dom="drawer">
                <h-collapse v-model="activePanel">
                    <h-panel name="1">
                        <span class="audit-common-lable-long-title">指示词</span>
                        <section slot="content">
                            <h-tag
                                v-for="(item, index) of tags"
                                :key="item"
                                :name="item"
                                :color="colors[index % 4]"
                                type="dot"
                                closable
                                @on-close="handleCloseTag(index)">
                                {{item}}
                            </h-tag>
                            <!-- <h-tag
                                key="1234567"
                                name="添加指示词"
                                color="#0f0"
                                type="dot"
                                :closable="false">
                                <h-button
                                    type="dashed"
                                    icon="add"
                                    size="small"
                                    ref="add-indictor-btn"
                                    data-ref="add-indictor-btn"
                                    class="h-tag-dot hui-btn-dashed-hover-none"
                                    @click="addIndictorButton">
                                    添加指示词
                                </h-button>
                            </h-tag> -->
                            <h-button
                                type="dashed"
                                icon="add"
                                ref="add-indictor-btn"
                                data-ref="add-indictor-btn"
                                class="hui-btn-dashed-hover"
                                @click="addIndictorButton">
                                添加指示词
                            </h-button>
                        </section>
                    </h-panel>
                </h-collapse>
            </div>
            <div data-dom="clearfix"></div>
            <hr data-space="hr">
            <h-row class-name="common-handle-padding" style="margin: 10px 70px;">
                <h-col span="6">
                    <h-button
                        type="primary"
                        icon="plus"
                        size="small"
                        data-ref="add-indictor-btn"
                        @click="addLabelButton">
                        添加标签
                    </h-button>
                <h-col span="6">
                </h-col>
                    <h-button
                        type="primary"
                        icon="t-b-return"
                        size="small"
                        data-ref="add-indictor-btn"
                        @click="addReverseLabelButton">
                        添加反向标签
                    </h-button>
                </h-col>
            </h-row>
            <hr data-space="hr">
            <h-row class-name="common-handle-padding" style="margin: 10px 70px;">
                <h-col span="12">
                    <div v-if="isShowLabelInfos">
                        <span data-style="table-span">{{addObj.businessId}}</span>
                        <span data-style="table-span">{{addObj.tagName}}</span>
                        <span data-style="table-span">{{addObj.tagCategory.join(`, `)}}</span>
                    </div>
                </h-col>
            </h-row>
            <hr data-space="hr">
            <h-row class-name="common-handle-padding">
                <h-col span="8" push="8">
                    <h-button
                        type="primary"
                        data-ref="save-btn"
                        :disabled="isEmptyDissociationWord"
                        @click="saveButton">
                        保存消歧规则
                    </h-button>
                </h-col>
            </h-row>
        </section>
        <!-- modals -->
        <h-msgBox
            title="指示词"
            @on-ok="reSureAddIndicator"
            v-model="addIndicatorModal.showModal"
            :loading="addIndicatorModal.modalLoading">
            <span class="audit-common-lable-long">指示词</span>
            <h-input
                aria-placeholder="消歧规则描述"
                placeholder="请输入要新建的指示词"
                style="width: 250px"
                v-model="filterObj.indicatorTag"
                @on-change="onInputChange(`indicatorTag`)"
                @on-enter="onInputChangeEnter(`indicatorTag`)"
                ref="indicatorTag"
                @on-click="onInputClearable(`indicatorTag`)"
                :clearable="true"
                icon="android-close">
            </h-input>
            <div slot="footer">
                <h-button
                    @click="reSureAddIndicatorCancel">
                    取消
                </h-button>
                <h-tooltip
                    v-if="isEmptyIndicatorTag"
                    style="width: auto; clear: both;"
                    placement="top"
                    content="请输入新建的指示词!">
                    <h-button
                        type="primary"
                        :disabled="isEmptyIndicatorTag"
                        @click="reSureAddIndicator">
                        确认
                    </h-button>
                </h-tooltip>
                <h-button
                    v-else
                    type="primary"
                    :disabled="isEmptyIndicatorTag"
                    @click="reSureAddIndicator">
                    确认
                </h-button>
            </div>
        </h-msgBox>
        <!-- delete -->
        <h-msgBox
            title="删除指示词"
            @on-ok="reSureDeleteIndicator"
            v-model="deleteIndicatorModal.showModal"
            :loading="deleteIndicatorModal.modalLoading">
            <span class="audit-common-lable-long">确定删除</span>
            <span style="color: #298DFF;">{{deleteIndicatorLabel}}</span>
            <div slot="footer">
                <h-button
                    @click="reSureDeleteIndicatorCancel">
                    取消
                </h-button>
                <h-button
                    type="primary"
                    @click="reSureDeleteIndicator">
                    确认
                </h-button>
            </div>
        </h-msgBox>
        <!-- table -->
        <h-msgBox
            title="添加标签"
            @on-ok="reSureAdd"
            v-model="addLabelModal.showModal"
            :loading="addLabelModal.modalLoading"
            top="50"
            width="800"
            footerHide>
            <h-row class-name="common-handle-padding">
                <h-col span="24">
                    <h-row class-name="common-handle-padding">
                        <h-col span="4" offset="0" style="padding-left: 10px;">
                            标签名称列表:
                        </h-col>
                    </h-row>
                    <h-row class-name="common-handle-padding">
                        <h-col span="24" offset="0" style="padding-left: 10px;">
                            <h-table
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
            <div slot="footer">
                <h-button
                    @click="reSureAddCancel">
                    取消
                </h-button>
                <h-button
                    type="primary"
                    :disabled="isEmptyIndicatorTag"
                    @click="reSureAdd">
                    确认
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
     * @created 2019.03.04
     * @modified 2019.04.04
     *
     * @description 消歧维护列表-编辑
     * @augments
     * @example
     *
     */
    import {
        TODAY,
    } from "@/utils/utils";
    export default {
        // name: "AuditNewsDissociation-maintenance-handle",
        data () {
            return {
                deleteIndex: "",
                deleteIndicatorLabel: "",
                deleteIndicatorModal: {
                    showModal: false,
                    modalLoading: true,
                    maximize: true,
                    scrollable: true,
                    transfer: false,
                    title: "",
                },
                isEmptyDissociationWord: false,
                initObj: {},
                tags: [],
                tagName: "",
                activePanel: "1",
                activeTab: 0,
                colors: [
                    "blue",
                    "green",
                    "red",
                    "yellow",
                ],
                eliminateScopes: [
                    {
                        title: "句子范围",
                        value: 0,
                    },
                    {
                        title: "段落范围",
                        value: 1,
                    },
                    {
                        title: "全文范围",
                        value: 2,
                    },
                ],
                filterObj: {
                    dissociationWord: "",
                    eliminateWord: "",
                    eliminateScope: 2,
                    // indicatorTag: "",
                    weights: "",
                    tagType: 1,// 2
                    id: "",
                },
                // isShowLabelInfos: true,
                isShowLabelInfos: false,
                addObj: {
                    businessId: "",
                    tagCategory: "",
                    tagName: "",
                },
                addIndicatorModal: {
                    showModal: false,
                    modalLoading: true,
                    maximize: true,
                    scrollable: true,
                    transfer: false,
                    title: "",
                },
                isEmptyIndicatorTag: true,
                addLabelModal: {
                    showModal: false,
                    modalLoading: true,
                    maximize: true,
                    scrollable: true,
                    transfer: false,
                    title: "",
                },
                pagination: {
                    current: 1,
                    size: 12,
                    total: 0,
                    pages: 0,
                },
                commonFiltersPagination: {
                    current: 1,
                    size: 12,
                    total: 0,
                    pages: 0,
                },
                modalTableFixedHeight: 370,
                autoMaxModalWidth: 500,
                tableLoading: false,
                commonHandleModalTableDatas: [],
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
                        key: "labelId",
                        title: "标签 ID",
                        width: 150,
                        align: "center",
                    },
                    {
                        key: "labelName",
                        title: "标签名称",
                        // sortable: true,
                        width: 150,
                        align: "center",
                    },
                    {
                        key: "labelRelations",
                        title: "关联信息",
                        // sortable: true,
                        width: 200,
                        align: "center",
                    },
                    {
                        key: "labelCategory",
                        title: "标签分类",
                        // width: 80,
                        align: "center",
                        render: (h, params) => {
                            let {
                                labelCategory: labelCategories,
                                // labelCategory: labelCategory.join(`, `),
                            } = params.row;
                            let labelCategory = " ";
                            // if (labelCategories) {
                            //     // labelCategory = labelCategories[1];
                            //     // if (labelCategories[1] === "机构") {
                            //     //     labelCategory = labelCategories[2] || "";
                            //     // }
                            //     labelCategory = labelCategories.slice(1).toString();
                            // }
                            labelCategory = labelCategories.join(`, `);
                            return h("div", {
                                    attrs: {
                                        "title": `${labelCategory}`,
                                        "data-title": `${labelCategory}`,
                                    },
                                },
                                [
                                    h("span", {
                                        // attrs: {
                                        //     disabled: true,
                                        //     "aria-placeholder": "标签名称",
                                        //     placeholder: "请输入标签名称",
                                        // },
                                        on: {
                                            // click: this.clickHandler,
                                        },
                                    }, labelCategory),
                                ]
                            );
                        },
                    },
                    {
                        key: "operation",
                        title: "操作",
                        width: 80,
                        align: "center",
                        // fixed: "right",
                        render: (h, params) => {
                            let {
                                labelId,
                                labelName,
                                labelCategory,
                            } = params.row;
                            return h("div", [
                                h("a", {
                                    // attrs: {
                                    //     "data-type": type,
                                    // },
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
                                        click: () => {
                                            // add
                                            this.addObj = {
                                                businessId: labelId,
                                                tagCategory: labelCategory,
                                                tagName: labelName,
                                            };
                                            this.reSureAddCancel();
                                            if (labelId) {
                                                this.isShowLabelInfos = true;
                                            } else {
                                                // this.isShowLabelInfos = false;
                                            }
                                            // this.clickShowAddModal();
                                        },
                                    }
                                }, "添加"),
                            ]);
                        },
                    },
                ],
            }
        },
        methods: {
            returnParentPage () {
                let path = `/audit/news/dissociation-maintenance/operate-handle`;
                this.$store.commit("DEL_TAB", path);
                // re-direct
                this.$router.push(`/audit/news/dissociation-maintenance`);
            },
            //pagination
            getSearchLabels (options = {}) {
                let {
                    current,
                    size,
                    tagName,
                } = options;
                let url = `/tm/queryTagTermPage?tagName=${tagName}&size=${size}&current=${current}`;
                this.tableLoading = true;
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
                        console.log(`labels 列表 json =`, JSON.stringify(json, null, 4));
                        // this.$hMessage.error(msg);
                        // this.initTableDatas = [];
                        this.commonHandleModalTableDatas = [];
                        this.tableLoading = false;
                        return;
                    } else {
                        let {
                            flag,
                            total_num: total,
                            tag_objects,
                        } = body;
                        if (total) {
                            this.pagination.total = total;
                        } else {
                            this.pagination.total = 0;
                        }
                        if (tag_objects.length) {
                            let commonHandleModalTableDatas = [];
                            tag_objects.forEach(
                                (obj, i) => {
                                    let {
                                        other_obj: {
                                            business_id: labelId,
                                        },
                                        tag_value: labelName,
                                        tag_categorys: labelCategory,
                                        relationInfo: labelRelations,
                                    } = obj;
                                    commonHandleModalTableDatas.push({
                                        labelId,
                                        labelName,
                                        labelCategory,
                                        labelRelations,
                                    });
                                }
                            );
                            this.commonHandleModalTableDatas = commonHandleModalTableDatas;
                        } else {
                            this.commonHandleModalTableDatas = [];
                        }
                        this.tableLoading = false;
                    }
                }).catch(err => console.error(`labels 列表 error`, err));

            },
            getNewTableDatas (pagination = {}) {
                let tagName = this.filterObj.dissociationWord;
                let {
                    current,
                    size,
                } = pagination;
                let options = {
                    current,
                    size,
                    tagName,
                };
                this.getSearchLabels(options);
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
            // pagination
            showDeleteIndicatorModal() {
                this.deleteIndicatorModal.showModal = true;
            },
            hiddenDeleteIndicatorModal() {
                this.deleteIndicatorModal.showModal = false;
            },
            reSureDeleteIndicator() {
                let index = this.deleteIndex;
                this.tags.splice(index, 1);
                setTimeout(() => {
                    this.hiddenDeleteIndicatorModal();
                }, 0);
            },
            reSureDeleteIndicatorCancel() {
                this.hiddenDeleteIndicatorModal();
            },
            showAddIndicatorModal() {
                this.addIndicatorModal.showModal = true;
                // this.addIndicatorModal.modalLoading = false;
                setTimeout(() => {
                    this.$refs["indicatorTag"].focus();
                }, 0);
            },
            hiddenAddIndicatorModal() {
                this.addIndicatorModal.showModal = false;
                // this.addIndicatorModal.modalLoading = false;
            },
            reSureAddIndicatorCancel() {
                // clear & init
                this.filterObj["indicatorTag"] = ``;
                this.isEmptyIndicatorTag = true;
                this.hiddenAddIndicatorModal();
            },
            reSureAddIndicator() {
                // clear & init
                let value = this.filterObj["indicatorTag"];
                let oldTags = [...this.tags];
                if (!oldTags.includes(value)) {
                    this.tags.push(value);
                    setTimeout(() => {
                        this.reSureAddIndicatorCancel();
                        this.$hMessage.success(`添加指示词成功!`);
                    }, 0);
                } else {
                    setTimeout(() => {
                        this.reSureAddIndicatorCancel();
                        this.$hMessage.info(`添加的指示词不可重复!`);
                    }, 0);
                }
            },
            showAddLabelModal() {
                this.addLabelModal.showModal = true;
                // this.addLabelModal.modalLoading = false;
                setTimeout(() => {
                    // let tagName = this.tagName;
                    let tagName = this.filterObj.dissociationWord;
                    // init
                    this.pagination.current = 1;
                    this.getSearchLabels({
                        current: 1,
                        size: 10,
                        tagName,
                    });
                    // this.$refs["indicatorTag"].focus();
                }, 0);
            },
            hiddenAddLabelModal() {
                this.addLabelModal.showModal = false;
                // this.addLabelModal.modalLoading = false;
            },
            reSureAddCancel() {
                // clear & init
                // this.filterObj["indicatorTag"] = ``;
                // this.isEmptyIndicatorTag = true;
                this.hiddenAddLabelModal();
            },
            reSureAdd() {
                // clear & init
                // let value = this.filterObj["indicatorTag"];
                // let oldTags = [...this.tags];
                // if (!oldTags.includes(value)) {
                //     this.tags.push(value);
                //     setTimeout(() => {
                //         this.reSureAddCancel();
                //         this.$hMessage.success(`添加指示词成功!`);
                //     }, 0);
                // } else {
                //     setTimeout(() => {
                //         this.reSureAddCancel();
                //         this.$hMessage.info(`添加的指示词不可重复!`);
                //     }, 0);
                // }
            },
            onInputChange(type = ``) {
                if (type.length) {
                    let value = this.filterObj[type];
                    if (value.toString().trim().length) {
                        this.isEmptyIndicatorTag = false;
                        this.filterObj[type] = value.toString().trim();
                    } else {
                        this.isEmptyIndicatorTag = true;
                    }
                }
            },
            onInputChangeEnter(type = ``) {
                // if (type.length) {
                //     let value = this.filterObj[type];
                //     if (value.toString().trim().length) {
                //         this.isEmptyIndicatorTag = false;
                //         this.filterObj[type] = value.toString().trim();
                //     } else {
                //         this.isEmptyIndicatorTag = true;
                //     }
                // }
                this.reSureAddIndicator();
            },
            onInputClearable(type = ``) {
                if (type.length) {
                    this.filterObj[type] = "";
                    this.isEmptyIndicatorTag = true;
                }
            },
            onChangeSelect(type = ``) {
                let value = this.filterObj[type];
                // console.log(`type =`, type)
                // console.log(`value =`, value, typeof(value))
                // this.$hMessage.info(value);
                // this.$hMessage.info(value.toString());
            },
            onChangeInput(type = ``) {
                if (type.length && type === "dissociationWord") {
                    let value = this.filterObj[type];
                    this.filterObj[type] = value.toString().trim();
                    if (value.toString().trim().length) {
                        this.isEmptyDissociationWord = false;
                    } else {
                        this.isEmptyDissociationWord = true;
                    }
                }
            },
            onChangeInputEnter(type = ``) {
                if (type.length) {
                    let value = this.filterObj[type];
                    this.filterObj[type] = value.toString().trim();
                    if (value.toString().trim().length) {
                        this.isEmptyDissociationWord = false;
                    } else {
                        this.isEmptyDissociationWord = true;
                    }
                }
            },
            shitClearableClick(type = ``) {
                if (type.length) {
                    // let value = this.filterObj[type];
                    // this.filterObj[type] = value;
                    this.filterObj[type] = "";
                    this.isEmptyDissociationWord = true;
                }
            },
            handleCloseTag (index) {
                // 二次弹窗
                this.showDeleteIndicatorModal();
                this.deleteIndex = index;
                this.deleteIndicatorLabel = this.tags[index];
            },
            addIndictorButton () {
                this.showAddIndicatorModal();
            },
            addLabelButton () {
                this.filterObj.tagType = 1;
                this.showAddLabelModal();
                // setTimeout(() => {
                //     this.$refs["addLableTag"].click();
                // }, 0);
            },
            addReverseLabelButton () {
                this.filterObj.tagType = 0;
                // this.filterObj.tagType = 2;
                this.showAddLabelModal();
            },
            saveButton() {
                // debugger;
                let {
                    eliminateScope,
                    dissociationWord: eliminateWord,
                    id,
                    tagType,
                    weights,
                } = this.filterObj;
                let indicator = this.tags || [];
                let {
                    businessId,
                    tagCategory,
                    tagName,
                } = this.addObj;
                let options = {
                    eliminateScope,
                    eliminateWord,
                    id,
                    tagType,
                    weights,
                    indicator,
                    businessId,
                    tagName,
                    tagCategory,
                };
                // console.log(`options =`, JSON.stringify(options, null, 4));
                let url = `/tm/updateEliminateAmbiguity`;
                this.tableLoading = true;
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
                        // console.log(`更新 json =`, JSON.stringify(json, null, 4));
                        this.$hMessage.error(msg);
                        this.tableLoading = false;
                        return;
                    } else {
                        this.$hMessage.success(`更新消岐词成功!`);
                        this.tableLoading = false;
                        setTimeout(() => {
                            this.returnParentPage();
                        }, 0);
                    }
                }).catch(err => console.error(`更新 error`, err));
            },
            init() {
                let passedObj = JSON.parse(window.sessionStorage.getItem(`dissociation-maintenance_trueObj_handle`));
                // console.log(`passedObj =`, JSON.stringify(passedObj, null, 4));
                // debugger;
                if (passedObj && Object.keys(passedObj).length) {
                    this.initObj = passedObj || {};
                    this.tags = passedObj.indicator || [];
                    // this.filterObj.indicatorTag = passedObj.indicator || [];
                    // this.filterObj.tagName = passedObj.tagName || "";
                    this.filterObj.dissociationWord = passedObj.eliminateWord || "";
                    // this.filterObj.eliminateWord = passedObj.eliminateWord || "";
                    this.filterObj.eliminateScope = passedObj.eliminateScope || 0;
                    this.filterObj.id = passedObj.id || "";
                    // this.filterObj.businessId = passedObj.businessId || "";
                    this.filterObj.weights = passedObj.weights || "";
                    // this.tagName = passedObj.tagName || "";
                    this.addObj.businessId = passedObj.businessId || "";
                    this.addObj.tagCategory = passedObj.tagCategory || [];
                    if (Array.isArray(passedObj.tagCategory)) {
                        this.isShowLabelInfos = true;
                    }
                    this.addObj.tagName = passedObj.tagName || "";
                }
                // console.log(`this.filterObj =`, JSON.stringify(this.filterObj, null, 4));
            },
        },
        mounted() {
            this.init();
            setTimeout(() => {
                let autofocusBtn = document.querySelector(`[data-ref="add-indictor-btn"]`);
                if (autofocusBtn) {
                    // console.log(`autofocusBtn =`, autofocusBtn);
                    autofocusBtn.setAttribute(`autofocus`, true);
                }
                // this.$refs["add-indictor-btn"].setAtrribute(`autofocus`, true);
                // this.$refs["add-indictor-btn"].focus();
            }, 1000);
        },
        activated() {
            // console.log(`keep-alive 组件激活时调用`);
            // if (this.isAutoRefreshTable) {
            //     // this.onClickButton(`search`);
            // } else {
            //     // no need!
            // }
        },
    }
</script>

<style lang="scss" scoped>
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
        text-align: right;
        &::after{
            display: inline-block;
            content: ":";
        }
    }
    .audit-common-lable-long-title{
        color: $default-color;
        display: inline-block;
        width: calc(100% - 75px) !important;
        text-align: left;
        &::after{
            display: inline-block;
            content: ":";
        }
    }
    .audit-common-lable-placeholder{
        @include common-lable($default-color);
    }
</style>


<style lang="scss">
[data-space="hr"] {
    margin: 5px;
    padding: 0;
    border: 0;
}
[data-dom="drawer"] {
    /* float: left; */
    margin-left: 75px;
}
/* clear-fixed */

[data-dom="clearfix"] {
    clear: both;
    content: " ";
    visibility: hidden;
    overflow: auto;
    display: table;
    height: 0;
    zoom: 1;
}
[data-dom="drawer"]::after {
    clear: both;
    content: " ";
    visibility: hidden;
    overflow: auto;
    display: table;
    height: 0;
    zoom: 1;
}

/* .h-btn:not([disabled]):hover {
    text-decoration: none;
}
.h-btn-dashed:hover {
    text-decoration: none;
    color: #0072f5;
    background-color: #fff;
    border-color: #0072f5;
} */
.hui-btn-dashed-hover {
    text-decoration: none;
    color: #0072f5;
    background-color: #fff;
    border-color: #0072f5;
    opacity: 0.7;
    margin-bottom: 25px;
}
.hui-btn-dashed-hover:hover {
    opacity: 1.0;
    transform: scale(1.1);
}
[data-style="table-span"] {
    background: #000;
    color: #fff;
    border: 1px solid #333;
    padding: 5px;
    border-radius: 3px;
}
</style>

