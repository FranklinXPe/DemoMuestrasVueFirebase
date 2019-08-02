import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'

import Register from '@/components/Register.vue'
import Login from '@/components/Login.vue'

// Creamos una constante que se ejecutara en cada url que ingresemos
import store from '@/store.js'

Vue.use(Router)

const beforeEnter = (to, from, next) => { // vamos a utilizar esta sentencia de codigo para que un usuario ya identificado no ingrese ni al login ni al register.
  if (store.state.authModule.logged) { // Si el usuario esta identificado lo vamos a dejar en la raiz
    next({
      path: '/'
    })
  } else {
    next()
  } // lo dejamos en la ruta que iba visitar
}

const router = new Router({
  routes: [{
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      Auth: true,
      title: 'Inicio'
    }
  },

  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      Auth: false,
      title: 'Iniciar Sesion'
    },
    beforeEnter: (to, from, next) => beforeEnter(to, from, next)
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      Auth: false, // No necesita autenticacion
      title: 'Registro' // Cambia el TITLE de la página
    },
    beforeEnter: (to, from, next) => beforeEnter(to, from, next)
  }

  ]
})

// Se ejecutara en cada ruta
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  // Añadimos una comprobacion: Si esta ruta necesita autenticacion, si el usuario no esta identificado el usuario y si la aplicacion ha cargado
  if (to.meta.Auth && !store.state.authModule.logged) {
    next({
      path: '/login'
    })
  } else {
    if (to.meta.role) {
      // Ya cargo la aplicacion y el usaurio  es distinto al rol que se requiere para esta página
      if (to.meta.role !== store.state.authModule.role) {
        next({
          path: '/'
        })
        return
      }
    }
    next()
  }
})

export default router
