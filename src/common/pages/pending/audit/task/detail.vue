<template>
	<div class="detailWrap">
		<h-spin fix v-if="pageLoading">
		 	<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
       		<div>加载中...</div>
		</h-spin>
		<div class="select-box-wrap">
			<div class="select-box">
				<span>移交人：</span>
				<span>{{handOver ? handOver : '-'}}</span>
			</div>
			<div class="select-box">
				<span>承接人：</span>
				<span>{{carryOn ? carryOn : '-'}}</span>			
			</div>
			<div class="select-box">
				<span>时间范围:</span>
				<span>{{startTime ? startTime : '-'}}</span>			
			    <span>至</span>
			    <span>{{endTime ? endTime : '-'}}</span>			   
			</div>
		</div>
		<div class="tab-box">
			<h-table border :columns="columns2" :data="detailList"  @on-selection-change="selectChange"></h-table>		
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
			taskId:'',
			handOver:'',
			carryOn:'',
			startTime:'',
			endTime:'',
			selectArr:[],
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
            detailList:[],
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
					this.detailList = [...list];	
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
		loadPageData(){ 
	    	let pathName = '任务移交详情';
	    	this.getDetailInfo(this.taskId);
	    	store.commit('SAVE_TAB_NAME',{  path: '/audit/task/detail', name: pathName});
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