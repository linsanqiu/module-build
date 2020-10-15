const getters = {
    activeMenuPath: state => { return state.activeMenuPath },
    appList:state => { return state.appList },
    sourceList:state => { return state.sourceList },
    newsOpenFlags:state => { return state.newsOpenFlags },
    processingStates:state => { return state.processingStates},
    infoLevelList:state => { return state.infoLevelList },
	rangeList:state => { return state.rangeList },
	formList:state => { return state.formList },
	areaList:state => { return state.areaList },
	financialMarketList:state => { return state.financialMarketList },
	emotionList:state => { return state.emotionList },
	autorOrgList:state => { return state.autorOrgList },
	newsTypeList:state => { return state.newsTypeList },
	opinionListComment:state => { return state.opinionListComment },
    opinionListRecommend:state => { return state.opinionListRecommend }
}
export default getters
