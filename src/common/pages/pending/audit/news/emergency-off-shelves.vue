<template>
	<section>
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>发布日期：</dt>
						<dd>
							<h-date-picker
								type="datetimerange"
								format="yyyy-MM-dd"
								:placeholder="placeholders.publishDateRange"
								:value="commonFilters.publishDateRange"
								@on-change="onChangeDateRangePicker">
							</h-date-picker>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>公开标志：</dt>
						<dd>
							<h-select
								placeholder="请选择公开标志"
								v-model="commonFilters.newsOpenFlag"
								@on-change="onChangeSelect(`newsOpenFlag`)"
								filterable
								:clearable="true">
								<h-option
									v-for="(item, i) in newsOpenFlags"
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
						<dt>处理状态：</dt>
						<dd>
							<h-select
								placeholder="请选择处理状态"
								v-model="commonFilters.processingStatus"
								@on-change="onChangeSelect(`processingStatus`)"
								filterable
								clearable>
								<h-option
									v-for="(item, i) in processingStates"
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
						<dt>优先级：</dt>
						<dd>
							<h-select
								aria-placeholder="优先级"
								placeholder="请选择优先级"
								v-model="commonFilters.priority"
								filterable
								clearable>
								<h-option
									v-for="(item, i) in priorities"
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
						<dt>资讯 ID：</dt>
						<dd>
							<h-input
								placeholder="请输入资讯 ID"
								v-model="commonFilters.newsId"
								@on-change="onChangeInput(`newsId`)"
								@on-enter="onChangeInputEnter(`newsId`)"
								icon="android-close"
								ref="newsId"
								@on-click="shitClearableClick(`newsId`)">
							</h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>资讯类型：</dt>
						<dd>
							<h-select
								placeholder="请选择资讯类型"
								v-model="newsListType"
								@on-change="onNewsListTypeSelectChange(`newsListType`)"
								filterable
								clearable>
								<h-option
									v-for="(item, i) in newsListTypes"
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
						<dt>处理人员：</dt>
						<dd>
							<h-select
								placeholder="请选择处理人员"
								v-model="commonFilters.processingPersonnel"
								filterable
								clearable>
								<h-option
									v-for="(item, i) in processingPersonnels"
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
						<dt>资讯标题：</dt>
						<dd>
							<h-input
								placeholder="请输入资讯标题"
								v-model="commonFilters.newsTitle"
								@on-change="onChangeInput(`newsTitle`)"
								@on-enter="onChangeInputEnter(`newsTitle`)"
								icon="android-close"
								ref="newsTitle"
								@on-click="shitClearableClick(`newsTitle`)">
							</h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>标签名：</dt>
						<dd>
							<h-input
								type="text"
								placeholder="请输入标签名"
								v-model="commonFilters.newsTagName"
								@on-change="onChangeInput(`newsTagName`)"
								@on-enter="onChangeInputEnter(`newsTagName`)"
								icon="android-close"
								ref="newsTagName"
								@on-click="shitClearableClick(`newsTagName`)">
							</h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>版权状态：</dt>
						<dd>
							<h-select placeholder="请选择版权状态" v-model="commonFilters.isCopyright" clearable >
								<h-option value="0">无版权</h-option>
								<h-option value="1">有版权</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button
						type="primary"
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
			<h-row class-name="audit-common-row-padding" v-if="isDeletePermission">
				<h-col span="8">
					<h-tooltip
						placement="right"
						:disabled="!isIndexesEmpty"
						content="请先选择要批量删除的行">
						<h-button
							type="error"
							icon="delete"
							data-ref="init-btn"
							@click="onClickBatchDelete(`delete`)"
							:disabled="isIndexesEmpty">
							批量删除
						</h-button>
					</h-tooltip>
				</h-col>
			</h-row>
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
					<!-- <h-table
						:columns="commonTableCols"
						:data="commonTableDatas"
						:loading="tableLoading"
						@on-select="selectOne"
						@on-select-all="selectAll"
						@on-selection-change="selectChange"
						@on-select-cancel="selectCancel"
						border>
					</h-table> -->
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
		<!-- modal -->
		<h-msgBox
			v-if="!isBatchDelete"
			title="删除操作"
			@on-ok="reSureDelete"
			v-model="modalDelete.showModal"
			:loading="modalDelete.modalLoading">
			二次确认: 删除
		</h-msgBox>
		<h-msgBox
			v-else
			title="批量删除操作"
			@on-ok="reSureDelete"
			v-model="modalDelete.showModal"
			:loading="modalDelete.modalLoading">
			二次确认: 批量删除
		</h-msgBox>
		<!-- 紧急下架 -->
		<h-msgBox
			size="small"
			title="紧急下架"
			@on-ok="reSureEmergencyDelete"
			v-model="modalEmergency.showModal"
			:loading="modalEmergency.modalLoading">
			确认紧急下架: {{emergencyId}}
		</h-msgBox>
	</section>
</template>

<script>
	/**
	 *
	 * @author xiagq
	 * @copyright gildata
	 *
	 * @created 2018.01.17
	 * @modified 2018.01.17
	 *
	 * @description 紧急下架 EmergencyOffShelves
	 * @augments
	 * @example
	 *
	 */
	import { TODAY } from "./utils";
	export default {
		// bug & EmergencyOffShelves
		name: "AuditNewsEmergency-off-shelves",
		// name: "EmergencyOffShelves",
		// name: "AuditNewsEmergencyOffShelves",
		data () {
			return {
				isAutoRefreshTable: true,
				// isAutoRefreshTable: false,
				newsListTypes: [],
				newsListType: "",
				emergencyId: "",
				modalEmergency: {
					modalLoading: true,
					showModal: false,
					maximize: true,
					scrollable: true,
					transfer: false,
					title: "",
				},
				isBatchDelete: false,
				batchDeleteUids: [],
				modalDelete: {
					modalLoading: true,
					showModal: false,
					maximize: true,
					scrollable: true,
					transfer: false,
					title: "",
				},
				// activeRoutersButton: this.$store.state.activeRoutersButton,
				mediaSources: [],
				columnCategories: [],
				priorities: [],
				processingStates: [],
				processingPersonnels: [],
				newsIds: [],
				newsOpenFlags: [
					{
						title: "屏蔽",
						value: "0",
					},
					{
						title: "公开",
						value: "1",
					},
				],
				commonFilters: {
					publishDate: TODAY,
					publishDateEnd: TODAY,
					publishDateRange: [TODAY, TODAY],
					newsTitle: "",
					mediaSource: "",
					columnCategory: "",
					priority: "",
					processingStatus: "0",
					processingStatus: "",// none
					processingPersonnel: "",
					newsId: "",
					newsOpenFlag: "",
					newsKeyword: "",
					newsTagName: "",
					isCopyright: ''
				},
				commonFiltersPagination: {
					publishDate: TODAY,
					publishDateEnd: TODAY,
					publishDateRange: [TODAY, TODAY],
					newsTitle: "",
					mediaSource: "",
					columnCategory: "",
					priority: "",
					processingStatus: "0",
					processingStatus: "",// none
					processingPersonnel: "",
					newsId: "",
					newsOpenFlag: "",
					newsKeyword: "",
					newsTagName: "",
					isCopyright: ''
				},
				placeholders: {
					publishDateRange: "开始日期 ~ 结束日期",
					publishDate: "请输入查询日期",
				},
				commonTableCols: [
					{
						type: "selection",
						width: 60,
						align: "center",
						fixed: "left",
					},
					// {
					//     key: "index",
					//     title: "序号",
					//     width: 60,
					//     align: "center",
					// },
					{
						key: "processingStatus",
						title: "处理状态",
						width: 100,
						align: "center",
						render: (h, params) => {
							let key = params.row.processingStatus;
							let title = params.row.processingStatusDesc;
							let icon = "";
							switch (key) {
								// UI ???
								case 0:
									// icon = "unlock";
									// icon = "lock";
									icon = "01";
									break;
								case 1:
									icon = "02";
									break;
								case 10:
									icon = "03";
									break;
								case 11:
									icon = "04";
									break;
								case 3:
									icon = "05";
									break;
								case 5:
									icon = "06";
									break;
								case 9:
									icon = "07";
									break;
								default:
									break;
							}
							return h("div", {
									// all properties === attributes
									attrs: {
										"title": `${title}`,
										"data-title": `${title}`,
									},
								},
								[
									// h("Icon", {
									//     props: {
									//         name: icon,
									//         // name: "lock",// .icon-lock
									//     }
									// }),
									h("i", {
										attrs: {
											"data-icons": icon,
										},
									}),
									h("span", title),
								]
							);
						},
					},
					{
						key: "priority",
						// key: "priorityDesc",
						title: "优先级",
						// sortable: true,
						width: 100,
						align: "center",
						// className: "disabled-user-selection",
					},
					{
						key: "newsTitle",
						title: "资讯标题",
						// width: 300,
						width: 410,
						align: "left",
					},
					{
						key: "newsType",
						title: "资讯类型",
						width: 130,
						align: "left",
						render: (h, params) => {
							// let title = params.row.newsType;
							// let key = params.row.newsType;
							let title = params.row.newsTypeDesc;
							return h("div", {
									// all properties === attributes
									attrs: {
										"title": `${title}`,
										"data-title": `${title}`,
									},
								},
								[
									h("span", title),
								]
							);
						},
					},
					{
						key: "newsId",
						title: "资讯 ID",
						// sortable: true,
						width: 200,
						align: "left",
					},
					{
						key: "publishTime",
						title: "发布日期",
						width: 150,
						align: "center",
						className: "disabled-user-selection",
					},
					{
						key: "mediaSource",
						title: "媒体出处",
						width: 150,
						align: "center",
						className: "audit-row-min-width-150",
						// className: "disabled-user-selection audit-row-min-width-150",
					},
					// {
					//     key: "priority",
					//     title: "优先级",
					// },
					// {
					//     key: "columnCategory",
					//     title: "栏目分类",
					//     width: 100,
					//     align: "center",
					// },
					{
						key: "flag",
						title: "公开标志",
						width: 100,
						align: "center",
					},
					{
						key: "keyword",
						title: "关键字",
						width: 100,
						align: "center",
						// className: "disabled-user-selection",
					},
					{
						key: "auditPersonnel",
						title: "审核人员",
						width: 100,
						align: "center",
					},
					{
						key: "auditTime",
						title: "审核时间",
						width: 150,
						align: "center",
					},
					{
						key: "processingPersonnel",
						title: "处理人员",
						width: 120,
						align: "center",
						render: (h, params) => {
							return h("div", [
								h("Icon", {
									props: {
										name: "person"
									}
								}),
								h("strong", params.row.processingPersonnel),
							]);
						},
					},
					{
						key: "operation",
						title: "操作",
						width: 150,
						align: "center",
						fixed: "right",
						render: (h, params) => {
							// operate-view-bid
							let newsType = params.row.newsType;
							// console.log(`newsType =`, newsType);
							let newsOperateVoList = params.row.newsOperateVoList;
							// console.log(`params.row =`, JSON.stringify(params.row, null, 4));
							// console.log(`newsOperateVoList =`, JSON.stringify(newsOperateVoList, null, 4));
							let uid = params.row.newsId;
							// 上一页； 1 下一页
							let fbsj = params.row.publishTime;
							// let publishTime = params.row.publishTime;
							// let newsListType = params.row.dataType;
							let newsListType = params.row.newsType;
							let {
								processingStatus: dataStatus,
								processingPersonnel: handleUser,
								newsTitle: xwbt,
								mediaSource: mtcc,
								newsOpenFlag: gkbz,
								publishDate: publishTime,
								publishDateEnd: publishTimeEnd,
								newsTagName: tag,
								isCopyright,
							} = this.commonFilters;
							let {
								newsListType: dataType,
							} = this.$data;
							// 后端翻页
							let {
								current,
								size,
							} = this.pagination;
							let flipObj = {
								// operType: "1",// 0 上一页； 1 下一页
								// dataType: "5",// 所有资讯
								newsListType: "5",
								newsId: uid,
								dataStatus,
								handleUser,
								xwbt,
								mtcc,
								gkbz,
								fbsj,
								publishTime,
								publishTimeEnd,
								current,
								size,
								dataType,
								tag,
								isCopyright,
							};
							// console.log(`tag =`, JSON.stringify(flipObj, nuill, 4));
							let links = [];
							links = newsOperateVoList.map(
								(obj, i) => {
									let {
										operateDesc: desc,
										operateType: type,
										// operateUrl,// 前端路由定义
									} = obj;
									let operateUrl = ``;
									let routerPath = ``;
									switch (type) {
										case 1:
											operateUrl = `/tm/getNewsInfoById`;
											routerPath = `/audit/news/emergency-off-shelves/operate-handle`;
											break;
										case 2:
											operateUrl = `/tm/getNewsInfoById`;
											routerPath = `/audit/news/emergency-off-shelves/operate-audit`;
											break;
										case 3:
											operateUrl = `/tm/getNewsInfoById`;
											routerPath = `/audit/news/emergency-off-shelves/operate-verify`;
											break;
										case 5:
											operateUrl = `/tm/getNewsInfoById`;
											routerPath = `/audit/news/emergency-off-shelves/operate-view`;
										   /* if (newsType === 3) {
												// operate-view-bid
												routerPath = `/audit/news/emergency-off-shelves/operate-view-bid`;
											}*/
											break;
										default:
											operateUrl = `#type=删除`;
											// routerPath = `/audit/news/operate-verify`;
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
												// 删除, 稽核/审核, 处理
												// this.show(params.index);
												// console.log(`routerPath = `, routerPath);
												// this.$router.push({
												//     path: routerPath,
												//     query: {
												//         type,
												//         desc,
												//         uid,
												//         url: operateUrl,
												//     },
												// });
												let options = {
													path: routerPath,
													// query: {
													//     type,
													//     desc,
													//     uid,
													//     url: operateUrl,
													// },
												};
												// todo & Lock ??? POST
												// console.log(`type =`, type, desc);
												// if (type === 4) {
												//     let uids = [uid];
												//     this.batchDeleteNewsIds(uids);
												// } else {
												//     if (type === 5) {
												//          this.$router.push(options);
												//     } else {
												//         // tryLock & POST
												//         this.checkLockState(uid, options);
												//     }
												// }
												// if (type === 4) {
												//     let uids = [uid];
												//     this.batchDeleteUids = uids;
												//     this.clickShowResureDeleteModal();
												// } else {
												//     if (type === 5) {
												//          this.$router.push(options);
												//     } else {
												//         // tryLock & POST
												//         this.checkLockState(uid, options);
												//     }
												// }
												if (type === 6) {
													// let uids = [uid];
													// this.batchDeleteUids = uids;
													// this.clickShowResureDeleteModal();
													// this.$hMessage.info(`确定✅紧急下架 ${uid}`);
													this.clickShowEmergencyModal(uid);
												} else {
													// 1：处理； 2：稽核； 3：审核； 4：删除； 5：查看；
													let new_type = "";
													switch (type) {
														case 1:
															new_type = "handle";
															break;
														case 2:
															new_type = "audit";
															break;
														// case 3:
														//     new_type = "review";
														//     break;
														case 5:
															new_type = "view";
															break;
														default:
															break;
													}
													// console.log(`filpObj =`, JSON.stringify(flipObj, null, 4));
													// set flip page object
													if (newsType === 3) {
														/*window.sessionStorage.setItem(`emergency-off-shelves_flipObj_${new_type}_bid`, JSON.stringify(flipObj));*/
														window.sessionStorage.setItem(`emergency-off-shelves_flipObj_${new_type}`, JSON.stringify(flipObj));
													} else {
														window.sessionStorage.setItem(`emergency-off-shelves_flipObj_${new_type}`, JSON.stringify(flipObj));
													}
													let router_query = {
														// type,
														type: newsListType,
														desc,
														uid,
														url: operateUrl,
													};
													if (newsType === 3) {
														/*window.sessionStorage.setItem(`emergency-off-shelves_route_query_${new_type}_bid`, JSON.stringify(router_query));*/
														window.sessionStorage.setItem(`emergency-off-shelves_route_query_${new_type}`, JSON.stringify(router_query));
													} else {
														window.sessionStorage.setItem(`emergency-off-shelves_route_query_${new_type}`, JSON.stringify(router_query));
													}
													if (type === 5) {
														sessionStorage.setItem(`returnedOriginPath`, ``);
														this.$router.push(options);
													} else {
														// tryLock & POST
														// this.checkLockState(uid, options);
													}
												}
											},
										}
									}, desc);
								}
							);
							return h("div", links);
							// return h("div", [
							//     h("Button", {
							//         props: {
							//             type: "primary",
							//             size: "small"
							//         },
							//         style: {
							//             marginRight: "5px"
							//         },
							//         on: {
							//             click: () => {
							//                 this.show(params.index)
							//             },
							//         }
							//     }, "查看"),
							//     h("Button", {
							//         props: {
							//             type: "error",
							//             size: "small"
							//         },
							//         style: {
							//             marginRight: "5px"
							//         },
							//         on: {
							//             click: () => {
							//                 this.remove(params.index);
							//             },
							//         }
							//     }, "删除"),
							// ]);
						},
					},
				],
				commonTableColsUnselection: [
					// {
					//     type: "selection",
					//     width: 60,
					//     align: "center",
					//     fixed: "left",
					// },
					// {
					//     key: "index",
					//     title: "序号",
					//     width: 60,
					//     align: "center",
					// },
					{
						key: "processingStatus",
						title: "处理状态",
						width: 100,
						align: "center",
						fixed: "left",
						render: (h, params) => {
							let key = params.row.processingStatus;
							let title = params.row.processingStatusDesc;
							let icon = "";
							switch (key) {
								// UI ???
								case 0:
									// icon = "unlock";
									// icon = "lock";
									icon = "01";
									break;
								case 1:
									icon = "02";
									break;
								case 10:
									icon = "03";
									break;
								case 11:
									icon = "04";
									break;
								case 3:
									icon = "05";
									break;
								case 5:
									icon = "06";
									break;
								case 9:
									icon = "07";
									break;
								default:
									break;
							}
							return h("div", {
									// all properties === attributes
									attrs: {
										"title": `${title}`,
										"data-title": `${title}`,
									},
								},
								[
									// h("Icon", {
									//     props: {
									//         name: icon,
									//         // name: "lock",// .icon-lock
									//     }
									// }),
									h("i", {
										attrs: {
											"data-icons": icon,
										},
									}),
									h("span", title),
								]
							);
						},
					},
					{
						key: "priority",
						// key: "priorityDesc",
						title: "优先级",
						// sortable: true,
						width: 100,
						align: "center",
						// className: "disabled-user-selection",
					},
					{
						key: "newsTitle",
						title: "资讯标题",
						// width: 300,
						width: 470,
						align: "left",
					},
					{
						key: "newsType",
						title: "资讯类型",
						width: 130,
						align: "left",
						render: (h, params) => {
							// let title = params.row.newsType;
							// let key = params.row.newsType;
							let title = params.row.newsTypeDesc;
							return h("div", {
									// all properties === attributes
									attrs: {
										"title": `${title}`,
										"data-title": `${title}`,
									},
								},
								[
									h("span", title),
								]
							);
						},
					},
					{
						key: "newsId",
						title: "资讯 ID",
						// sortable: true,
						width: 200,
						align: "left",
					},
					{
						key: "publishTime",
						title: "发布日期",
						width: 150,
						align: "center",
						className: "disabled-user-selection",
					},
					{
						key: "mediaSource",
						title: "媒体出处",
						width: 150,
						align: "center",
						className: "audit-row-min-width-150",
					},
					// {
					//     key: "priority",
					//     title: "优先级",
					// },
					// {
					//     key: "columnCategory",
					//     title: "栏目分类",
					//     width: 100,
					//     align: "center",
					// },
					{
						key: "flag",
						title: "公开标志",
						width: 100,
						align: "center",
					},
					{
						key: "keyword",
						title: "关键字",
						width: 100,
						align: "center",
						// className: "disabled-user-selection",
					},
					{
						key: "auditPersonnel",
						title: "审核人员",
						width: 100,
						align: "center",
					},
					{
						key: "auditTime",
						title: "审核时间",
						width: 150,
						align: "center",
					},
					{
						key: "processingPersonnel",
						title: "处理人员",
						width: 120,
						align: "center",
						render: (h, params) => {
							return h("div", [
								h("Icon", {
									props: {
										name: "person"
									}
								}),
								h("strong", params.row.processingPersonnel),
							]);
						},
					},
					{
						key: "operation",
						title: "操作",
						width: 150,
						align: "center",
						fixed: "right",
						render: (h, params) => {
							let newsType = params.row.newsType;
							let newsOperateVoList = params.row.newsOperateVoList;
							// console.log(`newsOperateVoList =`, JSON.stringify(newsOperateVoList, null, 4));
							let uid = params.row.newsId;
							// 上一页； 1 下一页
							let fbsj = params.row.publishTime;
							// let publishTime = params.row.publishTime;
							// let newsListType = params.row.dataType;
							let newsListType = params.row.newsType;
							let {
								processingStatus: dataStatus,
								processingPersonnel: handleUser,
								newsTitle: xwbt,
								mediaSource: mtcc,
								newsOpenFlag: gkbz,
								publishDate: publishTime,
								publishDateEnd: publishTimeEnd,
								newsTagName: tag,
								isCopyright
							} = this.commonFilters;
							let {
								newsListType: dataType,
							} = this.$data;
							// console.log(`dataType =`, dataType);
							// 后端翻页
							let {
								current,
								size,
							} = this.pagination;
							let flipObj = {
								// operType: "1",// 0 上一页； 1 下一页
								// dataType: "5",// 所有资讯
								newsListType: "5",
								newsId: uid,
								dataStatus,
								handleUser,
								xwbt,
								mtcc,
								gkbz,
								fbsj,
								publishTime,
								publishTimeEnd,
								current,
								size,
								dataType,
								tag,
								isCopyright,
							};
							// console.log(`filpObj =`, JSON.stringify(flipObj, null, 4));
							let links = [];
							links = newsOperateVoList.map(
								(obj, i) => {
									let {
										operateDesc: desc,
										operateType: type,
										// operateUrl,// 前端路由定义
									} = obj;
									let operateUrl = ``;
									let routerPath = ``;
									switch (type) {
										// case 1:
										//     operateUrl = `/tm/getNewsInfoById`;
										//     routerPath = `/audit/news/emergency-off-shelves/operate-handle`;
										//     break;
										// case 2:
										//     operateUrl = `/tm/getNewsInfoById`;
										//     routerPath = `/audit/news/emergency-off-shelves/operate-audit`;
										//     break;
										// case 3:
										//     operateUrl = `/tm/getNewsInfoById`;
										//     routerPath = `/audit/news/emergency-off-shelves/operate-verify`;
										//     break;
										case 5:
											operateUrl = `/tm/getNewsInfoById`;
											routerPath = `/audit/news/emergency-off-shelves/operate-view`;
											/*if (newsType === 3) {
												// operate-view-bid
												routerPath = `/audit/news/emergency-off-shelves/operate-view-bid`;
											}*/
											break;
										default:
											operateUrl = `#type=紧急下架`;
											// routerPath = `/audit/news/operate-verify`;
											break;
										// default:
										//     operateUrl = `#type=删除`;
										//     // routerPath = `/audit/news/operate-verify`;
										//     break;
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
												// 紧急下架
												// 删除, 稽核/审核, 处理
												// this.show(params.index);
												// console.log(`routerPath = `, routerPath);
												// this.$router.push({
												//     path: routerPath,
												//     query: {
												//         type,
												//         desc,
												//         uid,
												//         url: operateUrl,
												//     },
												// });
												let options = {
													path: routerPath,
													// query: {
													//     type,
													//     desc,
													//     uid,
													//     url: operateUrl,
													// },
												};
												// todo & Lock ??? POST
												// console.log(`type =`, type, desc);
												// if (type === 4) {
												//     let uids = [uid];
												//     this.batchDeleteNewsIds(uids);
												// } else {
												//     if (type === 5) {
												//          this.$router.push(options);
												//     } else {
												//         // tryLock & POST
												//         this.checkLockState(uid, options);
												//     }
												// }
												if (type === 6) {
													// let uids = [uid];
													// this.batchDeleteUids = uids;
													// this.clickShowResureDeleteModal();
													// this.$hMessage.info(`确定紧急下架, ${uid}`);
													this.clickShowEmergencyModal(uid);
												} else {
													// 1：处理； 2：稽核； 3：审核； 4：删除； 5：查看；
													let new_type = "";
													switch (type) {
														case 1:
															new_type = "handle";
															break;
														case 2:
															new_type = "audit";
															break;
														// case 3:
														//     new_type = "review";
														//     break;
														case 5:
															new_type = "view";
															break;
														default:
															break;
													}
													// console.log(`filpObj =`, JSON.stringify(flipObj, null, 4));
													// set flip page object
													if (newsType === 3) {
														// bid
														/*window.sessionStorage.setItem(`emergency-off-shelves_flipObj_${new_type}_bid`, JSON.stringify(flipObj));*/
														window.sessionStorage.setItem(`emergency-off-shelves_flipObj_${new_type}`, JSON.stringify(flipObj));
													} else {
														window.sessionStorage.setItem(`emergency-off-shelves_flipObj_${new_type}`, JSON.stringify(flipObj));
													}
													let router_query = {
														// type,
														type: newsListType,
														desc,
														uid,
														url: operateUrl,
													};
													if (newsType === 3) {
														// bid
														/*window.sessionStorage.setItem(`emergency-off-shelves_route_query_${new_type}_bid`, JSON.stringify(router_query));*/
														window.sessionStorage.setItem(`emergency-off-shelves_route_query_${new_type}`, JSON.stringify(router_query));
													} else {
														window.sessionStorage.setItem(`emergency-off-shelves_route_query_${new_type}`, JSON.stringify(router_query));
													}
													if (type === 5) {
														sessionStorage.setItem(`returnedOriginPath`, ``);
														this.$router.push(options);
													} else {
														// tryLock & POST
														// this.checkLockState(uid, options);
													}
												}
											},
										}
									}, desc);
								}
							);
							return h("div", links);
							// return h("div", [
							//     h("Button", {
							//         props: {
							//             type: "primary",
							//             size: "small"
							//         },
							//         style: {
							//             marginRight: "5px"
							//         },
							//         on: {
							//             click: () => {
							//                 this.show(params.index)
							//             },
							//         }
							//     }, "查看"),
							//     h("Button", {
							//         props: {
							//             type: "error",
							//             size: "small"
							//         },
							//         style: {
							//             marginRight: "5px"
							//         },
							//         on: {
							//             click: () => {
							//                 this.remove(params.index);
							//             },
							//         }
							//     }, "删除"),
							// ]);
						},
					},
				],
				commonTableDatas: [],
				initTableDatas: [],
				pagination: {
					current: 1,
					size: 12,
					// size: 10,
					total: 0,
					// total: 100,
				},
				tableLoading: false,
				commonIndexes: [],
				commonNewsIds: [],
				isIndexesEmpty: true,
				isDeletePermission: false,
			}
		},
		computed: {
			maxTableHeight(){ return this.$store.state.maxTableHeight },
		},
		methods: {
			onChangeSwitch(value = ``) {
				console.log(`switch value =`, value);
				// `isAutoRefreshTable`
			},
			reSureEmergencyDelete() {
				let that = this;
				let uid = this.emergencyId || "";
				let options = {
					"newsId": uid,
				};
				let url = `/tm/emergencyRemovalByNewsId`;
				this.$http
				.post(url, options)
				.then(res => res.data)
				.then((json)=>{
					let {
						status,
						msg,
						body,
					} = json;
					// console.log(`紧急下架 json =`, JSON.stringify(json, null, 4));
					if(status != this.$api.SUCCESS){
						console.log(`紧急下架 json =`, JSON.stringify(json, null, 4));
						this.$hMessage.error(msg);
						this.tableLoading = false;
						setTimeout(() => {
							this.modalEmergency.showModal = false;
						}, 500);
						return;
					} else {
						this.modalEmergency.showModal = false;
						this.$hMessage.success(`紧急下架成功!`);
					}
				})
				.catch(err => console.error(`紧急下架 error`, err));
			},
			clickShowEmergencyModal(uid = ``) {
				this.emergencyId = uid || "";
				this.modalEmergency.showModal = true;
			},
			reSureDelete () {
				let uids = this.batchDeleteUids || [];
				this.batchDeleteNewsIds(uids);
			},
			clickShowResureDeleteModal(isBatch = false) {
				this.modalDelete.showModal = true;
				if (isBatch) {
					this.isBatchDelete = true;
				} else {
					this.isBatchDelete = false;
				}
			},
			checkLockState (uid = ``, options = {}) {
				// POST
				let url = `/tm/tryLock?newsId=${uid}`;
				this.$http
				.post(url)
				// .post(url, {
				//     newsId: uid,
				// })
				.then(res => res.data)
				.then((json)=>{
					// console.log(`lock 状态 json =`, JSON.stringify(json, null, 4));
					if (!json.body) {
						console.log(`lock 状态 json =`, JSON.stringify(json, null, 4));
					} else {
						let {
							status,
							msg,
							// body,
						} = json;
						// locked & warning message
						if(status != this.$api.SUCCESS){
							this.$hMessage.error(msg);
							return;
						} else {
							if (status === 1) {
								// re-direct
								this.$router.push(options);
							}
						}

					}
				}).catch(err => console.error(`lock 状态  error`, err));
			},
			// filter methods
			onChangeDateRangePicker (values) {
				// console.log(`range values`, values);
				this.commonFilters.publishDateRange = values;
				this.commonFilters.publishDate = values[0];
				this.commonFilters.publishDateEnd = values[1];
			},
			onChangeDatePicker (value) {
				this.commonFilters.publishDate = value;
			},
			onChangeInput (type = ``) {
				let value = this.commonFilters[type];
				this.commonFilters[type] = value.trim();
				// this.$hMessage.info(`${type} = ${value}`);
			},
			onChangeInputEnter (type = ``) {
				let value = this.commonFilters[type];
				this.commonFilters[type] = value.trim();
				// this.$hMessage.info(`${type} = ${value}`);
				this.onClickButton();
			},
			shitClearableClick(type = ``) {
				// http://192.168.58.189:8080/hui/#/components/input
				// shiy api
				// this.$hMessage.info("icon点击事件");
				this.commonFilters[type] = ``;
				this.$refs[type].focus();
			},
			onChangeSelect (type = ``) {
				let value = this.commonFilters[type];
				// this.$hMessage.info(value);
			},
			onClickButton (type = ``) {
				let {
					publishDate: publishTime,
					publishDateEnd: publishTimeEnd,
					newsTitle: xwbt,
					mediaSource: mtcc,
					columnCategory: lmfl,
					// priority: yxj,
					processingStatus: dataStatus,
					processingPersonnel: handleUser,
					newsId,
					newsOpenFlag: gkbz,
					newsKeyword: keyword,
					newsTagName: tag,
					priority,
					isCopyright
				}= this.commonFilters;
				let {
					newsListType: dataType,
				} = this.$data;
				// this.commonFiltersPagination = this.commonFilters;
				this.commonFiltersPagination = {...this.commonFilters};
				let {
					// current,
					size,
				} = this.pagination;
				// init
				this.pagination.current = 1;
				let options = {
					publishTime,
					publishTimeEnd,
					xwbt,
					mtcc,
					// lmfl,
					// yxj,
					dataStatus,
					handleUser,
					newsId,
					current: 1,
					size,
					gkbz,
					keyword,
					tag,
					priority,
					dataType,
					isCopyright
				};
				this.getCommonTableDatas(options);
			},
			getNewTableDatas (pagination = {}) {
				let {
					publishDate: publishTime,
					publishDateEnd: publishTimeEnd,
					newsTitle: xwbt,
					mediaSource: mtcc,
					columnCategory: lmfl,
					// priority: yxj,
					processingStatus: dataStatus,
					processingPersonnel: handleUser,
					newsId,
					newsOpenFlag: gkbz,
					newsKeyword: keyword,
					newsTagName: tag,
					priority,
					isCopyright
				}= this.commonFiltersPagination;
				let {
					newsListType: dataType,
				} = this.$data;
				let {
					current,
					size,
				} = pagination;
				let options = {
					publishTime,
					publishTimeEnd,
					xwbt,
					mtcc,
					// lmfl,
					// yxj,
					dataStatus,
					handleUser,
					newsId,
					current,
					size,
					gkbz,
					keyword,
					tag,
					priority,
					dataType,
					isCopyright
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
			show (index) {
				this.$hMsgBox.info({
					title: "资讯信息",
					content: `
						资讯 ID: ${this.commonTableDatas[index].newsId}<br/>
						资讯标题: ${this.commonTableDatas[index].newsTitle}<br/>
						媒体来源: ${this.commonTableDatas[index].mediaSource}<br/>
					`,
				})
			},
			remove (index) {
				this.commonTableDatas.splice(index, 1);
			},
			// @on-select
			tableSelectionChange(selection) {
				let indexes = [];
				let ids = [];
				if (selection.length) {
					ids = selection.map(
						(obj, i) => {
							if (obj) {
								let {
									newsId,
								} = obj;
								return newsId;
							}
						}
					);
					// console.log(`ids =`, ids);
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
					// console.log(`indexes =`, indexes);
					this.isIndexesEmpty = false;
				} else {
					this.isIndexesEmpty = true;
				}
				this.commonIndexes = indexes;
				this.commonNewsIds = ids;
			},
			selectChange(selection) {
				// console.log("CHANGE事件");
				// console.log(selection);
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
							// console.log(`index =`, index, typeof(index));
							// console.log(`key =`, key, typeof(key));
							trueTableIndex = i;
						} else {
							// return;
						}
					}
				);
				return trueTableIndex;
			},
			onClickBatchDelete(type = `delete`) {
				let indexes = this.commonIndexes;
				let datas = this.initTableDatas;
				// let datas = this.commonTableDatas;
				if (indexes.length) {
					indexes.forEach(
						(index, i) => {
							let trueTableIndex = this.getTrueTableIndex(datas, index);
							// console.log(`index =`, index, typeof(index));
							// console.log(`trueTableIndex =`, trueTableIndex);
							// console.log(`datas[${trueTableIndex}] =`, JSON.stringify(datas[trueTableIndex], null, 4));
							// console.log(`datas =`, JSON.stringify(datas, null, 4));
							if (trueTableIndex) {
								this.commonTableDatas.splice(trueTableIndex, 1);
								// this.commonTableDatas = datas.splice(trueTableIndex, 1);
							}
						}
					);
				}
				// if (indexes.length) {
				//     indexes.forEach(
				//         (index, i) => {
				//             this.commonTableDatas.splice(index, 1);
				//         }
				//     );
				// }
				let newsIds = this.commonNewsIds;
				this.batchDeleteNewsIds(newsIds);
			},
			// 批量删除 / 删除
			batchDeleteNewsIds(ids = []) {
				let idsString = JSON.stringify(ids);
				let options = {
					idList: ids,
				};
				let url = `/tm/removeBatchByIdList`;
				this.tableLoading = true;
				this.$http
				.delete(url, {
					data: options,
				})
				.then(res => res.data)
				.then((json)=>{
					let {
						status,
						msg,
						body,
					} = json;
					if(status != this.$api.SUCCESS){
						console.log(`资讯列表删除 json =`, JSON.stringify(json, null, 4));
						this.$hMessage.error(msg);
						this.modalDelete.showModal = false;
						this.tableLoading = false;
						return;
					} else {
						// this.$hMessage.success(msg);
						this.$hMessage.success(this.isBatchDelete ? "批量删除成功" : "删除成功");
						this.modalDelete.showModal = false;
						this.tableLoading = false;
						this.pagination.current = 1;
						this.onClickButton();
					}
				}).catch(err => console.error(`删除 error`, err));
			},
			categoriesFilter (key = 1) {
				let result = ``;
				let categories = this.columnCategories;
				try {
					if (categories) {
						categories.forEach(
							(obj, i) => {
								let {
									title,
									value,
								} = obj;
								if (value === key) {
									result = title;
								}
							}
						);
					}
				} catch (err) {
					// no categories
					console.error(`result error`, err);
				}
				return result;
			},
			// 优先级
			getPriorityByDictCode(dictCode = `1006`, debug = false){
				// let url = `/tm/tbmDictList?dictCode=1006`;
				let url = `/tm/tbmDictList?dictCode=${dictCode}`;
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
						console.log(`优先级 json =`, JSON.stringify(json, null, 4));
						this.$hMessage.error(msg);
						return;
					} else {
						let {
							tbmDictList: listDatas,
						} = body;
						listDatas = listDatas.map(
							(obj, i) => {
								let {
									entryName: title,
									dictEntry: value,
								} = obj;
								return {
									title,
									value,
								};
							}
						);
						this.priorities = listDatas;
					}
				}).catch(err => console.error(`优先级 error`, err));
			},
			// 处理状态
			getDictByDictCode(dictCode = ``, listType = ``, debug = false){
				if (debug) {
					console.log(`listType =`, listType);
				}
				let url = `/tm/tbmDictList?dictCode=${dictCode}`;
				this.$http
				.get(url)
				.then(res => res.data)
				.then((json)=>{
					if (!json.body) {
						console.log(`处理状态 json =`, JSON.stringify(json, null, 4));
					} else {
						let {
							status,
							msg,
							body: {
								tbmDictList: listDatas,
							},
						} = json;
						listDatas = listDatas.map(
							(obj, i) => {
								let {
									entryName: title,
									dictEntry: value,
								} = obj;
								return {
									title,
									value,
								};
							}
						);
						if(status != this.$api.SUCCESS){
							this.$hMessage.error(msg);
							return;
						} else {
							this[listType] = listDatas;
						}
					}
				}).catch(err => console.error(`处理状态  error`, err));
			},
			// 栏目分类
			getColumnCategoryByKeyWord(lb = 7, keyWord = ``, listType =``, debug = false){
				if (debug) {
					console.log(`listType =`, listType);
				}
				// let url = `/tm/classification?lb=${lb}`;
				// if (keyWord) {
				//     url = `/tm/classification?lb=${lb}&keyWord=${keyWord}`;
				// }
				let url = `/tm/classification?lb=${lb}&keyWord=${keyWord}`;
				this.$http
				.get(url)
				.then(res => res.data)
				.then((json)=>{
					if (!json.body) {
						console.log(`栏目分类 json =`, JSON.stringify(json, null, 4));
					} else {
						let {
							status,
							msg,
							body: {
								classification: listDatas,
							},
						} = json;
						listDatas = listDatas.map(
							(obj, i) => {
								let {
									clms: title,
									dm: value,
									//lb: 7
								} = obj;
								return {
									title,
									value,
								};
							}
						);
						if(status != this.$api.SUCCESS){
							this.$hMessage.error(msg);
							return;
						} else {
							this[listType] = listDatas;
						}
					}
				}).catch(err => console.error(`栏目分类  error`, err));

			},
			// 处理人
			getProcessingPersonnelsByKeyWord(keyWord = ``, listType =``, debug = false){
				if (debug) {
					console.log(`listType =`, listType);
				}
				let url = "/tm/handlerList";
				if (keyWord) {
					url = `/tm/handlerList?keyword=${keyWord}`;
				}
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
						// console.log(`处理人 json =`, JSON.stringify(json, null, 4));
						let {
							handlerList: listDatas,
						} = body;
						listDatas = listDatas.map(
							(obj, i) => {
								let {
									realName: title,
									id: value,
								} = obj;
								return {
									title,
									value,
								};
							}
						);
						this[listType] = listDatas;
					}
				}).catch(err => console.error(`处理人  error`, err));
			},
			// 紧急下架列表
			getCommonTableDatas (options = {}, debug = false) {
				// let {
				//     publishTime,
				//     publishTimeEnd,
				//     xwbt,
				//     mtcc,
				//     // lmfl,
				//     // yxj,
				//     dataStatus,
				//     handleUser,
				//     newsId,
				//     current,
				//     size,
				//     gkbz,
				//     keyword,
				//     tag,
				//     priority,
				// } = options;
				// 全部资讯列表
				let {
					newsListType: dataType,
					// newsListType,
					// newsListType: newsType,
				} = this.$data;
				if (dataType !== "") {
					options.dataType = parseInt(dataType);
					// options.dataType = dataType || "";
				}
				// if (newsListType !== "") {
				//     options.newsListType = newsListType || "";
				// }
				options.newsListType = "5";
				this.tableLoading = true;
				let url = `/tm/getAllNewsLogVoList`;
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
						console.log(`审核列表 json =`, JSON.stringify(json, null, 4));
						this.$hMessage.error(msg);
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
								console.log(`new cols`, isDeletePermission);
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
							listDatas = listDatas.map(
								(obj, i) => {
									let {
										newsId,
										// gkbz: flag,
										gkbzDesc: flag,
										fbsj: publishTime,
										mtcc: mediaSource,
										xwbt: newsTitle,
										// yxj: priority,
										// priorityDesc,
										priorityDesc: priority,
										keyword,
										lmfl: columnCategory,
										handleTime,
										handleUserName: processingPersonnel,
										dataStatus: processingStatus,
										dataStatusDesc: processingStatusDesc,
										dataType: newsType,
										dataTypeDesc: newsTypeDesc,
										auditTime,
										auditUserName: auditPersonnel,
										sensitives,
										newsOperateVoList,
									} = obj;
									if (columnCategory) {
										columnCategory = this.categoriesFilter(columnCategory);
									}
									if (!newsTypeDesc) {
										newsTypeDesc = "";
									}
									return {
										index: i,
										// index: i + 1,
										flag,
										newsId,
										publishTime,
										mediaSource,
										newsTitle,
										columnCategory,
										processingStatus,
										processingStatusDesc,
										processingPersonnel,
										auditTime,
										auditPersonnel,
										newsOperateVoList,
										newsType,
										newsTypeDesc,
										priority,
										keyword,
									};
								}
							);
						} else {
							listDatas = [];
						}
						this.initTableDatas = listDatas;
						this.commonTableDatas = listDatas;
						this.tableLoading = false;
					}
				}).catch(err => console.error(`审核列表 error`, err));
			},
			getWindowMaxWidth() {
				let maxWidth = window.screen.width || 1366;
				if (maxWidth < 1920) {
					this.pagination.size = 12;
				} else {
					this.pagination.size = 21;
				}
			},
			// 资讯列表类型 / 资讯类型
			getNewsListTypes(listType = `newsListTypes`, debug = false){
				let url = "/tm/getNewsType";
				this.$http
				.get(url)
				.then(res => res.data)
				.then((json)=>{
					if (!json.body) {
						console.log(`资讯类型 json =`, JSON.stringify(json, null, 4));
					} else {
						let {
							status,
							msg,
							body: {
								result: listDatas,
							},
						} = json;
						listDatas = listDatas.map(
							(obj, i) => {
								let {
									desc: title,
									type: value,
								} = obj;
								value = value.toString();
								return {
									title,
									value,
								};
							}
						);
						if(status != this.$api.SUCCESS){
							this.$hMessage.error(msg);
							return;
						} else {
							this[listType] = listDatas;
						}
					}
				}).catch(err => console.error(`资讯类型 error`, err));
			},
			onNewsListTypeSelectChange(type = `newsListType`) {
				// let value = this[type];
				let value = this.newsListType;
				this.newsListType = value.toString();
				// console.log(`newsListType value =`, value);
				// let {
				//     newsListType,
				// } = this.newsListType;
				// console.log(`newsListType =`, newsListType);
			},
			// init
			init () {
				this.getWindowMaxWidth();
				this.getDictByDictCode(1005, "processingStates");
				this.getColumnCategoryByKeyWord(7, ``, `columnCategories`);
				// ???
				this.getProcessingPersonnelsByKeyWord(``, `processingPersonnels`);
				this.getPriorityByDictCode();
				// newsListTypes
				this.getNewsListTypes();
				let {
					current,
					size,
				} = this.pagination;
				this.getCommonTableDatas({
					publishTime: TODAY,
					publishTimeEnd: TODAY,
					current,
					size,
					// dataStatus: "0",
				});
			},
			globalBindKeyboardShortcuts() {
				let body = document.querySelector(`body`);
				let bindFlag = body.dataset.bindFlag;
				let isCtrlPressed = false;
				let isAltPressed = false;
				if (bindFlag === "true") {
					console.log(`emergengcy-off-shelves, body no need binding again!`);
				} else {
					console.log(`emergengcy-off-shelves, body only need binding once!`);
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
		},
		mounted() {
			this.init();
			let isGobalBindKS = window.sessionStorage.getItem(`isGobalBindKeyboardShortcuts`);
			// isGobalBindKS === "true"
			if (isGobalBindKS) {
				// only bind once
				console.warn(`emergengcy-off-shelves, KeyboardShortcuts, only need bind once!`, isGobalBindKS);
			} else {
				// init bind
				console.info(`emergengcy-off-shelves, KeyboardShortcuts, bind once!`, isGobalBindKS);
				this.globalBindKeyboardShortcuts();
				window.sessionStorage.setItem(`isGobalBindKeyboardShortcuts`, true);
			}
		},
		activated: function(){
			// keep-alive 组件激活时调用。
			// this.$hMessage.success(`keep-alive 组件激活时调用`);
			// console.log(`keep-alive 组件激活时调用`);
			if (this.isAutoRefreshTable) {
				this.onClickButton(`search`);
			} else {
				// no need!
			}
		},
	}
</script>
<style type="text/css" scoped>
.header-btn{
	text-align : right;
}
.header-condition>>> .h-select{
	width: 150px;
}
.header-condition > li{
	display: inline-block;
	margin-bottom: 5px;
}
</style>

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
	.audit-common-lable-placeholder{
		@include common-lable($default-color);
	}
	.audit-common-padding{
		display: block;
		padding-bottom: 5px;
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
</style>

<style lang="scss">
	[data-icons="01"] {
		display: inline-block;
		content: url("./icons/01.png");
		width: 14px;
		height: 14px;
		background: #fff;
		transform: translateY(2px) translateX(-3px);
	}
	[data-icons="02"] {
		display: inline-block;
		content: url("./icons/02.png");
		width: 14px;
		height: 14px;
		background: #fff;
		transform: translateY(2px) translateX(-3px);
	}
	[data-icons="03"] {
		display: inline-block;
		content: url("./icons/03.png");
		width: 14px;
		height: 14px;
		background: #fff;
		transform: translateY(2px) translateX(-3px);
	}
	[data-icons="04"] {
		display: inline-block;
		content: url("./icons/04.png");
		width: 14px;
		height: 14px;
		background: #fff;
		transform: translateY(2px) translateX(-3px);
	}
	[data-icons="05"] {
		display: inline-block;
		content: url("./icons/05.png");
		width: 14px;
		height: 14px;
		background: #fff;
		transform: translateY(2px) translateX(-3px);
	}
	[data-icons="06"] {
		display: inline-block;
		content: url("./icons/06.png");
		width: 14px;
		height: 14px;
		background: #fff;
		transform: translateY(2px) translateX(-3px);
	}
	[data-icons="07"] {
		display: inline-block;
		content: url("./icons/07.png");
		width: 14px;
		height: 14px;
		background: #fff;
		transform: translateY(2px) translateX(-3px);
	}
</style>
