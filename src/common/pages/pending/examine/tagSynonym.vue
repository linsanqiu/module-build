<template>
	<div class="report">
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>关键字：</dt>
						<dd>
							<h-input ref="keyword" v-model="keyword" icon="android-close" @on-click="clear()" @on-enter="inputEnter()" placeholder="标签ID/标签名称/同义词"></h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>标签类别：</dt>
						<dd>
							<h-select v-model="categoryId" placeholder="标签类别">
								<h-option value="" >请选择</h-option>
								<h-option v-for="item in tagSynonyCatList" :value="item.type" :key="item.type">{{ item.name }}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="paramsSub()">查询</h-button>
					<h-button type="primary"  v-if="activeRoutersButton.indexOf('tagSynonymAdd') != -1" @click="addTagCategory()">添加同义词</h-button>
					<h-button type="primary" v-if="activeRoutersButton.indexOf('tagSynonymExport') != -1" :loading="export_loading" @click="exportData()">导出</h-button>
				</li>
			</ul>
		</search-form>
		<div class="content-wrapper">
			<div class="list">
				<h-table :maxHeight="maxTableHeight" :loading="loading" border stripe class="full-max-height-table user-search-list-tab" size="small" :columns="columns" :data="dataList" @on-sort-change="sortTable"></h-table>
			</div>
			<div class="page-box">
				<h-page :total="total" :page-size="pageSize" size="small" :current="pageNum" @on-page-size-change="onPageSizeChange" @on-change="onPageChange" show-elevator show-total></h-page>
			</div>
		</div>
		<h-msgBox
			title="添加同义词"
			:mask-closable="false"
			width="800"
			v-model="infoModal">
			<div v-show="stepShow">
				<div class="tag-row">
					<h-row type="flex" align="middle">
						<h-col span="3">标签搜索</h-col>
						<h-col span="9">
							<h-input v-model.trim="tagKeyword" style="width:500px" placeholder="标签关键字" @on-click="tagInputEnter()" icon="search" @on-keyup.enter="tagInputEnter()"></h-input>
						</h-col>
					</h-row>
				</div>
				<div class="tag-row">
					<h-row type="flex" align="middle">
						<h-col span="3"><label>标签类别</label></h-col>
						<h-col span="9">
							<h-select v-model="tagCategoryId" style="width:500px" @on-change="tagCategorySelect" placeholder="标签类别">
								<h-option value="" >请选择</h-option>
								<h-option v-for="item in tagCategoryList" :value="item.category_id" :key="item.category_id">{{ item.category_name }}</h-option>
							</h-select>
						</h-col>
					</h-row>
				</div>
				
				<div class="list">
					<h-table :loading="tagLoading" border stripe class="user-search-list-tab" size="small" :columns="tagColumns" :data="tagList"></h-table>
				</div>
				<div class="page-box">
					<h-page :total="tagTotal" :page-size="tagPageSize" size="small" :current="tagPageNum" @on-change="onTagPageChange" show-total></h-page>
				</div>
			</div>
			<div v-show="!stepShow">
				<h-form ref="formInline" :label-width="100" @submit.native.prevent>
					<h-form-item label="标签ID">
						<label>{{ synonymInfo.tag_id }}</label>
					</h-form-item>
					<h-form-item label="标签名称">
						<label>{{ synonymInfo.tag_value }}</label>
					</h-form-item>
					<h-form-item label="标签分类">
						<label>{{ synonymInfo.tagContent }}</label>
					</h-form-item>
					<h-form-item label="同义词">
						<h-input v-model.trim="synonymInfo.jyc" placeholder="请输入"></h-input>
					</h-form-item>
				</h-form>
				<div slot="footer">
					<h-row type="flex" justify="center" align="middle">
						<h-col span="5">
							<h-button type="primary" long size="large" @click="back()">上一步</h-button>
						</h-col>
						<h-col span="2">
							
						</h-col>
						<h-col span="5">
							<h-button type="primary" long size="large" @click="add()">确定</h-button>
						</h-col>
					</h-row>
					
				</div>
			</div>
			
			<div slot="footer">
				<h-button v-if="activeRoutersButton.indexOf('ExamineCompanyUpdate') != -1 && !editInfo.resultStatus" type="info" @click="handleSubmit('formInline')" long size="large">确定</h-button>
			</div>
		</h-msgBox>
	</div>
</template>
<script type="text/javascript">
export default {
	name: 'ContentReport',
	data () {
		return{
			activeRoutersButton: this.$store.state.activeRoutersButton,
			keyword: "",
			total: 0,
			pageSize: 12,
			pageNum: 1,
			dataList: [],
			columns: [
				{
					title: '标签ID',
					key: 'tagId',
					width: 130,
				},
				{
					title: '标签代码',
					key: 'bqdm',
					
					width: 130,
				},
				{
					title: '标签名称',
					key: 'name',
					ellipsis: true,
					sortable: 'custom',
					render: (h, params) => {
						const row = params.row;
						const text = this.unescape(row.name);
						return h('h-tooltip', {
							props: { placement: 'left' }
						}, [
							text,
							h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, text)
						])
					}
				},
				{
					title: '标签类别',
					key: 'type',
					width: 95,
					render: (h, params) => {
						const row = params.row;
						const text = this.tagDidc[row.type]
						return h('label', text);
					}
				},
				{
					title: '同义词',
					key: 'jyc',
					width: 200,
					sortable: 'custom',
				},
				{
					title: '处理人',
					key: 'updater',
					width: 100,
					sortable: 'custom',
				},
				{
					title: '处理时间',
					key: 'updateTime',
					sortable: 'custom',
					width: 170,
				},
				{
					key: 'action',
					title: '操作',
					width: 70,
					render: (h, params) => {
						const row = params.row;
						let editBtn = null;
						let editBtnTxt = '删除';
						let editBtnIcon = true
						if(this.activeRoutersButton.indexOf('tagSynonymDel') != -1){
							editBtn = h('h-poptip',{
							   on: {
								   'on-ok': ()=> {
									   this.del(row);
								   },
							   },
							   props: {
								   placement: 'top-end',
								   title: '是否删除？',
								   confirm: true,
								   width: 150
							   }
							},[
								h('i', {
									class: {
										'iconfont': true,
										'icon-t-b-delete': true,
										'tab-icon-btn': true,
									},
									attrs: {
										title: editBtnTxt,
									},
									style: {
										marginLeft: '10px'
									}
								})
							])
						}
						return h('div', [editBtn]);
					}
				}
			],
			tagId: '',
			groupData: [],
			status: '',
			statusData: [
				{
					value: '2',
					label: '已处理'
				},
				{
					value: '1',
					label: '未处理'
				},
			],
			resultStatus: '',
			resultStatusData: [
				{
					value: '1',
					label: '未通过'
				},
				{
					value: '2',
					label: '已通过'
				},
			],
			loading: true,
			infoModal: false,
			editInfo: {},
			ruleInline: {
				remark: [
					{ required: true, message: '请填写原因', trigger: 'blur' },
					{ type: 'string', max: 150, message: '原因不能多于150字', trigger: 'blur' }
				],
				resultStatus: [
					{ required: true, message: '请选择处理结果', trigger: 'change' }
				]
			},
			keyword_copy: '',
			categoryId_copy: '',
			formResultStatus: '',
			formRemark: '',
			tagCategoryList: [
				{
					"category_id": "101108",
					"category_name": "产品"
				},
				{
					"category_id": "101103",
					"category_name": "品牌"
				},
				{
					"category_id": "101102",
					"category_name": "企业"
				},
				{
					"category_id": "101101",
					"category_name": "行业"
				}
			],
			tagMapping: {
				"101108": "3",
				"101103": "4",
				"101102": "6",
				"101101": "10",
			},
			tagSynonyCatList: [
				
			],
			categoryId: '',
			tagKeyword: '',
			tagCategoryId: '',
			tagKeyword_copy: '',
			tagCategoryId_copy: '',
			tagList: [],
			tagLoading: false,
			tagColumns: [
				{
					title: '标签',
					key: 'tag_value',
					width: 200,
				},
				{
					title: '关系',
					key: 'tag_value',
					ellipsis: true,
					render: (h, params) => {
						const row = params.row;
						let content = this.getTagContent(row)
						
						return  h('h-tooltip',{
							style: {
								color:'#298DFF'
							},
							props: {
								placement: 'left'
							}
						},[								
							h('div',content),
							h('div',{
								slot: 'content',
								style: {
								  whiteSpace: 'normal'
								}
							},content)									
						]);							
					}
				},

				{
					key: 'action',
					title: '操作',
					width: 70,
					render: (h, params) => {
						const row = params.row;
						let editBtn = null;
						if(true){
							editBtn = h('i', {
									class: {
										'iconfont': true,
										'icon-android-open': true,
										'tab-icon-btn': true,
									},
									attrs:{
										title: '添加',
										marginLeft: '10px',
									},
									on: {
										click: () => {
											this.editSynonym(row);
										}
									}
								})
						}
						return h('div', [editBtn]);
					}
				}
			],
			tagTotal: 0,
			tagPageNum: 1,
			tagPageSize: 10,
			tagDidc: {},
			stepShow: true,
			synonymInfo: {},
			export_loading: false,
			orderByClause: '',
			orderKey: '',
			orderBy: ''
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods:{
		paramsSub() {
			this.keyword_copy = this.keyword
			this.categoryId_copy = this.categoryId
			this.pageNum = 1
			this.search()
		},
		search() {
			let params = {
				searchKey: this.keyword_copy.trim(),
				type: this.categoryId_copy,
				orderKey: this.orderKey,
				orderBy: this.orderBy
			}
			this.loading = true
			let url = '/tm/tag/jyc/search?pageNum=' + this.pageNum + '&limit=' + this.pageSize + '&params=' + encodeURIComponent(JSON.stringify(params))
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					this.dataList = tmpObj.data.list
					this.total = tmpObj.data.total		
				}else{
					this.dataList = []
					this.total = 0
				}
				this.loading = false
			}).catch(err=>{
				this.dataList = []
				this.total = 0
				this.loading = false
			})
		},
		onPageChange(page) {
			this.keyword = this.keyword_copy
			this.categoryId = this.categoryId_copy
			this.pageNum = page
			this.search()
		},
		onPageSizeChange(size) {
			this.keyword = this.keyword_copy
			this.categoryId = this.categoryId_copy
			this.pageSize=size
			this.pageNum = 1
			this.search()
		},
		edit(row) {
			this.editInfo = row
			this.formResultStatus = ''
			this.formRemark = ''
			this.infoModal = true
		},
		handleSubmit(name) {
			if(this.formResultStatus == '') {
				this.$hMessage.error('请选择处理结果!')
				return
			}
			if(this.formRemark == '' && this.formResultStatus == '1') {
				this.$hMessage.error('请填写原因!')
				return
			}
			if(this.formRemark.length > 150) {
				this.$hMessage.error('原因不能多于150字!')
				return
			}
			let saveInfo ={
			  "id": this.editInfo.id,
			  "resultStatus": this.formResultStatus,
			  "remark": this.formRemark
			}
			let url = '/tm/company/verfiy/update'
			this.$http.post(url, saveInfo).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					this.$hMessage.success('保存成功!')
					this.search()
				}
			}).catch(err=>{
				this.$hMessage.error('发生未知错误!')
			})
			this.infoModal = false
		},
		unescape(html) {
			if(!html) {
				return ''
			}
			return html
			  .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
			  .replace(/&lt;/g, "<")
			  .replace(/&gt;/g, ">")
			  .replace(/&quot;/g, "\"")
			  .replace(/&#39;/g, "\'");
		},
		clear() {
			this.keyword = ''
			this.$refs.keyword.focus()
		},
		inputEnter() {
			this.keyword_copy = this.keyword
			this.categoryId_copy = this.categoryId
			this.pageNum = 1
			this.search()
		},
		getTagCategory() {
			let url = '/tm/tag/type/list'
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					this.tagSynonyCatList = tmpObj.data
					this.getTagDic()
				}else{
					this.tagSynonyCatList = []
				}
			}).catch(err=>{
				this.tagSynonyCatList = []
			})
		},
		addTagCategory() {
			this.tagCategoryId = ''
			this.tagKeyword = ''
			this.tagList = []
			this.tagTotal = 0
			this.tagLoading = false
			this.synonymInfo = {}
			this.stepShow = true
			this.infoModal = true
		},
		getTagList() {
			this.tagLoading = true
			let url = '/tm/three/tag/similarity?pagenum='+ this.tagPageNum + '&pagesize=10&category_id=' + this.tagCategoryId_copy + '&tag_value=' + encodeURIComponent(this.tagKeyword_copy.trim())
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					this.tagList = tmpObj.data.list
					this.tagTotal = tmpObj.data.total
					this.tagLoading = false
				}else{
					this.tagList = []
					this.tagTotal = 0
					this.tagLoading = false
				}
			}).catch(err=>{
				this.tagList = []
				this.tagTotal = 0
				this.tagLoading = false
			})
		},
		getTagDic() {
			let _this = this
			_this.tagSynonyCatList.forEach(
				function(d){
						let key = d.type + ''
						_this.tagDidc[key] = d.name
					}
				)
		},
		tagClear() {

		},
		tagInputEnter() {
			if(this.tagKeyword == '') {
				this.$hMessage.error('请填写标签关键字!')
				return
			}
			if(this.tagCategoryId == '') {
				this.$hMessage.error('请选择标签类别!')
				return
			}
			this.tagPageNum = 1
			this.tagKeyword_copy = this.tagKeyword
			this.tagCategoryId_copy = this.tagCategoryId
			this.tagLoading = true
			this.getTagList()
		},
		tagCategorySelect() {
			if(this.tagKeyword == '') {
				return
			}
			if(this.tagCategoryId == '') {
				this.$hMessage.error('请选择标签类别!')
				return
			}
			this.tagPageNum = 1
			this.tagKeyword_copy = this.tagKeyword
			this.tagCategoryId_copy = this.tagCategoryId
			this.getTagList()
		},
		onTagPageChange(page) {
			this.tagKeyword = this.tagKeyword_copy
			this.tagCategoryId = this.tagCategoryId_copy
			this.tagLoading = true
			this.tagPageNum = page
			this.getTagList()
		},
		editSynonym(row) {
			this.synonymInfo = Object.assign({}, row)
			this.synonymInfo['tagContent'] = this.getTagContent(row)
			this.stepShow = false
		},
		back() {
			this.stepShow = true
		},
		add() {
			if(this.synonymInfo.jyc == '') {
				this.$hMessage.error('请填写同义词!')
				return
			}
			let params={
			  "jyc": this.synonymInfo.jyc,
			  "tagId": this.synonymInfo.tag_id,
			  "type": this.tagMapping[this.tagCategoryId_copy]
			}
			let url = '/tm/tag/jyc/save'
			this.$http.post(url, params).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					this.$hMessage.success('保存成功!')
					this.back()
					this.search()
				} else {
					this.$hMessage.error(tmpObj.msg)
				}
			}).catch(err=>{
				this.$hMessage.error('发生未知错误!')
			})
		},
		del(row) {
			let id = row.id
			let url = '/tm/tag/jyc/' + id
			let length = this.dataList.length
			this.$http.delete(url).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					if(length == 1 && this.pageNum > 1) {
						this.pageNum = this.pageNum - 1
					}
					this.search()
					this.$hMessage.success('删除成功!')
				} else {
					this.$hMessage.error(tmpObj.msg)
				}
			}).catch(err=>{
				this.$hMessage.error('发生未知错误!')
			})
		},
		getTagContent(row) {
			let content = ''
			let length = row.categorys.length
			if(length == 0) {
				content = row.tag_value
			} else if(length == 1) {
				content = row.categorys[0].category_name
			} else {
				for(let i = 0; i < length; i++){
					if(content == '') {
						content = row.categorys[i].category_name
					} else {
						content = content + ' > ' + row.categorys[i].category_name
					}
					
				}
			}
			return content
		},
		exportData() {
			this.export_loading = true
			let params = {
				searchKey: this.keyword_copy.trim(),
				type: this.categoryId_copy,
				orderKey: this.orderKey,
				orderBy: this.orderBy
			}
			let url = '/tm/tag/jyc/export?params=' + encodeURIComponent(JSON.stringify(params))
			try {
				var elemIF = document.createElement("iframe");
				elemIF.src = url;
				elemIF.style.display = "none";
				document.body.appendChild(elemIF);
			} catch(e) {
				this.$hMessage.error('发生未知错误!')
			}
			setTimeout(() => {
				this.export_loading = false
			}, 2000);
		},
		sortTable(obj) {
			let orderInfo = {
				'name': 'BQNAME',
				'jyc': 'JYC',
				'updater': 'updater',
				'updateTime': 'XGSJ'
			}
			let order = obj.order
			let key = obj.column.key
			if(order == 'normal') {
				this.orderKey = ''
				this.orderBy = ''
			} else {
				this.orderKey = orderInfo[key]
				this.orderBy = order
			}
			this.pageNum = 1
			this.search()
		}
		
	},
	mounted(){
		this.getTagCategory()
		this.search()
	}
}
</script>
<style scoped>
.report > .search {
	line-height: 32px
}
.report > .search{
	width: 100%;
	display: inline-block;
}
.report > .search .h-input-wrapper,.report > .search .h-select{
	width: 220px;
	margin-right: 10px;
	vertical-align: top;
	float: left;
	margin-bottom: 10px;
}
.report > .search .h-select{
	width: 120px;
}
.report > .search .title,.report > .search .h-btn{
	float: left;
	margin-bottom: 10px;
}
.report > .search .h-btn{
	margin-right: 10px;
}
.tag-row {
	vertical-align: center;
	margin-bottom: 10px;
}
</style>
