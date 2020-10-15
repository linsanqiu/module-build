<template>
    <div class="page">
        <div class="file-analysis-form">
            <h-form ref="relationshipsPath" :model="relationshipsPath"  :rules="ruleInline" inline>
                <h-form-item prop="content">
                  <h-select-tree formatValue='id' v-model="relationshipsPath.content" :data="contentsTree" placement="bottom" placeholder="请选择文件目录" style="width:200px;" @on-select-change="contentChangeFun"></h-select-tree>
                </h-form-item>
                <h-form-item>
                    <h-button-group style="width:150px; margin-left:10px;">
                        <h-button type="primary" icon="refresh" @click="refreshFun"></h-button>
                        <h-button type="primary" icon="return" @click="previousFun"></h-button>
                        <h-button type="primary" icon="enter" @click="nextFun"></h-button>
                    </h-button-group>
                  </h-form-item>
                  <h-form-item prop="fileName">
                      <h-select style="width:200px;" clearable placeholder="请选择文件" v-model="relationshipsPath.fileName"  filterable @on-scroll="scroll" :isComputed="isComputed" noMoreText="加载完成">
                          <h-option v-for="(fileName, index) in fileNameList" :value="fileName" :key="index">{{fileName}}</h-option>
                      </h-select>
                  </h-form-item>
                  <h-form-item>
                    <h-button type="primary" :loading="fileLoading" icon="refresh" @click="loadPdfFileFun('relationshipsPath')">
                        <span v-if="!fileLoading">加载文件</span>
                        <span v-else>加载中...</span>
                    </h-button>
                  </h-form-item>
                  <h-form-item>
                      <!-- multiple  
                        :on-preview="clickLink"
                        :on-remove="handleRemove" -->
                      <h-upload 
                        ref="uploadPdfFile"
                        name="article"
                        action="http://10.106.0.51:8000/PdfExtract/"
                        :with-credentials="true"
                        :before-upload="uploadBefore"
                        :on-progress="handleProgress"
                        :on-success="uploadSuccess"
                        :on-remove="handleRemove"
                        :on-error="uploadError">
                        <h-button type="ghost" icon="plus-round">选择PDF</h-button>
                      </h-upload>
                  </h-form-item>
                  <h-form-item>
                    <h-button type="primary" icon="playon" @click="analysisFun">获取结果</h-button>
                  </h-form-item>
            </h-form>
        </div>

        <h-row>
            <h-col span="24">
                <h-card>
                    <h-spin fix v-if="tableLoading">
                        <h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
                        <div>加载中...</div>
                    </h-spin>
                    <!-- 客户 -->
                     <p slot="title">客户</p>
                     <h-table stripe :columns="customerColumns"  :height="customerHeightValue" :data="customerDatas"></h-table>
                </h-card>
            </h-col>
            <h-col span="24">
                <h-card>
                    <h-spin fix v-if="tableLoading">
                        <h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
                        <div>加载中...</div>
                    </h-spin>
                    <!-- 供应商 -->
                    <p slot="title">供应商</p>
                    <h-table stripe :columns="providerColumns" :height="providerHeightValue" :data="providerDatas"></h-table>
                </h-card>
            </h-col>
            <h-col span="24">
                <h-card>
                    <h-spin fix v-if="tableLoading">
                        <h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
                        <div>加载中...</div>
                    </h-spin>
                    <!-- 竞争企业 -->
                    <p slot="title">竞争企业</p>
                    <h-table stripe :columns="competeColumns" :height="competeHeightValue"  :data="competeDatas"></h-table>
                </h-card>
            </h-col>
        </h-row>
    </div>
</template>

<script>

export default {
    data() {
        return {
            fileLoading: false,
            tableLoading: false,
            contentsTree: [],
            fileNameList: [],
            relationshipsPath: {
                content: '',
                fileName: '',
            },
            pdfFileName: '',
            fileIndex: 0,
            isComputed: false,
            fileNameList: [],
            allFileNameList: [],
            ruleInline: {
                content: [
                    { required: true, message: '请选择文件目录', trigger: 'change' }
                ],
                fileName: [
                    { required: true, message: '请选择文件', trigger: 'change' }
                ]
            },
            analysisResult: {},
            customerDatas: [],
            providerDatas: [],
            competeDatas: [],
            customerHeightValue: null,
            providerHeightValue: null,
            competeHeightValue: null,

            //客户
            customerColumns: [
                {
                    // align: "center",
                    title: '年度',
                    key: 'year',
                    width: 200,
                },
                {
                    // align: "center",
                    title: '关系描述',
                    key: 'describe_relation',
                    width: 300,
                },
                {
                    // align: "center",
                    title: '客户名称',
                    key: 'object'
                },
                {
                    align: "center",
                    title: '序号',
                    width: 50,
                    key: 'num'
                },
                {
                    align: "center",
                    title: '销售额（万元）',
                    width: 120,
                    key: 'sum'
                },
                {
                    align: "center",
                    title: '占营业额收入比例',
                    width: 140,
                    key: 'percent'
                },
            ],

            //供应商
            providerColumns: [
                {
                    // align: "center",
                    title: '年度',
                    key: 'year',
                    width: 200,
                },
                {
                    // align: "center",
                    title: '关系描述',
                    key: 'describe_relation',
                    width: 300,
                },
                {
                    // align: "center",
                    title: '供应商名称',
                    key: 'object'
                },
                {
                    align: "center",
                    title: '序号',
                    width: 50,
                    key: 'num'
                },
                {
                    align: "center",
                    title: '采购金额（万元）',
                    width: 120,
                    key: 'sum'
                },
                {
                    align: "center",
                    title: '占采购总额比例',
                    width: 140,
                    key: 'percent'
                },
            ],

            //竞争企业
            competeColumns: [
                // {
                //     align: "center",
                //     title: '年度',
                //     key: 'year',
                //     width: 100,
                // },
                {
                    align: "center",
                    title: '序号',
                    width: 200,
                    key: 'num'
                },
                {
                    // align: "center",
                    title: '关系描述',
                    key: 'describe_relation',
                    width: 300,
                },
                {
                    // align: "center",
                    title: '竞争企业名称',
                    key: 'object'
                },
                // {
                //     align: "center",
                //     title: '金额',
                //     width: 100,
                //     key: 'sum'
                // },
                // {
                //     align: "center",
                //     title: '占比',
                //     width: 100,
                //     key: 'percent'
                // },
            ],
        }
    },
    methods: {
        handleProgress() {
            // this.$hMessage.loading({
            //     content: '文件正在上传中...'
            // })
        },
        uploadBefore() {
            this.$refs.uploadPdfFile.clearFiles();
            this.refreshFun();
        },
        uploadSuccess(file) {
            this.$hMessage.success('文件已上传成功');
            // console.log(file)
            // this.$refs.uploadPdfFile.clearFiles();
            this.pdfFileName = file.article;
            // console.log(this.pdfFileName)
        },
        uploadError(file) {
            this.$hMessage.error(file.name + '上传失败')
        },
        handleRemove(file){
            this.pdfFileName = '';
        },
        // clickLink (file) {
        //     this.$hNotice.info({
        //         title: '点击上传文件事件',
        //         desc: '点击已上传的文件链接时的事件'
        //     }),
        //     console.log(file.response)
        // },
        getContents() {
            let url = '/tm/getPdfFileCatalog';
            this.$http.get(url).then((res) => {
                let data = res.data;
                if (data.status == this.$api.SUCCESS) {
                    this.contentsTree = data.body.filePath;
                } else {
                    this.$hMessage.error({ content: data.msg })
                }
            }).catch(err => {
                this.$hLoading.error();
            })
        },
        // 下拉树形选择框更改内容
        contentChangeFun(items) {
            // console.log(items)
            if (items.length < 1) {
                this.fileNameList = [];
                this.relationshipsPath.contetns = '';
                this.relationshipsPath.fileName = '';
                return;
            }
            let path = items[0].id;
            let url = '/tm/getPdfFileName?filePath=' + path;
            this.$http.get(url).then((res) => {
                let data = res.data;
                if (data.status == this.$api.SUCCESS) {
                    this.allFileNameList = data.body.fileList;
                    this.fileNameList = this.allFileNameList.slice(0, 10);
                    this.relationshipsPath.fileName = this.allFileNameList[0];
                } else {
                    this.$hMessage.error({ content: data.msg })
                }
            }).catch(err => {
                this.$hLoading.error();
            })
        },
        scroll(num) {
            let _this = this;
            if (num <= 1) {
                let length = _this.fileNameList.length;
                setTimeout(() => {
                    let arr = _this.allFileNameList.slice(length, length + 10);
                    if (arr.length > 0) {
                        _this.fileNameList = _this.fileNameList.concat(arr);
                        _this.isComputed = false;
                    } else {
                        this.isComputed = true;
                    }
                }, 200);
            }
        },
        refreshFun() {
            this.pdfFileName = '';
            this.relationshipsPath.content = '',
            this.relationshipsPath.fileName = '';
            this.$refs['relationshipsPath'].resetFields();
        },
        previousFun() {
            let length = this.allFileNameList.length;
            if (length > 0 && this.fileIndex > 0) {
                this.fileIndex--;
                this.relationshipsPath.fileName = this.allFileNameList[this.fileIndex];
                this.pdfFileName = '';
            }
        },
        nextFun() {
            let length = this.allFileNameList.length;
            if (length > 0 && this.fileIndex < length - 1) {
                this.fileIndex++;
                this.relationshipsPath.fileName = this.allFileNameList[this.fileIndex];
                this.pdfFileName = '';
            }
        },
        analysisFail() {
            this.customerDatas = [];
            this.providerDatas = [];
            this.competeDatas = [];
            this.customerHeightValue = null;
            this.providerHeightValue = null;
            this.competeHeightValue = null;
        },
        loadPdfFileFun(name) {
            // console.log(this.relationshipsPath)
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$refs.uploadPdfFile.clearFiles();
                    this.fileLoading = true;
                    let pdfFilePath = this.relationshipsPath.content + "/" + this.relationshipsPath.fileName;
                    let url = '/tm/loadPdfFile?pdfFilePath=' + pdfFilePath;
                    this.$http.get(url).then((res) => {
                        let data = res.data;
                        if (data.status == this.$api.SUCCESS) {
                            this.pdfFileName = data.body.article;
                            this.$hMessage.success("文件载入成功！")

                            // 新建窗口打开pdf文件
                            let pdfUrl = '/pdf/' + pdfFilePath;
                            // window.open(pdfUrl, "_blank");
                            window.open(pdfUrl, "_blank", "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes");
                        } else {
                            this.$hMessage.error({ content: data.msg })
                        }
                        this.fileLoading = false;
                    }).catch(err => {
                        this.$hLoading.error();
                        this.fileLoading = false;
                        this.$hMessage.success("文件载入失败！")
                    })
                }
            })
        },
        analysisFun() {
            if (this.pdfFileName == '') {
                this.$hMessage.warning('请先加载或上传PDF文件！');
                return;
            }
            this.tableLoading = true;
            let url = '/tm/analysisPdf?articleName=' + this.pdfFileName;
            this.$http.get(url).then((res) => {
                let data = res.data;
                if (data.status == this.$api.SUCCESS) {
                    this.analysisResult = data.body;
                    // console.log(this.analysisResult);
                    this.customerDatas = typeof (this.analysisResult.customer) == "undefined" ? [] : this.analysisResult.customer;
                    this.providerDatas = typeof (this.analysisResult.provider) == "undefined" ? [] : this.analysisResult.provider;
                    this.competeDatas = typeof (this.analysisResult.compete) == "undefined" ? [] : this.analysisResult.compete;
                    this.customerHeightValue = this.customerDatas.length >= 10 ? 355 : null;
                    this.providerHeightValue = this.providerDatas.length >= 10 ? 355 : null;
                    this.competeHeightValue = this.competeDatas.length >= 10 ? 355 : null;
                } else {
                    this.$hMessage.error({ content: data.msg })
                    this.analysisFail();
                }
                this.tableLoading = false;
            }).catch(err => {
                this.tableLoading = false;
                this.$hLoading.error();
                this.analysisFail();
            })
        },
    },
    mounted() {
        this.getContents();
    }
}
</script>
<style>
.page {
  background: #eee;
  padding-bottom: 10px;
}

.h-card {
  margin: 10px;
}

.file-analysis-form {
  background: #fff;
  padding-left: 20px;
  padding-top:10px;
  /* height: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center; */
}

.h-upload {
  display: flex;
  justify-content: flex-start;
}
.h-upload .h-upload-list {
  margin-left: 10px;
  margin-top: -5px;
}
</style>
