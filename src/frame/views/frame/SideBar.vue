<template>
    <div class="side-bar">
        <span class="tips-txt" @click="changeShow">{{ show ? '隐藏菜单' : '显示菜单' }}</span>
        <div class="side-bar-container">
            <vue-scroll>
                <template v-for="(item, index) in sideBarList">
                    <dl :key="index"
                         v-if="item.menuCode !== 'Home' && item.menuCode !== 'Notice'"
                         :class="{'active': openNames.indexOf(item.menuCode) !== -1 }"
                         class="side-item">
                        <template v-if="item.type === '1'">
                            <dt @click="clickParentOption(item.menuCode)">
                                <span>
                                    <h-icon :name="item.menuIcon" v-if="item.menuIcon "></h-icon>
                                </span>{{ item.title }}<i class="h-icon iconfont icon-unfold"></i>
                            </dt>
                            <dd v-if="(item.children && item.children.length>0 && item.type !== '2')">
                                <ul>
                                    <li v-for="option in item.children"
                                        :key="option.menuCode"
                                        @click="gotoPush(routers[option.menuCode] ? routers[option.menuCode].url : '')"
                                        :class=" routers[option.menuCode] && activeMenuPath === routers[option.menuCode].url ? 'active' : ''">{{ option.title }}</li>
                                </ul>
                            </dd>
                        </template>
                        <template v-else-if="item.type === '2'">
                            <dt @click="gotoPush(routers[menu.menuCode] ? routers[menu.menuCode].url : '')"
                                :class="routers[menu.menuCode] && activeMenuPath === routers[menu.menuCode].url ? 'active' : ''">{{ item.title }}</dt>
                        </template>
                    </dl>
                </template>
            </vue-scroll>
        </div>
    </div>
</template>

<script>
import store from '@/store';
import router from '@/router/router';
export default {
    name: 'SideBar',
    props: {
        show: Boolean,
        sideBarList: Array
    },
    data () {
        return {
            openNames: [],
            activeMenuPath: '', //
            routers: router // 路由信息
        };
    },
    watch: {
        sideBarList: {
            deep: true,
            immediate: true,
            handler (data) {
                console.log(data);
                this.openSideOption();
            }
        }
    },
    methods: {
        // 点击父选项卡
        clickParentOption (menuCode) {
            const index = this.openNames.indexOf(menuCode);
            if (index === -1) {
                this.openNames.push(menuCode);
            } else {
                this.openNames.splice(index, 1);
            }
        },
        // 点击选项打开子页面
        gotoPush (path) {
            this.$router.push(path);
        },
        // 默认打开侧边栏选项卡
        openSideOption() {
            this.openNames = [];
            const activeMenuPath = store.state.ActiveMenuPath;
            let isBreak = false;
            const openSide = store.state.openMenu;
            if (openSide.length === 0) {
                for (let i = 0, len = this.sideBarList.length; i < len; i++) {
                    const item = this.sideBarList[i];
                    if (item.children) {
                        for (let k = 0; k < item.children.length; k++) {
                            const url = router[item.children[k].menuCode] ? router[item.children[k].menuCode].url : '';
                            if (activeMenuPath === url) {
                                this.openNames.push(item.menuCode);
                                isBreak = true;
                                break; //
                            }
                        }
                    }
                    if (isBreak) {
                        break;
                    }
                }
            } else {
                this.openNames = openSide;
            }
            setTimeout(() => {
                this.$set(this, 'activeMenuPath', store.state.ActiveMenuPath);
            }, 10);
        },
        // 显示隐藏侧边栏
        changeShow () {
            this.$emit('update:show', !this.show);
        }
    }
};
</script>

<style lang="scss" scoped>
.side-item dt:hover,.side-item li:hover{
    background: #f6f6f6;
}
.side-bar{
    position: relative;
    border-right: 1px solid #dfdfdf;
    box-sizing: border-box;
    .tips-txt{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: -24px;
        width: 24px;
        border: 1px solid #dfdfdf;
        padding: 8px 0;
        border-radius: 0 4px 4px 0;
        text-align: center;
        z-index: 10;
        background: #fff;
        cursor: pointer;
        line-height: 1;
        opacity: 0.5;
        &:hover{
            opacity: 1;
        }
    }
    .side-bar-container{
        height: 100%;
        background: #fff;
        overflow: hidden;
        /deep/ .side-item{
            dt{
                height: 40px;
                line-height: 40px;
                padding: 0 20px;
                position: relative;
                cursor: pointer;
                font-size: 13px;
                span{
                    display: inline-block;
                    width: 25px;
                }
                i{
                    position: relative;
                    top: 2px;
                }
                .icon-unfold{
                    transition: transform 0.2s ease-in-out;
                    position: absolute;
                    right: 10px;
                    top: 0;
                }
            }
            dd{
                transition: transform 0.2s ease-in-out;
                display: none;
                ul{
                    li{
                        line-height: 35px;
                        height: 35px;
                        padding: 0 20px;
                        cursor: pointer;
                        color: #666;
                        text-indent: 25px;
                        font-size: 12px;
                    }
                }
            }
            &.active{
                background: #f6f6f6;
                dd{
                    display: block;
                }
                dt{
                    span{
                        color: #2E71F2;
                    }
                    .icon-unfold{
                        transform:rotate(180deg);
                        -webkit-transform:rotate(180deg);
                        -moz-transform:rotate(180deg);
                    }
                }
            }
        }
    }
}
</style>
