<template>
	<div style="position: relative">
		<h-spin fix v-if="detailLoading">
		 	<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
	   		<div>加载中...</div>
		</h-spin> 
		<div v-if="!showAddContent">
			<h-form ref="formInlineAdd" :rules="ruleInline" :model="searchData" :label-width="112">	
				<h-form-item style="display:inline-block"  prop="themeId" label="专题名称：">
					<h-simple-select placeholder="请选择专题名称" filterable v-model="searchData.themeId"  @on-change="changeSpecialName">
						<h-select-block :data="specialNameList"></h-select-block>
					</h-simple-select>
		       	</h-form-item>
		       	<h-form-item props="appNames" style="display:inline-block" label="所属项目：">					
		       		<h-input readonly v-model="searchData.appNames"></h-input>       		
		       	</h-form-item>
		       	<h-form-item  style="display:inline-block" label="资讯ID：">					
		       		<h-button type="primary" @on-click="handleSelectNewsId('formInlineAdd')">快速选择</h-button>		       		
		       	</h-form-item>
			</h-form>
		</div>
		<template v-else>
			<NewsDetail 
				ref="specailNewsDetail"
				@handleSelectNewsId="handleSelectNewsId('formInline')" 
				@closePublishDetail="closePublishDetail"
				:specialNameList='specialNameList' 
				:newsId="newsId" 
				:pageType="pageType" 
				:commonFilters="commonFilters" 
				:labelList="labelListCorp"  
				:industryTags="labelListIndustry"
				:conceptTags="conceptTags"
				:indicatorTags="indicatorTags"
				:regionTags="regionTags"
				:secuTags="secuTags"
				:showBtns='showBtns'
				:hiddenItemArr='newsType =="2" ? hiddenItemArrFastNews : hiddenItemArrDefault'
				:isSpecialPage="true"
				:ruleInlineData="ruleInlineSpecial"
				:opinionListComment="opinionListComment"
			    :opinionListRecommend="opinionListRecommend"
				>
			</NewsDetail>			
		</template>			
		<h-msgBox
			:isOkLeft="true"
			class="modalAddSpecial"
	        v-model="modalShow"
	        width="88%"
	        title="选择资讯"
	        :footerHide="true">   	        
		        <div  style="position: relative;">	    
		        	<h-spin fix v-if="tableLoading">
					 	<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				   		<div>加载中...</div>
					</h-spin>
 					<SearchHeads :readonlyFlag="true" ref="searchHead">
						<template slot="buttons">
							<h-button type="primary" data-ref="init-btn" @click="handleSearch">查询</h-button>
						</template>			
					</SearchHeads>
					<div class="tab-box tag-relotion-tab-box">					
						<h-table
							size="small"
							
							stripe
							:maxHeight="heightValue"
							:columns="commonTableCols"
							:data="commonTableDatas"
							@on-sort-change="handleSortFn"
							@on-selection-change="selectChange"
							@on-select-cancel="cancelSelect"
							:highlight-row="false"
							border>
						</h-table>
						<h-page highlight-row size="small" show-elevator	show-total show-sizer placement="top" class="page-box"  :total="total" :current="pagination.current" :page-size-opts="pageSizeOpts" @on-page-size-change="onPageSizeChange"  :page-size="pagination.size" @on-change="onPageChange" ></h-page>		
						<div class="checkNum">{{'当前已选择 '+ selectIdArr.length+' 条'}}</div>		
					</div>
		        </div>			          
	         <div class="footerBox">
	         	<h-button @click="modalShow = false">取消</h-button>
	            <h-button style="margin-left: 10px" type="info" @click="confirmSelect">确定</h-button>	            
	        </div>
	   </h-msgBox>
	</div>
</template>

<script>	
	import utils from "@/utils/index";
	const TODAY = utils.getToday();
	import NewsDetail from '@/components/jintan_news_detail';
	import SearchHeads from '@/components/search-news-head';
	import { ArrToString,stringToArray } from "@/filters/index";
	import {mapState,mapActions} from "vuex";
	export default{
		components: {NewsDetail,SearchHeads},
		computed: {
			...mapState(['opinionListComment','opinionListRecommend']),
		},
		data(){
			return{
				searchData:{
					themeId:'',
					appNames:''
				},
				appIds:[],
				ruleInline: {
					themeId: [
						{ required: true, message: '专题名称不能为空', trigger: 'change' }
					],
				},
				specialNameList:[],
				showAddContent:false,
				modalShow:false,
				/*新增内容显示*/
				detailLoading:false,
				newsType:'1',
				newsId:'',
				pageType:'SPECIALADD',
				commonFilters: {},
				labelListCorp:[],	
				labelListIndustry:[],	
				conceptTags:[],
				indicatorTags:[],
				regionTags:[],
				secuTags:[],
				hiddenItemArrDefault:['newsId','sentiment', 'newsImportance'],
				hiddenItemArrFastNews:['newsId','dsNewsColumns','tradingMarket','mediaSource','mediaSourceCode','layoutNumber','layoutInfo','author','authorOrg','authorOrgCode','rangePlus','form','subtitle', 'summary','labelListConcept','labelListIndicator','labelListIndustry','conclusion','opinionType','sentiment', 'newsImportance'],
				hiddenItemArr:['themeId','appIds','dsNewsColumns','tradingMarket','mediaSource','mediaSourceCode','layoutNumber','layoutInfo','author','authorOrg','authorOrgCode','rangePlus','form','subtitle', 'summary','labelListConcept','labelListIndicator','labelListIndustry','conclusion','opinionType','sentiment', 'newsImportance'],
				showBtns:['save','publish'],
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
				/*选择列表*/
				hideSelectItemArr:['handleUser'],
				tableLoading: false,
				heightValue:200,
				pagination: {
					current: 1,
					size:10
				},
				pageSizeOpts:[10,20,50,100],
				total:0,
				changePageflag:false,					
				searchDataStatics:null,
				modalSearchData:{},
				publishDateRange: [TODAY, TODAY],
				selectIdArr:[],//table选中项
				commonTableCols:[
					{
						type: "selection",
						width: 60,
						align: "center",
						fixed: "center",
					},
					{
						key: "handleStatusDesc",
						title: "处理状态",
						width: 100,
						align: "left",
						render: (h, params) => {
							let handleStatusData = [
								h("span", params.row.handleStatusDesc)
							];
							return h("div", handleStatusData);
						}
					},
					{
						key: "newsId",
						title: "资讯 ID",
						// sortable: true,
						width: 160,
						align: "left"
					},
					{
						key: "srcPublishDate",
						title: "信息发布时间",
						width: 150,
						align: "left",
						sortable: 'custom'
					},
					{
						key: "title",
						title: "标题",
						width: 410,
						align: "left",
						sortable:'custom'
					},
					{
						key: "dsSourceName",
						title: "信息来源",
						width: 150,
						align: "left",
						sortable:'custom'
					},
					{
						key: "mediaSource",
						title: "媒体出处",
						width: 150,
						align: "left",
						sortable:'custom'
					},
					{
						key: "dsNewsColumns",
						title: "资讯原始栏目",
						width: 200,
						align: "left"
					},
					
					{
						key: "author",
						title: "撰写作者",
						width: 160,
						align: "left",
					},
					{
						key: "publishStatusDesc",
						title: "公开标志",
						width: 100,
						align: "center",
					},{
						key: "handleUserName",
						title: "修改人员",
						width: 120,
						align: "center"					

					},{
						key: "updateTime",
						title: "修改时间",
						width: 150,
						align: "left",
						sortable: 'custom'
					},{
						key: "createTime",
						title: "入库时间",
						width: 150,
						align: "left",
						sortable: 'custom'
					}
				],
				commonTableDatas: [],
			}
		},
		methods:{
			changeSpecialName(){
				let themeId = this.searchData.themeId;
				if(themeId){
					this.getAppIdBySpecialName(themeId);
				}				
			},
			getAppIdBySpecialName(themeId){
				let url = '/tm/getAppsMap?themeId='+themeId;
        		this.$http.get(url).then((res) => {
	            	let data = res.data;
	                if(data.status == this.$api.SUCCESS){
	                	this.searchData.appNames = data.body.appNames || '';
	                	this.appIds = data.body.appIds.map(String) || [];
	                }else{
	                    this.$hMessage.error({content: data.msg})
	                }
	            }).catch(err=>{
	                this.$hLoading.error();
	            })
			},
			handleSelectNewsId(formName){
				if(formName == 'formInline'){
					this.modalShow = true;
					let storageId = JSON.parse(sessionStorage.getItem("themeId_appIds")) || null;
					this.$refs.searchHead.searchData.handleStatus = '1';//将处理状态置为公开
					this.$refs.searchHead.searchData.publishStatus = '1';//将公开标志置为公开						
					this.$refs.searchHead.searchData.appIds= storageId ? storageId.appIdsCopy : this.appIds;//获取所属项目
					this.handleSearch();
				}else{
					this.$refs[formName].validate((valid) => {
						if(valid){
							this.modalShow = true;
							this.$refs.searchHead.searchData.handleStatus = '1';//将处理状态置为公开
							this.$refs.searchHead.searchData.publishStatus = '1';//将公开标志置为公开	
							this.$refs.searchHead.searchData.appIds= this.appIds;
							this.handleSearch();
						}
					});		
				}						
			},
			handleSearch(){				
				this.modalSearchData = this.$refs.searchHead.searchData;
				this.selectIdArr = [];
				this.pagination.current = 1;
				this.changePageflag = false;
				this.getInfoList();
			},	
			onPageChange (current){
				this.changePageflag = true;
				this.pagination.current = current;
				this.getInfoList();
			},
			onPageSizeChange (size) {
				this.changePageflag = true;
				this.pagination.size = size;
				this.getInfoList();
			},
			handleSortFn(params){
				if(params.order =='normal'){
					this.modalSearchData.order = 0;
					this.modalSearchData.orderByWhich = '';
				}else{
					this.modalSearchData.order = params.order == 'asc' ? 1 : 0;
					if(params.key == 'dsSourceName'){
						params.key = 'dsSourceType';
					}
					this.modalSearchData.orderByWhich = params.key;
				};		
				this.handleSearch();
			},
			/**获取资讯列表**/
			getInfoList(){
				this.tableLoading = true;
				let url = '/tm/getNewsInfos';
	            this.$http.post(url,{...this.modalSearchData,...this.pagination}).then((res) => {
	            	let data = res.data;
	                if(data.status == this.$api.SUCCESS){
	                	let commonTableDatas = data.body.records || [];	                	
		                this.total = data.body.total;
		                commonTableDatas.forEach((item,i)=>{
                			if(item.handleStatus != "1"){
	                			item['_disabled'] = true
	                		}
	                	});	
	                	this.commonTableDatas = [...commonTableDatas];
	                	if(this.changePageflag){
	                		this.commonTableDatas.forEach((item,i)=>{
	                			if(this.selectIdArr.indexOf(item.newsId) != -1){
		                			item['_checked'] = true
		                		}
	                			if(item.handleStatus != "1"){
		                			item['_disabled'] = true
		                		}
		                	});	
		                }else{
		                	this.selectIdArr = [];
		                }
	                }else{
	                    this.$hMessage.error({content: data.msg})
	                }
	                this.tableLoading = false;
	            })
	            .catch(err=>{
	                this.$hLoading.error();
	                this.tableLoading = false;
	            })
			},
			cancelSelect(selection,row){ 
				//取消选择某一项
				let  index = this.selectIdArr.indexOf(row.newsId);
				if (index != -1) { 
					this.selectIdArr.splice(index, 1); 
				}  
			},
			selectChange(selection){
			   let selectArr = selection;
		       let selectArrId = [];
		       selectArr.forEach((item,index)=>{
		       	  selectArrId.push(item.newsId)
		       })	  
			   if(this.changePageflag){
			   	//翻页选择
			   	if(selectArr.length == 0){
				 	//翻页——全选取消选择
				 	this.commonTableDatas.forEach((item,i)=>{
				 		let index = this.selectIdArr.indexOf(item.newsId);
	            		if(index != -1){
	            			this.selectIdArr.splice(index,1);
	            		}	                		
	            	});	
	            	return;
				}
				   	let newSelectIdArr = this.selectIdArr.concat(selectArrId);
		       	  	this.selectIdArr = Array.from(new Set(newSelectIdArr));
		       }else{
		      	    //未翻页选择
			       	this.selectIdArr = selectArrId;	
		       } 			      
			},
			/**获取专题名称列表**/
			getSpecialNameList(){
				//status=1 启用状态的资讯
        		let url = '/tm/getThemesMap?status=1';
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
        	confirmSelect(){        		 
        		if(this.selectIdArr.length != 1 ){
        			this.$hMessage.warning({content: '请选择一条已公开资讯'});
        			return
        		}        		
        	    this.newsId = this.selectIdArr.join();
        	    this.getSpecialDetail();
        		this.modalShow = false;
        		this.showAddContent = true;
        		if(this.$refs.specailNewsDetail){
	        		this.$refs.specailNewsDetail.addSave = false;
	        		this.$refs.specailNewsDetail.addPublic= false;	        		
        		};        		
        	},
        	closePublishDetail(){
        		this.showAddContent = false;
        		this.searchData ={
					themeId:'',
					appNames:''
				};
				if(this.$refs['formInlineAdd']){
					this.$refs['formInlineAdd'].resetFields();
				}        		
        	},
        	getSpecialDetail(){
        		this.detailLoading = true;
        		let url = '/tm/getNewsInfoDetail?newsId='+this.newsId;
        		this.$http.get(url).then((res) => {
	                let data = res.data ? res.data : {};
	                if(data.status == this.$api.SUCCESS){
	                	let commonFilters = data.body || {};  
	 	                this.newsId = commonFilters.newsId;
	 	                this.newsType = commonFilters.newsType;	 
	 	                let storageId = JSON.parse(sessionStorage.getItem("themeId_appIds")) || null;
	 	                if(storageId){
	 	                	commonFilters.themeId = storageId.themeId || '';
	 	                	sessionStorage.removeItem('themeId_appIds');
	 	                }else{
	 	                	 commonFilters.themeId =  this.searchData.themeId.toString();
	 	                };
	 	                commonFilters.appIds =  this.searchData.appNames;
//	 	                commonFilters.srcPublishTime =  commonFilters.srcPublishDate;             		
	               		commonFilters.sensitives =commonFilters.sensitiveWords;
	               		// commonFilters.dsSourceType = commonFilters.dsSourceName;
	               		commonFilters.sentimentLabel = commonFilters.sentimentsName;
	               		commonFilters.level= commonFilters.levelName;
	               		commonFilters.title= commonFilters.titleShow;	               		
	               		commonFilters.areaCode= commonFilters.areaName;
//						commonFilters.authorOrgCode= commonFilters.authorOrgName;
						commonFilters.financial= commonFilters.financialName;
						commonFilters.financialPlus= commonFilters.financialPlusName;
						commonFilters.tradingMarket = commonFilters.tradingMarketName;
						commonFilters.form= commonFilters.formName;
						commonFilters.range= commonFilters.rangeName;
						commonFilters.rangePlus= commonFilters.rangePlusName;
 						
	               		if(commonFilters.themeId == '32'){
	               			commonFilters.opinionList = this.opinionListComment;//股市评论
	               			commonFilters.special = true;
	               		}else if(commonFilters.themeId == '23'){
	               			commonFilters.opinionList = this.opinionListRecommend;//个股推荐
	               			commonFilters.special = true;
	               		}else{
	               			commonFilters.special = false;
	               		};
	               		this.labelListCorp = commonFilters.corpTags || [];
	               		this.labelListIndustry = commonFilters.industryTags || [];
	               		this.conceptTags = commonFilters.conceptTags || [];
	               		this.indicatorTags = commonFilters.indicatorTags || [];
	               		this.regionTags =  commonFilters.regionTags || [];
	               		this.secuTags =  commonFilters.secuTags || [];
	               		this.commonFilters = {...commonFilters}; 
	                }else{
	                	this.$hMessage.error({
	                        content: data.msg,
	                        duration: 3
	                   	});                    
	                }  
	                this.detailLoading = false;
	            }).catch(err=>{
	                this.detailLoading = false;
	            })
        	},
		},
		mounted(){		
			this.$store.commit('GET_AUTORORGLIST',[]);
			this.$store.dispatch('getOpinionListComment','opinionListComment');
		    this.$store.dispatch('getOpinionListRecommend','opinionListRecommend');
			this.getSpecialNameList();   	
		}
	}
</script>
<style>
.modalAddSpecial .h-modal-body {
    padding: 5px 32px 10px 32px;
}
.modalAddSpecial  .h-modal-content{
	left:7.5%!important;
}
</style>
<style scoped>
	.footerBox{
		text-align: center;
		padding: 20px 0;
	}
</style>