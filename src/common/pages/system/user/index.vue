<template>
	<div>
		<ul>
			<li><span>账号：</span>{{ info.account }}</li>
			<li><span>姓名：</span>{{ info.name }}</li>
			<li><span>性别：</span>{{ info.sex == 1 ? '男' : '女' }}</li>
			<li><span>年龄：</span>{{ info.age }}</li>
			<li><span>手机号：</span>{{ info.mobilePhone }}</li>
			<li><span>邮箱：</span>{{ info.mail }}</li>
			<li><span>钉钉号：</span>{{ info.dingAccount }}</li>
		</ul>
	</div>
</template>
<script type="text/javascript">
import store from '@/store';
export default {
	name: 'User',
	data () {
		return {
			isShowUpdatePass: false,
			info: store.state.userInfo || {},
			activeRoutersButton: this.$store.state.activeRoutersButton,
		}
	},
	methods:{

	},	
	mounted() {
		
	}
}
</script>
<style type="text/css" scoped>
li{
	line-height: 36px;
}
span{
	display: inline-block;
	width: 80px;
	text-align: right;
}
a{
	color: #298DFF;
	cursor: pointer;
}
</style>