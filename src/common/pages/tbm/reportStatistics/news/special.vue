<template>
	<div>
		<iframe src="/iframe/tbm/special" width="100%" :height="maxTableHeight+50" frameborder="0"></iframe>
	</div>
</template>

<script>	
    import {mapState} from "vuex";
	export default{
	 	data(){
	 		return{
	 			
	 		}
	 	},
	 	computed: {
			...mapState(['maxTableHeight'])
		},
	}
</script>

<style>
</style>