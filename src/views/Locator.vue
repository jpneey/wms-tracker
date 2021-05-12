<template>
  <div id="single-page" v-if="locationReady">
    <Map :long="long" :lat="lat" />
  </div>
  <div v-if="!locationReady" class="d-block w-100 container position-relative overflow-x-hidden">
    <div class="row">
      <LoadingCard />
    </div>
  </div>
  <Confirm v-if="showConfirm" v-on:yes="this.openSettings()" v-on:no="this.reload()" :title="title" :text="description" :yes="button" :no="'Reload'" />
</template>

<script>
import Map from '../components/Map.vue'
import Confirm from '../components/Confirm.vue'
import LoadingCard from '../components/LoadingCard.vue'

export default {
  name: 'Locator',
  data () {
    return {
      long: 0,
      lat: 0,
      locationReady: false,
      showConfirm: false,
      title: '',
      description: '',
      button: ''
    }
  },
  props: {
    query: {
      type: String,
      default: 'Inmed Corporation'
    }
  },
  components: {
    Map,
    LoadingCard,
    Confirm
  },
  mounted () {
    this.getLocation()
  },
  methods: {
    getLocation: function () {
      navigator.geolocation.getCurrentPosition(this.successCallback, this.errorCallback, { enableHighAccuracy: true, timeout: 5000 })
    },
    successCallback: function (position) {
      this.lat = position.coords.latitude
      this.long = position.coords.longitude
      setTimeout(() => {
        this.locationReady = true
      }, 1000)
    },
    errorCallback: function (error) {
      this.showConfirm = true
      this.title = 'Error: ' + error.code
      this.description = 'Unable to get device location. Please check if gps is on and you are connected on a reliable internet connection. Error:' + error.message
      this.button = 'Settings'
    },
    reload: function () {
      window.location.reload()
    },
    openSettings: function () {
      window.cordova.plugins.settings.open('location', function () {
        console.log('opened settings')
      }, function () {
        this.title = 'Sorry about that'
        this.description = 'We\'re unable to open the location settings of you phone.'
      })
    }
  }
}
</script>
