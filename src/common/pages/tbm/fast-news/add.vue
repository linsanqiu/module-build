<template>
	<div>
		<NewsDetail
			ref="addNewsDetailFast"
			:pageType="pageType" 
			:newsType="newsType"
			:commonFilters="commonFilters" 
			:labelList="labelList" 
			:industryTags="industryTags"
			:conceptTags="conceptTags"
			:indicatorTags="indicatorTags"
			:regionTags="regionTags"
			:secuTags="secuTags"
			:hiddenItemArr='hiddenItemArr'
			:showBtns='showBtns'
		></NewsDetail>	
	</div>
</template>

<script>
	import NewsDetail from '@/components/jintan_news_detail';	
	export default{
		name: 'TbmFast-newsAdd',
		components: {NewsDetail},
		data(){
			return{
				pageType:'ADD',
				newsType:'2',
				commonFilters: {
					newsId: "",
					appIds:[],
					title: "",
					subTitle: "",
					newsUrl: "",
					summary: "",
					content:"",
					dsSourceType:"",
					dsSourceName:"",
					dsNewsColumns:"",
					layoutNumber: "",
					layoutInfo: "",
					mediaSource:"",
					mediaSourceCode:'',//处理页新增媒体出处常量字段
					srcPublishDate:"",//信息发布时间
					srcPublishDate:"",
					publishStatusDesc:'未公开',
					author:"",
					titleImgLink:"",
					tags:[],
					sentimentLabel:'',//情感类别
					level:'',//信息级别
					areaCode:'',
					authorOrg:'',
					authorOrgCode:'',
					financial:'',
					financialPlus:'',
					form:'',
					range:'',
					rangePlus:'',	
					tradingMarket:'',//交易场所
					contentText:''
				},
				labelList:[],
				industryTags:[],
				indicatorTags:[],
				conceptTags:[],
				regionTags:[],
				secuTags:[],
				hiddenItemArr:['themeId','appIds','dsNewsColumns','tradingMarket','newsId','layoutNumber','layoutInfo','author','authorOrg','authorOrgCode','rangePlus','form','subTitle', 'summary','labelListConcept','labelListIndicator','labelListIndustry','conclusion','opinionType','imageUrl'],
				showBtns:['save','publish','allLabel']
			}
		},
		methods:{
			init(){
				this.labelList = [];
				this.industryTags = [];
				this.indicatorTags = [];
				this.conceptTags = [];
				this.regionTags=[];
				this.secuTags=[];	
				this.$refs['addNewsDetailFast'].$refs['formInline'].resetFields();
				this.$refs['addNewsDetailFast'].commonFiltersCopy.publishStatusDesc = '未公开';
				sessionStorage.removeItem('addClickFastNews');				
			}
		},
		mounted(){
			sessionStorage.removeItem('addClickFastNews');
		},
		activated: function(){
			this.commonFilters.publishStatusDesc = '未公开';
			let addClickFastNews = sessionStorage.getItem('addClickFastNews') || null;
			if(addClickFastNews){
				this.init();
			};			
		}
	}
	
</script>

