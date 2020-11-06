<template>
    <div class="inform">
        <div class="inform_left">
            <ul>
                <li @click="typeFn('unread')" :class="type == 'unread' ? 'active' : '' ">未处理通知</li>
                <li @click="typeFn('all')" :class="type == 'all' ? 'active' : '' ">全部通知</li>
            </ul>
        </div>
        <div class="inform_right" v-if="type == 'unread' ">
            <div class="but_wrapper" v-if="unreadTotal != 0">
                <Button type="error" @click="onAllRemove('0',unreadNoticeTime, '删除全部')">删除全部</Button>
                <Button type="error" @click="setAllrRead(unreadNoticeTime)">全知道了</Button>
            </div>
            <div class="list_wrapper">
                <div class="list" v-for="(item,k) in unreadNoticeList">
                    <p>
                        通知内容：<span :class="{ 'unread' : !item.isRead }" v-html="item.noticeMessage"></span>
                    </p>
                    <p>
                        {{ item.createTime }}
                        <span class="but del" @click="onRemove(item.id)">删除</span>
                        <span class="but" v-if="item.isRead == 0" @click="got('unreadNoticeList',k)">知道了</span>
                    </p>
                </div>
                <div class="no-data" v-if="unreadTotal == 0">
                    暂无数据
                </div>
                <template v-else>
                    <h-page size="small" class="page-box" :total="unreadTotal" :current="unreadPage" :page-size="pageSize" showTotal @on-change="unreadChangePage"></h-page>
                </template>
            </div>
            <h-spin fix v-if="unreadLoading">
                <h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
                <div>加载中...</div>
            </h-spin>
        </div>
        <div class="inform_right" v-if="type == 'all' ">
            <div class="but_wrapper" v-if="allTotal != 0">
                <Button type="error" @click="onAllRemove('1',allNoticeTime, '删除全部已读')">删除全部已读</Button>
                <Button type="error" @click="setAllrRead(allNoticeTime)" >全知道了</Button>
            </div>
            <div class="list_wrapper">
                <div class="list" v-for="(item,k) in allNoticeList">
                    <p>
                        通知内容：<span :class="{ 'unread' : !item.isRead }" v-html="item.noticeMessage"></span>
                    </p>
                    <p>
                        {{ item.createTime }}
                        <span class="but del" @click="onRemove(item.id)">删除</span>
                        <span class="but" v-if="item.isRead == 0" @click="got('allNoticeList',k)">知道了</span>
                    </p>
                </div>
                <div class="no-data" v-if="allTotal == 0">
                    暂无数据
                </div>
                <template v-else>
                    <h-page size="small" class="page-box" :total="allTotal" :current="allPage" :page-size="pageSize" showTotal @on-change="allChangePage"></h-page>
                </template>
            </div>
            <h-spin fix v-if="allLoading">
                <h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
                <div>加载中...</div>
            </h-spin>
        </div>
    </div>
</template>
<script>
import utils from '@/utils/utils';
export default {
    name: 'Notice',
    data () {
        return {
            type: 'unread',
            pageSize: 7,
            unreadTotal: 0,
            unreadPage: 1,
            unreadNoticeList: [],
            unreadNoticeTime: '',
            unreadLoading: false,
            allTotal: 0,
            allPage: 1,
            allNoticeList: [],
            allNoticeTime: '',
            allLoading: false
        };
    },
    computed: {

    },
    methods: {
        typeFn( type ) {
            this.type = type;
            this.getNoticeCount();
            this.onTypeGetList();
        },
        onTypeGetList() {
            if (this.type == 'unread') {
                this.getUnreadNotice(true);
            } else {
                this.getAllNotice(true);
            }
        },
        onTyptLoading(status) {
            if (this.type == 'unread') {
                this.unreadLoading = status;
            } else {
                this.allLoading = status;
            }
        },
        got(name, k) {
            if (this.type == 'unread') {
                this.unreadLoading = true;
            }
            const list = [...this[name]];
            list[k].isRead = 1;
            const url = '/tm/notice/back/read?noticeId=' + list[k].id;
            this.$http.get(url).then((res) => {
                const obj = res.data;
                if (obj.status == this.$api.SUCCESS) {
                    list[k].isRead = 1;
                    this[name] = [...list];
                    this.getNoticeCount();
                    if (this.type == 'unread') {
                        this.getUnreadNotice(true);
                    }
                } else {
                    this.$hLoading.error(obj.message);
                }
            })
            .catch(err => {
                this.$hLoading.error('发生未知错误！');
            });
        },
        getNoticeCount() {
            if (window.getNoticeCount) {
                window.getNoticeCount();
            }
        },
        unreadChangePage(current) {
            this.unreadPage = current;
            this.getUnreadNotice();
        },
        allChangePage(current) {
            this.allPage = current;
            this.getAllNotice();
        },
        setAllrRead(time) {
            this.onTyptLoading(true);
            const url = '/tm/notice/back/read/all?max_time=' + time;
            this.$http.get(url).then((res) => {
                const obj = res.data;
                if (obj.status == this.$api.SUCCESS) {
                    this.onTypeGetList();
                    this.getNoticeCount();
                } else {
                    this.onTyptLoading(false);
                    this.$hLoading.error(obj.message);
                }
            })
            .catch(err => {
                this.onTyptLoading(false);
                this.$hLoading.error('发生未知错误！');
            });
        },
        onAllRemove(status, time, name) {
            const _this = this;
            this.$hMsgBox.confirm({
                title: '温馨提示',
                content: '确认要' + name + '通知吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: function() {
                    _this.setAllRemove(status, time);
                },
                onCancel: function() {
                }
            });
        },
        setAllRemove(status, time) {
            this.onTyptLoading(true);
            const url = '/tm/notice/back/remove/status?read_status=' + status + '&max_time=' + time;
            this.$http.get(url).then((res) => {
                const obj = res.data;
                if (obj.status == this.$api.SUCCESS) {
                    this.onTypeGetList();
                    this.getNoticeCount();
                } else {
                    this.onTyptLoading(false);
                    this.$hLoading.error(obj.message);
                }
            })
            .catch(err => {
                this.onTyptLoading(false);
                this.$hLoading.error('发生未知错误！');
            });
        },
        onRemove(id) {
            const _this = this;
            this.$hMsgBox.confirm({
                title: '温馨提示',
                content: '确认要删除通知吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: function() {
                    _this.setRemove(id);
                },
                onCancel: function() {
                }
            });
        },
        setRemove( id) {
            const url = '/tm/notice/back/remove?noticeId=' + id;
            this.onTyptLoading(true);
            this.$http.get(url).then((res) => {
                const obj = res.data;
                if (obj.status == this.$api.SUCCESS) {
                    this.onTypeGetList();
                    this.getNoticeCount();
                } else {
                    this.onTyptLoading(false);
                    this.$hLoading.error(obj.message);
                }
            })
            .catch(err => {
                this.onTyptLoading(false);
                this.$hLoading.error('发生未知错误！');
            });
        },
        getUnreadNotice( constraint = false) {
            if (this.unreadLoading && !constraint ) return;
            this.unreadLoading = true;
            const url = '/tm/notice/back/page?read_status=0&pagenum=' + this.unreadPage + '&pagesize=' + this.pageSize;
            this.$http.get(url).then((res) => {
                const obj = res.data;
                if (obj.status == this.$api.SUCCESS) {
                    const data = obj.data;
                    this.unreadNoticeTime = data.current_time;
                    this.unreadTotal = data.page.total ? data.page.total : 0;
                    const unreadNoticeList = data.page.list ? data.page.list : [];
                    if (this.unreadTotal && unreadNoticeList.length == 0) {
                        this.unreadPage = Math.ceil(this.unreadTotal / this.pageSize);
                        this.getUnreadNotice(true);
                        return;
                    }
                    this.unreadNoticeList = unreadNoticeList;
                    this.autoSkip();
                } else {
                    this.$hLoading.error(obj.message);
                }
                this.unreadLoading = false;
            })
            .catch(err => {
                this.unreadLoading = false;
            });
        },
        getAllNotice(constraint = false) {
            if (this.allLoading && !constraint ) return;
            this.allLoading = true;
            const url = '/tm/notice/back/page?read_status=-1&pagenum=' + this.allPage + '&pagesize=' + this.pageSize;
            this.$http.get(url).then((res) => {
                const obj = res.data;
                if (obj.status == this.$api.SUCCESS) {
                    const data = obj.data;
                    this.allNoticeTime = data.current_time;
                    this.allTotal = data.page.total ? data.page.total : 0;
                    const allNoticeList = data.page.list ? data.page.list : [];
                    if (this.allTotal && allNoticeList.length == 0) {
                        this.allPage = Math.ceil(this.allTotal / this.pageSize);
                        this.getAllNotice(true);
                        return;
                    }
                    this.allNoticeList = allNoticeList;
                    this.autoSkip();
                } else {
                    this.$hLoading.error(obj.message);
                }
                this.allLoading = false;
            })
            .catch(err => {
                this.allLoading = false;
            });
        },
        getNewsListTypeById(id = '') {
            const url = `/tm/getNewsInfoById?newsId=${id}`;
            this.$http
            .get(url)
            .then(res => res.data)
            .then((json) => {
                const {
                    status,
                    msg,
                    body
                } = json;
                if (status != this.$api.SUCCESS) {
                    this.$hMessage.error(msg);
                } else {
                    const {
                        dataType: newsListType
                    } = body;
                    const flipObj = {
                        newsId: id,
                        newsListType
                    };
                    const queryObj = {
                        type: newsListType,
                        desc: '处理',
                        uid: id,
                        url: '/tm/getNewsInfoById'
                    };
                    window.sessionStorage.setItem('all-in-one_flipObj_handle', JSON.stringify(flipObj));
                    window.sessionStorage.setItem('all-in-one_route_query_handle', JSON.stringify(queryObj));
                    const url = `/audit/news/all-in-one/operate-handle#${id}`;
                    this.$router.push(url);
                }
            }).catch(err => console.error('NewsListType error', err));
        },
        autoSkip() {
            setTimeout(() => {
                const alink = document.querySelectorAll('[data-alink="router"]');
                if (alink) {
                for (let i = 0; i < alink.length; i++) {
                    const flag = alink[i].dataset.isBind || false;
                        if (!flag) {
                            alink[i].dataset.isBind = true;
                            alink[i].addEventListener('click', () => {
                                const url = alink[i].dataset.link;
                                this.$router.push(url);
                                // let id = url.slice(38);
                                // this.getNewsListTypeById(id);
                            });
                        }
                    }
                }
            }, 100);
        }
    },
    mounted() {
        this.typeFn('unread');
    },
    activated() {
        this.onTypeGetList();
    }
};
</script>
<style type="text/css" scoped>
.inform{
    font-size: 0;
    height: 100%;
    border: 1px solid #ccc;
    position: relative;
}
.inform_left{
    width: 200px;
    display: inline-block;
    font-size: 12px;
    height: 100%;
    border-right: 1px solid #ccc;
    vertical-align: top;
    box-sizing: border-box;
    background: #f2f2f2;
}
.inform_left ul{

}
.inform_left li{
    line-height: 32px;
    padding-left: 15px;
    border-top: 1px solid #f2f2f2;
    border-bottom: 1px solid #f2f2f2;
    cursor: pointer;
}
.inform_left li:first-child{
    border-top: none;
}
.inform_left li.active{
    background: #f7f7f7;
    width: calc(100% + 1px);
    border-color: #ccc;
}
.inform_right {
    width: calc(100% - 200px);
    display: inline-block;
    font-size: 12px;
    vertical-align: top;
    padding: 15px;
    box-sizing: border-box;
    overflow-y: auto;
    height: 100%;
    position: relative;
}
.inform_right .list{
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
    line-height: 20px;
}
.inform_right .list:first-child{
    border-top: 1px solid #ccc;
}
.inform_right .list .unread{
    color: #000;
    font-weight: 700;
}
.inform_right .list .unread>>> [data-alink="router"]:hover{
    cursor: pointer;
    color: #298DFF;
}
.inform_right .list .but{
    display: none;
    float: right;
    margin-right: 15px;
    cursor: pointer;
}
.inform_right .list .but:hover{
    color: #298DFF;
    text-decoration: underline;
}
.inform_right .list:hover .but{
    display: block;
}
.inform_right .list .del:hover{
    color: #f30;
}
.but_wrapper{
    margin-bottom: 15px;
}
.no-data{
    padding: 15px;
}
</style>
