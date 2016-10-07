<template>
  <div style="display: none;"></div>
</template>

<script lang="babel">
  import {ipcRenderer, remote} from 'electron'
  import {mapGetters, mapActions} from 'vuex'
  import OPEN from 'open'
  export default{
    created() {
      ipcRenderer.on('cmd-open-file', this.onOpenFile)
      ipcRenderer.on('cmd-tabs-move-right', this.tabsMoveRight)
      ipcRenderer.on('cmd-tabs-move-left', this.tabsMoveLeft)
      ipcRenderer.on('cmd-tabs-close', this.onTabsClose)
      ipcRenderer.on('cmd-tabs-reload', this.onTabsReload)
      ipcRenderer.on('cmd-toggle-search', this.toggleSearchState)
      ipcRenderer.on('cmd-open-on-editor', this.onOpenOnEditor)
      ipcRenderer.on('cmd-toggle-favorite', this.onToggleFavorite)
      ipcRenderer.on('cmd-set-directory', this.onSetDirectory)
      ipcRenderer.on('cmd-toggle-directory', this.toggleMdDirectoryState)
      ipcRenderer.on('cmd-toggle-viewport', this.toggleViewportState)
      ipcRenderer.on('cmd-toggle-textlint', this.toggleTextlintState)
    },
    computed: {
      ...mapGetters({
        currentFilePath: 'currentFilePath',
        mdDirectoryState: 'mdDirectoryState'
      })
    },
    methods: {
      noop() {
        return
      },
      ...mapActions({
        addFilePaths: 'addFilePaths',
        setCurrentFilePath: 'setCurrentFilePath',
        removeFilePaths: 'removeFilePaths',
        tabsMoveRight: 'tabsMoveRight',
        tabsMoveLeft: 'tabsMoveLeft',
        toggleFavorite: 'toggleFavorite',
        toggleSearchState: 'toggleSearchState',
        setMdDirectory: 'setMdDirectory',
        toggleMdDirectoryState: 'toggleMdDirectoryState',
        toggleViewportState: 'toggleViewportState',
        toggleTextlintState: 'toggleTextlintState'
      }),
      onOpenFile() {
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
      },
      onSetDirectory() {
        const dirPaths = remote.dialog.showOpenDialog({
          properties: ['openDirectory']
        })
        if (dirPaths) {
          this.setMdDirectory(dirPaths[0])
          if (!this.mdDirectoryState) {
            this.toggleMdDirectoryState()
          }
        }
      },
      onOpenOnEditor() {
        OPEN(this.currentFilePath)
      },
      onToggleFavorite() {
        if (this.currentFilePath) {
          this.toggleFavorite(this.currentFilePath)
        }
      },
      onTabsClose() {
        this.removeFilePaths(this.currentFilePath)
        ipcRenderer.send('stopWatching', this.currentFilePath)
      },
      onTabsReload() {
        const prev = this.currentFilePath
        this.setCurrentFilePath('')
        setTimeout(() => {
          this.setCurrentFilePath(prev)
        }, 0)
      }
    }
  }
</script>
