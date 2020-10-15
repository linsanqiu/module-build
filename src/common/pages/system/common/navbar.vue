<template>
	<div class="tabber">
		<div class="list">
			<vue-scroll>
				<dl v-for="(menu,key) in navList" class="menu" :class="{'active': openNames.indexOf(menu.menuCode) != -1 }">
					<template v-if="menu.menuCode != 'Home' && menu.menuCode != 'Notice'">
						<template v-if="menu.type == 1">
							<dt @click="onDt(menu.menuCode)"><span><h-icon :name="menu.menuIcon" v-if="menu.menuIcon "></h-icon></span>{{ menu.title }}<i class="h-icon iconfont icon-unfold"></i></dt>
							<dd v-if="(menu.children && menu.children.length>0 && menu.type != 2)">
								<ul>
									<li v-for="minor in menu.children" @click="goPush(routers[minor.menuCode] ? routers[minor.menuCode].url : '')" :class=" routers[minor.menuCode] && activeMenuPath == routers[minor.menuCode].url ? 'active' : ''">{{ minor.title }}</li>
								</ul>
							</dd>
						</template>
						<template v-else-if="menu.type == 2">
							<dt @click="goPush(routers[menu.menuCode] ? routers[menu.menuCode].url : '')" :class="routers[menu.menuCode] && activeMenuPath == routers[menu.menuCode].url ? 'active' : ''">{{ menu.title }}</dt>
						</template>
					</template>
				</dl>
			</vue-scroll>
		</div>
	</div>
</template>
<script>
import store from '@/store';
import router from '@/router/router'
export default {
	props: {
		navList: Array,	
	},
	data () {
		return {
			openNames: [],
			activeMenuPath: '',
			/*navList: store.state.userMenu,*/
			routers: router,
			menuName: {},
		}
	},
	computed: {
		getActiveMenuPath(){
			return store.state.ActiveMenuPath;
		},
		getUserMenu(){
			return store.state.userMenu
		}
	},
	methods:{
		onDt(key){
			let index = this.openNames.indexOf(key);
			if(index == -1){
				this.openNames.push(key);
			}else{
				this.openNames.splice(index, 1);
			}
		},
		goPush(path){
			this.$router.push(path);
		},
		menuChange(ary){
			store.commit('SET_OPEN_MENU', ary)
		},
		openMeunu(){
			let activeMenuPath = store.state.ActiveMenuPath;
			let isBreak = false;
			const openMeunu = store.state.openMenu;
			if(openMeunu.length == 0){
				for(let i =0,len = this.navList.length; i < len; i++){
					let item = this.navList[i];
					if(item.children){
						for(let k = 0; k < item.children.length; k++){
							let url = router[item.children[k].menuCode] ? router[item.children[k].menuCode].url : '';
							if(activeMenuPath == url){
								this.openNames.push(item.menuCode)
								isBreak = true;
								break; //
							}
						}
					}
					if(isBreak){
						break;
					}
				}
			}else{
				this.openNames = openMeunu;
			}
			setTimeout(()=>{
				this.$set(this,'activeMenuPath',store.state.ActiveMenuPath)
			},10)
		}
	},
	mounted() {
		this.openMeunu()
	},
	watch: {
		getActiveMenuPath(path){
			this.activeMenuPath = path;
		},
		navList(data){
			this.openNames = [];
			this.navList = data;
			this.openMeunu();
		}
	}
}
</script>
<style type="text/css" scoped>
.tabber{
	height: 100%;
	background: #fff;
	overflow: hidden;
}
.tabber *{

}
.list{
	height: 100%;
	min-width: 200px;
}
.nav{
	width: 100%!important;
	color: #333;
}
.menu dt{
	height: 40px;
	line-height: 40px;
	padding: 0 20px;
	position: relative;
	cursor: pointer;
	font-size: 13px;
}
.menu.active{
	background: #f6f6f6;
}
.menu.active dt span i{
	color: #2E71F2;
}
.menu dt:hover,.menu li:hover{
	background: #f6f6f6;
}
.menu dt i{
	position: relative;
	top: 2px;
}
.menu dt span{
	display: inline-block;
	width: 25px;
}
.menu dd{
	transition: transform 0.2s ease-in-out;
	display: none;
}
.menu li{
	line-height: 35px;
	height: 35px;
	padding: 0 20px;
	cursor: pointer;
	color: #666;
	text-indent: 25px;
	font-size: 12px;
}
.menu .active,.menu .active:hover{
	color: #fff;
	background: #2E71F2;
}
.menu .icon-unfold{
	transition: transform 0.2s ease-in-out;
	position: absolute;
	right: 10px;
	top: 0;
}
.menu.active dd{
	display: block;
}
.menu.active .icon-unfold{
	transform:rotate(180deg);
	-webkit-transform:rotate(180deg);
	-moz-transform:rotate(180deg);
}
</style>