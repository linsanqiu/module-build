<template>
	<div class="api">
		<div class="tree">
			<div class="title">API模块</div>
			<div class="nav content-wrapper">	
				<vue-scroll :ops="ops">		
					<div class="apiTree">	
						<ul>
							<li>
								<span :class="activeID ? '' : 'active' " @click="getApiLists()">全部<i class="add" v-if="activeRoutersButton.indexOf('addModule') != -1"><i class="iconfont icon-add" title="新增" @click.stop="addModuleClick"></i></i></span>
							</li>
							<li class="" v-for="(item,key) in modulesTree">
								<i class="tree-icon"></i>
								<span :class="activeID == item.id ? 'active' : '' " @click="getApiLists(item.id)">
									{{ item.moduleName }}
									<i v-if="activeRoutersButton.indexOf('modifyModule') != -1"  class="iconfont icon-t-b-message" title="修改" @click.stop="modifyModule(item,key)"></i>
								</span>
							</li>
						</ul>
					</div>			
				</vue-scroll>
				<h-spin fix v-if="moduleLoading">
				 	<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
		       		<div>加载中...</div>
				</h-spin>
			</div>
		</div>
		<div class="api-contents">
			<div class="title">API</div>			
			<div class="list_box content-wrapper">
				<div class="but">
					<Button type="primary" @click="addApiClick" v-if="activeRoutersButton.indexOf('addApi') != -1">新增API</Button>
					<Button type="primary" @click="refreshList">刷新</Button>
				</div>
				<h-spin fix v-if="apiLoading">
				 	<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
		       		<div>加载中...</div>
				</h-spin>
				<h-table class="full-max-height-table" :maxHeight="maxTableHeight" size="small" border :columns="headerData" :data="apiList"></h-table>
				<h-page size="small" class="page-box" :total="total" :current="currentPage" :page-size="pageSize" @on-change="changePage" show-total></h-page>			
			</div>
		</div>
		<h-msgBox :title="apiForm.title" v-model="isShowApiForm" @on-close="closeApiForm" class-name="vertical-center-modal" :top="0">
			<div class="contents">
				<h-form ref="apiForm" :model="apiForm" :label-width="80" :rules="apiRule">
					<h-form-item label="所属模块："  prop="moduleId">
						<template v-if="isShowApiForm">
							<h-select v-model="apiForm.moduleId">
								<h-option v-for="item in modulesTree" :value="item.id.toString()" :label="item.title" :key="item.id" placeholder="请选择"></h-option>
							</h-select>
						</template>
					</h-form-item>
					<h-form-item label="API名称：" prop="apiName">
						<h-input type="text" v-model.trim="apiForm.apiName" autocomplete="off" placeholder="请输入API名称"></h-input>
					</h-form-item>
					<h-form-item label="URL地址：" prop="apiUrl">
						<h-input type="text" :disabled="urlDisable" v-model.trim="apiForm.apiUrl" autocomplete="off" placeholder="请输入url地址"></h-input>
					</h-form-item>
					<h-form-item label="描述：" prop="apiDescription">
						<h-input type="text" v-model.trim="apiForm.apiDescription" autocomplete="off" placeholder="请输入描述"></h-input>
					</h-form-item>
				</h-form>
				<span v-if="apiForm.type == 0" class="tips">提示：URL地址添加后不可更改，请认真填写哦！</span>
			</div>
			<div slot="footer">
				<h-button type="text" @click="closeApiForm">取消</h-button>
				<h-button type="info" @click="saveApiForm" :loading="isApiSubmit">提交</h-button>				
			</div>
		</h-msgBox>
		<h-msgBox :title="modulesForm.title" v-model="showModuleForm" @on-close="closeModuleForm" class-name="vertical-center-modal" :top="0">
			<div class="contents">
				<h-form ref="modulesForm" :model="modulesForm" :rules="modulesRule" :label-width="110">
					<h-form-item prop="moduleName" label="模块名称：">
						<h-input type="text" v-model.trim="modulesForm.moduleName" autocomplete="off" placeholder="请输入模块名称"></h-input>
					</h-form-item>
				</h-form>
			</div>
			<div slot="footer">
				<h-button type="info" @click="saveModule" :loading="isSubmitForm">提交</h-button>
				<h-button type="text" @click="closeModuleForm">取消</h-button>
			</div>
		</h-msgBox>
	</div>
</template>
<script>
export default {
	name: 'SystemApi',
	data () {
		return {
			activeID: '',
			activeRoutersButton : this.$store.state.activeRoutersButton,
			total:0,
			currentPage:1,
			pageSize:10,
			keyword:'',
			moduleIndex:0,
			isModuleShow:false,
			showModuleForm: false,
			moduleLoading:false,
			apiLoading:false,
			modulesForm:{
				type:0,
				title:'',
				id:'',
				moduleName:''
			},
			modulesRule:{
				moduleName:[{required:true, max:15,message:'请填写模块名称,最多15字符',trigger:'blur'}]
			},
			modulesTree: [],
            isApiSubmit:false,
            isSubmitForm:false,
			isShowApiForm: false,		
			urlDisable:false,
			moduleSelectId:'',
			apiIndex:0,
			apiForm: {
				title:'',
				type:0,				
				moduleId:'',
				apiName:'',
				apiUrl:'',
				apiDescription:''
			},			
			apiRule:{
				moduleId:[{required:true,message:'请选择所属模块',trigger:'change'}],
				apiName:[{required:true,max:50,message:'请填写API名称,最多50字符',trigger:'blur'}],
				apiUrl:[{required:true,max:200,message:'请填写URL地址,最多200字符',trigger:'blur'}],
				apiDescription:[{max:200,message:'描述内容最多200字符',trigger:'blur'}]
			},
			headerData: [
				{
					title: 'API名称',
					key: 'apiName',
					type:'text'
				},{
					title: 'URL地址',
					key: 'apiUrl',
					type:'text'
				},{
					title: '所属模块',
					key: 'moduleName',
				},{
					title: '描述',
					key: 'apiDescription',
					type:'text'
				},{
					title: '更新时间',
					key: 'updateTime',
					width: 150,
				},{
					title: '操作',
                    key: 'handleStatus',
                    width: 60,
                    render: (h, params) => {
                    	let renderModifyApi = null;
                    	if(this.activeRoutersButton.indexOf('modifyApi') != -1){
                    		renderModifyApi =  [
	                            h('span', {
	                                class: {
	                                    'iconfont': true,
					                    'icon-t-b-message': true,
					                    'tab-icon-btn': true,
	                                },
	                                attrs:{
										title: '修改API'
									},
	                                on: {
	                                    click: () => {
	                                    	this.apiIndex = params.index;
	                                        this.apiModifyClick(params.index);
	                                    }
	                                }
	                            })
                        	]
                    	}
                        return h('div', renderModifyApi);
                    }
				}
			],
			apiList:[],
			ops:{
				bar: {
	              background: '#D7DDE4',
	              keepShow:true
	            },
	            rail: {
	              border: '1px solid #D7DDE4',
	              size: '5px'
	            },
	            scrollButton: {
	              enable: true,
	              background: '#ccc'
	            }
			},
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods: {
		changePage(current){
	    	this.currentPage = current;
	        this.getApiList(this.activeID,'','')
	    },
		addModuleClick(){
			this.modulesForm = {};
			this.modulesForm.type = 0;
			this.modulesForm.title = '新增模块';
			this.modulesForm.id = '';
			this.showModuleForm = true;
		},
		modifyModule(item,nodeKey){
			this.moduleIndex = nodeKey;
			this.modulesForm = {...item};
			this.modulesForm.type = 1;
			this.modulesForm.title = '修改模块';
			this.showModuleForm = true;
		},
		closeModuleForm(){
			this.modulesForm = {};
            this.$refs['modulesForm'].resetFields();
            this.showModuleForm = false;
		},
		saveModule(){
			this.$refs['modulesForm'].validate((valid) => {
                if (valid) {
                	if(this.isSubmitForm)return;
                	this.isSubmitForm = true;
                    let url = '/tm/api/module/save';
		            this.$http.post(url,{
		            	id: this.modulesForm.id,
						moduleName: this.modulesForm.moduleName
		            }).then((res) => {
		                let data = res.data ? res.data : {};
		                if(data.status == this.$api.SUCCESS){
		                    this.$hMessage.info(this.modulesForm.title+'成功');
		                    if(this.modulesForm.type == 1){
		                       let resultObj = data.data ? data.data : {};
		                       resultObj.title = data.data.moduleName;
		                       let modulesTree = [...this.modulesTree];
		                       modulesTree[this.moduleIndex] = resultObj;
		                       this.$set(this, 'modulesTree', modulesTree);
		                       this.getApiLists(this.modulesForm.id,'','');
		                    }else{
		                        this.getModulesList();	
		                    }		
		                    	                    
		                }else{		                	
		                    this.$hMessage.error({
		                        content: data.msg,
		                        duration: 3
		                    })
		                }		                
						this.isSubmitForm = false;
						this.closeModuleForm();	
		            }).catch(err=>{
		                this.isModuleShow =false;
		            })
                }else{
                	this.isSubmitForm = false;
                }
            })
		},
		addApiClick(){
			this.apiForm = {};
			this.apiForm.moduleId = this.activeID;
			this.urlDisable = false;
			this.apiForm.title = "新增API";
			this.apiForm.type = 0;
			this.isShowApiForm = true
		},
		apiModifyClick(index){
			this.urlDisable = true
			this.apiForm = {...this.apiList[index]};
			this.apiForm.moduleId = this.apiForm.moduleId + '';
			this.apiForm.title = "修改API";
			this.apiForm.type = 1;
			this.isShowApiForm = true
		},
		saveApiForm(){
			this.$refs['apiForm'].validate((valid) => {				
                if (valid) {
                	if(this.isApiSubmit)return
                	this.isApiSubmit = true;
                    let url = '/tm/api/save';
		            this.$http.post(url,{
		            	apiDescription: this.apiForm.apiDescription,
						apiName: this.apiForm.apiName,
						apiUrl: this.apiForm.apiUrl,
						id: this.apiForm.id,
						moduleId: this.apiForm.moduleId
		            }).then((res) => {
		                let data = res.data ? res.data : {};
		                if(data.status == this.$api.SUCCESS){
		                    this.$hMessage.info(this.apiForm.title+'成功');
		                    if(this.apiForm.type == 1){
		                       let resultObj = data.data ? data.data : {};
		                       this.$set(this.apiList, this.apiIndex, resultObj);
		                    }else{
		                        this.getApiLists(this.apiForm.moduleId,'','');	
		                    }		                    	                    
		                }else{		                	
		                    this.$hMessage.error({
		                        content: data.msg,
		                        duration: 3
		                    })
		                }
		                this.isApiSubmit = false;
		                this.closeApiForm();
		            }).catch(err=>{
		                this.isApiSubmit = false;
		            })
                }
            })
		},
		closeApiForm(){
			this.apiForm = {};
            this.$refs['apiForm'].resetFields();
            this.isShowApiForm = false;
		},
		getApiList(id,apiName,apiUrl){
			this.apiLoading = true;
			let url = '/tm/api/list?pagenum='+ this.currentPage +'&pagesize='+ this.pageSize +'&moduleid=' + id + '&apiname=' + apiName + '&apiurl=' + apiUrl;
            this.$http.get(url).then((res) => {
            	let data = res.data;
                if(data.status == this.$api.SUCCESS){
                	let list = data.data.list ? data.data.list: [];
                	this.apiList = list;
                	this.total = data.data.total;
                }else{
                    this.$hLoading.error(data.message)
                }
                this.apiLoading = false;
            })
            .catch(err=>{
            	this.apiLoading = false;
                this.$hLoading.error()
            })
		},
		getModulesList(){
			this.moduleLoading = true;
            let url = '/tm/api/module/list?keyword='+encodeURIComponent(this.keyword);
            this.$http.get(url).then((res) => {
            	let data = res.data;
                if(data.status == this.$api.SUCCESS){
                	let list = data.data ? data.data : [];
                	list.forEach((item , i)=>{
                		item.title = item.moduleName;
                		item.id = item.id + '';
                	})
                    this.modulesTree = list;
                    this.getApiLists('','','');
                }else{
                    this.$hLoading.error(data.message)
                }
                this.moduleLoading = false;
            })
            .catch(err=>{
                this.$hLoading.error();
                this.moduleLoading = false;
            })
        },
        getApiLists( id = ''){
        	if(id){
        		this.activeID = id.toString();
        	}else{
        		this.activeID = id;
        	}
        	this.currentPage = 1;
        	this.getApiList(id,'','');        	
        },
        refreshList(){
        	this.getModulesList();
        }
	},
	mounted() {
		this.refreshList()
	}
}
</script>
<style>
.h-tree-title-selected, .h-tree-title-selected:hover{
	background-color: #eaf5ff;
}
</style>
<style type="text/css" scoped>
.list_box{
	margin:0 10px;
}
.api{
	display: inline-block;
	width: 100%;
	min-height: 100%;
	border:1px solid #ccc;
	position: relative;
}
.tree{
	width: 260px;
	border-right: 1px solid #ccc;
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
}
.title{
	height: 36px;
	background-color: #ccc;
	line-height: 36px;
	text-indent: 10px;
}
.tree .nav{
	height: calc(100% - 36px);
	padding: 0 10px;
	box-sizing: border-box;
}
.api-contents{
	float: right;
	width: calc(100% - 260px);
}
.contents .but{
	margin: 10px 0;
}
.h-form .h-select{
	width: 100%;
}
.noData{
	text-align: center;
	margin:50px;
	color: #ccc;
}
.tips{
	color: red;
	padding-left: 20px;
}
.apiTree{
	padding: 5px;
	line-height: 18px;
}
.apiTree li{
	width: 100%;
	font-size: 0;
}
.apiTree li span:hover{
	background-color: #f2f2f2;
}
.apiTree .tree-icon{
	width: 18px;
    height: 18px;
    vertical-align: top;
    line-height: 0;
    line-height:0; margin:0;
    display: inline-block;
	border:0 none;
	outline:none;
	background-color:transparent; background-repeat:no-repeat; background-attachment: scroll;
	background-image:url("../../../assets/css/img/zTreeStandard.png");
	*background-image:url("../../../assets/css/img/zTreeStandard.gif");
	background-position: -56px -18px;
}
.apiTree li:first-child span{
	width: 100%;
	font-size: 14px;
}
.apiTree li:last-child .tree-icon{
	background-position: -56px -36px;
}
.apiTree li span{
	display: inline-block;
	vertical-align: top;
	width: calc(100% - 18px);
	font-size: 12px;
	cursor: pointer;
	box-sizing: border-box;
	padding: 0 2px;
	height: 18px;
}
.apiTree li i.iconfont{
	font-size: 14px;
	float: right;
	cursor: pointer;
}
.apiTree li i.iconfont:hover{
	color:#298DFF;
}
.apiTree li i.add{
	display: inline-block;
	width: 14px;
	height: 14px;
	text-align: center;
	line-height: 14px;
	float: right;
	background-color: #298DFF;
	border-radius: 2px;
	margin-top: 1px;
}
.apiTree li i.add:hover{
	background-color: #0067dc;
}
.apiTree li i.add .iconfont{
	float: none;
	color: #fff;
}
.apiTree li .active,.apiTree li .active:hover{
	background-color: #FFE6B0;
	border: 1px solid #FFB951 ;
	box-sizing: border-box;
}
</style>