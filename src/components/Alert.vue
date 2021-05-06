<template>
  <div class="overlay w-100 position-fixed on z-top"></div>
  <div class="alert border-0 p-0  z-top">
    <div class="inner">
      <div class="title">{{ title }}</div>
      <div class="text">{{ text }}</div>
    </div>
    <div class="button" @click="emit()">{{ button }}</div>
  </div>
</template>

<script>

export default {
  name: 'Alert',
  props: {
    title: {
      type: String,
      default: 'Oh no'
    },
    text: {
      type: String,
      default: 'We are having some problems on fetching your data'
    },
    button: {
      type: String,
      default: 'Reload app'
    }
  },
  emits: ['toggleAlert'],
  methods: {
    emit: function () {
      this.$emit('toggleAlert', this.$event)
    }
  }
}
</script>
