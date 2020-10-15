<template>
	<div class="repetitive">
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>资讯ID：</dt>
						<dd>
							<h-input aria-placeholder="资讯ID" placeholder="请输入资讯 ID" v-model="oReq.newsId" @on-enter="onExamine" icon="android-close" @on-click="onEmpty('newsId')" ref="newsId" ></h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>筛选日期：</dt>
						<dd>
							<h-date-picker type="datetimerange" :value="defaultDate" format="yyyy-MM-dd" aria-placeholder="筛选日期" placeholder="开始日期 - 结束日期" @on-change="onChangeIssueDate" :clearable="false"></h-date-picker>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>过滤类别：</dt>
						<dd>
							<h-select aria-placeholder="过滤类别" placeholder="请选择类别" v-model="oReq.position" clearable >
								<h-option v-for="(item, i) in aType" :value="item.type" :key="i" >
									{{ item.desc }}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" icon="search" data-ref="init-btn" @click="onExamine">查询</h-button>
				</li>
			</ul>
		</search-form>
		<div class="content-wrapper">
			<div class="sum">
				筛选日期内过滤总数为<span>{{ sum }}</span>个
			</div>
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
		<h-msgBox title="明细" v-model="isShowDetail" @on-close="onCloseBox" class-name="repetitive-vertical-modal vertical-center-modal" :top="0" width="800">
			<div class="content-wrapper">
				<div class="list">
					<h-table border :columns="detailHeaderData" :data="aNewsDetail" size="small" ></h-table>
				</div>
				<div class="page-box">
					<h-page :total="intDetailTotal" :page-size="oDetailReq.size" :current="oDetailReq.current" @on-change="onDetailPageChange" show-total size="small"></h-page>
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
import simplePage from '@/components/simple-page'
import { TODAY } from "./utils";
import { other_day } from "@/filters/index";
export default {
	name: "AuditNewsRepetitive",
	components: {
		simplePage
	},
	data () {
		return {
			activeRoutersButton: this.$store.state.activeRoutersButton,
			defaultDate: [other_day(14,'-'),TODAY],
			intTotal: 0,
			isShowSpin: false,
			sum: 0,
			oReq:{
				newsId: '',
				current: 1,
				size: 12,
				position: '1',
				startTime: other_day(14,'-'),
				endTime: TODAY,
			},
			aType: [
				{
					type: '1',
					desc: '标题重复'
				},
				{
					type: '2',
					desc: '内容重复'
				}
			],
			headerData: [
				{
					title: '资讯标题',
					render: (h, params) => {
						return h('span',{
							class: {
								'complain-count': true
							},
							on: {
								click: () => {
									this.onLookDetail(params.row);
								}
							}
						},params.row.newsTitle)
					}
				},{
					title: '筛选日期内个数',
					align: "center",
					key: 'count',
					width: 150,
				},{
					title: '过滤类别',
					key: 'filterTypeDesc',
					align: "center",
					width: 120,
				},{
					title: '操作',
					align: "center",
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
										this.onDetail(params.row);
									}
								}
							},'查看')
						}
						return h('div', [examineBtn]);
					}
				},
			],
			aNewsList: [],
			intDetailTotal: 0,
			oDetailReq:{
				current: 1,
				size: 8,
				newsId: '',
				position: '',
				startTime: '',
				endTime: '',
			},
			isShowDetail: false,
			isShowDetailSpin: false,
			detailHeaderData: [
				{
					title: '资讯标题',
					key: 'dupNewsTitle',
				},{
					title: '过滤类别',
					key: 'filterTypeDesc',
					align: "center",
					width: 120,
				},{
					title: '过滤时间',
					align: "center",
					key: 'filterTime',
					width: 150,
				},{
					title: '操作',
					align: "center",
					width: 130,
					render: (h, params) => {
						let examineBtn = h('a',{
								class: {
									'operation-but': true
								},
								attrs: {
									href: params.row.newsUrl,
									target: '_blank'
								},
							},'查看')
						return h('div', [examineBtn]);
					}
				},
			],
			aNewsDetail: [],
			activeNewsId: '',
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods: {
		/*资讯详情*/
		onLookDetail(data){
			data.newsListType = 5;
			let obj = {
				desc: "查看",
				type: 4,
				uid: data.newsId,
				url: "/tm/getNewsInfoById",
			}
			window.sessionStorage.setItem('returnedOriginPath', '/audit/news/repetitive'); 
			window.sessionStorage.setItem('emergency-off-shelves_flipObj_view', JSON.stringify(data));
			window.sessionStorage.setItem('emergency-off-shelves_route_query_view', JSON.stringify(obj) );
			window.sessionStorage.setItem('keyboard_shortcuts_names_obj', '{}');
			this.$router.push('/audit/news/emergency-off-shelves/operate-view#'+data.newsId);
		},
		/*点击查询*/
		onExamine(){
			this.oReq.current = 1;
			this.getNewsList();
		},
		/*查看*/
		onDetail(data){
			this.oDetailReq.newsId = data.newsId;
			this.isShowDetail = true;
			this.getNewsDetail();
		},
		onCloseBox(){
			this.intDetailTotal = 0;
			this.isShowDetail = false;
			this.oDetailReq.current = 1;
			this.aNewsDetail = [];
		},
		/*获取资讯列表*/
		getNewsList(){
			if(this.isShowSpin)return;
			this.isShowSpin = true;
			let url = '/tm/getDupNewsList?';
			let oTmp = this.oReq;
			for(let k in oTmp){
				url += '&'+ k +'='+ encodeURIComponent(oTmp[k]);
			}
			this.oDetailReq.position = oTmp.position;
			this.oDetailReq.startTime = oTmp.startTime;
			this.oDetailReq.endTime = oTmp.endTime;
			this.$http.get(url).then((res)=>{
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
					this.sum = obj.body.sum || 0;
				}else{
					this.$hMessage.error(obj.msg);
				}
			}).catch((err) => {
				this.isShowSpin = false;
				this.$hMessage.error('网络异常，获取资讯列表数据失败！');
			});
		},
		/*明细分页*/
		onDetailPageChange(page){
			this.oDetailReq.current = page;
			this.getNewsDetail();
		},
		/*获取重复资讯明细*/
		getNewsDetail(){
			if(this.isShowDetailSpin)return;
			this.isShowDetailSpin = true;
			let url = '/tm/getDupNewsInfo?';
			let oTmp = { ...this.oDetailReq };
			for(let k in oTmp){
				url += '&'+ k +'='+ encodeURIComponent(oTmp[k]);
			}
			this.$http.get(url).then((res)=>{
				this.isShowDetailSpin = false;
				let obj = res.data;
				if(obj.status == this.$api.SUCCESS){
					let list = obj.body && obj.body.records ? obj.body.records : [];
					this.intDetailTotal = obj.body.total ? obj.body.total : 0;
					this.aNewsDetail = list;
				}else{
					this.$hMessage.error(obj.msg);
				}
			}).catch((err) => {
				this.isShowDetailSpin = false;
				this.$hMessage.error('网络异常，获取明细数据失败！');
			});
		},

		/*更新筛选时间*/
		onChangeIssueDate(aVals){
			this.oReq.startTime = aVals[0];
			this.oReq.endTime = aVals[1];
		},
		/*分页*/
		onPageChange(page){
			this.oReq.current = page;
			this.getNewsList();
		},
		/*清空数据 并焦点*/
		onEmpty(name){
			this.oReq[name] = '';
			this.$refs[name].focus();
		},
		init(){
			this.getNewsList();
		}
	},
	mounted() {
		this.init();
	},
	activated(){
		/*是否自动刷新*/
	
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
.header .box.newsId>>> .h-input-wrapper {
	width: 205px;
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
</style>