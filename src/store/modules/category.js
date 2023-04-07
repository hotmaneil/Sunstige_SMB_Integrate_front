const state = {
  selectedCategory: null
}

const actions = {
  /**
  * 建立設備種類
  * @param {*} context
  * @param {*} data
  */
  setCategory(context, data) {
    context.commit('SetCategory', data)
  }
}

const mutations = {
  SetCategory(state, payload) {
    state.selectedCategory = payload
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
