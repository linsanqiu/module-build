<template>
	<div class="searchLevelBox">
		<h-simple-select
			v-model="keyWords"
			autoPlacement
			widthAdaption
			filterable
			clearable 					
			remote
			:checkToHead="isMultiple"
			:showBottom="isMultiple"
			:isSelectFilter="isMultiple"
			:multiple="isMultiple"
			:placeholder="placeholderText"  
            :remote-method="remoteSearchLabel"         
            :loading="loadingLabelTab"
            :loading-text="loadText" 
            :isComputed="isComputed"
            @on-change="changeSelectFn" 
            >
            <h-select-block  @on-scroll="scroll" :data="labelTableList"></h-select-block>
       </h-simple-select>
	</div>
</template>

<script>
	export default{
		props:{
			modelValue:'',
			categoryLevel:'',//搜索标签分类id
			placeholderText:'',
			isMultiple:false,
			defaultList:{
				type:Array,
				required:false,
				default:function () {
	                return []
	            } 
			}			
		},
		data(){
			return{
				isScrollStatus:false,
				isComputed:false,
				searchNameCopy:'',
				keyWords:this.isMultiple ? [] : '',
				loadingLabelTab:false,
				loadText:'正在加载中',
				labelTableList:[],
				labelTableListTemp:[],
				pagination: {
					current: 1,
					size:100,
					total:0
				},
			}
		},
		methods:{
			scroll(isBottom){
                let _this = this;
                if (isBottom<=1) {                	
                	this.isScrollStatus = true;                	 
                    setTimeout(() =>{             
                        if (this.pagination.size * this.pagination.current < this.pagination.total){
                        	_this.isComputed = false;
                        	_this.pagination.current = _this.pagination.current+ 1;                        	
                        	_this.searchLabelTabList(this.searchNameCopy);                        	 
                        }else{
                            _this.isComputed = true;                          
                        }
                    },20);
                }
            },
			remoteSearchLabel(query){
				if (query !== ''){ 
                    this.isComputed = false;
                    this.isScrollStatus = false;
                    this.loadingLabelTab = true;
                    this.pagination.current = 1;
                    setTimeout(() => { 
                    	this.searchNameCopy = query;
                       this.searchLabelTabList(query);
                    },100);                    
                }else{
                	this.labelTableList = [...this.labelTableListTemp];
                }
			},
			changeSelectFn(values){
				this.searchLabelTabList('');
				if(this.defaultList.length>0){
					this.labelTableList = [...this.defaultList];
				};				
				this.$emit('changeSelectValue',values);
			},
			searchLabelTabList(query){	
            	let url = '/tm/event/queryCategoryLike'
				this.$http.post(url,{
					categoryLevel:this.categoryLevel,
					eventName:query,
					pageNum:this.pagination.current,
					pageSize:this.pagination.size,
				}).then((res) => {
					let data = res.data;
					if (data.status == this.$api.SUCCESS) {
						this.pagination.total = data.body.total;
						this.labelTableListTemp = this.typeTreeForEach(data.body.records) || [];
						if(this.isScrollStatus){
							this.labelTableList = this.labelTableList.concat(this.labelTableListTemp);
						}else{
							this.labelTableList = JSON.parse(JSON.stringify(this.labelTableListTemp));
						}
					} else {
						this.$hMessage.error({ content: data.msg })
					};
					this.loadingLabelTab = false;
				}).catch(err => {
					this.$hLoading.error();
					this.loadingLabelTab = false;
				})
			},	
			typeTreeForEach(list){
				let treeList = [];
				list.forEach((item,i) =>{
					let nextCategoryList = [];
					if(item.nextCategoryList && item.nextCategoryList.length > 0){
						nextCategoryList = this.typeTreeForEach(item.nextCategoryList);
					}
					let obj = {
		                value: item.categoryCode,
				        label: item.categoryName,
				        categoryLevel:item.categoryLevel,
				        sentimentLabel:item.sentimentLabel,
				        sentimentLevel:item.sentimentLevel,
				        nextCategoryList:nextCategoryList || [],
				        firstLevel:item.firstLevel,
				        secondaryLevel:item.secondaryLevel,
				        tertiaryLevel:item.tertiaryLevel,
				        fourLevel:item.fourLevel,
			        };		        
					treeList.push(obj);
		      	}); 
		       return treeList;
			},
		},
		watch:{
			modelValue:{
				handler(newValue) {
			      this.keyWords = newValue
			    },
			    immediate: true
			}
		},
		mounted(){
			this.searchLabelTabList('')
		}
	}
</script>

<style scoped>
	.searchLevelBox{
		width:169px;
		display: inline-block
	}
</style>