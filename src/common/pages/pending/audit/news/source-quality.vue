<template>
	<div class="repetitive">
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>筛选日期：</dt>
						<dd>
							<h-date-picker type="datetimerange" :value="defaultDate" format="yyyy-MM-dd" aria-placeholder="筛选日期" placeholder="开始日期 - 结束日期" @on-change="onChangeIssueDate" :editable="false" ></h-date-picker>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>资讯抓取源：</dt>
						<dd>
							<h-select aria-placeholder="资讯抓取源" placeholder="请选择资讯抓取源" v-model="oReq.newsSource" clearable filterable>
								<h-option v-for="(item, i) in aType" :value="item.sectorHash" :key="i" >
									{{ item.newsSource }}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" data-ref="init-btn" @click="onExamine">查询</h-button>
					<h-tooltip placement="top-end" content="请选择是否自动刷新表格的数据!">
					<h-switch size="large" v-model="isAutoUpdate">
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
		<div class="content-wrapper">
			<div>
				<div class="list">
					<h-table class="full-max-height-table" :maxHeight="maxTableHeight" border :columns="headerData" :data="aNewsList" size="small" ></h-table>
				</div>
				<div class="page-box">
					<h-page :total="intTotal" :page-size="oReq.size" :current="oReq.current" @on-change="onPageChange" show-total size="small"></h-page>
				</div>
			</div>
			<Spin fix v-if="isShowSpin">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</Spin>
		</div>
		<h-msgBox title="屏蔽明细" v-model="isShowDetail" @on-close="onCloseBox" class-name="repetitive-vertical-modal vertical-center-modal" :top="0" width="800">
			<div class="content-wrapper">
				<div class="list">
					<h-table border :columns="detailHeaderData" :data="aShieldDetail" size="small" ></h-table>
				</div>
				<div class="page-box">
					<h-page :total="intDetailTotal" :page-size="oDetailReq.pagesize" :current="oDetailReq.pagenum" @on-change="onDetailPageChange" show-total size="small"></h-page>
				</div>
				<Spin fix v-if="isShowDetailSpin">
					<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
					<div>加载中...</div>
				</Spin>
			</div>
			<div slot="footer" class="api-form-footer">
				<h-button type="primary" @click="onCloseBox">关闭</h-button>
			</div>
		</h-msgBox>
	</div>
</template>
<script>
import { TODAY } from "./utils";
import { percentage } from "@/filters/index";
export default {
	name: "AuditNewsSource-quality",
	data () {
		return {
			activeRoutersButton: this.$store.state.activeRoutersButton,
			defaultDate: [TODAY,TODAY],
			intTotal: 0,
			isShowSpin: false,
			sum: 0,
			oReq:{
				pagenum: 1,
				pagesize: 12,
				newsSource: '',
				startDate: TODAY,
				endDate: TODAY,
			},
			aType: [],
			headerData: [
				{
					title: '资讯抓取源',
					key: 'newsSource'
				},{
					title: '屏蔽次数',
					width: 180,
					align: "center",
					render: (h, params) => {
						if(this.activeRoutersButton.indexOf('ViewBlockingDetails') != -1 ){
							return h('div',{
								class: {
									'complain-count': true
								},
								on: {
									click: () => {
										this.onDetail(params.row);
									}
								}
							},params.row.count)
						}else{
							return h('div',params.row.count)
						}
					}
				},{
					title: '人工处理数',
					align: "center",
					width: 180,
					key: 'artificialCount'		
				},{
					title: '人工屏蔽率',
					align: "center",
					width: 180,
					render: (h, params) => {
						let value = percentage(params.row.artificialShieldingRate);
						return h('div',value)
					}
					
				},{
					title: '总体屏蔽率',
					align: "center",
					width: 180,
					render: (h, params) => {
						let value = percentage(params.row.shieldingRate);
						return h('div', value)
					}
				},{
					title: '主站名称',
					key: 'host',
					align: "center",
				}
			],
			aNewsList: [],
			intDetailTotal: 0,
			oDetailReq:{
				pagenum: 1,
				pagesize: 8,
				newsSource: '',
				startDate: '',
				endDate: ''
			},
			isShowDetail: false,
			isShowDetailSpin: false,
			detailHeaderData: [
				{
					title: '处理人员',
					key: 'userName',
					width: 120,
				},{
					title: '处理时间',
					key: 'shieldingTime',
					align: "center",
					width: 175,
				},{
					title: '资讯标题',
					key: 'content',
				},{
					title: '操作',
					align: "center",
					width: 80,
					render: (h, params) => {
						let examineBtn = h('a',{
								class: {
									'operation-but': true
								},
								attrs: {
									href: params.row.url,
									target: '_blank',
									title: params.row.url,
								},
							},'查看')
						return h('div', [examineBtn]);
					}
				},
			],
			aShieldDetail: [],
			aShieldSum: 0,
			isAutoUpdate: true,
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods: {
		/*查询*/
		onExamine(){
			this.oReq.pagenum = 1;
			this.getNewsList();
		},
		/*点击屏蔽次数*/
		onDetail(data){
			let sum = this.aShieldSum + 1;
			this.oDetailReq.newsSource = data.hash;
			this.isShowDetail = true;
			this.getShieldDetail(sum);
		},
		onCloseBox(){
			this.isShowDetailSpin = false;
			this.intDetailTotal = 0;
			this.isShowDetail = false;
			this.oDetailReq.pagenum = 1;
			this.aShieldDetail = [];
		},
		/*获取资讯列表*/
		getNewsList(){
			if(this.isShowSpin)return;
			this.isShowSpin = true;
			let url = '/tm/getnewssourcequalitylist?';
			let oTmp = this.oReq;
			for(let k in oTmp){
				url += '&'+ k +'='+ encodeURIComponent(oTmp[k]);
			}
			this.oDetailReq.startDate = oTmp.startDate;
			this.oDetailReq.endDate = oTmp.endDate;
			this.$http.get(url).then((res)=>{
				this.isShowSpin = false;
				let obj = res.data;
				if(obj.status == this.$api.SUCCESS){
					let list = obj.body && obj.body.list ? obj.body.list : [];
					let total = obj.body.total || 0;
					if(total && list.length == 0){
						this.oReq.pagenum = Math.ceil(total/this.oReq.pagesize)
						this.getNewsList();
						return;
					}
					this.intTotal = total;
					this.aNewsList = list;
					this.sum = obj.body.sum || 0;
				}else{
					this.$hMessage.error(obj.msg);
				}
			}).catch((err) => {
				this.isShowSpin = false;
				this.$hMessage.error('网络异常，获取列表数据失败！');
			});
		},
		/*屏蔽详情分页*/
		onDetailPageChange(page){
			this.oDetailReq.pagenum = page;
			this.getShieldDetail();
		},
		/*获取屏蔽详情明细*/
		getShieldDetail(sum){
			if(this.isShowDetailSpin)return;
			this.aShieldSum = sum;
			this.isShowDetailSpin = true;
			let url = '/tm/getshieldinginfolist?';
			let oTmp = { ...this.oDetailReq };
			for(let k in oTmp){
				url += '&'+ k +'='+ encodeURIComponent(oTmp[k]);
			}
			this.$http.get(url).then((res)=>{
				if(this.aShieldSum != sum){
					return;
				}
				this.isShowDetailSpin = false;
				let obj = res.data;
				if(obj.status == this.$api.SUCCESS){
					let list = obj.body && obj.body.list ? obj.body.list : [];
					this.intDetailTotal = obj.body.total ? obj.body.total : 0;
					this.aShieldDetail = list;
				}else{
					this.$hMessage.error(obj.msg);
				}
				
			}).catch((err) => {
				this.isShowDetailSpin = false;
				this.$hMessage.error('网络异常，获取明细数据失败！');
			});
		},
		getSourceList(){
			let url = '/tm/getsectorhashlist';
			this.$http.get(url).then((res)=>{
				let obj = res.data;
				if(obj.status == this.$api.SUCCESS){
					let list = obj.body && obj.body.hashResult ? obj.body.hashResult : [];
					this.aType = list;
				}else{
					this.$hMessage.error(obj.msg);
				}
			}).catch((err) => {
				this.$hMessage.error('网络异常，获取资讯抓取源数据失败！');
			});
		},
		

		/*更新筛选时间*/
		onChangeIssueDate(aVals){
			this.oReq.startDate = aVals[0];
			this.oReq.endDate = aVals[1];
		},
		/*分页*/
		onPageChange(page){
			this.oReq.pagenum = page;
			this.getNewsList();
		},
		/*清空数据 并焦点*/
		onEmpty(name){
			this.oReq[name] = '';
			this.$refs[name].focus();
		},
		init(){
			this.getSourceList();
			this.getNewsList();
		}
	},
	mounted() {
		this.init();
	},
	activated(){
		/*是否自动刷新*/
		if(this.isAutoUpdate){
			this.init();
		}
	},
}
</script>
<style scoped>
.repetitive{
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
.header .box>>> .h-select{
	width: 220px;
}
.content-wrapper>>> .operation-but{
	cursor: pointer;
    color: #298DFF;
    text-align: center;
    margin: 0 5px;
    display: inline-block;
}
.content-wrapper .sum{
	margin-bottom: 5px;
	line-height: 20px;
	vertical-align: initial;
}
.content-wrapper .sum span{
	font-size: 14px;
	margin: 0 3px;
}
>>>.repetitive-vertical-modal.vertical-center-modal .h-modal-body{
	min-height: 390px;
}
.content-wrapper>>> .complain-count{
	cursor: pointer;
	color: #298DFF;
}
.box.switch{
	line-height: 32px;
}
</style>