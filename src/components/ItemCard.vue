<template>
  <div class="mt-4 mb-3 position-relative search-wrapper border rounded enter">
    <i class="material-icons search bg-black">search</i>
    <input type="search" name="search" class="search-field" v-model="search" placeholder="Enter tracking number" />
  </div>
  <template v-for="item in filteredItems" :key="item.slip_id">
    <router-link :to="'/order/' + item.slip_id" class="text-decoration-none">
      <div class="pt-3 pb-0 d-block w-100 bg-white item mb-3 overflow-hidden border rounded orders enter">
        <div class="row">
          <div class="col col-5 px-4">
            <p class="mb-0 text-uppercase sub-text text-body">#{{ item.slip_no }}</p>
          </div>
          <div class="col col-7 text-end px-4">
            <p class="mb-0 sub-text fw-normal">
              <small class="" :class="footerClass(item.tracking_status)">{{ footerActionText(item.tracking_status) }}</small>
            </p>
          </div>
          <div class="col col-12 px-4 mt-2">
            <p class="mt-2 mb-3 text-small">
              <span>{{ formatDate(item.ship_date) }}</span>
              <small class="ms-1" :class="delayClass(getDelay(item.ship_date))">&mdash;<b>{{ getDelay(item.ship_date) }} day(s) delayed</b></small>
              <span class="text-secondary ps-2">{{ item.customer_address || 'No data available' }}</span>
            </p>
          </div>
        </div>
      </div>
    </router-link>
  </template>
  <div v-if="filteredItems.length <= 0" class="pt-3 pb-0 d-block w-100 bg-white item mb-4 rounded border overflow-hidden orders enter">
    <div class="row">
      <div class="col col-12 px-4">
        <p class="my-2 mb-3 text-small">No data available related to: <b>{{ search }}</b></p>
      </div>
      <div class="col col-12">
        <div class="p-3 item-footer position-relative bg-light">
          <p class="mb-0 text-uppercase sub-text position-relative">Clear filter</p>
          <i class="open-order text-decoration-none material-icons" @click="clearSearch()">close</i>
        </div>
      </div>
    </div>
  </div>
  <label id="date-filter" @click="filterByDate()" class="fab material-icons bg-black text-white shadow">date_range</label>
  <div class="overlay w-100 position-fixed on z-top" @click="filterByDate()" v-if="filterDate"></div>
</template>

<script>
import moment from 'moment'
import datepicker from 'js-datepicker'
import 'js-datepicker/dist/datepicker.min.css'

export default {
  name: 'ItemCard',
  props: {
    item: Array
  },
  data () {
    return {
      items: this.item,
      search: '',
      filterDate: false
    }
  },
  computed: {
    filteredItems () {
      const search = this.search.toLowerCase().trim()
      if (!search) return this.items
      return this.items.filter(c => c.ship_to.toLowerCase().indexOf(search) > -1 || c.slip_no.toLowerCase().indexOf(search) > -1 || c.slip_order_date.toLowerCase().indexOf(search) > -1)
    }
  },
  methods: {
    clearSearch () {
      this.search = ''
    },
    formatDate (date) {
      var pre = moment(date)
      return pre.isValid() ? pre.format('MMMM D YYYY') : ''
    },
    footerClass (type) {
      var className = 'bg-primary px-2 py-1 text-white rounded'
      type = type.toLowerCase().trim()
      switch (type) {
        case 'failed':
          className = 'bg-danger px-2 py-1 text-white rounded'
          break
      }
      return className
    },
    getDelay (shipDate) {
      var main = moment(shipDate, 'YYYY MM DD')
      var today = moment()
      return today.diff(main, 'days')
    },
    delayClass (type) {
      var className = 'd-none'
      if (type) {
        className = 'text-danger'
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
    filterByDate () {
      this.filterDate = !this.filterDate
      if (!this.filterDate) { return }
      try {
        datepicker('#date-filter', {
          showAllDates: true,
          onSelect: (instance, date) => {
            var pre = moment(date)
            date = pre.isValid() ? pre.format('YYYY-MM-DD') : ''
            this.search = date
            instance.remove()
            this.filterDate = !this.filterDate
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
