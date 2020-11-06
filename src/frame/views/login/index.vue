<template>
    <div class="login">
        <img src="@/assets/img/login-bg.png"/>
        <div class="login-box">
            <div class="login-content">
                <h-form :model="loginForm" ref="loginForm" :rules="ruleInline" class="card-box login-form">
                    <h4>恒生聚源生产平台</h4>
                    <h-form-item prop="username">
                        <h-input
                            type="text"
                            v-model="loginForm.username"
                            placeholder="用户名"
                            size="large"
                        ></h-input>
                    </h-form-item>
                    <h-form-item prop="password">
                        <h-input
                            type="password"
                            v-model="loginForm.password"
                            placeholder="密码"
                            size="large"
                            autocomplete="off"
                        ></h-input>
                    </h-form-item>
                    <h-form-item>
                        <h-checkbox v-model="isRememberUserName">保存用户名</h-checkbox>
                    </h-form-item>
                    <h-form-item>
                        <SlideCheck ref="slideCheck" :before="beforeCheck" @next="handleLogin"></SlideCheck>
                    </h-form-item>
                </h-form>
            </div>
        </div>
        <footer>@2019 恒生聚源</footer>
    </div>
</template>
<script type="text/javascript">
import store from '@/store';
import SlideCheck from '@/components/SlideCheck';
import { encrypt } from '@/filters';

export default {
    components: { SlideCheck },
    data() {
        return {
            source: '',
            isGetLogin: false,
            isRememberUserName: true,
            loginForm: {
                username: '',
                password: ''
            },
            ruleInline: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        };
    },
    methods: {
        handleLogin(checkCode) {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    if (this.isRememberUserName) {
                        localStorage.isRememberUserName = 'true';
                        localStorage.username = this.loginForm.username;
                    } else {
                        localStorage.isRememberUserName = 'false';
                        localStorage.username = '';
                    }
                    if (this.isGetLogin) return;
                    this.isGetLogin = true;
                    const loginData = {
                        username: this.loginForm.username,
                        password: encrypt(this.loginForm.password, '456789', 'encryption')
                    };
                    this.$http
                        .post('/tm/login', loginData, { headers: { captcha: checkCode } })
                        .then((res) => {
                            const obj = res.data;
                            localStorage.env = obj.env;
                            if (obj.status === this.$api.SUCCESS) {
                                this.getUserInfo();
                            } else {
                                this.$refs.slideCheck.load();
                                this.isGetLogin = false;
                                this.$hMessage.error(obj.msg);
                            }
                        })
                        .catch(() => {
                            this.$refs.slideCheck.load();
                            this.isGetLogin = false;
                            this.$hMessage.error('网络异常，登录失败！');
                        });
                } else {
                    // this.$hMessage.error('表单验证失败!');
                }
            });
        },
        getUserInfo() {
            this.$http
                .get('/tm/user/info')
                .then((res) => {
                    this.isGetLogin = false;
                    const obj = res.data;
                    if (obj.status === this.$api.SUCCESS) {
                        const data = obj.data;
                        if (!data.menu || data.menu.length === 0) {
                            this.$hMessage.error('您暂无权限！');
                            return;
                        }
                        // localStorage.trueUserName = "";
                        // window.localStorage.setItem(`user_data`, JSON.stringify(data));
                        data.user = data.user || {};
                        if (data.user.realName && data.user.id) {
                            window.localStorage.setItem('trueUserName', data.user.realName);
                            window.localStorage.setItem('trueUserId', data.user.id);
                        } else {
                            window.localStorage.setItem('trueUserName', '');
                            window.localStorage.setItem('trueUserId', '');
                        }
                        const userInfo = encodeURIComponent(JSON.stringify(data.user));
                        const userMenu = encodeURIComponent(JSON.stringify(data.menu));
                        const key = this.$md5(userInfo + 'key' + userMenu); // 校验cookie md5秘钥
                        store.commit('SET_LOGIN_STATUS', true);
                        store.commit('SET_USER_INFO', data.user);
                        store.commit('SET_USER_MENU', data.menu);
                        this.$cookie.set('userInfo', userInfo, '0', '/');
                        this.$cookie.set('userMenu', this.$md5(userMenu), '0', '/');
                        const time = new Date().getTime();
                        this.$cookie.set('time', time, { expires: '8h' }, '/');
                        localStorage.userMenu = userMenu;
                        this.$cookie.set('Key', key, '0', '/');
                        if (this.source) {
                            window.location.href = this.source;
                            this.$router.push({ path: this.source });
                        } else {
                            this.$router.push({ path: '/main' });
                            // window.location.href = '/home';
                        }
                    } else {
                        this.$hMessage.error(obj.msg);
                    }
                })
                .catch(() => {
                    this.isGetLogin = false;
                    this.$hMessage.error('网络异常，登录失败！');
                });
        },
        beforeCheck() {
            let value = false;
            this.$refs.loginForm.validate((valid) => {
                value = valid;
            });
            return value;
        }
    },
    mounted() {
        this.source = this.$route.query.g;
        this.isRememberUserName =
            localStorage.isRememberUserName === 'true';
        if (this.isRememberUserName) {
            this.loginForm.username = localStorage.username;
        }
    }
};
</script>
<style scoped>
.login {
    background: linear-gradient(-125deg, #dfe4ed, #dfe4ed);
    height: 100%;
    width: 100%;
    min-height: 500px;
    min-width: 980px;
    overflow: hidden;
    position: relative;
    color: #565656;
}

img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-720px, -261px);
}

footer {
    text-align: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    line-height: 32px;
    color: #ccc;
}

.login-box {
    width: 400px;
    height: 380px;
    position: absolute;
    background: rgba(255, 255, 255, 1);
    border-radius: 5px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    top: 50%;
    left: 50%;
    transform: translate(120px, -50%);
}

.login-content {
    margin-bottom: 40px;
}

.h-form-item {
    margin: 20px 30px 0;
}

h4 {
    padding: 38px 0 5px;
    font-size: 32px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 0;
    color: #2d92ff;
    font-weight: normal;
}

.login >>> .h-input-large {
    height: 42px;
}

.login >>> .h-form-item-content {
    line-height: 42px;
}

.login >>> .h-input-wrapper {
    height: 42px;
}

.login >>> .h-form-item-required .h-form-item-requiredIcon {
    line-height: 42px;
    height: 42px;
}

.login >>> .h-form-item-content .h-btn-primary {
    height: 42px;
    background-color: #2d92ff;
}

.login >>> .h-form-item-content .h-btn-primary:hover {
    background-color: #427ff4;
}

.login >>> .h-form-item-content .h-btn-primary:active {
    background-color: #1f5dd5;
}
</style>
<style type="text/css">
.login .login-box .h-input-group-prepend {
    background-color: #fff;
}
</style>
