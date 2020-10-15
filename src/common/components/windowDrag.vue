<template>
	<div :class="['drag',{ 'no_right': !isRight }]" ref="drag">
		<div class="left" ref="left" :style="leftStyle">
			<slot name="left"></slot>
		</div>
		<div :class="[{ 'hrNodrag': !canDrag },'hr']" v-if="isRight" ref="hr" @mousedown="drag($event)">
			<div></div>
		</div>
		<div class="right" ref="right" :style="rightStyle" v-if="isRight">
			<slot name="right"></slot>
		</div>
		<div class="mask" v-if="isMask"></div>
	</div>
</template>
<script>
const elementResizeDetectorMaker = require("element-resize-detector");
export default {
	name: 'Autocomplete',
	props: {
		leftW: String,
		rightW: String,
		isRight:{
			type:Boolean,
			default:true
		},
		canDrag:{
			type:Boolean,
			default:true
		}
	},
	data() {
		return {
			leftStyle:{},
			rightStyle:{},
			isMask: false,
			isDrag: false,
		}
	},
	methods: {
		drag(ev){
			if(!this.canDrag)return
			let _this = this;
			let clientX = ev.clientX;
			let leftW = parseInt(_this.$refs.left.offsetWidth);
			let sun = parseInt(_this.$refs.drag.offsetWidth);
			_this.isMask = true;
			document.onmousemove = function (e) {
				window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(); //拖动时，禁止选中
				let x = e.clientX;
				let dif = x - clientX;
				_this.isDrag = true;
				let newLeftW = leftW + dif;
				let newRightW = sun - newLeftW - 6;
				if(newLeftW <= 50){
					newLeftW = 50;
					newRightW = sun - 50 - 6;
				}
				if(newRightW <= 50){
					newRightW = 50;
					newLeftW = sun - 50 - 6;
				}
				_this.leftStyle = {
					width: newLeftW +'px'
				}
				_this.rightStyle = {
					width: newRightW + 'px'
				}
			}
			document.onmouseup = function (evt) {
				document.onmousemove = null
      			document.onmouseup = null
      			_this.isMask = false;
    			_this.$refs.hr.releaseCapture && _this.$refs.hr.releaseCapture()
			}
		},
		changeresize(){
			if(!this.isDrag)return;
			let leftW = parseInt(this.$refs.left.offsetWidth || 0);
			let rightW = parseInt(this.$refs.right.offsetWidth || 0);
			let sun = parseInt(this.$refs.drag.offsetWidth || 0);
			let newLeftW = 0;
			let newRightW = 0;
			let isMin = false;
			if(leftW <= 50){
				newLeftW = 50;
				newRightW = sun - 50 - 6;
				isMin = true;
			}
			if(rightW <= 50){
				newRightW = 50;
				newLeftW = sun - 50 - 6;
				isMin = true;
			}
			if(!isMin){
				if(sun - 50 - 6 < leftW){
					newRightW = 50;
					newLeftW = sun - 50 - 6;
				}else if(sun - 50 - 6 < newLeftW){
					newLeftW = 50;
					newRightW = sun - 50 - 6;
				}else{
					newLeftW = leftW;
					newRightW = sun - newLeftW - 6;
				}
			}
			this.leftStyle = {
				width: newLeftW +'px'
			}
			this.rightStyle = {
				width: newRightW + 'px'
			}
		},
		init(){
			let leftW = '';
			let rightW = '';
			if(!this.leftW && !this.rightW){
				leftW = '30%';
				rightW = '70%';
			}else if(this.leftW){
				leftW = this.leftW;
				rightW = '100% - '+ this.leftW;
			}else{
				rightW  = this.rightW;
				leftW = '100% - '+ this.rightW;
			}

			this.leftStyle = {
				width: 'calc('+ leftW +' - 3px)',
			}
			this.rightStyle = {
				width: 'calc('+ rightW +' - 3px)',
			}
		}
	},
	mounted() {
		this.init();
		let erd = elementResizeDetectorMaker();
		let _this = this;
		erd.listenTo(this.$refs.drag, function(element) {
			_this.changeresize();
		})
	},
	watch: {
		isRight: function(){
			this.init();
		}
	},
}
</script>
<style scoped>
.drag{
	width: 100%;
	position: relative;
	font-size: 0;
	display: flex;
}
.drag,.left,.hr,.right{
	height: 100%;
	background: #f7f7f7;
	position: relative;
	overflow: auto;
}
.left,.hr,.right{
	display: inline-block;
	font-size: 12px;
}
.right{
	z-index: 6;
}
.mask{
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: transparent;
	z-index: 7;
}
.hr{
	padding: 0 2px;
	cursor: col-resize;
	z-index:7;
}
.hr div{
	width: 2px;
	height: 100%;
	background: #ccc;
}
.hrNodrag{
	cursor: inherit;
}
.drag.no_right{
	height: auto;
}
.drag.no_right .left{
	width: 100% !important;
}
</style>