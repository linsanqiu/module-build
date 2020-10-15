<template>
	<div class="newstemplate">
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>模板名称：</dt>
						<dd><h-input placeholder="请输入模板名称" v-model="req.dataTemplateName" icon="android-close" ref="dataTemplateName" @on-enter="onPageChange(1)" @on-click="shitClearableClick('dataTemplateName','req')"></h-input></dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>更新人：</dt>
						<dd>
							<Select
								v-model.trim="req.updater"
								placeholder="请选择更新人"
								filterable
								>
								<Option v-for="(option, index) in updaterList" :value="option.id" :key="index">{{ option.realName +'('+ option.userName +')' }}</Option>
							</Select>
						</dd>
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
					<h-button type="primary" v-if="activeRoutersButton.indexOf('export') != -1" @click="getExport">导出列表</h-button>
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
		<div class="list-content">
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
			<h-spin fix v-if="isGetList">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</h-spin>
		</div>
		<h-msgBox title="是否确认删除模板？" v-model="isShowDelMsgBox" @on-close="closeDel" class-name="vertical-center-modal" :top="0">
			<div class="contents">
				<h-form ref="delForm" :model="deleteData" :rules="modulesRule" :label-width="110" @submit.native.prevent>
					<h-form-item prop="name" label="模块名称：">
						<h-input type="text" v-model.trim="deleteData.name" autocomplete="off" :placeholder="'输入“'+ activeDelete.templateName +'”后删除'"></h-input>
					</h-form-item>
				</h-form>
				<p>注：当前数据模板被{{ newsAmount }}个新闻模板调用，<span class="detail" @click="onNewsDetail">明细</span></p>
			</div>
			<div slot="footer">
				<h-button type="text" @click="closeDel">取消</h-button>
				<h-button type="info" @click="submitDel" :loading="isSubmitForm">删除</h-button>
			</div>
		</h-msgBox>
		<h-msgBox :title="activeDelete.templateName +'数据模板调用情况明细'" :mask-closable="false" v-model="isShowDetailMsgBox"class-name="vertical-center-modal" :top="0" :width="600">
			<div class="detail-contents">
				<h-table size="small" :maxHeight="320" class="full-max-height-table" :columns="detailtable" :data="detaillist" :highlight-row="false" border></h-table>
				<div class="tab-box">
					<h-page highlight-row size="small" show-elevator show-total show-sizer placement="top" class="page-box"  :page-size-opts="pageSizeOpts" :total="newsTotal" :current="newsReq.currentPage" :page-size="newsReq.pageSize" @on-change="onPageChangeNews" @on-page-size-change="onPageSizeChange"></h-page>
				</div>
				<h-spin fix v-if="isGetDetailList">
					<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
					<div>加载中...</div>
				</h-spin>
			</div>
			<div slot="footer">
				<h-button type="info" @click="isShowDetailMsgBox = false">关闭</h-button>
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
	</div>
</template>
<script>
import store from '@/store';
import router from '@/router/router'
import { copyDeep } from '@/filters/index'
export default {
	name: 'RobotwritingDatatemplate',
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
			isAutoRefreshTable: true,
			isGetList: false,
			isSubmitForm: false,
			isShowDelMsgBox: false,
			isShowDetailMsgBox: false,
			pageSizeOpts: [10,20,50,100],
			total: 0,
			page: 1,
			req: {
				dataTemplateName: '',
				updater: '',
				status: '-1',
				currentPage: 1,
				pageSize: 10,
			},
			updaterList:[],
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
					name: '下线',
					value: '0',
				},
			],
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
				/*{
					title: "状态",
					align: "center",
					width: 100,
					render: (h, params) => {
						let row = params.row;
						let btn = this.activeRoutersButton;
						let disabled = true;
						if(btn.indexOf('switch') != -1){
							disabled = false;
						}
						return h('h-switch',{
							props: {
								size: 'large',
								value: row.status == 1 ? true : false,
								disabled: disabled
							},
							on: {
								'on-change': (status) => {
									this.setStatus( params.index, row);
								}
							}
						},[
							h('span',{
								slot: 'open',
							},'上线'),
							h('span',{
								slot: 'close',
							},'下线')
						]);
					}
				},*/
				{
					key: "key",
					title: "操作",
					align: "center",
					width: 150,
					render: (h, params) => {
						let row = params.row;
						let btn = this.activeRoutersButton;
						let configurationBtn,copyBtn,executeLogBtn,logBtn,deleteBtn;
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
										this.$router.push('/robotwriting/datatemplate/add?id=' + params.row.id);
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
										this.$router.push('/robotwriting/datatemplate/add?copy=' + params.row.id);
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
										this.getNewsAmount();
										this.newsAmount = '#';
										this.isShowDelMsgBox = true;
									}
								},
							})
						};
						return h('div',{
							class: [
								"tab-operation",
							],
						},[configurationBtn,copyBtn,executeLogBtn,logBtn,deleteBtn]);
					}
				},
			],
			list: [],
			modulesRule:{
				name:[{ required:true, validator: validatorName,trigger:'blur'}]
			},
			detailtable: [
				{
					key: "key",
					title: "序号",
					width: 60,
					align: "center",
					render: (h, params) => {
						let index = params.index + 1 + ( (this.newsActivePage - 1) * this.newsReq.pageSize);
						return h('div', index );
					}
				},
				{
					key: "templateName",
					title: "新闻模板名称",
				}
			],
			detaillist: [],
			newsAmount: '#',
			isGetDetailList: false,
			newsReq:{
				pageSize: 10,
				currentPage: 1,
			},
			newsTotal: 0,
			newsActivePage: 1,
			deleteData: {
				name: '',
			},
			activeDelete: {},
			loadingUser: false,
			queryStr: '',
			logReq:{
				currentPage: 1,
				logType: 2,
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
					align: "center",
					width: 100,
					render: (h, params) => {
						let name = params.row.operateResult == 1 ? '成功' : '失败';
						return h('div', name );
					}
				}],
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods:{
		dbClickRow(row,index){
			this.$router.push('/robotwriting/datatemplate/add?id=' + row.id);
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
			let url = '/tm/mw/dataTemplate/removeById?templateId=' + this.activeDelete.id;
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
		//关闭删除弹框
		closeDel(){
			this.isShowDelMsgBox = false;
			this.$refs['delForm'].resetFields();
		},
		//跳转编辑页/新增页
		goAdd(){
			this.$router.push('/robotwriting/datatemplate/add');
		},
		//获取列表数据
		getList(coerce = false){
			let url = '/tm/mw/dataTemplate/page';
			let req = this.req;
			if(this.isGetList && !coerce)return;
			this.isGetList = true;
			this.$http.post( url, req).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data ? oTmp.data : {};
					let total = data.total || 0;
					if(total && data.records && data.records.length == 0){
						this.req.currentPage = Math.ceil(total/this.req.pageSize)
						this.getList(true);
						return;
					}
					this.page = data.current;
					this.total = total;
					this.list = data.records || [];
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetList = false;
			}).catch(err=>{
				this.isGetList = false;
				this.$hMessage.error('获取数据模板数据失败');
			})
		},
		//获取新闻模板总数
		getNewsAmount(){
			let url = '/tm/mw/newsTemplate/getCountByDataTemplateId?dataTemplateId=' + this.activeDelete.id;
			this.$http.get( url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data || {};
					if(this.activeDelete.id != data.dataTemplateId)return;
					this.newsAmount = data.count;
				}else{
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				this.$hMessage.error('获取新闻模板数量失败');
			})
		},
		pageSizeOptsNews(size){
			this.newsReq.pageSize = size;
			this.onPageChangeNews(1);
		},
		onPageChangeNews(val){
			this.newsReq.currentPage = val;
			this.getNewsList();
		},
		//点击明细
		onNewsDetail(){
			this.detaillist = [];
			this.newsReq.currentPage = 1;
			this.isShowDetailMsgBox = true;
			this.getNewsList();
		},
		//获取新闻模板列表
		getNewsList(){
			if(this.isGetDetailList)return;
			this.isGetDetailList = true;
			let url = '/tm/mw/newsTemplate/pageByDataTemplateId?dataTemplateId=' + this.activeDelete.id +'&pageSize='+ this.newsReq.pageSize +'&currentPage='+ this.newsReq.currentPage;
			this.$http.get( url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data ? oTmp.data : {};
					if(data.dataTemplateId != this.activeDelete.id)return;
					let list = data.page || [];
					let total = list.total || 0;
					if(total && list.records && list.records.length == 0){
						this.activeDelete.currentPage = Math.ceil(total/this.activeDelete.pageSize)
						this.getNewsList();
						return;
					}
					this.newsActivePage = list.current;
					this.newsTotal = total;
					this.detaillist = list.records || [];
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetDetailList = false;
			}).catch(err=>{
				this.isGetDetailList = false;
				this.$hMessage.error('获取新闻模板明细数据失败');
			})
		},
		//发送变更状态请求
		setStatus( key, data){
			//if(this.isGetList)return;
			//this.isGetList = true;
			let status = data.status == 1 ? 0 : 1;
			let url = '/tm/mw/dataTemplate/updateStatus?templateId=' + data.id + '&status=' + status;
			this.$http.get( url).then((res)=>{
				let oTmp = res.data;
				//this.isGetList = false;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data || {};
					if(this.list[key].id != data.id)return;
					this.$set(this.list, key, data);
				}else{
					let data = { ...this.list[key] }
					data.status = !status
					this.$set(this.list, key, data);
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				//this.isGetList = false;
				this.$hMessage.error('更新状态失败');
			})
		},
		//导出列表
		getExport(){
			let url = '/tm/mw/dataTemplate/export?dataTemplateName=' + this.req.dataTemplateName + '&updater=' + this.req.updater + '&status=' + this.req.status;
			window.location.href = url;
		},
		getUserList(query = ''){
			let url = '/tm/mw/user/getByKeyword?count=1000000&keyword=' + query;
			this.$http.get( url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.updaterList =  oTmp.data || [];
				}else{
					this.updaterList = [];
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				this.$hMessage.error('获取搜索更新人列表失败');
			})
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
	},
	mounted() {
		this.getUserList();
		this.getList();
	},
	activated: function(){
		if(this.isAutoRefreshTable){
			this.getList();
		}
	},
}
</script>
<style type="text/css" scoped>
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
span.detail{
	cursor: pointer;
	color: #298DFF;
}
.list-content{
	position: relative;
}
.detail-contents{
	position: relative;
}
</style>