<template>
	<div class="user-recommend-tag">
		<input v-model="CopyData"  class="Copy-data"/>
		<div class="header">
			<div class="box">
				<span class="title">用户ID：</span>
				<span class="user-id">{{ oReq.userId }}</span>
			</div>
		</div>
		<div class="content-wrapper">
			<div class="list">
				<h-table border :columns="headerData" :data="showList" size="small"></h-table>
			</div>
			<div class="page-box">
				<h-page :total="intTotal" :page-size="oReq.pageSize" :current="oReq.pageNum" @on-change="onPageChange" show-total size="small"></h-page>
			</div>
			<Spin fix v-if="isGetList">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</Spin>
		</div>
		<h-msgBox
			:isOkLeft="true"
			 title="资讯列表"
			 v-model="isShowDetail"
			 @on-close="onCloseBox"
			 class-name="user-recommend-tag-vertical-modal vertical-center-modal" :top="0" width="1020">
			<div class="content-wrapper">
				<div class="header">
					<div class="box">
						<span class="title">是否推荐：</span>
						<h-select placeholder="请选择" v-model="oReq.recommend" filterable clearable >
							<h-option v-for="(item,k) in isRecommendList" :value=" item.value" :key="k">{{item.name }}</h-option>
						</h-select>
					</div>
					<div class="box">
						<h-button type="primary" icon="search" data-ref="init-btn" @click="onExamine">查询</h-button>
					</div>
				</div>
				
				<div class="list">
					<h-table border :columns="NewsHeaderData" :data="aNewsDetail" size="small" ></h-table>
				</div>
				<div class="page-box">
					<h-page :total="intNewsTotal" :page-size="oNewsReq.pageSize" :current="oNewsReq.pageNum" @on-change="onNewsPageChange" show-total size="small"></h-page>
				</div>
				<Spin fix v-if="isShowDetailSpin">
					<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
					<div>加载中...</div>
				</Spin>
			</div>
			<div slot="footer" class="api-form-footer">
				<h-button type="primary" @click="onCloseBox">关闭</h-button>
			</div>
		</h-msgBox>
	</div>
</template>
<script>
import store from '@/store';
export default {
	//name: 'UserRecommendTag',
	data () {
		return {
			isAutoUpdate: true,
			oReq: {
				userId: '',
				pageNum: 1,
				pageSize: 12,
				recommend:'',
			},
			intTotal: 0,
			oNewsReq:{
				userId: '',
				pageNum: 1,
				pageSize: 10,
				tagId: ''
			},
			intNewsTotal: 0,
			isGetList: false,
			isRecommendList:[{
				value:'0',
				name:'待推荐'
			},{
				value:'1',
				name:'已推荐'				
			}],
			headerData: [
				{
					title: '标签名称',
					key: 'tagName',
				},{
					title: '推导路径',
					key: 'rulePath',
					render: (h, params) => {
						let str = params.row.rulePathArr.join('>');
						let Path = h('span', params.row.rulePathArr.join('>') +'(');
						let ruleName = null;
						if(params.row.rule && params.row.rule.ruleName){
							ruleName = h('span',{
								class: {
									'rule-tag': true
								},
							},params.row.rule.ruleName);
						}
						let end = h('span',')');
						return h('div', [ Path, ruleName, end]);
					}
				},{
					title: '标签ID',
					key: 'tagId'
				},{
					title: '标签权重',
					key: 'tagWeight',
					width: 100,
					align: 'center'
				},{
					title: '匹配数量',
					key: 'newsCount',
					width: 100,
					align: 'center'
				},
				{
					title: '操作',
					width: 100,
					align: 'center',
					render: (h, params) => {
						let newsBtn = h('span',{
								class: {
									'operation-but': true
								},
								on: {
									click: () => {
										this.onNewsBtn(params.row);
									}
								}
							},'查看资讯')
						return h('div', [newsBtn]);
					}
				},
			],
			showList: [],
			arrList: [],
			isShowDetail: false,
			isShowDetailSpin: false,
			NewsHeaderData: [
				{
					title: '资讯标题',
					key: 'newsTitle',
					render: (h, params) => {
						return h('div',{
							class: {
								'list-title': true
							},
							attrs: {
								title: params.row.newsTitle
							},
							on: {
								click: () => {
									this.onNewsTitle(params.row);
								}
							}
						},params.row.newsTitle);
					}
				},
				{
					width: 150,
					align: 'center',
					title: '资讯抓取时间',
					key: 'grabTime'
				},
				{
					width: 150,
					align: 'center',
					title: '资讯发布时间',
					key: 'pubTime'
				},
				{
					width: 170,
					align: 'center',
					title: '资讯进入推荐系统时间',
					key: 'enterRcmdTime'
				},
				{
					width: 170,
					align: 'center',
					title: '资讯权重',
					key: 'newsWeight'
				},
				{
					width: 120,
					align: 'center',
					title: '标签权重',
					key: 'tagWeight'
				},{
					align: 'center',
					title: '是否推荐',
					key: 'recommend',
					render: (h, params) => {
						let  recommend = params.row.recommend == 1 ? '已推荐' : '待推荐';
						return h('span',recommend);
					}
				}
			],
			aNewsDetail: [],
			CopyData: '',
		}
	},
	methods: {
		onNewsTitle(data){
			this.CopyData = data.newsId;
			setTimeout(()=>{
				let input = document.querySelector('.Copy-data');
				input.select();
				document.execCommand("copy");
				this.$hMessage.success('资讯ID，复制成功!');
			},100)
		},
		onCloseBox(){
			this.oNewsReq.pageNum = 1;
			this.isShowDetail = false;
			this.intNewsTotal = 0;
			this.aNewsDetail = [];
		},
		onNewsPageChange(page){
			this.oNewsReq.pageNum = page;
			this.getNewsList();
		},
		/*查看news*/
		onNewsBtn(data){
			this.isShowDetail = true;
			this.oNewsReq.pageNum = 1;
			this.oNewsReq.tagId = data.tagId;
			this.getNewsList();
		},
		onPageChange(page){
			this.oReq.pageNum = page;
			this.pageData();
		},
		onExamine(){
			this.oReq.pageNum = 1;
			this.getList();
		},
		onEmpty(name){
			this.oReq[name] = '';
			this.$refs[name].focus();
		},
		getList(){
			if(this.isGetList)return;
			this.isGetList = true;
			let url = '/tm/queryTagByUserId?';
			let oTmp = this.oReq;
			for(let k in oTmp){
				url += '&'+ k +'='+ encodeURIComponent(oTmp[k]);
			}
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let oData = oTmp.body ? oTmp.body : {};
					//this.intTotal = oData.total ? oData.total : 0;
					this.arrList = oData.result ? oData.result : [];
					this.pageData();
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetList = false;
			}).catch(err=>{
				this.isGetList = false;
				this.$hMessage.error('网络异常，获取标签数据失败！');
			})
		},
		getNewsList(){
			if(this.isShowDetailSpin)return;
			this.isShowDetailSpin = true;
			let url = '/tm/queryNewsByTagId?';
			let oTmp = this.oNewsReq;
			for(let k in oTmp){
				url += '&'+ k +'='+ encodeURIComponent(oTmp[k]);
			}
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let oData = oTmp.body ? oTmp.body : {};
					this.intNewsTotal = oData.total ? oData.total : 0;
					this.aNewsDetail = oData.records ? oData.records : [];
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isShowDetailSpin = false;
			}).catch(err=>{
				this.isShowDetailSpin = false;
				this.$hMessage.error('网络异常，获取资讯数据失败！');
			})
		},
		pageData(){
			let arr = [...this.arrList];
			let oReq = this.oReq;
			let start = (oReq.pageNum - 1) * oReq.pageSize;
			let end = oReq.pageNum * oReq.pageSize;
			let len = arr.length;
			if(end > len){
				end = len
			}
			this.intTotal = len;
			this.showList = arr.slice(start,end);
		},
		init(){
			this.oReq.pageNum = 1;
			this.getList();
		}
	},
	mounted() {
		let { path,query } = this.$route;
		this.oReq.userId = query.id;
		this.oNewsReq.userId = query.id;
		store.commit('SAVE_TAB_NAME',{  path: path, name: '用户推荐-查看标签'});
		this.init();
	},
	activated(){
		/*是否自动刷新*/
		/*if(this.isAutoUpdate){
			this.init();
		}*/
	},
}
</script>
<style scoped>
.header{

}
.header .box{
	display: inline-block;
	margin-bottom: 10px;
	vertical-align: top;
	margin-right: 10px;
	line-height: 32px;
}
.user-recommend-tag>>> .operation-but{
	cursor: pointer;
	color: #298DFF;
	text-align: center;
	margin: 0 5px;
	display: inline-block;
}
.user-recommend-tag>>> .tag-box{
	background: #298DFF;
	text-align: center;
	margin: 2px 5px;
	padding: 2px 5px;
	border-radius: 3px;
	display: inline-block;
	color: #fff;
}
.user-recommend-tag>>> .rule-tag{
	color: #ff9800
}
>>>.user-recommend-tag-vertical-modal .list-title{
	position: relative;
	width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
>>> .user-recommend-tag-vertical-modal .h-modal-body{
	min-height: 452px;
}
.Copy-data{
	position: absolute;
	z-index: -111;
	opacity: 0
}
.box>>> .h-input-wrapper{
	width: 300px;
}
.box{
	display: inline-block;
	margin-bottom: 10px;
	vertical-align: top;
	margin-right: 10px;
}
.box>>> .h-select{
	width: 150px;
}

</style>