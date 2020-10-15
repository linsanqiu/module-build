<template>
	<div ref="rule" class="rule" :style="'height:' + (maxTableHeight + 70) + 'px'">
		<div id="rMenu">
			<ul>
				<li class="add_tree" @click="goAdd('pId', activeRightTree.id)">新增规则</li>
				<li @click="addFolder()">新增分组</li>
				<li class="edit_tree" @click="edit();">编辑分组</li>
				<li class="del_tree" @click="ondel();">删除分组</li>
			</ul>
		</div>
		<div class="ruleleft">
			<div class="rule_tree" ref="ruletree" @scroll="hideRMenu">
				<ul id="tactics-tree" class="ztree"></ul>
			</div>
			<h-spin fix v-if="isGetTree">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</h-spin>
		</div>
		<div class="rule-right">
			<search-form :title="activeTreeName">
				<ul slot="content" >
					<li class="col_3">
						<dl>
							<dt>配置名称：</dt>
							<dd><h-input v-model="listreq.configName" icon="android-close"  @on-enter="onPageChange(1)" @on-click="shitClearableClick('configName','listreq')" ref="configName"></h-input></dd>
						</dl>
					</li>
					<li class="col_3">
						<dl>
							<dt>更新人：</dt>
							<dd>
								<Select v-model.trim="listreq.updaterId" filterable>
									<Option v-for="(option, index) in updaterList" :value="option.id" :key="index">{{ option.realName +'('+ option.userName +')' }}</Option>
								</Select>
							</dd>
						</dl>
					</li>
					<li class="search-wrapper-but">
						<h-button type="primary" @click="onPageChange(1)">查询</h-button>
						<h-button type="primary" @click="goAdd('pId', listreq.groupId)" :disabled="!listreq.groupId || listreq.groupId == 0 ? true : false ">新增规则</h-button>
					</li>
				</ul>
			</search-form>
			<div class="table-list">
				<h-table
          :loading="isTableLoading"
					size="small"
					:maxHeight="(maxTableHeight - 50)"
					class="full-max-height-table"
					:columns="table"
					:data="list"
					:highlight-row="false"
					border>
				</h-table>
				<div class="tab-box">
					<h-page  highlight-row size="small" show-total show-elevator show-total show-sizer placement="top" class="page-box"  :page-size-opts="pageSizeOpts" :total="total" :current="req.currentPage" :page-size="req.pageSize" @on-change="onPageChange" @on-page-size-change="onPageSizeChange"></h-page>
				</div>
				<h-spin fix v-if="isGetList">
					<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
					<div>加载中...</div>
				</h-spin>
			</div>
		</div>
		<h-msgBox :title="isAddFather ? '新增分组' : '编辑分组'" v-model="isShowFatherMsgBox" @on-close="closeFatherMsgBox" class-name="vertical-center-modal" :top="0">
			<div class="contents">
				<h-form ref="fatherForm" :model="father" :rules="fatherRule" :label-width="110" @submit.native.prevent>
					<h-form-item prop="groupName" label="分组名称：">
						<h-input type="text" v-model.trim="father.groupName" autocomplete="off" placeholder="请输入分组名称"></h-input>
					</h-form-item>
				</h-form>
			</div>
			<div slot="footer">
				<h-button type="text" @click="closeFatherMsgBox">取消</h-button>
				<h-button type="info" @click="submitFather" :loading="isSubmitForm">提交</h-button>
			</div>
		</h-msgBox>
	</div>
</template>
<script>
require('@/assets/css/zTreeStyle.css')
require('@/assets/js/jquery-1.4.4.min.js')
require('@/assets/js/jquery.ztree.all.min.js')
import { copyDeep } from '@/filters/index'
export default {
	name: 'ExtractRule',
	data() {
		return {
			activeRoutersButton: this.$store.state.activeRoutersButton,// 当前路由页面的所有按钮权限
			isGetTree: false,
			setting: {
				view: {
					//addHoverDom: this.addHoverDom,
					//removeHoverDom: this.removeHoverDom,
					selectedMulti: false
				},
				edit: {
					drag: {
						autoExpandTrigger: true,
						prev: this.dropPrev,
						inner: this.dropInner,
						next: this.dropNext
					},
					//enable: true,
					//showRemoveBtn: this.showRemoveBtn,
					//showRenameBtn: this.showRenameBtn,
					//renameTitle: '编辑',
					//removeTitle: '删除',
				},
				data: {
					simpleData: {
						enable: true,
						pIdKey: 'parentId',
					},
					key: {
						name: "groupName"
					}
				},
				callback: {
					beforeDrag: this.beforeDrag,
					beforeDrop: this.beforeDrop,
					beforeDragOpen: this.beforeDragOpen,
					onDrag: this.onDrag,
					onDrop: this.onDrop,
					//beforeRemove: this.beforeRemove,
					//beforeEditName: this.beforeEditName,
					onClick: this.onTreeClick,
					onRightClick: this.onRightClick,
				}
			},
			treeList: [],
			treeModel: '',
			isAddFather: false,
			isShowFatherMsgBox: false,
			father:{
				id: '',
				groupName: '',
				isLeaf: '0',
				parentId: '',
			},
			fatherRule:{
				groupName:[
					{ required:true, message: '请输入', trigger:'blur'},
					{ min: 2, message: '至少2个字符', trigger:'blur'}
				]
			},
			isSubmitForm: false,
			req: {
				currentPage: 1,
				pageSize: 10,
				newsTemplateName: '',
				strategyId: null,
			},
			listreq:{
				groupId: '0',
				currentPage: 1,
				pageSize: 10,
				updaterId: '',
				configName: '',
			},
			total: 0,
			pageSizeOpts: [10,20,50,100],
      isTableLoading: false, // 状态表格是否加载中
			table: [
				{
					key: "configName",
					title: "配置名称",
				},
				/*{
					key: "groupName",
					title: "业务分组",
				},*/
				{
					key: "ruleTypeDesc",
					title: "类型",
				},
				{
					key: "updaterName",
					title: "更新人",
				},
				{
					key: "updateTime",
					title: "更新时间",
					width: 150,
				},
				{
					title: "操作",
					width: 120,
					align: "center",
					render: (h, params) => {
						let row = params.row;
						let btn = this.activeRoutersButton;
						let saveBtn,deleteBtn,testBtn,criterionBtn, copyBtn;
						if(btn.indexOf('copy') !== -1){
              copyBtn = h('span', {
								attrs: {
									"title": '复制',
								},
								class: [
									'ios-copy-outline',
									'iconfont',
									'icon-ios-copy-outline'
								],
                style:{
                  marginRight: '8px'
                },
								on: {
									click: () => {
										this.copySetting(params)
									}
								},
							})
						};
						if(btn.indexOf('edit') !== -1){
							saveBtn = h('span', {
								attrs: {
									"title": '编辑',
								},
								class: [
									'icon-t-b-message',
									'iconfont',
									'tab-icon-btn'
								],
								on: {
									click: () => {
										this.$router.push('/extract/rule/edit?id=' + params.row.id);
									}
								},
							})
						};
						if(btn.indexOf('delete') !== -1){
							deleteBtn = h('span', {
								attrs: {
									"title": '删除',
								},
								class: [
									'icon-t-b-delete',
									'iconfont',
									'tab-icon-btn'
								],
								style:{
									color:'#F5222D'
								},
								on: {
									click: () => {
										this.$hMsgBox.confirm({
											title:'温馨提示',
											content:'确定要删除：'+ row.configName +'?',
											onOk:()=>{
												this.del(row.id);
											}
										})
									}
								},
							})
						};
						if(btn.indexOf('test') !== -1){
							testBtn = h('span', {
								attrs: {
									"title": '测试',
								},
								class: [
									'icon-social-tumblr-outline',
									'iconfont',
									'tab-icon-btn'
								],
								on: {
									click: () => {
										this.$router.push('/extract/rule/test?id=' + row.id +'&name=' + row.configName );
									}
								},
							})
						};
						/*if(btn.indexOf('criterion') != -1){
							criterionBtn = h('span', {
								attrs: {
									"title": '标准数据管理',
								},
								class: [
									'icon-t-b-role',
									'iconfont',
									'tab-icon-btn'
								],
								on: {
									click: () => {
										this.$router.push('/extract/rule/criterion?id=' + row.id +'&name=' + row.configName );
									}
								},
							})
						};*/
						return h('div',{
							class: [
								"tab-operation",
							],
						},[copyBtn,saveBtn,testBtn,criterionBtn,deleteBtn]);
					}
				},
			],
			list: [],
			updaterList: [],
			isGetList: false,
			activeRightTree: {},
			activeTreeName: '业务分组',
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods: {
		ondel(){
			this.hideRMenu();
			let name = '删除分组会删除分组以及下面的所有配置，确认删除“'+ this.activeRightTree.groupName +'”分组吗？';
			let _this = this;
			this.$hMsgBox.confirm({
				title: '温馨提示',
				content: name,
				onOk: () =>{
					_this.setDelReq(this.activeRightTree.id);
				}
			})
		},
		edit(){
			this.hideRMenu();
			let activeRightTree = this.activeRightTree;
			this.father = {
				id: activeRightTree.id,
				groupName: activeRightTree.groupName,
				isLeaf: '0',
				parentId: activeRightTree.parentId,
			}
			this.isAddFather = false;
			this.isShowFatherMsgBox = true;
		},
		addFolder(){
			this.hideRMenu();
			this.father.parentId = this.activeRightTree.id;
			this.isAddFather = true;
			this.isShowFatherMsgBox = true;
		},
		getScrollTop(){
			var scroll_top = 0;
			if (document.documentElement && document.documentElement.scrollTop) {
				scroll_top = document.documentElement.scrollTop;
			}
			else if (document.body) {
				scroll_top = document.body.scrollTop;
			}
			return scroll_top;
		},
		getScrollLeft(){
			var scroll_left = 0;
			if (document.documentElement && document.documentElement.scrollLeft) {
				scroll_left = document.documentElement.scrollLeft;
			}
			else if (document.body) {
				scroll_left = document.body.scrollLeft;
			}
			return scroll_left;
		},
		onRightClick(event, treeId, treeNode){
			if(!treeNode)return;
			this.activeRightTree = treeNode;
			this.showRMenu(treeNode.id,event.clientX, event.clientY)
		},
		showRMenu(id, x, y) {
			$("#rMenu ul").show();
			if (id == "0") {
				this.isRootTree = true;
				$(".add_tree").hide();
				$(".edit_tree").hide();
				$(".del_tree").hide();
			} else {
				this.isRootTree = false;
				$(".add_tree").show();
				$(".edit_tree").show();
				$(".del_tree").show();
			}
			let windowHeight = $(window).height();
			let windowWidth= $(window).width();
			if(y + 100 >= windowHeight){
				y -= 100;
			}
			if(x + 70 >= windowWidth){
				x -= 70;
			}
			$("#rMenu").css({"top":y + this.getScrollTop() - this.$refs.rule.offsetTop + "px", "left": x + this.getScrollLeft() - this.$refs.rule.offsetLeft +"px", "display":"block"});
			$("body").bind("mousedown", this.onBodyMouseDown);
		},
		hideRMenu() {
			$("#rMenu").css({"display": "none"});
			$("body").unbind("mousedown", this.onBodyMouseDown);
		},
		onBodyMouseDown(event){
			if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length>0)) {
				$("#rMenu").css({"display" : "none"});
			}
		},
		shitClearableClick(a,b){
			this[b][a] = '';
			this.$refs[a].focus();
		},
    // 复制一条配置数据
    copySetting (params) {
		  this.isTableLoading = true;
		  const { row, index } = params
      this.$http.get(`/tm/ruleConfig/copy`, {
        params: {
          id: row.id
        }
      }).then((response) => {
        const data = response.data;
        if (String(data.status) === String(this.$api.SUCCESS)) {
          let value = copyDeep(data.body)
          this.list.splice(index+1, 0, value)
          this.$hMessage.success('复制成功');
        } else {
          this.$hMessage.error(data.msg);
        }
        this.isTableLoading = false;
      }).catch(() => {
        this.isTableLoading = false;
        this.$hMessage.error('复制失败');
      })
    },
    // 删除单条配置数据
		del(id){
			if(this.isGetList)return;
			this.isGetList = true;
			let url = '/tm/ruleConfig/deleteById?id=' + id;
			this.$http.delete(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.getList(true);
					this.$hMessage.success('删除成功')
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetList = false;
			}).catch(err=>{
				this.isGetList = false;
				this.$hMessage.error('删除失败');
			})
		},
		onPageChange(val){
			this.listreq.currentPage = val;
			this.getList();
		},
		onPageSizeChange(size){
			this.listreq.pageSize = size;
			this.onPageChange();
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
			if(targetNode && targetNode.isLeaf == 1){
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
			this.setUpdateParentId(treeNodes[0].id, treeNodes[0].parentId);
		},
		//新增按钮
		addHoverDom(treeId, treeNode) {
			if(this.activeRoutersButton.indexOf('add') == -1 || treeNode.isLeaf == 1){
				return false;
			}
			let _this = this;
			let sObj = $("#" + treeNode.tId + "_span");
			if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0 ||  $("#addFolder_"+treeNode.tId).length>0 ) return;
			let addStr = "<span class='button addfolder' id='addFolder_" + treeNode.tId
				+ "' title='新增分组' onfocus='this.blur();'></span>";
			sObj.after(addStr);
			if(treeNode.id != '0'){
				let addStrs = "<span class='button add' id='addBtn_" + treeNode.tId
				+ "' title='新增规则' onfocus='this.blur();'></span>";
				sObj.after(addStrs);
			}
			//新增规则
			let btn = $("#addBtn_"+treeNode.tId);
			if (btn) btn.bind("click", function(){
				_this.goAdd('pId', treeNode.id)
				return false;
			});
			//新增分组
			let folderBtn = $("#addFolder_"+treeNode.tId);
			if (folderBtn) folderBtn.bind("click", function(){
				_this.father.parentId = treeNode.id;
				_this.isAddFather = true;
				_this.isShowFatherMsgBox = true;
				return false;
			});
		},
		goAdd(name,id){
			this.hideRMenu();
			this.$router.push('/extract/rule/add?'+ name +'='+id);
		},
		removeHoverDom(treeId, treeNode) {
			$("#addBtn_"+treeNode.tId).unbind().remove();
			$("#addFolder_"+treeNode.tId).unbind().remove();
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
			if((treeNode && treeNode.id === '0') || treeNode.isLeaf == 1 || this.activeRoutersButton.indexOf('add') == -1 ){
				return false;
			}
			return true;
		},
		//删除
		beforeRemove(treeId, treeNode){
			let name = '确认删除“'+ treeNode.groupName +'”？';
			let _this = this;
			this.$hMsgBox.confirm({
				title: '温馨提示',
				content: name,
				onOk: () =>{
					_this.setDelReq(treeNode.id);
				}
			})
			return false;
		},
		//编辑
		beforeEditName(treeId, treeNode){
			this.father = {
				id: treeNode.id,
				groupName: treeNode.groupName,
				isLeaf: '0',
				parentId: treeNode.parentId,
			}
			this.isAddFather = false;
			this.isShowFatherMsgBox = true;
			return false;
		},
		setDelReq(id){
			this.isGetTree = true;
			let url = '/tm/businessGroup/removeById?id=' + id;
			this.$http.delete(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.getTree(true)
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetTree = false;
			}).catch(err=>{
				this.isGetTree = false;
				this.$hMessage.error('删除失败');
			})
		},
		onTreeClick(e ,treeId, treeNode){
			if(treeNode.isLeaf == '1'){
				this.goAdd('id', treeNode.id)
			}else{
				this.listreq.groupId = treeNode.id;
				this.activeTreeName = treeNode.groupName;
        this.listreq.currentPage = 1;
				this.getList(true);
			}
		},
		//格式化tree
		treeFormatting(ary){
			let arr = [];
			if(ary){
				for(let i = 0, len = ary.length; i < len; i++){
					let item = ary[i];
					item.open = true;
					if(item.isLeaf == 1){
						item.iconSkin = "child";
					}else if(item.isLeaf == 0){
						item.iconSkin = "father";
					}
					arr.push(item);
				}
			}
			return arr;
		},
		getTree(go = false){
			if(this.isGetTree && !go)return;
			this.isGetTree = true;
			let url = '/tm/businessGroup/treeList?isLeaf=0';
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let oData = oTmp.body && oTmp.body.treeList ? oTmp.body.treeList : [];
					this.treeList = oData;
					this.createTree();
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetTree = false;
			}).catch(err=>{
				this.isGetTree = false;
				this.$hMessage.error('获取分组失败');
			})
		},
		//创建树
		createTree(){
			let arr = [...this.treeList];
			arr = this.treeFormatting(arr);
			let tree = $.fn.zTree.init($("#tactics-tree"), this.setting, arr);
			this.treeModel = tree;
			let nodes = tree.transformToArray(tree.getNodes());
			let id = this.listreq.groupId;
			if(id && nodes.length > 0){
				for(let i = 0, len = nodes.length; i < len; i++){
					if(nodes[i].id == id){
						tree.selectNode(nodes[i]);
						break;
					}
				}
			}
		},
		setUpdateParentId(id,pId){
			let url = '/tm/businessGroup/modifyBusinessGroup?id=' + id + '&parentId=' + pId;
			this.$http.put(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){

				}else{
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				this.$hMessage.error('节点变更失败');
			})
		},
		closeFatherMsgBox(){
			this.father = {
				id: '',
				groupName: '',
				isLeaf: '0',
				parentId: '',
			};
			this.$refs['fatherForm'].resetFields();
			this.isSubmitForm = false;
			this.isShowFatherMsgBox = false;

		},
		submitFather(){
			this.$refs['fatherForm'].validate((valid) => {
				if(valid){
					if(this.isSubmitForm)return;
					this.isSubmitForm = true;
					this.setAddfield();
				}
			})
		},
		setAddfield(){
			let url = '/tm/businessGroup/modify';
			this.$http.put(url, this.father).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.getTree();
					this.closeFatherMsgBox();
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isSubmitForm = false;
			}).catch(err=>{
				this.isSubmitForm = false;
				this.$hMessage.error('提交失败');
			})
		},
		getList(goOn = false){
			if(this.isGetList && !goOn)return;
			this.isGetList = true;
			let url = '/tm/ruleConfig/getList?';
			let obj = copyDeep(this.listreq);
			this.$http.post(url,obj).then((res)=>{
				if(obj.groupId != this.listreq.groupId)return;
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.body ? oTmp.body : {};
					let total = data.total || 0;
					if(total && data.records && data.records.length == 0){
						this.listreq.currentPage = Math.ceil(total/this.listreq.pageSize)
						this.getList(true);
						return;
					}
					this.total = total;
					this.list = data.records;
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetList = false;
			}).catch(err=>{
				this.isGetList = false;
				this.$hMessage.error('获取规则列表失败');
			})
		},
		gethandleuserlist(){
			let url = '/tm/role/getuserlist?rolecode=Guest';
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.updaterList = oTmp.data || [];
				}else{
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				this.$hMessage.error('获取更新人列表失败');
			})
		},
	},
	mounted() {
		let tabList = this.$store.state.tabList;
		if(tabList.indexOf('/extract/rule/add') == -1 && localStorage.extract_rule_add_content){
			this.$hMsgBox.confirm({
				title:'温馨提示',
				content: '发现异常未保存的配置规则，继续编辑？',
				onOk:()=>{
					this.$router.push('/extract/rule/add?localSto=1');
				},
				onCancel:()=>{
					localStorage.extract_rule_add_content = '';
				}
			})
		}
		this.gethandleuserlist();
		this.getList();
		this.getTree();
	},
	activated: function(){
		this.getTree(true);
		this.getList(true);
	},
};
</script>
<style type="text/css" scoped>
.i.add{
	line-height:0;
	margin:0;
	width:16px;
	height:16px;
	display: inline-block;
	vertical-align:middle;
	border:0 none;
	cursor: pointer;
	outline:none;
	background-color:transparent;
	background-repeat:no-repeat;
	background-attachment: scroll;
	background-image:url("../../../../assets/css/img/zTreeStandard.png");
	*background-image:url("../../../../assets/css/img/zTreeStandard.gif");
	background-position: -144px 0;
	font-size: 0;
}
.rule{
	font-size: 0;
	position: relative;
}
.ruleleft{
	width: 250px;
	vertical-align: top;
	border: 1px solid #dfdfdf;
	height: 100%;
	margin-right: 15px;
	box-sizing: border-box;
	display: inline-block;
	font-size: 12px;
	position: relative;
}
.rule_tree{
	overflow-y: auto;
	height: 100%;
}
.rule-right{
	width: calc(100% - 265px);
	vertical-align: top;
	height: 100%;
	border: 1px solid #dfdfdf;
	box-sizing: border-box;
	display: inline-block;
	font-size: 12px;
	position: relative;
	overflow: auto;
	box-sizing: border-box;
	padding: 10px;
}
.rule>>> .ztree li span.button.add{
	margin-left: 5px;
	margin-right: 0;
	background-position: -144px 0;
	vertical-align: top;
	*vertical-align: middle;
}
.rule>>> .ztree li span.button.addfolder{
	margin-left: 5px;
	margin-right: 0;
	background: url(../../../../assets/css/img/diy/folder.png) no-repeat scroll 0 0 transparent;
	vertical-align:top;
	*vertical-align:middle
}
.rule>>> .ztree li span.button.copy{
	margin-left: 5px;
	margin-right: 0;
	background: url(../../../../assets/css/img/diy/copy.png) no-repeat scroll 0 0 transparent;
	vertical-align:top;
	*vertical-align:middle
}
.rule>>> .ztree li span.button.edit, .rule>>> .ztree li span.button.remove{
	margin-left: 5px;
	margin-right: 0;
}

.rule>>> .ztree li span.button.father_ico_open{
	margin-right: 2px;
	background-position: -110px -16px;
	vertical-align: top;
	*vertical-align: middle;
}
.rule>>> .ztree li span.button.father_ico_close,.rule>>> .ztree li span.button.father_ico_docu{
	margin-right: 2px;
	background-position: -110px 0;
	vertical-align: top;
	*vertical-align: middle;
}
.rule>>> .ztree li span.button.child_ico_docu,.rule>>> .ztree li span.button.child_ico_docu{
	margin-right: 2px;
	background-position: -110px -32px;
	vertical-align: top;
	*vertical-align: middle;
}
.rule>>> .tab-operation{
	text-align: center;
}
.rule>>> .tab-operation > span{
	margin-right:5px;
	color: #298DFF;
	cursor: pointer;
}
.title{
	padding: 6px 0;
	font-weight: 600;
}
.title span{
	float: right;
	cursor: pointer;
	font-weight: normal;
	color: #298DFF;
}
.textareabox .list{
	margin-top: 15px;
}
.btnbox{
	padding-top: 10px;
	text-align: center;
	background: #f7f7f7;
	z-index: 99;
}
.dateFn{
	margin-right: 10px;

}
.ps{
	line-height: 1;
}
.position{
	display: flex;
}
.position .list{
	width: 50%;
	padding: 5px;
	border: 1px solid #dfdfdf;
}
.position .list:first-child{
	border-right: none;
}
.position .ztree-box{
	width: 100%;
	overflow: auto;
}
.position .ztree-box .ps{
	padding-left: 10px;
	height: 24px;
	line-height: 24px;
}
.ruleList{
	font-size: 0;
}
.ruleList.ps{
	line-height: 24px;
	height: 24px;
	font-size: 12px;
	padding-left: 10px;
}
.ruleList .ruleListleft{
	font-size: 14px;
	width: 200px;
	display: inline-block;
	vertical-align: top;
	padding: 5px;
	border: 1px solid #dfdfdf;
	height: 301px;
}
.ruleListleft ul{
	height: calc(100% - 24px);
	overflow: auto;
}
.ruleListleft ul li{
	height: 18px;
}
.ruleListleft .button{
	display: none;
}
.ruleListleft>>> .curSelectedNode .button{
	display: inline-block;
}
.ruleListleft a:hover .button{
	display: inline-block;
}

.ruleList .ruleListright{
	padding: 5px;
	font-size: 14px;
	width: calc(100% - 200px);
	display: inline-block;
	vertical-align: top;
	border: 1px solid #dfdfdf;
	border-left: 0;
	height: 301px;
}
.fnList{
	padding: 0 10px;
	border: 1px solid #00f;
	margin-right: 10px;
	line-height: 28px;
	border-radius: 2px;
	display: inline-block;
}
.add-fn{
	text-align: right;
}
.add-fn span{
	cursor: pointer;
	color: #298DFF;
}
.h-spin{
	font-size: 12px;
	z-index: 10;
}
.testfile{
	position: relative;
}
.testcontents .uploadfile{
	line-height: 32px;
	margin-bottom: 10px;
}
.testcontents .h-upload{
	display: inline-block;
}
.testcontents>>> .test-btn{
	color:#298DFF;
	text-align: center;
	cursor: pointer;
}
.table-list{
	position: relative;
}
div#rMenu {
	position:absolute;
	display:none;
	padding: 5px 10px;
	line-height: 22px;
	z-index: 99;
	background-color: #fff;
	border-radius: 2px;
	border: 1px solid #dfdfdf;
	box-shadow: 1px 1px 2px #ccc;
	font-size: 12px;
}
div#rMenu ul li:hover{
	cursor: pointer;
	color:#298DFF;
}
</style>
<style lang="scss" scoped>
.rule{
  .rule-right{
    /deep/ .col_3{
      width: calc((100% - 15px) / 3);
      dl{
        dt{
          //width: 80px;
        }
        dd{
          //width: calc(100% - 80px);
        }
      }
    }
  }
}
</style>
