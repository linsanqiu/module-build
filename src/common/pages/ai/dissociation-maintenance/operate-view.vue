<template>
	<div class="dissociation-maintenance-save">
		<div class="wrapper">
			<span class="title">待消歧词：</span>
			<template v-if="isSelect">
				<h-input style="width:360px" placeholder="请输入待消歧词" v-model="oReq.tagName" icon="android-close" @on-click="onEmpty('tagName')" ref="tagName" @on-change="changeTagName" >
					<h-select-tree slot="append" :expanLevel="0" :clearable="false" :onlyChild="true" formatValue='id' v-model="oReq.categoryId" style="width:180px" :data="selectBaseData" @on-select-change="selectCategory"></h-select-tree>
				</h-input>
				<h-button type="primary" icon="search" :disabled="!isClickable" @click="onSelect">选择</h-button>
			</template>
			<template v-else>
				<h-input style="width:360px" placeholder="请输入待消歧词"  :disabled="true" v-model="oReq.tagName" @on-change="changeTagName" ></h-input>
			</template>
			<div class="selectDateil" v-if="oSelectData.category_id">
				<span>{{ oSelectData.other_obj.business_id }}</span>
				<span>{{ oSelectData.tag_value }}</span>
				<span>{{ oSelectData.tag_categorys.toString() }}</span>
				<span>{{ oSelectData.relationInfo }}</span>
			</div>
		</div>
		<div class="wrapper">
			<span class="title">范围：</span>
			<h-select style="width:360px" placeholder="请选择公开标志" v-model="oSubmit.eliminateScope"  :clearable="false">
				<template v-for="item in eliminateScopes">
					<h-option :value="item.value">{{ item.title }}</h-option>
				</template>
			</h-select>
		</div>
<!--        <div class="wrapper">
	<span class="title">权重：</span>
	<h-input placeholder="权重默认值为1" v-model.trim="oSubmit.weights"></h-input>
</div> -->
		<div class="wrapper">
			<span class="title">正向指示词：</span>
			<div class="pointer-word-wrapper">
				<span v-for="(item,k) in oSubmit.positiveIndicator" :key="k">{{ item }}<i @click="remove(k,'positiveIndicator')" class="h-icon iconfont icon-close h-icon-close"></i></span><span class="add" @click="onAddBtn('positiveIndicator')"><i class="h-icon iconfont icon-add h-icon-add"></i>添加</span>
			</div>
		</div>
		<div class="wrapper">
			<span class="title">反向指示词：</span>
			<div class="pointer-word-wrapper">
				<span v-for="(item,k) in oSubmit.negativeIndicator" :key="k"></i>{{ item }}<i @click="remove(k,'negativeIndicator')" class="h-icon iconfont icon-close h-icon-close"></i></span><span class="add" @click="onAddBtn('negativeIndicator')"><i class="h-icon iconfont icon-add h-icon-add"></i>添加</span>
			</div>
		</div>
		<div class="wrapper">
			<span class="title"> </span>
			<h-button type="primary" @click="setSave">保存</h-button>
		</div>
		<Spin fix v-if="isShowSpin">
			<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
			<div>加载中...</div>
		</Spin>
		<h-msgBox title="标签名称列表" v-model="isShowSelectList" @on-close="onCloseBox" class-name="vertical-center-modal dissociation-maintenance-msgBox" :top="0" width="800">
			<div class="content-wrapper">
				<div class="list">
					<h-table border :columns="headerData" :data="aSelectList" size="small" ></h-table>
				</div>
				<div class="page-box">
					<h-page :total="intTotal" :page-size="oReq.size" :current="oReq.current" @on-change="onPageChange" show-total size="small"></h-page>
				</div>
				<Spin fix v-if="isShowDetailSpin">
					<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
					<div>加载中...</div>
				</Spin>
			</div>
			<div slot="footer">
				
			</div>
		</h-msgBox>
		<h-msgBox title="添加指示词" v-model="isShowAddBox" @on-close="onCloseAddBox" class-name="vertical-center-modal" :top="0" width="500">
			<div>
				<h-form :model="oForm" :label-width="60" :rules="ruleValidate" ref="oForm" @keydown.native.enter.prevent ="()=>{}">
					<h-form-item label="指示词：" prop="name">
						<h-input placeholder="请填写指示词" v-model="oForm.name"  @on-enter="onAddConfirm"></h-input>
					</h-form-item>
				</h-form>
			</div>
			<div slot="footer">
				<h-button @click="onCloseAddBox">关闭</h-button>
				<h-button type="primary" @click="onAddConfirm" >确定</h-button>
			</div>
		</h-msgBox>
	</div>
</template>
<script>
import { Trim } from "@/filters/index.js";
import store from '@/store';
	export default {
		// name: "AuditNewsDissociation-maintenance-view",
		data () {
			var validatorMane = (rule, value, callback)=>{
				value = Trim(value)
				if(value){
					if(this.oSubmit.positiveIndicator.indexOf(value) == -1 && this.oSubmit.negativeIndicator.indexOf(value) == -1){
						callback();
					}else{
						callback('该指示词已存在');
					}
				}else{
					callback('请填写指示词');
				}
			};
			return {
				isSelect: true,
				isShowSpin: false,
				oReq:{
					tagName: '',
					scope: '2',
					size: 8,
					current: 1,
					categoryId: '',
				},
				isClickable: false,
				isShowSelectList: false,
				isShowDetailSpin: false,
				intTotal: 0,
				headerData:[
					{
						title: 'businessID',
						key: 'category_id',
						width: 150,
						align: "center",
						 render: (h, params) => {
							return h('div', params.row.other_obj.business_id);
						}
					},{
						title: '标签名称',
						key: 'tag_value',
						align: "center",
						width: 150,
					},{
						title: '关联信息',
						key: 'relationInfo',
						width: 200,
						align: "center",
					},{
						title: '标签分类',
						align: "tag_categorys",
						render: (h, params) => {
							return h('div', params.row.tag_categorys.toString());
						}
					},{
						title: '操作',
						align: "center",
						width: 80,
						render: (h, params) => {
							let examineBtn = h('span',{
								class: {
									'operation-but': true
								},
								on: {
									click: () => {
										this.onSelectData(params.row);
									}
								}
							},'选择')
							return h('div', [examineBtn]);
						}
					},
				],
				aSelectList: [],
				oSelectData: {
					other_obj: {}
				},
				eliminateScopes: [
					{
						title: "句子范围",
						value: '0',
					},
					{
						title: "段落范围",
						value: '1',
					},
					{
						title: "全文范围",
						value: '2',
					},
				],
				isShowAddBox: false,
				oForm:{
					name: ''
				},
				ruleValidate: {
					name: [
						{ validator: validatorMane, trigger: 'blur' }
					],
				},
				oSubmit: {
					id: '',
					positiveIndicator: [],
					negativeIndicator: [],
					eliminateScope: '2',
					eliminateWord: '',
					businessId: '',
					tagName: '',
					tagCategory: [],
					weights: '',
				},
				sAddType: '',
				selectBaseData: []
			}
		},
		methods: {
			selectCategory(arr){
				if(arr && arr[0]){
					this.oReq.categoryId = arr[0].id;
					this.changeTagName();
				}
			},
			changeTagName(){
				if(this.oReq.tagName && this.oReq.categoryId){
					this.isClickable = true;
				}else{
					this.isClickable = false;
				}
			},
			/*清空数据 并焦点*/
			onEmpty(name){
				this.oReq[name] = '';
				this.$refs[name].focus();
				this.changeTagName();
			},
			onCloseBox(){
				this.isShowSelectList = false;
				this.intTotal = 0;
				this.oReq.current = 1;
			},
			onPageChange(page){
				this.oReq.current = page;
				this.getTagTerm();
			},
			onSelectData(data){
				this.oSelectData = data;
				this.onCloseBox();
			},
			/**/
			onSelect(){
				this.isShowSpin = true;
				this.getTagTerm(()=>{
					this.isShowSpin = false;
				});
			},
			getTagTerm(cb){
				let url = '/tm/queryTagTermPage?';
				let oTmp = this.oReq;
				for(let k in oTmp){
					url += '&'+ k +'='+ encodeURIComponent(oTmp[k]);
				}
				this.$http.get(url).then((res)=>{
					if(cb){
						cb()
					}
					let obj = res.data;
					if(obj.status == this.$api.SUCCESS){
						this.isShowSelectList = true;
						let list = obj.body && obj.body.tag_objects ? obj.body.tag_objects : [];
						let total = obj.body.total_num || 0;
						this.intTotal = total;
						this.aSelectList = list;
					}else{
						this.$hMessage.error(obj.msg);
					}
				}).catch((err) => {
					this.$hMessage.error('网络异常，获取列表数据失败！');
					if(cb){
						cb()
					}
				});
			},
			onCloseAddBox(){
				this.isShowAddBox = false;
				this.oForm.name = '';
				this.$refs['oForm'].resetFields();
			},
			onAddBtn(type){
				this.$refs['oForm'].resetFields();
				this.sAddType = type;
				this.isShowAddBox = true;
			},
			onAddConfirm(){
				this.$refs['oForm'].validate((valid) => {
					if(valid){
						this.oSubmit[this.sAddType].push(this.oForm.name);
						this.onCloseAddBox();
					}
				})
			},
			remove(k, type){
				this.oSubmit[type].splice(k,1);
			},
			setSave(){
				if(!this.oSelectData.category_id){
					this.$hMessage.error('请选择待消歧词！');
					return;
				}
				if(this.oSubmit.positiveIndicator.length == 0 && this.oSubmit.negativeIndicator.length == 0 ){
					this.$hMessage.error('请添加指示词！');
					return;
				}
				this.oSubmit.eliminateWord = this.oSelectData.tag_value;
				this.oSubmit.tagName = this.oSelectData.tag_value;
				this.oSubmit.tagCategory = this.oSelectData.tag_categorys;
				this.oSubmit.businessId = this.oSelectData.other_obj.business_id;
				let url = '/tm/addEliminateAmbiguity';
				if(this.isShowSpin)return;
				this.isShowSpin = true;
				this.$http.put(url, this.oSubmit).then((res)=>{
					this.isShowSpin = false;
					let obj = res.data;
					if(obj.status == this.$api.SUCCESS){
						this.oSubmit.id = obj.body.id;
						this.$hMessage.success('保存成功');
						this.$store.commit("DEL_TAB", this.$route.path);
						this.$router.push('/audit/news/dissociation-maintenance');
					}else{
						this.$hMessage.error(obj.msg);
					}
				}).catch((err) => {
					this.isShowSpin = false;
					this.$hMessage.error('网络异常，保存失败');
				});
			},
			getDetail(){
				let url = '/tm/selectEliminateAmbiguityById?id='+ this.oSubmit.id;
				this.isShowSpin = true;
				this.$http.get(url).then((res)=>{
					this.isShowSpin = false;
					let obj = res.data;
					if(obj.status == this.$api.SUCCESS){
						let data = obj.body;
						this.oSubmit.eliminateScope = data.eliminateScope.toString();
						this.oSubmit.tagName = data.tagName;
						this.oSubmit.negativeIndicator = data.negativeIndicator ? data.negativeIndicator : [];
						this.oSubmit.positiveIndicator = data.positiveIndicator ? data.positiveIndicator : [];
						this.oReq.tagName = data.eliminateWord;
						this.oSelectData.tag_value = data.tagName;
						this.oSelectData.tag_categorys = data.tagCategory;
						this.oSelectData.category_id = data.businessId;
						this.oSelectData.relationInfo = data.company;
						this.oSelectData.other_obj.business_id = data.businessId;
						this.oSelectData.weights = data.weights;
					}else{
						this.$hMessage.error(obj.msg);
					}
				}).catch((err) => {
					this.isShowSpin = false;
					this.$hMessage.error('网络异常，保存失败');
				});
			},
			queryTagCategory(){
				let url = '/tm/queryTagCategory';
				this.$http.get(url).then((res)=>{
					let obj = res.data;
					if(obj.status == this.$api.SUCCESS){
						this.selectBaseData = obj.body && obj.body.children ? obj.body.children : [];
					}else{
						this.$hMessage.error(obj.msg);
					}
				}).catch((err) => {
					this.isShowSpin = false;
					this.$hMessage.error('获取行业失败');
				});
			}
		},
		created(){
			let { query,path } = this.$route;
			let pathName = '消歧维护列表-新建';
			if(query.id){
				pathName = '消歧维护列表-编辑';
				this.isSelect = false;
				this.oSubmit.id = query.id;
				this.getDetail();
			}
			store.commit('SAVE_TAB_NAME',{  path: path, name: pathName});
		},
		mounted() {
			this.queryTagCategory();
		},
		activated() {

		},
	}
</script>
<style scoped>
.dissociation-maintenance-save{
	width: 100%;
	position: relative;
}
>>>.dissociation-maintenance-msgBox .operation-but{
	color: rgb(41, 141, 255);
	cursor: pointer;
}
.dissociation-maintenance-save>>> .h-select,.dissociation-maintenance-save>>> .h-input-wrapper.h-input-type{
	width: 180px;
}
.dissociation-maintenance-save .wrapper{
	margin-bottom: 20px;
}
.title{
	display: inline-block;
	height: 30px;
	line-height: 30px;
	width: 75px;
	text-align: right;
}
.pointer-word-wrapper{
	vertical-align: top;
	width: calc(100% - 80px);
	border:1px solid #DCE1E7;
	background: #FAFAFA;
	color: #495060;
	padding: 18px 18px 0 18px;
	display: inline-block;
	border-radius: 3px;
}
.pointer-word-wrapper span{
	font-weight: normal;
	text-align: center;
	vertical-align: top;
	font-size: 12px;
	padding:0 25px 0 10px;
	height: 30px;
	display: inline-block;
	line-height: 30px;
	box-sizing: border-box;
	border: 1px solid #DCE1E7;
	background-color: #fff;
	border-radius: 4px;
	margin-right: 8px;
	margin-bottom: 8px;
	position: relative;
}
.pointer-word-wrapper span .h-icon-close{
	display: inline-block;
	font-size: 12px;
	margin-left: 5px;
	position: absolute;
	top: 9px;
	right: 8px;
	line-height: 12px;
}
.pointer-word-wrapper span .h-icon-close:hover{
	color: #f00;
	cursor: pointer;
}
.pointer-word-wrapper .add{
	color: #fff;
	background-color: #298DFF;
	border: 1px solid #298DFF;
	margin-bottom: 18px;
	padding: 0 15px;
}
.pointer-word-wrapper .add:hover{
	border-color: #0067dc;
	background: #0067dc;
	cursor: pointer;
}
.pointer-word-wrapper .add .h-icon{
	font-size: 10px;
	margin-right: 3px;
}
.selectDateil{
	padding-left: 75px;
	margin-top: 10px;
}
.selectDateil span{
	margin-right: 5px;
	border-radius: 4px;
	background: #000;
	color: #fff;
	padding: 0px 12px;
	line-height: 26px;
	display: inline-block;
}

.dissociation-maintenance-save>>> .h-input-group-append{
	padding: 0;
}
.dissociation-maintenance-save>>> .h-selectTree,.dissociation-maintenance-save>>> .h-selectTree-single .h-selectTree-selection{
	height: 30px;
	line-height: 30px;
	border-radius: 0 4px 4px 0;
	border: none;
	background: #eee;
}
.dissociation-maintenance-save>>> .h-selectTree-dropdown-content{
	text-align: left;
}
</style>