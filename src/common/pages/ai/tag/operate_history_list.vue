<template>
	<div>
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>时间范围：</dt>
						<dd>
							<h-date-picker placement="bottom-start"  type="daterange" format="yyyy-MM-dd" placeholder="开始日期-结束日期" :value="createDateRange" @on-change="onChangeModDateRangePicker" >
							</h-date-picker>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>处理状态：</dt>
						<dd>
							<h-select aria-placeholder="处理状态" placeholder="请选择处理状态" v-model="req.handleStatus" filterable clearable>
								<h-option
									v-for="(item, i) in handleStates"
									:value="item.value"
									:key="i">
									{{item.desc}}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>操作类型：</dt>
						<dd>
							<h-select aria-placeholder="操作类型" placeholder="请选择操作类型" v-model="req.operateType" filterable clearable>
								<h-option
									v-for="(item, i) in operateTypes"
									:value="item.value"
									:key="i">
									{{item.desc}}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>标签名称：</dt>
						<dd>
							<h-input aria-placeholder="标签名称" placeholder="请输入标签名称" @on-enter="onSearch" v-model="req.tagName" ref="tagName" @on-click="onEmpty(`tagName`)" icon="android-close"></h-input>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary"  v-if="activeRoutersButton.indexOf('tagOperateHistorySearch') != -1" @click="onSearch">查询</h-button>
					<h-button type="primary" v-if="activeRoutersButton.indexOf('tagOperateHistoryDelBatch') != -1" @click="delBatch">批量删除</h-button>
					<h-tooltip placement="top-end" content="请选择是否自动刷新表格的数据!">
						<h-switch size="large" v-model="isAutoRefreshTable">
							<div slot="open">
								<span>打开</span>
							</div>
							<div slot="close">
								<span>关闭</span>
							</div>
						</h-switch>
					</h-tooltip>
				</li>
			</ul>
		</search-form>
		<div class="contents-wrapper">
			<div class="table">
				<h-table class="full-max-height-table" :maxHeight="maxTableHeight" :columns="tagOperateHistoryTable" :data="tagOperateHistoryList" stripe border @on-selection-change="selectChange"  @on-select-cancel="cancelSelect"></h-table>
			</div>
			<div class="page">
				<template v-if="activeRoutersButton.indexOf('tagOperateHistoryDelBatch') != -1 ">
					<span class="check">当前已选择<i>{{ arrCheck.length }}</i>条</span>
				</template>
				<h-page :total="total" :page-size="req.size" :current="req.current" @on-change="onPageChange" size="small" @on-page-size-change="changePageSize" :page-size-opts="pageSizeOpts" show-elevator show-total show-sizer placement="top"></h-page>
			</div>
			<Spin fix v-if="isShowSpin">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</Spin>
		</div>
	</div>
</template>
<script>
import utils from "@/utils/index";
export default {
	name:'TbmTagOperate_history_list',
	data() {
		return {
			activeRoutersButton: this.$store.state.activeRoutersButton,
			operateTypes: [
				{
					desc: "删除",
					value: 0,
				},
				{
					desc: "添加",
					value: 1,
				},
			],
			handleStates: [
				{
					desc: "待处理",
					value: 0,
				},
				{
					desc: "已处理",
					value: 1,
				},
			],
			createDateRange: [],
			isShowSpin: false,
			isAutoRefreshTable: true,
			arrCheck: [],
			pageSizeOpts: [10, 20, 50, 100],
			req: {
				size: 10,
				current: 1,
				startTime: '',
				endTime: '',
				operateType: "",
				handleStatus: 0,  //默认查询待处理记录
				tagName: "",
			},
			total: 0,
			tagOperateHistoryList: [],
			tagOperateHistoryTable: [
				{
					key: "handleStatus",
					title: "标签状态",
					width: 80,
					align: "center",
				},
				{
					key: "tagId",
					title: "标签 BID",
					width: 200,
					align: "left",
				},
				{
					key: "tagName",
					title: "标签名称",
					width: 230,
					align: "left",
				},
				{
					key: "newsId",
					title: "资讯 ID",
					// sortable: true,
					width: 170,
					align: "left",
					"row-class-name": "disabled-user-selection",
					render: (h, params) => {
						let newsId = params.row.newsId;
						return h("a", {
							attrs: {
								title: "点击跳转到资讯打标详情页面!",
							},
							class: [
								"audit-common-link",
							],
							style: {
								color: "#298DFF !important",
								textDecoration: "none",
								cursor: "pointer",
								marginRight: "5px",
							},
							on: {
								click: (e) => {
									let alink = e.target;
									alink.style.color = "red";
									let routerPath = `/tbm/news/view`;
									this.skipNewsDetail(routerPath, newsId);
								},
							}
						}, newsId);
					},
				},
				{
					key: "category",
					title: "标签分类(一级)",
					width: 150,
					align: "center",
				},
				{
					key: "operateType",
					title: "标签操作类型",
					// width: 100,
					align: "center",
				},
				{
					key: "creator",
					title: "添加人",
					width: 100,
					align: "center",
					render: (h, params) => {
						let userName = params.row.creator;
						if (userName) {
							return h("div", [
								h("Icon", {
									props: {
										name: "person"
									}
								}),
								h("strong", userName),
							]);
						} else {
							return h("div", [
								h("strong", userName),
							]);
						}
					},
				},
				{
					key: "createTime",
					title: "添加时间",
					width: 180,
					align: "center",
				},
				{
					key: "operation",
					title: "操作",
					width: 200,
					align: "center",
					fixed: "right",
					render: (h, params) => {
						let OperateList = [
							{
								operateDesc: "标记已处理",
								operateType: 1,
							},
							{
								operateDesc: "查看打标",
								operateType: 2,
							},
							{
								operateDesc: "删除",
								operateType: 3,
							},
						];
						let links = [];
						links = OperateList.map((obj, i) => {
							let {
								operateDesc: desc,
								operateType: type,
							} = obj;
							let operateUrl = "";
							let showBtn = false;
							switch (type) {
								case 1:  //标记已处理
									showBtn = params.row.handleStatus == '待处理' && this.activeRoutersButton.indexOf('markHandled') != -1 ? true : false;
									break;
								case 2:  // 查看打标
									showBtn = this.activeRoutersButton.indexOf('tagOperateHistoryDetail') != -1 ? true : false;
									break;
								case 3:  // 删除
									showBtn = this.activeRoutersButton.indexOf('tagOperateHistoryDelete') != -1 ? true : false;
									break;
								default:
									break;
							}
							if (showBtn) {
								return h("a", {
									attrs: {
										"data-url": operateUrl,
										"data-type": type,
									},
									class: [
										"audit-common-link",
									],
									style: {
										color: "#298DFF !important",
										textDecoration: "none",
										cursor: "pointer",
										marginRight: "5px",
									},
									on: {
										click: (e) => {
											if (type == 1) {
												// let handleStatus = params.row.handleStatus;
												// if (handleStatus == '已处理') {
												//     this.$hMessage.info({
												//         content: '改标签为已处理，不能重复操作！',
												//         duration: 3
												//     });
												//     return;
												// }
												this.handledById(params.row.id);
											};
											if (type == 2) {
												let routerPath = `/tbm/tag/news_view`;
												this.skipNewsDetail(routerPath, params.row.newsId);
											}
											if (type == 3) {
												this.$hMsgBox.confirm({
													isOkLeft:true,
													title: '删除记录',
													content: '确定要删除该条记录:' + params.row.tagName + '?',
													onOk: () => {
														let idArr = params.row.id.toString().split();
														this.handleDelete(idArr);
													}
												})
											};
										},
									}
								}, desc);
							}
						}
						);
						return h("div", links);
					},
				},
			],
			deleteItem: {
				ids: []
			}
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods: {
		// 查看打标详情
		skipNewsDetail(routerPath, newsId) {
			this.$router.push({ path: routerPath, query: { newsId: newsId, ref:this.$md5(`${newsId}TBM-COMPOSE`)}});
		},
		// 时间范围选择框更改时间
		onChangeModDateRangePicker(values) {
			this.createDateRange = values;
			this.req.startTime = values[0];
			this.req.endTime = values[1];
		},
		cancelSelect(selection, row) {
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
				this.tagOperateHistoryList.forEach((item, i) => {
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
			this.req.current = page;
			this.getTagOperateHistoryList();
		},
		changePageSize(size) {
			this.req.current = 1;
			this.req.size = size;
			this.getTagOperateHistoryList();
		},
		onSearch() {
			this.req.current = 1;
			this.getTagOperateHistoryList(true);
		},
		getTagOperateHistoryList(emptyCheck) {
			if (this.isShowSpin) return;
			this.isShowSpin = true;
			let url = '/tm/getTagOperateHistoryInfos';
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
					this.tagOperateHistoryList = list;
					this.total = data.total || 0;
				} else {
					this.$hMessage.error(obj.msg);
				}
			}).catch((err) => {
				this.isShowSpin = false;
				this.$hMessage.error('网络异常，获取标签增删统计信息数据失败！');
			});
		},
		delBatch() {
			if (this.arrCheck.length == 0) {
				this.$hMessage.info('请选择要删除的记录');
				return
			}
			this.$hMsgBox.confirm({
				isOkLeft:true,
				title: '批量删除',
				content: '共' + this.arrCheck.length + '条记录，是否确认删除?',
				onOk: () => {
					this.handleDelete(this.arrCheck)
				},
				onCancel: () => {
				},
			})
		},
		handleDelete(idArr) {
			let delStatus = false;
			if (delStatus) return
			let url = '/tm/batchRemoveByIds';
			this.$http.post(url, idArr).then((res) => {
				let data = res.data ? res.data : {};
				if (data.status == this.$api.SUCCESS) {
					this.$hMessage.info({
						content: '删除成功',
						duration: 3
					});
					this.onSearch();
				} else {
					this.$hMessage.error({
						content: data.msg,
						duration: 3
					})
				}
				delStatus = true;
			}).catch(err => {
				delStatus = true;
				this.$hMessage.error('网络异常，删除记录失败！');
			})
		},
		handledById(id) {
			let url = '/tm/handleById?id=' + id;
			this.$http.get(url).then((res) => {
				let data = res.data ? res.data : {};
				if (data.status == this.$api.SUCCESS) {
					this.$hMessage.info({
						content: '标记已处理！',
						duration: 3
					});
					this.onSearch();
				} else {
					this.$hMessage.error({
						content: data.msg,
						duration: 3
					})
				}
			}).catch(err => {
				this.$hMessage.error('网络异常，标记为已处理失败！');
			})
		},
		onEmpty(name) {
			this.req[name] = '';
			this.$refs[name].focus();
		},
		onEmptyCheck() {
			this.arrCheck = [];
		}
	},
	created() {
		if (this.activeRoutersButton.indexOf('tagOperateHistoryDelBatch') != -1) {
			this.tagOperateHistoryTable.unshift(
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
		this.getTagOperateHistoryList();
	},
	activated: function () {
		if (this.isAutoRefreshTable) {
			this.getTagOperateHistoryList();
		}
	},

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