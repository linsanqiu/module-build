<template>
	<div style="position: relative">
		<h-spin fix v-if="detailLoading">
		 	<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
	   		<div>加载中...</div>
		</h-spin>
		<NewsDetail 
			:newsId="newsId"
			:pageType="pageType"
			:newsType="newsType"
			:commonFilters="commonFilters"
			:labelList="labelList"
			:industryTags="industryTags"
			:conceptTags="conceptTags"
			:indicatorTags="indicatorTags"
			:regionTags="regionTags"
			:secuTags="secuTags"
			:hiddenItemArr="hiddenItemArr"
			:showBtns='showBtns'
			:ruleInlineData="ruleInline"
			@toPreDetail="toPreDetail"
			@toNextDetail="toNextDetail"
			>
		</NewsDetail>	
	</div>
</template>

<script>
	import NewsDetail from '@/components/jintan_news_detail';	
	import { ArrToString,stringToArray } from "@/filters/index";
	const appId = 2;//金探app
	export default{
		components: {NewsDetail},
		data(){
			return{
				detailLoading:false,
				newsId:'',
				pageType:'VIEW',
				newsType:'1',
				commonFilters: {},
				labelList:[],
				industryTags:[],
				indicatorTags:[],
				conceptTags:[],
				regionTags:[],
				secuTags:[],
				hiddenItemArr:['themeId','conclusion','opinionType','imageUrl'],
				showBtns:['pre','next'],
				ruleInline:{}
			}
		},
		methods:{
			getNewsDetail(newsId,type='',callback, ref){
            	this.detailLoading = true;
            	let url = '';
            	if(!type){
            		url = `/tm/news/detail?newsId=${newsId}&viewStatus=1` + '&ref=' + ref;
            	}else{
            		url = '/tm/news/lastDetail?newsId='+newsId + '&ref=' + ref;
            	}            	
	            this.$http.get(url).then((res) => {
	                let data = res.data ? res.data : {};
	                if(data.status == this.$api.SUCCESS){	                	
	 	                this.commonFilters = data.body || {};
	 	                this.newsId = data.body.newsId;
	 	                
//	 	                this.commonFilters.srcPublishTime =  this.commonFilters.srcPublishDateDesc +' '+ this.commonFilters.srcPublishTimeDesc;                       		
	               		this.commonFilters.sensitives = ArrToString(this.commonFilters.sensitives);
	               		this.commonFilters.remark = stringToArray(this.commonFilters.remark,';');
	               		this.commonFilters.appIds = this.commonFilters.appName.join();
	               		// this.commonFilters.dsSourceType = this.commonFilters.dsSourceName;
	               		this.commonFilters.sentimentLabel = this.commonFilters.sentimentsName;
	               		this.commonFilters.level= this.commonFilters.levelName;
	               		if(this.commonFilters.titleShow){
							this.commonFilters.titleShow = this.commonFilters.titleShow.replace(/ /g, '&nbsp;').replace(/d&nbsp;class/g,'d class'); //匹配标题中的空格 
						};
	               		this.commonFilters.title= this.commonFilters.titleShow;	               		
	               		this.commonFilters.areaCode= this.commonFilters.areaName;
//						this.commonFilters.authorOrgCode= this.commonFilters.authorOrgName;
						this.commonFilters.financial= this.commonFilters.financialName;
						this.commonFilters.financialPlus= this.commonFilters.financialPlusName;
						this.commonFilters.tradingMarket = this.commonFilters.tradingMarketName;
						this.commonFilters.form= this.commonFilters.formName;
						this.commonFilters.range= this.commonFilters.rangeName;
						this.commonFilters.rangePlus= this.commonFilters.rangePlusName;
//						this.commonFilters.contentText = this.commonFilters.contentText.replace(/\n/ig,"<br/>").replace(/\r/ig,"<br/>");
	               		this.labelList = this.commonFilters.corpTags;
		               	this.industryTags = this.commonFilters.industryTags;
		               	this.conceptTags =  this.commonFilters.conceptTags;
		               	this.indicatorTags = this.commonFilters.indicatorTags;
		               	this.regionTags = this.commonFilters.regionTags || [];
		               	this.secuTags = this.commonFilters.secuTags || [];
		               	if(callback){
		               		callback(true);
		               	}
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
            },
            toNextDetail(nextNewsId){
				let ref = this.$md5(`${nextNewsId}TBM-COMPOSE`);
            	this.getNewsDetail(nextNewsId,'',(res)=>{
            		if(res){
						this.$router.push({ path: '/tbm/news/view', query:{ newsId: nextNewsId, ref: ref }});
            		}
            	}, ref)
            },
            toPreDetail(preNewsId){
				let ref = this.$md5(`${preNewsId}TBM-COMPOSE`);
            	this.getNewsDetail(preNewsId,'',(res)=>{
            		if(res){
            			this.$router.push({ path: '/tbm/news/view', query: { newsId: preNewsId,ref:ref } });											
            		}
            	}, ref)
            },
		},
		created(){	
			this.newsId = this.$route.query.newsId;       	
        	this.getNewsDetail(this.$route.query.newsId, '', '', this.$route.query.ref);
        	if(this.$route.query.isSimilar){
        		this.showBtns = [];
        	}
		},
	}
	
</script>

