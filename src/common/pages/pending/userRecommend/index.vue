<template>
	<div class="user-recommend-index">
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>用户ID：</dt>
						<dd>
							<h-input placeholder="请输入用户ID" v-model.trim="oReq.userId" @on-enter="onExamine" icon="android-close" @on-click="onEmpty('userId')" ref="userId"></h-input>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" data-ref="init-btn" @click="onExamine">查询</h-button>
					<h-tooltip placement="top" content="请选择是否自动刷新表格的数据!">
						<h-switch size="large" v-model="isAutoUpdate" >
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
				<h-table class="full-max-height-table" :maxHeight="maxTableHeight" border :columns="headerData" :data="arrList" size="small"></h-table>
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
	name: 'UserRecommend',
	data () {
		return {
			activeRoutersButton: this.$store.state.activeRoutersButton,
			isAutoUpdate: true,
			oReq: {
				userId: '',
				pageNum: 1,
				pageSize: 12,
			},
			intTotal: 0,
			isGetList: false,
			headerData: [
				{
					title: '用户ID',
					key: 'userId'
				},{
					title: '用户标签',
					key: 'tags',
					render: (h, params) => {
						let tags = '';
						if(params.row.tags){
							let arr = [...params.row.tags];
							let len = arr.length > 5 ? 5 : arr.length;
							tags = [];
							for(let i=0; i < len; i++){
								let a = h('span',{
									class: {
										'tag-box': true
									},
								},arr[i])
								tags.push(a);
							}
						}
						return h("span",{
							attrs: {
								"title": params.row.tags ? params.row.tags.toString() : ''
							},
						},tags);
					}
				},
				{
					title: '操作',
					width: 160,
					align: 'center',
					render: (h, params) => {
						let tagBtn = null;
						if(this.activeRoutersButton.indexOf('tagBtn') != -1){
							tagBtn = h('span',{
								class: {
									'operation-but': true
								},
								on: {
									click: () => {
										this.onTagBtn(params.row);
									}
								}
							},'查看标签')
						}
						let newsBtn = null;
						if( this.activeRoutersButton.indexOf('newsBtn') != -1){
							newsBtn = h('span',{
								class: {
									'operation-but': true
								},
								on: {
									click: () => {
										this.onNewsBtn(params.row);
									}
								}
							},'查看资讯')
						}
						return h('div', [tagBtn,newsBtn]);
					}
				},
			],
			arrList: [],
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods: {
		/*查看tag*/
		onTagBtn(data){
			this.$router.push('/user/recommend/tag?id=' + data.userId)
		},
		/*查看news*/
		onNewsBtn(data){
			this.$router.push('/user/recommend/news?id=' + data.userId)
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
			let url = '/tm/queryUserTag?';
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
		init(){
			this.oReq.pageNum = 1;
			this.getList();
		}
	},
	mounted() {
		let { path } = this.$route;
		store.commit('SAVE_TAB_NAME',{  path: path, name: '用户推荐-查询'});
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
.box.switch{
	line-height: 32px;
}
.user-recommend-index>>> .operation-but{
	cursor: pointer;
	color: #298DFF;
	text-align: center;
	margin: 0 5px;
	display: inline-block;
}
.user-recommend-index>>> .tag-box{
	background: #298DFF;
	text-align: center;
	margin: 2px 5px;
	padding: 2px 5px;
	border-radius: 3px;
	display: inline-block;
	color: #fff;
}
</style>