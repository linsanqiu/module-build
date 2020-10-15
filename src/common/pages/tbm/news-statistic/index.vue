<template>
	<div>
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>查询方式：</dt>
						<dd>
							<h-select  placeholder="请选择查询方式" v-model="searchData.dateType" @on-change="changeTypeFn">
								<h-option v-for="(item, i) in dateTypeList" :value="item.value" :key="item.value">
									{{item.title}}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li v-if="searchData.dateType == 1 || searchData.dateType == 2 || searchData.dateType == ''">
					<dl>
						<dt>查询日期：</dt>
						<dd>
							<h-date-picker :options="optionsDate" type="daterange" format="yyyy-MM-dd" placeholder="开始日期-结束日期" :value="updateDateRange" @on-change="onChangeModDateRangePicker"></h-date-picker>
						</dd>
					</dl>
				</li>
				<li>
		          <dl>
		            <dt>所属项目：</dt>
		            <dd>
		            	<h-select  placeholder="请选择所属项目"  v-model="searchData.appId">
							<h-option v-for="item in appList" :value="item.dictEntry" :key="item.dictEntry">{{item.entryName}}</h-option>
						</h-select>
		            </dd>
		          </dl>
		        </li>
				<li class="search-wrapper-but">
					<h-button v-if="activeRoutersButton.indexOf('StaticsSearch') != -1" type="primary"  @click="handleSearch">查询</h-button>
					<h-tooltip placement="top-end" content="请选择是否自动页面数据!">
						<h-switch size="large" v-model="isAutoRefreshTable">
							<div slot="open">
								<span>打开</span>
							</div>
							<div slot="close">
								<span>关闭</span>
							</div>
						</h-switch>
					</h-tooltip>
				</li>
			</ul>
		</search-form>
		<div class="chartBox">
			<h-spin fix v-if="chartLoading">
			 	<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
		   		<div>加载中...</div>
			</h-spin>
			<div v-if="showBarStatus" id="bar-container" ref="bar-container"></div>
			<div v-else id="pie-container" ref="pie-container"></div>
		</div>
	</div>
</template>

<script>
    import {mapState} from "vuex";
	import utils from "@/utils/index";
	const TODAY = utils.getToday();
	export default{
		name:'TbmNews-statisticIndex',
		data(){
			return{
				optionsDate:{
	                disabledDate (date) {
	                    return date && date.valueOf() >= Date.now();
	                }
	            },
	            isAutoRefreshTable:true,
				chartLoading:false,
				activeRoutersButton : this.$store.state.activeRoutersButton,//控制按钮权限
				showBarStatus:true,
				chartDate_bar:null,
				chartDate_pie:null,
				searchData:{
					appId:'',
					dateType:'2',//默认为按日查询
					startTime:TODAY,
					endTime:TODAY,					
				},		
				updateDateRange: [TODAY, TODAY],
				dateTypeList:[
                    {
                        value: '1',
                        title: "按时",
                    },
                    {
                        value: '2',
                        title: "按日",
                    },
                    {
                        value: '3',
                        title: "按周(近6周)",
                    },
                    {
                        value: '4',
                        title: "按月(近6个月)",
                    },
                ],
                isBarDataLoading:false,
			}
		},
		methods:{
			onChangeModDateRangePicker(values){
				this.updateDateRange = values;
				this.searchData.startTime= values[0];
				this.searchData.endTime = values[1];
			},
			changeTypeFn(){
				if(this.searchData.dateType == '3'){
					let weekAgo = utils.getWeekAgo(6);
					this.updateDateRange = [weekAgo,TODAY];
					this.searchData.startTime= weekAgo;
					this.searchData.endTime = TODAY;
				}else if(this.searchData.dateType == '4'){
					let monthAgo = utils.getMonthAgo(6);
					this.updateDateRange = [monthAgo,TODAY];
					this.searchData.startTime= monthAgo;
					this.searchData.endTime = TODAY;
				}else{
					this.updateDateRange = [TODAY,TODAY];
					this.searchData.startTime= TODAY;
					this.searchData.endTime = TODAY;
				}
			},
			dateRangeFn(type,startTime,endTime,callback){
				let dateRange = new Date(endTime) - new Date(startTime);
				const aDate = 24*60*60*1000;
				const aMonth = aDate * 31;				 
				if(type == 1){
					if(!startTime || !endTime){
						this.$hMessage.warning({content: '起止日期不能为空'});
						callback(false);
					}else if(dateRange >=aDate){
						this.$hMessage.warning({content: '查询日期跨度不能超过1天'});
						callback(false);
					}else{
						callback(true);
					}					
				}else if(type == 2){
					if(!startTime || !endTime){
						this.$hMessage.warning({content: '起止日期不能为空'});
						callback(false);
					}else if(dateRange >=aMonth){
						this.$hMessage.warning({content: '查询日期跨度不能超过31天'});  
						callback(false);
					}else{
						callback(true);
					}					
				}else{
					callback(true);
				}
			},
			handleSearch(){
				this.dateRangeFn(this.searchData.dateType,this.searchData.startTime,this.searchData.endTime,(res)=>{
					if(res){	 
						this.init();
					}
				});		
			},
			getChartDatas() { 	
				this.chartLoading = true;
 				let url ='/tm/news/getNewsAnalysis?type='+this.searchData.dateType 
 				+'&startTime='+this.searchData.startTime
 				+'&endTime='+this.searchData.endTime
 				+'&appId='+this.searchData.appId;
	            this.$http.get(url).then((res) =>{
	            	let result = res.data;
	                if(result.status == this.$api.SUCCESS){ 
	                	let chartData = result.body.cylindrical || {};//柱状图
	                	let chartData_pie = result.body.cakeType || {};//饼图
	                	let {series,dateList: xAxis,newsTypeDescList: legends} = chartData;		                	
                       	this.chartDate_bar = {series:series || [],xAxis: xAxis || [],legends: legends || []};                	
	                	this.chartDate_pie = {series:chartData_pie.series || [],newsTypeDescList: chartData_pie.newsTypeDescList || []};;
   						if(this.showBarStatus){
   							this.showEchartBarChart(this.chartDate_bar);
   						}else{
   							this.showEchartPieChart(this.chartDate_pie);
   						}
   						
	                }else{
	                    this.$hMessage.error({content: result.msg});
	                }
	                this.chartLoading = false;
	            })
	            .catch(err=>{
	                this.$hLoading.error();
	                this.chartLoading = false;
	            })	
            },
            showEchartBarChart(chartData){
            	if(!chartData)return;    		       		                      	            	 
  				//按周查询时,横坐标格式化     
  				let xAxis = chartData.xAxis;
  				let legends =  ['抓取量','已公开','已删除','已下架','待处理'];
  				chartData.legends = legends;
    		    if (this.searchData.dateType =='3'){
                    xAxis = xAxis.map(item => {
                        let new_item = item.slice(5);
                        return `第 ${new_item}周`;
                    });
                    chartData.xAxis = xAxis;
               };
                chartData.series.sort((a,b)=>{
                	return legends.indexOf(a.name)-legends.indexOf(b.name);
                });
            	chartData.series = chartData.series.map((item, i) => {
                    let {name,data,type=''} = item;
                    if (!Array.isArray(data)){
                        data = [];
                    };                   
                    if(name == '待处理'){
                    	type = 'line'
                    }else{
                    	type = 'bar'
                    }
                    return {name,data,type};
              	}); 
            	let _this = this;            
                let domBar = document.getElementById("bar-container");
                let barChart = echarts.init(domBar);
                let option = {
                    title: {
                        text: "资讯处理统计图",
                        subtext: "数据来自 gildata 稽核平台",
                        left: "center"
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {// 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'// 默认为直线，可选为：'line' | 'shadow'
                        },
                    },
                    toolbox: {
                    	right:120,
                        show :true,                       
				        feature: {
				            myTool1: {
				                show: this.searchData.dateType != '1' ,
				                title: '饼图',
				                icon: 'path://M512 67h-1.9v435.3L75.4 598.5C115.7 802.9 295.8 957 512 957c245.8 0 445-199.2 445-445S757.8 67 512 67z m279.3 724.3c-36.3 36.3-78.5 64.8-125.6 84.7-48.7 20.6-100.4 31-153.7 31-46.9 0-92.9-8.1-136.5-24.2-42.1-15.5-81.1-38-115.8-66.9-34.5-28.6-63.6-62.6-86.6-100.9-15-25-27.1-51.4-36.2-78.9l384-85 39.2-8.7V119.9c36.4 4.4 71.7 13.8 105.6 28.1 47 19.9 89.3 48.4 125.6 84.7 36.3 36.3 64.8 78.5 84.7 125.6 20.6 48.7 31 100.4 31 153.7s-10.4 105.1-31 153.7c-19.9 47.1-48.4 89.3-84.7 125.6zM117.4 531h-50c-0.3-6.3-0.4-12.6-0.4-19 0-224.1 165.6-409.4 381.1-440.4v50.6c-30.8 5-60.9 13.7-89.8 25.9-47 19.9-89.3 48.4-125.6 84.7-36.3 36.3-64.8 78.5-84.7 125.6-20.6 48.7-31 100.4-31 153.7 0 6.3 0.2 12.6 0.4 18.9z',
				                onclick: function (){
				                   _this.showBarStatus = false;//切换为饼图
				                   setTimeout(()=>{
				                   	_this.showEchartPieChart(_this.chartDate_pie);
				                   },0);				                   
//				                   _this.getPieChartDatas();
				                }
				            },
				            myTool2: {
				                show: !_this.showBarStatus,
				                title: '柱状图',
				                icon: 'path://M256 448 128 448C92.608 448 64 476.608 64 512l0 320c0 35.392 28.608 64 64 64l128 0c35.392 0 64-28.608 64-64L320 512C320 476.608 291.392 448 256 448zM256 832 128 832 128 512l128 0L256 832zM896 320l-128 0c-35.392 0-64 28.608-64 64l0 448c0 35.392 28.608 64 64 64l128 0c35.392 0 64-28.608 64-64L960 384C960 348.608 931.392 320 896 320zM896 832l-128 0L768 384l128 0L896 832zM576 64 448 64C412.608 64 384 92.608 384 128l0 704c0 35.392 28.608 64 64 64l128 0c35.392 0 64-28.608 64-64L640 128C640 92.608 611.392 64 576 64zM576 832 448 832 448 128l128 0L576 832z',
				                onclick: function (){
				                   _this.showBarStatus = true;//切换为柱状图
				                   setTimeout(()=>{
				                   		_this.showEchartBarChart(_this.chartDate_bar)
				                   },0)
				                   
				                }
				            },
				            myTool3: {
				                show:true,
				                title: '表格',
				                icon: 'M896 128H128c-35.2 0-64 28.8-64 64v640c0 35.2 28.8 64 64 64h768c35.2 0 64-28.8 64-64V192c0-35.2-28.8-64-64-64zM352 832H128V672h224v160z m0-224H128V448h224v160z m0-224H128V224h224v160z m256 448H416V672h192v160z m0-224H416V448h192v160z m0-224H416V224h192v160z m288 448H672V672h224v160z m0-224H672V448h224v160z m0-224H672V224h224v160z',
				                onclick: function (){
				                	let obj = {..._this.searchData};
				                	obj.handleStatus = '';
				                	sessionStorage.setItem("searchDataStatics",JSON.stringify(obj));
				                    _this.$router.push({path:'/tbm/news/list'});
				                }
				            },
				             
				        }
                    },
                    color: ['#7cb5ec', "#f15c80",  '#d48265', "#90ed7d",'#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
                    calculable : true,
                    legend: {
                        data: chartData.legends,
                        bottom: 10,
                    },
                    xAxis: [
                        {
                            type : 'category',
                            data : chartData.xAxis,
                        }
                    ],
                    yAxis: [
                        {
                            type: "value",
                            name: "资讯数量(条)",
                        }
                    ],
                    series: chartData.series,
                };
                if (option && typeof option === "object") {
                    barChart.setOption(option, true);
                }
            },
            showEchartPieChart(datas) {
            	if(!datas)return
            	let _this = this;
            	let names = [];
                let {series,newsTypeDescList} = datas;
                series.forEach((item,i)=>{
                	names.push(item.name) 
                });
                let dom = document.getElementById("pie-container");
                let myChart = echarts.init(dom);
                let app = {};
                let optionpie = null;
                optionpie = {
                    title: {
                        text: "资讯处理占比统计图",
                        subtext: "数据来自 gildata 稽核平台",
                        left: "center"
                    },
                    tooltip : {
                        trigger: "item",
                        // formatter: "{a} <br/>{b} : {c} ({d}%)",
                        formatter: `
                            <span data-indictor="pointer"></span>
                            {b}<br/>数量: {c},
                            <br/>占比: ({d}%)<br/>
                        `,
                    },
                    toolbox:{
                    	right:120,
                    	show :true,
                    	feature: {
				            myTool1: {
				                show: this.showBarStatus,
				                title: '饼图',
				                icon: 'path://M512 67h-1.9v435.3L75.4 598.5C115.7 802.9 295.8 957 512 957c245.8 0 445-199.2 445-445S757.8 67 512 67z m279.3 724.3c-36.3 36.3-78.5 64.8-125.6 84.7-48.7 20.6-100.4 31-153.7 31-46.9 0-92.9-8.1-136.5-24.2-42.1-15.5-81.1-38-115.8-66.9-34.5-28.6-63.6-62.6-86.6-100.9-15-25-27.1-51.4-36.2-78.9l384-85 39.2-8.7V119.9c36.4 4.4 71.7 13.8 105.6 28.1 47 19.9 89.3 48.4 125.6 84.7 36.3 36.3 64.8 78.5 84.7 125.6 20.6 48.7 31 100.4 31 153.7s-10.4 105.1-31 153.7c-19.9 47.1-48.4 89.3-84.7 125.6zM117.4 531h-50c-0.3-6.3-0.4-12.6-0.4-19 0-224.1 165.6-409.4 381.1-440.4v50.6c-30.8 5-60.9 13.7-89.8 25.9-47 19.9-89.3 48.4-125.6 84.7-36.3 36.3-64.8 78.5-84.7 125.6-20.6 48.7-31 100.4-31 153.7 0 6.3 0.2 12.6 0.4 18.9z',
				                onclick: function (){
				                   _this.showBarStatus = false;//切换为饼图
//				                   _this.getPieChartDatas();
				                }
				            },
				            myTool2: {
				                show: true,
				                title: '柱状图',
				                icon: 'path://M256 448 128 448C92.608 448 64 476.608 64 512l0 320c0 35.392 28.608 64 64 64l128 0c35.392 0 64-28.608 64-64L320 512C320 476.608 291.392 448 256 448zM256 832 128 832 128 512l128 0L256 832zM896 320l-128 0c-35.392 0-64 28.608-64 64l0 448c0 35.392 28.608 64 64 64l128 0c35.392 0 64-28.608 64-64L960 384C960 348.608 931.392 320 896 320zM896 832l-128 0L768 384l128 0L896 832zM576 64 448 64C412.608 64 384 92.608 384 128l0 704c0 35.392 28.608 64 64 64l128 0c35.392 0 64-28.608 64-64L640 128C640 92.608 611.392 64 576 64zM576 832 448 832 448 128l128 0L576 832z',
				                onclick: function (){
				                   _this.showBarStatus = true;//切换为柱状图
				                   _this.showEchartBarChart(_this.chartDate_bar);
				                }
				            },
				            myTool3: {
				                show: true,
				                title: '表格',
				                icon: 'M896 128H128c-35.2 0-64 28.8-64 64v640c0 35.2 28.8 64 64 64h768c35.2 0 64-28.8 64-64V192c0-35.2-28.8-64-64-64zM352 832H128V672h224v160z m0-224H128V448h224v160z m0-224H128V224h224v160z m256 448H416V672h192v160z m0-224H416V448h192v160z m0-224H416V224h192v160z m288 448H672V672h224v160z m0-224H672V448h224v160z m0-224H672V224h224v160z',
				                onclick: function (){
				                   _this.$router.push({path:'/tbm/news/list'});
				                }
				            }
				             
				    	}
                    },                    
                    color: ['#7cb5ec', "#f15c80",'#d48265', "#90ed7d",'#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
                    legend: {
                        // orient: "vertical",
                        // top: "middle",
                        bottom: 10,
                        left: "center",
                        data: names,
                    },
                    series : [
                        {
                            type: "pie",
                            radius : "65%",
                            center: ["50%", "50%"],
                            selectedMode: "single",
                            data: series,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: "rgba(0, 0, 0, 0.5)"
                                }
                            }
                        }
                    ]
                };
                if (optionpie && typeof optionpie === "object") {
                    myChart.setOption(optionpie, true);
                }
            },
			init() {
                setTimeout(() => {              	
                    this.getChartDatas();                    
                }, 0);
            }
		},
		computed: {
			...mapState(['appList'])
		},
		mounted(){
			this.$store.dispatch('getAppList','appList');
			this.init();
		},
		activated: function(){
			if (this.isAutoRefreshTable){
				this.init();
			}
		}
	}
</script>

<style scoped>
	.chartBox{
		margin-top:30px;
		position:relative;
	}
	#bar-container,#pie-container{
		width: 100%; 
		height: 450px;
	}
</style>