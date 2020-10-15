<template>
	<div class="brand">
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
									<h-select v-model="searchType" slot="prepend" style="width: 120px">
										<h-option value="ppbzmc">品牌标准名称</h-option>
										<h-option value="ppmc">品牌名称</h-option>
										 <h-option value="sqzch">申请注册号</h-option>
									</h-select>
							</h-input>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="pageSearch">查询</h-button>
					<h-button type="primary" @click="onAdd" v-if="activeRoutersButton.indexOf('BrandAdd') != -1">新增</h-button>
				</li>
			</ul>
		</search-form>
		<div class="content-wrapper">
			<div class="list">
				<h-table :maxHeight="maxTableHeight" border  class="full-max-height-table industry-search-list-tab" size="small" :columns="headerData" :data="pageList"></h-table>
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
		//name: 'ChainspectrumBrand',
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
						title: '品牌标准名称',
						key: 'ppbzmc',
						render: (h,params) => {
						   const toLink ={path: '/chainspectrum/brand/info', query: {id: params.row.id}};
						   return h('router-link',{
								style: {
									color: '#107fff'
								},
								attrs: {
									to: toLink
								},
						   }, params.row.ppbzmc);
					   },
					},{
						title: '关联机构',
						key: 'gljg',
					},{
						title: '申请注册号',
						key: 'sqzch'
					},{
						title: '商标状态',
						key: 'sbzt'
					},{
						title: '品牌名称',
						key: 'ppmc'
					},{
						title: '操作',
						key:'action',
						width:120,
						render: (h, params) => {
							let editBtn = null;
							let deleteBtn = null;
							if(this.activeRoutersButton.indexOf('BrandEdit') != -1){
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
							if(this.activeRoutersButton.indexOf('BrandDelete') != -1){
								deleteBtn =  h('h-poptip',{
								   on: {
									   'on-ok': ()=> {
										   this.onDelete(params.row);
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
				let url = '/tm/chainbrand/chainbrandlist?pagenum='+this.pageNum+'&pagesize='+this.pageSize+'&params='+encodeURIComponent(JSON.stringify(paramJson));
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
				this.$router.push({path: '/chainspectrum/brand/edit',query: {id: ''}});
			},
			onEdit(row){
				this.$router.push({path: '/chainspectrum/brand/edit', query: {id: row.id}});
			},		
			onDelete(row){
				let url = '/tm/chainbrand/relation?id='+row.id;
				this.$http.get(url).then((res)=>{					
					let tmpObj = res.data;
					if(tmpObj.status != this.$api.SUCCESS){
						this.$hMessage.error(tmpObj.msg);
						return;
					}
					if(tmpObj.data){
						this.deleteById(row.id);
						// this.$hMsgBox.confirm({
						// 	title:'提示',
						// 	content: "确认删除？",
						// 	onOk:()=>{
								// this.deleteById(row.id);
			//                 },
						// 	onCancel:()=>{
						// 	  	return;
						// 	}
						// });
					}else{
						this.$hMessage.error("该实体存在关系，请先删除关系后重试");
						return;
					}
				}).catch(err=>{					
					this.$hMessage.error('未知错误')
				})

				

			},
			deleteById(id){
				let url = '/tm/chainbrand/delete?id='+id;
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


<style type="text/css" scoped>
.brand > .search,.brand > .serch .primary-btn {
	line-height: 32px;
	width: 100%;
	display: inline-block;
}
.brand > .search .h-input-wrapper{
	width: 380px;
	margin-right: 10px;
	vertical-align: top;
	float: left;
	margin-bottom: 10px;
}
.brand > .search .title,.brand > .search .h-btn{
	float: left;
	margin-bottom: 10px;
}
.brand > .search .h-btn{
	margin-right: 10px;
}
</style>