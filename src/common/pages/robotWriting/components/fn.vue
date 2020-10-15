<template>
	<div class="fn">
		<h-msgBox :title="copyData.title" v-model="showFn" @on-close="closeMsgBox" width="620" class-name="vertical-center-modal" :top="0" :mask-closable="false">
			<div class="contents">
				<template v-if="copyData && copyData.type == 'comfn'">
					<comfn :data="copyData" :onMore="onMore" :viewfn="viewfn"></comfn>
				</template>
				<template  v-else-if="copyData && copyData.type == 'table'">
					<tableFn :data="copyData"></tableFn>
				</template>
				<template v-else-if="copyData && copyData.type == 'chart'">
					<chart :data="copyData" ref="chart" :step="step"></chart>
				</template>
			</div>
			<div slot="footer">
				<h-button type="text" @click="closeMsgBox">取消</h-button>
				<template v-if="copyData && copyData.step">
						<h-button type="info" @click="last" v-if="step != 1">上一步</h-button>
						<h-button type="info" @click="next" >{{ step != copyData.maxStep ? '下一步' : '提交' }}</h-button>
				</template>
				<template v-else>
					<h-button type="info" @click="submitMsgBox" >提交</h-button>
				</template>
			</div>
		</h-msgBox>
	</div>
</template>
<script>
import tableFn from './table';
import comfn from './comfn';
import chart from './chart';
export default {
	name: '',
	components: { tableFn,comfn,chart },
	props: {
		cancel: Function,
		submit: Function,
		more: Function,
		onViewFn: Function,
		data: Object
	},
	data() {
		return {
			showFn: true,
			step: 1,
			copyData: this.data || {},
		}
	},
	methods: {
		last(){
			this.step -= 1;
		},
		next(){
			let next = this.$refs.chart.next;
			next().then((res) => {
				if(this.step == this.copyData.maxStep){
					this.copyData.chart = res;
					this.submitMsgBox();
				}else{
					this.copyData = { ...this.copyData, ...res};
					this.step += 1;
				}
			}).catch(err=>{

			});
		},
		onMore(a, b, c){
			if(this.more){
				this.more(a, b, c)
			}
		},
		viewfn( a,b,c,d){
			if(this.onViewFn){
				this.onViewFn(a, b, c, d)
			}
		},
		closeMsgBox(){
			this.showFn = false;
			if(this.cancel){
				this.cancel(this.copyData);
			}
		},
		submitMsgBox(){
			if(this.submit){
				this.submit(this.copyData);
			}
		}
	},
	created() {
		
	},
}
</script>
<style type="text/css" scoped>
</style>