<template>
	<div>
		<NewsDetail 
			ref="addNewsDetail"
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
		name: 'TbmNewsAdd',
		components: {NewsDetail},
		data(){
			return{
				pageType:'ADD',
				newsType:'1',
				commonFilters: {
					newsId: "",
					appIds:[],
					title: "",
					titleShow:"",
					subTitle: "",
					newsUrl: "",
					summary: "",
					content: "",
					dsSourceType:"",
					dsSourceName:"",
					dsNewsColumns:"",
					layoutNumber:"",
					layoutInfo: "",
					mediaSource:"",
					mediaSourceCode:'',//处理页新增媒体出处常量字段
//					srcPublishTime:"",//信息发布时间
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
				hiddenItemArr:['newsId','summary','themeId','conclusion','opinionType','imageUrl'],
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
				this.$refs['addNewsDetail'].$refs['formInline'].resetFields();
				this.$refs['addNewsDetail'].newsIdAddSave = '';
				this.$refs['addNewsDetail'].commonFiltersCopy.publishStatusDesc = '未公开';
				this.commonFilters.appIds = [];//解决，resetFields后 改变checkbox值会多出undefined
				this.commonFilters.newsId = '';				
				sessionStorage.removeItem('addClick');
			}
		},
		mounted(){
			sessionStorage.removeItem('addClick');
		},
		activated: function(){
			let addClick = sessionStorage.getItem('addClick') || null;//是否从新建进入页面
			if(addClick){
				this.init();
				
			};			
		}
	}
	
</script>

