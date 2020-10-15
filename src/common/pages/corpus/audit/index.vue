<template>
	<div class="list">
		<windowDrag leftW="205px" class="detail-drag">
			<div class="list-left" slot="left">
				<incident :onEvent="changeCode"></incident>
			</div>
			<div class="list-right" slot="right">
				<search-form class="top-search">
					<ul slot="content">
						<li>
							<dl>
								<dt>开始日期：</dt>
								<dd>
									<h-date-picker placement="bottom-start"  type="date" format="yyyy-MM-dd" placeholder="开始日期" v-model="beginDate" @on-change="onChangeBeginDate">
									</h-date-picker>
								</dd>
							</dl>
						</li>
						<li>
							<dl>
								<dt>结束日期：</dt>
								<dd>
									<h-date-picker placement="bottom-start"  type="date" format="yyyy-MM-dd" placeholder="结束日期" v-model="endDate" @on-change="onChangeEndDate" >
									</h-date-picker>
								</dd>
							</dl>
						</li>
						<li>
							<dl>
								<dt>状态：</dt>
								<dd>
									<h-select placeholder="请选择" v-model="req.status">
										<h-option v-for="(item, i) in status" :value="item.value" :key="item.value">
											{{ item.label }}
										</h-option>
									</h-select>
								</dd>
							</dl>
						</li>
						<li>
							<dl>
								<dt>标题：</dt>
								<dd>
									<Input placeholder="请填写" v-model="req.title" ref="title" icon="android-close" @on-click="shitClearableClick('title')"></Input>
								</dd>
							</dl>
						</li>
						<li class="search-wrapper-but">
							<h-button type="primary" @click="onQuery">查询</h-button>
							<h-button type="primary" @click="batchAudit" v-if="activeRoutersButton.indexOf('audit') != -1">批量审核</h-button>
							<h-button type="primary" @click="batchRetreat" v-if="activeRoutersButton.indexOf('retreat') != -1">批量回退</h-button>
							<h-button type="primary" @click="getDownload" v-if="activeRoutersButton.indexOf('download') != -1">{{ isDownload ? '正在导出...' : '导出' }}</h-button>
						</li>
					</ul>
				</search-form>
				<div class="news-list">
					<h-table
						size="small"
						:maxHeight="maxTableHeight"
						class="full-max-height-table"
						:columns="aryHeaderData"
						:data="NewsList"
						:highlight-row="false"
						 @on-selection-change="selectionList"
						border>
					</h-table>
					<div class="tab-box">
						<span class="select-len">当前已选择 {{ selectNews.length }} 条</span>
						<h-page highlight-row size="small" show-elevator show-total show-sizer placement="top" class="page-box" :page-size-opts="pageSizeOpts" :total="total" :current="req.current" :page-size="req.size" @on-change="onPageChange" @on-page-size-change="onfilePageSizeChange"></h-page>
					</div>
					<h-spin fix v-if="isGetList">
						<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
						<div>加载中...</div>
					</h-spin>
				</div>
			</div>
		</windowDrag>
	</div>
</template>
<script type="text/javascript">
import { copyDeep,month_day } from '@/filters/index'
import incident from '../components/incident';
import windowDrag from '@/components/windowDrag';
export default {
	name: 'CorpusAudit',
	components: { incident,windowDrag },
	data () {
		return {
			activeRoutersButton: this.$store.state.activeRoutersButton,
			EventList: [],
			aryHeaderData: [
				{
					type: "selection",
					width: 60,
					align: "center",
					fixed: "center",
					fixed: "left",
				},{
					title: '状态',
					key: 'statusDesc',
					width: 70,
				},{
					title: '标注',
					key: 'tagFlagDesc',
					width: 70,
				},{
					title: '资讯ID',
					key: 'infoId',
					width: 160,
				},{
					title: '资讯标题',
					key: 'newsTitle',
					minWidth: 300,
				},{
					title: '来源',
					key: 'sourceDesc',
					width: 80,
				},{
					title: '主体',
					key: 'subjects',
					width: 200,
				},{
					title: '操作',
					key: 'tagName',
					width: 120,
					align: 'center',
					fixed: "right",
					render: (h, params) => {
						let row = params.row;
						let view,modify;
						if(this.activeRoutersButton.indexOf('view') != -1){
							view = h('span', {
								attrs: {
									"title": '查看',
								},
								class: [
									'icon-view',
									'iconfont',	                                     
									'tab-icon-btn'
								],
								on: {
									click: () => {
										let obj = {
											eventCode: this.req.eventCode,
											beginDate: this.req.beginDate,
											endDate: this.req.endDate,
											status: this.req.status,
											title: this.req.title,
										}
										localStorage.audit_search_view_data = JSON.stringify(obj)
										this.$router.push('/corpus/audit/view?eventCode='+ this.req.eventCode +'&newsId=' + row.id);
									}
								},
							})
						}
						if(this.activeRoutersButton.indexOf('modify') != -1){
							modify = h('span', {
								attrs: {
									"title": '审核',
								},
								class: [
									'icon-shenhe',
									'iconfont',	                                     
									'tab-icon-btn'
								],
								on: {
									click: () => {
										let obj = {
											eventCode: this.req.eventCode,
											beginDate: this.req.beginDate,
											endDate: this.req.endDate,
											status: this.req.status,
											title: this.req.title,
										}
										localStorage.audit_search_modify_data = JSON.stringify(obj)
										this.$router.push('/corpus/audit/detail?eventCode='+ this.req.eventCode +'&newsId=' + row.id);
									}
								},
							})
						}
						return h('div',{
							class: [
								"tab-operation",
							],
						},[view,modify]);
					}
				}
			],
			isGetList: false,
			NewsList:[],
			pageSizeOpts: [10,20,50,100],
			status:[
				{
					value: 1,
					label: '待审核',
				},{
					value: 2,
					label: '已审核',
				},{
					value: 3,
					label: '已退回',
				}
			],
			req: {
				eventCode: '',
				beginDate: '',
				endDate: '',
				size: 10,
				current: 1,
				status: 1,
				title: '',
			},
			total: 0,
			beginDate: '',
			endDate: '',
			selectNews: [],
			isDownload: false,
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods: {
		shitClearableClick(name){
			this.req[name] = '';
			this.$refs[name].focus();
		},
		//导出列表
		getDownload(){
			if(this.isDownload)return;
			this.isDownload = true;
			let list = this.selectNews;
			let url = '';
			let obj = { };
			if(list.length == 0){
				url = '/tm/corpus/eventtagprocess/downloadEventTagProcessExcel';
				obj = this.req;
				obj.eventFlag = 1;
			}else{
				url = '/tm/corpus/eventtagprocess/downloadByIds';
				obj = {ids: list.toString()};
			}
			this.$http.post(url, obj, { responseType: 'blob'}).then((res)=>{
				this.isDownload = false;
				this.downloadFile(res);
			}).catch(err=>{
				this.isDownload = false;
				this.$hMessage.error('网络错误，下载失败！');
			})
		},
		downloadFile(res){
			const content = res.data
			const blob = new Blob([content],{type: "application/vnd.ms-excel"})
			const fileName = '标注列表'+month_day(0) +'.xlsx'
			if ('download' in document.createElement('a')) { // 非IE下载
				const elink = document.createElement('a')
				elink.download = fileName
				elink.style.display = 'none'
				elink.href = URL.createObjectURL(blob)
				document.body.appendChild(elink)
				elink.click()
				URL.revokeObjectURL(elink.href) // 释放URL 对象
				document.body.removeChild(elink)
			}
		},
		getExport(key){
			window.location.href = '/tm/corpus/eventtagprocess/downloadEventsbyKey?key='+key;
		},
		batchAudit(){
			let list = this.selectNews;
			if(list.length == 0){
				this.$hMessage.error('请选择需要审核的资讯！');
				return;
			}
			if(this.isGetList)return;
			this.isGetList = true;
			let url = '/tm/corpus/eventtagprocess/batchAuditEventTagProcessVo';
			this.$http.post(url, {ids: list.toString()}).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.$hMessage.success('审核成功');
					this.selectNews = [];
					this.getNews(true);
				}else{
					this.$hMessage.error(oTmp.msg);
					this.isGetList = false;
				}
			}).catch(err=>{
				this.isGetList = false;
				this.$hMessage.error('网络错误，审核失败！');
			})
		},
		batchRetreat(){
			let len = this.selectNews.length;
			if(len == 0){
				this.$hMessage.error('请选择需要回退的资讯！');
				return;
			}
			this.$hMsgBox.confirm({
				title:'温馨提示',
				content:'共选中'+ len +'条资讯，确认回退?',
				onOk:()=>{
					this.setBatchRetreat();
				}
			})
		},
		setBatchRetreat(){
			if(this.isGetList)return;
			this.isGetList = true;
			let url = '/tm/corpus/eventtagprocess/batchBackEventTagProcessVo';
			let obj = {ids: this.selectNews.toString()};
			this.$http.post(url, obj).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.$hMessage.success('回退成功');
					this.selectNews = [];
					this.getNews(true);
				}else{
					this.$hMessage.error(oTmp.msg);
					this.isGetList = false;
				}
			}).catch(err=>{ 
				this.isGetList = false;
				this.$hMessage.error('网络错误，回退失败！');
			})
		},
		selectionList(a,b){
			let list = this.NewsList;
			for(let i = 0,len = list.length; i < len; i++){
				if(b.indexOf(i) != -1){
					if(this.selectNews.indexOf(list[i].id) == -1){
						this.selectNews.push(list[i].id)
					}
				}else{
					let index = this.selectNews.indexOf(list[i].id);
					if(index != -1){
						this.selectNews.splice(index,1);
					}
				}
			}
		},
		onQuery(){
			if(!this.req.eventCode){
				this.$hMessage.error('请选择事件！');
				return;
			}
			this.selectNews = [];
			this.onPageChange(1);
		},
		onPageChange(val){
			if(!this.req.eventCode)return;
			this.req.current = val;
			this.getNews();
		},
		onfilePageSizeChange(size){
			this.req.size = size;
			this.onPageChange(1);
		},
		onChangeBeginDate(date){
			this.req.beginDate = date || '';
		},
		onChangeEndDate(date){
			this.req.endDate = date || '';
		},
		changeCode(code){
			this.req.eventCode = code;
			this.onQuery();
		},
		getNews(go = false){
			if(this.isGetList && !go)return;
			this.isGetList = true;
			let url = '/tm/corpus/eventtagprocess/getAuditPage';
			let req = copyDeep(this.req)
			this.$http.post(url, req).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					if(req.eventCode != this.req.eventCode)return;
					let data = oTmp.data ? oTmp.data : {};
					let list = data.records || [];
					let total = data.total || 0;
					if(total && list.length == 0){
						this.req.current = Math.ceil(total/this.req.size)
						this.getNews(true);
						return;
					}
					for(let i = 0,len = list.length; i < len; i++){
						if(this.selectNews.indexOf(list[i].id) != -1){
							list[i]['_checked'] = true;
						}
					}
					this.NewsList = list;
					this.total = total;
					this.isGetList = false;
				}else{
					this.isGetList = false;
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				this.isGetList = false;
				this.$hMessage.error('查询资讯列表失败');
			})
		},
	},
	mounted() {
		this.beginDate = month_day(1);
		this.endDate = month_day(0);
		//this.getNews();
	}
}
</script>
<style type="text/css" scoped>
.list{
	display: flex;
	width: 100%;
	height: 100%;
	border: 1px solid #dfdfdf;
	background: #fff;
}
.list .list-left{
	width: 100%;
	min-width: 200px;
	height: 100%;
}
.list .list-right{
	padding: 10px;
	width: 100%;
	overflow: auto;
	min-width: 700px;
	min-height: 100%;
}
.adv-contents{
	font-size: 12px;
	display: flex;
}
.adv-left,.adv-center,.adv-right{
	width: calc((100% - 30px)/3);
}
.adv-center{
	margin: 0 15px;
}
.adv-title{
	display: flex;
}
.adv-title strong{
	font-weight: 600;
	line-height: 28px;
	flex: 1;
}
.adv-contents .h-btn{
	height: 28px;
	line-height: 28px;
	padding-top: 0;
    padding-bottom: 0;
    margin-left: 5px;
}
.adv-info{
	border: 1px solid #888;
	margin-top: 10px;
	height: calc(100% - 38px);
	min-height: 60px;
	overflow-x:auto; 
	overflow-y: hidden;
}
.adv-info table{
	table-layout:fixed;
	width: 100%;
	border-top: 1px solid #dfdfdf;
	border-left: 1px solid #dfdfdf;
}
.adv-info table td{
	width: 120px;
	padding: 0 5px;
	border-right: 1px solid #dfdfdf;
}
.adv-info table tr{
	border-bottom: 1px solid #dfdfdf;
}
.adv-info table .end{
	width: auto;
}
.tab-box,.news-list{
	position: relative;
}
.select-len{
	position: absolute;
	line-height: 26px;
	color: red;
	top: 0;
	left: 0;
}
</style>