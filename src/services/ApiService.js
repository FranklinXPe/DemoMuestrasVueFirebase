import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:5020',
  withCredentials: false,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
})

export default {

  getValidateAuthToken (idToken) {
    const headers = {
      'ID-TOKEN': idToken
    }

    apiClient.get('/api/validate', headers)
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
        console.log('Unable to create user, User not Logged In', error.message)
      })
  },
  getMuestras () {
    return apiClient.get('/muestras/')
  },

  getMuestra (id) {
    return apiClient.get('/muestras/' + id)
  },

  /* ==================   C R U D   ================== */
  postMuestra (muestra) {
    return apiClient.post('/muestras/', muestra)
  },
  putMuestra (muestra) {
    return apiClient.put('/muestras/' + muestra.sid, muestra)
  },
  deleteMuestra (muestra) {
    return apiClient.delete('/muestras/' + muestra.sid, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      data: {
        muestra: muestra
      }
    })
  },
  putAgregarImagenEnGaleria (sid, imagen) {
    return apiClient.put('/muestras/' + sid + '/galeria/add', imagen)
  },
  putEliminarImagenEnGaleria (sid, imagen) {
    return apiClient.put('/muestras/' + sid + '/galeria/delete', imagen)
  }
}
