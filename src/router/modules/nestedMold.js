import Layout from '@/layout'

const nestedMold = {
  path: '/SMB_Mold',
  component: Layout,
  redirect: '/SMB_Mold',
  name: 'SMB_Mold',
  meta: { title: '模具維護', icon: 'el-icon-s-management' },
  children: [
    {
      path: '/SMB_Mold/MoldGridManage',
      name: 'Material',
      component: () => import('@/views/8.MaterialMold/MoldGridManage'),
      meta: { title: '模具庫格管理', icon: 'table' }
    },
    {
      path: '/SMB_Mold/Maintain',
      name: 'Material',
      component: () => import('@/views/8.MaterialMold/MoldMaintain'),
      meta: { title: '模具故障維護', icon: 'table' }
    },
    {
      path: '/SMB_Mold/MoldManage',
      name: 'MoldManage',
      component: () => import('@/views/8.MaterialMold/MoldManage'),
      meta: { title: '模具基本資料', icon: 'table' }
    },
    {
      path: '/SMB_Mold/MoldblockManage',
      name: 'MoldblockManage',
      component: () => import('@/views/8.MaterialMold/MoldblockManage'),
      meta: { title: '模具區塊管理', icon: 'table' }
    }
  ]
}

export default nestedMold
