<template>
    <div class="app-layout">
        <div class="app-layout-top">
            <top-bar :activeTopBarIndex.sync="activeTopBarIndex"></top-bar>
        </div>
        <div class="app-layout-container">
            <!-- 侧边栏 -->
            <side-bar :class="{'hide': !isShowSideBar}"
                      :show.sync="isShowSideBar"
                      :sideBarList="sideBarList"
                      class="app-layout-slide"></side-bar>
            <!-- 中间区域 -->
            <div class="app-layout-content">
                <!-- 面包屑导航栏 -->
                <nav-bar class="app-layout-nav"></nav-bar>
                <!-- 内容 -->
                <app-main class="app-layout-main" ref="appMain"></app-main>
                <!--公告-->
                <div v-if="isShowNoticeBar"></div>
            </div>
        </div>
    </div>
</template>

<script>
import AppMain from './AppMain';
import TopBar from './TopBar';
import SideBar from './SideBar';
import NavBar from './NavBar';

export default {
    name: 'AppLayout',
    components: {
        AppMain,
        TopBar,
        SideBar,
        NavBar
    },
    data() {
        return {
            activeTopBarIndex: 0, // 顶部选中菜单
            isShowSideBar: true, // 显示侧边栏
            isShowNoticeBar: false // 显示消息提示栏
        };
    },
    computed: {
        // 侧边栏列表
        sideBarList () {
            const list = this.$store.state.userMenu && this.$store.state.userMenu[this.activeTopBarIndex];
            return (list && list.children) || [];
        }
    }
};
</script>

<style lang="scss" scoped>
.app-layout {
    min-height: 500px;
    min-width: 1200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    .app-layout-top{
        height: 56px;
    }
    .app-layout-container{
        flex: auto;
        display: flex;
        height: calc(100% - 56px);
        .app-layout-slide{
            width: 200px;
            min-width: 200px;
            height: 100%;
            transition: all 0.5s;
            &.hide{
                width: 0;
                min-width: 0;
            }
        }
        .app-layout-content{
            flex: auto;
            height: 100%;
            .app-layout-nav{
                height: 33px;
            }
            .app-layout-main{
                height: calc(100% - 33px);
                overflow: auto;
            }
        }
    }
}
</style>
