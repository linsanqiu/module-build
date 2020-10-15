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
				comps.push(name);
			}
			return comps;
		}
	},
	mounted() {	
	}
}
</script>