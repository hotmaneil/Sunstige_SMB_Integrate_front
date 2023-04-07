import Layout from '@/layout'

const nestedStatistics = {
  path: '/SMB_Statistics',
  component: Layout,
  redirect: '/SMB_Statistics',
  name: 'SMB_Statistics',
  meta: { title: '統計圖', icon: 'el-icon-s-data' },
  children: []
}

if (CategoryOpenSetting.Roboshot === true) {
  const roboshotFunctions = {
    path: '/SMB_Statistics/EquipmentStatusHistory/Roboshot',
    name: 'EquipmentStatusHistory_Roboshot',
    component: () => import('@/views/7.SMB_Statistics/OverView'),
    meta: { title: '射出機', icon: 'form' },
    children: [
      {
        path: '/SMB_Statistics/EquipmentStatusHistory/Roboshot',
        name: 'EquipmentStatusHistory_Roboshot',
        component: () => import('@/views/7.SMB_Statistics/EquipmentStatusHistory'),
        meta: { title: '稼動歷程', icon: 'form' }
      },
      {
        path: '/SMB_Statistics/EquipmentStatusStatistical/Roboshot',
        name: 'EquipmentStatusStatistical_Roboshot',
        component: () => import('@/views/7.SMB_Statistics/EquipmentStatusStatistical'),
        meta: { title: '狀況統計', icon: 'form' }
      },
      {
        path: '/SMB_Statistics/UtilizationHistory/Roboshot',
        name: 'UtilizationHistory_Roboshot',
        component: () => import('@/views/7.SMB_Statistics/UtilizationHistory'),
        meta: { title: '稼動率趨勢圖', icon: 'form' }
      },
      {
        path: '/SMB_Statistics/DayUtilizationCompare/Roboshot',
        name: 'DayUtilizationCompare',
        component: () => import('@/views/7.SMB_Statistics/DayUtilizationCompare'),
        meta: { title: '日稼動率比較圖', icon: 'form' }
      },
      {
        path: '/SMB_Statistics/MonthUtilizationCompare/Roboshot',
        name: 'MonthUtilizationCompare',
        component: () => import('@/views/7.SMB_Statistics/MonthUtilizationCompare'),
        meta: { title: '月稼動率比較圖', icon: 'form' }
      }
    ]
  }
  nestedStatistics.children.push(roboshotFunctions)
}

if (CategoryOpenSetting.PLC === true) {
  const plcFunctions = {
    path: '/SMB_Statistics/EquipmentStatusHistory/PLC',
    name: 'EquipmentStatusHistory_PLC',
    component: () => import('@/views/7.SMB_Statistics/OverView'),
    meta: { title: 'PLC', icon: 'form' },
    children: [
      {
        path: '/SMB_Statistics/EquipmentStatusHistory/PLC',
        name: 'EquipmentStatusHistory_PLC',
        component: () => import('@/views/7.SMB_Statistics/EquipmentStatusHistory'),
        meta: { title: '稼動歷程', icon: 'form' }
      },
      {
        path: '/SMB_Statistics/EquipmentStatusStatistical/PLC',
        name: 'EquipmentStatusStatistical_PLC',
        component: () => import('@/views/7.SMB_Statistics/EquipmentStatusStatistical'),
        meta: { title: '狀況統計', icon: 'form' }
      },
      {
        path: '/SMB_Statistics/UtilizationHistory/PLC',
        name: 'UtilizationHistory_PLC',
        component: () => import('@/views/7.SMB_Statistics/UtilizationHistory'),
        meta: { title: '稼動率趨勢圖', icon: 'form' }
      },
      {
        path: '/SMB_Statistics/DayUtilizationCompare/PLC',
        name: 'DayUtilizationCompare',
        component: () => import('@/views/7.SMB_Statistics/DayUtilizationCompare'),
        meta: { title: '日稼動率比較圖', icon: 'form' }
      },
      {
        path: '/SMB_Statistics/MonthUtilizationCompare/PLC',
        name: 'MonthUtilizationCompare',
        component: () => import('@/views/7.SMB_Statistics/MonthUtilizationCompare'),
        meta: { title: '月稼動率比較圖', icon: 'form' }
      }
    ]
  }
  nestedStatistics.children.push(plcFunctions)
}

if (CategoryOpenSetting.CNC === true) {
  const cncFunctions = {
    path: '/SMB_Statistics/EquipmentStatusHistory/CNC',
    name: 'EquipmentStatusHistory_CNC',
    component: () => import('@/views/7.SMB_Statistics/OverView'),
    meta: { title: 'CNC', icon: 'form' },
    children: [
      {
        path: '/SMB_Statistics/EquipmentStatusHistory/CNC',
        name: 'EquipmentStatusHistory_CNC',
        component: () => import('@/views/7.SMB_Statistics/EquipmentStatusHistoryCNC'),
        meta: { title: '稼動歷程', icon: 'form' }
      },
      {
        path: '/SMB_Statistics/EquipmentStatusStatistical/CNC',
        name: 'EquipmentStatusStatistical_CNC',
        component: () => import('@/views/7.SMB_Statistics/EquipmentStatusStatistical'),
        meta: { title: '狀況統計', icon: 'form' }
      },
      {
        path: '/SMB_Statistics/CNCUtilizationDayReport',
        name: 'CNCUtilizationDayReport',
        component: () => import('@/views/7.SMB_Statistics/CNCUtilizationDayReport'),
        meta: { title: '日稼動率報表', icon: 'form' }
      },
      {
        path: '/SMB_Statistics/CNCUtilizationMonthReport',
        name: 'CNCUtilizationMonthReport',
        component: () => import('@/views/7.SMB_Statistics/CNCUtilizationMonthReport'),
        meta: { title: '月稼動率報表', icon: 'form' }
      },
      {
        path: '/SMB_Statistics/DayUtilizationCompare/CNC',
        name: 'DayUtilizationCompare',
        component: () => import('@/views/7.SMB_Statistics/DayUtilizationCompare'),
        meta: { title: '日稼動率比較圖', icon: 'form' }
      },
      {
        path: '/SMB_Statistics/MonthUtilizationCompare/CNC',
        name: 'MonthUtilizationCompare',
        component: () => import('@/views/7.SMB_Statistics/MonthUtilizationCompare'),
        meta: { title: '月稼動率比較圖', icon: 'form' }
      },
      {
        path: '/SMB_Statistics/UtilizationHistory/CNC',
        name: 'UtilizationHistory_CNC',
        component: () => import('@/views/7.SMB_Statistics/UtilizationHistory'),
        meta: { title: '稼動率趨勢圖', icon: 'form' }
      }

    ]
  }

  if (isOpenIdleFunctions === true) {
    const idleFunction1 =
      {
        path: '/SMB_Statistics/IdleTimeAnalyze',
        name: 'IdleTimeAnalyze',
        component: () => import('@/views/7.SMB_Statistics/IdleTimeAnalyze'),
        meta: { title: '閒置時間分析-單一機台', icon: 'form' }
      }
    const idleFunction2 =
    {
      path: '/SMB_Statistics/IdleTimeFactoryAnalyze',
      name: 'UtilizationHistory',
      component: () => import('@/views/7.SMB_Statistics/IdleTimeFactoryAnalyze'),
      meta: { title: '閒置時間分析-全廠', icon: 'form' }
    }
    cncFunctions.children.push(idleFunction1)
    cncFunctions.children.push(idleFunction2)
  }
  nestedStatistics.children.push(cncFunctions)
}

export default nestedStatistics
