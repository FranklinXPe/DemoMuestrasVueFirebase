<template>
  <div>
    <v-jumbotron color="teal" dark height="50px">
      <v-container fill-height>
        <v-layout align-center>
          <v-flex text-xs-center>
            <h3 class="display-1">
              <!-- Hacemos uso de 'template literals' para mostrar en este formulario tanto el texto de LOGIN como de REGISTER -->
              INICIO
            </h3>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>

    <!-- el modelo 'valid' nos servira para saber si este modelo ha sido validado o no -->
    <v-form id="nativeForm" v-model="valid">
      <v-text-field label="Email" v-model="email" :rules="emailRules" name="email"></v-text-field>
      <v-text-field label="Usuario" v-model="password" :rules="passwordRules" name="password"></v-text-field>
      <!-- Como este formulario es tanto para LOGIN como para REGISTER, la propiedad action sera nuestro pivote -->
      <v-text-field
        v-if="action === 'register'"
        label="Confirmacion del password"
        v-model="password_confirmation"
        :rules="passwordConfirmationRules"
        name="password_confirmation"
      ></v-text-field>

      <v-btn @click="submit" color="teal" dark>INGRESAR</v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  /**
   * Este formulario debe pasar esta responsablidad al compomente que lo va utilizar (su padre)
   */

  name: 'Auth',
  props: {
    action: { type: String, default: '' }
  },
  data () {
    return {
      valid: false, // Evaluara si todos los campos del formulario fueron validados satisfactoriamente
      email: '',
      emailRules: [
        v => !!v || 'El EMAIL es requerido',
        v =>
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          'Email debe ser valido'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'El password es requerido',
        v => v.length >= 6 || 'El campo password debe tener más de 6 caracteres'
      ],
      password_confirmation: '',
      passwordConfirmationRules: [
        v => !!v || 'La confirmacion del password es requerido',
        v => v.length >= 6 || 'Debe tener mas de 6 caracteres',
        v => v === this.password || 'Los password no coinciden'
      ]
    }
  },
  methods: {
    submit () {
      this.$emit('process', { email: this.email, password: this.password })
    }
  }
}
</script>
