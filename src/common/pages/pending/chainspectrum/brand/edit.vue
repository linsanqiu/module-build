<template>
	<div class="content-wrapper">
		<h-form ref="formBrand" :rules="ruleBrand" :model="brandInfo" 
		:label-width="120" cols="2">			
			<h-form-item label="品牌名称" prop='ppmc'>
	            <h-input v-model.trim="brandInfo.ppmc" placeholder="请输入"></h-input>
	        </h-form-item>
	         <h-form-item label="图片链接"  prop='tplj'>
	            <h-input v-model.trim="brandInfo.tplj" placeholder="请输入"></h-input>
	        </h-form-item>			     
	        <h-form-item label="申请人名称"  prop='sqrmc'>
	            <h-input v-model.trim="brandInfo.sqrmc" placeholder="请输入"></h-input>
	        </h-form-item>
	        <h-form-item label="品牌标准名称"  prop='ppbzmc'>
	           <h-input v-model.trim="brandInfo.ppbzmc" placeholder="请输入" ></h-input>
	        </h-form-item>
	        <h-form-item label="申请注册号"  prop='sqzch'>
	            <h-input v-model.trim="brandInfo.sqzch" placeholder="请输入"></h-input>
	        </h-form-item>
	        <h-form-item label="国际分类"  prop='gjfl'>
	            <h-input v-model.trim="brandInfo.gjfl" placeholder="请输入"></h-input>
	        </h-form-item>
	        <h-form-item label="品牌中文名称"  prop='ppzwmc'>
	            <h-input v-model.trim="brandInfo.ppzwmc" placeholder="请输入"></h-input>
	        </h-form-item>
	        <h-form-item label="品牌英文名称"  prop='ppywmc'>
	            <h-input v-model.trim="brandInfo.ppywmc" placeholder="请输入"></h-input>
	        </h-form-item>
	        <h-form-item label="品牌英文简称"  prop='ppywjc'>
	            <h-input v-model.trim="brandInfo.ppywjc" placeholder="请输入"></h-input>
	        </h-form-item>
	        <h-form-item label="品牌年限(年)"  prop='ppnx'>
	            <h-input v-model.trim="brandInfo.ppnx" placeholder="请输入" ></h-input>
	        </h-form-item>
	        <h-form-item label="商标是否有效"  prop='sbsfyx'>
	            <h-select v-model="brandInfo.sbsfyx" placeholder="请选择">	              
	               <h-option v-for="item in brandstatusData" :value="item.dm" 
	                :key="item.dm">{{item.ms}}</h-option>
	            </h-select>
	        </h-form-item>
	        <h-form-item label="商标状态"  prop='sbzt'>
	           <h-input v-model.trim="brandInfo.sbzt" placeholder="请输入" ></h-input>
	        </h-form-item>
	        <h-form-item label="商标类型"  prop='sblx'>
	           <h-input v-model.trim="brandInfo.sblx" placeholder="请输入" ></h-input>
	        </h-form-item>
	        <h-form-item label="是否共有商标"  prop='sfgysb'>
	            <h-select v-model="brandInfo.sfgysb" placeholder="请选择">	              
	               <h-option v-for="item in brandshareData" :value="item.dm" 
	                :key="item.dm">{{item.ms}}</h-option>
	            </h-select>
	        </h-form-item>			        
	      
	        <h-form-item label="申请日期"  prop='sqrq'>
	            <h-date-picker v-model="brandInfo.sqrq" format="yyyy-MM-dd" type="date" placeholder="请选择日期"></h-date-picker>
	        </h-form-item>
	        <h-form-item label="注册公告日期"  prop='zcggrq'>
	             <h-date-picker v-model="brandInfo.zcggrq" format="yyyy-MM-dd" type="date" placeholder="请选择日期"></h-date-picker>
	        </h-form-item>
	        <h-form-item label="专用权起始日期"  prop='zyqqsrq'>
	             <h-date-picker v-model="brandInfo.zyqqsrq" format="yyyy-MM-dd" type="date" placeholder="请选择日期"></h-date-picker>
	        </h-form-item>
	        <h-form-item label="专用权截止日期" prop='zyqjzrq'>
	             <h-date-picker v-model="brandInfo.zyqjzrq" format="yyyy-MM-dd" type="date" placeholder="请选择日期"></h-date-picker>
	        </h-form-item>
	        <h-form-item label="注销日期"  prop='zxrq'>
	             <h-date-picker v-model="brandInfo.zxrq" format="yyyy-MM-dd" type="date" placeholder="请选择日期"></h-date-picker>
	        </h-form-item>
	         <h-form-item label="代理机构"  prop='dljg'>
	            <h-input v-model.trim="brandInfo.dljg" placeholder="请输入"></h-input>
	        </h-form-item>
	        <h-form-item label="申请人名称(英文)"  prop='sqrmcyw'>
	            <h-input v-model.trim="brandInfo.sqrmcyw" placeholder="请输入"></h-input>
	        </h-form-item>
	        <h-form-item label="申请人地址(中文)" prop='sqrdzzw'>
	            <h-input v-model.trim="brandInfo.sqrdzzw" placeholder="请输入"></h-input>
	        </h-form-item>
	        <h-form-item label="申请人地址(英文)"  prop='sqrdzyw'>
	            <h-input v-model.trim="brandInfo.sqrdzyw" placeholder="请输入"></h-input>
	        </h-form-item>
	        <h-form-item label="申请人备注" prop='sqrbz'>
	            <h-input v-model.trim="brandInfo.sqrbz" placeholder="请输入"></h-input>
	        </h-form-item>
	          <h-form-item label="商标使用详情"  prop='sbsyxq' cols="2">
	            <h-input v-model.trim="brandInfo.sbsyxq" placeholder="请输入"></h-input>
	        </h-form-item>
	        <h-form-item cols="2">
            	<h-row type="flex" justify="center">
            		<h-col span="3">
            			<h-button type="primary" long @click="save()" :loading="isSubmit" v-if="activeRoutersButton.indexOf('BrandSave') != -1">提交</h-button>
            		</h-col>
            	</h-row>	            
	        </h-form-item>
		</h-form>
		<h-spin fix v-if="spinShow"></h-spin>
	</div>
</template>
<script  type="text/javascript">
import { checkParseFloat } from '@/filters/index';
export default {  
	data () {
		var validatorPpnx = (rule, value, callback)=>{					
			if(value){
				if(!checkParseFloat(value,6,2)){
					callback('品牌年限最多6位整数，2位小数');
					return;
				}
			}			
			callback();
		};
		return{	
			activeRoutersButton:[],		
            brandInfo: {},
            spinShow:true,
            id: this.$route.query.id + '',
            brandshareData:[],
            brandstatusData:[],
            isSubmit:false,
            ruleBrand:{
					ppmc:[{required: true, message: '请填写品牌名称', trigger: 'blur' },
                    	  {type:'string', max: 300, message: '品牌名称最多300字', 
                    	  trigger: 'blur' }],                  
					tplj:[{type:'string',max:300,message:'图片链接最多300字',trigger:'blur'}],
					sqrmc:[{type:'string',max:300,message:'申请人名称最多300字',trigger:'blur'}],
					ppbzmc:[{type:'string',max:200,message:'品牌标准名称最多200字',trigger:'blur'}],
					sqzch:[{type:'string',max:100,message:'申请注册号最多100字',trigger:'blur'}],
					gjfl:[{type:'string',max:100,message:'国际分类最多100字',trigger:'blur'}],
					ppzwmc:[{type:'string',max:200,message:'品牌中文名称最多200字',trigger:'blur'}],
					ppywmc:[{type:'string',max:200,message:'品牌英文名称最多200字',trigger:'blur'}],
					ppywjc:[{type:'string',max:100,message:'品牌英文名称简称最多100字',trigger:'blur'}],
					ppnx:[{ validator: validatorPpnx,trigger: 'blur' }],
					sbzt:[{type:'string',max:200,message:'商标状态最多200字',trigger:'blur'}],
					sblx:[{type:'string',max:100,message:'商标类型最多100字',trigger:'blur'}],
					dljg:[{type:'string',max:300,message:'代理机构最多300字',trigger:'blur'}],
					sqrmcyw:[{type:'string',max:300,message:'申请人名称(英文)最多300字',trigger:'blur'}],
					sqrdzzw:[{type:'string',max:300,message:'申请人地址(中文)最多300字',trigger:'blur'}],
					sqrdzyw:[{type:'string',max:300,message:'申请人地址(英文)最多300字',trigger:'blur'}],
					sqrbz:[{type:'string',max:200,message:'申请人备注最多200字',trigger:'blur'}],
				},

           
		}
	},	
	methods:{
		queryDetail(){
			if(!this.id) {
				this.spinShow = false;
				this.brandInfo= {
				    "id": null,
				    "ppinbbm":null,
				    "gsqybh": null,
				    "sqrmc": null,
				    "ppmc": null,
				    "ppbzmc": null,
				    "sqzch": null,
				    "gjfl": null,
				    "ppzwmc": null,
				    "ppywmc": null,
				    "ppywjc": null,
				    "ppnx": null,
				    "sbzt": null,
				    "sblx": null,
				    "sfgysb": null,
				    "sbsyxq": null,
				    "sqrq": null,
				    "zcggrq": null,
				    "zyqqsrq": null,
				    "zyqjzrq": null,
				    "zxrq": null,
				    "dljg": null,
				    "sqrmcyw": null,
				    "sqrdzzw": null,
				    "sqrdzyw": null,
				    "sqrbz": null,
				    "tplj": null,
				    "xxfbrq": null,
				    "wjgs": null,
				    "hashcode": null,
				    "gkbz": null,
				    "xgry": null,
				    "xgry2": null,
				    "xgsj": null,
				    "fbsj": null,
				    "shry": null,
				    "jsid": null,
				    "sbsfyx": null,
				    "xxly": null,
				    "xxnr": null,
				    "brandShare": null,
				    "brandStatus": null
				  };
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
		save(){
			this.$refs['formBrand'].validate((valid) => {
				if(valid){						
					this.submit();
				}
			})

		},
		submit(){
			let savedata = {
			  "dljg": this.brandInfo.dljg,
			  "gjfl": this.brandInfo.gjfl,
			  "id": this.brandInfo.id,
			  "ppbzmc": this.brandInfo.ppbzmc,
			  "ppmc": this.brandInfo.ppmc,
			  "ppnx": this.brandInfo.ppnx,
			  "ppywjc": this.brandInfo.ppywjc,
			  "ppywmc": this.brandInfo.ppywmc,
			  "ppzwmc": this.brandInfo.ppzwmc,
			  "sblx": this.brandInfo.sblx,
			  "sbsfyx": this.brandInfo.sbsfyx,
			  "sbsyxq": this.brandInfo.sbsyxq,
			  "sbzt": this.brandInfo.sbzt,
			  "sfgysb": this.brandInfo.sfgysb,
			  "sqrbz": this.brandInfo.sqrbz,
			  "sqrdzyw": this.brandInfo.sqrdzyw,
			  "sqrdzzw": this.brandInfo.sqrdzzw,
			  "sqrmc": this.brandInfo.sqrmc,
			  "sqrmcyw": this.brandInfo.sqrmcyw,
			  "sqrq": this.formatDate(this.brandInfo.sqrq),
			  "sqzch": this.brandInfo.sqzch,
			  "tplj": this.brandInfo.tplj,
			  "zcggrq": this.formatDate(this.brandInfo.zcggrq),
			  "zxrq": this.formatDate(this.brandInfo.zxrq),
			  "zyqjzrq": this.formatDate(this.brandInfo.zyqjzrq),
			  "zyqqsrq": this.formatDate(this.brandInfo.zyqqsrq)
			};
			if(this.isSubmit) return;
			this.isSubmit = true;
			let url = '/tm/chainbrand/save';
			this.$http.post(url, savedata).then((res)=>{
				this.isSubmit = false;
				let tmpObj = res.data;
				if(tmpObj.status != this.$api.SUCCESS){
					this.$hMessage.error(tmpObj.msg);
					return;
				}
				this.$hMessage.success('保存成功!')			 
			 	this.$store.commit('DEL_TAB', '/chainspectrum/brand/edit')
				this.$router.push({path: '/chainspectrum/brand'})
			}).catch(err=>{
				this.isSubmit = false;
				this.$hMessage.error('未知错误')
			})
		},
		queryBrandshareDict(){
			let url = '/tm/chainbrand/getbrandshare';
			this.$http.get(url).then((res)=>{					
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					this.brandshareData=tmpObj.data;
				}
			}).catch(err=>{
				this.brandshareData=[];
			})
		},
		queryBrandstatusDict(){
			let url = '/tm/chainbrand/getbrandstatus';
			this.$http.get(url).then((res)=>{					
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					this.brandstatusData=tmpObj.data;
				}
			}).catch(err=>{
				this.brandstatusData=[];
			})
		},
		formatDate(dateStr){		
			if(!dateStr||dateStr==null) return null;
			let date = new Date(dateStr);
		    let seperator1 = "-";
		    let year = date.getFullYear();
		    let month = date.getMonth() + 1;
		    let strDate = date.getDate();
		    if (month >= 1 && month <= 9) {
		       month = "0" + month;
		    }
			if (strDate >= 0 && strDate <= 9) {
			   strDate = "0" + strDate;
			}
		    let formatdate = year + seperator1 + month + seperator1 + strDate;
			return formatdate;
		},


	},
	mounted(){
		this.queryDetail();
		this.queryBrandshareDict();
		this.queryBrandstatusDict();
		if(this.$store.state.routersButton.ChainspectrumBrand){
			this.activeRoutersButton = this.$store.state.routersButton.ChainspectrumBrand;
		}
	}
}
</script>