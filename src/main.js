import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
// Importar las dependencias de firebase
import firebase from 'firebase'
import 'firebase/firestore'
import firebaseConfig from '@/config/firebase.js'
firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore()

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  mounted () {
    // Esto se va ejecutar cada vez que el estado del Usuario cambie, si el usuario cierra, inicia o se registra => SE VA EJECUTAR
    firebase.auth().onAuthStateChanged((user) => {
      // console.log('onAuthStateChanged: user')
      // console.log(user)
      if (user) {
        db.collection('users').doc(user.uid).onSnapshot(snapshot => {
          store.commit('SET_USER', user)

          if (snapshot.exists) {
            firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
              // Send token to your backend via HTTPS
              console.log('este es el toto- idToken:\n' + idToken)

              // EventService.getValidate(idToken)
            }).catch(function (error) {
              console.log('Hubo un error', error.message)
            })
          }

          // Verificamos si por algun motivo el usuario puede no estar identificado en las conexiones con el servidor . NOS ASEGURAMOS
          if (snapshot.exists) {
            this.$store.commit('SET_ROLE', snapshot.data().role) // Para acceder a los datos, usamos data(). El cual retornara un objeto {email,role,uid}
          }
        })
      }
    })
  }

}).$mount('#app')
