<template>
	<div class="event-box">
		<h-spin fix v-if="detailLoadingBox">
		 	<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
	   		<div>加载中...</div>
		</h-spin>
		<windowDrag rightW="50%">
			<div class="box-left-content" slot="left">
					<NewsDetail			
						:newsId="newsId"
						:newsType="newsType"
						:pageType="pageType"
						:commonFilters="commonFilters"
						:labelList="labelListNewsCorp"
						:industryTags="industryTags"
						:conceptTags="conceptTags"
						:indicatorTags="indicatorTags"
						:regionTags="regionTags"
						:secuTags="labelListNewsSecurity"
						:hiddenItemArr='hiddenItemArr'
						:showBtns='showBtns'
						:isEventPage="true"
					>
						<div slot="eventFormItem" class="eventFormItem">							
							<div class="item-left">
					  	 		<NewsFormItem :readonlyFlag="true" className="readonlyItem" formItemType="input" :pageType='pageType'  itemName="newsId" labelName="资讯ID：" :commonFilters="commonFilters"></NewsFormItem>
								<NewsFormItem :pageType='pageType' itemName="dsNewsColumns" labelName="原始栏目：" :commonFilters="commonFilters"></NewsFormItem>	
 							    <NewsFormItem :readonlyFlag="true" formItemType="select" :pageType='pageType' itemName="range" labelName="范围：" :commonFilters="commonFilters"></NewsFormItem>
								<NewsFormItem
									:readonlyFlag="true"
									formItemType="select"
									:pageType="pageType"
									itemName="newsImportance"
									labelName="新闻重要程度："
									:commonFilters="commonFilters"
								></NewsFormItem>
						  	</div>
						  	<div  class="item-right">
							  	<NewsFormItem formItemType="datepicker" :pageType='pageType'  itemName="srcPublishDate" labelName="信息发布时间：" :commonFilters="commonFilters"></NewsFormItem>
								<NewsFormItem :pageType='pageType' itemName="mediaSource" labelName="媒体出处：" :commonFilters="commonFilters"></NewsFormItem>
								<NewsFormItem :pageType='pageType' itemName="modifyName" labelName="修改人员：" :commonFilters="commonFilters"></NewsFormItem>
								<NewsFormItem
									:readonlyFlag="true"
									formItemType="select"
									:pageType="pageType"
									itemName="sentiment"
									labelName="情感方向："
									:commonFilters="commonFilters"
								></NewsFormItem>
						  	</div>
						</div>
					</NewsDetail>	
					<!--<div class="remarkBox"  v-if="(commonFilters.remark && commonFilters.remark.length)" >
			 			<div class="remarkLabel">处理记录：</div>
			 			<ul class="handleRemark">
			 				<li :title="item" v-for="(item,index) in commonFilters.remark">
			 					{{item}}
			 				</li>
			 			</ul>
				 	</div>-->
			</div>
			<div class="box-right-content" slot="right" >
				<EventDetail 
					:eventNewsId="eventNewsId" 
					:newsId="newsId" 
					:labelList="labelList" 
					:labelListNews="labelListNewsCorp" 										 					
					:secuTags="secuTags"
					:labelListNewsSecurity="labelListNewsSecurity" 
					:eventPageType="eventPageType" 
					:publishType="publishType"
					:eventList="eventData"
					:hiddenItemArr="hiddenItemArrEvent"
					@onhandleNextNewsId="onhandleNextNewsId"
					@onhandlePreNewsId="onhandlePreNewsId"
				></EventDetail>
			</div>
		</windowDrag>
	</div>
</template>
<script>
	import NewsDetail from '@/components/jintan_news_detail';
	import vueCkeditor from 'vue-ckeditor2';
	import EventDetail from './eventCommonDetail' ;
	import NewsFormItem from '@/components/news_formItem';
	import { ArrToString, stringToArray } from "@/filters/index";
	import {mapState} from "vuex";
	import windowDrag from '@/components/windowDrag';
	import { copyDeep } from '@/filters/index'
	export default{
		components: {NewsDetail,vueCkeditor,EventDetail,windowDrag,NewsFormItem},
		data(){
			return{
				//主表资讯数据
				detailLoadingBox:false,
				newsId:'',
				ref: '',
				eventNewsId:'',
				newsType:'1',
				pageType:'VIEW',
				publishType:'',
				commonFilters: {},
				labelList:[],
				labelListNewsCorp:[],
				labelListNewsSecurity:[],
				industryTags:[],
				conceptTags:[],
				indicatorTags:[],
				regionTags:[],
				secuTags:[],
				hiddenItemArr:['themeId','conclusion','opinionType','imageUrl','summary','subTitle','content','contentSource','labelListCorp','labelListSecurity','labelListIndustry','labelListConcept','labelListIndicator','contentText','form'],		
				hiddenItemArrEvent:[],
				showBtns:[],
				//舆情资讯数据
				eventPageType:'VIEW',
				eventData:[],
				leftW: 0,
				rightW: 0,
				isDrag: false,
				isMask: false,
			}
		},
		methods:{
			getNewsDetail(newsId,cb=null, ref){
            	this.detailLoadingBox = true;            	 
            	let	url = '/tm/event/detail?newsId='+newsId+'&viewStatus=1'+'&preNewsId=' + '&ref=' + ref;            	            	
	            this.$http.get(url).then((res) => {
	                let data = res.data ? res.data : {};
	                if(data.status == this.$api.SUCCESS){
	                	let commonFilters = data.body || {};
						this.newsId = data.body.newsId;
						this.ref = data.body.ref;
	               		commonFilters.remark = stringToArray(commonFilters.remark,';'); 
	               		commonFilters.contentText = this.formContentTextFn(commonFilters.contentText);	
						this.eventData = copyDeep(commonFilters.eventList) || [];
						this.publishType =  commonFilters.publishType || '';
						this.eventNewsId = commonFilters.id || '';
						this.labelListNewsCorp = copyDeep(commonFilters.companyTags) || [];//资讯详情页企业标签
						this.labelListNewsSecurity = copyDeep(commonFilters.securityTags) || [];//资讯详情页证券标签
 						if(this.eventData.length> 0 ){
 							this.eventData[0]['_highlight'] = this.eventData.length> 0 ?  true : false;
 						} 						
						this.secuTags = this.eventData.length> 0  && this.eventData[0].securityTags? copyDeep(this.eventData[0].securityTags)  : []; 
	               		this.labelList = this.eventData.length> 0  && this.eventData[0].companyTags ? copyDeep(this.eventData[0].companyTags) : [];
	               		this.commonFilters = {...commonFilters};	
	               		if(cb){
		                	cb(true)
		                }
	                }else{
	                	this.$hMessage.error({
	                        content: data.msg,
	                        duration: 3
	                   	});                    
	                }  
	                this.detailLoadingBox = false;
	            }).catch(err=>{
	                this.detailLoadingBox = false;
	            })
            },
            formContentTextFn(contentText){ 
				if(!contentText)return;
	            let contentStr = contentText.replace(/(\r\n)+|(\n)+/g,'\n');	           
	            let contentArr = contentStr.split('\n');
	            if(contentArr[contentArr.length -1].replace(/(^\s*)|(\s*$)/g, "").replace(/(^\n*)|(^\r\n*)|(\r\n*$)|(\n*$)/g, "") == ''){
	            	contentArr.pop();//去除末尾换行符
	            }
	            let arr = [];
	            contentArr.forEach((item)=>{
	            	arr.push(`<p style="text-indent:2em">`+`${item.trim()}`+`</p>`); 
	            });
	            return  contentText = arr.join('\n');	           
			},
           onhandleNextNewsId({newsId}){
			 	let ref = this.$md5(`${newsId}TBM-COMPOSE`);
            	this.getNewsDetail(newsId,(res)=>{
            		if(res){
						this.$router.push({path:'/tbm/events/view',query:{newsId:this.newsId, ref: ref}});	
            		}
            	}, ref)
            },
             onhandlePreNewsId({newsId}){
				let ref = this.$md5(`${newsId}TBM-COMPOSE`);
            	this.getNewsDetail(newsId,(res)=>{
            		if(res){				
						this.$router.push({path:'/tbm/events/view',query:{newsId:this.newsId, ref: ref}});	
            		}
            	}, ref)            	
            },
		},
		computed: {
			...mapState(['maxTableHeight'])
		},
        mounted(){
			this.newsId = this.$route.query.newsId; 
			this.ref = this.$route.query.ref
    	    this.getNewsDetail(this.newsId , '', this.ref);
	    }
	}
</script>

<style scoped>
	.event-box{
		overflow: hidden;
		border: 1px solid #ccc;
		position: relative;
		height: 100%;
	}
	.event-box>>> .searchBoxEvent .search-form-item .viewPage{
	  border: 1px solid #dce1e7;
	  border-radius: 5px;
	  padding: 0 5px;
	  height: 32px;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	  overflow: hidden;
	  width: 100%!important;
	  cursor: pointer;
	}
	.event-box >>>.box-left-content .detailLeft{
		min-width:240px;
	}
	.event-box >>>.detailRight .h-form-item .h-form-item-label{
		width:105px!important;
	}
	.event-box >>>.detailLeft .h-form-item .h-form-item-label{
		width: 105px!important;
	}
	.event-box >>>.detailRight .h-form-item .h-form-item-content,.event-box >>>.detailLeft .h-form-item .h-form-item-content{
		margin-left:105px!important;
	}
	.box-right-content{
		height: 100%;
		max-width:920px;
		min-width:550px;
		overflow: auto;
	}
	.box-left-content{
		min-width:560px;
	}
	.eventFormItem{
		overflow: hidden;
	}
	.item-left{
		max-width:50%;
		float: left;
	}
	.item-right{
		max-width:50%;
		float: right;
	}
	.item-left>>>.search-form-item,.item-right>>>.search-form-item{
		margin-bottom: -7px;
	}
	.item-left>>> .viewPage,.item-right>>> .viewPage{
	   	display: inline-block;
		border: 1px solid #dce1e7;
		border-radius: 5px;
		padding: 0 5px;
		height: 32px;
		line-height:32px;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		width: 160px;
		cursor: pointer;
	}
	.remarkBox{
		padding: 0 15px;
		margin-top: 5px;
	}
	.remarkLabel{
		width: 100px;
		display: inline-block;
		vertical-align: top;
		text-align: right;
	}
	.event-box .handleRemark {
	  display: inline-block;
	  width: 260px;
	  border: 1px solid #d7dde4;
	  border-radius: 5px;
	  max-height: 160px;
	  overflow: auto;
	  padding: 5px 0;  
	}
	.event-box .handleRemark li {
	  padding:5px;
	  width: 100%;
	  line-height: 18px;
	}
	.event-box .handleRemark li:nth-child(2n) {
	  background: #fff;
	}
	
</style>