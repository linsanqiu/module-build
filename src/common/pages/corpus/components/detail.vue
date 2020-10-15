<template>
	<div class="detail">
		<div class="btn">
			<h-button type="primary" @click="onNexts(1)">上一条</h-button>
			<h-button type="primary" @click="onNexts(0)">下一条</h-button>
			<h-button type="primary" @click="onSave(0)" v-if="btn.indexOf('save') != -1">保存</h-button>
			<h-button type="primary" @click="onSave(1)" v-if="btn.indexOf('submit') != -1">提交</h-button>
			<h-button type="primary" @click="onAudit()" v-if="btn.indexOf('audit') != -1">通过</h-button>
			<h-button type="primary" @click="onRollback()" v-if="btn.indexOf('retreat') != -1">回退</h-button>
		</div>
		<windowDrag leftW="50%" class="detail-drag">
			<div class="drag-content box-left-content" slot="left">
				<div>
					<p class="title">标题：</p>
					<div class="contents" v-html="title"></div>
				</div>
				<div class="detail-contents">
					<p class="title">内容：</p>
					<div class="contents" v-html="formattingHtml"></div>
				</div>
			</div>
			<div class="drag-content box-right-content" slot="right">
				<div>
					<p class="title">事件：</p>
					<div class="contents" v-html="eventName"></div>
				</div>
				<div>
					<p class="title">事件标注：</p>
					<div class="contents">
						<div class="title">标注：
							<RadioGroup v-model="tagFlag" >
								<Radio label="1" :disabled="view">
									<span>是</span>
								</Radio>
								<Radio label="0" :disabled="view">
									<span>否</span>
								</Radio>
							</RadioGroup>
						</div>
						<div class="title">类别备注：</div>
						<h-input type="textarea" :rows="6" :disabled="view" v-model="eventBasis"></h-input>
					</div>
				</div>
				<div>
					<p class="title">主体标注：</p>
					<div class="contents content-flex">
						<div class="flex">
							<div class="title">主体：<template v-if="!view"><h-input v-model.trim="addsubjectVos.name" placeholder="新增主体" @on-enter="add()" ></h-input><i title="添加主体" class="iconfont icon-addition" @click="add"></i></template></div>
							<ul>
								<li :class="{ 'active' : subjectVosIndex == k}" v-for="(item, k) in subjectVos" @click="onSubjectName(k)">
									<span :title="item.subject">{{ item.subject }}</span>
									<i title="移除" class="icon-delete iconfont" @click.stop="onDelete(k)" v-if="!view"></i>
								</li>
							</ul>
						</div>
						<div class="flex2">
							<div class="title">依据：</div>
							<h-input type="textarea" v-model="subjectVosContent" @on-change="changeTextarea" :rows="6" :disabled="subjectVos.length == 0 || view ? true : false" ></h-input>
						</div>
					</div>
				</div>
			</div>
		</windowDrag>
		<h-msgBox title="添加主体" v-model="isAdd" @on-close="onCloseMsgBox" class-name="vertical-center-modal" :top="0" width="500">
			<div>
				<h-form  :model="addsubjectVos" ref="subjectVos" label-position="right" :label-width="100" :rules="subjectVosRule" @submit.native.prevent >
					<h-form-item label="主体名称：" prop="name">
						<h-input v-model.trim="addsubjectVos.name" placeholder="主体名称"></h-input>
					</h-form-item>
				</h-form>
			</div>
			<div slot="footer">
				<h-button @click="onCloseMsgBox">取消</h-button>
				<h-button type="info" @click="onOk">提交</h-button>
			</div>
		</h-msgBox>
		<h-spin fix v-if="isLoading">
			<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
			<div>加载中...</div>
		</h-spin>
	</div>
</template>
<script type="text/javascript">
import windowDrag from '@/components/windowDrag';
import md5 from 'js-md5'
export default {
	components: { windowDrag },
	props: {
		value: {
			type: Object,
			default: ()=>{
				return {};
			}
		},
		btn: {
			type:Array,
			default: ()=>{
				return [];
			}
		},
		view:{
			type: Boolean,
			default: false,
		},
		onNext:Function
	},
	data () {
		return {
			eventCode: '',
			newsId: '',
			req:{},
			title: '',
			contentText: '',
			isLoading: false,
			eventBasis: '',
			tagFlag: '',
			subjectVos: [],
			eventName: '',
			subjectVosIndex: 0,
			addsubjectVos: {
				name: '',
			},
			subjectVosContent: '',
			isAdd: false,
			isLoading: false,
			subjectVosRule: {
				name: [{ required:true, message: '请输入', trigger:'blur'}]
			},
			eventTagProcessVo: {},
			md5: '',
		}
	},
	computed: {
		formattingHtml(){
			if(this.contentText){
				let str = this.contentText.replace(/\r\n/g,"<br>");
				str = str.replace(/\n/g,"<br>");
				return str;
			}else{
				return '';
			}
		},
	},
	methods: {
		onAudit(){
			if(this.isLoading)return;
			this.isLoading = true;
			let url = '/tm/corpus/eventtagprocess/batchAuditEventTagProcessVo';
			this.$http.post(url, { ids: this.newsId }).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.eventTagProcessVo.status = 2;
					this.$hMessage.success('审核成功');
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isLoading = false;
			}).catch(err=>{
				this.isLoading = false;
				this.$hMessage.error('网络错误，审核失败！');
			})
		},
		onRollback(){
			if(this.isLoading)return;
			this.isLoading = true;
			let url = '/tm/corpus/eventtagprocess/batchBackEventTagProcessVo';
			let obj = { ids: this.newsId }
			this.$http.post(url,obj).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.eventTagProcessVo.status = 3;
					this.$hMessage.success('回退成功！');
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isLoading = false;
			}).catch(err=>{
				this.isLoading = false;
				this.$hMessage.error('网络异常，回退失败');
			})
		},
		onDelete(k){
			this.subjectVos.splice(k,1);
			if(k != this.subjectVosIndex){
				this.subjectVosIndex -= 1;
			}else if(this.subjectVos.length > k ){
				this.onSubjectName(k)
			}else if(this.subjectVos.length == k && this.subjectVos.length == 0){
				this.subjectVosContent = '';
			}else{
				this.onSubjectName(k-1);
			}
		},
		onSubjectName(k){
			if(this.subjectVos.length == 0){
				this.subjectVosContent = '';
				return;
			};
			this.subjectVosIndex = k;
			this.subjectVosContent = this.subjectVos[k].subjectBasis === null ? '' : this.subjectVos[k].subjectBasis.toString();
		},
		changeTextarea(event){
			this.subjectVos[this.subjectVosIndex].subjectBasis = this.subjectVosContent.toString();
		},
		onOk(){
			this.$refs['subjectVos'].validate((valid) => {
				if (valid) {
					let obj = {
						subject: this.addsubjectVos.name,
						subjectBasis: '',
					}
					this.subjectVos.push(obj);
					this.subjectVosIndex = this.subjectVos.length - 1;
					this.subjectVosContent = '';
					this.onCloseMsgBox();
				}
			})
		},
		onCloseMsgBox(){
			this.addsubjectVos = {
				name: '',
			}
			this.isAdd = false;
			this.$refs['subjectVos'].resetFields();
		},
		add(){
			if(this.addsubjectVos.name){
				let obj = {
					subject: this.addsubjectVos.name,
					subjectBasis: '',
				}
				this.subjectVos.push(obj);
				this.subjectVosIndex = this.subjectVos.length - 1;
				this.subjectVosContent = '';
				this.addsubjectVos.name = '';
			}
		},
		onSave(type = 0){
			if(this.isLoading)return;
			this.isLoading = true;
			let arr =  [];
			let subjectVos = this.subjectVos;
			for(let i = 0, len = subjectVos.length; i < len; i++){
				arr.push({
					subject: subjectVos[i].subject,
					subjectBasis: subjectVos[i].subjectBasis
				})
			}
			let obj = {
				eventBasis: this.eventBasis,
				eventCode: this.eventCode,
				id: this.newsId,
				subjectVos: arr,
				tagFlag: this.tagFlag
			}
			let url = '/tm/corpus/eventtagprocess/saveEventTagProcessVo';
			let msg = '保存'
			if(type == 1){
				url = '/tm/corpus/eventtagprocess/updateEventTagProcessVo';
				msg = '提交'
			}
			this.$http.post(url,obj).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.$hMessage.success(msg +'成功！');
					this.md5 = this.getMd5();
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isLoading = false;
			}).catch(err=>{
				this.isLoading = false;
				this.$hMessage.error('网络异常，'+ msg +'失败');
			})

		},
		onNexts(type){
			if(this.onNext){
				let isChange = this.md5 == this.getMd5() ? false : true;
				let before = this.onNext(type, this.eventTagProcessVo.status, isChange);
				if (before && before.then) {
					before.then(Boo => {
						if (Boo !== false) {
							this.nextKeyQuery(type);
						}
					}, () => {
					  // this.$emit('cancel', file);
					});
				}else if(before !== false){
					this.nextKeyQuery(type);
				}
			}else{
				this.nextKeyQuery(type);
			}
		},
		nextKeyQuery(type){
			if(this.isLoading)return;
			this.isLoading = true;
			let url = '/tm/corpus/eventtagprocess/nextKeyQuery';
			this.$http.post(url,{
				id: this.newsId,
				nextFlag: type,...this.req
			}).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.subjectVosContent = '';
					this.changeData(oTmp);
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isLoading = false;
			}).catch(err=>{
				this.isLoading = false;
				if(type == 1){
					this.$hMessage.error('网络异常，获取上一条数据失败');
				}else{
					this.$hMessage.error('网络异常，获取下一条数据失败');
				}
			})
		},
		getNews(){
			if(this.isLoading)return;
			this.isLoading = true;
			let url = '/tm/corpus/eventtagprocess/getOneEventTagProcessVo?id='+ this.newsId;
			this.$http.post(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.changeData(oTmp);
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isLoading = false;
			}).catch(err=>{
				this.isLoading = false;
				this.$hMessage.error('网络异常，获取详情数据失败');
			})
		},
		getMd5(){
			let str = md5(JSON.stringify(this.subjectVos)) 
					+ md5(JSON.stringify(this.eventBasis))
					+ md5(JSON.stringify(this.tagFlag));
			return md5(str);
		},
		changeData(oTmp){
			let data = oTmp.data || {};
			let informationVo = data.informationVo || {};
			this.title = informationVo.newsTitle || '';
			this.contentText = informationVo.content || '';
			let eventTagProcessVo = data.eventTagProcessVo || {};
			this.eventTagProcessVo = eventTagProcessVo;
			this.eventBasis = eventTagProcessVo.eventBasis || '';
			this.tagFlag =  eventTagProcessVo.tagFlag === 0 || eventTagProcessVo.tagFlag === 1 ? eventTagProcessVo.tagFlag.toString() : '';
			this.subjectVos = data.subjectVos || [];
			this.onSubjectName(0);
			this.eventName = data.eventName || '';
			let obj = {newsId: eventTagProcessVo.id};
			let newObj = {...this.value,...obj};
			this.$emit('input', newObj);
			this.newsId = eventTagProcessVo.id;
			this.$router.push({ path: this.$route.path , query: { eventCode: this.eventCode,newsId: this.newsId }})
			this.md5 = this.getMd5();
		},
		init(){
			this.eventCode = this.value.eventCode || '';
			this.newsId = this.value.newsId || '';
			this.req = this.value.req || {};
			if(this.newsId){
				this.getNews();
			}
		},
	},
	watch:{
		'value.newsId': {
			handler(newData){
				if(newData == this.newsId)return;
				this.newsId = newData || '';
				if(this.newsId){
					this.getNews();
				}
			},
			deep: true
		},
		'value.eventCode': {
			handler(newData){
				this.eventCode = newData || '';
			},
			deep: true
		},
		'value.req': {
			handler(newData,b){
				this.req = newData || {};
			},
			deep: true
		},
	},
	mounted() {
		this.eventCode = this.value.eventCode || '';
		this.newsId = this.value.newsId || '';
		this.req = this.value.req || {};
		if(this.newsId){
			this.getNews();
		}
	},
}
</script>
<style type="text/css" scoped>
.detail{
	position: relative;
	height: 100%;
}
.detail .detail-drag{
	border: 1px solid #ccc;
	height: calc(100% - 42px);
	margin-top: 10px;
	background: #fff;
}
.detail .detail-drag>>> .left,.detail .detail-drag>>> .right{
	background: #fff;
}
.drag-content{
	padding: 0 10px 10px 10px;
	min-width: 350px;
	overflow: auto;
	height: 100%;
}
.box-left-content .detail-contents{
	height: calc(100% - 64px);
}
.box-left-content .detail-contents .contents{
	height: calc(100% - 32px);
	overflow: auto;
}

.btn{
	text-align: right;
}
.title{
	font-weight: 600;
	line-height: 32px;
}
.contents{
	padding: 5px;
	border: 1px solid #888;
	min-height: 32px;
}
.detail-drag>>> .hr{
	background: #fff;
}
.content-flex{
	display: flex;
}
.content-flex .flex{
	width: 275px;
	margin-right: 8px;
}
.content-flex .flex>>> .h-input-wrapper{
	width: 205px;
	margin-right: 5px;
	height: 28px;
	vertical-align: top;
}
.content-flex .flex>>> .h-input-wrapper .h-input{
	height: 26px;
	line-height: 26px;
}
.content-flex .flex ul{
	border: 1px solid #D7DDE4;
	background: #fff;
	height: 118px;
	overflow: auto;
}
.content-flex .flex ul li{
	padding: 5px;
	cursor: pointer;
	position: relative;
}
.content-flex .flex ul li:hover{
	color: #298DFF;
}
.content-flex .flex ul li.active{
	color: #fff;
	background: #298DFF;
}
.content-flex .flex2{
	width: calc(100% - 275px);
}
.content-flex .flex ul li span{
	display: block;
	width: 243px;
	line-height: 1;
	overflow: hidden;
	word-break: break-all;
}
.icon-addition,.icon-delete{
	cursor: pointer;
	display: inline-block;
	vertical-align: top;
	height: 20px;
}
.icon-delete{
	position: absolute;
	right: 3px;
	top: calc(50% - 11px);
}
.icon-delete:hover{
	color: red;
}
</style>