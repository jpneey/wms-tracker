<template>
  <div class="mt-4 mb-3 position-relative search-wrapper border rounded enter">
    <input type="search" name="search" class="search-field" v-model="search" placeholder="Enter tracking number" />
    <i class="material-icons search bg-black">search</i>
  </div>
  <template v-for="item in filteredItems" :key="item.detrack_id">
    <div class="pt-3 pb-0 d-block w-100 bg-white item mb-3 overflow-hidden border rounded orders enter">
      <div class="row">
        <div class="col col-6 px-4">
          <p class="mb-0 text-uppercase sub-text">{{ formatDate(item.slip_order_date) }}</p>
        </div>
        <div class="col col-6 text-end px-4">
          <p class="mb-0 text-uppercase sub-text d-none">{{ footerActionText(item.order_status) }}</p>
        </div>
        <div class="col col-12 px-4">
          <p class="my-2 mb-3 text-small text-secondary">{{ item.customer_address || 'No data available' }}</p>
        </div>
        <div class="col col-12">
          <router-link :to="'/order/' + item.detrack_id" class="text-decoration-none text-body">
            <div :class="'p-3 item-footer position-relative ' + footerClass(item.order_status)">
              <p class="mb-0 text-uppercase sub-text position-relative text-decoration-none">{{ item.slip_no }}</p>
              <span class="open-order text-decoration-none material-icons text-secondary">arrow_forward</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
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
      return this.items.filter(c => c.ship_to.toLowerCase().indexOf(search) > -1 || c.detrack_slip.toLowerCase().indexOf(search) > -1 || c.detrack_date.toLowerCase().indexOf(search) > -1)
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
      var className = 'bg-light'
      type = type.toLowerCase().trim()
      switch (type) {
        case 'deliver':
          className = ''
          break
      }
      return className
    },
    footerActionText (type) {
      var text = 'update order'
      type = type.toLowerCase().trim()
      switch (type) {
        case 'deliver':
          text = 'deliver to'
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
            date = pre.isValid() ? pre.format('YYYY-MM-D') : ''
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
