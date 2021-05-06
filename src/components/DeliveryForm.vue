<template v-if="state">
  <div class="d-block w-100 container bg-white position-relative overflow-x-hidden delivery-form">
    <div class="row">
      <div class="col col-12">
        <div class="my-3">
          <small class="text-secondary">Select Delivery Status</small><br>
          <select v-model="status" v-on:change="handleStatus()" class="form-control d-block w-100 my-3">
            <option value="delivered">Delivered</option>
            <option value="not-delivered">Not Delivered</option>
          </select>
          <small class="text-secondary">Add Delivery Notes (optional)</small><br>
          <textarea v-model="notes" class="form-control d-block w-100 my-3"></textarea>
          <button v-if="status === 'delivered'" @click="requestCamera()" class="btn btn-sm px-4 py-3 my-3 d-block w-100 bg-secondary text-white">
            {{ ( image ) ? 'Update photo' : 'Add Image' }}
          </button>
          <img :src="'data:image/jpeg;base64,' + image" v-if="image" id="preview" class="d-block w-100 my-3 rounded" />
          <button @click="handleForm()" class="btn btn-sm px-4 py-3 my-3 d-block w-100 bg-black text-white">Submit</button>
        </div>
      </div>
    </div>
  </div>
  <Alert v-if="showAlert" v-on:toggleAlert="this.showAlert = false" :title="alertTitle" :text="alertText" :button="alertButton" />
</template>

<script>
import Alert from './Alert.vue'

export default {
  name: 'DeliveryForm',
  emits: ['cancelDeliver'],
  data () {
    return {
      status: 'delivered',
      notes: '',
      image: '',
      showAlert: false,
      alertTitle: '',
      alertText: '',
      alertButton: ''
    }
  },
  props: {
    state: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Alert
  },
  methods: {
    requestCamera: function () {
      try {
        navigator.camera.getPicture(this.setImage, this.handleError, { quality: 20, destinationType: 0 })
      } catch (e) {
        this.handleError('Sorry, we can\'t do that. We are unable to open this device\'s camera.')
      }
    },
    setImage: function (imageData) {
      this.image = imageData
    },
    handleError: function (message) {
      this.showAlert = true
      this.alertTitle = ''
      this.alertText = message
      this.alertButton = 'Ok'
    },
    handleStatus: function () {
      this.image = (this.status === 'delivered') ? this.image : ''
    },
    handleForm: function () {
      if (!this.status) {
        this.handleError('Delivery status can\'t be empty')
        return
      }
      if (this.status === 'delivered' && !this.image) {
        this.requestCamera()
        return
      }
      if (this.status !== 'delivered') {
        this.image = ''
      }
      this.submitData()
    },
    submitData: function () {
      this.showAlert = true
      this.alertTitle = 'Sending Data'
      this.alertText = 'Work in progress'
      this.alertButton = 'Done'
    }
  }
}

</script>
