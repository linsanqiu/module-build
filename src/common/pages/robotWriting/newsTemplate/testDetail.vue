<template>
	<div class="testDeatil">
		<div class="lists">
			<ul>
				<li :class="{ 'active': item.id == activeId }" v-for="(item, k) in list" :key="k" @click="getDetail(item.id)" >{{ item.name }}</li>
			</ul>
			<h-spin fix v-if="isGetList">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</h-spin>
		</div>
		<div class="detail">
			<div class="list">
				<span class="title">新闻标题：</span>
				<div class="content">{{ detail.title }}</div>
			</div>
			<div class="list">
				<span class="title">新闻摘要：</span>
				<div class="content">{{ detail.summary }}</div>
			</div>
			<div class="list">
				<span class="title">新闻正文：</span>
				<div class="content" v-html="detail.content"></div>
			</div>
			<h-spin fix v-if="isGetDetail">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</h-spin>
		</div>
	</div>
</template>
<script>
export default {
	data () {
		return {
			list: [],
			detail:{},
			id: '',
			isGetList: false,
			isGetDetail: false,
		}
	},
	methods:{
		getList(){
			this.isGetList = true;
			let url = '/tm/mw/newsTemplate/getNewsTestDataList?newsTemplateId=' + this.id;
			this.$http.get( url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let list = oTmp.data ? oTmp.data : [];
					this.list = list;
					if(list.length > 0){
						this.getDetail(list[0].id)
					}
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetList = false;
			}).catch(err=>{
				this.isGetList = false;
				this.$hMessage.error('获取测试结果列表失败');
			})
		},
		getDetail(id){
			if(this.isGetDetail)return;
			this.isGetDetail = true;
			this.activeId = id;
			let url = '/tm/mw/newsTemplate/getNewsTestPreviewData?newsTemplateId=' + this.id + '&testDataId=' + id;
			this.$http.get( url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data ? oTmp.data : {};
					this.detail = data;
				}else{
					this.detail = {};
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetDetail = false;
			}).catch(err=>{
				this.isGetDetail = false;
				this.$hMessage.error('获取测试结果新闻详情失败');
			})
		}
	},
	mounted() {
		this.$store.commit('SAVE_TAB_NAME',{  path: this.$route.path, name: '新闻模板 - 测试结果' });
		let { id } = this.$route.query;
		this.id = id;
		this.getList();
	},
}
</script>
<style type="text/css" scoped>
.testDeatil{
	height: 100%;
	border: 1px solid #dfdfdf;
	font-size: 0;
}
.testDeatil .lists{
	display: inline-block;
	height: 100%;
	width: 220px;
	font-size: 12px;
	border-right: 1px solid #dfdfdf;
	vertical-align: top;
	overflow: auto;
	position: relative;
}
.testDeatil .lists li{
	padding: 5px 10px;
	cursor: pointer;
}
.testDeatil .lists li.active,.testDeatil .list li.active:hover{
	color: #fff;
	background: #2E71F2;
}
.testDeatil .lists li:hover{
	color: #fff;
	background: rgba(46,113,242, .8);
}
.testDeatil .detail{
	display: inline-block;
	height: 100%;
	padding: 10px;
	width: calc(100% - 220px);
	vertical-align: top;
	overflow: auto;
	position: relative;
}
.list{
	font-size: 0;
	margin-bottom: 10px;
}
.title{
	font-size: 12px;
	text-align: right;
	width: 80px;
	display: inline-block;
	vertical-align: top;
	padding: 10px 0;
}
.content{
	display: inline-block;
	vertical-align: top;
	font-size: 12px;
	padding: 10px;
	border: 1px solid #dfdfdf;
	background: #fff;
	width: calc(100% - 80px);
	border-radius: 4px;
	min-height: 40px;
}
</style>