<template>
	<div class="test">
		<div>
			<search-form>
				<div slot="head"></div>
				<ul slot="content">
					<li class="search-auto">
						<dl>
							<dt>标准数据名称：</dt>
							<dd class="search-form-name">{{ name }}</dd>
						</dl>
					</li>
				</ul>
			</search-form>
		</div>
		<div class="table-content">
			<h-table
				size="small"
				:maxHeight="(maxTableHeight - 50)"
				class="full-max-height-table"
				:columns="table"
				:data="list"
				:highlight-row="false"
				border>
			</h-table>
			<div class="tab-box">
				<h-page  highlight-row size="small" show-total show-elevator show-total show-sizer placement="top" class="page-box"  :page-size-opts="pageSizeOpts" :total="total" :current="req.pageCurrent" :page-size="req.pageSize" @on-change="onPageChange" @on-page-size-change="onPageSizeChange"></h-page>
			</div>
			<h-spin fix v-if="isGetList">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</h-spin>
		</div>
	</div>
</template>
<script>
import { copyDeep } from '@/filters/index'
export default {
	data() {
		return {
			isGetList: false,
			id: '',
			name: '',
			req: {
				pageCurrent: 1,
				pageSize: 10,
			},
			total: 0,
			pageSizeOpts: [10,20,50,100],
			list:[],
			table: [],
			page: 1,
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods: {
		onPageChange(val){
			this.req.pageCurrent = val;
			this.getList(); 
		},
		onPageSizeChange(size){
			this.req.pageSize = size;
			this.onPageChange(1);
		},
		getList(){
			if(this.isGetList)return;
			this.isGetList = true;
			let url = '/tm/standardData/getStandardDetails?standardId=' + this.id;
			let req = this.req;
			for(let a in req){
				url += '&'+a+'='+req[a];
			}
			this.$http.get(url).then((res)=>{
				let _this = this;
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.body || {};
					let arr = [{
							title: "文件名称",
							key: 'fileName'
						}];
					let head = data.columns || [];
					for(let i = 0, len = head.length; i < len; i++){
						let obj = {
							key: head[i].enName,
							title: head[i].chName,
							align: "center",
						}
						arr.push(obj);
					}
					this.list = data.standardDatas || [];
					this.total = data.total || 0;
					this.table = arr;
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetList = false;
			}).catch(err=>{
				this.isGetList = false;
				this.$hMessage.error('获取列表失败');
			})
		},
	},
	mounted() {
		let { id,name } = this.$route.query;
		this.id = id;
		this.name = name || '';
		this.getList();
		this.$store.commit('SAVE_TAB_NAME',{  path: this.$route.path , name: '标准数据 - 详情'});
	}
}
</script>
<style type="text/css" scoped>
.fileSourceContent{
	margin-top: 10px;
}
>>>.text-file-msg .h-modal-body{
	overflow-y: unset !important;
}
.table-content{
	position: relative;
}
.search-auto{
	width: auto!important;
}
.search-form-name{
	line-height: 28px;
	font-weight: 600;
}
</style>