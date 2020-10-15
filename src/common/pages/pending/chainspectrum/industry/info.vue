<template>
	<div class="content-wrapper">
		<h-form ref="formIndustry":model="industryInfo" 
		:label-width="100">
			<h-form-item label="行业名称：" prop='hymc'>
				<label>{{industryInfo.hymc}}</label>	           
	        </h-form-item>
	        <h-form-item label="行业代码：" prop='hydm'>
	            <label>{{industryInfo.hydm}}</label>
	        </h-form-item>			       
	        <h-form-item label="行业编码：" prop='hybm'>
	             <label>{{industryInfo.hybm}}</label>
	        </h-form-item>
	        <h-form-item label="行业简介：" prop='hyjj'>
	        	<label>{{industryInfo.hyjj}}</label>	          
	        </h-form-item>
	        <h-form-item>
            	<h-button type="primary" v-if="activeRoutersButton.indexOf('IndustryEdit') != -1" @click="onEdit">编辑实体</h-button>            	
	        </h-form-item>			       
		</h-form>
		<h-spin fix v-if="spinShow"></h-spin>
	</div>
</template>
<script  type="text/javascript">
export default {  
	data () {
		return{	
			activeRoutersButton:[],		
            industryInfo: {},
            spinShow:true,
            id: this.$route.query.id + '',
           
		}
	},	
	methods:{
		queryDetail(){
			if(!this.id) {
				this.spinShow = false;
				return;
			}
			let url = '/tm/chain/industry/'+this.id;
			this.$http.get(url).then((res)=>{
				this.spinShow = false;					
				let tmpObj = res.data;
				if(tmpObj.status != this.$api.SUCCESS){
					this.industryInfo = {};						
					this.$hMessage.error(tmpObj.msg);
					return;
				}
				let tmpData = tmpObj.data ? tmpObj.data : {}; 
				this.industryInfo = tmpData;									
			}).catch(err=>{
				this.industryInfo = {};
				this.spinShow = false;	
				this.$hMessage.error("未知错误");
			})
		},
		onEdit(row){
			this.$router.push({path: '/chainspectrum/industry/edit',query: {id: this.id}});
		},

	},
	mounted(){
		this.queryDetail();
		if(this.$store.state.routersButton.ChainspectrumIndustry){
			this.activeRoutersButton = this.$store.state.routersButton.ChainspectrumIndustry
		}
	}
}
</script>