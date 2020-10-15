<template>
	<div class="tag">
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>任务编号：</dt>
						<dd>
							<h-input ref="strTagId" v-model.trim="strTagId"  placeholder="任务编号" @on-keyup.enter="onSearchTagList" icon="android-close" @on-click="onClearTagId" @on-change="getHrefUrl"></h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>申请用户：</dt>
						<dd>
							<h-input ref="strTagKeyword" v-model.trim="strTagKeyword"  placeholder="申请用户" @on-keyup.enter="onSearchTagList" icon="android-close" @on-click="onClearKeyword" @on-change="getHrefUrl"></h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>处理人：</dt>
						<dd>
							<h-select placeholder="处理人" v-model="intHandleUser" filterable remote  :remote-method="getHandleUserDict" @on-change="getHrefUrl" 
								:label="handlerUserName"
								:loading="isReqHandleUser">
									<template v-for="(data,key) in aryHandleUserList">
										<h-option :value="data.id" :key="data.id">{{data.realName}}({{data.userName}})</h-option>
									</template>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>标签类别：</dt>
						<dd>
							<h-select placeholder="标签类别" v-model="intTagType" @on-change="getHrefUrl">
								<template v-for="(data,key) in aryTagTypeList">
									<h-option :value="data.category_id" :key="data.category_id">{{data.category_name}}</h-option>
								</template>
							</h-select>
						</dd>
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
						<dt>处理结果：</dt>
						<dd>
							<h-select placeholder="处理结果"  v-model="intHandleResult" @on-change="getHrefUrl">									
								<template v-for="(data,key) in aryHandleResultList">
									<h-option :value="data.dictEntry" :key="data.dictEntry">{{data.entryName}}</h-option>
								</template>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="row0"></li>
				<li class="row2">
					<dl>
						<dt>申请日期：</dt>
						<dd>
							<ul class="flex">
								<li class="flex1">
									<h-date-picker :value="applyTimeBegin" @on-change="onChangeApplyBegin" format="yyyy-MM-dd" type="date" placement="bottom-end" placeholder="起始日期"></h-date-picker>
								</li>
								<li class="to">-</li>
								<li class="flex1">
									<h-date-picker :value="applyTimeEnd" @on-change="onChangeApplyEnd" format="yyyy-MM-dd" type="date" placement="bottom-end" placeholder="截止日期"></h-date-picker>
								</li>
							</ul>
						</dd>
					</dl>
				</li>
				<li class="row0"></li>
				<li class="row2">
					<dl>
						<dt>处理日期：</dt>
						<dd>
							<ul class="flex">
								<li class="flex1">
									<h-date-picker :value="handlerTimeBegin" @on-change="onChangeHandlerBegin" format="yyyy-MM-dd" type="date" placement="bottom-end" placeholder="起始日期"></h-date-picker>
								</li>
								<li class="to">-</li>
								<li class="flex1">
									<h-date-picker :value="handlerTimeEnd" @on-change="onChangeHandlerEnd" format="yyyy-MM-dd" type="date" placement="bottom-end" placeholder="截止日期"></h-date-picker>
								</li>
							</ul>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="onSearchTagList">查询</h-button>
					<h-button type="primary" @click="onTaskDistri" v-if="activeRoutersButton.indexOf('TagCheckBathchDistri') != -1">批量分配</h-button>			
					<a class="h-btn h-btn-primary" :href="exportUrl" target="_blank" v-if="activeRoutersButton.indexOf('TagCheckExport') != -1">导出</a>
					<h-button type="primary" @click="onOneKeyTaskDistri" v-if="activeRoutersButton.indexOf('TagCheckOneKeyDistri') != -1" >自动分配</h-button>	
				</li>
			</ul>
		</search-form>
		<!--数据列表-->
		<div class="content-wrapper">
			<div class="list">
				<h-table :maxHeight="maxTableHeight" border  class="full-max-height-table user-search-list-tab" size="small" :columns="aryHeaderData" :data="aryTagList" @on-selection-change="selectTagChange" ></h-table>
			</div>
			<div class="page-box">				
				<h-page :total="intTotal" :page-size="intPageSize" :current="intPageNum" @on-change="onPageChange" show-elevator show-total  size="small"></h-page>
			</div>
			<Spin fix v-if="isSearchTagList">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</Spin>
		</div>
		<!--分配窗口,人员选择列表，只支持单选-->
		<h-msgBox title="任务分配" v-model="isShowDistriBox" :mask-closable="false" @on-close="onCloseDistriBox" class-name="vertical-center-modal" :top="0" width="600" >
			<div class="tip-title">请选择处理人员</div>
			<div class="search-distri">
				<h-input ref="handlerName" v-model.trim="handlerName"  placeholder="处理人" @on-keyup.enter="getUserDutyList" width="200" icon="search"
				 @on-click="getUserDutyList"></h-input>
			</div>
			<div class="content-wrapper">				
			    <h-table highlight-row ref="currentRowTable" height="200" width="500" :columns="aryDistriHeaderData" :data="aryDistriList"  @on-current-change="onClickDistriUser"></h-table>
			    <Spin fix v-if="isDistriList">
					<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
					<div>加载中...</div>
				</Spin>
			</div>
			<div slot="footer" class="distri-box-footer">
				<h-button @click="onCloseDistriBox">取消</h-button>
				<h-button type="primary" @click="onSubmitDistriTag" :loading="isReqDistriTag" >提交</h-button>
			</div>
			
		</h-msgBox>
		<h-msgBox title="确认添加" v-model="isShowConfirmBox"  @on-close="onCloseConfirmBox" class-name="vertical-center-modal" :top="0" :mask-closable="false" :width="700">
			<template v-if="tagConfirmForm.confirmStep==0" >
				<div class="confirm-form-content">
					<div class="tip-title">请选择已添加的标签</div>
					<div class="search" >
						<span class="title">标签名称：</span><h-input placeholder="请输入..." v-model.trim="strConfirmTagKeyword"  @on-keyup.enter="onSearchSynonTagList" icon="search" @on-click="onSearchSynonTagList"></h-input>
						<span class="title title-margin">标签类别：</span>
						<h-select v-model="strConfirmTagType" :clearable="false" @on-change="onSearchSynonTagList" placeholder="请选择">		
								<template v-for="(data,key) in aryTagTypeList">			
									<h-option :value="data.category_id" :key="data.category_id">{{data.category_name}}</h-option>	
								</template>
						</h-select>
					</div>
				</div>
				<div class="content-wrapper">
					<h-table  border highlight-row size="small" :columns="arySynonTagData" :data="arySynonTagList"  @on-current-change="onClickSynonTag"></h-table>
					<Spin fix v-if="isLoadSynonTag">
						<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
						<div>加载中...</div>
					</Spin>
					<div class="page-box">
						<h-page :total="intSynonTotal" :page-size="intSynonPageSize" :current="intSynonPageNum" @on-change="onSynonPageChange" show-total size="small"></h-page>
					</div>
				</div>
				<div slot="footer" class="confirm-form-footer" >
					<h-button @click="onCloseConfirmBox">取消</h-button>
					<h-button type="primary" @click="onSureNextOne" >确定</h-button>

				</div>				
			</template>
			<template v-if="tagConfirmForm.confirmStep==1">
				<div class="confirm-form-content">
					<div class="tip-title">请选择标签详细分类</div>
					<div class="search">						
						<span class="title">标签名称：</span><h-input v-model.trim="
						tagConfirmForm.confirmTagName"  :disabled=true></h-input>
						<span class="title title-margin">标签类别：</span>
						<h-select-tree v-model="tagConfirmForm.confirmTagType" :data="tagTypeTree" placeholder="请选择" @on-select-change="treeChange"></h-select-tree>
					</div>					
				</div>				
				<div slot="footer" class="confirm-form-footer" >
					<h-button @click="onSureUpZero">上一步</h-button>
					<h-button type="primary" @click="onSubmitConfirmTag" 
					:loading="isReqConfirmTag">提交</h-button>
				</div>	
			</template>
		</h-msgBox>
		<!--拒绝添加窗口-->
			<h-msgBox title="拒绝添加" v-model="isShowRefuseBox"  
		@on-close="onCloseRefuseBox" class-name="vertical-center-modal" :top="0" :width="700"
		:mask-closable="false">			
			<div v-if="tagRefuseForm.refuseStep == 0" class="tip-title">请选择拒绝原因类型</div>			
			<div class="refuse-radio-content" >
				<h-radio-group type="button" v-model="arySelectRefuseReason" 
				@on-change="onRefuseReasonBox">
					 <h-radio  :label="data.dictEntry" 
						v-for="(data,key) in aryRefuseReason" :key="data.dictEntry">
						<span>{{ data.entryName }}</span>
					</h-radio>				
				</h-radio-group>				
			</div>
			<div slot="footer" class="confirm-form-footer" 
			v-if="tagRefuseForm.refuseStep == 0">
				<h-button @click="onCloseRefuseBox">取消</h-button>
			</div>			
			<template v-if="tagRefuseForm.refuseStep == 1">
				<div class="confirm-form-content" v-if="tagRefuseForm.refuseReason != 3">
					<template v-if="tagRefuseForm.refuseReason == 2">
						<div class="tip-title">请选择同义标签</div>
						<div class="search" >
							<span class="title">标签名称：</span><h-input placeholder="请输入..." v-model.trim="strSynonTagKeyword"  @on-keyup.enter="onSearchSynonTagList" icon="search" @on-click="onSearchSynonTagList"></h-input>	
							<span class="title title-margin">标签类别：</span>
							<h-select v-model="strSynonTagType" :clearable="false" @on-change="onSearchSynonTagList" placeholder="请选择" >		
								<template v-for="(data,key) in aryTagTypeList">			
									<h-option :value="data.category_id" :key="data.category_id">{{data.category_name}}</h-option>	
								</template>
							</h-select>
						</div>
					</template>
					<template v-if="tagRefuseForm.refuseReason == 1">
						<div class="tip-title">请选择已存在的标签</div>
						<div class="search" >
							<span class="title">标签名称：</span><h-input placeholder="请输入..." v-model.trim="strExistTagKeyword"  @on-keyup.enter="onSearchSynonTagList" icon="search" @on-click="onSearchSynonTagList"></h-input>
							<span class="title title-margin">标签类别：</span>						
							<h-select v-model="strExistTagType" :clearable="false" @on-change="onSearchSynonTagList" placeholder="请选择" >		
								<template v-for="(data,key) in aryTagTypeList">			
									<h-option :value="data.category_id" :key="data.category_id">{{data.category_name}}</h-option>	
								</template>
							</h-select>			
						</div>
					</template>					
					<div class="content-wrapper" v-show="tagRefuseForm.refuseReason!= 3">
						<h-table  border highlight-row size="small" :columns="arySynonTagData" :data="arySynonTagList"  @on-current-change="onClickSynonTag"></h-table>
						<Spin fix v-if="isLoadSynonTag">
							<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
							<div>加载中...</div>
						</Spin>
						<div class="page-box">
							<h-page :total="intSynonTotal" :page-size="intSynonPageSize" 
							:current="intSynonPageNum" @on-change="onSynonPageChange" show-total size="small"></h-page>
						</div>
					</div>
					<div class="search" v-if="tagRefuseForm.refuseReason == 2">
						<div class="search-input">
							<span class="title">同义词：</span><h-input placeholder="请输入..." v-model.trim="tagRefuseForm.synonym"></h-input>
						</div>
					</div>						
				</div>
				<template v-else>
					<h-form :model="tagRefuseForm" :label-width="95" :rules="descriptionRule" ref="tagRefuseForm" class="confirm-form">
						<h-form-item label="备注：" prop="remark" class="form-remark">
							<h-input v-model.trim="tagRefuseForm.remark" type="textarea"  placeholder="请输入..." autocomplete="off">
							</h-input>
						</h-form-item>					
					</h-form>
				</template>
				<div slot="footer" class="confirm-form-footer">
					<h-button @click="onUpStepRefuse">上一步</h-button>
					<h-button type="primary" @click="onSubmitConfirmTag" 
					:loading="isReqConfirmTag">提交</h-button>
				</div>								
			</template>
		</h-msgBox>	
		<h-msgBox title="标签搜索" v-model="isShowViewBox" :mask-closable="false" @on-close="onCloseViewBox" class-name="vertical-center-modal" :top="0" :width="700">
			<div class="confirm-form-content">
				<div class="search" >
					<span class="title">标签名称：</span><h-input placeholder="请输入..." v-model.trim="strExistTagKeyword"  @on-keyup.enter="onSearchSynonTagList" icon="search" @on-click="onSearchSynonTagList"></h-input>
					<span class="title title-margin">标签类别：</span>
					<h-select v-model="strExistTagType" :clearable="false" @on-change="onSearchSynonTagList" placeholder="请选择">		
						<template v-for="(data,key) in aryTagTypeList">			
							<h-option :value="data.category_id" :key="data.category_id">{{data.category_name}}</h-option>	
						</template>
					</h-select>						
				</div>				
			</div>
			<div class="content-wrapper">
				<h-table  border size="small" :columns="arySynonTagData" :data="arySynonTagList"></h-table>
				<Spin fix v-if="isLoadSynonTag">
					<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
					<div>加载中...</div>
				</Spin>
				<div class="page-box">
					<h-page :total="intSynonTotal" :page-size="intSynonPageSize" :current="intSynonPageNum" @on-change="onSynonPageChange" show-total size="small"></h-page>
				</div>
			</div>
	    	<div slot="footer" >
				<!-- <h-button type="primary" @click="onCloseViewBox">确定</h-button>		 -->	
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
				applyUserObj: {},
				isShowApplyUserBox:false,				
				remark:'',
				isShowTipBox:false,
				isDistriList:false,
				isLoadSynonTag:false,
				handlerName:'',
				isShowConfirmBox:false,
				handlerUserName:'',
				addType:'',
				tagConfirmForm:{
					tagId:'',					
					confirmStep:'',
					confirmTagName:'',
					confirmTagType:'',
					result:''
				},	
				tagRefuseForm:{
					tagId:'',					
					refuseStep:'',
					refuseReason:'',
					synonym:'',
					remark:'',
					result:''
				},				
				tagTypeTree:[],
				/*初始化查询条件*/
				strTagKeyword:'',
				intTagType:'',
				aryTagTypeList:[],
				intHandleStatus:'',
				aryHandleStatusList:[],
				intHandleResult:'',
				aryHandleResultList:[],
				intHandleUser:'',
				aryHandleUserList:[],				
				arySelectTagRows:[],
				tagRow:{},
				hanglerRow:{},
				buttonType:1,
				aryRefuseReason:[],
				isReqHandleUser:false,
				exportUrl:'/tm/tag/export',
				applyTimeBegin:'',
				applyTimeEnd:'',
				handlerTimeBegin:'',
				handlerTimeEnd:'',
				isShowViewBox:false,
				strTagId:'',				
				/*初始化列表*/
				aryTagList: [],
				intPageNum: 1,
				intPageSize: 12,
				intTotal: 0,
				isSearchTagList: false,
				aryHeaderData: [				
					{
                        type: 'selection',
                        width: 60,
                        fixed: 'left',
                        align: 'center'                     
                    },{
						title: '任务编号',
						key: 'tagId',
					    fixed: 'left',
					    width:150,
					},{
						title: '标签名称',
						key: 'tagName',
					    //fixed: 'left',
						width:200,
						render: (h, params) => {
						 	let tagNameStr = params.row.tagName;
						 	if(!tagNameStr) return '';
						 	if(params.row.tagName.length>15){
						 		tagNameStr =  params.row.tagName.slice(0, 15)+'...';
						 	}
                            return h('div',{
                            	on:{
									click:() =>{
										this.onViewTag(params.row);
									}
								}
                            }, [
                                h('Icon', {
                                    props: {
                                        name: 'search'
                                    }
                                }), 
                                
	                       		h('h-tooltip', {
		                            props: { placement: 'bottom-start' }
		                        }, [
		                           tagNameStr,
		                            h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.tagName)
		                        ]),                               
                                //h('strong', params.row.tagName)
                            ]);
                        }					
					},{
						title: '标签类别',
						key: 'categoryName',
						width:150,
						render: (h, params) => {						
					        if (params.row.categoryName==null) return;
					        let fullCategoryNameStr ='';
					        let reg = new RegExp(",","g")
					        if(params.row.fullCategoryName!=null){
					        	 fullCategoryNameStr = params.row.fullCategoryName.replace(reg,"-");
					        }					       	
							return h('h-tooltip',{
								style: {
									color:'#298DFF'	
								},
								props:{														
									placement:'bottom-start'								
								}
							},[
								h('div',params.row.categoryName),
								h('div',{
									slot: 'content',
									style: {
		                              whiteSpace: 'normal'
		                            }
							},fullCategoryNameStr)
							]);
						}						
					},{
						title: '资讯原文',
						key: 'action',
						align: 'center',
						render: (h, params) => {
							if(params.row.newsUrl==null) return;
							let toLink = params.row.newsUrl;
	                        return h('a',{	                       		
	                           	attrs: {
	                               	href: toLink,
	                               	target:'_blank'
	                           	}
	                       }, [
		                       	h('i',{
									class: {
										'iconfont': true,
										'icon-barrage_fill': true,
										'tab-icon-btn': true

									},
									attrs:{'title':'查看资讯原文'}
								})
	                       ]);
						}				
					},{
						title: '处理状态',
						key: 'handleStatusStr',					
					},{
						title: '处理结果',
						key: 'handleResultStr',
						width: 150,
						render: (h, params) => {
							let handlerRes = '';
							if(params.row.handleStatus != 0){
								handlerRes = '';
							}else if(params.row.handleResult == 1){
								handlerRes = params.row.handleResultStr;
							}else{
								handlerRes = params.row.handleResultStr
								+"-"+params.row.refuseReasonStr;
							}														
							return h('div',{},handlerRes);			
						}
					},{
						title: '申请时间',
						key: 'applyTime',
						width:150
					},{
						title: '申请用户',
						key: 'applyUserName',

					},{
						title: '处理人',
						key: 'handleUserName'
					},{
						title: '处理时间',
						key: 'handlerTime',
						width:150
					},{
						title: '备注',
						key: 'remark',
						width:200,
						render: (h, params) => {
							let remarkstr = params.row.remark;
							if (!remarkstr) return ''
					        if (remarkstr.length > 20) {
					           remarkstr = remarkstr.slice(0,20) + '...'
					        }						
							return h('h-tooltip',{
								style: {
									color:'#298DFF'	
								},
								props:{														
									placement:'bottom-start'								
								}
							},[
								h('div',remarkstr),
								h('div',{
									slot: 'content',
									style: {
		                              whiteSpace: 'normal'
		                            }
							},params.row.remark)
							]);
						}
					},{
						title: '操作',
						key: 'action',
                        fixed: 'right',
						width:120,
						render: (h, params) => {
							let distriBtn = null;
							let confirmBtn = null;
							let refuseBtn = null;
							if(this.activeRoutersButton.indexOf('TagCheckDistri') != -1&&params.row.handleStatus != 0){
							//待分配和待处理展示待分配
								distriBtn = h('i',{
									class: {
										'iconfont': true,
										'icon-android-contacts': true,
										'tab-icon-btn': true

									},
									attrs:{'title':'分配'},
                                    on: {
                                        click: () => {
                                            this.onTagDistriBtn(params.row);
                                        }
                                    }
								});
							}
							if(this.activeRoutersButton.indexOf('TagCheckAdd') != -1&&params.row.handleStatus == 1){
							//待处理展示确认添加和拒绝添加
								confirmBtn = h('i',{
									class: {
										'iconfont': true,
										'icon-checkmark-circled': true,
										'tab-icon-btn': true,
									},
									attrs:{'title':'确认添加'},
                                    on: {
                                        click: () => {
                                            this.onTagConfirmBtn(params.row);
                                        }
                                    }
								});
							}
							if(this.activeRoutersButton.indexOf('TagCheckRefuse') != -1&&params.row.handleStatus == 1){
								refuseBtn = h('i',{
									class: {
										'iconfont': true,
										'icon-closecircled': true,
										'tab-icon-btn': true,
									},
									attrs:{'title':'拒绝添加'},
                                    on: {
                                        click: () => {
                                            this.onTagRefuseBtn(params.row);
                                        }
                                    }
								});
							}
						return h('div', [distriBtn,confirmBtn,refuseBtn]);

						}

						
					}
				],
				/*分配弹窗参数*/
				isShowDistriBox:false,				
				selectUserObj:{},
				isReqDistriTag:false,
				aryDistriList:[],
				aryDistriHeaderData:[					
					{
						title: '人员姓名',
						key: 'userName'						
					},{
						title: '待处理任务',
						key: 'total'						
					},{
						title: '已处理任务',
						key: 'dealTotal'						
					}
				],
				
				/*确认添加窗口*/
				isShowConfirmBox:false,				
				descriptionRule:{
					remark:[
						{required:true, max:300,message:'备注不能为空，备注最多300个字符',trigger:'blur'}
					]
				},
				isReqConfirmTag:false,
				/*拒绝添加弹窗*/
				tagMapping: {
	              "101108": "3",
	              "101103": "4",
	              "101102": "6",
	              "101101": "10",
	            },
				isShowRefuseBox:false,
				arySelectRefuseReason:'',
				strSynonTagKeyword:'',
				strSynonTagType:'',
				strExistTagKeyword:'',
				strExistTagType:'',	
				strConfirmTagKeyword:'',
				strConfirmTagType:'',			
				synonTagObj:{},
				arySynonTagList:[],
				intSynonTotal:0,
				intSynonPageSize:5,
				intSynonPageNum:1,				
				arySynonTagData:[
					{
						title: '标签名称',
						key: 'tag_value'						
					},{
						title: '关联信息',
						//key: 'tag_value',
						width:300,
						render: (h, params) => {							
							if(params.row.category_id==101107){
								let cropnum = params.row.other_object.corp_detail.length;
								if(cropnum>0){
									let cropArry = params.row.other_object.corp_detail;
									let cropname = '';
									for(let i=0;i<cropnum;i++){
										if(i==0){
											cropname = cropArry[0].corp_name;
										}else{
											cropname += ','+cropArry[i].corp_name;
											
										}
									}
									return h('h-tooltip',{
										style: {
											color:'#298DFF'	
										},
										props:{	
											placement:'bottom-start'
										}
										},[
											h('div',cropArry[0].corp_name),
											h('div',{
												slot: 'content',
												style: {
					                              whiteSpace: 'normal'
					                            }
										},cropname)
									]);
									//return h('div',cropname);	
								}
							}
							return h('div',params.row.other_object.corp_name);
							
						}						
					},{
						title: '标签类别',						
						render: (h, params) => {
							let length = params.row.categorys.length;
							if(length==0){
								return;
							}							
							let tagContent = '';
							let tagTitle = '';	
							for(let i=0;i<params.row.categorys.length;i++){
								if(i==0){
									tagContent = params.row.categorys[0].category_name;
									tagTitle = params.row.categorys[0].category_name;
								}else{
									tagContent += '-'+params.row.categorys[i].category_name;
									
								}
								if(i==length){
									tagTitle += '......'+params.row.categorys[length].category_name;
								}
							}
							return h('div',tagContent);				
							// return  h('h-tooltip',{
							// 	style: {
							// 		color:'#298DFF'
							// 	},
							// 	props: {
							// 		placement: 'left'
							// 	}
							// },[								
							// 	h('div',tagTitle),
							// 	h('div',{
							// 		slot: 'content',
							// 		style: {
		     //                          whiteSpace: 'normal'
		     //                        }
							// 	},tagContent)									
							// ]);							
						}						
					}
				]

			}
		
		},
		computed: {
			maxTableHeight(){ return this.$store.state.maxTableHeight },
		},
		methods: {			
			/*判断请求返回的结果*/
			httpResValid(data){
				if(data==null){
					//this.$hMessage.error("发生未知错误");
					return false
				}else if(data.status != this.$api.SUCCESS){
					this.$hMessage.error(data.msg);
					return false;
				}
				return true;
			},		
			/*获取标签类别的数据字典--初始化加载[aryTagTypeList]*/
			getTagTypeDict(){				
				utils.tagType((data)=>{
					if(!this.httpResValid(data)) return;
					let tmpObj = data;					
					this.aryTagTypeList = tmpObj.data ? tmpObj.data : [];
				})
				
			},
			/*获取处理状态数据字典--初始化加载[aryHandleStatusList]*/
			getHandleStatusDict(){				
				utils.handlerStatus((data)=>{
					if(!this.httpResValid(data)) return;
					let tmpObj = data;
					this.aryHandleStatusList = tmpObj.data ? tmpObj.data : [];
				})
			},
			/*获取处理结果数据字典-- 初始化加载[aryHandleResultList]*/
			getHandleResultDict(){
				utils.handleResult((data)=>{
					if(!this.httpResValid(data)) return;
					let tmpObj = data;
					this.aryHandleResultList = tmpObj.data ? tmpObj.data : []; 
				})				
			},
			/*获取拒绝原因的字典数据--初始化加载[aryRefuseReason]*/
			getRefuseReasonDict(){
				utils.refuseReason((data)=>{
					if(!this.httpResValid(data)) return;
					let tmpObj = data;
					this.aryRefuseReason = tmpObj.data ? tmpObj.data : []; 
				})				
			},
			/*获取处理人数据--初始化加载[aryHandleUserList]*/
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
			onClearKeyword(){
				this.strTagKeyword='';
				this.$refs.strTagKeyword.focus();
			},
			onClearTagId(){
				this.strTagId='';
				this.$refs.strTagId.focus();
			},	
			onChangeApplyBegin(value){
				this.applyTimeBegin=value;
				this.getHrefUrl();
			},
			onChangeApplyEnd(value){
				this.applyTimeEnd = value;
				this.getHrefUrl();
			},
			onChangeHandlerBegin(value){
				this.handlerTimeBegin = value;
				this.getHrefUrl();
			},
			onChangeHandlerEnd(value){
				this.handlerTimeEnd = value;
				this.getHrefUrl();
			},
			getHrefUrl(){
				let urlParams = this.getSearchParams();
				let url = '/tm/tag/export?'+urlParams;
				this.exportUrl = url;
			},		
			/*一键任务分配*/
			onOneKeyTaskDistri(){				
                utils.assignrole((data)=>{						
					if(!this.httpResValid(data)) return;
					let tmpObj = data;						
					this.$hMsgBox.confirm({
						title:'提示',
						content: "确认后，系统根据任务量，自动将待分配的任务分配给处理人。是否确认分配？",

						onOk:()=>{
	                        this.getAutodistribute();
	                    },
						onCancel:()=>{
						  	return;
						}
					})	
				})
			},			
			getAutodistribute(){
				utils.autodistribute((data)=>{						
					if(!this.httpResValid(data)) return;
					let tmpObj = data;						
					this.$hMessage.info(tmpObj.data);
					return;		
				})
			},
			/*分配任务*/
			initDistri(){
				this.getUserDutyList();					
				this.isShowDistriBox = true;
			},
			onTaskDistri(){
				utils.assignrole((data)=>{						
					if(!this.httpResValid(data)) return;
					let tmpObj = data;						
					if(this.arySelectTagRows.length==0){
						this.$hMessage.error("请先选择需要分配的标签");
						return;
					}
					for(let i=0;i<this.arySelectTagRows.length;i++){
						let status = this.arySelectTagRows[i].handleStatus;
						if(status==0){
							this.$hMessage.error("已处理记录不可分配");
							return;
						}
					}
					this.initDistri();
				})
			},
			/*点击分配按钮*/
			onTagDistriBtn(row){
				utils.assignrole((data)=>{						
					if(data==null){
						//this.$hMessage.error("发生未知错误");
						return;
					}else if(data.status != this.$api.SUCCESS){
						this.$hMessage.error({
								content: data.msg,
                				duration: 3
							});
						return;
					}
					this.tagRow = row;
					this.buttonType=0;	
					this.initDistri();
				})					
			},
			/*获取分配任务的人员信息*/
			getUserDutyList(){
				if(this.isDistriList) return;
				this.isDistriList=true;
				let handlerName = encodeURIComponent(this.handlerName);
				utils.userDuty(handlerName,(data)=>{
					this.isDistriList=false;
					if(!this.httpResValid(data)) return;
					let tmpObj = data;						
					this.aryDistriList  = tmpObj.data ? tmpObj.data : [];
				})
			},
			onCloseDistriBox(){
				//关闭弹窗，并置空弹窗的列表数据				
				this.selectUserObj={};
				this.handlerName='';								
				this.aryDistriList = [];
				this.buttonType = 1;
				this.isShowDistriBox = false;
			},
			//选中人员
			onClickDistriUser(currentRow,oldCurrentRow){
				this.selectUserObj = currentRow;				
			},
			//提交分配的人员时，参数需要有人员的id和标签的id
			onSubmitDistriTag(){
			    if(this.isReqDistriTag) return;
			    if(JSON.stringify(this.selectUserObj)=='{}'){
			    	this.$hMessage.error('选择要分配的人员');
			    	return;
			    }
			    this.isReqDistriTag = true;
			    let tagId = null;
			    if(this.buttonType==0){
			    	tagId = this.tagRow.tagId;
			    }else{
			    	 tagId = utils.joinId(this.arySelectTagRows);
			    }			    	   				
				let data = { tagIds:tagId, userId:this.selectUserObj.userId };
				utils.submitDistri(data,(data)=>{
					this.isReqDistriTag = false;	
					if(!this.httpResValid(data)) return;
					this.onCloseDistriBox();
					this.getTagList();
				})				
			},
			
			/*查询和导出*/
			onSearchTagList(){
				this.intPageNum = 1;//初始化页码
				this.arySelectTagRows=[];
				this.getTagList();//查询数据
			},			
			onPageChange(page){
				this.intPageNum = page;
				this.getTagList();
			},		
			getSearchParams(){
				let tagType = this.intTagType == -1 ? '' : this.intTagType;
				let handleStatus = this.intHandleStatus == -1 ? '' : this.intHandleStatus;
				let handleResult = this.intHandleResult == -1 ? '' : this.intHandleResult;
				let handleUser = this.intHandleUser == -1 ? '' : this.intHandleUser;
				let urlParams = utils.searchParams(tagType,handleStatus,handleResult,this.strTagKeyword,handleUser,2,this.applyTimeBegin,this.applyTimeEnd,this.handlerTimeBegin,this.handlerTimeEnd,this.strTagId);			
				return urlParams;
			},
					
			/*获取分页的标签列表*/
			getTagList(){
				if(this.isSearchTagList) return;
				this.isSearchTagList = true;				
				let params = this.getSearchParams();
				let urlParams = 'pagenum='+this.intPageNum+'&pagesize='+this.intPageSize+'&'+params;							
				utils.searchList(urlParams,(data)=>{
					this.isSearchTagList = false;
					if(data==null){
						this.aryTagList = [];//置空数据
						this.isSearchTagList = false;//状态重置
						this.intTotal =0;
						//this.$hMessage.error("发生未知错误");
						return;
					}	
					let tmpObj = data;
					if(tmpObj.status == this.$api.SUCCESS){
						let tmpData = tmpObj.data ? tmpObj.data : {}; 
						this.aryTagList = tmpData.list ? tmpData.list : [];
						this.intTotal = tmpData.total ? tmpData.total : 0;
						if(this.intTotal && this.aryTagList.length == 0){
							this.intPageNum = Math.ceil(this.intTotal/this.intPageSize)
							this.getTagList();
						}
					}else{
						this.aryTagList = [];
						this.intTotal =0;
						this.$hMessage.error(tmpObj.msg);
					}
				})
			},
			
			/*点击确认添加按钮*/
				/*点击确认添加按钮*/
			//第一步点击列表中的确定添加按钮
			onTagConfirmBtn(row){
				utils.checkhandler(row,(data)=>{						
					if(data==null){						
						return;
					}else if(data.status != this.$api.SUCCESS){
						this.$hMessage.error({
								content: data.msg,
                				duration: 3
							});
						return;
					}
					this.strConfirmTagType=row.categoryId;
				    this.strConfirmTagKeyword=row.tagName;
				    this.tagConfirmForm.confirmStep=0;
				    this.tagConfirmForm.tagId=row.tagId;
				    this.addType=1;
				    this.isShowConfirmBox=true;					
					this.onSearchSynonTagList();
				})				
			},
			//取消		
			onCloseConfirmBox(){
				this.tagConfirmForm={
					tagId:'',					
					confirmStep:'',
					confirmTagName:'',
					confirmTagType:'',					
					result:'',
					isexists:false
				},
				this.addType='';
				this.resetRefuseReasonBox();
				this.isShowConfirmBox=false;
			},
			//选择同义标签，判断标签是否存在，
			onSureNextOne(){
				if(JSON.stringify(this.synonTagObj)=='{}'){
					this.$hMessage.error('请选择标签');
					return;
				}
				let tagValue = this.synonTagObj.tag_value;
				let businessId = this.synonTagObj.tag_id;
				let categoryId = this.synonTagObj.categorys[0].categoty_id;				
				utils.checkTag(businessId,tagValue,categoryId,(res)=>{
					if(!this.httpResValid(res)) return;
					if(res.data.isexists){
						this.submit(res.data.result);
					}else{
						this.tagConfirmForm.confirmTagName=tagValue;
						this.queryCategoryTree();
						this.tagConfirmForm.confirmStep=1;
					}
					
				})	
				
				
			},
			onSureUpZero(){
				this.synonTagObj={};
				this.tagConfirmForm.confirmStep=0;
			},
			//标签树
			queryCategoryTree(){
				let parentId = this.synonTagObj.categorys[0].categoty_id;
				utils.categoryTree(parentId,'',(res)=>{
					if(!this.httpResValid(res)) return;					
					let result = [];
					result.push(res.data);
					this.tagTypeTree = result;
					
				})
			},
			treeChange(data){			
				this.tagConfirmForm.confirmTagType=data[0].id;
			},
			getRegisterData(){
				let tagId = null;
				let tagName = null;
				if(this.arySynonTagList.length>0){
					tagId = this.synonTagObj.tag_id;				
					tagName = this.synonTagObj.tag_value;		
				}
				let data = {
				    category_id: this.tagConfirmForm.confirmTagType,
				    other_obj: {
				       business_id: tagId
				    },
				    tag_value: tagName
				};
				return data;
			},
			
			
			/*点击拒绝添加按钮*/
			onTagRefuseBtn(row){
				utils.checkhandler(row,(data)=>{						
					if(data==null){
						//this.$hMessage.error("发生未知错误");
						return;
					}else if(data.status != this.$api.SUCCESS){
						this.$hMessage.error({
							content: data.msg,
            				duration: 3
						});
						return;
					}
					this.tagRefuseForm.refuseStep=0;				
					this.tagConfirmForm.refuseReason='';					
					this.strSynonTagType=row.categoryId;
					this.strSynonTagKeyword=row.tagName;
					this.strExistTagType=row.categoryId;
				    this.strExistTagKeyword=row.tagName;
					this.tagRefuseForm.tagId = row.tagId;				
					this.isShowRefuseBox = true;
				})

			},
			
			onCloseRefuseBox(){				
				this.arySelectRefuseReason= '';
				this.tagRefuseForm={
					tagId:'',					
					refuseStep:'',
					refuseReason:'',
					synonym:'',
					remark:'',
					result:''
				};
				this.resetRefuseReasonBox();				
				this.isShowRefuseBox = false;

			},
			resetRefuseReasonBox(){
				this.intSynonTotal=0;
				this.intSynonPageNum=1;
				this.arySynonTagList=[];
				this.synonTagObj={};
			},			
			//点击标签拒绝原因
			onRefuseReasonBox(){
				let value = this.arySelectRefuseReason;
				this.resetRefuseReasonBox();
				this.tagRefuseForm.refuseReason=value;	
				this.tagRefuseForm.refuseStep=1;			
				if(value==1 || value==2){//标签已存在或者有同义标签
					this.onSearchSynonTagList();					
				}
			},
			/*同义标签上一步*/
			onUpStepRefuse(){
				this.tagRefuseForm.refuseStep=0;
			},
			
			onSynonPageChange(page){
				this.intSynonPageNum= page;
				this.getTagSynonList();
			},
			/*搜索同义标签*/
			onSearchSynonTagList(){
				this.intSynonPageNum=1;
				this.getTagSynonList();
			},			
			getTagSynonList(){
				let keyword = '';
				let tagType = '';
				if(this.addType==1){//确认添加
					keyword = this.strConfirmTagKeyword;
					tagType = this.strConfirmTagType;	
				}else{
					if(this.tagRefuseForm.refuseReason==2){
						keyword = this.strSynonTagKeyword;
						tagType = this.strSynonTagType;
					}else{
						keyword = this.strExistTagKeyword;
						tagType = this.strExistTagType;					
					}
				}
				
				if(keyword==''){
					this.$hMessage.error('请填写标签名称');
					return;
				}
				if(tagType==''){
					this.$hMessage.error('请选择标签类别');
					return;
				}				
				let params = 'pagenum='+this.intSynonPageNum+'&pagesize='+this.intSynonPageSize+'&category_id='+tagType+'&tag_value='+encodeURIComponent(keyword);
				this.getSimilarity(params);
			},
			getSimilarity(params){
				if(this.isLoadSynonTag) return;
				this.isLoadSynonTag=true;
				utils.similarity(params,(data)=>{
					this.isLoadSynonTag=false;					
					if(data==null){
						//this.$hMessage.error("发生未知错误");
						this.intSynonTotal = 0;
						this.arySynonTagList = [];
						return;
					}else if(data.status != this.$api.SUCCESS){
						this.$hMessage.error({
								content: data.msg,
                				duration: 3
							});
						this.arySynonTagList = [];
						this.intSynonTotal = 0;
						this.$hMessage.error(tmpObj.msg);
						return;
					}
					let tmpObj = data;
					let tmpData = tmpObj.data ? tmpObj.data : {}; 
					this.arySynonTagList = tmpData.list ? tmpData.list : [];
					this.intSynonTotal = tmpData.total ? tmpData.total : 0;
					if(this.intSynonTotal && this.arySynonTagList.length == 0){
						this.intSynonPageNum = Math.ceil(this.intSynonTotal/this.intSynonPageSize)
						this.getTagSynonList();
					}		
				})					
				
			},
			/*选中同义标签*/
			onClickSynonTag(currentRow,oldCurrentRow){
				this.synonTagObj = currentRow;
			},
			/*提交拒绝添加*/
			onSubmitConfirmTag(){
				if(this.addType==1){//确认添加
					if(!this.tagConfirmForm.confirmTagType){
						this.$hMessage.error('请选择标签');
						return;
					}	
					let dataJson = this.getRegisterData();
					this.isReqRegister = true;	
					utils.register(dataJson,(res)=>{
						this.isReqRegister = false;
						if(!this.httpResValid(res)) return;						
						this.submit(res.data);
					});
				}else{
					if(this.tagRefuseForm.refuseReason==3){
						this.$refs['tagRefuseForm'].validate((valid) => {
							if(valid){						
								this.submit('');								
							}
						})
					}else{
						this.submitRefuse();
					}
					
				}
				
			},
			submitRefuse(){

				if(JSON.stringify(this.synonTagObj)=='{}'){
					this.$hMessage.error('请选择标签');
					return;
				}				
				let tagValue = this.synonTagObj.tag_value;
				let businessId = this.synonTagObj.tag_id;
				let categoryId = this.synonTagObj.categorys[0].categoty_id;			
				utils.checkTag(businessId,tagValue,categoryId,(res)=>{
					if(!this.httpResValid(res)) return;
					if(res.data.isexists){
						if(this.tagRefuseForm.refuseReason==2){
							if(!this.tagRefuseForm.synonym){
								this.submit(res.data.result);
							}else{
								let typeId = this.synonTagObj.categorys[0].categoty_id;
								if(this.tagMapping[typeId] ==undefined ){
									this.$hMessage.error('该类标签暂时不能提交同义词，请清空同义词后重试');
									return;
								}
								let params={
								  "jyc": this.tagRefuseForm.synonym,
								  "tagId": this.synonTagObj.tag_id,
								  "type": this.tagMapping[typeId]
								}
								let url = '/tm/tag/jyc/save'
								this.$http.post(url, params).then((ressave)=>{
									let tmpObj = ressave.data;
									if(tmpObj.status == this.$api.SUCCESS){
										this.submit(res.data.result);
									} else {
										this.$hMessage.error(tmpObj.msg)
									}
								}).catch(err=>{
									this.$hMessage.error('发生未知错误!')
								})
							}
						}else{
							this.submit(res.data.result);
						}						
					}else{
						this.$hMessage.error('标签未同步，请稍后重试或联系管理员进行同步');
					}
				})
			},
			submit(result){
				let dataConfirm = {};
				if(this.addType==1){
					dataConfirm = { 
						handleResult: 1,
					 	tagId:this.tagConfirmForm.tagId,
					 	noticeMessage:'',
					 	refuseReason:'',
					 	remark:this.tagConfirmForm.remark,
					 	relationTagId:this.synonTagObj.tag_id,
					 	relationTagName:this.synonTagObj.tag_value,
					 	result:result
					 };
				}else{
					dataConfirm = { 
						handleResult: 2,
					 	tagId:this.tagRefuseForm.tagId,
					 	noticeMessage:'',
					 	refuseReason:this.tagRefuseForm.refuseReason,
					 	remark:this.tagRefuseForm.remark,
					 	relationTagId:this.synonTagObj.tag_id,
					 	relationTagName:this.synonTagObj.tag_value,
					 	result:result
					 };
				}
				utils.submitConfirm(dataConfirm,(data)=>{
					this.isReqConfirmTag = false;
					if(!this.httpResValid(data)) return;
					if(this.addType==1){
						this.onCloseConfirmBox();
					}else{
						this.onCloseRefuseBox();
					}
					this.getTagList();	
				})	
			},
			/*选中标签*/
        	selectTagChange(selection) {             
               this.arySelectTagRows = selection;                        
            },
            onViewTag(row){
            	this.strExistTagType=row.categoryId;
				this.strExistTagKeyword=row.tagName;
				this.onSearchSynonTagList();
				this.isShowViewBox=true;
            },
            onCloseViewBox(){ 
            	this.arySynonTagList=[];
            	this.intSynonTotal=0;  
				this.isShowViewBox=false;
            },
			/*初始化，加载页面初始的数据*/
			init(){							
				//this.getTagList();
				this.getTagTypeDict();
				this.getHandleStatusDict();
				this.getHandleResultDict();
				this.getRefuseReasonDict();
				this.getHrefUrl();
				utils.handleUser('',(data)=>{						
					if(!this.httpResValid(data)) return;
					let tmpObj = data;						
					this.aryHandleUserList = tmpObj.data ? tmpObj.data : [];
					if(tmpObj.data){
						this.intHandleUser =tmpObj.data[0].id; 
						this.handlerUserName = tmpObj.data[0].realName+'('+tmpObj.data[0].userName+')';	
					}									
					this.getTagList();		
				});								
			}
		},
		mounted(){			
			this.init();
		}

		
	}
</script>

<style type="text/css" scoped>
.tag > .distri-button{
	line-height: 32px;
	margin-bottom: 10px;
}
.tag > .search,.tag > .serch .primary-btn {
	line-height: 32px;
	width: 100%;
	display: inline-block;
}
.primary-btn {
	line-height: 32px;
	width: 100%;
	display: inline-block;
}

.tag > .search .h-input-wrapper,.tag > .search .h-select,.tag > .search .datepicker,.tag > .search .h-date-picker{
	width: 180px;
	margin-right: 10px;
	vertical-align: top;
	float: left;
	margin-bottom: 10px;
}
.tag > .search .datepicker{
	width: 380px;
	margin-bottom: 0px;
}
.tag > .search .h-date-picker{
	width: 175px;
}
.tag > .search .h-select{
	width: 180px;
}
.tag > .search .title,.tag > .search .h-btn{
	float: left;
	margin-bottom: 10px;
}
.tag > .search .h-btn{
	margin-right: 10px;
}
.refuse-radio-content{
	margin-bottom: 20px;
}
.refuse-radio-content .h-radio-wrapper{	
	margin-right: 100px;
	border-radius: 4px;
    border: 1px solid #D7DDE4;
}
.refuse-radio-content .h-radio-group-button .h-radio-wrapper-checked{
	 border: 1px solid #298DFF;
	 box-shadow:0 0 #298DFF;
}
.confirm-form{
	margin-top: 20px;
}
.confirm-form-content .refuse-reason-content{
	border: 1px solid #6699ff;
    margin-bottom: 13px; 
    padding: 8px 25px;
    color: #6699ff;
}
.confirm-form-content .search{
	line-height: 32px;
	width: 100%;
	display: inline-block;
}
.confirm-form-content .h-input-wrapper{
	width: 200px;	
	vertical-align: top;
	float: left;
	margin-bottom: 10px;
}
.form-remark .h-input-wrapper{
	float: none;
}
.confirm-form-content .title{
	float: left;
	margin-bottom: 10px;
	width: 65px;
    text-align: right;
}
.confirm-form-content .h-select{
	width: 200px;
	display: inline-block;
    float: left;	
}
/*.search-input{
	display: inline-block;
}*/
.tooltip-content{
	color:red;
	margin-bottom: 10px;
}
.user-content{
	margin-bottom: 10px;
}
.tip-title{
	margin-bottom: 15px;
    font-weight: bold;
    font-size: 14px;	
}
.search-distri{
	margin-bottom: 10px;
	width: 200px;
}
.confirm-form-content .h-selectTree{
	width: 200px;
	display: inline-block;
    float: left;	
}

.title-margin{
	margin-left: 20px;
}

</style>