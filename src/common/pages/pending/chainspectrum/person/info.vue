<template>
	<div class="content-wrapper">
		<div>
			<h-form ref="formValid" :model="personInfo" :label-width="100">
				<h-row>
	                <h-col span="12">
		                <h-form-item label="姓名：">
		                    <label>{{ personInfo.xm }}</label>
		                </h-form-item>
	                </h-col>
	                <h-col span="12">
		                <h-form-item label="性别：">
		                    <label>{{ genderDict[personInfo.xb] }}</label>
		                </h-form-item>
	                </h-col>
	            </h-row>

	            <h-row>
	                <h-col span="12">
		                <h-form-item label="国籍：">
		                    <label>{{ nationalityDict[personInfo.gj] }}</label>
		                </h-form-item>
	                </h-col>
	                <h-col span="12">
		                <h-form-item label="民族：">
		                    <label>{{ nationDict[personInfo.mz] }}</label>
		                </h-form-item>
	                </h-col>
	            </h-row>

	            <h-row>
	                <h-col span="12">
		                <h-form-item label="出生日期：">
		                    <label>{{ personInfo.csrq }}</label>
		                </h-form-item>
	                </h-col>
	                <h-col span="12">
		                <h-form-item label="学历：">
		                    <label>{{ educationDict[personInfo.xl] }}</label>
		                </h-form-item>
	                </h-col>
	            </h-row>

	            <h-row>
	                <h-col span="12">
		                <h-form-item label="毕业院校：">
		                    <label>{{ personInfo.byyx }}</label>
		                </h-form-item>
	                </h-col>
	                <h-col span="12">
		                <h-form-item label="专业：">
		                    <label>{{ personInfo.zy }}</label>
		                </h-form-item>
	                </h-col>
	            </h-row>

	            <h-row>
	                <h-col span="12">
		                <h-form-item label="户籍住址：">
		                    <label>{{ personInfo.zz }}</label>
		                </h-form-item>
	                </h-col>
	                <h-col span="12">
		                <h-form-item label="联系地址：">
		                    <label>{{ personInfo.lxdz }}</label>
		                </h-form-item>
	                </h-col>
	            </h-row>

	            <h-row>
	                <h-col span="12">
		                <h-form-item label="联系手机号：">
		                    <label>{{ personInfo.lxsjh }}</label>
		                </h-form-item>
	                </h-col>
	                <h-col span="12">
		                <h-form-item label="联系电话：">
		                    <label>{{ personInfo.lxdh }}</label>
		                </h-form-item>
	                </h-col>
	            </h-row>

	            <h-row>
	                <h-col span="12">
		                <h-form-item label="传真：">
		                    <label>{{ personInfo.cz }}</label>
		                </h-form-item>
	                </h-col>
	                <h-col span="12">
		                <h-form-item label="邮箱：">
		                    <label>{{ personInfo.yx }}</label>
		                </h-form-item>
	                </h-col>
	            </h-row>

	            <h-row>
	                <h-col span="12">
		                <h-form-item label="QQ：">
		                    <label>{{ personInfo.qq }}</label>
		                </h-form-item>
	                </h-col>
	                <h-col span="12">
		                <h-form-item label="微信：">
		                    <label>{{ personInfo.wx }}</label>
		                </h-form-item>
	                </h-col>
	            </h-row>

	            <h-row>
	                <h-col span="12">
		                <h-form-item label="背景资料：">
		                    <label>{{ personInfo.bjzl }}</label>
		                </h-form-item>
	                </h-col>
	                <h-col span="12">
		                
	                </h-col>
	            </h-row>
		        <h-form-item>
		        	<h-row type="flex" justify="center">
	            		<h-col span="3">
	            			<h-button type="primary" long @click="edit">编辑实体</h-button>
	            		</h-col>
	            	</h-row>
	            	
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
            personInfo: {},
            id: this.$route.query.id + '',
            educationDict: {},
            genderDict: {},
            nationDict: {},
            nationalityDict: {},
		}
	},
	components: {},
	methods:{
		getInfo() {
			let url = '/tm/chainpeople/querypeoplebyid?id=' + this.id
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					this.personInfo = tmpObj.data
					
					this.spinShow = false
				}else{
					this.personInfo = {}
					this.spinShow = false
				}
			}).catch(err=>{
				this.personInfo = {}
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
			this.$router.push({path: '/chainspectrum/person/edit', query: {id: this.id}})
		},
		getEducation() {
			let _this = this
			let url = '/tm/chainpeople/geteducation'
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					tmpObj.data.forEach(
						function(d){
								let key = d.dm + ''
								_this.educationDict[key] = d.ms
							}
						)
				}
			}).catch(err=>{
				console.log(err)
				this.$hMessage.error('发生未知错误!')
        	})
		},
		getGender() {
			let _this = this
			let url = '/tm/chainpeople/getgender'
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					tmpObj.data.forEach(
						function(d){
								let key = d.dm + ''
								_this.genderDict[key] = d.ms
							}
						)
				}
			}).catch(err=>{
				console.log(err)
				this.$hMessage.error('发生未知错误!')
        	})
		},
		getNation() {
			let _this = this
			let url = '/tm/chainpeople/getnation'
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					tmpObj.data.forEach(
						function(d){
								let key = d.dm + ''
								_this.nationDict[key] = d.ms
							}
						)
				}
			}).catch(err=>{
				console.log(err)
				this.$hMessage.error('发生未知错误!')
        	})
		},
		getNationality() {
			let _this = this
			let url = '/tm/chainpeople/getnationality'
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					tmpObj.data.forEach(
						function(d){
								let key = d.dm + ''
								_this.nationalityDict[key] = d.ms
							}
						)
				}
			}).catch(err=>{
				console.log(err)
				this.$hMessage.error('发生未知错误!')
        	})
		},
		init() {
			let _this=this
			this.getEducation() 
			this.getGender()
			this.getNation()
			this.getNationality()
			setTimeout(function()  {
				_this.getInfo()
			}, 500)
		}
        
	},
	mounted(){
		this.init()

		
		// if(this.$store.state.routersButton.ContentReport){
		// 	this.activeRoutersButton = this.$store.state.routersButton.ContentReport
		// }
	}
}
</script>
<style scoped>

</style>
