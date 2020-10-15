<template>
	<div class="test">
		<search-form>
			<div slot="head"></div>
			<ul slot="content">
				<li class="search-auto">
					<dl>
						<dt>模板名称：</dt>
						<dd class="search-form-name">{{ name }}</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<Upload action="/tm/mw/newsTestData/import" name="file" :data="{ templateId: id }"  :show-upload-list="false" :on-success="uploadSuccess" :on-error="uploadError">
						<h-button type="primary">导入</h-button>
					</Upload>
					<h-button type="primary" @click='getExport'>导出</h-button>
					<h-button type="primary" @click="goDetail" v-if="activeRoutersButton.indexOf('testDetail') != -1 " >查看结果</h-button>
					<h-button type="primary" @click="setEmpty()" v-if="activeRoutersButton.indexOf('testEmpty') != -1 " >清空</h-button>
				</li>
			</ul>
		</search-form>
		<div class="contents">
			<template v-if="testData.length > 0" >
				<Tabs size="small" @on-click="clickTabs">
					<TabPane v-for="(item, k) in testData" :key="k" :label="item.dataTemplateName" :name="k.toString()" ></TabPane>
				</Tabs>
			</template>
			<template v-if="tableHead.length > 0">
				<h-table
					size="small"
					:maxHeight="maxTableHeight"
					class="full-max-height-table"
					:columns="tableHead"
					:data="tableData"
					:highlight-row="false"
					border>
				</h-table>
			</template>
			<h-spin fix v-if="loading">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</h-spin>
		</div>
	</div>
</template>
<script>
export default {
	name: 'RobotwritingNewstemplateTest',
	data () {
		return {
			activeRoutersButton: [],
			tableHead: [],
			tableData: [],
			activeIndex: 0,
			testData: [],
			name: '',
			id: '',
			loading: false,
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods:{
		uploadSuccess(response, file, fileList){
			if(response.status == this.$api.SUCCESS){
				let data = response.data || {};
				this.formattingData(data);
				this.$hMessage.success('导入成功');
			}else{
				this.$hMessage.error(response.msg);
			}
		},
		uploadError(response, file, fileList){
			this.$hMessage.error('导入失败');
		},
		clickTabs(key){
			if(key == this.activeIndex)return;
			this.activeIndex = key;
			this.analysisData();
		},
		getDetail(){
			if(this.loading)return;
			this.loading = true;
			let url = '/tm/mw/newsTestData/getColumns?templateId=' + this.id;
			this.$http.get( url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data =  oTmp.data || {};
					this.formattingData(data);
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.loading = false;
			}).catch(err=>{
				this.loading = false;
				this.$hMessage.error('获取测试数据失败');
			})
		},
		formattingData(data){
			this.name = data.newsTemplateName || '';
			this.id = data.newsTemplateId || '';
			this.testData = data.dataTemplates || [];
			this.analysisData();
		},
		analysisData(){
			let arr = [{
					title: "序号",
					width: 60,
					align: "center",
					render: (h, params) => {
						let index = params.index + 1;
						return h('div', index );
					}
				}];
			let head = this.testData[this.activeIndex] ? this.testData[this.activeIndex].columns ? this.testData[this.activeIndex].columns : [] : [];
			for(let i = 0, len = head.length; i < len; i++){
				let obj = {
					key: head[i].originalName,
					title: head[i].columnName,
					align: "left",
				}
				arr.push(obj);
			}
			this.tableHead = arr;
			this.tableData = this.testData[this.activeIndex] ? this.testData[this.activeIndex].testDatas ? this.testData[this.activeIndex].testDatas : [] : [];
		},
		//导出列表
		getExport(){
			let url = '/tm/mw/newsTestData/export?templateId=' + this.id;
			window.location.href = url;
		},
		goDetail(){
			this.$router.push('/robotwriting/newstemplate/test/detail?id=' + this.id);
		},
		setEmpty(go = false){
			if(!go){
				this.$hMsgBox.confirm({
					title: '温馨提示',
					content: '确定清空数据？',
					onOk: ()=>{
						this.setEmpty(true);
					}
				})
				return;
			}
			let url = '/tm/mw/newsTestData/empty?templateId=' + this.id;
			this.$http.get( url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data =  oTmp.data || {};
					this.formattingData(data);
				}else{
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				this.loading = false;
				this.$hMessage.error('清空数据失败');
			})
		},
		init(){
			let { id,name } = this.$route.query;
			this.name = name;
			if(id == this.id)return;
			this.id = id;
			this.getDetail();
		}
	},
	mounted() {
		this.$store.commit('SET_ACTIVE_ROUTERS_BUTTON', '/robotwriting/newstemplate');
		this.activeRoutersButton = this.$store.state.activeRoutersButton;
		this.$store.commit('SAVE_TAB_NAME',{  path: this.$route.path, name: '新闻模板 - 测试' });
		this.init();
	},
	activated: function(){
		this.init();
	},
}
</script>
<style type="text/css" scoped>
.loadingInProgress{
	position: relative;
}
.search-form-name{
	line-height: 28px;
	font-weight: 600;
}
.test .h-upload{
	width: 56px;
	display: inline-block;
	vertical-align: top;
}
.contents{
	position: relative;
}
.search-auto{
	width: auto!important;
}
</style>