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
      <tabs-view></tabs-view>
      <toolbar-view></toolbar-view>
    </header>
    <preview-view></preview-view>
    <event-receiver></event-receiver>
    <!--<footer-view></footer-view>-->
  </div>
</template>

<script lang="babel">
  import store from './vuex/store'
  import ToolbarView from 'components/ToolbarView.vue'
  import TabsView from 'components/TabsView.vue'
  import PreviewView from 'components/PreviewView.vue'
  import FooterView from 'components/FooterView.vue'
  import EventReceiver from 'components/EventReceiver.vue'
  import * as types from './vuex/mutation-types'
  import _ from 'lodash'
  const mutations = [
    types.SET_CURRENT_FILE_PATH,
    types.REMOVE_FILE_PATHS,
    types.ADD_FILE_PATHS,
    types.ADD_FAVORITE,
    types.REMOVE_FAVORITE
  ]
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    if (_.includes(mutations, mutation.type)) {
      window.localStorage.setItem('prevue-state', JSON.stringify(state))
    }
  })

  export default {
    components: {
      PreviewView,
      TabsView,
      ToolbarView,
      FooterView,
      EventReceiver
    },
    store
  }
</script>
