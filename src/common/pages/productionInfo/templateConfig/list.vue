<template>
	<div>
		<div style="margin-bottom: 10px;">
			<search-form>
				<ul slot="content">
					<li>
						<dl>
							<dt>业务类型：</dt>
							<dd>
								<h-select v-model="pagination.bizType" placeholder="请选择">
									<h-option v-for="item in bizTypeList" :value="item.entryValue" :key="item.entryValue">{{ item.entryName }}</h-option>
								</h-select>
							</dd>
						</dl>
					</li>
					<li>
						<dl>
							<dt>公告类别：</dt>
							<dd>
								<h-select v-model="pagination.anncType" placeholder="请选择">
									<h-option v-for="item in anncTypeList" :value="item.entryValue" :key="item.entryValue">{{ item.entryName }}</h-option>
								</h-select>
							</dd>
						</dl>
					</li>
					<li class="search-wrapper-but">
						<h-button  type="primary" data-ref="init-btn" @click="onPageChange(1)">查询</h-button>
						<h-button type="info" @click="addFn">新增模板</h-button>
						<h-button v-if="activeRoutersButton.indexOf('pro_delBatchBtn') != -1" type="primary" data-ref="init-btn" @click="handleDeleteBatch">批量删除</h-button>
						<h-tooltip placement="top-end" content="请选择是否自动刷新表格的数据!">
							<h-switch size="large" v-model="isAutoRefreshTable">
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
		</div>		
		<div class="tab-box tag-relotion-tab-box">					
			<h-table
				class="full-max-height-table"
				size="small"
				stripe
				:columns="commonTableCols"
				:data="commonTableDatas"
				:loading="tableLoading"
				:highlight-row="true"
				@on-row-dblclick="handleDbclick"
				border>
			</h-table>
			<h-page highlight-row size="small" show-elevator show-total show-sizer placement="top" class="page-box"  :total="total" :current="pagination.currentPage" :page-size-opts="pageSizeOpts" @on-page-size-change="onPageSizeChange"  :page-size="pagination.pageSize" @on-change="onPageChange" ></h-page>			
		</div>
	</div>
</template>

<script>	
	export default{
		name:'ProductionInfoTemplateConfigList',
		data(){
			return{
				isAutoRefreshTable:true,
				activeRoutersButton : this.$store.state.activeRoutersButton,//控制按钮权限
				pagination: {
					currentPage: 1,
					pageSize:10,
					anncType: '',
					bizType: '',
				},
				pageSizeOpts:[10,20,50,100],
				total:0,				
				tableLoading:false,
				commonTableDatas:[],
				bizTypeList:[],
				anncTypeList:[],
				commonTableCols: [
					{
						key: "bizName",
						title: "业务类型",
						align: "left",
					},
					{
						key: "anncName",
						title: "公告类别",
						align: "left",
					},
					{
						key: "createTime",
						title: "创建时间",
						width: 200,
						align: "center"
					},{
						key: "modifierName",
						title: "修改人",
						width: 200,
						align: "center"						 
					},
					{
						key: "updateTime",
						title: "修改时间",
						width: 200,
						align: "center"
					},
					{
						key: "version",
						title: "版本号",
						width: 100,
						align: "center"
					},
					{
						key: "operation",
						title: "操作",
						width:80,
						align: "center",
						fixed: "right",
						render: (h, params) => {
							let btnList = [{
								operateDesc:'编辑',
								operateType:2
							},{
								operateDesc:'删除',
								operateType:3
							}];
							let links = btnList.map((obj, i) => {
								let {
									operateDesc: desc,
									operateType: type,
								} = obj;
								let operateUrl = ``;
								let routerPath = ``;
								let btnCon = ``;
								let id = params.row.id;
								let showBtn = false;
								switch (type){
//									case 1:
//										operateUrl = ``;
//										routerPath = `/productionInfo/templateConfig/view`;
//										btnCon = `icon-view`;
//										showBtn = this.activeRoutersButton.indexOf('template_viewBtn') == -1 ? true : false;
//										break;
									case 2:							 
										operateUrl = ``;
										routerPath = `/productionInfo/templateConfig/add`;
										btnCon = `icon-t-b-message`;
										showBtn = this.activeRoutersButton.indexOf('template_editBtn') != -1 ? true : false;
										break;	
									 
									case 3:
										operateUrl = `/pic/audit/tmpl/remove?id=`+id;
										routerPath = ``;
										btnCon = `icon-t-b-delete`;
//										showBtn = this.activeRoutersButton.indexOf('template_delBtn') != -1 ? true : false;
										showBtn = false;
										break;
								};
								if(showBtn){
									return h("span", {
										attrs: {
											"data-url": operateUrl,
											"data-type": type,
											"title": desc
										},
										style:{
											color:type == 3 ? '#F5222D' : '#298DFF'
										},
										class: [
											 btnCon,
											'iconfont',	                                     
											'tab-icon-btn'
										],
										on: {
											click: (e) => {
												if(type==2){
														this.$router.push({path:routerPath,query:{anncType:params.row.anncType,bizType: params.row.bizType}});
												};
												if(type==3){
													this.$hMsgBox.confirm({
														title:'删除',
														content:'确定要删除：'+params.row.anncName +'?',
														onOk:()=>{
															 this.handleDelete(operateUrl,id);
														}
													})
												};
												 
											}
										}
									});
								}
							  }
							);
							return h("div", links);
						},
					}
				],
			}
		},
		methods:{
			handleDbclick(data){
				this.$router.push({path:'/productionInfo/templateConfig/add?anncType='+data.anncType +'&bizType=' + data.bizType});
			},
			onPageChange (current){
				this.pagination.currentPage = current;
				this.getInfoList();
			},
			onPageSizeChange (size) {
				this.pagination.pageSize = size;
				this.getInfoList();
			},
			addFn(){
				this.$router.push({path:'/productionInfo/templateConfig/add'});	
			},
			handleDelete(url,id){
				this.$http.get(url).then((res) => {
					let data = res.data;
					if(data.status == this.$api.SUCCESS){
						 this.$hMessage.info({
							content: '删除成功',
							duration: 3
						})   	 
						this.handleSearch();	                 
					}else{
						this.$hMessage.error({content: data.msg})
					}
					this.tableLoading = false;
				})
				.catch(err=>{
					this.$hLoading.error();
					this.tableLoading = false;
				})
			},
			getInfoList(){
				this.tableLoading = true;
				if(!this.tableLoading)return;
				let url = '/pic/audit/tmpl/listByPage';
				this.$http.post(url, this.pagination).then((res) => {
					let data = res.data;
					if(data.status == this.$api.SUCCESS){
						this.commonTableDatas = data.body.dataList || [];	                	
						this.total = data.body.totalSize;		                 
					}else{
						this.$hMessage.error({content: data.msg})
					}
					this.tableLoading = false;
				})
				.catch(err=>{
					this.$hLoading.error();
					this.tableLoading = false;
				})
			},
			getBizType(){
				let url = '/pic/audit/sys/getDict?dictCode=BIZ_TYPE';
				this.$http.get(url).then((res) => {
					let data = res.data;
					if(data.status == this.$api.SUCCESS){
						this.bizTypeList = data.body.dictList || [];
					}else{
						this.$hMessage.error({content: data.msg})
					}
				})
				.catch(err=>{
					this.$hLoading.error('获取业务类别失败！');
				})
			},
			getAnncType(){
				let url = '/pic/audit/sys/getDict?dictCode=ANNC_TYPE';
				this.$http.get(url).then((res) => {
					let data = res.data;
					if(data.status == this.$api.SUCCESS){
						this.anncTypeList = data.body.dictList || [];
					}else{
						this.$hMessage.error({content: data.msg})
					}
					this.tableLoading = false;
				})
				.catch(err=>{
					this.$hLoading.error('获取公告类别失败！');
				})
			},
		},
		mounted(){
			this.getBizType()
			this.getAnncType()
			this.getInfoList()
		},
		activated: function(){
			if (this.isAutoRefreshTable){
				this.getInfoList();
			}
		}
	}
</script>

<style>

</style>