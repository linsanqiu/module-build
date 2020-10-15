<template>
	<div class="user-recommend-news">
		<input v-model="CopyData"  class="Copy-data"/>
		<div class="header">
			<div class="box user-id">
				<span class="title">用户ID：</span>
				{{ oReq.userId }}
			</div>
			<div class="box">
				<span class="title">资讯ID：</span>
				<h-input placeholder="请输入资讯ID" v-model.trim="oReq.newsId" @on-enter="onExamine" icon="android-close" @on-click="onEmpty('newsId')" ref="newsId">
				</h-input>
			</div>
			<div class="box">
				<span class="title">资讯分类：</span>
				<h-select placeholder="请选择资讯分类" v-model="oReq.newsCategory" filterable clearable >
					<h-option v-for="(item,k) in arrCategoryInfo" :value=" item.categoryType" :key="k">{{item.categoryName }}</h-option>
				</h-select>
			</div>
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
		<div class="content-wrapper">
			<div class="list">
				<h-table border :columns="headerData" :data="arrList" size="small"></h-table>
			</div>
			<div class="page-box">
				<h-page :total="intTotal" :page-size="oReq.pageSize" :current="oReq.pageNum" @on-change="onPageChange" show-total size="small"></h-page>
			</div>
			<Spin fix v-if="isGetList">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</Spin>
		</div>
	</div>
</template>
<script>
import store from '@/store';
export default {
	data () {
		return {
			isAutoUpdate: true,
			oReq: {
				userId: '',
				pageNum: 1,
				pageSize: 12,
				newsId: '',
				newsCategory: '',
				recommend:''
			},
			intTotal: 0,
			isGetList: false,
			headerData: [
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
				},{
					width: 90,
					title: '资讯栏目',
					key: 'ownColumn',
					align: 'center'
				},{
					width: 150,
					align: 'center',
					title: '资讯发布时间',
					key: 'pubTime'
				},{
					width: 150,
					align: 'center',
					title: '资讯抓取时间',
					key: 'grabTime'
				},{
					width: 170,
					align: 'center',
					title: '资讯进入推荐系统时间',
					key: 'enterRcmdTime'
				},{
					width: 110,
					align: 'center',
					title: '资讯权重',
					key: 'newsWeight'
				},{
					title: '资讯标签',
					key: 'tags',
					render: (h, params) => {
						let tags = '';
						if(params.row.tags){
							let arr = [...params.row.tags];
							let len = arr.length ;
							tags = [];
							for(let i=0; i < len; i++){
								let a = h('span',{
									class: {
										'tag-box': true
									},
								},arr[i].tagName+"("+arr[i].tagWeight+")")
								tags.push(a);
							}
						}
						return h("span",{
							/*attrs: {
								"title": params.row.tags ? params.row.tags.toString() : ''
							},*/
						},tags);
					}
				},{
					align: 'center',
					title: '是否推荐',
					key: 'recommend',
					render: (h, params) => {
						let  recommend = params.row.recommend == 1 ? '已推荐' : '待推荐';
						return h('span',recommend);
					}
				},
				{
					title: '操作',
					width: 80,
					align: 'center',
					render: (h, params) => {
						let examineBtn = h('a',{
								class: {
									'operation-but': true
								},
								attrs: {
									href: params.row.url,
									target: '_blank'
								},
							},'查看')
						return h('div', [examineBtn]);
					}
				},
			],
			arrList: [],
			arrCategoryInfo: [],
			isRecommendList:[{
				value:'0',
				name:'待推荐'
			},{
				value:'1',
				name:'已推荐'				
			}],
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
		onPageChange(page){
			this.oReq.pageNum = page;
			this.getList();
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
			let url = '/tm/queryNewsByUserId?';
			let oTmp = this.oReq;
			for(let k in oTmp){
				url += '&'+ k +'='+ encodeURIComponent(oTmp[k]);
			}
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let oData = oTmp.body ? oTmp.body : {};
					this.intTotal = oData.total ? oData.total : 0;
					this.arrList = oData.records ? oData.records : [];
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetList = false;
			}).catch(err=>{
				this.isGetList = false;
				this.$hMessage.error('网络异常，获取用户推荐数据失败！');
			})
		},
		getCategoryInfo(){
			let url = '/tm/categoryInfo';
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let oData = oTmp.body ? oTmp.body : {};
					this.arrCategoryInfo = oData.result ? oData.result : [];
				}else{
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				this.$hMessage.error('网络异常，获取栏目数据失败！');
			})
		},
		init(){
			this.getCategoryInfo();
			this.oReq.pageNum = 1;
			this.getList();

		}
	},
	mounted() {
		let { path,query } = this.$route;
		this.oReq.userId = query.id;
		store.commit('SAVE_TAB_NAME',{  path: path, name: '用户推荐-查看资讯'});
		this.init();
	},
	activated(){
		/*是否自动刷新*/
		if(this.isAutoUpdate){
			this.init();
		}
	},
}
</script>
<style scoped>
.header{

}
.header .box>>> .h-input-wrapper{
	width: 300px;
}
.header .box{
	display: inline-block;
	margin-bottom: 10px;
	vertical-align: top;
	margin-right: 10px;
}
.header .box>>> .h-select{
	width: 150px;
}
.box.switch{
	line-height: 32px;
}
.user-recommend-news>>> .operation-but{
	cursor: pointer;
	color: #298DFF;
	text-align: center;
	margin: 0 5px;
	display: inline-block;
}
.user-recommend-news>>> .tag-box{
	background: #298DFF;
	text-align: center;
	margin: 2px 5px;
	padding: 2px 5px;
	border-radius: 3px;
	display: inline-block;
	color: #fff;
}
.user-recommend-news>>> .list-title{
	position: relative;
	width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.user-id{
	width: 100%;
}
.Copy-data{
	position: absolute;
	z-index: -111;
	opacity: 0
}
</style>