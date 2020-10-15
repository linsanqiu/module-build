<template>
	<div class="content-wrapper">
		<h-form ref="formInfoBrand" :model="brandInfo" 
		:label-width="120" cols="2">					
			<h-form-item label="品牌名称：" prop='ppmc'>
	          	<label>{{brandInfo.ppmc}}</label>
	        </h-form-item>
	         <h-form-item label="图片链接："  prop='tplj'>
	           <label>{{brandInfo.tplj}}</label>
	        </h-form-item>			     
	        <h-form-item label="申请人名称："  prop='sqrmc'>
	            <label>{{brandInfo.sqrmc}}</label>
	        </h-form-item>
	        <h-form-item label="品牌标准名称："  prop='ppbzmc'>
	           <label>{{brandInfo.ppbzmc}}</label>
	        </h-form-item>
	        <h-form-item label="申请注册号："  prop='sqzch'>
	           <label>{{brandInfo.sqzch}}</label>
	        </h-form-item>
	        <h-form-item label="国际分类："  prop='gjfl'>
	            <label>{{brandInfo.gjfl}}</label>
	        </h-form-item>
	        <h-form-item label="品牌中文名称："  prop='ppzwmc'>
	           <label>{{brandInfo.ppzwmc}}</label>
	        </h-form-item>
	        <h-form-item label="品牌英文名称："  prop='ppywmc'>
	            <label>{{brandInfo.ppywmc}}</label>
	        </h-form-item>
	        <h-form-item label="品牌英文简称："  prop='ppywjc'>
	            <label>{{brandInfo.ppywjc}}</label>
	        </h-form-item>
	        <h-form-item label="品牌年限(年)："  prop='ppnx'>
	            <label>{{brandInfo.ppnx}}</label>
	        </h-form-item>
	        <h-form-item label="商标是否有效："  prop='sbsfyx'>
	            <label>{{brandInfo.brandStatus}}</label>
	        </h-form-item>
	        <h-form-item label="商标状态："  prop='sbzt'>
	           <label>{{brandInfo.sbzt}}</label>
	        </h-form-item>
	        <h-form-item label="商标类型："  prop='sblx'>
	           <label>{{brandInfo.sblx}}</label>
	        </h-form-item>
	        <h-form-item label="是否共有商标："  prop='sfgysb'>
	            <label>{{brandInfo.brandShare}}</label>
	        </h-form-item>			        
	       
	        <h-form-item label="申请日期："  prop='sqrq'>
	           <label>{{brandInfo.sqrq}}</label>
	        </h-form-item>
	        <h-form-item label="注册公告日期："  prop='zcggrq'>
	             <label>{{brandInfo.zcggrq}}</label>
	        </h-form-item>
	        <h-form-item label="专用权起始日期："  prop='zyqqsrq'>
	             <label>{{brandInfo.zyqqsrq}}</label>
	        </h-form-item>
	        <h-form-item label="专用权截止日期：" prop='zyqjzrq'>
	             <label>{{brandInfo.zyqjzrq}}</label>
	        </h-form-item>
	        <h-form-item label="注销日期："  prop='zxrq'>
	             <label>{{brandInfo.zxrq}}</label>
	        </h-form-item>
	         <h-form-item label="代理机构："  prop='dljg'>
	            <label>{{brandInfo.dljg}}</label>
	        </h-form-item>
	        <h-form-item label="申请人名称(英文)："  prop='sqrmcyw'>
	           <label>{{brandInfo.sqrmcyw}}</label>
	        </h-form-item>
	        <h-form-item label="申请人地址(中文)：" prop='sqrdzzw'>
	            <label>{{brandInfo.sqrdzzw}}</label>
	        </h-form-item>
	        <h-form-item label="申请人地址(英文)："  prop='sqrdzyw'>
	           <label>{{brandInfo.sqrdzyw}}</label>
	        </h-form-item>
	         <h-form-item label="申请人备注：" prop='sqrbz'>
	            <label>{{brandInfo.sqrbz}}</label>
	        </h-form-item>
	         <h-form-item label="商标使用详情："  prop='sbsyxq' cols="2">
	           <label>{{brandInfo.sbsyxq}}</label>
	        </h-form-item>	
	        <h-form-item cols="2">
	        	<h-row type="flex" justify="center" >
            		<h-col span="6">
            			<h-button type="primary" @click="onEdit" v-if="activeRoutersButton.indexOf('BrandEdit') != -1">编辑实体</h-button> 
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
            brandInfo: {},
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
			let url = '/tm/chainbrand/querybrandbyid?id='+this.id;
			this.$http.get(url).then((res)=>{
				this.spinShow = false;					
				let tmpObj = res.data;
				if(tmpObj.status != this.$api.SUCCESS){
					this.brandInfo = {};						
					this.$hMessage.error(tmpObj.msg);
					return;
				}
				let tmpData = tmpObj.data ? tmpObj.data : {}; 
				this.brandInfo = tmpData;									
			}).catch(err=>{
				this.brandInfo = {};
				this.spinShow = false;	
				this.$hMessage.error("未知错误");
			})
		},
		onEdit(){
			this.$router.push({path: '/chainspectrum/brand/edit', query: {id: this.id}});
		},	

	},
	mounted(){
		this.queryDetail();
		if(this.$store.state.routersButton.ChainspectrumBrand){
			this.activeRoutersButton = this.$store.state.routersButton.ChainspectrumBrand;
		}
	}
}
</script>