<template>
	<div class="widget">
		<div class="widget-btn">
			<Button type="primary">添加插件</Button>
		</div>
		<div class="widget_content">
			<table class="tab">
				<thead>
					<tr>
						<th rowspan="2" width="120">widgetName</th>
						<th rowspan="2" width="120">widgetDescription</th>
						<th rowspan="2">dataApi</th>
						<th rowspan="2">displayFileds</th>
						<th colspan="7">参数</th>
						<th rowspan="2">redirectUrl</th>
						<th rowspan="2" width="60">操作</th>
					</tr>
					<tr>
						<th width="70">method</th>
						<th>data</th>
						<th>total</th>
						<th>list</th>
						<th>pagesize</th>
						<th>pagenum</th>
						<th>param</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in widgetlist">
						<td><span :title="item.widgetName">{{ item.widgetName }}</span></td>
						<td><span :title="item.widgetDescription">{{ item.widgetDescription }}</span></td>
						<td><span :title="item.dataApi">{{ item.dataApi }}</span></td>
						<td><span :title="item.displayFileds">{{ item.displayFileds }}</span></td>
						<td><span :title="item.method">{{ item.method }}</span></td>
						<td><span :title="item.data">{{ item.data }}</span></td>
						<td><span :title="item.total">{{ item.total }}</span></td>
						<td><span :title="item.list">{{ item.list }}</span></td>
						<td><span :title="item.pagesize">{{ item.pagesize }}</span></td>
						<td><span :title="item.pagenum">{{ item.pagenum }}</span></td>
						<td><span :title="item.param">{{ item.param }}</span></td>
						<td><span :title="item.redirectUrl">{{ item.redirectUrl }}</span></td>
						<td align="center">编辑</td>
					</tr>
				</tbody>
			</table>
		</div>
		<h-msgBox title="添加插件"  v-model="showMsgBox" class-name="vertical-center-modal" :top="0">
			<div class="widget-form-contents">
				<h-form :label-width="130" :model="oWidgetForm" >
					<div>
						<h-form-item label="widgetName:" :required="true">
							<h-input type="text" v-model="oWidgetForm.widgetName" autocomplete="off"></h-input>
						</h-form-item>
					</div>
					<div>
						<h-form-item label="widgetDescription:">
							<h-input type="text" v-model="oWidgetForm.widgetDescription" autocomplete="off"></h-input>
						</h-form-item>
					</div>
					<div>
						<h-form-item label="dataApi:" :required="true">
							<h-input type="text" v-model="oWidgetForm.dataApi" autocomplete="off"></h-input>
						</h-form-item>
					</div>
					<div>
						<h-form-item label="displayFileds:">
							<h-input type="text" v-model="oWidgetForm.displayFileds" autocomplete="off"></h-input>
						</h-form-item>
					</div>
					<div class="half">
						<h-form-item label="method:">
							<h-radio-group v-model="oWidgetForm.method">
								<h-radio label="get">GET</h-radio>
								<h-radio label="post">POST</h-radio>
							</h-radio-group>
						</h-form-item>
					</div>
					<div class="half">
						<h-form-item label="data:">
							<h-input type="text" placeholder="默认为:data" v-model="oWidgetForm.total" autocomplete="off"></h-input>
						</h-form-item>
					</div>
					<div class="half">
						<h-form-item label="total:">
							<h-input type="text" placeholder="默认为:total" v-model="oWidgetForm.total" autocomplete="off"></h-input>
						</h-form-item>
					</div>
					<div class="half">
						<h-form-item label="list:">
							<h-input type="text" placeholder="默认为:list"  v-model="oWidgetForm.list" autocomplete="off"></h-input>
						</h-form-item>
					</div>
					<div class="half">
						<h-form-item label="pagesize:">
							<h-input type="text" placeholder="默认为:pagesize" v-model="oWidgetForm.pagesize" autocomplete="off"></h-input>
						</h-form-item>
					</div>
					<div class="half">
						<h-form-item label="pagenum:">
							<h-input type="text" placeholder="默认为:pagenum" v-model="oWidgetForm.pagenum" autocomplete="off"></h-input>
						</h-form-item>
					</div>
					<div>
						<h-form-item label="param:">
							<h-input type="text"  v-model="oWidgetForm.param" autocomplete="off"></h-input>
						</h-form-item>
					</div>
					<div>
						<h-form-item label="redirectUrl:">
							<h-input type="text" v-model="oWidgetForm.redirectUrl" autocomplete="off"></h-input>
						</h-form-item>
					</div>
				</h-form>
			</div>
			<div slot="footer" class="menu-form-footer">
				<h-button>取消</h-button>
				<h-button type="primary">提交</h-button>
			</div>
		</h-msgBox>
	</div>
</template>
<script type="text/javascript">
export default {
	data(){
		return {
			widgetlist: [],
			showMsgBox: true,
			oWidgetForm: {
				widgetName: '',
				widgetDescription: '',
				dataApi: '',
				displayFileds: '',
				method: 'get',
				total: '',
				list: '',
				pagesize: '',
				pagenum: '',
				param: '',
				redirectUrl: ''
			}
		}
	},
	methods:{
		init(){
			this.getWidget();
		},
		getWidget(){
			let url = '/tm/widget/widgetlist';
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let list = oTmp.data ? oTmp.data : [];
					for(let i =0,len = list.length; i < len; i++){
						if(list[i].fieldsMap){
							let fieldsMap = JSON.parse(list[i].fieldsMap);
							if(fieldsMap){
								list[i].method = fieldsMap.method;
								list[i].total = fieldsMap.total;
								list[i].list = fieldsMap.list;
								list[i].pagesize = fieldsMap.pagesize;
								list[i].pagenum = fieldsMap.pagenum;
								list[i].param = fieldsMap.param;
								list[i].data = fieldsMap.data;
							}
						}
					}
					this.widgetlist = list;

				}
			}).catch(err=>{
				
			})
		}

	},
	mounted() {
		this.init();
	}
}
</script>
<style type="text/css" scoped>
.widget-btn{
	margin-bottom: 10px;
}
.widget_content .tab{
	width: 100%;
	border: 1px solid #DCE1E7;
}
.widget_content .tab td,.personal_content .tab th{
	border: 1px solid #DCE1E7;
	padding: 5px 10px;
}
.tab{
	width: 100%;
	border: 1px solid #DCE1E7;
}
.tab thead{
	background: #f0f3f5;
	font-size: 13px;	
}
.tab td,.tab th{
	border: 1px solid #DCE1E7;
	padding: 5px 10px;
}
.tab thead tr{
	height: 35px;
}
.tab tr{
	height: 32px;
}
.tab tbody tr:nth-child(even){
	background: #fafafa;
}
.tab tbody tr:hover{
	background: #eaf5ff;
}
.tab td{
	position: relative;
}
.tab td span{
	width: 100%;
	display: block;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	position: absolute;
	top: 0;
	left: 0;
	padding: 0 5px;
	line-height: 32px;
}
.widget-form-contents .half{
	width: 49%;
	display: inline-block;
}
.v-transfer-dom>>> .h-modal-body{
	padding-top: 16px;
}
</style>