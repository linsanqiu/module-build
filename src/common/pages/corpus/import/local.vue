<template>
	<div class="local">
		<windowDrag leftW="205px" class="detail-drag">
			<div class="local-left" slot="left">
				<incident :onEvent="changeCode"></incident>
			</div>
			<div class="local-right" slot="right">
				<search-form class="top-search">
					<div slot="head"></div>
					<ul slot="content">
						<li class="search-wrapper-but">
							<template v-if="activeRoutersButton.indexOf('upload') != -1">
								<template v-if="fileUpload">
									<h-button type="primary">文件上传中...</h-button>
								</template>
								<template v-else>
									<Upload ref="upload" action="/tm/corpus/infomation/uploadexcel" :data="{ eventCode: activeCode }" :uploadAll="true" name="file" :multiple="false" :show-upload-list="false" :on-self-success="uploadSuccess" :on-error="uploadError" :before-upload="handleBeforeUpload" :mergeHook="true"> 
										<h-button type="primary" :disabled=" activeCode ? false : true">上传</h-button>
									</Upload>
								</template>
							</template>
							<h-button type="primary" @click="del" v-if="activeRoutersButton.indexOf('delete') != -1" >批量删除</h-button>
							<h-button type="primary" @click="templateDownload">模板下载</h-button>
						</li>
					</ul>
				</search-form>
				<div>
					<h-table
						size="small"
						:maxHeight="maxTableHeight"
						class="full-max-height-table"
						:columns="aryHeaderData"
						:data="NewsList"
						:highlight-row="false"
						@on-selection-change="selectionDelList"
						border>
					</h-table>
					<div class="tab-box">
						<span class="select-len">当前已选择 {{ selectNews.length }} 条</span>
						<h-page highlight-row size="small" show-elevator show-total show-sizer placement="top" class="page-box" :page-size-opts="pageSizeOpts" :total="total" :current="req.page" :page-size="req.size" @on-change="onPageChange" @on-page-size-change="onPageSizeChange"></h-page>
					</div>
					<h-spin fix v-if="isGetList">
						<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
						<div>加载中...</div>
					</h-spin>
				</div>
			</div>
		</windowDrag>
	</div>
</template>
<script type="text/javascript">
import { copyDeep } from '@/filters/index'
import incident from '../components/incident';
import windowDrag from '@/components/windowDrag';
export default {
	name: 'CorpusImportLocal',
	components: { incident,windowDrag },
	data () {
		return {
			activeRoutersButton: this.$store.state.activeRoutersButton,
			activeCode: '',
			EventList: [],
			aryHeaderData: [
				{
					type: "selection",
					width: 60,
					align: "center",
					fixed: "center",
				},{
					title: '标题',
					key: 'newsTitle',
					width: 200,
				},{
					title: '内容',
					key: 'content',
				}
			],
			isGetList: false,
			total: 0,
			pageSizeOpts: [10,20,50,100],
			NewsList: [],
			req: {
				current: 1,
				size: 10,
			},
			selectNews:[],
			fileUpload: false,
			isDel: false,
		}
	},
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight - 30 },
	},
	methods: {
		templateDownload(){
			window.location.href = '/tm/corpus/infomation/downloadInfoTemplate';
		},
		del(){
			let len = this.selectNews.length;
			if(len == 0){
				this.$hMessage.error('请选择需要删除的资讯！');
			}else{
				this.$hMsgBox.confirm({
					title:'批量删除',
					content:'共选中'+ len +'条资讯，确认删除?',
					onOk:()=>{
						this.setDelData();
					}
				})
			}
		},
		setDelData(){
			if(this.isDel)return;
			this.isDel = true;
			this.isGetList = true;
			let url = '/tm/corpus/infomation/batchDeleteInformation';
			this.$http.post(url, { ids: this.selectNews.toString()}).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.$hMessage.success('删除成功');
					this.selectNews = [];
					this.getNews(true);
				}else{
					this.$hMessage.error(oTmp.msg);
					this.isGetList = false;
				}
				this.isDel = false;
			}).catch(err=>{
				this.isDel = false;
				this.isGetList = false;
				this.$hMessage.error('网络错误，删除失败');
			})
		},
		handleBeforeUpload(list){
			this.fileUpload = true;
		},
		uploadSuccess(response, file, fileList){
			this.fileUpload = false;
			let name = 'error'
			if(response.status == this.$api.SUCCESS){
				this.$hMessage.success(response.msg);
				this.selectNews = [];
				this.getNews(true);
			}else{
				this.$hMessage.error({
					content: response.msg
				});
			}
		},
		uploadError(response, file, fileList){
			this.$hMessage.error('上传失败');
			this.fileUpload = false;
		},
		selectionDelList(a,b){
			let list = this.NewsList;
			for(let i = 0,len = list.length; i < len; i++){
				if(b.indexOf(i) != -1){
					if(this.selectNews.indexOf(list[i].id) == -1){
						this.selectNews.push(list[i].id)
					}
				}else{
					let index = this.selectNews.indexOf(list[i].id);
					if(index != -1){
						this.selectNews.splice(index,1);
					}
				}
			}
		},
		onPageChange(val){
			this.req.current = val;
			this.getNews();
		},
		onPageSizeChange(size){
			this.req.size = size;
			this.onPageChange(1);
		},
		changeCode(code){
			this.selectNews = [];
			this.activeCode = code;
			this.req.current = 1;
			this.getNews(true);
		},
		getNews(go = false){
			if(this.isGetList && !go)return;
			this.isGetList = true;
			let code = copyDeep(this.activeCode);
			let url = '/tm/corpus/infomation/getInformationVoPage?current='+ this.req.current +'&size='+ this.req.size +'&eventCode=' + code ;
			this.$http.post(url).then((res)=>{
				if(code != this.activeCode)return;
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.data ? oTmp.data : {};
					let total = data.total || 0;
					let list = data.records || [];
					if(total && list.length == 0){
						this.req.current = Math.ceil(total/this.req.size)
						this.getNews(true);
						return;
					}
					for(let i = 0,len = list.length; i < len; i++){
						if(this.selectNews.indexOf(list[i].id) != -1){
							list[i]['_checked'] = true;
						}
					}
					this.NewsList = list;
					this.total = total;
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetList = false;
			}).catch(err=>{
				this.isGetList = false;
				this.$hMessage.error('查询本地数据失败');
			})
		},
	},
	mounted() {
		//this.getNews();
	}
}
</script>
<style type="text/css" scoped>
.local{
	display: flex;
	width: 100%;
	height: 100%;
	border: 1px solid #dfdfdf;
	background: #fff;
}
.local .local-left{
	min-width: 200px;
	width: 100%;
	height: 100%;
}
.local .local-right{
	padding: 10px 10px 0 10px;
	width: 100%;
	overflow: auto;
	position: relative;
	min-width: 700px;
	min-height: 100%;
}
.adv-contents{
	font-size: 12px;
	display: flex;
}
.adv-left,.adv-center,.adv-right{
	width: calc((100% - 30px)/3);
}
.adv-center{
	margin: 0 15px;
}
.adv-title{
	display: flex;
}
.adv-title strong{
	font-weight: 600;
	line-height: 28px;
	flex: 1;
}
.adv-contents .h-btn{
	height: 28px;
	line-height: 28px;
	padding-top: 0;
    padding-bottom: 0;
    margin-left: 5px;
}
.adv-info{
	border: 1px solid #888;
	margin-top: 10px;
	height: calc(100% - 38px);
	overflow-x:auto; 
	overflow-y: hidden;
}
.adv-info table{
	table-layout:fixed;
	width: 100%;
	border-top: 1px solid #dfdfdf;
	border-left: 1px solid #dfdfdf;
}
.adv-info table td{
	width: 120px;
	padding: 0 5px;
	border-right: 1px solid #dfdfdf;
}
.adv-info table tr{
	border-bottom: 1px solid #dfdfdf;
}
.adv-info table .end{
	width: auto;
}
.search-wrapper-but >>>.h-upload{
	display: inline-block;
}
.tab-box{
	position: relative;
}
.select-len{
	position: absolute;
	line-height: 26px;
	color: red;
	top: 0;
	left: 0;
}
</style>