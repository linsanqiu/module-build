<template>
	<div>
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>资讯ID：</dt>
						<dd>
							<h-input placeholder="请输入" v-model="req.newsId" icon="android-close" ref="newsId" @on-enter="onPageChange(1)" @on-click="shitClearableClick('newsId','req')"></h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>数据ID：</dt>
						<dd>
							<h-input placeholder="请输入" v-model="req.dataId" icon="android-close" ref="dataId" @on-enter="onPageChange(1)" @on-click="shitClearableClick('dataId','req')"></h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>标题：</dt>
						<dd>
							<h-input placeholder="请输入" v-model="req.title" icon="android-close" ref="title" @on-enter="onPageChange(1)" @on-click="shitClearableClick('title','req')"></h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>更新日期：</dt>
						<dd>
							<h-date-picker type="daterange" format="yyyy-MM-dd" placeholder="请选择"  @on-change="onChangeDateRangePicker"></h-date-picker>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>新闻模板：</dt>
						<dd>
							<h-select placeholder="请选择" filterable v-model="req.newsTemplateId">
								<h-option v-for="(item,k) in newsTemplate"  :value="item.id" :key="k">{{ item.name }}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>推送状态：</dt>
						<dd>
							<h-select placeholder="请选择" filterable v-model="req.pushStatus">
								<h-option v-for="(item,k) in pushStatusList"  :value="item.id" :key="k">{{ item.name }}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>是否删除：</dt>
						<dd>
							<h-select placeholder="请选择" filterable v-model="req.isDel">
								<h-option v-for="(item,k) in isDelList"  :value="item.id" :key="k">{{ item.name }}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="onPageChange(1)">查询</h-button>
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
		<div class="list-content">
			<h-table size="small" :maxHeight="maxTableHeight" class="full-max-height-table" :columns="table" :data="list" :highlight-row="false" border></h-table>
			<div class="tab-box">
				<h-page highlight-row size="small" show-elevator	show-total show-sizer placement="top" class="page-box"  :total="total" :current="req.currentPage" :page-size-opts="pageSizeOpts" @on-page-size-change="onPageSizeChange"  :page-size="req.pageSize" @on-change="onPageChange" ></h-page>
			</div>
			<h-spin fix v-if="isLoading">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</h-spin>
		</div>
	</div>
</template>
<script>
import { copyDeep } from '@/filters/index'
export default {
	name: 'RobotwritingNews',
	data () {
		return {
			isAutoRefreshTable: true,
			req:{
				newsId: '',
				dataId: '',
				updateStartTime: '',
				updateEndTime: '',
				title: '',
				currentPage: 1,
				pageSize: 10,
				newsTemplateId: '',
				isDel: '',
				pushStatus: '',
			},
			pageSizeOpts:[10,20,50,100],
			total:0,
			pushStatus: ['待推送','已推送','推送失败'],
			table:[
				{
					key: "id",
					title: "资讯id",
					width: 100
				},
				{
					key: "title",
					title: "资讯标题",
				},
				
				{
					key: "newsTemplateName",
					title: "新闻模板",
				},
				{
					key: "createTime",
					title: "创建时间",
					align: 'center',
					width: 160
				},
				{
					key: "updateTime",
					title: "更新时间",
					align: 'center',
					width: 160
				},
				{
					key: "dataId",
					title: "数据ID",
					align: 'center',
					width: 100
				},
				{
					key: "pushStatus",
					title: "推送状态",
					align: 'center',
					width: 80,
					render: (h, params) => {
						let row = params.row;
						return h('div', this.pushStatus[row.pushStatus]);
					}
				},
				{
					key: "isDel",
					title: "是否删除",
					align: 'center',
					width: 70,
					render: (h, params) => {
						let row = params.row;
						let {isDel} = row
						let des = isDel === 1?"是":"否"
						return h('div', des);
					}
				},
				{
					title: "操作",
					align: 'center',
					width: 70,
					render: (h, params) => {

						return h('i',{
							attrs: {
								title: '查看',
							},
							class: [
								'icon-view',
								'iconfont',
								'tab-icon-btn'
							],
							style:{
								color:'#298DFF'
							},
							on: {
								click: (e) => {
									this.$router.push({ path: '/robotwriting/news/detail?id=' + params.row.id});
									
								}}
						});
					}
				},
			],
			list: [],
			isLoading: false,
			newsTemplate: [],
			pushStatusList: [
				{
					id: '0',
					name: '待推送'
				},
				{
					id: '1',
					name: '已推送'
				},
				{
					id: '2',
					name: '推送失败'
				},
			],
			isDelList: [
				{
					id: '1',
					name: '是'
				},
				{
					id: '0',
					name: '否'
				},
			]
		}
	},
	computed: {
		maxTableHeight(){ return  this.$store.state.maxTableHeight },
	},
	methods:{
		shitClearableClick(a,b){
			this[b][a] = '';
			this.$refs[a].focus();
		},
		onPageSizeChange(size){
			this.req.pageSize = size;
			this.onPageChange(1);
		},
		onPageChange(val){
			this.req.currentPage = val;
			this.getList();
		},
		onChangeDateRangePicker(arr){
			this.req.updateStartTime = arr[0];
			this.req.updateEndTime = arr[1];
		},
		getList(){
			let url = '/tm/mw/newsInfo/page';
			if(this.isLoading)return;
			this.isLoading = true;
			let req = copyDeep(this.req);
			this.$http.post( url, req).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data || {};
					let list = data.records || [];
					let total = data.total || 0;
					if(total && list && list.length == 0){
						this.req.currentPage = Math.ceil(total/this.req.pageSize)
						this.getList();
						return;
					}
					this.list = list 
					this.total = total;
				}else{
					this.updaterList = [];
					this.$hMessage.error(oTmp.msg);
				}
				this.isLoading = false;
			}).catch(err=>{
				this.isLoading = false;
				this.$hMessage.error('网络错误，获取资讯列表失败');
			})
		},
		getNewsTemplate(){
			let url = '/tm/mw/newsTemplate/listByNameLike';
			this.$http.post( url, {}).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data || [];
					this.newsTemplate = data;
				}else{
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				this.$hMessage.error('网络错误，获取新闻模板失败');
			})
		}
	},
	mounted() {
		this.getList();
		this.getNewsTemplate();
	},
	activated: function(){
		if(this.isAutoRefreshTable){
			this.getList();
		}
		this.getNewsTemplate();
	},
}
</script>
<style type="text/css" scoped>
	.list-content{
		position: relative;
	}
</style>