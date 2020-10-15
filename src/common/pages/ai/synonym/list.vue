<template>
	<div class="synonymBox">
		<h-spin fix v-if="tableLoading">
			<h-icon name="load-c" pageSize="18" class="h-load-loop"></h-icon>
			<div>加载中...</div>
		</h-spin>
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>关键字：</dt>
						<dd><h-input v-model="searchData.keyWord" icon="android-close" @on-enter="searchAll" @on-click="shitClearableClick('keyWord','searchData')" placeholder="标签名称/同义词"></h-input></dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>标签类别：</dt>
						<dd>
							<h-select clearable placeholder="请选择标签类别" v-model="searchData.categoryId">
								<h-option v-for="item in categoryList" :value="item.categoryId" :key="item.categoryId">{{item.categoryName}}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" v-if="activeRoutersButton.indexOf('SynonymSearch') != -1" @click="searchAll">查询</h-button>
					<h-button type="primary" v-if="activeRoutersButton.indexOf('SynonymAdd') != -1"  @click="addSynonym">添加同义词</h-button>
					<h-button type="primary" v-if="activeRoutersButton.indexOf('SynonymExport') != -1"   @click="exportFn">导出</h-button>
				</li>
			</ul>
		</search-form>
		<!-- 同义词表格 -->
		<div class="tab-box tag-synonym-box">
			<h-table :maxHeight="maxTableHeight" class="full-max-height-table" size="small" stripe :columns="commonTableCols" :data="commonTableDatas" border></h-table>
			<h-page highlight-row size="small" show-elevator show-total show-sizer placement="top" class="page-box" :page-pageSize-opts="pageSizeOpts" :total="total" :current="pagination.pageNum" :page-size="pagination.pageSize" @on-change="onPageChange" @on-page-size-change="onPageSizeChange"></h-page>
		</div>
		<h-msgBox :title="modelTitle" :mask-closable="false" class-name="vertical-center-modal" :top="0" width="900" @on-close="onCloseAddSynonymModel" :footerHide="true" v-model="isShowMode">
			<!-- 同义词标签列表页面 -->
			<div v-show="isShowStepOne">
				<h-spin fix v-if="tagTableLoading">
					<h-icon name="load-c" pageSize="18" class="h-load-loop"></h-icon>
					<div>加载中...</div>
				</h-spin>
				<ul class="filtrate-head double-date">
					<li>
						<span>关键字：</span>
						<h-input v-model.trim="tagKeyword" placeholder="标签关键字" @on-click="tagKeywordEnter()" @on-keyup.enter="tagKeywordEnter()"></h-input>
					</li>
					<li>
						<span>标签类别：</span>
						<h-select v-model="tagCategoryId" placeholder="标签类别">
							<h-option value>请选择</h-option>
							<h-option v-for="item in tagCategoryList" :value="item.categoryId" :key="item.categoryId">{{ item.categoryName }}</h-option>
						</h-select>
					</li>
					<li style="margin-left: 20px;">
						<div class="filtrate-btn">
							<h-button type="primary" v-if="activeRoutersButton.indexOf('SynonymTagsSearch') != -1" @click="tagKeywordEnter()">查询</h-button>
						</div>
					</li>
				</ul>
				<div class="list">
					<h-table border stripe class="user-search-list-tab" size="small" :columns="tagTableCols" :data="tagList"></h-table>
				</div>
				<div class="page-box">
					<h-page show-elevator show-total show-sizer :total="tagTotal" :page-pageSize-opts="tagPageSizeOpts" :page-size="tagPageSize" size="small" :current="tagPageNum" @on-change="onTagPageChange" @on-page-size-change="onTagPageSizeChange"></h-page>
				</div>
			</div>

			<!-- 同义词编辑页面 -->
			<div v-show="!isShowStepOne">
				<h-spin fix v-if="editTagLoading">
					<h-icon name="load-c" pageSize="18" class="h-load-loop"></h-icon>
					<div>加载中...</div>
				</h-spin>
				<h-form ref="editSynonymForm" :label-width="100" @submit.native.prevent>
					<h-form-item label="标签ID:">
						<label>{{ synonymInfo.tagId }}</label>
					</h-form-item>
					<h-form-item label="标签名称:">
						<label>{{ synonymInfo.tagName }}</label>
					</h-form-item>
					<h-form-item label="标签分类:">
						<label>{{ synonymInfo.categoryName }}</label>
					</h-form-item>
					<h-form-item label="同义词:">
						<div class="pointer-word-wrapper">
									<h-tag v-for="(item, index) of synonymList" :key="item.synonym" :name="item.synonym" type="dot" :color="colors[index % 4]" closable @on-close="handleCloseTag(index, item)">
									{{item.synonym}}
								</h-tag> 
								<div style="display:inline-block;vertical-align: top;margin-top: 4px;">
									 <h-button type="dashed" icon="add"  @click="handleAddTag">添加</h-button>  
								</div>             	                                             
						</div>
					</h-form-item>
				</h-form>
				<div slot="footer">
					<h-row v-if="!isShowPrevious" type="flex" justify="end" align="middle">
						<h-col align="center" style="margin-right:10px">
							<h-button  @click="isShowMode = false">取消</h-button>
						</h-col>
						<h-col  align="center">
							<h-button type="primary" @click="add">确定</h-button>
						</h-col>
					</h-row>

					<h-row v-if="isShowPrevious" type="flex" justify="end" align="middle">
						<h-col span="5">
							<h-button type="primary" @click="back">上一步</h-button>
							<h-button type="primary" @click="add">确定</h-button>
						</h-col>
					</h-row>
				</div>
			</div>
		</h-msgBox>

		<!-- 添加同义词 -->
		<h-msgBox title="添加同义词" v-model="isShowAddBox" @on-close="onCloseAddBox" class-name="vertical-center-modal" :top="0" width="500">
			<div>
				<h-form :model="synonymFrom" :label-width="60" :rules="ruleSynonym" ref="synonymFrom" @keydown.native.enter.prevent="()=>{}">
					<h-form-item label="同义词" prop="synonym">
						<h-input placeholder="请填写近义词" v-model="synonymFrom.synonym" @on-enter="onAddConfirm"></h-input>
					</h-form-item>
				</h-form>
			</div>
			<div slot="footer">
				<h-button @click="onCloseAddBox">关闭</h-button>
				<h-button type="primary" @click="onAddConfirm">确定</h-button>
			</div>
		</h-msgBox>
	</div>
</template>


<script>
import utils from "@/utils/index";
import { Trim } from "@/filters/index.js";
export default {
	data() {
		const validatorSynonym = (rule, value, callback) => {
			value = Trim(value);
			if (value == "") {
				callback("请填写近义词");
			} else {
				let flage = false;
				for (let index in this.synonymList) {
					if (this.synonymList[index].synonym == value) {
						flage = true;
						break;
					}
				}
				if (flage) {
					callback("该近义词已存在");
				} else {
					callback();
				}
			}
		};

		return {
			// 操作按钮显示
			activeRoutersButton: this.$store.state.activeRoutersButton,
			// *******同义词表相关参数*******
			heightValue: null,
			tableLoading: false,
			// 标签类别下拉选择框数据集合
			categoryList: [],
			// 同义词表格数据集合
			commonTableDatas: [],
			// 查询列表条件
			searchData: {
				keyWord: "",
				categoryId: ""
			},
			// 分页参数
			pagination: {
				pageNum: 1,
				pageSize: 10
			},
			total: 0,
			pageSizeOpts: [10, 20, 50, 100],
			commonTableCols: [
				{
					key: "tagId",
					title: "标签ID",
					width: 150,
					align: "left"
				},
				{
					key: "tagName",
					title: "标签名称",
					width: 220,
					align: "left"
				},
				{
					key: "categoryName",
					title: "标签类别",
					width: 120,
					align: "left"
				},
				{
					key: "synonym",
					title: "同义词",
					align: "left"
				},
				{
					key: "userName",
					title: "处理人",
					width: 100,
					align: "left"
				},
				{
					key: "handlerTime",
					title: "处理时间",
					width: 170,
					align: "left"
				},
				{
					key: "operation",
					title: "操作",
					width: 130,
					align: "center",
					fixed: "right",
					render: (h, params) => {
						let status = params.row.status;
						let showAssignBtn = null;
						let showPassBtn = null;
						let showFailBtn = null;
						if (this.activeRoutersButton.indexOf("SynonymModify") != -1) {
							showAssignBtn = {
								class: {
									iconfont: true,
									"icon-t-b-message": true,
									"tab-icon-btn": true
								},
								style: {
									color: "#298DFF"
								},
								attrs: {
									title: "修改"
								},
								on: {
									click: () => {
										this.editSynonym(params.row);
									}
								}
							};
						}
						if (this.activeRoutersButton.indexOf("SynonymDel") != -1) {
							showPassBtn = {
								class: {
									iconfont: true,
									"icon-t-b-delete": true,
									"tab-icon-btn": true
								},
								style: {
									color: "red"
								},
								attrs: {
									title: "删除"
								},
								on: {
									click: () => {
										this.$hMsgBox.confirm({
											title: "删除同义词",
											content:
												"确定要删同义词：" +
												params.row.synonym +
												"(" +
												params.row.tagName +
												")?",
											onOk: () => {
												let tagId = params.row.tagId.toString().split();
												this.handleDelete(tagId);
											}
										});
									}
								}
							};
						}
						return h("div", [h("span", showAssignBtn), h("span", showPassBtn)]);
					}
				}
			],

			// *******同义词标签表相关参数*******
			isShowMode: false,
			isShowStepOne: false,
			isShowPrevious: false,
			tagTableLoading: false,
			tagCategoryList: [],
			tagCategoryId: "",
			tagKeyword: "",
			tagPageNum: 1,
			tagPageSize: 10,
			tagTotal: 0,
			tagPageSizeOpts: [10, 20, 50, 100],
			// 标签表格数据
			tagList: [],
			tagTableCols: [
				{
					title: "标签",
					key: "tagName",
					width: 300
				},
				{
					title: "关系",
					key: "relation",
					ellipsis: true,
					render: (h, params) => {
						const row = params.row;
						let content = this.formatRelation(row);
						return h(
							"h-tooltip",
							{
								style: {
									color: "#298DFF"
								},
								props: {
									placement: "left"
								}
							},
							[
								h("div", content),
								h(
									"div",
									{
										slot: "content",
										style: {
											whiteSpace: "normal"
										}
									},
									content
								)
							]
						);
					}
				},
				{
					key: "action",
					title: "操作",
					width: 70,
					render: (h, params) => {
						const row = params.row;
						let editBtn = null;
						if (this.activeRoutersButton.indexOf("SynonymModify") != -1) {
							editBtn = h("i", {
								class: {
									iconfont: true,
									"icon-android-open": true,
									"tab-icon-btn": true
								},
								attrs: {
									title: "添加",
									marginLeft: "10px"
								},
								on: {
									click: () => {
										this.editSynonym(row);
									}
								}
							});
						}
						return h("div", [editBtn]);
					}
				}
			],

			//   *******修改同义词页面相关参数*******
			modelTitle: "",
			editTagLoading: false,
			synonymInfo: {
				id: "",
				appId: "",
				tagId: "",
				tagName: "",
				categoryId: "",
				categoryName: "",
				synonym: ""
			},
			// 同义词
			synonymList: [],
			// 原来存在但是被删除的同义词
			deletedList: [],
			colors: ["blue", "green", "red", "yellow"],

			//   *******添加近义词表单页面相关参数*******
			isShowAddBox: false,
			synonymFrom: {
				synonym: ""
			},
			ruleSynonym: {
				synonym: [
					{ validator: validatorSynonym, required: true, trigger: "blur" }
				]
			}
		};
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods: {
		// 同义词表
		formatRelation(row) {
			let content = row.relation;
			while (content.indexOf(",") != -1) {
				 content = content.replace(",", " > ");
			}
			return content;
		},
		// 关键字置空：shitClearableClick('keyWord','searchData')
		shitClearableClick(type = "", dataobj = "") {
			this[dataobj][type] = ``;
		},
		onPageChange(pageNum) {
			this.pagination.pageNum = pageNum;
			this.getSynonymList();
		},
		onPageSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.getSynonymList();
		},
		searchAll() {
			this.pagination.pageNum = 1;
			this.getSynonymList();
		},
		getSelectOption(listType) {
			let url = "/tm/getRootCategoryList";
			this.$http.get(url).then(res => {
				let data = res.data;
				if (data.status == this.$api.SUCCESS) {
					this[listType] = data.body.categoryList || [];
				} else if (data.status == 9999) {
					this[listType] = data.body.categoryList || [];
				} else {
					this.$hMessage.error({ content: data.msg });
				}
			}).catch(err => {
				this.$hLoading.error();
			});
		},
		getSynonymList() {
			this.tableLoading = true;
			let url = "/tm/getSynonymPage" + "?keyWord=" + encodeURIComponent(this.searchData.keyWord)
				+ "&categoryId=" + this.searchData.categoryId
				+ "&pageNum=" + this.pagination.pageNum
				+ "&pageSize=" + this.pagination.pageSize;
			this.$http.get(url).then(res => {
				let data = res.data;
				if (data.status == this.$api.SUCCESS) {
					this.commonTableDatas = data.body.records || [];
					this.total = data.body.total;
					this.heightValue = this.commonTableDatas.length > 10 ? 350 : null;
				} else {
					this.$hMessage.error({ content: data.msg });
				}
				this.tableLoading = false;
			})
				.catch(err => {
					this.$hLoading.error();
					this.tableLoading = false;
				});
		},
		// 删除标签
		handleDelete(tagId) {
			let url = "/tm/deleteSynonym?tagId=" + tagId;
			this.$http.get(url).then(res => {
				let data = res.data ? res.data : {};
				if (data.status == this.$api.SUCCESS) {
					this.$hMessage.info({
						content: "删除成功",
						duration: 3
					});
					this.getSynonymList();
				} else {
					this.$hMessage.error({
						content: data.msg,
						duration: 3
					});
				}
			}).catch(err => { });
		},
		exportFn() {
			let url = "/tm/exportSynonymInfo?keyWord=" + encodeURIComponent(this.searchData.keyWord)
				+ "&categoryId=" + this.searchData.categoryId;
			window.location.href = url;
		},

		// 标签表
		onCloseAddSynonymModel() {
			this.isShowMode = false;
			this.isShowStepOne = false;
			this.isShowPrevious = false;
			this.synonymList = [];
			this.deletedList = [];
		},
		addSynonym() {
			// 初始化标签类别下拉选择框
			this.getSelectOption("tagCategoryList");
			this.tagCategoryId = "";
			this.tagKeyword = "";
			this.tagPageNum = 1;
			this.tagPageSize = 10;
			this.tagList = [];
			this.tagTotal = 0;
			this.modelTitle = "添加同义词";
			this.isShowMode = true;
			this.isShowStepOne = true;
			this.isShowPrevious = true;
		},
		tagKeywordEnter() {
			this.tagPageNum = 1;
			this.tagPageSize = 10;
			this.getTagList();
		},
		onTagPageChange(pageNum) {
			this.tagPageNum = pageNum;
			this.getTagList();
		},
		onTagPageSizeChange(pageSize) {
			this.tagPageSize = pageSize;
			this.getTagList();
		},
		getTagList() {
			if (this.tagKeyword == "") {
				this.$hMessage.error("请填写标签关键字!");
				this.tagList = [];
				this.tagTotal = 0;
				return;
			}
			if (this.tagCategoryId == "") {
				this.$hMessage.error("请选择标签类别!");
				this.tagList = [];
				this.tagTotal = 0;
				return;
			}
			this.tagTableLoading = true;
			let url = "/tm/getSimilarTagList"
				+ "?categoryId=" + this.tagCategoryId
				+ "&tagValue=" + encodeURIComponent(this.tagKeyword)
				+ "&pageNum=" + this.tagPageNum
				+ "&pageSize=" + this.tagPageSize;
			this.$http.get(url).then(res => {
				let data = res.data;
				if (data.status == this.$api.SUCCESS) {
					this.tagList = data.body.records || [];
					this.tagTotal = data.body.total;
				} else {
					this.tagList = [];
					this.tagTotal = 0;
					this.$hMessage.error({ content: data.msg });
				}
				this.tagTableLoading = false;
			}).catch(err => {
				this.$hLoading.error();
				this.tagTableLoading = false;
			});
		},
		getSynonymInfos(tagId, categoryId) {
			let url = "/tm/getQuerySynonym?tagId=" + encodeURIComponent(tagId) + "&categoryId=" + categoryId;
			this.$http.get(url).then(res => {
				let data = res.data;
				if (data.status == this.$api.SUCCESS) {
					this.synonymList = data.body.synonymList || [];
					this.editTagLoading = false;
				} else {
					this.$hMessage.error({ content: data.msg });
					this.editTagLoading = false;
				}
			}).catch(err => {
				this.$hLoading.error();
				this.editTagLoading = false;
			});
		},

		// 同义词编辑页面
		editSynonym(row) {
			this.isShowMode = true;
			this.isShowStepOne = false;
			this.editTagLoading = true;
			this.modelTitle = "修改同义词";
			this.synonymInfo = Object.assign({}, row);
			this.getSynonymInfos(this.synonymInfo.tagId, this.synonymInfo.categoryId);
		},
		handleCloseTag(index, item) {
			if (item.id != "") {
				item.synonym = "";
				this.deletedList.push(item);
			}
			this.synonymList.splice(index, 1);
		},
		handleAddTag() {
			this.$refs["synonymFrom"].resetFields();
			this.isShowAddBox = true;
			this.synonymFrom.synonym = "";
		},
		back() {
			this.modelTitle = "添加同义词";
			this.isShowMode = true;
			this.isShowStepOne = true;
			this.deletedList = [];
			this.synonymList = [];
		},
		add() {
			let params = [];
			for (let i in this.synonymList) {
				params.push(this.synonymList[i]);
			}
			for (let i in this.deletedList) {
				params.push(this.deletedList[i]);
			}
			let url = "/tm/updateQuerySynonym";
			this.$http.post(url, params).then(res => {
				let data = res.data;
				if (data.status == this.$api.SUCCESS) {
					this.$hMessage.success("保存成功!");
					this.onCloseAddSynonymModel();
					this.getSynonymList();
				} else {
					this.$hMessage.error({ content: data.msg });
					if (this.isShowPrevious) {
						this.back();
					} else {
						this.onCloseAddSynonymModel();
					}
				}
			}).catch(err => {
				this.$hMessage.error("发生未知错误!");
				this.onCloseAddSynonymModel();
			});
		},

		//添加同义词
		onCloseAddBox() {
			this.$refs["synonymFrom"].resetFields();
			this.isShowAddBox = false;
			this.synonymFrom.synonym = "";
		},
		onAddConfirm() {
			this.$refs["synonymFrom"].validate(valid => {
				if (valid) {
					let obj = {
						id: "",
						appId: this.synonymInfo.appId,
						tagId: this.synonymInfo.tagId,
						tagName: this.synonymInfo.tagName,
						categoryId: this.synonymInfo.categoryId,
						categoryName: this.synonymInfo.categoryName,
						synonym: this.synonymFrom.synonym
					};
					this.synonymList.push(obj);
					this.onCloseAddBox();
				}
			});
		}
	},
	mounted() {
		this.getSelectOption("categoryList");
		this.getSynonymList();
	}
};
</script>


<style>
.synonymBox {
	position: relative;
}
.tag-row {
	vertical-align: center;
	margin-bottom: 10px;
}
.pointer-word-wrapper {
	vertical-align: middle;
	width: calc(100% - 80px);
	border: 1px solid #dce1e7;
	background: #fafafa;
	color: #495060;
	padding: 12px;
	display: inline-block;
	border-radius: 3px;
}
.hui-btn-dashed-hover {
	/*margin-left: 10px;
	text-decoration: none;
	color: #0072f5;
	background-color: #fff;
	border-color: #0072f5;
	opacity: 0.7;
	margin-bottom: 25px;*/
}
.hui-btn-dashed-hover:hover {
	/*color: #fff;
	background-color: #0072f5;
	opacity: 1;
	transform: scale(1.1);*/
}

.filtrate-btn .h-btn {
	margin-right: 10px;
}
.tag-synonym-box .h-page-options-pageSizer {
	position: relative;
	top: 4px;
}
.tag-synonym-box .h-table-fixed-right-patch {
	width: 0 !important;
}
.tag-synonym-box .h-table table tr {
	height: auto !important;
}
</style>
<style scoped>
.checkNum {
	position: absolute;
	bottom: 10px;
	left: 0;
	color: red;
}
.tag-synonym-box {
	position: relative;
}
.footerBox {
	text-align: center;
}
</style>