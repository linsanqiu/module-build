<template>
	<div class="content-wrapper">
		<h-form ref="formCompany" :rules="ruleCompany" :model="companyInfo" 
		:label-width="120" cols="2">					
			<h-form-item label="企业名称：" prop='qymc'>
	            <h-input v-model="companyInfo.qymc" placeholder="请输入"></h-input>
	        </h-form-item>
	        <h-form-item label="工商企业编号：" prop='gsqybh'>
	            <h-input v-model="companyInfo.gsqybh" placeholder="请输入" 
	            ></h-input>
	        </h-form-item>			        
	        <h-form-item label="英文名："  prop='ywm'>
	            <h-input v-model="companyInfo.ywm" placeholder="请输入" 
	            ></h-input>
	        </h-form-item>
	        <h-form-item label="公司类型："  prop='gslxdm'>
	           <h-select v-model="companyInfo.gslxdm" placeholder="请选择" 
	            >
	                <h-option value="">不限</h-option>
	                <h-option v-for="item in companytypeData" :value="item.code" 
	                :key="item.code">{{item.name}}</h-option>
	            </h-select>
	        </h-form-item>
	        <h-form-item label="注册号："  prop='zch'>
	            <h-input v-model="companyInfo.zch" placeholder="请输入" 
	           ></h-input>
	        </h-form-item>
	        <h-form-item label="组织机构代码："  prop='zzjgdm'>
	            <h-input v-model="companyInfo.zzjgdm" placeholder="请输入" 
	           ></h-input>
	        </h-form-item>
	        <h-form-item label="纳税人识别号："  prop='nsrsbh'>
	            <h-input v-model="companyInfo.nsrsbh" placeholder="请输入" 
	           ></h-input>
	        </h-form-item>
	        <h-form-item label="统一社会信用代码："  prop='tyshxydm'>
	            <h-input v-model="companyInfo.tyshxydm" placeholder="请输入" 
	           ></h-input>
	        </h-form-item>
	        <h-form-item label="法人类型："  prop='fddbrlx'>	
	            <h-select v-model="companyInfo.fddbrlx" placeholder="请选择" 
	           >
	                <h-option value="">不限</h-option>
	                <h-option v-for="item in cropData" :value="item.code" 
	                :key="item.code">{{item.name}}</h-option>		               
	            </h-select>
	        </h-form-item>
	        <h-form-item label="法人姓名："  prop='fddbrxm'>
	            <h-input v-model="companyInfo.fddbrxm" placeholder="请输入" 
	           ></h-input>
	        </h-form-item>
	        <h-form-item label="成立日期:"  prop='clrq'>
	        	<h-date-picker v-model="companyInfo.clrq" format="yyyy-MM-dd" type="date" placeholder="请选择日期"></h-date-picker>
	        </h-form-item>
	        <h-form-item label="企业状态："  prop='qyztbm'>
	           <h-select v-model="companyInfo.qyztbm" placeholder="请选择" 
	           >
	                <h-option value="">不限</h-option>
	                <h-option v-for="item in companystateData" :value="item.code" 
	                :key="item.code">{{item.name}}</h-option>
	            </h-select>
	        </h-form-item>
	        <h-form-item label="注册资金(万元)："  prop='zczj'>
	            <h-input v-model="companyInfo.zczj" placeholder="请输入" 
	           ></h-input>
	        </h-form-item>
	        <h-form-item label="币种："  prop='bz'>
	            <h-select v-model="companyInfo.bz" placeholder="请选择" 
	           >
	                <h-option value="">不限</h-option>
	                <h-option v-for="item in currencyData" :value="item.code" 
	                :key="item.code">{{item.name}}</h-option>	
	            </h-select>
	        </h-form-item>
	        <h-form-item label="营业期限开始日期："  prop='yyqxks'>
	           <h-date-picker v-model="companyInfo.yyqxks" format="yyyy-MM-dd" type="date" placeholder="请选择日期"></h-date-picker>
	        </h-form-item>
	        <h-form-item label="营业期限终止日期："  prop='yyqxzz'>
	            <h-date-picker v-model="companyInfo.yyqxzz" format="yyyy-MM-dd" type="date" placeholder="请选择日期"></h-date-picker>
	        </h-form-item>
	        <h-form-item label="登记机关："  prop='djjg'>
	            <h-input v-model="companyInfo.djjg" placeholder="请输入" 
	           ></h-input>
	        </h-form-item>
	        <h-form-item label="组织机构批准单位："  prop='zzjgpzdw'>
	            <h-input v-model="companyInfo.zzjgpzdw" placeholder="请输入" 
	           ></h-input>
	        </h-form-item>
	        <h-form-item label="经营范围：" prop='jyfw' cols="2">
	            <h-input v-model="companyInfo.jyfw" placeholder="请输入" 
	           ></h-input>
	        </h-form-item>
	        <h-form-item label="上级机构："  prop='sjjgid'>
	            <h-input v-model="companyInfo.sjjgid" placeholder="请输入" 
	           ></h-input>
	        </h-form-item>
	        <h-form-item label="注册地址："  prop='zcdz' cols='1'>
	        	 <h-input v-model="companyInfo.zcdz" placeholder="请输入" 
	           ></h-input> 
	        </h-form-item>
	        <h-form-item label="所在省份："  prop='szsf'>
	            <h-select v-model="companyInfo.szsf" placeholder="请选择" 
	           >
	                <h-option value="">不限</h-option>
	                <h-option v-for="item in provinceData" :value="item.code" 
	                :key="item.code">{{item.name}}</h-option>
	            </h-select>
	        </h-form-item>
		</h-form>
	</div>
</template>
<script  type="text/javascript">
export default {  
	data () {
		return{			
            companyInfo: {},
            id: this.$route.query.id + '',
            isSubmit:false,			
			ruleCompany:{					
				qymc:[{required: true, message: '请填写企业名称', trigger: 'blur' },
                	  {type: 'string', max: 255, message: '企业名称不能多于255字', 
                	  trigger: 'blur' }],
                gsqybh:[{required: true, message: '请填写工商企业编号', trigger: 'blur' },    {type: 'string', max: 255, message: '不能多于255字', 
                		trigger: 'blur' }],
				ywm:[{max:255,message:'最多255字符',trigger:'blur'}],
				zch:[{max:31,message:'注册号最多31字符',trigger:'blur'}],
				zzjgdm:[{max:31,message:'组织机构代码最多31字符',trigger:'blur'}],
				nsrsbh:[{max:255,message:'纳税人识别号最多255字符',trigger:'blur'}],
				tyshxydm:[{max:255,message:'统一社会信用代码最多255字符',trigger:'blur'}],
				fddbrxm:[{max:120,message:'法人姓名最多120字符',trigger:'blur'}],
				zczj:[{test:/^[1-9]\\{1,2\\}+(.[0-9]\\{0,6\\})?$/, message: '不能多于255字', trigger: 'blur' }],
				djjg:[{max:255,message:'登记机关最多255字符',trigger:'blur'}],
				zzjgpzdw:[{max:127,message:'组织机构批准单位最多127字符',trigger:'blur'}],

			},
           
		}
	},	
	methods:{
		queryDetail(){
			let url = '/tm/chain/company/'+this.id;
			this.$http.get(url).then((res)=>{					
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
				this.$hMessage.error("未知错误");
			})
		},
		save(){
			this.$refs['formCompany'].validate((valid) => {
				if(valid){						
					this.submit();
				}
			})

		},
		submit(){
			if(this.isSubmit) return;
			this.isSubmit = true;
			let savedata = {
			  "bz": this.companyInfo.bz,
			  "clrq": this.companyInfo.clrq,
			  "djjg": this.companyInfo.djjg,
			  "fddbrlx": this.companyInfo.fddbrlx,
			  "fddbrxm": this.companyInfo.fddbrxm,
			  "gslxdm": this.companyInfo.gslxdm,
			  "gsqybh": this.companyInfo.gsqybh,
			  "id": this.companyInfo.id,
			  "jyfw": this.companyInfo.jyfw,
			  "nsrsbh": this.companyInfo.nsrsbh,
			  "qymc": this.companyInfo.qymc,
			  "qyztbm": this.companyInfo.qyztbm,
			  "sjjgid": this.companyInfo.sjjgid,
			  "szsf": this.companyInfo.szsf,
			  "tyshxydm": this.companyInfo.tyshxydm,
			  "ywm": this.companyInfo.ywm,
			  "yyqxks": this.companyInfo.yyqxks,
			  "yyqxzz": this.companyInfo.yyqxzz,
			  "zcdz": this.companyInfo.zcdz,
			  "zch": this.companyInfo.zch,
			  "zczj": this.companyInfo.zczj,
			  "zzjgdm": this.companyInfo.zzjgdm,
			  "zzjgpzdw": this.companyInfo.zzjgpzdw
			};
			let url = '/tm/chain/company/save';
			this.$http.post(url, savedata).then((res)=>{
				this.isSubmit = false;
				let tmpObj = res.data;
				if(tmpObj.status != this.$api.SUCCESS){
					this.$hMessage.error(tmpObj.msg);
					return;
				}
				this.$hMessage.success('保存成功!')			 
			 	this.$store.commit('DEL_TAB', '/chainspectrum/company/edit')
				this.$router.push({path: '/chainspectrum/company'})
			}).catch(err=>{
				this.isSubmit = false;
				this.$hMessage.error('未知错误')
			})
		
		},


	},
	mounted(){
		this.queryDetail();
	}
}
</script>