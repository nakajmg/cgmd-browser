<style>
  @import url(https://fonts.googleapis.com/css?family=Lato:300);

  * {
    margin: 0;
    padding: 0;
  }

  html,
  body { height: 100%; }

  .app {
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
</style>

<template>
  <div class="app">
    <preview-view></preview-view>
  </div>
</template>

<script lang="babel">
  import store from './vuex/store'
  import PreviewView from 'components/PreviewView.vue'
  export default {
    components: {
      PreviewView
    },
    store
  }
</script>
