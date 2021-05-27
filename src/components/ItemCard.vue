<template>
  <div class="pt-3 pb-0 d-block w-100 bg-white item mb-3 orders enter">
    <div class="row border-bottom">
      <div class="col col-12 px-4">
        <div class="input-group input-group-sm mb-3">
          <input v-model="search" type="text" class="form-control py-2 px-3" placeholder="Enter tracking number" />
        </div>
      </div>
    </div>
  </div>
  <template v-for="item in filteredItems" :key="item.slip_id">
    <router-link :to="'/order/' + item.slip_id" class="text-decoration-none">
      <div class="pt-3 pb-0 d-block w-100 bg-white item mb-3 orders enter">
        <div class="row border-bottom">
          <div class="col col-12 px-4">
            <p class="mb-0 sub-text text-body"><small class="fw-normal me-3" :class="footerClass(item.tracking_status)">{{ footerActionText(item.tracking_status) }}</small> #{{ item.slip_no }}</p>
          </div>
          <div class="col col-12 px-4 mt-2">
            <p class="mt-2 mb-3 text-small">
              <span>{{ formatDate(item.ship_date) }}</span>
              <small class="ms-1" :class="delayClass(getDelay(item.ship_date))">&mdash;&nbsp;<b>{{ getDelay(item.ship_date) }} delayed</b></small>
              <span class="text-secondary ps-2">{{ item.customer_address || 'No data available' }}</span>
            </p>
          </div>
        </div>
      </div>
    </router-link>
  </template>
  <div v-if="filteredItems.length <= 0" class="pt-3 pb-0 d-block w-100 bg-white item mb-3 overflow-hidden border-bottom orders enter">
    <div class="row">
      <div class="col col-12 px-4">
        <p class="my-2 mb-3 text-small">It seems that there are no deliverables assigned to you that matches `<b>{{ search }}</b>`</p>
      </div>
      <div class="col col-12">
        <div class="p-3 item-footer position-relative bg-light">
          <button @click="clearSearch()" class="btn btn-primary btn-sm">Show All</button>
        </div>
      </div>
    </div>
  </div>
  <label id="date-filter" @click="filterByDate()" class="fab material-icons bg-black text-white shadow-sm">date_range</label>
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
      return this.items.filter(c => c.ship_to.toLowerCase().indexOf(search) > -1 || c.slip_no.toLowerCase().indexOf(search) > -1 || c.ship_date.toLowerCase().indexOf(search) > -1)
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
      const date = moment(shipDate, 'YYYY MM DD')
      const today = moment()
      const day = today.diff(date)
      return moment.duration(day).humanize(false, { d: 7, w: 4, m: 31, y: 365 })
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
