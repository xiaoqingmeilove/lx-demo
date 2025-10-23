<template>
  <div class="login-page">
      <div class="login_logo">
        <!-- <img class="login_logo_logo" :src="require(`/static/images/proc/logo.png`)" alt="img"> -->
        <img class="login_logo_logo" v-if="theme.loginLogo" :src="theme.loginLogo" />
        <img class="login_logo_logoBG" :src="require(`/static/images/proc/logoBG.png`)" alt="img">
      </div>
      <div class="login_aside">
        <div class="aside_nav">{{theme.loginTitle}}</div>
        <div class="aside_spec">{{theme.loginEnTitle}}</div>
        <div class="aside_title">{{theme.welcomeTitle}}</div>
        <div class="login_box">
          <el-input
            v-model="username"
            class="login-form-input"
            prefix-icon="el-icon-s-custom"
            placeholder="请输入用户名"
          ></el-input>
          <el-input
            v-model="password"
            type="password"
            class="login-form-input"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
          ></el-input>
          <!-- <el-input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            class="login-form-input"
            prefix-icon="el-icon-lock"
            suffix-icon="el-icon-view"
            placeholder="请输入密码"
            @suffix-click="toggleShowPassword"
          ></el-input>-->
          <div class="login-form-item captcha">
            <div class="login-form-wrapper">
              <el-input
                v-model="code"
                class="captcha-input"
                placeholder="请输入计算结果"
              ></el-input>
            </div>
            <img class="captcha-img" :src="captchaImg" @click="getCaptcha" />
          </div>
          <div class="password_box">
            <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
            <div class="forget" @click="toReset">忘记密码</div>
          </div>
          <button class="login-btn" @click="login" :disabled="loading">
            {{ loading ? "正在登录" : "登录" }}
          </button>
          <div class="register" @click="toregister">供应商注册</div>
        </div>
      </div>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import ModifyPassword from "@/layout/components/ModifyPassword";
  import { getFirstMenu } from "@/utils/menu";

  import { ApiUser } from '@/apis'

  const apiUser = new ApiUser()

  export default {
    name: 'login',
    components: {
      ModifyPassword
    },
    data() {
      return {
        forceCode: null,
        passwdModalVisable: false,
        showPassword:false,
        rememberMe:false,
        username: "",
        password: "",
        code: "",
        codeSign: "",
        captchaImg: "",
        tabItems: [
          { name: "密码登录", key: "pwd" },
          //{ name: "免密登录", key: "nopwd" },
        ],
        actived: "pwd",
        loading: false,
      };
    },
    computed: {
      ...mapState({
        latestUser: (state) => state.latestUser || "",
        theme: state => state.Theme.theme || {}
      }),
      isActived() {
        return (item) => {
          return this.actived === item.key ? "login-tab-item--actived" : "";
        };
      },
    },
    created() {
        const savedRememberMe = localStorage.getItem('rememberMe');
        if (savedRememberMe) {
          this.rememberMe = savedRememberMe === 'true';
          const savedUsername = localStorage.getItem('username');
          const savedPassword = localStorage.getItem('password');
          if (savedUsername && savedPassword) {
            this.username = savedUsername
            this.password = savedPassword
          }
        }
    },
    mounted() {
      this.username = this.latestUser;
      this.getCaptcha();
      document.addEventListener("keydown", this.onKeydown);
    },
    destroyed() {
      document.removeEventListener("keydown", this.onKeydown);
    },
    methods: {
      ...mapMutations(["setLatestUser"]),
      ...mapActions("User", ["userLogin"]),

      onKeydown(e) {
        const { key } = e;
        if (key === "Enter") {
          if (this.actived === "pwd") {
            this.login();
          }
        }
      },
      toggleShowPassword() {
        this.showPassword = !this.showPassword;
      },
      toReset(){
        this.$router.push(`/login/resetpassword`)
      },
      toregister(){
        this.$router.push(`/login/register`)
      },
      async getCaptcha() {
        this.codeSign = String(new Date().getTime());
        const res = await apiUser.captcha(this.codeSign);
        this.captchaImg = `data:image/png;base64,${res.data?.img}`;
      },
      async login() {
        if (this.loading) return;
        if (this.rememberMe) {
          localStorage.setItem('username', this.username);
          localStorage.setItem('password', this.password);
          localStorage.setItem('rememberMe', true);
        } else {
          localStorage.removeItem('username');
          localStorage.removeItem('password');
          localStorage.removeItem('rememberMe');
        }
        this.loading = true;
        const res = await this.userLogin({
          code: this.code.toUpperCase(),
          codeSign: this.codeSign,
          password: this.password,
          username: this.username,
        });
        this.loading = false;
        if (res.code === 0) {
          const firstMenu = getFirstMenu(res.menus ?? []);
          if (firstMenu) {
            this.setLatestUser(this.username);
            this.$message.success(res.msg);
            this.$loading({
            lock: true,
            text: "登录中",
            spinner: "el-icon-loading",
          });
            location.hash = 'homePage'
            location.reload(true);
          } else {
            this.$message.error("获取菜单失败,登录失败!");
          }
        } else if(res.code === 1001) {
          this.forceCode = res.data.token;
          this.passwdModalVisable = true;
        } else {
          this.$message.error(res.msg);
        }
      },

      onTabItemClick(item) {
        if (this.loading) return;
        this.actived = item.key;
      },
    },
  }
</script>

<style lang="less">
.login-page {
  position: relative;
  width: 100%;
  height: 100%;
  // background: url('/images/login_bg.jpg') no-repeat;
  background-size: cover;
  background-repeat: no-repeat;
  overflow: auto;
  display: flex;
  .login_logo{
    flex: 1;
    height: 100%;
    background: #99C3FF;
    position: relative;
    .login_logo_logo{
      position: absolute;
      width: 230px;
      height: auto;
      object-fit: cover;
      left: 50px;
      top: 50px;
    }
    .login_logo_logoBG{
      position: absolute;
      width: 681px;
      height: 544px;
      top: 250px;
      left: calc(50% - 340px);
    }
  }
  .login_aside{
    width: 545px;
    height: 100%;
    background: #fff;
    .aside_nav{
      width: calc(100% - 96px);
      margin-left: 48px;
      height: 48px;
      text-align: left;
      line-height: 48px;
      font-weight: 600;
      color: #409EFF;
      font-size: 30px;
      margin-top: 150px;
      letter-spacing: 11px;
      white-space: nowrap;
    }
    .aside_spec{
      width: calc(100% - 96px);
      margin-left: 48px;
      height: 22px;
      text-align: left;
      line-height: 22px;
      font-weight: 400;
      color: #409EFF;
      font-size: 16px;
    }
    .aside_title{
      width: calc(100% - 96px);
      margin-left: 48px;
      margin-top: 50px;
      height: 22px;
      text-align: left;
      line-height: 22px;
      font-weight: 500;
      color: #409EFF;
      font-size: 24px;
    }
    .login_box{
      width: calc(100% - 96px);
      margin-left: 48px;
      margin-top: 60px;
      .login_box_item{
        width: 100%;
        height: 24px;
        margin-top: 40px;
        font-size: 14px;
        color: #409EFF;
        font-weight: 600;
      }
      .login-form-input{
        width: 100%;
        height: 45px;
        margin-bottom: 30px;
        border-radius: 4px;
        font-size: 14px;
        > input {
          height: 100%;
          line-height: 1;
          padding-left: 36px;
        }
        .el-input__prefix {
          font-size: 20px;
          .el-input__icon {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
      .login-form-item {
        display: flex;
        align-items: center;
      .login-form-wrapper {
        flex: 1;
        width: 0;
        height: 100%;
      }
      .login-form-input {
        height: 50px;
        > input {
          height: 100%;
          line-height: 1;
          padding-left: 36px;
        }
        .el-input__prefix {
          font-size: 20px;
          .el-input__icon {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
      .login-form-input.captcha-input {
        height: 32px;
        > input {
          padding-left: 15px;
        }
      }
      .captcha-img {
        width: 99px;
        height: 32px;
        margin-left: 19px;
        cursor: pointer;
      }
    }
    .login-form-item.captcha {
      .login-form-wrapper {
        flex: none;
        width: 134px;
      }
    }
      .password_box{
        width: 100%;
        height: 24px;
        display: flex;
        margin-top: 8px;
        justify-content: space-between;
        .forget{
          font-size: 14px;
          color: #409EFF;
          cursor: pointer;
        }
      }
    .login-btn {
      display: block;
      margin-top: 50px;
      position: relative;
      width: 100%;
      height: 60px;
      //background: var(--login-button-color);
      background: #409EFF;
      border-radius: 4px;
      color: var(--login-base-color);
      border: none;
      font-size: 26px;
      cursor: pointer;
      letter-spacing: 8px;
    }
    .login-btn[disabled] {
      cursor: not-allowed;
      &::after {
        display: block;
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.3);
        border-radius: inherit;
      }
    }
    .register{
      width: 100%;
      height: 20px;
      font-size: 14px;
      color: #409EFF;
      text-align: center;
      margin-top: 10px;
      cursor: pointer;
    }
    }
  }
}
</style>
