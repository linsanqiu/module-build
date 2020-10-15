<template>
	<div class="report">
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>要素名称：</dt>
						<dd>
							<h-input ref="keyword" v-model.trim="keyword"  placeholder="要素名称" icon="android-close" @on-keyup.enter="paramsSub()" @on-click="clear()"></h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>关系：</dt>
						<dd>
							<h-select v-model="type" placeholder="关系" :clearable="false">
								<h-option v-for="item in relationTypeList" :value="item.type" :key="item.type">{{ item.relation }}</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="paramsSub()">查询</h-button>
					<h-button type="primary" @click="onAdd" v-if="activeRoutersButton.indexOf('RelationAdd') != -1">新增</h-button>
				</li>
			</ul>
		</search-form>
		<div class="content-wrapper">
			<div class="list">
				<h-table :maxHeight="maxTableHeight" :loading="loading" border stripe class="full-max-height-table user-search-list-tab" size="small" :columns="columns" :data="dataList"></h-table>
			</div>
			<div class="page-box">				
				<h-page :total="total" :page-size="pageSize" size="small" :current="pageNum" @on-page-size-change="onPageSizeChange" @on-change="onPageChange" show-elevator show-total></h-page>
			</div>
		</div>

		<h-msgBox
			title="链谱关系"
			:mask-closable="false"
			width="600"
			v-model="addModal">
			<div>
				<h-form ref="formInline" :rules="ruleInline" :model="relationInfo" :label-width="160" @submit.native.prevent>
					
					<h-form-item label="要素1">
						<h-row>
							<h-col span="7">
								<h-form-item prop="firstPartKey">
									<h-select v-model="relationInfo.firstPartKey" placeholder="类型" @on-change="firstPartChange()">
										<h-option value="" >请选择</h-option>
										<h-option v-for="item in factorTypeList" :value="item.type" :key="item.type">{{ item.name }}</h-option>
									</h-select>
								</h-form-item>
							</h-col>
							<h-col span="17">
								<h-form-item prop="firstPartValue">
									<h-select
										v-model="relationInfo.firstPartValue"
										filterable
										remote
										:remote-method="factorRemoteMethod1"
										:loading="factorRemoteLoading1">
										<h-option v-for="option in factorRemoteList1" :value="option.code" :key="option.code">{{option.result}}</h-option>
									</h-select>
								</h-form-item>
							</h-col>
						</h-row>
					</h-form-item>
					<h-form-item label="关系" prop="relation">
						<h-select v-model="relationInfo.relation" placeholder="关系" @on-change="relationChange">
							<h-option value="" >请选择</h-option>
							<h-option v-for="item in relationTypeList" :value="item.type" :key="item.type">{{ item.relation }}</h-option>
						</h-select>
					</h-form-item>
					<h-form-item label="要素2">
						<h-row>
							<h-col span="7">
								<h-form-item prop="secondPartKey">
									<h-select v-model="relationInfo.secondPartKey" placeholder="类型" @on-change="secondPartChange()">
										<h-option value="" >请选择</h-option>
										<h-option v-for="item in factorTypeList" :value="item.type" :key="item.type">{{ item.name }}</h-option>
									</h-select>
								</h-form-item>
							</h-col>
							<h-col span="17"> 
								<h-form-item prop="secondPartValue">
									<h-select
										v-model="relationInfo.secondPartValue"
										filterable
										remote
										:remote-method="factorRemoteMethod2"
										:loading="factorRemoteLoading2">
										<h-option v-for="option in factorRemoteList2" :value="option.code" :key="option.code">{{option.result}}</h-option>
									</h-select>
								</h-form-item>
							</h-col>
						</h-row>
					</h-form-item>
					<h-form-item v-if="weightsStrFlag" label="权重（%）" prop="weightsStr" :validRules="weightRule">
						<h-input v-model.trim="relationInfo.weightsStr"  placeholder="请填写"></h-input>	
					</h-form-item>
					<h-form-item v-if="dataSourceFlag" label="数据来源" prop="dataSource">
						<h-input v-model.trim="relationInfo.dataSource"  placeholder="请填写"></h-input>	
					</h-form-item>
					<h-form-item v-if="enableDateStrFlag" label="启用日期" prop="enableDateStr">
						<h-date-picker showFormat type="date" format="yyyy-MM-dd" placeholder="请选择" v-model="relationInfo.enableDateStr"></h-date-picker>
					</h-form-item>
					<h-form-item v-if="endDateStrFlag" label="结束日期" prop="endDateStr">
						<h-date-picker showFormat type="date" format="yyyy-MM-dd" placeholder="请选择" v-model="relationInfo.endDateStr"></h-date-picker>
					</h-form-item>
					<h-form-item v-if="corpImportantProductWeightsStrFlag" label="企业重要产品权重（%）" prop="corpImportantProductWeightsStr" :validRules="weightRule">
						<h-input v-model.trim="relationInfo.corpImportantProductWeightsStr"  placeholder="请填写"></h-input>
					</h-form-item>
					<h-form-item v-if="productFamousCorpWeightsStrFlag" label="产品知名企业权重（%）" prop="productFamousCorpWeightsStr" :validRules="weightRule">
						<h-input v-model.trim="relationInfo.productFamousCorpWeightsStr"  placeholder="请填写"></h-input>	
					</h-form-item>
					<h-form-item v-if="spokespersonProfileFlag" label="代言人简介" prop="spokespersonProfile">
						<h-input v-model.trim="relationInfo.spokespersonProfile"  placeholder="请填写"></h-input>	
					</h-form-item>
					<h-form-item v-if="corpRelationTypeFlag" label="企业关系类型" prop="corpRelationType">
						<h-input v-model.trim="relationInfo.corpRelationType"  placeholder="请填写"></h-input>	
					</h-form-item>
					<h-form-item v-if="serialNumberFlag" label="序号" prop="serialNumber" :validRules="integeRule">
						<h-input v-model.trim="relationInfo.serialNumber"  placeholder="请填写"></h-input>	
					</h-form-item>

					<h-form-item v-if="publishDateStrFlag" label="信息发布日期" prop="publishDateStr">
						<h-date-picker showFormat type="date" format="yyyy-MM-dd" placeholder="请选择" v-model="relationInfo.publishDateStr"></h-date-picker>
					</h-form-item>
					<h-form-item v-if="jobStartDateStrFlag" label="任职起始日" prop="jobStartDateStr">
						<h-date-picker showFormat type="date" format="yyyy-MM-dd" placeholder="请选择" v-model="relationInfo.jobStartDateStr"></h-date-picker>
					</h-form-item>
					<h-form-item v-if="jobEndDateStrFlag" label="任职截止日" prop="jobEndDateStr">
						<h-date-picker showFormat type="date" format="yyyy-MM-dd" placeholder="请选择" v-model="relationInfo.jobEndDateStr"></h-date-picker>
					</h-form-item>
					<h-form-item v-if="positionTypeFlag" prop="positionType" label="职位类别">
						<h-select v-model="relationInfo.positionType" placeholder="请选择" :clearable="false">
							<h-option value="" >请选择</h-option>
							<h-option v-for="item in positionTypeList" :value="item.dm" :key="item.dm">{{ item.ms }}</h-option>
						</h-select>
					</h-form-item>
					<h-form-item v-if="changeReasonFlag" prop="changeReason" label="变动原因">
						<h-select v-model="relationInfo.changeReason" placeholder="请选择" :clearable="false">
							<h-option value="" >请选择</h-option>
							<h-option v-for="item in changeReasonList" :value="item.dm" :key="item.dm">{{ item.ms }}</h-option>
						</h-select>
					</h-form-item>
					<h-form-item v-if="changeReasonDesFlag" label="变动原因说明" prop="changeReasonDes">
						<h-input v-model.trim="relationInfo.changeReasonDes"  placeholder="请填写"></h-input>	
					</h-form-item>
					<h-form-item v-if="onJobFlag" prop="onJob" label="在职与否">
						<h-select v-model="relationInfo.onJob" placeholder="请选择" :clearable="false">
							<h-option value="" >请选择</h-option>
							<h-option v-for="item in onJobList" :value="item.dm" :key="item.dm">{{ item.ms }}</h-option>
						</h-select>
					</h-form-item>
					<h-form-item v-if="remarksFlag" label="备注" prop="remarks">
						<h-input v-model.trim="relationInfo.remarks"  placeholder="请填写"></h-input>	
					</h-form-item>
					<h-form-item v-if="pubTypeFlag" label="公示类型" prop="pubType">
						<h-select v-model="relationInfo.pubType" placeholder="请选择" :clearable="false">
							<h-option value="" >请选择</h-option>
							<h-option v-for="item in pubTypeList" :value="item.dm" :key="item.dm">{{ item.ms }}</h-option>
						</h-select>
					</h-form-item>
					<h-form-item v-if="currencyFlag" prop="currency" label="币种">
						<h-select v-model="relationInfo.currency" placeholder="请选择" :clearable="false">
							<h-option value="" >请选择</h-option>
							<h-option v-for="item in currencyList" :value="item.dm" :key="item.dm">{{ item.ms }}</h-option>
						</h-select>
					</h-form-item>
					<h-form-item v-if="subscripStrFlag" label="认缴金额(元)" prop="subscripStr" :validRules="moneyRule">
						<h-input v-model.trim="relationInfo.subscripStr"  placeholder="请填写"></h-input>	
					</h-form-item>
					<h-form-item v-if="paymentStrFlag" label="实缴金额(元)" prop="paymentStr" :validRules="moneyRule">
						<h-input v-model.trim="relationInfo.paymentStr"  placeholder="请填写"></h-input>	
					</h-form-item>
					<h-form-item v-if="investmentStrFlag" label="投资金额(元)" prop="investmentStr" :validRules="moneyRule">
						<h-input v-model.trim="relationInfo.investmentStr"  placeholder="请填写"></h-input>	
					</h-form-item>
					<h-form-item v-if="holdRatioStrFlag" label="持股比例(%)" prop="holdRatioStr" :validRules="ratioRule">
						<h-input v-model.trim="relationInfo.holdRatioStr"  placeholder="请填写"></h-input>	
					</h-form-item>


				</h-form>
			</div>

			<div slot="footer">
				<h-button @click="addModal = false" type="text" size="large">取消</h-button>
				<h-button v-if="activeRoutersButton.indexOf('RelationAdd') != -1" @click="saveRelation('formInline')" :loading="addLoading" type="primary" size="large">确定</h-button>
			</div>
			
		</h-msgBox>
	</div>
</template>
<script>
	export default {
		name: 'product',
		data () {
			const validateEmpty = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('不能为空'));
				}
			};
			return{
				activeRoutersButton: this.$store.state.activeRoutersButton,
				keyword:'',
				total:0,
				pageSize:12,
				pageNum:1,
				dataList:[],
				columns:[
					{
						title: '要素1',
						key: 'part1'
					},
					{
						title: '关系',
						key: 'relation'
					},
					{
						title: '要素2',
						key: 'part2'
					},
					{
						title: '操作时间',
						key: 'updateTime'
					},
					{
						title: '处理人',
						key: 'updater'
					},
					{
						title: '操作',
						key:'action',
						width: 120,
						render: (h, params) => {
							let editBtn = null;
							let deleteBtn = null;
							let inChain = null;
							let outChain = null;
							editBtn = h('i',{
								class: {
									'iconfont': true,
									'icon-t-b-message': true,
									'tab-icon-btn': true,
								},
								attrs:{'title':'编辑'},
								on: {
									click: () => {
										this.onEdit(params.row);
									}
								}
							});
							if(this.activeRoutersButton.indexOf('RelationDel') != -1){
								deleteBtn =  h('h-poptip',{
								   on: {
									   'on-ok': ()=> {
										   this.del(params.row);
									   },
								   },
								   props: {
									   placement: 'top-end',
									   title: '是否删除？',
									   confirm: true,
									   width: 150
								   }
								},[
									h('i', {
										class: {
											'iconfont': true,
											'icon-t-b-delete': true,
											'tab-icon-btn': true,
										},
										attrs: {
											title: '删除',
										},
										style: {
											marginLeft: '10px'
										}
									})
								]);
							}
							return h('div',[deleteBtn]);

						}
					},
				],
				loading: true,
				keyword_copy: '',
				type: '1',
				type_copy: '1',
				relationTypeList: [],
				factorTypeList: [],
				addModal: false,
				factorRemoteLoading1: false,
				factorRemoteLoading2: false,
				factorRemoteList1: [],
				factorRemoteList2: [],
				currencyList: [],
				positionTypeList: [],
				changeReasonList: [],
				onJobList: [
					{
					  "dm": "1",
					  "ms": "是"
					},
					{
					  "dm": "2",
					  "ms": "否"
					},
				],
				pubTypeList: [
					{
					  "dm": "1",
					  "ms": "工商公示"
					},
					{
					  "dm": "2",
					  "ms": "公司公示"
					},
				],
				relationInfo: {
					relation: '',
					firstPartKey: '',
					firstPartValue: '',
					secondPartKey: '',
					secondPartValue: '',
					weightsStr: '',
					dataSource: '',
					enableDateStr: '',
					endDateStr: '',
					corpImportantProductWeightsStr: '',
					productFamousCorpWeightsStr: '',
					spokespersonProfile: '',
					corpRelationType: '',
					serialNumber: '',

					publishDateStr: '',
					jobStartDateStr: '',
					jobEndDateStr: '',
					positionType: '',
					changeReason: '',
					changeReasonDes: '',
					onJob: '',
					remarks: '',
					pubType: '',
					currency: '',
					subscripStr: '',
					paymentStr: '',
					investmentStr: '',
					holdRatioStr: '',
				},
				ruleInline: {
					firstPartKey: [
						{ required: true, message: '请选择要素类型', trigger: 'change' }
					],
					firstPartValue: [
						{ required: true, message: '请选择要素名称', trigger: 'change' }
					],
					secondPartKey: [
						{ required: true, message: '请选择要素类型', trigger: 'change' }
					],
					secondPartValue: [
						{ required: true, message: '请选择要素名称', trigger: 'change' }
					],
					relation: [
						{ required: true, message: '请选择关系类型', trigger: 'change' }
					],
					dataSource: [
						{ type: 'string', max: 100, message: '数据来源不能多于100字', trigger: 'blur' }
					],
					corpRelationType: [
						{ type: 'string', max: 50, message: '企业关系类型不能多于50字', trigger: 'blur' }
					],
					changeReasonDes: [
						{ type: 'string', max: 500, message: '变动原因说明不能多于500字', trigger: 'blur' }
					],
					remarks: [
						{ type: 'string', max: 500, message: '备注不能多于500字', trigger: 'blur' }
					],
				},
				weightRule: [{test:/^((0|[1-9][0-9]{0,11}?)([.][0-9]{1,6})?)?$/, message:'整数最多12位，小数最多6位',trigger:'blur'}],
				moneyRule: [{test:/^((0|[1-9][0-9]{0,15}?)([.][0-9]{1,6})?)?$/, message:'整数最多16位，小数最多6位',trigger:'blur'}],
				ratioRule: [{test:/^((0|[1-9][0-9]{0,2}?)([.][0-9]{1,6})?)?$/, message:'整数最多3位，小数最多6位',trigger:'blur'}],
				addLoading: false,
				integeRule: ['intege'],
				dynamicField: {},
				enableDateStrFlag: false,
				serialNumberFlag: false,
				corpRelationTypeFlag: false,
				corpImportantProductWeightsStrFlag: false,
				weightsStrFlag: false,
				dataSourceFlag: false,
				productFamousCorpWeightsStrFlag: false,
				endDateStrFlag: false,
				spokespersonProfileFlag: false,

				publishDateStrFlag: false,
				jobStartDateStrFlag: false,
				jobEndDateStrFlag: false,
				positionTypeFlag: false,
				changeReasonFlag: false,
				changeReasonDesFlag: false,
				onJobFlag: false,
				remarksFlag: false,
				pubTypeFlag: false,
				currencyFlag: false,
				subscripStrFlag: false,
				paymentStrFlag: false,
				investmentStrFlag: false,
				holdRatioStrFlag: false,

			}
		},
		computed: {
			maxTableHeight(){ return this.$store.state.maxTableHeight },
		},
		methods:{
			paramsSub() {
				this.keyword_copy = this.keyword
				this.type_copy = this.type
				this.pageNum = 1
				this.search()
			},
			search() {
				this.loading = true
				let params = {
					searchKey: this.keyword_copy.trim(),
					type: this.type_copy,
				}
				let url = '/tm/chain/relation/search?pageNum=' + this.pageNum + '&limit=' + this.pageSize + '&params=' + encodeURIComponent(JSON.stringify(params))
				this.$http.get(url).then((res)=>{
					let tmpObj = res.data
					if(tmpObj.status == this.$api.SUCCESS){
						this.dataList = tmpObj.data.list
						this.total = tmpObj.data.total		
					}else{
						this.dataList = []
						this.total = 0
					}
					this.loading = false
				}).catch(err=>{
					this.dataList = []
					this.total = 0
					this.loading = false
				})
			},
			onPageChange(page){
				this.keyword = this.keyword_copy
				this.type = this.type_copy
				this.pageNum = page
				this.search()
			},
			onPageSizeChange(size) {
				this.keyword = this.keyword_copy
				this.type = this.type_copy
				this.pageSize=size
				this.pageNum = 1
				this.search()
			},
			clear() {
				this.keyword = ''
				this.$refs.keyword.focus()
			},
			importIn(){

			},
			onAdd(){
				this.addLoading = false
				this.$refs['formInline'].resetFields();
				this.addModal = true
			},
			onEdit(row){
				this.$router.push({path: '/chainspectrum/product/edit', query: {id: row.id}})
			},
			getRelationType() {
				let url = '/tm/chain/relation/type'
				this.$http.get(url).then((res)=>{
					let tmpObj = res.data
					if(tmpObj.status == this.$api.SUCCESS){
						this.relationTypeList = tmpObj.data		
					}else{
						this.relationTypeList = []
					}
				}).catch(err=>{
					this.relationTypeList = []
				})
			},
			getFactorType() {
				let url = '/tm/chain/relation/factor/type'
				this.$http.get(url).then((res)=>{
					let tmpObj = res.data
					if(tmpObj.status == this.$api.SUCCESS){
						this.factorTypeList = tmpObj.data		
					}else{
						this.factorTypeList = []
					}
				}).catch(err=>{
					this.factorTypeList = []
				})
			},
			getCurrencyType() {
				let url = '/tm/chain/relation/currency'
				this.$http.get(url).then((res)=>{
					let tmpObj = res.data
					if(tmpObj.status == this.$api.SUCCESS){
						this.currencyList = tmpObj.data		
					}else{
						this.currencyList = []
					}
				}).catch(err=>{
					this.currencyList = []
				})
			},
			getPositionType() {
				let url = '/tm/chain/relation/positionType'
				this.$http.get(url).then((res)=>{
					let tmpObj = res.data
					if(tmpObj.status == this.$api.SUCCESS){
						this.positionTypeList = tmpObj.data		
					}else{
						this.positionTypeList = []
					}
				}).catch(err=>{
					this.positionTypeList = []
				})
			},
			getReasonsForChangeJobType() {
				let url = '/tm/chain/relation/reasonsForChangeJob'
				this.$http.get(url).then((res)=>{
					let tmpObj = res.data
					if(tmpObj.status == this.$api.SUCCESS){
						this.changeReasonList = tmpObj.data		
					}else{
						this.changeReasonList = []
					}
				}).catch(err=>{
					this.changeReasonList = []
				})
			},
			factorRemoteMethod1(query) {
				if (query !== null && query !== '') {
					let params = {
						searchKey: query.trim(),
						type: this.relationInfo.firstPartKey,
					}
					this.factorRemoteLoading1 = true;
					let url = '/tm/chain/relation/factor/search?pageNum=1&limit=10' + '&params=' + encodeURIComponent(JSON.stringify(params))
					this.$http.get(url)
						.then((response) => {
							var obj = eval(response.data)
							this.factorRemoteList1 = obj.data
							this.factorRemoteLoading1 = false
						})
						.catch(function (err) {
							console.log(err)
						})
				} else {
					this.factorRemoteList1 = [];
				}
			},
			factorRemoteMethod2(query) {
				if (query !== null && query !== '') {
					let params = {
						searchKey: query.trim(),
						type: this.relationInfo.secondPartKey,
					}
					this.factorRemoteLoading2 = true;
					let url = '/tm/chain/relation/factor/search?pageNum=1&limit=10' + '&params=' + encodeURIComponent(JSON.stringify(params))
					this.$http.get(url)
						.then((response) => {
							var obj = eval(response.data)
							this.factorRemoteList2 = obj.data
							this.factorRemoteLoading2 = false
						})
						.catch(function (err) {
							console.log(err)
						})
				} else {
					this.factorRemoteList2 = [];
				}
			},
			firstPartChange() {
				this.relationInfo.firstPartValue = ''
			},
			secondPartChange() {
				this.relationInfo.secondPartValue = ''
			},
			saveRelation(name) {
				this.$refs[name].validate((valid) => {
					if (valid) {
						this.save()
					}
				})
			},
			save() {
				this.addLoading = true
				let url = '/tm/chain/relation/save'
				this.$http.post(url, this.relationInfo).then((res)=>{
					let tmpObj = res.data;
					if(tmpObj.status == this.$api.SUCCESS){
						this.$hMessage.success('保存成功!')
						this.search()
						this.addModal = false
						this.addLoading = false
					} else {
						this.$hMessage.info(tmpObj.msg)
						this.addLoading = false
					}
				}).catch(err=>{
					this.$hMessage.error('发生未知错误!')
					this.addLoading = false
				})
			},
			del(row) {
				let id = row.id
				let url = '/tm/chain/relation/delete?id=' + id + '&type=' + row.type
				let length = this.dataList.length
				this.$http.delete(url).then((res)=>{
					let tmpObj = res.data;
					if(tmpObj.status == this.$api.SUCCESS){
						if(length == 1 && this.pageNum > 1) {
							this.pageNum = this.pageNum - 1
						}
						this.search()
						this.$hMessage.success('删除成功!')
					} else {
						this.$hMessage.error(tmpObj.msg)
					}
				}).catch(err=>{
					this.$hMessage.error('发生未知错误!')
				})
			},
			getDynamicfield() {
				let url = '/tm/chain/relation/dynamicfield'
				this.$http.get(url).then((res)=>{
					let tmpObj = res.data
					if(tmpObj.status == this.$api.SUCCESS){
						this.dynamicField = tmpObj.data		
					}else{
						this.dynamicField = {}
					}
				}).catch(err=>{
					this.dynamicField = {}
				})
			},
			relationChange(value) {
				this.relationInfo.enableDateStr = ''
				this.relationInfo.serialNumber = ''
				this.relationInfo.corpRelationType = ''
				this.relationInfo.corpImportantProductWeightsStr = ''
				this.relationInfo.weightsStr = ''
				this.relationInfo.dataSource = ''
				this.relationInfo.productFamousCorpWeightsStr = ''
				this.relationInfo.endDateStr = ''

				this.relationInfo.publishDateStr = ''
				this.relationInfo.jobStartDateStr = ''
				this.relationInfo.jobEndDateStr = ''
				this.relationInfo.positionType = ''
				this.relationInfo.changeReasonDes = ''
				this.relationInfo.changeReason = ''
				this.relationInfo.onJob = ''
				this.relationInfo.remarks = ''
				this.relationInfo.pubType = ''
				this.relationInfo.currency = ''
				this.relationInfo.subscripStr = ''
				this.relationInfo.paymentStr = ''
				this.relationInfo.investmentStr = ''
				this.relationInfo.holdRatioStr = ''

				let enableDateStr = this.dynamicField.enableDateStr
				let serialNumber = this.dynamicField.serialNumber
				let corpRelationType = this.dynamicField.corpRelationType
				let corpImportantProductWeightsStr = this.dynamicField.corpImportantProductWeightsStr
				let weightsStr = this.dynamicField.weightsStr
				let dataSource = this.dynamicField.dataSource
				let productFamousCorpWeightsStr = this.dynamicField.productFamousCorpWeightsStr
				let endDateStr = this.dynamicField.endDateStr
				let spokespersonProfile = this.dynamicField.spokespersonProfile

				let publishDateStr = this.dynamicField.publishDateStr
				let jobStartDateStr = this.dynamicField.jobStartDateStr
				let jobEndDateStr = this.dynamicField.jobEndDateStr
				let positionType = this.dynamicField.positionType
				let changeReason = this.dynamicField.changeReason
				let changeReasonDes = this.dynamicField.changeReasonDes
				let onJob = this.dynamicField.onJob
				let remarks = this.dynamicField.remarks
				let pubType = this.dynamicField.pubType
				let currency = this.dynamicField.currency
				let subscripStr = this.dynamicField.subscripStr
				let paymentStr = this.dynamicField.paymentStr
				let investmentStr = this.dynamicField.investmentStr
				let holdRatioStr = this.dynamicField.holdRatioStr				

				this.enableDateStrFlag = enableDateStr.indexOf(value) > -1
				this.serialNumberFlag = serialNumber.indexOf(value) > -1
				this.corpRelationTypeFlag = corpRelationType.indexOf(value) > -1
				this.corpImportantProductWeightsStrFlag = corpImportantProductWeightsStr.indexOf(value) > -1
				this.weightsStrFlag = weightsStr.indexOf(value) > -1
				this.dataSourceFlag = dataSource.indexOf(value) > -1
				this.productFamousCorpWeightsStrFlag = productFamousCorpWeightsStr.indexOf(value) > -1
				this.endDateStrFlag = endDateStr.indexOf(value) > -1
				this.spokespersonProfileFlag = spokespersonProfile.indexOf(value) > -1

				this.publishDateStrFlag = publishDateStr.indexOf(value) > -1
				this.jobStartDateStrFlag = jobStartDateStr.indexOf(value) > -1
				this.jobEndDateStrFlag = jobEndDateStr.indexOf(value) > -1
				this.positionTypeFlag = positionType.indexOf(value) > -1
				this.changeReasonFlag = changeReason.indexOf(value) > -1
				this.changeReasonDesFlag = changeReasonDes.indexOf(value) > -1
				this.onJobFlag = onJob.indexOf(value) > -1
				this.pubTypeFlag = pubType.indexOf(value) > -1
				this.remarksFlag = remarks.indexOf(value) > -1
				this.currencyFlag = currency.indexOf(value) > -1
				this.subscripStrFlag = subscripStr.indexOf(value) > -1
				this.paymentStrFlag = paymentStr.indexOf(value) > -1
				this.investmentStrFlag = investmentStr.indexOf(value) > -1
				this.holdRatioStrFlag = holdRatioStr.indexOf(value) > -1
			}
		},
		mounted(){
			this.getRelationType()
			this.search()
			this.getFactorType()
			this.getDynamicfield()
			this.getCurrencyType()
			this.getPositionType()
			this.getReasonsForChangeJobType()
		}
	}
</script>


<style type="text/css" scoped>
.report > .search {
	line-height: 32px
}
.report > .search{
	width: 100%;
	display: inline-block;
}
.report > .search .h-input-wrapper,.report > .search .h-select{
	width: 220px;
	margin-right: 10px;
	vertical-align: top;
	float: left;
	margin-bottom: 10px;
}
.report > .search .h-select{
	width: 120px;
}
.report > .search .title,.report > .search .h-btn{
	float: left;
	margin-bottom: 10px;
}
.report > .search .h-btn{
	margin-right: 10px;
}
</style>