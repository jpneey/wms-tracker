<template>
  <div id="empty">
    <h1 class="fw-bold mb-2">{{ title }}</h1>
    <p class="text-secondary mb-0">{{ description }}</p>
    <i class="material-icons bg-black text-white p-3 rounded-circle mt-3 shadow" @click="reload()">refresh</i>
  </div>
</template>

<script>

export default {
  name: 'Empty',
  props: {
    title: {
      type: String,
      default: 'Empty'
    },
    description: {
      type: String,
      default: 'Hooray! there are no items to deliver as of the moment'
    }
  },
  methods: {
    reload: function () {
      location.reload()
    }
  }
}
</script>
