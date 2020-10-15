<template>
	<div class="content-wrapper">
		<h-form ref="formIndustry" :rules="ruleIndustry" :model="industryInfo" 
		:label-width="100">
			<h-form-item label="行业名称" prop='hymc'>						
	            <h-input v-model.trim="industryInfo.hymc" placeholder="请输入"></h-input>
	        </h-form-item>			       
	        <h-form-item label="行业简介" prop='hyjj'>			        	
	            <h-input v-model.trim="industryInfo.hyjj" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请输入"></h-input>
	        </h-form-item>
	         <h-form-item>
            	<h-row type="flex"  justify="center">
            		<h-col span="3">
            			<h-button type="primary" long v-if="activeRoutersButton.indexOf('IndustrySave') != -1" @click="save()" :loading="isSubmit">提交</h-button>            			
            		</h-col>
            	</h-row>	
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
            isSubmit:false,
           	ruleIndustry:{
				hymc:[ { required: true, message: '请填写行业名称', trigger: 'blur' },
                		{type: 'string', max: 100, message: '行业名称不能多于100字', trigger: 'blur' }]
			},
		}
	},	
	methods:{
		queryDetail(){
			if(!this.id) {
				this.spinShow = false;
				this.industryInfo={
					 "id": null,
				    "hymc": null,
				    "hydm": null,
				    "hybm": null,
				    "hyjj": null,
				    "sjhy": null
				};
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
		save(){
			this.$refs['formIndustry'].validate((valid) => {
				if(valid){						
					this.submit();
				}
			})

		},
		submit(){
			if(this.isSubmit) return;
			this.isSubmit = true;
			let savedata = this.industryInfo;
			let url = '/tm/chain/industry/save';
			this.$http.post(url, savedata).then((res)=>{
				this.isSubmit = false;
				let tmpObj = res.data;
				if(tmpObj.status != this.$api.SUCCESS){
					this.$hMessage.error(tmpObj.msg);
					return;
				}
				this.$hMessage.success('保存成功!')			 
			 	this.$store.commit('DEL_TAB', '/chainspectrum/industry/edit')
				this.$router.push({path: '/chainspectrum/industry'})
			}).catch(err=>{
				this.isSubmit = false;
				this.$hMessage.error('未知错误')
			})
		},

	},
	mounted(){
		this.queryDetail();
		if(this.$store.state.routersButton.ChainspectrumIndustry){
			this.activeRoutersButton = this.$store.state.routersButton.ChainspectrumIndustry;
		}
	}
}
</script>