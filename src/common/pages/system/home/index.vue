<template>
	<div>
		<div class="home-btn">
			<Button type="primary" @click="onShowDraggableForm">选择桌面工具</Button>
		</div>
		<div class="home-draggable">
			<div class="home-half" v-for="(aryDrag, i) in aryDraggable">
				<draggable v-model="aryDraggable[i]" :options="dragOptions" @end="draggableEnd" @update="draggableUpdate">
					<transition-group name="no" class="list-group" tag="div">
						<div v-for="(item,k) in aryDraggable[i]" :key="item.id" class="draggable-list">
							<div :class="item.hide ? 'draggable-content draggable-hide' : 'draggable-content'">
								<div :class="isDisabledSortable ? 'draggable-header-c' : 'draggable-header-c draggable-header'">
									{{item.widgetName}}
									<div class="draggable-header-operation">
										<span :title="item.widgetDescription">
											<i class="sprites sprites-help" ></i>
										</span>
										<span @click="toggle(i,k)"  :title="item.hide ? '展开' : '收起'">
											<i v-if="item.hide" class="sprites sprites-down"></i>
											<i v-else class="sprites sprites-up" ></i>
										</span>
										<span title="刷新" @click="getWidgetData(i,k)">
											<i class="sprites sprites-shuaxin"></i>
										</span>
										<span title="退订" @click="onUnsubscribe(i,k)">
											<i class="sprites sprites-close" ></i>
										</span>
									</div>
								</div>
								<div class="draggable-body">
									<table class="draggable-tab" v-if="item.displayFileds">
										<thead>
											<tr>
												<th class="serial">
													NO.
												</th>
												<template v-for="( value, key, index) in item.displayFileds">
													<th ><span class="data" :title="key" >{{ key }}</span></th>
												</template>
											</tr>
										</thead>
										<tbody>
											<tr v-for="(dataList, index) in objWidgetDataList[item.objCode]">
												<td>
													{{ (item.nowpagenum * pagesize) + index +1 }}
												</td>
												<template v-for="( value, key, index) in item.displayFileds">
													<td ><span class="data" :title="dataList[value]" >{{ dataList[value] }}</span></td>
												</template>
											</tr>
										</tbody>
									</table>
								</div>
								<div class="draggable-footer">
									<div class="box">
										<simplePage :current="item.pagenum" :total="item.total" :other="{ 'index': i, 'key': k }" :size="pagesize" @page-change="pageChange"></simplePage>
									</div>
									<div class="box detail">
										<router-link :to="item.redirectUrl" v-if="item.redirectUrl">查看详情</router-link>
									</div>
								</div>
							</div>
							<Spin fix v-if="item.load">
								<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
								<div>加载中...</div>
							</Spin>
						</div>
					</transition-group>
				</draggable>
			</div>
		</div>
		<h-msgBox title="选择桌面工具" v-model="isDraggableForm" @on-close="onCloseDraggableForm" class-name="home-msgBox vertical-center-modal" :top="0" width="620" height="300">
			<div class="draggable-form">
				<template v-for="(item, k) in aryAllWidget">
					<div class="draggable-form-list">
						<div :title="item.widgetDescription">{{ item.widgetName }}</div>
						<div v-if="aryAddRss.indexOf(item.id) != -1 ">
							<span class="msg">已订阅</span><br>
						</div>
						<div v-else-if="aryDelRss.indexOf(item.id) != -1 ">
							<span class="msg">已退订</span><br>
						</div>
						<div v-else-if="aryRss.indexOf(item.id) != -1 ">
							<span class="msg">已订阅</span><br>
							<span class="btn" @click="onDelRss(item.id)">退订</span>
						</div>
						<div v-else>
							<span class="btn" @click="onAddRss(item.id)">订阅</span>
						</div>
					</div>
				</template>
				<Spin fix v-if="isDraggableFormLoad">
					<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
					<div>加载中...</div>
				</Spin>
			</div>
			<div slot="footer" class="draggable-form-footer">
				<h-button @click="onCloseDraggableForm">取消</h-button>
				<h-button type="primary" @click="onDraggableFormSubmit">确定</h-button>
			</div>
		</h-msgBox>
	</div>
</template>
<script type="text/javascript">
import draggable from 'vuedraggable'
import simplePage from '@/components/simple-page'
export default {
	name: 'Home',
	components: {
		draggable,
		simplePage
	},
	data(){
		return {
			isDisabledSortable: true,
			isSubscribeseq: false,
			isWidgetList: false,
			subscribeseq: '',
			aryDraggable: [],
			isDraggableFormLoad: false,
			isDraggableForm: false,
			isDelRss: false,
			aryRss:[],
			aryAddRss:[],
			aryDelRss:[],
			aryAllWidget: [],
			pagesize: 8,
			aryWidgetLeft:[],
			aryWidgetLeftDataList:[],
			aryWidgetRight:[],
			aryWidgetRightDataList:[],
			objWidgetDataList: {},
			activeRoutersButton: this.$store.state.activeRoutersButton,
		}
	},
	computed: {
		dragOptions() {
			return {
				animation: 0.5,
				group: "description",
				ghostClass: "ghost",
				handle: '.draggable-header',
				filter: '.draggable-header-operation span'
			};
		},
	},
	methods:{
		draggableEnd(){
			this.setSubscribeseq();
		},
		draggableUpdate(){
			this.setSubscribeseq();
		},
		onUnsubscribe( i, k){
			let data = this.aryDraggable[i][k];
			this.$hMsgBox.confirm({
				title: '温馨提示',
				content: '确定退订'+data.widgetName + '？',
				loading: true,
				onOk: () => {
					this.onDelRss(data.id, ()=>{
						this.aryDraggable[i].splice(k, 1);
						this.$hMsgBox.remove();
					});
				},
				onCancel: () => {
					
				}
			});
		},
		onAddRss(id){
			this.aryAddRss.push(id);
			let url = '/tm/widget/subscribe?id='+id;
			this.$http.post( url).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status != this.$api.SUCCESS){
					this.$hMessage.error('订阅失败，'+tmpObj.msg);
				}
			}).catch(err=>{
				
			})
		},
		onDelRss(id, cb = false){
			this.aryDelRss.push(id);
			let url = '/tm/widget/unsubscribe?id='+id;
			this.$http.post( url).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status != this.$api.SUCCESS){
					this.$hMessage.error('退订失败，'+tmpObj.msg);
					return
				}
				if(cb){
					cb()
					this.aryDelRss = [];
				}
				this.setSubscribeseq();
			}).catch(err=>{
				this.$hMessage.error('发生未知错误，退订失败！');
			})
		},
		onDraggableFormSubmit(){
			this.init();
			this.onCloseDraggableForm();
		},
		onShowDraggableForm(){
			this.isDraggableFormLoad = true;
			this.isDraggableForm = true;
			this.getNowUserWidgetList();
		},
		onCloseDraggableForm(){
			this.aryAddRss = [];
			this.aryDelRss = [];
			this.isDraggableFormLoad = false;
			this.isDraggableForm = false;
		},
		getNowUserWidgetList(){
			let url = '/tm/widget/subscribelist';
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					let list = tmpObj.data ? tmpObj.data : [];
					this.aryRss = [];
					for(let i = 0; i < list.length; i++){
						this.aryRss.push(list[i].id);
					}
					this.isDraggableFormLoad = false;
				}
			}).catch(err=>{
				this.isDraggableFormLoad = false;
			})
		},
		pageChange(current, other){
			let aryDraggable = [...this.aryDraggable];
			let source = aryDraggable[other.index];
			source[other.key].pagenum = current;
			this.aryDraggable = [...aryDraggable];
			this.getWidgetData( other.index, other.key);
		},
		toggle( index, key){
			let aryDraggable = [...this.aryDraggable];
			let source = aryDraggable[index];
			source[key].hide = !source[key].hide;
			this.aryDraggable = [...aryDraggable];
		},
		refresh( index, key){
			this.getWidgetData( index, key);
		},
		getUserWidgetList(){
			let url = '/tm/widget/subscribelist';
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					this.isWidgetList = true;
					let list = tmpObj.data ? tmpObj.data : [];
					for(let i = 0; i < list.length; i++){
						list[i].displayFileds = list[i].displayFileds ? JSON.parse(list[i].displayFileds) : '';
						list[i].fieldsMap = list[i].fieldsMap ? JSON.parse(list[i].fieldsMap) : {};
						list[i].pagesize = 0;
						list[i].pagenum = 1;
						list[i].nowpagenum = 0;
						list[i].objCode = 'WidgetDataList' + list[i].id;
						this.objWidgetDataList[list[i].objCode] = [];
					}
					this.aryChaosDraggable = list;
					this.widgetSort();
				}
			}).catch(err=>{
				//this.isGetList = false;
			})
		},
		getWidgetData( index, k){
			let aryDrag = [...this.aryDraggable];
			let source = aryDrag[index];
			source[k].load = true;
			this.aryDraggable = [...aryDrag];
			let pagesizeStr = source[k].fieldsMap.pagesize ? source[k].fieldsMap.pagesize : 'pagesize';
			let pagenumStr = source[k].fieldsMap.pagenum ? source[k].fieldsMap.pagenum : 'pagenum';
			let totalStr = source[k].fieldsMap.total ? source[k].fieldsMap.total : 'total';
			let listStr = source[k].fieldsMap.list ? source[k].fieldsMap.list : 'list';
			let method = source[k].fieldsMap.method ? source[k].fieldsMap.method : 'get'; 
			let param = source[k].fieldsMap.param ? '&'+source[k].fieldsMap.param : '';
			let dataModel = source[k].fieldsMap.data ? source[k].fieldsMap.data : 'data';
			let parameter = pagesizeStr +'='+ this.pagesize +'&'+ pagenumStr +'='+ source[k].pagenum +param;
			let url = source[k].dataApi;
			let postData = {};
			if(method == 'post' || method == 'POST' ){
				let atyParameter = parameter.split("&"); //字符分割
				for(let i =0; i < atyParameter.length; i++){
					let a = atyParameter[i].split("=");
					postData[a[0]] = a[1];
				}
			}else{
				url = url +'?' +parameter;
			}
			this.isDisabledSortable = true;
			this.$http[method](url,postData).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					let data = tmpObj[dataModel] ? tmpObj[dataModel] : {};
					let list = data[listStr] ? data[listStr] : [];
					source[k].load = false;
					source[k].total = data[totalStr] ? data[totalStr] : 0;
					source[k].nowpagenum = source[k].pagenum - 1;
					if(!source[k].displayFileds && list.length > 0){
						let obj = {};
						for(let k in list[0]){
							obj[k] = k;
						}
						source[k].displayFileds = obj;
					}
					let objWidgetDataList = {...this.objWidgetDataList};
					if(source[k].total && list.length == 0){
						source[k].pagenum = Math.ceil(source[k].total/this.pagesize);
						this.aryDraggable = [...aryDrag];
						this.getWidgetData(index, k);
						return;
					}
					objWidgetDataList[source[k].objCode] = list;
					this.objWidgetDataList = {...objWidgetDataList};
					this.aryDraggable = [...aryDrag];
					this.setSortable(aryDrag);
				}else{
					source[k].load = false;
					this.aryDraggable = [...aryDrag];
				}
			}).catch(err=>{
				source[k].load = false;
				this.aryDraggable = [...aryDrag];
			})
		},
		getAllWidget(){
			let url = '/tm/widget/widgetlist';
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					let list = tmpObj.data ? tmpObj.data : [];
					this.aryAllWidget = list;
				}
			}).catch(err=>{
				
			})
		},
		getSubscribeseq(){
			let url = '/tm/widget/subscribeseq';
			this.$http.get(url).then((res)=>{
				this.isSubscribeseq = true;
				let tmpObj = res.data;
				if(tmpObj.status == this.$api.SUCCESS){
					this.subscribeseq = tmpObj.data;
				}
				this.widgetSort();
			}).catch(err=>{
				this.isSubscribeseq = true;
				this.widgetSort();
			})
		},
		setSubscribeseq(){
			let data = this.aryDraggable;
			let ary = [];
			for(let k = 0; k < data.length; k++){
				ary[k] = [];
				for(let i = 0; i < data[k].length; i++){
					let id = data[k][i].id;
					if(this.aryDelRss.indexOf(id) == -1){
						ary[k].push(id);
					}
				}
			}
			let url = '/tm/widget/adjustseq?seq='+ encodeURIComponent(JSON.stringify(ary));
			this.$http.post(url).then((res)=>{
				
			}).catch(err=>{
				
			})
		},
		widgetSort(){
			if(this.isSubscribeseq && this.isWidgetList){
				if(this.subscribeseq){
					let subscribeseq = JSON.parse(this.subscribeseq);
					if(this.isArrayFn(subscribeseq)){
						let draggable = [...this.aryChaosDraggable];
						let obj = {};
						for( let i = 0; i < draggable.length; i++){
							obj[draggable[i].id] = draggable[i];
						}
						let aryList = [[],[]];
						for(let k = 0; k < subscribeseq.length; k++){
							aryList[k] = [];
							for(let i = 0; i < subscribeseq[k].length; i++){
								let  index = subscribeseq[k][i].toString();
								if(obj[index]){
									aryList[k].push(obj[index]);
									delete obj[index];
								}
							}
						}
						for(let k in obj){
							if(aryList[0] && this.isArrayFn(aryList[0])){
								aryList[0].push(obj[k]);
							}else{
								aryList[0] = [];
								aryList[0].push(obj[k]);
							}
						}
						this.aryDraggable = [...aryList];
					}else{
						this.aryDraggable = [[...this.aryChaosDraggable],[]];
					}
				}else{
					this.aryDraggable = [[...this.aryChaosDraggable],[]];
				}
				for(let k = 0; k < this.aryDraggable.length; k++){
					for(let i = 0; i < this.aryDraggable[k].length; i++){
						this.getWidgetData( k, i);
					}
				}
			}
		},
		setSortable(data){
			let disabled = false;
			for(let i = 0; i < this.aryDraggable.length ; i++){
				for(let k = 0; k < this.aryDraggable[i].length; k++){
					if(this.aryDraggable[i][k].load !== false){
						disabled = true;
					}
				}
			}
			this.isDisabledSortable = disabled;
		},
		isArrayFn(value){
			if (typeof Array.isArray === "function") {
				return Array.isArray(value);
			}else{
				return Object.prototype.toString.call(value) === "[object Array]";
			}
		},
		init(){
			this.getAllWidget();
			this.getUserWidgetList();
			this.getSubscribeseq();		
		}
	},
	mounted() {
		this.init();
	}
}
</script>
<style type="text/css" scoped>
.home-btn{
	margin-bottom: 10px;
}
.home-draggable{
	font-size: 0;
}
.home-half{
	width: calc(50% - 10px);
	margin-right: 10px;
	display: inline-block;
	vertical-align: top;
	min-height: 32px;
	font-size: 12px;
}
.home-half:nth-child(2n){
	margin-right: 0;
	margin-left: 10px;
}
.draggable-content{
	margin-bottom: 10px;
	border-radius: 4px;
	overflow: hidden;
}
</style>
<style type="text/css">
	.draggable-footer .h-page-disabled{
		background: none!important;
	}
	.draggable-footer .h-page a:hover{
		text-decoration: none!important;
	}
	.draggable-footer .h-page-simple-pager input{
		font-size: 12px;
	}
	.draggable-footer .h-page-simple{
		display: inline-block;
		margin-top: 2px;
		vertical-align: top;
	}
	.draggable-list .h-spin-fix{
		background: rgba( 0, 0, 0, .2);
	}
	.home-msgBox .h-modal-body{
		padding-top: 16px;
		position: relative;
	}
</style>