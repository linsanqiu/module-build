<template>
	<div class="table">
		<Transfer
			:data="getData"
			:target-keys="targetKeys1"
			:render-format="render1"
			@on-change="handleChange1"
			:titles="titles"></Transfer>
		<ul class="ul">
			<li>
				主题：
				<Select v-model="theme" style="width:100px" :clearable="false" @on-change="strFn">
			        <Option v-for="item in themeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
			    </Select>
			</li>
			<li>
				<Checkbox v-model="showIndex" @on-change="strFn">显示序号</Checkbox>
			</li>
		</ul>
	</div>
</template>
<script>
export default {
	props: {
		title: String,
		data: Object
	},
	data () {
		return {
			targetKeys1: this.data.active || [],
			titles: ['未显示字段','显示字段'],
			keyObj: {},
			showIndex:  this.data.showIndex,
			themeList:[{
				value: 1,
				label: '默认'
			},{
				value: 2,
				label: '商务蓝'
			},{
				value: 3,
				label: '炫酷黑'
			}],
			theme: this.data.theme || 1,
		}
	},
	computed: {
		getData(){
			let mockData = [];
			let children = this.data.children || [];
			for (let i = 0, len = children.length; i < len; i++) {
				let a = children[i];
				let key = a.realCode;
				a.key = key;
				this.keyObj[key] = a;
				mockData.push(a);
			}
			return mockData;
		}
	},
	methods: {
		getMockData () {
			let mockData = [];
			for (let i = 1; i <= 20; i++) {
				mockData.push({
					key: i.toString(),
					label: 'Content ' + i,
					description: 'The desc of content  ' + i,
					disabled: Math.random() * 3 < 1
				});
			}
			return mockData;
		},
		getTargetKeys () {
			return this.getMockData()
					.filter(() => Math.random() * 2 > 1)
					.map(item => item.key);
		},
		render1 (item) {
			return item.name;
		},
		handleChange1 (newTargetKeys, direction, moveKeys) {
			this.targetKeys1 = newTargetKeys;
			this.strFn();
		},
		strFn(){
			let newTargetKeys = this.targetKeys1;
			let len = newTargetKeys.length;
			let str = '';
			if(len > 0){
				str += '<@smarttable dataTemplateCode="' + this.data.realCode + '"';
				str += ' column="';
				for(let i =0; i < len; i++){
					str += this.keyObj[newTargetKeys[i]].realCode;
					if(i != len - 1){
						str += ','
					}
				}
				str += '"';
				if(this.showIndex){
					str += ' showIndex="true"';
				}
				str += ' theme="' + this.theme + '"';
				str += ' />';
			}
			this.data.fn = str;
		},
	}
}
</script>
<style type="text/css" scoped>
.table{
	
}
h2{
	line-height: 32px;
	font-size: 16px;
}
.ul{
	margin-top: 10px;
	display: flex;
}
.ul li{
	flex: 1;
	line-height: 32px;
}
</style>