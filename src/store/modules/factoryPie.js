const state = {
  pieChartData: [],
  RunNum: 0,
  IdleNum: 0,
  DownNum: 0,
  OfflineNum: 0,
  DisconnectNum: 0,
  RunColor: null,
  IdleColor: null,
  DownColor: null,
  OfflineColor: null,
  DisconnectColor: null
}

const actions = {

  /** 初始化值 */
  initPieChartData(context) {
    context.commit('InitPieChartData')
  },

  /**
   * 加入並計算
   * @param {*} context
   * @param {*} data
   */
  addToPieChartData(context, data) {
    context.commit('AddToPieChartData', data)
  }
}

const mutations = {
  InitPieChartData(state) {
    state.RunNum = 0
    state.IdleNum = 0
    state.DownNum = 0
    state.OfflineNum = 0
    state.DisconnectNum = 0
  },

  AddToPieChartData(state, payload) {
    var runItem = payload.find(item => item.name === 'Run')
    if (runItem !== undefined) {
      state.RunColor = runItem.color
      state.RunNum += runItem.value
    } else {
      state.RunColor = '#5f8237'
    }

    var idleItem = payload.find(item => item.name === 'Idle')
    if (idleItem !== undefined) {
      state.IdleColor = idleItem.color
      state.IdleNum += idleItem.value
    } else {
      state.IdleColor = '#f2a405'
    }

    var downItem = payload.find(item => item.name === 'Down')
    if (downItem !== undefined) {
      state.DownColor = downItem.color
      state.DownNum += downItem.value
    } else {
      state.DownColor = '#cd0c22'
    }

    var offlineItem = payload.find(item => item.name === 'Offline')
    if (offlineItem !== undefined) {
      state.OfflineColor = offlineItem.color
      state.OfflineNum += offlineItem.value
    } else {
      state.OfflineColor = '#2A2626'
    }

    var disconnectItem = payload.find(item => item.name === 'Disconnect')
    if (disconnectItem !== undefined) {
      state.DisconnectColor = disconnectItem.color
      state.DisconnectNum += disconnectItem.value
    } else {
      state.DisconnectColor = '#aab2bd'
    }

    state.pieChartData = [
      {
        name: 'Run',
        color: state.RunColor,
        value: state.RunNum
      },
      {
        name: 'Idle',
        color: state.IdleColor,
        value: state.IdleNum
      },
      {
        name: 'Down',
        color: state.DownColor,
        value: state.DownNum
      },
      {
        name: 'Offline',
        color: state.OfflineColor,
        value: state.OfflineNum
      },
      {
        name: 'Disconnect',
        color: state.DisconnectColor,
        value: state.DisconnectNum
      }
    ]
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
