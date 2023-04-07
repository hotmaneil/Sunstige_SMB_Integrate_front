const state = {
  routePath: null
}

const actions = {

  /**
   * 變更路徑與儲存
   * @param {*} context
   * @param {*} data
   */
  ChangeRoute(context, data) {
    context.commit('ChangeRoute', data)
  }
}

const mutations = {

  /** 變更路徑 */
  ChangeRoute(state, payload) {
    state.routePath = payload
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

