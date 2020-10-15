<template>
	<div class="detail">
		<div class="btn">
			<h-button type="primary" @click="query(1)">上一条</h-button>
			<h-button type="primary" @click="query(2)">下一条</h-button>
		</div>
		<div>
			<p class="title">标题：</p>
			<div class="contents" v-html="title"></div>
		</div>
		<div>
			<p class="title">内容：</p>
			<div class="contents" v-html="formattingHtml"></div>
		</div>
		<h-spin fix v-if="isLoading">
			<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
			<div>加载中...</div>
		</h-spin>
	</div>
</template>
<script type="text/javascript">
export default {
	name: 'CorpusImportDetail',
	data () {
		return {
			newsId: '',
			title: '',
			contentText: '',
			isLoading: false,
			req:{},
		}
	},
	computed: {
		formattingHtml(){
			if(this.contentText){
				let str = this.contentText.replace(/\r\n/g,"<br>");
				str = str.replace(/\n/g,"<br>");
				return str;
			}else{
				return '';
			}
		},
	},
	methods: {
		query(type){
			this.req.queryType = type;
			this.getBesidesNews();
		},
		getBesidesNews(){
			if(this.isLoading)return;
			this.isLoading = true;
			let url = '/tm/corpus/news/queryPreviousAndNextNewsDetail';
			this.$http.post(url, {newsId: this.newsId ,...this.req}).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.title = oTmp.data.title || '';
					this.contentText = oTmp.data.contentText || '';
					this.req.newsId = oTmp.data.id;
					this.$router.push({ path: '/corpus/import/detail?newsId=' + oTmp.data.id});
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isLoading = false;
			}).catch(err=>{
				this.isLoading = false;
				this.$hMessage.error('请求详情数据失败');
			})
		},
		getNews(){
			if(this.isLoading)return;
			this.isLoading = true;
			let url = '/tm/corpus/news/detail?newsId=' + this.newsId;
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.title = oTmp.data.title || '';
					this.contentText = oTmp.data.contentText || '';
					this.newsId = oTmp.data.id;
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isLoading = false;
			}).catch(err=>{
				this.isLoading = false;
				this.$hMessage.error('请求详情数据失败');
			})
		},
		init(){
			let { newsId } = this.$route.query;
			if(localStorage.jyp_search_data){
				this.req = JSON.parse(localStorage.jyp_search_data);
			}
			if(newsId == this.newsId)return;
			this.newsId = newsId;
			this.getNews();
		},
	},
	mounted() {
		this.$store.commit('SAVE_TAB_NAME',{  path: this.$route.path, name: 'JYP导入 - 资讯详情' });
		this.init();
	},
	activated: function(){
		this.init();
	}
}
</script>
<style type="text/css" scoped>
.detail{
	position: relative;
}
.btn{
	text-align: right;
}
.title{
	font-weight: 600;
	line-height: 32px;
}
.contents{
	padding: 5px;
	border: 1px solid #888;
	min-height: 32px;
	background: #fff;
}
</style>