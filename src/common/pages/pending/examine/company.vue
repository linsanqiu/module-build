<template>
	<div class="report">
		<search-form>
			<ul slot="content">
				<li class="row0"></li>
				<li class="row2">
					<dl>
						<dt>关键字：</dt>
						<dd>
							<h-input ref="keyword" v-model="keyword" icon="android-close" @on-click="clear()" @on-enter="inputEnter()" placeholder="企业名称/申请用户/处理人"></h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>处理状态：</dt>
						<dd>
							<h-select v-model="status" placeholder="请选择">
								<h-option v-for="item in statusData" :value="item.value" :key="item.value">{{ item.label }}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>处理结果：</dt>
						<dd>
							<h-select v-model="resultStatus" placeholder="请选择">
								<h-option v-for="item in resultStatusData" :value="item.value" :key="item.value">{{ item.label }}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="paramsSub()" v-if="activeRoutersButton.indexOf('ExamineCompanySearch') != -1">查询</h-button>
				</li>
			</ul>
		</search-form>
		<div class="content-wrapper">
			<div class="list">
				<h-table :maxHeight="maxTableHeight" :loading="loading" border stripe class="full-max-height-table user-search-list-tab" size="small" :columns="columns" :data="dataList"></h-table>
			</div>
			<div class="page-box">
				<h-page :total="total" :page-size="pageSize" size="small" :current="pageNum" @on-page-size-change="onPageSizeChange" @on-change="onPageChange" show-elevator show-total></h-page>
			</div>
		</div>

		<h-msgBox
			title="处理审核"
			:mask-closable="false"
			v-model="infoModal">
			<h-form ref="formInline" :label-width="100">
				<h-form-item label="企业名称">
					<label>{{ editInfo.companyName }}</label>
				</h-form-item>
				<h-form-item label="资质证明">
					<h-row>
						<h-col span="8">
							<h-poptip placement="right" trigger="hover">
								<a :href="editInfo.bussinessPath" target="_blank"><h-button type="ghost">营业执照</h-button></a>
								<div class="api" slot="content">
									<img :src="editInfo.bussinessPath" style="width: 400px">
								</div>
							</h-poptip>
						</h-col>
						<h-col span="8">
							<h-poptip placement="right" trigger="hover">
								<a :href="editInfo.identityPath" target="_blank"><h-button type="ghost">身份证正面</h-button></a>
								<div class="api" slot="content">
									<img :src="editInfo.identityPath" style="width: 400px">
								</div>
							</h-poptip>
						</h-col>
						<h-col span="8">
							<h-poptip placement="right" trigger="hover">
								<a :href="editInfo.identityBackPath" target="_blank"><h-button type="ghost">身份证反面</h-button></a>
								<div class="api" slot="content">
									<img :src="editInfo.identityBackPath" style="width: 400px">
								</div>
							</h-poptip>
						</h-col>
					</h-row>
				</h-form-item>
				<h-form-item v-if="!editInfo.resultStatus" prop="resultStatus" label="处理结果">
					<h-radio-group v-model="formResultStatus">
						<h-radio label="2">通过</h-radio>
						<h-radio label="1">拒绝</h-radio>
					</h-radio-group>
				</h-form-item>
				<h-form-item v-if="!editInfo.resultStatus && formResultStatus == '1'" prop="remark" label="原因">
					<h-input v-model="formRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入原因"></h-input>
				</h-form-item>
			</h-form>
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
					title: '企业名称',
					key: 'companyName',
				},
				{
					title: '处理状态',
					key: 'status',
					width: 90,
					render: (h, params) => {
						const row = params.row;
						const text = row.status === '1' ? '未处理' : row.status === '2' ? '已处理' : '' ;
						return h('label', text);
					},
				},
				{
					title: '处理结果',
					key: 'resultStatus',
					width: 100,
					render: (h, params) => {
						const row = params.row;
						const text = row.resultStatus === '1' ? '未通过' : row.resultStatus === '2' ? '已通过' : '' ;
						return h('label', text);
					},
				},
				{
					title: '申请时间',
					key: 'applyTime',
					width: 150,
				},
				{
					title: '申请用户',
					key: 'applyUserName',
					width: 90,
				},
				{
					title: '行业',
					key: 'industry',
					width: 90,
				},
				{
					title: '处理人',
					key: 'processer',
					width: 90,
				},
				{
					title: '处理时间',
					key: 'updateTime',
					width: 150,
				},
				{
					title: '原因',
					key: 'remark',
					ellipsis: true,
					width: 120,
					render: (h, params) => {
						const row = params.row;
						const text = this.unescape(row.remark);
						return h('h-tooltip', {
							props: { placement: 'left' }
						}, [
							text,
							h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, text)
						])
					}
				},
				{
					key: 'action',
					title: '操作',
					width: 80,
					render: (h, params) => {
						const row = params.row;
						let editBtn = null;
						let editBtnTxt = row.status == '1' ? '处理' : row.status == '2' ? '查看' : '' ;
						let editBtnIcon = row.status == '1'
						if(this.activeRoutersButton.indexOf('ExamineCompanyInfo') != -1){
							editBtn = h('i', {
									class: {
										'iconfont': true,
										'icon-android-open': editBtnIcon,
										'icon-view': !editBtnIcon,
										'tab-icon-btn': true,
									},
									attrs:{
										title: editBtnTxt,
										marginLeft: '10px',
									},
									on: {
										click: () => {
											this.edit(row);
										}
									}
								})
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
			status_copy: '',
			isTop_copy: '',
			resultStatus_copy: '',
			formResultStatus: '',
			formRemark: ''
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods:{
		paramsSub() {
			this.keyword_copy = this.keyword
			this.status_copy = this.status
			this.isTop_copy = this.isTop
			this.resultStatus_copy = this.resultStatus
			this.pageNum = 1
			this.search()
		},
		search() {
			this.loading = true
			let url = '/tm/company/verfiy/list?pageNum=' + this.pageNum + '&pageSize=' + this.pageSize + '&keyword=' + encodeURIComponent(this.keyword_copy.trim()) + '&status=' + this.status_copy + '&resultStatus=' + this.resultStatus_copy
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
			this.status = this.status_copy
			this.isTop = this.isTop_copy
			this.resultStatus = this.resultStatus_copy
			this.pageNum = page
			this.search()
		},
		onPageSizeChange(size) {
			this.keyword = this.keyword_copy
			this.status = this.status_copy
			this.isTop = this.isTop_copy
			this.resultStatus = this.resultStatus_copy
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
			this.pageNum = 1
			this.search()
		}
		
	},
	mounted(){
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
</style>
