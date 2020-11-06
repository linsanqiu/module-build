<template>
    <div class="app-layout">
        <div class="app-layout-top">
            <top-bar></top-bar>
        </div>
        <div class="app-layout-main">
            <!-- 侧边栏 -->
            <!--            <sidebar class="app-layout-slide"></sidebar>-->
            <!-- 中间区域 -->
            <div class="main-container">
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

export default {
    name: 'AppLayout',
    components: {
        AppMain,
        TopBar
    },
    data() {
        return {
            isShowNoticeBar: false
        };
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
    }
}
</style>
