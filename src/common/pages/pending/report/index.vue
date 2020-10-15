<template>
	<div class="report">
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>关键字：</dt>
						<dd>
							<h-input ref="keyword"  v-model="keyword" icon="android-close" @on-click="clear()" @on-enter="inputEnter()" placeholder="标题/发布机构/操作人"></h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>来源：</dt>
						<dd>
							<h-select v-model="source" placeholder="请选择">
								<h-option v-for="item in sourceData" :value="item.value" :key="item.value">{{ item.label }}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>分组：</dt>
						<dd>
							<h-select v-model="tagId" placeholder="请选择">
								<h-option v-for="item in groupData" :value="item.tagId" :key="item.id">{{ item.title }}</h-option>
							</h-select>
						</dd>
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
						<dt>置顶：</dt>
						<dd>
							<h-select v-model="isTop" placeholder="是否置顶">
								<h-option value="" >请选择</h-option>
								<h-option v-for="item in zdData" :value="item.value" :key="item.value">{{ item.label }}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="paramsSub()" v-if="activeRoutersButton.indexOf('ReportSearch') != -1">查询</h-button>
					<h-button type="primary" icon="android-add" @click="edit()" v-if="activeRoutersButton.indexOf('ReportEdit') != -1">新建报告</h-button>
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
	</div>
</template>
<script type="text/javascript">
export default {
	// name: 'ContentReport',
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
					title: '报告标题',
					key: 'title',
					width: 200,
					ellipsis: true,
					render: (h,params) => {
                       const toLink = {path: '/content/report/info', query: {id: params.row.id}};
                       return h('router-link',{
                       		style: {
                                color: '#107fff'
                            },
                           	attrs: {
                               	to: toLink
                           	},
                       }, [
	                       	h('h-tooltip', {
	                            props: { placement: 'bottom-start' }
	                        }, [
	                            params.row.title,
	                            h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.title)
	                        ])
                       ]);
                   },
				},
				{
					title: '来源',
					key: 'source',
					width: 90,
                    render: (h, params) => {
                        const row = params.row;
                        const text = row.source === '1' ? '自有' : row.source === '2' ? '199it' : '' ;
                        return h('label', text);
                    },
				},
				{
					title: '发布机构',
					key: 'organ',
					width: 100,
				},
				{
					title: '分组',
					key: 'group',
					ellipsis: true,
                    render: (h, params) => {
                    	const text = params.row.group
                        return h('h-tooltip', {
                            props: { placement: 'bottom-start' }
                        }, [
                            text,
                            h('span', { slot: 'content', style: { whiteSpace: 'normal' } }, text)
                        ])
                    }
				},
				{
					title: '发布时间',
					key: 'publishTime',
					width: 150,
				},
				{
					title: '状态',
					key: 'status',
					width: 80,
                    render: (h, params) => {
                        const row = params.row;
                        const text = row.status === '1' ? '已发布' : row.status === '2' ? '草稿': row.status === '3' ? '已下架' : '' ;
                        return h('label', text);
                    },
				},
				{
					title: '置顶',
					key: 'isTop',
					width: 80,
                    render: (h, params) => {
                        const row = params.row;
                        const text = row.orderNum > 1 ? '已置顶' : '未置顶';
                        return h('label', text);
                    },
				},
				{
					title: '操作人',
					key: 'updater',
					width: 100,
				},
				{
		          	key: 'action',
		          	title: '操作',
		          	width: 140,
					render: (h, params) => {
						const row = params.row;
						let editBtn = null;
						let editBtnDisabled = row.source != '1'
						if(this.activeRoutersButton.indexOf('ReportEdit') != -1){
							editBtn = h('i', {
									class: {
										'iconfont': true,
										'icon-t-b-message': true,
										'tab-icon-btn': true,
									},
									attrs:{
										title: '编辑'
									},
									on: {
										click: () => {
											this.edit(row.id, editBtnDisabled);
										}
									}
								})
						}
						let publishBtn = null;
						let publishBtnTxt = row.status == '1' ? '下架' : '发布';
						let publishBtnType = row.status == '1' ? 'error' : 'info';
						let publishBtnIcon = row.status == '1';
						if(this.activeRoutersButton.indexOf('ReportPublish') != -1){
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
									},
									style: {
										marginLeft: '10px'
									}
								})
                           	])
						}
						let topBtn = null;
						let topBtnTxt = row.orderNum > 1 ? '取消置顶' : '置顶';
						let topBtnType = row.orderNum > 1 ? 'error' : 'info';
						let topBtnIcon = row.orderNum > 1;
						if(this.activeRoutersButton.indexOf('ReportTop') != -1){
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
									attrs:{
										title: topBtnTxt,
										marginLeft: '10px'
									},
									style: {
										marginLeft: '10px'
									}
								})
                           	])
						}
						return h('div', [editBtn, publishBtn, topBtn]);
					}
		        }
			],
			sourceData: [
                {
                    value: '1',
                    label: '自有'
                },
                {
                    value: '2',
                    label: 'it99'
                },
			],
			source: '',
			tagId: '',
			groupData: [],
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
			loading: true,
			keyword_copy: '',
			source_copy: '',
			tagId_copy: '',
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
			this.source_copy = this.source
			this.tagId_copy = this.tagId
			this.status_copy = this.status
			this.isTop_copy = this.isTop
			this.pageNum = 1
			this.search()
		},
		search() {
			this.loading = true
			let params = {
				searchKey: this.keyword_copy.trim(),
				source: this.source_copy,
				tagId: this.tagId_copy,
				status: this.status_copy,
				topStatus: this.isTop_copy
			}
			let url = '/tm/report/search?pageNum=' + this.pageNum + '&limit=' + this.pageSize + '&params=' + encodeURIComponent(JSON.stringify(params))
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
			this.source = this.source_copy
			this.tagId = this.tagId_copy
			this.status = this.status_copy
			this.isTop = this.isTop_copy
			this.pageNum = page
			this.search()
		},
		onPageSizeChange(size) {
			this.keyword = this.keyword_copy
			this.source = this.source_copy
			this.tagId = this.tagId_copy
			this.status = this.status_copy
			this.isTop = this.isTop_copy
			this.pageSize=size
			this.pageNum = 1
			this.search()
		},
		edit(id, status) {
			if(status) {
				this.$hMessage.error('仅支持自有报告编辑!')
				return
			}
			this.$router.push({path: '/content/report/edit', query: {id: id}})
		},
		info(id) {
			this.$router.push({path: '/content/report/info', query: {id: id}})
		},
		getGroupList() {
			let url = '/tm/report/group/list'
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					this.groupData = tmpObj.data
				}
			}).catch(err=>{
				this.groupData = []
        	})
		},
		publish(row) {
			let ope = row.status == '1' ? '0' : '1'
			let status = row.status == '1' ? '3' : '1'
			let url = '/tm/report/status?id=' + row.id + '&ope=' + ope
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
			let url = '/tm/report/top?id=' + row.id + '&ope=' + ope
			this.$http.post(url).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					row.orderNum = orderNum
					row.updater = tmpObj.data.updater
					this.$hMessage.success('置顶状态更新成功!');
				} else {
					this.$hMessage.error('发生未知错误，更改状态失败!');
				}
			}).catch(err=>{
				this.$hMessage.error('发生未知错误，更改状态失败!');
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
		this.getGroupList()
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
