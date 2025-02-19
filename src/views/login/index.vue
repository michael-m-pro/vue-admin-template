<template>
  <div v-if="!showQrCode" class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Login In</h3>
      </div>

      <div class="title-text">
        <span>Email or Username</span>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Email or Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <div class="title-text">
        <span>Password</span>
      </div>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <div class="title-text">
        <label>Google Authenticator 2FA token</label>
      </div>
      <el-form-item prop="googleCode">
        <span class="svg-container">
          <svg-icon icon-class="key" />
        </span>
        <el-input
          ref="googleCode"
          v-model="loginForm.googleCode"
          type="text"
          placeholder="Google Authenticator 2FA token (6 digits)"
          name="googleCode"
          tabindex="3"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

    </el-form>

  </div>

  <div v-else class="login-container">
    <el-form ref="GAForm" :model="GAForm" :rules="GARules" class="login-form" label-position="left">
      <div class="title-container">
        <h3 class="title">Add Google Authenticator</h3>
      </div>

      <div class="title-text">
        <label>Google Authenticator 2FA token</label>
      </div>
      <el-form-item prop="googleCode">
        <span class="svg-container">
          <svg-icon icon-class="key" />
        </span>
        <el-input
          ref="googleCode"
          v-model="GAForm.googleCode"
          type="text"
          placeholder="Google Authenticator 2FA token (6 digits)"
          name="googleCode"
          tabindex="1"
          @keyup.enter.native="handleAddGA"
        />
      </el-form-item>
      <div class="tips" :class="showQrCode?'show':'hidden'">
        <div class="tip-GA">
          <span> You haven't set up Google Authenticator 2FA token. For your account security, please use google authenticator to scan the QR code below.</span>
        </div>
        <div style="width: 200px; height: 200px; border: 1px solid rgb(34, 39, 46); background: rgb(255, 255, 255);padding: 0.5rem;border-radius: 0.375rem;">
          <img :src="qrCode" style="width:100%;hight:100%;display:block;">
        </div>
      </div>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleAddGA">Add GA</el-button>

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
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
    const validateGoogleCode = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The Google Authenticator 2FA token can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        googleCode: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        googleCode: [{ required: true, trigger: 'blur', validator: validateGoogleCode }]
      },
      GAForm: {
        googleCode: ''
      },
      GARules: {
        googleCode: [{ required: true, trigger: 'blur', validator: validateGoogleCode }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      showQrCode: false,
      qrCode: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
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
          this.$store.dispatch('user/login', this.loginForm).then(data => {
            if (data.qrCode) {
              this.qrCode = data.qrCode
              this.showQrCode = true
              this.loading = false
              return true
            }
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleAddGA() {
      this.$refs.GAForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/addGA', this.GAForm).then((response) => {
            console.log('========', response)
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
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

  .title-text {
    margin-bottom: 6px;
    color: #fff;
  }
  .tip-GA {
    margin-bottom: 10px;
    font-size: 15px;
    word-break: break-all;
    word-wrap: break-word;
  }
}
</style>
