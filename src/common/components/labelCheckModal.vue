<template>
	<div class="news_labelList_box">	
        <div class="label-list-box">				        	
        	<div class="labelTableBox">        		
        		<h-table canMove showTitle :row-class-name="rowClassNameFn"  stripe size="small" border :columns="columns()" :data="labelListDataCopy" ></h-table>						        		
        	</div>		
		</div> 
	</div>
</template>

<script>
	export default{
		props:{
			columnsShowflag:String,
			labelListData:Array,
		},
		data(){
			return{
				labelListDataCopy:[]
			}
		},
		watch:{
			labelListData(newArr){
				this.labelListDataCopy = [...newArr]
			}
		},
		methods:{
			rowClassNameFn(row,index){
				if(row.nedType == 2){
					return 'abbiguityLabel'
				}
			},
			columns(){
				return [
					{
						title: '名称',
						key: 'tagName',
						width: 200,
						ellipsis:true,
						sortable:true
					},
					{
						title: '关联信息',
						key: 'relationInfo',
						minWidth: 150,
						sortable:true,
						ellipsis:true
					},
					{
						title: '分类',
						key: 'categoryNames',
						width: 180,
						sortable:true,
						ellipsis:true,
						render: (h, params) => {
							let categoryCode = params.row.categoryCode;
							let categoryNames = params.row.categoryNames ? params.row.categoryNames.split('>') : [];
							let len = categoryNames.length;
							let categoryNamesShow = '';
							if(len >= 4){
								categoryNamesShow = categoryNames[len -2]+ '>'+  categoryNames[len -1];
							}else{
								categoryNamesShow = categoryNames.join('>');
							}
						 	return h('span',{
						 		style:{
						 			'display':categoryCode.startsWith('101111') || categoryCode.startsWith('101112') ? 'none' : 'block'
						 		}
						 	},categoryNamesShow)
						},
					},					
					{
						key: "main",
						title: "主体",
						align: "center",
						width: 60,
						render: (h, params) => {
							let operatestatus = params.row.main;
							let categoryCode = params.row.categoryCode;
						 	return h('checkbox',{
						 		style: {
									display: params.row.nedType == 2 || (!categoryCode.startsWith('101102') && !categoryCode.startsWith('101109')) ? 'none':'block'
								},
						 		props: {
									value: params.row.main == 1 ? true :false
								},
						 		on: {
									'on-change':() => {
										this.labelListDataCopy[params.index].main = this.labelListDataCopy[params.index].main == 1 ? 0 : 1;
										this.$emit('labelMain',this.labelListDataCopy[params.index]);
									}
								}
						 	})
						},
					},
					{
						title: '权重',
						key: 'tagWeight',
						sortable:true,
						width: 65,
					},
					{
						title: '近义词',
						key: 'synonym',
						width: 150,
						ellipsis:true,
						render: (h, params) => {							
							let categoryCode = params.row.categoryCode;
							let synonym = params.row.synonym;
							if (!synonym || synonym.length == 0) {
								synonym = '';
							} else {
								synonym = synonym.join()
							}
							return h('div',{
								style: {
								    'display': categoryCode.startsWith('101111') ||  categoryCode.startsWith('101112') ? 'none' : 'block'
								},
							}, synonym)
						},
						
					},{
						title: '歧义',
						key: 'nedType',//0正常 1消歧确认 2消歧未确认
						width: 70,
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
						render: (h, params) => {
							let nedType = params.row.nedType;
							return h('div', [
								h('span', {
									class: {
										'iconfont': true,
										'icon-t-b-delete': nedType != 2  ?  true :false,
										'icon-success':nedType != 2 ?  false : true,
										'tab-icon-btn': true,
									},
									style: {
										color:  nedType == 2 ? '#298dff':'red'
									},
									attrs: {
										title: nedType== 2 ? '确认':'删除'
									},
									on: {
										click: () => {	
											if(nedType== 2){
												this.labelListDataCopy[params.index].nedType = 1;
											}else{		    												
												this.labelListDataCopy.splice(params.index,1);
												this.$emit('handleDelLabelFn',params,true);
											}											
										}
									}
								})
							])
						},
					},
				]
			}
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
</style>