<template>
	<div class="newstemplate">
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>模板名称：</dt>
						<dd><h-input placeholder="请输入模板名称" v-model="req.newsTemplateName" ref="newsTemplateName" icon="android-close"  @on-enter="onPageChange(1)" @on-click="shitClearableClick('newsTemplateName','req')"></h-input></dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>更新人：</dt>
						<dd>
							<h-simple-select 	
								v-model="req.updater"
								placeholder="请选择更新人"
								filterable>
								<h-select-block :data="updaterList"></h-select-block>
							</h-simple-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>生成策略词：</dt>
						<dd><h-input placeholder="请输入生成策略词" v-model="req.generationStrategyName" ref="generationStrategyName" @on-enter="onPageChange(1)" icon="android-close" @on-click="shitClearableClick('generationStrategyName','req')"></h-input></dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>状态：</dt>
						<dd>
							<h-select aria-placeholder="状态" placeholder="请选择状态" v-model="req.status" :clearable="false">
								<h-option
									v-for="(item, i) in status"
									:value="item.value"
									:key="i">
									{{ item.name }}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="onPageChange(1)">查询</h-button>
					<h-button type="primary" v-if="activeRoutersButton.indexOf('add') != -1" @click="goAdd">新增模板</h-button>
					<h-button type="primary" v-if="activeRoutersButton.indexOf('export') != -1" @click='getExport'>导出列表</h-button>
					<h-tooltip placement="top-end" content="请选择是否自动刷新表格的数据!">
						<h-switch size="large" v-model="isAutoRefreshTable">
							<div slot="open">
								<span>打开</span>
							</div>
							<div slot="close">
								<span>关闭</span>
							</div>
						</h-switch>
					</h-tooltip>
				</li>
			</ul>
		</search-form>
		<div class="tableConrent">
			<h-table
				size="small"
				@on-row-dblclick="dbClickRow"
				:maxHeight="maxTableHeight"
				class="full-max-height-table"
				:columns="table"
				:data="list"
				:highlight-row="false"
				border>
			</h-table>
			<div class="tab-box">
				<h-page highlight-row size="small" show-elevator show-total show-sizer placement="top" class="page-box"  :page-size-opts="pageSizeOpts" :total="total" :current="req.currentPage" :page-size="req.pageSize" @on-change="onPageChange" @on-page-size-change="onPageSizeChange"></h-page>
			</div>
			<h-spin fix v-if="loadingList">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</h-spin>
		</div>
		<h-msgBox title="是否确认删除模板？" v-model="isShowDelMsgBox" @on-close="closeDel" class-name="vertical-center-modal" :top="0">
			<div class="contents">
				<h-form ref="delForm" :model="deleteData" :rules="modulesRule" :label-width="110">
					<h-form-item prop="Name" label="模块名称：">
						<h-input type="text" v-model.trim="deleteData.Name" autocomplete="off" :placeholder="'请输入“'+ activeDelete.templateName +'”后删除'"></h-input>
					</h-form-item>
				</h-form>
			</div>
			<div slot="footer">
				<h-button type="text" @click="closeDel">取消</h-button>
				<h-button type="info" @click="submitDel" :loading="isSubmitForm">删除</h-button>
			</div>
		</h-msgBox>
		<h-msgBox title="更改生成策略" class-name="modelBox vertical-center-modal" :top="0" :mask-closable="false" @on-close="closeStrategyForm" @on-cancel="closeStrategyForm" v-model="configStrategy">
			<div class="">
				<vue-scroll :ops="ops" style="border: 1px solid #D7DDE4;">
					<div class="Tree">
						<ul id="strategyTree" class="ztree"></ul>
					</div>
				</vue-scroll>
			</div>
			<div slot="footer" class="dispatch_footer">
				<h-button type="text" @click="closeStrategyForm">取消</h-button>
				<h-button type="info" :loading="isSubmitStrategyForm" @click="submitStrategyForm">提交</h-button>	            
			</div>
		</h-msgBox>
		<h-msgBox :title="logName+' - 查看日志'" :mask-closable="false" v-model="isShowLog"class-name="vertical-center-modal" :top="0" :width="720">
			<div class="detail-contents">
				<h-table size="small" :maxHeight="320" class="full-max-height-table" :columns="logtable" :data="logList" :highlight-row="false" border></h-table>
				<div class="tab-box">
					<h-page highlight-row size="small" show-elevator show-total show-sizer placement="top" class="page-box"  :page-size-opts="pageSizeOpts" :total="logTotal" :current="logReq.currentPage" :page-size="logReq.pageSize" @on-change="onPageChangeLog" @on-page-size-change="onPageSizeChangeLog"></h-page>
				</div>
				<h-spin fix v-if="isLogLoading">
					<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
					<div>加载中...</div>
				</h-spin>
			</div>
			<div slot="footer">
				<h-button type="info" @click="isShowLog = false">关闭</h-button>
			</div>
		</h-msgBox>
		<h-msgBox :title="elogName+' - 执行记录'" :mask-closable="false" v-model="isShoweLog"class-name="vertical-center-modal" :top="0" :width="840">
			<div class="elog-contents">
				<h-table size="small" :maxHeight="320" class="full-max-height-table" :columns="elogtable" :data="elogList" :highlight-row="false" border></h-table>
				<div class="tab-box">
					<h-page highlight-row size="small" show-elevator show-total show-sizer placement="top" class="page-box"  :page-size-opts="pageSizeOpts" :total="elogTotal" :current="elogReq.currentPage" :page-size="elogReq.pageSize" @on-change="onPageChangeELog" @on-page-size-change="onPageSizeChangeELog"></h-page>
				</div>
				<h-spin fix v-if="iseLogLoading">
					<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
					<div>加载中...</div>
				</h-spin>
			</div>
			<div slot="footer">
				<h-button type="info" @click="isShoweLog = false">关闭</h-button>
			</div>
		</h-msgBox>
	</div>
</template>
<script>
import $ from 'jquery';
require('@/assets/css/zTreeStyle.css')
require('@/assets/js/jquery.ztree.core.min.js')
require('@/assets/js/jquery.ztree.excheck.min.js')
import { copyDeep } from '@/filters/index'
export default {
	name: 'RobotwritingNewstemplate',
	data () {
		var validatorName = (rule, value, callback)=>{
			if(value != this.activeDelete.templateName){
				callback('名称输入有误');
				return;
			}
			callback();
		};
		return {
			activeRoutersButton: this.$store.state.activeRoutersButton,
			treeRoot: { id: '0', pId: -999, name: '总目录', type: 1, open:true },
			ops:{
				bar: {
				  background: '#D7DDE4',
				  keepShow:true
				},
				rail: {
				  border: '1px solid #D7DDE4',
				  size: '5px'
				},
				scrollButton: {
				  enable: true,
				  background: '#ccc'
				}
			},
			setting: {
				check: {
					enable: true,
					chkStyle: "radio",
					radioType: 'all',
					chkboxType: { "Y" : "p", "N" : "s" },
				},
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
					beforeCheck: this.zTreeBeforeCheck,
					onClick: this.onClickTree,
				}
			},
			activeSelect: {},
			activeSelectKey: '',
			isGetTree: false,
			treeList: [],
			isAutoRefreshTable: true,
			loadingUser: false,
			loadingList: false,
			isSubmitForm: false,
			isShowDelMsgBox: false,
			deleteData: {
				Name: '',
			},
			test: '',
			activeDelete: {},
			pageSizeOpts: [10,20,50,100],
			total: 0,
			page: 1,
			req: {
				currentPage: '',
				newsTemplateName: '',
				generationStrategyName: '',
				updater: '',
				status: '-1',
				currentPage: 1,
				pageSize: 10,
			},
			queryStr: '',
			status: [
				{
					name: '全部',
					value: '-1',
				},
				{
					name: '上线',
					value: '1',
				},
				{
					name: '预上线',
					value: '2',
				},
				{
					name: '下线',
					value: '0',
				}
			],
			tabStatus:['下线','上线','预上线','正在上线中...','正在预上线中...','正在下线中...'],
			changeStatus: [5,3,4],
			table: [
				{
					title: "序号",
					width: 60,
					align: "center",
					render: (h, params) => {
						let index = params.index + 1 + ( (this.page - 1) * this.req.pageSize);
						return h('div', index );
					}
				},
				{
					key: "templateName",
					title: "模板名称",
					render: (h, params) => {
						let row = params.row;
						return h('div',{
							attrs: {
								title: '备注：'+row.remark,
							},
						},row.templateName)
					}
				},
				{
					key: "generationStrategyName",
					title: "生成策略",
					align: "center",
				},
				{
					key: "updaterName",
					title: "更新人",
					align: "center",
				},
				{
					key: "updateTime",
					title: "更新时间",
					align: "center",
				},
				{
					title: "状态",
					align: "center",
					width: 150,
					render: (h, params) => {
						let row = params.row;
						let btn = this.activeRoutersButton;
						let status = this.tabStatus[row.status];
						if(btn.indexOf('switch') == -1 || row.status > 2){
							return h('div', status)
						}
						return h('Tooltip', { 
									props: { placement: 'top' }
								}, [ 
									h('span',{
										class: [
											'tab-icon-btn'
										],
									},status), 
									h('div',
										{
											props: { slot: 'content' }, 
											slot: 'content',
											style: { widthSpace: 'normal' }
										},
										[
											h('span',{
												attrs:{
													style: row.status == 1 ? 'color:#ccc;cursor: unset' : '',
												},
												on:{
													'click':()=>{
														this.setStatus( params.index, 1, row)
													}
												}
											},'上线'),
											h('span',{
												attrs:{
													style: row.status == 2 ? 'color:#ccc;cursor: unset' : '',
												},
												on:{
													'click':()=>{
														this.setStatus( params.index, 2, row)
													}
												}
											},'预上线'),
											h('span',{
												attrs:{
													style: row.status == 0 ? 'color:#ccc;cursor: unset' : '',
												},
												on:{
													'click':()=>{
														this.setStatus( params.index, 0, row)
													}
												}
											},'下线'),
										]
										,)
									]
						)
					}
					
				},
				{
					key: "key",
					title: "操作",
					align: "center",
					width: 220,
					render: (h, params) => {
						let row = params.row;
						let btn = this.activeRoutersButton;
						let configurationBtn,createBtn,copyBtn,executeLogBtn,logBtn,deleteBtn,testBtn;
						if(btn.indexOf('add') != -1){
							configurationBtn = h('span', {
								attrs: {
									"title": '编辑',
								},
								class: [
									'icon-t-b-message',
									'iconfont',	                                     
									'tab-icon-btn'
								],
								on: {
									click: () => {
										this.$router.push('/robotwriting/newstemplate/add?id=' + params.row.id);
									}
								},
							})
						};
						if(btn.indexOf('create') != -1){
							createBtn = h('span', {
								attrs: {
									"title": '更改生成策略',
								},
								class: [
									'icon-settings',
									'iconfont',	                                     
									'tab-icon-btn'
								],
								on: {
									click: () => {
										this.activeSelectKey = params.index;
										this.activeSelect = row;
										this.createTree();
										this.configStrategy = true;
									}
								},
							})
						};
						if(btn.indexOf('add') != -1){
							copyBtn = h('span', {
								attrs: {
									"title": '复制',
								},
								class: [
									'icon-ios-copy-outline',
									'iconfont',	                                     
									'tab-icon-btn'
								],
								on: {
									click: () => {
										this.$router.push('/robotwriting/newstemplate/add?copy=' + params.row.id);
									}
								},
							})
						};
						if(btn.indexOf('executeLog') != -1){
							executeLogBtn = h('span', {
								attrs: {
									"title": '执行记录',
								},
								class: [
									'icon-activity',
									'iconfont',	                                     
									'tab-icon-btn'
								],
								on: {
									click: () => {
										this.elogName = params.row.templateName;
										this.elogReq.currentPage = 1;
										this.elogReq.newsTemplateId = params.row.id;
										this.isShoweLog = true;
										this.geteLog();
									}
								},
							})
						};
						if(btn.indexOf('log') != -1){
							logBtn = h('span', {
								attrs: {
									"title": '查看日志',
								},
								class: [
									'icon-clipboard',
									'iconfont',	                                     
									'tab-icon-btn'
								],
								on: {
									click: () => {
										this.logName = params.row.templateName;
										this.logReq.currentPage = 1;
										this.logReq.recordId = params.row.id;
										this.isShowLog = true;
										this.getLog();
									}
								},
							})
						};
						if(btn.indexOf('delete') != -1){
							deleteBtn = h('span', {
								attrs: {
									"title": '删除',
								},
								class: [
									'icon-t-b-delete',
									'iconfont',	                                     
									'tab-icon-btn'
								],
								style:{
									color:'#F5222D'
								},
								on: {
									click: () => {
										this.activeDelete = row;
										this.isShowDelMsgBox = true;
									}
								},
							})
						};
						if(btn.indexOf('test') != -1){
							testBtn = h('span', {
								attrs: {
									"title": '测试',
								},
								class: [
									'icon-dynamic',
									'iconfont',	                                     
									'tab-icon-btn'
								],
								on: {
									click: () => {
										this.$router.push('/robotwriting/newstemplate/test?id=' + row.id +'&name=' + row.templateName );
									}
								},
							})
						};
						return h('div',{
							class: [
								"tab-operation",
							],
						},[configurationBtn,createBtn,copyBtn,executeLogBtn,logBtn,testBtn,deleteBtn]);
					}
				},
			],
			list: [],
			modulesRule:{
				Name:[{ required:true, validator: validatorName ,trigger:'blur' }]
			},
			updaterList:[],
			configStrategy: false,
			isSubmitStrategyForm: false,
			treeModel: null,
			logReq:{
				currentPage: 1,
				logType: 1,
				operateEndTime: '',
				operateResult: '',
				operateStartTime: '',
				operateType: '',
				operateUser: '',
				pageSize: 10,
				recordId: '',
			},
			logList:[],
			logTotal: 0,
			isShowLog: false,
			logPage: 1,
			isLogLoading: false,
			logName: '',
			logtable:[
				{
					title: "序号",
					width: 60,
					align: "center",
					render: (h, params) => {
						let index = params.index + 1 + ( (this.logPage - 1) * this.logReq.pageSize);
						return h('div', index );
					}
				},
				{
					key: "operateUserName",
					title: "操作人",
					align: "center",
				},
				{
					key: "operateTime",
					title: "操作时间",
					align: "center",
					width: 160,
				},
				{
					key: "operateType",
					title: "操作类型",
					align: "center",
					width: 100,
					render: (h, params) => {
						let name = params.row.operateType == 1 ? '新增' : params.row.operateType == 2  ? '修改':'删除';
						return h('div', name );
					}
				},
				{
					key: "operateDescription",
					title: "操作描述",
					align: "center",
					width: 100,
				},
				{
					key: "operateResult",
					title: "操作结果",
					width: 100,
					align: "center",
					render: (h, params) => {
						let name = params.row.operateResult == 1 ? '成功' : '失败';
						return h('div', name );
					}
				}],
			elogReq:{
				currentPage: 1,
				newsTemplateId: '',
				filterTime: '',
				logStatus: '',
				pageSize: 10,
			},
			elogList:[],
			elogTotal: 0,
			isShoweLog: false,
			elogPage: 1,
			iseLogLoading: false,
			elogName: '',
			elogtable:[
				{
					title: "序号",
					width: 60,
					align: "center",
					render: (h, params) => {
						let index = params.index + 1 + ( (this.elogPage - 1) * this.elogReq.pageSize);
						return h('div', index );
					}
				},
				{
					key: "triggerTime",
					title: "调度时间",
					align: "center",
				},
				{
					key: "triggerCode",
					title: "调度结果",
					align: "center",
					width: 100,
					render: (h, params) => {
						let name = params.row.triggerCode == 200 ? '成功' : '失败';
						return h('div', name );
					}
				},
				{
					key: "triggerMsg",
					title: "调度备注",
					align: "center",
					width: 100,
					render: (h, params) => {
						if(params.row.triggerMsg){
							return h('Tooltip', { 
									props: { placement: 'right' },
									
								}, [ 
									h('span',{
										attrs:{
											style: 'color:#298dff;cursor: pointer;',
										},
									},'查看'),
									h('div',
										{
											props: { 
												slot: 'content'
											},
											domProps:{
												innerHTML: params.row.triggerMsg
											},
											slot: 'content',
											style: { widthSpace: 'break-all' }
										})]
								)
						}
						return h('div', '无' );
					}
				},
				{
					key: "handleTime",
					title: "执行时间",
					align: "center",
				},
				{
					key: "handleCode",
					title: "执行结果",
					align: "center",
					width: 100,
					render: (h, params) => {
						let name = params.row.handleCode == 200 ? '成功' : '失败';
						return h('div', name );
					}
				},
				{
					key: "handleMsg",
					title: "执行备注",
					width: 100,
					align: "center",
					render: (h, params) => {
						if(params.row.handleMsg){
							return h('Tooltip', { 
									props: { placement: 'left' },
									
								}, [ 
									h('span',{
										attrs:{
											style: 'color:#298dff;cursor: pointer;',
										},
									},'查看'),
									h('div',
										{
											props: { 
												slot: 'content'
											},
											domProps:{
												innerHTML: params.row.triggerMsg
											},
											slot: 'content',
											style: { widthSpace: 'break-all' }
										})]
								)
						}
						return h('div', '无' );
					}
				}],
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods:{
		dbClickRow(row,index){
			this.$router.push('/robotwriting/newstemplate/add?id=' + row.id);
		},
		shitClearableClick(a,b){
			this[b][a] = '';
			this.$refs[a].focus();
		},
		onPageChange(val){
			this.req.currentPage = val;
			this.getList();
		},
		onPageSizeChange(size){
			this.req.pageSize = size;
			this.onPageChange(1);
		},
		//删除验证
		submitDel(){
			this.$refs['delForm'].validate((valid) => {
				if (valid) {
					this.setDel();
				}
			})
		},
		//提交删除
		setDel(){
			if(this.isSubmitForm)return;
			this.isSubmitForm = true;
			let url = '/tm/mw/newsTemplate/removeById?templateId=' + this.activeDelete.id;
			this.$http.get( url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.$hMessage.success('删除成功');
					this.closeDel();
					this.getList();
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isSubmitForm = false;
			}).catch(err=>{
				this.isSubmitForm = false;
				this.$hMessage.error('删除失败');
			})
		},
		closeDel(){
			this.isShowDelMsgBox = false;
			this.$refs['delForm'].resetFields();
		},
		goAdd(){
			this.$router.push('/robotwriting/newstemplate/add');
		},
		getList(coerce = false){
			let url = '/tm/mw/newsTemplate/page';
			if(this.loadingList)return;
			this.loadingList = true;
			let { req } = this;
			this.$http.post(url, req).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data || {};
					let total = data.total || 0;
					if(total && data.records && data.records.length == 0){
						this.req.currentPage = Math.ceil(total/this.req.pageSize)
						this.getList(coerce);
						return;
					}
					this.page = data.current;
					this.total = total;
					this.list = data.records || [];
				}else{
					this.list = [];
					this.$hMessage.error(oTmp.msg);
				}
				this.loadingList = false;
			}).catch(err=>{
				this.loadingList = false;
				this.$hMessage.error('获取搜索更新人列表失败');
			})
		},
		getUserList(query = ''){
			let url = '/tm/mw/user/getByKeyword?count=10000000&keyword=' + query;
			this.$http.get( url).then((res)=>{
				if(query !== this.queryStr){
					if(this.queryStr !== ''){
						this.loadingUser = false;
					}
					return;
				};
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let list = oTmp.data || [];
					for (let item of list){
						item.label = item.realName +'('+ item.userName +')'
						item.value =  item.id
					}
					this.updaterList =  list || [];
				}else{
					this.updaterList = [];
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				this.$hMessage.error('搜索更新人失败');
			})
		},
		//发送变更状态请求
		setStatus( key, status, datas){
			let data = copyDeep(datas);
			if(status == data.status){
				return;
			}
			datas.status = this.changeStatus[status];
			this.$set(this.list, key, datas);
			let url = '/tm/mw/newsTemplate/updateStatus?templateId=' + data.id + '&status=' + status;
			this.$http.get( url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data || {};
					if(this.list[key].id != data.id)return;
					this.$set(this.list, key, data);
				}else{
					/*let data = { ...this.list[key] }
					data.status = !status
					this.$set(this.list, key, data);*/
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				this.$hMessage.error('更新状态失败');
			})
		},
		closeStrategyForm(){
			this.isSubmitStrategyForm = false;
			this.configStrategy = false;
		},
		submitStrategyForm(){
			if(this.isSubmitStrategyForm)return;
			this.isSubmitStrategyForm = true;
			let checked = this.treeModel.getCheckedNodes(true);
			if(checked.length == 0){
				this.closeStrategyForm();
				return;
			}
			let check = checked[0];
			if(this.activeSelect.generationStrategyId == check.id ){
				this.closeStrategyForm();
				return;
			}
			let url = '/tm/mw/newsTemplate/configStrategy?templateId=' + this.activeSelect.id + '&generationStrategyId=' + check.id;
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data || {};
					if(this.activeSelect.id != data.id)return;
					this.$set(this.list, this.activeSelectKey, data);
					this.closeStrategyForm();
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetTree = false;
			}).catch(err=>{
				this.isGetTree = false;
				this.$hMessage.error('更改生成策略失败');
			})
		},
		//创建树
		createTree(){
			if(this.treeList.length == 0){
				this.getTree(()=>{
					this.createTree();
				});
				return;
			}
			let arr = [...[this.treeRoot],...this.treeList];
			arr = this.treeFormatting(arr);
			let tree = $.fn.zTree.init($("#strategyTree"), this.setting, arr);
			this.treeModel = tree;
		},
		//格式化tree
		treeFormatting(ary){
			let arr = [];
			if(ary){
				for(let i = 0, len = ary.length; i < len; i++){
					let item = ary[i];
					item.open = true;
					if(item.type == 2){
						item.chkDisabled = false;
					}else if(item.type == 1){
						item.chkDisabled = true;
					}
					if(item.id  ==  this.activeSelect.generationStrategyId){
						item.checked = true;
					}else{
						item.checked = false;
					}
					arr.push(item);
				}
			}
			return arr;
		},
		getTree(cb = false){
			if(this.isGetTree)return;
			this.isGetTree = true;
			let url = '/tm/mw/generationStrategy/treeList';
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let oData = oTmp.data ? oTmp.data : [];
					this.treeList = oData;
					if(cb){
						cb()
					}
					//this.createTree();
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetTree = false;
			}).catch(err=>{
				this.isGetTree = false;
				this.$hMessage.error('获取生成策略失败');
			})
		},
		zTreeBeforeCheck(treeId, treeNode){
			return !treeNode.checked;
		},
		zTreeBeforeClick(treeId, treeNode){
			/*if(treeNode.type != 2){
				return false;
			}*/
			return false;
		},
		onClickTree(event, treeId, treeNode){
			if(treeNode.type == 2){
				treeNode.checked = true;
				this.treeModel.updateNode(treeNode);
			}
		},
		//导出列表
		getExport(){
			let url = '/tm/mw/newsTemplate/export?newsTemplateName=' + this.req.newsTemplateName + '&updater=' + this.req.updater + '&status=' + this.req.status + '&generationStrategyName=' + this.req.generationStrategyName;
			window.location.href = url;
		},
		getLog(){
			let url = '/tm/mw/operationLog/page';
			this.isLogLoading = true;
			let req = copyDeep(this.logReq);
			this.$http.post( url, req).then((res)=>{
				let oTmp = res.data;
				if(req.recordId != this.logReq.recordId || req.currentPage != this.logReq.currentPage)return;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data || {};
					let list = data.records || [];
					let total = data.total || 0;
					if(total && list && list.length == 0){
						this.logReq.currentPage = Math.ceil(total/this.logReq.pageSize)
						this.getLog();
						return;
					}
					this.logPage = req.currentPage;
					this.logList = list 
					this.logTotal = total;
				}else{
					this.updaterList = [];
					this.$hMessage.error(oTmp.msg);
				}
				this.isLogLoading = false;
			}).catch(err=>{
				if(req.recordId != this.logReq.recordId || req.currentPage != this.logReq.currentPage)return;
				this.isLogLoading = false;
				this.$hMessage.error('网络错误，获取日志失败');
			})
		},
		onPageSizeChangeLog(size){
			this.logReq.pageSize = size;
			this.onPageChangeLog(1);
		},
		onPageChangeLog(val){
			this.logReq.currentPage = val;
			this.getLog();
		},
		geteLog(){
			let url = '/tm/mw/newsTemplate/executionLogPage';
			this.iseLogLoading = true;
			let req = copyDeep(this.elogReq);
			this.$http.post( url, req).then((res)=>{
				let oTmp = res.data;
				if(req.recordId != this.elogReq.recordId || req.currentPage != this.elogReq.currentPage)return;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data || {};
					let list = data.records || [];
					let total = data.total || 0;
					if(total && list && list.length == 0){
						this.elogReq.currentPage = Math.ceil(total/this.elogReq.pageSize)
						this.getLog();
						return;
					}
					this.elogPage = req.currentPage;
					this.elogList = list 
					this.elogTotal = total;
				}else{
					this.updaterList = [];
					this.$hMessage.error(oTmp.msg);
				}
				this.iseLogLoading = false;
			}).catch(err=>{
				if(req.recordId != this.logReq.recordId || req.currentPage != this.logReq.currentPage)return;
				this.iseLogLoading = false;
				this.$hMessage.error('网络错误，获取执行记录失败');
			})
		},
		onPageSizeChangeELog(size){
			this.elogReq.pageSize = size;
			this.onPageChangeELog(1);
		},
		onPageChangeELog(val){
			this.elogReq.currentPage = val;
			this.geteLog();
		},
	},
	mounted() {
		this.getList();
		this.getTree();
		this.getUserList();
	},
	activated: function(){
		if(this.isAutoRefreshTable){
			this.getList();
			this.getTree();
		}
	}
}
</script>
<style type="text/css" scoped>
.newstemplate>>> .icon-activity.iconfont.tab-icon-btn{
	font-size: 20px;
	position: relative;
	top: 1px;
}
.newstemplate>>> .icon-dynamic.iconfont.tab-icon-btn{
	font-size: 20px;
	position: relative;
	top: 1px;
}
.newstemplate>>> .tab-operation{
	text-align: center;
}
.newstemplate>>> .tab-operation > span{
	color: #298DFF;
	cursor: pointer;
}
.newstemplate>>> .tab-operation > span:last-child{
	margin-right: 0;
}
.tableConrent{
	position: relative;
}
.Tree{
	height: 280px;
}
.Tree>>> .switch[class$="close"] + .button.chk.radio_false_disable,.Tree>>> .button.chk.radio_false_disable{
	width: 16px;
	height: 16px;
	margin-right: 2px;
	background-position: -110px 0;
	vertical-align: top;
	*vertical-align: middle;
}
.Tree>>> .switch[class$="open"] + .button.chk.radio_false_disable{
	width: 16px;
	height: 16px;
	margin-right: 2px;
	background-position: -110px -16px;
	vertical-align: top;
	*vertical-align: middle;
}
.tableConrent>>> .h-tooltip .tab-icon-btn{
	font-size: 12px;
}
.tableConrent>>> .h-tooltip .h-tooltip-inner span{
	margin: 0 5px;
	color: #fff;
	cursor: pointer;
}
.elog-contents>>> .h-tooltip-inner{
	word-break:break-all;
	max-width: 500px;
	white-space: normal;
}
</style>