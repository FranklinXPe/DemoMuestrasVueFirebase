import Vue from 'vue'
import Vuex from 'vuex'

// Importamos los modulos
import authModule from '@/modules/auth.js'
import muestraModule from '@/modules/muestras.js'
import muestraGalleryModule from '@/modules/muestraGallery.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    authModule,
    // muestraModule,
    muestraGalleryModule

  }
})
