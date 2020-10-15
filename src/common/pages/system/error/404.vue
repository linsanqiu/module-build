<template>
	<div class="error404">
		<span>4</span>
		<span>0</span>
		<span>4</span>
		<div>您访问的页面不存在！<a href="javascript:;" @click="goBack">返回上一页</a></div>
	</div>
</template>
<script>
export default {
	methods: {
		goBack(){
			window.history.back()
		}
	}
}
</script>
<style type="text/css" scoped>
	.error404{
		text-align: center;
		height: 100vh;
		margin-top: 40vh;
	}
	.error404 span{
		display: inline-block;
		width: 60px;
		height: 60px;
		background-color: #3f51b5;
		color: #fff;
		font-size: 42px;
		line-height: 60px;
		box-shadow: 1px 2px 3px #000;
		margin: 0 5px;
		border-radius: 5px;
	}
	.error404 div{
		font-size: 18px;
		line-height: 36px;
	}
	.error404 span { animation-name: animation1; }
	.error404 span {
		animation-duration: 1s;
		animation-fill-mode: both;
		animation-iteration-count: infinite;
	}
	.error404 > span:nth-child(1) { animation-delay: 0.0s }
	.error404 > span:nth-child(2) { animation-delay: 0.1s }
	.error404 > span:nth-child(3) { animation-delay: 0.2s }
	@keyframes animation1 {
		to {
			transform: scale3d(1, 1, 1);
		}
		from, 20%, 53%, 80%, to {
			animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
			transform: translate3d(0,0.5,0.1);
		}
		40%, 43% {
			animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
			transform: translate3d(0px, -20px, 0);
		}
	}
</style>