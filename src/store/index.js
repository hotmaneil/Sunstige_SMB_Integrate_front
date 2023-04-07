import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import equipments from './modules/equipments'
import factoryPie from './modules/factoryPie'
import routeParam from './modules/routeParam'
import category from './modules/category'
import device from './modules/device'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    equipments,
    factoryPie,
    category,
    device,
    routeParam
  },
  getters
})

export default store
