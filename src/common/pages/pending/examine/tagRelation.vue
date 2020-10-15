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
					<dt>用户标签内容：</dt>
					<dd><h-input v-model.trim="labelCon" icon="android-close" placeholder="请输入" @on-click="onclickClose" @on-enter="searchAll"></h-input></dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>关系：</dt>
					<dd>
						<h-select clearable placeholder="请选择"  v-model="relationId">
							<h-option v-for="item in relationList" :value="item.code" :key="item.code">{{item.name}}</h-option>
						</h-select>
					</dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>关系类型：</dt>
					<dd>
						<h-select clearable placeholder="请选择" v-model="relationTypeId">
							<h-option v-for="item in relationType" :value="item.code" :key="item.code">{{item.name}}</h-option>
						</h-select>
					</dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>操作类型：</dt>
					<dd>
						<h-select clearable placeholder="请选择"  v-model="operateId">
							<h-option v-for="item in operateList" :value="item.code" :key="item.code">{{item.name}}</h-option>
						</h-select>
					</dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>来源：</dt>
					<dd>
						<h-select v-model="sourceId" placeholder="请选择">
							<h-option v-for="item in sourceList" :value="item.code" :key="item.code">{{ item.name }}</h-option>
						</h-select>
					</dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>采用状态：</dt>
					<dd>
						<h-select clearable placeholder="请选择"  v-model="adoptState" >
							<h-option v-for="item in adoptList" :value="item.code" :key="item.code">{{item.name}}</h-option>
						</h-select>
					</dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>采用人：</dt>
					<dd>
						<h-select filterable clearable placeholder="请选择"  v-model="adopterId">
							<h-option v-for="item in adopterList" :value="item.code" :key="item.code">{{item.name}}</h-option>
						</h-select>
					</dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>用户：</dt>
					<dd>
						<h-input v-model.trim="userName" icon="android-close" placeholder="请输入" @on-click="onclickCloseUser"></h-input>
					</dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>采用日期：</dt>
					<dd>
						<h-date-picker  @on-change="handleChangeDate" :value="timeArr" format="yyyy-MM-dd" type="datetimerange" placement="bottom-end" placeholder="开始日期-结束日期" ></h-date-picker>
					</dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>提交日期：</dt>
					<dd>
						<h-date-picker  @on-change="handleChangeDateSubmit" :value="timeArrSubmit" format="yyyy-MM-dd" type="datetimerange" placement="bottom-end" placeholder="开始日期-结束日期"></h-date-picker>
					</dd>
				</dl>
			</li>
			<li class="search-wrapper-but">
				<h-button type="primary" @on-click="searchAll">查询</h-button>
				<h-button type="primary" @on-click="expotFn">导出</h-button>
				<h-button type="primary" @on-click="adoptFnBatch">批量采用</h-button>
				<h-button type="primary" @on-click="discardFnBatch">批量作废</h-button>
			</li>
		</ul>
	</search-form>
	<div class="tab-box tag-relotion-tab-box">
		<h-table class="full-max-height-table" :maxHeight="maxTableHeight" stripe size="small" border width="100%" :columns="columns" :data="labelList" :rowSelect="true"  @on-selection-change="selectChange"  @on-select-cancel="cancelSelect"></h-table>
		<h-page size="small" class="page-box" :total="total" :current="currentPage" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize"  :page-size-opts="pageSizeOpts" show-elevator show-total show-sizer placement="top"></h-page>		
		<div class="checkNum">{{'当前已选择 '+ selectIdArr.length+' 条'}}</div>		
	</div>
	<div>
		 <h-msgBox
			class-name="modalSim"
			v-model="modalAdopt"
			title="采用"
			@on-ok="adoptFn">
			<h2 class="modelTitle">是否确认采用?</h2>
			<ul class="modelCon">
				<li>要素1</li>
				<li>关系</li>
				<li>要素2</li>
			</ul>
			<ul class="modelCon">
				<li :title="adoptmodal.factorOne">{{adoptmodal.factorOne ? adoptmodal.factorOne : '--'}}</li>
				<li>{{adoptmodal.relation ? adoptmodal.relation : '--'}}</li>
				<li :title="adoptmodal.factorTwo">{{adoptmodal.factorTwo? adoptmodal.factorTwo : '--'}}</li>
			</ul>
		</h-msgBox>
		<h-msgBox
			class-name="modalSim"
			v-model="modalDiscard"
			title="作废"
			@on-ok="discardFn()">
			<h2 class="modelTitle">是否确认作废?</h2>
			<ul class="modelCon">
				<li>要素1</li>
				<li>关系</li>
				<li>要素2</li>
			</ul>
			<ul class="modelCon">
				<li :title="discardmodal.factorOne">{{discardmodal.factorOne ? discardmodal.factorOne : '--'}}</li>
				<li>{{discardmodal.relation ? discardmodal.relation : '--'}}</li>
				<li :title="discardmodal.factorTwo">{{discardmodal.factorTwo? discardmodal.factorTwo : '--'}}</li>
			</ul>
		</h-msgBox>
		<h-msgBox
			class-name="modalSimilar"
			v-model="modalSimilar"
			title="同类关系"
			width="650"
			:footerHide="footerShow">
			<div class="modelTitle">
				<ul class="modelCon">
					<li>操作类型</li>
					<li>要素1</li>
					<li>关系</li>
					<li>要素2</li>
				</ul>
				<ul class="modelCon">
					<li>{{similarModal.operationType ?similarModal.operationType : '--'}}</li>
					<li :title="similarModal.factorOne">{{similarModal.factorOne ?similarModal.factorOne : '--'}}</li>
					<li>{{similarModal.relation ? similarModal.relation : '--'}}</li>
					<li :title="similarModal.factorTwo">{{similarModal.factorTwo? similarModal.factorTwo : '--'}}</li>
				</ul>
				 <div class="tabBox">
					<h-tag>{{'共'+totalSim+'条记录'}}</h-tag>
					<h-tag>{{'已采用('+similarModalCount.usedCount+')'}}</h-tag>
					<h-tag>{{'未采用('+similarModalCount.notUsedCount+')'}}</h-tag>
					<h-tag>{{'作废('+similarModalCount.discardCount+')'}}</h-tag>
					<h-tag>{{'自身关系('+similarModalCount.selfCount+')'}}</h-tag>
					<h-tag>{{'他人关系('+similarModalCount.otherCount+')'}}</h-tag>
				</div>
			</div>
			<div class="tab-box tag-relotion-tab-box">
				<h-table stripe size="small" border :columns="columnsSim" :data="similarList"></h-table>
				<h-page size="small" class="page-box" :total="totalSim" :current="currentPageSim" :page-size="pageSizeSim" @on-change="changePageSim" show-total is-blur></h-page>
			</div>
			<h-spin fix v-if="loadingSim">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</h-spin>
		</h-msgBox>
	</div>			
</div>
</template>

<script>
import utils from '@/utils'
export default{
	data () {
		return {
			heightValue:null,
			modalAdopt: false,
			modalDiscard:false,
			modalSimilar:false,
			footerShow:true,
			pageSizeOpts:[10,20,50,100],
			total:0,
			currentPage:1,
			pageSize:10,
			totalSim:0,
			currentPageSim:1,
			pageSizeSim:5,
			loadingPage:false, 
			loadingSim:false,
			changePageflag:false,//分页标记
			selectOne:false,//单条选中标记
			labelCon:'',
			userName:'',
			operateId:'',
			relationTypeId:'',
			relationId:'',
			adoptState:'',
			sourceId:'', 
			timeArr: ['', ''],//采用日期
			timeArrSubmit: ['', ''],//提交日期
			startTime:'',
			endTime:'',
			startTimeSubmit:'',
			endTimeSubmit:'',
			adopterId:'',
			selectIdArr:[],
			selectIdArrOld:[],
			adopterList:[],
			discardIdArr:[],
			relationType:[{
				code:'1',
				name:'自身关系'
			},{
				code:'2',
				name:'他人关系'
			}],
			relationList:[],
			adoptList:[{
				code:'0',
				name:'未采用'
			},{
				code:'1',
				name:'已采用'
			},{
				code:'2',
				name:'作废'
			}],
			operateList:[{
				code:'1',
				name:'新增'
			},{
				code:'0',
				name:'删除'
			}],
			sourceList:[],		        
			adoptmodal:{},
			discardmodal:{},
			similarModal:{},
			similarModalCount:{},
			selectIdSimArr:[],
			columns: [
				{
				  type: 'selection',
				  width: 50,
				  align: 'center',
				  fixed: 'left'
				},
//	        	{
//                  title: '序号',
//                  key: 'index',
//                  align: 'center',
//                  width:60                   
//              },
				{
					title: '关系类型',
					key: 'relationType',
				},
				{
					title: '操作类型',
					key: 'operationType',
				},
				{
					title: '要素1',
					key: 'factorOne',
					width:200
				},
				{
					title: '关系',
					key: 'relation',
					width:120
				},
				{
					title: '要素2',
					key: 'factorTwo',
					width:180
				},
				{
					title: '关系细分',
					key: 'relationDetail',
					width:170
				},
				 {
					title: '来源',
					key: 'source', 
					width:150
				},
				{
					title: '采用状态',
					key: 'useStateStr',
				},
				{
					title: '采用人',
					key: 'useBy',
				},
				{
					title: '采用时间',
					key: 'useTime',
					width:130
  
				},
				{
					title: '用户',
					key: 'dingUser',
					width:110
 
				},
				{
					title: '用户企业',
					key: 'dingCorp',
					width:130

				},
				{
					title: '用户职位',
					key: 'dingPosition',
		
				},{
					title: '开探企业',
					key: 'exploreCorp',
					width:130

				},                
				{
					title: '提交时间',
					key: 'submitTime',
					fixed: 'right',
					width:130

				},                
				{
					title: '操作',
					key: 'action',
					width:120,
					fixed: 'right',
					align: 'left',
					render: (h, params) => {
						let status = params.row.status;
						return h('div', [
							h('span', {
								 class: {
									'iconfont': true,
									'icon-android-checkbox-outline':true,				                    
									'tab-icon-btn': true,
								},
								style:{
									color:params.row.adoptFlag == "0" ? '#D7DDE4' : ''
								},
								attrs:{
									title: '采用'
								},
								on: {
									click: () => {
										if(params.row.adoptFlag == "0")return
										this.modalAdopt = true
										this.adoptmodal = params.row;
									}
								}
							}),
							 h('span', {
								class: {
									'iconfont': true,
									'icon-t-b-delete': true,
									'tab-icon-btn': true,
								},
								style:{
									color:params.row.useState == 3 || params.row.useState == 0? '#D7DDE4' : ''
								},
								attrs:{
									title: '作废'
								},
								on: {
									click: () => {
										if(params.row.useState == 3 || params.row.useState == 0)return
										this.modalDiscard = true                              
										this.discardmodal = params.row; 
										
									}
								}
							}),
							h('span', {
								class: {
									'iconfont': true,
									'icon-group': true,
									'tab-icon-btn': true,
								},
								style:{
									display:params.row.similarFlag == "0"  ? 'none' : 'inline-block' //0 无同类 1有同类
								},
								attrs:{
									title: '查找同类'
								},
								on: {
									click: () => {
										this.modalSimilar = true;
										this.similarModal = params.row; 
										this.currentPageSim = 1;
										this.getSimilar();
										
									}
								}
							})
						]);
					}
				}
			],
			columnsSim:[{
				title: '序号',
				key: 'index',
				align: 'center',
				width:50
			},
			{
				title: '关系类型',
				key: 'relationType',
			},
			{
				title: '操作类型',
				key: 'operationType',
			},
			{
				title: '要素1',
				key: 'factorOne',
				width:200
			},
			{
				title: '关系',
				key: 'relation',
				width:120
			},
			{
				title: '要素2',
				key: 'factorTwo',
				width:170
			},
			{
				title: '关系细分',
				key: 'relationDetail',
				width:170
			},
			 {
				title: '来源',
				key: 'source', 
				width:150
			},
			{
				title: '采用状态',
				key: 'useStateStr',
			},
			{
				title: '采用人',
				key: 'useBy',
			},
			{
				title: '采用时间',
				key: 'useTime',
				width:130  
			},
			{
				title: '用户',
				key: 'dingUser',
				width:110
	 
			},
			{
				title: '用户企业',
				key: 'dingCorp',
				width:130	
			},
			{
				title: '用户职位',
				key: 'dingPosition',	    
			},
			{
				title: '提交时间',
				key: 'submitTime',
				width:130	
			}],
			similarList:[],
			labelList:[]
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods:{
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
				this.labelList.forEach((item,i)=>{
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
		changePage(current){
			this.currentPage = current;
			this.changePageflag = true;
			this.getUserLabelList();
		},
		changePageSize(size){
			this.pageSize = size;
			this.changePageflag = true;
			this.getUserLabelList();
		},
		changePageSim(current){
			this.currentPageSim = current;
			this.getSimilar();
		},
		onclickClose() {
			this.labelCon = '';
	   },
	   onclickCloseUser(){
			this.userName = '';
	   },
		handleChangeDate(date){
			this.startTime = this.subDateStr(date[0]);
			this.endTime = this.subDateStr(date[1]);
		},
		handleChangeDateSubmit(date){
			this.startTimeSubmit = this.subDateStr(date[0]);
			this.endTimeSubmit = this.subDateStr(date[1]);
		},
		searchAll(){
			this.currentPage = 1;
			this.changePageflag = false;
			this.getUserLabelList();
		},
		expotFn(){
			let url ='/tm/userchain/export';
			let postData = {					 
			  "ids":this.selectIdArr,
			  "dealTimeBegin": this.startTime,
			  "dealTimeEnd": this.endTime,
			  "operationType":this.operateId,
			  "relation": this.relationId,
			  "relationType":this.relationTypeId,
			  "searchKey": this.labelCon,
			  "source": this.sourceId,
			  "submitTimeBegin":this.startTimeSubmit,
			  "submitTimeEnd": this.endTimeSubmit,
			  "useBy": this.adopterId,
			  "useState": this.adoptState,
			  "userSearch":this.userName	 
			};
			utils.exportDataFn(postData,url,(downId)=>{
				if(downId){
					window.location.href='/tm/userchain/download?key='+downId;
				}
			})
		},
		subDateStr(dateStr){
			dateStr = dateStr.substring(0,4) + dateStr.substring(5,7) + dateStr.substring(8,10)
			return dateStr
		},
		adoptFnBatch(){   
			if(this.selectIdArr.length == 0){
				this.$hMessage.info('请选择要采用的记录');
				return
			}
			this.$hMsgBox.confirm({
				title:'批量采用',
				content:'共'+ this.selectIdArr.length +'条记录，是否确认采用?',
				onOk:()=>{
					let url = '/tm/userchain/adopt';
					this.$http.post(url,this.selectIdArr).then((res) => {
						let data = res.data;
						if(data.status == this.$api.SUCCESS){
							this.$hMessage.info('批量采用成功');
							this.currentPage = 1;
							this.getUserLabelList();		                
						}else{
							this.$hMessage.error({content: data.msg})
						}
					})
					.catch(err=>{
						this.$hLoading.error()
					})
				},
				onCancel:()=>{
					 
				},
			})	   		
		},  
		discardFnBatch(){
			if(this.selectIdArr.length == 0){
				this.$hMessage.info('请选择要废弃的记录');
				return
			}
			this.$hMsgBox.confirm({
				title:'批量作废',
				content:'共'+ this.selectIdArr.length +'条记录，是否确认作废?',
				onOk:()=>{
					let url = '/tm/userchain/discard';
					this.$http.post(url,this.selectIdArr).then((res) => {
						let data = res.data;
						if(data.status == this.$api.SUCCESS){
							this.$hMessage.info('批量作废成功');
							this.currentPage = 1;
							this.getUserLabelList();		                	  
						}else{
							this.$hMessage.error({content: data.msg})
						}
					})
					.catch(err=>{
						this.$hLoading.error()
					})
				},
				onCancel:()=>{
					 
				},
			})	   	
		},  
		adoptFn(){
			let url = '/tm/userchain/'+this.adoptmodal.id+'/adopt/';
			this.$http.post(url).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){
					  this.$hMessage.info('采用成功');
					  this.currentPage = 1;
					  this.getUserLabelList();
				}else{
					this.$hMessage.error({content: data.msg})
				}
			})
			.catch(err=>{
				this.$hLoading.error()
			})
		},
		discardFn(){
			let url = '/tm/userchain/'+this.discardmodal.id+'/discard/';
			this.$http.post(url).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){
					  this.$hMessage.info('废弃成功');
					  this.currentPage = 1;
					  this.getUserLabelList();
				}else{
					this.$hMessage.error({content: data.msg})
				}
			})
			.catch(err=>{
				this.$hLoading.error()
			})
		},
		getSimilar(){    
			this.loadingSim = true;
			let url = '/tm/userchain/similar/search?id='+this.similarModal.id+'&pageNum='+this.currentPageSim+'&limit='+this.pageSizeSim;    		
			this.$http.get(url).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){
					 let similarList = data.data.list || [];
					 this.totalSim = data.data.total || '';
					 similarList.forEach((item,index)=>{
						return item.index = (this.currentPageSim-1) * this.pageSizeSim + index + 1;					     
					})
					 this.similarList = similarList;
					 this.getSimilarCountInfo();
				}else{
					this.$hMessage.error({content: data.msg})
				}
			})
			.catch(err=>{
				this.$hLoading.error();
				this.loadingSim = false;
			})
		},
		getSimilarCountInfo(){   		
			let url = '/tm//userchain/similar/stat?id='+this.similarModal.id;    		
			this.$http.get(url).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){
					 this.similarModalCount = data.data || {};
				}else{
					this.$hMessage.error({content: data.msg})
				}
				this.loadingSim = false;
			})           	
			.catch(err=>{
				this.loadingSim = false;
				this.$hLoading.error()
			})
		},
		getAdopterList(){
			let url = '/tm/userchain/useby'
			this.$http.get(url).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){
					this.adopterList = data.data || [];
				}else{
					this.$hMessage.error({content: data.msg})
				}
			})
			.catch(err=>{
				this.$hLoading.error()
			})
		},
		getSourceList(){
			let url = '/tm/userchain/source'
			this.$http.get(url).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){
					this.sourceList = data.data || [];
				}else{
					this.$hMessage.error({content: data.msg})
				}
			})
			.catch(err=>{
				this.$hLoading.error()
			})
		},
		getRelationList(){			
			let url = '/tm/userchain/relation'
			this.$http.get(url).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){
					this.relationList = data.data || [];
				}else{
					this.$hMessage.error({content: data.msg})
				}
			})
			.catch(err=>{
				this.$hLoading.error();
			})
		},
		getUserLabelList(){
			this.loadingPage = true
			let url = '/tm/userchain/search?pageNum='+this.currentPage+'&limit='+this.pageSize;
			this.$http.get(url,{params:{
				relationType:this.relationTypeId,
				relation:this.relationId,
				operationType:this.operateId,
				source:this.sourceId,
				useState:this.adoptState,
				useBy:this.adopterId,
				dealTimeBegin:this.startTime,
				dealTimeEnd:this.endTime,
				dealTimeBegin:this.startTime,
				dealTimeEnd:this.endTime,
				submitTimeBegin:this.startTimeSubmit,
				submitTimeEnd:this.endTimeSubmit,
				searchKey:this.labelCon,
				userSearch:this.userName
			}}).then((res) => {
				let data = res.data || {} ;
				if(data.status == this.$api.SUCCESS){
					let labelList = data.data.list || [];
					this.total = data.data.total || 0;
					this.heightValue = labelList.length >=10 ? 360 : null;                	
					this.labelList = labelList;
					if(this.changePageflag){
						labelList.forEach((item,i)=>{
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
				this.getAdopterList();
				this.loadingPage = false;
							  
			})
			.catch(err=>{
				this.loadingPage = false;
				this.selectIdArr = [];
				this.$hLoading.error()
			})
		},

	},
	mounted(){
		this.getSourceList();
		this.getRelationList();		
		this.getUserLabelList();
	}
}
</script>
<style>

.modalSim .h-modal-content{
	width: 620px!important;
}
.modalSimilar .h-modal-content{
	width: 720px!important;
}
.modalSim .h-modal-body {
	padding: 16px 32px 16px 32px;
}
.modalSimilar .h-modal-body {
	padding: 16px 32px 16px 32px;
}


.select-box-wrap .h-btn{
	padding: 6px;
}
</style>
<style scoped>
.task-list-wrap{
	position: relative;
}
.select-box-wrap{
	margin:10px 0;	
}
.select-box{
	display: inline-block;
	margin-right: 10px;
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
.tag-relotion-tab-box>>>>>> .h-editgird-fixed-header .cur-th th{
	background: #f0f3f5;
}
.tag-relotion-tab-box>>>>>> .h-editgird-small th{
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