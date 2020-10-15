<template>
	<div class="preview">
		<div class="list">
			<span class="title">模板名称：</span>
			<div class="content">{{ detail.templateName }}</div>
		</div>
		<div class="list">
			<span class="title">模板备注：</span>
			<div class="content">{{ detail.remark }}</div>
		</div>
		<div class="list">
			<span class="title">新闻标题：</span>
			<div class="content">{{ detail.title }}</div>
		</div>
		<div class="list">
			<span class="title">新闻摘要：</span>
			<div class="content">{{ detail.summary }}</div>
		</div>
		<div class="list">
			<span class="title">新闻正文：</span>
			<div class="content" v-html="detail.content"></div>
		</div>
		<div class="list">
			<span class="title">标签信息：</span>
			<div class="content">
				<!-- <p v-if="detail.eventTag && detail.eventTag.eventName">事件：{{ detail.eventTag.eventName }}({{ detail.eventTag.emotionDirectionName }}{{ detail.eventTag.emotionLevelName }})</p> -->
				<p v-if='desc'>事件：{{desc}}</p>
				<p v-if="detail.label && detail.label.childLabelList && detail.label.childLabelList.length > 0">标签：<span class="tab" v-for="(item, k) in detail.label.childLabelList">{{ item.value +'('+ item.categoryName +')' }}</span></p>
				<!-- <p v-if='subDesc'>标签：{{subDesc}}</p> -->
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		detail: {
			type: Object,
			default: ()=>{
				return {};
			}
		},
	},
	data(){
		return {
			desc: '',
		}
	},
	watch:{
		detail(){
			if (this.detail.label){
				let {emotionDirection={},emotionLevel={},eventType={}, childLabelList=[]} = this.detail.label
				if (eventType.name){
					this.desc = `${eventType.name || ''} (${emotionDirection.name || ''} ${emotionLevel.name || ''}) `
				}
			}
		},
	}
}
</script>
<style type="text/css" scoped>
.list{
	font-size: 0;
	margin-bottom: 10px;
}
.title{
	font-size: 12px;
	text-align: right;
	width: 80px;
	display: inline-block;
	vertical-align: top;
	padding: 10px 0;
}
.content{
	display: inline-block;
	vertical-align: top;
	font-size: 12px;
	padding: 10px;
	border: 1px solid #dfdfdf;
	background: #fff;
	width: calc(100% - 80px);
	border-radius: 4px;
	min-height: 40px;
}
.tab{
	display: inline-block;
	border-radius: 3px;
	padding: 2px 5px;
	background: #dfdfdf;
	margin-right: 5px;
}
</style>