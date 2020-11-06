<template>
    <div class="app-layout">
        <div class="app-layout-top">
            <top-bar :activeTopBarIndex.sync="activeTopBarIndex"></top-bar>
        </div>
        <div class="app-layout-main">
            <!-- 侧边栏 -->
            <side-bar :class="{'hide': !isShowSideBar}"
                      :show.sync="isShowSideBar"
                      :sideBarList="sideBarList"
                      class="app-layout-slide"></side-bar>
            <!-- 中间区域 -->
            <div class="app-layout-container">
                <!-- 面包屑导航栏 -->
                <!--                <navbar></navbar>-->
                <!-- 内容 -->
                <app-main ref="appMain"></app-main>
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

export default {
    name: 'AppLayout',
    components: {
        AppMain,
        TopBar,
        SideBar
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
    .app-layout-main{
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
        .app-layout-container{
            flex: auto;
            height: 100%;
            overflow: scroll;
        }
    }
}
</style>
