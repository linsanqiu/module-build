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
						<dt>高亮词：</dt>
						<dd><h-input v-model="searchData.keyWord" icon="android-close" @on-enter="searchAll()"  @on-click="shitClearableClick('keyWord','searchData')" placeholder="请输入高亮词"></h-input></dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>类别：</dt>
						<dd>
							<h-select clearable placeholder="请选择" filterable v-model="searchData.category"  @on-change="handleChangeType">
								<h-option v-for="item in categoryList" :value="item.dictEntry" :key="item.dictEntry">{{item.entryName}}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>创建人：</dt>
						<dd>
							<h-select clearable placeholder="请选择" filterable v-model="searchData.creatorId">
						    	<h-option v-for="item in creatorList" :value="item.id" :key="item.id">{{item.realName}}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>创建时间：</dt>
						<dd>
							<h-date-picker placement="bottom-end"  type="daterange" format="yyyy-MM-dd" placeholder="开始日期-结束日期" :value="updateDateRange" @on-change="onChangeModDateRangePicker"></h-date-picker>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" v-if="activeRoutersButton.indexOf('highlightSearch') != -1" @click="searchAll">查询</h-button>
					<h-button type="primary" v-if="activeRoutersButton.indexOf('highlightAdd') != -1" @click="showAdd">新建</h-button>
					<h-button v-if="activeRoutersButton.indexOf('highlightExport') != -1" type="primary" @click="exportFn">导出</h-button>
					<h-button type="primary" v-if="activeRoutersButton.indexOf('highlightDelBatch') != -1" @click="delBatch">批量删除</h-button>
				</li>
			</ul>
		</search-form>
		<div class="tab-box tag-sensitive-box">					
			<h-table
				class="full-max-height-table"
				:maxHeight="maxTableHeight"
				stripe				 
				:columns="commonTableCols"
				:data="commonTableDatas"
				size="small"
				@on-selection-change="selectChange"
				@on-select-cancel="cancelSelect"
				border>
			</h-table>
			<h-page  highlight-row size="small" show-elevator	show-total show-sizer   placement="top" class="page-box"  :page-size-opts="pageSizeOpts" :total="total" :current="pagination.current" :page-size="pagination.size" @on-change="onPageChange" @on-page-size-change="onPageSizeChange"></h-page>		
			<div class="checkNum">{{'当前已选择 '+ selectIdArr.length+' 条'}}</div>
		</div>
		<h-msgBox
			:isOkLeft="true"
	        v-model="modalShow"
	        :title="addModalShowTitle"
	        :footerHide="true">   
	        <h-form ref="formInline" :rules="ruleInline" :model="modalData" :label-width="100">	
		        	<div>
		        		<h-form-item style="display:inline-block" prop="category" label="类别：">		        	 
							<h-select style="width:150px" clearable placeholder="请选择类别"  v-model="modalData.category">
						        <h-option v-for="item in categoryList" :value="item.dictEntry" :key="item.dictEntry">{{item.entryName}}</h-option>
						   </h-select>					 
						</h-form-item>
						<h-form-item style="display:inline-block" prop="highlightColor" label="默认颜色：">
							 <input disabled type="color" v-model="modalData.highlightColor" value="#66FFFF"/>
						</h-form-item>
		        	</div>
					<h-form-item prop="highlightWord" label="高亮词：">
						<h-input class="highlightWords" type="textarea" style="width:300px;" v-model.trim="modalData.highlightWord" placeholder="请输入高亮词"></h-input>
					</h-form-item>	
					<div v-if="addModalShowTitle == '新增'" style="color: red;text-align: center;margin-bottom: 10px;">
						提示：如需录入多个高亮词，则需英文逗号隔开
					</div>
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
					keyWord:'',
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
					highlightWord:'',
					highlightColor:'#66FFFF'
				},
				ruleInline: {
					highlightWord:[
		                { required: true, message: '高亮词不能为空', trigger: 'change' }
		            ],
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
				commonTableCols:[
					{
						type: "selection",
						width: 60,
						align: "center",
						fixed: "center",
					},
					{
						key: "highlightWord",
						title: "高亮词",
						align: "left"
					},{
						key: "categoryDesc",
						title: "类别",
						width: 120,
						align: "left"
					},{
						key: "highlightColor",
						title: "高亮颜色",
						width: 100,
						align: "left"
					},{
						key: "creator",
						title: "创建人",
						width: 150,
						align: "left"
					},{
						key: "createTime",
						title: "创建时间",
						width: 150,
						align: "left"
					},{
						key: "updater",
						title: "修改人",
						width: 150,
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
	                    	if(this.activeRoutersButton.indexOf('highlightModify') != -1){
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
	                                    	let {category,highlightWord,id} = params.row; 
	               							this.modalData.highlightWord = highlightWord;	
	               							this.modalData.category =  category.toString();
	               							this.modalData.id =  id;
	                                     	this.addModalShowTitle = '修改';																					
	                                    }
	                                }
	                            }
	                    	};
	                    	if(this.activeRoutersButton.indexOf('highlightDel') != -1){
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
												title:'删除高亮词',
												content:'确定要删除高亮词：'+params.row.highlightWord +'?',
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
			/**获取高亮词列表**/
			getHighlightList(){
				this.tableLoading = true;
				let url = '/tm/getHighlightWords';
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
	    		let url = '/tm/news/handleuserlist'   		
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
	            }).catch(err=>{
	                this.$hLoading.error();
	            })
			},	
			shitClearableClick(type = '',dataobj='') {
				this[dataobj][type] = '';
			},
			onPageChange (current) {
				this.changePageflag = true;
				this.pagination.current = current;
				this.getHighlightList();
			},
			onPageSizeChange (size) {
				this.changePageflag = true;
				this.pagination.size = size;
				this.getHighlightList();
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
			/**批量删除高亮词列表**/
			handleDeleteBatch(){
				if(this.selectIdArr.length == 0){
	    			this.$hMessage.warning('请选择要删除的高亮词');
	    			return
	    		}
	    		this.$hMsgBox.confirm({
	    			isOkLeft:true,
					title:'批量删除',
					content:'共'+ this.selectIdArr.length +'条高亮词，是否确认删除?',
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
				let url = '/tm/removeBatchHighlightWords';
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
				this.addModalShowTitle = '新增';
				this.$refs['formInline'].resetFields();//重置表单状态
				this.modalData.highlightWord = '';
				this.modalData.category = '';
				this.modalShow = true;
			},
			/*改变下拉选项*/
			handleChangeType(){
				this.otherParams.category = this.searchData.category;
			},
			/*导出*/
			exportFn(){
				let url = '/tm/exportHighlightWordInfo';
				let postData = {...this.searchData};
				postData.ids = 	this.selectIdArr;
				utils.exportDataFn(postData,url,(res)=>{
					if(res){
						utils.commonDownLoad(res,'高亮词-'+ utils.getToday());
					}
				});	
			},
			/*添加/编辑保存*/
			handleSaveFn(){
				if(!this.modalShow)return
				this.$refs['formInline'].validate((valid) => {
				 	if (valid) {
						let url = '/tm/saveBatchHighlightWord';	
						let saveInfo = {};
						if(this.addModalShowTitle == '修改'){
							saveInfo = {...this.modalData};	
							url = '/tm/modifyHighlightWordInfoById';								
						}else{	
							saveInfo.category = this.modalData.category;
							saveInfo.highlightWords = this.modalData.highlightWord.split(",");
							saveInfo.highlightColor = this.modalData.highlightColor;
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
				this.getHighlightList();				
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
			this.getSelectOption('categoryList',1014);
			this.getHighlightList();
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
}

</style>