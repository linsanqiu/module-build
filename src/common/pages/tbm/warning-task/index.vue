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
						<dt>作业名称：</dt>
						<dd><h-input placeholder="请输入作业名称" v-model="searchData.taskName" @on-enter="onChangeInputEnter(`taskName`)" icon="android-close" @on-click="shitClearableClick(`taskName`,'searchData')"></h-input></dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="handleSearch">查询</h-button>
					<h-button v-if="true" type="primary" data-ref="init-btn" @click="handleNewPage">新建任务</h-button>
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
	export default {
		name:'WarningTaskList',
		data () {
			return {
				activeRoutersButton : this.$store.state.activeRoutersButton,//控制按钮权限
				isAutoRefreshTable:true,
				tableLoading: false,
				modalShow:false,//添加/编辑modal看
				addModalShowTitle:'',//添加/编辑表头显示文字
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
					taskName:''
				},	
				commonTableDatas:[],
				commonTableCols: [
					{
						key: "taskCode",
						title: "作业编号",
						align: "left"
					},
					{
						key: "taskName",
						title: "作业名称",
						width: 150,
						align: "left"
					},
					{
						key: "taskTiming",
						title: "任务执行规则",
						// width: 150,
						align: "left"
					},
					{
						key: "taskStartDate",
						title: "启用日",
						width: 150,
						align: "left"
					},
					{
						key: "taskEndDate",
						title: "停用日",
						width: 150,
						align: "left"
					},
					{
						key: "lastTime",
						title: "上次执行时间",
						width: 150,
						align: "left"
					},
					{
						key: "nextTime",
						title: "预计执行时间",
						width: 150,
						align: "left"
					},	
					{
						key: "operation",
						title: "操作",
						width: 130,
						align: "center",
						fixed: "right",
						render: (h, params) => {
	                    	let status = params.row.status;
	                    	let showAssignBtn = null;
	                    	let showPassBtn = null;
	                    	let showFailBtn = null;
	                    	if(true){
	                    		showAssignBtn = {
	                            	class: {
	                                    'iconfont': true,
	                                    'icon-t-b-message':true,				                    
					                    'tab-icon-btn': true,
	                                },
	                                style:{
	 									color:'#298DFF'
	                                },	                               
	                                attrs:{
										title: '修改'
									},
	                                on: {
	                                    click: () => { 	  
                                        this.$router.push('/tbm/warning-task/edit?taskId=' + params.row.id);
	                                    }
	                                }
	                            }
	                    	};
	                    	if(true){
	                    	 	showPassBtn =  {
									class: {
	                                    'iconfont': true,
					                    'icon-t-b-delete': true,
					                    'tab-icon-btn': true,
	                                },
	                                style:{
	 									color:'red'
	                                },
	                                attrs:{
										title: '删除'
									},
	                                on: {
										click: () => {
											this.$hMsgBox.confirm({
												isOkLeft:true,
												title: '删除任务',
												content:
													'确定要删除任务：' +
													params.row.taskName +
													'?',
												onOk: () => {
													let taskId = params.row.id
													this.handleDelete(taskId)
												}
											})
										}
	                                }
	                            }; 
	                    	 };                 	 
	                        return h('div', [
	                            h('span', showAssignBtn),
	                            h('span', showPassBtn)                                            
	                        ]);
						}
					}]		
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
				this.getTaskList();
			},
			onPageSizeChange (size) {
				this.changePageflag = true;
				this.pagination.size = size;
				this.getTaskList();
			},
			/**获取任务列表--查询按钮**/
			handleSearch(){
				this.pagination.current = 1;
				this.changePageflag = false;
				this.getTaskList()
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
						this.getTaskList();
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
			// 删除任务
			handleDelete(taskId) {
			let url = '/tm/warning/taskDelete?taskId=' + taskId
			this.$http
				.get(url)
				.then(res => {
				let data = res.data ? res.data : {}
				if (data.status == this.$api.SUCCESS) {
					this.$hMessage.info({
					content: '删除成功',
					duration: 3
					})
					this.getTaskList()
				} else {
					this.$hMessage.error({
					content: data.msg,
					duration: 3
					})
				}
				})
				.catch(err => {})
			},
			/**获取任务列表**/
			getTaskList(){
				this.tableLoading = true;
				let url = '/tm/warning/taskList';
	            this.$http.post(url,{...this.searchData,...this.pagination}).then((res) => {
	            	let data = res.data;
					// this.ruleList = obj.data.list ? obj.data.list : [];
	                if(data.status == this.$api.SUCCESS){
	                	this.commonTableDatas = data.body.records || [];
		                this.total = data.body.total;
		                this.heightValue = this.commonTableDatas.length > 10 ? 350 : null;
		                this.commonTableDatas.forEach((item,i)=>{
                			if(item.handleStatus != 0){
	                			item['_disabled'] = true
	                		}
	                	});	
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
			onChangeInputEnter (type = ``) {
				let value = this.searchData[type];
				this.searchData[type] = value.trim();
				this.handleSearch();
			},
			/**生成新建任务ID**/
			handleNewPage(){
				this.$router.push({path:'/tbm/warning-task/add'});
			},
			handleOperateBtn(newsId,requestUrl,tipStr){
				this.$hMsgBox.confirm({
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
			                      this.getTaskList();
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
			/**切换每页条数**/
			searchDatas(){			
				this.getTaskList();
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
.filtrate-btn .h-btn{
	margin-right: 10px;
}
</style>
