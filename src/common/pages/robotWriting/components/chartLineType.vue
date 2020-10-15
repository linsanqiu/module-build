<template>
	<div>
		<table>
			<thead>
				<tr>
					<th>参数</th>
					<th>图表类型</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(item, k) in columnList" v-if="dataColumnIds.indexOf(item.dataColumnId) != -1">
					<td>{{ item.dataColumnName }}</td>
					<td>
						<Select v-model="item.chartType" filterable :clearable="false">
							<Option v-for="(item,key) in type" :value="item.id" :key="item.id">{{ item.name }}</Option>
						</Select>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<script>
export default {
	props:{
		data: {
			type: Object,
			default: function () {
				return {};
			},
		},
	},
	data() {
		return {
			xAxis: this.data.xaxis,
			columnList: [],
			dataColumnIds: [],
			type:[
				{
					id: 'column',
					name: '柱状图',
				},
				{
					id: 'line',
					name: '折线图',
				}
			]
		}
	},
	methods: {
		getData(){
			return {
				height: this.data.height,
				width: this.data.width,
				chartType: this.data.chartType,
				dataTemplateId: this.data.dataTemplateId,
				dataTemplateCode: this.data.dataTemplateCode,
				chartTitle: this.data.chartTitle,
				dataColumnIdList: this.data.dataColumnIdList,
				xaxis: this.data.xaxis,
				yaxisList: this.data.yaxisList,
				dataColumnList: this.columnList,
			}
		},
		verify(){
			let _this = this;
			let pro = new Promise(function(resolve, reject) {
				let data = _this.getData();
				resolve(data)
				/*_this.$refs['forms'].validate((valid) => {
					if(valid){
						let data = _this.getData();
						resolve(data)
					}else{
						reject(false)
					}
				})*/
			})
			return pro;
		},
	},
	mounted() {
		let column = this.data.dataColumnList;
		for(let i = 0, len = column.length; i < len; i++){
			if(!column[i].chartType){
				column[i].chartType = 'column';
			}
		}
		this.columnList = column;
		let arr = [];
		let yAxis = this.data.yaxisList;
		for(let i = 0, len = yAxis.length; i < len; i++){
			let list =yAxis[i].dataColumnIdList;
			for(let k = 0,lens = list.length; k < lens; k++){
				if(arr.indexOf(list[k]) == -1){
					arr.push(list[k])
				}
			}
		}
		this.dataColumnIds = arr;
	}
}
</script>
<style type="text/css" scoped>
table{
	width: 100%;
	border-collapse: collapse;
}
table tr{
	height: 42px;
}
table th{
	background-color: rgb(240, 243, 245);
}
table th,table td{
	border: 1px solid #dfdfdf;
	padding: 0 10px;
}
</style>