import Layout from '@/layout'

const nestedDashboardRouter = {
  path: '/',
  component: Layout,
  redirect: '/factoryEquipmentStatus',
  name: 'Dashboard',
  meta: { title: 'Dashboard', icon: 'dashboard' },
  children: [
    // 暫時隱藏
    // {
    //   path: '/dashboard',
    //   name: 'dashboard',
    //   component: () => import('@/views/1.Dashboard/dashboard'),
    //   meta: { title: '設備儀表板', icon: 'el-icon-s-platform' }
    // },
    {
      path: '/factoryEquipmentStatus',
      name: 'factoryEquipmentStatus',
      component: () => import('@/views/1.Dashboard/factoryEquipmentStatus'),
      meta: { title: '廠區運行總覽', icon: 'el-icon-s-platform' }
    }
  ]
}

/**
 * 設備總覽
 */

// 預設
const equipmentOverView = {
  path: '/SMB_Dashboard/EquipmentOverView',
  name: 'EquipmentOverView',
  component: () => import('@/views/6.SMB_Dashboard/EquipmentOverView'),
  meta: { title: '設備總覽', icon: 'form' }
}

// 米白色
const equipmentOverViewWhite = {
  path: '/SMB_Dashboard/EquipmentOverView',
  name: 'EquipmentOverView',
  component: () => import('@/views/6.SMB_Dashboard/EquipmentOverViewWhite'),
  meta: { title: '設備總覽', icon: 'form' }
}

// 預設即時版
const equipmentOverViewSignalR = {
  path: '/SMB_Dashboard/EquipmentOverViewSignalR',
  name: 'EquipmentOverViewSignalR',
  component: () => import('@/views/6.SMB_Dashboard/EquipmentOverViewSignalR'),
  meta: { title: '設備總覽', icon: 'form' }
}

// 米白色即時版
const equipmentOverViewSignalRWhite = {
  path: '/SMB_Dashboard/EquipmentOverViewSignalRWhite',
  name: 'EquipmentOverViewSignalRWhite',
  component: () => import('@/views/6.SMB_Dashboard/EquipmentOverViewSignalRWhite'),
  meta: { title: '設備總覽', icon: 'form' }
}

if (OpenEquipmentOverViewSignalR === true) {
  // 切換主題
  if (typeof equipmentOverViewTheme === 'undefined') {
    nestedDashboardRouter.children.splice(1, 0, equipmentOverViewSignalR)
  } else {
    switch (equipmentOverViewTheme) {
      case 'default':
        // 預設
        nestedDashboardRouter.children.splice(1, 0, equipmentOverViewSignalR)
        break
      case 'white':
        // 米白色
        nestedDashboardRouter.children.splice(1, 0, equipmentOverViewSignalRWhite)
        break
    }
  }
} else {
// 切換主題
  if (typeof equipmentOverViewTheme === 'undefined') {
    nestedDashboardRouter.children.splice(1, 0, equipmentOverView)
  } else {
    switch (equipmentOverViewTheme) {
      case 'default':
      // 預設
        nestedDashboardRouter.children.splice(1, 0, equipmentOverView)
        break
      case 'white':
      // 米白色
        nestedDashboardRouter.children.splice(1, 0, equipmentOverViewWhite)
        break
    }
  }
}

/**
 * 設備運行現況
 */

// 預設圓餅圖
const equipmentActionStatusPie = {
  path: '/equipmentActionStatusPie',
  name: 'equipmentActionStatusPie',
  component: () => import('@/views/1.Dashboard/equipmentActionStatusPie'),
  meta: { title: '設備運行現況-圓餅圖', icon: 'form' }
}

// 長條圖
const equipmentActionStstusBar = {
  path: '/equipmentActionStatusBar',
  name: 'equipmentActionStatusBar',
  component: () => import('@/views/1.Dashboard/equipmentActionStatusBar'),
  meta: { title: '設備運行現況-長條圖', icon: 'form' }
}

if (isOpenEquipmentActionStatusPie === true) {
  nestedDashboardRouter.children.splice(2, 0, equipmentActionStatusPie)
}

if (isOpenEquipmentActionStatusBar === true) {
  nestedDashboardRouter.children.splice(3, 0, equipmentActionStstusBar)
}

export default nestedDashboardRouter
