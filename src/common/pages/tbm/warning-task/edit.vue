<template>
	<div class="detailWrap">
		<h-spin fix v-if="pageLoading">
		 	<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
       		<div>加载中...</div>
		</h-spin>
		<div class="select-box-wrap">
			<span> 作业编号:</span>
			<h-input  style="width:220px;" placeholder="请输入作业编号" v-model="commonFilters.taskCode" ></h-input>
			<span>作业名称:</span>
			<h-input  style="width:220px;" placeholder="请输入作业名称" v-model="commonFilters.taskName" ></h-input>
		</div>
		<div class="select-box-wrap">
			<span>规则名称:</span>
			<h-select  multiple clearable placeholder="请选择"  v-model="commonFilters.ruleId" style="width:440px">
		        <h-option v-for="item in baseList" :value="item.id" :key="item.id">{{item.ruleName}}</h-option>
		    </h-select>
		</div>
		<div class="select-box-wrap">
			<span>执行时间范围:</span>
			<h-row style="display: inline-block;top: 12px">
				<h-col span="12">
					<h-date-picker @on-change="handleChangeStart" :value="commonFilters.taskStartDate" format="yyyy-MM-dd HH:mm:ss" type="datetime" placement="bottom-end" placeholder="选择起始时间" style="width: 200px"></h-date-picker>
				</h-col>
			</h-row>	
			<span>至</span>
			<h-row style="display: inline-block;top: 12px">
				<h-col span="12">
					<h-date-picker @on-change="handleChangeEnd" :value="commonFilters.taskEndDate" format="yyyy-MM-dd HH:mm:ss" type="datetime" placement="bottom-end" placeholder="选择结束时间" style="width: 200px"></h-date-picker>
				</h-col>
			</h-row>
		</div>
		<Tabs value="name1">
				<TabPane label="年" name="name1">
					<RadioGroup v-model="commonFilters.taskTimingYear">
						<Radio label="*">每年</Radio>
						<Radio label="">指定</Radio>
						<h-input focusAllSelect :readonly="commonFilters.taskTimingYear=='*'" style="width:220px;" placeholder="请输入指定年份" v-model="commonFilters.taskYear" ></h-input>
					</RadioGroup>
				</TabPane>
				<TabPane label="月" name="name2">
					<RadioGroup v-model="commonFilters.taskTimingMonth">
						<Radio label="*">每月</Radio>
						<Radio label="">指定</Radio>
						<h-input focusAllSelect :readonly="commonFilters.taskTimingMonth=='*'"   style="width:220px;" placeholder="请输入指定月份" v-model="commonFilters.taskMonth" ></h-input>
					</RadioGroup>
				</TabPane>
				<TabPane label="周" name="name3">
					<RadioGroup v-model="commonFilters.taskTimingWeek">
						<Radio label="?">每周</Radio>
						<Radio label="">指定</Radio>
						<h-select multiple clearable :disabled="commonFilters.taskTimingWeek == '?'" placeholder="请选择指定周几"  v-model="commonFilters.taskWeek" style="width:440px">
							<h-option v-for="item in weekList" :value="item.code" :key="item.code">{{item.name}}</h-option>
						</h-select>
					</RadioGroup>
				</TabPane>
				<TabPane label="日" name="name4">
					<RadioGroup v-model="commonFilters.taskTimingDay">
						<Radio label="*">每日</Radio>
						<Radio label="">指定</Radio>
						<h-input focusAllSelect :readonly="commonFilters.taskTimingDay=='*'"  style="width:220px;" placeholder="请输入指定日" v-model="commonFilters.taskDay" ></h-input>
					</RadioGroup>
				</TabPane>
				<TabPane label="时" name="name5">
					<RadioGroup v-model="commonFilters.taskTimingHour">
						<Radio label="*" disabled>每小时</Radio>
						<Radio label="">指定</Radio>
						<h-input  focusAllSelect :readonly="commonFilters.taskTimingHour=='*'" style="width:220px;" placeholder="请输入指定小时" v-model="commonFilters.taskHour" ></h-input>
					</RadioGroup>
				</TabPane>
				<TabPane label="分" name="name6">
					<RadioGroup v-model="commonFilters.taskTimingMinute">
						<Radio label="*" disabled>每分钟</Radio>
						<Radio label="">指定</Radio>
						<h-input  focusAllSelect :readonly="commonFilters.taskTimingMinute=='*'"  style="width:220px;" placeholder="请输入指定分钟" v-model="commonFilters.taskMinute" ></h-input>
					</RadioGroup>
				</TabPane>
			</Tabs>

		<div class="button-box">
			<h-button type="primary" @click="saveTask">修改任务</h-button>
		</div>
	</div>
</template>

<script>
import store from '@/store';
export default {
	name: 'AuditTaskDetail',
	data(){
		return{
			pageType:true,
			optionsDate:{
        		disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
				}
			},
			commonFilters: {
				id: "",
				taskCode:'',
				taskName:'',
				taskStartDate:'',
				taskEndDate:'',
				taskTimingYear: '',
				taskTimingMonth: '',
				taskTimingWeek: '?',
				taskTimingDay: '*',
				taskTimingMinute: '',
				taskTimingHour: '',
				taskYear: '',
				taskMonth: '',
				taskWeek: [],
				taskDay: '',
				taskMinute: '00',
				taskHour: '00',
				ruleId:[]
			},
			pageLoading:false,
			checkFlag:false,
			isSubmit:false,
            addList:[],
			baseList:[],
			weekList:[{
				code:"SUN",
				name:'星期天'
			},{
				code:"MON",
				name:'星期一'
			},{
				code:"TUE",
				name:'星期二'
			},{
				code:"WED",
				name:'星期三'
			},{
				code:"THU",
				name:'星期四'
			},{
				code:"FRI",
				name:'星期五'
			},{
				code:"SAT",
				name:'星期六'
			}]
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
	    	this.commonFilters.taskStartDate = date;
	    },
	    handleChangeEnd(date){
	    	this.commonFilters.taskEndDate = date;
	    },
	    getBaseRuleList(keyword){
	    	this.pageLoading = true;
			let url = '/tm/warning/ruleAll';
            this.$http.get(url).then((res) => {
            	let data = res.data;
                if(data.status == this.$api.SUCCESS){
                	let resultArr = data.body.list ? data.body.list : [];
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
			let url = '/tm/warning/taskDetail?taskId='+ this.taskId;
            this.$http.get(url).then((res) => {
				let data = res.data;
                if(data.status == this.$api.SUCCESS){
					let obj = data.body ? data.body : {};
                	this.commonFilters.id = obj.id;
					this.commonFilters.taskCode = obj.taskCode;
					this.commonFilters.taskName = obj.taskName;
					this.commonFilters.taskStartDate = obj.taskStartDate;
					this.commonFilters.taskEndDate = obj.taskEndDate;
					if(obj.taskTimingYear !='*'){
						this.commonFilters.taskTimingYear = '';
						this.commonFilters.taskYear = obj.taskTimingYear;
					}else{
					this.commonFilters.taskTimingYear = '*';	
					}
					if(obj.taskTimingWeek.length==0){
						this.commonFilters.taskTimingWeek = '?';
					}else{
						this.commonFilters.taskTimingWeek = '';
						this.commonFilters.taskWeek = obj.taskTimingWeek;
					}
					if(obj.taskTimingMonth!='*'){
						this.commonFilters.taskTimingMonth = '';
						this.commonFilters.taskMonth = obj.taskTimingMonth;
					}else{
						this.commonFilters.taskTimingMonth = '*';	
					}
					if(obj.taskTimingDay!='*'){
						this.commonFilters.taskTimingDay = '';
						this.commonFilters.taskDay = obj.taskTimingDay;
					}else{
						this.commonFilters.taskTimingDay = '*';	
					}
					this.commonFilters.taskTimingHour = '';
					this.commonFilters.taskTimingMinute = '';
					this.commonFilters.taskHour = obj.taskTimingHour;
					this.commonFilters.taskMinute = obj.taskTimingMinute;
					this.commonFilters.ruleId = obj.ruleId;
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
            let url = '/tm/warning/saveTask';
            if(this.commonFilters.ruleId.length ==0){
            	this.$hMessage.error({content: '至少选择一种预警规则',duration: 3});
            	this.pageLoading = false;
            	return
			}
			if(this.commonFilters.taskTimingYear ==''&&this.commonFilters.taskYear ==''){
            	this.$hMessage.error({content: '请指定定时任务年份',duration: 3});
            	this.pageLoading = false;
            	return
			}
			if(this.commonFilters.taskTimingMonth ==''&&this.commonFilters.taskMonth ==''){
            	this.$hMessage.error({content: '请指定定时任务月份',duration: 3});
            	this.pageLoading = false;
            	return
			}
			if(this.commonFilters.taskTimingWeek ==''&&this.commonFilters.taskWeek.length ==0){
            	this.$hMessage.error({content: '请指定定时任务星期几',duration: 3});
            	this.pageLoading = false;
            	return
			}
			if(this.commonFilters.taskTimingDay ==''&&this.commonFilters.taskDay ==''){
            	this.$hMessage.error({content: '请指定定时任务日',duration: 3});
            	this.pageLoading = false;
            	return
			}	
			if(this.commonFilters.taskCode ==''){
            	this.$hMessage.error({content: '请输入作业编号',duration: 3});
            	this.pageLoading = false;
            	return
			}
			if(this.commonFilters.taskName ==''){
            	this.$hMessage.error({content: '请输入作业名称',duration: 3});
            	this.pageLoading = false;
            	return
			}
            this.$http.post(url,this.commonFilters).then((res) => {
                let data = res.data ? res.data : {};
                if(data.status == this.$api.SUCCESS){
                    this.$router.push('/tbm/warning-task/index');                    	                    
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
			let pathName = '编辑预警任务';
			this.getBaseRuleList(''); 
			this.getDetailInfo(this.taskId);
	    	store.commit('SAVE_TAB_NAME',{  path: '/tbm/warning-task/edit', name: pathName});
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
	text-align: center;
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
.detailWrap>>> .h-tabs-nav-wrap{
	float: none !important;
}
.detailWrap>>> .h-select-dropdown-item,.detailWrap>>> .h-select-dropdown-content{
	text-align: left !important;
}
.h-tabs{
	height:300px;
}
</style>