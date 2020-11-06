import types from './types';
import DASHBOARD from '@/pages/dashboard';
import { pathName } from '@/filters';
import cookie from 'vue-cookie';
import routers from '@/router/router';
import http from '@/http';
import api from '@/constant/api.js';
const actions = {
	getRoutesMenus({
		commit,
		st
	}, data) {
		return new Promise(resolve => {
			const accessedRouters = filterRouterByMenus([], data);
			const commonRouters = [{
					path: '/error',
					name: 'error',
					meta: { needAuth: false, record: false },
					component: resolve => require(['@/pages/system/error/index'], resolve)
				}, {
					path: '/403',
					name: '403',
					meta: { needAuth: true, record: false },
					component: resolve => require(['@/pages/system/error/403'], resolve)
				}, {
					path: '/log',
					name: 'log',
					meta: { needAuth: true, record: false },
					component: resolve => require(['@/pages/system/log/index'], resolve)
				}];
			const allRouter = commonRouters.concat(accessedRouters);
			const route = [
				{
					path: '/dashboard',
					name: 'dashboard',
					component: DASHBOARD,
					children: allRouter
				},
				{ path: '*', redirect: { name: 'error' }, meta: { needAuth: false, record: false } }
			];
			for (let i = 0; i < allRouter.length; i++) {
				const urlName = pathName(allRouter[i].path);
				if (allRouter[i].meta.button && allRouter[i].meta.button.length > 0) { // 按钮权限
					const button = allRouter[i].meta.button;
					for (let k = 0; k < button.length; k++ ) {
						commit('SET_ROUTERS_BUTTON', { name: urlName, val: button[k].mark }); // 保存按钮权限
					}
				}
				if (allRouter[i].meta.record !== false) {
					commit('SET_ROUTERS_OBJ', { name: urlName, val: allRouter[i].title });// 保存路由路径对应的名称，提供topTab使用
				}
			}
			commit('SET_ROUTERS', route);// 保存路由
			resolve();
		});
	},
	logout({
		commit,
		st
	}) {
		http.get('/tm/logout').then((res) => {
			// cookie.delete('JSESSIONID');
		});
		cookie.delete('Key');
		cookie.delete('userInfo');
		cookie.delete('userMenu');
		cookie.delete('time');
		localStorage.removeItem('userMenu');
		commit('SET_LOGIN_STATUS', false);
		commit('INIT_VUEX');
	},
    getAppList({ commit }, list) {
		http.get('/tm/tbmDictList?dictCode=' + 1011).then((res) => {
			const data = res.data;
			if (data.status === api.SUCCESS) {
				sessionStorage.setItem(list, JSON.stringify(data.body.tbmDictList));
				commit('GET_APPLIST', data.body.tbmDictList);
			}
		});
    },
    // getSourceList({commit}){
	// 	http.get('/tm/business/tbmDictList?dictCode=' + 2195).then((res) => {
	// 		let data = res.data;
	// 		if (data.status == api.SUCCESS) {
	// 			let listArr = data.body.tbmDictList;
    //     		const newlist = listArr.map(item => {
	// 	            return {
	// 	                value: item.dictEntry,
	// 	                label: item.entryName
	// 	            };
	// 	        });
	// 		    commit('GET_SOURCELIST', newlist);
	// 		}
	// 	});
	// },
	getSourceList({ commit }) {
		const body = {
			current: 1,
			size: 9999,
			dicValue: '',
			dicKey: ''
		};
		http.post('/tm/business/getDictPage', body).then((res) => {
			const data = res.data;
			if (data.status === api.SUCCESS) {
				const listArr = data.body.resPonsePage.records;
				const newlist = listArr.map(item => {
					return {
						label: item.entryName.toString(),
						value: item.dictEntry.toString()
					};
				});
				commit('GET_SOURCELIST', newlist);
				commit('ALL_SOURCE_LIST', newlist);
			}
		});
	},
    getNewsOpenFlags({ commit }, list) {
		http.get('/tm/tbmDictList?dictCode=' + 1101).then((res) => {
			const data = res.data;
			if (data.status === api.SUCCESS) {
				sessionStorage.setItem(list, JSON.stringify(data.body.tbmDictList));
				commit('GET_NEWSOPENFLAGS', data.body.tbmDictList);
			}
		});
	},

    getProcessingStates({ commit }, list) {
		http.get('/tm/tbmDictList?dictCode=' + 1100).then((res) => {
			const data = res.data;
			if (data.status == api.SUCCESS) {
				sessionStorage.setItem(list, JSON.stringify(data.body.tbmDictList));
				commit('GET_PROCESSINGSTATES', data.body.tbmDictList);
			}
		});
    },
    getInfoLevelList({ commit }, list) {
		http.get('/tm/tbmDictList?dictCode=' + 1113).then((res) => {
			const data = res.data;
			if (data.status == api.SUCCESS) {
				sessionStorage.setItem(list, JSON.stringify(data.body.tbmDictList));
				commit('GET_INFOLEVELLIST', data.body.tbmDictList);
			}
		});
    },
    getEmotionList({ commit }, list) {
		http.get('/tm/tbmDictList?dictCode=' + 1112).then((res) => {
			const data = res.data;
			if (data.status === api.SUCCESS) {
				sessionStorage.setItem(list, JSON.stringify(data.body.tbmDictList));
			    commit('GET_EMOTIONLIST', data.body.tbmDictList);
			}
		});
    },
    getRangeList({ commit }, list) {
		http.get('/tm/business/gettypelist?code=' + 1005000001).then((res) => {
			const data = res.data;
			if (data.status == api.SUCCESS) {
				const listArr = data.body.typeList;
        		const newlist = listArr.map(item => {
		            return {
		                dictEntry: item.typeCode,
		                entryName: item.typeName
		            };
		        });
				sessionStorage.setItem(list, JSON.stringify(newlist));
			    commit('GET_RANGELIST', newlist);
			}
		});
    },
    getAreaList({ commit }, list) {
        http.get('/tm/business/getarealist').then((res) => {
        	const data = res.data;
            if (data.status == api.SUCCESS) {
            	const listArr = data.body.areaList;
        		const newlist = listArr.map(item => {
		            return {
		                value: item.areaCode,
		                label: item.areaName
		            };
		        });
			   commit('GET_AREALIST', newlist);
            }
        });
	},
    getFormList({ commit }, list) {
		http.get('/tm/business/gettypelist?code=' + 1005000002).then((res) => {
			const data = res.data;
			if (data.status == api.SUCCESS) {
				const listArr = data.body.typeList;
        		const newlist = listArr.map(item => {
		            return {
		                dictEntry: item.typeCode,
		                entryName: item.typeName
		            };
		        });
		         sessionStorage.setItem(list, JSON.stringify(newlist));
			    commit('GET_FORMLIST', newlist);
			}
		});
	},
	getEventTypeList({ commit }, list) {
		http.get('/tm/tbmDictList?dictCode=' + 1133).then((res) => {
			const data = res.data;
			if (data.status == api.SUCCESS) {
				sessionStorage.setItem(list, JSON.stringify(data.body.tbmDictList));
			    commit('GET_EVENTTYPELIST', data.body.tbmDictList);
			}
		});
    },
	getSentimentList({ commit }, list) {
		http.get('/tm/tbmDictList?dictCode=' + 1131).then((res) => {
			const data = res.data;
			if (data.status == api.SUCCESS) {
				sessionStorage.setItem(list, JSON.stringify(data.body.tbmDictList));
			    commit('GET_SENTIMENTLIST', data.body.tbmDictList);
			}
		});
	},
	getNewsImportanceList({ commit }, list) {
		http.get('/tm/tbmDictList?dictCode=' + 1132).then((res) => {
			const data = res.data;
			if (data.status == api.SUCCESS) {
				sessionStorage.setItem(list, JSON.stringify(data.body.tbmDictList));
			    commit('GET_NEWSIMPORTANCELIST', data.body.tbmDictList);
			}
		});
    },
    getFinancialList({ commit }, list) {
		http.get('/tm/business/gettypelist?code=' + 1005000003).then((res) => {
			const data = res.data;
			if (data.status == api.SUCCESS) {
				const listArr = data.body.typeList;
        		const newlist = listArr.map(item => {
		            return {
		                dictEntry: item.typeCode,
		                entryName: item.typeName
		            };
		        });
               sessionStorage.setItem(list, JSON.stringify(newlist));
			    commit('GET_FINANCIALLIST', newlist);
			}
		});
    },
    getOrgAuthorList({ commit }, queryStr) {
		http.get('/tm/business/getauthorlist?name=' + queryStr).then((res) => {
			const data = res.data;
			if (data.status == api.SUCCESS) {
				const listArr = data.body.authorOrgList;
        		const newlist = listArr.map(item => {
		            return {
		                value: item.authorOrgCode,
		                label: item.authorOrgName
		            };
		        });
			    commit('GET_AUTORORGLIST', newlist);
			}
		});
	},
	getDsSourceList({ commit }, queryStr) {
		const body = {
			dsSourceName: queryStr,
			dsSourceType: 0
		};
		http.post('/tm/business/getDatasource', body).then((res) => {
			const data = res.data;
			if (data.status == api.SUCCESS) {
				const listArr = data.body.records;
        		const newlist = listArr.map(item => {
		            return {
		                label: item.dsSourceName.toString(),
						value: item.dsSourceType.toString()
		            };
				});
			    commit('GET_DSSOURCELIST', newlist);
			}
		});
	},
	allSourceList({ commit }) {
		commit('ALL_SOURCE_LIST');
	},
	getMediaSourceList({ commit }, queryStr) {
		const body = {
			current: 1,
			size: 100,
			dicValue: queryStr,
			dicKey: ''
		};
		http.post('/tm/business/getDictPage', body).then((res) => {
			const data = res.data;
			if (data.status == api.SUCCESS) {
				const listArr = data.body.resPonsePage.records;
        		const newlist = listArr.map(item => {
		            return {
		                label: item.entryName.toString(),
						value: item.dictEntry.toString()
		            };
				});
			    commit('GET_MEDIASOURCELIST', newlist);
			}
		});
	},
    getNewsTypeList({ commit }, list) {
		http.get('/tm/tbmDictList?dictCode=' + 1117).then((res) => {
			const data = res.data;
			if (data.status == api.SUCCESS) {
				sessionStorage.setItem(list, JSON.stringify(data.body.tbmDictList));
			    commit('GET_NEWSTYPELIST', data.body.tbmDictList);
			}
		});
    },
    getOpinionListRecommend({ commit }, list) {
		http.get('/tm/tbmDictList?dictCode=' + 1122).then((res) => {
			const data = res.data;
			if (data.status == api.SUCCESS) {
				sessionStorage.setItem(list, JSON.stringify(data.body.tbmDictList));
			    commit('GET_OPINIONLISTRECOMMEND', data.body.tbmDictList);
			}
		});
    },
    getOpinionListComment({ commit }, list) {
		http.get('/tm/tbmDictList?dictCode=' + 1123).then((res) => {
			const data = res.data;
			if (data.status == api.SUCCESS) {
				sessionStorage.setItem(list, JSON.stringify(data.body.tbmDictList));
			    commit('GET_OPINIONLISTCOMMENT', data.body.tbmDictList);
			}
		});
    }
};
export default actions;
/**
 * 根据后台传回的可用menus,递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param router
 * @param menus
 */

function filterRouterByMenus(router, menus) {
	if (menus && menus.length > 0) {
		for (const menu of menus) {
			if (routers[menu.menuCode]) {
				const routerObj = routers[menu.menuCode];
				if (routerObj.children && routerObj.children.length > 0) {
					for (let i = 0, len = routerObj.children.length; i < len; i++) {
						const name = routerObj.children[i];
						const o = routers[name];
						o.menuCode = name;
						filterRouterByMenus(router, [o]);
					}
				}
				const path = routerObj.path;
				const url = routerObj.url;
				const { multiple = false, maxLength = 1 } = routerObj;
				if (multiple && maxLength > 1) {
					for (let i = 0; i < maxLength; i++) {
						let routePath = `${url}/${i}`;
						if (i == 0) {
							routePath = url;
						}
						router.push({
							path: routePath,
							name: menu.menuCode,
							title: menu.title || routerObj.name,
							meta: {
								active: routerObj.active || url,
								icon: menu.menuIcon,
								button: menu.type == 2 ? menu.children : [],
								multiple: multiple,
								maxLength: maxLength,
								oUrl: url,
								index: i
							},
							redirect: menu.redirect,
							component: resolve => require(['@/pages' + path], resolve)
						});
					}
				} else {
					router.push({
						path: url,
						name: menu.menuCode,
						title: menu.title || routerObj.name,
						meta: {
							active: routerObj.active || url,
							icon: menu.menuIcon,
							button: menu.type == 2 ? menu.children : []
						},
						redirect: menu.redirect,
						component: resolve => require(['@/pages' + path], resolve)
					});
				}
			}
			if (menu.children && menu.children.length > 0) {
				filterRouterByMenus(router, menu.children);
			}
		}
	}
  return router;
}
