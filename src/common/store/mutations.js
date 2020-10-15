import types from "./types";
import { pathName } from "@/filters";
// import md5 from "js-md5";


const writeKeyboardShortcutsNames = (prev_name = ``, next_name = ``) => {
    let KSN_Obj = {
        prev_name,
        next_name,
    };
    if (prev_name && next_name) {
        window.sessionStorage.setItem(`keyboard_shortcuts_names_obj`, JSON.stringify(KSN_Obj));
    } else {
        // empty
        window.sessionStorage.setItem(`keyboard_shortcuts_names_obj`, JSON.stringify(KSN_Obj));
    }
};

const mutations = {
    ['SAVE_ACTIVE_MENU'](st, path){
        st.ActiveMenuPath = path;
    },
    ['GET_APPLIST'](st, arr){
        st.appList = arr;
    },
    ['GET_SOURCELIST'](st, arr){
        st.sourceList = arr;
    },
    ['GET_PROCESSINGSTATES'](st, arr){
        st.processingStates = arr;
    },   
    ['GET_NEWSOPENFLAGS'](st, arr){
        st.newsOpenFlags = arr;
    },
    ['GET_INFOLEVELLIST'](st, arr){
        st.infoLevelList = arr;
    },
    ['GET_EMOTIONLIST'](st, arr){
        st.emotionList = arr;
    },
    ['GET_RANGELIST'](st, arr){
        st.rangeList = arr;
    },
    ['GET_AREALIST'](st, arr){
        st.areaList = arr;
    },    
    ['GET_FORMLIST'](st, arr){
        st.formList = arr;
    },    
    ['GET_FINANCIALLIST'](st, arr){
        st.financialMarketList = arr;
    },
    ['GET_AUTORORGLIST'](st, arr){
        st.autorOrgList = arr;
    }, 
    ['GET_DSSOURCELIST'](st, arr){
        st.dsSourceList = arr;
    },
    ['GET_MEDIASOURCELIST'](st, arr){
        st.mediaSourceList = arr;
    },
    ['ALL_SOURCE_LIST'](st){
        st.mediaSourceList = st.sourceList
    },
    ['GET_NEWSTYPELIST'](st, arr){
        st.newsTypeList = arr;
    },
    ['GET_OPINIONLISTRECOMMEND'](st, arr){
        st.opinionListRecommend = arr;
    },
    ['GET_OPINIONLISTCOMMENT'](st, arr){
        st.opinionListComment = arr;
    },
    [types.SET_ACTIVE_MENU_PATH](st, router ){
        // Keyboard Shortcuts
        let path = router.path;
        let pathArray = path.split(`/`) || [];
        let isChildrenPage = false;
        if (pathArray.length > 4) {
            isChildrenPage = true;
        }
        if (isChildrenPage) {
            let childPath = `${pathArray[3]}-${pathArray[4]}`;
            childPath = childPath.replace(`-operate-`, `_`);
            writeKeyboardShortcutsNames(`${childPath}_prev`, `${childPath}_next`);
        } else {
            // empty
            writeKeyboardShortcutsNames(``, ``);
        }
        st.ActiveTabPath = path;
        st.ActiveMenuPath = router.meta.active;
    },
    ["SET_ACTIVE_ROUTERS_BUTTON"](st, path){
        let button = st.routersButton[pathName(path)];
        st.activeRoutersButton = button ? button : []; //更新对应页面的按钮权限
    },
    [types.ADD_TAB](st, router){
        let path = router.path;
        if(st.routersObj[pathName(path)]){
          let fullPath = router.fullPath;
          if(path == "/home" || path == "/login" || path == "/")return;
          if(st.tabList.indexOf(path, 0) >= 0){
            let index = st.tabList.indexOf(path);
            st.routersUrl[pathName(path)] = fullPath;
            return;
          }
          st.tabList.push(path);
          st.routersUrl[pathName(path)] = fullPath;
        }
    },
    [types.DEL_TAB](st, key){
        st.tabList.splice(key, 1);
    },
    ["DEL_TAB"](st, router){
        let index = st.tabList.indexOf(router);
        if(index >= 0){
          let name = pathName(router);
          if(name){
            st.scrollTop[name] = 0;
          }
          st.tabList.splice(index, 1);
        }
    },
    ["SAVE_TAB_NAME"](st, router){
        if(st.routersObj[pathName(router.path)]){
            st.routersObj[pathName(router.path)] = router.name;
        }
        const tabList = st.tabList
        let len = tabList.indexOf(router.path);
        if(len != -1){
            st.routersObj[pathName(router.path)] = router.name;
            st.tabList = [...tabList];
        }
    },
    ['CHANGE_TAB_SORT'](st, arr){
        st.tabList = arr;
    },
    ["SET_ROUTERS"](st, list){
        st.routers = list;
    },
    ["SET_SCROLL_TOP"](st, info){
        st.scrollTop[info.name] = info.val;
    },
    ["SET_ROUTERS_OBJ"](st, info){
        st.routersObj[info.name] = info.val;
    },
    ["SET_ROUTERS_BUTTON"](st, info){
        if(!st.routersButton[info.name]){
          st.routersButton[info.name] = [];
        }
        st.routersButton[info.name].push(info.val);
    },
    ["INIT_VUEX"](st, info){
        st.tabList = [];
        st.routers = [];
        st.routersObj = {};
        st.scrollTop = {};
    },
    ["SET_USER_INFO"](st, data){
        st.userInfo = data;
    },
    ["SET_USER_MENU"](st, data){
        st.userMenu = data;
      },
    ["SET_LOGIN_STATUS"](st, isLogined){
        st.IsLogined = isLogined
    },
    ["SET_LAST_PATH"](st, url){
        st.lastPath = url
    },
    ["SET_OPEN_MENU"](st, array){
        st.openMenu = array
    },
    ["SET_MAX_TABLE_HEIGHT"](st, val){
        st.maxTableHeight = val
    },
    ["SET_TAB_MSG"](st, router){
        //url 路径
        //show 是否提示
        //msg 提示内容
        //fn 回调函数
        st.TabDelMsg[pathName(router.url)] = router;
    },
    ["MULTIPLE_ROUTE_CHANGE"](st, change){
        st.multipleRouteChange = change
    }
    
};

export default mutations;
