<template>
	<div class="detailWrap">
		<h-spin fix v-if="pageLoading">
			<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
			<div>加载中...</div>
		</h-spin>
		<search-form>
			<ul slot="head">
			</ul>
			<ul slot="content">
				<li>
					<dl>
						<dt>移交人：</dt>
						<dd>
							<h-select disabled filterable clearable aria-placeholder="移交人" placeholder="请选择移交人"  v-model="handOver">
								<h-option v-for="item in baseList" :value="item.userName" :key="item.userId">{{ item.userName }}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>承接人：</dt>
						<dd>
							<h-select disabled filterable clearable aria-placeholder="承接人" placeholder="请选择承接人"  v-model="carryOn">
								<h-option v-for="item in baseList" :value="item.userName" :key="item.userId">{{ item.userName }}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="row0"></li>
				<li class="row2">
					<dl>
						<dt>时间范围：</dt>
						<dd>
							<ul class="flex">
								<li class="flex1">
									<h-date-picker :options="optionsDate" disabledDate="disabledDateFn" @on-change="handleChangeStart" :value="startTime" format="yyyy-MM-dd HH:mm:ss" type="datetime" placement="bottom-end" placeholder="选择起始时间"></h-date-picker>
								</li>
								<li class="to">-</li>
								<li class="flex1">
									<h-date-picker :options="optionsDate" @on-change="handleChangeEnd" :value="endTime" format="yyyy-MM-dd HH:mm:ss" type="datetime" placement="bottom-end" placeholder="选择结束时间"></h-date-picker>
								</li>
							</ul>
						</dd>
					</dl>
				</li>
			</ul>
		</search-form>
		<div class="tab-box">			
			<h-table border :columns="columns1" :data="modifyList" @on-selection-change="selectChange"></h-table>
		</div>
		<div class="button-box">
			<h-button type="primary" @click="modifyTask">调配任务</h-button>
		</div>
	</div>
</template>

<script>
import store from '@/store';
export default {
	name: 'AuditTaskDetail',
	data(){
		return{
			optionsDate:{
				disabledDate (date) {
					return date && date.valueOf() < Date.now() - 86400000;
				}
			},
			type:0,//0： 详情页  1：新增页 2：修改页
			total:0,
			currentPage:1,
			pageSize:10,
			pageLoading:false,
			checkFlag:false,
			taskId:'',
			handOver:'',
			carryOn:'',
			startTime:'',
			endTime:'',
			selectArr:[],
			isSubmit:false,
			columns1: [
				{
					type: 'selection',
					width: 60,
					align: 'center'
				},
				{
					title: '业务类型',
					key: 'desc'
				},
				{
					title: '已分配数量',
					key: 'num'
				}
			],
			columns2: [
				{
					title: '业务类型',
					key: 'desc'
				},
				{
					title: '已分配数量',
					key: 'num'
				}
			],
			data1: [],
			addList:[],
			detailList:[],
			modifyList:[],
			baseList:[]
		}
	},
	methods:{
		disabledDateFn(date){
			 console.log(date)
		},
		changePage(current){
			this.currentPage = current;
		},
		selectChange(selection) {
			this.checkFlag = true;
			let arr =[];
			for(let i= 0,len = selection.length; i<len;i++){
			  arr.push(selection[i].type);
			};
			this.selectArr = arr;
		},
		handleChangeStart(date){
			this.startTime = date;
		},
		handleChangeEnd(date){
			this.endTime = date;
		},
		getBaseUserList(keyword){
			this.pageLoading = true;
			let url = '/tm/baseUserList?keyword='+ encodeURIComponent(keyword);
			this.$http.get(url).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){
					let resultArr = data.body.result ? data.body.result : [];
					this.baseList = [...resultArr];
				}else{
					this.$hMessage.error(data.message);
				}
				this.pageLoading = false;
			})
			.catch(err=>{
				this.$hLoading.error();
				this.pageLoading = false;
			})
		},
		getDetailInfo(taskId){	
			this.pageLoading = true
			let url = '/tm/getTaskInfoById?taskId='+ taskId;
			this.$http.get(url).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){
					let obj = data.body ? data.body : {};
					let list = obj.list ? obj.list : [];
					this.handOver = obj.transferUserName;
					this.carryOn = obj.undertakeUserName;
					this.startTime = obj.startTime;
					this.endTime = obj.endTime;
					for(let i=0,len = list.length;i<len;i++){
						if(list[i].flag){
							list[i]._checked = true
						}
					}
					this.modifyList = [...list];				
					
				}else{
					this.$hMessage.error(data.msg)
				}
				this.pageLoading = false;
			})
			.catch(err=>{
				this.pageLoading = false;
				this.$hLoading.error()
			})
		},
		modifyTask(){
			this.pageLoading = true;
			let url = '/tm/modifyTransferTask';
			if(!this.checkFlag){
				let arr =[];
				for(let i= 0,len = this.modifyList.length; i<len;i++){
				  if(this.modifyList[i]._checked){
					arr.push(this.modifyList[i].type);
				  }		       	  
				};
				this.selectArr = arr;
			}            
			if(this.selectArr.length ==0){
				this.$hMessage.error({content: '至少选择一种资讯类型',duration: 3});
				this.pageLoading = false;
				return
			}         
			this.$http.post(url,{
				startTime: this.startTime,
				endTime: this.endTime,
				taskId:this.taskId,
				transferType:this.selectArr
			}).then((res) => {
				let data = res.data ? res.data : {};
				if(data.status == this.$api.SUCCESS){
					this.$router.push('/audit/task/list');                    	                    
				}else{		                	
					this.$hMessage.error({
						content: data.msg,
						duration: 3
					})
				}
				this.pageLoading = false;
			}).catch(err=>{
				this.pageLoading = false;
			}) 
		},
		saveTask(){
			this.pageLoading = true;
			let url = '/tm/addTransferTask';
			let carryName = '';
			let transferUserName = '';
			for(let i=0;i<this.baseList.length;i++){
				if(this.baseList[i].userId == this.handOver){
					transferUserName = this.baseList[i].userName;
				}else if(this.baseList[i].userId == this.carryOn){
					carryName = this.baseList[i].userName
				}
			}
			if(this.selectArr.length ==0){
				this.$hMessage.error({content: '至少选择一种资讯类型',duration: 3});
				this.pageLoading = false;
				return
			}
			this.$http.put(url,{
				startTime: this.startTime,
				endTime: this.endTime,
				transferType:this.selectArr,
				transferUserId:this.handOver,
				transferUserName:transferUserName,
				undertakeUserId:this.carryOn,
				undertakeUserName:carryName
			}).then((res) => {
				let data = res.data ? res.data : {};
				if(data.status == this.$api.SUCCESS){
					this.$router.push('/audit/task/list');                    	                    
				}else{		                	
					this.$hMessage.error({
						content: data.msg,
						duration: 5
					})
				}
				this.pageLoading = false;
			}).catch(err=>{
				this.pageLoading = false;
			}) 
		},
		loadPageData(){   
			let pathName = '编辑任务移交';
			this.getDetailInfo(this.taskId);
			store.commit('SAVE_TAB_NAME',{  path: '/audit/task/edit', name: pathName});
			this.getBaseUserList('');    	
		}
	},   
	watch: {		
	　　'$route'(to, from) {
		this.taskId = to.query.taskId ? to.query.taskId : '';
		 if(this.taskId){
			this.loadPageData();
		 }	　　　　
	　　}
	},
	mounted(){
		this.taskId = this.$route.query.taskId ? this.$route.query.taskId : '';
		if(this.taskId){
			this.loadPageData();
		}    	
	}
}
</script>

<style scoped>
.detailWrap{
	position: relative;
}
.select-box-wrap{
	margin:10px 0;
}
.select-box{
	display: inline-block;
	margin-right: 15px;
}
.button-box{
	text-align: center;
	margin-top:10px;
}
</style>