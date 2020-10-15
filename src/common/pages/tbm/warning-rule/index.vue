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
						<dt>规则名称：</dt>
						<dd><h-input placeholder="请输入规则名称" v-model="searchData.ruleName" icon="android-close"  @on-enter="onChangeInputEnter(`ruleName`)" @on-click="shitClearableClick('ruleName','searchData')"></h-input></dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>关联表名称：</dt>
						<dd><h-input placeholder="请输入关联表名称" v-model="searchData.tableName" @on-enter="onChangeInputEnter(`tableName`)" icon="android-close" @on-click="shitClearableClick('tableName','searchData')"></h-input></dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="handleSearch">查询</h-button>
					<h-button type="primary" @click="showAdd">添加规则</h-button>
				</li>
			</ul>
		</search-form>
		<div class="tab-box tag-relotion-tab-box">					
			<h-table
				stripe
				size="small"
				:maxHeight="maxTableHeight"
				class="full-max-height-table"
				:columns="commonTableCols"
				:data="commonTableDatas"
				:highlight-row="false"
				border>
			</h-table>
			<h-page highlight-row size="small" show-elevator	show-total show-sizer   placement="top" class="page-box"  :page-size-opts="pageSizeOpts" :total="total" :current="pagination.current" :page-size="pagination.size" @on-change="onPageChange" @on-page-size-change="onPageSizeChange"></h-page>			
		</div>
		<h-msgBox
			:isOkLeft="true"
	        v-model="modalShow"
	        :title="addModalShowTitle"
	        :footerHide="true">   
	        <h-form ref="formInline" :model="modalData" :rules="ruleInline" :label-width="100">		 
				<h-form-item prop="ruleName" label="规则名称：">
					<h-input focusAllSelect :readonly="!pageType"  style="width:310px" v-model="modalData.ruleName" v-if="pageType" icon="android-close" @on-click="shitClearableClick('ruleName','modalData')"  placeholder="请输入规则名称"></h-input>
				<div class="viewPage" v-else>{{modalData.ruleName ? modalData.ruleName : '-'}}</div>
				</h-form-item>	
				<h-form-item prop="tableName" label="关联表名称：">
					<h-input focusAllSelect :readonly="!pageType" style="width:310px" v-if="pageType" v-model="modalData.tableName" icon="android-close" @on-click="shitClearableClick('tableName','modalData')"  placeholder="请输入关联表名称"></h-input>	
				 <div class="viewPage" v-else>{{modalData.tableName ? modalData.tableName : '-'}}</div> 
				</h-form-item>	
				<h-form-item prop="rule" label="查询语句：">
					<h-input focusAllSelect :readonly="!pageType"  v-if="pageType" v-model="modalData.rule" icon="android-close" @on-click="shitClearableClick('rule','modalData')"  placeholder="查询语句" type="textarea"></h-input>
				<div class="viewPage1" v-else>{{modalData.rule ? modalData.rule : '-'}}</div> 
				</h-form-item>
			</h-form>
	         <div class="footerBox" v-if="pageType">
	         	<h-button @click="modalShow = false">取消</h-button>
	            <h-button style="margin-left: 10px" type="info" @click="handleSaveFn">确定</h-button>	            
	        </div>
	   </h-msgBox>
	</section>
</template>

<script>
	import utils from "@/utils/index";
	export default {
		name:'WarningRuleList',
		data () {
			return {
				activeRoutersButton : this.$store.state.activeRoutersButton,//控制按钮权限
				isAutoRefreshTable:true,
				tableLoading: false,
				modalShow:false,//添加/编辑modal看
				pageType:true,
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
				processingStates: [],//处理状态选项				
				loadingText:'加载中',
				loadingSearchLabel: false,
				searchData:{
					ruleName:'',					
					tableName:''
				},	
				modalData:{
					ruleName:'',
					tableName :'',
					rule:'',
					id:'',
				},	
				ruleInline: {
					ruleName:[
						{ required: true, message: '规则名不能为空', trigger: 'change' }
					],
					tableName:[
						{ required: true, message: '关联表不能为空', trigger: 'change' }
					],
					rule:[
					{ required: true, message: '规则不能为空', trigger: 'change' }
					]
				},	
				commonTableDatas:[],	
				commonTableCols: [
					{
						key: "ruleName",
						title: "规则名称",
						// width: 250,
						align: "left"
					},
					{
						key: "tableName",
						title: "关联表名称",
						width: 250,
						align: "left"
					},
					{
						title: '启用状态',
						key: "status",
						width: 250,
						align: "left",
						render: (h, params) => {
							let statusLabel = params.row.status== "1" ? '禁用' :'启用';
									return h('div', [
										h('h-switch', {
											props: {
												size: 'large',
												value: params.row.status == "1" ? true :false
										},
											on: {
												'on-change': (status) => {             
											this.$hMsgBox.confirm({
												isOkLeft:true,
												title:statusLabel,
												content:'确定要'+ statusLabel +'规则'+params.row.ruleName+"?",
												onOk:()=>{
						 			 this.changeStatus(statusLabel,status,params.row.id,params.index)
												},
												onCancel:()=>{
									this.cancelChangeStatus(params.index , status)
												},
											})					
											}
											}
										},[
										h('span',{slot: 'open',},'启用'),
										h('span',{slot: 'close',},'禁用')
										]),
										
									]);
							
						}
					},
					{
						key: "operation",
						title: "操作",
						width: 130,
						align: "center",
						render: (h, params) => {
	                    	let status = params.row.status;
	                    	let showAssignBtn = null;
	                    	let showPassBtn = null;
							let showViewBtn = null;
							if(true){
								showViewBtn = {
								class: {
	                                    'iconfont': true,
	                                    'tab-icon-btn':true,				                    
					                    'icon-view': true,
	                                },
	                                style:{
	 									color:'#298DFF'
	                                },	                               
	                                attrs:{
										title: '查看'
									},
	                                on: {
	                                    click: () => { 	  
	                                    	let {ruleName,tableName,rule,id} = params.row;  
	               							this.modalData = {ruleName:ruleName,tableName:tableName,rule:rule,id:id};
	               							this.modalData.ruleName =  ruleName.toString();
											this.modalData.tableName =  tableName.toString();
											this.modalData.rule =  rule.toString();  
	                                     	this.addModalShowTitle = '查看';
											this.modalShow = true;
											this.pageType = false;
	                                    }
									}	
								}
							};
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
											this.$refs['formInline'].resetFields();//重置表单状态
	                                    	let {ruleName,tableName,rule,id} = params.row;  
	               							this.modalData = {ruleName:ruleName,tableName:tableName,rule:rule,id:id};
	               							this.modalData.ruleName =  ruleName.toString();
											this.modalData.tableName =  tableName.toString();
											this.modalData.rule =  rule.toString();  
	                                     	this.addModalShowTitle = '修改';
											this.modalShow = true;
											this.pageType = true;
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
												title: '删除规则',
												content:
													'确定要删除规则：' +
													params.row.ruleName +
													'?',
												onOk: () => {
													let ruleId = params.row.id
													this.handleDelete(ruleId)
												}
											})
										}
	                                }
	                            }; 
	                    	 };                 	 
	                        return h('div', [
								h('span', showViewBtn),
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
			onPageChange (current) {
				this.changePageflag = true;
				this.pagination.current = current;
				this.getRuleList();
			},
			onPageSizeChange (size) {
				this.changePageflag = true;
				this.pagination.size = size;
				this.getRuleList();
			},
			/**获取规则列表--查询按钮**/
			handleSearch(){
				this.pagination.current = 1;
				this.changePageflag = false;
				this.getRuleList()
			},
			showAdd(){
				this.addModalShowTitle = '新增规则';
				// this.$refs['formInline'].resetFields();//重置表单状态
				this.modalData = {
					ruleName:'',
					tableName:'',
					rule:'',
					id:''
				};
				this.modalShow = true;
				this.pageType = true;
			},
			changeStatus(label,status,id,index){
				let url = '/tm/warning/changeRuleStatus?ruleId='+id;
				this.$http.get(url).then((res) => {
					let data = res.data ? res.data : {};
					if(data.status == this.$api.SUCCESS){
						this.$hMessage.info({
							content: '规则'+label+'成功',
							duration: 3
					})   
						this.getRuleList();
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
			onChangeInputEnter (type = ``) {
				let value = this.searchData[type];
				this.searchData[type] = value.trim();
				this.handleSearch();
			},
			shitClearableClick(type = '',dataobj='') {
				this[dataobj][type] = ``;
			},
			cancelChangeStatus(index,status){
				let info = this.commonTableDatas[index]
				if(!info.status){
				this.commonTableDatas[index].status = 1;	
				}
				this.$set(this.commonTableDatas,index,info)
			},
			/*添加/编辑保存*/
			handleSaveFn(){
				if(!this.modalShow)return
				this.$refs['formInline'].validate((valid) => {
				 	if (valid) {
						let url = '/tm/warning/saveRule'; 
						this.$http.post(url,this.modalData).then((res) => {
							let data = res.data ? res.data : {};
							if(data.status == this.$api.SUCCESS){
			 					this.$hMessage.info({
									content: this.addModalShowTitle+'成功',
									duration: 3
								});  
								this.modalShow = false;
								this.getRuleList();
							}else{
								this.$hMessage.error({
									content: data.msg,
									duration: 3
								})
								}
							}).catch(err=>{
						})
				 	}
				})		
			},
			// 删除规则
			handleDelete(ruleId) {
			let url = '/tm/warning/ruleDelete?ruleId=' + ruleId
			this.$http
				.get(url)
				.then(res => {
				let data = res.data ? res.data : {}
				if (data.status == this.$api.SUCCESS) {
					this.$hMessage.info({
					content: '删除成功',
					duration: 3
					})
					this.getRuleList()
				} else {
					this.$hMessage.error({
					content: data.msg,
					duration: 3
					})
				}
				})
				.catch(err => {})
			},
			/**获取规则列表**/
			getRuleList(){
				this.tableLoading = true;
				let url = '/tm/warning/ruleList';
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
				// this.$refs['formInline'].resetFields();
			},
			handleOperateBtn(newsId,requestUrl,tipStr){
				this.$hMsgBox.confirm({
					isOkLeft:true,
					title:tipStr,
					content:'确定'+tipStr+'规则:'+newsId+'？',
					onOk:()=>{
						let url =requestUrl+'?newsId='+newsId;
			            this.$http.get(url).then((res) =>{
			            	let data = res.data;
			                if(data.status == this.$api.SUCCESS){
			                	 this.$hMessage.info({
			                        content:tipStr+'成功',
			                        duration: 3
			                     });
			                      this.getRuleList();
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
			searchDatas(){		
				this.getRuleList();
			}
		},
		mounted(){	
			this.searchDatas();
		}
	}
</script>

<style>
.viewPage{
	border: 1px solid #DCE1E7;
	border-radius: 5px;
	padding:0 5px;
	height: 32px;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	width: 300px;
	cursor: pointer;
	}
.viewPage1{
	border: 1px solid #DCE1E7;
	border-radius: 5px;
	padding:0 5px;
	height: 200px;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	width: 300px;
	cursor: pointer;
	}
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
.footerBox{
	text-align: center;
}
</style>
