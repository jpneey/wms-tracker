<template>
  <div class="d-block bg-white w-100 container position-relative overflow-x-hidden inmed-border-bottom">
    <div class="row">
      <LoadingCard v-if="loading" />
      <div class="col col-12 px-0">
        <ItemCard v-if="items.length > 0 && !loading" :item="items" />
      </div>
    </div>
  </div>
  <Empty v-if="!items.length && !loading" :title="'Your\'e all done!'" :description="'There are no pending deliveries assigned to you'" />
  <Alert v-if="showAlert" v-on:toggleAlert="reload()" />
</template>

<script>
import $ from 'jquery'
import _ from '../services/utility.js'
import { _isAuth } from '../services/auth.js'
import ItemCard from '../components/ItemCard.vue'
import LoadingCard from '../components/LoadingCard.vue'
import { ref } from 'vue'
import Alert from '../components/Alert.vue'
import Empty from '../components/Empty.vue'

export default {
  name: 'Home',
  data () {
    return {
      search: ''
    }
  },
  setup () {
    const items = ref([])
    const loading = ref(true)
    const showAlert = ref(false)
    const userId = _isAuth()
    const request = $.ajax({
      url: _.C.API_ALL + '&_=' + userId,
      method: 'get'
    })
    request.done(data => {
      items.value = data.data
      setTimeout(() => {
        loading.value = false
      }, 1000)
    })
    request.fail(function (jqXHR, textStatus) {
      /* alert(JSON.stringify(jqXHR, null, 4) + '\r\n' + JSON.stringify(textStatus, null, 4)) */
      items.value = []
      loading.value = true
      showAlert.value = true
    })
    return { items, loading, showAlert }
  },
  components: {
    ItemCard,
    LoadingCard,
    Alert,
    Empty
  },
  methods: {
    reload: function () {
      location.reload()
    }
  }
}
</script>
