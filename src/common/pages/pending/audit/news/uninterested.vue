<template>
	<div class="uninterested">
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>反馈日期：</dt>
						<dd><h-date-picker type="datetimerange" :value="defaultDate" format="yyyy-MM-dd" aria-placeholder="反馈日期" placeholder="开始日期 - 结束日期" @on-change="onChangeIssueDate"></h-date-picker></dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>公开标志：</dt>
						<dd>
							<h-select aria-placeholder="公开标志" placeholder="请选择公开标志" v-model="oReq.sign" filterable clearable >
								<h-option value="0">屏蔽</h-option>
								<h-option value="1">公开</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>处理状态：</dt>
						<dd>
							<h-select aria-placeholder="处理状态" placeholder="请选择处理状态" v-model="oReq.processingState" clearable >
								<h-option v-for="(item, i) in aDisposeSatusList" :value="item.dictEntry.toString()" :key="i" >
									{{ item.entryName }}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>资讯标题：</dt>
						<dd>
							<h-input aria-placeholder="资讯标题" placeholder="请输入资讯标题" v-model="oReq.newsTitle" @on-enter="onExamine" icon="android-close" @on-click="onEmpty('newsTitle')" ref="newsTitle"></h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>资讯ID ：</dt>
						<dd>
							<h-input aria-placeholder="资讯 ID" placeholder="请输入资讯 ID" v-model="oReq.newsId" @on-enter="onExamine" icon="android-close" @on-click="onEmpty('newsId')" ref="newsId" ></h-input>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" data-ref="init-btn" @click="onExamine">查询</h-button>
					<h-button v-if="activeRoutersButton.indexOf('save') != -1" type="primary" data-ref="init-btn" @click="onBatchDispose">批量紧急下架</h-button>
					<h-tooltip placement="top" content="请选择是否自动刷新表格的数据!">
						<h-switch size="large" v-model="isAutoUpdate" @on-change="onChangeAutoUpdate" >
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
		<div class="content-wrapper">
			<div class="list">
				<h-table class="full-max-height-table" :maxHeight="maxTableHeight" border :columns="headerData" :data="aNewsList" size="small"  @on-selection-change="changeSelectNewsList" ></h-table>
			</div>
			<div class="page-box">
				<h-page :total="intTotal" :page-size="oReq.pagesize" :current="oReq.pagenum" @on-change="onPageChange" show-total size="small"></h-page>
			</div>
			<Spin fix v-if="isShowSpin">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</Spin>
		</div>
		<h-msgBox title="反馈详情" v-model="isShowFeedbackDetail" @on-close="onCloseFDBox" class-name="uninterested-vertical-modal vertical-center-modal" :top="0" width="800">
			<h-collapse v-model="sFeedbackDetail" accordion noContentBox v-if="aDetailList.length > 0">
				<template v-for="(item,k) in aDetailList">
					<h-panel :name="(k+1).toString()">
						{{ item.tagName }}：{{ item.total }}次
						<div slot="content">
							<table class="draggable-tab">
								<thead>
									<tr>
										<th class="serial">NO.</th>
										<th>用户ID</th>
										<th>用户名称</th>
										<th>所属组织</th>
										<th class="feedback-date">反馈时间</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="( items, e) in aComplaintList[k]" :key="e">
										<td class="serial"><span class="data" :title="((item.pagenum - 1) * pagesize ) + e+1">{{ ((item.pagenum - 1) * pagesize ) + e+1 }}</span></td>
										<td><span class="data" :title="items.feedbackUserId">{{ items.feedbackUserId }}</span></td>
										<td><span class="data" :title="items.feedbackUserName">{{ items.feedbackUserName }}</span></td>
										<td><span class="data" :title="items.feedbackUserOrganization">{{ items.feedbackUserOrganization }}</span></td>
										<td><span class="data" :title="items.updateTime">{{ items.updateTime }}</span></td>
									</tr>
								</tbody>
							</table>
							<div class="feedback-detail-page">
								<div>
									<simplePage :current="item.pagenum" :total="item.total" :other="{ index:k }" :size="pagesize" @page-change="simplePageChange"></simplePage>
								</div>
							</div>
						</div>
					</h-panel>
				</template>
			</h-collapse>
			<div slot="footer" class="api-form-footer">
				<h-button type="primary" @click="onCloseFDBox">关闭</h-button>
			</div>
		</h-msgBox>
		<Spin fix v-if="isShowAllSpin">
			<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
			<div>加载中...</div>
		</Spin>
	</div>
</template>
<script>
import simplePage from '@/components/simple-page'
import { TODAY } from "./utils";
export default {
	name: "AuditNewsUninterested",
	components: {
		simplePage
	},
	data () {
		return {
			activeRoutersButton: this.$store.state.activeRoutersButton,
			item: {
				pagenum: 1,
				total: 2,
			},
			pagesize: 5,
			pageChange: 1,
			sFeedbackDetail: '1',
			isShowFeedbackDetail: false,
			isShowSpin: false,
			isShowAllSpin: false,
			intTotal: 0,
			isAutoUpdate: true,
			defaultDate: [TODAY,TODAY],
			oReq:{
				pagenum: 1,
				pagesize: 12,
				feedbackStartDate: TODAY,
				feedbackEndDate: TODAY,
				processingState: '',
				newsId: '',
				newsType: '',
				handleuser: '',
				newsTitle: '',
			},
			aDisposeSatusList: [{
				dictEntry: 1,
				entryName: '待处理'
			},{
				dictEntry: 2,
				entryName: '已下架'
			}],
			aPriorityList: [],
			aNewsTypeList: [],
			aPriorityUserList: [],
			aSelectNewsList: [],
			headerData: [
				{
					type: 'selection',
					width: 60,
					fixed: 'left',
					align: 'center'
				},{
					title: '资讯标题',
					key: 'newsTitle',
					width: 410,
				},{
					title: '处理状态',
					key: 'processingState',
					width: 90,
				},{
					title: '反馈次数',
					width: 90,
					render: (h, params) => {
						return h('div',{
							class: {
								'complain-count': true
							},
							on: {
								click: () => {
									this.onFeedbackSum(params.row.newsId);
								}
							}
						},params.row.count)
					}
				},{
					title: '反馈时间',
					key: 'feedbackTime',
					width: 150,
				},{
					title: '资讯ID',
					key: 'newsId',
					width: 200,
				},{
					title: '资讯类型',
					key: 'newsType',
					width: 150,
				},{
					title: '发布日期',
					key: 'releaseDate',
					width: 150,
				},{
					title: '公开标志',
					key: 'sign',
					width: 90,
				},{
					title: '媒体出处',
					key: 'newsSources',
					width: 150,
				},{
					title: '处理人',
					key: 'handleUser',
					width: 120,
				},{
					title: '处理时间',
					key: 'handleTime',
					width: 150,
				},{
					title: '操作',
					align: "center",
					fixed: "right",
					width: 130,
					render: (h, params) => {
						let changeBtn = null;
						if(params.row.processingStateKey != 2 && this.activeRoutersButton.indexOf('save') != -1){
							changeBtn = h('span',{
								class: {
									'operation-but': true
								},
								on: {
									click: () => {
										this.changeState(params.row);
									}
								}
							},'紧急下架')
						}
						let examineBtn = null;
						/*this.activeRoutersButton.indexOf('changeRole') != -1 &&*/
						if( this.activeRoutersButton.indexOf('examine') != -1){
							examineBtn = h('span',{
								class: {
									'operation-but': true
								},
								on: {
									click: () => {
										this.onLookDetail(params.row);
									}
								}
							},'查看')
						}
						return h('div', [changeBtn,examineBtn]);
					}
				},
			],
			aNewsList:[],
			aDetailList: [],
			aComplaintList: []
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods: {
		/*查看*/
		onLookDetail(data){
			data.newsListType = 5;
			let obj = {
				desc: "查看",
				type: 4,
				uid: data.newsId,
				url: "/tm/getNewsInfoById",
			}
			window.sessionStorage.setItem('returnedOriginPath', '/audit/news/uninterested'); 
			window.sessionStorage.setItem('emergency-off-shelves_flipObj_view', JSON.stringify(data));
			window.sessionStorage.setItem('emergency-off-shelves_route_query_view', JSON.stringify(obj) );
			window.sessionStorage.setItem('keyboard_shortcuts_names_obj', '{}');
			this.$router.push('/audit/news/emergency-off-shelves/operate-view#'+data.newsId);
		},
		/*下架*/
		changeState(data){
			this.$hMsgBox.confirm({
				title:'提示',
				content: "紧急下架“"+ data.newsTitle +"”？",
				onOk:()=>{
					this.setNewsState([data.newsId]);
				},
				onCancel:()=>{
					return;
				}
			})
		},
		/*向后台发送下架请求*/
		setNewsState(aIds){
			if(this.isShowAllSpin)return;
			this.isShowAllSpin = true;
			let url = '/tm/handlenews';
			let body = {
				newsIds: aIds
			}
			this.$http.post( url, body).then((res)=>{
				this.isShowAllSpin = false;
				let obj = res.data;
				if(obj.status == this.$api.SUCCESS){
					this.getNewsList();
				}else{
					this.$hMessage.error(data.msg);
				}
			}).catch((err) => {
				this.isShowAllSpin = false;
				this.$hMessage.error('网络异常，紧急下架失败！');
			});
		},
		/*点击批量下架*/
		onBatchDispose(){
			if(this.isShowSpin)return;
			let len = this.aSelectNewsList.length;
			if(len == 0){
				this.$hMessage.error('请选择资讯');
				return;
			}
			let list = this.aSelectNewsList;
			let aIds = [];
			let isDispose = false;
			for(let i =0; i < len; i++ ){
				aIds.push(list[i].newsId);
				if(list[i].processingStateKey == 2){
					isDispose = true;
				}
			}
			if(isDispose){
				this.$hMessage.error('已下架的资讯不可再次下架，请重新选择');
				return;
			}
			this.$hMsgBox.confirm({
				title:'提示',
				content: "确定批量(共"+ len +"条)紧急下架？",
				onOk:()=>{
					
					this.setNewsState(aIds);
				},
				onCancel:()=>{
					return;
				}
			})
		},
		/*勾选变更*/
		changeSelectNewsList(list){
			this.aSelectNewsList = list;
		},
		/*反馈详情分页*/
		simplePageChange(page, other){
			let data = this.aDetailList;
			let complaintList = this.aComplaintList;
			data[other.index].pagenum = page;
			let list = [];
			let feedback = data[other.index].feedbackUser;
			let feedbackLen = feedback.length;
			let staIndex = (page - 1) * this.pagesize;
			let endIndex = page * this.pagesize;
			if(endIndex > feedbackLen){
				endIndex = feedbackLen;
			}
			for(let k = staIndex; k < endIndex; k++){
				list.push(feedback[k]);
			}
			complaintList[other.index] = list;
			this.aComplaintList = complaintList;
			this.aDetailList = data;
		},
		/*分页*/
		onPageChange(page){
			this.oReq.pagenum = page;
			this.getNewsList();
		},
		onChangeAutoUpdate(){
			
		},
		/*点击查看*/
		onExamine(){
			this.oReq.pagenum = 1;
			this.getNewsList();
		},
		/*清空数据 并焦点*/
		onEmpty(name){
			this.oReq[name] = '';
			this.$refs[name].focus();
		},
		/*更新反馈时间*/
		onChangeIssueDate(aVals){
			this.oReq.feedbackStartDate = aVals[0];
			this.oReq.feedbackEndDate = aVals[1];
		},
		/*获取优先级*/
		getPriority(){
			this.getDictList(1006, (code, data)=>{
				if(code){
					this.aPriorityList = data;
				}else{
					if(data){
						this.$hMessage.error(data.msg);
					}else{
						this.$hMessage.error('网络异常，获取优先级数据失败！');
					}
				}
			})
		},
		/*获取处理状态*/
		getDisposeSatus(){
			this.getDictList(1005, (code, data)=>{
				if(code){
					this.aDisposeSatusList = data;
				}else{
					if(data){
						this.$hMessage.error(data.msg);
					}else{
						this.$hMessage.error('网络异常，获取处理状态数据失败！');
					}
				}
			})
		},
		/*根据id获取字典数据*/
		getDictList(id, cb){
			let url = '/tm/tbmDictList?dictCode='+ id;
			this.$http.get(url).then((res)=>{
				let obj = res.data;
				if(obj.status == this.$api.SUCCESS){
					let list = obj.body && obj.body.tbmDictList ? obj.body.tbmDictList : [];
					this.aPriorityList = list;
					cb(true, list);
				}else{
					cb(false, obj);
				}
			}).catch((err) => {
				cb(false);
			});
		},
		/*获取资讯类型*/
		getNewsType(){
			let url = '/tm/getNewsType';
			this.$http.get(url).then((res)=>{
				let obj = res.data;
				if(obj.status == this.$api.SUCCESS){
					let list = obj.body && obj.body.result ? obj.body.result : [];
					this.aNewsTypeList = list;
				}else{
					this.$hMessage.error(obj.msg);
				}
			}).catch((err) => {
				this.$hMessage.error('网络异常，获取资讯类型数据失败！');
			});
		},
		/*获取处理人员*/
		getPriorityUser(){
			let url = '/tm/handlerList';
			this.$http.get(url).then((res)=>{
				let obj = res.data;
				if(obj.status == this.$api.SUCCESS){
					let list = obj.body && obj.body.handlerList ? obj.body.handlerList : [];
					this.aPriorityUserList = list;
				}else{
					this.$hMessage.error(obj.msg);
				}
			}).catch((err) => {
				this.$hMessage.error('网络异常，获取处理人员数据失败！');
			});
		},
		/* 获取不感兴趣列表*/
		getNewsList(advance = false){
			if(this.isShowSpin && !advance)return;
			this.isShowSpin = true;
			let url = '/tm/getuninterestednewslist?';
			let oTmp = this.oReq;
			for(let k in oTmp){
				url += '&'+ k +'='+ encodeURIComponent(oTmp[k]);
			}
			this.$http.get(url).then((res)=>{
				let obj = res.data;
				this.isShowSpin = false;
				if(obj.status == this.$api.SUCCESS){
					let data = obj.body ? obj.body : {};
					let total = data.total || 0;
					if(total && data.list && data.list.length == 0){
						this.oReq.pagenum = Math.ceil(total/this.oReq.pagesize)
						this.getNewsList();
						return;
					}
					this.intTotal = total;
					this.aNewsList = data.list || [];
					this.aSelectNewsList = [];//清空勾选
				}else{
					this.$hMessage.error(obj.msg);
				}
			}).catch((err) => {
				this.isShowSpin = false;
				this.$hMessage.error('网络异常，获取不感兴趣数据失败！');
			});
		},
		/*获取不感兴趣详情列表*/
		getDetailList(id){
			let url = '/tm/getfeedbackuser?newsId='+ id;
			this.isShowAllSpin = true;
			this.$http.get(url).then((res)=>{
				let obj = res.data;
				this.isShowAllSpin = false;
				if(obj.status == this.$api.SUCCESS){
					let data = obj.body.feedbackResult ? obj.body.feedbackResult : [];
					let complaintList = [];
					for(let i = 0, len = data.length;  i < len; i++){
						data[i].pagenum = 1;
						let detail = data[i].feedbackUser ? data[i].feedbackUser : [];
						let l = detail.length;
						complaintList[i] = [];
						for(let k = 0; k < l; k++){
							complaintList[i].push(detail[k]);
							if(k == this.pagesize - 1){
								break;
							}
						}
					}
					this.aComplaintList = complaintList;
					this.aDetailList = data;
					this.sFeedbackDetail = '1';
					this.isShowFeedbackDetail = true;
				}else{
					this.$hMessage.error(obj.msg);
				}
			}).catch((err) => {
				this.isShowAllSpin = false;
				this.$hMessage.error('网络异常，获取不感兴趣详情数据失败！');
			});
		},
		/*点击反馈次数*/
		onFeedbackSum(newsId){
			this.getDetailList(newsId);
		},
		/**/
		onCloseFDBox(){
			this.sFeedbackDetail = '';
			this.aDetailList = [];
			this.isShowFeedbackDetail = false;
			this.isShowSpin = false;
		},
		init(){
			//this.getPriority();
			//this.getDisposeSatus();
			/*this.getPriorityUser();*/
			//this.getNewsType();
			this.getNewsList();
		}
	},
	mounted() {
		this.init();
	},
	activated(){
		/*是否自动刷新*/
		if(this.isAutoUpdate){
			this.getNewsList();
		}
	},
}
</script>
<style scoped>
.uninterested{
	position: relative;
}
>>> .uninterested-vertical-modal .h-modal-body{
	min-height: 395px;
}
.header{

}
.header .box{
	display: inline-block;
	margin-bottom: 10px;
	vertical-align: top;
	margin-right: 10px;
}
.header .box .title{
	display: inline-block;
	line-height: 32px;
}
.header .box>>> .h-date-picker{
	width: 205px;
}
.header .box>>> .h-date-picker .h-input-wrapper{
	width: 100%;
}
.header .box>>> .h-input-wrapper{
	width: 150px;
}
.header .box>>> .h-select{
	width: 150px;
}
.box.switch{
	line-height: 32px;
}
.content-wrapper{
	position: relative;
}
.content-wrapper>>> .complain-count{
	cursor: pointer;
	color: #298DFF;
	text-align: center;
}
.content-wrapper>>> .operation-but{
	cursor: pointer;
	color: #298DFF;
	text-align: center;
	margin: 0 5px;
	display: inline-block;
}
.draggable-tab tr{
	border-left: 1px solid #DCE1E7;
}
.feedback-date {
	width: 130px;
}
.feedback-detail-page{
	height: 30px;
}
.feedback-detail-page > div{
	float: right;
}
.content-wrapper >>>.h-checkbox-wrapper + span,.content-wrapper>>> .h-checkbox + span{
	display: none;
}
.feedback-detail-page>>> .simple-page-prev i,.feedback-detail-page>>> .simple-page-next i{
	display: inline-block;
	height: 17px;
}
</style>