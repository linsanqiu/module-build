<template>
	<detail v-model="data" :btn="btn" :onNext="onNext"></detail>
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
				req:{
					style: 0,
				},
			},
			btn:['save','submit'],
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
		onNext(type, status, isChange){
			let _this = this;
			var promise = new Promise(function(resolve, reject){
			    if(isChange){
			    	let content = '数据暂未保存，确定跳转？';
			    	_this.$hMsgBox.confirm({
						title:'温馨提示',
						content: content,
						onOk:()=>{
							resolve(true)
						}
					})
			    }else{
			    	resolve(true)
			    }
			})
			return promise;
		},
		init(){
			if(localStorage.incident_search_modify_data){
				let localObj = JSON.parse(localStorage.incident_search_modify_data);
				localObj.style = 0;
				this.data.req = localObj;
			}
			this.data.req.style = 0;
			let { newsId,eventCode } = this.$route.query;
			if(newsId == this.data.newsId && eventCode == this.data.eventCode)return;
			this.data.eventCode = eventCode;
			this.data.newsId = newsId;
		},
	},
	mounted() {
		this.$store.commit('SAVE_TAB_NAME',{  path: this.$route.path, name: '事件标注 - 编辑' });
		this.init();
	},
	activated: function(){
		this.init();
	}
}
</script>