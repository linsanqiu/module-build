<template>
	<div>
		<template v-if="activeRoutersButton.length > 0">
			<Tabs v-model="activeTabsName">
				<TabPane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name" v-if="activeRoutersButton.indexOf(item.name) != -1">
					<template v-if="item.name == 'personal'">
						<personal></personal>
					</template>
					<template v-else-if="item.name == 'total'">
						<total></total>
					</template>
				</TabPane>
			</Tabs>
		</template>
	</div>
</template>
<script>
import total from './total';
import personal from './personal';
export default {
	name: 'ExamineStatistics',
	components: {total,personal},
	data () {
		return{
			activeRoutersButton: this.$store.state.activeRoutersButton,
			activeTabsName: '',
			tabs: [{
				name: 'total',
				label: '处理结果统计'
			},{
				name: 'personal',
				label: '处理人员统计'
			}]
		}
	},
	created(){
		console.log(this.activeRoutersButton)
		if(this.activeRoutersButton.indexOf('total') != -1){
			this.activeTabsName = 'total';
		}else{
			this.activeTabsName = 'personal';
		}
	}
}
</script>