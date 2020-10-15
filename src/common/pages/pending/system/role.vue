<template>
	<div class="wrapper">		
		<div class="list_box content-wrapper">
			<div class="but_box">
				<h-button type="info"  @click="addRole" v-if="activeRoutersButton.indexOf('add') != -1">新增</h-button>
				<h-button type="info"  @click="refreshList">刷新</h-button>
			</div>			
			<h-spin fix v-if="roleLoading">
				 <h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
		        <div>加载中...</div>
			</h-spin>
			<h-table class="full-max-height-table" :maxHeight="maxTableHeight" size="small" border :columns="tabColumns" :data="roleList" ></h-table>
			<h-page size="small" class="page-box" :total="total" :current="currentPage" :page-size="pageSize" showTotal @on-change="changePage"></h-page>		
		</div>
		<h-msgBox :title="formRole.title" class-name="modelBox vertical-center-modal" :top="0" :mask-closable="false" @on-close="closeForm" @on-cancel="closeForm" v-model="showModel">
			<h-form class="content-wrapper" ref="formRole" :model="formRole" inline  :rules="formRule" :label-width="80" >
		        <h-form-item prop="roleName" label="角色名称：" >
		        	<h-input type="text" v-model.trim="formRole.roleName" placeholder="请输入角色名称">对话框内容</h-input>
				</h-form-item>
				<h-form-item label="分配权限：" prop="menuIds">
					<vue-scroll :ops="ops" style="border: 1px solid #D7DDE4;">
						<div class="permissionTree">
							<ul id="roleMenuList" class="ztree"></ul>
						</div>						
					</vue-scroll>					
				</h-form-item>	
			</h-form>	
			<h-spin fix v-if="permissionLoading">
				 <h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
		        <div>加载中...</div>
			</h-spin>
	        <div slot="footer" class="dispatch_footer">
	        	<h-button type="text" @click="closeForm">取消</h-button>
	            <h-button type="info" :loading="isSubmitForm" @click="submitForm">提交</h-button>	            
	        </div>
		</h-msgBox>
	</div>
</template>
<script>
import { Tree } from '@/filters/index';
import $ from 'jquery';
require('@/assets/css/zTreeStyle.css')
require('@/assets/js/jquery.ztree.core.min.js')
require('@/assets/js/jquery.ztree.excheck.min.js')
export default {
	data () {
		return {
			activeRoutersButton : this.$store.state.activeRoutersButton,
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
			total:0,
			currentPage:1,
			pageSize:12,
			roleLoading:true,
			isSubmitForm:false,
			showModel:false,
			roleIndex:0,
			formRole:{
				title:'',
				type:0,
				id:'',
				mark:'1',
				roleName:'',
				menuIds:[],
			},
			formRule:{
				roleName:[{required:true,max:15,message:'请填写角色名称,最多15字符',trigger:'blur'}]
			},
			tabColumns: [
                    {
                        title: '角色名称',
                        key: 'roleName'
                    },{
                    	title:'账户数量',
                    	key:'userNum'
                    },
//                  {
//                      title: '状态',
//                      key: 'status',
//                      render: (h, params) => {
//                      	let statusLabel = params.row.status== "1" ? '禁用' :'启用';
//                      	if(this.activeRoutersButton.indexOf('switch') != -1){
//	                        	return h('div', [
//	                                h('h-switch', {
//	 									props: {
//	                                        size: 'large',
//	                                        value: params.row.status == "1" ? true :false
//	                                   },
//	                                    on: {
//	                                        'on-change': (status) => {             
//												this.$hMsgBox.confirm({
//													title:statusLabel,
//													content:'确定要'+ statusLabel +'角色'+params.row.roleName+"?",
//													onOk:()=>{
//														 this.changeStatus(statusLabel,status,params.row.id,params.index)
//													},
//													onCancel:()=>{
//														this.cancelChangeStatus(params.index , status)
//													},
//												})					
//	                                        }
//	                                    }
//	                                },[
//					                  h('span',{
//					                    slot: 'open',
//					                  },'启用'),
//					                  h('span',{
//					                    slot: 'close',
//					                  },'禁用')
//									]),
//	                                
//	                            ]);
//                      	}else{
//                      		return h('div', params.row.statusLabel)
//                      	}
//                      }
//                  }
                    {
                        title: '创建时间',
                        key: 'createTime'
                    }, {
                        title: '创建人',
                        key: 'creatorName'
                    },{
                        title: '更新时间',
                        key: 'updateTime'
                    }, {
                        title: '操作',
                        key: 'handleStatus',
                        width: 100,
                        render: (h, params) => {
                        	let status = params.row.status;
                        	let statusText = '';
                        	let renderModify = null;
                        	if(this.activeRoutersButton.indexOf('modify') != -1){
                        		renderModify = h('span', {
                                    class: {
                                        'iconfont': true,
					                    'icon-t-b-message': true,
					                    'tab-icon-btn': true,
                                    },
                                    attrs:{
										title: '修改'
									},
                                    on: {
                                        click: () => {
                                        	this.roleIndex = params.index;
                                            this.modifyRole(params.index)
                                        }
                                    }
                                })
                        	};
                        	let renderDelet = null;
                        	if(this.activeRoutersButton.indexOf('delete') != -1){
                        		renderDelet =  h('span', {
                                	style:{
                                		display:this.activeRoutersButton.indexOf('delete') != -1 ? 'inline-block' : 'none'
                                	},
                                    class: {
                                        'iconfont': true,
                                        'icon-t-b-delete':true,
                                        'tab-icon-btn': true,                                        
                                    },
                                    attrs:{
										title: '删除'
									},
                                    on: {
                                        click: () => {
                                            this.$hMsgBox.confirm({
												title:'删除数据源',
												content:'确定要删除角色'+params.row.roleName+'?',
												onOk:()=>{
													 this.deletRole(params.row.id)
												}
											})
                                        }
                                    }
                                })
                        	}
                            return h('div', [renderModify,renderDelet]);
                        }
                    }
                ],
                roleList: [],
                menuList: [],
                menuListTemp:[],
                permissionLoading:false,
                aryRequired:[],
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods: {
		changePage(current){
	    	this.currentPage = current;
	        this.getRoleList()
	    },
	    /*获取树形选择节点id*/
		getCheckTree(){
			let treeObj = $.fn.zTree.getZTreeObj("roleMenuList");
			let checkNodes = treeObj.getCheckedNodes(true);
			let checkedArr= [...this.aryRequired];
			checkNodes.forEach((item,i)=>{
				checkedArr.push(item.id)
			})
			return checkedArr.join();
		},
		/**添加角色**/
		addRole(){			
			let setting = {
				check: {
					enable: true,
					chkboxType: { "Y" : "p", "N" : "s" }
				},
				view: {
					showIcon: false
				},
				callback: {
					onCheck:() =>{
						//this.getCheckTree()
					}
				}
			};
			let tree = this.initMenuList(this.menuList);
			this.menuList = tree.arr;
			$.fn.zTree.init($("#roleMenuList"), setting ,this.menuList);
			this.formRole = {};
			this.formRole.title = '新增角色';
			this.formRole.type = 0;
			this.formRole.mark = '1';
			this.formRole.id = '';
			this.showModel = true
		},
		/**修改**/	
		initCheckTreeNode(){			
			/**获取勾选节点Id,设置check属性**/
			let permissionList = this.formRole.menus;
			let permissionIdArr =[];
			if(permissionList && permissionList.length>0){		
				permissionList.forEach((item,i) =>{
					permissionIdArr.push(item.id);					
				})
				let menuListTemp =  JSON.parse(this.menuListTemp);
				let checkedArr = this.getMenuCheckedId(permissionIdArr,menuListTemp);
				this.$set(this,'menuList',checkedArr);
				this.formRole.menuIds = permissionIdArr.join();
			}else{
				this.formRole.menuIds ='';
				this.$set(this,'menuList',JSON.parse(this.menuListTemp));				
			};
			let setting = {
				check: {
					enable: true,
					chkboxType: { "Y" : "p", "N" : "s" }
				},
				view: {
					showIcon: false
				},
				callback: {
					onCheck:() =>{
						//this.getCheckTree()
					}
				}
				
			};
			let nodes = [...this.menuList];
		    $.fn.zTree.init($("#roleMenuList"), setting ,nodes);
		},
		modifyRole(index){
			this.formRole = {...this.roleList[index]};	
			this.formRole.title = '修改';
			this.formRole.type = 1;
			this.formRole.mark = '1';
			this.showModel = true;	
			this.getPermissionList(this.formRole.id);						
		},
		getPermissionList(id){
			this.permissionLoading = true;
			let url = '/tm/role/detail?id='+id;
            this.$http.get(url).then((res) => {
                let data = res.data.data ? res.data.data : {};
                if(data.status == this.$api.SUCCESS){
 	               this.formRole.menus = data.menus ? [...data.menus] : [];
 	               this.initCheckTreeNode()
                }else{
                    this.$hMessage.error({
                        content: data.msg,
                        duration: 3
                    })
                }  
                this.permissionLoading = false;
            }).catch(err=>{
            	this.permissionLoading = false;
            })
		},
		/*循环遍历菜单节点，查找匹配Id*/
		getMenuCheckedId(peimissionArr,menuList){
			if(menuList && menuList.length>0){
				for(let i = 0; i < menuList.length; i++){
					/*设置选中节点check*/
					if(peimissionArr && peimissionArr.length>0){
					    if(peimissionArr.indexOf(menuList[i].id) != -1 || menuList[i].required == '1'){
	  						menuList[i].checked = true	  						
	  					}
	  					if(menuList && menuList[i].children && menuList[i].children.length>0){
						 	this.getMenuCheckedId(peimissionArr,menuList[i].children)
						}
					}
			    }
			}				
			return menuList;
		},
		/*提交角色权限表单*/
		submitForm(){	
			this.$refs['formRole'].validate((valid) => {
                if (valid) {
                	if(this.isSubmitForm)return;
                	this.isSubmitForm = true;	
                    let url = '/tm/role/save';
                    let menuIds = this.getCheckTree();
		            this.$http.post(url,{
		            	id:this.formRole.id,
		            	roleName:this.formRole.roleName,
		            	mark:this.formRole.mark,
		            	menuIds: menuIds,
		            }).then((res) => {
		                let data = res.data ? res.data : {};
		                if(data.status == this.$api.SUCCESS){
		                	this.isSubmitForm = false;
		                    this.$hMessage.info(this.formRole.title+'成功');
		                    if(this.formRole.type == 1){
		                       let resultObj = data.data ? data.data : {};
		                       this.$set(this.roleList, this.roleIndex , resultObj);
		                    }else{
		                       this.getRoleList()	
		                    }
		                    this.closeForm()
		                }else{
		                	this.isSubmitForm = false;
		                    this.$hMessage.error({
		                        content: data.msg,
		                        duration: 3
		                    })
		                }		    			
		            }).catch(err=>{
		                
		            })
                }else{
                	this.isSubmitForm = false;
                }
            })
		},
		closeForm(){
			this.formRole = {};
            this.$refs['formRole'].resetFields();
			this.showModel = false
		},
		changeStatus(label,status,id,index){
			let url = '/tm/role/changestatus?id='+id;
            this.$http.get(url).then((res) => {
                let data = res.data ? res.data : {};
                if(data.status == this.$api.SUCCESS){
 	                this.$hMessage.info({
	                    content: '角色'+label+'成功',
	                    duration: 3
                   })   
 					this.getRoleList();
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
			let info = {...this.roleList[index]}
            info.status = !status;
            this.$set(this.roleList,index,info)
		},
		deletRole(id){
			let url = '/tm/role/delete?id='+id;
            this.$http.delete(url).then((res) => {
                let data = res.data ? res.data : {};
                if(data.status == this.$api.SUCCESS){
 	                  this.$hMessage.info({
                        content: '角色删除成功',
                        duration: 3
                    })   	 
                    this.getRoleList();
                }else{
                    this.$hMessage.error({
                        content: data.msg,
                        duration: 3
                    })
                }   
            }).catch(err=>{
                
            })
		},
		getRoleList(){
			this.roleLoading = true;
            let url = '/tm/role/list?pagenum='+this.currentPage+'&pagesize='+this.pageSize;
            this.$http.get(url).then((res) => {
                let obj = res.data ? res.data : {};
                if(obj.status == this.$api.SUCCESS){
                	this.roleList = obj.data.list ? obj.data.list : [];
//              	this.roleList.forEach((item,i) =>{                		
//              		item.statusLabel = item.status == "1" ? '启用' : '禁用';
//              	})         
                	this.total = obj.data.total;
                }else{
                    this.$hLoading.error(obj.message)
                }
                this.roleLoading = false;
            })
            .catch(err=>{
                this.$hLoading.error();
                 this.roleLoading = false
            })
        },
        setAryRequired(id){
        	if(this.aryRequired.indexOf(id) == -1){
        		this.aryRequired.push(id);
        	}
        },
        initMenuList(arr){
        	let chkDisabled = false;
        	arr.forEach((item , i) =>{
        		let disabled = false;
        		item.open = true;
        		item.checked = false;
        		if(item.required == "1"){
        			item.chkDisabled = true;
        			item.checked = true;
        			chkDisabled = true;
        			this.setAryRequired(item.id)			    	
        		}else if(item.required == "0"){
        			item.chkDisabled = false;
        		}
		    	if(item.children && item.children.length > 0){
		    		let obj = this.initMenuList(item.children);
		    		let status = obj.chkDisabled;
		    		if(status){
		    			this.setAryRequired(item.id)
		    			chkDisabled = true;
						disabled = true;
		    		}
		    		item.chkDisabled = item.chkDisabled ? item.chkDisabled : disabled;
		    		item.checked = item.checked ? item.checked : disabled;
		    	}  		
        	})
        	return { arr: arr, chkDisabled: chkDisabled};
        },
        getMenuList(){
        	let url = '/tm/menu/tree';
            this.$http.get(url).then((res) => {
                let obj = res.data ? res.data : {};
                if(obj.status == this.$api.SUCCESS){
                	let menuList= obj.data? obj.data : [];   
                	let initArr = this.initMenuList(menuList);
                	this.menuListTemp =  JSON.stringify(initArr.arr);
                	this.menuList = [...initArr.arr];  

                }else{
                    this.$hLoading.error(obj.message)
                }
            })
            .catch(err=>{
                this.$hLoading.error()
            })
        },
         searchRoleList(){
        	this.currentPage = 1;
	        this.getRoleList()
        },
        refreshList(){
        	this.getMenuList();
			this.searchRoleList();
        }
	},
	mounted() {
		this.refreshList();		
	}
}
</script>
<style>
</style>
<style type="text/css" scoped>
.permissionTree{
	padding: 10px;
	width:300px;
	height: 300px;
	line-height:20px;
}
.h-input-wrapper{
	width:300px;
}
.list_box{
	margin:15px 0;
}
.but_box{
	margin-bottom: 10px;
}
</style>