<template>
  <div class="login-box">
    <div class="login-container"
         @keyup.enter="handleLogin">
      <div class="login-weaper animated bounceInDown">
        <div class="login-left">
          <div class="login-time">
            {{time}}
          </div>
          <div class="left-img">
            <img class="img"
                 src="../../assets/img/logo.png"
                 alt="">
          </div>
          <p class="title">元器件库</p>
        </div>
        <div class="login-border">
          <div class="login-main">
            <h4 class="login-title">
              元器件库登陆
              <!--            <top-lang></top-lang>-->
            </h4>
            <el-form
              class="login-form"
              status-icon
              :rules="loginRules"
              ref="loginForm"
              :model="loginForm"
              label-width="0"
            >
              <el-form-item prop="username">
                <el-input
                  size="small"
                  @keyup.enter="handleLogin"
                  v-model="loginForm.username"
                  placeholder="用户名"
                >
                  <i slot="prefix" class="el-icon-user-solid"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  size="small"
                  @keyup.enter="handleLogin"
                  :type="passwordType"
                  v-model="loginForm.password"
                  auto-complete="new-password"
                  placeholder="密码"
                >
                  <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword"></i>
                  <i slot="prefix" class="el-icon-star-on"></i>
                </el-input>
              </el-form-item>
              <!--
              <el-form-item prop="captcha">
                <div style="display: flex">
                  <el-input
                    size="small"
                    @keyup.enter="handleLogin"
                    v-model="loginForm.captcha"
                    placeholder="验证码"
                  >
                    <i slot="prefix" class="el-icon-s-goods"></i>
                  </el-input>
                  <img style="width: 140px;cursor: pointer" @click="getCaptcha" v-if="captchaImg" :src="captchaImg">
                </div>
              </el-form-item>
              -->
              <el-form-item>
                <el-button
                  type="primary"
                  size="small"
                  @click.native.prevent="handleLogin"
                  class="login-submit"
                >登录
                </el-button>
              </el-form-item>
            </el-form>
          </div>

        </div>
      </div>
    </div>
<!--    <div class="foot-text">-->
<!--      <a data-v-42b89d7e="" href="http://www.beian.miit.gov.cn" target="_blank">@2018-2021-云恒制造-苏ICP备18056041号-1 版权所有-->
<!--        @南京云恒信息技术有限公司</a>-->
<!--    </div>-->
  </div>
</template>

<script>
  import api from "@/api/user/user";
  import Cookies from "js-cookie";

  export default {
    name: "Login",
    data() {
      return {
        time: "",
        loginForm: {
          username: "",
          password: "",
          captcha:'',
          key: "",
        },
        captchaImg:'',
        loginRules: {
          username: [
            {required: true, message: "请输入用户名", trigger: "blur"}
          ],
          password: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {min: 1, message: "密码长度最少为6位", trigger: "blur"}
          ]
        },
        passwordType: "password"
      };
    },
    created() {
      this.getTime();
      //this.getCaptcha()
      setInterval(() => {
        this.getTime();
      }, 1000);
    },
    mounted() {
    },
    methods: {
      showPassword() {
        this.passwordType == ""
          ? (this.passwordType = "password")
          : (this.passwordType = "");
      },
      getTime() {
        this.time = this.$root.$options.filters.datetime(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss');
      },
      getCaptcha(){
        api
          .getCaptcha()
          .then(res => {
            const {key,url}=res.data
            this.captchaImg=url
            this.loginForm.key=key
          })
          .catch(e => {
            this.captchaImg=''
            this.loginForm.key=''
          });
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: "登录中,请稍后。。。",
              spinner: "el-icon-loading"
            });
            api
              .login(this.loginForm)
              .then(res => {
                Cookies.set(location.host+'-token', res.access_token);
                Cookies.set(location.host+'-refreshToken', res.refresh_token);
                let redirect = this.$route.query.redirect;
                if (redirect) {
                  this.$router.push({path: redirect});
                } else {
                  this.$router.push({path: "/index"});
                }
                loading.close()
              })
              .catch(e => {
                console.log(e)
                //this.getCaptcha()
                loading.close()
              });
          }
        });
      }
    }
  };
</script>

<style lang="less">
  .login-container {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background: url(../../assets/img/cloud.jpg) 0 bottom repeat-x #049ec4;
    animation: animate-cloud 20s linear infinite;
  }

  .login-weaper {
    margin: 0 auto;
    width: 1000px;
    box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);

    .el-input-group__append {
      border: none;
    }
  }

  .login-left,
  .login-border {
    position: relative;
    min-height: 500px;
  }

  .login-left {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    justify-content: center;
    flex-direction: column;
    background-color: #409EFF;
    color: #fff;
    float: left;
    width: 50%;
    position: relative;
    >.left-img{
      width: 100%;
      text-align: center;
      position: absolute;
      top: 40%;
      transform: translateY(-40%);
      .img {
        width: 60px;
      }
    }
  }


  .login-time {
    position: absolute;
    left: 25px;
    top: 25px;
    width: 100%;
    color: #fff;
    font-weight: 200;
    opacity: 0.9;
    font-size: 18px;
    overflow: hidden;
  }

  .login-left .title {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    width: 100%;
    color: #fff;
    font-weight: 300;
    letter-spacing: 2px;
    font-size: 25px;
  }

  .login-border {
    border-left: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    color: #fff;
    background-color: #fff;
    width: 50%;
    float: left;
    box-sizing: border-box;
    position: relative;
  }

  .login-main {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 17.5%;
    width: 65%;
    box-sizing: border-box;
  }

  .login-main > h3 {
    margin-bottom: 20px;
  }

  .login-main > p {
    color: #76838f;
  }

  .login-title {
    color: #333;
    margin-bottom: 40px;
    font-weight: 500;
    font-size: 22px;
    text-align: center;
    letter-spacing: 4px;
  }

  .login-menu {
    margin-top: 40px;
    width: 100%;
    text-align: center;

    a {
      color: #999;
      font-size: 12px;
      margin: 0px 8px;
    }
  }

  .login-submit {
    width: 100%;
    height: 45px;
    border: 1px solid #409EFF;
    background: none;
    font-size: 18px;
    letter-spacing: 2px;
    font-weight: 300;
    color: #409EFF;
    cursor: pointer;
    margin-top: 30px;
    font-family: "neo";
    transition: 0.25s;
  }

  .login-form {
    margin: 10px 0;

    i {
      color: #333;
    }

    .el-form-item__content {
      width: 100%;
    }

    .el-form-item {
      margin-bottom: 12px;
    }

    .el-input {
      input {
        padding-bottom: 10px;
        text-indent: 5px;
        background: transparent;
        border: none;
        border-radius: 0;
        color: #333;
        border-bottom: 1px solid rgb(235, 237, 242);
      }

      .el-input__prefix {
        i {
          padding: 0 5px;
          font-size: 16px !important;
        }
      }
    }
  }

  .login-code {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 0 0 0 10px;
  }

  .login-code-img {
    margin-top: 2px;
    width: 100px;
    height: 38px;
    background-color: #fdfdfd;
    border: 1px solid #f0f0f0;
    color: #333;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 5px;
    line-height: 38px;
    text-indent: 5px;
    text-align: center;
  }

  .login-box {
    display: flex;
    flex-flow: column;
    height: 100%;
    width: 100%;

    .foot-text {
      line-height: 45px;
      text-align: center;
      flex: 1;
      background-color: #333;

      > a {
        font-size: 14px;
        color: #999
      }
    }
  }

  @keyframes animate-cloud {
    from {
      background-position: 600px 100%;
    }
    to {
      background-position: 0 100%;
    }
  }

  @-o-keyframes animate-cloud {
    from {
      background-position: 600px 100%;
    }
    to {
      background-position: 0 100%;
    }
  }

  @-webkit-keyframes animate-cloud {
    from {
      background-position: 600px 100%;
    }
    to {
      background-position: 0 100%;
    }
  }

  @-moz-keyframes animate-cloud {
    from {
      background-position: 600px 100%;
    }
    to {
      background-position: 0 100%;
    }
  }

  @-ms-keyframes animate-cloud {
    from {
      background-position: 600px 100%;
    }
    to {
      background-position: 0 100%;
    }
  }

  @-o-keyframes animate-cloud {
    from {
      background-position: 600px 100%;
    }
    to {
      background-position: 0 100%;
    }
  }
</style>

