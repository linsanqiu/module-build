<template>
	<div>
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>用户ID：</dt>
						<dd><h-input placeholder="请输入用户ID" v-model="req.userId" icon="android-close" @on-click="onEmpty('userId')" ref="userId"></h-input></dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>用户昵称：</dt>
						<dd><h-input placeholder="请输入用户昵称" v-model="req.nickname" icon="android-close" @on-click="onEmpty('nickname')" ref="nickname"></h-input></dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>姓名：</dt>
						<dd><h-input placeholder="请输入姓名" v-model="req.userName" icon="android-close" @on-click="onEmpty('userName')" ref="userName"></h-input></dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>性别：</dt>
						<dd>
							<h-select placeholder="请选择性别" v-model="req.sex">
								<h-option value="0">男</h-option>
								<h-option value="1">女</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>手机号：</dt>
						<dd>
							<h-input placeholder="请输入手机号" v-model="req.telephone" icon="android-close" @on-click="onEmpty('telephone')" ref="telephone"></h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>注册状态：</dt>
						<dd>
							<h-select placeholder="请选择注册状态" v-model="req.regStatus">
								<h-option value="0">未注册</h-option>
								<h-option value="1">已注册</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>认证状态：</dt>
						<dd>
							<h-select placeholder="请选择认证状态" v-model="req.rzStatus">
								<h-option value="0">未认证</h-option>
								<h-option value="1">认证通过</h-option>
								<h-option value="2">认证失败</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>开探状态：</dt>
						<dd>
							<h-select placeholder="请选择开探状态" v-model="req.probStatus">
								<h-option value="0">未开探</h-option>
								<h-option value="1">已开探</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>邀请码：</dt>
						<dd>
							<h-input placeholder="请输入邀请码" v-model="req.inviteCode" icon="android-close" @on-click="onEmpty('inviteCode')" ref="inviteCode"></h-input>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="onSearch">查询</h-button>
					<h-button type="primary" icon="android-download" @click="getExcel" v-if="activeRoutersButton.indexOf('download') != -1 ">导出</h-button>
				</li>
			</ul>
		</search-form>
		<div class="contents-wrapper">
			<div class="table">
				<h-table class="full-max-height-table" :maxHeight="maxTableHeight" :columns="userTable" :data="userList" :rowSelect="true" @on-selection-change="selectChange"  @on-select-cancel="cancelSelect" size="small" ></h-table>
			</div>
			<div class="page">
				<template v-if="activeRoutersButton.indexOf('download') != -1 ">
					<span class="check">当前已选择<i>{{ arrCheck.length }}</i>条</span>
				</template>
				<h-page :total="total" :page-size="req.pageSize" :current="req.pageCurrent" @on-change="onPageChange" size="small" @on-page-size-change="changePageSize" :page-size-opts="pageSizeOpts" show-elevator show-total show-sizer placement="top"></h-page>
			</div>
			<Spin fix v-if="isShowSpin">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</Spin>
		</div>
	</div>
</template>
<script>
export default {
	name: "TbmUser",
	data() {
		return {
			activeRoutersButton: this.$store.state.activeRoutersButton,
			isShowSpin: false,
			isAutoRefreshTable: true,
			arrCheck: [],
			pageSizeOpts: [10, 20, 50, 100],
			req: {
				pageSize: 10,
				pageCurrent: 1,
				userId: '',
				nickname: '',
				userName: '',
				sex: '',
				telephone: '',
				regStatus: '',
				rzStatus: '',
				probStatus: '',
				inviteCode: ''
			},
			total: 0,
			userList: [],
			userTable: [
				{
					width: 120,
					key: 'userId',
					fixed: 'left',
					title: '用户ID'
				}, {
					width: 120,
					key: 'nickname',
					title: '用户昵称'
				}, {
					width: 90,
					key: 'userName',
					title: '姓名'
				}, {
					width: 75,
					key: 'sex',
					title: '性别'
				}, {
					width: 110,
					key: 'telephone',
					title: '手机号'
				}, {
					width: 80,
					key: 'rzStatus',
					title: '认证状态'
				}, {
					width: 160,
					key: 'prodName',
					title: '所属企业'
				}, {
					width: 80,
					key: 'regStatus',
					title: '注册状态'
				}, {
					width: 150,
					key: 'regTime',
					title: '注册时间'
				}, {
					width: 120,
					key: 'inviteCode',
					title: '邀请码'
				}, {
					width: 80,
					key: 'claimStatus',
					title: '认领状态'
				}, {
					width: 80,
					key: 'probStatus',
					title: '开探状态'
				}, {
					width: 115,
					key: 'firstProbTime',
					title: '首次开探日期'
				}, {
					width: 150,
					key: 'finalLoginTime',
					title: '最近登录时间'
				}, {
					width: 150,
					key: 'updateTime',
					title: '更新时间'
				},
			],
			searchItem: {
				ids: []
			}
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods: {
		cancelSelect(selection, row) {
			//取消选择某一项
			let index = this.arrCheck.indexOf(row.id);
			if (index != -1) {
				this.arrCheck.splice(index, 1);
			}
		},
		selectChange(selection) {
			let selectArr = selection;
			let selectArrId = [];
			selectArr.forEach((item, index) => {
				selectArrId.push(item.id)
			})
			if (selectArr.length == 0) {
				//翻页——全选取消选择
				this.userList.forEach((item, i) => {
					let index = this.arrCheck.indexOf(item.id);
					if (index != -1) {
						this.arrCheck.splice(index, 1);
					}
				});
				return;
			} else {
				for (let i = 0, len = this.arrCheck.length; i < len; i++) {
					let index = selectArrId.indexOf(this.arrCheck[i]);
					if (index != -1) {
						selectArrId.splice(index, 1);
					}
				}
				this.arrCheck = [...this.arrCheck, ...selectArrId];
			}
		},
		/*分页*/
		onPageChange(page) {
			this.req.pageCurrent = page;
			this.getUserList();
		},
		changePageSize(size) {
			this.req.pageCurrent = 1;
			this.req.pageSize = size;
			this.getUserList();
		},
		onSearch() {
			this.req.pageCurrent = 1;
			this.getUserList(true);
		},
		getUserList(emptyCheck) {
			if (this.isShowSpin) return;
			this.isShowSpin = true;
			let url = '/tm/getAppCustomerInfo';
			let oTmp = this.req;
			this.$http.post(url, oTmp).then((res) => {
				this.isShowSpin = false;
				let obj = res.data;
				if (obj.status == this.$api.SUCCESS) {
					let data = obj.body || {};
					let list = data.records || [];
					if (emptyCheck) {
						this.arrCheck = [];
					} else {
						for (let i = 0, len = list.length; i < len; i++) {
							if (this.arrCheck.indexOf(list[i].id) != -1) {
								list[i]['_checked'] = true;
							}
						}
					}
					this.userList = list;
					this.total = data.total || 0;
				} else {
					this.$hMessage.error(obj.msg);
				}
			}).catch((err) => {
				this.isShowSpin = false;
				this.$hMessage.error('网络异常，获取金探用户信息数据失败！');
			});
		},
		getExcel() {
			if (this.isShowSpin) return;
			this.isShowSpin = true;
			let url = '/tm/exportAppCustomerInfo';
			let oTmp = {
				userId: this.req.userId,
				nickname: this.req.nickname,
				userName: this.req.userName,
				sex: this.req.sex,
				phone: this.req.telephone,
				registrationStatus: this.req.regStatus,
				certificationStatus: this.req.probStatus,
				explorationStatus: this.req.probStatus,
				inviteCode: this.req.inviteCode
			};
			if (this.arrCheck.length == 0) {
				for (let k in oTmp) {
					if (!oTmp[k]) {
						delete oTmp[k];
					}
				}
			} else {
				oTmp.ids = [...this.arrCheck];
			}
			this.$http.post(url, oTmp).then((res) => {
				this.isShowSpin = false;
				let data = res.data;
				if (data.status == this.$api.SUCCESS) {
					let downId = data.data || '';
					window.location.href = '/tm/downloadAppCustomerInfo?key=' + downId
				} else {
					this.$hMessage.error({ content: data.msg })
				}
			}).catch((err) => {
				this.isShowSpin = false;
				this.$hMessage.error('网络异常，导出数据失败！');
			});
		},
		/*清空数据 并焦点*/
		onEmpty(name) {
			this.req[name] = '';
			this.$refs[name].focus();
		},
		onEmptyCheck() {
			this.arrCheck = [];
		}
	},
	created() {
		if (this.activeRoutersButton.indexOf('download') != -1) {
			this.userTable.unshift(
				{
					type: 'selection',
					width: 50,
					align: 'center',
					fixed: 'left'
				},
			)
		}
	},
	mounted() {
		this.getUserList();
	}
}
</script>
<style type="text/css" scoped>
.h-checkbox-wrapper span + span {
  display: none;
}
.check {
  float: left;
  line-height: 24px;
  margin-right: 10px;
  color: red;
}
.check i {
  font-weight: 600;
  padding: 0 3px;
  font-style: normal;
}
</style>