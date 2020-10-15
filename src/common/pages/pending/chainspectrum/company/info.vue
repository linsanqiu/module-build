<template>
	<div class="content-wrapper">
		<h-form ref="formCompany" :model="companyInfo" 
		:label-width="120" cols="2">					
			<h-form-item label="企业名称：" prop='qymc'>			            
	            <label >{{companyInfo.qymc}}</label>	            
	        </h-form-item>
	        <h-form-item label="工商企业编号：" prop='gsqybh'>
	        	<label >{{companyInfo.gsqybh}}</label>	          
	        </h-form-item>			        
	        <h-form-item label="英文名："  prop='ywm'>
	        	<label >{{companyInfo.ywm}}</label>	          
	        </h-form-item>
	        <h-form-item label="公司类型："  prop='gslx'>
	           <label >{{companyInfo.gslx}}</label>	          
	        </h-form-item>
	        <h-form-item label="注册号："  prop='zch'>
	        	<label >{{companyInfo.zch}}</label>	         
	        </h-form-item>
	        <h-form-item label="组织机构代码："  prop='zzjgdm'>
	        	<label >{{companyInfo.zzjgdm}}</label>	         
	        </h-form-item>
	        <h-form-item label="纳税人识别号："  prop='nsrsbh'>
	        	<label >{{companyInfo.nsrsbh}}</label>
	        </h-form-item>
	        <h-form-item label="统一社会信用代码："  prop='tyshxydm'>
	        	<label >{{companyInfo.tyshxydm}}</label>
	        </h-form-item>
	        <h-form-item label="法人类型："  prop='fddbrlx'>			        	
	        	<label >{{companyInfo.fddbrlx}}</label>
	        </h-form-item>
	        <h-form-item label="法人姓名："  prop='fddbrxm'>
	        	<label >{{companyInfo.fddbrxm}}</label>
	        </h-form-item>
	        <h-form-item label="成立日期："  prop='clrq'>
	        	<label >{{companyInfo.clrq}}</label>
	        </h-form-item>
	        <h-form-item label="企业状态："  prop='qyztbm'>
	           <label >{{companyInfo.qyztbm}}</label>
	        </h-form-item>
	        <h-form-item label="注册资金(万元)："  prop='zczj'>
	        	<label >{{companyInfo.zczj}}</label>
	        </h-form-item>
	        <h-form-item label="币种："  prop='bz'>
	        	<label >{{companyInfo.bz}}</label>
	        </h-form-item>
	        <h-form-item label="营业期限开始日期："  prop='yyqxks'>
	        	<label >{{companyInfo.yyqxks}}</label>
	        </h-form-item>
	        <h-form-item label="营业期限终止日期："  prop='yyqxzz'>
	        	<label >{{companyInfo.yyqxzz}}</label>
	        </h-form-item>
	        <h-form-item label="登记机关："  prop='djjg'>
	        	<label >{{companyInfo.djjg}}</label>
	        </h-form-item>
	        <h-form-item label="组织机构批准单位："  prop='zzjgpzdw'>
	        	<label >{{companyInfo.zzjgpzdw}}</label>
	        </h-form-item>	       
	        <h-form-item label="上级机构："  prop='sjjgid'>
	        	<label >{{companyInfo.sjjgid}}</label>
	        </h-form-item>
	        <h-form-item label="注册地址："  prop='zcdz' cols='1'>
	        	<label >{{companyInfo.zcdz}}</label>
	        </h-form-item>
	        <h-form-item label="所在省份："  prop='szsf'>
	        	<label >{{companyInfo.szsf}}</label>
	        </h-form-item>
	          <h-form-item label="公司类型代码："  prop='gslx'>
	           <label >{{companyInfo.gslxdm}}-{{companyInfo.gslx}}</label>	          
	        </h-form-item>
	        <h-form-item label="经营范围：" prop='jyfw' cols="2">
	        	<label >{{companyInfo.jyfw}}</label>
	        </h-form-item>
		</h-form>
		<h-spin fix v-if="spinShow"></h-spin>
	</div>
</template>
<script  type="text/javascript">
export default {  
	data () {
		return{			
            companyInfo: {},
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
			let url = '/tm/chain/company/'+this.id;
			this.$http.get(url).then((res)=>{
				this.spinShow = false;					
				let tmpObj = res.data;
				if(tmpObj.status != this.$api.SUCCESS){
					this.companyInfo = {};						
					this.$hMessage.error(tmpObj.msg);
					return;
				}
				let tmpData = tmpObj.data ? tmpObj.data : {}; 
				this.companyInfo = tmpData;									
			}).catch(err=>{
				this.companyInfo = {};
				this.spinShow = false;	
				this.$hMessage.error("未知错误");
			})
		},

	},
	mounted(){
		this.queryDetail();
	}
}
</script>