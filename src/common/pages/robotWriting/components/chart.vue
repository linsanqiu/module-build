<template>
	<div>
		<template v-if="data.chartType == 'pie'">
			<chartPieBasic ref="pie" :data="data"></chartPieBasic>
		</template>
		<template v-else-if="step == 1">
			<chartBasic ref="stepOne" :data="data"></chartBasic>
		</template>
		<template v-else-if="step == 2">
			<chartAxis ref="stepTwo" :data="data"></chartAxis>
		</template>
		<template v-else-if="step == 3">
			<chartLineType ref="stepThree" :data="data"></chartLineType>
		</template>
	</div>
</template>
<script>
import chartBasic from './chartBasic';
import chartPieBasic from './chartPieBasic';
import chartAxis from './chartAxis';
import chartLineType from './chartLineType';
export default {
	components: { chartBasic,chartPieBasic,chartAxis,chartLineType },
	props: {
		data: Object,
		step: Number,
	},
	data() {
		return {
			stepCount:{
				1: 'stepOne',
				2: 'stepTwo',
				3: 'stepThree'
			}
		}
	},
	methods: {
		next(){
			if(this.data.chartType == 'pie'){
				return this.$refs.pie.verify();
			}else{
				return this.$refs[this.stepCount[this.step]].verify();
			}
			
			//return true;
		},
	},
	mounted() {
		
	}
}
</script>