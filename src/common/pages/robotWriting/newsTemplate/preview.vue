<template>
	<div class="preview">
		<newsDetail :detail="detail"></newsDetail>
	</div>
</template>
<script>
import newsDetail from '../components/news-detail.vue';
export default {
	name: 'RobotwritingNewstemplatePreview',
	components: { newsDetail },
	data () {
		return {
			detail:{},
			id: '',
		}
	},
	methods:{
		getDetail(){
			let url = '/tm/mw/newsTemplate/preview?previewId=' + this.id;
			this.$http.get( url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data ? oTmp.data : {};
					this.detail = data;
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isLoading = false;
			}).catch(err=>{
				this.isLoading = false;
				this.$hMessage.error('获取新闻模板详情失败');
			})
		}
	},
	mounted() {
		this.$store.commit('SAVE_TAB_NAME',{  path: this.$route.path, name: '新闻模板 - 预览' });
		let { id } = this.$route.query;
		this.id = id;
		this.getDetail();
	},
	activated: function(){
		let { id } = this.$route.query;
		if(id != this.id){
			this.id = id;
			this.getDetail();
		}
	},
}
</script>
<style type="text/css" scoped>

</style>