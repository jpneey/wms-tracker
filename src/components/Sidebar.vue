<template>
  <div class="overlay w-100 position-fixed" @click="closeSidebar()" :class="state ? 'on' : 'off'"></div>
  <div id="sidebar" class="container" :class="state ? 'on' : 'off'">
    <ul class="p-0">
      <li><router-link to="/" @click="closeSidebar()">Deliveries</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  emits: ['toggleSideBar'],
  props: {
    state: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeSidebar: function () {
      this.$emit('toggleSideBar', this.$event)
    }
  }
}
</script>
