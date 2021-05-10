<template v-if="state">
  <div id="single-page">
    <div class="overlay w-100 position-fixed on" @click="closeModal()"></div>
    <div class="bottom-sheet">
      <div class="bottom-sheet-handle" @click="closeModal()"></div>
      <div class="d-block w-100 container bg-white position-relative overflow-x-hidden delivery-form">
        <div class="row">
          <div class="col col-12">
            <div>
              <small class="text-secondary">Select Delivery Status</small><br>
              <select v-model="status" v-on:change="handleStatus()" class="form-control d-block w-100 mt-1 mb-2">
                <option value="delivered">Delivered</option>
                <option value="not-delivered">Not Delivered</option>
              </select>
              <small v-if="status === 'delivered'" class="text-secondary" >Received By<br></small>
              <input v-if="status === 'delivered'" v-model="receivedby" type="text" class="form-control d-block w-100 mt-1 mb-2" placeholder="Package received by" />
              <small class="text-secondary">Date & Time</small><br>
              <input v-model="dateTime" type="text" disabled class="form-control d-block w-100 mt-1 mb-2" :placeholder="dateTime" />
              <small class="text-secondary">Add Delivery Notes (optional)</small><br>
              <textarea v-model="notes" class="form-control d-block w-100 mt-1 mb-3"></textarea>
              <button v-if="status === 'delivered' && image" @click="requestCamera()" class="btn btn-sm px-4 py-3 my-3 d-block w-100 bg-secondary text-white">
                Update photo
              </button>
              <img :src="'data:image/jpeg;base64,' + image" v-if="image" id="preview" class="d-block w-100 my-3 rounded" />
              <button @click="handleForm()" class="btn btn-sm px-4 py-3 mt-3 d-block w-100 bg-black text-white">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Alert v-if="showAlert" v-on:toggleAlert="toggleAlert()" :title="alertTitle" :text="alertText" :button="alertButton" />
</template>

<script>
import $ from 'jquery'
import _ from '../services/utility.js'
import Alert from './Alert.vue'
import moment from 'moment'
import router from '@/router'

export default {
  name: 'DeliveryForm',
  emits: ['cancelDeliver'],
  data () {
    return {
      status: 'delivered',
      notes: '',
      image: '',
      receivedby: '',
      showAlert: false,
      alertTitle: '',
      alertText: '',
      alertButton: '',
      dateTime: '',
      shouldReload: false
    }
  },
  props: {
    state: {
      type: Boolean,
      default: false
    },
    orderid: {
      type: Number,
      required: true
    },
    userid: {
      type: Number,
      required: true
    }
  },
  components: {
    Alert
  },
  created () {
    this.updateDateTime()
    setInterval(() => {
      this.updateDateTime()
    }, 60000)
  },
  methods: {
    closeModal: function () {
      this.$emit('cancelDeliver', this.$event)
    },
    requestCamera: function () {
      try {
        navigator.camera.getPicture(this.setImage, this.handleError, { quality: 20, destinationType: 0 })
      } catch (e) {
        this.handleError('Sorry, we can\'t do that. We are unable to open this device\'s camera.')
      }
    },
    updateDateTime: function () {
      this.dateTime = moment(new Date()).format('MMM Do YYYY - hh:mm A')
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
        this.receivedby = ''
        this.image = ''
      }
      this.submitData()
    },
    toggleAlert: function () {
      this.showAlert = false
      if (this.shouldReload) {
        router.push('../home')
      }
    },
    submitData: function () {
      this.showAlert = true
      this.alertTitle = 'Sending Data'
      this.alertText = 'Please dont turn off the app. Changes may not be saved.'
      this.alertButton = '_LOADING_'
      const postData = {
        image: this.image,
        status: this.status,
        notes: this.notes,
        receivedby: this.receivedby,
        orderid: this.orderid,
        userid: this.userid
      }

      console.log(postData)

      const request = $.get({
        url: _.C.API_UPDATE,
        method: 'post',
        data: postData
      })

      request.done(data => {
        var _alertTitle = 'Oops'
        var _alertText = 'Something went wrong. ' + data.message
        var _alertButton = 'Try Again'
        if (data.response) {
          this.shouldReload = true
          _alertTitle = 'Thank you'
          _alertText = 'Delivery data was saved successfully.'
          _alertButton = 'Done'
        }

        setTimeout(() => {
          this.showAlert = false
        }, 2000)
        setTimeout(() => {
          this.showAlert = true
          this.alertTitle = _alertTitle
          this.alertText = _alertText
          this.alertButton = _alertButton
        }, 2100)
      })

      request.fail(function (jqXHR, textStatus) {
        alert('The server can\'t handle your request. Please try again later.')
        location.reload()
      })
    }
  }
}

</script>
