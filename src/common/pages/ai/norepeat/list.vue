<template>
	<div class="repetitive">
		<search-form>
			<ul slot="content">
				<!--<li>
					<dl>
						<dt>业务线：</dt>
						<dd>
							<h-select placeholder="请选择业务线" v-model="oReq.appId" :clearable="false">
								<h-option v-for="(item, i) in appList" :value="item.dictEntry" :key="i" >
									{{ item.entryName }}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>-->
				<li>
					<dl>
						<dt>资讯 I D ：</dt>
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
								<h-option v-for="(item, i) in aType" :value="item.dictEntry" :key="i" >
									{{ item.entryName }}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button v-if="activeRoutersButton.indexOf('NoRepeatSearch') != -1" type="primary" data-ref="init-btn" @click="onExamine">查询</h-button>
				</li>
			</ul>
		</search-form>
		<div class="content-wrapper">
			<div class="sum">
				筛选日期内过滤总数为<span>{{ sum }}</span>个
			</div>
			<div class="tab-box">
				<div class="list">
					<h-table :maxHeight="maxTableHeight" class="full-max-height-table" border :columns="headerData" :data="aNewsList" size="small" ></h-table>
				</div>
				<div class="page-box">
					<h-page :total="intTotal" :page-size="oReq.size" :current="oReq.current" :page-size-opts="pageSizeOpts" @on-page-size-change="onPageSizeChange" @on-change="onPageChange" show-sizer  show-elevator	show-total placement="top" size="small"></h-page>
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
					<h-table :height="aNewsDetail.length >=10 ? 398 : null" border :columns="detailHeaderData" :data="aNewsDetail" size="small" ></h-table>
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
import utils from "@/utils/index";
import { other_day } from "@/filters/index";
const TODAY = utils.getToday();
export default {
	name: "AINorepeatList", 
	data () {
		return {
			activeRoutersButton: this.$store.state.activeRoutersButton,
			ishiddenCol:true,
			defaultDate: [other_day(14,'-'),TODAY],
			intTotal: 0,
			isShowSpin: false,
			sum: 0,
			pageSizeOpts:[10,20,50,100],
			oReq:{
//				appId:this.$api.APPID.JINTAN+'',
				newsId: '',
				current: 1,
				size: 10,
				position: '1',
				startTime: other_day(14,'-'),
				endTime: TODAY,
			},
			appList:[],
			aType: [],
			headerData: [
				{
					title: '资讯ID',
					key: 'newsId',
					align: "center",
					width: 160,
				},
				{
					title: '资讯标题',
					render: (h, params) => {
						return h('span',{
							class: {
								'complain-count': true
							},
							on: {
								click: () => {
									this.$router.push({path:'/tbm/news/view',query:{newsId: params.row.newsId, ref: this.$md5(`${params.row.newsId}TBM-COMPOSE`)}});
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
					width:80,
					render: (h, params) => {
						let examineBtn = null;
						if( this.activeRoutersButton.indexOf('NoRepeatEditBtn') != -1){
							examineBtn = h('span',{
								class: {
									'iconfont': true,
									'icon-t-b-message':true,
									'operation-but': true
								},
								on: {
									click: () => {
										this.onDetail(params.row);
									}
								}
							})
						}
						return h('div', [examineBtn]);
					}
				},
			],
			aNewsList: [],
			intDetailTotal: 0,
			oDetailReq:{
				appId:'',
				current: 1,
				size:10,
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
					width: 110,
				},{
					title: '过滤时间',
					align: "center",
					key: 'filterTime',
					width: 150,
				},{
					title: '查看原文',
					align: "center",
					width: 80,
					render: (h, params) => {
						let examineBtn = params.row.newsUrl ? h('a',{
								class: {
									'operation-but': true
								},
								attrs: {
									href: params.row.newsUrl,
									target: '_blank'
								},
							},'查看') : null;
						return h('div', [examineBtn]);
					}
				},{
					title: '版权状态',
					align: "center",
					key: 'copyrightDesc',
					width: 100,					
				},
				{
					title: '处理状态',
					align: "center",
					key: 'status',
					width: 100,
					render:(h, params)=>{
						let statusDesc = params.row.status == '0' ? '待处理' : '已处理';
						return h('span', statusDesc);
					}
				},{
					title: '去重稽核',
					align: "center",
					width: 90,
					render: (h, params) => {
						let rightBtn = h('span',{
								class: {
									'iconfont': true,
									'icon-android-done':true,
									'operation-but': true
								},
								attrs: {
									 title:'正确'
								},
								on:{
									click:(e) => {	
										let data = {
											id:	params.row.id,
											status:	1,
											filterTime:params.row.filterTime
										};
										this.handleNewsFn(data);
									}
								}			
						});
						let errorBtn = h('span',{
								class: {
									'iconfont': true,
									'icon-close':true,
									'operation-but': true
								},
								attrs: {
									title:'错误'
								},
								on:{
									click:(e) => {
										let data = {
											id:	params.row.id,
											status:	2,
											filterTime:params.row.filterTime
										};
										this.handleNewsFn(data);
									}
								}	
							});
							let btnArr = this.activeRoutersButton.indexOf('NoRepeatEditBtn') != -1 ? [rightBtn,errorBtn] : null;
						return h('div',btnArr);
					}
				}
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
			let url = '/tm/getDupNewsPage?';
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
			let url = '/tm/getDupNewsPageByNewId?';
			this.oDetailReq.appId = this.oReq.appId;
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
		/*处理重复资讯*/
		handleNewsFn(saveInfo){
			 let url = '/tm/modifyDupNewsStatus';
			 this.$http.post(url,saveInfo).then((res) => {
	        	let data = res.data;
	            if(data.status == this.$api.SUCCESS){	            	 
	            	this.$hMessage.info({
                        content: '处理成功',
                        duration: 3
	                });
	                this.getNewsDetail();
	            }else{
	                this.$hMessage.error({content: data.msg})
	            }
	        }).catch(err=>{
	            this.$hLoading.error();
	        })
		},
		/*更新筛选时间*/
		onChangeIssueDate(aVals){
			if(aVals.length>0){
				this.oReq.startTime = aVals[0];
				this.oReq.endTime = aVals[1];
			}else{
				this.oReq.startTime = '';
				this.oReq.endTime = ''
			}	
		},
		/*分页*/
		onPageChange(page){
			this.oReq.current = page;
			this.getNewsList();
		},
		onPageSizeChange (size) {
			this.oReq.size = size;
			this.getNewsList();
		},
		/*清空数据 并焦点*/
		onEmpty(name){
			this.oReq[name] = '';
			this.$refs[name].focus();
		},
		getSelectOption(listType,dictCode){
    		let url = '/tm/tbmDictList?dictCode='+dictCode;    		
            this.$http.get(url).then((res) => {
            	let data = res.data;
                if(data.status == this.$api.SUCCESS){
					this[listType] = data.body.tbmDictList || [];        	
                }else{
                    this.$hMessage.error({content: data.msg})
                }
            })
            .catch(err=>{
                this.$hLoading.error();
            })
		},	
		init(){
			// this.getSelectOption('appList',1011);
			this.getSelectOption('aType',1127);
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
<style>
/*.tab-box .h-page-options-sizer{
	position: relative;
	top: 4px;
}*/
</style>
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
	min-height: 100px;
}
.content-wrapper>>> .complain-count{
	cursor: pointer;
	color: #298DFF;
}
</style>