<template>
    <div class="page">
        <div class="file-load-row">
            <h-select-tree formatValue='id' v-model="corpusPath.content" :data="contentsTree" placement="bottom" placeholder="请选择语料目录" style="width:200px;" @on-select-change="contentChangeFun"></h-select-tree>
            <h-button-group style="width:150px; margin-left:10px;">
                <h-button type="primary" icon="refresh" @click="refreshFun"></h-button>
                <h-button type="primary" icon="return" @click="previousFun"></h-button>
                <h-button type="primary" icon="enter" @click="nextFun"></h-button>
            </h-button-group>
             <h-select style="width:200px;" clearable placeholder="请选择文件" v-model="corpusPath.fileName"  @on-change="fileNameChangeFun" filterable @on-scroll="scroll" :isComputed="isComputed" noMoreText="加载完成">
			        <h-option v-for="(fileName, index) in fileNameList" :value="fileName" :key="index">{{fileName}}</h-option>
			   </h-select>
             <h-button type="primary" @click="loadFun" style="margin:10px;">载入</h-button>
             <h-checkbox v-model="autoLoad"><span>自动载入</span></h-checkbox>
             <h-checkbox v-model="autoAnalysis"><span>自动分析</span></h-checkbox>
        </div>

         <h-card>
             <h-form ref="corpusForm" :model="corpusForm"  :rules="ruleInline">
                <h-form-item prop="title">
                    <h-input v-model="corpusForm.title" placeholder="请输入标题"></h-input>
                </h-form-item>
                <h-form-item prop="content">
                    <h-input v-model="corpusForm.content" type="textarea" :autosize="{minRows: 3,maxRows: 10}"
                    placeholder="请输入内容"></h-input>
                </h-form-item>
                <h-form-item>
                    <h-checkbox-group v-model="analysisItems" class="operate-checkbox-group">
                        <h-checkbox label="分词结果" v-model="corpusForm.showSegment"></h-checkbox>
                        <h-checkbox label="敏感过滤" v-model="corpusForm.detectSensitiveWords"></h-checkbox>
                        <h-checkbox label="标签提取" v-model="corpusForm.extractTags"></h-checkbox>
                        <h-checkbox label="摘要提取" v-model="corpusForm.extractSummary"></h-checkbox>
                        <h-checkbox label="新词发现" v-model="corpusForm.discoverNewWords"></h-checkbox>
                        <h-checkbox label="情感分析" v-model="corpusForm.analyzeSentiment"></h-checkbox>
                    </h-checkbox-group>
                </h-form-item>
                <h-form-item>
                    <h-button type="primary" long icon="playon" @click="analysisFun('corpusForm')">分析</h-button>
                </h-form-item>
             </h-form>
         </h-card>

        <!-- 敏感过滤 -->
        <h-card v-if="corpusForm.detectSensitiveWords && containSensitiveWords">
            <h-alert type="error" show-icon>
                文章包含敏感词：
                <span slot="desc">
                    <h-tag v-for="(item, index) of sensitiveWords" :key="index" :name="item"  :color=colors[2]>
                        {{item}}
                    </h-tag> 
                </span>
            </h-alert>
        </h-card>
        <!-- 摘要提取和情感分析 -->
        <h-row>
            <h-col span="24">
                <h-card :bordered="false">
                    <h-spin fix v-if="tableLoading">
                        <h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
                        <div>加载中...</div>
                    </h-spin>
                    <p slot="title">摘要</p>
                        <h-input :readonly="true" v-model="summary" type="textarea" :autosize="{minRows: 3,maxRows: 5}"
                    placeholder="摘要"></h-input>
                </h-card>
            </h-col>
            <h-col span="12">
                <h-card shadow>
                    <h-spin fix v-if="tableLoading">
                        <h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
                        <div>加载中...</div>
                    </h-spin>
                    <p slot="title">情感</p>
                    <div style="min-height:55px;">
                        <div v-show="showRingDiagram" id="sentimentRingDiagram"></div>
                    </div>
                </h-card>
            </h-col>

             <h-col span="12">
                <h-card shadow>
                    <h-spin fix v-if="tableLoading">
                        <h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
                        <div>加载中...</div>
                    </h-spin>
                    <p slot="title">事件分类</p>
                    <div style="min-height:55px;">
                        <div v-show="showEventRingDiagram" id="eventPredictionsRingDiagram"></div>
                    </div>
                </h-card>
            </h-col>

        </h-row>

        <h-row>
            <h-col span="12">
                <h-card>
                    <h-spin fix v-if="tableLoading">
                        <h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
                        <div>加载中...</div>
                    </h-spin>
                    <!-- 标签表格 -->
                    <h-table stripe :height="tagsHeightValue"  :columns="tagColumns" :data="tags"></h-table>
                </h-card>
            </h-col>
            <h-col span="12">
                <h-card>
                    <h-spin fix v-if="tableLoading">
                        <h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
                        <div>加载中...</div>
                    </h-spin>
                    <!-- 新词  -->
                    <h-edit-gird :height="newWordsHeightValue" :border="false" no-data-text="暂无新词" ref="editGird" :columns="newWordColumns" :data="newWordsData" size="small" :disabled-hover="true" :option="natureOptions" :showEditInput="true"></h-edit-gird>
                    <!-- <h-button class="add-data-btn" @click = "addDate">新增一行</h-button> -->
                </h-card>
            </h-col>
        </h-row>

        <h-card>
            <h-spin fix v-if="tableLoading">
                <h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
                <div>加载中...</div>
            </h-spin>
            <p slot="title">分词结果</p>
            <div>
                <h-tag v-for="(item, index) of terms" :key="item.index" :name="item.word"  :color="colors[index % 4]">
                {{item.word}}/{{item.nature}}
                </h-tag> 
            </div>
        </h-card>
    </div>
</template>

<script>
// 词性
let natures = [
    { value: '1', label: 'a-形容词' }, { value: '2', label: 'ad-副形词' }, { value: '3', label: 'ag-形容词性语素' },
    { value: '4', label: 'al-形容词性惯用语' }, { value: '5', label: 'bl-区别词性惯用语' }, { value: '6', label: 'c-连词' },
    { value: '7', label: 'cc-并列连词' }, { value: '8', label: 'd-副词' }, { value: '9', label: 'dg-辄、俱、复之类的副词' },
    { value: '10', label: 'dl-连语' }, { value: '11', label: 'e-叹词' }, { value: '12', label: 'f-方位词' },];

export default {
    data() {
        return {
            tagsHeightValue: null,
            newWordsHeightValue: null,
            tableLoading: false,
            showRingDiagram: false,
            showEventRingDiagram : false,
            autoLoad: true,
            autoAnalysis: false,
            containSensitiveWords: false,
            // heightValue: null,
            contentsTree: [],
            // contentsTree: [{
            //     title: 'corpus-txt',
            //     expand: true,
            //     id: 'corpus-txt',
            //     children: [{
            //         title: '0000',
            //         id: 'corpus-txt/0000'
            //     },
            //         // {
            //         //     title: '0001',
            //         //     id: 'corpus-txt/0001'
            //         // }
            //     ]
            // }],
            newWordsData: [{
                word: '',
                nature: '',
            }],
            natureOptions: [],
            analysisItems: ["分词结果", "敏感过滤", "标签提取", "摘要提取", "新词发现", "情感分析"],
            colors: ["blue", "green", "red", "yellow"],
            sentimentDesc: ["负面", "中性", "正面", "其他"],
            sentimentColors : ["#f14c5d", "#1cb77b", "#f2b044", "#029afd"],
            corpusPath: {
                content: '',
                fileName: '',
            },
            fileIndex: 0,
            isComputed: false,
            fileNameList: [],
            allFileNameList: [],
            corpusForm: {
                title: '',
                content: '',
                showSegment: true, //分词结果
                detectSensitiveWords: true, //敏感词检测
                extractTags: true, //标签提取
                extractSummary: true, //摘要提取
                discoverNewWords: true, //新词发现
                analyzeSentiment: true,  //情感分析
                summaryMaxLength: '', //摘要最大长度
                tagSize: '', //标签数量
            },
            analysisResult: {
                newWords: [],  //新词
                sentiments: [], //情感
                summary: '',  //摘要
                tags: [],   //标签
                terms: [],  //分词结果
                sensitiveWords: [], // 敏感词
                eventPredictions:[], //事件分类
            },
            newWords: [],  //新词
            sentiments: [], //情感
            summary: '',  //摘要
            tags: [],   //标签
            terms: [],  //分词结果
            sensitiveWords: [], // 敏感词
            eventPredictions:[], //事件分类

            ruleInline: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'change' }
                ],
                content: [
                    { required: true, message: '请输入内容', trigger: 'change' }
                ]
            },
            tagColumns: [
                {
                    align: "center",
                    title: '标签',
                    key: 'word'
                },
                {
                    align: "center",
                    title: '词性',
                    width: 100,
                    key: 'nature'
                },
                {
                    align: "center",
                    title: '等级分',
                    width: 100,
                    render: (h, params) => {
                        let row = params.row;
                        return h('div',row.rank.toFixed(2));
                     }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    disabled: true
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        // console.log(params.row);
                                    }
                                }
                            }, '停用')
                        ]);
                    }
                }
            ],
            newWordColumns: [
                {
                    type: 'text',
                    title: '新词',
                    key: 'word',
                    placeholder: "请输入新词"
                },
                {
                    type: 'select',
                    title: '词性',
                    transfer: true,  // 下拉框可以悬浮在表格之上
                    key: 'nature',
                    multiple: false,
                    placeholder: "请选择词性",
                    // placement:"top",
                    // rule: { required: true, message: '请选择词性' }
                },
                {
                    width: 80,
                    title: "操作",
                    render: (h, params) => {
                        return h('div', [
                            h('h-button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    disabled: true
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    'click': () => {
                                        this.show(params.index)
                                    }
                                }
                            }, '添加')
                        ]);
                    }
                },
            ],
        }
    },
    methods: {
        // addDate() {
        //     this.newWordsData.push({
        //         word: '',
        //         nature: '',
        //     });
        // },
        // 获取语料目录
        getContents() {
            let url = '/tm/getTxtFileCatalog';
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
        resetInit() {
            this.corpusPath.content = '';
            this.corpusPath.title = '';
            this.allFileNameList = [];
            this.fileNameList = [];
            this.fileIndex = 0;
            this.isComputed = false;
            this.autoAnalysis = false;
            this.containSensitiveWords = false;
        },
        refreshFun() {
            this.corpusPath.content = '',
            this.corpusPath.fileName = '';
            this.$refs['corpusForm'].resetFields();
        },
        // 下拉树形选择框更改内容
        contentChangeFun(items) {
            // console.log("文件目录更改")
            // console.log(items)
            if (items.length < 1) {
                this.resetInit();
                return;
            }
            let path = items[0].id;
            let url = '/tm/getTxtFileName?path=' + path;
            this.$http.get(url).then((res) => {
                let data = res.data;
                if (data.status == this.$api.SUCCESS) {
                    this.allFileNameList = data.body.fileList;
                    this.fileNameList = this.allFileNameList.slice(0, 10);
                    this.corpusPath.fileName = this.allFileNameList[0];
                } else {
                    this.$hMessage.error({ content: data.msg })
                }
            }).catch(err => {
                this.$hLoading.error();
            })
        },
        scroll(num) {
            // num为滚动条距离底部的距离(数据为0时表示滚动已经滚动到底部)；
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
        // 文件名更改
        fileNameChangeFun() {
            // console.log("文件名更改")
            this.fileIndex = this.fileNameList.indexOf(this.corpusPath.fileName);
            // console.log(this.corpusPath)
            if (this.autoLoad) {
                this.loadFun();
            }
            setTimeout(() => {
                if (this.autoAnalysis) {
                    this.analysisFun('corpusForm');
                }
            }, 700);
        },
        previousFun() {
            let length = this.allFileNameList.length;
            if (length > 0 && this.fileIndex > 0) {
                this.fileIndex--;
                this.corpusPath.fileName = this.allFileNameList[this.fileIndex];
            }
        },
        nextFun() {
            let length = this.allFileNameList.length;
            if (length > 0 && this.fileIndex < length - 1) {
                this.fileIndex++;
                this.corpusPath.fileName = this.allFileNameList[this.fileIndex];
            }
        },
        loadFun() {
            // console.log(this.corpusPath)
            if (this.corpusPath.content == '' || this.corpusPath.fileName == '') {
                return;
            }
            let filePath = this.corpusPath.content + "/" + this.corpusPath.fileName;
            let url = '/tm/getTxtFileContent?filePath=' + filePath;
            this.$http.get(url).then((res) => {
                let data = res.data;
                if (data.status == this.$api.SUCCESS) {
                    // console.log(data);
                    this.corpusForm.content = data.body.content;
                    this.corpusForm.title = data.body.title;
                } else {
                    this.$hMessage.error({ content: data.msg })
                }
            }).catch(err => {
                this.$hLoading.error();
            })
        },
        analysisFun(name) {
            this.newWordsData = [{
                word: '',
            }];
            this.containSensitiveWords = false;
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.tableLoading = true;
                    let url = '/tm/analysisTxt';
                    this.$http.post(url, this.corpusForm).then((res) => {
                        let data = res.data;
                        console.log(data)
                        if (data.status == this.$api.SUCCESS) {
                            this.analysisResult = data.body;
                            // 事件分类
                            this.showEventRingDiagram = true;
                            this.eventPredictions = this.analysisResult.eventPredictions || [];
                            this.showEventPredictionsRingDiagram(this.eventPredictions);

                            //console.log(this.analysisResult);
                            // 情感
                            if (this.corpusForm.analyzeSentiment) {
                                this.sentiments = this.analysisResult.sentiments || [];
                                this.showRingDiagram = true;
                                this.showSentimentRingDiagram(this.sentiments);
                            } else {
                                this.showRingDiagram = false;
                            }

                            // 新词发现
                            this.newWords = this.analysisResult.newWords || [];
                            this.newWordsHeightValue = this.newWords.length >= 8 ? 365 : null;
                            for (let i in this.newWords) {
                                this.newWordsData.push({
                                    word: this.newWords[i],
                                });
                            }
                            // 敏感词
                            this.sensitiveWords = this.analysisResult.sensitiveWords || [];
                            this.containSensitiveWords = this.sensitiveWords.length > 0 ? true : false;
                            // 摘要
                            this.summary = this.analysisResult.summary  || '';
                            // 标签
                            this.tags = this.analysisResult.tags || [];
                            this.tagsHeightValue = this.tags.length >= 8 ? 365 : null;
                            // 分词结果
                            this.terms = this.analysisResult.terms || [];
                        } else {
                            this.$hMessage.error({ content: data.msg })
                        }
                        this.tableLoading = false;
                    }).catch(err => {
                        this.tableLoading = false;
                        this.$hLoading.error();
                    })
                }
            })

        },

        // 展示事件分类环形图
         showEventPredictionsRingDiagram(eventPredictions) {
            let legendData = [];
            let seriesColors = []; //环形图颜色
            let seriesData = [];
            let otherProbability = 1;
            for (let i = 0, len = eventPredictions.length; i <len ; i++) {
                let probability = eventPredictions[i].probability;
                otherProbability -= probability;
                let value = Number(probability * 100).toFixed(2);
                let name = eventPredictions[i].eventName;
                seriesColors[i] = this.sentimentColors[i];
                legendData.push(name);
                seriesData.push({
                    name: name,
                    value: value,
                });
                
            }
            legendData.push("其他");
            seriesData.push({
                name: "其他",
                value: Number(otherProbability * 100).toFixed(2),
            });
            seriesColors.push(this.sentimentColors[3]);
            console.log(legendData);
            console.log(seriesData);
            console.log(seriesColors);
            setTimeout(() => {
                let eventDiv = document.getElementById("eventPredictionsRingDiagram");
                let eventRingDiagram = echarts.init(eventDiv);
                eventRingDiagram.setOption(option, true);
            }, 100);
            //  formatter: "{a} <br/>{b}: {c} ({d}%)"
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {d}%"
                },
                legend: {
                    // orient: 'vertical',
                    x: 'left',
                    data: legendData
                },
                color: seriesColors,
                series: [
                    {
                        name: '事件分类',
                        type: 'pie',
                        radius: ['35%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            formatter: '{b}: {d}%'
                        },
                        data: seriesData
                    }
                ]
            };
        },


        showSentimentRingDiagram(sentimentDataList) {
            let legendData = [];
            let seriesColors = []; //环形图颜色
            let seriesData = [];
            let otherProbability = 1;
            let color = [
                [],
                ['','#FF9999','#FF7373','#FF4D4D','#FF2626','#FF0000'],
                [],
                ['','#99FF99','#73FF73','#4DFF4D','#26FF26','#00FF00']
            ]
            for (let i = 0, len = sentimentDataList.length; i <len ; i++) {
            	// console.log(sentimentDataList)
                let label = sentimentDataList[i].label;
                // 1：负面，2：中性，3：正面
                let probability = sentimentDataList[i].probability;
                otherProbability -= probability;
                let value = Number(probability * 100).toFixed(2);
                let name = this.sentimentDesc[label - 1];
                seriesColors[i] = this.sentimentColors[label - 1];
                if(label != 2){
                    let arr = ['','一星','二星','三星'];
                    let level = sentimentDataList[i].level;
                    name += arr[level];
                    seriesColors[i] = color[label][level];
                }
                legendData.push(name);
                seriesData.push({
                    name: name,
                    value: value,
                });
                
            }
            legendData.push("其他");
            seriesData.push({
                name: "其他",
                value: Number(otherProbability * 100).toFixed(2),
            });
            seriesColors.push(this.sentimentColors[3]);
            setTimeout(() => {
                let domRingDiagram = document.getElementById("sentimentRingDiagram");
                let ringDiagram = echarts.init(domRingDiagram);
                ringDiagram.setOption(option, true);
            }, 100);
            //  formatter: "{a} <br/>{b}: {c} ({d}%)"
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {d}%"
                },
                legend: {
                    // orient: 'vertical',
                    x: 'left',
                    data: legendData
                },
                color: seriesColors,
                series: [
                    {
                        name: '情感',
                        type: 'pie',
                        radius: ['35%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            formatter: '{b}: {d}%'
                        },
                        data: seriesData
                        // data: [
                        //     { value: 3, name: '正面' },
                        //     { value: 4, name: '负面' },
                        //     { value: 3, name: '其他' }
                        // ]
                    }
                ]
            };
        },
    },
    mounted() {
        this.natureOptions[1] = natures;
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
#sentimentRingDiagram {
  width: 100%;
  height: 300px;
}

#eventPredictionsRingDiagram {
  width: 100%;
  height: 300px;
}

.operate-checkbox-group {
  display: flex;
  justify-content: space-between;
}
.file-load-row {
  background: #fff;
  height: 50px;
  padding-left: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.add-data-btn {
  margin-top: 10px;
}
</style>
