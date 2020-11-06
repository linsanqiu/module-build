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
			</div>
			<div class="box-right-content" slot="right" >
				<EventDetail 
					ref="eventDetailPage"
					:eventNewsId="eventNewsId" 
					:newsId="newsId" 
					:labelList="labelList" 
					:labelListNews="labelListNewsCorp" 										 					
					:secuTags="secuTags"
					:labelListNewsSecurity="labelListNewsSecurity" 
					:labelListArea="regionTags"
					:eventPageType="eventPageType" 
					:publishType="publishType"
					:eventList="eventData"
					:hiddenItemArr="hiddenItemArrEvent"
					:isProcess="isProcess"
					:isSaveAs="true"
					@freshEditPage="freshEditPage"
				></EventDetail>
			</div>
		</windowDrag>
	</div>
</template>
<script>
	import windowDrag from '@/components/windowDrag';
	import NewsDetail from '@/components/jintan_news_detail';
	import NewsFormItem from '@/components/news_formItem';
	import vueCkeditor from 'vue-ckeditor2';
	import EventDetail from './eventCommonDetail' ;
	import { ArrToString, stringToArray } from "@/filters/index";
	import {mapState} from "vuex";
	import { copyDeep } from '@/filters/index'
	export default{
		name:'TbmEventsSaveas',
		components: {NewsDetail,vueCkeditor,EventDetail,NewsFormItem,windowDrag},
		data(){
			return{
				//主表资讯数据
				detailLoadingBox:false,
				newsId:'',
				newsType:'1',
				pageType:'VIEW',
				commonFilters: {},
				labelList:[],
				labelListNewsCorp:[],
				labelListNewsSecurity:[],
				industryTags:[],
				conceptTags:[],
				indicatorTags:[],
				regionTags:[],
				secuTags:[],
				hiddenItemArr:['themeId','conclusion','opinionType','imageUrl','summary','subTitle','content','contentSource','labelListArea','labelListCorp','labelListSecurity','labelListIndustry','labelListConcept','labelListIndicator','contentText','form'],		
				hiddenItemArrEvent:[],
				showBtns:[],
				//舆情资讯数据
				eventNewsId:'',
				eventPageType:'HANDLE',
				eventData:[],
				publishType:'',
				isProcess:false,
				commonFiltersSaveas:null
			}
		},
		methods:{
            getNewsDetail(newsId){
				let ref = this.$md5(`${newsId}TBM-COMPOSE`);
            	let	url = '/tm/event/detail?newsId='+newsId + '&ref=' + ref;            	            	
	            this.$http.get(url).then((res) => {
	                let data = res.data ? res.data : {};
	                if(data.status == this.$api.SUCCESS){	                	
	                	/**主表数据**/
	                	let commonFilters = data.body || {};
	               		commonFilters.remark = stringToArray(commonFilters.remark,';'); 
	               		commonFilters.contentText = this.formContentTextFn(commonFilters.contentText);
	               		this.commonFilters = {...commonFilters};
	               		/**舆情数据**/   	
	               		this.eventData = copyDeep(commonFilters.eventList);											
						if(this.commonFiltersSaveas){
							this.eventNewsId = this.commonFiltersSaveas.newsId || '';
							this.eventData.unshift(this.commonFiltersSaveas.detailData);				
							sessionStorage.removeItem('eventDetailStorage');
						};		
						this.eventData[0]['_highlight'] = true;
						this.$refs['eventDetailPage'].isShowDetail = true;		
	                	this.secuTags = this.eventData.length> 0  && this.eventData[0].securityTags? copyDeep(this.eventData[0].securityTags)  : []; 
	               		this.labelList = this.eventData.length> 0  && this.eventData[0].companyTags ? copyDeep(this.eventData[0].companyTags) : [];
	                }else{
	                	this.$hMessage.error({
	                        content: data.msg,
	                        duration: 3
	                   	});                    
	                }   
	            }).catch(err=>{
 
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
			freshEditPage(currentIndex){  
				let ref = this.$md5(`${newsId}TBM-COMPOSE`);
            	let	url = '/tm/event/detail?newsId='+this.newsId+'&viewStatus=1' + '&ref=' + ref;            	            	
	            this.$http.get(url).then((res) => {
	                let data = res.data ? res.data : {};
	                if(data.status == this.$api.SUCCESS){
	                	let commonFilters = data.body || {};
	 	                this.newsId = data.body.newsId;
	               		this.commonFilters.remark = stringToArray(commonFilters.remark,';');
	               		this.commonFilters.contentText = this.formContentTextFn(commonFilters.contentText);
	               		
						let eventData = copyDeep(commonFilters.eventList) || [];
						this.$refs['eventDetailPage'].eventListCopy = copyDeep(eventData);
						if(eventData.length> 0){
							this.$refs['eventDetailPage'].eventListCopy[currentIndex]['_highlight'] = true;
						};
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
            init(){            	
            	this.isProcess = this.$route.query.isProcess || false;//判断是否是否从流程进入编辑页面            	
	            //获取另存为缓存
	            this.commonFiltersSaveas = copyDeep(JSON.parse(sessionStorage.getItem('eventDetailStorage'))) || null;
		  		this.newsId = this.$route.query.newsId;
	        	if(this.newsId && this.commonFiltersSaveas){
	        		this.getNewsDetail(this.newsId);
	        	}           	
            }
		},
		computed: {
			...mapState(['maxTableHeight'])
		},
    	mounted(){
        	this.init();
	  	},
	 	activated: function(){
	 		this.init();		
		},
 
	}
</script>
<style >
	
</style>
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
	.event-box >>>.detailRight .h-form-item .h-form-item-label,.event-box >>>.detailLeft .h-form-item .h-form-item-label{
		width:105px!important;
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
	
</style>