<template>
    <section>
        <div class="audit-common-header">
            <Collapse
                v-model="collapse"
                @on-change="onPanelChange">
                <Panel name="1">
                    二维码
                    <p slot="content">
                        <h-row class-name="common-handle-padding">
                            <!-- <h-col span="8" push="1">
                                <template v-if="!isEmptyURL">
                                    <div style="margin: 5px;">
                                        <qrcode-vue
                                            :value="url"
                                            :size="size"
                                            :foreground="fgColor"
                                            :background="bgColor"
                                            className="styleOfQRCode"
                                            level="L">
                                        </qrcode-vue>
                                    </div>
                                </template>
                            </h-col> -->
                            <h-col span="8" push="1">
                                <template v-if="!isEmptyURL">
                                    <div style="margin: 5px;">
                                        <canvas
                                            id="qrcode_canvas"
                                            width="100"
                                            height="100"
                                            style="height: 100px; width: 100px;"
                                            >
                                        </canvas>
                                    </div>
                                </template>
                            </h-col>
                            <!-- <h-col span="23" push="1">
                                <div style="margin: 5px;">
                                    <a
                                        :href="url"
                                        @click="autoOpenAlink"
                                        target="_blank"
                                        style="color: #298DFF;"
                                        >
                                        {{url}}
                                    </a>
                                </div>
                            </h-col> -->
                        </h-row>
                    </p>
                </Panel>
                <Panel name="2">
                    iframe 审核
                    <p slot="content">
                        <h-row class-name="common-handle-padding">
                            <h-col span="8" push="1">
                                <span>iframe 审核</span><br/>
                                <RadioGroup
                                    v-model="options.iframe"
                                    @on-change="onRadioChecked(`iframe`)">
                                    <Radio label="true">
                                        <Icon type="logo-apple"></Icon>
                                        <span>iframe 正常打开</span>
                                    </Radio>
                                    <Radio label="false">
                                        <Icon type="logo-android"></Icon>
                                        <span>iframe 打不开</span>
                                    </Radio>
                                </RadioGroup>
                            </h-col>
                        </h-row>
                    </p>
                </Panel>
                <Panel name="3">
                    手机端审核
                    <p slot="content">
                        <h-row class-name="common-handle-padding">
                            <h-col span="8" push="1">
                                <span>手机端审核</span><br/>
                                <!-- <RadioGroup
                                    v-model="options.androidOrIos"
                                    @on-change="onRadioChecked(`androidOrIos`)">
                                    <Radio label="true">
                                        <Icon type="logo-apple"></Icon>
                                        <span>安卓或iOS 支持</span>
                                    </Radio>
                                    <Radio label="false">
                                        <Icon type="logo-android"></Icon>
                                        <span>安卓或iOS 不支持</span>
                                    </Radio>
                                </RadioGroup>
                                <br /> -->
                                <RadioGroup
                                    v-model="options.adapterPhone"
                                    @on-change="onRadioChecked(`adapterPhone`)">
                                    <Radio label="true">
                                        <Icon type="logo-apple"></Icon>
                                        <span>手机端适配</span>
                                    </Radio>
                                    <Radio label="false">
                                        <Icon type="logo-android"></Icon>
                                        <span>手机端不适配</span>
                                    </Radio>
                                </RadioGroup>
                            </h-col>
                        </h-row>
                    </p>
                </Panel>
            </Collapse>
        </div>
        <template>
            <!-- <h-row class-name="common-handle-padding" v-if="isPhonePassed && isIframePassed"> -->
            <!-- :disabled="!isPhonePassed || !isIframePassed" -->
            <!-- :disabled="false" -->
            <h-row class-name="common-handle-padding">
                <h-col span="4" push="1" style="margin-top: 20px;">
                    <span class="audit-common-lable-placeholder"></span>
                     <h-tooltip
                        v-if="!isIframePassed"
                        style="width: auto; margin-left: 30px;"
                        placement="top"
                        content="请选择确认iframe 是否能打开!">
                        <h-button
                            type="primary"
                            data-ref="init-btn"
                            :disabled="!isIframePassed"
                            @click="onSave">
                            保存
                        </h-button>
                     </h-tooltip>
                     <h-button
                        v-if="isIframePassed"
                        type="primary"
                        data-ref="init-btn"
                        :disabled="!isIframePassed"
                        @click="onSave">
                        保存
                    </h-button>
                </h-col>
            </h-row>
        </template>
    </section>
</template>

<script>
    /**
     *
     * @author xiagq
     * @copyright gildata
     *
     * @created 2019.04.16
     * @modified 2019.04.22
     *
     * @description InformationSourceAudit
     * @augments
     * @example
     *
     */
    // import QrcodeVue from "qrcode.vue";
    import QRCode from "qrcode";
    export default {
        // name: "information-source-audit-handle",
        data () {
            return {
                collapse: "0",
                isEmptyURL: true,
                isIframePassed: false,
                isPhonePassed: false,
                url: "",
                size: 100,
                fgColor: "#000",
                bgColor: "#fff",
                options: {
                    id: "",
                    iframe: "",
                    adapterPhone: "",
                    androidOrIos: "",
                },
                isOnce: true,
            };
        },
        methods: {
            autoOpenAlink(e) {
                e.preventDefault();
                let url = this.url;
                window.open(url, "iframe 测试页面");
            },
            returnParentPage () {
                let path = `/audit/news/information-source-audit/operate-handle/operate-handle`;
                this.$store.commit("DEL_TAB", path);
                this.$router.push(`/audit/news/information-source-audit/`);
            },
            onPanelChange(key = ``) {
                let value = this.collapse;
            },
            autoExpendPanels() {
                let panels = [...document.querySelectorAll(`.h-collapse-header`)];
                if (panels.length) {
                    panels.forEach(panel => panel.click())
                }
            },
            onRadioChecked(type=``) {
                let value = this.options[type];
                if (type === "iframe") {
                    if (value) {
                        this.isIframePassed = true;
                    } else {
                        this.isIframePassed = false;
                    }
                }
                if (type === "adapterPhone" || type === "androidOrIos") {
                    if (value) {
                        this.isPhonePassed = true;
                    } else {
                        this.isPhonePassed = false;
                    }
                }
            },
            stringToBoolean(value = ``) {
                let result = false;
                if (value === true.toString()) {
                    result = true;
                }
                return result;
            },
            onSave() {
                let {
                    id,
                    iframe,
                    androidOrIos,
                    adapterPhone,
                } = this.options;
                if (iframe.length) {
                    iframe = this.stringToBoolean(iframe);
                }
                if (androidOrIos.length) {
                    androidOrIos = this.stringToBoolean(androidOrIos);
                }
                if (adapterPhone.length) {
                    adapterPhone = this.stringToBoolean(adapterPhone);
                }
                let options = {
                    id,
                    iframe,
                    // androidOrIos,
                    adapterPhone,
                };
                this.updateNewsSource(options);
            },
            // 审核
            updateNewsSource(options = {}) {
                let url = `/tm/modifyNewsSourceSign`;
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
                        this.$hMessage.error(msg);
                        return;
                    } else {
                        this.$hMessage.success(`审核成功!`);
                    }
                }).catch(err => console.error(`updateNewsSource error`, err));
            },
            init() {
                let options = JSON.parse(window.sessionStorage.getItem(`information-source-audit_route_query_handle`));
                let {
                    url,
                    id,
                } = options;
                this.options.id = id;
                if (!url.length) {
                    url = window.parent.location.origin + `/404`;
                    this.isEmptyURL = true;
                } else {
                    this.isEmptyURL = false;
                }
                let IP = `http://47.97.241.6:8080`;
                this.url = `${IP}/eapp/iframeTest/index.html#${url}`;
                setTimeout(() => {
                    let canvas = document.getElementById("qrcode_canvas");
                    let url = this.url;
                    QRCode.toCanvas(
                        canvas,
                        url,
                        {
                            width: 120,
                            errorCorrectionLevel: "L",
                            // errorCorrectionLevel: "M",// default
                            // errorCorrectionLevel: "Q",
                            // errorCorrectionLevel: "H",
                        },
                        function (err) {
                            if (err) {
                                console.error(`qrcode error =`, err);
                            }
                        }
                    );
                }, 0);
            },
        },
        // components: {
        //     QrcodeVue,
        // },
        mounted() {
            this.init();
            setTimeout(() => {
                this.autoExpendPanels();
            }, 500);
        },
        activated() {
            // console.log(`keep-alive 组件激活时调用`);
        },
    }
</script>

<style lang="scss" scoped>
    .styleOfQRCode{
        box-sizing: border-box;
        border-radius: 5px;
        width: 102px;
        height: 102px;
    }
    .common-handle-padding {
        padding-top: 5px;
    }
</style>

