<template>
  <div id="single-page" v-if="locationReady">
    <Map :long="long" :lat="lat" />
  </div>
  <div v-if="!locationReady" class="d-block w-100 container position-relative overflow-x-hidden">
    <div class="row">
      <LoadingCard />
    </div>
  </div>
</template>

<script>
import Map from '../components/Map.vue'
import LoadingCard from '../components/LoadingCard.vue'

export default {
  name: 'Locator',
  data () {
    return {
      long: 0,
      lat: 0,
      locationReady: false
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
    LoadingCard
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
      alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n')
    }
  }
}
</script>
