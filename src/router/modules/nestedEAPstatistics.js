import Layout from '@/layout'

const nestedEAPstatistics = {
  path: '/statistics',
  component: Layout,
  redirect: '/statistics/ProductParam/Graph',
  name: 'statistics',
  meta: {
    title: '參數運行監視',
    icon: 'el-icon-s-order'
  },
  children: [
    {
      path: 'Graph',
      name: '參數圖表',
      component: () => import('@/views/3.Statistics/1.Graph'),
      meta: { title: '參數圖表', icon: 'el-icon-data-line' }
    },
    {
      path: 'DataTable',
      name: '參數履歷監視',
      component: () => import('@/views/3.Statistics/2.DataTableMonitor'),
      meta: { title: '參數履歷監視', icon: 'table' }
    },

    {
      path: 'TraceData',
      name: '歷史紀錄',
      component: () => import('@/views/3.Statistics/3.TraceData'),
      meta: { title: '歷史紀錄', icon: 'table' }
    },

    {
      path: 'StatisticsAbnormalData',
      name: '異常紀錄',
      component: () => import('@/views/3.Statistics/5.StatisticsAbnormalData'),
      meta: { title: '異常紀錄', icon: 'table' }
    },

    {
      path: 'Correlation',
      name: '相關性',
      component: () => import('@/views/3.Statistics/6.Correlation'),
      meta: { title: '相關性', icon: 'table' }
    }
  ]
}

export default nestedEAPstatistics
