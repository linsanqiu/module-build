<template>
	<div class="basic">
		<h3>横坐标轴</h3>
		<h-form :model="xAxis" ref="xAxis" label-position="right" :label-width="100" @submit.native.prevent :rules="modulesXRule">
			<h-form-item label="数据列：" prop="dataColumnId">
				<Select v-model="xAxis.dataColumnId" filterable >
					<Option v-for="(item,key) in columnList" :value="item.dataColumnId" :key="item.dataColumnId">{{ item.dataColumnName }}</Option>
				</Select>
			</h-form-item>
			<h-form-item label="标题：" prop="title">
				<Input v-model="xAxis.title"></Input>
			</h-form-item>
			<h-form-item label="展示标题：" prop="showTitle">
				<h-switch v-model="xAxis.showTitle" size="large">
					<div slot="open">
						<span>显示</span>
					</div>
					<div slot="close">
						<span>隐藏</span>
					</div>
				</h-switch>
			</h-form-item>
			<h-form-item label="时间轴：" prop="dateTimeLabel">
				<h-switch v-model="xAxis.dateTimeLabel" size="large">
					<div slot="open">
						<span>是</span>
					</div>
					<div slot="close">
						<span>否</span>
					</div>
				</h-switch>
			</h-form-item>
		</h-form>
		<h3>纵坐标轴<span class="add" @click="add">+</span></h3>
		<div class="yAxis">
			<div class="left">
				<ul>
					<li v-for="(item, i) in yaxisList" :class="yAxisIndex == i ? 'active' : ''">
						<span @click="toggle(i)">标轴{{ i+1 }}</span>
						<i @click="del(i)" title="移除" class="icon-t-b-delete iconfont"></i>
					</li>
				</ul>
			</div>
			<div class="right">
				<h-form :model="yAxis" ref="yAxis" label-position="right" :label-width="100" @submit.native.prevent :rules="modulesYRule">
					<h-form-item label="数据列：" prop="dataColumnIdList">
						<Select v-model="yAxis.dataColumnIdList" filterable multiple @on-change="changeYaxis">
							<Option v-for="(item,key) in columnList" :value="item.dataColumnId" :key="item.dataColumnId">{{ item.dataColumnName }}</Option>
						</Select>
					</h-form-item>
					<h-form-item label="标题：" prop="title">
						<Input v-model="yAxis.title" @on-change="changeYaxis"></Input>
					</h-form-item>
					<h-form-item label="展示标题：" prop="showTitle">
						<h-switch v-model="yAxis.showTitle" size="large" @on-change="changeYaxis">
							<div slot="open">
								<span>显示</span>
							</div>
							<div slot="close">
								<span>隐藏</span>
							</div>
						</h-switch>
					</h-form-item>
				</h-form>
			</div>
		</div>
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
			xAxis: {
				dataColumnId: '',
				dateTimeLabel: false,
				showTitle: false,
				title: '',
			},
			yAxis:{
				dataColumnIdList: [],
				showTitle: false,
				title: '',
			},
			yaxisList: this.data.yaxisList || [],
			columnList: this.data.dataColumnList || [],
			modulesXRule:{
				dataColumnId: [
					{ required:true, message: '请选择', trigger:'change'},
				]
			},
			modulesYRule:{
				dataColumnIdList: [
					{ required:true, type: 'array', min: 1, message: '请选择', trigger:'change'},
				]
			},
			yAxisIndex: 0,
		}
	},
	methods: {
		newYAxisData (){
			return {
				dataColumnIdList: [],
				showTitle: false,
				title: '',
			}
		},
		add(){
			this.$refs['yAxis'].validate((valid) => {
				if(valid){
					let data = this.newYAxisData();
					this.yaxisList.push(copyDeep(data));
					this.yAxis = copyDeep(data);
					this.yAxisIndex = this.yaxisList.length - 1;
					this.$refs.yAxis.resetFields();
				}
			})
		},
		changeYaxis(){
			let index = this.yAxisIndex;
			this.yaxisList[index] = copyDeep(this.yAxis);
		},
		toggle(i, constraint = false,){
			if(this.yAxisIndex == i && !constraint)return;
			if(constraint){
				this.yAxisIndex = i;
				this.yAxis = copyDeep(this.yaxisList[i]);
			}else{
				this.$refs['yAxis'].validate((valid) => {
					if(valid){
						this.yAxisIndex = i;
						this.yAxis = copyDeep(this.yaxisList[i]);
					}
				})
			}
		},
		del(i){
			let index = this.yAxisIndex;
			this.yaxisList.splice(i,1);
			let len = this.yaxisList.length;
			if(len == 0){
				let obj = {
					dataColumnIdList: [],
					showTitle: false,
					title: '',
				}
				this.yaxisList.push(obj);
				this.$refs.yAxis.resetFields();
				this.yAxis = copyDeep(obj);
			}else{
				let constraint = true;
				if(constraint && index < len){
					this.$refs.yAxis.resetFields();
					this.toggle(index, constraint);
				}else if(index > len - 1){
					this.$refs.yAxis.resetFields();
					this.toggle(len - 1, constraint);
				}
			}
		},
		getData(){
			return {
				height: this.data.height,
				width: this.data.width,
				chartType: this.data.chartType,
				dataTemplateId: this.data.dataTemplateId,
				dataTemplateCode: this.data.dataTemplateCode,
				chartTitle: this.data.chartTitle,
				dataColumnIdList: this.data.dataColumnIdList,
				xaxis: this.xAxis,
				yaxisList: this.yaxisList,
				dataColumnList: this.data.dataColumnList,
			}
		},
		verify(){
			let _this = this;
			let pro = new Promise(function(resolve, reject) {
				_this.$refs['xAxis'].validate((valid) => {
					if(valid){
						_this.$refs['yAxis'].validate((valids) => {
							if(valids){
								let data = _this.getData();
								resolve(data)
							}else{
								reject(false)
							}
						})
					}else{
						reject(false)
					}
				})
			})
			return pro;
		},
	},
	mounted() {
		if(this.data.xaxis){
			this.xAxis = this.data.xaxis;
		};
		if(this.yaxisList.length == 0){
			this.yaxisList.push(this.newYAxisData());
		}else{
			this.yAxis = copyDeep(this.yaxisList[0]);
		}
		this.yAxisIndex = 0;
		this.$refs.yAxis.resetFields();
		this.$refs.xAxis.resetFields();
	}
}
</script>
<style type="text/css" scoped>
h3{
	line-height: 24px;
	font-weight: 600;
}
.yAxis{
	width: 100%;
	display: flex;
	border: 1px solid #dfdfdf;
	margin-top: 5px;
}
.yAxis .left{
	width: 120px;
	border-right: 1px solid #dfdfdf;
	position: relative;
}
.yAxis .left .active,.yAxis .left li:hover{
	color: #298dff;
}
.yAxis .left ul{
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	overflow-y: auto;
	overflow-x: hidden;
}
.yAxis .left ul li{
	padding: 0 5px;
	line-height: 24px;
	background: #f0f8ff;
	border-bottom: 1px solid #dfdfdf;
}
.yAxis .left ul li span{
	cursor: pointer;
	vertical-align: top;
}
.yAxis .left ul li i{
	font-size: 12px;
    color: #f5222d;
    cursor: pointer;
    display: none;
    height: 24px;
}
.yAxis .left ul li.active i,.yAxis .left ul li:hover i{
	display: inline-block;
}
.yAxis .left ul li:nth-child(odd){
	background: #fff;
}
.yAxis .right{
	padding: 5px;
	width: calc(100% - 120px);
}
.add{
	margin-left: 5px;
	border-radius: 50%;
	display: inline-block;
	width: 14px;
	height: 14px;
	line-height: 14px;
	text-align: center;
	color: #fff;
	background: #298DFF;
	cursor: pointer;
}
</style>