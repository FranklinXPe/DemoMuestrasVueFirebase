<template>
  <div>
    <!-- Escuchamos el evento que es emitido al momento de presionar SUBMIT desde el componente AuthForm -->
    <AuthForm action="register" v-on:process="register($event)"></AuthForm>
  </div>
</template>

<script>
import AuthForm from "@/components/forms/Auth.vue";
// Importamos al firestore y a la autenticacion
import { db } from "@/main";

export default {
  name: "app-register",
  components: { AuthForm },
  data() {
    return {
      // Inicializamos los valores del SnackBar
      snackBar: false,
      message: "",
      timeout: 5000
    };
  },
  methods: {
    // Definimos el evento que sera enviado desde AuthForm y atrapado aqui en Register.vue, los cuales son: mail y password
    register(user) {
      // desde el componente llamamos al 'Actions' que configuramos para que invoque al Firebase-Auth
      this.$store.dispatch("firebaseRegister", user).then(userCredential => {
        const data = {
          uid: userCredential.user.uid,
          email: user.email,
          role: "customer"
        };

        // Registramos el usuario en la coleccion 'users'

        db.collection("users") // creamos la coleccion 'users'
          .doc(userCredential.user.uid) // el parametro de 'doc' es el 'document path' que es el nombre de la carpeta donde quedará guardado el 'data'
          .set(data) // establecemos los datos
          .then(() => {
            // nos devuelve una promesa
            // Establecemos el rol de usuario
            this.$store.commit("SET_ROLE", data.role); // llama directamente al 'mutation'
            this.$router.push("/"); // nos vamos a la página principal
          })
          .catch(error => {
            this.message = error.message.substr(0, 60);
            this.snackBar = true;
            // En caso de error mostraremos el error en el SnackBar
            setTimeout(() => {
              this.snackBar = false;
            }, this.timeout);
          });
      });
    }
  }
};
</script>
