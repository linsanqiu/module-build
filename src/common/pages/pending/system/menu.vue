<template>
	<div class="menu">
		<div class="tree">
			<div class="title">
				菜单树
			</div>
			<div class="nav content-wrapper">
				<vue-scroll>
					<ul id="menu-tree-demo" class="ztree"></ul>
				</vue-scroll>
				<Spin fix v-if="isGetTree">
					<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
					<div>加载中...</div>
				</Spin>
			</div>
		</div>
		<div class="menu-wrapper">
			<div class="title">
				菜单管理
			</div>
			<div class="but">
				<Button type="primary" @click="onAddMenu" v-if="activeRoutersButton.indexOf('add') != -1">新增菜单</Button>
				<Button type="primary" @click="init">刷新</Button>
			</div>
			<div class="content-wrapper">
				<div class="list">
					<h-table class="full-max-height-table" :maxHeight="maxTableHeight" border :columns="headerData" :data="aryMenuList" size="small"></h-table>
				</div>
				<div class="page-box">
					<h-page :total="intTotal" :page-size="intPageSize" :current="intPageNum" @on-change="onPageChange" show-total size="small"></h-page>
				</div>
				<Spin fix v-if="isGetList">
					<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
					<div>加载中...</div>
				</Spin>
			</div>
		</div>
		<h-msgBox :title="isRedact ? '修改菜单' : '新增菜单' " v-model="isShowMenuForm"  @on-close="onCloseMenuFormBox" class-name="menu-form-modal vertical-center-modal" :top="0">
			<div class="menu-form-contents">
				<h-form :model="objMenuForm" :label-width="80" :rules="ruleValidate" ref="menuform">
					<h-form-item label="父菜单：">
						<h-cascader :data="aryMenuParentList" :value="aryParentsId" change-on-select @on-change="selectParent" :clearable="false"></h-cascader>
					</h-form-item>
					<h-form-item label="名称：" prop="menuName">
						<h-input type="text" v-model="objMenuForm.menuName" autocomplete="off">
						</h-input>
					</h-form-item>
					<h-form-item label="URL：" prop="menuUrl" :required="isNeedUrl" >
						<h-input type="text" v-model="objMenuForm.menuUrl" :disabled="isRedact" autocomplete="off">
						</h-input>
					</h-form-item>
					<h-form-item label="编码：" prop="menuCode">
						<h-input type="text" v-model="objMenuForm.menuCode" :disabled="isRedact" autocomplete="off">
						</h-input>
					</h-form-item>
					<h-form-item label="标识符：" prop="mark" :required="isNeedMark" >
						<h-input type="text" v-model="objMenuForm.mark" :disabled="isRedact" autocomplete="off">
						</h-input>
					</h-form-item>
					<h-form-item label="排序：" prop="sortNum">
						<h-input type="text" v-model="objMenuForm.sortNum" autocomplete="off" class="sort-num">
						</h-input>
						<span>数值越大越前，只对同级别有效</span>
					</h-form-item>
					<h-form-item label="图标：">
						<h-input type="text" v-model="objMenuForm.menuIcon" autocomplete="off" class="menu-icon">
						</h-input>
						<span>CLASS名</span>
					</h-form-item>
					<h-form-item label="类型：" prop="type">
						<h-radio-group v-model="objMenuForm.type" @on-change="changeMenutype">
							<h-radio label="1" :disabled="isRedact" >目录</h-radio>
							<h-radio label="2" :disabled="isRedact" >页面</h-radio>
							<h-radio label="3" :disabled="isRedact" >按钮</h-radio>
						</h-radio-group>
					</h-form-item>
					<h-form-item label="必选菜单：">
						<h-radio-group v-model="objMenuForm.required">
							<h-radio label="1" >是</h-radio>
							<h-radio label="0" >否</h-radio>
						</h-radio-group>
					</h-form-item>
					<div class="msg">URL、编码、标识符、类型提交后不可更改！</div>
				</h-form>
			</div>
			<div slot="footer" class="menu-form-footer">
				<h-button @click="onCloseMenuFormBox">取消</h-button>
				<h-button type="primary" @click="onSubmitMenuForm" :loading="isReqMenuForm">提交</h-button>
			</div>
		</h-msgBox>
		<h-msgBox title="编辑API" v-model="isShowApiForm" @on-close="onCloseApiFormBox" class-name="vertical-center-modal" :top="0" width="980">
			<div class="api-form-contents">
				<h-table border height="300":columns="apiHeaderData" :data="aryApiList" size="small"></h-table>
			</div>
			<div slot="footer" class="api-form-footer">
				<h-button @click="onCloseApiFormBox">取消</h-button>
				<h-button type="primary" @click="setReqApiForm" :loading="isReqApiForm">提交</h-button>
			</div>
		</h-msgBox>
	</div>
</template>
<script>
import expandRow from '@/components/menu_api_list.vue';
import { Tree } from '@/filters/index';
import $ from 'jquery';
require('@/assets/css/zTreeStyle.css')
require('@/assets/js/jquery.ztree.core.min.js')
require('@/assets/js/jquery.ztree.excheck.min.js')
export default {
	name: 'SystemMenu',
	data () {
		var validatorUrl = (rule, value, callback)=>{
			if(this.isNeedUrl){
				if(!value){
					callback('Url不能为空');
					return;
				}
			}
			callback();
		};
		var validatorMark = (rule, value, callback)=>{
			if(this.isNeedMark){
				if(!value){
					callback('标识符不能为空');
					return;
				}
			}
			callback();
		};
		var validatorSortNum = (rule, value, callback)=>{
			if(value){
				if(!/^[0-9]*$/.test(value)){
					callback('请输入整数');
					return;
				}
			}
			callback();
		};
		var validatorType = (rule, value, callback)=>{
			let type = this.intParentType;
			if(type == 1 && value == 3){
				callback('目录只能添加目录/页面');
				return;
			}else if(type == 2 && value != 3){
				callback('页面只能添加按钮');
				return;
			}
			callback();
		};
		return {
			activeRoutersButton: this.$store.state.activeRoutersButton,
			aryMenuTree: [],
			headerData: [
				{
					type: 'expand',
					width: 50,
					render: (h, params) => {
						return h(expandRow, {
							props: {
								row: params.row
							}
						})
					}
				},
				{
					title: '名称',
					key: 'menuName'
				},{
					title: 'url',
					key: 'menuUrl'
				},{
					title: '图标',
					key: 'menuIcon',
					width: 60,
					render: (h, params) => {
						if(!params.row.menuIcon){
							return;
						}
						return h('div', [
							h('h-icon',{
								props: {
									name: params.row.menuIcon,
								},
							})
						])
					}
				},{
					title: '标识符',
					key: 'mark'
				},{
					title: '排序',
					width: 80,
					key: 'sortNum'
				},{
					title: '状态',
					width: 100,
					render: (h, params) => {
						if(this.activeRoutersButton.indexOf('changeStatus') != -1){
						 	return h('div', [
								h('h-switch',{
									props: {
										size: 'large',
										value: params.row.status == 1 ? true : false
									},
									on: {
										'on-change': (status) => {
											this.setMeunStatus(params.index,status);
										}
									}
								},[
									h('span',{
										slot: 'open',
									},'显示'),
									h('span',{
										slot: 'close',
									},'隐藏')
								])
							]);
						}else{
							let strStatus = '';
							if(params.row.status == 1){
								strStatus = '显示'
							}else{
								strStatus = '隐藏'
							}
							return h('div', strStatus)
						}
					}
				},{
					title: '类型',
					key: 'type',
					width: 80,
					render: (h, params) => {
						let tmpStr = params.row.type == 1 ? '目录' : params.row.type == 2 ? '页面' : '按钮';
						return h('div',{},tmpStr);
					}
				},{
					title: '操作',
					width: 90,
					render: (h, params) => {
						let redactBtn = null;
						if(this.activeRoutersButton.indexOf('redact') != -1){
							redactBtn = h('i', {
								class: {
									'iconfont': true,
									'icon-t-b-message': true,
									'tab-icon-btn': true,
								},
								attrs:{
									title: '修改菜单'
								},
								on: {
									click: () => {
										this.onMenuUpdataBtn(params.index)
									}
								}
							})
						}
						let changeAPIBtn = null;
						if(this.activeRoutersButton.indexOf('changeAPI') != -1){
							changeAPIBtn = h('i', {
								class: {
									'iconfont': true,
									'icon-key': true,
									'tab-icon-btn': true,
								},
								attrs:{
									title: '编辑API'
								},
								on: {
									click: () => {
										this.onUserApiBtn(params.index)
									}
								}
							})
						}
						return h('div', [redactBtn,changeAPIBtn]);
					}
				}
			],
			isGetTree: false,
			isGetList: false,
			aryMenuList: [],
			isShowMenuForm: false,
			isRedact: false,
			objMenuForm: {
				menuCode: '',
				menuName: '',
				menuUrl: '',
				menuIcon: '',
				mark: '',
				sortNum: '',
				parentId: 0,
				required: '0',
				type: '2' //1 目录，2页面，3按钮
			},
			intMenuTreeId: 0,
			objSelectTree: {id:0,parents:['0'],type:1},
			aryParentsId:[],
			intPageNum: 1,
			intPageSize: 12,
			intTotal: 0,
			intParentType: '1',
			arySelectParentId: [],
			aryMenuParentList: [],
			aryApiList:[],
			arySelectApiList: [],
			isShowApiForm: false,
			apiHeaderData: [
				{
					title: 'API模块',
					key: 'moduleName',
					width: 180,
				},{
					title: 'API接口',
					render: (h, params) => {
						let apiList = params.row.apiList;
						let apiCheckbox = function(){
							let ary = [];
							for(let i = 0; i < apiList.length; i++){
								let renderH = h('h-checkbtn',{
									props: {
										value: apiList[i].id,
										label: apiList[i].apiName,
										size: 'small'
									},
									attrs:{
										title:apiList[i].apiUrl
									}
								},[
									h('span',apiList[i].apiName)
								])
								ary.push(renderH)
							}
							return ary;
						}
						let _this = this;
						return h('h-checkbox-group',{
							props:{
								value: _this.arySelectApiList,
							}
						},apiCheckbox())
					}
				}
			],
			isNeedUrl: false,
			isNeedMark: false,
			isReqMenuForm: false,
			isReqApiForm: false,
			ruleValidate: {
				menuName: [
					{ required: true, message: '名称不能为空', trigger: 'blur' },
					{ max: 10, message: '最长10个字符', trigger: 'blur' }
				],	
				menuUrl: [
					{ validator: validatorUrl,trigger: 'blur' }
				],
				menuCode: [
					{ required: true, message: '编码不能为空', trigger: 'blur' }
				],
				mark: [
					{ validator: validatorMark,trigger: 'blur' }
				],
				sortNum: [
					{ validator: validatorSortNum, trigger: 'blur' }
				],
				type: [
					{ validator: validatorType, trigger: 'change' }
				],
			}
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods: {
		changeMenutype(type){
			if(type==2){
				this.isNeedUrl = true;
				this.isNeedMark = false;
			}else{
				this.isNeedUrl = false;
				if(type==3){
					this.isNeedMark = true;
				}else{
					this.isNeedMark = false;
				}
			}
			this.$refs['menuform'].validateField('type');
		},
		/*获取菜单列表*/
		getMenuList(){
			this.isGetList = true;
			let url = '/tm/menu/children/list?id=' + this.intMenuTreeId +"&pageNum="+ this.intPageNum +"&limit=" + this.intPageSize ;
			this.$http.get(url).then((res)=>{
				this.isGetList = false;
				let tmpObj = res.data;
				if(tmpObj.status != this.$api.SUCCESS){
					this.$hMessage.error(tmpObj.msg);
					return;
				}
				let tmpData = tmpObj.data ? tmpObj.data : {};
				this.aryMenuList = tmpData.list ? tmpData.list : [];
				this.intTotal = tmpData.total ? tmpData.total : 0;
			}).catch(err=>{
				this.isGetList = false;
				//this.$hMessage.error('');
			})
		},
		/*更改菜单状态*/
		setMeunStatus(key,status){
			let _this = this;
			let menuName = this.aryMenuList[key].menuName;
			if(status){
				_this.setReqMeunStatus(key,status);
				return;
			}
			this.$hMsgBox.confirm({
				title: '温馨提示',
				content: '是否隐藏菜单“'+menuName+'”？',
				okText: '是',
				cancelText: '否',
				onOk: function(){
					_this.setReqMeunStatus(key,status);
				},
				onCancel: function(){
					_this.rollbackMeunStatus(key,status);
				}
			})
		},
		/*回滚菜单状态*/
		rollbackMeunStatus(key,status){
			let tmpInfo = {...this.aryMenuList[key]};
			tmpInfo.status = !status;
			this.$set(this.aryMenuList,key,tmpInfo);
		},
		/*向服务器更新菜单状态*/
		setReqMeunStatus(key,status){
			let meunStatus = status ? 1 : 0;
			let id = this.aryMenuList[key].id;
			let url = '/tm/menu/status?status='+ meunStatus +'&id='+ id;
			this.$http.post(url).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status != this.$api.SUCCESS){
					this.$hMessage.error(tmpObj.msg);
					this.rollbackMeunStatus(key,status);
				}
			}).catch(err=>{
				this.$hMessage.error('发生未知错误，更改状态失败!');
				this.rollbackMeunStatus(key,status);
			})
		},
		/*点击新增菜单*/
		onAddMenu(){
			let parentId = JSON.stringify(this.objSelectTree.parents);
			this.aryParentsId = [...JSON.parse(parentId)];
			this.objMenuForm.parentId = this.objSelectTree.id;
			if(this.objSelectTree.type){
				this.intParentType = this.objSelectTree.type.toString();
			}else{
				this.intParentType = '1';
			}
			this.isNeedUrl = true;
			this.isShowMenuForm = true;
		},
		/*点击修改信息按钮*/
		onMenuUpdataBtn(index){
			this.isRedact = true;
			let tmpObj = {...this.aryMenuList[index]};
			let parentId = JSON.stringify(this.objSelectTree.parents);
			this.aryParentsId = [...JSON.parse(parentId)];
			this.objMenuForm = {
				id: tmpObj.id,
				menuCode: tmpObj.menuCode,
				menuName: tmpObj.menuName,
				menuUrl: tmpObj.menuUrl,
				menuIcon: tmpObj.menuIcon,
				mark: tmpObj.mark,
				sortNum: tmpObj.sortNum,
				parentId:tmpObj.parentId,
				required: tmpObj.required,
				type: tmpObj.type
			}
			if(tmpObj.parentType){
				this.intParentType = tmpObj.parentType.toString();
			}else{
				this.intParentType = '1';
			}
			this.isShowMenuForm = true;
			if(tmpObj.type==2){
				this.isNeedUrl = true;
				this.isNeedMark = false;
			}else{
				this.isNeedUrl = false;
				if(tmpObj.type==3){
					this.isNeedMark = true;
				}else{
					this.isNeedMark = false;
				}
			}
		},
		/*关闭菜单新增/修改表单*/
		onCloseMenuFormBox(){
			this.isRedact = false,
			this.isShowMenuForm = false;
			this.objMenuForm = {
				menuCode: '',
				menuName: '',
				menuUrl: '',
				menuIcon: '',
				mark: '',
				sortNum: '',
				parentId: 0,
				required: '0',
				type: '2'
			}
			this.changeMenutype(2);
			this.$refs['menuform'].resetFields();
		},
		/*点击修改API按钮*/
		onUserApiBtn(index){
			let aryMenuApiList = this.aryMenuList[index].apiList;
			this.arySelectApiList = [];
			for(let i = 0; i< aryMenuApiList.length; i++){
				this.arySelectApiList.push(aryMenuApiList[i].id);
			}
			this.intUpdataApiIndex = index;
			this.isShowApiForm = true;
		},
		/*发服务器发送API 表单*/
		setReqApiForm(){
			if(this.isReqApiForm)return;
			this.isReqApiForm = true;
			let url = '/tm/menu/api/save';
			let index = this.intUpdataApiIndex;
			let objData = { menuId: this.aryMenuList[index].id ,apiList: this.arySelectApiList }
			this.$http.post(url,objData).then((res)=>{
				this.isReqApiForm = false;
				let tmpObj = res.data;
				if(tmpObj.status != this.$api.SUCCESS){
					this.$hMessage.error(tmpObj.msg);
					return;
				}
				let obj = {...this.aryMenuList[index]};
				obj.apiList = tmpObj.data ? tmpObj.data : [] 
				this.$set(this.aryMenuList,index,obj);
				this.onCloseApiFormBox();
			}).catch(err=>{
				this.isReqApiForm = false;
				//this.$hMessage.error('');
			})
		},
		/*关闭API新增/修改表单*/
		onCloseApiFormBox(){
			this.isShowApiForm = false;
			this.arySelectApiList = [];
		},
		/*点击菜单树*/
		apiModuleSelect(event, treeId, data){
			this.intMenuTreeId = data.id;
			this.objSelectTree = data;
			this.intPageNum = 1;
			this.getMenuList();
		},
		/*分页页码改变的回调*/
		onPageChange(page){
			this.intPageNum = page;
			this.getMenuList();
		},
		/*获取菜单类型为 目录 页面 列表*/
		getMenuParentList(){
			this.isGetTree = true;
			let url = '/tm/menu/list';
			this.$http.get(url).then((res)=>{
				this.isGetTree = false;
				let tmpObj = res.data;
				if(tmpObj.status != this.$api.SUCCESS){
					this.$hMessage.error(tmpObj.msg);
					return;
				}
				let list = tmpObj.data ? tmpObj.data : [];
				let tree = Tree(0,list);
				let zNodes = [
					{ id:0, name:"根节点",parents:['0'],checked:true, open:true,children: [...tree]},
				]
				let _this = this;
				let setting = {
					data: {
						simpleData: {
							pIdKey: 'parentId',
						}
					},
					callback: {
						onClick: function(event, treeId, treeNode){
							_this.apiModuleSelect(event, treeId, treeNode)
						}
					}
				};
				let treeObj = $.fn.zTree.init($("#menu-tree-demo"), setting, zNodes);
				let nodes = treeObj.transformToArray(treeObj.getNodes());
				for(let i=0, len=nodes.length; i <len; i++){
					if(nodes[i].id == this.objSelectTree.id){
						treeObj.selectNode(nodes[i]);
					}
				}
				tree.unshift({label: '根节点',name: '根节点',value: '0', type:1});
				this.aryMenuParentList = tree;
			}).catch(err=>{
				this.isGetTree = false;
				//this.$hMessage.error('');
			})
		},
		/*点击新增/修改提交按钮*/
		onSubmitMenuForm(){
			this.$refs['menuform'].validate((valid) => {
				if(valid){
					if(this.objMenuForm.parentId == -1){
						this.objMenuForm.parentId = 0;
					}
					this.setReqSubmitMenuForm();
				}
			})
		},
		/*选择父菜单*/
		selectParent( value, selectedData){
			if(value.length == 0){
				this.objMenuForm.parentId = '';
			}else{
				this.intParentType = selectedData[selectedData.length-1].type.toString();
				this.objMenuForm.parentId = value[value.length-1];
				this.$refs['menuform'].validateField('type');
			}
		},
		/*向服务器发送新增/编辑菜单数据*/
		setReqSubmitMenuForm(){
			if(this.isReqMenuForm)return;
			this.isReqMenuForm = true;
			let url = '/tm/menu/save';
			this.$http.post(url,this.objMenuForm).then((res)=>{
				this.isReqMenuForm = false;
				let tmpObj = res.data;
				if(tmpObj.status != this.$api.SUCCESS){
					this.$hMessage.error(tmpObj.msg);
					return;
				}
				this.onCloseMenuFormBox();
				this.getMenuList();
				this.getMenuParentList();
			}).catch(err=>{
				this.isReqMenuForm = false;
				//this.$hMessage.error('');
			})
		},
		/*获取api*/
		getApiList(){
			if(this.activeRoutersButton.indexOf('changeAPI') != -1){
				let url = '/tm/api/module/api/list';
				this.$http.get(url).then((res)=>{
					let tmpObj = res.data;
					if(tmpObj.status != this.$api.SUCCESS){
						this.$hMessage.error(tmpObj.msg);
						return;
					}
					this.aryApiList = tmpObj.data ? tmpObj.data : [];
				}).catch(err=>{
					//this.$hMessage.error('');
				})
			}
		},
		/*初始化*/
		init(){
			this.getMenuList();
			this.getMenuParentList();
			this.getApiList();
		}
	},
	mounted() {
		this.init();
	}
}
</script>
<style type="text/css" scoped>
.menu{
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
	left: 0;
	top: 0;
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
.menu-wrapper{
	width: calc(100% - 260px);
	float: right;
}
.list{
	padding: 10px;
}
.menu-wrapper .but{
	padding: 10px 10px 0 10px;
}
.menu-form-contents{

}
.menu-form-footer span{
	font-size: 12px;
	color: red;
	padding-left: 10px;
}
.menu-form-contents .h-form-item{
	margin-bottom: 20px;
}
.sort-num,.menu-icon{
	width: 175px;
}
.msg{
	color: red;
	padding-left: 70px;
}
</style>
<style type="text/css">
.api-form-contents .h-checkbtn-wrapper{
	margin: 2px 15px 2px 0;
	height: 24px;
	line-height: 24px;
}
.menu .menu-wrapper .h-table-cell-with-expand{
	height: auto;
	line-height: normal;
}
.menu-form-contents .h-cascader-menu{
	height: auto;
	max-height: 300px;
}
.menu-form-modal .h-modal-body{
	padding-top: 20px;
}
</style>