<template>
		<div class="outerBox" :style="isFixedBtn ? 'padding-top:50px' : 'padding-top:0'">
			<h-spin fix v-if="detailLoading">
			 	<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
		   		<div>加载中...</div>
			</h-spin>
			<h-form class="formSearchBox" ref="formInline" :model="commonFiltersCopy" :label-width="85" label-wrap>			 
					<div class="searchBox">
				 	<h-form-item prop="title" label="资讯标题：">
						<template>
				 			<div class="viewPage highLightColor" v-html="commonFiltersCopy.titleShow">{{commonFiltersCopy.titleShow ? commonFiltersCopy.titleShow : '-'}}</div>
				 		</template>		           
			        </h-form-item>
			        <h-form-item prop="content" label="资讯内容：">
			        	<template  v-if="hideVueCkeditor">
					        <vueCkeditor  v-model="commonFiltersCopy.content" :config="configView"></vueCkeditor>
			        	</template>
			        </h-form-item>
			         <h-form-item prop="labelList" label="标签列表：">
				        <div class="label-list-box">
							<h-table :height="labelListCopy.length >= 10 ? 370 : null" stripe size="small" border :columns="columns" :data="labelListCopy"></h-table>
						</div>
			        </h-form-item>	
			       <div v-if="commonFiltersCopy.remark && commonFiltersCopy.remark.length > 0" >
				 		<h-form-item prop="remark" label="处理记录：">
				 			<ul class="handleRemark">
				 				<li v-for="(item,index) in commonFiltersCopy.remark" :value="item" :key="index">
				 					{{item}}
				 				</li>
				 			</ul>          
				        </h-form-item>
				 	</div>
			    </div>
	        </h-form>
	</div>
</template>

<script>
import vueCkeditor from 'vue-ckeditor2';
import { ArrToString, stringToArray } from "@/filters/index";
export default {
	components: { vueCkeditor },
	name: 'JintanTagNewsDetail',
	props: {
		newsId: String,
		commonFilters: Object,
		labelList: Array
	},
	data() {
		return {
			activeRoutersButton: this.$store.state.activeRoutersButton,
			hideVueCkeditor: true,
			loadingBtnSave: false,
			contentShow: false,
			newsIdCopy: '',
			labelListCopy: [],
			commonFiltersCopy: {},
			detailLoading: false,
			isFixedBtn: false,//是否固定操作按钮
			delTags: [],
			columns: [
				{
					title: '标签名称',
					key: 'tagName',
					width: 250,
				},
				{
					title: '标签关联信息',
					key: 'relationInfo',
					width: 150
				},
				{
					title: '权重值',
					key: 'tagWeight',
					width: 80
				},
				{
					title: '标签近义词',
					key: 'synonym',
					width: 150,
					render: (h, params) => {
						let synonym = params.row.synonym;
						if (!synonym || synonym.length == 0) {
							synonym = '';
						} else {
							synonym = synonym.join()
						}

						return h('div', synonym)
					}
				},
				{
					title: '标签分类',
					key: 'categoryNames',
					// width: 300,
					// render: (h, params) => {
					// 	let categorysArr = params.row.categoryName;
					// 	let len = categorysArr.length;
					// 	let labelStr = categorysArr.join(',');
					// 	if (len > 0) {
					// 		return h('div', [
					// 			h("span", labelStr)
					// 		])
					// 	}
					// },
				},
			],
			configView: {
				bodyClass: 'ckeditorContents',
				height: "300px",
				width: "100%",
				toolbar: [
					['NewPage', 'DocProps', 'Preview', '-', 'Templates'],
					['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'],
					['Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt'],
					['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'],
					['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
					['Maximize'], ['Image'],
					['Styles', 'Format', 'Font', 'FontSize', 'lineheight'],
					['TextColor', 'BGColor'],
					['ShowBlocks', '-', 'About']
				],//工具栏选项
				allowedContent: true,//允许为内容标签添加class
				readOnly: true,
				toolbarStartupExpanded: false//工具栏默认是否展开
			},
			
		}
	},
	methods: {
		textContent() {
			let content = this.commonFiltersCopy.content.replace(/<[^>]+>|&[^>]+;/g, "").trim(); //去除HTML tag
			if (!content) {
				this.$hMessage.warning({ content: '资讯内容不能为空' });
				return false;
			};
			return true			
		},
	},
	watch: {
		labelList(newArr) {
			if (newArr) {
				this.labelListCopy = newArr;
			}
		},
		newsId(newId) {
			this.newsIdCopy = newId;
		},
		commonFilters: {
			handler(newObj) {
				this.commonFiltersCopy = { ...newObj };
				setTimeout(() => {
					this.commonFiltersCopy.content = newObj.content;
				}, 100)
			},
			deep: true
		}
	},
	mounted() {
		this.newsIdCopy = this.newsId;
		this.labelListCopy = [...this.labelList];
		sessionStorage.setItem('labelList', JSON.stringify(this.labelListCopy));
		this.commonFiltersCopy = { ...this.commonFilters };
		window.addEventListener('scroll', this.handleScroll, true);
	},
	destroyed() {
		window.removeEventListener('scroll', this.handleScroll);   //离开页面清除（移除）滚轮滚动事件
	},
	activated: function () {
		this.hideVueCkeditor = true;
	},
	deactivated: function () {
		this.hideVueCkeditor = false;
	}
}
</script>
<style>
.formSearchBox .h-form-item-label {
  color: #000000 !important;
  font-size: 13px;
}
.formSearchBox .h-form-item {
  margin-bottom: 10px !important;
}
.highLightColor .info-replace-color {
  background: #ff9999; /*粉色-替换词*/
}
.highLightColor .info-highlight-color {
  background: #66ffff; /*天蓝色-高亮*/
}
.highLightColor .info-label-color {
  background: #ffff00; /*-标签*/
}
</style>
<style scoped>
.viewPage {
  border: 1px solid #dce1e7;
  border-radius: 5px;
  padding: 0 5px;
  height: 32px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  cursor: pointer;
}
.searchBox .h-form-item {
  margin-bottom: 10px;
  margin-right: 12px;
  /* width: 264px; */
  width: 95%;
  display: inline-block;
}
.handleRemark {
  width: 100%;
  border: 1px solid #d7dde4;
}
.handleRemark li {
  padding: 0 10px;
}
.handleRemark li:nth-child(2n) {
  background: #fafafa;
}
.titleShow {
  box-sizing: border-box;
  height: 32px;
  padding: 0 12px;
  border: 1px solid #d7dde4;
  border-radius: 4px;
  font-size: 13px;
  color: #000;
}
.outerBox {
  position: relative;
}
.outerBox .h-input {
  font-size: 13px;
  color: #000;
}
.viewPage {
  font-size: 15px;
  color: #000;
}
</style>