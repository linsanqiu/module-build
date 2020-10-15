<template>
	<div class="simple-page">
		<template v-if="newCurrent > 1">
			<div class="simple-page-prev" @click="prev">
				<i class="iconfont icon-ios-arrow-back"></i>
			</div>
		</template>
		<template v-else>
			<div class="simple-page-prev simple-page-disabled">
				<i class="iconfont icon-ios-arrow-back"></i>
			</div>
		</template>
		<div class="simple-page-body">
			<input class="simple-page-current" v-model="pageCurrent" @keyup.enter="pageEnter" @blur="inputBlur" /> / {{ pageSum }}
		</div>
		<template v-if="newCurrent > 0 && newCurrent < pageSum">
			<div class="simple-page-next" @click="next">
				<i class="iconfont icon-ios-arrow-forward"></i>
			</div>
		</template>
		<template v-else>
			<div class="simple-page-next simple-page-disabled">
				<i class="iconfont icon-ios-arrow-forward"></i>
			</div>
		</template>
		<div>
			共{{ pageTotal }}条
		</div>
	</div>
</template>
<script>
export default {
	name: 'Autocomplete',
	props: {
		current: Number,	
		total: Number,
		size: Number,
		other: Object
	},
	data() {
		return {
			newCurrent: 1,
			pageCurrent: 1,
			pageTotal: 0,
			pageSize: 10,
			pageSum: 1,
		}
	},
	methods: {
		setPageSum(){
			if(this.pageSize < 1){
				this.pageSize = 10;
			}
			let sum = Math.ceil(this.pageTotal / this.pageSize);
			this.pageSum = sum ? sum : 1;
		},
		pageEnter(){
			this.pageCurrent = this.pageCurrent || 1;	
			this.pageCurrent = parseInt(this.pageCurrent);
			if(this.pageCurrent > this.pageSum){
				this.pageCurrent = parseInt(this.pageSum);
			}else if(this.pageCurrent < 1){
				this.pageCurrent = 1;
			}
			this.changePage();
		},
		prev(){
			this.pageCurrent = parseInt(this.newCurrent) - 1;
			this.changePage();
		},
		next(){
			this.pageCurrent = parseInt(this.newCurrent) + 1;
			this.changePage();
		},
		changePage(){
			this.newCurrent = this.pageCurrent.toString();
			this.$emit('page-change', this.pageCurrent, this.other);
		},
		inputBlur(){
			this.pageCurrent = this.newCurrent.toString();
		}
	},
	created() {
		this.pageSize = this.size;
		this.pageTotal = this.total;
		this.pageCurrent = this.current;
		this.newCurrent = this.current.toString();
		this.setPageSum();
	},
	watch:{
		current(){
			this.pageCurrent = this.current;
			this.newCurrent = this.current.toString();
		},
		total(){
			this.pageTotal = this.total;
			this.setPageSum();
		},
		size(){
			this.pageSize = this.size;
			this.setPageSum();
		},
		pageCurrent(){
			if(this.pageCurrent){
				this.pageCurrent = this.pageCurrent.toString().replace(/[^\d]/g,'');
			}
		}
	}
}
</script>
<style type="text/css" scoped>
	.simple-page{
		display: flex;
		line-height: 30px;
	}
	.simple-page-prev,.simple-page-next{
		height: 20px;
		width: 20px;
		line-height: 20px;
		text-align: center;
		margin-top: 5px;
		cursor: pointer;
	}
	.simple-page-prev i,.simple-page-next i{
		position: relative;
		top: -1px;
		vertical-align: middle;
	}
	.simple-page-prev:hover i,.simple-page-next:hover i{
		color: #298DFF;
	}
	.simple-page-prev.simple-page-disabled:hover i,.simple-page-next.simple-page-disabled:hover i{
		color: #ccc;
	}
	.simple-page .simple-page-disabled{
		cursor: not-allowed;
		color: #ccc;
	}
	.simple-page-current{
		font-size: 12px;
		width: 36px;
		border:1px solid #ccc;
		border-radius: 2px;
		padding: 0 3px;
		height: 18px;
		text-align: center;
	}
	.simple-page-body{
		margin: 0 5px;
	}
</style>