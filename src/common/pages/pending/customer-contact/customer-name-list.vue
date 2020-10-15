<template>
	<section>
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>客户姓名：</dt>
						<dd>
							<h-input
								placeholder="请输入客户姓名"
								v-model="commonFilters.customerName"
								@on-change="onChangeInput(`customerName`)"
								@on-enter="onChangeInputEnter(`customerName`)"
								ref="customerName"
								@on-click="shitClearableClick(`customerName`)"
								icon="android-close">
							</h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>客户职位：</dt>
						<dd>
							<h-input
								placeholder="请输入客户职位"
								v-model="commonFilters.customerRank"
								@on-change="onChangeInput(`customerRank`)"
								@on-enter="onChangeInputEnter(`customerRank`)"
								ref="customerRank"
								@on-click="shitClearableClick(`customerRank`)"
								icon="android-close">
							</h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>所属部门：</dt>
						<dd>
							<h-input
								placeholder="请输入所属部门"
								v-model="commonFilters.affiliatedDepartments"
								@on-change="onChangeInput(`affiliatedDepartments`)"
								@on-enter="onChangeInputEnter(`affiliatedDepartments`)"
								ref="affiliatedDepartments"
								@on-click="shitClearableClick(`affiliatedDepartments`)"
								icon="android-close">
							</h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>钉钉企业名称：</dt>
						<dd>
							<h-input
								placeholder="请输入钉钉企业名称"
								v-model="commonFilters.dingCompanyName"
								@on-change="onChangeInput(`dingCompanyName`)"
								@on-enter="onChangeInputEnter(`dingCompanyName`)"
								ref="dingCompanyName"
								@on-click="shitClearableClick(`dingCompanyName`)"
								icon="android-close">
							</h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>钉钉所属行业：</dt>
						<dd>
							<h-input
								placeholder="请输入钉钉所属行业"
								v-model="commonFilters.dingAffiliatedIndustries"
								@on-change="onChangeInput(`dingAffiliatedIndustries`)"
								@on-enter="onChangeInputEnter(`dingAffiliatedIndustries`)"
								ref="dingAffiliatedIndustries"
								@on-click="shitClearableClick(`dingAffiliatedIndustries`)"
								icon="android-close">
							</h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>开探企业名称：</dt>
						<dd>
							<h-input
								placeholder="请输入开探企业名称"
								v-model="commonFilters.exploreCompanyName"
								@on-change="onChangeInput(`exploreCompanyName`)"
								@on-enter="onChangeInputEnter(`exploreCompanyName`)"
								ref="exploreCompanyName"
								@on-click="shitClearableClick(`exploreCompanyName`)"
								icon="android-close">
							</h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>企业所属地域：</dt>
						<dd>
							<h-input
								placeholder="请输入企业所属地域"
								v-model="commonFilters.exploreAffiliatedArea"
								@on-change="onChangeInput(`exploreAffiliatedArea`)"
								@on-enter="onChangeInputEnter(`exploreAffiliatedArea`)"
								ref="exploreAffiliatedArea"
								@on-click="shitClearableClick(`exploreAffiliatedArea`)"
								icon="android-close">
							</h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>企业联系地址：</dt>
						<dd>
							<h-input
								placeholder="请输入企业联系地址"
								v-model="commonFilters.businessContactAddress"
								@on-change="onChangeInput(`businessContactAddress`)"
								@on-enter="onChangeInputEnter(`businessContactAddress`)"
								ref="businessContactAddress"
								@on-click="shitClearableClick(`businessContactAddress`)"
								icon="android-close">
							</h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>最小员工人数：</dt>
						<dd>
							<h-input
								placeholder="请输入最小员工人数"
								v-model="commonFilters.minEmployees"
								@on-change="onChangeInput(`minEmployees`)"
								@on-enter="onChangeInputEnter(`minEmployees`)"
								ref="minEmployees"
								@on-click="shitClearableClick(`minEmployees`)"
								icon="android-close">
							</h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>最大员工人数：</dt>
						<dd>
							<h-input
								placeholder="请输入最大员工人数"
								v-model="commonFilters.maxEmployees"
								@on-change="onChangeInput(`maxEmployees`)"
								@on-enter="onChangeInputEnter(`maxEmployees`)"
								ref="maxEmployees"
								@on-click="shitClearableClick(`maxEmployees`)"
								icon="android-close">
							</h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>应用开通人：</dt>
						<dd>
							<h-select
								placeholder="请选择应用开通人"
								v-model="commonFilters.appOpenPerson"
								@on-change="onChangeSelect(`appOpenPerson`)"
								filterable
								:clearable="true">
								<h-option
									v-for="(item, i) in appOpenPersons"
									:value="item.value"
									:key="i">
									{{item.title}}
								</h-option>
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
						</h-page>
					</div>
				</h-col>
			</h-row>
		</div>
		<!-- modal -->
		<h-msgBox
			v-if="!isBatchDelete"
			title="呼叫操作"
			@on-ok="reSureDelete"
			v-model="modalDelete.showModal"
			:loading="modalDelete.modalLoading">
			确认呼叫: <span data-font="remove-word">{{removeWordName}}</span>
		</h-msgBox>
	</section>
</template>

<script>
	/**
	 *
	 * @author xiagq
	 * @copyright gildata
	 *
	 * @created 2019.04.03
	 * @modified 2019.04.03
	 *
	 * @description 客户名单列表 customer-contact/customer-name-list
	 * @augments CustomerContactCustomerNameList
	 * @example
	 *
	 */
	import {
		fetchDelete,
		// TODAY,
		// TODAY_Begin,
		// TODAY_End,
		// TODAY_TimeStamp,
	} from "./utils";
	export default {
		name: "Customer-contactCustomer-name-list",
		data () {
			return {
				appOpenPersons: [
					{
						title: "否",
						value: 0,
					},
					{
						title: "是",
						value: 1,
					},
				],
				callObj: {
					csrId: "",
					csrName: "",
					corpId: "",
					id: "",
				},
				tags: [
					"标签 a",
					"标签 b",
					"标签 c",
				],
				isAutoRefreshTable: true,
				// isAutoRefreshTable: false,
				asyncButtonLoading: false,
				isModifyEmptyLabelWord: true,
				passedAmbiguousWordId: "",
				passedAmbiguousWordName: "",
				wordRemoveIndex: "",
				wordRemoveId: "",
				uploadButtonLoading: false,
				isUploadFileEmpty: true,
				isEmptyLabelWord: true,
				newsId: "",
				labelWord: "",
				file: "",
				removeWord: "",
				removeWordName: "",
				wordRemoveReason: "",
				wordRemoveReasons: [],
				newsListTypes: [],
				newsListType: "",
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
				processingPersonnels: [],
				newsIds: [],
				commonFilters: {
					customerName: "",
					customerRank: "",
					affiliatedDepartments: "",
					dingCompanyName: "",
					dingAffiliatedIndustries: "",
					exploreCompanyName: "",
					exploreAffiliatedArea: "",
					businessContactAddress: "",
					numberOfemployees: "",
					minEmployees: "",
					maxEmployees: "",
					appOpenPerson: 1,
				},
				commonFiltersPagination: {
					customerName: "",
					customerRank: "",
					affiliatedDepartments: "",
					dingCompanyName: "",
					dingAffiliatedIndustries: "",
					exploreCompanyName: "",
					exploreAffiliatedArea: "",
					businessContactAddress: "",
					numberOfemployees: "",
					minEmployees: "",
					maxEmployees: "",
					appOpenPerson: 1,
				},
				placeholders: {
					// publishDateRange: "开始日期    ~    结束日期",
					publishDateRange: "开始日期                    ~                    结束日期",
					publishDate: "请输入查询日期",
				},
				commonTableCols: [
					{
						type: "selection",
						width: 60,
						align: "center",
						fixed: "left",
					},
					{
						key: "customerIcon",
						title: "客户 icon",
						width: 200,
						align: "center",
						fixed: "left",
						// sortable: true,
						// className: "disabled-user-selection",
						render: (h, params) => {
							let userName = params.row.customerIcon;
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
						key: "csrName",
						title: "客户姓名",
						width: 100,
						align: "center",
					},
					{
						key: "openAppUser",
						title: "应用开通人",
						width: 100,
						align: "center",
					},
					{
						key: "position",
						title: "客户职位",
						width: 100,
						align: "center",
					},
					{
						key: "deptName",
						title: "所属部门",
						width: 100,
						align: "center",
					},
					{
						key: "corpName",
						title: "钉钉企业名称",
						width: 200,
						align: "center",
					},
					{
						key: "industry",
						title: "钉钉所属行业",
						width: 150,
						align: "center",
					},
					{
						key: "count",
						title: "企业员工人数",
						width: 120,
						align: "center",
					},
					{
						key: "exploreCorpName",
						title: "开探企业名称",
						width: 200,
						align: "center",
					},
					{
						key: "exploreCorpPhone",
						title: "开探企业电话",
						width: 150,
						align: "center",
						render: (h, params) => {
							let tel = params.row.exploreCorpPhone;
							if (tel) {
								return h("div", [
									h("Icon", {
										props: {
											name: "ios-call"
										}
									}),
									h("a", {
										attrs: {
											"data-tel": tel,
											href: `tel: ${tel}`,
										},
										style: {
											textDecoration: "none",
											color: " rgb(41, 141, 255) !important",
										},
										class: {
											"alink-no-text-decoration": true,
										}
									}, tel),
								]);
							} else {
								return h("div", [
									h("Icon", {
										props: {
											name: "ios-call"
										}
									}),
								]);
							}
						},
					},
					{
						key: "exploreCorpRegion",
						title: "开探企业地域",
						width: 150,
						align: "center",
					},
					{
						key: "exploreCorpAddress",
						title: "开探企业地址",
						width: 300,
						align: "center",
					},
					{
						key: "lastSuccessTime",
						title: "上次成功呼叫时间",
						width: 200,
						align: "center",
					},
					{
						key: "createTime",
						// title: "创建时间",
						title: "授权时间",
						width: 200,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
					},
					{
						key: "updateTime",
						title: "修改时间",
						width: 200,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
					},
					{
						key: "operation",
						title: "操作",
						width: 150,
						align: "center",
						fixed: "right",
						render: (h, params) => {
							let {
								csrId,
								csrName,
								corpId,
								id,
								// isAuthAdminDesc
								newsOperateVoList: operateVoList,
							} = params.row;
							// let newsOperateVoList = params.row.newsOperateVoList;
							let operateTitle = operateVoList.operateDesc;
							let newsOperateVoList = [
								{
									title: operateTitle,
									// title: `呼叫-${csrName}`,
									url: "",
									type: 1,
								},
								// {
								//     title: "删除",
								//     url: "",
								//     type: 0,
								// },
							];
							// let {
							//     customerName: eliminateWord,
							// } = this.commonFilters;
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
											operateUrl = `/tm/tag/getWordList`;
											// operateUrl = `/tm/getNewsInfoById`;
											routerPath = `/audit/news/dissociation-maintenance/operate-handle`;
											break;
										default:
											operateUrl = `#type=删除`;
											// routerPath = `/audit/news/operate-verify`;
											break;
									}
									if (operateTitle === "--") {
										return h("span", {}, desc);
									} else {
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
													// 删除, 处理
													let options = {
														path: routerPath,
													};
													if (type === 1) {
														// this.wordRemoveId = customerNameId;
														// this.wordRemoveIndex = wordRemoveIndex;
														// this.removeWord = customerNameId;
														// this.removeWordName = customerNameName;
														this.removeWordName = csrName;
														this.callObj = {
															csrId,
															csrName,
															corpId,
															id,
														};
														this.clickShowResureDeleteModal();
													} else {
														// if (type === 1) {
														//     window.sessionStorage.setItem(`dissociation-maintenance_trueObj_${new_type}`, JSON.stringify(trueObj));
														//     this.$router.push(`/audit/news/dissociation-maintenance/operate-handle`);
														// }
													}
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
				commonTableColsUnselection: [
					{
						key: "customerIcon",
						title: "客户头像",
						width: 80,
						align: "center",
						fixed: "left",
						// sortable: true,
						// className: "disabled-user-selection",
						render: (h, params) => {
							let avatar= params.row.customerIcon;
							// avatar
							if (avatar) {
								return h("div", [
									// h("Icon", {
									//     props: {
									//         name: "person"
									//     }
									// }),
									h("img", {
										style: {
											// width: "100%",
											// height: "100%",
											width: "30px",
											height: 30,
											verticalAlign: "middle",
											borderRadius: "50%",
										},
										attrs: {
											src: avatar,
										},
									}),
									// h("strong", avatar),
								]);
							} else {
								return h("div", [
									h("Icon", {
										props: {
											name: "person"
										}
									}),
									h("strong", avatar),
								]);
							}
						},
					},
					{
						key: "csrName",
						title: "客户姓名",
						width: 100,
						align: "center",
					},
					{
						key: "openAppUser",
						title: "应用开通人",
						width: 100,
						align: "center",
					},
					{
						key: "position",
						title: "客户职位",
						width: 100,
						align: "center",
					},
					{
						key: "deptName",
						title: "所属部门",
						width: 100,
						align: "center",
					},
					{
						key: "corpName",
						title: "钉钉企业名称",
						width: 200,
						align: "center",
					},
					{
						key: "industry",
						title: "钉钉所属行业",
						width: 150,
						align: "center",
					},
					{
						key: "count",
						title: "企业员工人数",
						width: 120,
						align: "center",
					},
					{
						key: "exploreCorpName",
						title: "开探企业名称",
						width: 200,
						align: "center",
					},
					{
						key: "exploreCorpPhone",
						title: "开探企业电话",
						width: 150,
						align: "center",
						render: (h, params) => {
							let tel = params.row.exploreCorpPhone;
							if (tel) {
								return h("div", [
									h("Icon", {
										props: {
											name: "ios-call-outline",
											// name: "ios-call",
										}
									}),
									h("a", {
										attrs: {
											"data-tel": tel,
											href: `tel: ${tel}`,
										},
										style: {
											textDecoration: "none",
											color: " rgb(41, 141, 255) !important",
										},
										class: {
											"alink-no-text-decoration": true,
										}
									}, tel),
								]);
							} else {
								return h("div", [
									h("Icon", {
										props: {
											name: "ios-call"
										}
									}),
								]);
							}
						},
					},
					{
						key: "exploreCorpRegion",
						title: "开探企业地域",
						width: 150,
						align: "center",
					},
					{
						key: "exploreCorpAddress",
						title: "开探企业地址",
						width: 300,
						align: "center",
					},
					{
						key: "lastSuccessTime",
						title: "上次成功呼叫时间",
						width: 200,
						align: "center",
					},
					{
						key: "createTime",
						// title: "创建时间",
						title: "授权时间",
						width: 200,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
					},
					{
						key: "updateTime",
						title: "修改时间",
						width: 200,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
					},
					{
						key: "operation",
						title: "操作",
						width: 150,
						align: "center",
						fixed: "right",
						render: (h, params) => {
							let {
								csrId,
								csrName,
								corpId,
								id,
								// isAuthAdminDesc
								newsOperateVoList: operateVoList,
							} = params.row;
							// let newsOperateVoList = params.row.newsOperateVoList;
							let operateTitle = operateVoList.operateDesc;
							let newsOperateVoList = [
								{
									title: operateTitle,
									// title: `呼叫-${csrName}`,
									url: "",
									type: 1,
								},
								// {
								//     title: "删除",
								//     url: "",
								//     type: 0,
								// },
							];
							// if (isAuthAdminDesc === "是") {
							//     //
							// }
							// if (isAuthAdminDesc === "否") {
							//     //
							// }
							// let {
							//     customerName: eliminateWord,
							// } = this.commonFilters;
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
											operateUrl = `/tm/tag/getWordList`;
											// operateUrl = `/tm/getNewsInfoById`;
											routerPath = `/audit/news/dissociation-maintenance/operate-handle`;
											break;
										default:
											operateUrl = `#type=删除`;
											// routerPath = `/audit/news/operate-verify`;
											break;
									}
									if (operateTitle === "--") {
										return h("span", {}, desc);
									} else {
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
													// 删除, 处理
													let options = {
														path: routerPath,
													};
													if (type === 1) {
														// this.wordRemoveId = customerNameId;
														// this.wordRemoveIndex = wordRemoveIndex;
														// this.removeWord = customerNameId;
														// this.removeWordName = customerNameName;
														this.removeWordName = csrName;
														this.callObj = {
															csrId,
															csrName,
															corpId,
															id,
														};
														this.clickShowResureDeleteModal();
													} else {
														// if (type === 1) {
														//     window.sessionStorage.setItem(`dissociation-maintenance_trueObj_${new_type}`, JSON.stringify(trueObj));
														//     this.$router.push(`/audit/news/dissociation-maintenance/operate-handle`);
														// }
													}
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
			}
		},
		computed: {
			maxTableHeight(){ return this.$store.state.maxTableHeight },
		},
		methods: {
			onChangeSelect (type = ``) {
				let value = this.commonFilters[type];
				// this.$hMessage.info(value);
			},
			handleCloseTag (event, name) {
				const index = this.tags.indexOf(name);
				this.tags.splice(index, 1);
			},
			// handleCloseTag (e) {
			//     console.log(`tag =`, e);
			//     console.log(`tag =`, e.target.innerText);
			// },
			// tags
			onChangeSwitch(value = ``) {
				console.log(`switch value =`, value);
				// `isAutoRefreshTable`
			},
			onModifyInputChange (type = ``) {
				let value = this[type];
				this[type] = value.trim();
				if (type === `passedAmbiguousWordName`) {
					if (!value) {
						this.$refs[type].focus();
						this.isModifyEmptyLabelWord = true;
						this.$hMessage.info(`待消歧词不可以为空!`);
					} else {
						this.isModifyEmptyLabelWord = false;
					}
				}
			},
			onModifyInputEnter (type = ``) {
				let value = this[type];
				this[type] = value.trim();
				if (value) {
					if (type === "passedAmbiguousWordName") {
						this.isModifyEmptyLabelWord = false;
						// enter
						this.asyncModifyAmbiguousWord();
					} else {
						// this.isModifyEmptyLabelWord = true;
					}
				} else {
					if (type === "passedAmbiguousWordName") {
						this.isModifyEmptyLabelWord = true;
					} else {
						// this.isModifyEmptyLabelWord = false;
					}
				}
			},
			onModifyInputClearable(type = ``) {
				this[type] = ``;
				this.$refs[type].focus();
				if (type === "passedAmbiguousWordName") {
					this.isModifyEmptyLabelWord = true;
				}
			},
			showModify() {
				this.modalModify.showModal = true;
			},
			reSureModify() {
				this.modalModify.showModal = false;
				this.asyncModifyAmbiguousWord();
			},
			reSureModifyCancel () {
				this.modalModify.showModal = false;
				// this.passedAmbiguousWordName = ``;
				// this.passedAmbiguousWordId = ``;
			},
			// 更新待消歧词
			asyncModifyAmbiguousWord() {
				let url = `/tm/tag/modifyDiffMeaningsWord`;
				let word = this.passedAmbiguousWordName || ``;
				let id = this.passedAmbiguousWordId || ``;
				this.asyncButtonLoading = true;
				this.$http
				.post(url, {
					word,
					id,
				})
				.then(res => res.data)
				.then((json)=>{
					 let {
						status,
						msg,
						// body,
					} = json;
					if(status != this.$api.SUCCESS){
						this.asyncButtonLoading = false;
						this.modalModify.showModal = false;
						this.$hMessage.error(msg);
						return;
					} else {
						this.modalModify.showModal = false;
						setTimeout(() => {
							this.asyncButtonLoading = false;
							this.$hMessage.success(`更新待消歧词成功!`);
							this.onClickButton(`search`);
						}, 500);
					}
				}).catch(err => console.error(`更新待消歧词  error`, err));;
			},
			autoClearInputFile() {
				let upload = document.querySelector(`#dissociation_upload_execel_file`);
				if (upload) {
					upload.replaceWith(upload.val(``).clone(true));
				}
			},
			autoBindUpload() {
				let that = this;
				let upload = document.querySelector(`#dissociation_upload_execel_file`);
				let isBind = upload.dataset.isBind || false;
				if (!isBind) {
					upload.dataset.isBind = true;
					upload.addEventListener(`change`, function() {
						let file = this.files[0];
						let {
							name,
						} = file;
						if (file) {
							if (name.includes(`.xlsx`)) {
								that.isUploadFileEmpty = false;
								that.file = file;
							} else {
								that.$hMessage.info(`请选择 Excel 文件上传!`);
								that.isUploadFileEmpty = true;
								that.file = "";
							}
						} else {
							that.isUploadFileEmpty = true;
							that.file = "";
						}
					}, false);
				} else {
					console.info(`only need bind once!`);
				}
			},
			onInputChange (type = ``) {
				// console.log(`labelWord type =`, type);
				// console.log(`labelWord value =`, this[type]);
				let value = this[type];
				this[type] = value.trim();
				if (type === `labelWord`) {
					if (!value.trim()) {
						this.$refs[type].focus();
						this.isEmptyLabelWord = true;
						this.$hMessage.info(`待消歧词不可以为空!`);
					} else {
						this.isEmptyLabelWord = false;
					}
				}
			},
			onInputEnter (type = ``) {
				let value = this[type];
				this[type] = value.trim();
				if (value.trim()) {
					if (type === "labelWord") {
						this.isEmptyLabelWord = false;
						// enter
						this.asyncAddAmbiguousWord();
					} else {
						// this.isEmptyLabelWord = true;
					}
				} else {
					if (type === "labelWord") {
						this.isEmptyLabelWord = true;
					} else {
						// this.isEmptyLabelWord = false;
					}
				}
			},
			onInputClearable(type = ``) {
				this[type] = ``;
				this.$refs[type].focus();
				if (type === "labelWord") {
					this.isEmptyLabelWord = true;
				}
			},
			// 添加待消歧词
			asyncAddAmbiguousWord() {
				let url = `/tm/tag/addDiffMeaningsWord`;
				let word = this.labelWord || "";
				let newsId = this.newsId || ``;
				this.$http
				.post(url, {
					diffMeaningsWord: word,
					newsId,
				})
				.then(res => res.data)
				.then((json)=>{
					 let {
						status,
						msg,
						// body,
					} = json;
					if(status != this.$api.SUCCESS){
						this.modalAdd.showModal = false;
						this.$hMessage.error(msg);
						return;
					} else {
						this.modalAdd.showModal = false;
						this.$hMessage.success(`添加待消歧词成功!`);
						this.onClickButton(`search`);
					}
				}).catch(err => console.error(`添加待消歧词  error`, err));;
			},
			showAdd() {
				// this.modalAdd.showModal = true;
				this.$router.push(`/audit/news/dissociation-maintenance/operate-view`);
			},
			reSureAddCancel() {
				this.modalAdd.showModal = false;
				this.labelWord = "";
				this.newsId = ``;
			},
			reSureAdd() {
				this.modalAdd.showModal = false;
				this.asyncAddAmbiguousWord();
			},
			reSureDelete () {
				// let uids = this.batchDeleteUids || [];
				// this.batchDeleteNewsIds(uids);
				let {
					csrId,
					csrName,
					corpId,
					id,
				} = this.callObj;
				let options = {
					csrId,
					corpId,
					id,
				};
				// this.deleteWordById(uid);
				this.makeACall(options);
			},
			clickShowResureDeleteModal(isBatch = false) {
				this.wordRemoveReason = "";
				this.modalDelete.showModal = true;
				if (isBatch) {
					this.isBatchDelete = true;
				} else {
					this.isBatchDelete = false;
				}
				// setTimeout(() => {
				//     this.$refs["word-remove-reason"].focus();
				// }, 500);
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
				this.onClickButton(`search`);
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
					customerName: csrName,
					customerRank: position,
					affiliatedDepartments: deptName,
					dingCompanyName: corpName,
					dingAffiliatedIndustries: industry,
					exploreCompanyName: exploreCorpName,
					exploreAffiliatedArea: exploreCorpRegion,
					businessContactAddress: exploreCorpAddress,
					numberOfemployees: count,
					minEmployees: minCount,
					maxEmployees: maxCount,
					appOpenPerson: isAuthAdmin,
				}= this.commonFilters;
				this.commonFiltersPagination = {...this.commonFilters};
				// init
				this.pagination.current = 1;
				let {
					current,
					size,
				} = this.pagination;
				let options = {
					csrName,
					corpName,
					// count,
					minCount,
					maxCount,
					deptName,
					exploreCorpAddress,
					exploreCorpName,
					exploreCorpRegion,
					industry,
					position,
					current,
					size,
					isAuthAdmin,
				};
				switch (type) {
					case "search":
						this.getCommonTableDatas(options);
						break;
					default:
						// this.getCommonTableDatas(options);
						break;
				}
				// this.getCommonTableDatas(options);
			},
			getNewTableDatas (pagination = {}) {
				let {
					customerName: csrName,
					customerRank: position,
					affiliatedDepartments: deptName,
					dingCompanyName: corpName,
					dingAffiliatedIndustries: industry,
					exploreCompanyName: exploreCorpName,
					exploreAffiliatedArea: exploreCorpRegion,
					businessContactAddress: exploreCorpAddress,
					numberOfemployees: count,
					minEmployees: minCount,
					maxEmployees: maxCount,
					appOpenPerson: isAuthAdmin,
				} = this.commonFiltersPagination;
				let {
					current,
					size,
				} = pagination;
				let options = {
					csrName,
					corpName,
					// count,
					minCount,
					maxCount,
					deptName,
					exploreCorpAddress,
					exploreCorpName,
					exploreCorpRegion,
					industry,
					position,
					current,
					size,
					isAuthAdmin,
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
									newsId,
								} = obj;
								return newsId;
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
			onClickBatchDelete(type = `delete`) {
				this.clickShowResureDeleteModal(true);
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
						// this.onClickButton(`search`);
					}
				}).catch(err => console.error(`删除 error`, err));
			},
			// 删除
			deleteWordById(uid = ``) {
				// let uid = this.deleteWordUid;
				// let {
				//     wordRemoveReason,
				// } = this.$data;
				let options = {
					id: uid,
					// removeType: wordRemoveReason,
				};
				// let url = `/tm/tag/removeWord`;
				let url = `/tm/deleteEliminateAmbiguity/${uid}`;
				// let url = `/tm/deleteEliminateAmbiguity/id`;
				// let url = `/tm/deleteEliminateAmbiguity`;
				this.tableLoading = true;
				this.$http
				.delete(url)
				// .delete(url, {
				//     data: options,
				// })
				.then(res => res.data)
				.then((json)=>{
					let {
						status,
						msg,
						body,
					} = json;
					if(status != this.$api.SUCCESS){
						console.log(`删除 json =`, JSON.stringify(json, null, 4));
						this.$hMessage.error(msg);
						this.modalDelete.showModal = false;
						this.tableLoading = false;
						return;
					} else {
						// let index = this.wordRemoveIndex;
						// console.log(`index`);
						// this.remove(index);
						// this.$hMessage.success(msg);
						this.$hMessage.success("删除成功");
						this.modalDelete.showModal = false;
						this.tableLoading = false;
						this.onClickButton(`search`);
					}
				}).catch(err => console.error(`删除 error`, err));
			},
			// 列表
			getCommonTableDatas (options = {}, debug = false) {
				this.tableLoading = true;
				let url = `/tm/getCustomerInfos`;
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
						console.log(`dissociation-maintenance 资讯列表 json =`, JSON.stringify(json, null, 4));
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
							permitDelete: isDeletePermission,
							records: listDatas,
						} = body;
						// console.log(`isDeletePermission =`, isDeletePermission);
						if (isDeletePermission === undefined) {
							isDeletePermission = false;
							this.commonTableCols = this.commonTableColsUnselection;
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
										// csrName: customerName,
										// corpName,
										// count,
										// current,
										// size,
										// deptName,
										// exploreCorpAddress,
										// exploreCorpName,
										// exploreCorpRegion,
										// industry,
										// position,
										// csrId: customerId,
										// csrName: customerName,
										csrId,
										csrName,
										corpId,
										corpName,
										count,
										current,
										size,
										deptName,
										exploreCorpAddress,
										exploreCorpName,
										exploreCorpRegion,
										exploreCorpPhone,
										industry,
										position,
										// createTime,
										openApplicationTime: createTime,
										updateTime,
										newsOperateVoList,
										avatar: customerIcon,
										isAuthAdminDesc: openAppUser,
										id,
										lastCallTime: lastSuccessTime,
									} = obj;
									if (!openAppUser) {
										openAppUser = "";
									}
									if (!createTime) {
										createTime = "";
									}
									if (!updateTime) {
										updateTime = "";
									}
									if (!customerIcon) {
										customerIcon = "";
									}
									return {
										index: i,
										// index: i + 1,
										customerIcon,
										csrId,
										csrName,
										corpId,
										corpName,
										count,
										deptName,
										exploreCorpAddress,
										exploreCorpName,
										exploreCorpRegion,
										exploreCorpPhone,
										industry,
										position,
										createTime,
										updateTime,
										current,
										size,
										newsOperateVoList: newsOperateVoList[0],
										openAppUser,
										id,
										lastSuccessTime,
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
			getTableDatas (options = {}, debug = false) {
				// options = {
				//     //
				// };
				this.tableLoading = true;
				let url = `/tm/getCustomerInfos`;
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
						console.log(`dissociation-maintenance 资讯列表 json =`, JSON.stringify(json, null, 4));
						// this.initTableDatas = [];
						// this.commonTableDatas = [];
						// this.tableLoading = false;
						return;
					} else {
						let {
							current,
							total,
							pages,
							size,
							// permitDelete: isDeletePermission,
							// records: listDatas,
							// eliminateList: listDatas,
						} = body;
						// this.commonTableDatas = listDatas;
						// this.tableLoading = false;
					}
				}).catch(err => console.error(`处理状态  error`, err));
			},
			makeACall (options = {}) {
				// this.tableLoading = true;
				let url = `/tm/call`;
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
						// console.log(`call json =`, JSON.stringify(json, null, 4));
						this.$hMessage.error(`拨打电话失败: ${msg}`);
						// this.$hMessage.info(`拨打电话失败!`);
						// this.tableLoading = false;
						this.modalDelete.showModal = false;
						this.modalDelete.modalLoading = false;
						return;
					} else {
						this.modalDelete.showModal = false;
						this.modalDelete.modalLoading = false;
						this.$hMessage.success(`拨打电话成功!`);
						// this.tableLoading = false;
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
			getNewsListTypeById(id = ``) {
				let url = `/tm/getNewsInfoById?newsId=${id}`;
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
						let {
							dataType: newsListType,
						} = body;
						// console.log(`newsListType =`, newsListType);
						let flipObj = {
							newsId: id,
							newsListType,
							// current: 1,
							// dataStatus: "0",
							// dataType: "",
							// fbsj: "2019-03-06 09:39:13",
							// gkbz: "",
							// handleUser: "",
							// keyword: "",
							// mtcc: "",
							// newsId: "792019030601031654318005",
							// newsType: "",
							// publishTime: "2019-03-06",
							// publishTimeEnd: "2019-03-06",
							// size: 12,
							// tag: "",
							// xwbt: "",
						};
						let queryObj = {
							"type": newsListType,
							"desc": "查看",
							"uid": id,
							"url": "/tm/getNewsInfoById",
						};
						window.sessionStorage.setItem("all-in-one_flipObj_view", JSON.stringify(flipObj));
						window.sessionStorage.setItem("all-in-one_route_query_view", JSON.stringify(queryObj));
						let url = `/audit/news/all-in-one/operate-view#${id}`;
						this.$router.push(url);
					}
				}).catch(err => console.error(`NewsListType error`, err));
			},
			// init
			init () {
				this.getWindowMaxWidth();
				let {
					// current,
					size,
				} = this.pagination;
				this.getCommonTableDatas({
					current: 1,
					size,
					isAuthAdmin: 1,
				});
				// this.getTableDatas({
				//     current: 1,
				//     size,
				//     isAuthAdmin: 1,
				// });
			},
			globalBindKeyboardShortcuts() {
				let body = document.querySelector(`body`);
				let bindFlag = body.dataset.bindFlag;
				let isCtrlPressed = false;
				let isAltPressed = false;
				if (bindFlag === "true") {
					console.log(`dissociation-maintenance, body no need binding again!`);
				} else {
					console.log(`dissociation-maintenance, body only need binding once!`);
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
				let alinks = [...document.querySelector(`[data-alink="dissociation-word-uid"]`)];
				if (alinks.length) {
					alinks.forEach(
						(alink, i) => {
							let flag = alink.dataset.isBind || false;
							if (!flag) {
								alink.dataset.isBind = true;
								alink.addEventListener(`click`, () => {
									let uid = alink.dataset.uid;
									that.$router.push(`/audit/news/dissociation-maintenance#${uid}`);
								});
							}
						}
					);
				}
			},
		},
		mounted() {
			this.init();
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
		width: 100px !important;
		text-align: right;
		&::after{
			/* display: inline-block; */
			content: ":";
		}
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
