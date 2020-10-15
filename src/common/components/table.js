import Vue from 'vue'
import hui from'h_ui/dist/h_ui.min.js'
const elementResizeDetectorMaker = require("element-resize-detector");
const baseTable = Vue.extend(hui.Table)
const hTable = {
	extends:baseTable,//继承组件
	mounted(){
		let erd = elementResizeDetectorMaker();
		let _this = this;
		let evenWidth = 0;
		let oddWidth = 9999999999999;
		let sum = 0;
		let times;
		erd.listenTo(this.$refs.tableWrap, function(element) {
			if(sum % 2 == 0){
				if(oddWidth == element.offsetWidth)return;
				oddWidth = element.offsetWidth;
			}else{
				if(evenWidth == element.offsetWidth)return;
				evenWidth = element.offsetWidth;
			}
			clearTimeout(times);
			times = setTimeout(()=>{
				evenWidth = 0;
				oddWidth = 9999999999999;
			},1000)
			sum++;
			_this.handleResize();
		});
	},
	watch: {
		maxHeight(){
			this.fixedHeader();
		}
	}
}
Vue.component('h-table',hTable)