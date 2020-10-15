<template>
	<div class="widget-add">
		<div class="widget-form-box">
			<h-form :label-width="130" :model="oWidgetForm" :rules="ruleValidate" ref="widgetform">
				<h-form-item label="widgetName:" prop="widgetName">
					<h-input type="text" placeholder="请填写widgetName" v-model="oWidgetForm.widgetName" autocomplete="off"></h-input>
				</h-form-item>
				<h-form-item label="widgetDescription:">
					<h-input type="text" placeholder="请填写widgetDescription" v-model="oWidgetForm.widgetDescription" autocomplete="off"></h-input>
				</h-form-item>
				<h-form-item label="dataApi:" prop="dataApi">
					<h-input type="text" placeholder="请填写dataApi" v-model="oWidgetForm.dataApi" autocomplete="off"></h-input>
				</h-form-item>
				<h-form-item label="displayFileds:">
					<h-input type="text" placeholder="请填写displayFileds" v-model="oWidgetForm.displayFileds" autocomplete="off"></h-input>
				</h-form-item>
				<h-form-item label="method:">
					<h-radio-group v-model="oWidgetForm.fieldsMap.method">
						<h-radio label="get">GET</h-radio>
						<h-radio label="post">POST</h-radio>
					</h-radio-group>
				</h-form-item>
				<h-form-item label="data:">
					<h-input type="text" placeholder="默认为:data" v-model="oWidgetForm.fieldsMap.data" autocomplete="off"></h-input>
				</h-form-item>
				<h-form-item label="total:">
					<h-input type="text" placeholder="默认为:total" v-model="oWidgetForm.fieldsMap.total" autocomplete="off"></h-input>
				</h-form-item>
				<h-form-item label="list:">
					<h-input type="text" placeholder="默认为:list"  v-model="oWidgetForm.fieldsMap.list" autocomplete="off"></h-input>
				</h-form-item>
				<h-form-item label="pagesize:">
					<h-input type="text" placeholder="默认为:pagesize" v-model="oWidgetForm.fieldsMap.pagesize" autocomplete="off"></h-input>
				</h-form-item>
				<h-form-item label="pagenum:">
					<h-input type="text" placeholder="默认为:pagenum" v-model="oWidgetForm.fieldsMap.pagenum" autocomplete="off"></h-input>
				</h-form-item>
				<h-form-item label="param:">
					<h-input type="text" placeholder="请填写param" v-model="oWidgetForm.fieldsMap.param" autocomplete="off"></h-input>
				</h-form-item>
				<h-form-item label="redirectUrl:">
					<h-input type="text" placeholder="请填写redirectUrl" v-model="oWidgetForm.redirectUrl" autocomplete="off"></h-input>
				</h-form-item>
			</h-form>
			<div class="but">
				<Button @click="cancel">取消</Button>
				<Button type="primary" @click="submitForm(false)">保存</Button>
				<Button type="primary" @click="submitForm(true)">预览</Button>
			</div>
		</div>
		<div class="internal-param">
			<h3>param内置参数说明：</h3>
			<p>{{ sInternalParam }}</p>
		</div>
		<Spin fix v-if="isLoad || isSave || isPreview">
			<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
			<div>加载中...</div>
		</Spin>
		<h-msgBox title="预览" v-model="showPreviewMsgBox" class-name="home-msgBox vertical-center-modal" :top="0" width="800" height="330">
			<div class="draggable-list">
				<div :class="previewData.hide ? 'draggable-content draggable-hide' : 'draggable-content'">
					<div class="draggable-header-c ">
						{{previewData.widgetName}}
						<div class="draggable-header-operation">
							<span :title="previewData.widgetDescription">
								<i class="sprites sprites-help" ></i>
							</span>
							<span @click="previewDataHideSwitch" :title="previewData.hide ? '展开' : '收起'">
								<i v-if="previewData.hide" class="sprites sprites-down"></i>
								<i v-else class="sprites sprites-up" ></i>
							</span>
							<span @click="pageChange(1)" title="刷新">
								<i class="sprites sprites-shuaxin"></i>
							</span>
							<span @click="previewClose" title="退订">
								<i class="sprites sprites-close" ></i>
							</span>
						</div>
					</div>
					<div class="draggable-body">
						<table class="draggable-tab" v-if="previewData.displayFileds">
							<thead>
								<tr>
									<th class="serial">
										NO.
									</th>
									<template v-for="( value, key, index) in previewData.displayFileds">
										<th ><span class="data" :title="key" >{{ key }}</span></th>
									</template>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(dataList, index) in aWidgetDataList">
									<td>
										{{ (previewData.nowpagenum * pagesize) + index +1 }}
									</td>
									<template v-for="( value, key, index) in previewData.displayFileds">
										<td ><span class="data" :title="dataList[value]" >{{ dataList[value] }}</span></td>
									</template>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="draggable-footer">
						<div class="box">
							<simplePage :current="previewData.pagenum" :total="previewData.total" :size="pagesize" @page-change="pageChange"></simplePage>
						</div>
						<div class="box detail">
							<router-link :to="previewData.redirectUrl" v-if="previewData.redirectUrl">查看详情</router-link>
						</div>
					</div>
				</div>
				<Spin fix v-if="previewData.load">
					<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
					<div>加载中...</div>
				</Spin>
			</div>
			<div slot="footer" class="draggable-form-footer">
				
			</div>
		</h-msgBox>
	</div>
</template>
<script type="text/javascript">
import simplePage from '@/components/simple-page'
import store from '@/store';
export default {
	components: {
		simplePage
	},
	data(){
		return {
			showPreviewMsgBox: false,
			isLoad: false,
			id: null,
			oWidgetForm: {
				widgetName: '',
				widgetDescription: '',
				dataApi: '',
				displayFileds: '',
				fieldsMap: {
					method: 'get',
					data: '',
					total: '',
					list: '',
					pagesize: '',
					pagenum: '',
					param: ''
				},
				redirectUrl: ''
			},
			ruleValidate: {
				widgetName: [
					{ required: true, message: 'widgetName不能为空', trigger: 'blur' },
				],
				dataApi: [
					{ required: true, message: 'dataApi不能为空', trigger: 'blur' },
				]
			},
			isSave: false,
			isPreview: false,
			pagesize: 8,
			previewData: {
				hide: false,
				load: false,
				pagenum: 1,
				total: 0
			},
			aWidgetDataList: [],
			sInternalParam: '',
		}
	},
	methods:{
		cancel(){
			store.commit('DEL_TAB','/system/widget/save');
			this.$router.push('/system/widget');
		},
		previewClose(){
			this.$hMessage.error('预览无退订功能！');
		},
		previewDataHideSwitch(){
			this.previewData.hide = !this.previewData.hide;
		},
		pageChange(current){
			this.previewData.pagenum = current;
			this.getWidgetData();
		},
		submitForm(preview){
			this.$refs['widgetform'].validate((valid) => {
				if(valid){
					let oTmp = {...this.oWidgetForm};
					oTmp.fieldsMap = {
						data: oTmp.fieldsMap.data || 'data',
						total: oTmp.fieldsMap.total || 'total',
						list: oTmp.fieldsMap.list || 'list',
						pagesize: oTmp.fieldsMap.pagesize || 'pagesize',
						pagenum: oTmp.fieldsMap.pagenum || 'pagenum',
						method: oTmp.fieldsMap.method,
						param: oTmp.fieldsMap.param
					}
					if(this.id){
						oTmp.id = this.id;
					}
					if(preview){
						this.preview(oTmp);
					}else{
						this.submitFn(oTmp);
					}
				}
			})
		},
		submitFn(oForm){
			if(this.isSave)return;
			this.isSave = true;
			let url = '/tm/widget/info/save';
			this.$http.post(url, oForm).then((res)=>{
				this.isSave = false;
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.$hMessage.success('保存成功');
					this.cancel();
				}else{
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				this.isSave = false;
				this.$hMessage.error('保存失败，请稍后再试！');
			})
		},
		preview(oForm){
			if(this.isPreview)return;
			this.isPreview = true;
			let url = '/tm/widget/preview';
			this.$http.post(url, oForm).then((res)=>{
				this.isPreview = false;
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let oData = oTmp.data ? oTmp.data : {};
					oData.displayFileds = oData.displayFileds ? JSON.parse(oData.displayFileds) : '';
					oData.fieldsMap = oData.fieldsMap ? JSON.parse(oData.fieldsMap) : {};
					oData.pagenum = 1;
					oData.nowpagenum = 0;
					oData.hide = false;
					oData.load = false;
					this.previewData = oData;
					this.showPreviewMsgBox = true;
					this.getWidgetData();
				}else{
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				this.isPreview = false;
				this.$hMessage.error('预览接口异常，请稍后再试！');
			})
		},
		getWidgetData(){
			this.previewData.load = true;
			let oTmp = {...this.previewData};
			let pagesizeStr = oTmp.fieldsMap.pagesize ? oTmp.fieldsMap.pagesize : 'pagesize';
			let pagenumStr = oTmp.fieldsMap.pagenum ? oTmp.fieldsMap.pagenum : 'pagenum';
			let totalStr = oTmp.fieldsMap.total ? oTmp.fieldsMap.total : 'total';
			let listStr = oTmp.fieldsMap.list ? oTmp.fieldsMap.list : 'list';
			let method = oTmp.fieldsMap.method ? oTmp.fieldsMap.method : 'get'; 
			let param = oTmp.fieldsMap.param ? '&'+oTmp.fieldsMap.param : '';
			let dataModel = oTmp.fieldsMap.data ? oTmp.fieldsMap.data : 'data';
			let parameter = pagesizeStr +'='+ this.pagesize +'&'+ pagenumStr +'='+ oTmp.pagenum +param;
			let url = oTmp.dataApi;
			let postData = {};
			if(method == 'post' || method == 'POST' ){
				let atyParameter = parameter.split("&"); //字符分割
				for(let i =0; i < atyParameter.length; i++){
					let a = atyParameter[i].split("=");
					postData[a[0]] = a[1];
				}
			}else{
				url = url +'?' +parameter;
			}
			this.isDisabledSortable = true;
			this.$http[method](url,postData).then((res)=>{
				this.isPreview = false;
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					let data = tmpObj[dataModel] ? tmpObj[dataModel] : {};
					let list = data[listStr] ? data[listStr] : [];
					oTmp.load = false;
					oTmp.total = data[totalStr] ? data[totalStr] : 0;
					oTmp.nowpagenum = oTmp.pagenum - 1;
					if(!oTmp.displayFileds && list.length > 0){
						let obj = {};
						for(let k in list[0]){
							obj[k] = k;
						}
						oTmp.displayFileds = obj;
					}
					if(oTmp.total && list.length == 0){
						oTmp.pagenum = Math.ceil(oTmp.total/this.pagesize);
						this.previewData = {...oTmp};
						this.getWidgetData();
						return;
					}
					oTmp.load = false;
					this.aWidgetDataList = list;
					this.previewData = {...oTmp};
				}else{
					this.aWidgetDataList = [];
					this.previewData.load = false;
					this.$hMessage.error('dataApi接口报错，'+ tmpObj.msg);
				}
			}).catch(err=>{
				this.aWidgetDataList = [];
				this.previewData.load = false;
				this.$hMessage.error('dataApi接口异常，请确认后再试！');
			})
		},
		getDetail(){
			this.isLoad = true;
			let url = '/tm/widget/info?id='+ this.id;
			this.$http.get(url).then((res)=>{
				this.isLoad = false;
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let oDate = oTmp.data ? oTmp.data : {};
					if(oDate.fieldsMap){
						oDate.fieldsMap = JSON.parse(oDate.fieldsMap)
					}else{
						oDate.fieldsMap = {};
					}
					let oTmpWidgetForm = {
						widgetName: oDate.widgetName || '',
						widgetDescription: oDate.widgetDescription || '',
						dataApi: oDate.dataApi || '',
						displayFileds: oDate.displayFileds || '',
						fieldsMap: {
							method: oDate.fieldsMap.method || 'get',
							data: oDate.fieldsMap.data || '',
							total: oDate.fieldsMap.total || '',
							list: oDate.fieldsMap.list || '',
							pagesize: oDate.fieldsMap.pagesize || '',
							pagenum: oDate.fieldsMap.pagenum || '',
							param: oDate.fieldsMap.param || ''
						},
						redirectUrl: oDate.redirectUrl || ''
					}
					this.oWidgetForm = {...oTmpWidgetForm};
				}
			}).catch(err=>{
				this.isLoad = false;
			})
		},
		getInternalParam(){
			let url = '/tm/widget/internalparam';
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.sInternalParam = oTmp.data;
				}
			}).catch(err=>{
				
			})
		}
	},
	created(){
		let { query } = this.$route;
		let pathName = '添加插件';
		if(query && query.id){
			this.id = query.id;
			pathName = '编辑插件';
			this.getDetail();
		}
		store.commit('SAVE_TAB_NAME',{  path: '/system/widget/save', name: pathName});
	},
	mounted() {
		this.getInternalParam();
	}
}
</script>
<style type="text/css" scoped>
.widget-add{
	width: 100%;
	position: relative;
}
.widget-form-box{
	width: 600px;
	display: inline-block;
	vertical-align: top;
}
.widget-add .but{
	text-align: center;
	padding-bottom: 20px;
}
.widget-add .but .h-btn{
	margin: 0 10px;
}
.internal-param{
	display: inline-block;
	width: calc(100% - 625px);
	margin-left: 20px;
	vertical-align: top;
}
.internal-param h3{
	margin-bottom: 5px;
	font-weight: 600;
}
.internal-param p{
	text-indent: 20px;
	line-height: 20px;
}
</style>