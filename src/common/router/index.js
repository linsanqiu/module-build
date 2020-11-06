import Vue from 'vue';
import Router from 'vue-router';
import $ from 'jquery';
import store from '@/store';
import types from '@/store/types';
import { pathName, getRequestQuery } from '@/filters';
import cookie from 'vue-cookie';
import md5 from 'js-md5';

import Main from '@frame/views/main.vue';
import AppMain from '@frame/views/frame/AppMain.vue';
import AppLayout from '@frame/views/frame/AppLayout.vue';
import { constantRouterMap } from '@frame/router';
Vue.use(Router);
// 页面外层路由
const wrapperRoute = [
    {
        path: '/',
        component: window.LOCAL_CONFIG.isSingle ? AppMain : AppLayout,
        redirect: '/main',
        children: [
            {
                path: '/main',
                name: '首页',
                component: Main
            }
        ]
    }
];
const router = new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap.concat(wrapperRoute)
});
router.beforeEach((to, from, next) => {
    store.commit('SET_LAST_PATH', from.path);
    if (to.meta && to.meta.needAuth === false) {
        next();
        return;
    }
    const token_id = cookie.get('JSESSIONID');
    let key = cookie.get('Key');
    let userInfo = store.state.userInfo;
    let userMenu = store.state.userMenu;
    const info = cookie.get('userInfo');
    const dueTime = cookie.get('time');
    const menu = cookie.get('userMenu');
    const localStorageMenu = localStorage.userMenu;
    if (!userInfo && info) {
        userInfo = JSON.parse(decodeURIComponent(info));
        store.commit('SET_USER_INFO', userInfo);
    }
    if (!userMenu && menu && localStorageMenu) {
        userMenu = JSON.parse(decodeURIComponent(localStorageMenu));
        store.commit('SET_USER_MENU', userMenu);
    }
    /* 校验cookie是否给串改 */
    if (key !== md5(info + 'key' + localStorageMenu) || menu !== md5(localStorageMenu)) {
        key = null;
    }
    if (!token_id || !key || !userInfo || !userMenu || !dueTime) {
        store.dispatch('logout');
        const url = encodeURIComponent(window.location.href);
        window.location.href = '/#/login?g=' + url;
        return;
    }
    const time = (new Date()).getTime();
    cookie.set('time', time, { expires: '8h' }, '/');
    const name = pathName(from.path);
    if (name) {
        store.commit('SET_SCROLL_TOP', { name: name, val: $('#scroll').scrollTop() });
    }
    const home = router.getMatchedComponents('/home');
    if (home.length === 0) {
        store.dispatch('getRoutesMenus', userMenu);
        router.addRoutes(store.state.routers);
        const t = { ...to };
        t.replace = true;
        next({ ...t });
        return;
    }
    /* 判断登录用户与缓存用户是否一致 */
    if (md5(encodeURIComponent(JSON.stringify(userInfo))) !== md5(info) ) {
        window.location.href = to.fullPath;
        return;
    }
    store.commit('SET_LOGIN_STATUS', true);
    const { meta, query } = to;
    const { multiple, maxLength, oUrl } = meta;
    if (multiple && maxLength > 1) {
        if (store.state.multipleRouteChange) {
            store.commit('MULTIPLE_ROUTE_CHANGE', false);
            next();
            return;
        }
        const tabList = store.state.tabList;
        // 判断是否有相同的页面
        for (let index = 0; index < maxLength; index++) {
            let _pathName = '';
            if (index === 0) {
                _pathName = `${pathName(to.path)}`;
            } else {
                _pathName = `${pathName(to.path)}${index}`;
            }
            const routeOp = store.state.routersUrl[_pathName];
            const queryDic = getRequestQuery(routeOp);
            if (JSON.stringify(queryDic) && JSON.stringify(queryDic) === JSON.stringify(to.query)) {
                store.commit('MULTIPLE_ROUTE_CHANGE', true);
                next({ path: routeOp });
                return;
            }
        }
        const filterTabList = tabList.filter((item) => {
            return item.indexOf(oUrl) !== -1;
        });
        let routeNum = filterTabList.length;
        if (routeNum >= maxLength) {
            next();
        } else {
            store.commit('MULTIPLE_ROUTE_CHANGE', true);
            const numList = [];
            for (const item of filterTabList) {
                const str = item.substring(item.length - 1, item.length);
                if (/^\d+$/.test(str)) {
                    numList.push(str);
                } else {
                    numList.push('0');
                }
            }
            for (let i = 0; i < maxLength; i++) {
                if (!numList.includes(`${i}`)) {
                    routeNum = i;
                    break;
                }
            }
            next({
                path: routeNum === 0 ? `${oUrl}` : `${oUrl}/${routeNum}`,
                query: query
            });
        }
        return;
    }
    store.commit('MULTIPLE_ROUTE_CHANGE', false);
    next();
});

// 捕获路由路径，设置左边默认选择的菜单项，按钮权限
router.afterEach(route => {
    store.commit(types.SET_ACTIVE_MENU_PATH, route);
    store.commit('SET_ACTIVE_ROUTERS_BUTTON', route.fullPath);
});
export default router;
