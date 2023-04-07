import Layout from '@/layout'

const nestedSetting = {
  path: '/SMB_Basic',
  component: Layout,
  redirect: '/SMB_Basic',
  name: 'SMB_Basic',
  meta: { title: 'Setting', icon: 'el-icon-set-up' },
  children: [
    {
      path: '/Setting/IPCManage',
      name: 'IPCManage',
      component: () => import('@/views/4.Setting/IPCManage'),
      meta: { title: 'IPC管理', icon: 'form' }
    },
    {
      path: '/SMB_Basic/StatusManage',
      name: 'StatusManage',
      component: () => import('@/views/5.SMB_Basic/StatusManage'),
      meta: { title: '狀態管理', icon: 'form' }
    },
    {
      path: '/SMB_Basic/Class',
      name: 'Class',
      component: () => import('@/views/5.SMB_Basic/ClassInfo'),
      meta: { title: '班別管理', icon: 'form' }
    },
    {
      path: '/SMB_Basic/DashboardManager',
      name: 'DashboardManager',
      component: () => import('@/views/5.SMB_Basic/DashboardManager'),
      meta: { title: '設備總覽欄位管理', icon: 'form' }
    },

    {
      path: '/IOModuleCommunication',
      name: 'IOModuleCommunication',
      component: () => import('@/views/7.SMB_Statistics/OverView'),
      meta: { title: 'IO模組通訊', icon: 'form' },
      children: [
        {
          path: '/SMB_Basic/Device',
          name: 'Device',
          component: () => import('@/views/5.SMB_Basic/Device'),
          meta: { title: '機台管理 (I/O模組)', icon: 'form' }
        },
        {
          path: '',
          name: ''
        },
        {
          path: '/SMB_Basic/Device/DeviceStatusSetting/:Id',
          name: 'DeviceStatusSetting',
          component: () => import('@/views/5.SMB_Basic/DeviceStatusSetting'),
          meta: { title: '狀態設定', icon: 'form' },
          hidden: true
        },
        {
          path: '/SMB_Basic/Device/DeviceDI/:Id',
          name: 'DeviceDI',
          component: () => import('@/views/5.SMB_Basic/DeviceDI'),
          meta: { title: 'DI定義', icon: 'form' },
          hidden: true
        }
      ]
    },

    {
      path: '/EquipmentCommunication',
      name: 'EquipmentCommunication',
      component: () => import('@/views/7.SMB_Statistics/OverView'),
      meta: { title: '設備連線通訊', icon: 'form' },
      children: [
        {
          path: '/setting/equipment_setting',
          name: 'EquipmentSetting',
          component: () => import('@/views/4.Setting/2.EquipmentSetting'),
          meta: { title: '機台管理(通訊連線)', icon: 'form' }
        },
        {
          path: '/setting/field_name',
          name: 'FieldName',
          component: () => import('@/views/4.Setting/1.FieldName'),
          meta: { title: '通訊設備欄位設定', icon: 'form' }
        },
        {
          path: '/setting/dropdown_item',
          name: 'DropdownItem',
          component: () => import('@/views/4.Setting/3.DropdownItem'),
          meta: { title: '下拉項目編輯', icon: 'form' }
        }
      ]
    },

    {
      path: '/Config',
      name: 'Config',
      component: () => import('@/views/4.Setting/Config'),
      meta: { title: '系統設定', icon: 'form' }
    },

    {
      path: '/SMB_Basic/DeviceStatusSetting/StatusConditionSetting/:device_status_id',
      name: 'StatusConditionSetting',
      component: () => import('@/views/5.SMB_Basic/StatusConditionSetting'),
      meta: { title: '狀態條件設定', icon: 'form' },
      hidden: true
    }

  ]
}

if (isOpenIdleFunctions === true) {
  const CNCIdleCodeSetting = {
    path: '/setting/CNCIdleCodeSetting',
    name: 'CNCIdleCodeSetting',
    component: () => import('@/views/4.Setting/CNCIdleCodeSetting'),
    meta: { title: '閒置代碼(CNC)', icon: 'form' }
  }
  nestedSetting.children.push(CNCIdleCodeSetting)
}

export default nestedSetting
