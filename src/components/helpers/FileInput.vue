<template>
  <div>
    <div>
      <img :src="imageUrl" ref="imageUrl" height="150" @click="onPickFile" style="cursor: pointer;" />
    </div>
    <div>
      <v-btn raised @click="onPickFile" v-if="!imageUrl">Elegir imagen</v-btn>
      <v-btn raised class="error" @click="removeFile" v-else>Quitar imagen</v-btn>
      <input type="file" ref="image" name="image" :accept="accept" @change="onFilePicked" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      // Valor de la URL
      type: String
    },
    accept: {
      // Tipos de archivos que se aceptan
      type: String,
      default: '*'
    },
    selectLabel: {
      // Label para poder mostrar el botón 'AÑADIR'
      type: String
    },
    removeLabel: {
      // Label para poder mostrar el botón 'ELIMINAR'
      type: String
    }
  },

  data () {
    return {
      imageUrl: ''
    }
  },

  watch: {
    // A través del Watcher controlar la información
    value (value) {
      this.imageUrl = value
    }
  },

  mounted () {
    this.imageUrl = this.value
  },

  methods: {
    onPickFile () {
      this.$refs.image.click()
    },

    onFilePicked (event) {
      // CUANDO SELECCIONAMOS EL ARCHIVO
      const files = event.target.files || event.dataTransfer.files

      if (files && files[0]) {
        let filename = files[0].name

        if (filename && filename.lastIndexOf('.') <= 0) {
          return
        }

        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.imageUrl = fileReader.result
        })

        fileReader.readAsDataURL(files[0]) // Aqui hacemos el 'PREVIEW' que se le mostrará al usuario

        // Emite un evento 'iinput' para que lo atrape un componente Padre ->(AdminProductsDialog.vue)
        this.$emit('input', files[0])
      }
    },

    removeFile () {
      this.imageUrl = '';
    }
  }
}
</script>

<style scoped>
input[type="file"] {
  position: absolute;
  left: -99999px;
}
</style>
