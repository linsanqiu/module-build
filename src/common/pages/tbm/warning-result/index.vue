<template>
	<section style="position: relative">
		<h-spin fix v-if="tableLoading">
		 	<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
	   		<div>加载中...</div>
		</h-spin>
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>作业编号：</dt>
						<dd><h-input placeholder="请输入作业编号" v-model="searchData.taskCode" icon="android-close"  @on-enter="onChangeInputEnter(`taskCode`)" @on-click="shitClearableClick(`taskCode`,'searchData')"></h-input></dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>执行结果：</dt>
						<dd>
							<h-select aria-placeholder="执行结果" placeholder="请选择执行结果" v-model="searchData.status" @on-change="onResultSelectChange(`status`)">
								<h-option v-for="(item, i) in resultStates" :value="item.dictEntry" :key="item.dictEntry">
									{{item.entryName}}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>执行日期：</dt>
						<dd>
							<h-date-picker type="daterange" format="yyyy-MM-dd" aria-placeholder="执行日期" :placeholder="placeholders.executeDateRange" :value="executeDateRange" @on-change="onChangeDateRangePicker">
							</h-date-picker>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="handleSearch">查询</h-button>
				</li>
			</ul>
		</search-form>
		<div class="tab-box tag-relotion-tab-box">					
			<h-table
				stripe
				size="small"
				class="full-max-height-table"
				:maxHeight="maxTableHeight"
				:columns="commonTableCols"
				:data="commonTableDatas"
				:highlight-row="false"
				border>
			</h-table>
			<h-page highlight-row size="small" show-elevator	show-total show-sizer   placement="top" class="page-box"  :page-size-opts="pageSizeOpts" :total="total" :current="pagination.current" :page-size="pagination.size" @on-change="onPageChange" @on-page-size-change="onPageSizeChange"></h-page>
		</div>
	</section>
</template>

<script>
	import utils from "@/utils/index";
	const TODAY = utils.getToday();
	export default {
		name:'WarningResultList',
		data () {
			return {
				activeRoutersButton : this.$store.state.activeRoutersButton,//控制按钮权限
				isAutoRefreshTable:true,
				tableLoading: false,
				modalShow:false,//添加/编辑modal看
				addModalShowTitle:'',//添加/编辑表头显示文字
				resultStates: [],//处理状态选项	
				executeDateRange: [TODAY, TODAY],
				heightValue:null,
				pagination: {
					current: 1,
					size:10
				},
				pageSizeOpts:[10,20,50,100],
				total:0,
				changePageflag:false,	
				handleArr:[],
				resultStates: [],//处理状态选项				
				loadingText:'加载中',
				loadingSearchLabel: false,
				searchData:{
					taskCode:'',	
					status:'',					
					startDate:'',
					endDate:''
				},	
				pagination: {
					current: 1,
					size:10
				},
				placeholders: {
					executeDateRange: "开始日期 - 结束日期",
					updateDate: "请输入执行日期"
				},
				modalData:{
					taskCode:'',
					taskName :'',
					taskStartTime:'',
					taskEndTime:'',
					spendTime:'',
					status:'',
					statusDes:'',
					id:''
				},		
				commonTableDatas:[],
				commonTableCols: [
					{
						key: "taskCode",
						title: "作业编号",
						width: 150,
						align: "left"
					},
					{
						key: "taskName",
						title: "作业名称",
						width: 150,
						align: "left"
					},
					{
						key: "taskStartTime",
						title: "开始执行时间",
						width: 150,
						align: "left"
					},
					{
						key: "taskEndTime",
						title: "结束执行时间",
						width: 150,
						align: "left"
					},
					{
						key: "spendTime",
						title: "耗时（s）",
						width: 100,
						align: "left"
					},
					{
						key: "status",
						title: "执行结果",
						//width: 250,
						align: "left"
					},	
					{
						key: "statusDes",
						title: "执行结果说明",
						 width: 250,
						align: "left"
					 }
					// {
					// 	key: "operation",
					// 	title: "操作",
					// 	width: 130,
					// 	align: "center",
					// 	fixed: "right",
					// 	render: (h, params) => {
	                    	// let status = params.row.status;
	                    	// let showAssignBtn = null;
	                    	// let showPassBtn = null;
	                    	// let showFailBtn = null;
	                    	// if(true){
	                    	//  	showPassBtn =  {
							// 		class: {
	                        //             'iconfont': true,
					        //             'icon-t-b-delete': true,
					        //             'tab-icon-btn': true,
	                        //         },
	                        //         style:{
	 						// 			color:'red'
	                        //         },
	                        //         attrs:{
							// 			title: '删除'
							// 		},
	                        //         on: {
							// 			click: () => {
							// 				this.$hMsgBox.confirm({
							// 				title: '删除任务',
							// 				content:
							// 					'确定要删除任务：' +
							// 					params.row.ruleName +
							// 					'?',
							// 				onOk: () => {
							// 					let ruleId = params.row.id
							// 					this.handleDelete(ruleId)
							// 				}
							// 				})
							// 			}
	                        //         }
	                        //     }; 
	                    	//  };                 	 
	                        // return h('div', [
	                        //     h('span', showAssignBtn),
	                        //     h('span', showPassBtn)                                            
	                        // ]);
						// }
					// }
					]		
			}
		},
		computed: {
			maxTableHeight(){ return this.$store.state.maxTableHeight },
		},
		methods: {
			shitClearableClick(type = '',dataobj='') {
				this[dataobj][type] = ``;
			},
			onPageChange (current) {
				this.changePageflag = true;
				this.pagination.current = current;
				this.getResultList();
			},
			onPageSizeChange (size) {
				this.changePageflag = true;
				this.pagination.size = size;
				this.getResultList();
			},
			onChangeInputEnter (type = ``) {
				let value = this.searchData[type];
				this.searchData[type] = value.trim();
				this.handleSearch();
			},
			onChangeDateRangePicker (values) {
				this.executeDateRange = values;
				this.searchData.startDate = values[0];
				this.searchData.endDate = values[1];
			},
			/**获取任务列表--查询按钮**/
			handleSearch(){
				this.pagination.current = 1;
				this.changePageflag = false;
				this.getResultList()
			},
			changeStatus(label,status,id,index){
				let url = '/tm/warning/changeRuleStatus?ruleId='+id;
				this.$http.get(url).then((res) => {
					let data = res.data ? res.data : {};
					if(data.status == this.$api.SUCCESS){
						this.$hMessage.info({
							content: '任务'+label+'成功',
							duration: 3
					})   
						this.getResultList();
					}else{
						this.$hMessage.error({
							content: data.msg,
							duration: 3
						})
						this.cancelChangeStatus(index,status)
					}   
				}).catch(err=>{
					this.cancelChangeStatus(index,status)
				})
			},
			cancelChangeStatus(index,status){
				let info = {...this.ruleList[index]}
				info.status = !status;
				this.$set(this.ruleList,index,info)
			},
			/**获取结果列表**/
			getResultList(){
				this.tableLoading = true;
				let url = '/tm/warning/resultList';
	            this.$http.post(url,{...this.searchData,...this.pagination}).then((res) => {
	            	let data = res.data;
					// this.ruleList = obj.data.list ? obj.data.list : [];
	                if(data.status == this.$api.SUCCESS){
	                	this.commonTableDatas = data.body.records || [];
		                this.total = data.body.total;
		                this.heightValue = this.commonTableDatas.length >=10 ? 350 : null;
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
			handleOperateBtn(newsId,requestUrl,tipStr){
				this.$hMsgBox.confirm({
					isOkLeft:true,
					title:tipStr,
					content:'确定'+tipStr+'任务:'+newsId+'？',
					onOk:()=>{
						let url =requestUrl+'?newsId='+newsId;
			            this.$http.get(url).then((res) =>{
			            	let data = res.data;
			                if(data.status == this.$api.SUCCESS){
			                	 this.$hMessage.info({
			                        content:tipStr+'成功',
			                        duration: 3
			                     });
			                      this.getResultList();
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
			onResultSelectChange(type) {
				let value = this.searchData[type];
				this.searchData[type] = value.trim();
			},
			/**切换每页条数**/
			getSelectOption(listType,dictCode){
	    		let url = '/tm/tbmDictList?dictCode='+dictCode;    		
	            this.$http.get(url).then((res) => {
	            	let data = res.data;
	                if(data.status == this.$api.SUCCESS){
	                	this[listType] = data.body.tbmDictList || [];
	                	sessionStorage.setItem(listType, JSON.stringify(this[listType]));                	
	                }else{
	                    this.$hMessage.error({content: data.msg})
	                }
	            })
	            .catch(err=>{
	                this.$hLoading.error();
	            })
			},
			onChangeModDateRangePicker(values){
				this.executeDateRange = values;
				this.searchData.startDate = values[0];
				this.searchData.endDate = values[1];
			},
			searchDatas(){
				let resultStatesStorage = JSON.parse(sessionStorage.getItem("resultStates")) || null;//获取下拉列表缓存
				if(!resultStatesStorage){
					this.getSelectOption('resultStates',1111);
				}else{					
					this.resultStates = resultStatesStorage;
				}						
				this.getResultList();
			}
		},
		mounted(){	
			this.searchDatas();
		}
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
</style>
<style scoped>

.checkNum{
	position: absolute;
	bottom:10px;
	left: 0;
	color: red;
}
.filtrate-btn{
	margin-bottom: 10px;
}
</style>
