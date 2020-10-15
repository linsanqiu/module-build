<template>
	<div class="tabs">
		<div id="tab-right-menu" class="rightmenu" v-show="isRightMenu" :style="rightMenuStyle" @click.stop="function(){}">
			<template v-if="isCloseTab">
				<p @click="closeTabs()">关闭标签页</p>
			</template>
			<template v-else>
				<p class="disabled">关闭标签页</p>
			</template>
			<template v-if="isCloseLeftTab">
				<p @click="closeTabs('left')">关闭左侧标签页</p>
			</template>
			<template v-else>
				<p class="disabled">关闭左侧标签页</p>
			</template>

			<template v-if="isCloseRightTab">
				<p @click="closeTabs('right')">关闭右侧标签页</p>
			</template>
			<template v-else>
				<p class="disabled">关闭右侧标签页</p>
			</template>
			<template v-if="isCloseRestsTab">
				<p @click="closeTabs('rests')">关闭其他标签页</p>
			</template>
			<template v-else>
				<p class="disabled">关闭其他标签页</p>
			</template>
			<template v-if="isCloseAllTab">
				<p @click="closeTabs('all')">关闭全部标签页</p>
			</template>
			<template v-else>
				<p class="disabled">关闭全部标签页</p>
			</template>
		</div>
		<div class="menu_box">
			<div class="return">
				<i class="iconfont icon-return" @click="setOffset('left')" v-show="showRollIcon"></i>
			</div>
			<div class="tabs-list" ref="tabsList">
				<ul ref="tabsListUl" :style="navStyle" @mousemove="mousemovefn">
					<li :class="activeTabPath == '/home' ? 'active' : '' " @click="onHome" @contextmenu.prevent="contextmenu(-1)">
						<h-icon class="icon" name="homepage_fill"></h-icon>
						首页
					</li>
					<draggable v-model="tabList" :options="dragOptions" @end="draggableUpdate" @update="draggableUpdate">
						<transition-group name="no" class="list-group" tag="div">
								<li v-for="(data,key) in tabList" :class="encrypt(tabList[key]) ? 'active general' : 'general' " @contextmenu.prevent="contextmenu(key)" @click="changeTab(routersUrl[pathName(data)])"  :key="data" :keys="key">
									{{ routersObj[pathName(data)] }}<span @click.stop="closeTab(key)">
									<h-icon class="icon tab-close" name="android-close" ></h-icon>
									</span>
								</li>
						</transition-group>
					</draggable>
			</ul>
			</div>
			<div class="enter">
				<i class="iconfont icon-enter" @click="setOffset('right')" v-show="showRollIcon"></i>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
import draggable from 'vuedraggable'
import store from '@/store'
import { pathName } from '@/filters'
import md5 from 'js-md5'
import $ from 'jquery';
export default {
	data () {
		return {
			showRollIcon: false,
			isCloseTab: true,
			isCloseLeftTab: true,
			isCloseRightTab: true,
			isCloseRestsTab: true,
			isCloseAllTab: true,
			activeTabPath: store.state.ActiveTabPath,
			routersObj: store.state.routersObj,
			routersUrl: store.state.routersUrl,
			tabList: store.state.tabList,
			tabDelMsg: store.state.TabDelMsg,
			navStyle: {
				transform: ''
			},
			rightMenuStyle:{},
			isRightMenu: false,
			intRightMenuIndex: 0,
			popup: {
				x: 0,
				y: 0
			},
		}
	},
	components: {
		draggable
	},
	computed: {
		dragOptions() {
			return {
				animation: 0.5,
				group: "description",
				ghostClass: "ghost",
				handle: '.general',
				filter: '.general span'
			};
		},
		getRoutersObj(){
			return store.state.routersObj;
		},
		getRoutersUrl(){
			return store.state.routersUrl;
		},
		getActiveTabPath(){
			return store.state.ActiveTabPath;
		},
		getTabList(){
			return store.state.tabList;
		},
		getTabDelMsg(){
			return store.state.TabDelMsg;
		}
	},
	methods:{
		pathName:pathName,
		draggableUpdate(){
			store.commit('CHANGE_TAB_SORT', this.tabList);
		},
		mousemovefn(e){
			this.popup.x = e.clientX
			this.popup.y = e.clientY
		},
		tabsOnresize(){
			let ulwidth = this.$refs.tabsListUl && this.$refs.tabsListUl.offsetWidth ? this.$refs.tabsListUl.offsetWidth : 0;
			let width = this.$refs.tabsList && this.$refs.tabsList.offsetWidth ? this.$refs.tabsList.offsetWidth : 0;
			if(width < ulwidth){
				this.showRollIcon = true;
			}else{
				this.showRollIcon = false;
				this.navStyle.transform = 'translateX(-0px)';
			}
		},
		contextmenu(key){
			const popup = this.popup;
			this.rightMenuStyle ={
				top: (popup.y + 10) + 'px',
				left: (popup.x + 10) + 'px',
			}
			this.intRightMenuIndex = key;
			let len = this.tabList.length -1;
			if(len == -1){
				this.isCloseTab = false;
				this.isCloseLeftTab = false;
				this.isCloseRightTab = false;
				this.isCloseRestsTab = false;
				this.isCloseAllTab = false;
			}else{
				this.isCloseTab = true;
				this.isCloseLeftTab = true;
				this.isCloseRightTab = true;
				this.isCloseRestsTab = true;
				this.isCloseAllTab = true;
			}
			if(key == -1){
				this.isCloseTab = false;
				this.isCloseLeftTab = false;
				this.isCloseRightTab = false;
			}else if(key == 0){
				this.isCloseTab = true;
				this.isCloseLeftTab = false;
				if(key == len){
					this.isCloseRestsTab = false;
					this.isCloseRightTab = false;
					this.isCloseAllTab = false;
				}
			}else if(key == len){
				this.isCloseRightTab = false;
			}
			this.isRightMenu = true;
			$("body").bind("mousedown", this.onBodyMouseDown);
		},
		onBodyMouseDown(event){
			if (!(event.target.id == "tab-right-menu" || $(event.target).parents("#tab-right-menu").length>0)) {
				this.isRightMenu = false;
			}
		},
		closeTabs(type){
			let tabList = this.tabList;
			let url = this.intRightMenuIndex != -1 ? this.routersUrl[pathName(tabList[this.intRightMenuIndex])] : '';
			let activeTabPath = this.$md5(this.activeTabPath)
			let isPush = false;
			if( type == 'right'){
				for(let i = tabList.length - 1; i >= 0; i --){
					if(i > this.intRightMenuIndex){
						let url = tabList[i];
						let name = pathName(url);
						if( activeTabPath == this.$md5(url)){
							isPush = true;
						}
						this.changeStoreTab(url, name);
					}
				}
				if(isPush){
					this.changeTab(url);
				}
				setTimeout(()=>{
					this.setOffset();
				},100)
			}else if( type == 'left'){
				for(let i = tabList.length - 1; i >= 0; i --){
					if(i < this.intRightMenuIndex){
						let url = tabList[i];
						let name = pathName(url);
						if( activeTabPath == this.$md5(url)){
							isPush = true;
						}
						this.changeStoreTab(url, name);
					}
				}
				if(isPush){
					this.changeTab(url);
				}
				setTimeout(()=>{
					this.setOffset();
				},100)
			}else if( type == 'rests'){
				for(let i = tabList.length - 1; i >= 0; i --){
					if(i != this.intRightMenuIndex){
						let url = tabList[i];
						let name = pathName(url);
						if( activeTabPath == this.$md5(url)){
							isPush = true;
						}
						this.changeStoreTab(url, name);
					}
				}
				if(url){
					this.changeTab(url);
				}else{
					this.onHome();
				}
				this.navStyle.transform = 'translateX(-0px)';
			}else if( type == 'all'){
				for(let i = tabList.length - 1; i >= 0; i --){
					let url = tabList[i];
					let name = pathName(url);
					if( activeTabPath == this.$md5(url)){
						isPush = true;
					}
					this.changeStoreTab(url, name);
				}
				this.onHome();
				this.navStyle.transform = 'translateX(-0px)';
			}else{
				this.closeTab(this.intRightMenuIndex);
			}
			this.isRightMenu = false;
			$("body").unbind("mousedown", this.onBodyMouseDown);
		},
		changeStoreTab(url, name){
			store.commit('DEL_TAB', url);
			store.commit('SET_SCROLL_TOP', { name:name,val:0})
			this.closeMsg(url);
		},
		setOffset(name){
			let ulwidth = this.$refs.tabsListUl.offsetWidth;
			let width = this.$refs.tabsList.offsetWidth;
			let currentOffset = this.getCurrentScrollOffset();
			let newOffset = 0;
			if(name == 'left'){
				if (!currentOffset) return;
				newOffset = currentOffset > width
					? currentOffset - width
					: 0;
			}else if(name == 'right'){
				if (ulwidth - currentOffset <= width) return;
				newOffset = ulwidth - currentOffset > width * 2
					? currentOffset + width
					: (ulwidth - width);
			}else{
				if(ulwidth - currentOffset < 50 ){
					this.setOffset('left');
				}
				return
			}
			this.navStyle.transform = `translateX(-${newOffset}px)`;
			this.setOffset();
		},
		getCurrentScrollOffset() {
			const { navStyle } = this;
			return navStyle.transform
				? Number(navStyle.transform.match(/translateX\(-(\d+(\.\d+)*)px\)/)[1])
				: 0;
		},
		encrypt(val){
			if(md5(val) == md5(this.activeTabPath)){
				return true;
			}
			return false;
		},
		onHome(){
			this.$router.push('/home');
		},
		changeTab(path) {
			store.commit('MULTIPLE_ROUTE_CHANGE', true);
			this.$router.push({path: path});
		},
		closeMsg(url){
			let name = pathName(url);
			let msg = this.tabDelMsg[name];
			if(msg && msg.fn && typeof(msg.fn) == 'function'){
				msg.fn();
			}
			store.commit('SET_TAB_MSG', {url: url, show: false});
		},
		closeTab(key, isPush = true){
			let url = this.tabList[key];
			let name = pathName(url);
			let msg = this.tabDelMsg[name];
			if(msg && msg.show){
				let content = msg.msg || '确定关闭页面？';
				this.$hMsgBox.confirm({
					title:'温馨提示',
					content: content,
          okText: msg.okText || '确定',
          cancelText: msg.cancelText || '取消',
					onOk:()=>{
						if(this.isImg)return;
						this.isImg = true;
						this.closeMsg(url);
						this.setCloseTab(key, isPush = true);
						this.isImg = false;
					},
          onCancel: () => {
					  if (msg.cancelText === '关闭' && msg.isCloseUrl) {
              store.commit('SET_TAB_MSG', {url: url, show: false});
              this.setCloseTab(key, isPush = true);
            }
          }
				})
			}else if(msg && msg.release){
				this.closeMsg(url);
				this.setCloseTab(key, isPush = true);
			}else{
				this.setCloseTab(key, isPush = true);
			}
		},
		setCloseTab(key, isPush = true){
			let name = pathName(this.tabList[key]);
			store.commit('delTab', key);
			if(pathName(this.activeTabPath) == name && isPush === true ){
				let push = '';
				if(this.tabList[key]){
					push = this.routersUrl[pathName(this.tabList[key])];
				}else{
					if(this.tabList.length > 0){
						push =  this.routersUrl[pathName(this.tabList[this.tabList.length-1])];
					}
				}
				if(push){
					setTimeout(() => {
						store.commit('MULTIPLE_ROUTE_CHANGE', true);
						this.$router.push(push);
					}, 200);
				}else{
					this.onHome();
				}
			}
			if(name){
				store.commit('SET_SCROLL_TOP', { name:name,val:0})
			}
			setTimeout(()=>{
				this.setOffset();
			},100)
		},
	},
	watch: {
		getActiveTabPath(path){
			this.activeTabPath = path;
		},
		getTabList(list){
			this.tabList = list;
			setTimeout(()=>{
				this.tabsOnresize();
			},100)
		},
		getRoutersObj(val){
			this.routersObj = val;
		},
		getRoutersUrl(val){
			this.routersUrl = val;
		},
		getTabDelMsg(val){
			this.tabDelMsg = val;
		}
	},
	mounted() {
		let _this = this;
		window.addEventListener('resize',()=>{
			setTimeout(()=>{
				_this.tabsOnresize();
			},100)
		} ,false)
	}
}
</script>
<style type="text/css" scoped>
.tabs{
	background: #fff;
}
.menu_box{
	position: relative;
	padding: 0 22px;
	width: 100%;
	box-sizing: border-box;
	height: 32px;
}
.tabs-list{
	overflow: hidden;
}
.return,.enter{
	position: absolute;
	text-align: center;
	top: 0px;
	height: 32px;
	width: 22px;
	color: #a1a1a1;
	z-index: 99;
}
.return i,.enter i{
	position: relative;
	cursor: pointer;
	line-height: 32px;
}
.return i:hover,.enter i:hover{
	color: #333;
}
.return{
	left: 0;
}
.return:before{
	content: "";
	width: 1px;
	height: 100%;
	position: absolute;
	right: -1px;
	top: 0;
	background:  #dfdfdf;
}
.enter{
	right: 0;
}
.enter:before{
	content: "";
	width: 1px;
	height: 100%;
	position: absolute;
	left: -1px;
	top: 0;
	background:  #dfdfdf;
}
ul{
	transition: all .3s ease-in-out;
	white-space: nowrap;
	font-size: 0;
	float: left;
}
li{
	height: 33px;
	line-height: 32px;
	padding: 0 8px;
	cursor: pointer;
	border: 1px solid #dfdfdf;
	display: inline-block;
	font-size: 14px;
	color: #333;
}
ul > div{
	display: inline-block;
}
ul div li{
	margin-left: -1px;
}
.active,.active:hover{
	color: #2E71F2;
	background-color: #f7f7f7;
	border-bottom: 1px solid #f7f7f7;
	position: relative;
	/* //border-color: #298DFF; */
}
li:hover{
	color: #298DFF;
}
.tab-close{
	/*display: none;*/
}
li:hover .tab-close{
	display: inline-block;
}
.tab-close:hover{
	color:#ed3f14;
}
.icon{
	position: relative;
	top: 1px;
}
.rightmenu{
	position: absolute;
	padding: 5px 10px;
	line-height: 22px;
	z-index: 99;
	background-color: #fff;
	border-radius: 2px;
	border: 1px solid #dfdfdf;
	box-shadow: 1px 1px 2px #ccc;
}
.rightmenu p:hover{
	cursor: pointer;
	color:#298DFF;
}
.disabled,p.disabled:hover{
	color: #ccc;
	cursor: auto;
}
</style>
