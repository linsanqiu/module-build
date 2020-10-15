<template>
	<div class="widget">
		<div class="widget-btn">
			<router-link to="/system/widget/save">
				<Button type="primary" v-if="activeRoutersButton.indexOf('save') != -1">添加插件</Button>
			</router-link>
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
						<th rowspan="2" width="60" v-if="activeRoutersButton.indexOf('save') != -1">操作</th>
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
						<td align="center" v-if="activeRoutersButton.indexOf('save') != -1">
							<router-link :to="'/system/widget/save?id='+item.id">编辑</router-link>
						</td>
					</tr>
				</tbody>
			</table>
			<Spin fix v-if="load">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</Spin>
		</div>
	</div>
</template>
<script type="text/javascript">
export default {
	data(){
		return {
			activeRoutersButton : this.$store.state.activeRoutersButton,
			load: false,
			widgetlist: [],
		}
	},
	methods:{
		init(){
			this.getWidget();
		},
		getWidget(){
			let url = '/tm/widget/widgetlist';
			this.load = true;
			this.$http.get(url).then((res)=>{
				this.load = false;
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
					return;
				}
				this.$hMessage.error(oTmp.msg);
			}).catch(err=>{
				this.load = false;
				this.$hMessage.error('获取插件列表失败，请稍后再试！');
			})
		}

	},
	mounted() {
		this.init();
	}
}
</script>
<style type="text/css" scoped>
.widget{
	padding-bottom: 20px;
}
.widget-btn{
	margin-bottom: 10px;
}
.widget_content{
	position: relative;
}
.widget_content .tab{
	width: 100%;
	border: 1px solid #DCE1E7;
}
.widget_content .tab td,.personal_content .tab th{
	border-left:1px solid #DCE1E7;
	padding: 5px 10px;
}
.widget_content .tab tr{
	border-bottom: 1px solid #DCE1E7;
}
.tab{
	width: 100%;
	border: 1px solid #DCE1E7;
}
.tab thead{
	background: #f0f3f5;
	font-size: 13px;	
}
.tab th{
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
</style>