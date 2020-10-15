<template>
	<div class="industry">
		<search-form>
			<ul slot="content">
				<li class="row0"></li>
				<li class="row2">
					<dl>
						<dt>关键字：</dt>
						<dd>
							<h-input ref="keyword" v-model.trim="keyword"  placeholder="请填写"  
								icon="android-close"
								@on-keyup.enter="pageSearch" @on-click="onClear">
									<h-select v-model="searchType" slot="prepend" style="width: 80px">
										<h-option value="hymc">行业名称</h-option>
										<h-option value="hydm">行业代码</h-option>
									</h-select>		        
								</h-input>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="pageSearch">查询</h-button>
					<h-button type="primary" v-if="activeRoutersButton.indexOf('IndustryAdd') != -1" @click="onAdd">新增</h-button>
				</li>
			</ul>
		</search-form>
		<div class="content-wrapper">
			<div class="list">
				<h-table :maxHeight="maxTableHeight" border  class="full-max-height-table industry-search-list-tab" size="small" 
				:columns="headerData" :data="pageList"></h-table>
			</div>
			<div class="page-box">				
				<h-page :total="total" :page-size="pageSize" :current="pageNum" 
				@on-change="onPageChange" show-elevator show-total  size="small"></h-page>
			</div>
			<Spin fix v-if="isSearch">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</Spin>
		</div>	
	</div>
</template>
<script>
	export default {
		//name: 'ChainspectrumIndustry',
		data () {
			return{
				activeRoutersButton: this.$store.state.activeRoutersButton,
				keyword:'',
				searchType:'',
				isSearch:false,
				total:0,
				pageSize:12,
				pageNum:1,
				pageList:[],
				headerData:[
					{
						title: '行业名称',
						key: 'hymc',
						render: (h,params) => {
						   const toLink ={path: '/chainspectrum/industry/info', query: {id: params.row.id}};
						   return h('router-link',{
								style: {
									color: '#107fff'
								},
								attrs: {
									to: toLink
								},
						   }, params.row.hymc);
					   },
					},{
						title: '行业代码',
						key: 'hydm'
					},{
						title: '上级行业',
						key: 'sjhy'
					},{
						title: '操作',
						key:'action',
						width:120,
						render: (h, params) => {
							let editBtn = null;
							let deleteBtn = null;
							if(this.activeRoutersButton.indexOf('IndustryEdit') != -1){
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
								});
							}						
							if(this.activeRoutersButton.indexOf('IndustryDelete') != -1){
								deleteBtn =  h('h-poptip',{
								   on: {
									   'on-ok': ()=> {
										   this.deleteById(params.row.id);
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
								]);
							}
							return h('div',[editBtn]);

						}
					},
				],
			}
		},
		computed: {
			maxTableHeight(){ return this.$store.state.maxTableHeight },
		},
		methods:{
			pageSearch(){
				this.pageNum=1;
				this.queryPageList();
			},
			onPageChange(page){
				this.pageNum=page;
				this.queryPageList();
			},
			queryPageList(){
				if(this.isSearch) return;
				this.isSearch = true;
				let paramJson = {"searchKey":this.keyword,"type":this.searchType};			
				let url = '/tm/chain/industry/search?pageNum='+this.pageNum+'&limit='+this.pageSize+'&params='+encodeURIComponent(JSON.stringify(paramJson));
				this.$http.get(url).then((res)=>{	
					this.isSearch = false;
					let tmpObj = res.data;
					if(tmpObj.status != this.$api.SUCCESS){
						this.pageList = [];
						this.total =0;
						this.$hMessage.error(tmpObj.msg);
						return;
					}
					let tmpData = tmpObj.data ? tmpObj.data : {}; 
					this.pageList = tmpData.list ? tmpData.list : [];
					this.total = tmpData.total ? tmpData.total : 0;
					if(this.total && this.pageList.length == 0){
						this.pageNum = Math.ceil(this.total/this.pageSize)
						this.pageSearch();
					}
										
				}).catch(err=>{
					this.pageList = [];
					this.isSearch = false;
					this.total =0;
					this.$hMessage.error("未知错误");
				})
			},
			onClear(){
				this.keyword='';
				this.$refs.keyword.focus();
			},				
			onAdd(){
				this.$router.push({path: '/chainspectrum/industry/edit',query: {id: ''}});
			},
			onEdit(row){
				this.$router.push({path: '/chainspectrum/industry/edit',query: {id: row.id}});
			},			
			onDelete(row){
				this.$hMsgBox.confirm({
					title:'提示',
					content: "确认删除？",
					onOk:()=>{
						this.deleteById(row.id);
					},
					onCancel:()=>{
						return;
					}
				});

			},
			deleteById(id){
				let url = '/tm/chain/industry/delete/'+id;
				this.$http.delete(url).then((res)=>{					
					let tmpObj = res.data;
					if(tmpObj.status != this.$api.SUCCESS){
						this.$hMessage.error(tmpObj.msg);
						return;
					}
					this.$hMessage.success('删除成功!');				 	
					this.pageSearch();
				}).catch(err=>{					
					this.$hMessage.error('未知错误')
				})
			},
			init(){
				this.pageSearch();
			}

		},
		mounted(){
			this.init();
		}
	}
</script>
<style type="text/css">
	/*.industry > .search .h-input-group-prepend{
		background-color: #fff;
		border-radius: 4px;
	}*/
</style>

<style type="text/css" scoped>
.industry > .search,.industry > .serch .primary-btn {
	line-height: 32px;
	width: 100%;
	display: inline-block;
}
.industry > .search .h-input-wrapper{
	width: 380px;
	margin-right: 10px;
	vertical-align: top;
	float: left;
	margin-bottom: 10px;
}
.industry > .search .title,.industry > .search .h-btn{
	float: left;
	margin-bottom: 10px;
}
.industry > .search .h-btn{
	margin-right: 10px;
}

</style>