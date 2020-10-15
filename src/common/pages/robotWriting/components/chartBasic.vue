<template>
	<div class="basic">
		<h-form :model="form" ref="forms" label-position="right" :label-width="100" @submit.native.prevent :rules="modulesRule">
			<h-form-item label="长度：" prop="fieldName">
				<Slider v-model="form.width" :min="400" :max="1200" :step="100" show-stops show-tip="always"></Slider>
			</h-form-item>
			<h-form-item label="高度：" >
				<Slider v-model="form.height" :min="200" :max="600" :step="50" show-stops show-tip="always"></Slider>
			</h-form-item>
			<h-form-item label="图表标题：" prop="title">
				<Input v-model="form.title" placeholder="请输入"></Input>
			</h-form-item>
			<h-form-item label="数据模板：" prop="dataTemplateId">
				<Select v-model="form.dataTemplateId" @on-change="onChangeId" filterable>
					<Option v-for="(item,key) in dataSelect" :value="item.id" :key="item.id">{{ item.name }}</Option>
				</Select>
			</h-form-item>
			<h-form-item label="数据列：" prop="dataColumnIdList">
				<Select v-model="form.dataColumnIdList" filterable multiple >
					<Option v-for="(item,key) in columnList" :value="item.id" :key="item.id">{{ item.name }}</Option>
				</Select>
			</h-form-item>
		</h-form>
	</div>
</template>
<script>
import { copyDeep } from '@/filters/index'
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
			form:{
				width: this.data.width  || 1000,
				height: this.data.height || 600,
				title: this.data.chartTitle && this.data.chartTitle.text || '',
				dataTemplateId: this.data.dataTemplateId || '',
				dataTemplateCode: this.data.dataTemplateCode || '',
				dataColumnIdList:  this.data.dataColumnIdList || [],
			},
			dataSelect: this.data.dataSelect || {},
			columnList: [],
			modulesRule:{
				title: [
					{ required:true, message: '请输入', trigger:'blur'},
				],
				dataTemplateId: [
					{ required:true, message: '请选择', trigger:'change'},
				],
				dataColumnIdList: [
					{ required:true, type: 'array', min: 1,message: '请选择', trigger:'change'},
				]
			}
		}
	},
	methods: {
		onChangeId(){
			if(this.form.dataTemplateId){
				this.columnList = this.dataSelect[this.form.dataTemplateId].children;
				this.form.dataTemplateCode = this.dataSelect[this.form.dataTemplateId].code;
			}else{
				this.columnList = [];
			}
			this.form.dataColumnList = [];
		},
		getData(){
			let ids = this.form.dataColumnIdList;
			let columnList = this.columnList;
			let newColumnList = [];
			let dataColumnList = [];
			let dataColumnListIds = [];
			let dataColumn = this.data.dataColumnList || [];
			/**/
			for(let i = 0,len = dataColumn.length; i < len; i++){
				if(ids.indexOf(dataColumn[i].dataColumnId) != -1){
					dataColumnList.push(dataColumn[i]);
					dataColumnListIds.push(dataColumn[i].dataColumnId);
				}
			}
			for(let i = 0,len = columnList.length; i < len; i++){
				if(ids.indexOf(columnList[i].id) != -1 && dataColumnListIds.indexOf(columnList[i].id) == -1){
					dataColumnList.push({
						chartType: '',
						dataColumnId: columnList[i].id,
						dataColumnName: columnList[i].name,
					})
				}
			}
			let xaxis = null;
			if(this.data.xaxis){
				xaxis = copyDeep(this.data.xaxis);
				if(ids.indexOf(xaxis.dataColumnId) == -1){
					xaxis.dataColumnId = '';
				}
			}
			let yaxisList = null;
			if(this.data.yaxisList){
				let data = copyDeep(this.data.yaxisList);
				let len = data.length - 1;
				for(let i = len; i >= 0; i--){
					for(let k = data[i].dataColumnIdList.length - 1; k >= 0; k--){
						if(ids.indexOf(data[i].dataColumnIdList[k]) == -1){
							data[i].dataColumnIdList.splice(k,1);
						}
					}
					if(data[i].dataColumnIdList.length == 0){
						data.splice(i,1);
					}
				}
				yaxisList = data;
			}

			return {
				height: this.form.height,
				width: this.form.width,
				chartType: this.data.chartType,
				dataTemplateId: this.form.dataTemplateId,
				dataTemplateCode: this.form.dataTemplateCode,
				chartTitle: {
					text: this.form.title,
				},
				dataColumnIdList: ids,
				dataColumnList: dataColumnList,
				yaxisList: yaxisList,
				xaxis: xaxis,
			}
		},
		verify(){
			let _this = this;
			let pro = new Promise(function(resolve, reject) {
				_this.$refs['forms'].validate((valid) => {
					if(valid){
						let data = _this.getData();
						resolve(data)
					}else{
						reject(false)
					}
				})
			})
			return pro;
		},
	},
	mounted() {
		if(this.form.dataTemplateId){
			this.columnList = this.dataSelect[this.form.dataTemplateId].children;
		}
	}
}
</script>
<style type="text/css" scoped>
.basic{}
</style>