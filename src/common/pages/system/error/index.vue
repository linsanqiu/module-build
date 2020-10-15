<template>
	
</template>
<script type="text/javascript">
import router from '@/router/router'
import store from '@/store'
export default {
	created(){
		let lastPath = this.$route.params.pathMatch
		let urlExist = false;
		for(let item in router){
			if(router[item].url == lastPath){
				urlExist = true;
				break;
			}
		}
		if(urlExist){
			this.$router.replace('/403')
		}else{
			this.$router.replace('/404')
		}
	}
}
</script>