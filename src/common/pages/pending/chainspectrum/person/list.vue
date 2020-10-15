<template>
	<div class="person">
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>人物名称：</dt>
						<dd>
							<h-input ref="keyword" v-model.trim="keyword"  placeholder="人物名称" icon="android-close" @on-keyup.enter="paramsSub()" @on-click="clear()"></h-input>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="paramsSub()">查询</h-button>
					<h-button type="primary" @click="onAdd" v-if="activeRoutersButton.indexOf('PersonAdd') != -1">新增</h-button>
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
<script>
	export default {
		name: 'product',
		data () {
			return{
				activeRoutersButton: this.$store.state.activeRoutersButton,
				keyword:'',
				total:0,
				pageSize:12,
				pageNum:1,
				dataList:[],
				columns:[
					{
						title: '人物名称',
						key: 'xm',
						width: 300,
						render: (h,params) => {
	                       const toLink = {path: '/chainspectrum/person/info', query: {id: params.row.id}};
	                       return h('router-link',{
	                       		style: {
	                                color: '#107fff'
	                            },
	                           	attrs: {
	                               	to: toLink
	                           	},
	                       }, params.row.xm);
	                   },
					},
					{
						title: '关联机构',
						key: 'gljg',
						render: (h, params) => {
							let text = ''
							params.row.gljg.forEach(function(c) {
								text += c + ','
							})
							return h('h-tooltip', {
	                            props: { placement: 'bottom-start' }
	                        }, [
	                            text,
	                            h('span', { slot: 'content', style: { whiteSpace: 'normal' } }, text)
	                        ])
						}
					},
					{
						title: '操作',
						key:'action',
						width: 120,
						render: (h, params) => {
							let editBtn = null;
							let deleteBtn = null;
							let inChain = null;
							let outChain = null;
							if(this.activeRoutersButton.indexOf('PersonAdd') != -1){
								editBtn = h('i',{
									class: {
										'iconfont': true,
										'icon-t-b-message': true,
										'tab-icon-btn': true,
									},
									attrs:{'title':'编辑'},
	                                on: {
	                                    click: () => {
	                                        this.onEdit(params.row);
	                                    }
	                                }
								})
							}
							if(this.activeRoutersButton.indexOf('PersonDel') != -1){
								deleteBtn =  h('h-poptip',{
	                               on: {
	                                   'on-ok': ()=> {
	                                       this.del(params.row);
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
											title: '删除',
										},
										style: {
											marginLeft: '10px'
										}
									})
	                           	])
							}
							return h('div',[editBtn]);

						}
					},
				],
				loading: true,
				keyword_copy: '',
			}
		},
		computed: {
			maxTableHeight(){ return this.$store.state.maxTableHeight },
		},
		methods:{
			paramsSub() {
				this.keyword_copy = this.keyword
				this.pageNum = 1
				this.search()
			},
			search() {
				this.loading = true
				let url = '/tm/chainpeople/chainpeoplelist?pagenum=' + this.pageNum + '&pagesize=' + this.pageSize + '&xm=' + encodeURIComponent(this.keyword_copy.trim())
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
			onPageChange(page){
				this.keyword = this.keyword_copy
				this.pageNum = page
				this.search()
			},
			onPageSizeChange(size) {
				this.keyword = this.keyword_copy
				this.pageSize=size
				this.pageNum = 1
				this.search()
			},
			clear() {
				this.keyword = ''
				this.$refs.keyword.focus()
			},
			importIn(){

			},
			onAdd(){
				this.$router.push({path: '/chainspectrum/person/edit', query: {id: ''}})
			},
			onEdit(row){
				this.$router.push({path: '/chainspectrum/person/edit', query: {id: row.id}})
			},
			del(row) {
				let id = row.id
				let url = '/tm/chainpeople/delete?id=' + id
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
		},
		mounted(){
			this.search()
		}
	}
</script>


<style type="text/css" scoped>
.person > .search,.person > .serch .primary-btn {
	line-height: 32px;
	width: 100%;
	display: inline-block;
}
.person > .search .h-input-wrapper{
	width: 200px;
	margin-right: 10px;
	vertical-align: top;
	float: left;
	margin-bottom: 10px;
}
.person > .search .title,.person > .search .h-btn{
	float: left;
	margin-bottom: 10px;
}
.person > .search .h-btn{
	margin-right: 10px;
}
</style>