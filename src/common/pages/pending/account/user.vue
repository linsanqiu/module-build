<template>
	<div class='user'>
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>关键字：</dt>
						<dd><h-input v-model="strUserKeyword" placeholder="用户名/姓名/邮箱" @on-keyup.enter="onSearchUserList"></h-input></dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>状态：</dt>
						<dd>
							<h-select v-model="intUserStatus" :clearable="false">
								<h-option value="-1" >不限</h-option>
								<h-option value="0" >禁用</h-option>
								<h-option value="1" >正常</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>角色：</dt>
						<dd>
							<h-select v-model="intUserIsRole" :clearable="false">
								<h-option value="-1" >不限</h-option>
								<h-option value="0" >无角色</h-option>
								<h-option value="-9" :disabled="true">———————————</h-option>
								<h-option :value="item.id" v-for="item in aryRole" :key="item.id">{{ item.roleName }}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="onSearchUserList">查询</h-button>
					<h-button type="primary" @click="showAddUserFn" v-if="activeRoutersButton.indexOf('add') != -1">新增</h-button>
					<h-button type="primary" @click="init">刷新</h-button>
				</li>
			</ul>
		</search-form>
		<div class="content-wrapper">
			<div class="list">
				<h-table :maxHeight="maxTableHeight" border class="full-max-height-table user-search-list-tab" size="small" :columns="aryHeaderData" :data="aryUserList"></h-table>
			</div>
			<div class="page-box">
				<h-page :total="intTotal" :page-size="intPageSize" :current="intPageNum" @on-change="onPageChange" show-total size="small"></h-page>
			</div>
			<Spin fix v-if="isSearchUseList">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</Spin>
		</div>
		<h-msgBox title="新增用户" v-model="isShowAddUser" :mask-closable="false" @on-close="onCloseAddUserBox" class-name="vertical-center-modal" :top="0" width="980">
			<div class="add-user-content">
				<div class="search">
					<input class="h-input" :class="{ 'input-error' : isKeywordError }"  v-model="strSearchUserKeyword" v-focus="isKeywordFocus" @focus="keywordFocusFn" placeholder="用户名/姓名/邮箱/部门" @keyup.enter="keywordSearch" />
					<h-button type="primary" @click="keywordSearch">搜索</h-button>
					<h-button type="primary" @click="aduserSync" :disabled="isAduserSync">同步域账号</h-button>
				</div>
				<div v-if="isKeywordSearch && strSearchUserVal" class="search-result">搜索结果 > "<span>{{ strSearchUserVal }}</span>"</div>
				<div class="list">
					<h-checkbox-group v-model="arySelectUserList" @on-change="changeSelectUserList">
					<h-table border id="add-user-tab" height="300" size="small" :row-class-name="rowClassName" :loading="isSearch" :columns="aryAddListHeader" :data="aryAddUserList">
					</h-table>
					</h-checkbox-group>
				</div>
				<div class="page-box">
					<p class="msg">已选：{{ intSelectUserListCount }}</p>
					<span>共{{ intAddUserListCount }}条</span>
					<span>{{ intCompanyPageNum ? intCompanyPageNum : 1 }}/{{ intCompanyPageNum && intAddUserListCount ? Math.ceil(intAddUserListCount / intCompanypageSize) : 1 }}</span>
				</div>
			</div>
			<div slot="footer" class="add-user-footer">
				<h-button @click="onCloseAddUserBox">取消</h-button>
				<h-button type="primary" @click="addUserNext">下一步</h-button>
			</div>
		</h-msgBox>
		<h-msgBox title="修改用户信息" v-model="isShowUserForm"  @on-close="onCloseUserUpdataBox" class-name="vertical-center-modal" :top="0">
			<div class="user-form-content">
				<h-form :model="objUserInfo" :label-width="80" :rules="ruleValidate" ref="userform">
					<h-form-item label="用户名：">
						<h-input type="text" v-model="objUserInfo.userName" disabled autocomplete="off">
						</h-input>
					</h-form-item>
					<h-form-item label="真实姓名：">
						<h-input type="text" v-model="objUserInfo.realName" disabled autocomplete="off">
						</h-input>
					</h-form-item>
					<h-form-item label="手机号码：" prop="mobile">
						<h-input v-model="objUserInfo.mobile" autocomplete="off">
						</h-input>
					</h-form-item>
					<h-form-item label="邮箱：" prop="email">
						<h-input type="text" v-model="objUserInfo.email" autocomplete="off">
						</h-input>
					</h-form-item>
				</h-form>
			</div>
			<div slot="footer" class="user-form-footer">
				<h-button @click="onCloseUserUpdataBox">取消</h-button>
				<h-button type="primary" @click="setReqUpdataUserInfo" :loading="isUpdataUserInfo" >提交</h-button>
			</div>
		</h-msgBox>
		<h-msgBox :title="strType == 'updata' ? '更改角色' : '绑定角色'" v-model="isShowRoleForm"  @on-close="onCloseRoleBox" class-name="vertical-center-modal" :top="0">
			<div class="role-form-content">
				<h-checkbox-group v-model="arySelectRoleList">
					<template v-for="(data,key) in aryRole">
						<h-checkbtn :value="data.id" :label="data.roleName">
							<span>{{ data.roleName }}</span>
						</h-checkbtn>
					</template>
				</h-checkbox-group>
			</div>
			<div slot="footer" class="roke-form-footer">
				<h-button @click="onCloseRoleBox">取消</h-button>
				<h-poptip
					class="poptip"
					width="150"
					confirm
					title="是否提交？"
					@on-ok="setReqUpdataRole"
					ok-text="是"
					cancel-text="否">
					<h-button type="primary" :loading="isReqUpdataRole || isReqAddUser" >提交</h-button>
				</h-poptip>
			</div>
		</h-msgBox>
	</div>
</template>
<script>
	import $ from 'jquery';
	export default {
		name: 'AccountUser',
		data () {
			return {
				isAduserSync: false,
				strType: 'updata',
				activeRoutersButton: this.$store.state.activeRoutersButton,
				isKeywordError: false,
				isKeywordFocus: false,
				isKeywordSearch: false,
				isShowAddUser: false,
				isSearch: false,
				isReqAddUser: false,
				strSearchUserVal: '',
				strSearchUserKeyword: '',
				isAllowSearch: true,
				intCompanyPageNum: 0,
				intCompanypageSize: 20,
				intSelectUserListCount: 0,
				allCheckbox: false,
				aryAddListHeader: [
					{
						title: ' ',
						width: 60,
						align: 'center',
						renderHeader: (h, column) =>{
							let _this = this;
							return h('hCheckbox',{
									props: {
            							label: -99,
									},
									on:{
										'on-click': (event,stautus)=>{
											_this.allCheckbox = true;
										}
									}
								})
						},
						render: (h, params) => {
							let isDisabled = false;
							if(params.row.userId){
								isDisabled = true;
							}
							let _this = this;
							return h('hCheckbox',{
									props: {
										label: params.index,
										disabled: isDisabled
									},
								})
						}
					},
					{
						title: '用户名',
						key: 'userName',
						width: 150,
					},{
						title: '姓名',
						width: 150,
						key: 'realName'
					},{
						title: '邮箱',
						key: 'email',
						width: 180,
					},{
						title: '手机号码',
						width: 120,
						key: 'mobile'
					},{
						title: '部门',
						key: 'department'
					}
				],
				aryAddUserList: [],
				arySelectUserList: [],
				intAddUserListCount: 0,
				aryUserList: [],
				intPageNum: 1,
				intPageSize: 12,
				intTotal: 0,
				isSearchUseList: false,
				aryHeaderData: [
					{
						title: '用户名',
						key: 'userName',
						width: 100,
					},{
						title: '姓名',
						key: 'realName',
						width: 120,
					},{
						title: '手机号码',
						key: 'mobile',
						width: 120,
					},{
						title: '邮箱',
						key: 'email',
						width: 180,
					},{
						title: '部门',
						key: 'deptName',
						width: 130,
						render: (h, params) => {
							return h('Tooltip', {
								props: {
									placement: 'top-start',
									content: params.row.fullDeptName
								},
							},[
								h('div',params.row.deptName)
							])
						}
					},{
						title: '状态',
						width: 120,
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
												this.setUsetStatus(params.index,status);
											}
										}
									},[
										h('span',{
											slot: 'open',
										},'正常'),
										h('span',{
											slot: 'close',
										},'禁用')
									])
								]);
							}else{
								let strStatus = '';
								if(params.row.status == 1){
									strStatus = '正常'
								}else{
									strStatus = '禁用'
								}
								return h('div', strStatus)
							}
						}
					},{
						title: '角色',
						render: (h, params) => {
							let objRow = params.row ? params.row : {};
							let aryList = objRow.roles ? objRow.roles : [];
							let strDepts = '';
							for(let i = 0 ;i < aryList.length; i++){
								strDepts += aryList[i].roleName;
								if(i != aryList.length -1){
									strDepts += ',';
								}
							}
							return h('div', {},strDepts)
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
										title: '修改用户信息'
									},
									on: {
										click: () => {
											this.onUserUpdataBtn(params.index)
										}
									}
								})
							}
							let changeRloeBtn = null;
							if(this.activeRoutersButton.indexOf('changeRole') != -1){
								changeRloeBtn = h('i', {
									class: {
										'iconfont': true,
										'icon-t-b-jurisdiction': true,
										'tab-icon-btn': true,
									},
									attrs:{
										title: '更改角色'
									},
									on: {
										click: () => {
											this.onUserRoleBtn(params.index)
										}
									}
								})
							}
							return h('div', [redactBtn,changeRloeBtn]);
						}
					}
				],
				strUserKeyword: '',
				intUserStatus: '-1',
				intUserIsRole: '-1',
				objUserInfo: {
					id: '',
					userName: '',
					realName: '',
					mobile: '',
					email: '',
				},
				isShowUserForm: false,
				isUpdataUserInfo: false,
				intSelectUserIndex: 0,
				aryRole: [],
				isShowRoleForm: false,
				isReqUpdataRole: false,
				arySelectRoleList: [],
				ruleValidate:{
					mobile:[
						{ validator: (rule, value, callback) => {
							if(value){
								if(!(/^1(3|4|5|7|8)\d{9}$/.test(value))){ 
									callback('手机格式不正确');
									return;
								}
							}
							callback();
						}, trigger: 'blur' }
					],
					email: [
						{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
					]
				}
			}
		},
		computed: {
			maxTableHeight(){ return this.$store.state.maxTableHeight },
		},
		methods: {
			showAddUserFn(){
				this.onCloseAddUserBox();
				this.isShowAddUser = true;
			},
			changeSelectUserList(list){
				if(this.allCheckbox){
					this.allCheckbox = false;
					if(list.indexOf(-99) == -1){
						this.intSelectUserListCount = 0;
						this.arySelectUserList = [];
					}else{
						let len = this.aryAddUserList.length;
						let ary = [-99];
						for(let i = 0; i <len; i++){
							ary.push(i)
						}
						this.intSelectUserListCount = len;
						this.arySelectUserList = ary;
					}
				}else{
					let index = list.indexOf(-99);
					let len = list.length;
					if(index == -1){
						this.intSelectUserListCount = len;
						if(this.intCompanyPageNum * this.intCompanypageSize == len || len == this.intAddUserListCount){
							this.arySelectUserList.push(-99)
						}
					}else{
						this.intSelectUserListCount = len - 1;
						this.arySelectUserList.splice(index,1)
					}
				}
			},
			keywordFocusFn(){
				this.isKeywordFocus = false;
			},
			keywordSearch(){
				let Keyword = this.strSearchUserKeyword.trim()
				this.isKeywordSearch = true;
				this.isKeywordError = false;
				$("#add-user-tab .h-table-body").scrollTop(0);
				this.strSearchUserVal = Keyword.toString();
				this.isAllowSearch = true;
				this.intCompanyPageNum = 0;
				this.intSelectUserListCount = 0;
				this.aryAddUserList = [];
				this.arySelectUserList = [];
				this.getCompanyUserList();
			},
			/*获取新增用户列表*/
			getCompanyUserList(){
				if(this.isSearch)return;
				this.isSearch = true;
				//this.arySelectUserList = [];
				this.intCompanyPageNum++;
				let url = '/tm/aduser/page?pagenum='+ this.intCompanyPageNum +'&pagesize=' + this.intCompanypageSize + '&keyword='+ encodeURIComponent(this.strSearchUserVal);
				this.$http.get(url).then((res)=>{
					this.isSearch = false;
					let tmpObj = res.data;
					if(tmpObj.status == this.$api.SUCCESS){
						let data = tmpObj.data ? tmpObj.data : {};
						let list = data.list ? data.list : [];
						this.aryAddUserList =  this.aryAddUserList.concat(list);
						this.intAddUserListCount = data.total ? data.total : 0;
						if(this.aryAddUserList.length == data.total){
							this.isAllowSearch = false;
						}
						let index = this.arySelectUserList.indexOf(-99)
						if(index != -1){
							this.arySelectUserList.splice(index,1)
						}
					}else{
						this.$hMessage.error(tmpObj.msg);
						//this.intAddUserListCount = 0;
						//this.aryAddUserList = [];
					}
				}).catch(err=>{
					this.$hMessage.error('发生未知错误，获取列表失败!');
					this.isSearch = false;
	        	})
			},
			/*关闭新增用户弹框*/
			onCloseAddUserBox(){
				$("#add-user-tab .h-table-body").scrollTop(0);
				this.strSearchUserVal = '';
				this.intCompanyPageNum = 0;
				this.isShowAddUser = false;
				this.isSearch = false;
				this.strSearchUserKeyword = '';
				this.aryAddUserList = [];
				this.arySelectUserList = [];
				this.intSelectUserListCount = 0;
				this.intAddUserListCount = 0;
				this.isKeywordError = false;
				this.isKeywordSearch = false;
				this.isReqAddUser = false;
			},
			/*分页页码改变的回调*/
			onPageChange(page){
				this.intPageNum = page;
				this.getUserList();
			},
			/*on*/
			onSearchUserList(){
				this.intPageNum = 1;
				this.getUserList();
			},
			/*获取用户列表*/
			getUserList(){
				if(this.isSearchUseList)return;
				this.isSearchUseList = true;
				let userStatus = this.intUserStatus == -1 ? '' : this.intUserStatus;
				let existRole = this.intUserIsRole == -1 ? '' : this.intUserIsRole.toString();
				let roleid = '';
				if(existRole !== '0' && existRole !== ''){
					roleid = existRole;
					existRole = '1';
				}
				let url = '/tm/user/page?pagenum='+this.intPageNum+'&pagesize='+ this.intPageSize +'&existrole='+ existRole +'&roleid='+ roleid +'&status='+ userStatus +'&keyword='+ encodeURIComponent(this.strUserKeyword);
				this.$http.get(url).then((res)=>{
					this.isSearchUseList = false;
					let tmpObj = res.data;
					if(tmpObj.status == this.$api.SUCCESS){
						let tmpData = tmpObj.data ? tmpObj.data : {}; 
						this.aryUserList = tmpData.list ? tmpData.list : [];
						this.intTotal = tmpData.total ? tmpData.total : 0;
						if(this.intTotal && this.aryUserList.length == 0){
							this.intPageNum = Math.ceil(this.intTotal/this.intPageSize)
							this.getUserList();
						}
					}else{
						this.$hMessage.error(tmpObj.msg);
						this.intTotal = 0;
						this.aryUserList = [];
					}
				}).catch(err=>{
					this.$hMessage.error('发生未知错误，获取列表失败!');
					this.intTotal = 0;
					this.aryUserList = [];
					this.isSearchUseList = false;
	        	})
			},
			/*用户状态变更事件*/
			setUsetStatus(key,status){
				let _this = this;
				let userName = this.aryUserList[key].userName;
				let realName = this.aryUserList[key].realName;
				
				if(status){
					_this.setReqUsetStatus(key,status);
					return;
				}
				this.$hMsgBox.confirm({
					title: '温馨提示',
					content: '是否禁用用户“'+realName+'['+userName+']”？',
					okText: '是',
					cancelText: '否',
					onOk: function(){
						_this.setReqUsetStatus(key,status);
					},
					onCancel: function(){
						_this.rollbackUsetStatus(key,status);
					}
				})
			},
			/*回滚用户状态*/
			rollbackUsetStatus(key,status){
				let tmpInfo = {...this.aryUserList[key]};
				tmpInfo.status = !status;
				this.$set(this.aryUserList,key,tmpInfo);
			},
			/*向服务器更新用户状态*/
			setReqUsetStatus(key,status){
				let userStatus = status ? 1 : 0;
				let userId = this.aryUserList[key].id;
				let url = '/tm/user/status?userid='+ userId +'&status='+userStatus;
				this.$http.get(url).then((res)=>{
					let tmpObj = res.data;
					if(tmpObj.status != this.$api.SUCCESS){
						this.$hMessage.error(tmpObj.msg);
						this.rollbackUsetStatus(key,status);
					}
				}).catch(err=>{
					this.$hMessage.error('发生未知错误，更改状态失败!');
					this.rollbackUsetStatus(key,status);
				})
			},
			/*添加用户下一步*/
			addUserNext(){
				//没有勾选到用户
				if(this.intSelectUserListCount == 0){
					this.$hMessage.error('请选择用户!');
					return;
				}
				const list = this.arySelectUserList;
				const len = list.length;
				let ary = [];
				for(let i = 0; i <len ; i++){
					let data = this.aryAddUserList[list[i]];
					if(data && !data.userId){
						ary.push(data)
					}
				}
				if(ary.length == 0){
					this.$hMessage.error('没有需要新增的用户，请重新选择!');
					return;
				}
				this.strType = 'addUser';
				this.isShowRoleForm = true;
			},
			/*向服务器发送新增用户请求*/
			setReqAddUser(){
				if(this.isReqAddUser)return;
				this.isReqAddUser = true;
				let url = '/tm/user/add/batch';
				const list = this.arySelectUserList;
				const len = list.length;
				let ary = [];
				for(let i = 0; i <len ; i++){
					let data = this.aryAddUserList[list[i]];
					if(data && !data.userId){
						ary.push(data)
					}
				}
				if(ary.length == 0){
					this.isReqAddUser = false;
					this.$hMessage.error('没有新增用户，请重新选择!');
					return;
				}
				this.isSearch = true;
				this.$http.post(url,{users: ary, roleIds : this.arySelectRoleList}).then((res)=>{
					this.isSearch = false;
					this.isReqAddUser = false;
					let tmpObj = res.data;
					if(tmpObj.status != this.$api.SUCCESS){
						this.$hMessage.error(tmpObj.msg);
						return;
					}
					for(let i = 0; i <len ; i++){
						let data = this.aryAddUserList[list[i]];
						if(data && !data.userId){
							data.userId = 99;
						}
					}
					this.$hMessage.success('新增用户成功');
					this.arySelectUserList = [];
					this.intSelectUserListCount = 0;
					this.getUserList();
					this.onCloseRoleBox();
				}).catch(err=>{
					this.isSearch = false;
					this.isReqAddUser = false;
					this.$hMessage.error('发生未知错误，新增用户失败!');
				})
			},
			/*点击修改信息按钮*/
			onUserUpdataBtn(index){
				this.isShowUserForm = true;
				this.intSelectUserIndex = index;
				let tmpObj = {...this.aryUserList[index]};
				this.objUserInfo = {
					id: tmpObj.id,
					userName: tmpObj.userName,
					realName: tmpObj.realName,
					mobile: tmpObj.mobile,
					email: tmpObj.email,
				}
			},
			/*关闭修改用户信息框*/
			onCloseUserUpdataBox(){
				this.isShowUserForm = false;
				this.objUserInfo = {
					id: '',
					userName: '',
					realName: '',
					mobile: '',
					email: '',
				}
				this.$refs['userform'].resetFields();
			},
			/*向服务器发送更新用户信息*/
			setReqUpdataUserInfo(){
				this.$refs['userform'].validate((valid) => {
					if (valid) {
						if(this.isUpdataUserInfo)return;
						let url = '/tm/user/save';
						this.$http.post(url,this.objUserInfo).then((res)=>{
							this.isUpdataUserInfo = false;
							let tmpObj = res.data;
							if(tmpObj.status != this.$api.SUCCESS){
								this.$hMessage.error(tmpObj.msg);
								return;
							}
							this.onCloseUserUpdataBox();
							if(tmpObj.data){
								this.$set(this.aryUserList,this.intSelectUserIndex,tmpObj.data);
							}
						}).catch(err=>{
							this.isUpdataUserInfo = false;
							this.$hMessage.error('发生未知错误，修改用户信息失败!');
						})
                    }
				})
			},
			/*点击修改用户角色按钮*/
			onUserRoleBtn(index){
				let tmpAryRoles = this.aryUserList[index].roles ? this.aryUserList[index].roles : [];
				for(let i = 0; i < tmpAryRoles.length; i++){
					this.arySelectRoleList.push(tmpAryRoles[i].id);
				}
				this.strType = 'updata';
				this.intSelectUserIndex = index;
				this.isShowRoleForm = true;
			},
			/*关闭角色框*/
			onCloseRoleBox(){
				this.isReqUpdataRole = false;
				this.isShowRoleForm = false;
				this.arySelectRoleList = [];
			},
			/*获取全部角色*/
			getAllRole(){
				if(this.activeRoutersButton.indexOf('changeRole') != -1 || this.activeRoutersButton.indexOf('add') != -1){
					let url = '/tm/role/all';
					this.$http.get(url).then((res)=>{
						let tmpObj = res.data;
						if(tmpObj.status != this.$api.SUCCESS){
							this.$hMessage.error(tmpObj.msg);
							return;
						}
						this.aryRole = tmpObj.data ? tmpObj.data : []; 
					}).catch(err=>{
						//
					})
				}
			},
			/*向服务器发送更新角色*/
			setReqUpdataRole(){
				/*新增用户绑定角色*/
				if(this.strType != 'updata'){
					if(this.arySelectRoleList.length == 0){
						this.$hMessage.error('请选择角色!');
						return;
					}
					this.setReqAddUser();
					return;
				}
				if(this.isReqUpdataRole)return;
				this.isReqUpdataRole = true;
				let url = '/tm/user/role/save';
				let userid = this.aryUserList[this.intSelectUserIndex].id;
				let data = { roles: this.arySelectRoleList, users:[userid] }
				this.$http.post(url,data).then((res)=>{
					this.isReqUpdataRole = false;
					let tmpObj = res.data;
					if(tmpObj.status != this.$api.SUCCESS){
						this.$hMessage.error(tmpObj.msg);
						return;
					}
					this.onCloseRoleBox();
					this.$set(this.aryUserList,this.intSelectUserIndex,tmpObj.data);
				}).catch(err=>{
					this.isReqUpdataRole = false;
					this.$hMessage.error('发生未知错误，修改用户角色失败!');
				})
			},
			/**/
			rowClassName(row, index){
				if(row.userId){
					return 'table-disabled';
				}
				return '';
			},
			/*初始化*/
			init(){
				this.getUserList();
				this.getAllRole();
			},
			scrollFn(){
				$("#add-user-tab .h-table-body").scroll(()=>{
					let top = $("#add-user-tab .h-table-body").scrollTop();
					let box = $("#add-user-tab .h-table-body").height();
					let height = $("#add-user-tab .h-table-body > table").height();
					if(height - box - top <= 20 && this.isAllowSearch){
						this.getCompanyUserList();
					}
				});
			},
			/*同步域账号*/
			aduserSync(){
				if(this.isAduserSync)return;
				this.isAduserSync = true;
				let url = '/tm/aduser/sync';
				this.$hMessage.info('正在同步域账号');
				this.$http.get(url).then((res)=>{
					this.isAduserSync = false;
					let tmpObj = res.data;
					if(tmpObj.status != this.$api.SUCCESS){
						this.$hMessage.error(tmpObj.msg);
						return;
					}
					this.$hMessage.success('同步域账号成功');
				}).catch(err=>{
					this.isAduserSync = false;
					this.$hMessage.error('发生未知错误，同步域账号失败!');
				})
			}
		},
		mounted(){
			this.init();
			this.scrollFn();
		}
	}
</script>
<style type="text/css" scoped>
.user > .search {
	line-height: 32px
}
.user > .search{
	width: 100%;
	display: inline-block;
}
.user > .search .h-input-wrapper,.user > .search .h-select{
	width: 220px;
	margin-right: 10px;
	vertical-align: top;
	float: left;
	margin-bottom: 10px;
}
.user > .search .h-select{
	width: 120px;
}
.user > .search .title,.user > .search .h-btn{
	float: left;
	margin-bottom: 10px;
}
.user > .search .h-btn{
	margin-right: 10px;
}
.add-user-content .search{
	margin-bottom: 10px;
}
.add-user-content .search .h-input-wrapper{
	width: 300px;
	margin-right: 10px;
	float: left;
}
.role-form-content{
	max-height: 300px;
	overflow: auto;
}
.role-form-content .h-checkbtn-wrapper{
	margin-bottom: 10px;
	margin-right: 10px;
}
.page-box{
	width: 100%;
	display: inline-block;
}
.page-box .msg{
	line-height: 24px;
	float: left;
}
.page-box span{
	line-height: 24px;
}
.search-result{
	color: #787878;
	line-height: 18px;
	margin-bottom: 10px;
}
.search-result span{
	font-weight: 700;
	color: #333;
}
.h-input{
	width: 220px;
}
.add-user-content .search .h-btn.h-btn-primary{
	margin-left: 10px;
	vertical-align: top;
}
.poptip{
	text-align: left;
}
.search .h-select{
	width: 160px!important;
}
</style>
<style type="text/css">
/*H-UI table无数据的时候，回出现滚动条*/
.add-user-content .h-table-tip .h-table-tiptext + table{
	display: none;
}
.user .user-search-list-tab .h-table-tip{
	border: none;
	overflow: hidden;
}
.add-user-content tr .h-table-cell label > span:last-child{
	display: none;
}
.add-user-content tr .h-table-cell label > span.h-checkbox{
	/* display: block; */
}
.add-user-content .table-disabled{
	color: #a2a2a2;
}
</style>