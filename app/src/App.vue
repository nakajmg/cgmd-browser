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
  .preview {
    display: flex;
    flex-direction: row;
    height: 100%;
  }
  .toolbar {
    min-height: 79px;
  }
</style>

<template>
  <div class="app">
    <header class="toolbar">
      <tabs-view></tabs-view>
      <toolbar-view></toolbar-view>
    </header>
    <div class="preview">
      <filetree-view></filetree-view>
      <preview-view></preview-view>
      <linter-view></linter-view>
    </div>
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
  import FiletreeView from 'components/FiletreeView.vue'
  import LinterView from 'components/LinterView.vue'
  import EventReceiver from 'components/EventReceiver.vue'
  import * as types from './vuex/mutation-types'
  import _ from 'lodash'
  const mutations = [
    types.SET_CURRENT_FILE_PATH,
    types.REMOVE_FILE_PATHS,
    types.ADD_FILE_PATHS,
    types.ADD_FAVORITE,
    types.REMOVE_FAVORITE,
    types.TOGGLE_FAVORITE,
    types.TABS_MOVE_LEFT,
    types.TABS_MOVE_RIGHT,
    types.SET_MD_DIRECTORY,
    types.SET_SEARCH_WORD,
    types.TOGGLE_MD_DIRECTORY_STATE
  ]

  const save = _.debounce((state) => {
    window.localStorage.setItem('prevue-state', JSON.stringify(state))
  }, 100)

  store.subscribe((mutation, state) => {
    if (_.includes(mutations, mutation.type)) {
      save(state)
    }
  })

  export default {
    components: {
      PreviewView,
      TabsView,
      ToolbarView,
      FooterView,
      EventReceiver,
      FiletreeView,
      LinterView
    },
    store
  }
</script>
