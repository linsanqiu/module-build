<template>
	<div class="content-wrapper">
		<h-form ref="formInline" :rules="ruleInline" :model="productInfo" :label-width="100">
	        <h-form-item prop="cpmc" label="产品名称">
	            <h-input v-model.trim="productInfo.cpmc" placeholder="请输入产品名称" style="width:500px"></h-input>
	        </h-form-item>
	        <h-form-item label="产品类型" prop="cplx">
	            <h-select v-model="productInfo.cplx" placeholder="请选择产品类型" style="width:500px">
	                <h-option value="" >请选择</h-option>
		        	<h-option v-for="item in productType" :value="item.dm" :key="item.dm">{{ item.ms }}</h-option>
	            </h-select>
	        </h-form-item>
	        <h-form-item label="产品简介" prop="cpjj">
	        	<h-input v-model.trim="productInfo.cpjj" style="width:500px" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入产品简介..."></h-input>
	        </h-form-item>
            <h-form-item>
            	<h-row type="flex" justify="left">
            		<h-col span="3">
            		</h-col>
            		<h-col span="3">
            			<h-button type="primary" long @click="handleSubmit('formInline')">提交</h-button>
            		</h-col>
            	</h-row>
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
            id: this.$route.query.id,
            ruleInline: {
                cpmc: [
                    { required: true, message: '请填写产品名称', trigger: 'blur' },
                    { type: 'string', max: 100, message: '产品名称不能多于100字', trigger: 'blur' }
                ],
                cplx: [
                    // { required: true, message: '请选择产品类型', trigger: 'change' }
                ]
            },
            productInfo: {
            	"id": "",
            	"cpmc": "",
            	"cplx": "",
            	"cpjj": ""
            },
            productType:[],
		}
	},
	components: { Ckeditor },
	methods:{
		getInfo() {
			if(!this.id) {
				this.spinShow = false
				return
			}
			let url = '/tm/chainproduct/queryproductbyid?id=' + this.id
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					this.productInfo = tmpObj.data
					this.spinShow = false
				}else{
					this.productInfo = {}
					this.spinShow = false
				}
			}).catch(err=>{
				this.productInfo = {}
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
			if(!this.$route.query.id) {
				this.id = ''
			}
        	let saveInfo ={
			  "id": this.id,
			  "cpmc": this.productInfo.cpmc,
			  "cpjj": this.productInfo.cpjj,
			  "cplx": this.productInfo.cplx
			}
			let url = '/tm/chainproduct/save'
			this.$http.post(url, saveInfo).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					this.$hMessage.success('保存成功!')
				 	this.$store.commit('DEL_TAB', '/chainspectrum/product/edit')
				 	this.$router.push({path: '/chainspectrum/product'})
				} else {
					this.$hMessage.error(tmpObj.msg)
				}
			}).catch(err=>{
				this.$hMessage.error('发生未知错误!')
			})
		},
		getTagInfo() {
			let url = '/tm/chainproduct/getproducttype'
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					this.productType = tmpObj.data
					this.getInfo()
				} else {
					this.$hMessage.error(tmpObj.msg)
				}
			}).catch(err=>{
				console.log(err)
				this.$hMessage.error('发生未知错误!')
        	})
		},
	},
	mounted(){
		this.getTagInfo()
		
		if(this.$store.state.routersButton.ChainspectrumProduct){
			this.activeRoutersButton = this.$store.state.routersButton.ChainspectrumProduct
		}
	}
}
</script>
<style scoped>

</style>
