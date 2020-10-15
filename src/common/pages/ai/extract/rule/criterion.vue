<template>
	<div class="file">
		<search-form :title="name">
			<ul slot="content">
				<li>
					<dl>
						<dt>标准数据名称：</dt>
						<dd>
							<h-input ref="standardName" placeholder="请输入" v-model="req.standardName" icon="android-close" @on-click="shitClearableClick('standardName','req')" @on-enter="onPageChange(1)" ></h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>创建人：</dt>
						<dd>
							<h-select v-model="req.creator">
								<h-option v-for="(item, k) in changeUser" :key="k" :value="item.id" >
									{{ item.realName }}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="onPageChange(1)">查询</h-button>
					<!-- <h-button type="primary" @click="add" >新建</h-button> -->
				</li>
			</ul>
		</search-form>
		<div class="list">
			<h-table
				size="small"
				:maxHeight="maxTableHeight"
				class="full-max-height-table"
				:columns="aryHeaderData"
				:data="list"
				:highlight-row="false"
				border>
			</h-table>
			<div class="tab-box">
				<h-page highlight-row size="small" show-elevator show-total show-sizer placement="top" class="page-box"  :page-size-opts="pageSizeOpts" :total="total" :current="req.currentPage" :page-size="req.pageSize" @on-change="onPageChange" @on-page-size-change="onPageSizeChange"></h-page>
			</div>
			<h-spin fix v-if="isGetList">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</h-spin>
		</div>
		<h-msgBox title="新建" v-model="isShowMsgBox" @on-close="onCloseMsgBox" class-name="vertical-center-modal" :top="0" width="620" height="300">
			<div class="file-form">
				<h-form :model="submit" ref="submitForm" label-position="right" :label-width="100" :rules="modulesRule" @submit.native.prevent>
					<h-form-item label="文件来源：">
						<h-select v-model="submit.source" :clearable="false">
							<h-option v-for="(item, k) in fileSource" :key="k" :value="item.value" >
								{{ item.name }}
							</h-option>
						</h-select>
						<div class="fileSourceContent">
							<template v-if="submit.source == 1">
								<h-input type="textarea" :rows="4" v-model="submit.content" placeholder="SQL语句"></h-input>
							</template>
							<template v-else-if="submit.source == 2">
								<template v-if="fileUpload">
									<h-button type="primary">文件上传中...</h-button>
								</template>
								<template v-else>
									<Upload ref="upload" action="/tm/extractFile/upload" :data="{ ruleFileId: submit.id }" accept=".pdf" :uploadAll="true" name="files" :multiple="false" :show-upload-list="false" :on-self-success="uploadSuccess" :on-error="uploadError" :before-upload="handleBeforeUpload" :on-progress="filePprogress" :mergeHook="true"> 
										<h-button type="primary">上传</h-button>
									</Upload>
									<span>已上传 {{ activeFileSum }} 个文件，本次上传 {{ this.submit.fileIds.length }} 个文件</span>
								</template>
							</template>
						</div>
					</h-form-item>
				</h-form>
			</div>
			<div slot="footer" class="draggable-form-footer">
				<h-button @click="onCloseMsgBox">取消</h-button>
				<h-button type="primary" @click="onSubmit" :disabled="fileUpload">确定</h-button>
			</div>
		</h-msgBox>
	</div>
</template>
<script>
import { copyDeep } from '@/filters/index'
export default {
	data() {
		return {
			activeRoutersButton: this.$store.state.activeRoutersButton,
			aryHeaderData: [
				{
					title: '标准数据名称',
					key: 'standardName',
				},{
					title: '创建人',
					key: 'creator',
				},{
					title: '创建时间',
					key: 'createTime',
				},{
					title: '操作',
					key: 'tagName',
					width: 120,
					align: 'center',
					render: (h, params) => {
						let row = params.row;
						let btn = this.activeRoutersButton;
						let viewBtn,deleteBtn;
						viewBtn = h('span', {
								attrs: {
									"title": '查看详情',
								},
								class: [
									'icon-view',
									'iconfont',	                                     
									'tab-icon-btn'
								],
								on: {
									click: () => {
										this.$router.push('/extract/rule/criterion/detail?id=' + row.standardId +'&name='+row.standardName);
									}
								},
							})
						deleteBtn = h('span', {
							attrs: {
								"title": '删除',
							},
							class: [
								'icon-t-b-delete',
								'iconfont',	                                     
								'tab-icon-btn'
							],
							style:{
								color:'#F5222D'
							},
							on: {
								click: () => {
									this.$hMsgBox.confirm({
										title:'温馨提示',
										content:'确定要删除：'+ row.fileName +'?',
										onOk:()=>{
											this.del(row.id);
										}
									})
								}
							},
						})
						return h('div',{
							class: [
								"tab-operation",
							],
						},[viewBtn,deleteBtn]);
					}
				}
			],
			list: [],
			isGetList: false,
			pageSizeOpts: [10,20,50,100],
			fileSource:[
				{
					name: 'SQL',
					value: 1,
				},{
					name: '本地上传',
					value: 2,
				}
			],
			req: {
				ruleId: '',
				standardName: '',
				creator: '',
				pageCurrent: 1,
				pageSize: 10,
			},
			total: 0,
			isShowMsgBox: false,
			modulesRule:{
				fileName:[
					{ required:true, message: '请输入', trigger:'blur'},
					{ max: 20, message: '不可超过20个字符', trigger:'blur'}
				],
			},
			submit: {
				id: '',
				fileName: '',
				source: 2,
				content: '',
				fileIds: [],
			},
			isPOST: false,
			fileLen: 0,
			fileSuccessLen: 0,
			fileUpload: false,
			uploadList: [],
			changeUser: [],
			maxFileSum: 100,
			maxFileAll: 10,
			activeFileSum: 0,
			isSequelUp: false,
			fileSum:{},
			name: '',
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods: {
		shitClearableClick(a,b, c = null){
			this[b][a] = '';
			if(c){
				this.$refs[c].focus();
			}else{
				this.$refs[a].focus();
			}
		},
		add(){
			this.isShowMsgBox = true;
		},
		filePprogress(event, file, fileList){

		},
		handleBeforeUpload(list){
			this.fileLen = list.length;
			if(this.fileLen > this.maxFileSum){
				this.$hMessage.error({
					duration: 3,
					content: '单次上传文件数量不可以超过'+ this.maxFileSum +'个'
				});
				return false;
			}
			if(this.activeFileSum + this.fileLen > this.maxFileAll){
				this.$hMessage.error({
					duration: 3,
					content: '文件总数不可以超过'+ this.maxFileAll +'个'
				});
				return false;
			}
			this.fileUpload = true;
		},
		uploadSuccess(response, file, fileList){
			this.fileUpload = false;
			let name = 'error'
			if(response.status == this.$api.SUCCESS){
				let data = response.body || {};
				let list = data.idList || [];
				this.submit.fileIds = [...this.submit.fileIds,...list];
				name = 'info'
			}
			this.$hMessage[name]({
				duration: 3,
				content: response.msg
			});
		},
		uploadError(response, file, fileList){
			this.$hMessage.error('上传失败');
			this.fileUpload = false;
			this.isSequelUp = false;
		},
		onPageChange(val){
			this.req.currentPage = val;
			this.getList();
		},
		onPageSizeChange(size){
			this.req.pageSize = size;
			this.onPageChange(1);
		},
		onCloseMsgBox(){
			this.isShowMsgBox = false;
			this.submit = {
				id:'',
				fileName: '',
				source: 2,
				content: '',
				fileIds: [],
			}
			this.$refs['submitForm'].resetFields();
		},
		onSubmit(){
			this.$refs['submitForm'].validate((valid) => {
				if(valid){
					let submit = copyDeep(this.submit);
					if(submit.source == 1 && submit.content == ''){
						this.$hMessage.error('请填写SQL语句');
						return;
					}
					if(submit.source == 2 && submit.fileIds.length == 0 && submit.id == '' ){
						this.$hMessage.error('请上传文件');
						return;
					}
					if(submit.source == 1){
						submit.fileIds = [];
					}else{
						submit.content = '';
					}
					if(this.isPOST)return;
					this.isPOST = true;
					let url = '/tm/ruleFile/modify';
					this.$http.put(url, submit).then((res)=>{
						let oTmp = res.data;
						if(oTmp.status == this.$api.SUCCESS){
							this.onCloseMsgBox();
							this.getList();
						}else{
							this.$hMessage.error(oTmp.msg);
						}
						this.isPOST = false;
					}).catch(err=>{
						this.isPOST = false;
						this.$hMessage.error('提交失败');
					})
				}
			})
		},
		getList(goOn = false){
			if(this.isGetList && !goOn)return;
			this.isGetList = true;
			let url = '/tm/standardData/getStandardList?';
			let oTmp = this.req;
			for(let k in oTmp){
				url += '&'+ k +'='+ encodeURIComponent(oTmp[k]);
			}
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.body ? oTmp.body : {};
					let total = data.total || 0;
					if(total && data.records && data.records.length == 0){
						this.req.currentPage = Math.ceil(total/this.req.pageSize)
						this.getList(true);
						return;
					}

					let list = data.records || [];
					for(let i = 0, len = list.length; i < len; i++){
						this.fileSum[list[i].id] = list[i].fileSum;
					}
					this.total = total;
					this.list = list;
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetList = false;
			}).catch(err=>{
				this.isGetList = false;
				this.$hMessage.error('获取列表失败');
			})
		},
		del(id){
			if(this.isDel)return;
			this.isDel = true;
			let url = '/tm/ruleFile/removeById?id=' + id;
			this.$http.delete(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.getList(true);
					this.$hMessage.success('删除成功')
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isDel = false;
			}).catch(err=>{
				this.isDel = false;
				this.$hMessage.error('删除失败');
			})
		},
		gethandleuserlist(){
			let url = '/tm/role/getuserlist?rolecode=Guest';
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.changeUser = oTmp.data || [];
				}else{
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				this.$hMessage.error('获取创建人失败');
			})
		}
	},
	mounted() {
		let { id,name } = this.$route.query;
		this.req.ruleId = id;
		this.name = name;
		this.getList();
		this.gethandleuserlist();
	}
};
</script>
<style type="text/css" scoped>
.fileSourceContent{
	margin-top: 10px;
}
.list{
	position: relative;
}
.list>>> .tab-operation{
	text-align: center;
}
.list>>> .tab-operation > span{
	margin-right:5px;
	color: #298DFF;
}
.file-form{
	position: relative;
}
.file-list-search li dt{
	width: 60px;
}
.file-list-search li dd{
	width: calc(100% - 60px);
}
.search-wrapper-but >>>.h-upload{
	display: inline-block;
}
</style>