<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <MantenimientoDialogMuestraGalleryFireBase v-on:process="agregarMuestraGuardada($event)" />

      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">Welcome to VueAuth</h1>
      </v-flex>

      <v-flex mb-5 xs12>
        <v-data-table :headers="headers" :items="this.muestras" class="elevation-1">
          <template v-slot:items="props">
            <td class="text-xs-center">{{ props.item.sid }}</td>
            <td class="text-xs-center">{{ props.item.tipo }}</td>
            <td class="text-xs-center">{{ props.item.nombre }}</td>
            <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="viewMuestra(props.item)">
                <v-icon color="teal">visibility</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="editMuestra(props.item)">
                <v-icon color="teal">edit</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="removeMuestra(props.item)">
                <v-icon color="teal">delete</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-flex>

      <v-flex xs12 mb-5>
        <h3 class="headline font-weight-bold mb-3">Salir de la App</h3>

        <v-layout justify-center>
          <v-btn primary color="blue" class="white--text" @click="logout()">Cerrar Sesion</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { db } from '@/main';
import MantenimientoDialogMuestraGalleryFireBase from '@/components/MantenimientoDialogMuestraGalleryFireBase.vue';

export default {
  name: 'HelloWorldGalleryFB',
  components: { MantenimientoDialogMuestraGalleryFireBase },
  data () {
    return {
      headers: [
        {
          text: 'Codigo',
          align: 'center',
          sortable: false,
          value: 'sid'
        },
        { text: 'Tipo', value: 'tipo', align: 'center' },
        { text: 'Nombre', value: 'nombre', align: 'center' },
        { text: 'Acciones', sortable: false }
      ],
      muestras: []
    }
  },
  mounted () {
    this.$store.dispatch('fetchMuestras').then(response => {
      this.muestras = []
      this.muestras = response.data.muestras
    })
  },
  methods: {
    editMuestra (muestra) {
      this.$store.commit('TOGGLE_MUESTRAS_DIALOG', {
        editMode: true,
        muestra,
        image: { url: '', file_id: '' }
      })
    },
    removeMuestra (muestra) {
      // Elimina la muestra de la BD
      console.log(muestra)
      confirm(
        'Confirmas que deseas eliminar la información de esta muestra?'
      ) &&
        this.$store.dispatch('deleteMuestra', muestra).then(resp => {
          for (var i = 0; i < this.muestras.length; i++) {
            if (this.muestras[i].sid === muestra.sid) {
              let deletedMuestra = this.muestras[i]

              // Eliminamos del STORAGE la galeria de  imagenes de esta muestra
              for (var j = 0; j < deletedMuestra.gallery.length; j++) {
                this.$store.dispatch('removeFile', {
                  sid: deletedMuestra.sid,
                  imagen: deletedMuestra.gallery[j]
                })
              }

              // Eliminamos la muestra de la base de datos
              this.muestras.splice(i, 1)
              break;
            }
          }
        })
    },

    // Cerrar Sesion
    logout () {
      this.$store
        .dispatch('firebaseLogout') // nos devuelve de auth.js(Modul) una promesa
        .then(() => {
          this.$store.commit('SET_USER') // No le pasamos nada para que el usuario quede en NULL
          this.$store.commit('SET_ROLE', 'guest')
          this.$router.push('/login')
        })
    },
    agregarMuestraGuardada (evento) {
      if (evento.modo === 'save') {
        // ES UN AGREGAR
        this.muestras.push(evento.muestra)
      } else {
        // FUE UN MODIFICAR
        // Actualiza la data del array 'Unidades' en base al trabajador
        for (var i = 0; i < this.muestras.length; i++) {
          //  console.log('Contador:' + i)
          if (this.muestras[i].sid === evento.muestra.sid) {
            this.muestras.splice(i, 1, evento.muestra)
            break;
          }
        }
      }
    }
  }
}
</script>

<style>
</style>
