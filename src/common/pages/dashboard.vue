<template>
  <div class="wrapper">
    <div class="test-Watermark" v-if="env == 1"></div>
    <div class="mian-top">
      <div class="main-left">
        <div class="logo">
          <img :src="env == 1 ? logoTestSrc : logoSrc" height="36" />
        </div>
        <ul class="system-nav">
          <li
            v-for="(itme, k) in navList"
            :class=" k == navIndex ? 'active' : ''"
            @click="changeSystem(k)"
            v-if="itme.menuCode != 'DEFAULT'"
          >{{ itme.title }}</li>
          <!-- <li>聚源企探</li> -->
        </ul>
      </div>
      <div class="user-info">
        <div class="msg" @click="log" title="升级日记" style="margin-right: 12px;">
          <img src="../assets/img/log.png" width="24" height="24" />
        </div>
        <div class="msg" @click="onNotice" :title="'未读消息'+ noticeCount +'条'">
          <i v-if="noticeCount > 0">{{ noticeCount > 99 ? '99+' : noticeCount }}</i>
          <img src="../assets/img/message.png" width="17" height="17" />
        </div>
        <div class="hr"></div>
        <div class="info">
          <h-dropdown @on-click="onLogout" placement="bottom-end">
            <ul class="ul">
              <li>
                <img src="../assets/img/user.png" width="24" height="24" />
              </li>
              <li>{{ userInfo && userInfo.realName ? userInfo.realName : userInfo.userName ? userInfo.userName : '' }}</li>
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
    <div class="box">
      <div :class="[showNav ? '' : 'hide-left', 'left']">
        <span class="tips-txt" @click="showNav = !showNav">{{ showNav ? '隐藏菜单' : '显示菜单' }}</span>
        <navbar
          :navList="navList[navIndex] && navList[navIndex].children ? navList[navIndex].children : []"
        ></navbar>
      </div>
      <div :class="[ isScreenFull ? 'full' : '','right']">
        <div class="top">
          <toptab></toptab>
        </div>
        <div class="scroll" id="scroll" ref="scroll">
          <app-main></app-main>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import navbar from "./system/common/navbar";
import toptab from "./system/common/toptab";
import appMain from "./system/common/appMain";
import store from "@/store";
import { mapState } from "vuex";
export default {
  components: { navbar, toptab, appMain },
  data() {
    return {
      time: 60,
      noticeCount: 0,
      isShowUpdatePass: false,
      noticeInfo: {},
      isScreenFull: false,
      navList: store.state.userMenu,
      navIndex: 0,
      timer: false,
      showNav: true,
      env: 0, //0正式 1测试
      logoSrc: require("../assets/img/logo.png"),
      logoTestSrc: require("../assets/img/logo-test.png")
    };
  },
  computed: mapState({
    userInfo: "userInfo",
    isLogined: "IsLogined"
  }),
  watch: {
    isLogined: function(val, oldVal) {
      if (val == false && oldVal == true) {
        //location.reload();
      }
    }
  },
  methods: {
    log() {
      this.$router.push({ path: "/log" });
    },
    onInfo() {
      this.$router.push({ path: "/user" });
    },
    onNotice() {
      this.$router.push({ path: "/notice" });
    },
    onLogout(name) {
      if (name == "Logout") {
        this.$hMsgBox.confirm({
          title: "确认退出登录",
          content: "",
          onOk: () => {
            store.dispatch("logout");
            window.location.href = "/login";
          },
          onCancel: () => {}
        });
      }
    },
    getNoticeCount() {
      let url = "/tm/notice/back/count?read_status=0";
      this.$http.get(url).then(res => {
        let obj = res.data;
        if (obj.status == this.$api.SUCCESS) {
          this.noticeCount = obj.data ? obj.data : 0;
        }
      });
    },
    closeScreenFull() {
      this.isScreenFull = false;
    },
    full() {
      this.isScreenFull = true;
      this.$hMessage.info("按ESC退出全屏");
    },
    changeSystem(k) {
      this.navIndex = k;
    },
    setTableHeight(val) {
      store.commit("SET_MAX_TABLE_HEIGHT", val);
    },
    getScrollHeight() {
      if (!this.timer) {
        let scrollHeight = this.$refs.scroll.offsetHeight;
        this.timer = true;
        let that = this;
        this.setTableHeight(Math.floor(scrollHeight - 100));
        setTimeout(function() {
          that.timer = false;
        }, 400);
      }
    }
  },
  created() {
    if (this.navList[0] && this.navList[0].menuCode == "DEFAULT") {
      this.navIndex = 1;
    }
  },
  mounted() {
    this.env = localStorage.env;
    this.getScrollHeight();
    window.addEventListener(
      "resize",
      () => {
        this.getScrollHeight();
      },
      false
    );
    window.getNoticeCount = this.getNoticeCount;
    this.getNoticeCount();
    setInterval(() => {
      this.getNoticeCount();
    }, this.time * 1000);
    let self = this;
    this.$nextTick(function() {
      document.addEventListener("keyup", function(e) {
        //此处填写你的业务逻辑即可
        if (e.keyCode == 27) {
          self.closeScreenFull();
        }
      });
    });
  }
};
</script>
<style type="text/css" scoped>
.box .right.full {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
.logo {
  vertical-align: top;
}
.logo img {
  margin-left: 15px;
  vertical-align: middle;
}
.user-info .info {
  vertical-align: top;
  display: inline-block;
  margin-right: 15px;
  height: 56px;
}
.user-info .info .ul {
  margin-top: 16px;
  height: 24px;
}
.user-info .info .ul li {
  display: inline-block;
  font-size: 14px;
  vertical-align: top;
  height: 24px;
  line-height: 24px;
  margin-right: 5px;
  color: #fff;
}
.user-info .hr {
  width: 1px;
  height: 36px;
  vertical-align: top;
  background: rgba(0, 0, 0, 0.1);
  margin: 8px 20px;
  display: inline-block;
}
.user-info li .iconfont {
  font-size: 12px;
}
.user-info .h-dropdown-item:first-child {
  border-radius: 4px;
}
.user-info .msg {
  display: inline-block;
  height: 24px;
  line-height: 24px;
  padding: 16px 0;
  vertical-align: top;
  position: relative;
  cursor: pointer;
}
.user-info .msg img {
  vertical-align: middle;
}
.user-info .msg i {
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
.wrapper {
  min-height: 500px;
  min-width: 1200px;
  height: 100%;
}
.wrapper .mian-top {
  /* min-width: 1200px; */
  height: 56px;
  line-height: 56px;
  width: 100%;
  background: #2e71f2;
  font-size: 0;
  display: flex;
  justify-content: space-between;
}
.wrapper .main-left{
	display: flex;
}
.wrapper .mian-top .logo {
  width: 200px;
  display: inline-block;
}
.wrapper .mian-top .system-nav {
  display: flex;
}
.wrapper .mian-top .system-nav li {
  padding: 0 28px;
  font-size: 14px;
  color: #fff;
  display: inline-block;
  cursor: pointer;
}
.wrapper .mian-top .system-nav .active {
  background: #0262da;
}
.wrapper .box {
  display: flex;
  width: 100%;
  height: calc(100% - 56px);
}
.left,
.top {
  transition: all 0.5s;
}
.box .left {
  width: 200px;
  height: 100%;
  border-right: 1px solid #dfdfdf;
  position: relative;
}
.box .left.hide-left {
  width: 0;
}
.box .left .tips-txt {
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
}
.box .left .tips-txt:hover {
  opacity: 1;
}
.box .right {
  flex-direction: column;
  display: flex;
  width: calc(100% - 200px);
  transition: all 0.5s;
}
.box .hide-left + .right {
  width: calc(100% - 1px);
}
.box .right .top {
  width: 100%;
  height: 33px;
  border-bottom: 1px solid #dfdfdf;
  box-sizing: border-box;
}
.box .right .contents {
  flex: 1;
  width: calc(100% - 30px);
  height: calc(100% - 30px);
  box-sizing: border-box;
  margin: 15px;
  border-radius: 2px;
}
.part_btns {
  float: right;
  height: 49px;
  line-height: 49px;
  margin-right: 20px;
}
.part_btns .h-menu-item,
.part_btns .h-menu-submenu {
  padding: 0 12px;
  border: 0 !important;
  color: #565656;
}
.part_btns .h-menu-item.h-menu-item-active {
  color: #565656;
}
.part_btns .h-menu-item:hover,
.part_btns .h-menu-submenu:hover {
  background-color: #f2f2f2;
  border: 0;
}
.part_btns:after {
  height: 0;
}
.h-icon-people {
  margin-right: 0;
}
.scroll {
  height: calc(100% - 33px);
  overflow-y: auto;
  background: #f7f7f7;
  width: 100%;
}
.drop-down {
  float: right;
}
.h-tooltip:hover .h-menu-item {
  color: #298dff;
}
.toptab {
  display: inline-block;
  width: calc(100% - 235px);
}
/* .info{
	display: inline-block;
	vertical-align: top;
	height: 49px;
	line-height: 49px;
	float: right;
	margin-right: 15px;
}
.info .text,.info .badge{
	vertical-align: top;
}
.badge{
	display: inline-block;
	width: 40px;
	height: 49px;
	position: relative;
	text-align: center;
}
.info .icon-mail{
	position: relative;
	top: -1px;
}
.info .iconfont{
	font-size: 19px;
	cursor: pointer;
} */
.logout {
  cursor: pointer;
}
.logout:hover {
  color: #f30;
  text-decoration: underline;
}
.info .badge .icon-mail_fill {
  color: #fda730;
  animation: myfirst 0.5s linear 0s infinite alternate;
  -moz-animation: myfirst 0.5s linear 0s infinite alternate; /* Firefox */
  -webkit-animation: myfirst 0.5s linear 0s infinite alternate; /* Safari 和 Chrome */
  -o-animation: myfirst 0.5s linear 0s infinite alternate; /* Opera */
}
@keyframes myfirst {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-moz-keyframes myfirst /* Firefox */ {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-webkit-keyframes myfirst /* Safari 和 Chrome */ {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-o-keyframes myfirst /* Opera */ {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.user-info {
  display: flex;
  float: right;
  height: 56px;
}
.test-Watermark {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  background: transparent url(../assets/img/test.png);
  opacity: 0.2;
  pointer-events: none;
}
</style>