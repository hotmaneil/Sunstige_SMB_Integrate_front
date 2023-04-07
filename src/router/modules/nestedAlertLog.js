import Layout from '@/layout'

const nestedAlertLog = {
  path: '/SMB_AlertLog',
  component: Layout,
  redirect: '/SMB_AlertLog',
  name: 'SMB_AlertLog',
  meta: { title: '警示訊息紀錄', icon: 'el-icon-notebook-1' },
  children: [
    {
      path: '/SMB_AlertLog/MessageAlertLog',
      name: 'AlertLog',
      component: () => import('@/views/10.SMB_AlertLog/MessageAlertLog'),
      meta: { title: '警示訊息紀錄', icon: 'el-icon-notebook-2' }
    }
  ]
}

export default nestedAlertLog
