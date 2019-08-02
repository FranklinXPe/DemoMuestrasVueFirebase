import firebase from 'firebase'
import * as faker from 'faker'
import {
  db
} from '@/main'

import ApiService from '@/services/ApiService.js'

const initialState = () => ({

  dialog: false,
  editMode: false,

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

export default {
  state: initialState(),
  /* -------  MUTATIONS ------- */
  mutations: {

    TOGGLE_MUESTRAS_DIALOG: (state, data) => {
      state.dialog = !state.dialog
      state.editMode = data.editMode
      state.muestra = data.muestra
      state.image = data.image
    },

    SET_IMAGE: (state, img) => {
      state.image = img
    },
    ADD_IMAGE_GALLERY: (state, img) => {
      state.muestra.gallery.push(img)
    },
    REMOVE_IMAGE_GALLERY: (state, imagen) => {
      for (var i = 0; i < state.muestra.gallery.length; i++) {
        if (state.muestra.gallery[i].file_id === imagen.file_id) {
          state.muestra.gallery.splice(i, 1)

          break
        }
      }
    }

  },
  /* -------  ACTIONS: todos apuntan al Storage ------- */
  actions: {
    fetchMuestras ({
      commit
    }) {
      return ApiService.getMuestras()
    },

    uploadFileToStorage ({ // SUBIR EL ARCHIVO
      commit
    }, {
      fileToUpload,
      sid
    }) {
      const storageRef = firebase.storage().ref()
      const fileId = faker.random.alphaNumeric(8) // identificador del archivo en el STORAGE
      const uploadTask = storageRef.child(`/muestras/${fileId}`).put(fileToUpload)

      console.log('este es el id del documento:' + fileId)

      // Para acceder al progreso de la subida del archivo
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          const snap = firebase.storage.UploadTaskSnapshot
        },
        (error) => {
          console.log(error)
        },
        () => { // BLOQUE EXITO
          // Agrega al storage
          storageRef.child(`/muestras/${fileId}`).getDownloadURL().then(url => {
            // Actualiza la tabla 'muestras'
            commit('SET_IMAGE', {
              file_id: fileId,
              url: url
            })

            // Actualizamos la lista de  de la galeria que se acaba de subir.
            commit('ADD_IMAGE_GALLERY', {
              file_id: fileId,
              url: url
            })

            // Aqui mismo inmediatemante despues de subido el archivo al Firebase-STORAGE
            // Actualizamos el documento en el MongoDB
            ApiService.putAgregarImagenEnGaleria(sid, {
              file_id: fileId,
              url: url
            })
          })
        })
    },

    removeFile ({
      commit
    }, {
      sid,
      imagen
    }) { // Fisicamente se elimina el archivo de Storage
      return firebase.storage().ref().child(`muestras/${imagen.file_id}`).delete().then(resp => {
        // Eliminamos de la base de datos MONGODB en su correspondiente documento
        ApiService.putEliminarImagenEnGaleria(sid, {
          file_id: imagen.fileId,
          url: imagen.url
        }).then(() => {
          commit('REMOVE_IMAGE_GALLERY', {
            file_id: imagen.file_id
          }

          )
        })
      })
    },

    updateDeletedMuestra ({
      commit
    }, id) {
      let muestra = firebase.firestore().collection('muestras').doc(id)
      if (muestra) {
        return muestra.update({ // Limpia la información de la muestra

          image: {
            url: '',
            file_id: ''
          }

        })
      }
    },

    // Agregar registro MUESTRA
    postMuestra ({
      commit
    }, muestra) {
      return ApiService.postMuestra(muestra)
    },
    putMuestra ({
      commit
    }, muestra) {
      return ApiService.putMuestra(muestra)
    },
    deleteMuestra ({
      commit
    }, muestra) {
      return ApiService.deleteMuestra(muestra)
    }

  },
  /* -------  GETTERS ------- */
  getters: {

    muestraDialog: (state) => {
      // Nos permita saber el estado de la 'ventana modal' si esta abierta o cerrada
      return state.dialog
    },
    muestraDialogEditMode: (state) => {
      return state.editMode
    },

    // ---------
    muestraForEdit: (state) => { // retorna el estado de la Muestra
      return state.muestra
    },
    imagenForEdit: (state) => { // retorna el estado de la imagen que se esta subiendo al STORAGE
      return state.image
    }

  }

}
