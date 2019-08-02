<template>
  <main>
    <!-- Dentro de este componente 'v-app' cargaran los demas componentes Vuetify -->
    <v-app>
      <!-- Si la aplicacion a cargado: con el contenido, el footer y todo lo demas -> lo mostramos -->
      <v-content>
        <!-- ROUTER VIEW - PRINCIPAL -->
        <router-view />
      </v-content>
    </v-app>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'App',

  computed: {
    ...mapGetters(['role'])
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
