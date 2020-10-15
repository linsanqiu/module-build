<template>
	<section>
		<search-form>
			<ul slot="content">
				<li class="row0"></li>
				<li class="row2">
					<dl>
						<dt>创建时间：</dt>
						<dd>
							<ul class="flex">
								<li>
									<h-date-picker
										type="date"
										format="yyyy-MM-dd HH:mm:ss"
										aria-placeholder="开始时间"
										:placeholder="placeholders.beginDate"
										:value="commonFilters.beginDate"
										@on-change="(value) => { onDatePickerChange('beginDate', value) }"
										:clearable="true">
									</h-date-picker>
								</li>
								<li class="to">-</li>
								<li>
									<h-date-picker
										type="date"
										format="yyyy-MM-dd HH:mm:ss"
										aria-placeholder="结束时间"
										:placeholder="placeholders.endDate"
										:value="commonFilters.endDate"
										@on-change="(value) => {onDatePickerChange(`endDate`, value)}"
										:clearable="true">
									</h-date-picker>
								</li>
							</ul>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>审核状态：</dt>
						<dd>
							<h-select
								placeholder="请选择审核状态"
								v-model="commonFilters.auditStatus"
								filterable
								:clearable="false">
								<h-option
									v-for="(item, i) in auditStates"
									:value="item.value"
									:key="i">
									{{item.title}}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>资讯源类型：</dt>
						<dd>
							<h-select
								@on-change="resourcesTypesSelectChange"
								placeholder="请选择资讯源类型"
								v-model="commonFilters.resourcesTypes"
								filterable
								multiple
								clearable>
								<h-option
									v-for="(item, i) in auditResourcesTypes"
									:value="item.value"
									:key="i">
									{{item.title}}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>资讯源：</dt>
						<dd>
							<h-input
								placeholder="请输入资讯源"
								v-model="commonFilters.newsResource"
								@on-change="onChangeInput(`newsResource`)"
								@on-enter="onChangeInputEnter(`newsResource`)"
								ref="newsResource"
								@on-click="shitClearableClick(`newsResource`)"
								icon="android-close">
							</h-input>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button
						type="primary"
						icon="search"
						data-ref="init-btn"
						@click="onClickButton(`search`)">
						查询
					</h-button>
					<h-tooltip
						placement="top-end"
						content="请选择是否自动刷新表格的数据!">
						<h-switch
							size="large"
							v-model="isAutoRefreshTable"
							@on-change="onChangeSwitch"
							>
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
		<div class="audit-common-content">
			<h-row class-name="audit-common-row-padding">
				<h-col span="24">
					<h-table
						class="full-max-height-table"
						:maxHeight="maxTableHeight"
						:columns="commonTableCols"
						:data="commonTableDatas"
						:loading="tableLoading"
						@on-selection-change="selectChange"
						size="small"
						border>
					</h-table>
				</h-col>
			</h-row>
			<h-row class-name="audit-common-row-padding">
				<h-col span="24">
					<div style="float: right;">
						<h-page
							@on-change="onPageChange"
							@on-page-size-change="onPageSizeChange"
							:total="pagination.total"
							:page-size="pagination.size"
							:current="pagination.current"
							show-elevator
							size="small"
							show-total>
							<!-- show-sizer -->
						</h-page>
					</div>
				</h-col>
			</h-row>
		</div>
	</section>
</template>
<script>
	/**
	 *
	 * @author xiagq
	 * @copyright gildata
	 *
	 * @created 2019.04.09
	 * @modified 2019.04.16
	 *
	 * @description InformationSourceAudit
	 * @augments
	 * @example
	 *
	 */
	import {
		TODAY,
		TODAY_Begin,
		TODAY_End,
		TODAY_TimeStamp,
	} from "./utils";
	import QrcodeVue from "qrcode.vue";
	export default {
		name: "AuditNewsInformation-source-audit",
		data () {
			return {
				isAutoRefreshTable: true,
				// isAutoRefreshTable: false,
				asyncButtonLoading: false,
				auditStates: [
					{
						title: "全部",
						value: "null",
						// value: null,
					},
					{
						title: "未审核",// 待审核
						value: "0",
						// value: 0,
					},
					{
						title: "已审核",
						value: "1",
						// value: 1,
					},
				],
				// type 资讯类型数组
				auditResourcesTypes: [],
				newsResources: [],
				commonFilters: {
					// beginDate: TODAY_Begin,
					// endDate: TODAY_End,
					beginDate: "",
					endDate: "",
					auditStatus: null,
					resourcesTypes: [],
					newsResource: "",
				},
				commonFiltersPagination: {
					// beginDate: TODAY_Begin,
					// endDate: TODAY_End,
					beginDate: "",
					endDate: "",
					auditStatus: null,
					resourcesTypes: [],
					newsResource: "",
				},
				placeholders: {
					beginDate: "开始日期",
					endDate: "结束日期",
					// beginDate: "请输入开始日期",
					// endDate: "请输入结束日期",
				},
				commonTableCols: [
					{
						type: "selection",
						width: 60,
						align: "center",
						fixed: "left",
					},
					{
						type: "index",
						title: "序号",
						width: 60,
						align: "center",
					},
					{
						key: "auditState",
						title: "审核状态",
						width: 200,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
					},
					{
						key: "exceptionReason",
						title: "资讯源异常原因",
						width: 200,
						align: "center",
					},
					{
						key: "newsResource",
						title: "资讯源",
						width: 200,
						align: "center",
						"row-class-name": "disabled-user-selection",
						render: (h, params) => {
							let url = params.row.newsResource;
							return h("a", {
								attrs: {
									title: "点击跳转到资讯!",
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
										// 处理 & autoSkip()
										window.parent.open(`http://${url}`);
									},
								}
							}, url);
						},
					},
					{
						key: "createDate",
						title: "创建时间",
						width: 200,
						align: "center",
					},
					{
						key: "latestAuditPerson",
						title: " 最近审核人",
						width: 200,
						align: "center",
						render: (h, params) => {
							let userName = params.row.latestAuditPerson;
							if (userName) {
								return h("div", [
									h("strong", userName),
								]);
							} else {
								return h("div", [
									h("Icon", {
										props: {
											name: "person"
										}
									}),
									// h("strong", userName),
								]);
							}
						},
					},
					{
						key: "latestAuditDate",
						title: "最近审核时间",
						width: 200,
						align: "center",
					},
					{
						key: "operation",
						title: "操作",
						width: 150,
						align: "center",
						fixed: "right",
						render: (h, params) => {
							let newsOperateVoList = [
								{
									title: "审核",
									url: "",
									type: 1,
								},
							];
							let {
								index: removeIndex,
								// newsResource: url,
								trueURL: url,
								auditUid: id,
							} = params.row;
							let links = [];
							links = newsOperateVoList.map(
								(obj, i) => {
									let {
										title: desc,
										type,
									} = obj;
									let operateUrl = ``;
									let routerPath = ``;
									switch (type) {
										case 1:
											operateUrl = `/tm/???`;
											routerPath = `/audit/news/information-source-audit/operate-handle`;
											break;
										default:
											operateUrl = `#type=删除`;
											break;
									}
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
												let alink = e.target;
												alink.style.color = "red";
												let options = {
													// path: routerPath,
													url,
													id,
												};
												if (type === 0) {
													// this.clickShowResureDeleteModal();
												} else {
													let new_type = "";
													switch (type) {
														case 1:
															new_type = "handle";
															break;
														case 2:
															new_type = "view";
															break;
														default:
															break;
													}
													if (type === 1) {
														window.sessionStorage.setItem(`information-source-audit_route_query_${new_type}`, JSON.stringify(options));
														this.$router.push(routerPath);
														// this.$router.push(`${routerPath}?${url}`);
													}
												}
											},
										}
									}, desc);
								}
							);
							return h("div", links);
						},
					},
				],
				commonTableColsUnselection: [

					{
						type: "index",
						title: "序号",
						width: 60,
						align: "center",
						fixed: "left",
					},
					{
						key: "auditState",
						title: "审核状态",
						width: 200,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
					},
					{
						key: "exceptionReason",
						title: "资讯源异常原因",
						width: 200,
						align: "center",
					},
					{
						key: "newsResource",
						title: "资讯源",
						width: 200,
						align: "center",
						"row-class-name": "disabled-user-selection",
						render: (h, params) => {
							let url = params.row.newsResource;
							return h("a", {
								attrs: {
									title: "点击跳转到资讯!",
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
										// 处理 & autoSkip()
										window.parent.open(`http://${url}`);
									},
								}
							}, url);
						},
					},
					{
						key: "createDate",
						title: "创建时间",
						width: 200,
						align: "center",
					},
					{
						key: "latestAuditPerson",
						title: " 最近审核人",
						width: 200,
						align: "center",
						render: (h, params) => {
							let userName = params.row.latestAuditPerson;
							if (userName) {
								return h("div", [
									// h("Icon", {
									//     props: {
									//         name: "person"
									//     }
									// }),
									h("strong", userName),
								]);
							} else {
								return h("div", [
									h("Icon", {
										props: {
											name: "person"
										}
									}),
									// h("strong", userName),
								]);
							}
						},
					},
					{
						key: "latestAuditDate",
						title: "最近审核时间",
						width: 200,
						align: "center",
					},
					{
						key: "operation",
						title: "操作",
						width: 150,
						align: "center",
						fixed: "right",
						render: (h, params) => {
							// let newsOperateVoList = params.row.newsOperateVoList;
							let newsOperateVoList = [
								{
									title: "审核",
									url: "",
									type: 1,
								},
								// {
								//     title: "删除",
								//     url: "",
								//     type: 0,
								// },
							];
							let {
								index: removeIndex,
								// newsResource: url,
								trueURL: url,
								auditUid: id,
							} = params.row;
							let links = [];
							links = newsOperateVoList.map(
								(obj, i) => {
									let {
										title: desc,
										type,
									} = obj;
									let operateUrl = ``;
									let routerPath = ``;
									switch (type) {
										case 1:
											operateUrl = `/tm/???`;
											routerPath = `/audit/news/information-source-audit/operate-handle`;
											break;
										default:
											operateUrl = `#type=删除`;
											break;
									}
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
												let alink = e.target;
												alink.style.color = "red";
												let options = {
													// path: routerPath,
													url,
													id,
												};
												if (type === 0) {
													// this.clickShowResureDeleteModal();
												} else {
													// 1：处理； 2：查看；
													let new_type = "";
													switch (type) {
														case 1:
															new_type = "handle";
															break;
														case 2:
															new_type = "view";
															break;
														default:
															break;
													}
													if (type === 1) {
														window.sessionStorage.setItem(`information-source-audit_route_query_${new_type}`, JSON.stringify(options));
														this.$router.push(routerPath);
														// this.$router.push(`${routerPath}?${url}`);
														// this.$router.push(`${routerPath}#${url}`);
													}
												}
											},
										}
									}, desc);
								}
							);
							return h("div", links);
						},
					},
				],
				commonTableDatas: [],
				initTableDatas: [],
				pagination: {
					current: 1,
					size: 12,
					total: 0,
					// total: 100,
				},
				tableLoading: false,
				isIndexesEmpty: true,
				isDeletePermission: false,
			};
		},
		computed: {
			maxTableHeight(){ return this.$store.state.maxTableHeight },
		},
		methods: {
			resourcesTypesSelectChange(values) {
				let types = this.commonFilters.resourcesTypes;
				// console.log(`commonFilters.resourcesTypes =`, JSON.stringify(types, null, 4));
			},
			onChangeSwitch(value = ``) {
				// console.log(`switch value =`, value, this.isAutoRefreshTable);
			},
			onDatePickerChange(type = ``, value) {
				console.log(`value =`, value);
				this.commonFilters[type] = value;
			},
			// filter methods
			// onChangeDatePicker (value) {
			//     console.log(`date value =`, value);
			// },
			onChangeInput (type = ``) {
				let value = this.commonFilters[type];
				this.commonFilters[type] = value.trim();
			},
			onChangeInputEnter (type = ``) {
				let value = this.commonFilters[type];
				this.commonFilters[type] = value.trim();
				this.onClickButton(`search`);
			},
			shitClearableClick(type = ``) {
				this.commonFilters[type] = ``;
				this.$refs[type].focus();
			},
			onChangeSelect (type = ``) {
				let value = this.commonFilters[type];
				// this.$hMessage.info(value);
			},
			onClickButton (clickType = ``) {
				let {
					beginDate: startTime,
					endDate: endTime,
					auditStatus,
					resourcesTypes: type,
					newsResource: source,
				}= this.commonFilters;
				this.commonFiltersPagination = {...this.commonFilters};
				// init
				this.pagination.current = 1;
				let {
					current,
					size,
				} = this.pagination;
				let options = {
					startTime,
					endTime,
					auditStatus,
					type,
					source,
					current,
					size,
				};
				switch (clickType) {
					case "search":
						this.getCommonTableDatas(options);
						break;
					default:
						// this.getCommonTableDatas(options);
						break;
				}
			},
			getNewTableDatas (pagination = {}) {
				let {
					beginDate: startTime,
					endDate: endTime,
					auditStatus,
					resourcesTypes: type,
					newsResource: source,
				}= this.commonFiltersPagination;
				let {
					current,
					size,
				} = pagination;
				let options = {
					startTime,
					endTime,
					auditStatus,
					type,
					source,
					current,
					size,
				};
				this.getCommonTableDatas(options);
			},
			onPageChange (current = 1) {
				this.pagination.current = current;
				let {
					size,
				} = this.pagination;
				this.getNewTableDatas({
					current,
					size,
				});
			},
			onPageSizeChange (size = 10) {
				this.pagination.size = size;
				let {
					current,
				} = this.pagination;
				this.getNewTableDatas({
					current,
					size,
				});
			},
			// table methods
			remove (index) {
				this.commonTableDatas.splice(index, 1);
			},
			tableSelectionChange(selection) {
				let indexes = [];
				let ids = [];
				if (selection.length) {
					ids = selection.map(
						(obj, i) => {
							if (obj) {
								let {
									newsResource,
								} = obj;
								return newsResource;
							}
						}
					);
					indexes = selection.map(
						(obj, i) => {
							if (obj) {
								let {
									index,
								} = obj;
								return index;
							}
						}
					);
					this.isIndexesEmpty = false;
				} else {
					this.isIndexesEmpty = true;
				}
				this.batchDeleteUids = ids;
			},
			selectChange(selection) {
				this.tableSelectionChange(selection);
			},
			getTrueTableIndex(datas = [], key = ``) {
				let trueTableIndex = ``;
				datas.forEach(
					(obj, i) => {
						let {
							index,
						} = obj;
						if (key === index) {
							trueTableIndex = i;
						}
					}
				);
				return trueTableIndex;
			},
			getCommonTableDatas (options = {}, debug = false) {
				this.tableLoading = true;
				let url = `/tm/getNewsSourceSignList`;
				this.$http
				.post(url, options)
				.then(res => res.data)
				.then((json)=>{
					let {
						status,
						msg,
						body,
					} = json;
					if(status != this.$api.SUCCESS){
						console.log(`资讯列表 json =`, JSON.stringify(json, null, 4));
						// this.$hMessage.error(msg);
						this.initTableDatas = [];
						this.commonTableDatas = [];
						this.tableLoading = false;
						return;
					} else {
						let {
							current,
							total,
							pages,
							size,
							records: listDatas,
							permitDelete: isDeletePermission,
						} = body;
						if (isDeletePermission === undefined) {
							isDeletePermission = false;
						} else {
							if (!isDeletePermission) {
								this.commonTableCols = this.commonTableColsUnselection;
							}
							this.isDeletePermission = isDeletePermission;
						}
						if (total) {
							this.pagination.total = total;
						} else {
							this.pagination.total = 0;
						}
						if (Array.isArray(listDatas) && listDatas.length) {
							this.initTableDatas = listDatas;
							listDatas = listDatas.map(
								(obj, i) => {
									let {
										auditStatusDesc: auditState,
										typeDesc: exceptionReason,
										source: newsResource,
										createTime: createDate,
										updateTime: latestAuditDate,
										auditUserName: latestAuditPerson,
										id: auditUid,
										newsUrl: newsURL,
									} = obj;
									if (exceptionReason.length) {
										exceptionReason = exceptionReason.join(";");
									}
									if (!latestAuditPerson) {
										latestAuditPerson = "";
									}
									let trueURL = ``;
									if (newsURL === null) {
										trueURL = `http://${newsResource}`;
										// trueURL = newsResource;
									} else {
										trueURL = newsURL;
									}
									return {
										index: i,
										// index: i + 1,
										auditState,
										exceptionReason,
										newsResource,
										createDate,
										auditState,
										latestAuditDate,
										latestAuditPerson,
										auditUid,
										newsURL,
										trueURL,
									};
								}
							);
						} else {
							listDatas = [];
						}
						this.commonTableDatas = listDatas;
						this.tableLoading = false;
					}
				}).catch(err => console.error(`处理状态  error`, err));
			},
			getWindowMaxWidth() {
				let maxWidth = window.screen.width || 1366;
				if (maxWidth < 1920) {
					this.pagination.size = 12;
				} else {
					this.pagination.size = 21;
				}
			},
			// 资讯列表
			fetchNewsSource(options = {}) {
				let url = `/tm/getNewsSourceSignList`;
				this.$http
				.post(url, options)
				.then(res => res.data)
				.then((json)=>{
					let {
						status,
						msg,
						body,
					} = json;
					if(status != this.$api.SUCCESS){
						this.$hMessage.error(msg);
						return;
					} else {
						// this.$hMessage.success(msg);
					}
				}).catch(err => console.error(`fetchNewsSource error`, err));
			},
			// 资讯类型
			fetchNewsTypes(listType = `auditResourcesTypes`) {
				let url = `/tm/getNewsSourceSignType`;
				this.$http
				.get(url)
				.then(res => res.data)
				.then((json)=>{
					let {
						status,
						msg,
						body,
					} = json;
					if(status != this.$api.SUCCESS){
						this.$hMessage.error(msg);
						return;
					} else {
						// this.$hMessage.success(msg);
						let {
							result: listDatas,
						} = body;
						listDatas = listDatas.map(
							(obj, i) => {
								// let title = Object.keys(obj)[0];
								// let value = Object.values(obj)[0];
								// let value = Object.values(obj)[0].toString();
								let {
									title,
									value,
								} = obj;
								return {
									title,
									value,
								};
							}
						);
						this[listType] = listDatas;
					}
				}).catch(err => console.error(`fetchNewsTypes error`, err));
			},
			// init
			init () {
				this.getWindowMaxWidth();
				this.fetchNewsTypes();
				let {
					current,
					size,
				} = this.pagination;
				this.getCommonTableDatas({
					current,
					size,
				});
				// this.fetchNewsSource();
			},
			globalBindKeyboardShortcuts() {
				let body = document.querySelector(`body`);
				let bindFlag = body.dataset.bindFlag;
				let isCtrlPressed = false;
				let isAltPressed = false;
				if (bindFlag === "true") {
					console.log(`information-source-audit, body no need binding again!`);
				} else {
					console.log(`information-source-audit, body only need binding once!`);
					body.dataset.bindFlag = "true";
					// bind once
					body.addEventListener("keyup", function(e) {
						let key = e.which || e.keyCode;
						if(e.which === 17) {
							isCtrlPressed = false;
						}
						if(e.which === 18) {
							isAltPressed = false;
						}
					}, false);
					body.addEventListener("keydown", function(e) {
						let key = e.which || e.keyCode;
						if(e.which === 17) {
							isCtrlPressed = true;
						}
						if(e.which === 18) {
							isAltPressed = true;
						}
						let isCtrl = isCtrlPressed;
						let isAlt = isAltPressed;
						let KSN_Obj = JSON.parse(window.sessionStorage.getItem(`keyboard_shortcuts_names_obj`));
						let {
							prev_name,
							next_name
						} = KSN_Obj;
						let prev_btn = document.querySelector(`[data-btn="${prev_name}"]`);
						let next_btn = document.querySelector(`[data-btn="${next_name}"]`);
						// let save_btn = document.querySelector(`[data-btn="${save_name}"]`);
						// let passed_btn = document.querySelector(`[data-btn="${passed_name}"]`);
						if(e.which === 83 && isCtrl && isAlt) {
							// if (save_btn) {
							//     save_btn.click();
							// }
						}
						if(e.which === 68 && isCtrl && isAlt) {
							if (prev_btn) {
								prev_btn.click();
							}
						}
						if(e.which === 70 && isCtrl && isAlt) {
							if (next_btn) {
								next_btn.click();
							}
						}
						if(e.which === 88 && isCtrl && isAlt) {
							// if (passed_btn) {
							//     passed_btn.click();
							// }
						}
					}, false);
				}
			},
			autoSkipLinks(type = `alink-uid`) {
				let that = this;
				let alinks = [...document.querySelector(`[data-alink="ambiguous-word-uid"]`)];
				if (alinks.length) {
					alinks.forEach(
						(alink, i) => {
							let flag = alink.dataset.isBind || false;
							if (!flag) {
								alink.dataset.isBind = true;
								alink.addEventListener(`click`, () => {
									let uid = alink.dataset.uid;
									that.$router.push(`/audit/news/information-source-audit#${uid}`);
								});
							}
						}
					);
				}
			},
		},
		mounted() {
			this.init();
			// let isGobalBindKS = window.sessionStorage.getItem(`isGobalBindKeyboardShortcuts`);
			// // isGobalBindKS === "true"
			// if (isGobalBindKS) {
			//     // only bind once
			//     console.warn(`information-source-audit, KeyboardShortcuts, only need bind once!`, isGobalBindKS);
			// } else {
			//     // init bind
			//     console.info(`information-source-audit, KeyboardShortcuts, bind once!`, isGobalBindKS);
			//     this.globalBindKeyboardShortcuts();
			//     window.sessionStorage.setItem(`isGobalBindKeyboardShortcuts`, true);
			// }
		},
		activated() {
			// console.log(`keep-alive 组件激活时调用`);
			if (this.isAutoRefreshTable) {
				this.onClickButton(`search`);
			} else {
				// no need!
			}
		},
	}
</script>

<style lang="scss" scoped>
	/* scss variables */
	$default-color: #000;
	// mixin
	@mixin common-lable($color) {
		color: $color;
		display: inline-block;
		width: 55px;
		text-align: center;
	}
	.audit-common-lable{
		@include common-lable($default-color);
		&::after{
			display: inline-block;
			content: ":";
		}
	}
	.audit-common-lable-long{
		@include common-lable($default-color);
		width: 75px !important;
	}
	.audit-common-lable-modify{
		@include common-lable($default-color);
		width: 75px !important;
		margin-top: 7px !important;
		padding-right: 5px !important;
		text-align: right !important;
		&::after{
			display: inline-block;
			content: ":";
		}
	}
	.audit-common-lable-placeholder{
		@include common-lable($default-color);
		width: 10px !important;
	}
	.audit-common-padding{
		display: block;
		padding-bottom: 10px;
		border: 0;
	}
	.audit-common-content{
		margin-top: 10px;
	}
	.audit-common-link,
	.audit-common-link:hover{
		color: #298DFF !important;
		text-decoration: none;
		cursor: pointer;
	}
	/* new */
	.audit-common-row-padding{
		margin-bottom: 5px;
	}
</style>

<style lang="scss">
	.disabled-user-selection > .h-table-cell > div > span,
	.disabled-user-selection > .h-table-cell > div > strong,
	.disabled-user-selection > .h-table-cell > div,
	.disabled-user-selection > .h-table-cell > span,
	.disabled-user-selection > .h-table-cell {
		-webkit-user-select: none !important; /* Safari 3.1+ */
		-moz-user-select: none !important; /* Firefox 2+ */
		-ms-user-select: none !important; /* IE 10+ */
		user-select: none !important; /* Standard syntax */
	}
	.audit-common-lable-margin-left{
		margin-left: 30px;
	}
	[data-font="remove-word"] {
		font-size: 14px;
		font-weight: bold;
		color: #298DFF;
	}
	[data-style="p"] {
		padding: 5px;
		margin: 3px;
		font-size: 14px !important;
		color: #000 !important;
	}
</style>
