const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  equipments: state => state.equipments,
  pieChartData: state => state.pieChartData,
  routePath: state => state.routePath
}
export default getters
