<template>
	<section>
		<h-collapse v-model="activePanel">
			<h-panel name="1">
				<!-- 资讯类型数量统计图 -->
				资讯类型分布统计图
				<section slot="content">
					<search-form>
						<ul slot="content">
							<li>
								<dl>
									<dt>查询方式：</dt>
									<dd>
										<h-select
											placeholder="请选择查询方式"
											v-model="barFilters.typeFlag"
											@on-change="onChangeSelect(`typeFlag`)"
											filterable
											:clearable="false">
											<h-option
												v-for="(item, i) in typeFlags"
												:value="item.value"
												:key="i">
												{{item.title}}
											</h-option>
										</h-select>
									</dd>
								</dl>
							</li>
							<li v-if="isShowDatePicker">
								<dl>
									<dt>开始日期：</dt>
									<dd>
										<h-date-picker
											type="date"
											format="yyyy-MM-dd"
											aria-placeholder="开始日期"
											:placeholder="placeholders.beginDate"
											:value="barFilters.beginDate"
											@on-change="(value) => {onChangeDatePicker(`beginDate`, value)}"
											:clearable="false">
										</h-date-picker>
									</dd>
								</dl>
							</li>
							<li v-if="isShowDatePicker">
								<dl>
									<dt>结束日期：</dt>
									<dd>
										<h-date-picker
											type="date"
											format="yyyy-MM-dd"
											aria-placeholder="结束日期"
											:placeholder="placeholders.endDate"
											:value="barFilters.endDate"
											@on-change="(value) => { onChangeDatePicker(`endDate`, value)}"
											:clearable="false">
										</h-date-picker>
									</dd>
								</dl>
							</li>
							<li class="search-wrapper-but">
								<h-tooltip
									placement="top-end"
									:disabled="!isDateEmpty"
									content="请先选择要查询的时间">
									<h-button
										type="primary"
										data-ref="init-btn"
										@click="onClickButton(`search`)"
										:disabled="isDateEmpty">
										查询
									</h-button>
								</h-tooltip>
							</li>
						</ul>
					</search-form>
					<h-row>
						<h-col span="24">
							<div style="margin: 10px;"></div>
						</h-col>
					</h-row>
					<h-row style="width: 100%; min-width: 1000px; min-height: 600px;" v-if="isBarDataLoading">
						<Spin fix v-if="isBarDataLoading">
							<h-icon name="load-c" :size=18 class="h-load-loop"></h-icon>
							<div>加载中...</div>
						</Spin>
					</h-row>
					<div v-if="!isBarDataLoading" id="bar-container" ref="bar-container" style="width: 100%; min-width: 1000px; min-height: 400px;"></div>
				</section>
			</h-panel>
			<h-panel name="2">
				资讯类型占比统计图
				<section slot="content">
					<search-form>
						<ul slot="content">
							<li>
								<dl>
									<dt>开始日期：</dt>
									<dd>
										<h-date-picker
											type="date"
											format="yyyy-MM-dd"
											aria-placeholder="开始日期"
											:placeholder="placeholders.beginDate"
											:value="pieFilters.beginDate"
											@on-change="(value) => { onChangePieDatePicker(`beginDate`, value) }"
											:clearable="false">
										</h-date-picker>
									</dd>
								</dl>
							</li>
							<li>
								<dl>
									<dt>结束日期：</dt>
									<dd>
										<h-date-picker
											type="date"
											format="yyyy-MM-dd"
											aria-placeholder="结束日期"
											:placeholder="placeholders.endDate"
											:value="pieFilters.endDate"
											@on-change="(value) => { onChangePieDatePicker(`endDate`, value) }"
											:clearable="false">
										</h-date-picker>
									</dd>
								</dl>
							</li>
							<li class="search-wrapper-but">
								<h-tooltip
									placement="top-end"
									:disabled="!isPieDateEmpty"
									content="请先选择要查询的时间">
									<h-button
										type="primary"
										data-ref="init-btn"
										@click="onClickPieButton(`search`)"
										:disabled="isPieDateEmpty">
										查询
									</h-button>
								</h-tooltip>
							</li>
						</ul>
					</search-form>
					<h-row>
						<h-col span="24">
							<div style="margin: 10px;"></div>
						</h-col>
					</h-row>
					<h-row style="width: 100%; min-width: 800px; height: 500px;" v-if="isPageDataLoading">
						<Spin fix v-if="isPageDataLoading">
							<h-icon name="load-c" :size=18 class="h-load-loop"></h-icon>
							<div>加载中...</div>
						</Spin>
					</h-row>
					<div v-if="!isPageDataLoading" id="container" ref="container" style="width: 800px; height: 500px; margin: 0 auto;"></div>
				</section>
			</h-panel>
		</h-collapse>
	</section>
</template>

<script>
	/**
	 *
	 * @author xiagq
	 * @copyright gildata
	 *
	 * @created 2019.03.18
	 * @modified 2019.03.18
	 *
	 * @description statistics-analysis
	 * @augments
	 * @example
	 *
	 */
	import {
		TODAY,
	} from "./utils";
	export default {
		data () {
			return {
				isPieDateEmpty: false,
				isShowPieDatePicker: true,
				isDateEmpty: false,
				isShowDatePicker: true,
				// activePanel: "2",
				activePanel: "1",
				activeTab: 0,
				isBarDataLoading: true,
				isPageDataLoading: true,
				barChartDatas: [],
				pieChartDatas: [],
				barFilters: {
					publishDateRange: ["", ""],
					// publishDateRange: [TODAY, TODAY],
					beginDate: TODAY,
					endDate: TODAY,
					typeFlag: 2,
				},
				pieFilters: {
					beginDate: TODAY,
					endDate: TODAY,
				},
				placeholders: {
					publishDateRange: "开始日期    ~    结束日期",
					beginDate: "请输入开始日期",
					endDate: "请输入结束日期",
				},
				typeFlags: [
					{
						value: 1,
						title: "按时",// 起止时间 yyyy-MM-dd
					},
					{
						value: 2,
						title: "按日",// 起止时间 yyyy-MM-dd
					},
					{
						value: 3,
						title: "按周(近6周)",
					},
					{
						value: 4,
						title: "按月(近6个月)",
					},
				],
				pieMinHeight: 400,
				pieMaxWidth: 400,
				barMinHeight: 400,
				barMaxWidth: 400,
			}
		},
		methods: {
			onClickPieButton(type = ``) {
				this.getPieChartDatas();
			},
			onChangePieDatePicker(type = ``, value) {
				this.pieFilters[type] = value;
			},
			onClickButton(type = ``) {
				this.getBarChartDatas();
			},
			onChangeSelect(type = ``) {
				// console.log(`select type =`, type);
				let value = this.barFilters[type];
				switch (value) {
					case 1:
					case 2:
						this.isShowDatePicker = true;
						break;
					case 3:
					case 4:
						this.isShowDatePicker = false;
						break;
					default:
						// this.isShowDatePicker = true;
						break;
				}
			},
			onChangeDatePicker(type = ``, value) {
				// console.log(`date type =`, type);
				// console.log(`value =`, value);
				this.barFilters[type] = value;
			},
			onChangeDateRangePicker() {
				//
			},
			showEchartBarChart(datas = {}) {
				let {
					series,
					xAxis,
					legends,
				} = datas;
				let yAxis = [];
				// legends.forEach((name, i) => {
				//     yAxis.push({
				//         type: "value",
				//         name,
				//     });
				// });
				// console.log(`names =`, JSON.stringify(names, null, 4));
				let dom = document.getElementById("bar-container");
				let barChart = echarts.init(dom);
				// let app = {};
				let option = {
					title: {
						text: "资讯类型分布统计图",
						// text: "资讯类型数量统计图",
						subtext: "数据来自 gildata 稽核平台",
						left: "center"
					},
					tooltip : {
						trigger: 'axis',
						axisPointer : {            // 坐标轴指示器，坐标轴触发有效
							type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
						},
					},
					toolbox: {
						show : true,
						feature : {
							//  mark : {show: true},
							// dataView : {show: true, readOnly: false},
							magicType: {show: true, type: ['line', 'bar']},
							// restore : {show: true},
						//  saveAsImage : {show: true}
						}
					},
					color: ['#7cb5ec', "#f15c80", "#fdec6d", '#d48265', "#90ed7d",'#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
					// color: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
					calculable : true,
					legend: {
						data: legends,
						bottom: 10,
					},
					xAxis: [
						{
							type : 'category',
							data : xAxis,
						}
					],
					// yAxis: yAxis,
					yAxis: [
						{
							type: "value",
							name: "资讯数量(条)",
						}
					],
					// yAxis: [
					//     {
					//         type : 'value',
					//         name : '水量',
					//         axisLabel : {
					//             formatter: '{value} ml'
					//         }
					//     },
					//     {
					//         type : 'value',
					//         name : '温度',
					//         axisLabel : {
					//             formatter: '{value} °C'
					//         }
					//     }
					// ],
					series: series,
				};
				if (option && typeof option === "object") {
					barChart.setOption(option, true);
				}
			},
			showEchartPieChart(datas = []) {
				let names = [];
				if (datas.length) {
					// names = Object.keys(datas);
					datas.forEach(obj => {
						let {
							name,
						} = obj;
						names.push(name);
					});
				}
				// console.log(`names =`, JSON.stringify(names, null, 4));
				let dom = document.getElementById("container");
				let myChart = echarts.init(dom);
				let app = {};
				let option = null;
				option = {
					title: {
						text: "资讯类型占比统计图",
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
						// formatter: function(e) {
						//     console.log(`formatter =`, e);
						//     console.log(`formatter.color =`, e.color);
						//     return `<span data-indictor="pointer" style="color: ${e.color};"></span>{b}<br/>数量: {c},<br/>占比: ({d}%)<br/>`;
						// },
					},
					color: ['#7cb5ec', "#f15c80", "#fdec6d", '#d48265', "#90ed7d",'#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
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
							data: datas,
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
				if (option && typeof option === "object") {
					myChart.setOption(option, true);
				}
			},
			getBarChartDatas() {
				this.isBarDataLoading = true;
				let {
					beginDate: startTime,
					endDate: endTime,
					typeFlag: type,
				} = this.barFilters;
				let url = `/tm/getNewsAnalysisByDateAndType?type=${type}`;
				if (type === 1 || type === 2) {
					url = url + `&startTime=${startTime}&endTime=${endTime}`;
					// url = `/tm/getNewsAnalysisByDateAndType?startTime=${startTime}&endTime=${endTime}&type=${type}`;
				}
				// let url = `/tm/getNewsAnalysisByDateAndType?startTime=${startTime}&endTime=${endTime}&type=${type}`;
				// let url = `/tm/getNewsAnalysisByDateAndType?startTime=2019-03-01&endTime=2019-03-17&type=2`;
				this.$http
				.get(url)
				.then(res => res.data)
				.then((json)=>{
					let {
						status,
						msg,
						body,
					} = json;
					if(status != this.$api.SUCCESS){
						console.log(`bar json =`, JSON.stringify(json, null, 4));
						this.isBarDataLoading = false;
						this.$hMessage.error(msg);
						return;
					} else {
						this.isBarDataLoading = false;
						let {
							series,
							dateList: xAxis,
							newsTypeDescList: legends,
						} = body;
						if (type === 3) {
							xAxis = xAxis.map(item => {
								// let new_item = item.replace(`/`, `-`);
								let new_item = item.slice(5);
								return `第 ${new_item} 周`;
							});
						}
						// console.log(`bar json =`, JSON.stringify(json, null, 4));
						series = series.map(
							(obj, i) => {
								let {
									name,
									data,
								} = obj;
								if (!Array.isArray(data)){
									data = [];
								}
								return {
									name,
									data,
									type: "bar",
								};
							}
						);
						// this.barChartDatas = listDatas;
						setTimeout(() => {
							this.showEchartBarChart({
								series,
								xAxis,
								legends,
							});
							this.getWindowMaxWidth();
						}, 0);
					}
				}).catch(err => console.error(`bar error`, err));
			},
			getPieChartDatas(times = {}) {
				this.isPageDataLoading = true;
				let {
					beginDate: startTime,
					endDate: endTime,
				} = this.pieFilters;
				let url = `/tm/getNewsAnalysisByType?startTime=${startTime}&endTime=${endTime}`;
				// let url = `/tm/getNewsAnalysisByType?startTime=2018-03-01&endTime=2019-03-14`;
				this.$http
				.get(url)
				.then(res => res.data)
				.then((json)=>{
					let {
						status,
						msg,
						body,
					} = json;
					if(status != this.$api.SUCCESS){
						console.log(`pie json =`, JSON.stringify(json, null, 4));
						this.$hMessage.error(msg);
						return;
					} else {
						this.isPageDataLoading = false;
						let {
							result: listDatas,
						} = body;
						// console.log(`pie json =`, JSON.stringify(json, null, 4));
						listDatas = listDatas.map(
							(obj, i) => {
								let {
									name,
									value,
									// num: value,
								} = obj;
								let bigNumber = ``;
								bigNumber = parseInt(value);
								// console.log(`bigNumber =`, bigNumber);
								return {
									name,
									value: bigNumber,
									// value,
								};
							}
						);
						this.pieChartDatas = listDatas;
						// console.log(`listDatas =`, JSON.stringify(listDatas, null, 4));
						setTimeout(() => {
							this.showEchartPieChart(listDatas);
							this.getWindowMaxWidth();
						}, 0);
					}
				}).catch(err => console.error(`pie error`, err));
			},
			getWindowMaxWidth() {
				let maxWidth = window.screen.width || 1366;
				// console.log(`maxWidth =`, maxWidth, maxWidth < 1920);
				if (maxWidth < 1920) {
					// console.log(`small`);
					let barChart = this.$refs["bar-container"];
					barChart.style.minHeight = "400px";
					let pieChart = this.$refs["container"];
					pieChart.style.height = "400px";
				} else {
					// console.log(`big`);
					let barChart = this.$refs["bar-container"];
					barChart.style.minHeight = "600px";
					let pieChart = this.$refs["container"];
					pieChart.style.height = "500px";
				}
			},
			init() {
				setTimeout(() => {
					this.getBarChartDatas();
					this.getPieChartDatas();
				}, 0);
			},
		},
		mounted() {
			this.init();
		},
	}
</script>

<style lang="scss">
	[data-indictor="pointer"] {
		display: inline-block;
		width: 10px;
		height: 10px;
		background: #0f0;
		border: 0;
		border-radius: 50%;
	}
</style>
<style lang="scss" scoped>
	.audit-common-lable{
		width: 50px;
		margin-left: 5px;
		margin-right: 5px;
		&::after {
			content: ":";
			display: inline-block;
			width: 5px;
			height: 10px;
		}
	}
	.audit-common-lable-space {
		width: 50px;
		margin-left: 10px;
		margin-right: 10px;
	}
</style>

