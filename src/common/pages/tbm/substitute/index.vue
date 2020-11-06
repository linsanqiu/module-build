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
						<dt>被替换词：</dt>
						<dd><h-input v-model="searchData.replacedWord" icon="android-close" @on-enter="searchAll()"  @on-click="shitClearableClick('replacedWord','searchData')" placeholder="请输入关键词"></h-input></dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>类别：</dt>
						<dd>
							<h-select clearable placeholder="请选择" v-model="searchData.category"  @on-change="handleChangeType">
								<h-option v-for="item in categoryList" :value="item.dictEntry" :key="item.dictEntry">{{item.entryName}}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>创建人：</dt>
						<dd>
							<h-select clearable placeholder="请选择" filterable clearable  v-model="searchData.creatorId">
								<h-option v-for="item in creatorList" :value="item.id" :key="item.id">{{item.realName}}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>创建时间：</dt>
						<dd>
							<h-date-picker  placement="bottom-end"   type="daterange" format="yyyy-MM-dd" placeholder="开始日期-结束日期" :value="updateDateRange" @on-change="onChangeModDateRangePicker"></h-date-picker>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" v-if="activeRoutersButton.indexOf('substituteSearch') != -1" @click="searchAll">查询</h-button>
					<h-button type="primary" v-if="activeRoutersButton.indexOf('substituteAdd') != -1" @click="showAdd">新建</h-button>
					<h-button v-if="activeRoutersButton.indexOf('substituteExport') != -1" type="primary" @click="exportFn">导出</h-button>
					<h-button type="primary" v-if="activeRoutersButton.indexOf('substituteDelBatch') != -1" @click="delBatch">批量删除</h-button>
				</li>
			</ul>
		</search-form>
		<div class="tab-box tag-sensitive-box">					
			<h-table
				class="full-max-height-table"
				size="small"
				:maxHeight="maxTableHeight"
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
			:isOkLeft="true"
			:mask-closable = "false"
			v-model="modalShow"
			:title="addModalShowTitle"
			:footerHide="true">   
			<h-form ref="formInline" :rules="ruleInline" :model="modalData" :label-width="100">	
					<div>
						<h-form-item style="display:inline-block;" prop="category" label="类别：">		        	 
							<h-select style="width:150px" clearable placeholder="请选择类别" v-model="modalData.category">
								<h-option v-for="item in categoryList" :value="item.dictEntry" :key="item.dictEntry">{{item.entryName}}</h-option>
						   </h-select>					 
						</h-form-item>
						<h-form-item style="display:inline-block;" prop="highlightColor" label="默认颜色：">
							 <input disabled type="color" v-model="modalData.highlightColor" value="#ff9999"/>
						</h-form-item>
					</div>
					 <div>
						 <h-edit-gird ref="editGird"  :columns="columnsEdit" :data="dataEdit" size="small" :disabled-hover="true" :showEditInput="true"></h-edit-gird>
					 </div>
					 <div v-if="addModalShowTitle == '新增'" class="addRows" title="添加新行" ><span @click="addNewRows"><h-icon name="android-add" size="18"></h-icon></span></div>
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
				updateDateRange: ['', ''],
				heightValue:null,//表格高度
				modalShow:false,//添加/编辑modal看
				addModalShowTitle:'',//添加/编辑表头显示文字
				changePageflag:false,
				selectIdArr:[],
				activeRoutersButton : this.$store.state.activeRoutersButton,//控制按钮权限
				tableLoading:false,
				categoryList:[],
				creatorList:[],
				commonTableDatas:[],
				searchData:{
					replacedWord:'',
					category:'',
					creatorId:'',
					startTime:'',
					endTime:''
				},
				otherParams:{
					category :'1',
				},
				modalData:{
					category:'',
					highlightColor:'#ff9999',
					replacedWord:'',
					replacementWord:'',
					updaterId:''
				},
				ruleInline: {
					category:[
						{ required: true, message: '类别不能为空', trigger: 'change' }
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
				columnsEdit: [{
						type: 'text',
						title: '被替换词',
						key: 'replacedWord',
						rule: { required:true, message: '被替换词不能为空'},
					},
					{
						type: 'text',
						title: '替换词',
						key: 'replacementWord',
						rule: { required:false},
					}
				],
				dataEdit:[],
				options1: [], 
				commonTableCols:[
					{
						type: "selection",
						width: 60,
						align: "center",
						fixed: "center",
					},
					{
						key: "replacedWord",
						title: "被替换词",
						align: "left",
						width: 200,
					},{
						key: "replacementWord",
						title: "替换词",
						align: "left"
					},{
						key: "categoryDesc",
						title: "类别",
						width: 80,
						align: "left"
					},{
						key: "highlightColor",
						title: "高亮颜色",
						width: 90,
						align: "left"
					},{
						key: "creator",
						title: "创建人",
						width: 120,
						align: "left"
					},{
						key: "createTime",
						title: "创建时间",
						width: 150,
						align: "left"
					},{
						key: "updater",
						title: "修改人",
						width: 120,
						align: "left"
					},{
						key: "updateTime",
						title: "修改时间",
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
							if(this.activeRoutersButton.indexOf('substituteModify') != -1){
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
											this.columnsEdit.forEach((item,i)=>{
												if(item.key == 'replacedWord'){
													item.rule.required = true;
												}												
											});
											this.modalShow = true;
											this.$refs['formInline'].resetFields();
											let {replacedWord,replacementWord,id,category,updaterId} = params.row; 
											this.dataEdit = [{replacedWord:replacedWord,replacementWord:replacementWord}];	       
											this.modalData.category =  category.toString();
											this.modalData.id =  id;
											this.modalData.updaterId = updaterId;
											this.addModalShowTitle = '修改';																					
										}
									}
								}
							};
							if(this.activeRoutersButton.indexOf('substituteDel') != -1){
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
												title:'删除替换词',
												content:'确定要删除替换词：'+params.row.replacedWord +'?',
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
			onChangeModDateRangePicker(values){
				this.updateDateRange = values;
				this.searchData.startTime= values[0];
				this.searchData.endTime = values[1];
			},
			/**获取替换词列表**/
			getSubstituteList(){
				this.tableLoading = true;
				let url = '/tm/getReplacementWords';
				this.$http.post(url,{...this.searchData,...this.pagination}).then((res) => {
					let data = res.data;
					if(data.status == this.$api.SUCCESS){
						this.commonTableDatas = data.body.records || [];
						this.total = data.body.total; 
						this.heightValue = this.commonTableDatas.length >=10 ? 358 : null;
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
			//获取创建人员列表
			getCreateUser(){
				let url = '/tm/news/getalluers'   		
				this.$http.get(url).then((res) => {
					let data = res.data;
					if(data.status == this.$api.SUCCESS){
						this.creatorList = data.data || [];
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
				this.getSubstituteList();
			},
			onPageSizeChange (size) {
				this.changePageflag = true;
				this.pagination.size = size;
				this.getSubstituteList();
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
			delBatch(){
				if(this.selectIdArr.length == 0){
					this.$hMessage.info('请选择要删除的记录');
					return
				}
				this.$hMsgBox.confirm({
					isOkLeft:true,
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
				let url = '/tm/removeBatchReplacementWords';
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
				this.columnsEdit.forEach((item,i)=>{
					item.rule.required = false;
				});
				this.addModalShowTitle = '新增';
				this.$refs['formInline'].resetFields();//重置表单状态
				this.modalData = {
					category:'',
					highlightColor:'#ff9999'
				};
				this.dataEdit = [{replacedWord:'',replacementWord:''}];
				this.modalShow = true;
			},
			/*改变下拉选项*/
			handleChangeType(){
				this.otherParams.category = this.searchData.category;
			},
			/*导出*/
			exportFn(){
				let url = '/tm/exportReplacementWordInfo';
				let postData = {...this.searchData};
				postData.ids = 	this.selectIdArr;
				utils.exportDataFn(postData,url,(res)=>{
					if(res){
						utils.commonDownLoad(res,'替换词-'+ utils.getToday());
					}
				});
			},
			/*新增-添加新行*/
			addNewRows(){
				
				if( this.dataEdit.length >= 5){
					this.$hMessage.warning({
						content: '最多只能添加5行哦~',
						duration: 3
					}); 
					return
				}
				let dataEdit = this.$refs.editGird.cloneData;
				dataEdit.push({replacedWord:'',replacementWord:''});
				this.dataEdit = [...dataEdit];
			},
			/*添加/编辑保存*/
			handleSaveFn(){
				if(!this.modalShow)return
				this.$refs['formInline'].validate((valid) => {
					if (valid) {
						let url = '/tm/saveBatchReplacementWord';
						let saveInfo = {...this.modalData};
						let dataEdit = this.$refs.editGird.cloneData ;
						if(this.addModalShowTitle == '修改'){
							url = '/tm/modifyReplacementWordInfoById';								
							saveInfo.replacedWord =  dataEdit[0].replacedWord;
							saveInfo.replacementWord = dataEdit[0].replacementWord;
							if(!saveInfo.replacedWord.trim()){
								return
							}
						}else{
							//新增
							let newArr = [];
							let testFlag = true;
							dataEdit.forEach((item,i)=>{
								if(!item.replacedWord.trim()){
									this.$hMessage.warning({
										content: '被替换词不能为空！',
										duration: 3
									}); 
									testFlag = false;
									return
								}else{
									newArr.push(item);
								}
							});
							if(testFlag){
								saveInfo.words = newArr;
							}else{
								return
							}
							
						};						
						this.$http.post(url,saveInfo).then((res) => {
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
				this.getSubstituteList();				
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
			this.getCreateUser();
			this.getSelectOption('categoryList',1015);
			this.getSubstituteList();
		}
		
	}
</script>

<style>
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
.highlightWords .h-input{
	resize: none;
	height: 100px;
}
</style>
<style scoped>
.filtrate-head{
	padding: 10px 0;
}
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
	margin-top:20px;
}
.addRows{
	text-align: center;
	cursor: pointer;
	color: #0076CB;
}
</style>