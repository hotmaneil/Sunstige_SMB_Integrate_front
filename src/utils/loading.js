import Vue from 'vue'
/**
 * 開啟 Loading 遮罩畫面
 */
export function loadingUI() {
  Vue.prototype.$loading({
    lock: true,
    text: 'Loading...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.8)'
  })
}

/**
 * 關閉 Loading 遮罩畫面
 */
export function closeLoading() {
  Vue.prototype.$loading().close()
}
