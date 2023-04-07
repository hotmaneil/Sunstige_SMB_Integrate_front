import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_OPS: (state, options) => {
    state.options = options
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data.Payload)
          setToken(data.Payload)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  autoLogin({ commit }) {
    return new Promise((resolve, reject) => {
      login({ username: 'admin', password: '3b1c307a' })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data.Payload)
          setToken(data.Payload)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(response => {
          var infoData = response.data.Payload
          const { data } = response
          if (!data) {
            return reject('Verification failed, please Login again.')
          }

          const { name, avatar, options } = data
          commit('SET_AVATAR', avatar)
          commit('SET_OPS', options)
          commit('SET_NAME', infoData.Account)
          sessionStorage.setItem('userName', infoData.Account)
          resetRouter()
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      console.log('commit', commit)
      console.log('state', state)
      logout(state.token)
        .then(() => {
          removeToken() // must remove  token  first
          resetRouter()
          commit('RESET_STATE')
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
