/**
 * router object 权限路由
 router = {
    code: {
        url: "",
        path: "",
        name: "",
    },
 };
 code    Strong	路由编码
 url     Strong	url
 path    Strong	文件路径
 name    Strong	名称
 */

const router = {
    // 系统
    Home: {
        url: '/home',
        path: '/system/home/index',
        name: '首页'
    },
    Notice: {
        url: '/notice',
        path: '/system/notice/index',
        name: '通知'
    },

    // 待分配菜单
    UserManagement: {
        url: '/account/user',
        path: '/pending/account/user',
        name: '用户管理'
    },
    RoleManagement: {
        url: '/system/role',
        path: '/pending/system/role',
        name: '角色管理'
    },
    WidgetManagement: {
        url: '/system/widget',
        path: '/pending/system/widget/index',
        name: '插件管理'
    },
    WidgetManagementSave: {
        url: '/system/widget/save',
        path: '/pending/system/widget/save',
        name: '添加插件',
        active: '/system/widget'
    },
    MenuManagement: {
        url: '/system/menu',
        path: '/pending/system/menu',
        name: '菜单管理'
    },
    ApiManagement: {
        url: '/system/api',
        path: '/pending/system/api',
        name: 'api管理'
    },
    ReportManagement: {
        url: '/content/report',
        path: '/pending/report/index',
        name: '数据报告'
    },
    ReportEdit: {
        url: '/content/report/edit',
        path: '/pending/report/edit',
        name: '数据报告编辑'
    },
    ReportInfo: {
        url: '/content/report/info',
        path: '/pending/report/info',
        name: '数据报告详情'
    },
    ReportGroupManagement: {
        url: '/content/report/group',
        path: '/pending/report/group',
        name: '数据报告分组'
    },
    InformationSourceAudit: {
        url: '/audit/news/information-source-audit',
        path: '/pending/audit/news/information-source-audit',
        name: '资讯源审核'
    },
    InformationSourceAuditOperateHandle: {
        url: '/audit/news/information-source-audit/operate-handle',
        path: '/pending/audit/news/information-source-audit/operate-handle',
        name: '资讯源审核-处理',
        active: '/audit/news/information-source-audit'
    },
    AuditNewsStatisticsAnalysis: {
        url: '/audit/news/statistics-analysis',
        path: '/pending/audit/news/statistics-analysis',
        name: '资讯统计分析'
    },
    UnWhiteListNews: {
        url: '/audit/news/un-white-list',
        path: '/pending/audit/news/un-white-list',
        name: '非白名单资讯列表'
    },
    UnWhiteListOperateView: {
        url: '/audit/news/un-white-list/operate-view',
        path: '/pending/audit/news/un-white-list/operate-view',
        name: '非白名单资讯列表-查看',
        active: '/audit/news/un-white-list'
    },
    UnWhiteListOperateAudit: {
        url: '/audit/news/un-white-list/operate-audit',
        path: '/pending/audit/news/un-white-list/operate-audit',
        name: '非白名单资讯列表-稽核',
        active: '/audit/news/un-white-list'
    },
    UnWhiteListOperateHandle: {
        url: '/audit/news/un-white-list/operate-handle',
        path: '/pending/audit/news/un-white-list/operate-handle',
        name: '非白名单资讯列表-处理',
        active: '/audit/news/un-white-list'
    },
    CommonNews: {
        url: '/audit/news/common',
        path: '/pending/audit/news/common',
        name: '一般资讯列表'
    },
    CommonOperateView: {
        url: '/audit/news/common/operate-view',
        path: '/pending/audit/news/common/operate-view',
        name: '一般资讯-查看',
        active: '/audit/news/common'
    },
    CommonOperateAudit: {
        url: '/audit/news/common/operate-audit',
        path: '/pending/audit/news/common/operate-audit',
        name: '一般资讯-稽核',
        active: '/audit/news/common'
    },
    CommonOperateHandle: {
        url: '/audit/news/common/operate-handle',
        path: '/pending/audit/news/common/operate-handle',
        name: '一般资讯-处理',
        active: '/audit/news/common'
    },
    CommonOperateVerify: {
        url: '/audit/news/common/operate-verify',
        path: '/pending/audit/news/common/operate-verify',
        name: '一般资讯-审核',
        active: '/audit/news/common'
    },
    SensitiveNews: {
        url: '/audit/news/sensitive',
        path: '/pending/audit/news/sensitive',
        name: '敏感资讯列表'

    },
    SensitiveOperateView: {
        url: '/audit/news/sensitive/operate-view',
        path: '/pending/audit/news/sensitive/operate-view',
        name: '敏感资讯-查看',
        active: '/audit/news/sensitive'
    },
    SensitiveOperateAudit: {
        url: '/audit/news/sensitive/operate-audit',
        path: '/pending/audit/news/sensitive/operate-audit',
        name: '敏感资讯-稽核',
        active: '/audit/news/sensitive'
    },
    SensitiveOperateHandle: {
        url: '/audit/news/sensitive/operate-handle',
        path: '/pending/audit/news/sensitive/operate-handle',
        name: '敏感资讯-处理',
        active: '/audit/news/sensitive'
    },
    SensitiveOperateVerify: {
        url: '/audit/news/sensitive/operate-verify',
        path: '/pending/audit/news/sensitive/operate-verify',
        name: '敏感资讯-审核',
        active: '/audit/news/sensitive'
    },
    TagNews: {
        url: '/audit/news/tag',
        path: '/pending/audit/news/tag',
        name: '异常打标资讯列表'
    },
    TagOperateView: {
        url: '/audit/news/tag/operate-view',
        path: '/pending/audit/news/tag/operate-view',
        name: '异常打标资讯-查看',
        active: '/audit/news/tag'
    },
    TagOperateAudit: {
        url: '/audit/news/tag/operate-audit',
        path: '/pending/audit/news/tag/operate-audit',
        name: '异常打标资讯-稽核',
        active: '/audit/news/tag'
    },
    TagOperateHandle: {
        url: '/audit/news/tag/operate-handle',
        path: '/pending/audit/news/tag/operate-handle',
        name: '异常打标资讯-处理',
        active: '/audit/news/tag'
    },
    TagOperateVerify: {
        url: '/audit/news/tag/operate-verify',
        path: '/pending/audit/news/tag/operate-verify',
        name: '异常打标资讯-审核',
        active: '/audit/news/tag'
    },
    BidTagNews: {
        url: '/audit/news/bid-tag',
        path: '/pending/audit/news/bid-tag',
        name: 'BID 异常资讯列表'
    },
    BidTagOperateView: {
        url: '/audit/news/bid-tag/operate-view',
        path: '/pending/audit/news/bid-tag/operate-view',
        name: 'BID 异常资讯-查看',
        active: '/audit/news/bid-tag'
    },
    BidTagOperateAudit: {
        url: '/audit/news/bid-tag/operate-audit',
        path: '/pending/audit/news/bid-tag/operate-audit',
        name: 'BID 异常资讯-稽核',
        active: '/audit/news/bid-tag'
    },
    BidTagOperateHandle: {
        url: '/audit/news/bid-tag/operate-handle',
        path: '/pending/audit/news/bid-tag/operate-handle',
        name: 'BID 异常资讯-处理',
        active: '/audit/news/bid-tag'
    },
    AuditNewsLabelsStatistics: {
        url: '/audit/news/labels-statistics',
        path: '/pending/audit/news/labels-statistics',
        name: '标签统计'
    },
    LabelsStatisticsOperateView: {
        url: '/audit/news/labels-statistics/operate-view',
        path: '/pending/audit/news/labels-statistics/operate-view',
        name: '标签统计-查看打标',
        active: '/audit/news/labels-statistics'
    },
    AuditNewsProcessingStatistics: {
        url: '/audit/news/processing-statistics',
        path: '/pending/audit/news/processing-statistics',
        name: '资讯处理统计'
    },
    AllInOneNews: {
        url: '/audit/news/all-in-one',
        path: '/pending/audit/news/all-in-one',
        name: '资讯列表'
    },
    AllInOneNewsOperateHandle: {
        url: '/audit/news/all-in-one/operate-handle',
        path: '/pending/audit/news/all-in-one/operate-handle',
        name: '资讯-处理',
        active: '/audit/news/all-in-one'
    },
    AllInOneNewsOperateView: {
        url: '/audit/news/all-in-one/operate-view',
        path: '/pending/audit/news/all-in-one/operate-view',
        name: '资讯-查看',
        active: '/audit/news/all-in-one'
    },
    HotWordMaintenance: {
        url: '/audit/news/hot-word-maintenance',
        path: '/pending/audit/news/hot-word-maintenance',
        name: '热词维护列表'
    },
    HotWordMaintenanceOperateHandle: {
        url: '/audit/news/hot-word-maintenance/operate-handle',
        path: '/pending/audit/news/hot-word-maintenance/operate-handle',
        name: '热词维护-编辑', // 处理
        active: '/audit/news/hot-word-maintenance'
    },
    HotWordMaintenanceOperateView: {
        url: '/audit/news/hot-word-maintenance/operate-view',
        path: '/pending/audit/news/hot-word-maintenance/operate-view',
        name: '热词维护-查看',
        active: '/audit/news/hot-word-maintenance'
    },
    // cache name bug && /audit/news/emergency-off-shelves => AuditNewsEmergency-off-shelves
    EmergencyOffShelves: {
        url: '/audit/news/emergency-off-shelves',
        path: '/pending/audit/news/emergency-off-shelves',
        name: '紧急下架'
    },
    EmergencyOffShelvesView: {
        url: '/audit/news/emergency-off-shelves/operate-view',
        path: '/pending/audit/news/emergency-off-shelves/operate-view',
        name: '紧急下架-查看',
        active: '/audit/news/emergency-off-shelves'
    },
    EmergencyOffShelvesViewBid: {
        url: '/audit/news/emergency-off-shelves/operate-view-bid',
        path: '/pending/audit/news/emergency-off-shelves/operate-view-bid',
        name: '紧急下架-查看 bid',
        active: '/audit/news/emergency-off-shelves'
    },
    EmergencyOffShelvesHandle: {
        url: '/audit/news/emergency-off-shelves/operate-handle',
        path: '/pending/audit/news/emergency-off-shelves/operate-handle',
        name: '紧急下架-处理',
        active: '/audit/news/emergency-off-shelves'
    },
    RecheckNews: {
        url: '/audit/news/recheck',
        path: '/pending/audit/news/recheck',
        name: '复核列表'
    },
    RecheckOperateView: {
        url: '/audit/news/recheck/operate-view',
        path: '/pending/audit/news/recheck/operate-view',
        name: '复核列表-查看',
        active: '/audit/news/recheck'
    },
    RecheckOperateAudit: {
        url: '/audit/news/recheck/operate-audit',
        path: '/pending/audit/news/recheck/operate-audit',
        name: '复核列表-复核', // 稽核
        active: '/audit/news/recheck'
    },
    ReviewNews: {
        url: '/audit/news/review',
        path: '/pending/audit/news/review',
        name: '审核列表'
    },
    ReviewOperateView: {
        url: '/audit/news/review/operate-view',
        path: '/pending/audit/news/review/operate-view',
        name: '审核列表-查看',
        active: '/audit/news/review'
    },
    ReviewOperateHandle: {
        url: '/audit/news/review/operate-handle',
        path: '/pending/audit/news/review/operate-handle',
        name: '审核列表-处理',
        active: '/audit/news/review'
    },
    ReviewOperateVerify: {
        url: '/audit/news/review/operate-verify',
        path: '/pending/audit/news/review/operate-verify',
        name: '审核列表-审核',
        active: '/audit/news/review'
    },
    ReviewNewsUninterested: {
        url: '/audit/news/uninterested',
        path: '/pending/audit/news/uninterested',
        name: '不感兴趣'
    },
    ReviewNewsMechanized: {
        url: '/audit/news/mechanized',
        path: '/pending/audit/news/mechanized',
        name: '机器屏蔽'
    },
    ReviewNewsRepetitive: {
        url: '/audit/news/repetitive',
        path: '/pending/audit/news/repetitive',
        name: '重复过滤统计'
    },
    AuditNewsSourceQuality: {
        url: '/audit/news/source-quality',
        path: '/pending/audit/news/source-quality',
        name: '资讯源质量'
    },
    TaskList: {
        url: '/audit/task/list',
        path: '/pending/audit/task/list',
        name: '任务移交'
    },
    TaskHandOverDetail: {
        url: '/audit/task/detail',
        path: '/pending/audit/task/detail',
        name: '任务移交详情',
        active: '/audit/task/list'
    },
    TaskHandOverAdd: {
        url: '/audit/task/add',
        path: '/pending/audit/task/add',
        name: '新增任务移交',
        active: '/audit/task/list'
    },
    TaskHandOverEdit: {
        url: '/audit/task/edit',
        path: '/pending/audit/task/edit',
        name: '编辑任务移交',
        active: '/audit/task/list'
    },
    CustomerContactCustomerNameList: {
        url: '/customer-contact/customer-name-list',
        path: '/pending/customer-contact/customer-name-list',
        name: '客户名单列表'
    },
    CustomerContactExternalLiaisonStaff: {
        url: '/customer-contact/external-liaison-staff',
        path: '/pending/customer-contact/external-liaison-staff',
        name: '对外联络工作人员'
    },
    CustomerContactOutboundRecordingStatistics: {
        url: '/customer-contact/outbound-recording-statistics',
        path: '/pending/customer-contact/outbound-recording-statistics',
        name: '外呼记录统计'
    },
    UserRecommendIndex: {
        url: '/user/recommend',
        path: '/pending/userRecommend/index',
        name: '用户推荐-查看'
    },
    UserRecommendIndextagBtn: {
        url: '/user/recommend/tag',
        path: '/pending/userRecommend/tag',
        name: '用户推荐-标签列表',
        active: '/user/recommend'
    },
    UserRecommendIndexnewsBtn: {
        url: '/user/recommend/news',
        path: '/pending/userRecommend/news',
        name: '用户推荐-资讯列表',
        active: '/user/recommend'
    },
    JINTANUSER: {
        url: '/tbm/user',
        path: '/pending/user/index',
        name: '金探用户信息'
    },
    TagManagement: {
        url: '/examine/tag',
        path: '/pending/examine/tag',
        name: '标签管理'
    },
    TagCheckManagement: {
        url: '/examine/check/tag',
        path: '/pending/examine/checktag',
        name: '稽核标签审核'
    },
    ExamineStatistics: {
        url: '/examine/statistics',
        path: '/pending/examine/statistics/index',
        name: '审核统计'
    },
    TagRelation: {
        url: '/examine/tagRelation',
        path: '/pending/examine/tagRelation',
        name: '用户标签关系'
    },
    NameCardAudit: {
        url: '/examine/namecard',
        path: '/pending/examine/namecard',
        name: '名片认证审核'
    },

    ExamineCompanyManagement: {
        url: '/examine/company',
        path: '/pending/examine/company',
        name: '企业认证'
    },
    ExamineMessageManagement: {
        url: '/examine/message',
        path: '/pending/examine/message',
        name: '消息管理'
    },
    SystemParameterManagement: {
        url: '/system/parameter',
        path: '/pending/system/parameter',
        name: '参数管理'
    },
    ExamineTagSynonym: {
        url: '/examine/tagSynonym',
        path: '/pending/examine/tagSynonym',
        name: '标签管理'
    },
    IndustryManagement: {
        url: '/chainspectrum/industry',
        path: '/pending/chainspectrum/industry',
        name: '行业实体管理'
    },
    IndustryInfo: {
        url: '/chainspectrum/industry/info',
        path: '/pending/chainspectrum/industry/info',
        name: '行业实体详情',
        active: '/chainspectrum/industry'
    },
    IndustryEdit: {
        url: '/chainspectrum/industry/edit',
        path: '/pending/chainspectrum/industry/edit',
        name: '行业实体编辑',
        active: '/chainspectrum/industry'
    },
    CompanyManagement: {
        url: '/chainspectrum/company',
        path: '/pending/chainspectrum/company',
        name: '企业实体管理'
    },
    CompanyInfo: {
        url: '/chainspectrum/company/info',
        path: '/pending/chainspectrum/company/info',
        name: '品牌实体详情',
        active: '/chainspectrum/company'
    },
    BrandManagement: {
        url: '/chainspectrum/brand',
        path: '/pending/chainspectrum/brand/index',
        name: '品牌实体管理'
    },
    BrandInfo: {
        url: '/chainspectrum/brand/info',
        path: '/pending/chainspectrum/brand/info',
        name: '品牌实体详情',
        active: '/chainspectrum/brand'
    },
    BrandEdit: {
        url: '/chainspectrum/brand/edit',
        path: '/pending/chainspectrum/brand/edit',
        name: '品牌实体详情',
        active: '/chainspectrum/brand'
    },
    ProductManagement: {
        url: '/chainspectrum/product',
        path: '/pending/chainspectrum/product/list',
        name: '产品实体管理',
        active: '/chainspectrum/product'
    },
    ProductEditManagement: {
        url: '/chainspectrum/product/edit',
        path: '/pending/chainspectrum/product/edit',
        name: '产品实体编辑',
        active: '/chainspectrum/product'
    },
    ProductInfoManagement: {
        url: '/chainspectrum/product/info',
        path: '/pending/chainspectrum/product/info',
        name: '产品实体详情',
        active: '/chainspectrum/product'
    },
    PersonManagement: {
        url: '/chainspectrum/person',
        path: '/pending/chainspectrum/person/list',
        name: '人物实体管理'
    },
    PersonEditManagement: {
        url: '/chainspectrum/person/edit',
        path: '/pending/chainspectrum/person/edit',
        name: '人物实体编辑',
        active: '/chainspectrum/person'
    },
    PersonInfoManagement: {
        url: '/chainspectrum/person/info',
        path: '/pending/chainspectrum/person/info',
        name: '人物实体详情',
        active: '/chainspectrum/person'
    },
    RelationManagement: {
        url: '/chainspectrum/relation',
        path: '/pending/chainspectrum/relation/list',
        name: '链谱关系'
    },

    // 资讯中心
    JTNewsOperateList: {
        url: '/tbm/news/list',
        path: '/tbm/news/list',
        name: '金探资讯列表'
    },
    JTNewsOperateHandle: {
        url: '/tbm/news/handle',
        path: '/tbm/news/handle',
        name: '金探资讯处理详情',
        active: '/tbm/news/list'
    },
    JTNewsOperateView: {
        url: '/tbm/news/view',
        path: '/tbm/news/view',
        name: '金探资讯查看详情',
        active: '/tbm/news/list'
    },
    JTNewsOperateAdd: {
        url: '/tbm/news/add',
        path: '/tbm/news/add',
        name: '金探资讯新建',
        active: '/tbm/news/list'
    },
    JTNewsOperateNewPage: {
        url: '/tbm/news/saveas',
        path: '/tbm/news/saveas',
        name: '资讯另存为',
        active: '/tbm/news/list'
    },
    JTFastNewsList: {
        url: '/tbm/fast-news/index',
        path: '/tbm/fast-news/index',
        name: '快讯处理列表'
    },
    JTFastNewsEdit: {
        url: '/tbm/fast-news/edit',
        path: '/tbm/fast-news/edit',
        name: '快讯处理详情',
        active: '/tbm/fast-news/index'
    },
    JTFastNewsADD: {
        url: '/tbm/fast-news/add',
        path: '/tbm/fast-news/add',
        name: '快讯新建',
        active: '/tbm/fast-news/index'
    },
    JTFastNewsView: {
        url: '/tbm/fast-news/view',
        path: '/tbm/fast-news/view',
        name: '快讯查看详情',
        active: '/tbm/fast-news/index'
    },
    JTFastNewsOperateCopy: {
        url: '/tbm/fast-news/saveas',
        path: '/tbm/fast-news/saveas',
        name: '快讯另存为',
        active: '/tbm/fast-news/index'
    },
    JTPublicEventsList: {
        url: '/tbm/events/index',
        path: '/tbm/events/index',
        name: '舆情事件列表',
        active: '/tbm/events/index'
    },
    JTPublicEventsDetail: {
        url: '/tbm/events/detail',
        path: '/tbm/events/detail',
        name: '舆情事件处理',
        active: '/tbm/events/index'
    },
    JTPublicEventsView: {
        url: '/tbm/events/view',
        path: '/tbm/events/view',
        name: '舆情事件查看',
        active: '/tbm/events/index'
    },
    JTPublicOperateCopy: {
        url: '/tbm/events/saveas',
        path: '/tbm/events/saveas',
        name: '舆情事件另存为',
        active: '/tbm/events/index'
    },
    JTNewsHighlightWord: {
        url: '/tbm/highlight/index',
        path: '/tbm/highlight/index',
        name: '高亮词管理'
    },
    JTNewsSubstituteWord: {
        url: '/tbm/substitute/index',
        path: '/tbm/substitute/index',
        name: '替换词管理'
    },
    JTNewsCompanySync: {
        url: '/tbm/setting/company',
        path: '/tbm/setting/company',
        name: '公司同步'
    },
    JTNewsAttrSetting: {
        url: '/tbm/setting/attrSetting',
        path: '/tbm/setting/attrSetting',
        name: '数据源配置'
    },
    JTNewsStatistic: {
        url: '/tbm/news-statistic/index',
        path: '/tbm/news-statistic/index',
        name: '资讯统计分析'
    },
    JTSpecialNewsConfig: {
        url: '/tbm/special-news/config/index',
        path: '/tbm/special-news/config/index',
        name: '专题资讯配置'
    },
    JTSpecialNewsHandle: {
        url: '/tbm/special-news/handle/index',
        path: '/tbm/special-news/handle/index',
        name: '专题资讯处理'
    },
    JTSpecialNewsAdd: {
        url: '/tbm/special-news/handle/add',
        path: '/tbm/special-news/handle/add',
        name: '专题资讯新增',
        active: '/tbm/special-news/handle/index'
    },
    JTSpecialNewsEdit: {
        url: '/tbm/special-news/handle/edit',
        path: '/tbm/special-news/handle/edit',
        name: '专题资讯编辑',
        active: '/tbm/special-news/handle/index'
    },
    JTSpecialNewsView: {
        url: '/tbm/special-news/handle/view',
        path: '/tbm/special-news/handle/view',
        name: '专题资讯查看',
        active: '/tbm/special-news/handle/index'
    },

    JTWarningRule: {
        url: '/tbm/warning-rule/index',
        path: '/tbm/warning-rule/index',
        name: '预警规则管理'
    },
    JTWarningTask: {
        url: '/tbm/warning-task/index',
        path: '/tbm/warning-task/index',
        name: '预警任务管理'
    },
    JTWarningTaskAdd: {
        url: '/tbm/warning-task/add',
        path: '/tbm/warning-task/add',
        name: '预警任务新建',
        active: '/tbm/warning-task/index'
    },
    JTWarningTaskEdit: {
        url: '/tbm/warning-task/edit',
        path: '/tbm/warning-task/edit',
        name: '预警任务编辑',
        active: '/tbm/warning-task/index'
    },
    JTWarningResult: {
        url: '/tbm/warning-result/index',
        path: '/tbm/warning-result/index',
        name: '预警结果管理'
    },
    /* 报表统计 */
    ReportStatisticsMainNews: {
        url: '/tbm/reportStatistics/news/main',
        path: '/tbm/reportStatistics/news/main',
        name: '工作量统计-资讯主表'
    },
    ReportStatisticsSpecialNews: {
        url: '/tbm/reportStatistics/news/special',
        path: '/tbm/reportStatistics/news/special',
        name: '工作量统计-专题'
    },
    ReportStatisticsFastNews: {
        url: '/tbm/reportStatistics/news/fast',
        path: '/tbm/reportStatistics/news/fast',
        name: '工作量统计-快讯'
    },
    ReportStatisticsEvent: {
        url: '/tbm/reportStatistics/news/event',
        path: '/tbm/reportStatistics/news/event',
        name: '工作量统计-舆情'
    },
    /* 机器写稿 */
    RobotWritingNewsTemManage: {
        url: '/robotwriting/newstemplate',
        path: '/robotWriting/newsTemplate/list',
        name: '新闻模板管理'
    },
    RobotWritingNewsTemManageAdd: {
        url: '/robotwriting/newstemplate/add',
        path: '/robotWriting/newsTemplate/add',
        name: '新闻模板配置',
        active: '/robotwriting/newstemplate'
    },
    RobotWritingNewsTemManagePreview: {
        url: '/robotwriting/newstemplate/preview',
        path: '/robotWriting/newsTemplate/preview',
        name: '新闻模板 - 预览',
        active: '/robotwriting/newstemplate'
    },
    RobotWritingNewsTemManageTest: {
        url: '/robotwriting/newstemplate/test',
        path: '/robotWriting/newsTemplate/test',
        name: '新闻模板 - 测试',
        active: '/robotwriting/newstemplate'
    },
    RobotWritingNewsTemManageTestDetail: {
        url: '/robotwriting/newstemplate/test/detail',
        path: '/robotWriting/newsTemplate/testDetail',
        name: '新闻模板 - 查看测试结果',
        active: '/robotwriting/newstemplate'
    },
    RobotWritingDataTemManage: {
        url: '/robotwriting/datatemplate',
        path: '/robotWriting/dataTemplate/list',
        name: '数据模板管理'
    },
    RobotWritingDataTemManageAdd: {
        url: '/robotwriting/datatemplate/add',
        path: '/robotWriting/dataTemplate/add',
        name: '数据模板配置',
        active: '/robotwriting/datatemplate'
    },
    RobotWritingTacticsManage: {
        url: '/robotwriting/tactics',
        path: '/robotWriting/tactics/list',
        name: '生成策略管理'
    },
    RobotWritingTacticsManageAdd: {
        url: '/robotwriting/tactics/add',
        path: '/robotWriting/tactics/add',
        name: '生成策略配置',
        active: '/robotwriting/tactics'
    },
    RobotWritingNewsInfo: {
        url: '/robotwriting/news',
        path: '/robotWriting/news/list',
        name: '资讯管理',
        children: ['RobotWritingNewsDetail']
    },
    RobotWritingNewsDetail: {
        url: '/robotwriting/news/detail',
        path: '/robotWriting/news/detail',
        name: '资讯管理 - 详情',
        active: '/robotwriting/news'
    },
    RobotWritingDataMapping: {
        url: '/robotwriting/dataMapping',
        path: '/robotWriting/dataMapping/list',
        name: '数据源编码映射',
        active: '/robotwriting/dataMapping'
    },

    /* ai平台 */
    TagOperateHistoryList: {
        url: '/tbm/tag/operate_history_list',
        path: '/ai/tag/operate_history_list',
        name: '标签统计'
    },
    NewsTagView: {
        url: '/tbm/tag/news_view',
        path: '/ai/tag/news_view',
        name: '资讯打标详情',
        active: '/tbm/tag/operate_history_list'
    },
    AmbiguousWordMaintenance: {
        url: '/audit/news/ambiguous-word-maintenance',
        path: '/ai/ambiguous-word-maintenance/index',
        name: '歧义词维护列表'
    },
    AmbiguousWordMaintenanceOperateHandle: {
        url: '/audit/news/ambiguous-word-maintenance/operate-handle',
        path: '/ai/ambiguous-word-maintenance/operate-handle',
        name: '歧义词维护-编辑',
        active: '/audit/news/ambiguous-word-maintenance'
    },
    AmbiguousWordMaintenanceOperateView: {
        url: '/audit/news/ambiguous-word-maintenance/operate-view',
        path: '/ai/ambiguous-word-maintenance/operate-view',
        name: '歧义词维护-查看',
        active: '/audit/news/ambiguous-word-maintenance'
    },
    AuditNewsDissociationMaintenance: {
        url: '/audit/news/dissociation-maintenance',
        path: '/ai/dissociation-maintenance/index',
        name: '消歧维护列表',
        active: '/audit/news/dissociation-maintenance'
    },
    DissociationMaintenanceOperateHandle: {
        url: '/audit/news/dissociation-maintenance/operate-handle',
        path: '/ai/dissociation-maintenance/operate-handle',
        name: '消歧维护列表-编辑',
        active: '/audit/news/dissociation-maintenance'
    },
    DissociationMaintenanceOperateView: {
        url: '/audit/news/dissociation-maintenance/operate-view',
        path: '/ai/dissociation-maintenance/operate-view',
        name: '消歧维护列表-新建',
        active: '/audit/news/dissociation-maintenance'
    },
    AISensitiveList: {
        url: '/AI/sensitive/list',
        path: '/ai/sensitive/list',
        name: '敏感词列表'
    },
    AINoRepeat: {
        url: '/AI/norepeat/list',
        path: '/ai/norepeat/list',
        name: '去重过滤'
    },
    AISynonymList: {
        url: '/AI/synonym/list',
        path: '/ai/synonym/list',
        name: '近义词管理'
    },
    AICorpusAnalysisDisplay: {
        url: '/AI/corpus-analysis/index',
        path: '/ai/corpus-analysis/index',
        name: '语料分析功能展示'
    },
    AIRelationshipExtractionDisplay: {
        url: '/AI/relationship-extraction/index',
        path: '/ai/relationship-extraction/index',
        name: '关系抽取展示'
    },
    FILETYPEMANAGGEMENT: {
        url: '/extract/filetype',
        path: '/ai/extract/filetype/index',
        name: '文件类型管理'
    },
    FILEMANAGGEMENT: {
        url: '/extract/file',
        path: '/ai/extract/file/index',
        name: '文件管理'
    },
    RULEMANAGEMENT: {
        url: '/extract/rule',
        path: '/ai/extract/rule/index',
        name: '配置管理'
    },
    RULEMANAGEMENTADD: {
        url: '/extract/rule/add',
        path: '/ai/extract/rule/add',
        active: '/extract/rule',
        name: '配置规则 - 新增'
    },
    RULEMANAGEMENTEDIT: {
        url: '/extract/rule/edit',
        path: '/ai/extract/rule/edit',
        active: '/extract/rule',
        name: '配置规则 - 编辑'
    },
    RULEMANAGEMENTVIEW: {
        url: '/extract/rule/view',
        path: '/ai/extract/rule/view',
        active: '/extract/rule',
        name: '配置规则 - 查看'
    },
    RULEMANAGEMENTTEST: {
        url: '/extract/rule/test',
        path: '/ai/extract/rule/test',
        active: '/extract/rule',
        name: '配置规则 - 测试',
        children: ['RULEMANAGEMENTTESTDETAIL']
    },
    RULEMANAGEMENTTESTDETAIL: {
        url: '/extract/rule/test/detail',
        path: '/ai/extract/rule/testDetail',
        active: '/extract/rule',
        name: '配置规则 - 测试详情'
    },
    RULEMANAGEMENTCRITERION: {
        url: '/extract/rule/criterion',
        path: '/ai/extract/rule/criterion',
        active: '/extract/rule',
        name: '配置规则 - 标准数据',
        children: ['RULEMANAGEMENTCRITERIONDETAIL']
    },
    RULEMANAGEMENTCRITERIONDETAIL: {
        url: '/extract/rule/criterion/detail',
        path: '/ai/extract/rule/criterionDetail',
        active: '/extract/rule',
        name: '配置规则 - 标准数据详情'
    },
    RULEMANAGEMENTPREVIEW: {
        url: '/extract/rule/preview',
        path: '/ai/extract/rule/detail',
        name: '抽取结果',
        active: '/extract/rule'
    },
    RULEPERSONALMANAGEMENTTEST: {
        url: '/extract/personaltest',
        path: '/ai/extract/personaltest/index',
        name: '个人测试任务'
    },

    RULEPERSONALTESTDETAILS: {
        url: '/extract/personaltest/detail',
        path: '/ai/extract/personaltest/testDetail',
        name: '个人测试任务 - 测试结果',
        active: '/extract/personaltest'
    },
    RULEPERSONALTESTPREVIEW: {
        url: '/extract/personaltest/preview',
        path: '/ai/extract/personaltest/preview',
        name: '个人测试任务 - 抽取详情',
        active: '/extract/personaltest'
    },
    RULEPERSONALTESTPRULEVIEW: {
        url: '/extract/personaltest/ruleView',
        path: '/ai/extract/personaltest/ruleView',
        name: '个人测试任务 - 规则查看',
        active: '/extract/personaltest'
    },
    // 产品信息中心
    ProductionInfoNoticeList: {
        url: '/productionInfo/noticeData/list',
        path: '/productionInfo/noticeData/list',
        name: '公告数据录入',
        active: '/productionInfo/noticeData/list'
    },
    ProductionInfoNoticeDetail: {
        multiple: true,
        maxLength: 5,
        url: '/productionInfo/noticeData/detail',
        path: '/productionInfo/noticeData/detail',
        name: '公告数据详情',
        active: '/productionInfo/noticeData/list'
    },
    ProductionInfoNoticeView: {
        url: '/productionInfo/noticeData/view',
        path: '/productionInfo/noticeData/view',
        name: '公告数据查看',
        active: '/productionInfo/noticeData/list'
    },
    ProductionInfoTemplateList: {
        url: '/productionInfo/templateConfig/list',
        path: '/productionInfo/templateConfig/list',
        name: '公告模板配置',
        active: '/productionInfo/templateConfig/list'
    },
    ProductionInfoTemplateAdd: {
        url: '/productionInfo/templateConfig/add',
        path: '/productionInfo/templateConfig/add',
        name: '公告模板新建',
        active: '/productionInfo/templateConfig/list'
    },
    ProductionInfoProductData: {
        url: '/productionInfo/productData/list',
        path: '/productionInfo/productData/list',
        name: '公告数据一览',
        active: '/productionInfo/productData/list'
    },
    ProductionInfoSetting: {
        url: '/productionInfo/ruleSetting/list',
        path: '/productionInfo/ruleSetting/list',
        name: '字段规则配置',
        active: '/productionInfo/ruleSetting/list'
    },

    /* 语料标注平台 */
    CORPUSIMPORTJYP: {
        url: '/corpus/import/jyp',
        path: '/corpus/import/jyp',
        name: 'JYP导入',
        children: ['CORPUSIMPORTJDETAIL']
    },
    CORPUSIMPORTJDETAIL: {
        url: '/corpus/import/detail',
        path: '/corpus/import/detail',
        active: '/corpus/import/jyp',
        name: 'JYP - 详情'
    },
    CORPUSIMPORTLOCAL: {
        url: '/corpus/import/local',
        path: '/corpus/import/local',
        name: '本地上传'
    },
    CORPUSINCIDENTLIST: {
        url: '/corpus/incident',
        path: '/corpus/incident/list',
        name: '事件标注列表'
    },
    CORPUSINCIDENTMODIFY: {
        url: '/corpus/incident/detail',
        path: '/corpus/incident/detail',
        name: '事件标注 - 修改',
        active: '/corpus/incident'
    },
    CORPUSINCIDENTDETAIL: {
        url: '/corpus/incident/view',
        path: '/corpus/incident/view',
        name: '事件标注 - 详情',
        active: '/corpus/incident'
    },
    CORPUSAUDITINDEX: {
        url: '/corpus/audit',
        path: '/corpus/audit/index',
        name: '审核事件列表'
    },
    CORPUSAUDITINDEXMODIFY: {
        url: '/corpus/audit/detail',
        path: '/corpus/audit/detail',
        name: '事件标注 - 审核',
        active: '/corpus/audit'
    },
    CORPUSAUDITINDEXVIEW: {
        url: '/corpus/audit/view',
        path: '/corpus/audit/view',
        name: '审核事件列表',
        active: '/corpus/audit'
    },

    /* 风控预警 */
    RISKWARNINGVIOLATELIST: {
        url: '/riskWarning/violate/list',
        path: '/riskWarning/violate/list',
        name: '违规公告列表',
        active: '/riskWarning/violate/list'
    },
    RISKWARNINGVIOLATEDETAILS: {
        url: '/riskWarning/violate/details',
        path: '/riskWarning/violate/details',
        name: '违规事件详情',
        active: '/riskWarning/violate/list'
    },
    RISKWARNINGVIOLATEVIEW: {
        url: '/riskWarning/violate/view',
        path: '/riskWarning/violate/view',
        name: '违规公告查看',
        active: '/riskWarning/violate/list'
    },
    RISKWARNINGPUBLISHEVENTS: {
        url: '/riskWarning/publishEvents/list',
        path: '/riskWarning/publishEvents/list',
        name: '已公开时间列表',
        active: '/riskWarning/publishEvents/list'
    },
    RISKWARNINGEVENTSVIEW: {
        url: '/riskWarning/publishEvents/view',
        path: '/riskWarning/publishEvents/view',
        name: '公开事件查看',
        active: '/riskWarning/publishEvents/list'
    },
    RISKWARNINGEVENTSDETAILS: {
        url: '/riskWarning/publishEvents/details',
        path: '/riskWarning/publishEvents/details',
        name: '公开事件详情',
        active: '/riskWarning/publishEvents/list'
    }
};

export default router;
