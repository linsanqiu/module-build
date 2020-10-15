<template>
	<section>
		<search-form>
			<ul slot="content">
				<li class="row0"></li>
				<li class="row2">
					<dl>
						<dt>时间范围：</dt>
						<dd>
							<h-date-picker
								type="datetimerange"
								format="yyyy-MM-dd HH:mm:ss"
								aria-placeholder="时间范围"
								:placeholder="placeholders.publishDateRange"
								:value="commonFilters.publishDateRange"
								@on-change="onChangeDateRangePicker">
							</h-date-picker>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>操作类型：</dt>
						<dd>
							<h-select
								placeholder="请选择操作类型"
								v-model="commonFilters.operationType"
								filterable
								clearable>
								<h-option
									v-for="(item, i) in operationTypes"
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
						<dt>标签名称：</dt>
						<dd>
							<h-input
								aria-placeholder="标签名称"
								placeholder="请输入标签名称"
								v-model="commonFilters.labelWord"
								@on-change="onChangeInput(`labelWord`)"
								@on-enter="onChangeInputEnter(`labelWord`)"
								ref="labelWord"
								@on-click="shitClearableClick(`labelWord`)"
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
			<h-row class-name="audit-common-row-padding" v-if="isDeletePermission">
				<h-col span="4">
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
			确认删除标签: <span data-font="remove-word">{{removeWordName}}</span>
			<hr class="audit-common-padding" />
			<span class="audit-common-lable">移除原因</span>
			<h-select
				aria-placeholder="标签移除原因"
				placeholder="请选择标签移除原因"
				style="width: 180px"
				ref="word-remove-reason"
				v-model="wordRemoveReason"
				filterable
				clearable>
				<h-option
					v-for="(item, i) in wordRemoveReasons"
					:value="item.value"
					:key="i">
					{{item.title}}
				</h-option>
			</h-select>
		</h-msgBox>
		<h-msgBox
			v-else
			title="批量删除操作"
			@on-ok="reSureDelete"
			v-model="modalDelete.showModal"
			:loading="modalDelete.modalLoading">
			二次确认: 批量删除
		</h-msgBox>
	</section>
</template>

<script>
	/**
	 *
	 * @author xiagq
	 * @copyright gildata
	 *
	 * @created 2019.03.06
	 * @modified 2019.03.06
	 *
	 * @description 标签统计 AuditNewsLabelsStatistics
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
	export default {
		name: "AuditNewsLabels-statistics",
		data () {
			return {
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
				// operationTypes: [],
				// processingStates: [],
				operationTypes: [
					{
						title: "删除",
						value: 0,
					},
					{
						title: "新增",
						value: 1,
					},
				],
				processingStates: [
					{
						title: "待处理",
						value: 0,
					},
					{
						title: "已处理",
						value: 1,
					},
				],
				newsIds: [],
				commonFilters: {
					// publishDate: TODAY,
					// publishDateEnd: TODAY,
					// publishDateRange: [TODAY, TODAY],
					// publishDate: TODAY_Begin,
					// publishDateEnd: TODAY_End,
					// publishDateRange: [TODAY_Begin, TODAY_End],
					publishDate: "",
					publishDateEnd: "",
					publishDateRange: ["", ""],
					operationType: "",
					processingStatus: 0,
					// processingStatus: "",
					labelWord: "",
				},
				commonFiltersPagination: {
					// publishDate: TODAY_Begin,
					// publishDateEnd: TODAY_End,
					// publishDateRange: [TODAY_Begin, TODAY_End],
					publishDate: "",
					publishDateEnd: "",
					publishDateRange: ["", ""],
					operationType: "",
					processingStatus: 0,
					// processingStatus: "",
					labelWord: "",
				},
				placeholders: {
					// publishDateRange: "开始日期    ~    结束日期",
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

					{
						key: "labelStatus",
						title: "标签状态",
						width: 200,
						align: "center",
					},
					{
						key: "labelBid",
						title: "标签 BID",
						width: 150,
						align: "left",
					},
					{
						key: "labelName",
						title: "标签名称",
						width: 150,
						align: "left",
					},
					{
						key: "newsId",
						title: "资讯 ID",
						// sortable: true,
						width: 200,
						align: "left",
						"row-class-name": "disabled-user-selection",
						render: (h, params) => {
							let uid = params.row.newsId;
							return h("a", {
								attrs: {
									title: "点击跳转到资讯处理列表!",
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
										let url = `/audit/news/all-in-one#${uid}`;
										// this.$router.push(url);
										this.getNewsListTypeById(uid);
									},
								}
							}, uid);
						},
					},
					{
						key: "labelCatagory",
						title: "标签分类(一级)",
						width: 200,
						align: "center",
					},
					{
						key: "addType",
						title: "标签操作类型",
						width: 200,
						align: "center",
					},
					{
						key: "addUser",
						title: "添加人",
						width: 200,
						align: "center",
						render: (h, params) => {
							let userName = params.row.addUser;
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
						key: "addTime",
						title: "添加时间",
						width: 200,
						align: "center",
					},
					// {
					//     key: "labelId",
					//     title: "标签 ID",
					//     width: 200,
					//     align: "center",
					// },
					{
						key: "operation",
						title: "操作",
						width: 150,
						align: "center",
						fixed: "right",
						render: (h, params) => {
							// 编辑 / 删除
							let newsOperateVoList = params.row.newsOperateVoList;
							// let newsOperateVoList = [
							//     {
							//         title: "编辑",
							//         url: "",
							//         type: 1,
							//     },
							//     {
							//         title: "删除",
							//         url: "",
							//         type: 0,
							//     },
							// ];
							let {
								labelId,
								labelName,
								index: wordRemoveIndex,
								newsId,
							} = params.row;
							let uid = params.row.newsId;
							let {
								publishDate: startTime,
								publishDateEnd: endTime,
							} = this.commonFilters;
							// 后端翻页
							let {
								current,
								size,
							} = this.pagination;
							let flipObj = {
								// startTime,
								// endTime,
								// createUserId,
								// word,
								// wordType,
								current,
								size,
								// labelWordId,
								// labelWordName,
							};
							let links = [];
							links = newsOperateVoList.map(
								(obj, i) => {
									let {
										// title: desc,
										// type,
										operateDesc: desc,
										operateType: type,
									} = obj;
									let operateUrl = ``;
									let routerPath = ``;
									switch (type) {
										case 1:
											operateUrl = `/tm/tag/getWordList`;
											// operateUrl = `/tm/getNewsInfoById`;
											routerPath = `/audit/news/ambiguous-word-maintenance/operate-handle`;
											break;
										case 2:
											operateUrl = `/tm/getNewsInfoById`;
											routerPath = `/audit/news/ambiguous-word-maintenance/operate-view`;
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
												// 删除, 处理
												let options = {
													path: routerPath,
												};
												if (type === 0) {
													// let uids = [uid];
													// this.batchDeleteUids = uids;
													// this.wordRemoveId = labelWordId;
													// this.wordRemoveIndex = wordRemoveIndex;
													// this.removeWord = labelWordId;
													// this.removeWordName = labelWordName;
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
														let options = {
															id: labelId,
														};
														this.postRemarkById(options);
													}
													if (type === 2) {
														// this.$hMessage.info(`开发中...`);
														// this.$router.push();
														this.$router.push(`/audit/news/labels-statistics/operate-view#${newsId}`);
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
						key: "labelStatus",
						title: "标签状态",
						width: 100,
						align: "center",
						fixed: "left",
					},
					{
						key: "labelBid",
						title: "标签 BID",
						width: 150,
						align: "left",
					},
					{
						key: "labelName",
						title: "标签名称",
						width: 150,
						align: "left",
					},
					{
						key: "newsId",
						title: "资讯 ID",
						// sortable: true,
						width: 200,
						align: "left",
						"row-class-name": "disabled-user-selection",
						render: (h, params) => {
							let uid = params.row.newsId;
							return h("a", {
								attrs: {
									title: "点击跳转到资讯处理列表!",
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
										let url = `/audit/news/all-in-one#${uid}`;
										// this.$router.push(url);
										this.getNewsListTypeById(uid);
									},
								}
							}, uid);
						},
					},
					{
						key: "labelCatagory",
						title: "标签分类(一级)",
						width: 150,
						align: "center",
					},
					{
						key: "addType",
						title: "标签操作类型",
						width: 120,
						align: "center",
					},
					{
						key: "addUser",
						title: "添加人",
						width: 100,
						align: "center",
						render: (h, params) => {
							let userName = params.row.addUser;
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
						key: "addTime",
						title: "添加时间",
						// width: 200,
						align: "center",
					},
					// {
					//     key: "labelId",
					//     title: "标签 ID",
					//     width: 200,
					//     align: "center",
					// },
					{
						key: "operation",
						title: "操作",
						width: 150,
						align: "center",
						fixed: "right",
						render: (h, params) => {
							// 编辑 / 删除
							let newsOperateVoList = params.row.newsOperateVoList;
							// let newsOperateVoList = [
							//     {
							//         title: "编辑",
							//         url: "",
							//         type: 1,
							//     },
							//     {
							//         title: "删除",
							//         url: "",
							//         type: 0,
							//     },
							// ];
							let {
								labelId,
								labelName,
								index: wordRemoveIndex,
								newsId,
							} = params.row;
							let uid = params.row.newsId;
							let {
								publishDate: startTime,
								publishDateEnd: endTime,
							} = this.commonFilters;
							// 后端翻页
							let {
								current,
								size,
							} = this.pagination;
							let flipObj = {
								// startTime,
								// endTime,
								// createUserId,
								// word,
								// wordType,
								current,
								size,
								// labelWordId,
								// labelWordName,
							};
							let links = [];
							links = newsOperateVoList.map(
								(obj, i) => {
									let {
										// title: desc,
										// type,
										operateDesc: desc,
										operateType: type,
									} = obj;
									let operateUrl = ``;
									let routerPath = ``;
									switch (type) {
										case 1:
											operateUrl = `/tm/tag/getWordList`;
											// operateUrl = `/tm/getNewsInfoById`;
											routerPath = `/audit/news/ambiguous-word-maintenance/operate-handle`;
											break;
										case 2:
											operateUrl = `/tm/getNewsInfoById`;
											routerPath = `/audit/news/ambiguous-word-maintenance/operate-view`;
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
												// 删除, 处理
												let options = {
													path: routerPath,
												};
												if (type === 0) {
													// let uids = [uid];
													// this.batchDeleteUids = uids;
													// this.wordRemoveId = labelWordId;
													// this.wordRemoveIndex = wordRemoveIndex;
													// this.removeWord = labelWordId;
													// this.removeWordName = labelWordName;
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
														let options = {
															id: labelId,
														};
														this.postRemarkById(options);
													}
													if (type === 2) {
														// this.$hMessage.info(`开发中...`);
														this.$router.push(`/audit/news/labels-statistics/operate-view#${newsId}`);
														// this.getTagsById(newsId);
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
			// 更新标签
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
						this.modalModify.showModal = false;
						this.$hMessage.error(msg);
						return;
					} else {
						this.modalModify.showModal = false;
						setTimeout(() => {
							this.asyncButtonLoading = false;
							this.$hMessage.success(`更新标签成功!`);
							this.onClickButton(`search`);
						}, 500);
					}
				}).catch(err => console.error(`更新标签  error`, err));;
			},
			autoClearInputFile() {
				let upload = document.querySelector(`#ambiguous_upload_execel_file`);
				if (upload) {
					upload.replaceWith(upload.val(``).clone(true));
				}
			},
			autoBindUpload() {
				let that = this;
				let upload = document.querySelector(`#ambiguous_upload_execel_file`);
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
						this.$hMessage.info(`标签不可以为空!`);
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
			// 添加标签
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
						this.$hMessage.success(`添加标签成功!`);
						this.onClickButton(`search`);
					}
				}).catch(err => console.error(`添加标签  error`, err));;
			},
			showAdd() {
				this.modalAdd.showModal = true;
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
				let uid = this.wordRemoveId;
				this.deleteWordById(uid);
			},
			clickShowResureDeleteModal(isBatch = false) {
				this.wordRemoveReason = "";
				this.modalDelete.showModal = true;
				if (isBatch) {
					this.isBatchDelete = true;
				} else {
					this.isBatchDelete = false;
				}
				setTimeout(() => {
					this.$refs["word-remove-reason"].focus();
				}, 500);
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
					publishDate: startTime,
					publishDateEnd: endTime,
					operationType: operateType,
					processingStatus: isHandle,
					labelWord: tagName,
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
					tagName,
					isHandle,
					operateType,
					current,
					size,
				};
				switch (type) {
					case "add":
						this.showAdd();
						break;
					case "upload":
						this.showUpload();
						break;
					case "download":
						this.showDownload();
						break;
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
					publishDate: startTime,
					publishDateEnd: endTime,
					operationType: operateType,
					processingStatus: isHandle,
					labelWord: tagName,
				}= this.commonFiltersPagination;
				let {
					current,
					size,
				} = pagination;
				let options = {
					startTime,
					endTime,
					tagName,
					isHandle,
					operateType,
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
				let {
					wordRemoveReason,
				} = this.$data;
				let options = {
					id: uid,
					removeType: wordRemoveReason,
				};
				let url = `/tm/tag/removeWord`;
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
						console.log(`删除 json =`, JSON.stringify(json, null, 4));
						this.$hMessage.error(msg);
						this.modalDelete.showModal = false;
						this.tableLoading = false;
						return;
					} else {
						let index = this.wordRemoveIndex;
						// console.log(`index`);
						this.remove(index);
						// this.$hMessage.success(msg);
						this.$hMessage.success("删除成功");
						this.modalDelete.showModal = false;
						this.tableLoading = false;
						// this.onClickButton(`search`);
					}
				}).catch(err => console.error(`删除 error`, err));
			},
			reloadTableDatas() {
				let {
					publishDate: startTime,
					publishDateEnd: endTime,
					operationType: operateType,
					processingStatus: isHandle,
					labelWord: tagName,
				}= this.commonFiltersPagination;
				let {
					current,
					size,
				} = this.pagination;
				let options = {
					startTime,
					endTime,
					tagName,
					isHandle,
					operateType,
					current,
					size,
				};
				this.getCommonTableDatas(options);
			},
			// 标记已处理
			postRemarkById(options = {}, debug = false){
				let url = `/tm/markProcessedById`;
				this.$http
				.post(url, options)
				.then(res => res.data)
				.then((json)=>{
					// console.log(`标记已处理json =`, JSON.stringify(json, null, 4));
					if (!json.body) {
						console.log(`标记已处理 json =`, JSON.stringify(json, null, 4));
					} else {
						let {
							status,
							msg,
						} = json;
						if(status != this.$api.SUCCESS){
							this.$hMessage.error(msg);
							return;
						} else {
							this.reloadTableDatas();
							setTimeout(() => {
								this.$hMessage.success(`标记已处理!`);
							}, 500);
						}
					}
				}).catch(err => console.error(`标记已处理 error`, err));
			},
			getRemoveReasonsBydictCode(listType = `wordRemoveReasons`, dictCode = 1009, debug = false){
				let url = `/tm/tbmDictList?dictCode=${dictCode}`;
				this.$http
				.get(url)
				.then(res => res.data)
				.then((json)=>{
					// console.log(`标签移除原因 json =`, JSON.stringify(json, null, 4));
					if (!json.body) {
						console.log(`标签移除原因 json =`, JSON.stringify(json, null, 4));
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
									// "entryName": "疑似近义词",
									// "dictName": "标签移除",
									// "sortNum": 0,
									// "dictEntry": "1"
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
				}).catch(err => console.error(`标签移除原因 error`, err));
			},
			// 查看打标
			getTagsById(newsId = ``, debug = false){
				let url = "/tm/getIdentifiedTagsInfo";
				if (newsId) {
					url = `/tm/getIdentifiedTagsInfo?newsId=${newsId}`;
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
						console.log(`查看打标 json =`, JSON.stringify(json, null, 4));
						this.$hMessage.error(msg);
						return;
					} else {
						// let {
						//     result: listDatas,
						// } = body;
						// listDatas = listDatas.map(
						//     (obj, i) => {
						//         let {
						//             userName: title,
						//             userId: value,
						//         } = obj;
						//         return {
						//             title,
						//             value,
						//         };
						//     }
						// );
						// this[listType] = listDatas;
					}
				}).catch(err => console.error(`查看打标 error`, err));
			},
			// 处理状态
			getProcessingStatesByKeyWord(keyWord = ``, listType =``, debug = false){
				let url = "/tm/userListForWord";
				if (keyWord) {
					url = `/tm/userListForWord?keyword=${keyWord}`;
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
						console.log(`处理人 json =`, JSON.stringify(json, null, 4));
						this.$hMessage.error(msg);
						return;
					} else {
						let {
							result: listDatas,
						} = body;
						listDatas = listDatas.map(
							(obj, i) => {
								let {
									userName: title,
									userId: value,
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
			// 操作类型
			getOperationTypesByKeyWord(keyWord = ``, listType =``, debug = false){
				let url = "/tm/userListForWord";
				if (keyWord) {
					url = `/tm/userListForWord?keyword=${keyWord}`;
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
						console.log(`处理人 json =`, JSON.stringify(json, null, 4));
						this.$hMessage.error(msg);
						return;
					} else {
						let {
							result: listDatas,
						} = body;
						listDatas = listDatas.map(
							(obj, i) => {
								let {
									userName: title,
									userId: value,
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
			// ambiguous-word-maintenance 资讯列表
			getCommonTableDatas (options = {}, debug = false) {
				this.tableLoading = true;
				let url = `/tm/getTagOperateLogList`;
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
						console.log(`labels-statistics 资讯列表 json =`, JSON.stringify(json, null, 4));
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
										bqlb: labelCatagory,
										bqmc: labelName,
										bqywdm: labelBid,
										handleStatusDesc: labelStatus,
										// isHandle: 0,
										operateTime: addTime,
										operateTypeDesc: addType,
										operateUserName: addUser,
										zxid: newsId,
										id: labelId,
										newsOperateVoList,
									} = obj;
									if (!newsId) {
										newsId = "";
									}
									return {
										index: i,
										// index: i + 1,
										labelCatagory,
										labelName,
										labelBid,
										labelStatus,
										addTime,
										addType,
										addUser,
										newsId,
										labelId,
										newsOperateVoList,
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
			// init
			init () {
				this.getRemoveReasonsBydictCode();
				this.getWindowMaxWidth();
				// this.getOperationTypesByKeyWord(``, `operationTypes`);
				// this.getProcessingStatesByKeyWord(``, `processingStates`);
				let {
					current,
					size,
				} = this.pagination;
				this.getCommonTableDatas({
					// startTime: TODAY,
					// endTime: TODAY,
					// startTime: TODAY_Begin,
					// endTime: TODAY_End,
					// tagName: "",
					// operateType: "0",
					isHandle: 0,
					current,
					size,
				});
			},
			globalBindKeyboardShortcuts() {
				let body = document.querySelector(`body`);
				let bindFlag = body.dataset.bindFlag;
				let isCtrlPressed = false;
				let isAltPressed = false;
				if (bindFlag === "true") {
					console.log(`ambiguous-word-maintenance, body no need binding again!`);
				} else {
					console.log(`ambiguous-word-maintenance, body only need binding once!`);
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
									that.$router.push(`/audit/news/ambiguous-word-maintenance#${uid}`);
								});
							}
						}
					);
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
						let flipObj = {
							newsId: id,
							newsListType,
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
		},
		mounted() {
			this.init();
			let isGobalBindKS = window.sessionStorage.getItem(`isGobalBindKeyboardShortcuts`);
			// isGobalBindKS === "true"
			if (isGobalBindKS) {
				// only bind once
				console.warn(`ambiguous-word-maintenance, KeyboardShortcuts, only need bind once!`, isGobalBindKS);
			} else {
				// init bind
				console.info(`ambiguous-word-maintenance, KeyboardShortcuts, bind once!`, isGobalBindKS);
				this.globalBindKeyboardShortcuts();
				window.sessionStorage.setItem(`isGobalBindKeyboardShortcuts`, true);
			}
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
