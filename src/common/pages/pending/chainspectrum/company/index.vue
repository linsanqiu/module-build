<template>
	<div class="company">
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
									<h-option value="qymc">企业名称</h-option>
									<h-option value="gsqybh">工商企业编号</h-option>
								</h-select>
							</h-input>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="pageSearch">查询</h-button>
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
		name: 'ChainspectrumCompany',
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
						title: '企业名称',
						key:'qymc',
						render: (h,params) => {
						   const toLink ={path: '/chainspectrum/company/info', query: {id: params.row.id}};
						   return h('router-link',{
								style: {
									color: '#107fff'
								},
								attrs: {
									to: toLink
								},
						   }, params.row.qymc);
					   },
					},{
						title: '工商企业编号',
						key: 'gsqybh'
					},{
						title: '法人代表',
						key: 'fddbrxm'
					},{
						title: '状态',
						key: 'status',
						render: (h, params) => {
							let statusstr = '';
							if(params.row.status==0){
								statusstr='不采用';
							}else{
								statusstr='采用';
							};
							return h('div',statusstr);
						}
					},{
						title: '操作',
						key:'action',
						width:120,
						render: (h, params) => {							
							let applyBtn = null;
							//let discradBtn = null;							
							if(this.activeRoutersButton.indexOf('CompanyApply') != -1&&params.row.status==0){
								applyBtn = h('i',{
									class: {
										'iconfont': true,
										't-b-distribution':true,
										'icon-t-b-distribution': true,
									},
									attrs:{'title':'采用'},
									on: {
										click: () => {
											this.onApply(params.row);
										}
									}
								});
							}
							// else{
							// 	if(this.activeRoutersButton.indexOf('CompanyDiscard') != -1){
							// 		discradBtn = h('i',{
							// 			class: {
							// 				'iconfont': true,
			 //                                't-b-abolitiondistrib':true,
			 //                                'icon-t-b-abolitiondistrib': true,
							// 			},
							// 			attrs:{'title':'不采用'},
			 //                            on: {
			 //                                click: () => {
			 //                                   this.onApply(params.row); 
			 //                                }
			 //                            }
							// 		});
							// 	}
								
							// }
							return h('div',[applyBtn]);

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
				let url = '/tm/chain/company/search?pageNum='+this.pageNum+'&limit='+this.pageSize+'&params='+encodeURIComponent(JSON.stringify(paramJson));
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
				this.$router.push({path: '/chainspectrum/company/edit',query: {id: ''}});
			},
			onEdit(row){
				this.$router.push({path: '/chainspectrum/company/edit',query: {id: row.id}});
			},			
			onApply(row){
				let content = row.status==0?"采用":"不采用";
				this.$hMsgBox.confirm({
					title:'提示',
					content: "确认"+content+"？",
					onOk:()=>{
						this.applyQy(row.id);
					},
					onCancel:()=>{
						return;
					}
				});
				
			},
			applyQy(id){
				let url = '/tm/chain/company/useornot?id='+id;
				let savedata = {id: id};
				this.$http.post(url,savedata).then((res)=>{					
					let tmpObj = res.data;
					if(tmpObj.status != this.$api.SUCCESS){
						this.$hMessage.error(tmpObj.msg);
						return;
					}
					this.pageSearch();
				}).catch(err=>{					
					this.$hMessage.error('未知错误')
				})
			},
			onDelete(row){
				this.$hMsgBox.confirm({
					title:'提示',
					content: "是否确认删除？",
					onOk:()=>{
						this.deleteById(row.id);
					},
					onCancel:()=>{
						return;
					}
				});

			},
			deleteById(id){
				let url = '/tm/chain/company/delete/'+id;
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
			queryDetail(id){
				let url = '/tm/chain/company/'+id;
				this.$http.get(url).then((res)=>{					
					let tmpObj = res.data;
					if(tmpObj.status != this.$api.SUCCESS){
						this.companyInfo = {};						
						this.$hMessage.error(tmpObj.msg);
						return;
					}
					let tmpData = tmpObj.data ? tmpObj.data : {}; 
					this.companyInfo = tmpData;									
				}).catch(err=>{
					this.companyInfo = {};	
					this.$hMessage.error("未知错误");
				})
			},
			queryCropTypeDict(){
				let url = '/tm/chain/company/dic/corptype';
				this.$http.get(url).then((res)=>{					
					let tmpObj = res.data;
					if(tmpObj.status == this.$api.SUCCESS){
						this.cropData=tmpObj.data;
					}
				}).catch(err=>{
					this.cropData=[];
				})
			},
			queryCurrencyDict(){
				let url = '/tm/chain/company/dic/currency';
				this.$http.get(url).then((res)=>{					
					let tmpObj = res.data;
					if(tmpObj.status == this.$api.SUCCESS){
						this.currencyData=tmpObj.data;
					}
				}).catch(err=>{
					this.currencyData=[];
				})
			},
			queryProvinceDict(){
				let url = '/tm/chain/company/dic/province';
				this.$http.get(url).then((res)=>{					
					let tmpObj = res.data;
					if(tmpObj.status == this.$api.SUCCESS){
						this.provinceData=tmpObj.data;
					}
				}).catch(err=>{
					this.provinceData=[];
				})
			},
			queryCompanytypeDict(){
				let url = '/tm/chain/company/dic/companytype';
				this.$http.get(url).then((res)=>{					
					let tmpObj = res.data;
					if(tmpObj.status == this.$api.SUCCESS){
						this.companytypeData=tmpObj.data;
					}
				}).catch(err=>{
					this.companytypeData=[];
				})
			},
			queryCompanystate(){
				let url = '/tm/chain/company/dic/companystate';
				this.$http.get(url).then((res)=>{					
					let tmpObj = res.data;
					if(tmpObj.status == this.$api.SUCCESS){
						this.companystateData=tmpObj.data;
					}
				}).catch(err=>{
					this.companystateData=[];
				})
			},
			init(){				
				this.pageSearch();
			},
			

		},
		mounted(){
			this.init();
		}
	}
</script>


<style type="text/css" scoped>
.company > .search,.company > .serch .primary-btn {
	line-height: 32px;
	width: 100%;
	display: inline-block;
}
.company > .search .h-input-wrapper{
	width: 380px;
	margin-right: 10px;
	vertical-align: top;
	float: left;
	margin-bottom: 10px;
}
.company > .search .title,.company > .search .h-btn{
	float: left;
	margin-bottom: 10px;
}
.company > .search .h-btn{
	margin-right: 10px;
}
</style>