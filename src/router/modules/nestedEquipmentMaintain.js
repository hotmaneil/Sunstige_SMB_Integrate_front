import Layout from '@/layout'

const nestedEquipmentMaintain = {
  path: '/SMB_EquipmentMaintain',
  component: Layout,
  redirect: '/SMB_EquipmentMaintain',
  name: 'SMB_EquipmentMaintain',
  meta: { title: '設備保養', icon: 'el-icon-s-management' },
  children: [
    {
      path: '/SMB_EquipmentMaintain/EquipmentMaintain',
      name: 'Material',
      component: () => import('@/views/9.EquipmentMaintain/EquipmentMaintainImg'),
      meta: { title: '設備保養', icon: 'table' }
    }
  ]
}

export default nestedEquipmentMaintain
