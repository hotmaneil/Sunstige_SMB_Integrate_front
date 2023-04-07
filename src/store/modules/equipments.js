// import { getList as getListEquipments } from '@/api/Equipments'
import { getList as getListOptions } from '@/api/Options'
// import { formatDate } from '@/utils/validate'
import Cookies from 'js-cookie'

const getDefaultState = () => {
  return {
    optionList: [],
    optionListTotal: 0,
    timer: null,
    MessageBox: null,
    select_equipment: Cookies.get('select_equipment')
      ? Cookies.get('select_equipment')
      : ''
  }
}

const state = getDefaultState()

const GET_Options = () => {
  return new Promise((resolve, reject) => {
    getListOptions()
      .then(response => {
        state.optionList = response.data.Payload
        state.optionListTotal = response.data.total
        resolve()
      })
      .catch(error => {
        reject(error)
      })
  })
}

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },

  SET_START: async(state, MessageBox) => {
    state.MessageBox = MessageBox

    await GET_Options()
  },

  SET_STOP: state => {
  },

  TOGGLE_EQUIPMENT: async(state, equipmentid) => {
    console.log('equipmentid', equipmentid)
    state.select_equipment = equipmentid
    Cookies.set('select_equipment', equipmentid)
  },

  SET_FIELD: async(state, field) => {
  }
}

const actions = {
  start({ commit, state }, token) {
    commit('SET_START', token)
  },
  stop({ commit, state }) {
    commit('SET_STOP')
  },
  toggleEquipment({ commit }, equipmentid) {
    commit('TOGGLE_EQUIPMENT', equipmentid)
  },
  set_field_is_chart({ commit }, field) {
    commit('SET_FIELD', field)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
