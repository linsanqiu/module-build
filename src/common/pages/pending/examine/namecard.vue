<template>
<div class="task-list-wrap">
	<h-spin fix v-if="loadingPage">
		<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
		<div>加载中...</div>
	</h-spin>
	<search-form>
		<ul slot="content">
			<li>
				<dl>
					<dt>任务编号：</dt>
					<dd>
						<h-input v-model.trim="searchItem.taskId" icon="android-close" placeholder="请输入" @on-click="onclickClose('taskId')" @on-enter="searchAll"></h-input>
					</dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>姓名：</dt>
					<dd>
						<h-input v-model.trim="searchItem.userName" icon="android-close" placeholder="请输入" @on-click="onclickClose('userName')" @on-enter="searchAll"></h-input>
					</dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>提交人ID：</dt>
					<dd>
						<h-input v-model.trim="searchItem.submitUserId" icon="android-close" placeholder="请输入" @on-click="onclickClose('submitUserId')" @on-enter="searchAll"></h-input>
					</dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>提交人：</dt>
					<dd>
						<h-input v-model.trim="searchItem.submitUserName" icon="android-close" placeholder="请输入" @on-click="onclickClose('submitUserName')" @on-enter="searchAll"></h-input>
					</dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>提交日期：</dt>
					<dd>
						<h-date-picker  @on-change="handleChangeDateSubmit" :value="submitTimeArr" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="开始日期-结束日期"></h-date-picker>
					</dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>处理日期：</dt>
					<dd>
						<h-date-picker  @on-change="changeDateHandle" :value="handleTimeArr" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="开始日期-结束日期"></h-date-picker>
					</dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>企业名称：</dt>
					<dd>
						<h-input v-model.trim="searchItem.prodName" icon="android-close" placeholder="请输入" @on-click="onclickClose('prodName')" @on-enter="searchAll"></h-input>
					</dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>处理人：</dt>
					<dd>
						<h-select clearable placeholder="请选择"  v-model="searchItem.handleUserId">
							<h-option v-for="item in handleArr" :value="item.id" :key="item.id">{{item.realName}}</h-option>
						</h-select>
					</dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>处理状态：</dt>
					<dd>
						<h-select multiple clearable placeholder="请选择"  v-model="searchItem.handleStatus">
							<h-option v-for="item in handleStateList" :value="item.code" :key="item.code">{{item.name}}</h-option>
						</h-select>
					</dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>处理结果：</dt>
					<dd>
						<h-select clearable placeholder="请选择" v-model="searchItem.handleResult">
							<h-option v-for="item in handleResultList" :value="item.code" :key="item.code">{{item.name}}</h-option>
						</h-select>
					</dd>
				</dl>
			</li>
			<li class="search-wrapper-but">
				<h-button type="primary" @on-click="searchAll">查询</h-button>		
				<h-button type="primary" @on-click="assignFnBatch" v-if="activeRoutersButton.indexOf('assignBatch') != -1">批量分配</h-button>	
				<h-button type="primary" @on-click="expotFn">导出</h-button>
			</li>
		</ul>
	</search-form>	
		<div v-if="showImgModal" class="mask">
			<span @click="closeImg">×</span>
			<img :src="showImgModal" alt="" />
	</div>
	<div class="tab-box tag-relotion-tab-box">		
		<h-table class="full-max-height-table" :maxHeight="maxTableHeight" stripe size="small" border width="100%" :columns="columns" :data="cardList" :rowSelect="true" @on-selection-change="selectChange"  @on-select-cancel="cancelSelect"></h-table>
		<h-page size="small" class="page-box" :total="total" :current="searchItem.pageNum" :page-size="searchItem.pageSize" @on-change="changePage" @on-page-size-change="changePageSize"  :page-size-opts="pageSizeOpts" show-elevator show-total show-sizer placement="top"></h-page>		
		<div class="checkNum">{{'当前已选择 '+ selectIdArr.length+' 条'}}</div>		
	</div>
	<div>
		 <h-msgBox
			class-name="modalSim"
			v-model="modalAssign"
			title="任务分配"
			:footerHide="true">
			<div class="select-box" style="margin-bottom: 10px;">
				<span>请选择处理人员:</span>
				<h-input v-model.trim="handleUserNameModal" icon="android-close" placeholder="搜索" style="width:200px" @on-click="clearHandleUserName" @on-enter="getHandleList"></h-input>
				<h-button type="info" @on-click="getHandleList">查询</h-button>
			</div>	
			 <h-table size="small" highlight-row  width="100%" height="197" :loading="loadingModalAssign" :columns="handleColumns" :data="handleList" @on-row-click="selectHandleRow"></h-table>
			<div class="footerBox">
				<h-button  @click="modalAssign = false">取消</h-button>
				<h-button style="margin-left: 10px" type="info" @click="saveAssignTask">确定</h-button>	            
			</div>
		</h-msgBox>
		<h-msgBox
			class-name="modalAuth"
			v-model="modalAuth"
			:title="authTitle"
			:footerHide="true">
			<div class="radioBox">
				<span class="title">处理结果:</span>
				<h-radio-group  v-model="handleResultModal">
					<h-radio disabled label="1">
						<span>认证通过</span>
					</h-radio>
					<h-radio disabled label="2">
						<span>认证失败</span>
					</h-radio>
				</h-radio-group>
			</div>
			<div class="textareaBox">
				<span class="titleHandle">处理意见:</span>
				<h-input :maxlength="500" v-model="authReason" type="textarea" placeholder="请输入处理原因(认证失败为必填)"></h-input>
			</div>
			 <div class="footerBox">
				<h-button  @click="closeAuthModal">取消</h-button>
				<h-button style="margin-left: 10px" type="info" @click="handleAuthFn">确定</h-button>	            
			</div>
		</h-msgBox>
	</div>			
</div>
</template>

<script>
import utils from '@/utils'
export default{
	name: 'ExamineNamecard',
	data () {
		return {
			activeRoutersButton : this.$store.state.activeRoutersButton,
			pageSizeOpts:[10,20,50,100],
			heightValue:null,
			total:0,			 
			loadingPage:false,
			showImgModal:"",
			searchItem:{
				pageNum:1,
				pageSize:10,
				taskId:'',
				startSubmitTime:'',
				endSubmitTime: '',//提交日期
				startHandleTime:'',
				endHandleTime: '',//处理日期
				submitUserId:'',
				submitUserName:'',
				userName:'',
				prodName:'',
				handleStatus:["0","1"],
				handleResult:'',
				handleUserId:'',
				ids:[]
			},
			submitTimeArr: ['',''],//提交日期
			handleTimeArr: ['',''],//处理日期
			handleArr:[],
			heightValue:null,
			loadingModalAssign:true,
			modalAssign: false,
			modalAuth:false,
			authTitle:'认证通过',
			authId:'',
			handleResultModal:"1",//1为通过 2为失败
			authReason:'',//失败原因
			handleUserNameModal:'',
			changePageflag:false,
			selectIdArr:[],
			selectIdArrOld:[],
			cardList:[],//名片列表
			handleList:[],//处理人员列表
			assignUserId:'',
			handleResultList:[{
				code:"1",
				name:'认证通过'
			},{
				code:"2",
				name:'认证失败'
			}],
			handleStateList:[{
				code:"0",
				name:'未分配'
			},{
				code:"1",
				name:'未处理'
			},{
				code:"2",
				name:'已处理'
			}],        
			handleColumns:[
				{
					title: '人员姓名',
					key: 'userName',
				},{
					title: '待处理任务',
					key: 'total',
				},{
					title: '已处理任务',
					key: 'dealTotal',
				}
			],            
			columns: [
				{
				  type: 'selection',
				  width: 50,
				  align: 'center',
				  fixed: 'left'
			   },
				{
					title: '任务编号',
					key: 'taskId',
					width: 150,
				},
				{
					title: '姓名',
					key: 'userName',
				},
				{
					title: '企业名称',
					key: 'prodName',
					width: 220,
				},
				{
					title: '部门',
					key: 'department',
				},
				{
					title: '职位',
					key: 'position',
				},
				{
					title: '附件',
					key: 'attachment',
					render: (h, params) => {
						let status = params.row.status;
						 <h-poptip trigger="hover" title="提示标题" content="提示内容">
							<h-button>hover激活</h-button>
						</h-poptip>
						return h('div',[
								h('img',{
									 style:{
										 'width':'30px',
										 'height':'25px',
										 'cursor':'pointer'
									},
									attrs:{
										src: params.row.annexName,
										alt:'',
										title: '查看大图'
									},
									on: {
										click:()=>{
//											this.showImgModal = params.row.annexName;
											window.open(params.row.annexName);
										},
									}
								}),
								h('img',{
									 style:{
										 "max-height":'100%',
										 "max-width":'100%',
										 "display":'none',
										 "position":'fixed',
										 "top":0,
										 "right":0,
										 "bottom":0,
										 "left":0,
										 "margin":"auto",
										 "z-index":'100'
									},
									class: {
										'showImg': true
									},
									props:{
										slot:'content'
									},
									attrs:{
										src: params.row.annexName,
										alt:'',
										ref:'showImg'
									},
								})
							])
   
					}
				},
				{
					title: '提交时间',
					key: 'submitTime',
					width: 150,
				},
				{
					title: '提交人ID',
					key: 'submitUserId',
				},
				{
					title: '提交人',
					key: 'submitUserName'
				},
				{
					title: '处理人',
					key: 'handleUserName'
				},
				{
					title: '处理状态',
					key: 'handleStatusName'
				},
				 {
					title: '处理结果',
					key: 'handleResultName'
				},
				{
					title: '处理时间',
					key: 'handleTime',
					width: 150
				},
				{
					title: '处理意见',
					key: 'handleOpinion',
					 width: 150
				},              
				{
					title: '操作',
					key: 'action',
					width:120,
					fixed: 'right',
					align: 'left',
					render: (h, params) => {
						let status = params.row.status;
						let showAssignBtn = null;
						let showPassBtn = null;
						let showFailBtn = null;
						if(this.activeRoutersButton.indexOf('assignBtn') != -1){
							showAssignBtn = {
								class: {
									'iconfont': true,
									'icon-android-contacts':true,				                    
									'tab-icon-btn': true,
								},
								attrs:{
									title: '分配'
								},
								on: {
									click: () => {                                    	
										this.isHandleRole((res)=>{
											if(!res){
												this.$hMessage.warning('暂无操作权限');
												return
											}else{
												let idArr = [];
												idArr.push(params.row.id);
												this.modalAssign = true;
												this.handleUserNameModal = '';
												this.searchItem.ids = idArr;
												this.getHandleList();
											}
										});                                     	
									}
								}
							}
						};
						 if(this.activeRoutersButton.indexOf('passBtn') != -1){
							showPassBtn =  {
								class: {
									'iconfont': true,
									'icon-android-done': true,
									'tab-icon-btn': true,
								},
								style:{
									color:params.row.handleStatus == "2" ? '#D7DDE4' : ''
								},
								attrs:{
									title: '认证通过'
								},
								on: {
									click: () => {
										if(params.row.handleStatus == "2")return
										this.modalAuth = true;
										this.authTitle = '认证通过';
										this.authId = params.row.id;
										this.authReason = '';
										this.handleResultModal = "1"
									}
								}
							}; 
						 };
						 if(this.activeRoutersButton.indexOf('failBtn') != -1){
							showFailBtn = {
								class: {
									'iconfont': true,
									'icon-android-close': true,
									'tab-icon-btn': true,
							   },
								style:{
									color:params.row.handleStatus == "2" ? '#D7DDE4' : ''
								},
								attrs:{
									title: '认证失败'
								},
								on: {
									click: () => {
										 if(params.row.handleStatus == "2")return
										 this.modalAuth = true;
										 this.authTitle = '认证失败';
										 this.authReason = '';
										 this.authId = params.row.id;
										 this.handleResultModal = "2"
									}
								}
							}; 
						 };                    	 
						return h('div', [
							h('span', showAssignBtn),
							h('span', showPassBtn),
							h('span', showFailBtn)                                                
						]);
					}
				}
			]
			
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods:{
		closeImg(){
			this.showImgModal = "";
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
				if(selectArr.length == 0){
					//翻页——全选取消选择
					this.cardList.forEach((item,i)=>{
						let index = this.selectIdArr.indexOf(item.id);
						if(index != -1){
							this.selectIdArr.splice(index,1);
						}	                		
					});	
					return;
				}
				let newSelectIdArr = this.selectIdArr.concat(selectArrId);
				this.searchItem.ids = Array.from(new Set(newSelectIdArr));
				this.selectIdArr = this.searchItem.ids;
			   }else{
					//未翻页选择
					this.searchItem.ids = selectArrId;
					this.selectIdArr = selectArrId;	
			   } 
			  
		},
		changePage(current){
			this.searchItem.pageNum = current;
			this.changePageflag = true;			
			this.getCardList();
		},
		changePageSize(size){
			this.searchItem.pageSize = size;
			this.changePageflag = true;
			this.getCardList();
		},
		onclickClose(item) {
			this.searchItem[item] = ''
		},
		selectHandleRow(row){
			this.assignUserId = row[0].userId;
		},
		handleChangeDateSubmit(date){
			this.searchItem.startSubmitTime = this.subDateStr(date[0]);
			this.searchItem.endSubmitTime = this.subDateStr(date[1]);
		},
		changeDateHandle(date){
			this.searchItem.startHandleTime = this.subDateStr(date[0]);
			this.searchItem.endHandleTime = this.subDateStr(date[1]);
		},
		searchAll(){
			this.searchItem.pageNum = 1;
			this.changePageflag = false;
			this.getCardList();
		},
		expotFn(){
			let url = '/tm/cardauthentication/export';
			utils.exportDataFn(this.searchItem,url,(downId)=>{
				if(downId){
					window.location.href='/tm/cardauthentication/download?key='+downId
				}
			})
		},
		subDateStr(dateStr){
			return dateStr = dateStr.substring(0,4) + dateStr.substring(5,7) + dateStr.substring(8,10)
		},
		/**分配任务提交**/
		saveAssignTask(){
			if(!this.assignUserId){
				this.$hMessage.warning('请选择处理人员！');
				return
			}
			let url = '/tm/cardauthentication/distribute';			
			this.$http.post(url,{
				userId:this.assignUserId,
				ids:this.searchItem.ids
			}).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){
					this.$hMessage.info('分配成功');
					this.modalAssign = false;
					this.searchItem.pageNum = 1;
					this.searchItem.ids = [];
					this.getCardList();
				}else{
					this.$hMessage.error({content: data.msg})
				}
			})
			.catch(err=>{
				this.$hLoading.error()
			})
		},
		assignFnBatch(){
			this.isAssignRole((res)=>{
				if(!res){
					this.$hMessage.warning('暂无操作权限');
					return
				}else{
					if(this.selectIdArr.length == 0){
						this.$hMessage.warning('请选择要分配的名片认证记录');
						return
					};    		
					this.modalAssign = true;	
					this.handleUserNameModal = '';
					this.getHandleList();
				}
			});    		 	
		},  
		//判断是否有分配权限
		isAssignRole(cb){    		
			let url = '/tm/cardauthentication/assignrole'  		
			this.$http.get(url).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){
					cb(true);
				}else if(data.status == 1001){
					cb(false);
				}else{
					this.$hMessage.error({content: data.msg})
				}
			}).catch(err=>{
				this.$hLoading.error()
			})
		},
		//判断是否有分配权限
		isHandleRole(cb){    		
			let url = '/tm/cardauthentication/handlerole'  		
			this.$http.get(url).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){
					cb(true);
				}else if(data.status == 1001){
					cb(false);
				}else{
					this.$hMessage.error({content: data.msg})
				}
			}).catch(err=>{
				this.$hLoading.error()
			})
		},
		closeAuthModal(){
			this.modalAuth = false;
		},
		handleAuthFn(){    	
			if(this.handleResultModal == "2" && !this.authReason){
				this.$hMessage.warning('请输入认证失败原因！');
				return
			}
			let url = '/tm/cardauthentication/handle';
			this.$http.post(url,{
				id:this.authId,
				handleResult:Number(this.handleResultModal),
				handleOpinion:this.authReason
			}).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){                	 
					  this.$hMessage.info('处理成功！');
					  this.searchItem.pageNum =1;
					  this.modalAuth = false;
					  this.getCardList();
				}else{
					this.$hMessage.error({content: data.msg})
				}
			})
			.catch(err=>{
				this.$hLoading.error()
			})
		},
		clearHandleUserName(){
			this.handleUserNameModal = '';
		},
		getHandleUser(){
			let url = '/tm/cardauthentication/handleuserlist'   		
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
		getHandleList(){
			let url = '/tm/cardauthentication/handlelist?handleUserName='+this.handleUserNameModal   		
			this.$http.get(url).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){
					this.handleList = data.data || [];
					this.assignUserId = '';//清空任务分配处理人员
					this.loadingModalAssign = false;
				}else{
					this.$hMessage.error({content: data.msg})
				}
			})
			.catch(err=>{
				this.$hLoading.error()
			})
		},
		getCardList(){
			this.loadingPage = true
			let url = '/tm/cardauthentication/list';
			this.$http.post(url,this.searchItem).then((res) => {
				let data = res.data || {} ;
				if(data.status == this.$api.SUCCESS){ 
					this.cardList = data.body.records;
					this.total = data.body.total;
					this.heightValue = this.cardList.length >=10 ? 340 : null;   
					if(this.changePageflag){
						this.cardList.forEach((item,i)=>{
							if(this.selectIdArr.indexOf(item.id) != -1){
								item['_checked'] = true
							}	                		
						});	
					}else{
						this.selectIdArr = [];
					}
				}else{
					this.$hMessage.error({content: data.msg})
				}
	  
				this.loadingPage = false;
							  
		   }).catch(err=>{
				this.loadingPage = false;
				this.$hLoading.error()
			})
		}
	},
	mounted(){
		this.getCardList();	
		this.getHandleUser();
	}
}
</script>
<style>

.modalAuth .h-modal-content{
	width: 500px!important;
}
.modalAuth .textareaBox{
	margin-top:15px;
}
.modalAuth .textareaBox .h-input-wrapper{
	resize: none;
	width:300px;
	margin-left: 20px;
	
}
.modalAuth .h-input-wrapper textarea{
	resize: none;
	height: 100px;
	width:300px;
}
.modalAuth .radioBox .title{
	margin-right:20px;
}
.modalAuth .textareaBox .titleHandle{
	position: relative;
	top:-42px;
}
.modalSim table{
	width:100%!important;
}
.footerBox{
	text-align: center;
	padding: 10px 0;
}

.select-box-wrap .h-btn{
	padding: 6px;
}
</style>
<style scoped>
.mask{  
	width: 100%;   
	height: 100%;
	position: fixed;
	top: 0px;
	left: 0px; 
	bottom: 0;
	background:rgba(51,51,51,0.86); 
	z-index: 1002;    
} 
.mask span{
	font-size: 40px;
	color: #fff;
	position: absolute;	 
	right: 20px;
	cursor: pointer;
	z-index: 1003;
} 
.mask img{
	max-width:80%;
	max-height: 80%;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	margin: auto;
} 
.task-list-wrap{
	position: relative;
}
.select-box-wrap{
	margin:10px 0;	
}
.select-box{
	display: inline-block;
	margin-right: 15px;
	margin-bottom: 7px;
}
.h-modal-body {
	padding: 16px 32px;
}
.modelTitle{
	font-size: 14px;
}
.modelCon li{
	width: 140px;
	display: inline-block;
	margin: 5px 10px;
	font-size: 14px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	cursor: pointer;
}
.tabBox{
	border-top: 1px solid #D7DDE4;
	margin-top: 10px;
	padding:10px 0;
	margin-left: -3px;
}
.checkNum{
	position: absolute;
	bottom:10px;
	left: 0;
	color: red;
}
.tag-relotion-tab-box>>> .h-editgird-fixed-header .cur-th th{
	background: #f0f3f5;
}
.tag-relotion-tab-box .h-editgird-small th{
	background: #f0f3f5;
}
.tag-relotion-tab-box>>> .h-table-row-highlight td,.tag-relotion-tab-box>>> .h-table-row-checked td,.tag-relotion-tab-box>>> .h-table tr.h-table-row-highlight.h-table-row-hover td,.tag-relotion-tab-box>>> .h-table tr.h-table-row-checked.h-table-row-hover td,.tag-relotion-tab-box>>> .h-table-stripe .h-table-body tr.h-table-row-highlight:nth-child(2n) td,.tag-relotion-tab-box>>> .h-table-stripe .h-table-fixed-body tr.h-table-row-highlight:nth-child(2n) td,.tag-relotion-tab-box>>> .h-table-stripe .h-table-body tr.h-table-row-checked:nth-child(2n) td,.tag-relotion-tab-box>>> .h-table-stripe .h-table-fixed-body tr.h-table-row-checked:nth-child(2n) td{
	 background-color: #ebf7f0!important;
}
/*.tag-relotion-tab-box>>> .h-page-options-sizer{
	position: relative;
	top: 4px;
}*/
.tag-relotion-tab-box>>> .h-table-fixed-right-patch{
	width: 0!important;
}
</style>