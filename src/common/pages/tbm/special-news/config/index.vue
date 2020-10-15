<template>
	<div style="position: relative;">
		<h-spin fix v-if="tableLoading">
			<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
			<div>加载中...</div>
		</h-spin>
		<search-form>
		  <ul slot="content">
		  	<li>
	          <dl>
	            <dt>专题ID：</dt>
	            <dd>
	            	<h-input type="int" :maxlength="19" placeholder="请输入专题ID" v-model="searchData.id"  icon="android-close" @on-click="shitClearableClick(`id`)"></h-input>
	            </dd>
	          </dl>
	        </li>
			<li>
			  <dl>
				<dt>专题名称：</dt>
				<dd>
					<h-select clearable filterable placeholder="专题名称" v-model="searchData.themeId">
						<h-option v-for="(item, i) in specialNameList" :value="item.id" :key="i">
							{{item.themeName}}
						</h-option>
					</h-select>
				</dd>
			  </dl>
			</li>
			<li>
			  <dl>
				<dt>所属项目：</dt>
				<dd>
					<h-select  clearable filterable  placeholder="所属项目" v-model="searchData.appId">
						<h-option v-for="(item, i) in appList" :value="item.dictEntry" :key="item.dictEntry">
							{{item.entryName}}
						</h-option>
					</h-select>
				</dd>
			  </dl>
			</li>
			 
			<li>
			  <dl>
				<dt>状态：</dt>
				<dd>
					<h-checkbox-group v-model="themeStatus" @on-change="changeThemeStatus">
						<h-checkbtn value="1" label="启用">
							 <span>启用</span> 
						</h-checkbtn>
						<h-checkbtn value="0" label="停用">
							<span>停用</span>
						</h-checkbtn>
					</h-checkbox-group>
				</dd>
			  </dl>
			</li>
			<li class="search-wrapper-but">
				<h-button type="primary" data-ref="init-btn" @click="searchAll">查询</h-button>
				<h-button type="primary" data-ref="init-btn" v-if="activeRoutersButton.indexOf('specialAdd') != -1" @click="handleNewPage">新建</h-button>					
				<h-button type="primary" data-ref="init-btn" v-if="activeRoutersButton.indexOf('specialExport') != -1" @click="exportFn" :loading='isExporting'>导出</h-button>
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
				:maxHeight="maxTableHeight"
				class="full-max-height-table"
				:columns="commonTableCols"
				:data="commonTableDatas"
				:highlight-row="false"
				@on-selection-change="selectChange"
				@on-select-cancel="cancelSelect"
				border>
			</h-table>
			<h-page highlight-row size="small" show-elevator	show-total show-sizer placement="top" class="page-box"  :total="total" :current="pagination.current" :page-size-opts="pageSizeOpts" :page-size="pagination.size" @on-change="onPageChange" @on-page-size-change="onPageSizeChange"></h-page>		
			<div class="checkNum">{{'当前已选择 '+ selectIdArr.length+' 条'}}</div>		
		</div>
		<h-msgBox
			:isOkLeft="true"
			v-model="modalShow"
			width="650"
			:title="modalShowTitle"
			:footerHide="true">   
			<h-form  onsubmit="return false;" ref="formInline" :rules="ruleInline" :model="modalData" :label-width="100">	
				<div>
					<h-form-item prop="themeName" style="display:inline-block" label="专题名称：">
						<h-input style="width:150px" v-model.trim="modalData.themeName"></h-input>
					</h-form-item>
					<h-form-item style="display:inline-block" label="状态：">
						<h-select style="width:150px" readonly v-model="modalData.themeStatus">
							<h-option v-for="(item, i) in themeStatusList" :value="item.value" :key="item.value">
								{{item.label}}
							</h-option>
						</h-select>
					</h-form-item>		
				</div>	
				 <div>
					<h-form-item prop="appIdList" label="所属项目：" >	
						<h-checkbox-group v-model="modalData.appIdList">
							<h-checkbox v-for="(item, i) in appList" :value="item.dictEntry" :label="item.dictEntry" :key="i"><span style="padding:0 3px;">{{item.entryName}}</span></h-checkbox>
						</h-checkbox-group>
					</h-form-item>	
				</div>				  
			</h-form>
			 <div class="footerBox">
				<h-button @click="modalShow = false">取消</h-button>
				<h-button style="margin-left: 10px" type="info" @on-click="handleSaveFn">保存</h-button>	            
			</div>
	   </h-msgBox>
	</div>
</template>

<script>
	import utils from "@/utils";
	const TODAY = utils.getToday();
	export default{
		name:'TbmSpecial-newsConfigIndex',
		data(){
			return{
				heightValue:null,
				activeRoutersButton : this.$store.state.activeRoutersButton,//控制按钮权限
				isAutoRefreshTable:false,
				tableLoading:false,
				changePageflag:false,
				searchData:{
					id:'',
					themeId:'',
					appId:'',
					themeStatus:'1',
				},
				themeStatus:['1'],
				pagination: {
					current: 1,
					size:10
				},
				pageSizeOpts:[10,20,50,100],
				total:0,

				specialNameList:[],//专题名称
				appList:[],//所属项目
				newsOpenFlags:[],//公开标志
				publishDateRange: [TODAY, TODAY],
				createDateRange: [TODAY, TODAY],
				selectIdArr:[],
				modalShow:false,//添加、修改框
				modalShowTitle:'',
				modalData:{
					themeName:'',
					themeStatus:'1',
					appIdList:['2']
				},
				themeStatusList:[
					{
						label:'启用',
						value:'1'
					},{
						label:'停用',
						value:'0'
					}
				],
				ruleInline: {
					themeName: [
						{ required: true, message: '专题名称不能为空', trigger: 'change' }
					],
					appIdList: [
						{ required: true,type: 'array', min: 1,message: '所属项目为必选项', trigger: 'change' }
					]		
				},
				commonTableCols: [
					{
						type: "selection",
						width: 60,
						align: "center",
						fixed: "center",
					},{
						key: "id",
						title: "专题ID",
						width: 160,
						align: "left"
					},{
						key: "themeName",
						title: "专题名称",
						align: "left"
					},					
					{
						key: "apps",
						title: "所属项目",
						width: 160,
						align: "left"
					},					
					{
						key: "creatorName",
						title: "创建人",
						width: 100,
						align: "left",
					},
					{
						key: "createTime",
						title: "创建时间",
						width: 150,
						align: "left"
					},
					{
						key: "updateTime",
						title: "最近修改时间",
						width: 150,
						align: "center",
					},{
						key: "updaterName",
						title: "最近修改人",
						width: 100,
						align: "left",
					},{
						title: '状态',
						key: 'themeStatus',
						align: "center",
						width: 100,
						render: (h, params) => {
							if(this.activeRoutersButton.indexOf('SpecialStatusSwitch') != -1){
								return h('div', [
									h('h-switch', {
										props: {
											size: 'large',
											value: params.row.themeStatus == 1 ? true :false
										},
										on: {
											'on-change': () => {
												let operatestatus = params.row.themeStatus == 1 ? "停用" :  "启用" ;
												let status = params.row.themeStatus == 1 ?   0 : 1;
												this.$hMsgBox.confirm({
													isOkLeft:true,
													title:operatestatus,
													content:'确定要'+ operatestatus + params.row.themeName+"?",
													onOk:()=>{														
														this.changeStatus(operatestatus,status,params.row.id,params.index)
													},
													onCancel:()=>{
														this.cancelChangeStatus(params.index,params.row.themeStatus)
													},
												})					
											}
										}
									},[
									  h('span',{
										slot: 'open',
									  },'启用'),
									  h('span',{
										slot: 'close',
									  },'停用')
									]),
									
								]);
							}else{
								return h('div', params.row.themeStatus)
							}
						}
					},{
						key: "operation",
						title: "操作",
						width: 90,
						align: "center",
						fixed: "right",
						render: (h, params) =>{
							let status = params.row.status;
							let showAssignBtn = null;
							let showPassBtn = null;
							let showFailBtn = null;
							let showViewBtn = null;
							let showTopBtn = null;
							let showCanceltopBtn = null;
							if(this.activeRoutersButton.indexOf('specialEdit') != -1){
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
											this.modalShowTitle = '修改';
											this.modalShow = true;	
											this.$refs['formInline'].resetFields();//重置表单状态
											let {themeName,themeStatus,appIdList,id} = params.row;
											this.modalData = {id,themeName,themeStatus:themeStatus.toString() ,appIdList};
										}
									}
								}
							};
							if(this.activeRoutersButton.indexOf('specialDelete') != -1){
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
												title:'删除',
												content:'确定要删除该条专题：'+params.row.themeName +'?',
												onOk:()=>{			 											
													this.handleDelete(params.row.id);							 
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
					}
				],
				commonTableDatas: [],
				isExporting: false
			}
		},
		computed: {
			maxTableHeight(){ return this.$store.state.maxTableHeight },
		},
		methods:{
			shitClearableClick(type = ``) {
				this.searchData[type] = ``;
			},
			handleSearch(){
				this.selectIdArr = [];
				this.pagination.current = 1;
				this.changePageflag = false;
				this.getList();
			},
			handleNewPage(){        		
				this.modalShowTitle = '新建';
				this.modalShow = true;        		
				this.modalData = {
					themeName:'',
					themeStatus:'1',
					appIdList:['2']
				};
				this.$refs['formInline'].resetFields();//重置表单状态
			},
			exportFn(){
				let url = '/tm/exportThemeInfos';
				let postData = {...this.searchData};
				this.isExporting = true
				postData.ids = 	this.selectIdArr;
				utils.exportDataFn(postData,url,(res)=>{
					this.isExporting = false
					if(res){
						utils.commonDownLoad(res,'专题配置-'+ utils.getToday());
					}
				});
			},
			handleDelete(id){
				let delStatus = false;
				if(delStatus)return
				let url = '/tm/removeById?id='+id;
				this.$http.get(url).then((res) => {
					let data = res.data ? res.data : {};
					if(data.status == this.$api.SUCCESS){
						this.$hMessage.info({
							content: '删除成功',
							duration: 3
						});   
						this.searchAll();
					}else{
						this.$hMessage.error({
							content: data.msg,
							duration: 3
						})
					} 
					delStatus = true;
				}).catch(err=>{
					delStatus = true;
				})
			},
			cancelSelect(selection,row){ 
				//取消选择某一项
				let  index = this.selectIdArr.indexOf(row.id);
				if (index != -1) { 
					this.selectIdArr.splice(index, 1); 
				}  
			},
			onPageChange (current) {
				this.changePageflag = true;
				this.pagination.current = current;
				this.getList();
			},
			onPageSizeChange (size) {
				this.changePageflag = false;
				this.pagination.size = size;
				this.getList();
			},
			selectChange(selection){
			   let selectArr = selection;
			   let selectArrId = [];
			   selectArr.forEach((item,index)=>{
				  selectArrId.push(item.id)
			   })	  
			   if(this.changePageflag){
				//翻页选择
				if(selectArr.length == 0){
					//翻页——全选取消选择
					this.commonTableDatas.forEach((item,i)=>{
						let index = this.selectIdArr.indexOf(item.id);
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
			changeStatus(label,status,id,index){
				let url = '/tm/modifyThemeStatus?id='+id + '&status='+status;				
				this.$http.get(url).then((res) => {
					let data = res.data ? res.data : {};
					if(data.status == this.$api.SUCCESS){
						this.$hMessage.info({
							content: label+'成功',
							duration: 3
					  });
					   this.getList();
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
				let info = {...this.commonTableDatas[index]}
				info.themeStatus = status;
				this.$set(this.commonTableDatas,index,info)
			},
			changeThemeStatus(label){
				if(label.length == 0 || label.length == 2){
					this.searchData.themeStatus = ''
				}else{
					this.searchData.themeStatus = Number(label[0])
				}        		
			},        	
			getSpecialNameList(){
				let url = '/tm/getThemesMap';
				this.$http.get(url).then((res) => {
					let data = res.data;
					if(data.status == this.$api.SUCCESS){
						this.specialNameList = data.body.themeList || [];
					}else{
						this.$hMessage.error({content: data.msg})
					}
				})
				.catch(err=>{
					this.$hLoading.error();
				})
			},
			handleSaveFn(){
				if(!this.modalShow)return
				this.$refs['formInline'].validate((valid) => {
					if (valid) {
						let url = '/tm/saveThemeInfo';	
						let saveInfo = {...this.modalData};	
						if(this.modalShowTitle == '修改'){
							url = '/tm/modifyThemeInfo';	
						}else{	
							saveInfo.themeStatus = 1;
						};
						this.$http.post(url,saveInfo).then((res) => {
							let data = res.data ? res.data : {};
							if(data.status == this.$api.SUCCESS){
								this.$hMessage.info({
									content: this.modalShowTitle+'成功',
									duration: 3
								});  
								this.modalShow = false;
								this.searchAll();
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
			searchAll(){
				this.selectIdArr = [];
				this.pagination.current = 1;
				this.getList();				
			},
			getWindowMaxWidth(){
				let maxWidth = window.screen.width || 1366;
				if (maxWidth < 1920) {
					this.heightValue = this.commonTableDatas.length >=10 ? 300 : null;
				} else {
					this.heightValue = this.commonTableDatas.length >=20 ? 650 : null;		
				}
			},
			getList(){
				this.tableLoading = true;
				let url = '/tm/getThemes';
				this.$http.post(url,{...this.searchData,...this.pagination}).then((res) => {
					let data = res.data;
					if(data.status == this.$api.SUCCESS){
						let commonTableDatas = data.body.records || [];	 
						this.total = data.body.total;
//		                this.heightValue = commonTableDatas.length >=10 ? 350 : null;
						this.commonTableDatas = [...commonTableDatas];
						this.getWindowMaxWidth();
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
						sessionStorage.setItem("searchData", searchData);
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
		},
		mounted(){
			this.getSelectOption('appList', 1011);
			this.getList();
			this.getSpecialNameList();
		},
		activated: function(){
			if (this.isAutoRefreshTable){
				this.getList();
				this.getSpecialNameList();
			}
		}
	}
</script>
<style scoped>
.footerBox{
	text-align: center;
	padding:10px 0 ;
}
</style>