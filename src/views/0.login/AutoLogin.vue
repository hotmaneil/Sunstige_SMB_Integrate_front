<template>
  <div class="login-container">
    <!-- <p>自動登入</p> -->
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'AutoLogin',
  data() {
    return {
      redirect: ''
    }
  },

  watch: {
    $route: {
      handler: function(route) {
        console.log('autoLogin route', route)
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },

  created() {
    this.checkToken()
  },

  methods: {
    checkToken() {
      const hasToken = getToken()
      if (hasToken) {
        console.log('hasToken', hasToken)

        const loading = this.$loading({
          lock: true,
          text: '自動登入中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        setTimeout(() => {
          console.log('this.redirect', this.redirect)
          this.$router.push({ path: this.redirect })
          loading.close()
        }, 2000)
      } else {
        console.log('no Token')
      }
    }
  }
}
</script>

