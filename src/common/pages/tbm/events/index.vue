<template>
	<section style="position: relative;">
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>入库日期：</dt>
						<dd>
							<h-date-picker type="daterange" format="yyyy-MM-dd" aria-placeholder="入库日期" :placeholder="placeholders.createTimeRange" :value="createTimeRange" v-model="createTimeRange" @on-change="onChangeCreateDateRangePicker"></h-date-picker>
						</dd>
					</dl>
				</li>
				<li>
		          <dl>
		            <dt>公开标志：</dt>
		            <dd>
		            	<h-checkbox-group v-model="searchData.publishStatusList" @on-change="changePublishStatus">
					        <h-checkbtn v-for="(item, i) in newsOpenFlags"  :value="item.dictEntry" :key="item.dictEntry">
					            <span>{{item.entryName}}</span> 
					        </h-checkbtn>
					    </h-checkbox-group>
		            </dd>
		          </dl>
		        </li>
		        <li>
					<dl>
						<dt>处理状态：</dt>
						<dd>
							<h-select  placeholder="请选择处理状态" v-model="searchData.handleStatus" @on-change="onNewsListTypeSelectChange(`handleStatus`)">
								<h-option v-for="(item, i) in processingStates" :value="item.dictEntry" :key="item.dictEntry">
									{{item.entryName}}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>任务分组：</dt>
						<dd>
							<h-select placeholder="请选择任务" v-model="searchData.taskGroup" @on-change="onNewsListTypeSelectChange(`taskGroup`)">
								<h-option v-for="(item, i) in taskGroupList" :value="item.dictEntry" :key="item.typeCode">
									{{item.entryName}}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>资讯ID：</dt>
						<dd><h-input type="int" :maxlength="19" placeholder="请输入 ID" v-model="searchData.newsId" @on-enter="onChangeInputEnter(`newsId`)" icon="android-close" @on-click="shitClearableClick(`newsId`)"></h-input></dd>
					</dl>
				</li>
				
				<li>
					<dl>
						<dt>情感方向：</dt>
						<dd>
							<h-select multiple placeholder="请选择情感方向" v-model="searchData.sentimentLabels">
								<h-option v-for="(item, i) in emotionList" :value="item.dictEntry" :key="item.dictEntry">
									{{item.entryName}}
								</h-option>
							</h-select>
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
						<dt>信息来源：</dt>
						<dd>
							<SearchInput placeholderText='请搜索信息来源' searchUrl='/tm/business/getDatasource'  @changeSelectValue="changeSearchInput($event, 'dsSourceType')"></SearchInput>
							<!-- <h-simple-select placeholder="请选择信息来源" filterable v-model="searchData.dsSourceType"  @on-change="onNewsListTypeSelectChange(`dsSourceType`)">
								<h-select-block :data="sourceList"></h-select-block>
							</h-simple-select> -->
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>媒体出处：</dt>
						<dd>
							 <SimpleSelect
								:modelLabel='true'
								action='/tm/business/getDictPage' 
								valueShow='dictEntry'
								nameShow='entryName'
								v-model='searchData.mediaSource'
								placeholder='媒体出处(常量)'
							></SimpleSelect>
							<!-- <h-simple-select placeholder="媒体出处" label-in-value filterable v-model="searchData.mediaSourceCode"  @on-change="onNewsListTypeSelectMediaChange">
								<h-select-block :data="sourceList"></h-select-block>
							</h-simple-select> -->
						</dd>
					</dl>
				</li>
				<li class="event-select-level">
					<dl>
						<dt>类别(三级)：</dt>
						<dd>
							<SearchLevel :modelValue="searchData.threeLevels" categoryLevel="3" placeholderText="类别(三级)" :isMultiple="true" @changeSelectValue="changeSelectValueThree"></SearchLevel>
						</dd>
					</dl>
				</li>
				<li class="event-select-level">
					<dl>
						<dt>类别(四级)：</dt>
						<dd>
							<SearchLevel :modelValue="searchData.fourLevels" categoryLevel="4" placeholderText="类别(四级)" :isMultiple="true" @changeSelectValue="changeSelectValueFourth"></SearchLevel>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>涉及证券：</dt>
						<dd>
							<SearchInputDup
								v-model="searchData.sectsTagId"
								categoryId='101109'
							>
							</SearchInputDup>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>涉及公司：</dt>
						<dd>
							<SearchInputDup
								v-model="searchData.sectsTagId"
								categoryId='101102'
							>
							</SearchInputDup>
						</dd>
					</dl>
				</li>
				<li class="row0"></li>
				<li class="row2">
					<dl>
						<dt>链接地址：</dt>
						<dd><h-input placeholder="请输入链接地址" v-model="searchData.newsUrl" icon="android-close"  @on-enter="onChangeInputEnter(`mediaSource`)" @on-click="shitClearableClick(`newsUrl`)"></h-input></dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>信息发布日期：</dt>
						<dd>
							<h-date-picker type="daterange" format="yyyy-MM-dd" :placeholder="placeholders.publishDateRange" :value="publishDateRange" v-model="publishDateRange" @on-change="onChangeDateRangePicker"></h-date-picker>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>修改日期：</dt>
						<dd>
							<h-date-picker autoPlacement type="daterange" format="yyyy-MM-dd" :placeholder="placeholders.updateDateRange" :value="updateDateRange" v-model="updateDateRange" @on-change="onUpdateDateRangePicker"></h-date-picker>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>修改人员：</dt>
						<dd>
							<h-simple-select clearable placeholder="请选择" filterable v-model="searchData.updaterId" >
								<h-select-block :data="handleArr"></h-select-block>
							</h-simple-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>情感级别：</dt>
						<dd>
							<h-select multiple placeholder="请选择情感级别" v-model="searchData.sentimentLevels">
								<h-option v-for="(item, i) in feelingLevelList" :value="item.dictEntry" :key="item.dictEntry">
									{{item.entryName}}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>入库时间：</dt>
						<dd>
							<h-select filterable clearable placeholder="请选择入库时间" v-model="searchData.timeType">
								<h-option v-for="(item, i) in timeTypeList" :value="item.dictEntry" :key="item.dictEntry">
									{{item.entryName}}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button  type="primary" data-ref="init-btn" @click="handleSearch">查询</h-button>
					<h-button type="primary" data-ref="init-btn" @click="handleProcessFn">进入流程</h-button>
					<h-button v-if="activeRoutersButton.indexOf('event_delBatchBtn') != -1" type="primary" data-ref="init-btn" @click="handleDeleteBatch">批量删除</h-button>
					<!-- 导出代码 -->
					<h-button v-if="activeRoutersButton.indexOf('eventExportBtn') != -1"  type="primary" data-ref="init-btn" @click="exportFn" :loading='isExporting'>导出</h-button>
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
				@on-sort-change="handleSortFn"
				@on-selection-change="selectChange"
				@on-select-cancel="cancelSelect"
				:data="commonTableDatas"
				:loading="tableLoading"
				:highlight-row="true"
				@on-row-dblclick="handleDbclick"
				border>
			</h-table>
			<h-page highlight-row size="small" show-elevator show-total show-sizer placement="top" class="page-box"  :total="total" :current="pagination.current" :page-size-opts="pageSizeOpts" @on-page-size-change="onPageSizeChange"  :page-size="pagination.size" @on-change="onPageChange" ></h-page>			
			<div class="checkNum">{{'当前已选择 '+ selectIdArr.length+' 条'}}</div>
		</div>
	</section>
</template>

<script>
	import SearchInput from "@/components/searchInput";
	import SimpleSelect from "@/components/simpleSelect";
	import utils from "@/utils";
	import {mapState,mapActions} from "vuex";
	import SearchLevel  from './searchLevel';
	import SearchInputDup from "@/pages/tbm/components/searchInputDup";
	const TODAY = utils.getToday();
	export default {
		components: { SearchLevel, SearchInput, SimpleSelect, SearchInputDup},
		name:'TbmEventsIndex',
		data () {
			return {
				isExporting: false,
				activeRoutersButton : this.$store.state.activeRoutersButton,//控制按钮权限
				isAutoRefreshTable:false,
				selectIdArr:[],//table选中项
				changePageflag:false,
				handleArr:[],
				taskGroupList:[],
				feelingLevelList:[],
				timeTypeList: [], //入库时间
				rangePlus:[],
				financialPlus:[],
				updateDateRange: ['', ''],
				publishDateRange: ['', ''],				
				createTimeRange:[TODAY, TODAY],//入库日期
				processingStates:[],
				placeholders: {
					publishDateRange: "开始日期 - 结束日期",
					publishDate: "请输入发布日期",
					updateDateRange: "开始日期 - 结束日期",
					updateDate: "请输入修改日期",
					createTimeRange: "开始日期 - 结束日期",
					createTime: "请输入入库日期",
				},
				searchData:{ 
					newsUrl:'',
					updaterId: '',
					handleStatus:'0',					
					newsId:'',					
					title:'',					
					updateTime:'',
					updateTimeEnd:'',					
					publishDate:'',					
					publishDateEnd:'',					
					createTime:TODAY,					
					createTimeEnd:TODAY,		
					publishStatusList:['0'],									 
					dsSourceType:'',									
					threeLevels:[],//三级事件类别
					fourLevels:[],//四级事件类别
					sentimentLabels:[],//情感方向		
					sentimentLevels:[],//情感类别	
					mediaSourceCode:'',	
					taskGroup:'',
					sectsTagId:'',
					compTagId:'',
					timeType: '',
				},
				publishStatus:['0'],
				loadingText:'加载中',
				loadingSearchLabel: false,
				loadingSearchLabelIndustry:false,				
				tableLoading: false,
				pagination: {
					current: 1,
					size:10
				},
				pageSizeOpts:[10,20,50,100],
				total:0,				
				searchDataStatics:null,
				eventTypeListThree:[],
				eventTypeListFourth:[],
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
						sortable: 'custom',
						render: (h, params) => {
							let handleStatusData = null;
//							0代表为被锁，1代表其他人持有锁--黑色，2代表自己持有锁--黄色
							if(params.row.lockType && params.row.lockType != 0){
								handleStatusData = [
									h("Icon", {
										props: {
											name: "person"
										},
										style:{
											color: params.row.lockType == 2 ? 'rgba(243, 222, 66, 0.97)' : ''
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
						title: "资讯ID",
						sortable: 'custom',
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
							return <div v-clickCopy>{params.row.title}</div>
						}
					},
					{
						key: "publishStatusDesc",
						title: "公开标志",
						width: 150,
						align: "left",
						sortable:'custom'
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
						key: "dsNewsColumns",
						title: "资讯原始栏目",
						width: 200,
						align: "left",
						sortable: 'custom',
						render: (h, params) => {
							return <div v-clickCopy>{params.row.dsNewsColumns}</div>
						}
					},{
						key: "infoLevelDesc",
						title: "信息级别",
						width: 200,
						align: "left",
						sortable: 'custom'
					},{
						key: "sentiments",
						title: "情感方向",
						width: 200,
						align: "left"
					},{
						key: "sentimentsLevel",
						title: "情感级别",
						width: 200,
						align: "left"
					},
					{
						key: "securitiesTags",
						title: "涉及证券",
						width: 200,
						align: "left"
					},
					{
						key: "companyTags",
						title: "涉及公司",
						width: 200,
						align: "left"
					},
					{
						key: "threeLevelCategory",
						title: "类别（三级）",
						width: 200,
						align: "left"
					},
					{
						key: "fourLevelCategory",
						title: "类别（四级）",
						width: 200,
						align: "left"
					},{
						key: "createTime",
						title: "入库时间",
						width: 150,
						align: "left",
						sortable: 'custom'
					},{
						key: "updaterName",
						title: "修改人员",
						width: 120,
						align: "center",
						sortable: 'custom'				

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
						sortable: 'custom'
					},
					{
						key: "publishDate",
						title: "首次公开时间",
						width: 150,
						align: "left",
						sortable: 'custom'
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
								let id = params.row.id;
								let handleStatus = params.row.handleStatus
								let showBtn = false;
								let index = params.index
								let ref = this.$md5(`${params.row.newsId}TBM-COMPOSE`);
								/**按钮类型---- 1：编辑，2：删除，3：恢复，4：置顶，5：取消置顶，6：下架 7：查看**/
								switch (type) {
									case 1:
										operateUrl = ``;
										routerPath = `/tbm/events/detail`;
										btnCon = `icon-t-b-message`;
										showBtn = (this.activeRoutersButton.indexOf('event_EditBtn') != -1 || handleStatus != 0) ? true : false;
										break;
									case 2:					
										operateUrl = `/tm/news/delete`;
										routerPath = ``;
										btnCon = `icon-t-b-delete`;
										showBtn = this.activeRoutersButton.indexOf('event_delBtn') != -1 ? true : false;
										break;	
									case 3:
										operateUrl = `/tm/news/recover`;
										routerPath = ``;
										btnCon = `icon-t-b-return`;
										showBtn = this.activeRoutersButton.indexOf('event_recoverBtn') != -1 ? true : false;
										break;
									case 6:
										operateUrl = `/tm/news/remove`;
										routerPath = ``;
										btnCon = `icon-t-b-movedown`;	
										showBtn = this.activeRoutersButton.indexOf('event_offLineBtn') != -1 ? true : false;
										break;
									case 7:
										operateUrl = ``;
										routerPath = `/tbm/events/view`;
										btnCon = `icon-view`;
										showBtn = this.activeRoutersButton.indexOf('event_viewBtn') != -1 ? true : false;
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
														this.handleLock(params.row.newsId,(res)=>{
															if(res){	
																sessionStorage.setItem('freshDetailEvent',true);
																this.$router.push({path:routerPath,query:{newsId: params.row.newsId, ref: ref}});
															}
														});
													}else{
														this.$router.push({path:routerPath,query:{newsId: params.row.newsId, ref: ref}});
													}											
												};
												if(type==2){
													this.$hMsgBox.confirm({
														isOkLeft:true,
														title:'删除资讯',
														content:'确定要删除该条资讯:'+params.row.newsId +'?',
														onOk:()=>{
															 let newsIdArr = id.split();
															 this.handleDelete(newsIdArr);
														}
													})
												};
												if(type == 3){
													this.$hMsgBox.confirm({
														isOkLeft:true,
														title:'资讯恢复',
														content:'资讯:'+params.row.newsId+'已删除，确定要恢复？',
														onOk:()=>{
															 this.handleRecover(params.row.id, index);
														}
													})
												};
												if(type == 6){
													this.$hMsgBox.confirm({
														isOkLeft:true,
														title:'下架',
														content:'确定要将资讯:'+params.row.newsId+'下架？',													
														onOk:()=>{
															 this.handleOffline(params.row.id);
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
				isExporting: false			
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
			onUpdateDateRangePicker(values){
				this.updateDateRange = values;
				this.searchData.updateTime= values[0];
				this.searchData.updateTimeEnd = values[1];
			},
			onChangeCreateDateRangePicker(values){
				this.createTimeRange = values;
				this.searchData.createTime = values[0];
				this.searchData.createTimeEnd = values[1];
			},
			getHandleUser(){
	    		let url = '/tm/news/handleuserlist?newsType='+this.searchData.newsType; 		
	            this.$http.get(url).then((res) => {
	            	let data = res.data;
	                if(data.status == this.$api.SUCCESS){
						data.data.forEach((item ,index) => {
							item.label = item.realName
							item.value = item.id
						})
						this.handleArr = data.data || [];
	                }else{
	                    this.$hMessage.error({content: data.msg})
	                }
	            })
	            .catch(err=>{
	                this.$hLoading.error()
	            })
	    	},
			getCategoryLabelList(listType,categoryId){  
		    	let url = '/tm/queryDropDownTags?word='+ '&categoryId='+categoryId+'&newsType='+this.searchData.newsType ;		
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
					    }else{
					    	this.bigDataIndustry = [...list];
					    }
						this[listType] =  [...list];
						sessionStorage.setItem(listType, JSON.stringify(this[listType]));    
		            }else{
		                this.$hMessage.error({content: data.msg})
		            }
		        })
		        .catch(err=>{
		              this.$hLoading.error();
		        })            	
		    },
		    changePublishStatus(label){
		    	this.searchData.publishStatusList =label  
        	},
        	onNewsListTypeSelectMediaChange(data){	
        		this.searchData.mediaSource= data.label;
			},
			changeSelectValueThree(values){
				this.searchData.threeLevels = values;
			},
			changeSelectValueFourth(values){
				this.searchData.fourLevels = values;
			},
		    onNewsListTypeSelectChange(type){	
				 
			},
			changeSearchInput(values, type){
      			this.searchData[type] = values;
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
					if(params.key == 'dsSourceType'){
						params.key = 'dsSourceName';
					};
					if(params.key == 'handleStatusDesc'){
						params.key = 'handleStatus';
					};
					if(params.key == 'publishStatusDesc'){
						params.key = 'publishStatus';
					};
					if(params.key == 'updaterName'){
						params.key = 'updaterId';
					};
					if(params.key == 'publishUserName'){
						params.key = 'publishUserId';
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
			handleProcessFn(){
				if(this.searchData.handleStatus !== '0'){		
					this.$hMessage.warning({content:'进入流程前处理状态选“待处理”'});
					return
				}else{
					sessionStorage.setItem("searchDataEvents", JSON.stringify(this.searchData));
					this.getNextIds();					
				}
			},
			getNextIds(){
				let url = '/tm/news/popFeel/getNextNewsId';
//				let saveObj = {currentNewsId: ''};	
				this.$http.post(url, {...this.searchData,...this.pagination}).then((res) => {
					let data = res.data;
					if (data.status == this.$api.SUCCESS) {						
						let newsId = data.body.newsId || '';
						let ref = this.$md5(`${newsId}TBM-COMPOSE`);
						if(!newsId){
							this.$hMessage.warning({content:'没有符合条件的资讯！'});
							return
						};
						this.handleLock(newsId,(res)=>{
							if(res){									
								sessionStorage.setItem('freshDetailEvent',true);
								this.$router.push({path:'/tbm/events/detail',query:{newsId: newsId,isProcess:1, ref: ref}});							
							}
						});
						
					} else {
						this.$hMessage.error({ content: data.msg })
					}
				}).catch(err => {
					this.$hLoading.error();
				})
			},
			/**获取资讯列表--查询按钮**/
			handleSearch(){
				this.selectIdArr = [];
				this.changePageflag = false;
				this.pagination.current = 1;
				this.getInfoList();
			},			
			/**获取资讯列表**/
			getInfoList(go = false){
				if(this.tableLoading && !go)return;
				this.tableLoading = true;				
				let url = '/tm/news/popFeel/getList';
	            this.$http.post(url,{...this.searchData,...this.pagination}).then((res) => {
	            	let data = res.data;
	                if(data.status == this.$api.SUCCESS){
	                	let commonTableDatas = data.body.records || [];	                	
		                let total = data.body.total;
		                if(total != 0 && commonTableDatas.length == 0 ){
		                	this.pagination.current = Math.ceil(total/this.pagination.size)
		                	this.getInfoList(true);
		                	return;
		                }
		                this.total = total;
		                commonTableDatas.forEach((item,i)=>{
                			if(item.handleStatus != 0){
	                			item['_disabled'] = true
	                		}
	                	});	
	                	this.commonTableDatas = [...commonTableDatas];
	                	if(this.changePageflag){
	                		this.commonTableDatas.forEach((item,i)=>{
	                			if(this.selectIdArr.indexOf(item.id) != -1){
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
		                sessionStorage.setItem("searchDataEvents", JSON.stringify({...this.searchData,...this.pagination}));
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
				let url ='/tm/event/lock?newsId='+newsId;
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
			cancelSelect(selection,row){ 
				//取消选择某一项
				let  index = this.selectIdArr.indexOf(row.id);
				if (index != -1) { 
					this.selectIdArr.splice(index, 1); 
				}  
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
				let url = '/tm/news/popFeel/batchDelete';
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
			/**恢复删除资讯列表**/
			handleRecover(id, index){
				let url ='/tm/news/popFeel/recover?id='+id;
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
			handleTop(id,topStatus,tipStr){
				//置顶或取消置顶码（1:置顶，2:取消置顶）
				let url ='/tm/news/top?newsId='+id+'&topStatus='+topStatus;
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
			handleOffline(id){
				let url ='/tm/news/popFeel/remove?id='+id;
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
			handleOperateBtn(id,requestUrl,tipStr){
				this.$hMsgBox.confirm({
					isOkLeft:true,
					title:tipStr,
					content:'确定'+tipStr+'资讯:'+id+'？',
					onOk:()=>{
						let url =requestUrl+'?newsId='+id;
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
				let ref = this.$md5(`${dataRow.newsId}TBM-COMPOSE`);
				this.$router.push({path:'/tbm/events/view',query:{newsId: dataRow.newsId, ref: ref}});
				// this.handleLock(dataRow.newsId,(res)=>{
				// 	if(res){
				// 		if(dataRow.handleStatus == 0){
				// 			sessionStorage.setItem('freshDetailEvent',true);
				// 			this.$router.push({path:'/tbm/events/detail',query:{newsId: dataRow.newsId}});	
				// 		}else{
				// 			this.$router.push({path:'/tbm/events/view',query:{newsId: dataRow.newsId}});
				// 		}
						
				// 	}
				// });				
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
			getEventTypeList(listType,level,code){
				this.$http.get('/tm/event/getEventCategory?level='+level+'&categoryCode='+code).then((res) =>{
	            	let data = res.data;
	                if(data.status == this.$api.SUCCESS){
	                	let listArr = data.body.categoryList || [];
 						const newlist = listArr.map(item => {
				            return {
				                value: item.categoryCode,
				                label: item.categoryName
				            };
				        }); 
				        this[listType] = newlist;
	                }else{
	                    this.$hMessage.error({content: data.msg});	                    
	                }
	            })
	            .catch(err=>{
	                this.$hLoading.error();
	            })	
				
			},
		    getCommonList(){
				this.$store.dispatch('getEmotionList','emotionList');		    	 
			    this.$store.dispatch('getFinancialList','financialMarketList');
			    this.$store.dispatch('getInfoLevelList','infoLevelList'); 
			    this.$store.dispatch('getNewsOpenFlags','newsOpenFlags');
			},
			getStorageFn(){
				let newsOpenFlagsStorage = JSON.parse(sessionStorage.getItem("newsOpenFlags")) || null;//获取下拉列表缓存
				let infoLevelListStorage = JSON.parse(sessionStorage.getItem("infoLevelList")) || null;//获取下拉列表缓存
				let emotionListStorage = JSON.parse(sessionStorage.getItem("emotionList")) || null;//
				let financialListStorage = JSON.parse(sessionStorage.getItem("financialMarketList")) || null;//			 
				if(!infoLevelListStorage || !financialListStorage || !emotionListStorage || !newsOpenFlagsStorage){
 					this.getCommonList();
				}else{	  
					this.$store.commit('GET_EMOTIONLIST',emotionListStorage);
					this.$store.commit('GET_INFOLEVELLIST',infoLevelListStorage);					
					this.$store.commit('GET_FINANCIALLIST',financialListStorage);
					this.$store.commit('GET_FINANCIALLIST',financialListStorage);
					this.$store.commit('GET_NEWSOPENFLAGS',newsOpenFlagsStorage);
				}
				// this.$store.dispatch('getSourceList','sourceList');				
			},
		    searchDatas(){	
				this.handleSearch();
				this.getHandleUser();		  			
				this.getSelectOption('taskGroupList','1124');
				this.getSelectOption('feelingLevelList','1116');//情感级别
				this.getSelectOption('processingStates','1126');//处理状态
				//this.getEventTypeList('eventTypeListThree','3','');	
				//this.getEventTypeList('eventTypeListFourth','4','');		
				this.getSelectOption('timeTypeList','1129');//入库时间
				this.getStorageFn();
			},
			exportFn(){//导出函数
        		let url = '/tm/news/popFeel/event/export';
				let postData = {...this.searchData};
				this.isExporting = true
				postData.ids = 	this.selectIdArr;
				postData.newsType = '1'
				utils.exportDataFn(postData,url,(res)=>{
					this.isExporting = false
					if(res){
						utils.commonDownLoad(res,'舆情-'+ utils.getToday());
					}
				});			
			},
		},
		computed: {
			...mapState([ 'rangeList', 'financialMarketList','sourceList','infoLevelList','emotionList','maxTableHeight','newsOpenFlags'])
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
.event-select-level .searchLevelBox .h-selectTable-multiple .h-selectTable-selection{
	height: 28px!important;
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
