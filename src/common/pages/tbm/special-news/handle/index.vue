<template>
	<div style="position: relative;">
		<search-form>
	      <ul slot="content">
	        <li>
	          <dl>
	            <dt>专题名称：</dt>
	            <dd>
	            	<h-simple-select placeholder="请选择专题名称" filterable v-model="searchData.themeId" >
						<h-select-block :data="specialNameList"></h-select-block>
					</h-simple-select>
	            </dd>
	          </dl>
	        </li>
	        <li>
	          <dl>
	            <dt>所属项目：</dt>
	            <dd>
	            	<h-select  placeholder="所属项目" v-model="searchData.appId">
						<h-option v-for="(item, i) in appList" :value="item.dictEntry" :key="item.dictEntry">
							{{item.entryName}}
						</h-option>
					</h-select>
	            </dd>
	          </dl>
	        </li>
	        <li>
	          <dl>
	            <dt>入库日期：</dt>
	            <dd>
	            	<h-date-picker placeholder="开始时间 - 结束时间" type="daterange" format="yyyy-MM-dd" :value="createDateRange" @on-change="onChangeDateRangePicker">
					</h-date-picker>
	            </dd>
	          </dl>
	        </li>
	        <li>
	          <dl>
	            <dt>信息发布日期：</dt>
	            <dd>
	            	<h-date-picker placeholder="开始时间 - 结束时间"  type="daterange" format="yyyy-MM-dd" :value="publishDateRange" @on-change="onChangeModDateRangePicker">
					</h-date-picker>
	            </dd>
	          </dl>
	        </li>
	        <li class="row0"></li>
			<li class="row2">
	          <dl>
	            <dt>资讯标题：</dt>
	            <dd>
	            	<h-input  placeholder="请输入资讯标题" v-model.trim="searchData.title" @on-enter="onChangeInputEnter(`title`)" icon="android-close" @on-click="shitClearableClick(`title`)"></h-input>
	            </dd>
	          </dl>
	        </li>
	        <li>
	          <dl>
	            <dt>资讯ID：</dt>
	            <dd>
	            	<h-input type="int" :maxlength="19" placeholder="请输入资讯ID" v-model="searchData.newsId"  icon="android-close" @on-click="shitClearableClick(`newsId`)"></h-input>
	            </dd>
	          </dl>
	        </li>
	       
	        <li>
				<dl>
					<dt>处理状态：</dt>
					<dd>
						<h-select aria-placeholder="处理状态" placeholder="请选择处理状态" v-model="searchData.handleStatus" @on-change="onNewsListTypeSelectChange(`handleStatus`)">
							<h-option v-for="(item, i) in processingStates" :value="item.dictEntry" :key="item.dictEntry">
								{{item.entryName}}
							</h-option>
						</h-select>
					</dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>修改人员：</dt>
					<dd>
						<h-select clearable placeholder="请选择" filterable  v-model="searchData.updaterId">
							<h-option v-for="item in handleArr" :value="item.id" :key="item.id">{{item.realName}}</h-option>
						</h-select>
					</dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>资讯类型：</dt>
					<dd>
						<h-select placeholder="请选择资讯类型" v-model="searchData.newsType" >
							<h-option v-for="(item, i) in newsTypeList" :value="item.dictEntry" :key="item.dictEntry">
								{{item.entryName}}
							</h-option>
						</h-select>
					</dd>
				</dl>
			</li>
	        <li>
	          <dl>
	            <dt>公开标志：</dt>
	            <dd>
	            	<h-checkbox-group v-model="publishStatus" @on-change="changePublishStatus">
				        <h-checkbtn v-for="(item, i) in newsOpenFlags"  :value="item.dictEntry" :label="item.entryName" :key="i">
				             <span>{{item.entryName}}</span> 
				        </h-checkbtn>
				    </h-checkbox-group>
	            </dd>
	          </dl>
	        </li>
	        
	        <li class="search-wrapper-but">
	          	<h-button type="primary" data-ref="init-btn" @click="handleSearch">查询</h-button>
	          	<h-button v-if="activeRoutersButton.indexOf('specialNewsAdd') != -1" type="primary" data-ref="init-btn" @click="handleNewPage">新建</h-button>
				<h-button v-if="activeRoutersButton.indexOf('specialNewsDelBatch') != -1" type="primary" data-ref="init-btn" @click="handlePubBatch">批量公开</h-button>				
				<h-button v-if="activeRoutersButton.indexOf('specialNewsExport') != -1"  type="primary" data-ref="init-btn" @click="exportFn" :loading='isExporting'>导出</h-button>
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
	        </li>
	      </ul>
   		</search-form>
		<div class="tab-box tag-relotion-tab-box">					
			<h-table
				ctrSelection
				canMove
				size="small"
				
				stripe
				class="full-max-height-table"
				:maxHeight="maxTableHeight"
				:columns="commonTableCols"
				:data="commonTableDatas"
				:loading="tableLoading"
				:highlight-row="true"
				@on-selection-change="selectChange"
				@on-row-dblclick="handleDbclick"
				@on-select-cancel="cancelSelect"
				border>
			</h-table>
			<h-page highlight-row size="small" show-elevator	show-total show-sizer placement="top" class="page-box"  :total="total" :current="pagination.current" :page-size-opts="pageSizeOpts" :page-size="pagination.size" @on-page-size-change="onPageSizeChange" @on-change="onPageChange"></h-page>		
			<div class="checkNum">{{'当前已选择 '+ selectIdArr.length+' 条'}}</div>		
		</div>
	</div>
</template>

<script>
	import {mapState,mapActions} from "vuex";
	import utils from "@/utils";
	const TODAY = utils.getToday();
	export default{
		name:'TbmSpecial-newsHandleIndex',
        data(){
         	return{
         		activeRoutersButton : this.$store.state.activeRoutersButton,//控制按钮权限
         		isAutoRefreshTable:false,
         		tableLoading:false,
         		handleArr:[],
         		searchData:{
         			themeId:'',
         			appId:'',
         			title:'',
         			newsId:'',
         			updaterId:'',
         			publishStatus:'0',
         			createDateBegin:TODAY,
         			createDateEnd:TODAY,
         			publishTimeBegin:'',
         			publishTimeEnd:'',
         			handleStatus:'',
         			newsType:'1'
         		},
         		publishStatus:['0'],
         		pagination: {
					current: 1,
					size:10
				},
				pageSizeOpts:[10,20,50,100],
				total:0,
         		specialNameList:[],//专题名称
         		publishDateRange: ['', ''],
         		createDateRange: [TODAY,TODAY],
         		selectIdArr:[],
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
							};
							return h("div", handleStatusData);
						}
					},
					{
						key: "themeName",
						title: "专题名称",
						// sortable: true,
						width: 160,
						align: "left"
					},
					{
						key: "appNames",
						title: "所属项目",
						// sortable: true,
						width: 160,
						align: "left"
					},
					{
						key: "newsPublishTime",
						title: "信息发布时间",
						width: 150,
						align: "left",
					},
					{
						key: "newsId",
						title: "资讯ID",
						width: 160,
						align: "left"
					},				
					{
						key: "title",
						title: "标题",
						width: 410,
						align: "left",
						render: (h, params) =>{ 
							return h("span",{
								domProps: {
								    innerHTML: params.row.title
								},
							},params.row.title);
						}
					},
					{
						key: "negotiableSecurities",
						title: "涉及证券",
						width: 160,
						align: "left"
					},
					{
						key: "dsSourceName",
						title: "信息来源",
						width: 150,
						align: "left",
						// sortable:'custom'
					},
					{
						key: "dsNewsColumns",
						title: "资讯原始栏目",
						width: 250,
						align: "left"
					},
					{
						key: "mediaSource",
						title: "媒体出处",
						width: 150,
						align: "left",
						// sortable:'custom'
					},
					{
						key: "level",
						title: "信息级别",
						width: 80,
						align: "left"
					},
					{
						key: "layoutNumber",
						title: "版面号",
						width: 100,
						align: "left"
					},
					
					{
						key: "author",
						title: "撰写作者",
						width: 160,
						align: "left",
					},
					{
						key: "titleImgLink",
						title: "标题图片",
						render: (h, params) => {
	                        return h('div',[
	                        	h('img',{
		                        	 style:{
	   									 'width':'30px',
	   									 'height':'25px',
	   									 'cursor':'pointer'
	                                },
	                                attrs:{
										src: params.row.titleImgLink,
										alt:'',
										title: '查看大图'
									},
									on: {
										click:()=>{
											window.open(params.row.titleImgLink);
										},
		                            }
		                        })
		                    ])   
                    	}
					},
					{
						key: "newsUrl",
						title: "链接地址",
						width: 320,
						align: "left",
					},
					{
						key: "publishStatusDesc",
						title: "公开标志",
						width: 100,
						align: "center",
					},{
						key: "publishTime",
						title: "公开时间",
						width: 150,
						align: "center",
					},{
						key: "updaterName",
						title: "修改人",
						width: 100,
						align: "left",
					},{
						key: "updateTime",
						title: "修改时间",
						width: 150,
						align: "left",
					},{
						key: "topUserName",
						title: "置顶人",
						width: 100,
						align: "left",
					},{
						key: "topTime",
						title: "置顶时间",
						width: 150,
						align: "left",
					},
					{
						key: "firstPublishUserName",
						title: "首次公开人员",
						width: 150,
						align: "left",
					},
					{
						key: "firstPublishTime",
						title: "首次公开时间",
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
								let newsId = params.row.id.toString();
								let showBtn = false;
								/**按钮类型  ---- 1：编辑，2：删除，3：恢复，4：置顶，5：取消置顶，6：下架**/
								switch (type) {
									case 1:
										operateUrl = ``;
										routerPath = `/tbm/special-news/handle/edit`;
										btnCon = `icon-t-b-message`;
										showBtn = this.activeRoutersButton.indexOf('specialNewsEditBtn') != -1 ? true : false;
										break;
									case 2:							 
										operateUrl = `/tm/deleteThemeNews`;
										routerPath = ``;
										btnCon = `icon-t-b-delete`;
										showBtn = this.activeRoutersButton.indexOf('specialNewsdelBtn') != -1 ? true : false;
										break;
									case 3:
										operateUrl = `/tm/recoverThemeNews`;
										routerPath = ``;
										btnCon = `icon-t-b-return`;
										showBtn = this.activeRoutersButton.indexOf('specialNewsRecoverBtn') != -1 ? true : false;
										break;
									case 4:
										operateUrl = `/tm/news/top`;
										routerPath = ``;																				
										btnCon = `icon-android-arrow-up`;
										showBtn = this.activeRoutersButton.indexOf('specialNewsTopBtn') != -1 ? true : false;
										break;
									case 5:
										operateUrl = `/tm/news/top`;
										routerPath = ``;
										btnCon = `icon-android-arrow-down`;		
										showBtn = this.activeRoutersButton.indexOf('specialNewsUnTopBtn') != -1 ? true : false;
										break;
									case 6:
										operateUrl = `/tm/news/remove`;
										routerPath = ``;
										btnCon = `icon-t-b-movedown`;	
										showBtn = this.activeRoutersButton.indexOf('specialNewsUnTopBtn') != -1 ? true : false;
										break;
									case 7:
										operateUrl = ``;
										routerPath = `/tbm/special-news/handle/view`;
										btnCon = `icon-view`;
										showBtn = this.activeRoutersButton.indexOf('JTSpecialNewsView') != -1 ? true : false;
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
													sessionStorage.setItem("oneSpecialNews", JSON.stringify(params.row));
													if(type==1){
														// sessionStorage.setItem('freshDetailSpecial',true);
														// this.$router.push({path:routerPath,query:{newsId:params.row.newsId,themeId:params.row.themeId,id:params.row.id}});
														this.handleLock(newsId,(res)=>{
															if(res){
																sessionStorage.setItem('freshDetailSpecial',true);
																this.$router.push({path:routerPath,query:{newsId:params.row.newsId,themeId:params.row.themeId,id:params.row.id}});
															}
														});
													}else{
														this.$router.push({path:routerPath,query:{newsId:params.row.newsId,themeId:params.row.themeId,id:params.row.id}});
													}											
												};
												if(type==2){
													this.$hMsgBox.confirm({
														isOkLeft:true,
														title:'删除资讯',
														content:'确定要删除该专题资讯：'+params.row.themeName+'('+params.row.newsId +')?',
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
														content:'资讯:“'+params.row.themeName+'”已删除，确定要恢复？',
														onOk:()=>{
															 this.handleRecover(newsId);
														}
													})
												} 
												if(type == 4){
													this.$hMsgBox.confirm({
														isOkLeft:true,
														title:'置顶',
														content:'确定要将资讯:'+params.row.themeName+'置顶？',
														onOk:()=>{
															 this.handleTop(newsId,1,'置顶');
														}
													})
												} 
												if(type == 5){
													this.$hMsgBox.confirm({
														isOkLeft:true,
														title:'取消置顶',
														content:'确定要将资讯:“'+params.row.themeName+'”取消置顶？',
														onOk:()=>{
															 this.handleTop(newsId,2,'取消置顶');
														}
													})
												} 
												if(type == 6){
													this.$hMsgBox.confirm({
														isOkLeft:true,
														title:'下架',
														content:'确定要将资讯:“'+params.row.themeName+'”下架？',													
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
				 isExporting: false,
         	}
       },
        methods:{
        	onNewsListTypeSelectChange(type) {
				let value = this.searchData[type];
				this.searchData[type] = value.trim();
			},
        	onChangeDateRangePicker (values) {
				this.createDateRange = values;
				this.searchData.createDateBegin = values[0];
				this.searchData.createDateEnd= values[1];
			},
        	onChangeModDateRangePicker(values){
				this.publishDateRange = values;
				this.searchData.publishTimeBegin= values[0];
				this.searchData.publishTimeEnd = values[1];
			},
			onChangeInputEnter (type = ``) {
				let value = this.searchData[type];
				this.searchData[type] = value.trim();
				this.handleSearch();
			},
			shitClearableClick(type = ``) {
				this.searchData[type] = ``;
			},
        	handleSearch(){
				this.selectIdArr = [];
				this.pagination.current = 1;
				this.changePageflag = false;
				this.getInfoList();
			},			
        	handleNewPage(){
        		this.$router.push({path:'/tbm/special-news/handle/add'});
        	},
        	handlePubBatch(){
        		if(this.selectIdArr.length == 0){
	    			this.$hMessage.warning('请选择要公开的资讯');
	    			return
	    		}
	    		this.$hMsgBox.confirm({
	    			isOkLeft:true,
					title:'批量公开',
					content:'共'+ this.selectIdArr.length +'条资讯，是否确认公开?',
					onOk:()=>{
						let url = '/tm/batchPublishThemeNews';	
			            this.$http.post(url,this.selectIdArr).then((res) =>{
			            	let data = res.data;
			                if(data.status == this.$api.SUCCESS){
			                	this.$hMessage.info({content: '操作成功！'});			                	
			                	setTimeout(()=>{
			                		this.handleSearch();            		
			                	},500);                	
			                }else{
			                    this.$hMessage.error({content: data.msg});			                    
			                }
			            })
			            .catch(err=>{
			                this.$hLoading.error();
			            })
					},
					onCancel:()=>{
						 
					},
				})	   	
        		
        	},
           	exportFn(){
        		let url = '/tm/exportThemeNewsInfos';
				let postData = {...this.searchData};
				this.isExporting = true
				postData.ids = 	this.selectIdArr;
				utils.exportDataFn(postData,url,(res)=>{
					this.isExporting = false
					if(res){
						utils.commonDownLoad(res,'专题资讯-'+ utils.getToday());
					}
				});			
			},
        	handleLock(newsId,cb){
				let url ='/tm/theme/news/isLock?newsId='+newsId;
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
			/**恢复删除资讯列表**/
			handleRecover(newsId){
				let url ='/tm/recoverThemeNews?id='+newsId;
	            this.$http.get(url).then((res) =>{
	            	let data = res.data;
	                if(data.status == this.$api.SUCCESS){
	                	 this.$hMessage.info({
	                        content: '恢复成功',
	                        duration: 3
	                     });
	                      this.getInfoList();
	                }else{
	                    this.$hMessage.error({content: data.msg})
	                }
	            })
	            .catch(err=>{
	                this.$hLoading.error();
	            })				
			},
			handleTop(newsId,topStatus,tipStr){
				//置顶或取消置顶码（1:置顶 2:取消置顶）
				let url ='/tm/topThemeNews?id='+newsId+'&topStatus='+topStatus;
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
				let url ='/tm/removeThemeNews?id='+newsId;
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
			handleDbclick(dataRow){
				this.handleLock(dataRow.id,(res)=>{
					if(res){	
						if(dataRow.handleStatus == 0 ||dataRow.handleStatus == 1){
							sessionStorage.setItem('freshDetailSpecial',true);
							this.$router.push({path:'/tbm/special-news/handle/edit',query:{newsId: dataRow.newsId,themeId:dataRow.themeId,id:dataRow.id}});
						}else{
							this.$router.push({path:'/tbm/special-news/handle/view',query:{newsId: dataRow.newsId,themeId:dataRow.themeId,id:dataRow.id}});
						}							
					}
				});				
			},
			selectChange(selection){
			   let selectArr = selection;
		       let selectArrId = [];
		       selectArr.forEach((item,index)=>{
		       	  selectArrId.push(item.id)
		       })	  
			   if(this.changePageflag){
				//翻页选择
				this.commonTableDatas.forEach((item,i)=>{
					let index = this.selectIdArr.indexOf(item.id);
					if(index != -1){
						this.selectIdArr.splice(index,1);
					}	                		
				});	
			   	if(selectArr.length == 0){
				 	//翻页——全选取消选择
				}else{
					let newSelectIdArr = this.selectIdArr.concat(selectArrId);
	       	  		this.selectIdArr = Array.from(new Set(newSelectIdArr));
				}
		       }else{
		      	    //未翻页选择
			       	this.selectIdArr = selectArrId;	
		       } 			      
			},
			cancelSelect(selection,row){ 
				//取消选择某一项
				let  index = this.selectIdArr.indexOf(row.id);
				if (index != -1) { 
					this.selectIdArr.splice(index, 1); 
				}  
			},
        	handleDelete(newsId){
				let url = '/tm/deleteThemeNews';
	            this.$http.post(url,newsId).then((res) => {
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
        	changePublishStatus(label){
        		if(label.length == 0 || label.length == 2){
        			this.searchData.publishStatus = ''
        		}else{
        			this.searchData.publishStatus =label[0]
        		};   
        	},
        	onPageChange (current) {
				this.changePageflag = true;
				this.pagination.current = current;
				this.getInfoList();
			},
			onPageSizeChange (size) {
				this.changePageflag = false;
				this.pagination.size = size;
				this.getInfoList();
			},
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
        	getHandleUser(){
	    		let url = '/tm/news/handleuserlist'; 		
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
        	/**资讯列表**/
			getInfoList(){
				this.tableLoading = true;
				if(!this.tableLoading)return;
				let url = '/tm/getThemeNews';
	            this.$http.post(url,{...this.searchData,...this.pagination}).then((res) => {
	            	let data = res.data;
	                if(data.status == this.$api.SUCCESS){
	                	let commonTableDatas = data.body.records || [];	                	
		                this.total = data.body.total;
	                	this.commonTableDatas = [...commonTableDatas];
	                	this.commonTableDatas.forEach((item,i)=>{
		                	item.title = item.title.replace(/ /g, '&nbsp;');
	                	});	
	                	if(this.changePageflag){
	                		this.commonTableDatas.forEach((item,i)=>{
	                			if(this.selectIdArr.indexOf(item.id) != -1){
		                			item['_checked'] = true
		                		}      
		                	});	
		                }else{
		                	this.selectIdArr = [];
		                }
		                /**缓存查询条件,处理页查询下一条**/
		                let searchData = JSON.stringify(this.searchData);
		                sessionStorage.setItem("searchDataSpecial", searchData);
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
			getSelectOption(listType,dictCode){
	    		let url = '/tm/tbmDictList?dictCode='+dictCode;    		
	            this.$http.get(url).then((res) => {
	            	let data = res.data;
	                if(data.status == this.$api.SUCCESS){
	                	this[listType] = data.body.tbmDictList || [];              	
	                }else{
	                    this.$hMessage.error({content: data.msg})
	                }
	            })
	            .catch(err=>{
	                this.$hLoading.error();
	            })
			},
			getCommonList(){
				this.$store.dispatch('getAppList','appList');
				this.$store.dispatch('getNewsOpenFlags','newsOpenFlags');
				this.$store.dispatch('getProcessingStates','processingStates');
				this.$store.dispatch('getNewsTypeList','newsTypeList');
			},
			getStorageFn(){				 
				let newsOpenFlagsStorage = JSON.parse(sessionStorage.getItem("newsOpenFlags")) || null;//获取下拉列表缓存
				let processingStatesStorage = JSON.parse(sessionStorage.getItem("processingStates")) || null;//获取下拉列表缓存
				let appListStorage = JSON.parse(sessionStorage.getItem("appList")) || null;//获取下拉列表缓存	
				let newsTypeListStorage = JSON.parse(sessionStorage.getItem("newsTypeList")) || null;//获取下拉列表缓存	
				if( !newsOpenFlagsStorage || !processingStatesStorage || !appListStorage || !newsTypeListStorage){
 					this.getCommonList();
				}else{
					this.$store.commit('GET_APPLIST',appListStorage);				 
					this.$store.commit('GET_NEWSOPENFLAGS',newsOpenFlagsStorage);
					this.$store.commit('GET_PROCESSINGSTATES',processingStatesStorage);
				 	this.$store.commit('GET_NEWSTYPELIST',newsTypeListStorage);
				}
			},
			
        },
        computed: {
			...mapState(['appList','maxTableHeight','processingStates','newsOpenFlags','newsTypeList'])
		},
        mounted(){
        	this.getStorageFn();
        	this.getSpecialNameList();
        	this.getHandleUser();
        	this.handleSearch();
        },
        activated: function(){
			if (this.isAutoRefreshTable){
				this.getSpecialNameList();
				this.handleSearch();
			}
		}
	}
</script>

<style>

</style>