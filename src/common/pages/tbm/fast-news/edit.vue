<template>
	<div style="position: relative">
		<h-spin fix v-if="detailLoading">
		 	<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
	   		<div>加载中...</div>
		</h-spin>
		<NewsDetail			
			:newsId="newsId"
			:newsType="newsType"
			:pageType="pageType"
			:commonFilters="commonFilters"
			:labelList="labelList"
			:industryTags="industryTags"
			:conceptTags="conceptTags"
			:indicatorTags="indicatorTags"
			:regionTags="regionTags"
			:secuTags="secuTags"
			:hiddenItemArr='hiddenItemArr'
			:showBtns='showBtns'
			@updateNewsId="updateNewsId"
			@changeCommonFilters="changeCommonFilters"
			@toNextDetail="toNextDetail"
			@toPreDetail="toPreDetail"
			:isProcess="isProcess"
			>
		</NewsDetail>	
	</div>
</template>

<script>
	import vueCkeditor from 'vue-ckeditor2';
	import NewsDetail from '@/components/jintan_news_detail';	
	import {copyDeep, ArrToString,stringToArray } from "@/filters/index";
	export default{
		name:'TbmFast-newsEdit',
		components: {NewsDetail,vueCkeditor},
		data(){
			return{
				detailLoading:false,
				newsId:'',
				newsType:'2',
				pageType:'HANDLE',
				commonFilters: {},
				labelList:[],
				industryTags:[],
				conceptTags:[],
				indicatorTags:[],
				regionTags:[],
				secuTags:[],
				hiddenItemArr:['themeId','appIds','dsNewsColumns','tradingMarket','layoutNumber','layoutInfo','author','authorOrg','authorOrgCode','rangePlus','form','subtitle', 'summary','labelListConcept','labelListIndicator','labelListIndustry','conclusion','opinionType','imageUrl'],
				showBtns:['delete','save','publish','pre','discard','newCopyPage','allLabel'],
				updateFlag:false,
				isProcess:false,
				ref: '',
			}
		},
		methods:{
			changeCommonFilters(data){
				this.commonFilters = {...data}; 
			},
			getNewsDetail(newsId,type='',callback, ref){
            	this.detailLoading = true;
            	let url = '';
            	if(!type){
            		url = '/tm/news/detail?newsId='+newsId +'&newsType='+this.newsType + '&ref=' + ref;
            	}else{
            		url = '/tm/news/lastDetail?newsId='+newsId+'&newsType='+this.newsType + '&ref=' + ref;
            	}            	
	            this.$http.get(url).then((res) => {
	                let data = res.data ? res.data : {};
	                if(data.status == this.$api.SUCCESS){
		                	let commonFilters = {};
		                	commonFilters = data.body || {};
							this.newsId = data.body.newsId;
							this.ref = data.body.ref;
//		 	                commonFilters.srcPublishTime =  commonFilters.srcPublishDateDesc +' '+ commonFilters.srcPublishTimeDesc;
							if(commonFilters.titleShow){
								commonFilters.titleShow = commonFilters.titleShow.replace(/ /g, '&nbsp;').replace(/d&nbsp;class/g,'d class'); //匹配标题中的空格 
							};
		               		commonFilters.sensitives = ArrToString(commonFilters.sensitives);
		               		commonFilters.remark = stringToArray(commonFilters.remark,';');
		               		this.labelList = copyDeep(commonFilters.corpTags) || [];
		               		this.industryTags =  copyDeep(commonFilters.industryTags) || [];
		               		this.conceptTags = copyDeep(commonFilters.conceptTags) || [];
		               		this.indicatorTags = copyDeep(commonFilters.indicatorTags) || [];
		               		this.regionTags = copyDeep(commonFilters.regionTags) || [];
		               		this.secuTags = copyDeep(commonFilters.secuTags) || [];		               		
		               		this.commonFilters = {...commonFilters}; 
		               		this.$set(this,'commonFilters',commonFilters);
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
	                this.detailLoading = false;
	            })
            },
            toNextDetail(nextNewsId){
				let ref = this.$md5(`${nextNewsId}TBM-COMPOSE`);
            	this.getNewsDetail(nextNewsId,'',(res)=>{
            		if(res){
            			if(this.isProcess){
							this.$router.push({ path: '/tbm/fast-news/edit', query: { newsId:nextNewsId,isProcess:1, ref: ref}});
						}else{
							this.$router.push({ path: '/tbm/fast-news/edit', query: { newsId:nextNewsId, ref: ref}});
						}						 
            		}
            	}, ref)
            },
            toPreDetail(preNewsId){
				let ref = this.$md5(`${preNewsId}TBM-COMPOSE`);
            	this.getNewsDetail(preNewsId,'preDetail',(res)=>{
            		if(res){
            			if(this.isProcess){
            				this.$router.push({ path: '/tbm/fast-news/edit', query: { newsId:preNewsId,isProcess:1, ref:ref}});
            			}else{
            				this.$router.push({ path: '/tbm/fast-news/edit', query: { newsId: preNewsId, ref:ref}});												
            			}           			
            		}
            	}, ref)
            },
            updateNewsId(newsId){
				this.newsId = newsId;
				this.ref = this.$md5(`${newsId}TBM-COMPOSE`)
            	this.updateFlag =true;
            },
            init(){
            	this.isProcess = this.$route.query.isProcess || false;//判断是否是否从流程进入编辑页面
        		if(this.isProcess){
        			this.showBtns.push('overProcess');
        			this.showBtns = this.showBtns.filter(function(item) {
					    return item != "next"
					});
        		}else{  
        			this.showBtns.push('next');
        			this.showBtns = this.showBtns.filter(function(item) {
					    return item != "overProcess"
					});
        		};        		
				this.newsId = this.$route.query.newsId;
				this.ref = this.$route.query.ref
        		this.getNewsDetail(this.$route.query.newsId, '', '', this.$route.query.ref);
        		sessionStorage.removeItem('freshDetailFast');
            }
		},
		created(){			
			this.init()
		},
		activated: function(){
			let freshDetail = sessionStorage.getItem('freshDetailFast') || null;
			if (this.updateFlag || freshDetail){
				this.updateFlag = false;				
				this.init();
			};				
		}
	}
	
</script>

