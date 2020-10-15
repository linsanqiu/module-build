<template>
	<detail v-model="data" :view="true"></detail>
</template>
<script type="text/javascript">
import detail from '../components/detail';
export default {
	name: 'CorpusIncidentDetail',
	components: { detail },
	data () {
		return {
			data:{
				eventCode: '',
				newsId: '',
				req:{},
			}
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
		init(){
			if(localStorage.audit_search_view_data){
				let localObj = JSON.parse(localStorage.audit_search_view_data);
				localObj.style = 1;
				this.data.req = localObj;
			}
			let { newsId,eventCode } = this.$route.query;
			if(newsId == this.data.newsId && eventCode == this.data.eventCode)return;
			this.data.eventCode = eventCode;
			this.data.newsId = newsId;
		},
	},
	mounted() {
		this.$store.commit('SAVE_TAB_NAME',{  path: this.$route.path, name: '事件审核 - 详情' });
		this.init();
	},
	activated: function(){
		this.init();
	}
}
</script>