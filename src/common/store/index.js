import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';
import router from './modules/router';
import riskWarning from './modules/riskWarning';
import constList from './modules/constList';
Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production';

const state = {
   lastPath: null,
   ActiveTabPath: null,
   ActiveMenuPath: null,
   tabList: [],
   routers: [],
   routersObj: {},
   routersUrl: {},
   routersButton: {},
   TabDelMsg: {},
   activeRoutersButton: [],
   scrollTop: {},
   IsLogined: false,
   userInfo: null,
   userMenu: null,
   openMenu: [],
   maxTableHeight: 0,
   appList: [], // 资讯所属项目
   sourceList: [], // 资讯信息来源
   newsOpenFlags: [], // 公开标志
   eventTypeList: [], // 舆情事件类型
   processingStates: [], // 处理状态
   infoLevelList: [], // 资讯信息级别
   emotionList: [], // 资讯情感类别
   labelListCorp: [], // 资讯：企业标签分类
   labelListIndustry: [], // 资讯：行业标签分类
   areaList: [],
   rangeList: [], // 范围
   formList: [],
   sentimentList: [],
   newsImportanceList: [],
   financialMarketList: [], // 金融市场
   autorOrgList: [],
   dsSourceList: [],
   mediaSourceList: [], // 媒体出处
   newsTypeList: [],
   opinionListComment: [],
   opinionListRecommend: [],
   multipleRouteChange: false
};

export default new Vuex.Store({
  // plugins: debug?[createLogger()]: [],
  state: state,
  actions: actions,
  getters: getters,
  mutations: mutations,
  modules: {
    router,
    riskWarning,
    constList
  }
});
