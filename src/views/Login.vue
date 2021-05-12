<template>
  <div id="single-page">
    <div v-if="!locationReady" class="d-block w-100 container position-relative overflow-x-hidden">
      <div class="row">
        <LoadingCard />
      </div>
    </div>
    <Map :long="long" :lat="lat" v-if="locationReady" />
    <div class="bottom-sheet" style="z-index: 1001" v-if="locationReady">
      <div class="d-block w-100 container position-relative overflow-x-hidden">
        <div class="row">
          <div class="col col-12">
            <div class="mb-3">
              <h1 class="fw-bold my-0 text-center">WMS Tracker</h1>
              <p class="text-secondary text-center">Please login with your credentials</p>
              <input v-model="username" type="text" class="form-control" placeholder="Enter your username" />
            </div>
            <div class="mb-3">
              <input v-model="password" type="password" class="form-control" placeholder="Enter your password" />
            </div>
          </div>
          <div class="col col-12">
            <button @click="login()" class="btn btn-sm d-block w-100 py-3 text-white px-4 bg-black mb-2 position-relative">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Alert v-if="showAlert" v-on:toggleAlert="this.showAlert = false;this.loading = false" :title="title" :text="description" :button="button" />
</template>

<script>
import LoadingCard from '../components/LoadingCard.vue'
import Alert from '../components/Alert.vue'
import router from '@/router'
import Map from '../components/Map.vue'
import { _isAuth, _logIn } from '../services/auth'

export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      showAlert: false,
      title: '',
      description: '',
      button: '',
      loading: false,
      long: 0,
      lat: 0,
      locationReady: false
    }
  },
  setup () {
    if (_isAuth()) {
      router.push('home')
    }
  },
  components: {
    Alert,
    Map,
    LoadingCard
  },
  mounted () {
    this.getLocation()
  },
  methods: {
    login: function () {
      this.loading = true
      const name_ = this.username
      const pass_ = this.password

      this.title = 'Logging In'
      this.description = 'Hold on as we verify your user credentials'
      this.button = '_LOADING_'
      this.showAlert = true

      if (!name_ || !pass_) {
        this.title = 'Oops'
        this.description = 'Authentication failed. Username and password is required'
        this.button = 'Try again'
        this.showAlert = true
        return
      }

      const credentials = {
        name: name_,
        pass: pass_
      }
      _logIn(this.loginSuccess, this.loginFail, credentials)
    },
    loginSuccess: function () {
      location.reload()
    },
    loginFail: function () {
      this.title = 'Authentication failed'
      this.description = 'You have entered an invalid username or password'
      this.button = 'Try again'
      this.showAlert = true
    },
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
      this.showAlert = true
      this.title = 'Error: ' + error.code
      this.description = 'Unable to get device location. ' + error.message
      this.button = 'Try again'
    }
  }
}
</script>
