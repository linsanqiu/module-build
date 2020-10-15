<template>
	<div style="position: relative">
		<h-spin fix v-if="detailLoading">
		 	<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
	   		<div>加载中...</div>
		</h-spin>
		<NewsDetail 
			:specialNameList='specialNameList' 
			:id="id"
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
			:showBtns='showBtns'
			:hiddenItemArr="newsType =='2' ? hiddenItemArrFastNews : hiddenItemArrDefault"
			:isSpecialPage="true"
			:opinionListComment="opinionListComment"
			:opinionListRecommend="opinionListRecommend"
			:ruleInlineData="ruleInlineSpecial"
			@updateNewsId="updateNewsId"
		></NewsDetail>			
	</div>
</template>

<script>
	import vueCkeditor from 'vue-ckeditor2';
	import NewsDetail from '@/components/jintan_news_detail';
	import { ArrToString,stringToArray } from "@/filters/index";
	import {mapState,mapActions} from "vuex";
	export default{
		name:'TbmSpecial-newsHandleEdit',
		components: {NewsDetail,vueCkeditor},
		data(){
			return{
				newsType:'1',
				themeId:'',
				id: '',
				specialNameList:[],
				detailLoading:false,
				newsId:'',
				pageType:'SPECIALEDIT',
				commonFilters: {},
				labelList:[],
				industryTags:[],
				conceptTags:[],
				indicatorTags:[],
				regionTags:[],
				secuTags:[],
				hiddenItemArrDefault:['newsId'],
				hiddenItemArrFastNews:['newsId','dsNewsColumns','tradingMarket','mediaSource','mediaSourceCode','layoutNumber','layoutInfo','author','authorOrg','authorOrgCode','rangePlus','form','subtitle', 'summary','labelListConcept','labelListIndicator','labelListIndustry','conclusion','opinionType'],
				showBtns:['delete','save','publish','pre','next'],
				ruleInlineSpecial: {
					themeId: [
						{ required: true, message: '专题名称不能为空', trigger: 'change' }
					],
					opinionType: [
						{ required: true, message: '请选择意见类型', trigger: 'change' }
					],
					conclusion:[
						{ required: true, message: '请填写结论', trigger: 'change' }
					],
				},
			}
		},
		computed: {
			...mapState(['opinionListComment','opinionListRecommend']),
		},
		methods:{
			/**获取专题名称列表**/
			getSpecialNameList(){
        		let url = '/tm/getThemesMap';
        		this.$http.get(url).then((res) => {
	            	let data = res.data;
	                if(data.status == this.$api.SUCCESS){
	                	let specialNameList = data.body.themeList || [];
	                	const newlist =  specialNameList.map(item => {
				            return {
				                value: item.id,
				                label: item.themeName
				            };
				        });
						this.specialNameList = [...newlist];
	                }else{
	                    this.$hMessage.error({content: data.msg})
	                }
	            })
	            .catch(err=>{
	                this.$hLoading.error();
	            })
        	},
        	getSpecialDetail(){
				this.detailLoading = true;
				let url = `/tm/getThemeNewsInfos?id=${this.id}&lock=${true}`;
        		// let url = '/tm/getThemeNewsDetail?newsId='+this.newsId + '&themeId='+this.themeId;
        		this.$http.get(url).then((res) => {
	                let data = res.data ? res.data : {};
	                if(data.status == this.$api.SUCCESS){
	                	let commonFilters = data.body || {};  
	 	                this.newsId = commonFilters.newsId;
	 	                this.newsType = commonFilters.newsType;
//	 	                commonFilters.srcPublishTime =  commonFilters.srcPublishDate;             		
						commonFilters.sensitives =commonFilters.sensitiveWords;
						commonFilters.remark = stringToArray(commonFilters.remark,';');
						// commonFilters.dsSourceType = commonFilters.dsSourceName;
	               		commonFilters.sentimentLabel = commonFilters.sentimentsName;
	               		commonFilters.level= commonFilters.levelName;
	               		commonFilters.title= commonFilters.titleShow;	               		
	               		commonFilters.areaCode= commonFilters.areaName;
	               		commonFilters.appIdsCopy = commonFilters.appIds;
	               		commonFilters.appIds = commonFilters.appName;	               		
//						commonFilters.authorOrgCode= commonFilters.authorOrgName;
						commonFilters.financial= commonFilters.financialName;
						commonFilters.financialPlus= commonFilters.financialPlusName;
						commonFilters.tradingMarket = commonFilters.tradingMarketName;
						commonFilters.form= commonFilters.formName;
						commonFilters.range= commonFilters.rangeName;
						commonFilters.rangePlus= commonFilters.rangePlusName;
	               		if(commonFilters.themeId == '32'){
	               			commonFilters.opinionList = this.opinionListComment;//股市评论
	               		}else if(commonFilters.themeId == '23'){
	               			commonFilters.opinionList = this.opinionListRecommend;//个股推荐
	               		}		
	               		this.labelList = commonFilters.corpTags || [];
	               		this.industryTags = commonFilters.industryTags || [];
	               		this.conceptTags = commonFilters.conceptTags || [];
	               		this.indicatorTags = commonFilters.indicatorTags || [];
	               		this.regionTags = commonFilters.regionTags || [];
	               		this.secuTags =  commonFilters.secuTags || [];
	               		this.commonFilters = {...commonFilters}; 
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
        	updateNewsId(newsId,themeId){
            	this.newsId = newsId;
            	this.themeId = themeId;
            	this.updateFlag = true;
            },
        	init(){
        		this.newsId = this.$route.query.newsId.toString() || ''; 	
				this.themeId= this.$route.query.themeId.toString() || '';
				this.id = this.$route.query.id.toString() || '';
				this.getSpecialNameList(); 
				this.getSpecialDetail();
				this.$store.dispatch('getOpinionListComment','opinionListComment');
		    	this.$store.dispatch('getOpinionListRecommend','opinionListRecommend');
		    	sessionStorage.removeItem('freshDetailSpecial');
        	}
		},
		created(){	
			this.init();
//      	this.getNewsDetail(this.$route.query.newsId);
		},
		activated: function(){
			let freshDetail = sessionStorage.getItem('freshDetailSpecial') || null;
			if (freshDetail || this.updateFlag){
				this.updateFlag = false;
				this.init()
			}			
		},
		
	}
	
</script>

