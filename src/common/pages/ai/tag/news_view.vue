<template>
	<div style="position: relative">
		<h-spin fix v-if="detailLoading">
		 	<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
	   		<div>加载中...</div>
		</h-spin>
		<NewsDetail :dsSourceTypes="dsSourceType" :newsId="newsId" :commonFilters="commonFilters" :labelList="labelList"></NewsDetail>	
	</div>
</template>

<script>
	import NewsDetail from '@/components/jintan_tag_news_detail';	
	import { ArrToString,stringToArray } from "@/filters/index";
	export default{
		components: {NewsDetail},
		data(){
			return{
				dsSourceType:'',
				detailLoading:false,
				newsId:'',
				commonFilters: {},
				labelList:[]
			}
		},
		methods:{
			getNewsDetail(newsId){
            	this.detailLoading = true;
            	let url = '/tm/news/detail?newsId='+newsId;
	            this.$http.get(url).then((res) => {
	                let data = res.data ? res.data : {};
	                if(data.status == this.$api.SUCCESS){
	 	                this.commonFilters = data.body || {};
	 	                this.newsId = data.body.newsId;
	 	                this.commonFilters.srcPublishTime =  this.commonFilters.srcPublishDateDesc +' '+ this.commonFilters.srcPublishTimeDesc;
	               		this.commonFilters.dsSourceType = this.commonFilters.dsSourceType+'';
	               		this.commonFilters.dsSourceName = this.commonFilters.dsSourceName;
	               		this.commonFilters.sensitives = ArrToString(this.commonFilters.sensitives);
	               		this.commonFilters.remark = stringToArray(this.commonFilters.remark,';');
	               		let labelList = this.commonFilters.tags;
	               		this.labelList = labelList;
	                }else{
	                	this.$hMessage.error({
	                        content: data.msg,
	                        duration: 3
	                   	});                    
	                }  
	                this.detailLoading = false
	            }).catch(err=>{
	                this.detailLoading = false
	            })
            }
		},
		created(){			
			this.newsId = this.$route.query.newsId;
        	this.getNewsDetail(this.$route.query.newsId);
		}		
	}
	
</script>

