import Vue from 'vue'
import Router from 'vue-router'
import $ from 'jquery';
import store from '@/store';
import types from '@/store/types';
import { pathName, getRequestQuery } from '@/filters'
import cookie from 'vue-cookie'
import md5 from 'js-md5'
// import DASHBOARD from '@/pages/dashboard'
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

let router = new Router({
	mode: 'history',
	//base: '__dirname',
	routes: [
		{
			path: '/',
			redirect: '/home'
		},
		{
			path: '/login',
			name: 'login',
			meta: { needAuth: false},
			component: resolve => require(['@/pages/system/login/index'], resolve)
		},
		{
			path: '/404',
			name: 'error404',
			meta: { needAuth: false, record: false},
			component: resolve => require(['@/pages/system/error/404'], resolve)
		}
	],
	scrollBehavior(to, from, savedPosition) {
		let name = pathName(to.path);
		if(name){
			let scrollTop = store.state.scrollTop;
			if(scrollTop[name]){
				$("#scroll").scrollTop(scrollTop[name])
			}else{
				$("#scroll").scrollTop(0)
			}
		}
		store.commit(types.ADD_TAB, to)
	}
})

router.beforeEach((to, from, next) => {
	store.commit('SET_LAST_PATH', from.path);
	if(to.meta && to.meta['needAuth'] === false){
		next();
		return;
	}
	let token_id = cookie.get('JSESSIONID');
	let key = cookie.get('Key');
	let userInfo = store.state.userInfo;
	let userMenu = store.state.userMenu;
	let info = cookie.get('userInfo');
	let dueTime = cookie.get('time');
	let menu = cookie.get('userMenu');
	let localStorageMenu = localStorage.userMenu;
	if(!userInfo && info){
		userInfo =  JSON.parse(decodeURIComponent(info));
		store.commit('SET_USER_INFO', userInfo);
	}
	if(!userMenu && menu && localStorageMenu){
		userMenu =  JSON.parse(decodeURIComponent(localStorageMenu));
		store.commit('SET_USER_MENU', userMenu);
	}
	/*校验cookie是否给串改*/
	if(key !=  md5(info +'key'+ localStorageMenu) || menu != md5(localStorageMenu)){
		key = null;
	}
	if(!token_id || !key || !userInfo || !userMenu || !dueTime){
		store.dispatch("logout");
		let url = encodeURIComponent(window.location.href);
		window.location.href = '/login?g='+url;
		return;
	}
	let time = (new Date()).getTime();
	cookie.set("time",time,{ expires: '8h'},'/');
	let name = pathName(from.path);
	if(name){
		store.commit('SET_SCROLL_TOP', { name:name,val:$("#scroll").scrollTop()})
	}
	let home = router.getMatchedComponents("/home");
	if(home.length == 0){
		store.dispatch("getRoutesMenus",userMenu);
		router.addRoutes(store.state.routers);
		let t = {...to};
		t.replace = true
		next({ ...t });
		return;
	}
	/*判断登录用户与缓存用户是否一致*/
	if(md5(encodeURIComponent(JSON.stringify(userInfo))) != md5(info) ) {
		window.location.href = to.fullPath;
		return;
	}
	store.commit('SET_LOGIN_STATUS', true);
	let {meta, query} = to
	let {multiple, maxLength, oUrl} = meta
	if (multiple && maxLength > 1){
		if (store.state.multipleRouteChange){
			store.commit('MULTIPLE_ROUTE_CHANGE', false);
			next()
			return
		}
		let tabList = store.state.tabList
		// 判断是否有相同的页面
		for (let index = 0; index < maxLength; index++){
			let _pathName = ''
			if(index == 0){
				_pathName = `${pathName(to.path)}`
			}else{
				_pathName = `${pathName(to.path)}${index}`
			}
			let routeOp = store.state.routersUrl[_pathName]
			let queryDic = getRequestQuery(routeOp)
			if (JSON.stringify(queryDic) && JSON.stringify(queryDic) == JSON.stringify(to.query)){
				store.commit('MULTIPLE_ROUTE_CHANGE', true);
				next({path: routeOp})
				return
			}
		}
		let filterTabList = tabList.filter((item) => {
			return item.indexOf(oUrl) != -1
		})
		let routeNum = filterTabList.length
		if (routeNum >= maxLength){
			next();
		}else{
			store.commit('MULTIPLE_ROUTE_CHANGE', true);
			next({
				path: routeNum == 0? `${oUrl}`:`${oUrl}/${routeNum}`,
				query: query
			});
		}
		return
	}
	store.commit('MULTIPLE_ROUTE_CHANGE', false);
	next();
})

// 捕获路由路径，设置左边默认选择的菜单项，按钮权限
router.afterEach(route => {
  store.commit(types.SET_ACTIVE_MENU_PATH, route),
  store.commit('SET_ACTIVE_ROUTERS_BUTTON', route.fullPath)
})
export default router;
