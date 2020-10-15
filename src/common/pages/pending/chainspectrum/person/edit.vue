<template>
	<div class="content-wrapper">
		<h-form ref="formInline" :rules="ruleInline" :model="personInfo" :label-width="100">
			<h-row>
                <h-col span="12">
	                <h-form-item label="姓名："  prop="xm">
	                    <h-input placeholder="请输入姓名" v-model.trim="personInfo.xm" ></h-input>
	                </h-form-item>
                </h-col>
                <h-col span="12">
	                <h-form-item label="性别："  prop="xb">
	                	<h-select v-model="personInfo.xb" placeholder="请选择性别">
			                <h-option value="" >请选择</h-option>
				        	<h-option v-for="item in genderInfo" :value="item.dm+''" :key="item.dm">{{ item.ms }}</h-option>
			            </h-select>
	                </h-form-item>
                </h-col>
            </h-row>

            <h-row>
                <h-col span="12">
	                <h-form-item label="国籍："  prop="gj">
	                	<h-select v-model="personInfo.gj" placeholder="请选择国籍">
			                <h-option value="" >请选择</h-option>
				        	<h-option v-for="item in nationalityInfo" :value="item.dm+''" :key="item.dm">{{ item.ms }}</h-option>
			            </h-select>
	                </h-form-item>
                </h-col>
                <h-col span="12">
	                <h-form-item label="民族："  prop="mz">
	                	<h-select v-model="personInfo.mz" placeholder="请选择民族">
			                <h-option value="" >请选择</h-option>
				        	<h-option v-for="item in nationInfo" :value="item.dm+''" :key="item.dm">{{ item.ms }}</h-option>
			            </h-select>
	                </h-form-item>
                </h-col>
            </h-row>

            <h-row>
                <h-col span="12">
	                <h-form-item label="出生日期："  prop="csrq">
	                	<h-date-picker showFormat type="date" format="yyyy-MM-dd" placeholder="请选择日期" v-model="personInfo.csrq"></h-date-picker>
	                </h-form-item>
                </h-col>
                <h-col span="12">
	                <h-form-item label="学历："  prop="xl">
	                	<h-select v-model="personInfo.xl" placeholder="请选择学历">
			                <h-option value="" >请选择</h-option>
				        	<h-option v-for="item in educationInfo" :value="item.dm+''" :key="item.dm">{{ item.ms }}</h-option>
			            </h-select>
	                </h-form-item>
                </h-col>
            </h-row>

            <h-row>
                <h-col span="12">
	                <h-form-item label="毕业院校："  prop="byyx">
	                	<h-input placeholder="请输入毕业院校" v-model.trim="personInfo.byyx" ></h-input>
	                </h-form-item>
                </h-col>
                <h-col span="12">
	                <h-form-item label="专业："  prop="zy">
	                	<h-input placeholder="请输入专业" v-model.trim="personInfo.zy" ></h-input>
	                </h-form-item>
                </h-col>
            </h-row>

            <h-row>
                <h-col span="12">
	                <h-form-item label="户籍住址："  prop="zz">
	                	<h-input placeholder="请输入户籍住址" v-model.trim="personInfo.zz" ></h-input>
	                </h-form-item>
                </h-col>
                <h-col span="12">
	                <h-form-item label="联系地址："  prop="lxdz">
	                	<h-input placeholder="请输入联系地址" v-model.trim="personInfo.lxdz" ></h-input>
	                </h-form-item>
                </h-col>
            </h-row>

            <h-row>
                <h-col span="12">
	                <h-form-item label="联系手机号："  prop="lxsjh" :validRules="mobileRule">
	                	<h-input placeholder="请输入联系手机号" v-model.trim="personInfo.lxsjh" ></h-input>
	                </h-form-item>
                </h-col>
                <h-col span="12">
	                <h-form-item label="联系电话："  prop="lxdh" :validRules="telRule">
	                	<h-input placeholder="请输入联系电话" v-model.trim="personInfo.lxdh" ></h-input>
	                </h-form-item>
                </h-col>
            </h-row>

            <h-row>
                <h-col span="12">
	                <h-form-item label="传真："  prop="cz" :validRules="faxRule">
	                	<h-input placeholder="请输入传真" v-model.trim="personInfo.cz" ></h-input>
	                </h-form-item>
                </h-col>
                <h-col span="12">
	                <h-form-item label="邮箱："  prop="yx" :validRules="mailRule">
	                	<h-input placeholder="请输入邮箱" v-model.trim="personInfo.yx" ></h-input>
	                </h-form-item>
                </h-col>
            </h-row>

            <h-row>
                <h-col span="12">
	                <h-form-item label="QQ："  prop="qq" :validRules="qqRule">
	                	<h-input placeholder="请输入QQ" v-model.trim="personInfo.qq" ></h-input>
	                </h-form-item>
                </h-col>
                <h-col span="12">
	                <h-form-item label="微信："  prop="wx" :validRules="wechatRule">
	                	<h-input placeholder="请输入微信" v-model.trim="personInfo.wx" ></h-input>
	                </h-form-item>
                </h-col>
            </h-row>

            <h-row>
                <h-col span="12">
	                <h-form-item label="背景资料："  prop="bjzl">
	                	<h-input v-model.trim="personInfo.bjzl" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入背景资料..."></h-input>
	                </h-form-item>
                </h-col>
                <h-col span="12">
	                
                </h-col>
            </h-row>
	        
            <h-form-item>
            	<h-row type="flex" justify="center">
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
                xm: [
                    { required: true, message: '请填写姓名', trigger: 'blur' },
                    { type: 'string', max: 120, message: '姓名不能多于120字', trigger: 'blur' }
                ],
                byyx: [
                    { type: 'string', max: 100, message: '毕业院校不能多于100字', trigger: 'blur' }
                ],
                zy: [
                    { type: 'string', max: 100, message: '专业不能多于100字', trigger: 'blur' }
                ],
                zz: [
                    { type: 'string', max: 200, message: '户籍住址不能多于200字', trigger: 'blur' }
                ],
                lxdz: [
                    { type: 'string', max: 200, message: '联系地址不能多于200字', trigger: 'blur' }
                ],
            },
            mobileRule: [{test:/^(1(3|4|5|7|8)\d{9})|(\(\d{3,4}\)|(\d{3,4}-|\s)?\d{7,14})$/, message:'联系手机号格式不正确',trigger:'blur'}],
            telRule: [{test:/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/, message:'电话格式不正确',trigger:'blur'}],
            faxRule: [{test:/^(\d{3,4}-)?\d{7,8}$/, message:'传真格式不正确',trigger:'blur'}],
            mailRule: ['email'],
            qqRule: ['qq'],
            wechatRule: [{test:/^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/, message:'微信号格式不正确',trigger:'blur'}],
            personInfo: {
            	"bjzl": '',
				"byyx": '',
				"csrq": '',
				"cz": '',
				"gj": '',
				"id": '',
				"lxdh": '',
				"lxdz": '',
				"lxsjh": '',
				"mz": '',
				"qq": '',
				"wx": '',
				"xb": '',
				"xl": '',
				"xm": '',
				"yx": '',
				"zy": '',
				"zz": '',
            },
            educationInfo: [],
            nationInfo: [],
            genderInfo: [],
            nationalityInfo: []
		}
	},
	components: { Ckeditor },
	methods:{
		getInfo() {
			if(!this.id) {
				this.spinShow = false
				return
			}
			let url = '/tm/chainpeople/querypeoplebyid?id=' + this.id
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					this.personInfo = tmpObj.data
					this.personInfo.xb = tmpObj.data.xb ? tmpObj.data.xb+'' : ''
					this.personInfo.mz = tmpObj.data.mz ? tmpObj.data.mz+'' : ''
					this.personInfo.xl = tmpObj.data.xl ? tmpObj.data.xl+'' : ''
					this.personInfo.gj = tmpObj.data.gj ? tmpObj.data.gj+'' : ''
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
			  "bjzl": this.personInfo.bjzl,
			  "byyx": this.personInfo.byyx,
			  "csrq": this.personInfo.csrq,
			  "cz": this.personInfo.cz,
			  "gj": this.personInfo.gj,
			  "id": this.id,
			  "lxdh": this.personInfo.lxdh,
			  "lxdz": this.personInfo.lxdz,
			  "lxsjh": this.personInfo.lxsjh,
			  "mz": this.personInfo.mz,
			  "qq": this.personInfo.qq,
			  "wx": this.personInfo.wx,
			  "xb": this.personInfo.xb,
			  "xl": this.personInfo.xl,
			  "xm": this.personInfo.xm,
			  "yx": this.personInfo.yx,
			  "zy": this.personInfo.zy,
			  "zz": this.personInfo.zz
			}
			let url = '/tm/chainpeople/save'
			this.$http.post(url, saveInfo).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					this.$hMessage.success('保存成功!')
				 	this.$store.commit('DEL_TAB', '//chainspectrum/person/edit')
				 	this.$router.push({path: '/chainspectrum/person'})
				}else {
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
				}
			}).catch(err=>{
				console.log(err)
				this.$hMessage.error('发生未知错误!')
        	})
		},
		getEducation() {
			let _this = this
			let url = '/tm/chainpeople/geteducation'
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					this.educationInfo = tmpObj.data
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
					this.genderInfo = tmpObj.data
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
					this.nationInfo = tmpObj.data
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
					this.nationalityInfo = tmpObj.data
				}
			}).catch(err=>{
				console.log(err)
				this.$hMessage.error('发生未知错误!')
        	})
		},
		init() {
			this.getEducation() 
			this.getGender()
			this.getNation()
			this.getNationality()
		}
	},
	mounted(){
		this.init()
		this.getInfo()
		if(this.$store.state.routersButton.ChainspectrumPerson){
			this.activeRoutersButton = this.$store.state.routersButton.ChainspectrumPerson
		}
	}
}
</script>
<style scoped>

</style>
