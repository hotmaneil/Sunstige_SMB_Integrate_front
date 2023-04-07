const state = {
  selectedDeviceId: null
}

const actions = {
  /**
   * 建立選取的裝置Id
   * @param {*} context
   * @param {*} data
   */
  setSelectedDeviceId(context, data) {
    context.commit('SetSelectedDeviceId', data)
  }
}

const mutations = {
  /**
   * 建立選取的裝置Id
   * @param {*} state
   * @param {*} payload
   */
  SetSelectedDeviceId(state, payload) {
    state.selectedDeviceId = payload
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
