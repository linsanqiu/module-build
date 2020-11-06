<template>
	<section style="position: relative;">
		<SearchHeads ref="searchHead" :lazyload="true">
			<template slot="buttons">
				<h-button type="primary" data-ref="init-btn" @click="handleProcessFn">进入流程</h-button>
				<h-button v-if="activeRoutersButton.indexOf('searchBtn') != -1" type="primary" data-ref="init-btn" @click="handleSearch">查询</h-button>
				<h-button v-if="activeRoutersButton.indexOf('delBatchBtn') != -1" type="primary" data-ref="init-btn" @click="handleDeleteBatch">批量删除</h-button>
				<h-button v-if="activeRoutersButton.indexOf('addBtn') != -1" type="primary" data-ref="init-btn" @click="handleNewPage">新建</h-button>
				<h-button v-if="activeRoutersButton.indexOf('exportBtn') != -1"  type="primary" data-ref="init-btn" @click="exportFn" :loading='isExporting'>导出</h-button>
				<h-tooltip placement="top-end" content="请选择是否自动刷新表格的数据!">
					<h-switch size="large" v-model="isAutoRefreshTable">
						<div slot="open">
							
							<span>打开</span>
						</div>
						<div slot="close">
							<span>关闭</span>
						</div>
					</h-switch>
				</h-tooltip>
			</template>			
		</SearchHeads>
		<div class="tab-box tag-relotion-tab-box">					
			<h-table
				ctrSelection
				canMove
				class="full-max-height-table"
				:maxHeight="maxTableHeight"
				size="small"
				stripe
				:columns="commonTableCols"
				:data="commonTableDatas"
				:loading="tableLoading"
				@on-sort-change="handleSortFn"
				@on-selection-change="selectChange"
				@on-select-cancel="cancelSelect"
				@on-row-dblclick="handleDbclick"
				:highlight-row="true"
				border>
			</h-table>
			<h-page highlight-row size="small" show-elevator	show-total show-sizer placement="top" class="page-box"  :total="total" :current="pagination.current" :page-size-opts="pageSizeOpts" @on-page-size-change="onPageSizeChange"  :page-size="pagination.size" @on-change="onPageChange" ></h-page>		
			<div class="checkNum">{{'当前已选择 '+ selectIdArr.length+' 条'}}</div>		
		</div>
	</section>
</template>

<script>
	import utils from "@/utils";
	const TODAY = utils.getToday();
	import SearchHeads from '@/components/search-news-head';
	export default {
		components: {SearchHeads},
		name:'TbmNewsList',
		data () {
			return {
				activeRoutersButton : this.$store.state.activeRoutersButton,//控制按钮权限
				isAutoRefreshTable:false,
				tableLoading: false,
				heightValue:null,
				pagination: {
					current: 1,
					size:10
				},
				pageSizeOpts:[10,20,50,100],
				total:0,
				changePageflag:false,					
				searchDataStatics:null,
				handleArr:[],
				searchData:{},
				publishDateRange: ['', ''],
				selectIdArr:[],//table选中项
				areaList:[],
				typeList:[],
				typeplusList:[],				
				commonTableCols: [
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
							let handleStatusData = null;
//							0代表为被锁，1代表其他人持有锁--黑色，2代表自己持有锁--黄色
							if(params.row.processingType != 0){
								handleStatusData = [
									h("Icon", {
										props: {
											name: "person"
										},
										style:{
											color: params.row.processingType == 2 ? 'rgba(243, 222, 66, 0.97)' : ''
										},
										attrs:{
											title: params.row.lockUserName ? params.row.lockUserName+'处理中' : '处理中'
										}
									}),
									h("span", params.row.handleStatusDesc)
								];								
							}else{
								handleStatusData = [
									h("span", params.row.handleStatusDesc)
								];
							}
							return h("div", handleStatusData);
						}
					},
					{
						key: "newsId",
						title: "资讯 ID",
						// sortable: true,
						width: 160,
						align: "left",
						render: (h, params) => {
							return <div v-clickCopy>{params.row.newsId}</div>
						}
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
						sortable:'custom',
						render: (h, params) => {
							return h("span",{
								domProps: {
								    innerHTML: params.row.title
								},
								directives:[
									{
										name: 'clickCopy',
									}
								]
							},params.row.title);
						}
					},

					{
						key: "dsSourceName",
						title: "信息来源",
						width: 150,
						align: "left",
						sortable:'custom',
						render: (h, params) => {
							return <div v-clickCopy>{params.row.dsSourceName}</div>
						}
					},
					{
						key: "mediaSource",
						title: "媒体出处",
						width: 150,
						align: "left",
						sortable:'custom',
						render: (h, params) => {
							return <div v-clickCopy>{params.row.mediaSource}</div>
						}
					},
					{
						key: "mediaSourceCode",
						title: "媒体出处常量",
						width: 150,
						align: "center"
					},
					{
						key: "dsNewsColumns",
						title: "资讯原始栏目",
						width: 200,
						align: "left",
						render: (h, params) => {
							return <div v-clickCopy>{params.row.dsNewsColumns}</div>
						}
					},					
					{
						key: "author",
						title: "撰写作者",
						width: 160,
						align: "left",
						sortable:'custom'
					},
					{
						key: "level",
						title: "信息级别",
						width: 80,
						align: "center",
					},{
						key: "appName",
						title: "所属项目",
						width: 130,
						align: "center"
					},{
						key: "range",
						title: "范围",
						width: 100,
						align: "center"
					},{
						key: "rangePlus",
						title: "范围细分",
						width: 120,
						align: "center"
					},{
						key: "financial",
						title: "金融市场",
						width: 100,
						align: "center"
					},{
						key: "financialPlus",
						title: "金融市场细分",
						width: 120,
						align: "center"
					},{
						key: "authorOrg",
						title: "撰写机构",
						width: 100,
						align: "center",
						sortable:'custom'
					},{
						key: "authorOrgCode",
						title: "撰写机构常量",
						width: 150,
						align: "center",
						sortable:'custom'
					},
					{
						key: "layoutInfo",
						title: "版面信息",
						width: 100,
						align: "center",
						sortable:'custom'
					},{
						key: "layoutNumber",
						title: "版面号",
						width: 80,
						align: "center",
						sortable:'custom'
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
					},
					{
						key: "publishUserName",
						title: "首次公开人员",
						width: 150,
						align: "left",
					},
					{
						key: "publishDate",
						title: "首次公开时间",
						width: 150,
						align: "left",
					},
					{
						key: "delReason",
						title: "删除原因",
						width: 150,
						align: "left",
					},
					{
						key: "operation",
						title: "操作",
						width: 130,
						align: "center",
						fixed: "right",
						render: (h, params) => {
							let btnList = params.row.newsOperateVoList;
							let links = [];
							links = btnList.map((obj, i) => {
								let {
									operateDesc: desc,
									operateType: type,
								} = obj;
								let operateUrl = ``;
								let routerPath = ``;
								let btnCon = ``;
								let handleStatus = params.row.handleStatus
								let newsId = params.row.newsId;
								let ref = this.$md5(`${newsId}TBM-COMPOSE`);
								let index = params.index
								let showBtn = false;
								/**按钮类型---- 1：编辑，2：删除，3：恢复，4：置顶，5：取消置顶，6：下架 7：查看**/
								switch (type) {
									case 1:
										operateUrl = ``;
										routerPath = `/tbm/news/handle`;
										btnCon = `icon-t-b-message`;
										showBtn = (this.activeRoutersButton.indexOf('editBtn') != -1 || handleStatus != 0)? true : false;
										break;
									case 2:							 
										operateUrl = `/tm/news/delete`;
										routerPath = ``;
										btnCon = `icon-t-b-delete`;
										showBtn = this.activeRoutersButton.indexOf('delBtn') != -1 ? true : false;
										break;
									case 3:
										operateUrl = `/tm/news/recover`;
										routerPath = ``;
										btnCon = `icon-t-b-return`;
										showBtn = this.activeRoutersButton.indexOf('recoverBtn') != -1 ? true : false;
										break;
									case 4:
										operateUrl = `/tm/news/top`;
										routerPath = ``;																				
										btnCon = `icon-android-arrow-up`;
										showBtn = this.activeRoutersButton.indexOf('topBtn') != -1 ? true : false;
										break;
									case 5:
										operateUrl = `/tm/news/top`;
										routerPath = ``;
										btnCon = `icon-android-arrow-down`;		
										showBtn = this.activeRoutersButton.indexOf('cancelTopBtn') != -1 ? true : false;
										break;
									case 6:
										operateUrl = `/tm/news/remove`;
										routerPath = ``;
										btnCon = `icon-t-b-movedown`;	
										showBtn = this.activeRoutersButton.indexOf('offLineBtn') != -1 ? true : false;
										break;
									case 7:
										operateUrl = ``;
										routerPath = `/tbm/news/view`;
										btnCon = `icon-view`;
										showBtn = this.activeRoutersButton.indexOf('viewBtn') != -1 ? true : false;
										break;
								}
								if(showBtn){
									return h("span", {
										attrs: {
											"data-url": operateUrl,
											"data-type": type,
											"title": desc
										},
										style:{
		 									color:type == 2 ? '#F5222D' : '#298DFF'
		                                },
										class: [
											 btnCon,
		                                    'iconfont',	                                     
						                    'tab-icon-btn'
		                                ],
										on: {
											click: (e) => {
												if(type==1 ||  type == 7){
													if(type==1){
														this.handleLock(newsId,(res)=>{
															if(res){	
																sessionStorage.setItem('freshDetail',true);
																this.$router.push({path:routerPath,query:{newsId: newsId, ref: ref}});
															}
														});
													}else{
														this.$router.push({path:routerPath,query:{newsId: newsId, ref:ref}});
													}											
												};
												if(type==2){
													this.$hMsgBox.confirm({
														isOkLeft:true,
														title:'删除资讯',
														content:'确定要删除该条资讯:'+newsId +'?',
														onOk:()=>{
															 let newsIdArr = newsId.split();
															 this.handleDelete(newsIdArr);
														}
													})
												};
												if(type == 3){
													this.$hMsgBox.confirm({
														isOkLeft:true,
														title:'资讯恢复',
														content:'资讯:'+newsId+'已删除，确定要恢复？',
														onOk:()=>{
															 this.handleRecover(newsId, index);
														}
													})
												} 
												if(type == 4){
													this.$hMsgBox.confirm({
														isOkLeft:true,
														title:'置顶',
														content:'确定要将资讯:'+newsId+'置顶？',
														onOk:()=>{
															 this.handleTop(newsId,1,'置顶');
														}
													})
												} 
												if(type == 5){
													this.$hMsgBox.confirm({
														isOkLeft:true,
														title:'取消置顶',
														content:'确定要将资讯:'+newsId+'取消置顶？',
														onOk:()=>{
															 this.handleTop(newsId,2,'取消置顶');
														}
													})
												} 
												if(type == 6){
													this.$hMsgBox.confirm({
														isOkLeft:true,
														title:'下架',
														content:'确定要将资讯:'+newsId+'下架？',													
														onOk:()=>{
															 this.handleOffline(newsId);
														}
													})
												}
											}
										}
									});
								}
							  }
							);
							return h("div", links);
						},
					}
				],
				commonTableDatas: [],
				newsIdListsNext:[],
				isExporting: false
			}
		},
		computed: {
			maxTableHeight(){ return this.$store.state.maxTableHeight },
		},
		methods: {
            remoteMethod(query) {
                if (query !== '') {
                    this.loadingSearchLabel = true;
                    setTimeout(() => {
                        this.loadingSearchLabel = false;
                        const list = this.bigDataCategory.map(item => {
                            return {
                                value: item.value,
                                label: item.label
                            };
                        });
                        this.selectBaseDataCategory = list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
                    }, 200);
                }else {
                    this.selectBaseDataCategory = [...this.bigDataCategory];
                }
            },
			handleSortFn(params){
				if(params.order =='normal'){
					this.searchData.order = 0;
					this.searchData.orderByWhich = '';
				}else{
					this.searchData.order = params.order == 'asc' ? 1 : 0;
					if(params.key == 'dsSourceName'){
						params.key = 'dsSourceType';
					}
					if(params.key == '"handleStatusDesc"'){
						params.key = '"handleStatus';
					}
					if(params.key == 'publishStatusDesc'){
						params.key = 'publishStatus';
					}
					if(params.key == 'infoLevelDesc'){
						params.key = 'infoLevel';
					}
					this.searchData.orderByWhich = params.key;
				};		
				this.handleSearch();
			},
			onPageChange (current){
				this.changePageflag = true;
				this.pagination.current = current;
				this.getInfoList();
			},
			onPageSizeChange (size) {
				this.changePageflag = false;
				this.pagination.size = size;
				this.getInfoList();
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
				this.commonTableDatas.forEach((item,i)=>{
					let index = this.selectIdArr.indexOf(item.newsId);
					if(index != -1){
						this.selectIdArr.splice(index,1);
					}	                		
				});
			   	if(selectArr.length == 0){
					   
				}else{
					let newSelectIdArr = this.selectIdArr.concat(selectArrId);
		       	  	this.selectIdArr = Array.from(new Set(newSelectIdArr));
				}
		       }else{
		      	    //未翻页选择
			       	this.selectIdArr = selectArrId;	
		       } 			      
			},
			/**获取资讯列表--查询按钮**/
			handleSearch(){
				this.selectIdArr = [];
				this.pagination.current = 1;
				this.changePageflag = false;
				this.getInfoList();
			},
			handleProcessFn(){
				if(!this.$refs.searchHead.searchData.appIds || this.$refs.searchHead.searchData.handleStatus !== '0'){		
					 this.$hMessage.warning({content:'进入流程前需单选所属项目，且处理状态选“待处理”'});
					 return
				}else{
					sessionStorage.setItem("searchDataProcess", JSON.stringify({...this.searchData,...this.pagination}));	
					this.getNextIds();					
				}
			},
			getNextIds(){
				let url = '/tm/news/next';
				let saveObj = {currentNewsId: ''};	
				this.$http.post(url, {...saveObj,...this.searchData,...this.pagination}).then((res) => {
					let data = res.data;
					if (data.status == this.$api.SUCCESS) {						
						let newsId = data.body.newsId || '';
						let ref = this.$md5(`${newsId}TBM-COMPOSE`);
						if(!newsId){
							this.$hMessage.warning({content:'没有符合条件的资讯！'});
							return
						};
						sessionStorage.setItem('freshDetail',true);
						this.$router.push({path:'/tbm/news/handle',query:{newsId: newsId,isProcess:1, ref: ref}});
					} else {
						this.$hMessage.error({ content: data.msg })
					}
				}).catch(err => {
					this.$hLoading.error();
				})
			},
			getHandleUser(){
	    		let url = '/tm/news/getalluers?newsType='+this.searchData.newsType; 		
	            this.$http.get(url).then((res) => {
	            	let data = res.data;
	                if(data.status == this.$api.SUCCESS){
	                	this.handleArr = data.data || [];
	                }else{
	                    this.$hMessage.error({content: data.msg})
	                }
	            })
	            .catch(err=>{
	                this.$hLoading.error()
	            })
	    	},
			/**获取资讯列表**/
			getInfoList(){
				this.tableLoading = true;
				if(!this.tableLoading)return
				let url = '/tm/news/getNewsList';
				this.searchData.newsType = '1,3'
	            this.$http.post(url,{...this.searchData,...this.pagination}).then((res) => {
	            	this.tableLoading = false;
	            	let data = res.data;
	                if(data.status == this.$api.SUCCESS){
	                	let commonTableDatas = data.body.records || [];	                	
		                this.total = data.body.total;            
		                commonTableDatas.forEach((item,i)=>{
		                	item.title = item.title.replace(/ /g, '&nbsp;');
                			if(item.handleStatus != 0){
	                			item['_disabled'] = true
	                		}
	                	});	
	                	this.getWindowMaxWidth();
	                	if(this.changePageflag){
	                		commonTableDatas.forEach((item,i)=>{
	                			if(this.selectIdArr.indexOf(item.newsId) != -1){
		                			item['_checked'] = true
		                		}
	                			if(item.handleStatus != 0){
		                			item['_disabled'] = true
		                		}
		                	});			                	
		                }else{
		                	this.selectIdArr = [];
		                }
		                this.commonTableDatas = [...commonTableDatas];
		                /**缓存查询条件,处理页查询下一条**/
		                sessionStorage.setItem("searchData", JSON.stringify({...this.searchData,...this.pagination}));
		                
	                }else{
	                    this.$hMessage.error({content: data.msg});
	                }
	                
	            })
	            .catch(err=>{
	                this.$hLoading.error();
	                this.tableLoading = false;
	            })
			},
			handleLock(newsId,cb){
				let url =`/tm/news/lock?newsId=${newsId}&type=1`;
	            this.$http.get(url).then((res) =>{
	            	let data = res.data;
	                if(data.status == this.$api.SUCCESS){
	                	cb(true);
	                }else{
	                    this.$hMessage.error({content: data.msg});
	                    cb(false);
	                }
	            })
	            .catch(err=>{
	                this.$hLoading.error();
	            })	
			},
			 /**批量删除资讯列表**/
			handleDeleteBatch(){
				if(this.selectIdArr.length == 0){
	    			this.$hMessage.warning('请选择要删除的资讯');
	    			return
	    		}
	    		this.$hMsgBox.confirm({
	    			isOkLeft:true,
					title:'批量删除',
					content:'共'+ this.selectIdArr.length +'条资讯，是否确认删除?',
					onOk:()=>{
						this.handleDelete(this.selectIdArr);
					},
					onCancel:()=>{
						 
					},
				})	   	
			},
			handleDelete(newsId){
				let url = '/tm/news/delete';
	            this.$http.post(url,{newsIdList:newsId}).then((res) => {
	                let data = res.data ? res.data : {};
	                if(data.status == this.$api.SUCCESS){
	 	                this.$hMessage.info({
	                        content: '删除成功',
	                        duration: 3
	                    })   	 
	                    this.handleSearch();
	                }else{
	                    this.$hMessage.error({
	                        content: data.msg,
	                        duration: 3
	                    })
	                }   
	            }).catch(err=>{
	                
	            })
			},
			/**生成新建资讯ID**/
			handleNewPage(){
				sessionStorage.setItem('addClick',true);
				this.$router.push({path:'/tbm/news/add'});
			},
			/**恢复删除资讯列表**/
			handleRecover(newsId, index){
				let url ='/tm/news/recover?newsId='+newsId;
	            this.$http.get(url).then((res) =>{
	            	let data = res.data;
	                if(data.status == this.$api.SUCCESS){
	                	 this.$hMessage.info({
	                        content: '恢复成功',
	                        duration: 3
						 });
						 this.commonTableDatas[index].handleStatus = 0
						 this.commonTableDatas[index].handleStatusDesc = '待处理'
						 this.commonTableDatas[index].newsOperateVoList = [
							{operateUrl: "", operateType: 7, operateDesc: "查看"},
							{operateUrl: "", operateType: 1, operateDesc: "编辑"},
							{operateUrl: "", operateType: 2, operateDesc: "删除"},
						 ]
	                    //   this.getInfoList();
	                }else{
	                    this.$hMessage.error({content: data.msg})
	                }
	            })
	            .catch(err=>{
	                this.$hLoading.error();
	            })				
			},
			handleTop(newsId,topStatus,tipStr){
				//置顶或取消置顶码（1:置顶，2:取消置顶）
				let url ='/tm/news/top?newsId='+newsId+'&topStatus='+topStatus;
	            this.$http.get(url).then((res) =>{
	            	let data = res.data;
	                if(data.status == this.$api.SUCCESS){
	                	 this.$hMessage.info({
	                        content: tipStr+'成功',
	                        duration: 3
	                     });
	                      this.handleSearch();
	                }else{
	                    this.$hMessage.error({content: data.msg})
	                }
	            })
	            .catch(err=>{
	                this.$hLoading.error();
	            })	
			},
			handleOffline(newsId){
				let url ='/tm/news/remove?newsId='+newsId;
	            this.$http.get(url).then((res) =>{
	            	let data = res.data;
	                if(data.status == this.$api.SUCCESS){
	                	 this.$hMessage.info({
	                        content:'下架成功',
	                        duration: 3
	                     });
	                      this.handleSearch();
	                }else{
	                    this.$hMessage.error({content: data.msg})
	                }
	            })
	            .catch(err=>{
	                this.$hLoading.error();
	            })	
				
			},
			handleOperateBtn(newsId,requestUrl,tipStr){
				this.$hMsgBox.confirm({
					isOkLeft:true,
					title:tipStr,
					content:'确定'+tipStr+'资讯:'+newsId+'？',
					onOk:()=>{
						let url =requestUrl+'?newsId='+newsId;
			            this.$http.get(url).then((res) =>{
			            	let data = res.data;
			                if(data.status == this.$api.SUCCESS){
			                	 this.$hMessage.info({
			                        content:tipStr+'成功',
			                        duration: 3
			                     });
			                      this.handleSearch();
			                }else{
			                    this.$hMessage.error({content: data.msg})
			                }
			            })
			            .catch(err=>{
			                this.$hLoading.error();
			            })							  
					}
				})				
			},
			/**双击跳转编辑页**/
			handleDbclick(dataRow){
				if (this.activeRoutersButton.indexOf('editBtn') == -1){
					return
				}
				this.handleLock(dataRow.newsId,(res)=>{
					if(res){
						let ref = this.$md5(`${dataRow.newsId}TBM-COMPOSE`);
						if(dataRow.handleStatus == 0 ||dataRow.handleStatus == 1){
						    sessionStorage.setItem('freshDetail',true);
							this.$router.push({path:'/tbm/news/handle',query:{newsId: dataRow.newsId, ref: ref}});							
						}else{
							this.$router.push({path:'/tbm/news/view',query:{newsId: dataRow.newsId, ref: ref}});
						}							
					}
				});				
			},			
			getWindowMaxWidth(){
				let maxWidth = window.screen.width || 1366;
				if (maxWidth < 1920) {
					this.heightValue = this.commonTableDatas.length >=10 ? 300 : null;
				} else {
					this.heightValue = this.commonTableDatas.length >=20 ? 650 : null;		
				}
			},
		    getCategoryLabelList(listType,categoryId){  
		    	let url = '/tm/queryDropDownTags?word='+ '&categoryId='+categoryId;    		
		        this.$http.get(url).then((res) => {
		        	let data = res.data;
		            if(data.status == this.$api.SUCCESS){
		            	let obj = data.body || {};
		            	let selectBaseDataCategory = obj.records || [];
		            	const list = selectBaseDataCategory.map(item => {
					            return {
					                value: item.tagId,
					                label: item.tagName
					            };
					    });
					    if(!categoryId){
					    	this.bigDataCategory= [...list];
					    }						
						this[listType] =  [...list];
		            }else{
		                this.$hMessage.error({content: data.msg})
		            }
		        })
		        .catch(err=>{
		            this.$hLoading.error();
		        })            	
		    },	  
		    searchDatas(){			
				this.handleSearch();
			},
			/*统计分析查询条件*/
			getSearchDataStatics(newObj){				 
				this.publishDateRange = [newObj.startTime,newObj.endTime];
	    		this.searchData.publishDate = this.publishDateRange[0];	    		
	    		this.searchData.publishDateEnd = this.publishDateRange[1];
	    		this.searchData.handleStatus = newObj.handleStatus;
	    		this.$refs.searchHead.searchData.handleStatus = this.searchData.handleStatus;
			    this.$refs.searchHead.publishDateRange = this.publishDateRange;
			    this.getHandleUser();
	    		this.handleSearch();				 
			},
			exportFn(){
        		let url = '/tm/news/export';
				let postData = {...this.searchData};
				this.isExporting = true
				postData.ids = 	this.selectIdArr;
				postData.newsType = '1'
				utils.exportDataFn(postData,url,(res)=>{
					this.isExporting = false
					if(res){
						utils.commonDownLoad(res,'资讯-'+ utils.getToday());
					}
				});			
			},
		},
		mounted(){
			this.searchData = this.$refs.searchHead.searchData;
			this.searchDatas();
			this.$refs.searchHead.searchDatas()
		},
		beforeRouteLeave (to, from, next) {
		    sessionStorage.removeItem("searchDataStatics");
		    next()
		},
		activated: function(){	 
			let newObj  = JSON.parse(sessionStorage.getItem("searchDataStatics")) || null;
			if(newObj){
				this.getSearchDataStatics(newObj);
			} 			
			if (this.isAutoRefreshTable){
				this.searchDatas();				
			}
		},
	}
</script>

<style>
/*.tag-relotion-tab-box .h-page-options-sizer{
	position: relative;
	top: 4px;
}*/
.tag-relotion-tab-box .h-table-fixed-right-patch{
	width: 0!important;
}
.tag-relotion-tab-box .h-table table tr{
	height: auto!important;
}
.filtrate-other-box{
	padding: 5px 15px 10px 0px;
}
.filtrate-other-box legend span{
	padding-left: 15px;
	color: #0072F5;
}
</style>
<style scoped>
.checkNum{
	position: absolute;
	bottom:10px;
	left: 0;
	color: red;
}
.filtrate-btn{
	margin:10px;
}
/*.filtrate-head-other li{
	margin-right: 10px;
}*/
.filtrate-head li .filtrate-btn .h-btn{
	margin-right:5px;
	margin-top: -10px;
}
.filtrate-head li .filtrate-btn .button-arrow{
	margin-top: -10px;
}
.filtrate-head li .filtrate-btn .h-tooltip{
	position: relative;
	top: -5px;
}
.button-arrow{
	 display: inline-block;
	 vertical-align: middle;
	 cursor: pointer;
	 margin-left: 5px;
}
.button-arrow-active{
	transform: rotate(180deg);
}
</style>
