<template>
	<div class="jyp">
		<i style="display:none">{{ time }}</i>
		<windowDrag leftW="205px" class="detail-drag">
			<div class="jyp-left" slot="left">
				<incident :onEvent="changeCode"></incident>
			</div>
			<div class="jyp-right" slot="right">
				<search-form class="top-search">
					<ul slot="content">
						<li>
							<dl>
								<dt>开始日期：</dt>
								<dd>
									<h-date-picker placement="bottom-start"  type="date" format="yyyy-MM-dd" placeholder="开始日期" v-model="beginDate" @on-change="onChangeBeginDate">
									</h-date-picker>
								</dd>
							</dl>
						</li>
						<li>
							<dl>
								<dt>结束日期：</dt>
								<dd>
									<h-date-picker placement="bottom-start"  type="date" format="yyyy-MM-dd" placeholder="结束日期" v-model="endDate" @on-change="onChangeEndDate" >
									</h-date-picker>
								</dd>
							</dl>
						</li>
						<li>
							<dl>
								<dt>状态：</dt>
								<dd>
									<h-select placeholder="请选择" v-model="req.status">
										<h-option v-for="(item, i) in status" :value="item.value" :key="item.value">
											{{ item.label }}
										</h-option>
									</h-select>
								</dd>
							</dl>
						</li>
						<li class="search-wrapper-but">
							<h-button type="primary" @click="onQuery">查询</h-button>
							<h-button type="primary" @click="onSave" v-if="activeRoutersButton.indexOf('submit') != -1">保存</h-button>
						</li>
					</ul>
				</search-form>
				<search-form class="advanced-search" title="高级搜索" status="conceal">
					<div slot="content" class="adv-contents">
						<div class="adv-left">
							<div class="adv-title">
								<strong>正向条件：</strong>
								<h-button type="primary" @click="addCondition">条件</h-button>
								<h-button type="primary" @click="addForwardCondition">正参数</h-button>
							</div>
							<div class="adv-info">
								<table>
									<tbody>
										<tr v-for="(item,k) in req.forwardCondition">
											<td>
												<h-simple-select v-model="req.forwardCondition[k][0].value" transfer filterable label-in-value @on-change="(data)=>{
													mianSelectChange('forwardCondition', k, data)
												}">
													<h-select-block :data="ConditionTypes"></h-select-block>
												</h-simple-select>
											</td>
											<td v-for="index of req.forwardCondition[k].length - 1">
												<template v-if="(req.forwardCondition[k][0].value && req.forwardCondition[k][index-1].value) || req.forwardCondition[k][index].value">
													<template v-if="ConditionTypesObj[req.forwardCondition[k][0].value].inputType == 2">
														<h-simple-select v-model="req.forwardCondition[k][index].value"  transfer filterable label-in-value @on-change="(data)=>{
															mianSelectChange('forwardCondition', k, data, index)
														}"
														>
														      <h-select-block :data="ConditionTypesObj[req.forwardCondition[k][0].value].children"></h-select-block>
														    </h-simple-select>
													</template>
													<template v-else>
														<h-input v-model="req.forwardCondition[k][index].value" @on-change="changeTime"></h-input>
													</template>
												</template>
											</td>
											<td class="end"></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div class="adv-center">
							<div class="adv-title">
								<strong>负向条件：</strong>
								<h-button type="primary" @click="addReverseCondition">负参数</h-button>
							</div>
							<div class="adv-info">
								<table>
									<tbody>
										<tr v-for="(item,k) in req.reverseCondition">
											<td>
												<h-simple-select v-model="req.reverseCondition[k][0].value" transfer filterable label-in-value disabled @on-change="(data)=>{
													//mianSelectChange('reverseCondition', k, data)
												}">
													<h-select-block :data="ConditionTypes"></h-select-block>
												</h-simple-select>
											</td>
											<td v-for="index of req.reverseCondition[k].length - 1">
												<template v-if="(req.reverseCondition[k][0].value && req.reverseCondition[k][index-1].value) || req.reverseCondition[k][index].value">
													<template v-if="ConditionTypesObj[req.reverseCondition[k][0].value].inputType == 2">
														<h-simple-select v-model="req.reverseCondition[k][index].value" transfer filterable label-in-value @on-change="(data)=>{
															mianSelectChange('reverseCondition', k, data, index)
														}"
														>
														      <h-select-block :data="ConditionTypesObj[req.reverseCondition[k][0].value].children"></h-select-block>
														    </h-simple-select>
													</template>
													<template v-else>
														<h-input @on-change="changeTime" v-model="req.reverseCondition[k][index].value"></h-input>
													</template>
												</template>
											</td>
											<td class="end"></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div class="adv-right">
							<div class="adv-title">
								<strong>条件表达式：</strong>
								<h-button type="primary" @click="onSaveConditionVo">保存条件</h-button>
								<h-button type="primary" @click="onEmptyConditionVo">清空条件</h-button>
							</div>
							<div class="adv-info">
								{{ expression }}
							</div>
						</div>
						<h-spin fix v-if="isSaveConditionVo || isGetConditionVo">
							<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
							<div>加载中...</div>
						</h-spin>
					</div>
				</search-form>
				<div class="news-list">
					<div>
						<h-table size="small" :maxHeight="maxTableHeight" class="full-max-height-table" :columns="table" :data="NewsList" :highlight-row="false" @on-selection-change="selectionList" border></h-table>
					</div>
					<div class="tab-box">
						<span class="select-len">当前已选择 {{ selectNews.length }} 条</span>
						<h-page highlight-row size="small" show-elevator show-total show-sizer placement="top" class="page-box"  :page-size-opts="pageSizeOpts" :total="total" :current="req.pageNum" :page-size="req.pageSize" @on-change="onPageChange" @on-page-size-change="onPageSizeChange"></h-page>
					</div>
					<h-spin fix v-if="isLoading">
						<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
						<div>加载中...</div>
					</h-spin>
				</div>
			</div>
		</windowDrag>
	</div>
</template>
<script type="text/javascript">
import { copyDeep,month_day } from '@/filters/index'
import incident from '../components/incident';
import windowDrag from '@/components/windowDrag';
export default {
	name: 'CorpusImportJyp',
	components: { incident,windowDrag },
	data () {
		return {
			activeRoutersButton: this.$store.state.activeRoutersButton,
			req:{
				pageNum: 1,
				pageSize: 10,
				forwardCondition:[
					[{ value:'',label: ''},{ value:'',label: ''}]
				],
				reverseCondition:[
					[{ value:'',label: ''},{ value:'',label: ''}]
				],
				eventCode: '',
				startDate: '',
				endDate: '',
				status: '',
			},
			queryField: '',
			total: 0,
			pageSizeOpts: [10,20,50,100],
			ConditionTypesObj:{},
			ConditionTypes:[],
			EventList:[],
			NewsList: [],
			exists:{
				1: '是',
				0: '否'
			},
			table: [
				{
					type: "selection",
					width: 60,
					align: "center",
					fixed: "left",
				},
				{
					key: "infoTime",
					title: "信息发布时间",
					width: 150,
				},
				{
					key: "id",
					title: "资讯id",
					width: 120
				},
				{
					key: "newsTitle",
					title: "资讯标题",
					minWidth: 300,
				},
				{
					key: "eventInfo",
					title: "事件标签",
					width: 200,
				},
				{
					key: "subject",
					title: "主体",
					width: 200,
				},
				{
					key: "exists",
					title: "是否导入",
					align: "center",
					width: 80,
					render: (h, params) => {
						let row = params.row;
						return h('span', this.exists[row.exists])
					}
				},
				{
					key: "key",
					title: "操作",
					align: "center",
					width: 60,
					fixed: "right",
					render: (h, params) => {
						let row = params.row;
						let btn;
						if(this.activeRoutersButton.indexOf('view') != -1){
							btn = h('span', {
								attrs: {
									"title": '查看',
								},
								class: [
									'icon-view',
									'iconfont',	                                     
									'tab-icon-btn'
								],
								on: {
									click: () => {
										let obj = {
											forwardCondition: this.req.forwardCondition,
											reverseCondition: this.req.reverseCondition,
											status: this.req.status,
											startDate: this.req.startDate,
											endDate: this.req.endDate,
										}
										localStorage.jyp_search_data = JSON.stringify(obj)
										this.$router.push('/corpus/import/detail?newsId=' + params.row.id);
									}
								},
							})
						}
						return h('div',{
							class: [
								"tab-operation",
							],
						},[btn]);
					}
				}			
			],
			selectNewsData:[],
			selectNews: [],
			isLoading: false,
			isSaveConditionVo: false,
			isGetConditionVo: false,
			time: '',
			expression: '',
			status:[
				{
					value: 1,
					label: '公开',
				},{
					value: 2,
					label: '下架',
				}
			],
			beginDate: '',
			endDate: '',
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods: {
		onChangeBeginDate(date){
			this.req.startDate = date || '';
		},
		onChangeEndDate(date){
			this.req.endDate = date || '';
		},
		onEmptyConditionVo(){
			this.req.forwardCondition = [[{ value:'',label: ''},{ value:'',label: ''}]];
			this.req.reverseCondition = [[{ value:'',label: ''},{ value:'',label: ''}]];
			this.queryField = '';
		},
		getConditionVo(){
			this.isGetConditionVo = true;
			let code = copyDeep(this.req.eventCode)
			let url = '/tm/corpus/condition/getConditionVo?eventCode=' + code;
			this.$http.post(url).then((res)=>{
				let oTmp = res.data || {};
				let data = oTmp.data || {};
				if(this.req.eventCode != code)return;
				if(oTmp.status == this.$api.SUCCESS){
					if(data.flag){
						this.$set(this.req,'forwardCondition',data.forwardCondition);
						this.$set(this.req,'reverseCondition',data.reverseCondition);
						this.queryField = data.queryField;
					}
					this.changeTime();
					//为了解决h-simple-select 的change事件联动问题。
					setTimeout(()=>{
						this.isGetConditionVo = false;
					},200)
					return;
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetConditionVo = false;
			}).catch(err=>{
				this.isGetConditionVo = false;
				this.$hMessage.error('网络错误，获取条件失败！');
			})
		},
		onSaveConditionVo(){
			if(this.req.eventCode == ''){
				this.$hMessage.error('请选择事件列表!');
				return;
			}
			if(this.isSaveConditionVo)return;
			this.isSaveConditionVo = true;
			let url = '/tm/corpus/condition/saveConditionVo';
			let obj = {
				eventCode: this.req.eventCode,
				forwardCondition: this.req.forwardCondition,
				reverseCondition: this.req.reverseCondition,
				queryField: this.queryField
			}
			this.$http.post(url, obj).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.$hMessage.success('条件保存成功！');
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isSaveConditionVo = false;
			}).catch(err=>{
				this.isSaveConditionVo = false;
				this.$hMessage.error('网络错误，条件保存失败！');
			})
		},
		onSave(){
			if(this.selectNews.length == 0){
				this.$hMessage.error('请选择资讯!');
				return;
			}
			this.setSave();
		},
		setSave(){
			if(this.isSetSave)return;
			this.isSetSave = true;
			let url = '/tm/corpus/infomation/saveInformationVoList';
			this.$http.post(url, {
				eventCode: this.req.eventCode,
				importNewsVos : this.selectNewsData
			}).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.$hMessage.success('保存成功');
					this.getNews();
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isSetSave = false;
			}).catch(err=>{
				this.isSetSave = false;
				this.$hMessage.error('获取正负向数据失败');
			})
		},
		selectionList(a,b){
			let list = this.NewsList;
			for(let i = 0,len = list.length; i < len; i++){
				if(b.indexOf(i) != -1){
					if(this.selectNews.indexOf(list[i].id) == -1){
						this.selectNews.push(list[i].id)
						this.selectNewsData.push(list[i]);
					}
				}else{
					let index = this.selectNews.indexOf(list[i].id);
					if(index != -1){
						this.selectNews.splice(index,1);
						this.selectNewsData.splice(index,1);
					}
				}
			}
		},
		emptySelect(){
			this.selectNews = [];
			this.selectNewsData = [];
		},
		onQuery(){
			if(this.req.eventCode == ''){
				this.$hMessage.error('请选择事件列表!');
				return;
			}
			this.onPageChange(1);
		},
		mianSelectChange(type, key, data, index = false){
			if(this.isGetConditionVo)return;
			if(index !== false){
				this.$set(this.req[type][key][index],'label',data.label);
				this.changeTime();
				return;
			}
			this.req[type][key][0].label = data.label;
			if(type == 'forwardCondition'){
				this.req['reverseCondition'][key][0].value = data.value;
				this.req['reverseCondition'][key][0].label = data.label;
			}
			for(let i = 1, len = this.req[type][key].length; i < len;i++){
				this.req[type][key][i] = { value:'',label: ''};
			}
			for(let i = 1, len = this.req['reverseCondition'][key].length; i < len;i++){
				this.req['reverseCondition'][key][i] = { value:'',label: ''};
			}
			this.changeTime();
		},
		changeTime(){
			let forwardCondition = copyDeep(this.req.forwardCondition);
			let reverseCondition = copyDeep(this.req.reverseCondition);
			let str = '';
			for(let i = 0,len = forwardCondition.length; i < len; i++){
				if(!forwardCondition[i][0].label){
					continue;
				}
				let forward = [];
				let reverse = [];
				for(let k = 1,lens = forwardCondition[i].length; k <lens; k++){
					let val = forwardCondition[i][k].label || forwardCondition[i][k].value;
					if(val){
						forward.push(val);
					}
				}
				for(let k = 1,lens = reverseCondition[i].length; k <lens; k++){
					let val = reverseCondition[i][k].label || reverseCondition[i][k].value;
					if(val){
						reverse.push(val);
					}
				}
				str += 'and { '+ forwardCondition[i][0].label;
				if(forward.length != 0 || reverse.length != 0){
					str += ' : ';
					if(forward.length == 1){
						str += forward[0]
					}else{
						let joins = forward.join(' or ');
						if(reverse.length > 0 &&  forward.length > 0){
							str += ' { '+ joins +' } ';
						}else{
							str += joins;
						}
					}
					if(reverse.length == 1){
						str += ' not ' + reverse[0]
					}else if(reverse.length != 0){
						let joins = reverse.join(' or ');
						str += ' not { '+ joins +' } ';
					}
				}
				str += ' } '; 
			}
			if(str.indexOf('and ') === 0){
				str = str.slice(4)
			}
			this.expression = str;
			this.time = (new Date()).getTime();
		},
		onPageSizeChange(size){
			this.req.pageSize = size;
			this.onPageChange(1);
		},
		onPageChange(val){
			this.req.pageNum = val;
			this.getNews();
		},
		addCondition(){
			let a = [],b = [];
			for(let i = 0, len = this.req.forwardCondition[0].length; i < len; i++){
				a.push({ value:'',label: ''});
			}
			for(let i = 0, len = this.req.reverseCondition[0].length; i < len; i++){
				b.push({ value:'',label: ''});
			}
			this.req.forwardCondition.push(a);
			this.req.reverseCondition.push(b);
			
		},
		addForwardCondition(){
			for(let i = 0,len = this.req.forwardCondition.length; i < len; i++){
				this.req.forwardCondition[i].push({ value:'',label: ''});
			}
		},
		addReverseCondition(){
			for(let i = 0,len = this.req.reverseCondition.length; i < len; i++){
				this.req.reverseCondition[i].push({ value:'',label: ''});
			}
		},
		changeCode(code){
			this.req.eventCode = code;
			this.getConditionVo();
			this.emptySelect();
			this.NewsList = [];
			this.total = 0;
			this.req.pageNum = 1;
		},
		getConditionTypes(){
			let url = '/tm/corpus/common/conditionTypes';
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let list = oTmp.data || [];
					this.ConditionTypes = list;
					for(let i = 0, len = list.length; i < len; i++){
						this.ConditionTypesObj[list[i].value] = list[i];
					}
				}else{
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				this.$hMessage.error('获取正负向数据失败');
			})
		},
		getNews(go = false){
			if(this.isLoading && !go)return;
			this.isLoading = true;
			let url = '/tm/corpus/news/queryNewsImportPage';
			this.$http.post(url, this.req).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let list = oTmp.data.records || [];
					let total = oTmp.data.total || 0;
					if(total && list.length == 0){
						this.req.pageNum = Math.ceil(total/this.req.pageSize)
						this.getNews(true);
						return;
					}
					this.emptySelect();
					for(let i = 0,len = list.length; i < len; i++){
						if(this.selectNews.indexOf(list[i].id) != -1){
							list[i]['_checked'] = true;
						}
					}
					this.NewsList = list;
					this.total = total;
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isLoading = false;
			}).catch(err=>{
				this.isLoading = false;
				this.$hMessage.error('查询JYP数据失败');
			})
		},
	},
	mounted() {
		this.beginDate = month_day(1);
		this.endDate = month_day(0);
		this.getConditionTypes();
		//this.getNews();
	}
}
</script>
<style type="text/css" scoped>
.jyp{
	display: flex;
	width: 100%;
	height: 100%;
	border: 1px solid #dfdfdf;
	background: #fff;
}
.jyp .jyp-left{
	width: 100%;
	min-width: 200px;
	height: 100%;
}
.jyp .jyp-right{
	padding: 10px;
	width: 100%;
	overflow: auto;
	min-width: 700px;
	min-height: 100%;
}
.news-list{
	margin-top: 10px;
	position: relative;
}
.adv-contents{
	font-size: 12px;
	display: flex;
	position: relative;
}
.adv-left,.adv-center,.adv-right{
	width: calc((100% - 30px)/3);
}
.adv-center{
	margin: 0 15px;
}
.adv-title{
	display: flex;
}
.adv-title strong{
	font-weight: 600;
	line-height: 28px;
	flex: 1;
}
.adv-contents .h-btn{
	height: 28px;
	line-height: 28px;
	padding-top: 0;
    padding-bottom: 0;
    margin-left: 5px;
}
.adv-info{
	border: 1px solid #888;
	margin-top: 10px;
	height: calc(100% - 38px);
	overflow:auto; 
	max-height: 180px;
}
.adv-info table{
	table-layout:fixed;
	width: 100%;
	border-top: 1px solid #dfdfdf;
	border-left: 1px solid #dfdfdf;
}
.adv-info table td{
	width: 120px;
	padding: 0 5px;
	border-right: 1px solid #dfdfdf;
}
.adv-info table tr{
	border-bottom: 1px solid #dfdfdf;
}
.adv-info table .end{
	width: auto;
}
.adv-right .adv-info{
	padding: 5px;
	word-wrap: break-word;
}

.tab-box{
	position: relative;
}
.select-len{
	position: absolute;
	line-height: 26px;
	color: red;
	top: 0;
	left: 0;
}
</style>