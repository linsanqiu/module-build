<template>
	<div class="content-wrapper">
		<Row type="flex" align="top">
			<Col span="4">
			<div style="height:600px; border: 1px solid #dcdee2;">
				<vue-ztree :list.sync='ztreeDataSource' :func='nodeClick' :is-open='true' style="height:100%"></vue-ztree>
			</div>
			</Col>
			<Col span="20">
			<div class="report" style="width: 100%;margin-left: 5px">
				<search-form>
					<ul slot="content">
						<li>
							<dl>
								<dt>编码：</dt>
								<dd><h-input ref="keyword" v-model="keyword" icon="android-close" @on-click="clear()" @on-enter="inputEnter()" placeholder="编码"></h-input></dd>
							</dl>
						</li>
						<li class="search-wrapper-but"><h-button type="primary" @click="paramsSub()">查询</h-button></li>
					</ul>
				</search-form>
				<div class="list">
					<h-table :maxHeight="maxTableHeight" :loading="loading" border stripe class="full-max-height-table user-search-list-tab" size="small" :columns="columns" :data="dataList"></h-table>
				</div>
				<div class="page-box">
					<h-page :total="total" :page-size="pageSize" size="small" :current="page" @on-page-size-change="pageSizeChange" @on-change="changePage" show-elevator show-total></h-page>
				</div>
			</div>
			</Col>
		</Row>
		<h-msgBox
			title="编辑"
			:mask-closable="false"
			v-model="modal">
			<h-form ref="formValid" :model="paramInfo" :label-width="100">
				<h-form-item label="参数编码">
					<label>{{ paramInfo.paramCode }}</label>
				</h-form-item>
				<h-form-item label="描述">
					<label>{{ paramInfo.paramDesc }}</label>
				</h-form-item>
				<h-form-item label="参数值">
					<template v-if="paramInfo.paramType == '1'">
						<h-select v-model="paramInfo.paramValue" style="width:200px">
							<h-option v-for="(item, index) in valuerangeList" :value="item" :key="index">{{ item }}</h-option>
						</h-select>
					</template>
					<template v-if="paramInfo.paramType == '2'">
						<h-input v-model="paramInfo.paramValue" placeholder="请输入"></h-input>
					</template>
					<template v-if="paramInfo.paramType == '3'">
						<h-input v-model="paramInfo.paramValue" placeholder="请输入"></h-input>
					</template>
					<template v-if="paramInfo.paramType == '4'">
						<h-input v-model="paramInfo.paramValue" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入"></h-input>
					</template>
					<template v-if="paramInfo.paramType == '5'">
						<h-date-picker showFormat type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" v-model="paramInfo.paramValue"></h-date-picker>
					</template>
					<template v-if="paramInfo.paramType == '6'">
						<h-select v-model="paramInfo.paramValue" style="width:200px">
							<h-option v-for="(item, index) in dictInfo" :value="item.dictEntry" :key="index">{{ item.entryName }}</h-option>
						</h-select>
					</template>
				</h-form-item>
				
			</h-form>
			<div slot="footer">
			   <h-button v-if="paramInfo.paramOperType == '1'" type="info" size="large" long :loading="save_loading" @click="save">保存</h-button>
			</div>
		</h-msgBox>
		<h-spin fix v-if="spinShow"></h-spin>
	</div>
</template>
<script type="text/javascript">
import vueZtree from '@/components/vue-ztree.vue'

export default {  
	data () {
		return{
			spinShow: true,
			ztreeDataSource: [],
			loading: true,
			dataList: [],
			keyword: '',
			keyword_copy: '',
			columns: [
				{
					title: '编码',
					key: 'paramCode',
				},
				{
					title: '值',
					key: 'paramValue',
					ellipsis: true,
					render: (h, params) => {
						const text = params.row.paramValueDesc
						return h('h-tooltip', {
							props: { placement: 'bottom-start' }
						}, [
							text,
							h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, text)
						])
					}
				},
				{
					title: '类型',
					key: 'paramType',
					width: 90,
					render: (h, params) => {
						const row = params.row;
						const dic = {"1": "选择量", "2": "整数", "3": "浮点数", "4": "字符串", "5": "日期", "6": "字典值"}
						const text = dic[row.paramType];
						return h('label', text);
					},
				},
				{
					title: '类别',
					key: 'paramCategory',
					width: 90,
				},
				{
					title: '子类别',
					key: 'paramSubclass',
					width: 90,
				},
				{
					title: '描述',
					key: 'paramDesc',
					ellipsis: true,
					render: (h, params) => {
						const text = params.row.paramDesc
						return h('h-tooltip', {
							props: { placement: 'bottom-start' }
						}, [
							text,
							h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, text)
						])
					}
				},
				
				{
					title: '更新时间',
					key: 'updateTime',
				},
				{
					key: 'action',
					title: '操作',
					width: 80,
					render: (h, params) => {
						const row = params.row;
						let editBtn = null;
						let editBtnTxt = '处理' ;
						let editBtnIcon = true
						if(true){
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
			paramCategory: '',
			paramSubclass: '',
			page: 1,
			pageSize: 12,
			list: [],
			total: 0,
			modal: false,
			paramInfo: {},
			valuerangeList: [],
			dictInfo: [],
			save_loading: false
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	components: { vueZtree },
	methods:{
		paramsSub() {
			this.keyword_copy = this.keyword
			this.getList()
		},
		getList() {
			let url = '/tm/sysParameter/list?paramCategory=' + this.paramCategory + '&paramSubclass=' + this.paramSubclass + '&keyword=' + encodeURIComponent(this.keyword_copy.trim());
			this.$http.get(url).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){
					this.list = data.data;
					this.total = data.data.length;
					this.changePage(1);
					this.loading = false;
				}else{
					this.$hLoading.error(data.message)
				}
				this.loading = false;
			})
			.catch(err=>{
				console.log(err)
				this.$hLoading.error();
				this.loading = false;
			})
		},
		getTree() {
			let url = '/tm/sysParameter/treeList';
			this.$http.get(url).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){
					this.ztreeDataSource = data.data;
					this.spinShow = false;
				}else{
					this.$hLoading.error(data.message)
				}
				this.spinShow = false;
			})
			.catch(err=>{
				console.log(err)
				this.$hLoading.error();
				this.spinShow = false;
			})
		},
		nodeClick:function(m){
			this.loading = true
			let parentId = m.parentId
			let id = m.id
			if (m.parentId == 'TOP') {
				this.paramCategory = id
				this.paramSubclass = ''
			} else {
				this.paramCategory = parentId
				this.paramSubclass = id
			}
			this.keyword_copy = ''
			this.keyword = ''
			this.getList()
		},
		pageSizeChange(size){
			this.keyword = this.keyword_copy
			this.pageSize=size;
			this.changePage (1);
		},
		changePage (page) {
			this.keyword = this.keyword_copy
			let ldata = [];
			let start = (page - 1) * this.pageSize;
			let end = page * this.pageSize;
			end = end > this.list.length ? this.list.length : end;
			for (let i = start; i < end; i++) {
				ldata.push(this.list[i]);
			}
			this.page = page;
			this.dataList = ldata;
		},
		edit(row) {
			this.dictInfo = []
			let info = Object.assign({}, row)
			this.paramInfo = info
			if (info.paramType == '1' && info.paramValuerange){
				this.valuerangeList = info.paramValuerange.split(';')
			}else if(info.paramType == '6' && info.paramValuerange){
				this.getDictInfo(info.paramValuerange, info.paramValue)
			}
			this.modal = true
		},
		getDictInfo(code, paramValue) {
			let url = '/tm/dict/code?code=' + code;
			this.$http.get(url).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){
					this.dictInfo = data.data;
					this.paramInfo.paramValue = paramValue;
				}else{
					this.$hLoading.error(data.message)
				}
			})
			.catch(err=>{
				this.$hLoading.error();
			})
		},
		save() {
			this.save_loading = true
			let code = this.paramInfo.paramCode
			let value = this.paramInfo.paramValue
			let intReg = new RegExp("^-?\\d+$");
			let floatReg = new RegExp("^(-?\\d+)(\\.\\d+)?$");
			if(!value) {
				this.$hMessage.error('参数值不能为空!')
				this.save_loading = false
				return
			}
			if(value.length > 500) {
				this.$hMessage.error('参数值长度不能超过500!')
				this.save_loading = false
				return
			}
			if(this.paramInfo.paramType == '2' && !intReg.test(value)) {
				this.$hMessage.error('请输入整数!')
				this.save_loading = false
				return
			}
			if(this.paramInfo.paramType == '3' && !floatReg.test(value)) {
				this.$hMessage.error('请输入浮点数!')
				this.save_loading = false
				return
			}
			let saveInfo = { "paramCode": code, "paramValue": value }
			let url = '/tm/sysParameter/save'
			this.$http.post(url, saveInfo).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					this.$hMessage.info(tmpObj.data)
					this.loading = true
					this.save_loading = false
					this.modal = false
					this.getList()
					
				}
				this.save_loading = false
			}).catch(err=>{
				this.$hMessage.error('发生未知错误!')
				this.save_loading = false
			})
		},
		clear() {
			this.keyword = ''
			this.$refs.keyword.focus()
		},
		inputEnter() {
			this.keyword_copy = this.keyword
			this.getList()
		}
	},
	mounted(){
		this.getTree()
		this.getList()
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
