<template>
	<div class="template" :style="'height:' + (maxTableHeight + 70) + 'px'">
		<div class="temleft">
			<div class="tree-search-input">
				关键字：
				<h-input placeholder="请输入" v-model="treeKeyword" @on-enter="onSearch()" ></h-input>
				<h-button type="primary" @click="onSearch()">搜索</h-button>
			</div>
			<div class="temleft-tree">
				<ul id="tactics-tree" class="ztree"></ul>
			</div>
			<h-spin fix v-if="isGetTree">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</h-spin>
		</div>
		<div class="temright">
			<search-form>
				<ul slot="content">
					<li class="row2">
						<dl>
							<dt>新闻模板：</dt>
							<dd><h-input placeholder="请输入新闻模板" v-model="req.newsTemplateName" icon="android-close"  @on-enter="onPageChange(1)" @on-click="shitClearableClick('newsTemplateName','req')" ref="newsTemplateName"></h-input></dd>
						</dl>
					</li>
					<li class="search-wrapper-but">
						<h-button type="primary" @click="onPageChange(1)">查询</h-button>
					</li>
				</ul>
			</search-form>
			<div>
				<h-table
					size="small"
					:maxHeight="(maxTableHeight - 50)"
					class="full-max-height-table"
					:columns="table"
					:data="list"
					:highlight-row="false"
					border>
				</h-table>
			</div>
			<div class="tab-box">
				<h-page  highlight-row size="small" show-total show-elevator show-total show-sizer placement="top" class="page-box"  :page-size-opts="pageSizeOpts" :total="total" :current="req.currentPage" :page-size="req.pageSize" @on-change="onPageChange" @on-page-size-change="onPageSizeChange"></h-page>
			</div>
			<h-spin fix v-if="isGetList">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</h-spin>
		</div>
		<h-msgBox :title="isAddFather ? '新增分组' : '编辑分组'" v-model="isShowFatherMsgBox" @on-close="closeFatherMsgBox" class-name="vertical-center-modal" :top="0">
			<div class="contents">
				<h-form ref="fatherForm" :model="father" :rules="modulesRule" :label-width="110" @submit.native.prevent>
					<h-form-item prop="name" label="分组名称：">
						<h-input type="text" v-model.trim="father.name" autocomplete="off" placeholder="请输入分组名称"></h-input>
					</h-form-item>
				</h-form>
			</div>
			<div slot="footer">
				<h-button type="text" @click="closeFatherMsgBox">取消</h-button>
				<h-button type="info" @click="submitFather" :loading="isSubmitForm">提交</h-button>
			</div>
		</h-msgBox>
		<h-msgBox :title="delTitle" v-model="isShowDelMsgBox" @on-close="closeDel" class-name="vertical-center-modal" :top="0">
			<div class="contents">
				<h-form ref="delForm" :model="deleteData" :rules="delModulesRule" :label-width="110" @submit.native.prevent>
					<h-form-item prop="name" label="模块名称：">
						<h-input type="text" v-model.trim="deleteData.name" autocomplete="off" :placeholder="'输入“'+ activeDelData.name +'”后删除'"></h-input>
					</h-form-item>
				</h-form>
			</div>
			<div slot="footer">
				<h-button type="text" @click="closeDel">取消</h-button>
				<h-button type="info" @click="submitDel" :loading="isDelSubmitForm">删除</h-button>
			</div>
		</h-msgBox>
	</div>
</template>
<script>
import store from '@/store';
import router from '@/router/router'
require('@/assets/css/zTreeStyle.css')
require('@/assets/js/jquery-1.4.4.min.js')
require('@/assets/js/jquery.ztree.all.min.js')
require('@/assets/js/jquery.ztree.exhide.min.js')
import { copyDeep } from '@/filters/index'
export default {
	name: 'RobotwritingTactics',
	data () {
		var validatorName = (rule, value, callback)=>{
			if(!value){
				callback('请输入分组名称');
				return;
			}else if(value.length > 20){
				callback('不可超过20个字符');
				return;
			}
			callback();
		};
		var validatorDelName = (rule, value, callback)=>{
			if(value !=  this.activeDelData.name){
				callback('名称输入有误');
				return;
			}
			callback();
		};
		return {
			activeRoutersButton: this.$store.state.activeRoutersButton,
			treeModel: null,
			setting: {
				view: {
					addHoverDom: this.addHoverDom,
					removeHoverDom: this.removeHoverDom,
					selectedMulti: false
				},
				edit: {
					drag: {
						autoExpandTrigger: true,
						prev: this.dropPrev,
						inner: this.dropInner,
						next: this.dropNext
					},
					enable: true,
					showRemoveBtn: this.showRemoveBtn,
					showRenameBtn: this.showRenameBtn,
					renameTitle: '编辑',
					removeTitle: '删除',
				},
				data: {
					simpleData: {
						enable: true
					}
				},
				callback: {
					beforeDrag: this.beforeDrag,
					beforeDrop: this.beforeDrop,
					beforeDragOpen: this.beforeDragOpen,
					onDrag: this.onDrag,
					onDrop: this.onDrop,
					beforeRemove: this.beforeRemove,
					beforeEditName: this.beforeEditName,
					onClick: this.onTreeClick,
				}
			},
			req: {
				currentPage: 1,
				pageSize: 10,
				newsTemplateName: '',
				strategyId: null,
			},
			page: 1,
			total: 0,
			pageSizeOpts:[10,20,50,100],
			table: [
				{
					title: "序号",
					width: 60,
					align: "center",
					render: (h, params) => {
						let index = params.index + 1 + ( (this.page - 1) * this.req.pageSize);
						return h('div', index );
					}
				},
				{
					key: "newsTemplateName",
					title: "新闻模板",
				},
				{
					key: "strategyTypeName",
					title: "策略类别",
				},
				{
					key: "strategyName",
					title: "策略名称",
				},
			],
			list: [],
			isGetTree: false,
			treeRoot: { id: '0', pId: -999, name: '总目录', type: 1, open:true },
			treeList: [],
			isAddFather: false,
			isShowFatherMsgBox: false,
			activeNode: {},
			father: {
				name: '',
			},
			modulesRule:{
				name:[{ required:true, validator: validatorName,trigger:'blur'}]
			},
			isSubmitForm: false,
			isShowDelMsgBox: false,
			delTitle: '',
			isDelSubmitForm: false,
			deleteData:{
				name: '',
			},
			activeDelData:{},
			delModulesRule:{
				name:[{ required:true, validator: validatorDelName,trigger:'blur'}]
			},
			isGetList: false,
			treeKeyword: '',
			keyword: '',
		}
	},
	computed: {
		maxTableHeight(){ return  this.$store.state.maxTableHeight },
	},
	methods:{
		shitClearableClick(a,b){
			this[b][a] = '';
			this.$refs[a].focus();
		},
		goAdd(name,id){
			this.$router.push('/robotwriting/tactics/add?'+ name +'='+id);
		},
		onPageChange(val){
			this.req.currentPage = val;
			this.getList();
		},
		onPageSizeChange(size){
			this.req.pageSize = size;
			this.onPageChange(1);
		},
		//是否可放在节点之前
		dropPrev(treeId, nodes, targetNode) {
			if(targetNode && targetNode.id === '0'){
				return false;
			}
			return true;
		},
		//是否可放在节点里
		dropInner(treeId, nodes, targetNode) {
			if(targetNode && targetNode.type == 2){
				return false;
			}
			return true;
		},
		//是否可放在节点之后
		dropNext(treeId, nodes, targetNode) {
			if(targetNode && targetNode.id === '0'){
				return false;
			}
			return true;
		},
		//被拖拽之前
		beforeDrag(treeId, treeNodes) {
			if(treeNodes && treeNodes[0] && treeNodes[0].id == '0'){
				return false;
			}
			return true;
		},
		//是否允许自动展开节点
		beforeDragOpen(treeId, treeNode) {
			return true;
		},
		//拖动结束之前
		beforeDrop(treeId, treeNodes, targetNode, moveType, isCopy) {
			//禁止拖动到根节点
			return !(targetNode == null || (moveType != "inner" && !targetNode.parentTId));
		},
		//被拖拽
		onDrag(event, treeId, treeNodes) {

		},
		//拖动结束
		onDrop(event, treeId, treeNodes, targetNode, moveType, isCopy) {
			this.setUpdateParentId(treeNodes[0].id, treeNodes[0].pId);
		},
		//新增策略 新增分组按钮  复制按钮
		addHoverDom(treeId, treeNode) {
			if(this.activeRoutersButton.indexOf('add') == -1){
				return false;
			}
			let _this = this;
			let sObj = $("#" + treeNode.tId + "_span");
			if(treeNode && treeNode.type == 2){
				if (treeNode.editNameFlag || $("#copy_"+treeNode.tId).length>0 ) return;
				let copy = "<span class='button copy' id='copy_" + treeNode.tId
				+ "' title='复制策略' onfocus='this.blur();'></span>";
				sObj.after(copy);
				let copybtn = $("#copy_"+treeNode.tId);
				if (copybtn) copybtn.bind("click", function(){
					_this.goAdd('copy',treeNode.id);
					return false;
				});
				return false;
			}
			if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0 ||  $("#addFolder_"+treeNode.tId).length>0 ) return;
			let addStr = "<span class='button addfolder' id='addFolder_" + treeNode.tId
				+ "' title='新增分组' onfocus='this.blur();'></span>";
			sObj.after(addStr);
			let addStrs = "<span class='button add' id='addBtn_" + treeNode.tId
				+ "' title='新增策略' onfocus='this.blur();'></span>";
			sObj.after(addStrs);
			//新增策略
			let btn = $("#addBtn_"+treeNode.tId);
			if (btn) btn.bind("click", function(){
				_this.goAdd('pId',treeNode.id);
				return false;
			});
			//新增分组
			let folderBtn = $("#addFolder_"+treeNode.tId);
			if (folderBtn) folderBtn.bind("click", function(){
				_this.isAddFather = true;
				_this.isShowFatherMsgBox = true;
				_this.activeNode = treeNode;
				return false;
			});
		},
		removeHoverDom(treeId, treeNode) {
			$("#addBtn_"+treeNode.tId).unbind().remove();
			$("#addFolder_"+treeNode.tId).unbind().remove();
			$("#copy_"+treeNode.tId).unbind().remove();
		},
		//是否显示删除按钮
		showRemoveBtn(treeId, treeNode){
			if((treeNode && treeNode.id === '0') || this.activeRoutersButton.indexOf('delete') == -1 ){
				return false;
			}
			return true;
		},
		//是否显示编辑按钮
		showRenameBtn(treeId, treeNode){
			if((treeNode && treeNode.id === '0') || this.activeRoutersButton.indexOf('add') == -1 ){
				return false;
			}
			return true;
		},
		//删除
		beforeRemove(treeId, treeNode){
			this.activeDelData = treeNode;
			if(treeNode.type == 2){
				this.delTitle = '是否确认删除策略？';
			}else{
				this.delTitle = '是否确认删除分组？';
			}
			this.isShowDelMsgBox = true;
			return false;
		},
		//编辑
		beforeEditName(treeId, treeNode){
			if(treeNode.type == 1){
				this.isAddFather = false;
				this.isShowFatherMsgBox = true;
				this.activeNode = treeNode;
				this.father.name = treeNode.name;
				return false;
			}
			this.goAdd('id',treeNode.id);
			return false;
		},
		//格式化tree
		treeFormatting(a){
			let arr = [];
			if(a){
				let ary = copyDeep(a);
				for(let i = 0, len = ary.length; i < len; i++){
					let item = ary[i];
					item.open = true;
					if(item.type == 2){
						item.iconSkin = "child";
					}else if(item.type == 1){
						item.iconSkin = "father";
					}
					if(item.children && item.children.length > 0){
						item.children = this.treeFormatting(item.children);
					}else {
						item.children = null;
					}
					arr.push(item);
				}
			}
			return arr;
		},
		onTreeClick(event, treeId, treeNode){
			this.req.strategyId = treeNode.id != '0' ? treeNode.id : null;
			this.onPageChange(1);
		},
		//创建树
		createTree(){
			let arr = [...[this.treeRoot],...this.treeList];
			arr = this.treeFormatting(arr);
			//arr = [...arr,...arr,...arr,...arr]
			let tree = $.fn.zTree.init($("#tactics-tree"), this.setting, arr);
			this.treeModel = tree;
			let nodes = tree.transformToArray(tree.getNodes());
			let selectId = this.req.strategyId ? this.req.strategyId : '0';
			if(nodes.length > 0){
				for(let i = 0, len = nodes.length; i < len; i++){
					if(nodes[i].id == selectId){
						tree.selectNode(nodes[i]);
						break;
					}
				}
			}
		},
		//关闭弹框
		closeFatherMsgBox(){
			this.isShowFatherMsgBox = false;
			this.father.name = '';
			this.$refs['fatherForm'].resetFields();
		},
		//提交分组事件
		submitFather(){
			this.$refs['fatherForm'].validate((valid) => {
				if (valid) {
					this.setSaveData();
				}
			})
		},
		//发送分组数据
		setSaveData(){
			//获取选择的字点
			let obj = {...this.activeNode};
			let data = {
				type: 1,
				name: this.father.name,
			};
			//判断新增还是编辑
			if(this.isAddFather){
				data.parentId = obj.id;
			}else{
				data.parentId = obj.pId;
				data.id = obj.id;
			}
			let url = '/tm/mw/generationStrategy/save';
			this.$http.post(url,data).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.$hMessage.success('保存成功');
					this.closeFatherMsgBox();
					this.getTrees();
				}else{
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				this.isShowFatherMsgBox = false;
				this.$hMessage.error('保存失败');
			})
			
		},
		//关闭删除弹框
		closeDel(){
			this.isShowDelMsgBox = false;
			this.deleteData.name = '';
			this.$refs['delForm'].resetFields();
		},
		//点击删除(弹框)
		submitDel(){
			this.$refs['delForm'].validate((valid) => {
				if (valid) {
					this.setDel();
				}
			})
		},
		//提交删除
		setDel(){
			if(this.isDelSubmitForm)return;
			this.isDelSubmitForm = true;
			let url = '/tm/mw/generationStrategy/removeById?strategyId=' + this.activeDelData.id;
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.treeModel.removeNode(this.activeDelData);
					this.closeDel();
					this.$hMessage.success('删除成功');
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isDelSubmitForm = false;
			}).catch(err=>{
				this.isDelSubmitForm = false;
				this.$hMessage.error('删除失败');
			})
		},
		getList(goOn = false){
			if(this.isGetList && !goOn)return;
			this.isGetList = true;
			let url = '/tm/mw/generationStrategy/page?';
			let req = this.req;
			this.$http.post(url,req).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data ? oTmp.data : {};
					let total = data.total || 0;
					if(total && data.records && data.records.length == 0){
						this.req.currentPage = Math.ceil(total/this.req.pageSize)
						this.getList(true);
						return;
					}
					this.page = data.current;
					this.total = total;
					this.list = data.records || [];
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetList = false;
			}).catch(err=>{
				this.isGetList = false;
				this.$hMessage.error('获取策略分页数据失败！');
			})
		},
		setUpdateParentId(id,pId){
			let url = '/tm/mw/generationStrategy/updateParentId?strategyId=' + id + '&strategyParentId=' + pId;
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					
				}else{
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				this.$hMessage.error('节点变更失败');
			})
		},
		onSearch(){
			this.keyword = copyDeep(this.treeKeyword);
			this.getTrees();
		},
		getTrees(){
			if(this.isGetTree)return;
			this.isGetTree = true;
			let url = '/tm/mw/generationStrategy/search/treeList?name='+ encodeURIComponent(this.keyword);
			this.$http.post(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data || [];
					let arr = this.treeFormatting(data);
					let tree = $.fn.zTree.init($("#tactics-tree"), this.setting, arr);
					this.treeModel = tree;
					let nodes = tree.transformToArray(tree.getNodes());
					let selectId = this.req.strategyId ? this.req.strategyId : '0';
					if(nodes.length > 0){
						for(let i = 0, len = nodes.length; i < len; i++){
							if(nodes[i].id == selectId){
								tree.selectNode(nodes[i]);
								break;
							}
						}
					}
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetTree = false;
			}).catch(err=>{
				this.isGetTree = false;
				this.$hMessage.error('获取策略分组失败');
			})
		}
	},
	mounted() {
		this.getTrees();
		this.getList();
	},
	activated: function(){
		this.getTrees();
		this.getList();
	},
}
</script>
<style type="text/css" scoped>
.template{
	font-size: 0;
}
.tree-search-input{
	padding: 6px 10px;
	height: 42px;
	border-bottom: 1px dotted #dfdfdf;
}
.tree-search-input>>> .h-input-wrapper{
	width: 165px;
}
.tree-search-input>>> .h-input-wrapper input{
	height: 28px;
}
.tree-search-input>>> .h-btn{
	padding-top: 0;
	padding-bottom: 0;
	height: 28px;
	line-height: 28px;
	vertical-align: top;
}
.temleft{
	width: 300px;
	vertical-align: top;
	border: 1px solid #dfdfdf;
	height: 100%;
	margin-right: 15px;
	box-sizing: border-box;
	display: inline-block;
	font-size: 12px;
	position: relative;
}
.temleft-tree{
	overflow-y: auto;
	height: calc(100% - 42px);
}
.temright{
	width: calc(100% - 315px);
	vertical-align: top;
	height: 100%;
	border: 1px solid #dfdfdf;
	padding: 10px;
	box-sizing: border-box;
	display: inline-block;
	font-size: 12px;
	position: relative;
}
.template>>> .ztree li span.button.add{
	margin-left: 5px;
	margin-right: 0;
	background-position: -144px 0;
	vertical-align: top;
	*vertical-align: middle;
}
.template>>> .ztree li span.button.addfolder{
	margin-left: 5px;
	margin-right: 0;
	background: url(../../../assets/css/img/diy/folder.png) no-repeat scroll 0 0 transparent;
	vertical-align:top; 
	*vertical-align:middle
}
.template>>> .ztree li span.button.copy{
	margin-left: 5px;
	margin-right: 0;
	background: url(../../../assets/css/img/diy/copy.png) no-repeat scroll 0 0 transparent;
	vertical-align:top; 
	*vertical-align:middle
}
.template>>> .ztree li span.button.edit, .template>>> .ztree li span.button.remove{
	margin-left: 5px;
	margin-right: 0;
}

.template>>> .ztree li span.button.father_ico_open{
	margin-right: 2px;
	background-position: -110px -16px;
	vertical-align: top;
	*vertical-align: middle;
}
.template>>> .ztree li span.button.father_ico_close,.template>>> .ztree li span.button.father_ico_docu{
	margin-right: 2px;
	background-position: -110px 0;
	vertical-align: top;
	*vertical-align: middle;
}
.template>>> .ztree li span.button.child_ico_docu,.template>>> .ztree li span.button.child_ico_docu{
	margin-right: 2px;
	background-position: -110px -32px;
	vertical-align: top;
	*vertical-align: middle;
}





</style>