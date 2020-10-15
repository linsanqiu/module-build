<template>
	<div class="sensitiveBox">
		<h-spin fix v-if="tableLoading">
			<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
		</h-spin>
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>类别：</dt>
						<dd>
							<h-select clearable placeholder="请选择" v-model="searchData.category"  @on-change="handleChangeType">
							<h-option v-for="item in sensitiveCategoryList" :value="item.dictEntry" :key="item.dictEntry">{{item.entryName}}</h-option>
						</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>名称：</dt>
						<dd>
							<h-input v-model="searchData.sensitiveWord" icon="android-close" @on-enter="searchAll"  @on-click="shitClearableClick('sensitiveWord','searchData')" placeholder="请输入敏感词名称"></h-input>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" v-if="activeRoutersButton.indexOf('SensitiveSearch') != -1" @click="searchAll">查询</h-button>
					<h-button type="primary" v-if="activeRoutersButton.indexOf('SensitiveAdd') != -1" @click="showAdd">添加敏感词</h-button>
					<h-button type="primary" v-if="activeRoutersButton.indexOf('SensitiveDelBatch') != -1" @click="delBatch">批量删除</h-button>
					<h-upload
						v-if="activeRoutersButton.indexOf('SensitiveImport') != -1"
						style="display: inline-block;"
						ref="upload"
						action="/tm/uploadSensitiveWordExcel"
						name = 'file'
						:data = "otherParams"
						:show-upload-list="false"
						:on-success="handleSuccess"
						:on-error="handleError"	
						:on-format-error="handleFormatError"
						:format="['xlsx','xls']"
					>
						<h-button  type="primary" @click='handleUploadFn' icon="ios-cloud-upload-outline">导入</h-button>
					</h-upload>
					<h-button v-if="activeRoutersButton.indexOf('SensitiveExport') != -1" type="primary" @click="exportFn">导出</h-button>
				</li>
			</ul>
		</search-form>
		<div class="tab-box tag-sensitive-box">					
			<h-table
				:maxHeight="maxTableHeight"
				class="full-max-height-table"
				size="small"
				stripe				 
				:columns="commonTableCols"
				:data="commonTableDatas"
				@on-selection-change="selectChange"
				@on-select-cancel="cancelSelect"
				border>
			</h-table>
			<h-page  highlight-row size="small" show-elevator	show-total show-sizer   placement="top" class="page-box"  :page-size-opts="pageSizeOpts" :total="total" :current="pagination.current" :page-size="pagination.size" @on-change="onPageChange" @on-page-size-change="onPageSizeChange"></h-page>		
			<div class="checkNum">{{'当前已选择 '+ selectIdArr.length+' 条'}}</div>
		</div>
		<h-msgBox
			v-model="modalShow"
			:title="addModalShowTitle"
			:footerHide="true">   
				<h-form ref="formInline" :rules="ruleInline" :model="modalData" :label-width="100">		     
							<h-form-item prop="category" label="类别：">		        	 
						<h-select style="width:300px" clearable placeholder="请选择"   v-model="modalData.category">
									<h-option v-for="item in sensitiveCategoryList" :value="item.dictEntry" :key="item.dictEntry">{{item.entryName}}</h-option>
						 </h-select>					 
					</h-form-item>
					<h-form-item prop="type" label="敏感词类型：">
						<h-select style="width:300px" clearable placeholder="请选择"  v-model="modalData.type">
									<h-option v-for="item in sensitiveTypeList" :value="item.dictEntry" :key="item.dictEntry">{{item.entryName}}</h-option>
						 </h-select>
					</h-form-item>
					<h-form-item prop="sensitiveWord" label="敏感词名称：">
						<h-input style="width:300px"   v-model.trim="modalData.sensitiveWord" icon="android-close" @on-click="shitClearableClick('sensitiveWord','modalData')"  placeholder="请输入敏感词名称"></h-input>
					</h-form-item>			 
				</h-form>
				<div class="footerBox">
					<h-button @click="modalShow = false">取消</h-button>
					<h-button style="margin-left: 10px" type="info" @click="handleSaveFn">确定</h-button>	            
				</div>
		</h-msgBox>
	</div>
</template>

<script>
	import utils from "@/utils/index";
	export default{
		data(){
			return{
				heightValue:null,//表格高度
				modalShow:false,//添加/编辑modal看
				addModalShowTitle:'',//添加/编辑表头显示文字
				changePageflag:false,
				selectIdArr:[],
				activeRoutersButton : this.$store.state.activeRoutersButton,//控制按钮权限
				tableLoading:false,
				sensitiveCategoryList:[],
				sensitiveTypeList:[],
				commonTableDatas:[],
				searchData:{
					sensitiveWord:'',
					category :'1',
				},
				otherParams:{
					category :'1',
				},
				modalData:{
					sensitiveWord:'',
					category:'',
					type:'',
					id:''
				},
				ruleInline: {
					sensitiveWord:[
										{ required: true, message: '敏感词名称不能为空', trigger: 'change' }
								],
							category:[
										{ required: true, message: '类别不能为空', trigger: 'change' }
								],
								type:[
										{ required: true, message: '敏感词类型不能为空', trigger: 'change' }
								]		            
						},
				pagination:{
					current:1,
					size:10,
				},
				total:0,
				pageSizeOpts:[10,20,50,100],
				fileShow:false,
				uploadMsg: false,
				commonTableCols:[
					{
						type: "selection",
						width: 60,
						align: "center",
						fixed: "center",
					},
					{
						key: "sensitiveWord",
						title: "敏感词",
						align: "left"
					},{
						key: "typeDesc",
						title: "敏感词类型",
						width: 120,
						align: "left"
					},{
						key: "createTime",
						title: "创建时间",
						width: 150,
						align: "left"
					},{
						key: "creator",
						title: "创建人",
						width: 150,
						align: "left"
					},{
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
												if(this.activeRoutersButton.indexOf('SensitiveModify') != -1){
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
																				this.modalShow = true;
																				this.$refs['formInline'].resetFields();
																				let {type,category,sensitiveWord,id} = params.row;  
																				this.modalData.id = id;
															this.modalData.sensitiveWord = sensitiveWord;
															this.modalData.type =  type.toString();
															this.modalData.category =  category.toString();
																				this.addModalShowTitle = '修改';
																					
																			}
																	}
															}
												};
												if(this.activeRoutersButton.indexOf('SensitiveDel') != -1){
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
												title:'删除敏感词',
												content:'确定要删除敏感词：'+params.row.sensitiveWord +'?',
												onOk:()=>{
													let idArr = params.row.id.toString().split();													
													this.handleDelete(idArr);
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
		methods:{
			/**获取敏感词列表**/
			getSensitiveList(){
				this.tableLoading = true;
				let url = '/tm/getSensitiveWords';
							this.$http.post(url,{...this.searchData,...this.pagination}).then((res) => {
								let data = res.data;
									if(data.status == this.$api.SUCCESS){
										this.commonTableDatas = data.body.records || [];
										this.total = data.body.total; 
										this.heightValue = this.commonTableDatas.length > 10 ? 350 : null;
										if(this.changePageflag){
											this.commonTableDatas.forEach((item,i)=>{
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
			shitClearableClick(type = '',dataobj='') {
				this[dataobj][type] = '';
			},
			onPageChange (current) {
				this.changePageflag = true;
				this.pagination.current = current;
				this.getSensitiveList();
			},
			onPageSizeChange (size) {
				this.changePageflag = true;
				this.pagination.size = size;
				this.getSensitiveList();
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
			/**批量删除资讯列表**/
			handleDeleteBatch(){
				if(this.selectIdArr.length == 0){
						this.$hMessage.warning('请选择要删除的敏感词');
						return
					}
					this.$hMsgBox.confirm({
					title:'批量删除',
					content:'共'+ this.selectIdArr.length +'条敏感词，是否确认删除?',
					onOk:()=>{
						this.handleDelete(this.selectIdArr);
					},
					onCancel:()=>{
						 
					},
				})	   	
			},
			delBatch(){
				if(this.selectIdArr.length == 0){
						this.$hMessage.info('请选择要删除的记录');
						return
					}
				this.$hMsgBox.confirm({
					title:'批量删除',
					content:'共'+ this.selectIdArr.length +'条记录，是否确认删除?',
					onOk:()=>{
						this.handleDelete(this.selectIdArr)
					},
					onCancel:()=>{
						 
					},
				})	   	
			},
			handleDelete(idArr){
				let delStatus = false;
				if(delStatus)return
				let url = '/tm/removeBatchSensitiveWords';
							this.$http.post(url,idArr).then((res) => {
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
			showAdd(){
				this.addModalShowTitle = '新增敏感词';
				this.$refs['formInline'].resetFields();//重置表单状态
				this.modalData = {
					sensitiveWord:'',
					category :this.searchData.category,
					type:'',
					id:''
				};
				this.modalShow = true;
			},
			/*改变下拉选项*/
			handleChangeType(){
				this.otherParams.category = this.searchData.category;
			},
			/*导出*/
			exportFn(){
				let url = '/tm/exportSensitiveWordInfo';
				let postData = {...this.searchData};
				postData.ids = 	this.selectIdArr;
				utils.exportDataFn(postData,url,(res)=>{
					if(res){
						utils.commonDownLoad(res,'敏感词-'+ utils.getToday());
					}
				});
			},
			/*添加/编辑保存*/
			handleSaveFn(){
				if(!this.modalShow)return
				this.$refs['formInline'].validate((valid) => {
					if (valid) {
						let url = '/tm/addSensitiveWord';
						if(this.addModalShowTitle == '修改'){
							url = '/tm/modifySensitiveWordInfo';					 
						}; 
									this.$http.post(url,this.modalData).then((res) => {
											let data = res.data ? res.data : {};
											if(data.status == this.$api.SUCCESS){
												this.$hMessage.info({
															content: this.addModalShowTitle+'成功',
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
				this.getSensitiveList();				
			},
						handleUploadFn(){
							this.uploadMsg = true;
							 this.$refs.upload.clearFiles();
						},
						handleBeforeUpload(file){
							this.fileShow = file;
								return false;
						},
						handleSuccess(response, file, fileList){
							if(response.status == this.$api.SUCCESS){
								this.$hMessage.info({
											content: '导入成功',
											duration: 3
									}); 
									this.uploadMsg = false;
									this.searchAll();
							}else{
								this.$hMessage.error({
											content:response.msg,
											duration: 3
									})
							}
							 

						},
						handleError(error, file, fileList){
							this.$hMessage.error({
											content:'上传失败',
											duration: 3
									})
						},
						handleFormatError (file) {
						this.$hNotice.warning({
								title: '文件格式不正确',
								desc: '文件 格式不正确，xlsx/xls格式的文件'
						});
				},
		},
		mounted(){
			this.getSelectOption('sensitiveCategoryList',1013);
			this.getSelectOption('sensitiveTypeList',1012);
			this.getSensitiveList();
		}
		
	}
</script>

<style>
.filtrate-btn .h-btn{
	margin-right: 10px;
}
/*.tag-sensitive-box .h-page-options-sizer{
	position: relative;
	top: 4px;
}*/
.tag-sensitive-box .h-table-fixed-right-patch{
	width: 0!important;
}
.tag-sensitive-box .h-table table tr{
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
.tag-sensitive-box{
	position: relative;
}
.sensitiveBox{
	position: relative;
}
/*.modalForm li span{
	width: 80px;
	display: inline-block;
	text-align: right;
}*/
.footerBox{
	text-align: center;
}

</style>