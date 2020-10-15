<template>
	<div> 
    	<h-spin fix v-if="modalAdd.modalLoading">
		 	<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
	   		<div>加载中...</div>
		</h-spin>
     	<ul class="handleBox">
     		<li>
     			<span>标签分类:</span>
     		   <h-select-tree :onlyChild="true" formatValue='id' v-model="modalAdd.categoryId" style="width:210px" :data="selectBaseData" @on-select-change="selectCategory"></h-select-tree>
     		</li>
     		<li>
     			<span>标签名称:</span>
     			<h-input style="width:210px" aria-placeholder="标签名称(必填)" placeholder="请输入标签名称"  v-model="modalAdd.tagValue" @on-enter="onChangeInputEnter(`tagValue`)" @on-click="shitClearableClick(`tagValue`)"></h-input>	         			
     		</li>
     		<li>
     			<h-button @click="handleSearchLabel" type="info">查询</h-button>
     		</li>
     	</ul>
     	<ul class="labelNameList" v-if="labelTableList.length>0">
     		<li>
     			<h-table
                    :columns="labelColums"
                    :data="labelTableList"
                    :loading="loadingLabelTab"
                    size="small"
                    border
                    stripe
                    >
                </h-table>
     		</li>	         		
             <li style="float:right;">
                <h-page
                	 @on-change="onPageChange" 
                    :total="pagination.total"
                    :page-size="pagination.size"
                    :current="pagination.current"
                    show-elevator
                    size="small"
                    show-total>
                </h-page>
            </li>
     	</ul>
	             
	</div>
</template>

<script>
	export default{
		props:{
			selectBaseData:Array,			
		},
		data(){
			return{
				newsType:'1',
				loadingLabelTab:false,
				addLabelType:'',
				modalAdd: {
					modalLoading: false,
					categoryId:'',
					categoryName: '',
					tagValue: '',
					modalHeight: 300
				},
				pagination: {
				current: 1,
				size: 5,
				total: 0,
			},
//			selectBaseData:[],
			labelTableList: [],
			labelColums: [
					{
						key: "tag_value",
						title: "标签名称",
						align: "center"
					},
					{
						title: '关联信息',
						key: 'relationInfo',
	
					},
					{
						key: "categoryNames",
						title: "标签分类",
						align: "center",
						width: 200
					},
					{
						key: "operation",
						title: "操作",
						width: 80,
						align: "center",
						render: (h, params) => {
							return h('div', [
								h('span', {
									class: {
										'iconfont': true,
										'icon-android-add': true,
										'tab-icon-btn': true,
									},
									style: {
										color: '#298DFF'
									},
									attrs: {
										title: '添加'
									},
									on: {
										click: () => {
											let addInfo = params.row;
											this.$emit('handleAddLabelFn',addInfo)											
										}
	
									}
								})
							])
						},
					},
				]
			}
		},
		methods:{
			onChangeInputEnter(value) {
				this.pagination.current = 1;
				this.searchLabelTabList();
			},
			handleSearchLabel() {		
				this.pagination.current = 1;
				this.searchLabelTabList();
			},
			onPageChange(current) {
				this.pagination.current = current;
				this.searchLabelTabList();
			},
			searchLabelTabList(){
				if(!this.modalAdd.categoryId){				
					this.modalAdd.categoryId = "101102,101109";
				};	
				this.loadingLabelTab = true;
				let url = '/tm/queryTagsByTagValueLikePost'
				this.$http.post(url,{
					pageSize:this.pagination.size,
					pageNum:this.pagination.current,
					tagValue:this.modalAdd.tagValue,
					categoryId:this.modalAdd.categoryId
				}).then((res) => {
					let data = res.data;
					if (data.status == this.$api.SUCCESS) {
						this.labelTableList = data.body.tag_objects || [];
						this.pagination.total = data.body.total_num || 0;
						let len = this.labelTableList.length;
						if (len == 0) {
							this.$hMessage.info({ content: '暂无标签信息！' })
						} else if (this.pagination.total >= 5) {
							this.modalAdd.modalHeight = 375
						}
					} else {
						this.$hMessage.error({ content: data.msg })
					}
					this.loadingLabelTab = false;
				}).catch(err => {
					this.loadingLabelTab = false;
					this.$hLoading.error();
				})
			},
			selectCategory(data) {
				if (data.length > 0) {		
					this.modalAdd.categoryName = data[0].title || '';
					this.modalAdd.categoryId = data[0].id || '';				
					if(data[0].id.startsWith('101101')){
						this.addLabelType == 'labelListIndustry';
					}else if(data[0].id.startsWith('101102') || data[0].id.startsWith('101109')){
						this.addLabelType == 'labelListCorp';
					}else if(data[0].id.startsWith('101111')){
						this.addLabelType = 'labelListConcept';
					}else if(data[0].id.startsWith('101112')){
						this.addLabelType = 'labelListIndicator';
					}
				}
			},
		}
	}
</script>

<style scoped>
.modalAddLabel ul {
  margin-bottom: 20px;
}
.handleBox li{
  display: inline-block;
  margin-right: 10px;
}
.labelNameList li{
  margin-bottom: 10px;
}
</style>