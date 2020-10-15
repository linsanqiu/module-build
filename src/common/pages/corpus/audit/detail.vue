<template>
	<detail v-model="data" :btn="btn" :view="true" :onNext="onNext"></detail>
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
			},
			btn:['audit','retreat'],
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
			    if(status == 1){
			    	let content = '是否放弃审核？';
			    	_this.$hMsgBox.confirm({
						title:'温馨提示',
						content: content,
						okText: '是',
						cancelText: '否',
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
			if(localStorage.audit_search_modify_data){
				let localObj = JSON.parse(localStorage.audit_search_modify_data);
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
		this.$store.commit('SAVE_TAB_NAME',{  path: this.$route.path, name: '事件审核 - 审核' });
		this.init();
	},
	activated: function(){
		this.init();
	}
}
</script>