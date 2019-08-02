// OJO:La autenticacion se lleva con firebase, no con firestore.
// Por eso importamos 'fierbase' aquí y no cosideramos el que hicimos en main.js ya que invoca al 'firestore'
import firebase from 'firebase'

export default {
  state: {
    user: null,
    role: 'guest',
    logged: false, // para saber si esta logueado,
    idToken: '' // idToken
  },
  actions: {
    firebaseRegister: ({
      commit
    }, user) => {
      // commit: tiene el state de este componente y del 'root state' y el propio commit para las mutaciones
      // retorna una promesa que lo manejaremos despues
      return firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    },

    firebaseLogin: ({
      commit
    }, user) => {
      return firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    },
    firebaseLogout: () => {
      // no le pasamos como parametro ningun objeto de contexto como los anteriores
      return firebase.auth().signOut()
    }
  },
  mutations: {
    SET_USER: (state, user) => {
      if (user) {
        state.user = {
          uid: user.uid,
          email: user.email

        }
        state.logged = true
      } else {
        state.user = null
        state.logged = false
      }
    },

    SET_ROLE: (state, role) => {
      state.role = role
    }
  },
  getters: { // Los getters devuelven el estado alterado (formateado)

    logged: (state) => {
      return !!state.user
    },
    role: (state) => {
      return state.role
    },
    isCustomer: (state) => {
      return state.role === 'customer'
    }

  }

}
