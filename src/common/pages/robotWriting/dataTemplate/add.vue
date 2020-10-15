<template>
	<div class="adddatatemplate">
		<div class="topbox">
			<div>
				<h-form :model="req" ref="detailForm" label-position="right" :label-width="100" :rules="modulesRule" @submit.native.prevent>
					<h-form-item label="模板名称："  prop="templateName">
						<h-input type="text" v-model="req.templateName" placeholder="模板名称"></h-input>
					</h-form-item>
				</h-form>
			</div>
		</div>
		<div class="contentsbox">
			<Tabs size="small">
				<TabPane label="高级设置">
					<h-form :model="req" ref="detailsForm" label-position="right" :label-width="120" :rules="modulesRule" @submit.native.prevent>
						<h-form-item label="数据源："  prop="dataSource">
							<h-select placeholder="请选择数据源" v-model="req.dataSource" :clearable="false">
								<h-option v-for="(item, k) in source" :key="k" :value="item.code" >
									{{ item.name }}
								</h-option>
							</h-select>
							<div class="psContent">
								<div>同一个实例下支持跨库查询，括号中的其他数据库需要以【数据库名】+【表名】格式查询，</div>
								<div>如JYDB..Bond_BDCreditGrading；跨实例查询需要相关实例建立链接服务器</div>
							</div>
						</h-form-item>
						<h-form-item label="资讯数据查询："  prop="querySql">
							<h-input type="textarea" :rows="5" v-model="req.querySql" placeholder="资讯数据查询"></h-input>
							<div class="psContent">
								<div>必须定义ID和JSID字段、同时上线后ID和JSID不能发生变化。</div>
								<div>目前暂不支持语法包括：</div>
								<div>1）select * from，必须明确定义字段；</div>
								<div>2）union；</div>
							</div>
						</h-form-item>
						<h-form-item label="删除数据查询："  prop="deleteSql">
							<h-input type="textarea" :rows="5" v-model="req.deleteSql" placeholder="删除数据查询"></h-input>
							<div class="psContent">
								<div>必须提供删除表逻辑才能支持资讯自动删除，格式如下：</div>
								<div>select RECID ID, JSID<span style="margin-left: 100px">--原始表ID和删除表的JSID，需要规范命名为ID和JSID</span></div>
								<div>from JYPRIME..usrSJYGLSJYB <span style="margin-left: 50px">--提供删除表表名，如果非主数据库需要明确数据库名</span> </div>
								<div>where TABLENAME=‘EP_BankruptAnnounce’  <span style="margin-left: 205px">--过滤条件</span></div>
							</div>
						</h-form-item>
					</h-form>
					<br />
				</TabPane>
			</Tabs>
		</div>
		<div class="btnbox">
			<h-button type="primary" @click="cancel">取消</h-button>
			<h-button type="primary" @click="preparePreview">预览</h-button>
			<h-button type="primary" @click="save">保存</h-button>
		</div>
		<h-spin fix v-if="isGetDetail">
			<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
			<div>加载中...</div>
		</h-spin>
		<div class="preview" v-if="previewTable.length > 0">
			<h-table
				size="small"
				:maxHeight="450"
				class="full-max-height-table"
				:columns="previewTable"
				:data="previewData"
				:highlight-row="false"
				border>
			</h-table>
		</div>
	</div>
</template>
<script>
export default {
	name: 'RobotwritingDatatemplateAdd',
	data () {
		return {
			isGetDetail: false, 
			id: null,
			isCopy: false,
			req: {
				querySql: '',
				templateName: '',
				dataSource: '',
				deleteSql: '',
			},
			modulesRule: {
				templateName:[
					{ required:true, message: '请输入', trigger:'blur'},
					{ max: 100, message: '不可超过100个字符', trigger:'blur'},
				],
				dataSource:[{ required:true, message: '请选择', trigger:'blur'}],
				querySql:[{ required:true, message: '请输入', trigger:'blur'}],
			},
			source: [],
			previewTable: [],
			previewData: [],
			isMounted: true,
		}
	},
	methods:{
		getDatil(){
			let url = '/tm/mw/dataTemplate/getById?templateId=' + this.id;
			if(this.isGetDetail)return;
			this.isGetDetail = true;
			this.$http.get( url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data ? oTmp.data : {};
					if(this.isCopy){
						data.id = '';
						data.templateName = data.templateName + ' - 复制';
					}
					this.req = data;
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetDetail = false;
			}).catch(err=>{
				this.isGetDetail = false;
				this.$hMessage.error('获取数据模板详情失败');
			})
		},
		getSourceList(){
			let url = '/tm/mw/enum/getDataSourceList';
			this.$http.get( url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data || [];
					this.source = data;
				}else{
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				this.$hMessage.error('获取数据源数据失败');
			})
		},
		init(){
			let { id, copy } = this.$route.query;
			let pathName = '数据模板 - 新增';
			if(id){
				if(this.id == id && !this.isCopy)return;
				this.id = id;
				pathName = '数据模板 - 编辑';
			}
			this.$store.commit('SAVE_TAB_NAME',{  path: this.$route.path, name: pathName });
			if(copy){
				if(this.id == copy && this.isCopy)return;
				this.id = copy;
				this.isCopy = true;
			}else{
				this.isCopy = false;
			}
			if(!id && !copy){
				if(!this.isMounted && !this.id){
					return;
				}
				this.id = '';
				this.req = {
					querySql: '',
					templateName: '',
					dataSource: '',
				}
				this.previewTable = [];
				this.previewData = [];
			}
			if(this.$refs['detailsForm'] && this.$refs['detailsForm'].resetFields){
				this.$refs['detailsForm'].resetFields();
			}
			if(this.$refs['detailForm'] && this.$refs['detailForm'].resetFields){
				this.$refs['detailForm'].resetFields();
			}
			if(this.id){
				this.previewTable = [];
				this.previewData = [];
				this.getDatil();
			}
		},
		save(){
			this.$refs['detailForm'].validate((valid) => {
				if (valid) {
					this.$refs['detailsForm'].validate((valid) => {
						if (valid) {
							this.setSaveData();
						}
					})
				}
			})
		},
		setSaveData(){
			if(this.isGetDetail)return;
			this.isGetDetail = true;
			let req = this.req;
			let url = '/tm/mw/dataTemplate/save';
			this.$http.post( url, req).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.$hMessage.success('保存成功');
					let url = this.$route.path;
					let id = oTmp.data;
					this.isCopy = false;
					this.id = id;
					this.req.id = id;
					this.$router.push( url+'?id='+ oTmp.data);
					this.$store.commit('SAVE_TAB_NAME',{  path: this.$route.path, name: '数据模板 - 编辑' });
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetDetail = false;
			}).catch(err=>{
				this.isGetDetail = false;
				this.$hMessage.error('保存失败');
			})
		},
		preparePreview(){
			this.$refs['detailsForm'].validate((valid) => {
				if (valid) {
					this.preview();
				}
			})
		},
		preview(){
			if(this.isGetDetail)return;
			this.isGetDetail = true;
			let req = {
				dataSource: this.req.dataSource,
				querySql: this.req.querySql
			};
			let url = '/tm/mw/dataTemplate/queryBySql';
			this.$http.post( url, req).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data || {};
					let arr = [{
							title: "序号",
							width: 60,
							align: "center",
							render: (h, params) => {
								let index = params.index + 1;
								return h('div', index );
							}
						}];
					let head = data.columns || [];
					for(let i = 0, len = head.length; i < len; i++){
						let obj = {
							key: head[i].originalName,
							title: head[i].columnName,
							align: "center",
						}
						arr.push(obj);
					}
					this.previewTable = arr;
					this.previewData = data.data || [];
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetDetail = false;
			}).catch(err=>{
				this.isGetDetail = false;
				this.$hMessage.error('保存失败');
			})
		},
		//取消
		cancel(){
			this.$store.commit("DEL_TAB", this.$route.path);
			this.$router.push('/robotwriting/datatemplate');
		},
	},
	mounted() {
		this.getSourceList();
		this.isMounted = true;
		this.init();
	},
	activated: function(){
		this.isMounted = false;
		this.init();
	}
}
</script>
<style type="scss" scoped>
.adddatatemplate{
	position: relative;
}
.topbox{
	margin-bottom: 10px;
}
.btnbox{
	text-align: center;
	margin-bottom: 10px;
}
.preview{
	padding-bottom: 10px;
}
.contentsbox /deep/ .h-form-item{
	margin-bottom: 0px!important;
}
.psContent{
	font-size: 12px;
	color: #666;
}
</style>