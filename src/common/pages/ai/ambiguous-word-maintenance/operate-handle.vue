<template>
    <section>
        <div class="audit-common-header">
            <h-row class-name="common-handle-padding">
                <h-col span="12"></h-col>
                <h-col span="12"></h-col>
            </h-row>
        </div>
        <div class="audit-common-content">
            <h-row class-name="common-handle-padding">
                <h-col span="12">
                    <h-row class-name="common-handle-padding">
                        <h-col span="24">
                            <span class="audit-common-lable common-handle-required">未登录词名称</span>
                            <h-input
                                aria-placeholder="未登录词名称"
                                placeholder="请输入要更新的未登录词名称"
                                style="width: 250px"
                                v-model="labelWord"
                                @on-change="onInputChange(`labelWord`)"
                                @on-enter="onInputEnter(`labelWord`)"
                                ref="labelWord"
                                @on-click="onInputClearable(`labelWord`)"
                                :clearable="true"
                                icon="android-close">
                            </h-input>
                            <hr class="audit-common-padding" />
                        </h-col>
                    </h-row>
                    <h-row class-name="common-handle-padding">
                        <h-col span="24">
                            <span class="audit-common-lable">未登录词 ID</span>
                            <h-input
                                aria-placeholder="未登录词 ID"
                                placeholder="请输入未登录词 ID!"
                                style="width: 250px"
                                v-model="wordId"
                                @on-change="onInputChange(`wordId`)"
                                @on-enter="onInputEnter(`wordId`)"
                                ref="wordId"
                                :clearable="false"
                                :disabled="true"
                                data-icon="android-close">
                            </h-input>
                            <hr class="audit-common-padding" />
                        </h-col>
                    </h-row>
                    <!-- <h-row class-name="common-handle-padding">
                        <h-col span="24">
                            <span class="audit-common-lable">资讯 ID</span>
                            <h-input
                                aria-placeholder="资讯 ID"
                                placeholder="请输入未登录词关联的资讯 ID!"
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
                        </h-col>
                    </h-row> -->
                    <h-row class-name="common-handle-padding">
                        <!-- <h-col span="10">
                            &nbsp;
                        </h-col> -->
                        <h-col span="4" offset="10">
                            <h-tooltip
                                v-if="isEmptyLabelWord"
                                style="width: auto"
                                placement="bottom"
                                content="请输入更新未登录词名称!">
                                <h-button
                                    type="primary"
                                    :disabled="isEmptyLabelWord"
                                    :loading="asyncButtonLoading"
                                    @click="reSureAdd">
                                    确认更新
                                </h-button>
                            </h-tooltip>
                            <h-button
                                v-else
                                type="primary"
                                :disabled="isEmptyLabelWord"
                                :loading="asyncButtonLoading"
                                @click="reSureAdd">
                                确认更新
                            </h-button>
                        </h-col>
                    </h-row>
                </h-col>
            </h-row>
        </div>
    </section>
</template>

<script>
    /**
     *
     * @author xiagq
     * @copyright gildata
     *
     * @created 2019.03.04
     * @modified 2019.02.04
     *
     * @description 未登录词处理 operateHandle
     * @augments
     * @example
     *
     */
    import {
        TODAY,
    } from "@/utils/utils";
    export default {
        data () {
            return {
                newsId: "",
                wordId: "",
                labelWord: "",
                isEmptyLabelWord: true,
                asyncButtonLoading: false,
            };
        },
        methods: {
            onInputChange (type = ``) {
                let value = this[type];
                this[type] = value.trim();
                if (type === `labelWord`) {
                    if (!value) {
                        this.$refs[type].focus();
                        this.isEmptyLabelWord = true;
                        this.$hMessage.info(`未登录词不可以为空!`);
                    } else {
                        this.isEmptyLabelWord = false;
                    }
                }
            },
            onInputEnter (type = ``) {
                let value = this[type];
                this[type] = value.trim();
                if (value) {
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
            reSureAdd() {
                this.asyncUpdateAmbiguousWord();
            },
            reSureAddCancel() {
                this.labelWord = "";
                this.newsId = ``;
            },
            // 更新未登录词
            asyncUpdateAmbiguousWord() {
                let url = `/tm/tag/modifyDiffMeaningsWord`;
                let word = this.labelWord || "";
                // let newsId = this.newsId || ``;
                let id = this.wordId || ``;
                this.asyncButtonLoading = true;
                this.$http
                .post(url, {
                    word,
                    // newsId,
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
                        // this.modalAdd.showModal = false;
                        this.$hMessage.error(msg);
                        return;
                    } else {
                        // this.modalAdd.showModal = false;
                        setTimeout(() => {
                            this.asyncButtonLoading = false;
                            this.$hMessage.success(`更新未登录词成功!`);
                        }, 500);
                    }
                }).catch(err => console.error(`更新未登录词  error`, err));;
            },
            init() {
                let flipObj = JSON.parse(window.sessionStorage.getItem(`ambiguous-word-maintenance_flipObj_handle`));
                if (Object.keys(flipObj).length) {
                    let {
                        ambiguousWordId,
                        ambiguousWordName,
                    } = flipObj;
                    this.wordId = ambiguousWordId || ``;
                    this.labelWord = ambiguousWordName || ``;
                } else {
                    this.$hMessage.info(`未读取到未登录词 ID!`);
                    setTimeout(() => {
                        this.$router.push(`/audit/news/ambiguous-word-maintenance`);
                    }, 500);
                }
            },
        },
        mounted() {
            this.init();
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


