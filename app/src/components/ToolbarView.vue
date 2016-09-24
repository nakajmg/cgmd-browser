<template>
  <div class="header-toolbar">
    <div class="btn-group">
      <button class="btn btn-default"
        @click="openFile"
        title="ファイルを開く">
        <span class="icon icon-doc-text"></span>
      </button>
      <button class="btn btn-default"
        :disabled="isNotCurrent"
        title="エディタで開く">
        <span class="icon icon-export"></span>
      </button>
      <button class="btn btn-default pull-right"
        :disabled="isNotCurrent"
        title="検索">
        <span class="icon icon-search"></span>
      </button>
    </div>
    <filepath-view></filepath-view>
    <wordcount-view></wordcount-view>
    <height-view></height-view>
    <button class="btn btn-default"
      title="ヘルプを見る">
      <span class="icon icon-help-circled"></span>
    </button>
  </div>
</template>

<script lang="babel">
  import FilepathView from './FooterView/FilepathView.vue'
  import HeightView from './FooterView/HeightView.vue'
  import WordcountView from './FooterView/WordcountView.vue'
  import {remote} from 'electron'
  import {mapActions, mapGetters} from 'vuex'
  export default{
    data() {
      return {}
    },
    computed: {
      ...mapGetters({
        currentFilePath: 'currentFilePath'
      }),
      isNotCurrent() {
        return !this.currentFilePath
      }
    },
    methods: {
      ...mapActions({
        addFilePaths: 'addFilePaths'
      }),
      openFile() {
        const filePaths = remote.dialog.showOpenDialog({
          properties: ['openFile', 'multiSelections'],
          filters: [
            {name: 'markdown', extensions: ['md']}
          ]
        })
        if (filePaths) {
          filePaths.forEach((filepath) => {
            this.addFilePaths(filepath)
          })
        }
      }
    },
    components: {
      FilepathView,
      HeightView,
      WordcountView
    }
  }
</script>

<style>
  [disabled] {
    opacity: 0.5;
    pointer-events: none;
  }
  .header-toolbar {
    background-color: rgb(246,246,246);
    display: flex;
    padding: 6px 5px 6px 5px;
    overflow: hidden;
    border-top: 1px solid #989898;
    border-bottom: 1px solid #989898;
  }
  .btn-group {
    margin: 0 5px;
  }
  .btn {
    border-radius: 2px;
  }
</style>
