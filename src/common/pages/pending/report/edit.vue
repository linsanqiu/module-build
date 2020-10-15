<template>
	<div class="content-wrapper">
		<h-form ref="formInline" :rules="ruleInline" :model="reportInfo" :label-width="100">
	        <h-form-item prop="title" label="报告标题">
	            <h-input v-model="reportInfo.title"></h-input>
	        </h-form-item>
	        <h-form-item label="报告标签" prop="tagIds">
	        	<h-select-tree onlyChild :firstValue="tagNames" :clearable="false" :data="tagData" @on-check-change="treeCheckChange" showCheckbox filterable></h-select-tree>
	        </h-form-item>
	        <h-form-item prop="content" label="报告正文">
		        <ckeditor
		        		v-if="!spinShow"
		                v-model="reportInfo.content"
		                :config="config">
		        </ckeditor>
	        </h-form-item>
            <h-form-item>
            	<h-row type="flex" justify="center">
            		<h-col span="3">
            			<h-button type="primary" long @click="handleSubmit('formInline')" v-if="activeRoutersButton.indexOf('ReportSave') != -1">提交</h-button>
            		</h-col>
            	</h-row>
	            
	            <!-- <h-button type="ghost" style="margin-left: 8px">取消</h-button> -->
	        </h-form-item>
		</h-form>
		<h-spin fix v-if="spinShow"></h-spin>
	</div>
</template>
<script type="text/javascript">
import Ckeditor from 'vue-ckeditor2'

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
            id: this.$route.query.id,
            spinShow: true,
            ruleInline: {
                title: [
                    { required: true, message: '请填写报告标题', trigger: 'blur' },
                    { type: 'string', max: 100, message: '报告标题不能多于100字', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请填写报告正文', trigger: 'blur' }
                ]
            },
            tagIds: [],
            tagNames: [],
            tagData: [],
            allTagInfo: {},
            tagInfo: []
		}
	},
	components: { Ckeditor },
	methods:{
		getInfo() {
			if(!this.id) {
				this.spinShow = false
				return
			}
			let url = '/tm/report/' + this.id
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					this.reportInfo = tmpObj.data
					let tagIds = []
					let tagNames = []
					tmpObj.data.tags.forEach(function(d){
						tagIds.push(d.tagId)
						tagNames.push(d.tagName)
					})
					this.tagIds = tagIds
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
		handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.save()
                }
            })
		},
		save() {
			if(this.reportInfo.title.trim() == '') {
				this.$hMessage.error('请完善报告标题!')
				return
			}
			if(this.tagInfo.length == 0) {
				this.$hMessage.error('请选择标签!')
				return
			}
			if(!this.$route.query.id) {
				this.id = ''
			}
			if(this.id != '' && this.reportInfo.source != '自有') {
				this.$hMessage.error('仅支持自有报告编辑!')
				return
			}
        	let saveInfo ={
			  "attachId": "",
			  "attachName": "",
			  "content": this.reportInfo.content,
	    	  "tags": this.tagInfo,
			  "id": this.id,
			  "industry": this.reportInfo.industry,
			  // "status": this.reportInfo.status,
			  "title": this.reportInfo.title
			}
			let url = '/tm/report/save'
			this.$http.post(url, saveInfo).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					this.$hMessage.success('保存成功!')
				 	this.$store.commit('DEL_TAB', '/chainspectrum/brand/edit')
				 	this.$router.push({path: '/chainspectrum/brand'})
				}
			}).catch(err=>{
				this.$hMessage.error('发生未知错误!')
			})
		},
		getTagInfo() {
			let url = '/tm/three/tag/category/industry/2'
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					this.initSelectTreeData(tmpObj.data)
				}
				this.getInfo()
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
						_this.allTagInfo[c.category_id] = c.category_name
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
		}
	},
	mounted(){
		this.getTagInfo()
		// this.getInfo()
		if(this.$store.state.routersButton.ContentReport){
			this.activeRoutersButton = this.$store.state.routersButton.ContentReport
		}
	}
}
</script>
<style scoped>

</style>
