<template>
	<div class="total">
		<div class="total_search">
			<div class="box">
				<span class="title">统计起始日期：</span>
				<h-date-picker v-model="start_date" @on-change="changeStartDate"  format="yyyy-MM-dd" type="date" placement="bottom-end" placeholder="统计起始日期"></h-date-picker>
			</div>
			<div class="box">
				<span class="title">统计截止日期：</span>
				<h-date-picker v-model="end_date" @on-change="changeEndDate" format="yyyy-MM-dd" type="date" placement="bottom-end" placeholder="统计截止日期"></h-date-picker>
			</div>
			<div class="box">
				<span class="title">申请类型：</span>
				<h-select v-model="source" :clearable="false">
					<h-option value="-1" >不限</h-option>
					<h-option value="1" >用户申请</h-option>
					<h-option value="2" >稽核申请</h-option>
				</h-select>
			</div>
			<div class="box">
				<h-button type="primary" @click="search">查询</h-button>
			</div>
		</div>
		<div class="total_content">
			<table class="tab">
				<thead>
					<tr>
						<th width="120" rowspan="3"></th>
						<th width="200" align="center" rowspan="3">新增申请</th>
						<th align="center" colspan="4">已处理申请</th>
					</tr>
					<tr>
						<th rowspan="2">确认添加</th>
						<th colspan="3">拒绝添加</th>
					</tr>
					<tr>
						<th>标签已存在</th>
						<th>同义标签</th>
						<th>其他原因</th>
					</tr>
				</thead>
				<tbody>
					<tr align="center" v-for="(item,k) in tabList" :key="k">
						<td align="left">{{ item.label }}</td>
						<td>{{ totalData.new_add_tag ? totalData.new_add_tag[item.name] : '--' }}</td>
						<td>{{ handle_tag[item.name] ? handle_tag[item.name].confirmCount : '--' }}</td>
						<td>{{ handle_tag[item.name] ? handle_tag[item.name].refuseExistsCount : '--' }}</td>
						<td>{{ handle_tag[item.name] ? handle_tag[item.name].refuseSynonymousCount : '--' }}</td>
						<td>{{ handle_tag[item.name] ? handle_tag[item.name].refuseOtherCount : '--' }}</td>
					</tr>
				</tbody>
			</table>
			<Spin fix v-if="isSearch">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</Spin>
		</div>
	</div>
</template>
<script type="text/javascript">
import { yesterday_date } from '@/filters/index';
export default {
	data () {
		return {
			isSearch: false,
			source: '-1',
			start_date: '',
			end_date: '',
			form:{
				source: '-1',
				start_date: '',
				end_date: '',
			},
			totalData: {},
			handle_tag: {},
			tabList: [
				{
					label: '行业类申请',
					name: 'industry'
				},{
					label: '机构类申请',
					name: 'corp'
				},{
					label: '产品类申请',
					name: 'product'
				},{
					label: '品牌类申请',
					name: 'brand'
				},{
					label: '人物类申请',
					name: 'figure'
				},
				{
					label: '合计',
					name: 'total'
				}
			]
		}
	},
	methods:{
		search(){
			if(this.source == '-1'){
				this.form.source = '';
			}else{
				this.form.source = this.source;
			}
			this.getTotalData();
		},
		changeStartDate(value){
			this.form.start_date = value;
		},
		changeEndDate(value){
			this.form.end_date = value;
		},
		getTotalData(){
			let form = this.form;
			let url = '/tm/statistics/tag/handle/result?source='+form.source + '&start_date='+form.start_date +'&end_date=' + form.end_date;
			if(this.isSearch)return;
			this.isSearch = true;
			this.$http.get(url).then((res)=>{
				this.isSearch = false;
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					let data = tmpObj.data;
					this.totalData.new_add_tag = data.new_add_tag ? data.new_add_tag : {};
					this.handle_tag = data.handle_tag ? data.handle_tag : {};
				}else{
					this.$hMessage.error(tmpObj.msg);
				}
			}).catch(err=>{
				this.isSearch = false;
				this.$hMessage.error("发生未知错误，获取数据失败");
			})
		}
	},
	mounted() {
		let yesterday = yesterday_date('-');
		this.start_date = yesterday.toString();
		this.end_date = yesterday.toString();
		this.form.start_date = yesterday.toString();
		this.form.end_date = yesterday.toString();
		this.getTotalData();
	}
}
</script>
<style type="text/css" scoped>
.total{
	padding-bottom: 10px;
}
.total .box{
	display: inline-block;
	padding-bottom: 10px;
}
.total_search .box:not(:last-child){
	margin-right: 10px;
}
.total_search{
	line-height: 32px;
	margin-bottom: 10px;
}
.total_search .h-date-picker{
	width: 180px;
}
.total_search .h-select{
	width: 180px!important;
}
.total_content{
	position: relative;
}
.total_content .tab{
	width: 100%;
	border: 1px solid #DCE1E7;
}
.total_content .tab thead{
	background: #f0f3f5;
	font-size: 13px;	
}
.total_content .tab td,.total_content .tab th{
	border: 1px solid #DCE1E7;
	padding: 5px 10px;
}
.total_content .tab thead tr{
	height: 35px;
}
.total_content .tab tr{
	height: 32px;
}
.total_content .tab tbody tr:nth-child(even){
	background: #fafafa;
}
.total_content .tab tbody tr:hover{
	background: #eaf5ff;
}
</style>