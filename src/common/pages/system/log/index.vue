<template>
	<div class="log">
		<div>
			<Tabs type="card" @on-click="onTabs" v-model="activeTabsKey" >
				<TabPane v-for="(itme,k) in navList" :key="itme.menuCode" :name="itme.menuCode" :label="itme.title" v-if="itme.menuCode != 'DEFAULT'">
				</TabPane>
			</Tabs>
		</div>
		<div class="log-contents">
			<Timeline v-if="logContents[activeTabsKey]">
				<template v-for="(itme,k) in logContents[activeTabsKey]">
					<TimelineItem >
						<i class="iconfont icon-trophy" slot="dot" v-if="itme.trophy == 1"></i>
						<h2>{{ itme.versionName }}</h2>
						<p><code>{{ itme.issueDate }}</code></p>
						<ul class="log-contents-ul" v-if="itme.detail">
							<li v-for="(itmes,i) in itme.detail">
								<span :class="[{ '' : itmes.type == 1 },{ '' : itmes.type == 1 },{ '' : itmes.type == 1 }]">
								</span>
								<span>{{ itmes.content }}</span>
								<span class="jira" v-if="itmes.jira">#{{ itmes.jira }}</span>
							</li>
						</ul>
					</TimelineItem>
				</template>
			</Timeline>
		</div>
	</div>
</template>
<script type="text/javascript">
import store from '@/store';
export default {
	data () {
		return {
			activeTabsKey: '',
			navList: store.state.userMenu,
			logContents:{
				MGT:[
				{versionName: 'V1.4.2',
						issueDate: '2020-04-23',
						trophy:0,
						detail:[{
							type: 1, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3049',
							content: '新增资讯中台版本升级日志记录功能',
						},{
							type: 2, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3097',
							content: '修复专题导出功能异常问题',
						},{
							type: 2, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3073',
							content: '修复资讯主表公开后，点击下架，提示系统内部错误问题',
						},{
							type: 2, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3051',
							content: '修复锁定资讯点击下架，未提示锁定人的问题',
						},{
							type: 2, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3029',
							content: '修复专题资讯导出后，出现无法打开的问题',
						},{
							type: 3, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3068',
							content: '修复高亮词、替换词、敏感词、同义词、专题配置、专题资讯导出功能',
						},{
							type: 3, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3083',
							content: '优化处理页面标签操作，表头部分字段支持排序；字段顺序调整；支持列顺序拖动',
						},{
							type: 3, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3084',
							content: '优化处理页面标签操作，各个字段默认宽度调整，省略号显示不换行；涉及证券标签分类字段显示调整 （大于4个分类默认显示两个）',
						},{
							type: 3, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3058',
							content: '优化处理页面标签操作，弹框显示选中后匹配的标签，并弹框里的删除、标记、歧义等操作与页面标签实时同步，不需要显示确定和取消按钮',
						}]
				},{
						versionName: 'V1.4.1',
						issueDate: '2020-04-16',
						trophy:0,
						detail:[
						{
							type: 1, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-2987',
							content: '新增历史数据同步_历史资讯证券标签数保留100个',
						},{
							type: 1, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-2986',
							content: '新增快讯txt字段排版变更：规则：段首不空格，段间空一行',
						},{
							type: 1, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-2982',
							content: '新增历史资讯同步_过滤中台回写JYP的资讯',
						},{
							type: 1, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-2975',
							content: '新增历史数据同步_同步历史专题资讯概念板块信息',
						},{
							type: 1, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-2962',
							content: '新增hub新增标签位置信息功能',
						},{
							type: 1, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3007',
							content: '新增资讯中台功能优化需求-快讯表内容TXT长度限制',
						},{
							type: 2, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3048',
							content: '修复新建专题资讯时，在编辑页直接通过id，替换新建的专题资讯，提示缺少appid',
						},{
							type: 2, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3045',
							content: '修复302164083074正式环境漏标签',
						},{
							type: 2, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3028',
							content: '修复专题资讯查看页下一条，不要释放掉编辑资讯的锁',
						},{
							type: 2, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3027',
							content: '修复资讯列表查看下一条，会把原本编辑锁定的资讯的锁释放掉',
						},{
							type: 2, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3025',
							content: '修复测试环境资讯“1181478828287”中【海通证券】打标错误，存在A股，却打成了美股',
						},{
							type: 2, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3020',
							content: '修复测试环境，资讯“1181481718116”没有打标，点击一键打标按钮，打标正常',
						},{
							type: 2, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3010',
							content: '修复资讯查看页下一条去掉锁，查看没有必要加锁',
						},{
							type: 2, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3000',
							content: '修复生产环境资讯“3021638996065”“3021638996081”标题 内容一致，但是没有做去重判断',
						},{
							type: 2, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-2988',
							content: '修复去重系统当标题分词都为单个字时，出现全部过滤情况，导致查询缓存报错',
						},{
							type: 2, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-2609',
							content: '修复在资讯编辑页打开的情况下，从资讯列表点击，再进入资讯编辑页，会出现前端页面不刷新的情况，会造成打开的编辑页仍 然是原资讯内容（偶现）',
						},{
							type: 2, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-2475',
							content: '修复标题全部复制无法实现查询',
						},{
							type: 2, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-2467',
							content: '修复新建资讯，标题中手动增加空格，然后复制标题在列表中搜索不到该资讯记录',
						},{
							type: 2, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3029',
							content: '修复专题资讯导出后，出现无法打开的情况',
						},{
							type: 3, //1 新增 2修复(缺陷) 3 优化
							jira: ' SP-2980',
							content: '优化一键打标要求标题也需要高亮显示',
						},{
							type: 3, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3033',
							content: '优化处理中的资讯要求可以查看到处理人名字',
						},{
							type: 3, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3026',
							content: '优化资讯公开时含有歧义便签，则提示出具体触发提示的标签简称，每个标签用双引号引上，多个标签之间无须顿号或逗号分隔',
						},{
							type: 3, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3006',
							content: '一键打标三个字有空格的标签没有高亮显示',
						},{
							type: 3, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-3004',
							content: '优化A——4、标题or内容涉及证券含（奥赛康-300361）代码错,这个规则应该用证券代码来判断，不该用证券名称判断',
						},{
							type: 3, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-2964',
							content: '优化资讯公开后再次公开时取消标识主体，仍然是选中状态',
						},{
							type: 3, //1 新增 2修复(缺陷) 3 优化
							jira: 'SP-2786',
							content: '优化资讯公开进入下一条，编辑资讯后，切换tab，页面会刷新--需要重新优化',
						}]
					}
				],
				CORPUS:[
					{
						versionName: 'V1.0.1',
						issueDate: '2020-05-06',
						trophy:0,
						detail:[{
							type: 1, //1 新增 2修复(缺陷) 3 优化
							jira: '',
							content: '新增事件审核功能。',
						},{
							type: 1, //1 新增 2修复(缺陷) 3 优化
							jira: '',
							content: '事件列表新增列宽拖动功能与搜索功能。',
						},{
							type: 3, //1 新增 2修复(缺陷) 3 优化
							jira: '',
							content: '优化添加主体方式(去弹框)。',
						},{
							type: 3, //1 新增 2修复(缺陷) 3 优化
							jira: '',
							content: '优化上/下一条功能。编辑后未保存(未提交)点击上/下一条时提醒用户。',
						},{
							type: 3, //1 新增 2修复(缺陷) 3 优化
							jira: '',
							content: '优化导出功能，最大支持1000条数据。',
						}]
					},{
						versionName: 'V1.0.0',
						issueDate: '2020-04-22',
						trophy:0,
						detail:[{
							type: 1, //1 新增 2修复(缺陷) 3 优化
							jira: '',
							content: '新增导入素材功能，支持JYP资讯导入查询与本地上传',
						},{
							type: 1, //1 新增 2修复(缺陷) 3 优化
							jira: '',
							content: '新增事件标注功能',
						}]
					}
				]
			}
		}
	},
	methods:{
		onTabs(name){
			console.log(name)
		}
	},
	mounted() {
		if(this.navList.length > 0){
			this.activeTabsKey = this.navList[0].menuCode;
		}
	}
}
</script>
<style type="text/css" scoped>
.log{
	height: 100%;
}
.log-contents{
	height: calc(100% - 32px);
	border: 1px solid #dfdfdf;
	border-top: none;
	width: 100%;
	background: #fff;
	overflow-y: auto;
	overflow-x: hidden;
	padding: 15px 15px 0 15px;
}
.log>>> .h-tabs-bar{
	margin-bottom: 0;
}
.log-contents h2{
	color: #000;
	font-size: 14px;
	font-weight: 600;
}
.log-contents code{
	padding: .2em .4em;
		margin: 0;
		font-size: 85%;
		background-color: #fff5f5;
		border-radius: 3px;
		font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace;
		color: #fa795e;
}
.log-contents p{
	padding: 5px;
}
.log-contents-ul{
	padding-left: 22px;
}
.log-contents-ul li{
	list-style-type: circle;
	line-height: 22px;
	margin-bottom: 5px;
}
.icon-trophy{
	color: #19be6b;
	position: relative;
		left: -2px;
}
.jira{
	color: #2d8cf0;
}
</style>
