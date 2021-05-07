<template>
  <div class="position-fixed nav d-block w-100 border-bottom shadow-sm container bg-white">
    <div id="nav" class="row row-cols-3 m-0">
      <div class="col">
        <span @click="toggleSidebar()" class="text-decoration-none material-icons align-middle abs-centered abs-left">menu</span>
      </div>
      <div class="col text-center">
        <span class="page-title abs-centered">{{ renderTitle }}</span>
      </div>
      <div class="col text-end">
        <span @click="exitConfirm()" class="text-decoration-none material-icons abs-centered abs-right">exit_to_app</span>
      </div>
    </div>
  </div>
  <Sidebar :state="state" v-on:toggleSideBar="toggleSidebar()" />
  <router-view />
  <Confirm v-if="exiting" v-on:yes="exitApp(true)" v-on:no="exitApp(false)" :title="'Quit Application'" :text="'unsaved changes will not be saved'" :yes="'Log out'" />
</template>
<script>
import Sidebar from './components/Sidebar.vue'
import Confirm from './components/Confirm.vue'
import { _logOut } from './services/auth'

export default {
  name: 'app',
  computed: {
    renderTitle () {
      return this.$route.name
    }
  },
  components: {
    Sidebar,
    Confirm
  },
  data () {
    return {
      state: false,
      exiting: false
    }
  },
  methods: {
    exitConfirm: function () {
      this.exiting = true
    },
    exitApp: function (exit) {
      if (!exit) {
        this.exiting = false
        return
      }
      _logOut()
      if (navigator.app) {
        navigator.app.exitApp()
      } else if (navigator.device) {
        navigator.device.exitApp()
      } else {
        window.close()
      }
      location.reload()
    },
    toggleSidebar: function () {
      this.state = !this.state
    }
  }
}
</script>
