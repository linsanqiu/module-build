<template>
	<section class="contents">
		<keep-alive :include="includedComponents">
			<router-view :key="$route.path" />
		</keep-alive>
	</section>
</template>
<script type="text/javascript">
import { pathName } from '@/filters'
export default {
	computed: {
		tabs() {
			return this.$store.state.tabList;
		},
		includedComponents: function() {
			var comps = ["Home"];
			let list = this.tabs;
			for (var i in list) {
				var name = pathName(list[i]);
				let str = name.substring(name.length-1, name.length)
				if(!/^\d+$/.test(str)){

				}else{
					name = name.substring(0, name.length-1)
				}
				if (!comps.includes(name)){
					comps.push(name);
				}
			}
			return comps;
		}
	},
	mounted() {	
	}
}
</script>