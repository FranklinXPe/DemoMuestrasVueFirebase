<template>
  <div>
    <!-- Escuchamos el evento que es emitido al momento de presionar SUBMIT desde el componente AuthForm -->
    <AuthForm action="login" v-on:process="login($event)"></AuthForm>
  </div>
</template>

<script>
import AuthForm from "@/components/forms/Auth.vue";

// Importamos al firestore y a la autenticacion
import { db } from "@/main";
export default {
  name: "Login",
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
    login(user) {
      this.$store
        .dispatch("firebaseLogin", user)
        .then(data => {
          // A diferencia del 'Register.vue' no queremos registarlo en la base de datos de Firestore.
          // sino establecer el rol del usuario
          db.collection("users")
            .doc(data.user.uid)
            .onSnapshot(
              // creamos un observador a la base de datos, el cual me dara la informacion disponible del usuario en cuaquier cambio que se realice
              snapshot => {
                this.$router.push("/");
              }
            );

          // Llamamos al Api de Java para que verifique el TOKEN-ID que regreso de FB
        })
        .catch(error => {
          this.message = error.message.substr(0, 60);
          this.snackBar = true;
          // En caso de error mostraremos el error en el SnackBar
          setTimeout(() => {
            this.snackBar = false;
          }, this.timeout);
        });
    }
  }
};
</script>
