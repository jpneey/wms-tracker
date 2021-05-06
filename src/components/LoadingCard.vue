<template>
  <template v-for="index in cardCount" :key="index">
    <div class="pt-3 pb-0 d-block w-100 bg-white item mb-1 overflow-hidden">
      <div class="row">
        <div class="col col-12">
          <p class="my-2 mb-0 text-small"><span class="loading p loading-card"></span></p>
          <p class="my-2 mb-0 text-small"><span class="loading p"></span></p>
        </div>
        <div class="col col-8">
          <p class="my-2 mb-0 text-small"><span class="loading p"></span></p>
        </div>
        <div class="col col-4">
          <p class="my-2 mb-0 text-small"><span class="loading p"></span></p>
        </div>
        <div class="col col-6">
          <p class="my-2 mb-0 text-small"><span class="loading p"></span></p>
        </div>
      </div>
    </div>
  </template>
</template>
<script>

export default {
  name: 'LoadingCard',
  props: {
    cardCount: {
      type: Number,
      default: 3
    }
  }
}
</script>
