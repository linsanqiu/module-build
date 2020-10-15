<template>
	<div class="content-wrapper">
		<div>
			<h-form ref="formValid" :model="productInfo" :label-width="100">
		        <h-form-item label="产品名称：">
		            <label>{{ productInfo.cpmc }}</label>
		        </h-form-item>
		        <h-form-item label="产品类型：">
		            <label>{{ productType[productInfo.cplx] }}</label>
		        </h-form-item>
		        <h-form-item label="产品简介：">
		        	<label>{{ productInfo.cpjj }}</label>
		        </h-form-item>
		        <h-form-item>
            	<h-button type="primary" @click="edit">编辑实体</h-button>
	        </h-form-item>
			</h-form>
		 </div>
		 <h-spin fix v-if="spinShow"></h-spin>
	</div>
</template>
<script type="text/javascript">

export default {  
	data () {
		return{
			activeRoutersButton: [],
        	spinShow: true,
            productInfo: {},
            id: this.$route.query.id + '',
            productType: {
            	"1": "电商类产品",
            	"2": "互联网类产品"
            },
            
		}
	},
	components: {},
	methods:{
		getInfo() {
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
		
		getTagInfo() {
			let url = '/tm/chainproduct/getproducttype'
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					this.productType = tmpObj.data
				}
			}).catch(err=>{
				console.log(err)
				this.$hMessage.error('发生未知错误!')
        	})
		},
		edit() {
			this.$router.push({path: '/chainspectrum/product/edit', query: {id: this.id}})
		},
		
        
	},
	mounted(){
		
		this.getInfo()

	}
}
</script>
<style scoped>

</style>
