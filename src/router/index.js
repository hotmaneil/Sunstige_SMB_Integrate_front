import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import nestedDashboardRouter from './modules/nestedDashboard'
import nestedEquipmentInfoRouter from './modules/nestedEquipmentInfo'
import nestedStatistics from './modules/nestedStatistics'
import nestedSetting from './modules/nestedSetting'
import nestedMold from './modules/nestedMold'
import nestedMaterial from './modules/nestedMaterial'
import nestedEquipmentMaintain from './modules/nestedEquipmentMaintain'
import nestedConditionsRouter from './modules/nestedConditions'
import nestedEAPstatistics from './modules/nestedEAPstatistics'
import nestedAlertLog from './modules/nestedAlertLog'
// import nestedRouter from '@/router/modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/AutoLogin',
    component: () => import('@/views/0.login/AutoLogin'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  /** Dashboard */
  nestedDashboardRouter,

  /** 設備資訊 */
  nestedEquipmentInfoRouter,

  /** 統計圖 */
  nestedStatistics,

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

/** 登入頁面設定 */
const loginPage = {
  path: '/login',
  component: () => import('@/views/0.login/login'),
  hidden: true
}

const indexParticlesPage = {
  path: '/login',
  component: () => import('@/views/0.login/indexParticles'),
  hidden: true
}

switch (loginPageName) {
  case 'login':
    constantRoutes.push(loginPage)
    break

  case 'indexParticles':
    constantRoutes.push(indexParticlesPage)
    break

  default:
    constantRoutes.push(loginPage)
    break
}

/** Setting(設定) */
const userName = sessionStorage.getItem('userName')
if (userName === 'superadmin') {
  constantRoutes.push(nestedSetting)
}

/** 成型條件 */
if (isOpenConditions === true) {
  constantRoutes.push(nestedConditionsRouter)
}

/** 參數運行監視 */
if (isOpenEAPstatistics === true) {
  constantRoutes.push(nestedEAPstatistics)
}

/** 物料維護 */
if (isOpenMaterial === true) {
  constantRoutes.push(nestedMaterial)
}

/** 模具維護 */
if (isOpenMold === true) {
  constantRoutes.push(nestedMold)
}

/** 設備保養 */
if (isOpenEquipmentMaintain === true) {
  constantRoutes.push(nestedEquipmentMaintain)
}

/** 警示訊息紀錄 */
if (isOpenAlertLog === true) {
  constantRoutes.push(nestedAlertLog)
}

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
/**
 * 更新選單
 */
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
