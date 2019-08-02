import firebase from 'firebase'
import * as faker from 'faker'

const initialState = () => ({

  dialog: false,
  editMode: false,
  muestra: {
    id: null,
    tipo: '',
    nombre: '',
    image: {
      url: '',
      file_id: ''
    }
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
    }
  },
  /* -------  ACTIONS: todos apuntan al Storage ------- */
  actions: {
    fetchMuestras ({
      commit
    }) {
      return EventService.getMuestras()
    },

    pushFileToStorage ({ // SUBIR EL ARCHIVO
      commit
    }, {
      fileToUpload,
      id
    }) {
      const storageRef = firebase.storage().ref()
      const fileId = faker.random.alphaNumeric(8)
      const uploadTask = storageRef.child(`/muestras/${fileId}`).put(fileToUpload)

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
            let product = firebase.firestore().collection('muestras').doc(id)
            return product.update({
              image: {
                url: url,
                file_id: fileId
              }
            })
          })
        })
    },

    removeFile ({
      commit
    }, muestraData) { // 'Fisicamente' se elimina el archivo del Storage
      return firebase.storage().ref().child(`muestras/${muestraData.file_id}`).delete()
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
    }

  },
  /* -------  GETTERS ------- */
  getters: {

    muestraDialog: (state) => {
      // Nos permita saber el estado de la 'ventana modal' si esta abierta o cerrada
      return state.dialog
    },
    muestraForEdit: (state) => {
      return state.muestra
    },
    muestraDialogEditMode: (state) => {
      return state.editMode
    }

  }

}
