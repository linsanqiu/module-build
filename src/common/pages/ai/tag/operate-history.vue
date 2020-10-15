<template>
	<div>
		<ul class="filtrate-head double-date">
            <li>
                <span>操作类型：</span>
                <h-select aria-placeholder="操作类型" placeholder="请选择操作类型" style="width:150px" v-model="req.operateType" filterable clearable>
                    <h-option
                        v-for="(item, i) in operateTypes"
                        :value="item.value"
                        :key="i">
                        {{item.desc}}
                    </h-option>
                </h-select>
            </li>
            <li>
                <span>处理状态：</span>
                <h-select aria-placeholder="处理状态" placeholder="请选择处理状态" 
                style="width:150px" v-model="req.handleStatus" filterable clearable>
                    <h-option
                        v-for="(item, i) in handleStates"
                        :value="item.value"
                        :key="i">
                        {{item.desc}}
                    </h-option>
                </h-select>
            </li>
            <li>
                <span>标签名称：</span>
                <h-input aria-placeholder="标签名称" placeholder="请输入标签名称"
                style="width:150px" v-model="req.tagName" ref="tagName" @on-click="onEmpty(`tagName`)" icon="android-close">
                </h-input>
            </li>
            <li>
                <span>时间范围：</span>
                <h-date-picker placement="bottom-end"  type="daterange" format="yyyy-MM-dd" placeholder="开始日期-结束日期" :value="createDateRange" @on-change="onChangeModDateRangePicker" >
                </h-date-picker>
            </li>
		</ul>
		<div class="filtrate-btn">
			<h-button type="primary" icon="search"  v-if="activeRoutersButton.indexOf('tagOperateHistorySearch') != -1" @click="onSearch">查询</h-button>
            <h-button type="primary" v-if="activeRoutersButton.indexOf('tagOperateHistoryDelBatch') != -1" @click="delBatch">批量删除</h-button>
		</div>

		<div class="contents-wrapper">
			<div class="table">
				<h-table :columns="tagOperateHistoryTable" :data="tagOperateHistoryList" stripe border @on-selection-change="selectChange"  @on-select-cancel="cancelSelect"></h-table>
			</div>
			<div class="page">
				<template v-if="activeRoutersButton.indexOf('tagOperateHistoryDelBatch') != -1 ">
					<span class="check">当前已选择<i>{{ arrCheck.length }}</i>条</span>
				</template>
				<h-page :total="total" :page-size="req.size" :current="req.current" @on-change="onPageChange" size="small" @on-page-size-change="changePageSize" :page-size-opts="pageSizeOpts" show-elevator show-total show-sizer placement="top"></h-page>
			</div>
			<Spin fix v-if="isShowSpin">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</Spin>
		</div>
	</div>
</template>
<script>
export default {
    name: "tag-operate-history",
    data() {
        return {
            activeRoutersButton: this.$store.state.activeRoutersButton,
            operateTypes: [
                {
                    desc: "删除",
                    value: 0,
                },
                {
                    desc: "添加",
                    value: 1,
                },
            ],
            handleStates: [
                {
                    desc: "待处理",
                    value: 0,
                },
                {
                    desc: "已处理",
                    value: 1,
                },
            ],
            createDateRange: [],
            isShowSpin: false,
            isAutoRefreshTable: true,
            arrCheck: [],
            pageSizeOpts: [10, 20, 50, 100],
            req: {
                size: 10,
                current: 1,
                startTime: "",
                endTime: "",
                operateType: "",
                handleStatus: "",
                tagName: "",
            },
            total: 0,
            tagOperateHistoryList: [],
            tagOperateHistoryTable: [
                {
                    key: "handleStatus",
                    title: "标签状态",
                    width: 100,
                    align: "center",
                },
                {
                    key: "tagId",
                    title: "标签 BID",
                    width: 200,
                    align: "left",
                },
                {
                    key: "tagName",
                    title: "标签名称",
                    width: 200,
                    align: "left",
                },
                {
                    key: "newsId",
                    title: "资讯 ID",
                    // sortable: true,
                    width: 180,
                    align: "left",
                    "row-class-name": "disabled-user-selection",
                    render: (h, params) => {
                        let newsId = params.row.newsId;
                        return h("a", {
                            attrs: {
                                title: "点击跳转到资讯处理列表!",
                            },
                            class: [
                                "audit-common-link",
                            ],
                            style: {
                                color: "#298DFF !important",
                                textDecoration: "none",
                                cursor: "pointer",
                                marginRight: "5px",
                            },
                            on: {
                                click: (e) => {
                                    let alink = e.target;
                                    alink.style.color = "red";
                                    let url = `/audit/news/all-in-one#${uid}`;
                                    this.getNewsListTypeById(uid);
                                },
                            }
                        }, newsId);
                    },
                },
                {
                    key: "category",
                    title: "标签分类(一级)",
                    width: 100,
                    align: "center",
                },
                {
                    key: "operateType",
                    title: "标签操作类型",
                    width: 100,
                    align: "center",
                },
                {
                    key: "creator",
                    title: "添加人",
                    width: 100,
                    align: "center",
                    render: (h, params) => {
                        let userName = params.row.creator;
                        if (userName) {
                            return h("div", [
                                h("Icon", {
                                    props: {
                                        name: "person"
                                    }
                                }),
                                h("strong", userName),
                            ]);
                        } else {
                            return h("div", [
                                h("strong", userName),
                            ]);
                        }
                    },
                },
                {
                    key: "createTime",
                    title: "添加时间",
                    width: 180,
                    align: "center",
                },
                {
                    key: "operation",
                    title: "操作",
                    width: 200,
                    align: "center",
                    fixed: "right",
                    render: (h, params) => {
                        let OperateList = [
                            {
                                operateDesc: "标记已处理",
                                operateType: 1,
                            },
                            {
                                operateDesc: "查看打标",
                                operateType: 2,
                            },
                            {
                                operateDesc: "删除",
                                operateType: 3,
                            },
                        ];
                        let links = [];
                        links = OperateList.map((obj, i) => {
                            let {
                                operateDesc: desc,
                                operateType: type,
                            } = obj;
                            let operateUrl = "";
                            let routerPath = "";
                            let showBtn = false;
                            switch (type) {
                                case 1:  //标记已处理
                                    operateUrl = `/tm/handleById`;
                                    routerPath = ``;
                                    showBtn = this.activeRoutersButton.indexOf('markHandled') != -1 ? true : false;
                                    break;
                                case 2:  // 查看打标
                                    operateUrl = `/tm/getNewsInfoById`;
                                    routerPath = `/audit/news/ambiguous-word-maintenance/operate-view`;
                                    showBtn = this.activeRoutersButton.indexOf('tagOperateHistoryDetail') != -1 ? true : false;
                                    break;
                                case 3:  // 删除
                                    operateUrl = `/tm/batchDelete`;
                                    routerPath = ``;
                                    showBtn = this.activeRoutersButton.indexOf('tagOperateHistoryDelete') != -1 ? true : false;
                                    break;
                                default:
                                    break;
                            }
                            if (showBtn) {
                                return h("a", {
                                    attrs: {
                                        "data-url": operateUrl,
                                        "data-type": type,
                                        // "disable": params.row.handleStatus == 1 ? true : false,
                                    },
                                    class: [
                                        "audit-common-link",
                                    ],
                                    style: {
                                        color: "#298DFF !important",
                                        textDecoration: "none",
                                        cursor: "pointer",
                                        marginRight: "5px",
                                    },
                                    on: {
                                        click: (e) => {

                                            if (type == 1) {
                                                this.handledById(params.row.id);
                                            };
                                            if (type == 3) {
                                                this.$hMsgBox.confirm({
                                                	isOkLeft:true,
                                                    title: '删除记录',
                                                    content: '确定要删除该条记录:' + params.row.tagName + '?',
                                                    onOk: () => {
                                                        let idArr = params.row.id.toString().split();
                                                        this.handleDelete(idArr);
                                                    }
                                                })
                                            };
                                        },
                                    }
                                }, desc);
                            }
                        }
                        );
                        return h("div", links);
                    },
                },
            ],
            deleteItem: {
                ids: []
            }
        }
    },
    methods: {
        // 时间范围选择框更改时间
        onChangeModDateRangePicker(values) {
            this.createDateRange = values;
            this.req.startTime = values[0];
            this.req.endTime = values[1];
        },
        cancelSelect(selection, row) {
            let index = this.arrCheck.indexOf(row.id);
            if (index != -1) {
                this.arrCheck.splice(index, 1);
            }
        },
        selectChange(selection) {
            let selectArr = selection;
            let selectArrId = [];
            selectArr.forEach((item, index) => {
                selectArrId.push(item.id)
            })
            if (selectArr.length == 0) {
                //翻页——全选取消选择
                this.tagOperateHistoryList.forEach((item, i) => {
                    let index = this.arrCheck.indexOf(item.id);
                    if (index != -1) {
                        this.arrCheck.splice(index, 1);
                    }
                });
                return;
            } else {
                for (let i = 0, len = this.arrCheck.length; i < len; i++) {
                    let index = selectArrId.indexOf(this.arrCheck[i]);
                    if (index != -1) {
                        selectArrId.splice(index, 1);
                    }
                }
                this.arrCheck = [...this.arrCheck, ...selectArrId];
            }
        },
        /*分页*/
        onPageChange(page) {
            this.req.current = page;
            this.getUserList();
        },
        changePageSize(size) {
            this.req.current = 1;
            this.req.size = size;
            this.getUserList();
        },
        onSearch() {
            this.req.current = 1;
            this.getUserList(true);
        },
        getUserList(emptyCheck) {
            if (this.isShowSpin) return;
            this.isShowSpin = true;
            let url = '/tm/getTagOperateHistoryInfos';
            let oTmp = this.req;
            this.$http.post(url, oTmp).then((res) => {
                this.isShowSpin = false;
                let obj = res.data;
                if (obj.status == this.$api.SUCCESS) {
                    let data = obj.body || {};
                    let list = data.records || [];
                    if (emptyCheck) {
                        this.arrCheck = [];
                    } else {
                        for (let i = 0, len = list.length; i < len; i++) {
                            if (this.arrCheck.indexOf(list[i].id) != -1) {
                                list[i]['_checked'] = true;
                            }
                        }
                    }
                    this.tagOperateHistoryList = list;
                    this.total = data.total || 0;
                } else {
                    this.$hMessage.error(obj.msg);
                }
            }).catch((err) => {
                this.isShowSpin = false;
                this.$hMessage.error('网络异常，获取标签增删统计信息数据失败！');
            });
        },
        delBatch() {
            if (this.arrCheck.length == 0) {
                this.$hMessage.info('请选择要删除的记录');
                return
            }
            this.$hMsgBox.confirm({
            	isOkLeft:true,
                title: '批量删除',
                content: '共' + this.arrCheck.length + '条记录，是否确认删除?',
                onOk: () => {
                    this.handleDelete(this.arrCheck)
                },
                onCancel: () => {
                },
            })
        },
        handleDelete(idArr) {
            let delStatus = false;
            if (delStatus) return
            let url = '/tm/batchRemoveByIds';
            this.$http.post(url, idArr).then((res) => {
                let data = res.data ? res.data : {};
                if (data.status == this.$api.SUCCESS) {
                    this.$hMessage.info({
                        content: '删除成功',
                        duration: 3
                    });
                    this.onSearch();
                } else {
                    this.$hMessage.error({
                        content: data.msg,
                        duration: 3
                    })
                }
                delStatus = true;
            }).catch(err => {
                delStatus = true;
                 this.$hMessage.error('网络异常，删除记录失败！');
            })
        },
        handledById(id) {
            let url = '/tm/handleById?id=' + id;
            this.$http.get(url).then((res) => {
                let data = res.data ? res.data : {};
                if (data.status == this.$api.SUCCESS) {
                    this.$hMessage.info({
                        content: '标记已处理！',
                        duration: 3
                    });
                    this.onSearch();
                } else {
                    this.$hMessage.error({
                        content: data.msg,
                        duration: 3
                    })
                }
            }).catch(err => {
                this.$hMessage.error('网络异常，标记为已处理失败！');
            })
        },
        onEmpty(name) {
            this.req[name] = '';
            this.$refs[name].focus();
        },
        onEmptyCheck() {
            this.arrCheck = [];
        }
    },
    created() {
        if (this.activeRoutersButton.indexOf('tagOperateHistoryDelBatch') != -1) {
            this.tagOperateHistoryTable.unshift(
                {
                    type: 'selection',
                    width: 50,
                    align: 'center',
                    fixed: 'left'
                },
            )
        }
    },
    mounted() {
        this.getUserList();
    }
}
</script>
<style type="text/css" scoped>
.h-checkbox-wrapper span + span {
  display: none;
}
.check {
  float: left;
  line-height: 24px;
  margin-right: 10px;
  color: red;
}
.check i {
  font-weight: 600;
  padding: 0 3px;
  font-style: normal;
}
</style>