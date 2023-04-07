import Layout from '@/layout'

const nestedMaterial = {
  path: '/SMB_Material',
  component: Layout,
  redirect: '/SMB_Material',
  name: 'SMB_Material',
  meta: { title: '物料維護', icon: 'el-icon-s-management' },
  children: [
    {
      path: '/SMB_Material/Material',
      name: 'Material',
      component: () => import('@/views/8.MaterialMold/MaterialManage'),
      meta: { title: '物料基本資料維護', icon: 'table' }
    }
  ]
}

export default nestedMaterial
