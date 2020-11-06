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
			:commonFilters="commonFiltersSaveas"
			:labelList="labelList"
			:industryTags="industryTags"
			:conceptTags="conceptTags"
			:indicatorTags="indicatorTags"
			:regionTags="regionTags"
			:secuTags="secuTags"
			:hiddenItemArr='hiddenItemArr'
			:showBtns='showBtns'
			:isSaveAs="true"
			>
		</NewsDetail>	
	</div>
</template>

<script>
	import vueCkeditor from 'vue-ckeditor2';
	import NewsDetail from '@/components/jintan_news_detail';	
	import { ArrToString,stringToArray } from "@/filters/index";
	export default{
		components: {NewsDetail,vueCkeditor},
		name:'TbmFast-newsSaveas',
		data(){
			return{
				detailLoading:false,
				newsId:'',
				newsType:'2',
				pageType:'ADD',
				commonFiltersSaveas: {},
				labelList:[],
				industryTags:[],
				conceptTags:[],
				indicatorTags:[],
				regionTags:[],
				secuTags:[],
				hiddenItemArr:['newsId','themeId','appIds','dsNewsColumns','tradingMarket','layoutNumber','layoutInfo','author','authorOrg','authorOrgCode','rangePlus','form','subtitle', 'summary','labelListConcept','labelListIndicator','labelListIndustry','conclusion','opinionType','imageUrl' ,'sentiment', 'newsImportance'],
				showBtns:['publish','allLabel']
			}
		},
		methods:{
			init(){
				setTimeout(()=>{
					this.commonFiltersSaveas = JSON.parse(sessionStorage.getItem('infoDetailStorage'));
					this.commonFiltersSaveas.publishStatusDesc = '未公开';//另存为页面公开标志默认为未公开
					this.commonFiltersSaveas.publishType = 1;
					this.newsId = this.commonFiltersSaveas.newsId;
					this.labelList = this.commonFiltersSaveas.corpTags || [];
		       		this.industryTags = this.commonFiltersSaveas.industryTags || [];
		       		this.conceptTags = this.commonFiltersSaveas.conceptTags || [];
		       		this.indicatorTags = this.commonFiltersSaveas.indicatorTags || [];
		       		this.regionTags = this.commonFiltersSaveas.regionTags || [];
		       		this.secuTags = this.commonFiltersSaveas.secuTags;
		       		sessionStorage.removeItem('freshSaveAsDetail');
	       		},10)
			}
		},
		mounted(){
			this.init()
		},
		activated: function(){
			let freshSaveAsDetail = sessionStorage.getItem('freshSaveAsDetail') || null;
			if (freshSaveAsDetail){
				this.init();
			};
		}	
	}
	
</script>

