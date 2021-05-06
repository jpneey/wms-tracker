<template>
  <div class="enter" v-if="loading" >
    <div class="d-block w-100 container pb-3 bg-white position-relative overflow-x-hidden border-bottom">
      <div class="row">
        <div class="col col-12">
          <LoadingCard :cardCount="1" />
        </div>
      </div>
    </div>
  </div>
  <div v-if="items.length > 0 && !loading" class="enter">
    <div class="d-block w-100 container bg-white position-relative overflow-x-hidden border-bottom">
      <div class="row">
        <div class="col col-12">
          <p class="h4 fw-bold mt-5 mb-0">{{ items[0].slip_no }}</p>
          <p class="mt-1 mb-4 text-secondary">{{ items[0].customer_address }}</p>
        </div>
      </div>
    </div>
    <div class="d-block w-100 container bg-white position-relative overflow-x-hidden border-bottom">
      <div class="row">
        <div class="col col-6">
          <p class="my-3">
            <small class="text-secondary">Slip order date</small><br>
            <span class="fw-bold">{{ formatDate(items[0].slip_order_date) }}</span>
          </p>
        </div>
        <div class="col col-6 text-end">
          <p class="my-3">
            <small class="text-secondary">Shipment date</small><br>
            <span class="fw-bold">{{ formatDate(items[0].ship_date) }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="d-block w-100 container bg-white position-relative overflow-x-hidden border-bottom">
      <div class="row">
        <div class="col col-12">
          <div class="my-3 d-block w-100 position-relative">
            <small class="text-secondary">To be received by</small><br>
            <span class="fw-bold">{{ items[0].detrack_receivedby }}</span>
            <i @click="$router.back()" class="material-icons bg-black text-white p-1 rounded position-absolute go-back">arrow_back</i>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!deliver" class="d-block w-100 container bg-white position-relative overflow-x-hidden">
      <div class="row">
        <div class="col col-12">
          <button @click="initDeliver()" class="btn btn-sm px-4 py-3 my-4 d-block w-100 bg-black text-white">Update Order</button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="!items.length && !loading">
    <Empty :title="'Hey there'" :description="'Are you lost? There are no pending orders here'" />
  </div>
  <DeliveryForm v-if="deliver" :state="deliver" v-on:cancelDeliver="initDeliver()" />
  <Alert v-if="alertShow" v-on:toggleAlert="reload()" />
</template>

<script>
import $ from 'jquery'
import _ from '../services/utility.js'
import { ref } from 'vue'
import moment from 'moment'
import LoadingCard from '../components/LoadingCard.vue'
import DeliveryForm from '../components/DeliveryForm.vue'
import Alert from '../components/Alert.vue'
import Empty from '../components/Empty.vue'

export default {
  name: 'Order',
  props: ['orderid'],
  data () {
    return {
      deliver: false
    }
  },
  components: {
    LoadingCard,
    DeliveryForm,
    Alert,
    Empty
  },
  setup (props) {
    const items = ref([])
    const loading = ref(true)
    const alertShow = ref(false)
    const alertTitle = ref('')
    const alertText = ref('')
    const alertButton = ref('')
    const request = $.ajax({
      url: _.C.API_SINGLE + props.orderid,
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
      loading.value = true
      items.value = []
      alertShow.value = true
    })
    return { items, loading, alertShow, alertButton, alertText, alertTitle }
  },
  methods: {
    formatDate (date) {
      var pre = moment(date)
      return pre.isValid() ? pre.format('MMMM D YYYY') : '- - -'
    },
    initDeliver () {
      this.deliver = !this.deliver
    },
    reload: function () {
      location.reload()
    }
  }
}
</script>
