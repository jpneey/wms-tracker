<template>
    <div id="map"></div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

export default {
  name: 'Map',
  props: {
    long: {
      type: Number,
      default: 121.08075198248237
    },
    lat: {
      type: Number,
      default: 14.606097624698998
    }
  },
  mounted () {
    this.initMap()
  },
  computed: {
    rLat: function () {
      return this.lat
    },
    rLong: function () {
      return this.long
    }
  },
  methods: {
    initMap: function () {
      const mapDiv = L.map('map').setView([this.rLat, this.rLong], 18)
      L.tileLayer(
        'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoianBuZWV5IiwiYSI6ImNrb2pkcnl0bDBkNXYycHB2d3hmYmoxcDYifQ.a1HFp-xssXRKGizJXfwAxg',
        {
          maxZoom: 18,
          id: 'mapbox/streets-v11',
          accessToken: 'pk.eyJ1IjoianBuZWV5IiwiYSI6ImNrb2pkcnl0bDBkNXYycHB2d3hmYmoxcDYifQ.a1HFp-xssXRKGizJXfwAxg'
        }
      ).addTo(mapDiv)

      L.circle([this.rLat, this.rLong], {
        color: '#f80',
        fillColor: '#f80',
        fillOpacity: 0.5,
        radius: 5
      }).addTo(mapDiv)
    }
  }
}

</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
