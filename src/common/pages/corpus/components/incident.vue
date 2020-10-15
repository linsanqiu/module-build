<template>
	<div class="incident">
		<p>事件列表</p>
		<div class="search-input">
			关键字：
			<h-input placeholder="请输入" v-model="keyword"></h-input>
		</div>
		<ul>
			<li v-for="(item,k) in EventList" @click="changeCode(item.value,item.label)" :key="k" :class="{ 'active' : eventCode == item.value }" v-if="item.label.indexOf(keyword) != -1">{{ item.label }}</li>
		</ul>
	</div>
</template>
<script type="text/javascript">
export default {
	props: {
		onEvent:Function,
	},
	data () {
		return {
			EventList: [],
			eventCode: '',
			keyword: '',
		}
	},
	methods: {
		changeCode(code, name){
			this.eventCode = code;
			if(this.onEvent){
				this.onEvent(code, name);
			}
		},
		getEventList(){
			let url = '/tm/corpus/common/eventList?containOldEvent=0';
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.EventList = oTmp.data || [];
				}else{
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				this.$hMessage.error('获取事件列表失败');
			})
		},
	},
	mounted() {
		this.getEventList();
	}
}
</script>
<style type="text/css" scoped>
.incident{
	height: 100%;
}
.incident p{
	height: 24px;
	line-height: 24px;
	padding: 0 10px;
	font-weight: 600;
	border-bottom: 1px dotted #dfdfdf;
}
.incident ul{
	height: calc(100% - 66px);
	overflow: auto;
}
.incident li{
	padding: 2px 15px;
	cursor: pointer;
}
.incident li:hover{
	background: rgb(46, 113, 242, .5);
	color: #fff;
}
.incident li.active{
	background: #2E71F2;
	color: #fff;
}
.search-input{
	padding: 6px 10px;
	height: 42px;
	border-bottom: 1px dotted #dfdfdf;
}
.search-input>>> .h-input-wrapper{
	width: calc(100% - 52px);
}
.search-input>>> .h-input-wrapper input{
	height: 28px;
}
.search-input>>> .h-btn{
	padding: 0;
	height: 28px;
	line-height: 28px;
	vertical-align: top;
	width: 40px;
}
</style>