<template>
	<section style="position: relative;">
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>入库日期：</dt>
						<dd>
							<h-date-picker type="daterange" format="yyyy-MM-dd" aria-placeholder="入库日期" :placeholder="placeholders.createDateRange" :value="createDateRange" v-model="createDateRange" @on-change="onChangeCreateDateRangePicker"></h-date-picker>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>公开标志：</dt>
						<dd>
							<h-select aria-placeholder="公开标志" placeholder="请选择公开标志" v-model="searchData.publishStatus" @on-change="onNewsListTypeSelectChange(`publishStatus`)">
								<h-option v-for="(item, i) in newsOpenFlags" :value="item.dictEntry" :key="item.dictEntry">
									{{item.entryName}}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>范围：</dt>
						<dd>
							<h-select placeholder="请选择范围" v-model="searchData.range" @on-change="onNewsListTypeSelectChange(`range`)">
								<h-option v-for="(item, i) in rangeList" :value="item.dictEntry" :key="item.dictEntry">
									{{item.entryName}}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>资讯ID：</dt>
						<dd><h-input type="int" :maxlength="19" placeholder="请输入资讯 ID" v-model="searchData.newsId" @on-enter="onChangeInputEnter(`newsId`)" icon="android-close" @on-click="shitClearableClick(`newsId`)"></h-input></dd>
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
						<dt>涉及证券：</dt>
						<dd>
							<SearchInputDup
								v-model="searchData.tagIds[0]"
								categoryId='101109'
							>
							</SearchInputDup>
						</dd>
					</dl>
				</li>				
				<li>
					<dl>
						<dt>金融市场：</dt>
						<dd>
							<h-select  placeholder="请选择金融市场" v-model="searchData.financial" @on-change="onNewsListTypeSelectChange(`financial`)">
								<h-option v-for="(item, i) in financialMarketList" :value="item.dictEntry" :key="item.dictEntry">
									{{item.entryName}}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>		        
				<li>
					<dl>
						<dt>信息来源：</dt>
						<dd>
							<SearchInput placeholderText='请搜索信息来源' searchUrl='/tm/business/getDatasource'  @changeSelectValue="changeSearchInput($event, 'dsSourceType')"></SearchInput>
							<!-- <h-simple-select placeholder="请选择信息来源" filterable v-model="searchData.dsSourceType"  @on-change="onNewsListTypeSelectChange(`dsSourceType`)">
								<h-select-block :data="sourceList"></h-select-block>
							</h-simple-select> -->
						</dd>
					</dl>
				</li>
				<li class="row0">
				</li>
				<li class="row2">
					<dl>
						<dt>资讯标题：</dt>
						<dd><h-input  placeholder="请输入资讯标题" v-model.trim="searchData.title" @on-enter="onChangeInputEnter(`title`)" icon="android-close" @on-click="shitClearableClick(`title`)"></h-input></dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>信息级别：</dt>
						<dd>
							<h-select aria-placeholder="信息级别" placeholder="请选择信息级别" v-model="searchData.level">
								<h-option v-for="(item, i) in infoLevelList" :value="item.dictEntry" :key="item.dictEntry">
									{{item.entryName}}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				
		       
				<li>
					<dl>
						<dt>金融市场细分：</dt>
						<dd>
							<h-select   :placeholder="financialPlus.length == 0 ? '':'请选择'" v-model="searchData.financialPlus" @on-change="selectChangePlus(`financialPlus`,`financial`)">
								<h-option v-for="(item, i) in financialPlus" :value="item.typeCode" :key="item.typeCode">
									{{item.typeName}}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>				
				<li>
					<dl>
						<dt>修改日期：</dt>
						<dd>
							<h-date-picker type="daterange" format="yyyy-MM-dd" aria-placeholder="修改日期" :placeholder="placeholders.updateDateRange" :value="updateDateRange" @on-change="onChangeModDateRangePicker"></h-date-picker>
						</dd>
					</dl>
				</li>	
				<li>
					<dl>
						<dt>修改人员：</dt>
						<dd>
							<h-select clearable placeholder="请选择" filterable  v-model="searchData.handleUser">
								<h-option v-for="item in handleArr" :value="item.id" :key="item.id">{{item.realName}}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
								
				<li>
					<dl>
						<dt>信息发布日期：</dt>
						<dd>
							<h-date-picker type="daterange" format="yyyy-MM-dd" aria-placeholder="信息发布日期" :placeholder="placeholders.publishDateRange" :value="publishDateRange" v-model="publishDateRange" @on-change="onChangeDateRangePicker"></h-date-picker>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" data-ref="init-btn" @click="handleProcessFn">进入流程</h-button>
					<h-button  type="primary" data-ref="init-btn" @click="handleSearch">查询</h-button>
					<h-button v-if="activeRoutersButton.indexOf('fast_delBatchBtn') != -1" type="primary" data-ref="init-btn" @click="handleDeleteBatch">批量删除</h-button>
					<h-button v-if="activeRoutersButton.indexOf('fast_addBtn') != -1" type="primary" data-ref="init-btn" @click="handleNewPage">新建</h-button>
					<h-button v-if="activeRoutersButton.indexOf('fastNewsExportBtn') != -1"  type="primary" data-ref="init-btn" @click="exportFn" :loading='isExporting'>导出</h-button>
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
	import SearchInput from "@/components/searchInput";
	import SearchInputDup from "@/pages/tbm/components/searchInputDup";
	import utils from "@/utils";
	import {mapState,mapActions} from "vuex";
	const TODAY = utils.getToday();
	export default {
		components: {SearchInput, SearchInputDup},
		name:'TbmFast-newsIndex',
		data () {
			return {
				activeRoutersButton : this.$store.state.activeRoutersButton,//控制按钮权限
				isAutoRefreshTable:false,
				handleArr:[],
				rangePlus:[],
				financialPlus:[],
				updateDateRange: ['', ''],
				publishDateRange: ['', ''],				
				createDateRange:[TODAY, TODAY],//入库日期
				placeholders: {
					publishDateRange: "开始日期 - 结束日期",
					publishDate: "请输入发布日期",
					updateDateRange: "开始日期 - 结束日期",
					updateDate: "请输入修改日期",
					createDateRange: "开始日期 - 结束日期",
					createDate: "请输入入库日期",
				},
				searchData:{
					newsType:'2',//快讯类型
					handleStatus:'0',
					newsId:'',
					title:'',
					updateTime:'',
					updateTimeEnd:'',					
					publishDate:'',
					publishDateEnd:'',	
					createDate:TODAY,
					createDateEnd:TODAY,		
					publishStatus:'',
					mediaSource:'',
					dsNewsColumns:'',
					dsSourceType:'',					
					handleUser:'',
					orderByWhich:'',//根据字段排序
					order:0,//排序方式，0是降序，1是升序	
					tagIds:['',''],
					level:'',
					sentimentLabel:[],//情感类别
					range:'',
					rangePlus:'',
					financial:'',
					financialPlus:'',
					mediaSource:'',
					author:'',
					authorOrgCode:'',
					newsUrl:''		
				},
				loadingText:'加载中',
				loadingSearchLabel: false,
				loadingSearchLabelIndustry:false,				
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
				selectIdArr:[],//table选中项
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
						width: 145,
						align: "left",
						sortable: 'custom'
					},					
					{
						key: "title",
						title: "标题",
						width: 250,
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
						key: "content",
						title: "内容",
						width: 430,
						align: "left",
						render: (h, params) =>{ 
							return h("span",{
								domProps: {
								    innerHTML: params.row.content
								},
							},params.row.content);
						}
					},{
						key: "negotiableSecurities",
						title: "涉及证券",
						width: 150,
						align: "left",
						ellipsis:true,
						render: (h, params) =>{ 
							return h("span",{
								attrs:{
									title: params.row.negotiableSecurities
								}
							},params.row.negotiableSecurities);
						}							 						
					},{
						key: "sentimentName",
						title: "情感方向",
						width: 100,
						align: "center"
					},
					{
						key: "level",
						title: "信息级别",
						width: 100,
						align: "center",
					},
					{
						key: "publishStatusDesc",
						title: "公开标志",
						width: 100,
						align: "center",
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
								let newsId = params.row.newsId;
								let ref = this.$md5(`${newsId}TBM-COMPOSE`)
								let showBtn = false;
								/**按钮类型---- 1：编辑，2：删除，3：恢复，4：置顶，5：取消置顶，6：下架**/
								switch (type) {
									case 1:
										operateUrl = ``;
										routerPath = `/tbm/fast-news/edit`;
										btnCon = `icon-t-b-message`;
										showBtn = this.activeRoutersButton.indexOf('fast_editBtn') != -1 ? true : false;
										break;
									case 2:							 
										operateUrl = `/tm/news/delete`;
										routerPath = ``;
										btnCon = `icon-t-b-delete`;
										showBtn = this.activeRoutersButton.indexOf('fast_delBtn') != -1 ? true : false;
										break;
									case 3:
										operateUrl = `/tm/news/recover`;
										routerPath = ``;
										btnCon = `icon-t-b-return`;
										showBtn = this.activeRoutersButton.indexOf('fast_recoverBtn') != -1 ? true : false;
										break;
									case 4:
										operateUrl = `/tm/news/top`;
										routerPath = ``;																				
										btnCon = `icon-android-arrow-up`;
										showBtn = this.activeRoutersButton.indexOf('fast_topBtn') != -1 ? true : false;
										break;
									case 5:
										operateUrl = `/tm/news/top`;
										routerPath = ``;
										btnCon = `icon-android-arrow-down`;		
										showBtn = this.activeRoutersButton.indexOf('fast_cancelTopBtn') != -1 ? true : false;
										break;
									case 6:
										operateUrl = `/tm/news/remove`;
										routerPath = ``;
										btnCon = `icon-t-b-movedown`;	
										showBtn = this.activeRoutersButton.indexOf('fast_offLineBtn') != -1 ? true : false;
										break;
									case 7:
										operateUrl = ``;
										routerPath = `/tbm/fast-news/view`;
										btnCon = `icon-view`;
										showBtn = this.activeRoutersButton.indexOf('fast_viewBtn') != -1 ? true : false;
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
																sessionStorage.setItem('freshDetailFast',true);
																this.$router.push({path:routerPath,query:{newsId: newsId, ref: ref}});
															}
														});
													}else{
														this.$router.push({path:routerPath,query:{newsId: newsId,  ref: ref}});
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
															 this.handleRecover(newsId);
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
				isExporting: false,
			}
		},
		
		methods: {
             onChangeInputEnter (type = ``) {
            	 
			},
			onChangeDateRangePicker (values) {
				this.publishDateRange = values;
				this.searchData.publishDate = values[0];
				this.searchData.publishDateEnd = values[1];
			},
			onChangeCreateDateRangePicker(values){
				this.createDateRange = values;
				this.searchData.createDate = values[0];
				this.searchData.createDateEnd = values[1];
			},
			onChangeModDateRangePicker(values){
				this.updateDateRange = values;
				this.searchData.updateTime = values[0];
				this.searchData.updateTimeEnd = values[1];
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
			getSelectOption(listType,dictCode){
	    		let url = '/tm/tbmDictList?dictCode='+dictCode;    		
	            this.$http.get(url).then((res) => {
	            	let data = res.data;
	                if(data.status == this.$api.SUCCESS){
	                	this[listType] = data.body.tbmDictList || [];
	                	if(listType == 'sourceList'){
		            		const list = this.sourceList.map(item => {
					            return {
					                value: item.dictEntry,
					                label: item.entryName
					            };
					        });
							this[listType] = [...list];
		            	}
	                	sessionStorage.setItem(listType, JSON.stringify(this[listType]));                	
	                }else{
	                    this.$hMessage.error({content: data.msg})
	                }
	            })
	            .catch(err=>{
	                this.$hLoading.error();
	            })
			},
			changeSearchInput(values, type){
      			this.searchData[type] = values;
    		},
		    onNewsListTypeSelectChange(type) {
				let value = this.searchData[type];
				this.searchData[type] = value.trim();	
				if(type == 'range' || type == 'financial'){
					let listName = '';
					if(type == 'range'){
						listName = 'rangePlus';
						value = value ? value : '0'
					}else{
						listName = 'financialPlus';
						value = value ? value :'1';
					}
					this.getSubdivide(listName,value);
				}
				
			},
			selectChangePlus(type,typeParent){
		    	this[type].forEach((item,i)=>{
		    		if(item.typeCode == this.searchData[type]){
		    			this.searchData[typeParent] = item.parentTypeCode 
		    		}
		    	})		    	
		    },
			getSubdivide(listName,code){
				let url ='/tm/business/gettypepluslist?code='+code;
	            this.$http.get(url).then((res) =>{
	            	let data = res.data;
	                if(data.status == this.$api.SUCCESS){
	                	this[listName] = data.body.typeList;
	                }else{
	                    this.$hMessage.error({content: data.msg});
	                     
	                }
	            })
	            .catch(err=>{
	                this.$hLoading.error();
	            })	
			},
			shitClearableClick(type = ``) {
				this.searchData[type] = ``;
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
				this.pagination.size = size;
				this.changePageflag = false;
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
				if(this.searchData.handleStatus !== '0'){		
					this.$hMessage.warning({content:'进入流程前处理状态选“待处理”'});
					return
				}else{
					sessionStorage.setItem("searchDataProcessFast", JSON.stringify(this.searchData));
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
						let ref = this.$md5(`${newsId}TBM-COMPOSE`)
						if(!newsId){
							this.$hMessage.warning({content:'没有符合条件的资讯！'});
							return
						};
						this.handleLock(newsId,(res)=>{
							if(res){	
								sessionStorage.setItem('freshDetailFast',true);
								this.$router.push({path:'/tbm/fast-news/edit',query:{newsId: newsId,isProcess:1, ref: ref}});							
							}
						});
						
					} else {
						this.$hMessage.error({ content: data.msg })
					}
				}).catch(err => {
					this.$hLoading.error();
				})
			},
			/**获取资讯列表**/
			getInfoList(){
				this.tableLoading = true;
				if(!this.tableLoading){return};
				let url = '/tm/news/getNewsList';
	            this.$http.post(url,{...this.searchData,...this.pagination}).then((res) => {
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
	                	this.commonTableDatas = [...commonTableDatas];
	                	this.getWindowMaxWidth();
	                	if(this.changePageflag){
	                		this.commonTableDatas.forEach((item,i)=>{
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
		                /**缓存查询条件,处理页查询下一条**/
		                sessionStorage.setItem("searchDataFast", JSON.stringify(this.searchData));
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
				sessionStorage.setItem('addClickFastNews',true);
				this.$router.push({path:'/tbm/fast-news/add'});
			},
			/**恢复删除资讯列表**/
			handleRecover(newsId){
				let url ='/tm/news/recover?newsId='+newsId;
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
				this.handleLock(dataRow.newsId,(res)=>{
					if(res){
						let ref = this.$md5(`${dataRow.newsId}TBM-COMPOSE`)
						if(dataRow.handleStatus == 0 || dataRow.handleStatus == 1){
					    	sessionStorage.setItem('freshDetailFast',true);
							this.$router.push({path:'/tbm/fast-news/edit',query:{newsId: dataRow.newsId, ref: ref}});	
						}else{
							this.$router.push({path:'/tbm/fast-news/view',query:{newsId: dataRow.newsId, ref: ref}});	
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
		    getCommonList(){
			
				this.$store.dispatch('getNewsOpenFlags','newsOpenFlags');
				this.$store.dispatch('getProcessingStates','processingStates');
		    	this.$store.dispatch('getRangeList','rangeList');
			    this.$store.dispatch('getFinancialList','financialMarketList');
			    this.$store.dispatch('getInfoLevelList','infoLevelList'); 
			},
			getStorageFn(){
				let newsOpenFlagsStorage = JSON.parse(sessionStorage.getItem("newsOpenFlags")) || null;//获取下拉列表缓存
				let processingStatesStorage = JSON.parse(sessionStorage.getItem("processingStates")) || null;//获取下拉列表缓存				 
				let infoLevelListStorage = JSON.parse(sessionStorage.getItem("infoLevelList")) || null;//获取下拉列表缓存
 
				let rangeListStorage = JSON.parse(sessionStorage.getItem("rangeList")) || null;//
				let financialListStorage = JSON.parse(sessionStorage.getItem("financialMarketList")) || null;//			 
				if( !newsOpenFlagsStorage || !processingStatesStorage || !infoLevelListStorage || !rangeListStorage || !financialListStorage){
 					this.getCommonList();
				}else{	 
				 
					this.$store.commit('GET_NEWSOPENFLAGS',newsOpenFlagsStorage);
					this.$store.commit('GET_PROCESSINGSTATES',processingStatesStorage);
 
					this.$store.commit('GET_RANGELIST',rangeListStorage);
					this.$store.commit('GET_INFOLEVELLIST',infoLevelListStorage);					
					this.$store.commit('GET_FINANCIALLIST',financialListStorage);	 
				}
				// this.$store.dispatch('getSourceList','sourceList');
			},
			exportFn(){
        		let url = '/tm/news/export';
				let postData = {...this.searchData};
				this.isExporting = true
				postData.ids = 	this.selectIdArr;
				postData.newsType = '2'
				utils.exportDataFn(postData,url,(res)=>{
					this.isExporting = false
					if(res){
						utils.commonDownLoad(res,'快讯-'+ utils.getToday());
					}
				});			
			},
		    searchDatas(){		  
				this.getHandleUser();				
				this.getSubdivide('rangePlus','0');//范围细分列表
				this.getSubdivide('financialPlus','1');//金融市场细分列表
				this.getStorageFn();
				this.handleSearch();
			},
		},
		computed: {
			...mapState(['newsOpenFlags','rangeList','processingStates','financialMarketList','sourceList','infoLevelList','maxTableHeight',])
		},		
		mounted(){
			this.searchDatas();
		},
		activated: function(){
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
