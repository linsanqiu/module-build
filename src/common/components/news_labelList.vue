<template>
	<div class="news_labelList_box" v-if="!((pageType == 'VIEW' || isSpecialPage) && labelListData.length ==0)" >
		<h-form-item  v-if="hiddenItemArr.indexOf(labelListType) <0" prop="labelList" :label="labelListName">
	        <div class="label-list-box">				        	
	        	<div class="label-btn-box" v-if="pageType!='VIEW' && !isSpecialPage">	        	 
	        		<NewsSearchLabel @addLabelInfoFn="addLabelInfoFn" :categoryId="categoryId[labelListType]"></NewsSearchLabel>
	        	</div> 
	        	<div class="labelTableBox" v-if="labelListData.length > 0 || pageType=='VIEW' || isSpecialPage">        		
	        		<h-simple-table  canMove showTitle :row-class-name="rowClassNameFn"  :height="labelListData.length >= 10 ? 370 : (labelListData.length * 40 + 40)" stripe size="small" border :columns="columns(columnsShowflag,showNedType = (isEventPage || isSpecialPage) ? true : false)" :data="labelListDataCopy" ></h-simple-table >
	        	</div>
			</div>
		</h-form-item>
	</div>
</template>

<script>
	import NewsSearchLabel  from '@/components/news-search-label';
	export default{
		components: { NewsSearchLabel},
		props:{
			pageType:String,
			labelListType:String,
			labelListName:String,
			columnsShowflag:String,
			labelListData:Array,
			hiddenItemArr:Array,
			isSpecialPage:false,
			isEventPage:false,
		},
		data(){
			return{
				labelListDataCopy:[],
				categoryId:{
					labelListSecurity:'101109',
					labelListCorp:'101102',
					labelListIndustry:'101101' ,
					labelListConcept:'101111',
					labelListIndicator:'101112' ,
					labelListArea:'101110'
				},
				mainBasis:''
			}
		},
		methods:{
			rowClassNameFn(row,index){				
				if(row.nedType == 2){
					return 'abbiguityLabel'
				}
				if(row.flag == 9){
					return 'table-default-highlight';
				}
				if(row.flag == -1){
					return 'table-weak-highlight';
				}
			},
			columns(showflag,showNedType = false){
				return [
					{
						title: '名称',
						key: 'tagName',
						width: showflag == 'security' ? 105 : 250,
						ellipsis:true,
						sortable:true
					},
					{
						title: '关联信息',
						key: 'relationInfo',
						width: 180,
						sortable:true,
						ellipsis:true,
						hiddenCol:this.isEventPage
					},
					{
						title: '分类',
						key: 'categoryNames',
						minWidth: 180,
						hiddenCol:showflag == 'concept' || showflag == 'indicator',
						sortable:true,
						ellipsis:true,
						render: (h, params) => {
							let categoryNames = params.row.categoryNames ? params.row.categoryNames.split('>') : [];
							let len = categoryNames.length;
							let categoryNamesShow = '';
							if(len >= 4){
								categoryNamesShow = categoryNames[len -2]+ '>'+  categoryNames[len -1];
							}else{
								categoryNamesShow = categoryNames.join('>');
							}
						 	return h('span',categoryNamesShow)
						},
					},					
					{
						key: "main",
						title: "主体",
						align: "center",
						width: 60,
						hiddenCol:showflag != 'corp' && showflag != 'security' || this.isEventPage,
						render: (h, params) => {
							let operatestatus = params.row.main;
						 	return h('checkbox',{
						 		style: {
									display: params.row.nedType == 2 ? 'none':'block'
								},
						 		props: {
									value: params.row.main == 1 ? true :false
								},
						 		on: {
									'on-change':() => {
										this.labelListData[params.index].main = operatestatus == 1 ? 0 : 1;
//										this.$emit('handleDelFlag');//不触发更新
									}
								}
						 	})
						},
					},
					{
						title: '主体依据',
						key: 'mainBasis',
						width:150,
						align:'center',
						hiddenCol:!this.isEventPage,
						render:(h,params)=>{
							return h('div', [
							    h('span',{
							    	style:{
										'display':'inline-block',
										'maxWidth':'90px',
										'textOverflow':'ellipsis',
										'whiteSpace':'nowrap',
										'overflow':'hidden',
										'lineHeight': '12px',
										'cursor':'pointer'
									},
									attrs:{
										title:params.row.mainBasis,
									},									
									props:{
										title:params.row.mainBasis
									}
							    },params.row.mainBasis),
								h('span', {
									style:{
										'display': this.pageType == 'HANDLE' ? 'inline-block' : 'none',
										'marginLeft':'8px'
									},
									class: {
										'iconfont': true,
										'icon-t-b-message':true,
										'tab-icon-btn': true,
									},
									on: {
										click: () => {
											let mainBasis = params.row.mainBasis;
											 this.$hMsgBox.confirm({
							                    render: (h) => {
							                        return h('Input', {
							                            props: {
							                            	type:'textarea',
							                                value: mainBasis,
							                                autofocus: true,
							                                placeholder: '请输入主体依据'
							                            },
							                            on: {
							                                input: (val) => {
							                                    mainBasis = val;	                                    
							                                }
							                            }
							                        })
							                    },
							                    onOk: () => {
							                    	params.row.mainBasis = mainBasis;
							                    	this.$set(this.labelListDataCopy,params.index,params.row);
							                    	this.$emit('handleModLabel',params)
							                    },
							                    onCancel:()=>{
							                    	 
							                    }
							                }) 											
										}
									}
								})
							])
						},						
					},
					{
						title: '权重',
						key: 'tagWeight',
						sortable:true,
						width: 80,
					},					
					{
						title: '近义词',
						key: 'synonym',
						width: 150,
						hiddenCol:showflag == 'concept' || showflag == 'indicator',
						ellipsis:true,
						render: (h, params) => {
							let synonym = params.row.synonym;
							if (!synonym || synonym.length == 0) {
								synonym = '';
							} else {
								synonym = synonym.join()
							}
							return h('div', synonym)
						},
						
					},{
						title: '歧义',
						key: 'nedType',//0正常 1消歧确认 2消歧未确认
						width: 80,
						hiddenCol:showNedType,
						render:(h,params)=>{
							let nedType = params.row.nedType;  
							let nedTypeLabel = nedType == 2 ? '是' : '否';
						 	return h("span", nedTypeLabel)
						},
						sortable:true
					},
					{
						key: "operation",
						title: "操作",
						width: 80,
						align: "center",
						fixed: "right",
						hiddenCol: (this.pageType == "VIEW" || this.isSpecialPage) && !this.isEventPage,
						render: (h, params) => {
							let nedType = params.row.nedType;
							let operatestatus = params.row.flag; //默认0,事件标记为9，其他事件标记为-1
							return h('div', [
							    h('checkbox',{
							    	style: {
										'display':!this.isEventPage ? 'none':'inline-block',
										'marginRight':'8px'
									},
							 		props: {
										value: params.row.flag == 9 ? true :false
									},
							 		on: {
										'on-change':() => {
											if(operatestatus == 9){
												this.labelListData[params.index].flag = 0;
											}else if(operatestatus == -1 || operatestatus == 0){
												this.labelListData[params.index].flag = 9;
											};
											params.row.flag = this.labelListData[params.index].flag
											this.$emit('handleModLabel',params)
										}
									}
							 	}),
							 	h('span', {
									class: {
										'iconfont': true,
										'icon-t-b-delete':true,
										'tab-icon-btn': true,
									},
									style: {
										color: 'red',
										display:!this.isEventPage ||this.pageType == 'VIEW'? 'none':'inline-block',//舆情删除按钮
									},
									attrs: {
										title: '删除'
									},
									on: {
										click: () => {	
											this.$emit('handleDelLabelFn',params);											
										}
									}
								}),
								h('span', {
									class: {
										'iconfont': true,
										'icon-t-b-delete': nedType != 2  ?  true :false,
										'icon-success':nedType != 2 ?  false : true,
										'tab-icon-btn': true,
									},
									style: {
										color:  nedType == 2 ? '#298dff':'red',
										display:this.pageType == 'VIEW' || this.isEventPage? 'none':'inline-block',
									},
									attrs: {
										title: nedType== 2 ? '确认':'删除'
									},
									on: {
										click: () => {	
											if(nedType== 2){
												this.labelListDataCopy[params.index].nedType = 1;
//												this.$emit('handleDelFlag');
											}else{
												this.$emit('handleDelLabelFn',params);
											}											
										}
									}
								})
							])
						},
					},
				]
			},
			handleAddLabel(labelListType){
				this.$emit('handleAddLabel',labelListType);
			},
			addLabelInfoFn(addInfo){
				this.$emit('addLabelInfoFn',addInfo)
			}
		},
		watch:{
			labelListData(newArr){
				this.labelListDataCopy = [...newArr];
			}			
		},
		mounted(){
			this.labelListDataCopy = [...this.labelListData];
		}
	}
</script>

<style>
.news_labelList_box .h-form-item{
    margin-bottom: 5px!important;
}
.label-btn-box{
	margin-bottom: 5px;
}
.abbiguityLabel{
	color: red;
}
.table-weak-highlight td{
	color:#888!important;
}
</style>