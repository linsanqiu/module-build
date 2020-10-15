<template>
	<div class="detailWrap">
		<h-spin fix v-if="pageLoading">
			<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
			<div>加载中...</div>
		</h-spin>
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>移交人：</dt>
						<dd>
							<h-select filterable clearable aria-placeholder="移交人" placeholder="请选择移交人"  v-model="handOver">
								<h-option v-for="item in baseList" :value="item.userId" :key="item.userId">{{ item.userName }}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>承接人：</dt>
						<dd>
							<h-select filterable clearable aria-placeholder="承接人" placeholder="请选择承接人"  v-model="carryOn">
								<h-option v-for="item in baseList" :value="item.userId" :key="item.userId">{{ item.userName }}</h-option>
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
									<h-date-picker @on-change="handleChangeStart" :value="startTime" format="yyyy-MM-dd HH:mm:ss" type="datetime" placement="bottom-end" placeholder="选择起始时间"></h-date-picker>
								</li>
								<li class="to"> - </li>
								<li class="flex1">
									<h-date-picker @on-change="handleChangeEnd" :value="endTime" format="yyyy-MM-dd HH:mm:ss" type="datetime" placement="bottom-end" placeholder="选择结束时间"></h-date-picker>
								</li>
							</ul>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="addTaskList">确定</h-button>
				</li>
			</ul>
		</search-form>
		<div class="tab-box">
			<h-table border :columns="columns1" :data="addList" @on-selection-change="selectChange"></h-table>
		</div>
		<div class="button-box">
			<h-button type="primary" @click="saveTask">调配任务</h-button>
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
			pageLoading:false,
			checkFlag:false,
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
			addList:[],
			baseList:[]
		}
	},
	methods:{
		disabledDateFn(date){
			 console.log(date)
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
					this.$hMessage.error(data.msg);
				}
				this.pageLoading = false;
			})
			.catch(err=>{
				this.$hLoading.error();
				this.pageLoading = false;
			})
		},
		addTaskList(){
			if(!this.handOver){
				this.$hMessage.error({content: '请选择移交人',duration: 3})
				return
			}else if(!this.startTime){
				this.$hMessage.error({content: '请选择起始时间',duration: 3})
				return
			}else if(!this.endTime){
				this.$hMessage.error({content: '请选择结束时间',duration: 3})
				return
			}			
			let url = '/tm/getTranskerNewsInfo?transferUserId='+ this.handOver +'&startTime='+this.startTime +'&endTime='+this.endTime;
			this.$http.get(url).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){
					this.addList = data.body.result ? data.body.result : [];
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
			console.log('add')
			this.handOver = '';
			this.carryOn = '';
			this.startTime = '';
			this.endTime = '';
			this.selectArr =[];
			this.addList = [];
			let pathName = '新增任务移交';
			store.commit('SAVE_TAB_NAME',{  path: '/audit/task/add', name: pathName});
			this.getBaseUserList('');   	
		}
	},
	watch: {		
	　　'$route'(to, from) {
		this.loadPageData();		　　　　
	　　}
	},
	mounted(){
		this.loadPageData();    	
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