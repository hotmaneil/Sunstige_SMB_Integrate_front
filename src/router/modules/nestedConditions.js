import Layout from '@/layout'

// const nestedConditionsRouter = {
//   path: '/conditions',
//   component: Layout,
//   redirect: '/conditions/Molding',
//   name: 'MoldingConditions',
//   meta: { title: '成型條件', icon: 'el-icon-s-management' },
//   children: []
// }

// const conditionFunctions = [
//   {
//     path: '/conditions/Molding',
//     name: 'Molding',
//     component: () => import('@/views/2.Conditions/1.Molding'),
//     meta: { title: '設定值檢視', icon: 'table' }
//   },
//   {
//     path: '/conditions/MoldingTraceData',
//     name: 'MoldingTraceData',
//     component: () => import('@/views/2.Conditions/2.MoldingTraceData'),
//     meta: { title: '設定值歷程記錄', icon: 'table' }
//   },
//   {
//     path: '/conditions/MoldingAbnormalData',
//     name: 'MoldingAbnormalData',
//     component: () => import('@/views/2.Conditions/3.MoldingAbnormalData'),
//     meta: { title: '設定值異常紀錄', icon: 'table' }
//   },
//   {
//     path: '/conditions/Management',
//     name: 'Management',
//     component: () => import('@/views/2.Conditions/4.Management'),
//     meta: { title: '設定值管理', icon: 'table' }
//   }
// ]

// if (isOpenConditions === true) {
//   nestedConditionsRouter.children = conditionFunctions

// }

const nestedConditionsRouter = {
  path: '/conditions',
  component: Layout,
  redirect: '/conditions/Molding',
  name: 'MoldingConditions',
  meta: { title: '成型條件', icon: 'el-icon-s-management' },
  children: [
    {
      path: '/conditions/Molding',
      name: 'Molding',
      component: () => import('@/views/2.Conditions/1.Molding'),
      meta: { title: '設定值檢視', icon: 'table' }
    },
    {
      path: '/conditions/MoldingTraceData',
      name: 'MoldingTraceData',
      component: () => import('@/views/2.Conditions/2.MoldingTraceData'),
      meta: { title: '設定值歷程記錄', icon: 'table' }
    },
    {
      path: '/conditions/MoldingAbnormalData',
      name: 'MoldingAbnormalData',
      component: () => import('@/views/2.Conditions/3.MoldingAbnormalData'),
      meta: { title: '設定值異常紀錄', icon: 'table' }
    },
    {
      path: '/conditions/Management',
      name: 'Management',
      component: () => import('@/views/2.Conditions/4.Management'),
      meta: { title: '設定值管理', icon: 'table' }
    }
  ]
}
export default nestedConditionsRouter

