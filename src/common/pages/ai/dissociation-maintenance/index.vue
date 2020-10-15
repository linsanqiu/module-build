<template>
	<section>
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>待消歧词：</dt>
						<dd><h-input
								aria-placeholder="待消歧词名称"
								placeholder="请输入待消歧词名称"
								style="width: 150px"
								v-model="commonFilters.dissociationWord"
								@on-change="onChangeInput(`dissociationWord`)"
								@on-enter="onChangeInputEnter(`dissociationWord`)"
								ref="dissociationWord"
								@on-click="shitClearableClick(`dissociationWord`)"
								icon="android-close">
							</h-input>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" data-ref="init-btn" @click="onClickButton(`search`)">查询</h-button>
					<h-button type="primary" data-ref="add-btn" @click="onClickButton(`add`)">新建</h-button>
					<h-tooltip
						placement="top-end"
						content="请选择是否自动刷新表格的数据!">
						<h-switch
							size="large" v-model="isAutoRefreshTable"@on-change="onChangeSwitch" >
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
			确认删除待消歧词: <span data-font="remove-word">{{removeWordName}}</span>
			<!-- <hr class="audit-common-padding" />
			<span class="audit-common-lable">移除原因</span>
			<h-select
				aria-placeholder="待消歧词移除原因"
				placeholder="请选择待消歧词移除原因"
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
			</h-select> -->
		</h-msgBox>
		<h-msgBox :title="PointerWordType == 1 ? '正向指示词' : '反向指示词'" v-model="isShowPointerWord" class-name="vertical-center-modal dissociation-maintenance-modal" :top="0" width="620">
			<div>
				<span class="pointer-word-list" v-for="(item,k) in pointerWordList" :key="k">{{ item }}</span>
			</div>
			<div slot="footer">
				<h-button @click="isShowPointerWord = false">关闭</h-button>
			</div>
		</h-msgBox>
	</section>
</template>

<script>
	/**
	 *
	 * @author xiagq
	 * @copyright gildata
	 *
	 * @created 2019.02.27
	 * @modified 2019.02.27
	 *
	 * @description 消歧维护列表 dissociation-maintenance
	 * @augments AuditNewsDissociationMaintenance
	 * @example
	 *
	 */
	import {
		fetchDelete,
		// TODAY,
		// TODAY_Begin,
		// TODAY_End,
		// TODAY_TimeStamp,
	} from "@/utils/utils";
	export default {
		name: "AuditNewsDissociation-maintenance",
		data () {
			return {
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
				modalAdd: {
					modalLoading: true,
					showModal: false,
					maximize: true,
					scrollable: true,
					transfer: false,
					title: "",
				},
				modalDownload: {
					modalLoading: true,
					showModal: false,
					maximize: true,
					scrollable: true,
					transfer: false,
					title: "",
				},
				modalUpload: {
					modalLoading: true,
					showModal: false,
					maximize: true,
					scrollable: true,
					transfer: false,
					title: "",
				},
				modalDelete: {
					modalLoading: true,
					showModal: false,
					maximize: true,
					scrollable: true,
					transfer: false,
					title: "",
				},
				modalModify: {
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
					// publishDate: TODAY,
					// publishDateEnd: TODAY,
					// publishDateRange: [TODAY, TODAY],
					// publishDate: TODAY_Begin,
					// publishDateEnd: TODAY_End,
					// publishDateRange: [TODAY_Begin, TODAY_End],
					publishDate: "",
					publishDateEnd: "",
					publishDateRange: ["", ""],
					createdUser: "",
					// createUserName: "",
					// createUserId: "",
					dissociationWord: "",
					wordType: 2,// DIFFMEANINGS_WORD
				},
				commonFiltersPagination: {
					// publishDate: TODAY_Begin,
					// publishDateEnd: TODAY_End,
					// publishDateRange: [TODAY_Begin, TODAY_End],
					publishDate: "",
					publishDateEnd: "",
					publishDateRange: ["", ""],
					createdUser: "",
					// createUserName: "",
					// createUserId: "",
					dissociationWord: "",
					wordType: 2,
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
						key: "dissociationWordId",
						title: "待消歧词 ID",
						width: 200,
						align: "center",
						fixed: "left",
						// sortable: true,
						// className: "disabled-user-selection",
					},
					{
						key: "dissociationWordName",
						title: "待消歧词",
						width: 150,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
					},
					{
						key: "positiveIndicator",
						title: "正向指示词",
						width: 300,
						align: "center",
						render: (h, params) => {
							let str = '';
							if(params.row.positiveIndicator){
								let arr = [...params.row.positiveIndicator];
								let len = arr.length - 5;
								if(len > 0){
									arr.splice(5,len);
									str = arr.toString();
									str += '...';
								}else{
									str = arr.toString();
								}
							}
							return h("span",{
								attrs: {
									"title": params.row.positiveIndicator ? params.row.positiveIndicator.toString() : ''
								},
							},str);
						}
					},
					{
						key: "negativeIndicator",
						title: "反向指示词",
						width: 300,
						align: "center",
						render: (h, params) => {
							let str = '';
							if(params.row.negativeIndicator){
								let arr = [...params.row.negativeIndicator];
								let len = arr.length - 5;
								if(len > 0){
									arr.splice(5,len);
									str = arr.toString();
									str += '...';
								}else{
									str = arr.toString();
								}
							}
							return h("span",{
								attrs: {
									"title": params.row.negativeIndicator ? params.row.negativeIndicator.toString() : ''
								},
							},str);
						}
					},
					{
						key: "dissociationRange",
						title: "消歧范围",
						width: 100,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
					},
					{
						key: "labelName",
						title: "标签名称",
						width: 150,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
					},
					{
						key: "labelCategory",
						title: "标签类别",
						width: 120,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
					},
					{
						key: "labelWeight",
						title: "标签权重",
						width: 100,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
					},
					{
						key: "createUserName",
						title: "创建人",
						width: 120,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
						render: (h, params) => {
							let userName = params.row.createUserName;
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
						title: "创建时间",
						width: 200,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
					},
					{
						key: "updateUser",
						title: "修改人",
						width: 120,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
						render: (h, params) => {
							let userName = params.row.updateUser;
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
							// 编辑 / 删除
							// let newsOperateVoList = params.row.newsOperateVoList;
							let newsOperateVoList = [
								{
									title: "编辑",
									url: "",
									type: 1,
								},
								{
									title: "删除",
									url: "",
									type: 0,
								},
							];
							let {
								dissociationWordId,
								dissociationWordName,
								index: wordRemoveIndex,
							} = params.row;
							let trueObj = this.initTableDatas[wordRemoveIndex];
							// let uid = params.row.newsId;
							let {
								dissociationWord: eliminateWord,
							} = this.commonFilters;
							// 后端翻页
							// let {
							//     current,
							//     size,
							// } = this.pagination;
							// let flipObj = {
							//     current,
							//     size,
							//     dissociationWordId,
							//     dissociationWordName,
							// };
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
										case 2:
											operateUrl = `/tm/getNewsInfoById`;
											routerPath = `/audit/news/dissociation-maintenance/operate-view`;
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
													this.wordRemoveId = dissociationWordId;
													this.wordRemoveIndex = wordRemoveIndex;
													this.removeWord = dissociationWordId;
													this.removeWordName = dissociationWordName;
													this.clickShowResureDeleteModal();
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
													// set flip page object
													// window.sessionStorage.setItem(`dissociation-maintenance_flipObj_${new_type}`, JSON.stringify(flipObj));
													// let router_query = {
													//     type,
													//     // type: newsListType,
													//     desc,
													//     // uid,
													//     url: operateUrl,
													// };
													// window.sessionStorage.setItem(`dissociation-maintenance_route_query_${new_type}`, JSON.stringify(router_query));
													if (type === 1) {
														// this.$router.push(options);
														// console.log(`passed fliObj`, JSON.stringify({passedAmbiguousWordId: dissociationWordId, passedAmbiguousWordName: dissociationWordName}, null, 4));
														// this.$data.passedAmbiguousWordId = dissociationWordId;
														// this.$data.passedAmbiguousWordName = dissociationWordName;
														// this.showModify();
														window.sessionStorage.setItem(`dissociation-maintenance_trueObj_${new_type}`, JSON.stringify(trueObj));
														this.$router.push('/audit/news/dissociation-maintenance/operate-view?id='+trueObj.id);
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
						key: "dissociationWordId",
						title: "待消歧词 ID",
						width: 200,
						align: "center",
						fixed: "left",
						// sortable: true,
						// className: "disabled-user-selection",
					},
					{
						key: "dissociationWordName",
						title: "待消歧词",
						width: 150,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
					},
					{
						key: "positiveIndicator",
						title: "正向指示词",
						width: 300,
						align: "center",
						render: (h, params) => {
							let str = '';
							if(params.row.positiveIndicator){
								let arr = [...params.row.positiveIndicator];
								let len = arr.length - 5;
								if(len > 0){
									arr.splice(5,len);
									str = arr.toString();
									str += '...';
								}else{
									str = arr.toString();
								}
							}
							return h("span",{
								attrs: {
									"title": params.row.positiveIndicator ? params.row.positiveIndicator.toString() : ''
								},
							},str);
						}
					},
					{
						key: "negativeIndicator",
						title: "反向指示词",
						width: 300,
						align: "center",
						render: (h, params) => {
							let str = '';
							if(params.row.negativeIndicator){
								let arr = [...params.row.negativeIndicator];
								let len = arr.length - 5;
								if(len > 0){
									arr.splice(5,len);
									str = arr.toString();
									str += '...';
								}else{
									str = arr.toString();
								}
							}
							return h("span",{
								attrs: {
									"title": params.row.negativeIndicator ? params.row.negativeIndicator.toString() : ''
								},
							},str);
						}
					},
					{
						key: "dissociationRange",
						title: "消歧范围",
						width: 100,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
					},
					{
						key: "labelName",
						title: "标签名称",
						width: 150,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
					},
					{
						key: "labelCategory",
						title: "标签类别",
						width: 120,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
					},
					{
						key: "labelWeight",
						title: "标签权重",
						width: 100,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
					},
					{
						key: "createUserName",
						title: "创建人",
						width: 120,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
						render: (h, params) => {
							let userName = params.row.createUserName;
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
						title: "创建时间",
						width: 200,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
					},
					{
						key: "updateUser",
						title: "修改人",
						width: 120,
						align: "center",
						// sortable: true,
						// className: "disabled-user-selection",
						render: (h, params) => {
							let userName = params.row.updateUser;
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
							// 编辑 / 删除
							// let newsOperateVoList = params.row.newsOperateVoList;
							let newsOperateVoList = [
								{
									title: "编辑",
									url: "",
									type: 1,
								},
								{
									title: "删除",
									url: "",
									type: 0,
								},
							];
							let {
								dissociationWordId,
								dissociationWordName,
								index: wordRemoveIndex,
							} = params.row;
							// console.log(`params.row =`, JSON.stringify(params.row, null, 4), wordRemoveIndex);
							let trueObj = this.initTableDatas[wordRemoveIndex];
							let {
								dissociationWord: eliminateWord,
							} = this.commonFilters;
							// 后端翻页
							// let {
							//     current,
							//     size,
							// } = this.pagination;
							// let flipObj = {
							//     current,
							//     size,
							//     dissociationWordId,
							//     dissociationWordName,
							// };
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
										case 2:
											operateUrl = `/tm/getNewsInfoById`;
											routerPath = `/audit/news/dissociation-maintenance/operate-view`;
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
													this.wordRemoveId = dissociationWordId;
													this.wordRemoveIndex = wordRemoveIndex;
													this.removeWord = dissociationWordId;
													this.removeWordName = dissociationWordName;
													this.clickShowResureDeleteModal();
												} else {
													// console.log(`params.row =`, JSON.stringify(params.row, null, 4), wordRemoveIndex);
													// console.log(`trueObj =`, JSON.stringify(trueObj, null, 4));
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
													// set flip page object
													// window.sessionStorage.setItem(`dissociation-maintenance_flipObj_${new_type}`, JSON.stringify(flipObj));
													// let router_query = {
													//     type,
													//     // type: newsListType,
													//     desc,
													//     // uid,
													//     url: operateUrl,
													// };
													// window.sessionStorage.setItem(`dissociation-maintenance_route_query_${new_type}`, JSON.stringify(router_query));
													if (type === 1) {
														// this.$router.push(options);
														// console.log(`passed fliObj`, JSON.stringify({passedAmbiguousWordId: dissociationWordId, passedAmbiguousWordName: dissociationWordName}, null, 4));
														// this.$data.passedAmbiguousWordId = dissociationWordId;
														// this.$data.passedAmbiguousWordName = dissociationWordName;
														// this.showModify();
														// this.$methods.showModify();
														window.sessionStorage.setItem(`dissociation-maintenance_trueObj_${new_type}`, JSON.stringify(trueObj));
														this.$router.push('/audit/news/dissociation-maintenance/operate-view?id='+trueObj.id);
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
				pointerWordList: [],
				isShowPointerWord: false,
				PointerWordType: 1,
			}
		},
		computed: {
			maxTableHeight(){ return this.$store.state.maxTableHeight },
		},
		methods: {
			pointerWord(data, type){
				this.pointerWordList = data;
				this.isShowPointerWord = true;
				this.PointerWordType = type;
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
				let uid = this.wordRemoveId;
				console.log(`uid =`, uid);
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
					dissociationWord: eliminateWord,
				}= this.commonFilters;
				this.commonFiltersPagination = {...this.commonFilters};
				// init
				this.pagination.current = 1;
				let {
					current,
					size,
				} = this.pagination;
				let options = {
					eliminateWord,
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
					// publishDate: startTime,
					// publishDateEnd: endTime,
					dissociationWord: eliminateWord,
				}= this.commonFiltersPagination;
				let {
					current,
					size,
				} = pagination;
				let options = {
					// startTime,
					// endTime,
					eliminateWord,
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
			// dissociation-maintenance 资讯列表
			getCommonTableDatas (options = {}, debug = false) {
				this.tableLoading = true;
				let url = `/tm/selectEliminateAmbiguity`;
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
							// eliminateList: listDatas,
						} = body;
						console.log(`isDeletePermission =`, isDeletePermission);
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
										id: dissociationWordId,
										eliminateWord: dissociationWordName,
										indicator: indicatorWord,
										eliminateScope: dissociationRange,
										eliminateScopeName: dissociationRangeName,
										businessId: labelId,
										tagName: labelName,
										weights: labelWeight,
										// tagClassification: labelCategory,
										tagCategory: labelCategory,
										createUserId,
										createUserName,
										updateUserId,
										updateUserName: updateUser,
										createTime,
										updateTime,
										negativeIndicator,
										positiveIndicator,
										// newsOperateVoList,
										// status: 1,
									} = obj;
									if (!createTime) {
										createTime = "";
									}
									if (!updateTime) {
										updateTime = "";
									}
									// 消岐范围
									switch (dissociationRange) {
										case 0:
											dissociationRange = "句子";
											break;
										case 1:
											dissociationRange = "段落";
											break;
										case 2:
											dissociationRange = "全文";
											break;

										default:
											break;
									}
									// console.log(`indicatorWord =`, indicatorWord);
									// console.log(`labelCategory =`, labelCategory);
									if (indicatorWord && indicatorWord.length) {
										indicatorWord = indicatorWord.toString();
									} else {
										indicatorWord = "";
									}
									if (labelCategory.length) {
										labelCategory = labelCategory.toString();
									} else {
										labelCategory = "";
									}
									return {
										index: i,
										// index: i + 1,
										dissociationWordId,
										dissociationWordName,
										indicatorWord,
										dissociationRange,
										labelId,
										labelName,
										labelWeight,
										labelCategory,
										createUserId,
										createUserName,
										updateUserId,
										updateUser,
										createTime,
										updateTime,
										negativeIndicator,
										positiveIndicator,
										// newsOperateVoList,
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
					eliminateWord: "",
					current: 1,
					size,
				});
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
			// let isGobalBindKS = window.sessionStorage.getItem(`isGobalBindKeyboardShortcuts`);
			// // isGobalBindKS === "true"
			// if (isGobalBindKS) {
			//     // only bind once
			//     console.warn(`dissociation-maintenance, KeyboardShortcuts, only need bind once!`, isGobalBindKS);
			// } else {
			//     // init bind
			//     console.info(`dissociation-maintenance, KeyboardShortcuts, bind once!`, isGobalBindKS);
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
<style scoped>
.dissociation-maintenance-modal .h-modal-body{
	padding-top:16px;
	padding-bottom: 8px;
}
.pointer-word-list{
	border-radius: 3px;
	background: #000;
	color: #fff;
	padding: 5px 8px;
	vertical-align: top;
	display: inline-block;
	margin-right: 5px;
	margin-bottom: 8px;
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
