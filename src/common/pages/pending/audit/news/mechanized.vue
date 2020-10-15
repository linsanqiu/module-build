<template>
	<div class="mechanized">
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>发布日期：</dt>
						<dd><h-date-picker type="datetimerange" :value="defaultDate" format="yyyy-MM-dd" aria-placeholder="发布日期" placeholder="开始日期 - 结束日期" @on-change="onChangeIssueDate"></h-date-picker></dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>资讯ID：</dt>
						<dd>
							<h-input aria-placeholder="资讯 ID" placeholder="请输入资讯 ID" v-model="oReq.newsId" @on-enter="onExamine" icon="android-close" @on-click="onEmpty('newsId')" ref="newsId" ></h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>概率范围：</dt>
						<dd class="header">
							<h-form :model="oReq" :label-width="0" :rules="ruleValidate" ref="oReqform">
								<ul class="flex">
									<li class="flex1">
										<h-form-item label="下限" prop="probabilityLowerLimit">
											<h-input placeholder="下限" v-model="oReq.probabilityLowerLimit" @on-click="onEmpty('probabilityLowerLimit')" ref="probabilityLowerLimit" ></h-input>
										</h-form-item>
									</li>
									<li class="to">-</li>
									<li class="flex1">
										<h-form-item label="上限" prop="probabilitySuperiorLimit">
											<h-input placeholder="上限" v-model="oReq.probabilitySuperiorLimit" @on-click="onEmpty('probabilitySuperiorLimit')" ref="probabilitySuperiorLimit" ></h-input>
										</h-form-item>
									</li>
								</ul>
							</h-form>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>自动屏蔽类型：</dt>
						<dd>
							<h-select aria-placeholder="自动屏蔽类型" placeholder="请选择类型" v-model="oReq.shieldType" clearable >
								<h-option v-for="(item, i) in aShieldReason" :value="item.type.toString()" :key="i" >
									{{ item.desc }}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" data-ref="init-btn" @click="onExamine">查询</h-button>
				</li>
			</ul>
		</search-form>
		<div class="content-wrapper">
			<div class="list">
				<h-table class="full-max-height-table" :maxHeight="maxTableHeight" border :columns="headerData" :data="aNewsList" size="small" ></h-table>
			</div>
			<div class="page-box">
				<h-page :total="intTotal" :page-size="oReq.size" :current="oReq.current" @on-change="onPageChange" show-total size="small"></h-page>
			</div>
			<Spin fix v-if="isShowSpin">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</Spin>
		</div>
	</div>
</template>
<script>
import simplePage from '@/components/simple-page'
import { TODAY } from "./utils";
export default {
	name: "AuditNewsMechanized",
	components: {
		simplePage
	},
	data () {
		var validatorMin = (rule, value, callback)=>{
			if(value){
			　　if (isNaN(value)) { 
			　　　　callback('请输入有效数字');
					return;
			　　}
			}
			callback();
		};
		var validatorMax = (rule, value, callback)=>{
			if(value){
			　　if (isNaN(value)) { 
			　　　　callback('请输入有效数字');
					return;
			　　}
			}
			callback();
		};
		return {
			activeRoutersButton: this.$store.state.activeRoutersButton,
			defaultDate: [TODAY,TODAY],
			intTotal: 0,
			isShowSpin: false,
			oReq:{
				current: 1,
				size: 120,
				newsId: '',
				shieldType: '',
				probabilityLowerLimit: '',
				probabilitySuperiorLimit: '',
				startTime: TODAY,
				endTime: TODAY,
			},
			aShieldReason: [],
			headerData: [
				{
					title: '资讯标题',
					key: 'newsTitle',
					width: 410,
					fixed: "left",
				},{
					title: '资讯ID',
					key: 'newsId',
					width: 200,
				},{
					title: '处理状态',
					key: 'dataStatusDesc',
					width: 90,
				},{
					title: '自动屏蔽类型',
					key: 'shieldDesc',
					width: 150,
				},{
					title: '概率',
					key: 'probability',
					width: 90,
				},{
					title: '发布日期',
					key: 'publishTime',
					width: 150,
				},{
					title: '公开标志',
					key: 'publishSignDesc',
					width: 90,
				},{
					title: '媒体出处',
					key: 'mediaSource',
					width: 150,
				},{
					title: '操作',
					align: "center",
					fixed: "right",
					width: 130,
					render: (h, params) => {
						let examineBtn = null;
						if( this.activeRoutersButton.indexOf('examine') != -1){
							examineBtn = h('span',{
								class: {
									'operation-but': true
								},
								on: {
									click: () => {
										this.onLookDetail(params.row);
									}
								}
							},'查看')
						}
						return h('div', [examineBtn]);
					}
				},
			],
			aNewsList:[],
			ruleValidate:{
				probabilityLowerLimit: [
					{ validator: validatorMin, trigger: 'blur' }
				],
				probabilitySuperiorLimit: [
					{ validator: validatorMax, trigger: 'blur' }
				]
			}
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods: {
		/*点击查看*/
		onExamine(){
			this.$refs['oReqform'].validate((valid) => {
				if(valid){
					this.oReq.current = 1;
					this.getNewsList();
				}
			})
		},
		/*查看*/
		onLookDetail(data){
			data.newsListType = 5;
			let obj = {
				desc: "查看",
				type: 4,
				uid: data.newsId,
				url: "/tm/getNewsInfoById",
			}
			window.sessionStorage.setItem('returnedOriginPath', '/audit/news/mechanized'); 
			window.sessionStorage.setItem('emergency-off-shelves_flipObj_view', JSON.stringify(data));
			window.sessionStorage.setItem('emergency-off-shelves_route_query_view', JSON.stringify(obj) );
			window.sessionStorage.setItem('keyboard_shortcuts_names_obj', '{}');
			this.$router.push('/audit/news/emergency-off-shelves/operate-view#'+data.newsId);
		},
		/*获取屏蔽类型*/
		getShieldReason(){
			let url = '/tm/getShieldReason';
			this.$http.get(url).then((res)=>{
				let obj = res.data;
				if(obj.status == this.$api.SUCCESS){
					let list = obj.body && obj.body.result ? obj.body.result : [];
					this.aShieldReason = list;
				}else{
					this.$hMessage.error(obj.msg);
				}
			}).catch((err) => {
				this.$hMessage.error('网络异常，获取屏蔽类型数据失败！');
			});
		},
		/*获取资讯列表*/
		getNewsList(){
			if(this.isShowSpin)return;
			this.isShowSpin = true;
			let url = '/tm/getMachineShieldLogList';
			this.$http.post(url, this.oReq).then((res)=>{
				this.isShowSpin = false;
				let obj = res.data;
				if(obj.status == this.$api.SUCCESS){
					let list = obj.body && obj.body.records ? obj.body.records : [];
					let total = obj.body.total || 0;
					if(total && list.length == 0){
						this.oReq.current = Math.ceil(total/this.oReq.size)
						this.getNewsList();
						return;
					}
					this.intTotal = total;
					this.aNewsList = list;
				}else{
					this.$hMessage.error(obj.msg);
				}
			}).catch((err) => {
				this.isShowSpin = false;
				this.$hMessage.error('网络异常，获取资讯列表数据失败！');
			});
		},
		/*更新发布时间*/
		onChangeIssueDate(aVals){
			this.oReq.startTime = aVals[0];
			this.oReq.endTime = aVals[1];
		},
		/*分页*/
		onPageChange(page){
			this.oReq.current = page;
			this.$refs['oReqform'].validate((valid) => {
				if(valid){
					this.getNewsList();
				}
			})
		},
		/*清空数据 并焦点*/
		onEmpty(name){
			this.oReq[name] = '';
			this.$refs[name].focus();
		},
		init(){
			this.getShieldReason();
			this.getNewsList();
		}
	},
	mounted() {
		console.log(this.activeRoutersButton)
		this.init();
	},
	activated(){
		/*是否自动刷新*/
	
	},
}
</script>
<style scoped>
.mechanized{
	position: relative;
}
.header .box{
	display: inline-block;
	margin-bottom: 10px;
	vertical-align: top;
	margin-right: 10px;
}
.header .box .title{
	display: inline-block;
	line-height: 32px;
}
.header .box>>> .h-date-picker{
	width: 205px;
}
.header .box>>> .h-date-picker .h-input-wrapper{
	width: 100%;
}
.header .box>>> .h-input-wrapper{
	width: 150px;
}
.header .box.probability>>> .h-input-wrapper{
	width: 65px;
}
.header .box>>> .h-select{
	width: 150px;
}
.content-wrapper>>> .operation-but{
	cursor: pointer;
	color: #298DFF;
	text-align: center;
	margin: 0 5px;
	display: inline-block;
}
.header>>> .h-form-item-label{
	display: none;
}
.header>>> .h-form-item{
	margin-bottom: 0;
	display: inline-block;
}
.header>>>  .h-form-item-content{
	line-height: initial;
}
</style>