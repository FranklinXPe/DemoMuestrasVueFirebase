<template>
  <!-- INICIO: cuerpo de la ventana modal -->
  <v-dialog v-model="muestraDialog" max-width="500px">
    <!-- Gracias al slot=acctivator se abrirá la ventana modal -->
    <v-btn
      dark
      slot="activator"
      class="indigo lighten-1 white--text text-xs-center mb-2"
    >Añadir Producto</v-btn>

    <!-- INICIO: cuerpo de la ventana modal -->
    <v-card>
      <v-container>
        <template>
          <v-tabs v-model="model" color="primary">
            <v-tab :href="`#tab-1`" class="white--text">General</v-tab>
            <v-tab :href="`#tab-2`" class="white--text">Imagenes</v-tab>
            <v-tab :href="`#tab-3`" class="white--text">Subir Imagen</v-tab>
          </v-tabs>
        </template>

        <v-tabs-items v-model="model">
          <v-tab-item :value="`tab-1`">
            <v-card flat>
              <v-card-title>
                <span class="headline">Producto</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 v-if="muestraDialogEditMode">
                      <v-text-field label="Código" v-model="muestraForEdit.sid"></v-text-field>
                    </v-flex>

                    <v-spacer />

                    <v-flex xs12>
                      <v-text-field label="Tipo" v-model="muestraForEdit.tipo"></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field label="Nombre" v-model="muestraForEdit.nombre"></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="blue darken-1" flat @click="close">Cerrar</v-btn>
                <!-- Botones para agrega o editar una Muestra -->
                <!-- si estamos en modo edición sera un Modificar. Tambien podria considerarse v-if="$store.getters.productsDialogEditMode" -->
                <v-btn
                  v-if="muestraDialogEditMode"
                  color="blue darken-1"
                  flat
                  @click="update_muestra()"
                >Modificar</v-btn>
                <!-- Caso contrario sera un Agregar -->
                <v-btn v-else color="blue darken-1" flat @click="add_muestra">Guardar</v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>

          <v-tab-item :value="`tab-2`">
            <v-card flat>
              <v-card-text>
                <v-container justify-space-between>
                  <v-layout row align-content-space-around class="mx-0">
                    <v-flex xs6>
                      <v-layout column>
                        <!-- ver las imagenes que hemos subido-->
                        <v-flex xs12 v-for="item in muestraForEdit.gallery" :key="item.file_id">
                          <v-chip
                            v-if="item.url.length >0"
                            close
                            @click="mostrarImagen(item.url)"
                            @input="quitar(item)"
                          >{{item.file_id}}</v-chip>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <!-- <v-layout column> -->
                    <v-flex xs12>
                      <v-img :src="this.url_imagen" class="grey lighten-2" height="235px"></v-img>
                    </v-flex>
                    <!-- </v-layout> -->
                  </v-layout>
                </v-container>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :value="`tab-3`">
            <v-card flat>
              <v-card-text>
                <v-container justify-center>
                  <v-layout row align-content-center class="mx-0">
                    <!-- ver las imagenes que estoy por subir-->

                    <v-flex xs6>
                      <!-- COMPONENTE PARA LAS IMAGENES : FILE - INPUT {capturamos el evento 'input'} -->
                      <file-input accept="image/*" @input="getUploadedFile" />
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" outline @click="addImagen">Guardar Imagen</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-card>

    <!-- FIN: cuerpo de la ventana modal -->
  </v-dialog>
</template>

<script>
import { db } from '@/main';
import * as faker from 'faker';
import { mapGetters } from 'vuex';
import FileInput from '@/components/helpers/FileInput.vue';

export default {
  name: 'ManMuestraDialgoGalleryFB',
  components: { FileInput },
  data () {
    return {
      model: 'tab-1',
      url_imagen: ''
    }
  },
  methods: {
    close () {
      this.$store.commit('TOGGLE_MUESTRAS_DIALOG', {
        edithModeAdd: false,
        muestra: {
          sid: null,
          tipo: '',
          nombre: '',
          gallery: []
        },
        image: {
          url: '',
          file_id: ''
        }
      })

      this.url_imagen = '';
    },
    add_muestra () {
      // Agrega un registro a la base de datos MongoDB
      // Primero agregamos este registro a la base de datos Mongodb
      this.$store.dispatch('postMuestra', this.muestraForEdit).then(resp => {
        console.log(resp)
        this.$emit('process', { muestra: resp.data, modo: 'save' })
        close()
      })
    },
    update_muestra () {
      this.$store.dispatch('putMuestra', this.muestraForEdit).then(resp => {
        this.$emit('process', { muestra: resp.data, modo: 'update' })
        this.close()
      })
    },
    /*
    add () {
      // Agrega una imagen a FIREBASE

      // Segundo subimos la imagen al FileStorage
      this.imagenForEdit.id = faker.random.alphaNumeric(8)
      const uploadImagen = Object.assign({}, this.imagenForEdit)
      uploadImagen.createdAt = Date.now()
      console.log('este es el id del coumento:' + this.imagenForEdit.id)
      // Hacemos la actualizacion : Clean code : Deberia pasarse esto a los 'actions' y llamarse desde aqui mendiante el 'dispatch'
      db.collection('muestras')
        .doc(this.imagenForEdit.id) // El ID que genero FAKER
        .set(uploadImagen)
        .then(() => {
          if (this.image) {
            // Lo subimos al storage mediante el ACTION -> pushFileToStorage

            this.$store
              .dispatch('pushFileToStorage', {
                // Debe tener el mismo nombre de parametro que se define en el ACTION
                fileToUpload: this.image,
                idDocumentFireStore: uploadImagen.id
              })
              .then(resp => {
                console.log('GUARDADOOOOO en el storage' + resp)

                // Conectarse con la base de datos MongoDB, enviando: La URL, y el link
              })
              .catch(error => {
                console.log('ERROR,' + error.message)
              })
          } else {
            this._alertAndClose('GUARDADO ELSEE')
          }
        })
    },
*/
    addImagen (sid) {
      if (this.image) {
        // existe la imagen que se cargo por el componente?
        // Lo subimos al storage mediante el ACTION -> pushFileToStorage
        this.$store
          .dispatch('uploadFileToStorage', {
            // Debe tener el mismo nombre de parametro que se define en el ACTION
            fileToUpload: this.image,
            sid: this.muestraForEdit.sid // le pasamos el parametro "sid" como identificador en la consulta "$push" de MongoDB
          })
          .then(() => {
            // Conectarse con la base de datos MongoDB, enviando: La URL, y el link
          })
          .catch(error => {
            console.log('ERROR,' + error.message)
          })
      } else {
        this._alertAndClose('GUARDADO ELSEE')
      }
    },
    update () {
      const muestra = Object.assign({}, this.muestraForEdit)

      // Tratamos de actualizar  la imagen que se ha subido.
      /* db.collection('muestras')
        .doc(muestra.id)
        .update(muestra)
        .then(() => {
          if (this.image) {
            // si ocurre algun error mientras sube el archivo, debemos limpiar la informacion
            if (muestra.image.url) {
              // Físicamente eliminamos el archivo del servidor
              this.$store.dispatch('removeFile', muestra).then(() => {
                // Si por algun motivo no pudo eliminarlo
                this.$store.dispatch('updateDeletedMuestra', muestra.id)
              })
            }

            // subimos la nueva imagen
            this.$store
              .dispatch('pushFileToStorage', {
                fileToUpload: this.image,
                id: muestra.id
              })
              .then(() => {
                console.log('ACTUALIZADOOOO IF :)')
              })
          } else {  
            console.log('ACTUALIZADOOOO ELSE ')
          }
        }) */
    },
    getUploadedFile (e) {
      // gestiona el evento que lanzo el componente hijo 'FileInput'
      this.image = e
    },
    _alertAndClose (action) {
      console.log('ALERT MESSAGE:' + action)
      this.close()
    },
    mostrarImagen (url) {
      // muestra la URL de la imagen en la pestaña 'Galery'
      this.url_imagen = url
    },
    quitar (imagen) {
      confirm('Confirmas que deseas eliminar esta imagen?') &&
        this.$store
          .dispatch('removeFile', {
            sid: this.muestraForEdit.sid,
            imagen: imagen
          })
          .then(resp => {
            this.url_imagen = '';
          })
    }
  },
  computed: {
    muestraDialog: {
      // verifica gracias al getter el estado de la ventana modal: Esta mostrandose o esta ocultandose
      get () {
        return this.$store.getters.muestraDialog
      },
      set () {
        this.close()
      }
    },
    ...mapGetters(['muestraForEdit', 'muestraDialogEditMode'])
  }
}
</script>
