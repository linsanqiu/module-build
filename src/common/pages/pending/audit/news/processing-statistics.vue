<template>
	<section>
		<search-form>
			<ul slot="content">
				<li class="row0"></li>
				<li class="row2">
					<dl>
						<dt>发布日期：</dt>
						<dd>
							<h-date-picker
								type="datetimerange"
								format="yyyy-MM-dd HH:mm:ss"
								aria-placeholder="发布日期"
								:placeholder="placeholders.publishDateRange"
								:value="commonFilters.publishDateRange"
								@on-change="onChangeDateRangePicker">
							</h-date-picker>
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
		<div class="audit-common-header">
			<h-row class-name="audit-common-row-padding">
				<h-col span="24">
					<h-table
						class="full-max-height-table"
						:maxHeight="maxTableHeight"
						:columns="commonTableCols"
						:data="commonTableDatas"
						:loading="tableLoading"
						@on-selection-change="selectChange"
						@on-sort-change="onSortChange"
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
	</section>
</template>

<script>
	/**
	 *
	 * @author xiagq
	 * @copyright gildata
	 *
	 * @created 2019.02.18
	 * @modified 2019.02.18
	 *
	 * @description 资讯处理统计 AuditNewsProcessingStatistics
	 * @augments
	 * @example
	 *
	 */
	import {
		TODAY,
		TODAY_Begin,
		TODAY_End,
	} from "./utils";
	export default {
		name: "AuditNewsProcessing-statistics",
		data () {
			return {
				isAutoRefreshTable: true,
				// isAutoRefreshTable: false,
				trueProcessingPersonnel: "",
				trueUserId: "",
				trueUserName: "",
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
				sortBy: "handle_num",
				sortType: "desc",
				commonFilters: {
					sortBy: "handle_num",
					sortType: "desc",
					publishDate: TODAY_Begin,
					publishDateEnd: TODAY_End,
					publishDateRange: [TODAY_Begin, TODAY_End],
					// publishDate: TODAY,
					// publishDateEnd: TODAY,
					// publishDateRange: [TODAY, TODAY],
					// newsTitle: "",
					// mediaSource: "",
					// columnCategory: "",
					// priority: "",
					// processingStatus: "0",
					processingPersonnel: "",
					// newsId: "",
					// newsOpenFlag: "",
					// newsKeyword: "",
					// newsTagName: "",
				},
				commonFiltersPagination: {
					sortBy: "handle_num",
					sortType: "desc",
					publishDate: TODAY_Begin,
					publishDateEnd: TODAY_End,
					publishDateRange: [TODAY_Begin, TODAY_End],
					// publishDate: TODAY,
					// publishDateEnd: TODAY,
					// publishDateRange: [TODAY, TODAY],
					// newsTitle: "",
					// mediaSource: "",
					// columnCategory: "",
					// priority: "",
					// processingStatus: "0",
					processingPersonnel: "",
					// newsId: "",
					// newsOpenFlag: "",
					// newsKeyword: "",
					// newsTagName: "",
				},
				placeholders: {
					publishDateRange: "开始日期 ~ 结束日期",
					// publishDateRange: "开始日期    ~    结束日期",
					publishDate: "请输入查询日期",
				},
				commonTableCols: [
					// {
					//     type: "selection",
					//     width: 60,
					//     align: "center",
					//     fixed: "left",
					// },
					{
						key: "processingPersonnel",
						title: "处理人员",
						width: 120,
						align: "center",
						fixed: "left",
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
						key: "finishedNum",
						title: "已处理数",
						sortable: true,
						sortType: "desc", //设置初始化排序: 值为 asc 和 desc
						width: 150,
						align: "left",
					},
					{
						key: "pendingProcessingNum",
						title: "待处理数",
						width: 150,
						sortable: true,
						// sortType: "desc",
						align: "left",
					},
					{
						key: "publicNum",
						title: "公开数",
						// sortable: true,
						width: 150,
						align: "left",
					},
					{
						key: "shieldNum",
						title: "屏蔽数",
						// sortable: true,
						width: 150,
						align: "left",
					},
					{
						key: "addTags",
						title: "新增标签数量",
						// sortable: true,
						width: 150,
						align: "left",
					},
					{
						key: "deleteTags",
						title: "删除标签数量",
						// sortable: true,
						width: 150,
						align: "left",
					},
					{
						key: "processingPersonnelId",
						title: "处理人 ID",
						// sortable: true,
						// width: 200,
						align: "left",
						"row-class-name": "disabled-user-selection"
					},
				],
				commonTableColsUnselection: [
					{
						key: "processingPersonnel",
						title: "处理人员",
						width: 120,
						align: "center",
						fixed: "left",
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
						key: "finishedNum",
						title: "已处理数",
						sortable: true,
						sortType: "desc",
						width: 150,
						align: "left",
					},
					{
						key: "pendingProcessingNum",
						title: "待处理数",
						sortable: true,
						// sortType: "desc",
						width: 150,
						align: "left",
					},
					{
						key: "publicNum",
						title: "公开数",
						// sortable: true,
						width: 150,
						align: "left",
					},
					{
						key: "shieldNum",
						title: "屏蔽数",
						// sortable: true,
						width: 150,
						align: "left",
					},
					{
						key: "addTags",
						title: "新增标签数量",
						// sortable: true,
						width: 150,
						align: "left",
					},
					{
						key: "deleteTags",
						title: "删除标签数量",
						// sortable: true,
						width: 150,
						align: "left",
					},
					{
						key: "processingPersonnelId",
						title: "处理人 ID",
						// sortable: true,
						// width: 200,
						align: "left",
						"row-class-name": "disabled-user-selection"
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
			// sort
			onSortChange(obj = {}) {
				// column：当前列数据（columns内列数据）
				// key：排序依据的指标
				// order：排序的顺序，值为 asc 或 desc
				let {
					column,
					key,
					order,
				} = obj;
				// console.log(`column =`, column);
				// console.log(`key =`, key);
				// console.log(`order =`, order);
				if (key === "finishedNum") {
					this.sortBy = "handle_num";
				} else {
					this.sortBy = "todo_num";
				}
				if (order === "asc") {
					this.sortType = "asc";
				} else {
					// normal
					this.sortType = "desc";
				}
				// sortBy: "handle_num",
				// sortType: "desc",
				setTimeout(() => {
					this.onClickButton();
				}, 0);
			},
			// onSortChange(column, key, order) {
			//     // column：当前列数据（columns内列数据）
			//     // key：排序依据的指标
			//     // order：排序的顺序，值为 asc 或 desc
			//     console.log(`column =`, column);
			//     console.log(`key =`, key);
			//     console.log(`order =`, order);
			// },
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
				.then(res => res.data)
				.then((json)=>{
					let {
						status,
						msg,
						// body,
					} = json;
					if(status != this.$api.SUCCESS){
						console.log(`lock 状态 json =`, JSON.stringify(json, null, 4));
						this.$hMessage.error(msg);
						return;
					} else {
						if (status === 1) {
							// re-direct
							this.$router.push(options);
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
				if (value) {
					this.commonFilters[type] = value.trim();
				}
				// this.$hMessage.info(`${type} = ${value}`);
			},
			onChangeInputEnter (type = ``) {
				let value = this.commonFilters[type];
				if (value) {
					this.commonFilters[type] = value.trim();
				}
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
					publishDate: fbsjBegin,
					publishDateEnd: fbsjEnd,
					processingPersonnel: handleUser,
					// publishDate: publishTime,
					// publishDateEnd: publishTimeEnd,
					// newsTitle: xwbt,
					// mediaSource: mtcc,
					// columnCategory: lmfl,
					// // priority: yxj,
					// processingStatus: dataStatus,
					// processingPersonnel: handleUser,
					// newsId,
					// newsOpenFlag: gkbz,
					// newsKeyword: keyword,
					// newsTagName: tag,
					// priority,
				}= this.commonFilters;
				this.commonFiltersPagination = {...this.commonFilters};
				let {
					// current,
					size,
				} = this.pagination;
				// init
				this.pagination.current = 1;
				let sortBy = this.sortBy;
				let sortType = this.sortType;
				let options = {
					sortBy,
					sortType,
					fbsjBegin,
					fbsjEnd,
					handleUser,
					current: 1,
					size,
					// publishTime,
					// publishTimeEnd,
					// xwbt,
					// mtcc,
					// // lmfl,
					// // yxj,
					// dataStatus,
					// handleUser,
					// newsId,
					// current: 1,
					// size,
					// gkbz,
					// keyword,
					// tag,
					// priority,
				};
				this.getCommonTableDatas(options);
			},
			getNewTableDatas (pagination = {}) {
				let {
					publishDate: fbsjBegin,
					publishDateEnd: fbsjEnd,
					processingPersonnel: handleUser,
					// publishDate: publishTime,
					// publishDateEnd: publishTimeEnd,
					// newsTitle: xwbt,
					// mediaSource: mtcc,
					// columnCategory: lmfl,
					// // priority: yxj,
					// processingStatus: dataStatus,
					// processingPersonnel: handleUser,
					// newsId,
					// newsOpenFlag: gkbz,
					// newsKeyword: keyword,
					// newsTagName: tag,
					// priority,
				}= this.commonFiltersPagination;
				let {
					current,
					size,
				} = pagination;
				let sortBy = this.sortBy;
				let sortType = this.sortType;
				let options = {
					sortBy,
					sortType,
					fbsjBegin,
					fbsjEnd,
					handleUser,
					current,
					size,
					// publishTime,
					// publishTimeEnd,
					// xwbt,
					// mtcc,
					// // lmfl,
					// // yxj,
					// dataStatus,
					// handleUser,
					// newsId,
					// current,
					// size,
					// gkbz,
					// keyword,
					// tag,
					// priority,
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
					console.error(`no categories error`, err);
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
					let {
						status,
						msg,
						body,
					} = json;
					if(status != this.$api.SUCCESS){
						console.log(`处理状态 json =`, JSON.stringify(json, null, 4));
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
						this[listType] = listDatas;
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
					// handleUser: 51
					this.trueUserName = window.localStorage.getItem(`trueUserName`);
					if(status != this.$api.SUCCESS){
						console.log(`处理人 json =`, JSON.stringify(json, null, 4));
						this.$hMessage.error(msg);
						return;
					} else {
						let {
							handlerList: listDatas,
						} = body;
						listDatas = listDatas.map(
							(obj, i) => {
								let {
									realName: title,
									id: value,
								} = obj;
								if (this.trueUserName === title) {
									// this.commonFilters.processingPersonnel = value;
									this.trueProcessingPersonnel = value;
									// console.log(`this.trueUserName === title`, this.trueUserName, title);
								}
								return {
									title,
									value,
								};
							}
						);
						this[listType] = listDatas;
					}
					setTimeout(() => {
						this.commonFilters.processingPersonnel = this.trueProcessingPersonnel;
						this.getDataWithTrueUserName();
					}, 0);
				}).catch(err => console.error(`处理人  error`, err));
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
				console.log(`newsListType value =`, value);
				// let {
				//     newsListType,
				// } = this.newsListType;
				// console.log(`newsListType =`, newsListType);
			},
			// 资讯处理统计 processing-statistics
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
				// 资讯列表
				// let {
				//     newsListType,
				// } = this.$data;
				// if (newsListType !== "") {
				//     options.newsListType = newsListType || "";
				// }
				let {
					current,
					size,
				} = options;
				this.tableLoading = true;
				let url = `/tm/getHandleNum`;
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
						// console.log(`资讯处理统计 json =`, JSON.stringify(json, null, 4));
						this.$hMessage.error(`后端接口返回数据异常：${msg}`);
						this.initTableDatas = [];
						this.commonTableDatas = [];
						this.tableLoading = false;
						return;
					} else {
						let {
							// current,
							total,
							// pages,
							// size,
							result: listDatas,
							// permitDelete: isDeletePermission,
						} = body;
						// if (isDeletePermission === undefined) {
						//     isDeletePermission = false;
						// } else {
						//     if (!isDeletePermission) {
						//         this.commonTableCols = this.commonTableColsUnselection;
						//     }
						//     this.isDeletePermission = isDeletePermission;
						// }
						if (total) {
							this.pagination.total = total;
						} else {
							this.pagination.total = 0;
						}
						if (Array.isArray(listDatas) && listDatas.length) {
							listDatas = listDatas.map(
								(obj, i) => {
									let {
										// newsId,
										// // gkbz: flag,
										// gkbzDesc: flag,
										// fbsj: publishTime,
										// mtcc: mediaSource,
										// xwbt: newsTitle,
										// // yxj: priority,
										// // priorityDesc,
										// priorityDesc: priority,
										// keyword,
										// lmfl: columnCategory,
										// handleTime,
										// handleUserName: processingPersonnel,
										// dataStatus: processingStatus,
										// dataStatusDesc: processingStatusDesc,
										// dataType: newsType,
										// dataTypeDesc: newsTypeDesc,
										// auditTime,
										// auditUserName: auditPersonnel,
										// // sensitives,
										// newsOperateVoList,
										// dataType,
										user_name: processingPersonnel,
										handle_user: processingPersonnelId,
										handle_num: finishedNum,
										todo_num: pendingdNum,
										overt_num: publicNum,
										shield_num: shieldNum,
										tag_add_num: addTags,
										tag_del_num: deleteTags,
									} = obj;
									// if (columnCategory) {
									//     columnCategory = this.categoriesFilter(columnCategory);
									// }
									// if (!newsTypeDesc) {
									//     newsTypeDesc = "";
									// }
									return {
										processingPersonnel,
										processingPersonnelId,
										finishedNum,
										pendingProcessingNum: pendingdNum,
										publicNum,
										shieldNum,
										index: i,
										addTags,
										deleteTags,
										// index: i + 1,
										// flag,
										// newsId,
										// publishTime,
										// mediaSource,
										// newsTitle,
										// columnCategory,
										// processingStatus,
										// processingStatusDesc,
										// processingPersonnel,
										// auditTime,
										// auditPersonnel,
										// newsOperateVoList,
										// newsType,
										// newsTypeDesc,
										// priority,
										// keyword,
										// dataType,
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
				}).catch(err => console.error(`资讯处理统计 error`, err));
			},
			getWindowMaxWidth() {
				let maxWidth = window.screen.width || 1366;
				if (maxWidth < 1920) {
					this.pagination.size = 12;
				} else {
					this.pagination.size = 21;
				}
			},
			getDataWithTrueUserName() {
				let {
					current,
					size,
				} = this.pagination;
				let {
					processingPersonnel,
				} = this.commonFilters;
				console.log(`processingPersonnel =`, processingPersonnel);
				let options = {
					 // publishTime: TODAY,
					// publishTimeEnd: TODAY,
					fbsjBegin: TODAY_Begin,
					fbsjEnd: TODAY_End,
					current,
					size,
					// handleUser: processingPersonnel,
					// dataStatus: "0",
					sortBy: "handle_num",
					sortType: "desc",
				};
				if (processingPersonnel) {
					options.handleUser = processingPersonnel;
				}
				this.getCommonTableDatas(options);
			},
			// init
			init () {
				// this.trueUserName = window.localStorage.getItem(`trueUserName`);
				let trueUserId = window.localStorage.getItem(`trueUserId`);
				if (trueUserId) {
					this.commonFilters.processingPersonnel = trueUserId;
				}
				this.getWindowMaxWidth();
				// this.getDictByDictCode(1005, "processingStates");
				// this.getColumnCategoryByKeyWord(7, ``, `columnCategories`);
				this.getProcessingPersonnelsByKeyWord(``, `processingPersonnels`);
				// this.getPriorityByDictCode();
				// newsListTypes
				// this.getNewsListTypes();
				// this.getDataWithTrueUserName();
			},
			globalBindKeyboardShortcuts() {
				let body = document.querySelector(`body`);
				let bindFlag = body.dataset.bindFlag;
				let isCtrlPressed = false;
				let isAltPressed = false;
				if (bindFlag === "true") {
					console.log(`processing-statistics, body no need binding again!`);
				} else {
					console.log(`processing-statistics, body only need binding once!`);
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
				console.warn(`processing-statistics, KeyboardShortcuts, only need bind once!`, isGobalBindKS);
			} else {
				// init bind
				console.info(`processing-statistics, KeyboardShortcuts, bind once!`, isGobalBindKS);
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
