<template>
	<div class="addnewstemplate">
		<div class="topbox">
			<div>
				<h-form :model="req" ref="temForm" label-position="right" :label-width="120" :rules="modulesRule">
					<h-form-item label="模板名称："  prop="templateName">
						<h-input type="text" v-model="req.templateName" placeholder="模板名称"></h-input>
					</h-form-item>
					<h-form-item label="模板备注：" prop="remark">
						<h-input type="textarea" class="remark-textarea" :rows="4" v-model="req.remark" placeholder="模板备注"></h-input>
					</h-form-item>
				</h-form>
			</div>
		</div>
		<div class="steps">
			<Steps :current="step">
				<Step title="新闻内容"></Step>
				<Step title="规则"></Step>
			</Steps>
		</div>
		<div class="contentsbox" v-show="step === 0" >
			<div class="leftbox">
				<Tabs size="small" @on-click="clickTabs">
					<TabPane :label="label"></TabPane>
					<TabPane label="智能表格"></TabPane>
					<TabPane label="图表库"></TabPane>
					<TabPane label="函数库"></TabPane>
				</Tabs>
				<div class="smart-field-box" v-show="activeTabsIndex == 0">
					<div class="tree-search-input">
						关键字：
						<h-input placeholder="请输入" v-model="smartFieldtreeKeyword" @on-enter="onSearchSmartField()" ></h-input>
						<h-button type="primary" @click="onSearchSmartField()">搜索</h-button>
					</div>
					<div class="smart-field-tree-box" v-show="activeTabsIndex == 0">
						<ul id="SmartFieldTree" class="ztree"></ul>
					</div>
					<h-spin fix v-if="isTreeSmartFieldLoading">
						<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
						<div>加载中...</div>
					</h-spin>
				</div>
				<div class="smart-field-box" v-show="activeTabsIndex == 1">
					<div class="tree-search-input">
						关键字：
						<h-input placeholder="请输入" v-model="tableTreeKeyword" @on-enter="onSearchTable()" ></h-input>
						<h-button type="primary" @click="onSearchTable()">搜索</h-button>
					</div>
					<div class="smart-field-tree-box">
						<ul id="TableTree" class="ztree"></ul>
					</div>
					<h-spin fix v-if="isTreeTableLoading">
						<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
						<div>加载中...</div>
					</h-spin>
				</div>
				<div class="smart-field-box" v-show="activeTabsIndex == 2">
					<ul class="ztree">
						<li>
							<span class="button switch roots_docu"></span>
							<a><span class="node_name" @click="addChart('line')">折线图</span></a>
						</li>
						<li>
							<span class="button switch center_docu"></span>
							<a><span class="node_name" @click="addChart('bar')">条形图</span></a>
						</li>
						<li>
							<span class="button switch center_docu"></span>
							<a><span class="node_name" @click="addChart('column')">柱形图</span></a>
						</li>
						<li>
							<span class="button switch center_docu"></span>
							<a><span class="node_name" @click="addChart('pie')">饼图</span></a>
						</li>
						<li>
							<span class="button switch bottom_docu"></span>
							<a><span class="node_name" @click="addChart('spline_column')">柱形图-折线图</span></a>
						</li>
					</ul>
				</div>
				<div class="smart-field-box" v-show="activeTabsIndex == 3">
					<div class="tree-search-input">
						关键字：
						<h-input placeholder="请输入" v-model="fnTreeKeyword" @on-enter="onSearchFn()" ></h-input>
						<h-button type="primary" @click="onSearchFn()">搜索</h-button>
					</div>
					<div class="smart-field-tree-box">
						<ul id="fnTree" class="ztree"></ul>
					</div>
					<h-spin fix v-if="isTreeFnLoading">
						<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
						<div>加载中...</div>
					</h-spin>
				</div>
			</div>
			<div class="rightbox">
				<div class="">
					<p class="title">新闻标题：</p>
					<div v-if="isShowEditor">
						<vueCkeditor :instanceReadyCallback="titleInstanceReadyCallback" @focus="onFocusTitle($event)" v-model="newsTitle" :config="titleConfig" ></vueCkeditor>
					</div>
				</div>
				<div class="summary">
					<p class="title">新闻摘要：</p>
					<div v-if="isShowEditor">
						<vueCkeditor :instanceReadyCallback="summaryInstanceReadyCallback" @focus="onFocusSummary($event)" v-model="newsSummary" :config="summaryConfig" ></vueCkeditor>
					</div>
				</div>
				<div class="contents">
					<p class="title">新闻正文：</p>
					<div v-if="isShowEditor">
						<vueCkeditor :instanceReadyCallback="contentsInstanceReadyCallback" @focus="onFocusContents($event)" v-model="newsContents" :config="contentsConfig" ></vueCkeditor>
					</div>
				</div>
				<div class="marking">
					<p class="title">打标：</p>
					<div class="marking_content">
						<p class="title">关联事件：</p>
						<!-- <table>
							<tr>
								<th width="33.33%">事件类别</th>
								<th width="33.33%">情感方向</th>
								<th width="33.33%">情感级别</th>
							</tr>
							<tr>
								<td>
									<h-simple-select v-model="eventTag.eventType" placement="top" @on-change="eventTypeChange" filterable>
										<h-select-block :data="EventInfoList"></h-select-block>
									</h-simple-select>

								</td>
								<td>
									<Select v-model="eventTag.emotionDirection" placement="top">
										<Option v-for="(item,k) in EmotionDirectionList" :value="item.code" :key="k">{{ item.name }}</Option>
									</Select>
								</td>
								<td>
									<Select v-model="eventTag.emotionLevel" placement="top">
										<Option v-for="(item,k) in EmotionLevelList" :value="item.code" :key="k">{{ item.name }}</Option>
									</Select>
								</td>
							</tr>
						</table> -->
						<div class='tableContaner'>
							<table  style='width:33%' class="value-list" v-for='(item,index) in eventKeyList' :key='item.key'>
								<tr>
									<th width="180">{{item.title1}}</th>
									<th>{{item.title2}}</th>
								</tr>
								<tr>
									<td>
										<RadioGroup v-model="eventTag[item.key].type" @on-change="()=>{
											eventTypeRadioChange(item.key)
										}">
											<Radio :label="1">
												<span>枚举</span>
											</Radio>
											<Radio :label="2">
												<span>自定义</span>
											</Radio>
										</RadioGroup>
									</td>
									<td>
										<template v-if="eventTag[item.key].type == 1">
											<div v-if='item.dataList.length > 0'>
												<h-simple-select v-if='item.key=="eventType"' v-model="eventTag[item.key].value" placement="top" @on-change="eventTypeChange" filterable>
													<h-select-block :data="item.dataList"></h-select-block>
												</h-simple-select>
												<h-simple-select v-else v-model="eventTag[item.key].value" placement="top"  filterable>
													<h-select-block :data="item.dataList"></h-select-block>
												</h-simple-select>
											</div>
											
										</template>
										<template v-else>
											<tagTextarea
												:ref="`ctagTextarea-${index+1}`"
												@tagClick="tagValueClick"
												v-model="eventTag[item.key].value"
												@focus="()=>{
													tagValueFocus(`-${index+1}`)
												}"
											>
											</tagTextarea>
										</template>
									</td>
								</tr>
							</table>
						</div>
						<p class="title">标签列表：<i @click="addTagList" class="tab-add">+</i></p>
						<table class="value-list">
							<tr>
								<th width="220">标签分类</th>
								<th width="180">标签值类型</th>
								<th>标签值</th>
								<th width="60">操作</th>
							</tr>
							<tr v-for="(item,k) in eventTag.childLabelList" :key="k">
								<td v-if='TagCategoryTree.length > 0'>
									<h-select-tree :key="k" formatValue='id' placement="top" :firstValue="item.categoryId" v-model='item.categoryId' :data="TagCategoryTree" :clearable="false" filterable @on-select-change="(select)=>{
										tagCategoryIdChange(select,k)
									}"></h-select-tree>
								</td>
								<td>
									<RadioGroup v-model="item.type" @on-change="()=>{
										tagValueTypeChange(k)
									}">
										<Radio :label="1">
											<span>枚举</span>
										</Radio>
										<Radio :label="2">
											<span>自定义</span>
										</Radio>
									</RadioGroup>
								</td>
								<td>
									<template v-if="item.type == 1">
										<Select v-model="item.businessId" @on-scroll="(num)=>{ tagValueScroll(k,num) }" :label="item.value" :loading="(tagPageData[k]||{}).loading" filterable placement="top" label-in-value remoteIcon="search" remote :remote-method="(query)=>{
											queryTagValue(k,query)
										}" @on-change="(data)=>{
											tagValueChange(data, k)
										}">
											<Option :value="items.businessId" :key="items.businessId" v-for="(items, key) in (tagPageData[k]||{}).list">{{ items.tagValue }}</Option>
										</Select>
									</template>
									<template v-else>
										<tagTextarea
											:ref="'tagTextareas'+k"
											@tagClick="tagValueClick"
											v-model="item.value"
											@focus="()=>{
												tagValueFocus(k)
											}"
										>
										</tagTextarea>
									</template>
								</td>
								<td align="center">
									<i @click="delTagList(k)" class="icon-t-b-delete iconfont tab-icon-btn" title="移除"></i>
								</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		</div>
		<div class="rule" v-show="step === 1">
			<h-form :model="req" ref="temsForm" label-position="right" :label-width="120">
				<h-form-item label="历史资讯保留：">
					<RadioGroup v-model="req.historyKeepDays">
						<Radio :label="30">
							<span>30天</span>
						</Radio>
						<Radio :label="90">
							<span>90天</span>
						</Radio>
					</RadioGroup>
				</h-form-item>
				<h-form-item label="单条新闻设定：">
					<RadioGroup v-model="req.assignmentStrategy" @on-change="shangeAssignmentStrategy">
						<Radio :label="1">
							<span>每行一条</span>
						</Radio>
						<Radio :label="2">
							<span>总汇一条</span>
						</Radio>
					</RadioGroup>
					<ul class="setting" v-show="req.assignmentStrategy == 1">
						<li v-for="(item,k) in req.dataTemplateList" :key="k">
							<span class="name" >
								{{ smartFieldIdObj[item.dataTemplateId] ? smartFieldIdObj[item.dataTemplateId].name : '' }}
							</span>
							<RadioGroup v-model="item.tableType" >
								<template v-for="(items, l) in tableType" >
									<Radio :label="items.value" :disabled="isDisabledTable" v-if="items.value != 5" >
										<span>{{ items.name }}</span>
									</Radio>
								</template>
							</RadioGroup>
							<span class="btn" @click="delTableType(k)" v-if="!isDisabledTable">删除</span>
						</li>
					</ul>
					<ul class="setting" v-show="req.assignmentStrategy == 2">
						<li v-for="(item,k) in req.dataTemplateList" :key="k">
							<span class="name" >
								{{ smartFieldIdObj[item.dataTemplateId] ? smartFieldIdObj[item.dataTemplateId].name : '' }}
							</span>
							<RadioGroup v-model="item.tableType" >
								<template v-for="(items, l) in tableType" >
									<Radio :label="items.value" v-if="items.value != 1 && items.value != 3 && items.value != 2" >
										<span>{{ items.name }}</span>
									</Radio>
								</template>
							</RadioGroup>
							<span class="btn" @click="delTableType(k)">删除</span>
						</li>
					</ul>
					<template v-if="req.assignmentStrategy == 1">
						<div>
							<h-button type="primary" class="btntable" @click="submittableType(!isDisabledTable)">{{ isDisabledTable ? '修改表关系' : '确定表关系' }}
							</h-button>
						</div>
						<template v-if="isShowRelevance && step === 1 && mianTableId && smartFieldIdObj[mianTableId]">
							<ul class="setting">
								<li v-for="(list, l) in req.dataTemplateRuleList">
									<span class="name" >{{ smartFieldIdObj[mianTableId].name }}</span>
									<span class="select">
										<Select v-model="list.mainConlumnId" placement="top-start">
											<Option v-for="(option, index) in smartFieldSubObj[smartFieldIdObj[mianTableId].code]" :value="option.id" :key="index">{{ option.name }}</Option>
										</Select>
									</span>
									<span class="equal">=</span>
									<span class="select">
										<Select v-model="list.childTableId" placement="top-start">
											<template v-for="(option, index) in req.dataTemplateList">
												<Option :value="option.dataTemplateId" v-if="option.dataTemplateId != mianTableId">
													{{ smartFieldIdObj[option.dataTemplateId].name }}
												</Option>
											</template>
										</Select>
									</span>
									<span class="select">
										<Select v-model="list.childConlumnId" placement="top-start">
											<template v-if="list.childTableId">
												<Option v-for="(option, index) in smartFieldSubObj[smartFieldIdObj[list.childTableId].code]" :value="option.id" :key="index">
													{{ option.name }}
												</Option>
											</template>
										</Select>
									</span>
									<span @click="delChildTable(l)" class="btn">删除</span>
								</li>
							</ul>
							<div>
								<h-button type="primary" class="btntable" @click="addChildTable">新增表关联
								</h-button>
							</div>
						</template>
					</template>
				</h-form-item>
			</h-form>
		</div>
		<h-spin fix v-if="isLoading">
			<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
			<div>加载中...</div>
		</h-spin>
		<div class="btnbox">
			<span v-show="step === 0">
				<h-button type="primary" @click="next">下一步</h-button>
			</span>
			<span v-show="step === 1">
				<h-button type="primary" @click="step = 0">上一步</h-button>
				<h-button type="primary" @click="submit(true)">预览</h-button>
				<h-button type="primary" @click="submit()">保存</h-button>
			</span>
			<h-button type="primary" @click="cancel">退出</h-button>
		</div>
		<template v-for="(item, k) in functionBox">
			<fn :data="item" :cancel="fnCancel" :submit="fnSubmit" :more="onFnMore" :onViewFn="onViewFn"></fn>
		</template>
		<h-msgBox title=""  class-name="vertical-center-modal MsgFn-vertical" v-model="showMsgFn" :top="0" @on-close="closeMsgFn" :mask-closable="false" width="820">
			<div class="fn-contents">
				<dl>
					<dt>
						<h2>常量</h2>
						<div class="tree input">
							<h-input v-model="constant" placeholder="请输入常量"></h-input>
						</div>
					</dt>
					<dt>
						<h2>智能字段</h2>
						<div class="dt-search">
							<div class="tree-search-input">
							关键字：
								<h-input placeholder="请输入" v-model="smartFieldTreeMsgKeyword" @on-enter="onSearchSmartFieldMsg()" ></h-input>
								<h-button type="primary" @click="onSearchSmartFieldMsg()">搜索</h-button>
							</div>
							<div class="tree">
								<ul id="msgZNZD" class="ztree"></ul>
							</div>
							<h-spin fix v-if="isTreeSmartFieldMsgLoading">
								<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
								<div>加载中...</div>
							</h-spin>
						</div>
					</dt>
					<dt>
						<h2>函数库</h2>
						<div class="tree-search-input">
							关键字：
							<h-input placeholder="请输入" v-model="fnMsgTreeKeyword" @on-enter="onSearchfnMsg()" ></h-input>
							<h-button type="primary" @click="onSearchfnMsg()">搜索</h-button>
						</div>
						<div class="tree">
							<ul id="msgHSK" class="ztree"></ul>
						</div>
					</dt>
				</dl>
			</div>
			<div slot="footer">
				<h-button type="text" @click="closeMsgFn">取消</h-button>
				<h-button type="info" @click="submitMsgFn" >提交</h-button>
			</div>
		</h-msgBox>
		<h-msgBox title="智能字段"  class-name="vertical-center-modal ZNZD-vertical" v-model="isShowSettingMSG" :top="0"  @on-close="closeSetting" :mask-closable="false" width="500">
			<div class="ZNZD-contents">
				<ul id="ZNZDSetting"  class="ztree"></ul>
				<h-spin fix v-if="isGetSetting">
					<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
					<div>加载中...</div>
				</h-spin>
			</div>
			<div slot="footer">
				<h-button type="text" @click="closeSetting">取消</h-button>
				<h-button type="info" @click="submitSetting">提交</h-button>
			</div>
		</h-msgBox>
	</div>
</template>
<script>
import fn from '../components/fn';
import vueCkeditor from 'vue-ckeditor2';
require('@/assets/css/zTreeStyle.css')
require('@/assets/js/jquery-1.4.4.min.js')
require('@/assets/js/jquery.ztree.all.min.js')
require('@/assets/js/jquery.ztree.exhide.min.js')
import { copyDeep } from '@/filters/index'
import md5 from 'js-md5'
import tagTextarea from '@/components/tagTextarea.vue';
export default {
	name: 'RobotwritingNewstemplateAdd',
	components: { vueCkeditor,fn,tagTextarea },
	data () {
		return {
			eventKeyList: [{
				'key': 'eventType',
				'title1': '事件类型',
				'title2': '事件类别值',
				'dataList': []
			},
			{
				'key': 'emotionDirection',
				'title1': '情感方向类型',
				'title2': '情感方向值',
				'dataList': []
				
			},
			{
				'key': 'emotionLevel',
				'title1': '情感级别类型',
				'title2': '情感级别值',
				'dataList': []
			}],
			eventTag:{
				eventType: {
					type: '1',
					value: '',
				},
				emotionDirection: {
					type: '1',
					value: '',
				},
				emotionLevel:{
					type: '1',
					value: '',
				},
				childLabelList:[{
					categoryId:'',
					type: '2',
					value: '',
					businessId: '',
				}]
			},
			tagPageData:[
				{
					list: [],
					page_num: 0,
					total: 0,
					loading: false,
					query: '',
					isPage: false,
				}
			],
			tagValueActive: 1,
			// EventInfoList: [],
			EventInfoObj:{},
			// EmotionDirectionList:[],
			// EmotionLevelList: [],
			TagCategoryTree: [],
			TagInfoPage: [],
			label: (h) => {
				return h('div', [
					h('span','智能字段'),
					h('i',{
						attrs:{
							style: "position: relative;left: 2px;top: 1px;",
							title: '设置'
						},
						class: [
							'icon-android-settings',
							'iconfont'
						],
						on:{
							'click':(e)=>{
								this.getSmartFieldTreeWithCheckedList()
								e.stopPropagation()
							}
						}
					})
				])
			},
			activeTabsIndex: 0,
			functionBox: [],
			activeRoutersButton: this.$store.state.activeRoutersButton,
			step: 0,
			ops:{},
			req:{
				id: '',
				templateName: '',
				remark: '',
				assignmentStrategy: 1,
				title: '',
				summary: '',
				content: '',
				dataTemplateList: [],
				dataTemplateRuleList: [],
				deduplicationStrategy: 1,
				deduplicationCycle: 1,
				deduplicationInterval: '',
				historyKeepDays: 90
			},
			newsTitle: '',
			newsSummary: '',
			newsContents: '',
			titleConfig: {
				bodyClass: 'newstitle',
				height: "28px",
				width: "100%",
				toolbar: [['Undo', 'Redo']],//工具栏选项
				extraPlugins: 'fn',
			},
			summaryConfig: {
				bodyClass: 'newstitle',
				height: "68px",
				width: "100%",
				toolbar: [['Undo', 'Redo']],//工具栏选项
				extraPlugins: 'fn',
			},
			contentsConfig: {
				bodyClass: 'newstitle',
				height: "120px",
				width: "100%",
				toolbar: [['Undo', 'Redo','Bold', 'Italic', 'Underline','FontSize','TextColor', 'BGColor','Image','Table','JustifyLeft', 'JustifyCenter', 'JustifyRight',]],//工具栏选项
				extraPlugins: 'fn',
			},
			activeEditor: null,
			titleEditor: null,
			summaryEditor: null,
			contentsEditor: null,
			titleEditorOK: false,
			summaryEditorOK: false,
			contentsEditorOK: false,
			setting: {
				data: {
					simpleData: {
						enable: true
					}
				},
				view: {
					showIcon: false,
					selectedMulti: false,
				},
				callback: {
					beforeClick: this.zTreeBeforeClick,
					onClick: this.onClickTree,
				}
			},
			tableSetting: {
				data: {
					simpleData: {
						enable: true
					}
				},
				view: {
					showIcon: false,
					selectedMulti: false,
				},
				callback: {
					beforeClick: this.TableBeforeClick,
					onClick: this.onTableClickTree,
				}
			},
			fnSetting: {
				data: {
					simpleData: {
						enable: true,
						idKey: "code",
						pIdKey: "parantCode",
					}
				},
				view: {
					showIcon: false,
					selectedMulti: false,
				},
				callback: {
					beforeClick: this.fnBeforeClick,
					onClick: this.onfnClickTree,
				}
			},
			modulesRule:{
				templateName:[
					{ required:true, message: '请输入', trigger:'blur'},
					{ max: 100, message: '不可超过100个字符', trigger:'blur'}
				],
				remark: [
					{ required:true, max: 500, message: '不可超过500个字符', trigger:'blur'},
				],
			},
			isLoading: false,
			isCopy: false,
			isShowEditor: true,
			smartFieldList: [],
			smartFieldSubObj: {},
			smartFieldObj: {},
			smartFieldIdObj: {},
			smartFieldCodeObj: {},
			tableType: [
				{ value: 1, name: '主表' },
				{ value: 2, name: '子表(一对一)' },
				{ value: 3, name: '子表(一对多)' },
				{ value: 4, name: '统计表' },
				{ value: 5, name: '明细表' }
			],
			mianTableId: '',
			formerMianTableId: '',
			isShowRelevance: true,
			isDisabledTable: true,
			dataTemplateList:[],
			isMounted: true,
			reqMd5: '',
			fnTreeModel: '',
			showMsgFn: false,
			fnIndex: -1,
			dataIndex: -1,
			txtIndex: -1,
			constant: '',
			isViewFn: false,
			smartFieldtreeKeyword: '',
			smartFieldKeyword: '',
			tableTreeKeyword: '',
			tableKeyword: '',
			fnTreeKeyword: '',
			fnKeyword: '',
			smartFieldTreeMsgKeyword: '',
			smartFieldMsgKeyword: '',
			fnMsgTreeKeyword: '',
			fnMsgKeyword: '',
			fnList: [],
			isTreeSmartFieldLoading: false,
			isTreeTableLoading: false,
			isTreeFnLoading: false,
			isTreeSmartFieldMsgLoading: false,
			isTreeFnMsgLoading: false,
			isMd5: false,
			isShowSettingMSG: false,
			znzdSetting: {
				check: {
					enable: true,
					//chkboxType: { "Y" : "p", "N" : "s" }
				},
				view: {
					showIcon: false
				},
				callback: {
					onCheck:() =>{
						
					}
				}
			},
			isGetSetting: false,
			chartType:{
				spline: '曲线图',
				column: '柱状图',
				bar: '条形图',
				line: '折线图',
				pie: '饼图',
				spline_column: '柱状-折线图',
			},
			chartStep:{
				spline: 2,
				column: 2,
				bar: 2,
				line: 2,
				pie: 1,
				spline_column: 3,
			},
			add_like_count:0,
			like_query:0,
			like_start_page:0,
		}
	},
	methods:{
		tagValueChange(data, key){

			this.eventTag.childLabelList[key].value = data.label;
		},
		tagValueAddTag(html){
			let tagValueActive = this.tagValueActive
			if (tagValueActive == '-1'||tagValueActive == '-2'|| tagValueActive == '-3'){
				this.$refs[`ctagTextarea${tagValueActive}`][0].addTag(html);
				return
			}
			if(this.eventTag.childLabelList[tagValueActive]){
				this.$refs['tagTextareas'+tagValueActive][0].addTag(html);
			}
		},
		tagValueClick(mod){
			if(mod.model.className == 'mark')return;
			this.resolveStrToFunction(mod.text)
		},
		tagValueFocus(k){
			this.activeEditor = null;
			this.tagValueActive = k;
		},
		addTagList(){
			let tagPageData = {
				list: [],
				page_num: 0,
				total: 0,
				loading: false,
				query: '',
				isPage: false,
			}
			let tag = {
				categoryId:'',
				type: 2,
				value: '',
				businessId: '',
			}
			this.eventTag.childLabelList.push(tag);
			this.tagPageData.push(tagPageData);
		},
		delTagList(k){
			this.tagPageData.splice(k,1);
			let copy = copyDeep(this.eventTag);
			copy.childLabelList.splice(k,1);
			this.$set(this,'eventTag', copy);
		},
		tagValueTypeChange(key){
			this.eventTag.childLabelList[key].value = '';
			this.eventTag.childLabelList[key].businessId = '';
		},
		eventTypeRadioChange(key){
			this.eventTag[key].value = ''
		},
		tagCategoryIdChange(select, key){
			if(select.length > 0){
				this.eventTag.childLabelList[key].categoryId = select[0].id;
			}
			if(this.eventTag.childLabelList[key].tagValueType == 1){
				this.eventTag.childLabelList[key].value = '';
				this.eventTag.childLabelList[key].businessId = '';
			}
			if (this.tagPageData.length == 0){
				this.tagPageData = [{
									list: [],
									page_num: 0,
									total: 0,
									loading: false,
									query: '',
									isPage: false,
									}]
			}
			this.queryTagValue(key,'');
		},
		queryTagValue(key, query){
			this.add_like_count = 0
			this.like_query = 0
			this.like_start_page = 0
			this.tagPageData[key].loading = true;
			this.tagPageData[key].query = query;
			let code = this.eventTag.childLabelList[key].categoryId;
			this.queryTagInfoPage({
				category_id_list: [code],
				page_num: 1,
				page_size: 30,
				tag_value:query,
				add_like_count: this.add_like_count,
				like_query: this.like_query,
				like_start_page: this.like_start_page
			},(data = {})=>{
				this.tagPageData[key].total = data.total;
				this.tagPageData[key].page_num = 1;
				let list = data.records
				// 去重
				let result = [];
				let listDict = {};
				for (var i = 0; i < list.length; i++) {
					let item = list[i];
					let businessId = item.businessId;
					if (!listDict[businessId]) {
						listDict[businessId] = true;
						result.push(item);
					}
				}
				this.$set(this.tagPageData[key],'list', result || []);
				this.tagPageData[key].loading = false;
				this.add_like_count = data.addLikeCount
				this.like_query = data.likeQuery
				this.like_start_page = data.likeStartPage
			})
		},
		tagValueScroll(key, num){
			if(num <= 20){
				let copyData = copyDeep(this.tagPageData[key]);
				if(copyData.total > copyData.page_num * 30){
					if(this.tagPageData[key].isPage)return;
					this.tagPageData[key].isPage = true;
					this.queryTagInfoPage({
						add_like_count: this.add_like_count,
						like_query: this.like_query,
						like_start_page: this.like_start_page,
						category_id_list: [this.eventTag.childLabelList[key].categoryId],
						page_num: (copyData.page_num + 1),
						page_size: 30,
						tag_value: copyData.query
					},(data = 'err')=>{
						if(
							data != 'err'
							&& this.tagPageData[key].page_num == copyData.page_num 
							&& copyData.query == this.tagPageData[key].query
						){
							this.tagPageData[key].total = data.total;
							this.tagPageData[key].page_num = copyData.page_num + 1;
							let list = [...this.tagPageData[key].list,...data.records]
							// 去重
							let result = [];
							let listDict = {};
							for (var i = 0; i < list.length; i++) {
								let item = list[i];
								let businessId = item.businessId;
								if (!listDict[businessId]) {
									listDict[businessId] = true;
									result.push(item);
								}
							}
							this.$set(this.tagPageData[key],'list',  result);
							this.add_like_count = data.addLikeCount
							this.like_query = data.likeQuery
							this.like_start_page = data.likeStartPage
						}
						this.tagPageData[key].isPage = false;
					})
				}
			}
		},
		eventTypeChange(code){
			if(!this.EventInfoObj[code])return;
			let data = copyDeep(this.EventInfoObj[code]);
			this.eventTag.emotionDirection.value = data.emotionDirection;
			this.eventTag.emotionLevel.value = data.emotionLevel;
		},
		addChart(type, data = {}){
			data.name = this.chartType[type];
			data.title = '图表库 - ' +  this.chartType[type];
			data.type = 'chart';
			data.chartType = type;
			data.step = true;
			data.maxStep = this.chartStep[type];
			data.dataSelect = this.smartFieldIdObj;
			this.functionBox.push(data)
		},
		closeSetting(){
			this.isShowSettingMSG = false;
		},
		submitSetting(){
			if(this.isGetSetting)return;
			this.isGetSetting = true;
			let list = this.getCheckTree();
			let obj = {
				dataColumnList: list,
				dataType: 1,
				newsTemplateId: this.req.id
			}
			let url = '/tm/mw/newsTemplate/saveQuickSettings';
			this.$http.post(url, obj).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.$hMessage.success('保存成功');
					this.closeSetting();
					this.getSearchSmartField();
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetSetting = false;
			}).catch(err=>{
				this.isGetSetting = false;
				this.$hMessage.error('网络错误，保存失败');
			})
		},
		getCheckTree(){
			let treeObj = $.fn.zTree.getZTreeObj("ZNZDSetting");
			let checkNodes = treeObj.getCheckedNodes(true);
			let checkedArr= [];
			checkNodes.forEach((item,i)=>{
				checkedArr.push({fieldId:item.id,fieldType:item.type})
			})
			return checkedArr;
		},
		getSmartFieldTreeWithCheckedList(){
			if(!this.req.id){
				this.$hMessage.error('请保存后，再进行个性化设置');
				return;
			}
			if(this.isGetSetting)return;
			this.isGetSetting = true;
			this.isShowSettingMSG = true;
			let url = '/tm/mw/newsTemplate/getSmartFieldTreeWithCheckedList?newsTemplateId='+ this.req.id;
			this.$http.post(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let list = oTmp.data || [];
					$.fn.zTree.init($("#ZNZDSetting"), this.znzdSetting, list);
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetSetting = false;
			}).catch(err=>{
				this.isGetSetting = false;
				this.$hMessage.error('网络错误，获取智能字段失败');
			})
		},

		//弹框智能字段
		onSearchSmartFieldMsg(){
			this.smartFieldMsgKeyword = copyDeep(this.smartFieldTreeMsgKeyword);
			this.getSearchSmartFieldMsg();
		},
		//搜索弹框智能字段
		getSearchSmartFieldMsg(){
			if(this.isTreeSmartFieldMsgLoading)return;
			this.isTreeSmartFieldMsgLoading = true;
			let url = '?newsTemplateId=&dataType=1&name=' + encodeURIComponent(this.smartFieldMsgKeyword);
			this.getSearchSmartList(url, (oTmp)=>{
				this.isTreeSmartFieldMsgLoading = false;
				if(oTmp){
					if(oTmp.status == this.$api.SUCCESS){
						let list =  oTmp.data || [];
						this.smartFieldMsgTreeList = list;
						this.setSmartFieldSubObj(list);
						this.smartFieldMsgTree = $.fn.zTree.init($("#msgZNZD"), this.setting, list);
					}else{
						this.$hMessage.error(oTmp.msg);
					}
				}else{
					this.$hMessage.error('获取智能字段失败');
				}
			})
		},
		setSmartFieldSubObj(list){
			for(let i = 0, len = list.length; i <len ; i++ ){
				if(list[i].type == 1){
					this.smartFieldObj[list[i].realCode] = copyDeep(list[i]);
					this.smartFieldIdObj[list[i].id] = copyDeep(list[i]);
				}
				if(list[i].children && list[i].children.length > 0){
					this.smartFieldSubObj[list[i].code] = list[i].children;
					this.setSmartFieldSubObj(list[i].children)
				}
			}
		},
		onSearchfnMsg(){
			this.fnMsgKeyword = copyDeep(this.fnMsgTreeKeyword);
			this.getSearchfnMsg();
		},
		getSearchfnMsg(){
			let data = this.SearchFnTreeData(this.fnMsgKeyword ,this.fnList);
			let msgTree = $.fn.zTree.init($("#msgHSK"), this.fnSetting, data);
			let nodes = msgTree.transformToArray(msgTree.getNodes());
			if(nodes.length > 0){
				for(let i = 0, len = nodes.length; i < len; i++){
					if(nodes[i].code == 'ifelse'){
						msgTree.hideNode(nodes[i]);
						break;
					}
				}
			}
		},
		//点击搜索智能字段
		onSearchSmartField(){
			this.smartFieldKeyword = copyDeep(this.smartFieldtreeKeyword);
			this.getSearchSmartField();
		},
		//请求智能字段搜索
		getSearchSmartField(){
			if(this.isTreeSmartFieldLoading)return;
			this.isTreeSmartFieldLoading = true;
			let url = '?newsTemplateId=' + this.req.id + '&dataType=1&name=' + encodeURIComponent(this.smartFieldKeyword);
			this.getSearchSmartList(url, (oTmp)=>{
				this.isTreeSmartFieldLoading = false;
				if(oTmp){
					if(oTmp.status == this.$api.SUCCESS){
						let list =  oTmp.data || [];
						this.smartFieldList = list;
						this.setSmartFieldSubObj(list);
						let tree = $.fn.zTree.init($("#SmartFieldTree"), this.setting, this.smartFieldList);
					}else{
						this.$hMessage.error(oTmp.msg);
					}
				}else{
					this.$hMessage.error('获取智能字段失败');
				}
			})
		},
		onSearchTable(){
			this.tableKeyword = copyDeep(this.tableTreeKeyword);
			this.getSearchTable();
		},
		getSearchTable(){
			if(this.isTreeTableLoading)return;
			this.isTreeTableLoading = true;
			let url = '?newsTemplateId=' + this.req.id + '&dataType=2&name=' + encodeURIComponent(this.tableKeyword);
			this.getSearchSmartList(url, (oTmp)=>{
				this.isTreeTableLoading = false;
				if(oTmp){
					if(oTmp.status == this.$api.SUCCESS){
						let list =  oTmp.data || [];
						let arr = [];
						this.setSmartFieldSubObj(list);
						for(let i = 0, len = list.length; i < len; i++){
							if(list[i].pId == '0'){
								list[i].children = null;
								arr.push(list[i])
							}
						}
						
						let tree = $.fn.zTree.init($("#TableTree"), this.tableSetting, arr);
					}else{
						this.$hMessage.error(oTmp.msg);
					}
				}else{
					this.$hMessage.error('获取智能表格失败');
				}
			})
		},
		getSearchSmartList(data , cb){
			let url = '/tm/mw/newsTemplate/getSmartFieldTreeList'+ data;
			this.$http.post( url).then((res)=>{
				let oTmp = res.data;
				cb(oTmp);
			}).catch(err=>{
				cb();
			})
		},
		onSearchFn(){
			this.fnKeyword = copyDeep(this.fnTreeKeyword);
			this.SearchFnTree();
		},
		SearchFnTree(){
			let data = this.SearchFnTreeData(this.fnKeyword ,this.fnList);
			let msgTree = $.fn.zTree.init($("#fnTree"), this.fnSetting, data);
		},
		SearchFnTreeData(keyword, list){
			let data = copyDeep(list);
			if(keyword){
				let arr = this.setFnSearchData(data, keyword);
				return arr;
			}else{
				return data;
			}
		},
		setFnSearchData(list , Keyword){
			let arr = [];
			for(let i = 0,len = list.length;i < len; i++){
				if(list[i].name.indexOf(Keyword) != -1){
					arr.push(list[i]);
					continue;
				}
				if(list[i].children && list[i].children.length > 0){
					list[i].children = this.setFnSearchData(list[i].children , Keyword);
					if(list[i].children){
						arr.push(list[i]);
					}
				}
			}
			if(arr.length > 0){
				return arr;
			}else{
				return null;
			}
		},
		inputChange() {
			this.req.deduplicationInterval = this.req.deduplicationInterval.toString().replace(/[^\d]/g, '');
			if(this.req.deduplicationInterval == '0'){
				this.req.deduplicationInterval = '';
			}
		},
		fnCancel(data){
			this.fnIndex = -1;
			this.dataIndex = -1;
			this.txtIndex = -1;
			this.functionBox.splice(-1,1);
		},
		fnSubmit(data){
			let html = '';
			if(data.type == 'table'){
				if(data.fn){
					html = data.fn;
				}else{
					this.functionBox.splice(-1,1);
					return;
				}
			}else if(data.type == 'chart'){
				
			}else{
				if(data.fnType == 'function_1'){
					html += data.code + '(';
					for(let i = 0, len = data.children.length; i < len; i++ ){
						let arr = data.children[i];
						for(let k = 0, lens = arr.length; k < lens; k++){
							if(!arr[k].value){
								this.$hMessage.error('所有参数必填，请检查！');
								return false;
							}
							html += arr[k].value;
						}
						if(i != len - 1){
							html +=',';
						}
					}
					html += ')';
				}else if(data.code == 'ifelse'){
					let len = data.children.length;
					if(len <= 1){
						this.$hMessage.error('请添加条件！');
						return false;
					}
					for(let i = 0; i < len; i++ ){
						let arr = data.children[i];
						if(i == 0){
							html += '<#if ';
						}else if (i == len - 1){
							continue
						}else{
							html += '<#elseif '
						}
						for(let k = 0, lens = arr.length; k < lens; k++){
							if(!arr[k].value){
								this.$hMessage.error('所有参数必填，请检查！');
								return false;
							}
							if(k == 0){
								html += arr[k].value + ' >';
							}else{
								let v = arr[k].value;
								if(v.slice(0,1) == '"' && v.slice(-1) == '"'){
									html += v.slice(1,-1);
								}else{
									html += '${' + v + '}';
								}
							}
						}
					}
					let elseHtmlArr = data.children[len-1]
					let elsehtml = elseHtmlArr[0]
					if (!elsehtml.value){
						this.$hMessage.error('所有参数必填，请检查！');
						return
					}else{
						html += `<#else>${elsehtml.value}`
					}
					html += '<#endif>';
				}
			}
			if(data.type != 'table' && data.type != 'chart' ){
				if(data.key > 0){
					let fnIndex = data.fnIndex;
					let dataIndex = data.dataIndex;
					let txtIndex = data.txtIndex;
					this.functionBox[fnIndex].children[dataIndex][txtIndex].value = html;
					this.functionBox.splice(-1,1);
					return false;
				}else if(data.code != 'ifelse'){
					html = '${' + html + '}';
				}
			}
			if(this.activeEditor || this.tagValueActive !== null ){
				let url = '/tm/mw/function/encryption';
				if(this.isMd5)return;
				this.isMd5 = true;
				let obj = { originalData: html };
				if(data.type == 'chart'){
					url = '/tm/mw/function/encChart';
					obj = data.chart;
				}
				this.$http.post(url,obj).then((res)=>{
					let oTmp = res.data;
					if(oTmp.status == this.$api.SUCCESS){
						let otmStr =  oTmp.data || '';
						if(data.type == 'table'){
							otmStr = '<span title="智能表格('+ data.name +')">'+ otmStr +'</span>'
						}else if(data.type == 'chart'){
							otmStr = '<span title="图表库('+ data.name +')">'+ otmStr +'</span>'
						}else{
							otmStr = '<span title="函数">' + otmStr + '</span>'
						}
						if(this.activeEditor){
							this[this.activeEditor].insertHtml(otmStr);
						}else{
							this.tagValueAddTag(otmStr);
						}
						this.functionBox.splice(-1,1);
					}else{
						this.$hMessage.error(oTmp.msg);
					}
					this.isMd5 = false;
				}).catch(err=>{
					this.isMd5 = false;
					this.$hMessage.error('数据加密失败！');
				})
				return;
			}
			this.functionBox.splice(-1,1);
		},
		clickTabs(key){
			this.activeTabsIndex = key;
		},
		shangeAssignmentStrategy(status){
			this.req.assignmentStrategy = status;
			let arr = copyDeep(this.req.dataTemplateList);
			let dataTemplateList = copyDeep(this.dataTemplateList);
			this.dataTemplateList = copyDeep(arr);
			if(dataTemplateList.length == 0){
				for(let i =0,len = arr.length; i < len; i++){
					if(status == 1){
						arr[i].tableType = 2;
						this.isDisabledTable = false;
						this.isShowRelevance = false;
					}else{
						arr[i].tableType = 5;
					}
				}
				dataTemplateList = copyDeep(arr);
			}
			this.req.dataTemplateList = copyDeep(dataTemplateList);
		},
		submittableType(status){
			if(!status){
				this.isShowRelevance = false;
			}else{
				let list = this.req.dataTemplateList;
				let mian = []
				for(let i = 0, len = list.length; i < len; i++){
					if(list[i].tableType == 1){
						mian.push(list[i].dataTemplateId);
					}
				}
				if(mian.length > 1){
					this.$hMessage.error('只能存在一个主表');
					return;
				}else if(mian.length == 0){
					this.$hMessage.error('请选择主表');
					return;
				}
				this.mianTableId = mian[0];
				if(this.mianTableId != this.formerMianTableId){
					this.req.dataTemplateRuleList = [
						{ childConlumnId: "",
						 childTableId: "",
						 mainConlumnId: "",
						 mainTableId: mian[0] }
					];
					this.formerMianTableId = mian[0];
				}
				this.isShowRelevance = true;
			}
			this.isDisabledTable = status;
		},
		delTableType(k){
			this.req.dataTemplateList.splice(k,1);
		},
		delChildTable(k){
			this.req.dataTemplateRuleList.splice(k,1);
			/*if(this.req.dataTemplateRuleList.length == 0){
				this.addChildTable();
			}*/
		},
		addChildTable(){
			this.req.dataTemplateRuleList.push(
					{
						childConlumnId: "",
						childTableId: "",
						mainConlumnId: "",
						mainTableId: this.mianTableId
					}
				)
		},
		next(){
			let title = this.titleEditor.document.getBody().getText();
			let summary = this.summaryEditor.document.getBody().getText();
			let content = this.contentsEditor.document.getBody().getText();
			if(!this.newsTitle || !title){
				this.$hMessage.error('新闻标题不能为空！');
				return;
			}
			/*if(!this.newsSummary || !summary){
				this.$hMessage.error('新闻摘要不能为空！');
				return;
			}*/
			if(!this.newsContents || !content){
				this.$hMessage.error('新闻正文不能为空！');
				return;
			}
			this.isLoading = true;
			let url = '/tm/mw/newsTemplate/decrypt';
			this.$http.post(url,{ title,summary,content }).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let { title,summary,content } = oTmp.data;
					this.nextStep(title, summary, content);
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isLoading = false;
			}).catch(err=>{
				this.isLoading = false;
				this.$hMessage.error('网络异常，解密失败！');
			})
		},
		nextStep( title,summary,content ){
			let obj = this.smartFieldSubObj;
			let dataTemplateList = this.req.dataTemplateList;
			let arr = [];
			let del = [];
			for(let i = 0, len = dataTemplateList.length; i < len ; i++){
				let id = dataTemplateList[i].dataTemplateId;
				let code = this.smartFieldIdObj[id].realCode;
				if(title.indexOf(code) == -1 
					&& summary.indexOf(code) == -1 
					&& content.indexOf(code) == -1){
					del.unshift(i)
				}else{
					arr.push(id);
				}
			}
			if(del.length > 0){
				for(let i = 0, len = del.length; i < len ; i++){
					this.req.dataTemplateList.splice(del[i],1)
				}
				this.isShowRelevance = false;
				this.isDisabledTable = false;
			}
			for(let key in obj){
				if((title.indexOf(key) != -1 
					|| summary.indexOf(key) != -1 
					|| content.indexOf(key) != -1) 
					&& this.smartFieldObj[key] 
					&& arr.indexOf(this.smartFieldObj[key].id) == -1){
					let tableType = 2;
					if(this.req.assignmentStrategy == 2){
						tableType = 5;
					}
					this.req.dataTemplateList.push({dataTemplateId: this.smartFieldObj[key].id, tableType: tableType });
					this.isShowRelevance = false;
					this.isDisabledTable = false;
				}
			}
			this.step = 1;
		},
		createSmartFieldTree(){
			let tree = $.fn.zTree.init($("#SmartFieldTree"), this.setting, this.smartFieldList);
			this.createSmartFieldTreeMsg();
			//this.treeModel = tree;
		},
		createSmartFieldTreeMsg(txt = ''){
			let list = copyDeep(this.smartFieldMsgTreeList);
			if(txt){
				for(let i = 0, len = list.length; i < len; i++){
					if(txt.indexOf(list[i].code) != -1){
						list[i].open = true;
					}
				}
			}
			let tree = $.fn.zTree.init($("#msgZNZD"), this.setting, list);
			if(txt){
				let nodes = tree.transformToArray(tree.getNodes());
				if(nodes.length > 0){
					for(let i = 0, len = nodes.length; i < len; i++){
						if(nodes[i].code != nodes[i].realCode && nodes[i].code.indexOf(txt) != -1){
							tree.selectNode(nodes[i]);
							break;
						}
					}
				}
			}
		},
		createTableTree(){
			let arr = [];
			for(let i = 0, len = this.smartFieldList.length; i < len; i++){
				if(this.smartFieldList[i].pId == '0'){
					arr.push(this.smartFieldList[i])
				}
			}
			let tree = $.fn.zTree.init($("#TableTree"), this.tableSetting, arr);
			//this.treeModel = tree;
		},
		TableBeforeClick(zTreeId, treeNode){
			return true;
		},
		onTableClickTree(event, zTreeId, treeNode){
			let data = copyDeep(this.smartFieldIdObj[treeNode.id]);
			this.showTableFn(data)
		},
		showTableFn(data){
			data.children = this.smartFieldSubObj[data.realCode] ? copyDeep(this.smartFieldSubObj[data.realCode]) : [];
			data.key = this.functionBox.length;
			data.title = '智能表格 - ' +  data.name;
			data.type = 'table';
			this.functionBox.push(data)
		},
		getSmartFieldList(){
			return
			let url = '/tm/mw/newsTemplate/getSmartFieldList';
			this.$http.get( url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let list =  oTmp.data || [];
					let obj = {};
					for(let i = 0, len = list.length; i <len ; i++ ){
						if(!obj[list[i].pCode]){
							obj[list[i].pCode] = [];
						}
						obj[list[i].pCode].push(list[i]);
						if(list[i].type == 1){
							this.smartFieldObj[list[i].realCode] = copyDeep(list[i]);
							this.smartFieldIdObj[list[i].id] = copyDeep(list[i]);
						}
					}
					this.smartFieldList = list;
					this.smartFieldSubObj = obj;
					this.createSmartFieldTree();
					this.createTableTree();
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.loadingSmartField = false;
			}).catch(err=>{
				this.loadingSmartField = false;
				this.$hMessage.error('获取智能字段失败');
			})
		},

		titleInstanceReadyCallback({ editor }){
			this.titleEditor = editor;
			let _this = this;
			//反推函数
			editor.commands.fn.exec = function (e) {
				var text = editor.getSelection().getSelectedText();
				if(text){
					_this.resolveStrToFunction(text);
				}
			};
			setTimeout(()=>{
				this.titleEditorOK = true;
			},300)
		},
		summaryInstanceReadyCallback({ editor }){
			this.summaryEditor = editor;
			let _this = this;
			//反推函数
			editor.commands.fn.exec = function (e) {
				var text = editor.getSelection().getSelectedText();
				if(text){
					_this.resolveStrToFunction(text);
				}
			};
			setTimeout(()=>{
				this.summaryEditorOK = true;
			},300)
		},
		contentsInstanceReadyCallback({ editor }){
			let _this = this;
			this.contentsEditor = editor;
			//反推函数
			editor.commands.fn.exec = function (e) {
				var text = editor.getSelection().getSelectedText();
				if(text){
					_this.resolveStrToFunction(text);
				}
			};

			setTimeout(()=>{
				this.contentsEditorOK = true;
			},300)
		},
		onFocusTitle(){
			this.activeEditor = 'titleEditor';
		},
		onFocusSummary(){
			this.activeEditor = 'summaryEditor';
		},
		onFocusContents(){
			this.activeEditor = 'contentsEditor';
		},
		zTreeBeforeClick(zTreeId, treeNode){
			if(treeNode.type == 1){
				return false;
			}
			//函数库调用智能字段
			if(zTreeId == 'msgZNZD'){
				let fnIndex = this.fnIndex;
				let dataIndex = this.dataIndex;
				let txtIndex = this.txtIndex;
				this.functionBox[fnIndex].children[dataIndex][txtIndex].value = treeNode.pCode + '["' + treeNode.realCode + '"]';
				this.closeMsgFn();
				return false;
			}
			return true;
		},
		onClickTree(event, zTreeId, treeNode){
			let html = '<span class="mark" title="'+ treeNode.pName +'['+ treeNode.name +']">'+ treeNode.code +'</span>';
			if(this.activeEditor){
				this[this.activeEditor].insertHtml(html);
			}else{
				this.tagValueAddTag(html);
			}
		},
		submit(isPreview = false){
			this.$refs['temForm'].validate((valid) => {
				if (valid) {
					let title = this.titleEditor.document.getBody().getText();
					let summary = this.summaryEditor.document.getBody().getText();
					let content = this.contentsEditor.document.getBody().getText();
					if(!this.newsTitle || !title){
						this.$hMessage.error('新闻标题不能为空！');
						return;
					}
					/*if(!this.newsSummary || !summary){
						this.$hMessage.error('新闻摘要不能为空！');
						return;
					}*/
					if(!this.newsContents || !content){
						this.$hMessage.error('新闻正文不能为空！');
						return;
					}
					this.req.title = this.titleEditor.getData();
					this.req.summary = this.summaryEditor.getData();
					this.req.content = this.contentsEditor.getData();
					this.req.label = this.eventTag;
					if(isPreview){
						this.preview();
					}else{
						this.setSave();
					}
				}
			})
		},
		setSave(){
			if(this.isLoading)return;
			this.isLoading = true;
			let url = '/tm/mw/newsTemplate/save';
			let req = copyDeep(this.req);
			if(req.assignmentStrategy == 2){
				req.dataTemplateRuleList = [];
			}
			this.$http.post( url, req).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let urls = this.$route.path;
					this.$hMessage.success('保存成功');
					this.isCopy = false;
					let id = oTmp.data;
					this.req.id = id;
					this.id = id;
					this.$router.push( urls+'?id='+ oTmp.data);
					this.$store.commit('SAVE_TAB_NAME',{  path: this.$route.path, name: '新闻模板 - 编辑' });
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isLoading = false;
			}).catch(err=>{
				this.isLoading = false;
				this.$hMessage.error('保存失败');
			})
		},
		preview(){
			if(this.isLoading)return;
			this.isLoading = true;
			let url = '/tm/mw/newsTemplate/preview';
			let { req } = this;
			this.$http.post( url, req).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let id = oTmp.data;
					this.$router.push('/robotwriting/newstemplate/preview?id=' + id);
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isLoading = false;
			}).catch(err=>{
				this.isLoading = false;
				this.$hMessage.error('预览失败');
			})
		},
		getDetail(){
			if(this.isLoading)return;
			this.isLoading = true;
			this.eventTag = {
				eventType: {
					type: '1',
					value: '',
				},
				emotionDirection: {
					type: '1',
					value: '',
				},
				emotionLevel:{
					type: '1',
					value: '',
				},
				childLabelList:[{
					categoryId:'',
					type: '2',
					value: '',
					businessId: '',
				}]
			}
			let url = '/tm/mw/newsTemplate/getById?templateId=' + this.id;
			this.$http.get( url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data ? oTmp.data : {};
					if(this.isCopy){
						data.id = '';
						data.templateName = data.templateName + ' - 复制';
					}
					for(let i = 0, len = data.dataTemplateList.length; i < len; i++){
						if(data.dataTemplateList[i].tableType == 1){
							this.formerMianTableId = data.dataTemplateList[i].dataTemplateId;
							this.mianTableId = data.dataTemplateList[i].dataTemplateId;
							break;
						}
					}
					this.insertHtmlTitle(data.title);
					this.insertHtmlSummary(data.summary);
					this.insertHtmlContents(data.content);
					if(data.label){
						let childLabelList = data.label.childLabelList || [];
						let tagPageData = []
						for(let i = 0, len = childLabelList.length; i < len; i++){
							tagPageData.push(
								{
									list: [],
									page_num: 0,
									total: 0,
									loading: false,
									query: '',
									isPage: false,
								}
							)
						}
						this.tagPageData = tagPageData;
						this.$nextTick(()=>{
							this.eventTag = copyDeep(data.label);
						})
					}
					this.req = data;
					this.req.deduplicationInterval = this.req.deduplicationInterval.toString();
					this.reqMd5 = md5(JSON.stringify(data));
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isLoading = false;
			}).catch(err=>{
				this.isLoading = false;
				this.$hMessage.error('获取新闻模板详情失败');
			})
		},
		insertHtmlTitle(data){
			if(this.titleEditorOK){
				this.newsTitle = data;
				this.titleEditor.setData(data);
				setTimeout(()=>{
					if(!this.newsTitle){
						this.insertHtmlTitle(copyDeep(this.req.title));
					}
				},300)
			}else{
				setTimeout(()=>{
					this.insertHtmlTitle(data);
				},100)
			}
		},
		insertHtmlSummary(data){
			if(this.summaryEditorOK){
				this.newsSummary = data;
				this.summaryEditor.setData(data);
				setTimeout(()=>{
					if(!this.newsSummary && this.newsSummary != data){
						this.insertHtmlSummary(copyDeep(this.req.summary));
					}
				},300)
			}else{
				setTimeout(()=>{
					this.insertHtmlSummary(data);
				},100)
			}
		},
		insertHtmlContents(data){
			if(this.contentsEditorOK){
				this.newsContents = data;
				this.contentsEditor.setData(data);
				setTimeout(()=>{
					if(!this.newsContents){
						this.insertHtmlContents(copyDeep(this.req.content));
					}
				},300)
			}else{
				setTimeout(()=>{
					this.insertHtmlContents(data);
				},100)
			}
		},
		init(){
			let { id, copy } = this.$route.query;
			let pathName = '新闻模板 - 新增';
			if(id){
				if(this.id == id && !this.isCopy)return;
				this.id = id;
				this.req.id = id;
				pathName = '新闻模板 - 编辑';
			}
			this.$store.commit('SAVE_TAB_NAME',{  path: this.$route.path, name: pathName });
			if(copy){
				if(this.id == copy && this.isCopy)return;
				this.id = copy;
				this.req.id = '';
				this.isCopy = true;
			}else{
				this.isCopy = false;
			}
			if(!id && !copy){
				if(!this.isMounted && !this.id){
					return;
				}
				this.id = '';
				this.req = {
					id: '',
					templateName: '',
					remark: '',
					assignmentStrategy: 1,
					title: '',
					summary: '',
					content: '',
					dataTemplateList: [],
					dataTemplateRuleList: [],
					deduplicationStrategy: 1,
					deduplicationCycle: 1,
					deduplicationInterval: '',
				}
				this.eventTag = {
					eventType: {
						type: '1',
						value: '',
					},
					emotionDirection: {
						type: '1',
						value: '',
					},
					emotionLevel:{
						type: '1',
						value: '',
					},
					childLabelList:[{
						categoryId:'',
						type: '2',
						value: '',
						businessId: '',
					}]
				}
				this.initExtend();
				this.reqMd5 = '';
			}
			if(this.id){
				this.initExtend();
				this.getDetail();
			}
		},
		initExtend(){
			this.newsTitle = '';
			this.newsSummary = '';
			this.newsContents = '';
			this.step = 0;
			this.mianTableId = '';
			this.formerMianTableId = '';
			this.isShowRelevance = true;
			this.isDisabledTable = true;
			this.dataTemplateList = [];
			this.$refs['temForm'].resetFields();
			this.$refs['temsForm'].resetFields();
		},
		//取消
		cancel(isVerify = true){
			if(isVerify == false){
				this.$store.commit("DEL_TAB", this.$route.path);
				this.$router.push('/robotwriting/newstemplate');
			}else{
				this.req.title = this.titleEditor.getData();
				this.req.summary = this.summaryEditor.getData();
				this.req.content = this.contentsEditor.getData();
				let reqMd5 =  md5(JSON.stringify(this.req));
				if(reqMd5 == this.reqMd5){
					this.cancel(false)
				}else{
					this.$hMsgBox.confirm({
						title: '温馨提示',
						content: '数据暂未保存，确定退出？',
						onOk: ()=>{
							this.cancel(false);
						}
					})
				}
			}
		},
		getFunctionList(){
			this.isTreeFnLoading = true;
			let url = '/tm/mw/function/getFunctionTree';
			this.$http.get( url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data || [];
					this.fnList = data;
					this.getSearchfnMsg();
					this.SearchFnTree();
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isTreeFnLoading = false;
				this.isLoading = false;
			}).catch(err=>{
				this.isLoading = false;
				this.isTreeFnLoading = false;
				this.$hMessage.error('获取函数库失败');
			})
			
		},
		fnBeforeClick(zTreeId, treeNode){
			if(treeNode.type == 1){
				return false;
			}
			if(zTreeId == 'msgHSK'){
				this.functionBoxData(treeNode);
				return false;
			}
			return true;

		},
		onfnClickTree(event, zTreeId, treeNode){
			this.functionBoxData(treeNode);
		},
		functionBoxData(treeNode){
			treeNode = copyDeep(treeNode);
			let data = {};
			data = treeNode;
			data.children = treeNode.paramList;
			data.key = this.functionBox.length;
			data.title = '函数库 - ' + treeNode.name;
			data.type = 'comfn';
			data.fnIndex = this.fnIndex;
			data.dataIndex = this.dataIndex;
			data.txtIndex = this.txtIndex;
			data.fnType = treeNode.dialogType;
			this.closeMsgFn();
			this.functionBox.push(data)
		},
		onFnMore( fnIndex, dataIndex, txtIndex ){
			this.fnIndex = fnIndex;
			this.dataIndex = dataIndex;
			this.txtIndex = txtIndex;
			this.createSmartFieldTreeMsg();
			this.showMsgFn = true;
		},
		onViewFn( fnIndex, dataIndex, txtIndex,  text){
			if(this.isViewFn)return;
			this.isViewFn = true;
			this.fnIndex = fnIndex;
			this.dataIndex = dataIndex;
			this.txtIndex = txtIndex;
			if(text){
				this.resolveStrToFunction(text, false,()=>{
					if(text[0] == '"' && text[0] == text[text.length -1]){
						this.constant = text.substr(1,text.length - 2);
						this.createSmartFieldTreeMsg();
					}else{
						this.createSmartFieldTreeMsg(text);
					}
					this.showMsgFn = true;
					this.isViewFn = false;
				})
			}else{
				this.onFnMore( fnIndex, dataIndex, txtIndex );
				this.isViewFn = false;
			}
		},
		submitMsgFn(){
			let fnIndex = this.fnIndex;
			let dataIndex = this.dataIndex;
			let txtIndex = this.txtIndex;
			this.functionBox[fnIndex].children[dataIndex][txtIndex].value = '"'+ this.constant  +'"';
			this.closeMsgFn();
		},
		closeMsgFn(){
			this.constant = '';
			this.showMsgFn = false;
			this.isViewFn = false;
		},
		/*函数反解析*/
		resolveStrToFunction(text, firstLevel = true , cb = null ){
			let url = '/tm/mw/function/resolveStrToFunction';
			this.$http.post(url,{value: text, firstLevel}).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data.returnValue || {};
					if(oTmp.data.dialogType == 'table'){
						let item = copyDeep(this.smartFieldObj[data.datatemplateCode]);
						item.theme = data.theme;
						item.showIndex = data.showIndex;
						item.active = data.columnCodes || [];
						this.showTableFn(item)
					}else if(oTmp.data.dialogType == 'chart'){
						let chart = oTmp.data.returnValue || {};
						this.addChart(chart.chartType, chart)
					}else if(oTmp.data.dialogType == 'no_dialog'){
						if(cb){
							cb()
						}else{
							this.$hMessage.error('这不是一个函数');
						}
					}else{
						this.functionBoxData(data)
					}
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isViewFn = false;
			}).catch(err=>{
				this.isViewFn = false;
				this.$hMessage.error('函数反解析失败');
			})
		},
		queryTagInfoPage(data, cb){
			let url = '/tm/mw/enum/queryTagInfoPage';
			this.$http.post(url, data).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					cb(oTmp.data)
				}else{
					cb()
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				cb()
				this.$hMessage.error('网络异常，获取标签失败！');
			})
		},
		getNewsTemplateMarkList(){
			let url = '/tm/mw/enum/getNewsTemplateMarkList';
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data || {};
					let {emotionDirectionList = [],emotionLevelList =[] } = data
					for (let item of emotionDirectionList){
						// item.code = item.code.toString()
						item.value = item.code.toString()
						item.label = item.name
					}
					for (let item of emotionLevelList){
						// item.code = item.code.toString()
						item.value = item.code.toString()
						item.label = item.name
					}
					// this.eventKeyList[1].dataList = data.emotionDirectionList || [];
					// this.eventKeyList[2].dataList = data.emotionLevelList || [];
					let list = data.eventList || [];
					for(let i = 0, len = list.length; i <len; i++){
						let item = list[i]
						this.EventInfoObj[item.code] = item;
						item.value = item.code
						item.label = item.name
					}
					this.eventKeyList[1].dataList = emotionDirectionList;
					this.eventKeyList[2].dataList = emotionLevelList;
					this.eventKeyList[0].dataList = list;
					this.TagCategoryTree = data.tagCategoryTree || [];
				}else{
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				cb()
				this.$hMessage.error('网络异常，获取打标相关数据失败！');
			})
		}
	},
	mounted() {
		this.isMounted = true;
		this.getNewsTemplateMarkList();
		//this.getSmartFieldList();
		this.getSearchSmartField();
		this.getSearchSmartFieldMsg();
		this.getSearchTable();
		this.getFunctionList();
		this.init();
	},
	activated: function(){
		this.contentsEditorOK = false;
		this.isMounted = false;
		this.getNewsTemplateMarkList();
		this.getSmartFieldList();
		this.getSearchSmartField();
		this.getSearchSmartFieldMsg();
		this.getSearchTable();
		this.init();
		//this.getFunctionList();
		this.isShowEditor = true;
	},
	beforeRouteLeave(to, form, next){
		this.titleEditor.destroy();
		this.summaryEditor.destroy();
		this.contentsEditor.destroy();
		this.isShowEditor = false;
		this.tagPageData = [
			{
				list: [],
				page_num: 0,
				total: 0,
				loading: false,
				query: '',
				isPage: false,
			}
		],
		this.eventKeyList =  
		[{
			'key': 'eventType',
			'title1': '事件类型',
			'title2': '事件类别值',
			'dataList': []
		},
		{
			'key': 'emotionDirection',
			'title1': '情感方向类型',
			'title2': '情感方向值',
			'dataList': []
			
		},
		{
			'key': 'emotionLevel',
			'title1': '情感级别类型',
			'title2': '情感级别值',
			'dataList': []
		}]
		
		next();
	}
}
</script>
<style type="text/css" scoped>
.addnewstemplate{
	position: relative;
}
.contentsbox {
	display: flex;
	height: 535px;
	margin-bottom: 10px;
}
.addnewstemplate .leftbox{
	width: 250px;
	margin-right: 10px;
	height: 100%;
	overflow-y: hidden;
	background: #fff;
	border: 1px solid #dfdfdf;
}
.addnewstemplate .leftbox>>> .h-tabs{
	
}
.addnewstemplate .leftbox>>> .h-tabs-bar{
	margin-bottom: 0;
}
.addnewstemplate .leftbox>>> .h-tabs-tab{
	padding: 8px 8px;
}
.addnewstemplate .rightbox{
	flex: 1;
	height: 100%;
	overflow-y: auto;
	border: 1px solid #dfdfdf;
	padding: 0 5px;
	background: #fff;
}
.addnewstemplate .rightbox > div{
	width: calc(100% - 4px);
}
.addnewstemplate .rightbox .title{
	line-height: 1.8;
	font-size: 14px;
}
.rightbox .summary,.rightbox .contents{
	margin-top: 10px;
}
.topbox{
	margin-bottom: 10px;
}
.btnbox{
	text-align: center;
	margin-bottom: 10px;
}
.smart-field-box{
	width: 100%;
	height: calc(100% - 37px);
	overflow: auto;
	position: relative;
}
.smart-field-tree-box{
	width: 100%;
	height: calc(100% - 43px);
	overflow: auto;
	position: relative;
}
.rule .setting > li{
	line-height: 1.2;
	padding: 5px 0;
}
.rule .name{
	width: 200px;
	display: inline-block;
	margin-right: 10px;
	vertical-align: middle;
}
.rule .btn{
	color: #298DFF;
	cursor: pointer;
	vertical-align: middle;
}
.rule .btn:hover{
	color: #107fff;
}
.rule .equal{
	vertical-align: middle;
	padding: 0 10px;
}
.rule .select{
	display: inline-block;
	width: 150px;
}
.rule .btntable{
	padding: 2px 8px;
}
.steps{
	text-align: center;
}
.steps .h-steps-item{
	text-align: left;
}
.steps .h-steps-item:last-child{
	width: auto!important;
}
.fn-contents{
	padding-top: 15px;
}
.fn-contents dl{
	display: flex;
	border-left: 1px solid #dfdfdf;
}
.fn-contents dl dt{
	width: 250px;
	border-top: 1px solid #dfdfdf;
	border-right: 1px solid #dfdfdf;
	border-bottom: 1px solid #dfdfdf;
	position: relative;
}
.fn-contents dl dt h2{
	line-height: 32px;
	padding: 0 15px;
	font-weight: 600;
	color: #000;
	background: #dfdfdf;
	border-bottom: 1px solid #dfdfdf;
}
.fn-contents .dt-search{
	display: flex;
	position: relative;
	flex-direction:column;
}
.fn-contents .dt-search .tree{
	/*height: 267px;*/
}
.fn-contents .tree{
	height: 300px;
	overflow: auto;
	width: 100%;
}
.fn-contents .tree.input{
	padding: 10px;
}
>>>.MsgFn-vertical{
	z-index: 2000 !important;
}
.tree-search-input{
	padding: 6px 10px;
	height: 42px;
	border-bottom: 1px dotted #dfdfdf;
}
.tree-search-input>>> .h-input-wrapper{
	width: 125px;
}
.tree-search-input>>> .h-input-wrapper input{
	height: 28px;
}
.tree-search-input>>> .h-btn{
	padding: 0;
	height: 28px;
	line-height: 28px;
	vertical-align: top;
	width: 40px;
}
.remark-textarea>>> textarea{
	line-height: 22px;
}
.leftbox>>> .icon-android-settings:hover{
	color:#298DFF;
}
>>>.ZNZD-vertical .h-modal-body{
	height: 450px;
	overflow: auto;
	width: 100%;
	padding-top: 16px;
}
.ZNZD-contents{
	position: relative;
}
.marking{
	margin: 10px 0;
}
.marking table{
	width: 100%;
}
.marking table tr{
	height: 32px;
}
.marking table th,.marking table td{
	border: 1px solid #dfdfdf;
	padding: 0 5px;
}
.marking_content{
	padding: 0 10px 10px 10px;
	border: 1px solid #dfdfdf;
}
.marking_content .title{
	margin-top: 10px;
}
.icon-t-b-delete.iconfont.tab-icon-btn{
	color: #F5222D;
}
.tab-add{
	color: #fff;
	border-radius: 50%;
	display: inline-block;
	width: 16px;
	height: 16px;
	text-align: center;
	line-height: 16px;
	background: #298DFF;
	cursor: pointer;
}
.value-list tr{
	height: 100px;
}
.tableContaner{
	display: flex;
}
</style>