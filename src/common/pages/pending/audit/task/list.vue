<template>
	<div class="task-list-wrap">
		<h-spin fix v-if="loading">
			<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
			<div>加载中...</div>
		</h-spin>
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>移交人：</dt>
						<dd>
							<h-select filterable clearable placeholder="请选择移交人" v-model="handOverId">
								<h-option v-for="item in baseList"  :value="item.userId" :key="item.userId">{{item.userName}}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>承接人：</dt>
						<dd>
							<h-select filterable clearable placeholder="请选择承接人"  v-model="carryOnId">
								<h-option v-for="item in baseList" :value="item.userId" :key="item.userId">{{item.userName}}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="row0"></li>
				<li class="row2">
					<dl>
						<dt>任务时间：</dt>
						<dd>
							<ul class="flex">
								<li class="flex1">
									<h-date-picker @on-change="handleChangeStart" :value="startTime" format="yyyy-MM-dd HH:mm:ss" type="datetime" placement="bottom-end" placeholder="起始时间" ></h-date-picker>
								</li>
								<li class="to">-</li>
								<li class="flex1">
									<h-date-picker @on-change="handleChangeEnd"  :value="endTime" format="yyyy-MM-dd HH:mm:ss" type="datetime" placement="bottom-end" placeholder="结束时间"></h-date-picker>
								</li>
							</ul>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>状态：</dt>
						<dd>
							<h-select v-model="state" >
								<h-option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>任务ID：</dt>
						<dd>
							<h-input v-model="taskId" placeholder="任务ID" icon="android-close"  @on-enter="queryTaskList" @on-click="clearTaskId"></h-input>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="queryTaskList">查询</h-button>
					<h-button type="primary" @click="addTask">新增任务</h-button>
				</li>
			</ul>
		</search-form>
		<div class="tab-box">
			<h-table class="full-max-height-table" :maxHeight="maxTableHeight" size="small" border :columns="columns" :data="taskList"></h-table>
			<h-page size="small" class="page-box" :total="total" :current="currentPage" :page-size="pageSize" @on-change="changePage" show-elevator show-total></h-page>
		</div>
	 </div>
	</div>
</template>

<script>
export default {
	data () {
		return {
			total:0,
			currentPage:1,
			pageSize:12,
			loading:false,        
			handOverId: '',
			carryOnId:'',
			state:'', 
			startTime:'',
			endTime:'',
			taskId:'',
			baseList: [],
			stateList:[{
				value:'0',
				label:'结束'
			},{
				value:'1',
				label:'运行中'
			}],
			columns: [
					{
						title: '任务ID',
						key: 'taskId',
						width:170,
						fixed: 'left'
					},
					{
						title: '移交人',
						key: 'transferUserName',
					},
					{
						title: '承接人',
						key: 'undertakeUserName'
					},
					{
						title: '移交类型',
						key: 'transferTypeDesc',
						width:170
					},
					 {
						title: '创建人',
						key: 'createUserName',
						width:100
					},
					{
						title: '创建时间',
						key: 'createTime',
						width:150
					},
					{
						title: '起始时间',
						key: 'startTime',
						width:150
					},
					{
						title: '结束时间',
						key: 'endTime',
						width:150
					},{
						title: '修改人',
						key: 'updateUserName',
						width:100
					},
					{
						title: '修改时间',
						key: 'updateTime',
						width:150
					},
					{
						title: '状态',
						key: 'statusDesc'
					},
					{
						title: '操作',
						key: 'action',
						width:150,
						fixed: 'right',
						align: 'center',
						render: (h, params) => {
							let status = params.row.status;
							return h('div', [
								h('span', {
									 class: {
										'iconfont': true,
										'icon-view': true,
										'tab-icon-btn': true,
									},
									attrs:{
										title: '查看'
									},
									on: {
										click: () => {
											this.$router.push('/audit/task/detail?taskId=' + params.row.taskId);
										}
									}
								}),
								 h('span', {
									class: {
										'iconfont': true,
										'icon-t-b-message':true,
										'tab-icon-btn': true,
									},
									attrs:{
										title: '修改'
									},
									on: {
										click: () => {
											this.$router.push('/audit/task/edit?taskId=' + params.row.taskId);
										}
									}
								}),
								h('span', {
									class: {
										'iconfont': true,
										'icon-ios-pause':  params.row.status ==1 ? true : false,
										'icon-play_fill':  params.row.status ==0 ? true : false,			                    
										'tab-icon-btn': true
									},
									style:{
										color:params.row.status ==0 ? '#390' : 'red'
									},
									attrs:{
										title: params.row.status ==1 ? '结束任务':'启动任务'
									},
									on: {
										click: () => {
											let statusLabel = params.row.status == 1 ? '结束任务' : '启动任务'
											this.$hMsgBox.confirm({
												title:statusLabel,
												content:'是否要'+ statusLabel +'?',
												onOk:()=>{
													 this.toggleTaskState(params.row.taskId, params.row.status,params.index); 
												},
												onCancel:()=>{
													 
												},
											})	
										}
									}
								})
							]);
						}
					}
			],
			taskList:[]
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods:{
		handleChangeStart(date){
			this.startTime = date;
		},
		handleChangeEnd(date){
			this.endTime = date;
		},
		changePage(current){
			this.currentPage = current;
			this.getTaskList();
		},
		clearTaskId(){
			this.taskId = '';
		},
		queryTaskList(){
			this.currentPage = 1;
			this.getTaskList();
		},	
		addTask(type){
			this.$router.push('/audit/task/add');
		},
		getBaseUserList(keyword){
			let url = '/tm/baseUserList?keyword='+ encodeURIComponent(keyword);
			this.$http.get(url).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){
					let resultArr = data.body.result ? data.body.result : [];
					this.baseList = [...resultArr];
				}else{
					this.$hMessage.error({content: data.msg})
				}
			})
			.catch(err=>{
				this.$hLoading.error()
			})
		},
		getTaskList(){
			this.loading = true;
			let url = '/tm/getTranskerTaskList?taskId='+ this.taskId +
			'&status=' + this.state + 
			'&transferUserId='+this.handOverId +
			'&undertakeUserId='+this.carryOnId +
			'&current='+this.currentPage +
			'&size='+this.pageSize +
			'&startTime='+this.startTime +
			'&endTime='+this.endTime;
			this.$http.get(url).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){
					this.taskList = data.body.records ? data.body.records : [];
					this.total = data.body.total ? data.body.total : 0;
				}else{
				   this.$hMessage.error({content: data.msg})
				}
				this.loading = false;
			})
			.catch(err=>{
				this.$hLoading.error();
				this.loading = false;
			})
		},
		toggleTaskState(taskId,status,index){
			let url = '';
			if(status ==1){
				url = '/tm/shutDownById';
			}else{
				url = '/tm/startUpById';
			}
			this.$http.post(url,{taskId: taskId}).then((res) => {
				let data = res.data;
				if(data.status == this.$api.SUCCESS){
					this.taskList[index].statusDesc = status == 1 ? '结束' : '运行中';
					this.taskList[index].status = status == 1 ? 0 : 1;
					this.$set(this.taskList, index, this.taskList[index]);
				}else{
					this.$hMessage.error({content: data.msg})
				}
			})
			.catch(err=>{
				this.$hLoading.error()
			})
		}
	},
	mounted(){
		this.getBaseUserList('');
		this.getTaskList();
	}
}
</script>
<style scoped>
.task-list-wrap{
	position: relative;
}
.select-box-wrap{
	margin:10px 0;	
}
.select-box{
	display: inline-block;
	margin-right: 15px;
	margin-bottom: 10px;
}
</style>