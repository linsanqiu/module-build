<template>
	<div class="content-wrapper">
		<div>
			<h-form ref="formValid" :model="reportInfo" :label-width="100">
		        <h-form-item label="报告标题：">
		            <h-row>
		                <h-col span="11">
		                    <label>{{ reportInfo.title }}</label>
		                </h-col>
		                <h-col span="13">
		                	<router-link :to="{ path: '/content/report/edit',query:{id: this.id}}" v-if="reportInfo.source == '自有'">
								<h-button type="primary" v-if="activeRoutersButton.indexOf('ReportEdit') != -1">报告编辑</h-button>
							</router-link>
						    <h-poptip
						        confirm
						        :title="reportInfo.status !== '1' ? '是否发布？' : '是否下架？'"
						        placement="bottom"
						        @on-ok="publish">
						        <h-button type="primary" v-if="activeRoutersButton.indexOf('ReportPublish') != -1">{{ reportInfo.status === '1' ? '下架' : reportInfo.status === '2' ? '发布': reportInfo.status === '3' ? '发布' : '-' }}</h-button>
						    </h-poptip>
						    <h-poptip trigger="hover" placement="bottom">
						        <h-button type="primary" v-if="activeRoutersButton.indexOf('ReportPreview') != -1">预览</h-button>
						        <div class="api" slot="content">
						            <qrcode-vue :value="previewUrl" :size="size" level="H"></qrcode-vue>
						        </div>
						    </h-poptip>
						    
		                </h-col>
		            </h-row>
		            
		        </h-form-item>
		        <h-form-item label="报告来源：">
		            <label>{{ reportInfo.source }}</label>
		        </h-form-item>
		        <h-form-item label="生成时间：">
		            <label>{{ reportInfo.createTime }}</label>
		        </h-form-item>
		        <h-form-item label="报告标签：">
		        	<template v-for="item in reportInfo.tags">
		        		<h-tag type="border" color="green">{{ item.tagName }}</h-tag>
		        	</template>
		        	<span style="padding-left: 20px">
		        		<h-button type="primary" size="small" @click="tagInit()" v-if="activeRoutersButton.indexOf('ReportTagEdit') != -1">修改标签</h-button>
		        	</span>
		        	
		        </h-form-item>
		        <h-form-item label="PDF报告：">
		        	<h-row>
		        		<h-col>
		        			<label><a target="_blank" v-if="reportInfo.attachId != ''" :href="reportInfo.attachId">{{ reportInfo.attachName }}</a></label>
			                <h-upload
			                	ref="upload"
			                    :before-upload="handleUpload"
			                    :on-success="handleSuccess"
			                    :on-format-error="handleFormatError"
			                    :on-exceeded-size="handleMaxSize"
			                    :show-upload-list="false"
			                    :format="['pdf', 'PDF']"
			                    :max-size="10240"
			                    :data="uploadData"
			                    action="/tm/report/pdfupload"
			                    style="display: inline-block;padding-left: 20px">
			                    <h-button size="small" :loading="uploadLoading" type="info" icon="ios-cloud-upload-outline" v-if="activeRoutersButton.indexOf('ReportPDFUpload') != -1">{{ reportInfo.attachId == '' || reportInfo.attachId == null ? '报告上传' : '重新上传' }}</h-button>    
			                </h-upload>
		        		</h-col>
		        	</h-row>
		        </h-form-item>
		        <h-form-item label="报告状态：">
		            <label>{{ reportInfo.status === '1' ? '已发布' : reportInfo.status === '2' ? '草稿': reportInfo.status === '3' ? '已下架' : '' }}</label>
		        </h-form-item>
		        <h-form-item label="报告正文：">
			        <div v-html='reportInfo.content'></div>
		        </h-form-item>
			</h-form>
	    	<h-msgBox
	    		title="标签修改"
	    		:mask-closable="false"
	    		@on-ok="ok"
		        v-model="tagModal">
		        <h-select-tree onlyChild :firstValue="tagNames" :clearable="false" :data="tagData" @on-check-change="treeCheckChange" showCheckbox filterable></h-select-tree>
		        <!-- <div slot="footer">
	    			<h-button  type="info" @click="ok()" long size="large">确定</h-button>
		        </div> -->
		    </h-msgBox>
		 </div>
		 <h-spin fix v-if="spinShow"></h-spin>
	</div>
</template>
<script type="text/javascript">
import Ckeditor from 'vue-ckeditor2'
import QrcodeVue from 'qrcode.vue';

export default {  
	data () {
		return{
			activeRoutersButton: [],
        	spinShow: true,
        	content: '',
            config: {
                height: 500
            },
            reportInfo: {},
            id: this.$route.query.id + '',
            uploadData: {
            	id: this.$route.query.id + '',
            },
            uploadLoading: false,
            tagModal: false,
            tagNames: [],
            tagData: [],
            tagInfo: [],
            previewUrl: '',
      		size: 100
		}
	},
	components: { Ckeditor, QrcodeVue },
	methods:{
		getInfo() {
			let url = '/tm/report/' + this.id
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					this.reportInfo = tmpObj.data
					let tagNames = []
					tmpObj.data.tags.forEach(function(d){
						tagNames.push(d.tagName)
					})
					this.tagNames = tagNames
					this.spinShow = false
				}else{
					this.reportInfo = {}
					this.spinShow = false
				}
			}).catch(err=>{
				this.reportInfo = {}
				this.spinShow = false
        	})
		},
		publish() {
			let ope = this.reportInfo.status == '1' ? '0' : '1'
			let status = this.reportInfo.status == '1' ? '3' : '1'
			let url = '/tm/report/status?id=' + this.id + '&ope=' + ope
			this.$http.post(url).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					this.reportInfo.status = status
					this.$hMessage.info('报告状态更新成功!');
				} else {
					this.$hMessage.error('发生未知错误，更改状态失败!');
				}
			}).catch(err=>{
				this.$hMessage.error('发生未知错误，更改状态失败!');
			})
		},
        handleSuccess (res, file) {
        	this.reportInfo.attachId = res.data.attachId
        	this.reportInfo.attachName = res.data.attachName
        	this.uploadLoading = false
            this.$hNotice.success({
                title: '报告上传',
                desc: '文件 ' + file.name + ' 上传成功。'
            });
        },
        handleMaxSize (file) {
            this.$hNotice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 10M。'
            });
            this.uploadLoading = false
        },
        handleFormatError (file) {
            this.$hNotice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 pdf 格式的图片。'
            });
            this.uploadLoading = false
        },
        handleUpload (file) {
        	this.uploadLoading = true
            return true
        },
        tagInit() {
        	let tagNames = []
			this.reportInfo.tags.forEach(function(d){
				tagNames.push(d.tagName)
			})
			this.tagNames = tagNames
        	this.tagModal = true
        },
        treeSelectChange(data) {
        	let tags = []
			data.forEach(function(d){
				if(!d.children) {
					tags.push({
						"tagId": d.id,
						"tagName": d.title
					})
				}
			})
			this.tagInfo = tags
        },
        treeCheckChange(data) {
			let tags = []
			data.forEach(function(d){
				if(!d.children) {
					tags.push({
						"tagId": d.id,
						"tagName": d.title
					})
				}
			})
			this.tagInfo = tags
        },
		getTagInfo() {
			let url = '/tm/three/tag/category/industry/2'
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					this.initSelectTreeData(tmpObj.data)
				}
			}).catch(err=>{
				console.log(err)
				this.$hMessage.error('发生未知错误!')
        	})
		},
        initSelectTreeData(data) {
			let _this = this
			let result = []
			data.forEach(function(d) {
				let children = []
				if(d.child_category.length > 0) {
					d.child_category.forEach(function(c) {
						children.push({
							id: c.category_id,
							title: c.category_name
						})
					})
					let category = {
						id: d.category_id,
						title: d.category_name,
						children: children
					}
					result.push(category)
				}
			})
			_this.tagData = result
		},
		ok() {
			if(this.tagInfo.length == 0) {
				this.$hMessage.error('请选择标签!')
				return
			}
			this.tagModal = false
			let url = '/tm/report/tag/save?id=' + this.id
			this.$http.post(url, this.tagInfo).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					this.$hMessage.success('保存成功!')
					this.getInfo()
				}
			}).catch(err=>{
				this.$hMessage.error('发生未知错误!')
			})
		},
		qrCodeInit() {
			let url = window.location.href
			this.previewUrl = url.replace('info', 'preview')
		}
	},
	mounted(){
		this.getTagInfo()
		this.getInfo()
		this.qrCodeInit()
		if(this.$store.state.routersButton.ContentReport){
			this.activeRoutersButton = this.$store.state.routersButton.ContentReport
		}
	}
}
</script>
<style scoped>

</style>
