<template>
    <div class="top-bar">
        <div class="top-bar-item">
            <div class="logo">
                <img :src="logoSrc" alt="logo">
            </div>
            <ul class="bar-ul">
                <template v-for="(item, index) in topMenuList">
                    <li v-if="item.menuCode !== 'DEFAULT'"
                        @click="activeMenuIndex = index"
                        :class="index === activeMenuIndex ? 'active' : ''"
                        :key="item.title"
                    >{{item.title}}</li>
                </template>
            </ul>
        </div>
        <div class="top-bar-item">
            <div class="update-log">
                <img title="升级日记"
                     src="@/assets/img/log.png"
                     width="24"
                     height="24"
                     alt="升级日记">
            </div>
            <div class="notice-count">
                <i v-if="noticeCount">{{ noticeCount > 99 ? '99+' : noticeCount }}</i>
                <img :title="'未读消息'+ noticeCount +'条'"
                     src="@/assets/img/message.png"
                     width="17"
                     height="17"
                     alt="未读消息">
            </div>
            <div class="col-line"></div>
            <div class="user-info">
                <h-dropdown @on-click="logout" placement="bottom-end">
                    <ul class="user-ul">
                        <li>
                            <img src="@/assets/img/user.png" width="24" height="24" />
                        </li>
                        <li>{{ (userInfo && userInfo.realName) ? userInfo.realName : (userInfo.userName ? userInfo.userName : '') }}</li>
                        <li>
                            <i class="icon-unfold iconfont"></i>
                        </li>
                    </ul>
                    <h-dropdown-menu slot="list">
                        <h-dropdown-item name="Logout">退出</h-dropdown-item>
                    </h-dropdown-menu>
                </h-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import utils from '@/utils/index';
export default {
    name: 'TopBar',
    data () {
        return {
            environment: 1, // 0正式 1测试
            noticeCount: 0, // 未读消息
            noticeInterval: null, // 新消息定时器
            activeMenuIndex: 0 // 当前选中的菜单索引
        };
    },
    props: {
        activeTopBarIndex: Number
    },
    watch: {
        activeTopBarIndex (value) {
            this.activeMenuIndex = value;
        },
        activeMenuIndex (value) {
            this.$emit('update:activeTopBarIndex', value);
        }
    },
    computed: {
        /**
         * logo 图片 根据当前环境显示
         */
        logoSrc () {
            return this.environment ? require('@/assets/img/logo-test.png') : require('@/assets/img/logo.png');
        },
        /**
         * 头部菜单列表
         */
        topMenuList () {
            return this.$store.state.userMenu;
        },
        ...mapState({
            userInfo: 'userInfo'
        })
    },
    mounted() {
        this.environment = localStorage.env;
        if (this.noticeInterval) {
            clearInterval(this.noticeInterval);
            this.noticeInterval = null;
        }
        this.getNoticeCount();
        this.noticeInterval = setInterval(() => {
            this.getNoticeCount();
        }, 60 * 1000);
    },
    beforeDestroy() {
        if (this.noticeInterval) {
            clearInterval(this.noticeInterval);
            this.noticeInterval = null;
        }
    },
    methods: {
        // 升级日志页面
        gotoLog () {
            this.$router.push({ path: '/log' });
        },
        // 消息页面
        gotoNotice () {
            this.$router.push({ path: '/notice' });
        },
        // 退出登录
        logout (name) {
            if (name === 'Logout') {
                this.$hMsgBox.confirm({
                    title: '确认退出登录',
                    content: '',
                    onOk: () => {
                        this.$store.dispatch('logout');
                        window.location.href = '/#/login';
                    },
                    onCancel: () => {}
                });
            }
        },
        // 获取消息
        getNoticeCount () {
            utils.requestNoticeCount((data) => {
                if (data && data.status === this.$api.SUCCESS) {
                    this.noticeCount = data.data ? data.data : 0;
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.top-bar{
    width: 100%;
    height: 56px;
    line-height: 56px;
    background: #2e71f2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .top-bar-item{
        display: flex;
        align-items: center;
        .logo{
            width: 200px;
            display: inline-block;
            img{
                height: 36px;
                margin-left: 15px;
                vertical-align: middle;
            }
        }
        .bar-ul{
            li{
                padding: 0 28px;
                font-size: 14px;
                color: #fff;
                display: inline-block;
                cursor: pointer;
                &.active{
                    background: #0262da;
                }
            }
        }
        .update-log{
            display: flex;
            align-items: center;
            margin-right: 12px;
            img{
                cursor: pointer;
            }
        }
        .notice-count{
            display: flex;
            align-items: center;
            position: relative;
            img{
                cursor: pointer;
            }
            i{
                font-size: 12px;
                border-radius: 50%;
                width: 18px;
                height: 18px;
                line-height: 18px;
                background: #f14c5d;
                display: inline-block;
                position: absolute;
                top: 10px;
                right: -8px;
                color: #fff;
                text-align: center;
                font-style: normal;
            }
        }
        .col-line{
            width: 1px;
            height: 36px;
            vertical-align: top;
            background: rgba(0, 0, 0, 0.1);
            margin: 8px 15px;
            display: inline-block;
        }
        .user-info{
            vertical-align: top;
            display: inline-block;
            padding-right: 15px;
            height: 56px;
            /deep/ .user-ul{
                margin-top: 16px;
                height: 24px;
                display: flex;
                cursor: pointer;
                li{
                    display: inline-block;
                    font-size: 14px;
                    vertical-align: top;
                    height: 24px;
                    line-height: 24px;
                    margin-right: 5px;
                    color: #fff;
                }
            }
        }
    }
}
</style>
