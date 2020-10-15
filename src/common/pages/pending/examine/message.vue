<!--留言管理-->
<template>
	<div class="message">
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>关键字：</dt>
						<dd><h-input ref="keyword" v-model.trim="keyword"  placeholder="用户姓名/所属企业" @on-keyup.enter="onSearchMsgList" icon="android-close" @on-click="onClearKeyword" @on-change="getHrefUrl"></h-input></dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>处理状态：</dt>
						<dd>
							<h-select placeholder="处理状态" v-model="intHandleStatus" @on-change="getHrefUrl">
								<template v-for="(data,key) in aryHandleStatusList">
									<h-option :value="data.dictEntry" :key="data.dictEntry">{{data.entryName}}</h-option>
								</template>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>留言日期：</dt>
						<dd>
							<h-date-picker :value="msgDate" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="起始日期-截止日期" @on-change="onFormatMsgDate" ></h-date-picker>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>回复人：</dt>
						<dd>
							<h-select placeholder="回复人" v-model="intHandleUser" filterable remote  :remote-method="getHandleUserDict" :loading="isReqHandleUser" @on-change="getHrefUrl">
								<template v-for="(data,key) in aryHandleUserList">
									<h-option :value="data.id" :key="data.id">{{data.realName}}({{data.userName}})</h-option>
								</template>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>来源：</dt>
						<dd>
							<h-select placeholder="来源" v-model="intFeedbackSource" @on-change="getHrefUrl">
								<h-option value="1">钉钉E应用</h-option>
								<h-option value="2">金探APP</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="onSearchMsgList">查询</h-button>	
					<template v-if="activeRoutersButton.indexOf('MessageExport') != -1">
						<a v-if="isExport"class="h-btn h-btn-primary" :href="exportUrl" target="_blank" >导出</a>
						<a v-else class="h-btn h-btn-primary"  @click="onExport">导出</a>
					</template>
				</li>
			</ul>
		</search-form>
		<!--数据列表-->
		<div class="content-wrapper">
			<div class="list">
				<h-table class="full-max-height-table" :maxHeight="maxTableHeight" border  size="small" :columns="aryHeaderData" :data="aryMsgList" @on-row-dblclick="view"></h-table>
			</div>
			<div class="page-box">				
				<h-page :total="total" :page-size="pageSize" :current="pageNum" @on-change="onPageChange" show-elevator show-total  size="small"></h-page>
			</div>
			<Spin fix v-if="isSearchMsgList">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</Spin>
		</div>
		<h-msgBox :title="MsgTitle" v-model="isShowReplyBox" :mask-closable="false" @on-close="onCloseReplyBox" class-name="vertical-center-modal" :top="0" >
			<div class="reply-content-global">
				<div class="reply-content">
					<span>客户：</span>
					<span>{{replyInfo.feedbackUserName}}</span>
					<span class="content">{{replyInfo.feedbackTime}}</span>
				</div>
				<div class="reply-content">
					<span>内容：</span>
					<span>{{replyInfo.feedbackContent}}</span>
				</div>
				<div class="reply-content" v-if="replyInfo.attachList!=null&&replyInfo.attachList.length>0">
					<div class="upload-list-cover" >
						<span>附件：</span>
				        <template v-for="item in replyInfo.attachList">
				        	<a :href="item.downloadUrl" target="blank">
				        		 <img :src="item.downloadUrl" :alt="item.attachName" style="width: 80px;margin-right: 10px" @on-click="download(item.downloadUrl)">
				        	</a> 
				        </template>			        
				    </div>
			    </div>			
			</div>			
			<h-form  :model="replyInfo" :rules="contentRule" ref="replyInfo" class="confirm-form">						
				<h-form-item label="回复内容：" prop="replyContent" class="form-reply" >
					<div v-show="isShowReply" style="float: right; ">	
						<span>{{replyInfo.replyTime}}</span>
						<span class="content">回复人：{{replyInfo.handleUserName}}</span>
					</div>					
					<h-input v-model.trim="replyInfo.replyContent" :disabled="contentDisable" type="textarea" :autosize="{minRows: 3,maxRows: 5}"  placeholder="请输入..." autocomplete="off">
					</h-input>
				</h-form-item>								
			</h-form>
			<div slot="footer">
				<h-button @click="onCloseReplyBox">取消</h-button>
				<h-button type="primary" @click="onSubmit" :loading="isSubmit" v-show="isShowSubmit">提交</h-button>
			</div>			
		</h-msgBox>
		
	</div>
</template>
<script>
	import utils from '@/utils'
	export default {		
		data () {
			/*初始化数据*/
			return{
				activeRoutersButton: this.$store.state.activeRoutersButton,
				keyword:'',
				msgDate:'',
				intFeedbackSource: '',
				intHandleStatus:'',
				aryHandleStatusList:{},
				intHandleUser:'',
				isReqHandleUser:false,
				aryHandleUserList:{},
				value2:[],
				total:0,
				pageSize:12,
				pageNum:1,
				isSearchMsgList:false,
				exportUrl:'',
				isExport:false,
				aryHeaderData:[
					{
						title: '处理状态',
						key: 'handleStatusStr'
					},{
						title: '用户姓名',
						key: 'feedbackUserName'	
					},{
						title: '用户ID',
						key: 'feedbackUserId'	
					},{
						title: '所属企业',
						key: 'feedbackUserCorpName'
					},{
						title: '留言内容',
						key: 'feedbackContent',					   
						width:250,
						render: (h, params) => {
							let feedbackContent = params.row.feedbackContent;
							if (!feedbackContent) return ''
					        if (feedbackContent.length > 20) {
					           feedbackContent = feedbackContent.slice(0,20) + '...'
					        }						
							return h('h-tooltip',{
								style: {
									color:'#298DFF'	
								},
								props:{														
									placement:'left'								
								}
							},[
								h('div',feedbackContent),
								h('div',{
									slot: 'content',
									style: {
		                              whiteSpace: 'normal'
		                            }
							},params.row.feedbackContent)
							]);
						}					
					},{
						title: '留言时间',
						key: 'feedbackTime',					    
						width:150					
					},{
						title: '回复人',
						key: 'handleUserName'		
					},{
						title: '回复内容',
						key: 'replyContent',					    
						width:250,
						render: (h, params) => {
							let replyContent = params.row.replyContent;
							if (!replyContent) return ''
					        if (replyContent.length > 20) {
					           replyContent = replyContent.slice(0,20) + '...'
					        }						
							return h('h-tooltip',{
								style: {
									color:'#298DFF'	
								},
								props:{														
									placement:'left'								
								}
							},[
								h('div',replyContent),
								h('div',{
									slot: 'content',
									style: {
		                              whiteSpace: 'normal'
		                            }
							},params.row.replyContent)
							]);
						}							
					},{
						title: '回复时间',
						key: 'replyTime',					    
						width:150					
					},{
						title: '设备信息',
						key: 'deviceInfo'		
					},{
						title: '来源',
						key: 'feedbackSourceStr',	
					},{
						title: '是否会员',
						key: 'isMemberStr',					    
						width:150					
					},{
						title: '联系方式',
						key: 'concatPhone',
						width:120			
					},{
						title: '操作',
						key: 'action',
						align: 'center',
                        fixed: 'right',						
						render: (h, params) => {
							let replyBtn = null;						
							if(this.activeRoutersButton.indexOf('MessageReply') != -1&&params.row.handleStatus == 0){
							//待处理展示回复按钮
								replyBtn = h('i',{
									class: {
										'iconfont': true,
										'icon-android-textsms': true,
										'tab-icon-btn': true

									},
									attrs:{'title':'回复'},
                                    on: {
                                        click: () => {
                                            this.onReplyBtn(params.row);
                                        }
                                    }
								});
							}							
							return h('div', [replyBtn]);

						}					
					}
				],
				aryMsgList:[],
				isShowReplyBox:false,
				replyInfo:{},
				contentRule:{
					replyContent:[
						{required:true, max:200,message:'回复内容不能为空，最多200个字符',trigger:'blur'}
					]
				},
				isSubmit:false,				
				contentDisable:false,
				MsgTitle:'',
				isShowSubmit:false,
				isShowReply:false


			}
		},
		computed: {
			maxTableHeight(){ return this.$store.state.maxTableHeight },
		},
		methods: {
			/*判断请求返回的结果*/
			httpResValid(data){
				if(data==null){
					this.$hMessage.error("发生未知错误");
					return false
				}else if(data.status != this.$api.SUCCESS){
					this.$hMessage.error(data.msg);
					return false;
				}
				return true;
			},		
			getHandleStatusDict(){				
				utils.handlerStatusMsg((data)=>{
					if(!this.httpResValid(data)) return;
					let tmpObj = data;
					this.aryHandleStatusList = tmpObj.data ? tmpObj.data : [];
				})
			},
			getHandleUserDict(query){				
				if(query!==''){
					if(this.isReqHandleUser) return;
					this.isReqHandleUser=true;
					utils.handleUser(query,(data)=>{
						this.isReqHandleUser=false;
						if(!this.httpResValid(data)) return;
						let tmpObj = data;						
						this.aryHandleUserList = tmpObj.data ? tmpObj.data : [];
					})	
				}				
			},
			//清空关键字input框的用户输入数据
			onClearKeyword(){
				this.keyword='';
				this.$refs.keyword.focus();
			},
			onFormatMsgDate(value){
				this.msgDate=value;
				this.getHrefUrl();				
			},
			getHrefUrl(){
				let urlParams = this.queryParams();
				if(urlParams==null){
					this.isExport=false;
					return;
				}
				this.isExport=true;
				this.exportUrl = '/tm/feedback/export?'+urlParams;
			},
			onExport(){
				let urlParams = this.queryParams();
				if(urlParams==null){
					this.$hMessage.error("请至少输入一个查询项");					
					return;
				}
				// let url = '/tm/feedback/export?'+urlParams;
				// window.open(url,'_blank');
			},
			//查询参数
			queryParams(){							
				let handleStatus = this.intHandleStatus == -1 ? '' : this.intHandleStatus;	
				let handleUser = this.intHandleUser == -1 ? '' : this.intHandleUser;		
				let bDate = this.msgDate[0];
				let eDate = this.msgDate[1];
				if(this.keyword==''&&handleStatus==''&&handleUser==''&&bDate==''&&eDate=='' && this.intFeedbackSource == ''){
					return null;
				}
				let urlParams = 'feedback_start_time='+bDate+'&feedback_end_time='+eDate+'&handle_status='+handleStatus+'&handle_user_id='+handleUser+'&keyword='+encodeURIComponent(this.keyword) +'&feedback_source='+ this.intFeedbackSource;
				return urlParams;
			},
			//查询
			queryMsgList(){
				if(this.isSearchMsgList) return;
				let params = this.queryParams();
				if(params==null){
					this.$hMessage.error("请至少输入一个查询项");
					return;
				}
				this.isSearchMsgList = true;				
				let urlParams = 'pagenum='+this.pageNum+'&pagesize='+this.pageSize+'&'+params;
				let url = '/tm/feedback/page?'+urlParams;
				this.$http.get(url).then((res)=>{
					this.isSearchMsgList = false;
					let tmpObj = res.data;
					if(tmpObj.status == this.$api.SUCCESS){
						let tmpData = tmpObj.data ? tmpObj.data : {}; 
						this.aryMsgList = tmpData.list ? tmpData.list : [];
						this.total = tmpData.total ? tmpData.total : 0;
						if(this.total && this.aryMsgList.length == 0){
							this.pageNum = Math.ceil(this.intTotal/this.pageSize)
							this.queryMsgList();
						}
					}else{
						this.total=0;
						this.aryMsgList = [];
						this.$hMessage.error(tmpObj.msg);
					}
				}).catch(err=>{
					this.total=0;
					this.aryMsgList = [];
					this.isSearchMsgList = false;
					this.$hMessage.error("发生未知错误，消息列表查询失败");
				})
			},
			//分页
			onPageChange(index){
				this.pageNum=index;
				this.queryMsgList();
			},
			//查询消息列表
			onSearchMsgList(){
				this.pageNum=1;
				this.queryMsgList();
			},
			//导出
			// onExport(){
			// 	let urlParams = this.queryParams();
			// 	if(urlParams==null){
			// 		this.$hMessage.error("请至少输入一个查询项");
			// 		return;
			// 	}
			// 	let url = '/tm/feedback/export?'+urlParams;
			// 	// window.location.href = url;
			// 	window.open(url,'_blank');
			// },
			//回复留言			
			onReplyBtn(row){
				let url = '/tm/feedback/detail?id='+row.id;
				this.$http.get(url).then((res)=>{					
					let tmpObj = res.data;
					if(tmpObj.status != this.$api.SUCCESS){
						this.$hMessage.error(tmpObj.msg);
						return;
					}
					this.replyInfo=tmpObj.data;
					this.MsgTitle="回复客户留言";
					this.contentDisable=false;
					this.isShowSubmit=true;
					this.isShowReply=false;
					this.isShowReplyBox=true;
					this.lockMsg(row);					
				}).catch(err=>{
					this.onCloseReplyBox();
				})
			},
			lockMsg(row){
				let url = '/tm/feedback/lock?id='+row.id;
				this.$http.get(url).then((res)=>{					
					let tmpObj = res.data;
					if(tmpObj.status != this.$api.SUCCESS){
						this.$hMessage.error(tmpObj.msg);
						this.onCloseReplyBox();
						return;
					}					
				}).catch(err=>{
					
				})
			},
			onCloseReplyBox(){
				let url = '/tm/feedback/unlock?id='+this.replyInfo.id;
				this.$http.get(url).then((res)=>{					
					let tmpObj = res.data;
					if(tmpObj.status != this.$api.SUCCESS){
						this.$hMessage.error(tmpObj.msg);
						return;
					}
					this.resetReplyBox();
				}).catch(err=>{
					
				})
				
			},
			resetReplyBox(){
				this.replyInfo={};				
				this.MsgTitle='';
				this.contentDisable=false;
				this.isShowSubmit=false;
				this.isShowReply=false;	
				this.$refs['replyInfo'].resetFields();			
				this.isShowReplyBox=false;
			},
			onSubmit(){
				this.$refs['replyInfo'].validate((valid) => {
					if(valid){
						this.$hMsgBox.confirm({
						title:'提示',
						content: "是否确认回复留言？",
						loading:true,								
						onOk:()=>{
	                        this.submit();
	                    },
						onCancel:()=>{
						  	return;
						}								
	    				
					})				
						
					}
				})
			},
			submit(){
				if(this.isSubmit) return;
				this.isSubmit = true;					
				let url = '/tm/feedback/reply';	
				let data = {						
					 	id:this.replyInfo.id,
					 	replyContent:this.replyInfo.replyContent,					 
					};			 
				this.$http.post(url,data).then((res)=>{					
					this.isSubmit = false;
					let tmpObj = res.data;
					if(tmpObj.status != this.$api.SUCCESS){
						this.$hMessage.error(tmpObj.msg);
						return;
					}
					this.resetReplyBox();
					this.$hMsgBox.remove();	
					this.onSearchMsgList();								
				}).catch(err=>{
					this.isSubmit = false;
					this.$hMessage.error('发生未知错误，消息回复失败');
				})
			},
			view(row){
				let url = '/tm/feedback/detail?id='+row.id;
				this.$http.get(url).then((res)=>{					
					let tmpObj = res.data;
					if(tmpObj.status != this.$api.SUCCESS){
						this.$hMessage.error(tmpObj.msg);
						return;
					}
					this.replyInfo=tmpObj.data;
					this.MsgTitle="客户留言";
					this.contentDisable=true;
					this.isShowSubmit=false;
					this.isShowReply=true;
					this.isShowReplyBox=true;								
				}).catch(err=>{
					this.resetReplyBox();
				})
			},
			init(){
				this.getHandleStatusDict();
				this.getHandleUserDict();
				this.initDate();
				this.queryMsgList();
				this.getHrefUrl();
			},
			initDate(){
				let date = new Date();
			    let seperator1 = "-";
			    let year = date.getFullYear();
			    let month = date.getMonth() + 1;
			    let strDate = date.getDate();
			    if (month >= 1 && month <= 9) {
			       month = "0" + month;
			    }
				if (strDate >= 0 && strDate <= 9) {
				   strDate = "0" + strDate;
				}
			    let currentdate = year + seperator1 + month + seperator1 + strDate;
				this.msgDate = [currentdate,currentdate];
			}


		},
		mounted(){			
			this.init();
		}
	}

</script>
<style type="text/css" scoped>
.message > .search {
	line-height: 32px;
	width: 100%;
	display: inline-block;
}
.message > .search .h-input-wrapper,.message > .search .h-select,.message > .search .datepicker,.message > .search .h-date-picker{
	width: 210px;
	margin-right: 10px;
	vertical-align: top;
	float: left;
	margin-bottom: 10px;
}
.message > .search .datepicker{
	width:430px;
}
.message > .search .h-btn{
	float: left;
	margin-bottom: 10px;
	margin-right: 10px;
}
.content{
	margin-left: 30px;
}
.reply-content-global{
	border: 1px solid #D7DDE4;
	border-radius: 5px;
	padding: 10px;
	margin-bottom: 10px;
}
.reply-content{
	margin-bottom: 10px;
}

</style>