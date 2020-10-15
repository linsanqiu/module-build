<template>
	<div class="report">
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>关键字：</dt>
						<dd><h-input ref="keyword" v-model="keyword" placeholder="分组标题/操作人" icon="android-close" @on-click="clear()" @on-enter="inputEnter()"></h-input></dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>状态：</dt>
						<dd>
							<h-select v-model="status" placeholder="请选择">
								<h-option v-for="item in statusData" :value="item.value" :key="item.value">{{ item.label }}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>是否置顶：</dt>
						<dd>
							<h-select v-model="isTop" placeholder="请选择">
								<h-option v-for="item in zdData" :value="item.value" :key="item.value">{{ item.label }}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="paramsSub()" v-if="activeRoutersButton.indexOf('ReportGroupSearch') != -1">查询</h-button>
					<h-button type="primary" icon="android-sync" @click="groupSync()" v-if="activeRoutersButton.indexOf('ReportGroupSync') != -1">同步分组</h-button>
					<!-- <h-button type="primary" icon="android-add" @click="addModal = true">新建分组</h-button> -->
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
			v-model="addModal"
			:mask-closable="false"
			@on-ok="ok"
			@on-cancel="cancel"
			@on-close="cancel"
			title="背景图">
			<h-form ref="formValid" :model="groupInfo" :label-width="100">
				<h-form-item label="报告分组名">
					<label>{{ groupInfo.title }}</label>
				</h-form-item>
				<h-form-item label="背景图">
					<img v-if="imgPath == ''" :src="groupInfo.imgPath" style="width: 100%">
					<img v-else :src="imgPath" style="width: 100%">
					<div>建议尺寸710*282px，支持jpg、png</div>
					<h-row>
						<h-col>
							<h-upload
								ref="upload"
								:before-upload="handleUpload"
								:on-success="handleSuccess"
								:on-format-error="handleFormatError"
								:on-exceeded-size="handleMaxSize"
								:show-upload-list="false"
								:format="['jpg', 'png']"
								:max-size="10240"
								action="/tm/report/group/imgupload"
								style="display: inline-block">
								<h-button type="ghost" icon="ios-cloud-upload-outline">{{ groupInfo.imgName == '' ? '上传' : '重新上传'}}</h-button>
							</h-upload>
							<h-button type="ghost" icon="ios-cloud-upload-outline" @click="imgDefault">恢复默认</h-button>
						</h-col>

					</h-row>

				</h-form-item>
			</h-form>
		</h-msgBox>
		<h-msgBox
			v-model="tipsModal"
			title="添加便签">

		</h-msgBox>
		<h-msgBox
			v-model="reportModal">
			<div class="list">
				<h-table :loading="reportLoading" border stripe class="user-search-list-tab" size="small" :columns="reportColumns" :data="reportList"></h-table>
			</div>
			<div class="page-box">
				<h-page :total="reportTotal" :page-size="reportPageSize" :current="reportPageNum" @on-change="onReportPageChange" show-total size="small"></h-page>
			</div>
			<div slot="footer">
			   
			</div>
		</h-msgBox>
	</div>
</template>
<script type="text/javascript">
export default {  
	// name: 'ContentReportGroup',
	data () {
		return{
			activeRoutersButton: this.$store.state.activeRoutersButton,
			keyword: "",
			total: 0,
			pageSize: 12,
			pageNum: 1,
			dataList: [],
			file: null,
			fileName: '',
			columns: [
				{
					title: '报告分组',
					key: 'title',
				},
				{
					title: '背景图',
					key: 'imgName',
					width: 220,
					render: (h, params) => {
						const row = params.row;
						const text = row.imgName == '' ? '添加图片' : row.imgName
						return h('a', {
								style: {
									color: '#107fff'
								},
								on: {
									click: () => {
										this.edit(row);
									}
								}
							}, text);
					},
				},
				{
					title: '已发布报告',
					key: 'reportNum',
					width: 100,
					render: (h, params) => {
						const row = params.row;
						const text = row.reportNum
						return h('a', {
								style: {
									color: '#107fff'
								},
								on: {
									click: () => {
										this.reportModalShow(row);
									}
								}
							}, text);
					},
				},
				{
					title: '状态',
					key: 'status',
					width: 100,
					render: (h, params) => {
						const row = params.row;
						const text = row.status === '1' ? '已发布' : row.status === '2' ? '草稿': row.status === '3' ? '已下架' : '' ;
						return h('label', text);
					},
				},
				{
					title: '置顶',
					key: 'topStatus',
					width: 100,
					render: (h, params) => {
						const row = params.row;
						const text = row.orderNum > 1 ? '已置顶' : '未置顶';
						return h('label', text);
					},
				},
				{
					title: '操作人',
					key: 'updater',
					width: 120,
				},
				{
					key: 'action',
					title: '操作',
					width: 100,
					render: (h, params) => {
						const row = params.row;
						let editBtn = null;
						if(true){
							editBtn = h('h-button', {
								props: {
									type: 'info',
									size: 'small'
								},
								on: {
									click: () => {
										this.edit(row);
									}
								}
							}, '编辑')
						}
						let publishBtn = null;
						let publishBtnTxt = row.status == '1' ? '下架' : '发布';
						let publishBtnType = row.status == '1' ? 'error' : 'info'; 
						let publishBtnIcon = row.status == '1';
						if(this.activeRoutersButton.indexOf('ReportGroupPublish') != -1){
							publishBtn = h('h-poptip',{
							   on: {
								   'on-ok': ()=> {
									   this.publish(row);
								   },
							   },
							   props: {
								   placement: 'top-end',
								   title: '是否' + publishBtnTxt + '？',
								   confirm: true,
								   width: 150
							   }
							},[
							   h('i', {
									class: {
										'iconfont': true,
										'icon-t-b-sendout': !publishBtnIcon,
										'icon-doublearrow': publishBtnIcon,
										'tab-icon-btn': true,
									},
									attrs:{
										title: publishBtnTxt,
										marginLeft: '10px'
									}
								})
							])
						}
						let topBtn = null;
						let topBtnTxt = row.orderNum > 1 ? '取消置顶' : '置顶';
						let topBtnType = row.orderNum > 1 ? 'error' : 'info';
						let topBtnIcon = row.orderNum > 1;
						if(this.activeRoutersButton.indexOf('ReportGroupTop') != -1){
							topBtn = h('h-poptip',{
							   on: {
								   'on-ok': ()=> {
									   this.top(row);
								   },
							   },
							   props: {
								   placement: 'top-end',
								   title: '是否' + topBtnTxt + '？',
								   confirm: true,
								   width: 150
							   }
							},[
								h('i', {
									class: {
										'iconfont': true,
										'icon-t-b-moveup': !topBtnIcon,
										'icon-t-b-movedown': topBtnIcon,
										'tab-icon-btn': true,
									},
									attrs: {
										title: topBtnTxt,
									},
									style: {
										marginLeft: '10px'
									}
								})
							])
						}
						let delBtn = null;
						if(true){
							delBtn = h('h-poptip',{
							   on: {
								   'on-ok': ()=> {
									   this.del(row);
								   },
							   },
							   props: {
								   placement: 'left',
								   title: '是否删除？',
								   confirm: true
							   }
							},[
							   h('h-button', {
									props: {
										type: 'error',
										size: 'small'
									},
									style: {
										marginLeft: '6px'
									}
								}, '删除')
							])
						}
						return h('div', [publishBtn, topBtn]);
					}
				}
			],
			status: '',
			statusData: [
				{
					value: '1',
					label: '已发布'
				},
				{
					value: '3',
					label: '已下架'
				},
			],
			isTop: '',
			zdData: [
				{
					value: '1',
					label: '已置顶'
				},
				{
					value: '0',
					label: '未置顶'
				},
			],
			addModal: false,
			tipsModal: false,
			groupInfo: {
				"id": "",
				"title": "",
				"status": "",
				"imgPath": "",
				"imgName": ""
			},
			loading: true,
			reportModal: false,
			reportLoading: true,
			reportPageNum: 1,
			reportList: [],
			reportTotal: 0,
			reportColumns: [
				{
					title: '报告标题',
					key: 'title',
					align: 'center',
					render: (h,params) => {
					   const toLink = {path: '/content/report/info', query: {id: params.row.id}};
					   return h('a',{
						   on: {
							   'click': ()=> {
								   this.reportInfo(params.row.id);
							   },
						   },
					   }, params.row.title);
				   },
				}
			],
			reportPageSize: 10,
			reportGroupId: '',
			imgPath: '',
			keyword_copy: '',
			status_copy: '',
			isTop_copy: ''
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
			this.pageNum = 1
			this.search()
		},
		search() {
			this.loading = true
			let params = {
				searchKey: this.keyword_copy.trim(),
				status: this.status_copy,
				topStatus: this.isTop_copy
			}
			let url = '/tm/report/group/search?pageNum=' + this.pageNum + '&limit=' + this.pageSize 
			+ '&params=' + encodeURIComponent(JSON.stringify(params))
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
			this.pageNum = page
			this.search()
		},
		onPageSizeChange(size) {
			this.keyword = this.keyword_copy
			this.status = this.status_copy
			this.isTop = this.isTop_copy
			this.pageSize=size
			this.pageNum = 1
			this.search()
		},
		edit(row) {
			let url = '/tm/report/group/' + row.id
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					this.groupInfo = tmpObj.data
					this.fileName = tmpObj.data.imgName
				}else{
					this.groupInfo = {}
				}
			}).catch(err=>{
				this.groupInfo = {}
			})
			this.addModal = true
		},
		info(id) {
			this.$router.push({path: '/content/report/info', query: {id: id}})
		},
		addTag() {
			this.tipsModal = true
		},
		publish(row) {
			let ope = row.status == '1' ? '0' : '1'
			let status = row.status == '1' ? '3' : '1'
			let url = '/tm/report/group/status?id=' + row.id + '&ope=' + ope
			this.$http.post(url).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					row.status = status
					row.publishTime = tmpObj.data.publishTime
					row.updater = tmpObj.data.updater
					this.$hMessage.success('状态更新成功!');
				} else {
					this.$hMessage.error('发生未知错误，更改状态失败!');
				}
			}).catch(err=>{
				this.$hMessage.error('发生未知错误，更改状态失败!');
			})
		},
		top(row) {
			let ope = row.orderNum > 1 ? '0' : '1'
			let orderNum = row.orderNum > 1 ? 1 : 2
			let url = '/tm/report/group/top?id=' + row.id + '&ope=' + ope
			this.$http.post(url).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					row.orderNum = orderNum
					row.updater = tmpObj.data.updater
					this.$hMessage.success('置顶状态更新成功!');
				} else {
					this.$hMessage.error('发生未知错误，更改置顶状态失败!');
				}
			}).catch(err=>{
				this.$hMessage.error('发生未知错误，更改置顶状态失败!');
			})
		},
		del(row) {

		},
		ok () {
			let saveInfo = {
				"imgPath": this.imgPath,
				"imgName": this.fileName,
				"id": this.groupInfo.id,
			}
			let url = '/tm/report/group/save'
			this.$http.post(url, saveInfo).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					this.$hMessage.success('保存成功!')
					this.search()
				}
			}).catch(err=>{
				this.$hMessage.error('发生未知错误!')
			})
		},
		cancel () {
			this.groupInfo = {
				"id": "",
				"title": "",
				"status": "",
				"imgPath": "",
				"imgName": ""
			}
		},
		reportModalShow(row) {
			this.reportPageNum = 1
			this.reportTotal = 0
			this.reportGroupId = row.tagId
			this.reportSearch()
			this.reportModal = true
		},
		onReportPageChange(page) {
			this.reportPageNum = page
			this.reportSearch()
		},
		reportSearch() {
			this.reportLoading = true
			let params = {
				searchKey: '',
				source: '',
				tagId: this.reportGroupId,
				status: '1',
				topStatus: ''
			}
			let url = '/tm/report/search?pageNum=' + this.reportPageNum + '&limit=' + this.reportPageSize + '&params=' + encodeURIComponent(JSON.stringify(params))
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					this.reportList = tmpObj.data.list
					this.reportTotal = tmpObj.data.total		
				}else{
					this.reportList = []
					this.reportTotal = 0
				}
				this.reportLoading = false
			}).catch(err=>{
				this.reportList = []
				this.reportTotal = 0
				this.reportLoading = false
			})
		},
		handleSuccess (res, file) {
			this.imgPath = res.data.imgPath
			this.groupInfo.imgName = file.name
			this.fileName = file.name
			this.groupInfo.imgPath = res.data.imgPath
		},
		handleMaxSize (file) {
			this.$hNotice.warning({
				title: '超出文件大小限制',
				desc: '文件 ' + file.name + ' 太大，不能超过 10M。'
			});
		},
		handleFormatError (file) {
			this.$hNotice.warning({
				title: '文件格式不正确',
				desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
			});
		},
		handleUpload (file) {
			this.file = file;
			
			return true;
		},
		imgDefault() {
			this.imgPath = ''
		},
		reportInfo(id) {
			this.$router.push({path: '/content/report/info', query: {id: id}})
			this.reportModal = false
		},
		groupSync() {
			let url = '/tm/report/group/syn'
			this.$http.post(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					this.$hNotice.info({
						title: '分组同步',
						desc: '分组同步中...请稍后刷新列表查看'
					});
				}else {
					this.$hNotice.error({
						title: '分组同步',
						desc: '分组同步失败...请稍后重试'
					});
				}
			}).catch(err=>{
				this.$hNotice.error({
					title: '分组同步',
					desc: '分组同步失败...请稍后重试'
				});
			})
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
