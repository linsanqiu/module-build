<template>
	<div :class="['comfn', data.code == 'ifelse' ? 'ifelsebox' : '']">
		<template v-if="data && data.children">
			<h-form :model="req" ref="topForm" label-position="right" :label-width="100" >
				<template v-for="(item, k) in data.children">
					<template v-for="(items, i) in item">
						<h-form-item :label="items.name + '：'" :style="data.fnType == 'function_2' ? 'width: '+ (100 /item.length) +'%; display: inline-block;vertical-align: top;' : ''" >
							<div class="front-btn">
								<i v-if="data.supportAdd == '1' &&  i == 0" class="iconfont icon-t-b-delete" title="删除一行" @click="delRow(k)"></i>
								<i v-if="data.supportSort == '1' &&  i == 0 && k != 0" class="iconfont icon-arrow-up-c" title="上移动一行" @click="upGo(k)"></i>
							</div>
							<template v-if="items.type == 'text'">
								<h-input type="text" disabled style="width: calc(100% - 50px)" v-model="items.value" ></h-input>
								<span class="btn" @click="view(data.key, k, i, items.value)"><i class="icon-view iconfont" title="查看"></i></span>
								<span class="btn" @click="addfn(data.key, k, i)"><i class="icon-t-b-message iconfont" title="修改"></i></span>
							</template>
							<template v-else-if="items.type == 'selection'">
								<h-select v-model="items.value" style="width: calc(100% - 50px)"  :clearable="false">
									<h-option  v-for="(t, l) in items.selectionList" :key="l" :value="t.value" >
										{{ t.name }}
									</h-option>
								</h-select>
							</template>
						</h-form-item>
					</template>
				</template>
			</h-form>
			<div v-if="data.supportAdd == '1'" class="ifelse"><span @click="add">新增条件</span></div>
		</template>
	</div>
</template>
<script>
import { copyDeep } from '@/filters/index'
export default {
	props: {
		data: Object,
		onMore: Function,
		viewfn: Function
	},
	data () {
		return {
			req:{},
			sum: this.data && this.data.children ? this.data.children.length : 0,
		}
	},
	computed: {
		
	},
	methods: {
		addfn(a, b, c){
			if(this.onMore){
				this.onMore(a, b, c)
			}
		},
		view(a, b, c, d){
			if(this.viewfn){
				this.viewfn(a,b,c,d)
			}
		},
		add(){
			if(this.data.children){
				let data = copyDeep(this.data.addParamList);
				if(this.data.indexAddType == 1){
					for(let i = 0, len = data.length; i < len; i++){
						for(let k = 0, lens = data[i].length; k < lens; k++){
							let index = ++this.sum;
							data[i][k].name = data[i][k].namePrefix + index.toString();
						}
					}
				}
				if (this.data.code == 'ifelse'){
					let len = this.data.children.length
					this.data.children.splice(len - 1, 0, ...data)
				}else{
					this.data.children = [...this.data.children,...data];
				}
			}
		},
		delRow(k){
			this.data.children.splice(k,1);
		},
		upGo(index){
			this.data.children[index] = this.data.children.splice(index-1, 1, this.data.children[index])[0];
		}
	}
}
</script>
<style type="text/css" scoped>
.comfn>>> .h-form-item-content{
	font-size: 0;
}
.btn{
	cursor: pointer;
	color: #298DFF;
	position: relative;
	display: inline-block;
	text-align: center;
	width: 25px;
	height: 32px;
	vertical-align: top;
}
.ifelse{
	text-align: right;
	color: #298DFF;
	cursor: pointer;
}
.ifelsebox{
	max-height: 250px;
	overflow: auto;
}
.front-btn{
	display: inline-block;
	position: absolute;
	left: -100px;
	top: 0;
	z-index: 1;
}
.icon-t-b-delete{
	color: #F5222D;
	cursor: pointer;
	margin-right: 5px;
}
.icon-arrow-up-c{
	cursor: pointer;
	color: #298DFF;
}
</style>