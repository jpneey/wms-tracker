<template>
  <div v-if="items.length > 0 && !loading" class="position-fixed nav secondary d-block w-100 border-bottom container bg-white">
    <div id="nav" class="row row-cols-3 m-0">
      <div class="col">
        <span @click="$router.go(-1)" class="text-decoration-none material-icons align-middle abs-centered abs-left">arrow_back</span>
      </div>
    </div>
  </div>
  <div class="enter" v-if="loading" >
    <div class="d-block w-100 container pb-3 bg-white position-relative overflow-x-hidden">
      <div class="row">
        <div class="col col-12">
          <LoadingCard :cardCount="1" />
        </div>
      </div>
    </div>
  </div>
  <div v-if="items.length > 0 && !loading" class="enter inmed-border-bottom">
    <div class="d-block w-100 container bg-white position-relative overflow-x-hidden border-bottom">
      <div class="row">
        <div class="col col-12 mt-5">
          <p class="h4 fw-bold mt-0 mb-0">{{ items[0].slip_no }}</p>
          <p class="mt-1 mb-4 text-secondary">{{ items[0].customer_address }}</p>
          <p class="text-small">
            <small :class="footerClass(items[0].tracking_status)">{{ footerActionText(items[0].tracking_status) }}</small>
            <small class="ms-1" :class="delayClass(getDelay(items[0].ship_date))">{{ getDelay(items[0].ship_date) }} day(s) delayed</small>
          </p>
        </div>
      </div>
    </div>
    <div class="d-block w-100 container bg-white position-relative overflow-x-hidden border-bottom text-small">
      <div class="row">
        <div class="col col-6">
          <p class="my-3">
            <span class="text-secondary">Slip order date</span><br>
            <span class="fw-bold">{{ formatDate(items[0].slip_order_date) }}</span>
          </p>
        </div>
        <div class="col col-6 text-end">
          <p class="my-3">
            <span class="text-secondary">Shipment date</span><br>
            <span class="fw-bold">{{ formatDate(items[0].ship_date) }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="d-block w-100 container bg-white position-relative overflow-x-hidden border-bottom text-small">
      <div class="row">
        <div class="col col-12">
          <div class="my-3 d-block w-100 position-relative">
            <span class="text-secondary">Bill To</span><br>
            <span>{{ items[0].bill_to }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="d-block w-100 container bg-white position-relative overflow-x-hidden border-bottom text-small">
      <div class="row">
        <div class="col col-12">
          <div class="my-3 d-block w-100 position-relative">
            <span class="text-secondary">Customer Address</span><br>
            <span>{{ items[0].customer_address }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="d-block w-100 container bg-white position-relative overflow-x-hidden border-bottom text-small">
      <div class="row">
        <div class="col col-6">
          <p class="my-3">
            <span class="text-secondary">Reference</span><br>
            <span>#{{ items[0].reference }}</span>
          </p>
        </div>
        <div class="col col-6 text-end">
          <p class="my-3">
            <span class="text-secondary">Sales Person</span><br>
            <span>{{ items[0].sales_person }}</span>
          </p>
        </div>
      </div>
    </div>
    <div v-if="!deliver" class="d-block w-100 container bg-white position-relative overflow-x-hidden">
      <div class="row">
        <div class="col col-12">
          <button @click="initDeliver()" class="btn btn-sm px-4 py-3 my-3 d-block w-100 bg-black text-white">Update Order</button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="!items.length && !loading">
    <Empty :title="'Hey there'" :description="'Are you lost? There are no pending orders here'" />
  </div>
  <DeliveryForm v-if="deliver" :orderid="parseInt(orderid)" :userid="parseInt(userId)" :state="deliver" v-on:cancelDeliver="initDeliver()" />
  <Alert v-if="alertShow" v-on:toggleAlert="reload()" />
</template>

<script>
import $ from 'jquery'
import _ from '../services/utility.js'
import { ref } from 'vue'
import { _isAuth } from '../services/auth.js'
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
    const userId = _isAuth()
    const request = $.ajax({
      url: _.C.API_SINGLE + props.orderid + '&uid=' + userId,
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
    return { items, loading, alertShow, alertButton, alertText, alertTitle, userId }
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
    },
    footerClass (type) {
      var className = 'bg-primary px-3 py-1 text-white rounded'
      type = type.toLowerCase().trim()
      switch (type) {
        case 'failed':
          className = 'bg-danger px-3 py-1 text-white rounded'
          break
      }
      return className
    },
    footerActionText (type) {
      var text = 'Pending'
      type = type.toLowerCase().trim()
      switch (type) {
        case 'failed':
          text = 'Failed'
          break
      }
      return text
    },
    getDelay (shipDate) {
      var main = moment(shipDate, 'YYYY MM DD')
      var today = moment()
      return today.diff(main, 'days')
    },
    delayClass (type) {
      var className = 'd-none'
      if (type) {
        className = 'bg-warning px-3 py-1 text-white rounded'
      }
      return className
    }
  }
}
</script>
