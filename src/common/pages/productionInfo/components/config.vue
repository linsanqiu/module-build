<template>
	<div class="config-components" ref="configComponentsTable">
		<div @mousemove="mousemovefn" class="table-box">
			<div ref="tableWrapper" :class="['table-wrapper', isMax ? 'table-wrapper-max' : '']" @scroll="onbox">
				<table cellspacing="0" cellpadding="0" border="0">
					<thead>
						<tr>
							<td></td>
							<td v-for="(item,key) in rowList">
								<div @dblclick="dbClickItem('row',key)" :class="item.fieldName ? '': 'err'"  @contextmenu.prevent="contextmenu('row',key)">
									<span :title="nameFormat(item, key, 'row')">{{ nameFormat(item, key, 'row') }}</span>
								</div>
							</td>
							<td v-if="bizGroupType == 1 && rowList.length < maxSum && colList.length == 0"><div class="add" @click="row" >+</div></td>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item,key) in colList">
							<td>
								<div :class="item.fieldName ? '': 'err'" @dblclick="dbClickItem('col',key)" @contextmenu.prevent="contextmenu('col',key)" >
									<span :title="nameFormat(item, key,'col')">{{ nameFormat(item, key, 'col') }}</span>
								</div>
							</td>
							<td v-for="(item,key) in rowList">
							</td>
						</tr>
						<tr v-if="bizGroupType == 2 && colList.length < maxSum && rowList.length == 0">
							<td><div class="add" @click="col">+</div></td>
						</tr>
					</tbody>
				</table>
			</div>
			<ul id="templateConfig-right-menu" class="menu" v-show="isMenu" :style="rightMenuStyle" @click.stop="function(){}">
				<li @click="onSave">编辑属性</li>
				<li @click="front" :class="isDisabled">向前插入{{ itemName }}</li>
				<li @click="front5" :class="isDisabled">向前插入5{{ itemName }}</li>
				<li @click="end" :class="isDisabled">向后插入{{ itemName }}</li>
				<li @click="end5" :class="isDisabled">向后插入5{{ itemName }}</li>
				<li @click="del()">删除{{ itemName }}</li>
				<li @click="del('all')">删除所有{{ itemName }}</li>
			</ul>
		</div>
		<ConfigModal
      :bizTypeDisabled="true"
			:bizTypeList='bizTypeList'
			:attrList="attrList"
			v-model='isShowSave'
			:formValue='form'
			:groupList='bizTmplGroups'
			:fieldTypeList="fieldTypeList"
			:DictItem='DictItem'
			:SearchDict='SearchDict'
			:detailsConfigType='true'
			@changeAttr='onOk'
			:bizGroupTypeList='bizGroupTypeList'
		></ConfigModal>
		<!-- <h-msgBox title="编辑属性" v-model="isShowSave" @on-close="onCloseFileMsgBox" class-name="vertical-center-modal" :top="0" width="500">
			<div class="file-form">
				<h-form :model="form" ref="detailForm" label-position="right" :label-width="100" @submit.native.prevent :rules="modulesRule">
					<h-form-item label="字段名称：" prop="fieldName">
						<h-input v-model.trim="form.fieldName" placeholder="请输入名称"></h-input>
					</h-form-item>
					<h-form-item label="字段格式：" prop="fieldType">
						<Select v-model="form.fieldType" placeholder="请配置字段格式" :clearable="false" @on-change="changeFieldType">
							<Option v-for="(option, index) in type" :value="option.entryOrder" :key="index">{{ option.entryName }}</Option>
						</Select>
					</h-form-item>
					<h-form-item label="常量项：" v-if="form.fieldType == 5" prop="defaultValue" :rules="{ required: form.fieldType == 5 ? true : false,validator: validateDefaultValue, trigger:'change'}" >
						<Select v-model="form.defaultValue" placeholder="请选择常量项">
							<Option v-for="(value, key, index) in DictItem" :value="key" :key="key">{{ value }}</Option>
						</Select>
					</h-form-item>
					<h-form-item label="常量(搜索)项：" v-if="form.fieldType == 6" prop="defaultValue" :rules="{ required: form.fieldType == 6 ? true : false,validator: validateDefaultValue, trigger:'change'}" >
						<Select v-model="form.defaultValue" placeholder="请选择常量(搜索)项">
							<Option v-for="(item, key) in SearchDict" :value="item.entryValue" :key="key">{{ item.entryName }}</Option>
						</Select>
					</h-form-item>
					<h-form-item label="字段描述：" prop="fieldDesc">
						<h-input v-model.trim="form.fieldDesc" placeholder="请输入字段描述"></h-input>
					</h-form-item>
					<h-form-item label="字段长度：" v-if="form.fieldType != 5 && form.fieldType != 6" prop="length" :rules="{ required: form.fieldType != 5 || form.fieldType != 6 ? true : false,validator: validateLength, trigger:'blur'}">
						<h-input v-model="form.length" placeholder="请输入字段长度" @on-keyup="inputChange"></h-input>
					</h-form-item>
					<h-form-item label="是否必填：" >
						<RadioGroup v-model="form.required">
							<Radio :label="1">
								<span>是</span>
							</Radio>
							<Radio :label="0">
								<span>否</span>
							</Radio>
						</RadioGroup>
					</h-form-item>
					<h-form-item label="备注：" prop="len">
						<h-input v-model.trim="form.remark" placeholder="请输入备注"></h-input>
					</h-form-item>
				</h-form>
			</div>
			<div slot="footer" class="draggable-form-footer">
				<h-button @click="onCloseFileMsgBox">取消</h-button>
				<h-button type="info" @click="onOk">确定</h-button>
			</div>
		</h-msgBox> -->
		<h-spin fix v-if="isLoading">
			<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
			<div>加载中...</div>
		</h-spin>
	</div>
</template>
<script type="text/javascript">
import $ from 'jquery';
import { copyDeep } from '@/filters/index'
import ConfigModal from '../components/configModal'
import {
  getRuleAttrByBizCode
} from "../api/apiManager";
export default {
	components: {ConfigModal},
	props: {

		bizGroupTypeList: {
			type: Array,
			default: ()=>{
				return [];
			}
		},
		parentRefs:{
			type: String,
			default: 'templateConfig'
		},
		index:{
			type: [String, Number],
			default: ''
		},
		value: {
			type: Object,
			default: ()=>{
				return {};
			}
		},
		validateName:{
			type: String,
			default: 'validateName'
		},
		bizTypeList: {
			type: Array,
			default: ()=>{
				return [];
			}
		},
		bizTmplGroups:{
			type: Array,
			default: ()=>{
				return [];
			}
		},
		DictItem:{
			type: Object,
			default: ()=>{
				return {};
			}
		},
		SearchDict:{
			type: Array,
			default: ()=>{
				return [];
			}
		},
		fieldTypeList: {
			type: Array,
			default: ()=>{
				return [];
			}
		},
	},
	data () {
		const validateFieldName = (rule, value, callback) => {
			if (value == '') {
				callback(new Error('请输入'));
			} else {
				let isOk = true;
				let a = this.rowList;
				let b = this.colList;
				let item = this.activeItem;
				let k = this.activeInex;
				for(let i = 0, len = a.length; i < len; i++){
					if(a[i].fieldName == value && i != k && item == 'row'){
						isOk = false;
					}
				}
				for(let i = 0, len = b.length; i < len; i++){
					if(b[i].fieldName == value && i != k && item == 'col'){
						isOk = false;
					}
				}
				if(isOk){
					if(this.$parent[this.validateName]){
						let repetition = this.$parent[this.validateName](this.index, value);
						if(repetition){
							callback(new Error('已存在'));
							return;
						}
					}
					callback();
				}else{
					callback(new Error('已存在'));
				}
			}
		};
		return {
			maxSum: 100,
			template:[],
			NotSelectedtemplate: [],
			isShowTips: false,
			alltemplate: [],
			bizGroupType: 1,
			rowList: [],
			colList:[],
			isMenu: false,
			itemName: '',
			popup:{
				x: 0,
				y: 0,
			},
			rightMenuStyle:{},
			form:{
				bizGroupType: 1,
				bizGroupCode: '',
				bizTypes: [],
				id: "", //字段id
				fieldName: "", //字段名
				fieldCode: "", //字段编码
				fieldType: 2, //字段类型，1数字，2文本，3日期，4金额
				required: 0, //是否必填，1是，0否
				fieldDesc: "", //字段描述
				length: "", //字段长度
				remark: "", //备注
				defaultValue: "", //枚举类型
				verifyRules: [],
				repRules: [],
			},
			isShowSave: false,
			activeItem: '',
			activeInex: '',
			isDisabled: '',
			modulesRule:{
				fieldName:[
					{ required:true, validator: validateFieldName, trigger:'blur'},
				],
				fieldDesc:[
					{ required:true, message: '请输入', trigger:'blur'},
				],
				length:[
					{ required:true, message: '请输入', trigger:'blur'},
				],
			},
			req:{
				id: '',
				anncType: '',
				type: '',
				bizType: '',
				tmplFieldList: [],
			},
			previewData:[],
			isPreview: false,
			isLoading: false,
			isMax: false,
			BizType: [],
			bizTypeObj: {},
			attrList: [],
		}
	},
	methods:{
		onImport(){
			this.isImportMsg = true;
		},
		changeBizType(value){
			this.template = this.bizTypeObj[value.toString()];
		},
		changeFieldType(){
			if(this.form.fieldType === 5 || this.form.fieldType === 6){
				this.form.length = '';
			}else{
				this.form.defaultValue = ''
			}
		},
		validateLength(rule, value, callback){
			if (this.form.fieldType != 5 && value == '') {
				callback(new Error('请输入'));
			} else {
				callback();
			}
		},
		validateDefaultValue(rule, value, callback){
			if ((this.form.fieldType == 5 || this.form.fieldType == 6) && value == '') {
				callback(new Error('请选择'));
			} else {
				callback();
			}
		},
		inputChange() {
			this.form.length = this.form.length.toString().replace(/[^\d]/g, '');
			if(this.form.length == '0'){
				this.form.length = '';
			}
		},
		front5(){
			for(let i = 0; i < 5; i++){
				this.front();
			}
		},
		front(){
			let name = this.activeItem == 'row' ? 'rowList' : 'colList';
			if(this[name].length >= this.maxSum)return;
			if(this.activeInex == 0){
				this[name].unshift({});
			}else{
				this[name].splice( this.activeInex,0,{});
			}
			this.onbox();
			if(this.activeItem == 'row'){
				this.isShowMax();
			}
		},
		end5(){
			for(let i = 0; i < 5; i++){
				this.end();
			}
		},
		end(){
			let name = this.activeItem == 'row' ? 'rowList' : 'colList';
			if(this[name].length >= this.maxSum)return;
			this[name].splice( this.activeInex + 1,0,{});
			this.onbox();
			if(this.activeItem == 'row'){
				this.isShowMax();
			}
		},
		del(type){
			let name = this.activeItem == 'row' ? 'rowList' : 'colList';
			if(type == 'all'){
				this[name] = [];
			}else{
				this[name].splice(this.activeInex,1);
			}
			this.onbox();
			if(this.activeItem == 'row'){
				this.isShowMax();
			}
		},
		dbClickItem(item, key){
			let pass = this.checkGroupCode()
			if (!pass)return
			this.activeItem = item;
			this.activeInex = key;
			this.onSave();
		},
		nameFormat(data, k, name){
			if(data.fieldName){
				return data.fieldName;
			}
			let a = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
			if(name == 'row'){
				let b = Math.floor(k/26);
				if(b == 0){
					return a[k];
				}else{
					return a[k-(b*26)]+''+b;
				}
			}
			return k+1;
		},
		onOk(obj){
			if(this.activeItem == 'row'){
				this.rowList[this.activeInex] = obj;
			}else{
				this.colList[this.activeInex] = obj;
			}
			this.changeValue();
			this.onCloseFileMsgBox();
			// this.$refs['detailForm'].validate((valid) => {
			// 	if (valid) {
			// 		let obj = copyDeep(this.form)
			// 		if(this.activeItem == 'row'){
			// 			this.rowList[this.activeInex] = obj;
			// 		}else{
			// 			this.colList[this.activeInex] = obj;
			// 		}
			// 		this.changeValue();
			// 		this.onCloseFileMsgBox();
			// 	}
			// })
		},
		onSave(){
			let name = this.activeItem == 'row' ? 'rowList' : 'colList';
			let data = this[name][this.activeInex];
			if(data.fieldName){
				let formData = copyDeep(data)
				this.form = formData
        this.form.bizTypes = this.form.bizTypes || [];
				this.form.length = this.form.length === 0 || this.form.length === '0' || this.form.length ? this.form.length.toString() : '';
			}else{
				this.resetFileForm()
			}
			// this.$refs['detailForm'].resetFields();
			this.isShowSave = true;
			this.onbox();
		},
		resetFileForm(){
			this.form = {
				repRules: [],
				verifyRules: [],
				bizGroupType: 1,
				bizTypes: [], //业务类型
				bizGroupCode:"", //业务属性
				id: "", //字段id
				templateId: "", //模板ID
				fieldName: "", //字段名
				fieldCode: "", //字段编码
				fieldOrder: "", //字段顺序
				fieldType: 2, //字段类型，1数字，2文本，3日期，4金额
				required: 0, //是否必填，1是，0否
				fieldDesc: "",  //字段描述
				length: "", //字段长度
				remark: "", //备注
				defaultValue: '',
			}
		},
		onCloseFileMsgBox(){
			this.resetFileForm()
			this.isShowSave = false;
			// this.$refs['detailForm'].resetFields();
		},
		onBodyMouseDown(event){
			if (!(event.target.id == "templateConfig-right-menu" || $(event.target).parents("#templateConfig-right-menu").length>0)) {
				this.onbox();
			}
		},
		onbox(){
			this.isMenu = false;
			$("body").unbind("mousedown", this.onBodyMouseDown);
		},
		getScrollTop(){
			var scroll_top = 0;
			if (document.documentElement && document.documentElement.scrollTop) {
				scroll_top = document.documentElement.scrollTop;
			}
			else if (document.body) {
				scroll_top = document.body.scrollTop;
			}
			return scroll_top;
		},
		getScrollLeft(){
			var scroll_left = 0;
			if (document.documentElement && document.documentElement.scrollLeft) {
				scroll_left = document.documentElement.scrollLeft;
			}
			else if (document.body) {
				scroll_left = document.body.scrollLeft;
			}
			return scroll_left;
		},
		contextmenu(item , key){
			this.itemName = item == 'row' ? '列' : '行';
			if(item == 'row'){
				this.itemName = '列';
				if(this.rowList.length >= this.maxSum){
					this.isDisabled = 'disabled';
				}else{
					this.isDisabled = '';
				}
			}else{
				this.itemName = '行';
				if(this.colList.length >= this.maxSum){
					this.isDisabled = 'disabled';
				}else{
					this.isDisabled = '';
				}
			}
			this.activeItem = item;
			this.activeInex = key;
			const popup = this.popup;
			let offsetTop = this.$refs.configComponentsTable.offsetTop;
			let offsetLeft = this.$refs.configComponentsTable.offsetLeft;
			let scrollTop = this.getScrollTop();
			let scrollLeft = this.getScrollLeft();
			let scrollBoxTop = $('#scroll').scrollTop();
			let scrollBoxLeft = $('#scroll').scrollLeft();
			let windowHeight = $(window).height();
			let windowWidth= $(window).width();
			let offsetTops = this.$parent.$refs[this.parentRefs].offsetTop;
			let offsetLefts = this.$parent.$refs[this.parentRefs].offsetLeft;
			let top = 0;
			let left = 0;
			if(windowWidth - popup.x < 150){
				left = -100;
			}
			if(windowHeight - popup.y < 170 ){
				top = -170;
			}
			this.rightMenuStyle ={
				top: (popup.y + scrollTop + scrollBoxTop - offsetTops - offsetTop + top + 10) + 'px',
				left: (popup.x + scrollLeft + scrollBoxLeft - offsetLefts - offsetLeft + left + 10) + 'px',
			}
			this.isMenu = true;
			$("body").bind("mousedown", this.onBodyMouseDown);
		},
		mousemovefn(e){
			this.popup.x = e.clientX
			this.popup.y = e.clientY
		},
		isShowMax(){
			let a = $(".table-wrapper").width();
			if((this.rowList.length + 1) * 120 > a){
				this.isMax = true;
			}else{
				this.isMax = false;
			}
		},
		row(){
			let pass = this.checkGroupCode()
			if (!pass)return
			this.rowList.push({});
			this.isShowMax();
			setTimeout(()=>{
				if(this.isMax){
					let width = this.$refs.tableWrapper.children[0].clientWidth;
					this.$refs.tableWrapper.scrollLeft = width;
				}
			},10)
		},
		col(){
			let pass = this.checkGroupCode()
			if (!pass)return
			this.colList.push({})
		},
    init(data){
			this.rowList = data.rowList || [];
			this.colList = data.colList || [];
			this.bizGroupType = data.bizGroupType || 1
			this.bizGroupCode = data.bizGroupCode || ''
			this.getAttrListByBizCode()

		},
		changeValue(){
			let obj = {
				rowList: this.rowList,
				colList: this.colList,
			}
			let old = this.value || {};
			let newData = Object.assign(old,obj)
			this.$emit('input', newData);
		},
		checkGroupCode(){
			if (!this.value.bizGroupCode){
				this.$hMessage.error('请先选择业务属性')
				return false
			}
			return true
		},
		getAttrListByBizCode(){
			if (!this.value.bizGroupCode || !this.value.bizGroupType){
				return
			}
			let body = {
				bizGroupCode: this.value.bizGroupCode,
				bizGroupType: this.value.bizGroupType,
        bizType: this.$parent.req.bizType
      }
			getRuleAttrByBizCode(body).then(
				data => {
					let attrList = []
					let returnList = data.fieldInfos || []
					for (let item of returnList){
						item.fieldInfo.label = item.fieldInfo.fieldName
						item.fieldInfo.value = item.fieldInfo.fieldCode
						attrList.push(
							{
								...item.fieldInfo,
								repRules: item.repRules,
								verifyRules: item.verifyRules
							}
						)
					}
					this.attrList = attrList
				}
			)

		}
	},
	watch: {
		'value.rowList': {
			handler(newArr){
				this.rowList = newArr || [];
			},
			deep: true
		},
		'value.colList': {
			handler(newArr){
				this.colList = newArr || [];
			},
			deep: true
		},
		'value.bizGroupType': {
			handler(value){
				this.bizGroupType = value || 1;
			},
			deep: true
		},
		'value.bizGroupCode': {
			handler(newValue, oldValue){
				if (newValue != oldValue){
					this.getAttrListByBizCode()
				}
			},
			deep: true,
		},
		DictItem:{
			handler(newObj){

			},
			deep: true
		},
		rowList:{
			handler(newArr){
				this.changeValue();
			},
			deep: true
		},
		colList:{
			handler(newArr){
				this.changeValue();
			},
			deep: true
		},
	},
	mounted() {
		this.init(this.value)
	},
	activated(){
		this.init(this.value)
	}
}
</script>
<style type="text/css" scoped>
.table-box{
	position: relative;
}
.table-wrapper{
	overflow-x: auto;
}
.table-wrapper-max table{
	width: 100%;
}
table{
	table-layout: fixed;
}
table td{
	border: 1px solid #DCE1E7;
	width: 120px;
	height: 30px;
	text-align: center;
}
table thead td:first-child{
	background: #fff;
}
td div{
	height: 100%;
	width: 100%;
	line-height: 30px;
	position: relative;
}
td div span{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 30px;
	line-height: 30px;
	overflow: hidden;
	padding: 0 3px;
	text-overflow:ellipsis;
	white-space: nowrap;
}
.menu{
	position: absolute;
	padding: 5px 10px;
	line-height: 22px;
	z-index: 99;
	background-color: #fff;
	border-radius: 2px;
	border: 1px solid #dfdfdf;
	box-shadow: 1px 1px 2px #ccc;
	color: #000;
}
.menu li:hover{
	color: #2E71F2;
	cursor: pointer;
}
.menu li.disabled,.menu li.disabled:hover{
	color: #ccc;
    cursor: auto;
}
.add{
	background: #2E71F2;
	color: #fff;
	cursor: pointer;
}
.btn{
	padding: 20px;
	text-align: center;
}
td div{
	background: palegreen;
}
td div.err{
	background-color: rgb(244, 115, 120);
}
.red{
	color: red;
}
.config-components{
	min-height: 99%;
	position: relative;
}
.preview-msg-box{
	overflow: auto;
	max-height: 350px;
}
>>>.import-msg-box .tab-operation{
	transform: rotatex(180deg);
}
</style>
