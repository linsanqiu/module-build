<template>
	<div class="personal">
		<div class="personal_search">
			<div class="box">
				<span class="title">统计起始日期：</span>
				<h-date-picker v-model="start_date" @on-change="changeStartDate"  format="yyyy-MM-dd" type="date" placement="bottom-end" placeholder="统计起始日期"></h-date-picker>
			</div>
			<div class="box">
				<span class="title">统计截止日期：</span>
				<h-date-picker v-model="end_date" @on-change="changeEndDate" format="yyyy-MM-dd" type="date" placement="bottom-end" placeholder="统计截止日期"></h-date-picker>
			</div>
			<div class="box">
				<span class="title">处理人：</span>
				<h-select :label="handlerUserName" placeholder="处理人" v-model="form.handle_user_id" filterable remote  :remote-method="getHandleUserDict" 
					:loading="isReqHandleUser" width='200'>							
						<template v-for="(data,key) in aryHandleUserList">					
							<h-option :value="data.id" :key="data.id">{{data.realName}}({{data.userName}})</h-option>
						</template>									
					</h-select>
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
		<div class="personal_content">
			<div class="list">
				<table class="tab">
					<thead>
						<tr>
							<th rowspan="2" align="left">处理人</th>
							<th align="center" rowspan="2">确认添加</th>
							<th align="center" colspan="3">拒绝添加</th>
							<th align="center" rowspan="2">合计</th>
						</tr>
						<tr>
							<th>已存在</th>
							<th>同义标签</th>
							<th>其他原因</th>
						</tr>
					</thead>
					<tbody>
						<tr align="center" v-for="(item,k) in aryUserStatisticsList" :key="k">
							<td  align="left">{{ item.realName +'(' +item.userName +')' }}</td>
							<td>{{ item.confirmCount }}</td>
							<td>{{ item.refuseExistsCount }}</td>
							<td>{{ item.refuseSynonymousCount }}</td>
							<td>{{ item.refuseOtherCount }}</td>
							<td>{{ item.handleCount }}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="page-box">
				<h-page :total="total" :page-size="pagesize" :current="pagenum" @on-change="onPageChange" show-elevator show-total size="small"></h-page>
			</div>
			<Spin fix v-if="isSearch">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</Spin>
		</div>
	</div>
</template>
<script type="text/javascript">
import { yesterday_date } from '@/filters/index';
import utils from '@/utils'
export default {
	data () {
		return {
			handlerUserName:'',
			aryHandleUserList: [],
			isReqHandleUser: false,
			isSearch: false,
			source: '-1',
			start_date: '',
			end_date: '',
			form:{
				source: '-1',
				start_date: '',
				end_date: '',
				handle_user_id: ''
			},
			pagenum: 1,
			pagesize: 12,
			total: 0,
			aryUserStatisticsList: [],
			aryUserStatisticsHeader: [
				{
					title: '处理人',
					key: 'userName',
					width: 240,
					render: (h, params) => {
						return h('div',params.row.realName +'('+ params.row.userName +')');
					}
				},{
					title: '确认添加',
					key: 'confirmCount',
				},
				{
					title: '已存在',
					key: 'refuseExistsCount'
				},{
					title: '同义标签',
					key: 'refuseSynonymousCount'
				},{
					title: '其他原因',
					key: 'refuseOtherCount'
				},
				{
					title: '合计',
					key: 'handleCount'
				}
			],
		}
	},
	methods:{
		search(){
			if(this.source == '-1'){
				this.form.source = '';
			}else{
				this.form.source = this.source;
			}
			this.pagenum = 1;
			this.getUserStatistics();
		},
		changeStartDate(value){
			this.form.start_date = value;
		},
		changeEndDate(value){
			this.form.end_date = value;
		},
		getHandleUserDict(query, userData = false , cb = false){				
			let url = '/tm/user/fuzzysearch?keyword=' + encodeURIComponent(query);
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					this.aryHandleUserList = tmpObj.data;
					if(userData){
						this.form.handle_user_id =tmpObj.data[0].id; 
						this.handlerUserName = tmpObj.data[0].realName+'('+tmpObj.data[0].userName+')';
						if(cb){
							cb();
						}
					}
				}
			}).catch(err=>{
				if(cb){
					cb();
				}
			})
		},
		getUserStatistics(go = false){
			if(this.isSearch && !go)return;
			this.isSearch = true;
			let form = this.form;
			let url = '/tm/statistics/tag/handle/person/page?pagenum='+ this.pagenum +'&pagesize='+ this.pagesize + '&source='+ form.source +'&start_date='+ form.start_date +'&end_date=' +form.end_date +'&handle_user_id='+ form.handle_user_id;
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					let data = tmpObj.data;
					this.total = data.total ? data.total : 0;
					this.aryUserStatisticsList = data.list ? data.list : [];
					if(this.total && this.aryUserStatisticsList.length == 0){
						this.pagenum = Math.ceil(this.total/this.pagesize);
						this.getUserStatistics(true);
						return;
					}
				}else{
					this.$hMessage.error(tmpObj.msg);
				}
				this.isSearch = false;
			}).catch(err=>{
				this.isSearch = false;
				this.$hMessage.error("发生未知错误，获取数据失败");
			})
		},
		onPageChange(page){
			this.pagenum = page;
			this.getUserStatistics();
		}
	},
	mounted() {
		let yesterday = yesterday_date('-');
		this.start_date = yesterday.toString();
		this.end_date = yesterday.toString();
		this.form.start_date = yesterday.toString();
		this.form.end_date = yesterday.toString();
		this.getHandleUserDict('',true,()=>{
			this.getUserStatistics();
		});
		
	}
}
</script>
<style type="text/css" scoped>
.personal{
	padding-bottom: 10px;
}
.personal_search{
	line-height: 32px;
	margin-bottom: 10px;
}
.personal .box{
	display: inline-block;
	padding-bottom: 10px;
}
.personal_search .box:not(:last-child){
	margin-right: 10px;
}
.personal_search .h-date-picker{
	width: 180px;
}
.personal_search .h-select,.personal_search .h-select>>> .h-select-left{
	width: 180px!important;
}
.personal_content{
	position: relative;
}
.personal_content .tab{
	width: 100%;
	border: 1px solid #DCE1E7;
}
.personal_content .tab td,.personal_content .tab th{
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
</style>