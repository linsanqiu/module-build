<template>
	<div class="basic">
		<h-form :model="form" ref="form" label-position="right" :label-width="100" @submit.native.prevent :rules="modulesRule">
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
			<h-form-item label="图例列：" prop="lengendColumnId">
				<Select v-model="form.lengendColumnId" filterable >
					<Option v-for="(item,key) in columnList" :value="item.id" :key="item.id">{{ item.name }}</Option>
				</Select>
			</h-form-item>
			<h-form-item label="数据列：" prop="dataColumnId">
				<Select v-model="form.dataColumnId" filterable >
					<Option v-for="(item,key) in columnList" :value="item.id" :key="item.id">{{ item.name }}</Option>
				</Select>
			</h-form-item>
		</h-form>
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
			form:{
				width: this.data.width  || 600,
				height: this.data.height || 400,
				title: this.data.chartTitle && this.data.chartTitle.text || '',
				dataTemplateId: this.data.dataTemplateId || '',
				dataTemplateCode: this.data.dataTemplateCode || '',
				dataColumnId: this.data.pieChartData && this.data.pieChartData.dataColumnId ? this.data.pieChartData.dataColumnId : '',
				lengendColumnId: this.data.pieChartData && this.data.pieChartData.lengendColumnId ? this.data.pieChartData.lengendColumnId : '',
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
				dataColumnId: [
					{ required:true, message: '请选择', trigger:'change'},
				],
				lengendColumnId: [
					{ required:true, message: '请选择', trigger:'change'},
				],
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
			this.form.dataColumnId = '';
			this.form.lengendColumnId = '';
		},
		getData(){
			return {
				height: this.form.height,
				width: this.form.width,
				chartType: 'pie',
				dataTemplateId: this.form.dataTemplateId,
				dataTemplateCode: this.form.dataTemplateCode,
				chartTitle: {
					text: this.form.title,
				},
				pieChartData: {
					dataColumnId: this.form.dataColumnId,
					lengendColumnId: this.form.lengendColumnId,
				}
			}
		},
		verify(){
			let _this = this;
			let pro = new Promise(function(resolve, reject) {
				_this.$refs['form'].validate((valid) => {
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

</style>