<template>
	<div class="search-form">
		<slot name="head">
			<div class="search-mian">
				<div class="a"></div>
				<div class="t" v-if="showTitle">{{ title ? title : '搜索条件' }}</div>
				<div class="b">
					<span></span>
				</div>
				<div :class="[ iconTitle == '点击收起' ? 'dir' : '' ,'i']" :title="iconTitle" @click="shangeDir(!iconDir)" >
					<h-icon name="doublearrow"></h-icon>
				</div>
			</div>
		</slot >
		<div :class="[showType == 'all' ? 'search-wrapper-show' : '', 'search-wrapper']" v-show="iconDir" ref="searchWrapper" >
			<slot name="content"></slot>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		title: String,
		status: String,
		showTitle:{
			default:true
		}
	},
	data() {
		return {
			iconTitle: '点击收起',
			iconDir: true,
			showType: 'default',
			fullWidth: document.documentElement.clientWidth,
			children: 18,
			full: 'small',
		}
	},
	created(){
		window.addEventListener('resize', this.handleResize)
	},
	beforeDestroy: function () {
		window.removeEventListener('resize', this.handleResize)
	},
	methods: {
		shangeDir(status){
			if(this.showType != 'all' && !status){
				this.showType = 'all';
				this.getIconTitle();
				return;
			}
			this.showType == 'all';
			let str = '点击展开';
			if(status){
				str = '点击收起';
			}
			this.iconTitle = str;
			this.iconDir = status;
		},
		handleResize (event) {
			this.fullWidth = document.documentElement.clientWidth;
			this.init()
		},
		fullStatus(){
			if(this.fullWidth > 1600){
				this.full = 'big';
			}else{
				this.full = 'small';
			}
		},
		getShowType(){
			if((this.full == 'big' && this.children <= 19) || this.children <= 13){
				this.showType = 'all';
			}
		},
		getIconTitle(){
			if(this.showType == 'all'){
				this.iconTitle = '点击收起';
			}else{
				this.iconTitle = '点击展开';
			}
		},
		init(){
			this.fullStatus();
			this.getShowType();
			this.getIconTitle();
		}
	},
	mounted() {
		if(this.status){
			this.showType = this.status;
		}else{
			this.showType = 'default';
		}
		this.children = this.$refs.searchWrapper.firstElementChild.children.length;
		this.init()
		if(this.status == 'conceal'){
			this.shangeDir(false)
		}
	},
}
</script>
<style scoped>
.search-wrapper>>> > ul{
	width: 100%;
	display: flex;
	flex-wrap: wrap;
}
.search-wrapper>>> > ul > li{
	width: calc((100% - 15px) / 4);
	margin-bottom: 10px;
	margin-right: 5px;
	display: none;
}
.search-wrapper>>> > ul > li:nth-child(4n){
	margin-right: 0;
}
.search-wrapper>>> > ul > li.row0{
	width: 0;
	height: 28px;
	margin-right: 0;
	overflow: hidden;
}
.search-wrapper>>> > ul > li.row2{
	width: calc(((100% - 15px) / 2) + 5px) ;
}
.search-wrapper>>> > ul > li.row4{
	width: 100%;
}
.search-wrapper>>> > ul > li.row-all{
	width: 100%;
	margin-right: 0;
}
.search-wrapper>>> > ul > li:nth-child(1),
.search-wrapper>>> > ul > li:nth-child(2),
.search-wrapper>>> > ul > li:nth-child(3),
.search-wrapper>>> > ul > li:nth-child(4),
.search-wrapper>>> > ul > li:nth-child(5),
.search-wrapper>>> > ul > li:nth-child(6),
.search-wrapper>>> > ul > li:nth-child(7),
.search-wrapper>>> > ul > li:nth-child(8),
.search-wrapper>>> > ul > li:nth-child(9),
.search-wrapper>>> > ul > li:nth-child(10),
.search-wrapper>>> > ul > li:nth-child(11),
.search-wrapper>>> > ul > li:nth-child(12){
	display: block;
}
.search-wrapper.search-wrapper-show>>> > ul > li{
	display: block;
}
.search-wrapper>>> .h-checkbox-group {
	display: flex;
}
.search-wrapper>>> .h-checkbox-group .h-checkbtn-wrapper {
	flex: 1;
	line-height: 28px;
	height: 28px;
}

@media screen and (min-width: 1600px){
	.search-wrapper>>> > ul > li{
		width: calc((100% - 25px) / 6);
	}
	.search-wrapper>>> > ul > li:nth-child(4n){
		margin-right: 5px;
	}
	.search-wrapper>>> > ul > li.row0{
		margin-right: 0px;
	}
	.search-wrapper>>> > ul > li:nth-child(6n){
		margin-right: 0;
	}
	.search-wrapper>>> > ul > li.row2{
		width: calc(((100% - 25px) / 3) + 5px);
	}
	.search-wrapper>>> > ul > li.row4{
		width: calc((((100% - 25px) / 6) * 4 ) + 15px);
	}
	.search-wrapper>>> > ul > li:nth-child(1),
	.search-wrapper>>> > ul > li:nth-child(2),
	.search-wrapper>>> > ul > li:nth-child(3),
	.search-wrapper>>> > ul > li:nth-child(4),
	.search-wrapper>>> > ul > li:nth-child(5),
	.search-wrapper>>> > ul > li:nth-child(6),
	.search-wrapper>>> > ul > li:nth-child(7),
	.search-wrapper>>> > ul > li:nth-child(8),
	.search-wrapper>>> > ul > li:nth-child(9),
	.search-wrapper>>> > ul > li:nth-child(10),
	.search-wrapper>>> > ul > li:nth-child(11),
	.search-wrapper>>> > ul > li:nth-child(12),
	.search-wrapper>>> > ul > li:nth-child(13),
	.search-wrapper>>> > ul > li:nth-child(14),
	.search-wrapper>>> > ul > li:nth-child(15),
	.search-wrapper>>> > ul > li:nth-child(16),
	.search-wrapper>>> > ul > li:nth-child(17),
	.search-wrapper>>> > ul > li:nth-child(18){
		display: block;
	}
}
.search-wrapper>>> dl{
	font-size: 0;
	width: 100%;
}
.search-wrapper>>> dt{
	width: 108px;
	display: inline-block;
	font-size: 12px;
	line-height: 28px;
	text-align: right;
	vertical-align: top;
}
.search-wrapper>>> dd{
	width: calc(100% - 108px);
	display: inline-block;
	vertical-align: top;
	font-size: 12px;
}
.search-wrapper>>> dd .flex{
	display: flex;
}
.search-wrapper>>> dd .flex .flex1{
	flex: 1;
}
.search-wrapper>>> dd .flex .flex2{
	flex: 1;
}
.search-wrapper>>> dd .flex .flex3{
	flex: 1;
}
.search-wrapper>>> dd .flex  .to{
	width: 20px;
	text-align: center;
	line-height: 28px;
}

.search-wrapper>>> .h-input,.search-wrapper>>> .h-select-single .h-select-selection,.search-wrapper>>> .h-input-type,.search-wrapper>>> .h-select,.search-wrapper>>> .h-selectTable,.search-wrapper>>> .h-selectTable-single .h-selectTable-selection,.search-wrapper>>> .h-select-multiple .h-select-selection{
	height: 28px;
}
.search-wrapper>>> .h-select-single .h-select-selection .h-select-placeholder,.search-wrapper>>> .h-select-single .h-select-selection .h-select-selected-value,.search-wrapper>>> .h-selectTable-input,.search-wrapper>>> .h-select-input,.search-wrapper>>> .h-select-content-input{
	height: 26px;
	line-height: 26px;
	padding-right: 18px;
}
.search-wrapper>>> .event-select-level .searchLevelBox .h-selectTable-input{
	/*height: 26px!important;*/
	line-height: 26px;
	padding-right: 0px!important;/*舆情三四级*/
}
.search-wrapper>>> .h-select-single .h-select-selection .h-select-arrow,.search-wrapper>>> .h-selectTable-single .h-selectTable-selection .h-selectTable-arrow{
	/* right: 3px !important; */
}
.search-wrapper>>> .h-select{
	width: 100%;
}
.search-wrapper>>> .search-wrapper-but{
	width: auto;
	flex: 1;
	text-align: right;
	margin-right: 0;
	display: block;
	white-space:nowrap;
}
.search-wrapper>>> .search-wrapper-but .h-btn{
	padding-top: 0;
	padding-bottom: 0;
	height: 28px;
	line-height: 28px;
}
.search-wrapper>>> .search-wrapper-but .h-btn > .h-icon + span,.search-wrapper>>> .search-wrapper-but  .h-btn > span + .h-icon{
	margin-left: 2px;
}
.search-wrapper>>> .h-input-icon{
	line-height: 28px;
	height: 28px;
	width: 24px;
}
.search-mian{
	height: 14px;
	line-height: 14px;
	display: flex;
	margin-bottom: 10px;
}
.search-mian .a{
	height: 100%;
	width: 4px;
	background: #037DF3;
}
.search-mian .t{
	font-size: 14px;
	color: #333;
	font-family:PingFangSC-Semibold,PingFangSC;
	font-weight: 600;
	margin-left: 8px;
}
.search-mian .b{
	width: 100%;
	flex: 1;
	padding: 0 10px;
}
.search-mian .b span {
	display: block;
	width: 100%;
	height: 0px;
	margin-top: 6px;
	border-top: 1px dashed #DDDDDD;
}
.search-mian .i{
	cursor: pointer;
}
.search-mian .i.dir{
	transform:rotate(180deg);
	-webkit-transform:rotate(180deg);
	-moz-transform:rotate(180deg);
}
.search-mian .i>>> .iconfont{
	font-size: 12px;
	color: #bbb;
}
.search-wrapper>>> .btn{
	width: 100%;
	text-align: right;
}
.search-wrapper>>> .h-input{
	padding: 4px 12px;
}
.search-wrapper>>> .h-input-icon-normal + .h-input{
	padding-right: 18px;
}
.search-wrapper>>> .h-select-multiple .h-select-selection .h-select-placeholder{
	height: 26px;
	line-height: 26px;
}
</style>
