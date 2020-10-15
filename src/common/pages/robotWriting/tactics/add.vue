<template>
	<div class="addtactics">
		<div class="topbox">
			<div>
				<h-form :model="req" ref="topForm" label-position="right" :label-width="80" :rules="modulesRule">
					<h-form-item label="策略名称："  prop="name">
						<h-input type="text" v-model="req.name" placeholder="策略名称"></h-input>
					</h-form-item>
					<h-form-item label="策略类型：">
						<RadioGroup v-model="req.strategyType">
							<Radio :label="1">
								<span>定期策略</span>
							</Radio>
							<Radio :label="2" disabled>
								<span>触发式策略</span>
							</Radio>
							<Radio :label="3" disabled>
								<span>自定义策略</span>
							</Radio>
						</RadioGroup>
					</h-form-item>
					<h-form-item label="执行条件：" prop="executionConditionalExpression">
						<h-input v-model="req.executionConditionalExpression" placeholder="执行条件"></h-input>
					</h-form-item>
				</h-form>
			</div>
		</div>
		<div class="contentsbox">
			<Tabs size="small" @on-click="clickTabs" v-model="tabsName">
				<TabPane label="周策略" name="1"></TabPane>
				<TabPane label="月策略" name="2"></TabPane>
			</Tabs>
			<h-form :model="req" ref="contentForm" label-position="right" :label-width="80">
				<h-form-item label="执行日期：">
					<table class="tab">
						<thead>
							<tr>
								<th width="100">序号</th>
								<th>条件 <span class="add"><i class="iconfont icon-add" @click="addCondition(tabsName)"></i></span></th>
							</tr>
						</thead>
						<tbody>
							<template v-if="tabsName == 1">
								<tr v-for="(item,k) in weekTimeingStrategy" :key="k">
									<td align="center">#{{ k+1 }}</td>
									<td>
										每周
										<h-select v-model="item.daySortType" width="70" :clearable="false">
											<h-option  v-for="(items,k) in sortType" :key="k" :value="items.code" >
												{{ items.name }}
											</h-option>
										</h-select>
										<h-select v-model="item.daySelectType" width="70" :clearable="false">
											<h-option  v-for="(items,k) in selectType" :key="k" :value="items.code" >
												{{ items.name }}
											</h-option>
										</h-select>
										<h-select v-model="item.day" width="70" :clearable="false">
											<h-option  v-for="(items,k) in day" :key="k" :value="items.code" >
												{{ items.name }}
											</h-option>
										</h-select>
										<h-select v-model="item.dayType" width="70" :clearable="false">
											<h-option  v-for="(items,k) in dayType" :key="k" :value="items.code" >
												{{ items.name }}
											</h-option>
										</h-select>
										<h-select v-model="item.exchange" width="180" :clearable="true">
											<h-option  v-for="(items,k) in exchange" :key="k" :value="items.code" >
												{{ items.name }}
											</h-option>
										</h-select>
										<i class="iconfont icon-t-b-delete" title="删除" @click="delCondition(1,k)"></i>
									</td>
								</tr>
							</template>
							<template v-else-if="tabsName == 2">
								<tr v-for="(item,k) in monthTimeingStrategy" :key="k">
									<td align="center">#{{ k+1 }}</td>
									<td>
										<h-select v-model="item.month" width="70" :clearable="false">
											<h-option  v-for="(items,k) in month" :key="k" :value="items.code" >
												{{ items.name }}
											</h-option>
										</h-select>
										<h-select v-model="item.weekSortType" width="70" :clearable="false">
											<h-option  v-for="(items,k) in sortType" :key="k" :value="items.code" >
												{{ items.name }}
											</h-option>
										</h-select>
										<h-select v-model="item.weekSelectType" width="70" :clearable="false">
											<h-option  v-for="(items,k) in selectType" :key="k" :value="items.code" >
												{{ items.name }}
											</h-option>
										</h-select>
										<h-select v-model="item.week" width="70" :clearable="false">
											<h-option  v-for="(items,k) in week" :key="k" :value="items.code" >
												{{ items.name }}
											</h-option>
										</h-select>
										<h-select v-model="item.daySortType" width="70" :clearable="false">
											<h-option  v-for="(items,k) in sortType" :key="k" :value="items.code" >
												{{ items.name }}
											</h-option>
										</h-select>
										<h-select v-model="item.daySelectType" width="70" :clearable="false">
											<h-option  v-for="(items,k) in selectType" :key="k" :value="items.code" >
												{{ items.name }}
											</h-option>
										</h-select>
										<h-select v-model="item.day" width="70" :clearable="false">
											<h-option  v-for="(items,k) in day" :key="k" :value="items.code" >
												{{ items.name }}
											</h-option>
										</h-select>
										<h-select v-model="item.dayType" width="70" :clearable="false">
											<h-option  v-for="(items,k) in dayType" :key="k" :value="items.code" >
												{{ items.name }}
											</h-option>
										</h-select>
										<h-select v-model="item.exchange" width="180" :clearable="true">
											<h-option  v-for="(items,k) in exchange" :key="k" :value="items.code" >
												{{ items.name }}
											</h-option>
										</h-select>
										<i class="iconfont icon-t-b-delete" title="删除" @click="delCondition(2,k)"></i>
									</td>
								</tr>
							</template>
						</tbody>
					</table>
				</h-form-item>
				<h-form-item label="执行策略：">
					<div class="runmode">
						<RadioGroup v-model="req.executionStrategy.executionStrategyType">
							<Radio :label="1">
								<span>定时</span>
							</Radio>
							<Radio :label="2">
								<span>循环</span>
							</Radio>
						</RadioGroup>
						<div>
							<dl v-if="req.executionStrategy.executionStrategyType == 1" class="timing">
								<dt>
									<TimePicker type="time" v-model="times" style="width: 128px" :clearable="false"></TimePicker>
									<h-button type="primary" @click="addTime">添加</h-button>
								</dt>
								<dd>
									<ul>
										<li v-for="(item,k) in req.executionStrategy.timeList">
											{{ item }}
											<i class="iconfont icon-t-b-delete" title="删除" @click="delTime(k)" ></i></li>
									</ul>
								</dd>
							</dl>
							<ul v-else-if="req.executionStrategy.executionStrategyType == 2">
								<li>开始：<TimePicker type="time" @on-change="onChangeTime" v-model="req.executionStrategy.startTime" style="width: 128px" :clearable="false"></TimePicker></li>
								<li>结束：<TimePicker type="time" v-model="req.executionStrategy.endTime" style="width: 128px"></TimePicker :clearable="false"></li>
								<li>每隔：<Input v-model="req.executionStrategy.interval" style="width: 100px" @on-keyup="formattinginterval"></Input> 分钟</li>
							</ul>
						</div>
					</div>
				</h-form-item>
			</h-form>
		</div>
		<div class="btnbox">
			<h-button type="primary" @click="cancel">取消</h-button>
			<h-button type="primary" @click="save">保存</h-button>
		</div>
		<h-spin fix v-if="isloading">
			<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
			<div>加载中...</div>
		</h-spin>
	</div>
</template>
<script>
export default {
	name: 'RobotwritingTacticsAdd',
	data () {
		var validatorName = (rule, value, callback)=>{
			if(!value){
				callback('请输入分组名称');
				return;
			}else if(value.length > 20){
				callback('不可超过20个字符');
				return;
			}
			callback();
		};
		var validatorStr = (rule, value, callback)=>{
			if(!value){
				callback('请输入');
				return;
			}
			callback();
		};
		return {
			tabsName: '1',
			times: '',
			activeRoutersButton: this.$store.state.activeRoutersButton,
			req: {
				id: '',
				type: 2,
				name: '',
				parentId: '',
				strategyType: 1,
				subStrategyType: '1',
				executionConditionalExpression: '',
				executionStrategy: {
					executionStrategyType: 1,
					startTime: "",
					endTime: '',
					interval: '',
					timeList: []
				},
				timeingStrategy: [],
			},
			weekTimeingStrategy: [],
			monthTimeingStrategy: [],
			month: [],
			sortType: [],
			selectType: [],
			week: [],
			day: [],
			dayType: [],
			id: '',
			pId: '',
			modulesRule:{
				name:[{ required:true, validator: validatorName,trigger:'blur'}],
				executionConditionalExpression: [{ required:true, validator: validatorStr,trigger:'blur'}],
			},
			isInit: false,
			isByType: false,
			isExchange: false,
			isloading: false,
		}
	},
	methods:{
		clickTabs(name){
			this.req.subStrategyType = name;
		},
		onChangeTime(time){
			console.log(time)
			console.log(this.req.executionStrategy);
		},
		//新增周/月策略列表
		addCondition(type){
			if(type == 1){
				let obj = {
					week: '-1',
					daySortType: '',
					daySelectType: '',
					dayType: '',
					exchange: '',
				};
				this.weekTimeingStrategy.push(obj);
			}else if(type == 2){
				let obj = {
					month: '',
					weekSortType: '',
					weekSelectType: '',
					week: '',
					daySortType: '',
					daySelectType: '',
					day: '',
					dayType: '',
					exchange: '',
				};
				this.monthTimeingStrategy.push(obj);
			}
			
		},
		//删除周/月策略里面的列表
		delCondition(type, key){
			if(type == 1){
				this.weekTimeingStrategy.splice(key,1);
			}else if(type == 2){
				this.monthTimeingStrategy.splice(key,1);
			}
		},
		//新增定时时间
		addTime(){
			if(!this.times)return;
			if(this.req.executionStrategy.timeList.indexOf(this.times) != -1){
				this.$hMessage.error({
					content: '该时间已存在！',
					duration: 3
				})
				return;
			}
			this.req.executionStrategy.timeList.push(this.times);
		},
		//删除定时里的时间列表
		delTime(key){
			this.req.executionStrategy.timeList.splice(key,1);
		},
		//格式化每隔N分钟,只可输入数字
		formattinginterval(){
			this.req.executionStrategy.interval = this.req.executionStrategy.interval.replace(/[^\w]/g,'');
		},
		//取消
		cancel(){
			this.$store.commit("DEL_TAB", this.$route.path);
			this.$router.push('/robotwriting/tactics');
		},
		//保存
		save(){
			this.$refs['topForm'].validate((valid) => {
				if (valid) {
					this.setSaveData();
				}
			})
		},
		//发送保存数据
		setSaveData(){
			if(this.isloading)return;
			this.isloading = true;
			let req = this.req;
			if(req.subStrategyType == 1){
				req.timeingStrategy = this.weekTimeingStrategy;
			}else if(req.subStrategyType == 2){
				req.timeingStrategy = this.monthTimeingStrategy;
			}
			let url = '/tm/mw/generationStrategy/save';
			this.$http.post(url,req).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.$hMessage.success('保存成功');
					this.cancel();
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isloading = false;
			}).catch(err=>{
				this.isloading = false;
				this.$hMessage.error('保存失败');
			})
		},
		getDetail(id){
			let url = '/tm/mw/generationStrategy/getById?strategyId='+ id;
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let oData = oTmp.data ? oTmp.data : {};
					if(oData.id != this.id && oData.id != this.copy)return;
					if(this.copy){
						oData.id = null;
						oData.name = oData.name + ' - 复制';
					}
					if(oData.subStrategyType == 1){
						this.weekTimeingStrategy = oData.timeingStrategy || [];
					}else if(oData.subStrategyType == 2){
						this.monthTimeingStrategy = oData.timeingStrategy || [];
					}
					this.tabsName = oData.subStrategyType.toString();
					this.req = oData;
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isloading = false;
			}).catch(err=>{
				this.isloading = false;
				this.$hMessage.error('获取策略详情失败');
			})
		},
		getByType(){
			let url = '/tm/mw/enum/getByType?enumType=1,2,3,4,5,6';
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let oData = oTmp.data ? oTmp.data : {};
					this.sortType = oData['1'];
					this.selectType = oData['2'];
					this.week = oData['3'];
					this.day = oData['4'];
					this.dayType = oData['5'];
					this.month = oData['6'];
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isByType = true;
				this.isPrepareData();
			}).catch(err=>{
				this.isByType = true;
				this.isPrepareData();
				this.$hMessage.error('获取下拉框选项数据失败');
			})
		},
		getExchange(){
			let url = '/tm/mw/enum/getExchangeList';
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let oData = oTmp.data ? oTmp.data : [];
					this.exchange = oData;
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isExchange = true;
				this.isPrepareData();
			}).catch(err=>{
				this.isExchange = true;
				this.isPrepareData();
				this.$hMessage.error('获取交易所数据失败');
			})
		},
		init(){
			let { id, pId,copy } = this.$route.query;
			if(id){
				if(id != this.id){
					this.weekTimeingStrategy = [];
					this.monthTimeingStrategy = [];
					this.tabsName = '1';
					this.times = '';
					this.id = id;
					this.getDetail(id);
				}
			}else{
				this.id = null;
			}
			if(copy){
				if(copy != this.copy){
					this.weekTimeingStrategy = [];
					this.monthTimeingStrategy = [];
					this.tabsName = '1';
					this.times = '';
					this.copy = copy;
					this.getDetail(copy);
				}
			}else{
				this.copy = null;
			}
			if(pId){
				if(pId != this.pId){
					this.pId = pId;
					this.req = {
						id: '',
						type: 2,
						name: '',
						parentId: pId,
						strategyType: 1,
						subStrategyType: '1',
						executionConditionalExpression: '',
						executionStrategy: {
							executionStrategyType: 1,
							startTime: "",
							endTime: '',
							interval: '',
							timeList: []
						},
						timeingStrategy: [],
					};
					this.weekTimeingStrategy = [];
					this.monthTimeingStrategy = [];
					this.tabsName = '1';
					this.times = '';
				}
				this.isloading = false;
			}else{
				this.pId = null;
			}
			
		},
		isPrepareData(){
			if(this.isByType && this.isExchange){
				this.isInit = true;
				this.prepareData();
			}
		},
		prepareData(){
			let { id, pId, copy } = this.$route.query;
			let pathName = '生成策略 - 编辑';
			if(pId || copy){
				pathName = '生成策略 - 新增';
			}
			this.$store.commit('SAVE_TAB_NAME',{  path: this.$route.path , name: pathName});
			if(this.isInit){
				this.init();
			}else{
				this.getByType();
				this.getExchange();
			}
		}
	},
	mounted() {
		this.isloading = true;
		this.prepareData();
	},
	activated: function(){
		this.prepareData();
	},
}
</script>
<style type="text/css" scoped>
.addtactics{
	position: relative;
}
.topbox{
	margin-bottom: 10px;
}
.btnbox{
	text-align: center;
	margin-bottom: 10px;
}
.tab{
	width: 100%;
}
.tab tr{
	height: 40px;
}
.tab td, .tab th{
	border: 1px solid #dfdfdf;
	padding: 0 15px;
}
.tab .add{
	float: right;
}
.tab .add i{
	font-size: 16px;
	cursor: pointer;
}
.tab .iconfont.icon-t-b-delete{
	display: inline-block;
	vertical-align: top;
	cursor: pointer;
	margin-left: 5px;
}
.timing{
	border: 1px solid #dfdfdf;
	display: inline-block;
}
.timing dd{
	border-top: 1px solid #dfdfdf;
	margin-top: 2px;
	background: #fff;
	height: 160px;
	overflow: auto;
}
.timing dd li{
	line-height: 32px;
	padding: 0 5px;
}
.timing dd li:hover{
	background: #efefef;
}
.timing dd li i{
	float: right;
	cursor: pointer;
}
</style>