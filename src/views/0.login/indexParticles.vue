<template>
  <div class="login-container">
    <Particles />

    <div class="login-form">
      <div class="titleDiv">
        <b class="title">{{ customerName }}</b>
        <br>
        <b class="titleBottom">SMB整合系統</b>
      </div>
      <hr>
      <div class="divForm">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" autocomplete="on" label-position="left">
          <div class="title-container" />

          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="帳號"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
              style="font-size:22px"
            />
          </el-form-item>

          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="密碼"
                name="password"
                tabindex="2"
                autocomplete="on"
                style="font-size:22px"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-tooltip>

          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;font-size: 22px;" @click.native.prevent="handleLogin">登入</el-button>
        </el-form>

        <el-dialog title="Or connect with" :visible.sync="showDialog">
          Can not be simulated on local, so please combine you own business simulation! ! !
          <br>
          <br>
          <br>
          <social-sign />
        </el-dialog>
      </div>
    </div>

    <div class="footer">
      <span class="footer-text">Powered by</span>
      <img v-if="sunstige_logo" :src="sunstige_logo" class="footer-logo">
      <span class="footer-text">SUNSTIGE</span>
    </div>
  </div>

</template>

<script>
import Particles from './components/Particles'
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  components: { Particles },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      sunstige_logo: require(`@/assets/brand/logo_s.png`),
      loginForm: {
        username: 'admin',
        password: ''// 密碼預設為SunPass69650133
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},

      customerName: loginPageCustomerName
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-image: linear-gradient(to bottom, #000000, #18324A);
  overflow: hidden;

  .login-form {
    top:40%;
    left:50%;
    transform: translate(-50%, -50%);
    position: absolute;
    width: 896px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }

  /** Logo */
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    padding-bottom: 5px;
    padding-right: 10px;
    text-align: right;
  }

  .footer-logo {
    display: inline-block;
    height: 24px;
  }

  .footer-text{
    font-size: 22px;
    color: #FFFFFF;
  }
}

.titleDiv{
    position: absolute;
    top:55%;
    left:15%;
    text-align: center;
}

.title {
  font-size: 46px;
  color: #FFFFFF;
  margin: 0px auto 40px auto;
  text-align: center;
  font-weight: 700;
  letter-spacing: 10px;
}

.titleBottom{
  color: #FFFFFF;
  letter-spacing: 8px;
  text-align: center;
  line-height:30px;
  font-size: 22px;
}

.divForm{
    position: absolute;
    top:50%;
    left:55%;
    width: 40%;
}

hr{
 height:45vh;
 width:0.05vw;
 border-width:0;
 background-color:	#FFFFFF;
}
</style>
