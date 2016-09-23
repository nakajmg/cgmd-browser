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
    <header class="toolbar">
      <h1 class="title">cgmd-prevue</h1>
      <!--<toolbar-view></toolbar-view>-->
    </header>
    <tabs-view></tabs-view>
    <preview-view></preview-view>
    <footer-view></footer-view>
  </div>
</template>

<script lang="babel">
  import store from './vuex/store'
  import ToolbarView from 'components/ToolbarView.vue'
  import TabsView from 'components/TabsView.vue'
  import PreviewView from 'components/PreviewView.vue'
  import FooterView from 'components/FooterView.vue'
  export default {
    components: {
      PreviewView,
      TabsView,
      ToolbarView,
      FooterView
    },
    store
  }
</script>
