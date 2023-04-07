/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const nestedEquipmentInfoRouter = {
  path: '/equipmentInfo',
  component: Layout,
  // redirect: '/equipmentStatus',
  name: 'equipmentInfo',
  meta: {
    title: '設備資訊',
    icon: 'el-icon-s-management'
  },
  children: []
}

if (CategoryOpenSetting.Roboshot === true) {
  const roboshotFunctions = {
    path: 'equipmentInfo/Roboshot',
    component: () => import('@/views/6.SMB_Dashboard/OverView'), // Parent router-view
    name: 'equipmentInfo_Roboshot',
    meta: { title: '射出機' },
    // redirect: 'equipmentInfo',
    children: [
      {
        path: '/equipmentStatus/Roboshot',
        component: () => import('@/views/6.SMB_Dashboard/EquipmentStatus'),
        name: 'equipmentStatus_Roboshot',
        meta: { title: '設備狀況' }
      },
      {
        path: '/equipment/Roboshot',
        component: () => import('@/views/1.Dashboard/equipment'),
        name: 'equipment_Roboshot',
        meta: { title: '設備相關資訊' }
      }
    ]
  }
  nestedEquipmentInfoRouter.children.push(roboshotFunctions)
}

if (CategoryOpenSetting.PLC === true) {
  const plcFunctions = {
    path: 'equipmentInfo/PLC',
    component: () => import('@/views/6.SMB_Dashboard/OverView'), // Parent router-view
    name: 'equipmentInfo_PLC',
    meta: { title: 'PLC' },
    redirect: 'equipmentInfo',
    children: [
      {
        path: '/equipmentStatus/PLC',
        component: () => import('@/views/6.SMB_Dashboard/EquipmentStatus'),
        name: 'equipmentStatus_PLC',
        meta: { title: '設備狀況' }
      },
      {
        path: '/equipment/PLC',
        component: () => import('@/views/1.Dashboard/equipment'),
        name: 'equipment_PLC',
        meta: { title: '設備相關資訊' }
      }
    ]
  }
  nestedEquipmentInfoRouter.children.push(plcFunctions)
}

if (CategoryOpenSetting.CNC === true) {
  const cncFunctions = {
    path: 'equipmentInfo/CNC',
    component: () => import('@/views/6.SMB_Dashboard/OverView'), // Parent router-view
    name: 'equipmentInfo_CNC',
    meta: { title: 'CNC' },
    redirect: 'equipmentInfo',
    children: [
      {
        path: '/equipmentStatus/CNC',
        component: () => import('@/views/6.SMB_Dashboard/EquipmentStatusCNC'),
        name: 'equipmentStatus_CNC',
        meta: { title: '設備狀況' }
      },
      {
        path: '/equipmentCNCInfo/CNC',
        component: () => import('@/views/1.Dashboard/equipmentCNCInfo'),
        name: 'equipmentCNCInfo',
        meta: { title: '設備相關資訊' }
      },
      {
        path: '/setting/CNCMainAxisThSetting',
        name: 'CNCMainAxisThSetting',
        component: () => import('@/views/4.Setting/CNCMainAxisThSetting'),
        meta: { title: '主軸與進給閥值(CNC)' }
      }
    ]
  }
  nestedEquipmentInfoRouter.children.push(cncFunctions)
}

export default nestedEquipmentInfoRouter
