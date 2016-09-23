<template>
  <div class="btn-group">
    <button class="btn btn-default"
      @click="openFile"
      title="ファイルを開く">
      <span class="icon icon-folder"></span>
    </button>
    <button class="btn btn-default" title="エディタで開く">
      <span class="icon icon-export"></span>
    </button>

    <button class="btn btn-default pull-right" title="検索">
      <span class="icon icon-search"></span>
    </button>
    <button class="btn btn-default"
      title="ヘルプを見る">
      <span class="icon icon-help-circled"></span>
    </button>
  </div>
</template>

<script lang="babel">
  import {remote} from 'electron'
  import {mapActions} from 'vuex'
  export default{
    data() {
      return {}
    },
    methods: {
      ...mapActions({
        addFilePaths: 'addFilePaths'
      }),
      openFile() {
        const filePaths = remote.dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [
            {name: 'markdown', extensions: ['md']}
          ]
        })
        if (filePaths) {
          this.addFilePaths(filePaths[0])
        }
      }
    }
  }
</script>

<style>
  .header-toolbar {
    padding: 5px 5px;
  }
</style>
