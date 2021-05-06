<template>
  <div class="overlay w-100 position-fixed on z-top"></div>
  <div class="alert border-0 p-0  z-top">
    <div class="inner">
      <div class="title">{{ title }}</div>
      <div class="text">{{ text }}</div>
    </div>
    <div class="button left" @click="emit('yes')">{{ yes }}</div>
    <div class="button right" @click="emit('no')">{{ no }}</div>
  </div>
</template>

<script>

export default {
  name: 'Confirm',
  props: {
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: 'press Ok to proceed'
    },
    yes: {
      type: String,
      default: 'Ok'
    },
    no: {
      type: String,
      default: 'Cancel'
    }
  },
  emits: ['yes', 'no'],
  methods: {
    emit: function (e) {
      this.$emit(e, this.$event)
    }
  }
}
</script>
