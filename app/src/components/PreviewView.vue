<template>
  <div class="preview-item">
    <webview autosize="on" src="/static/webview.html" ref="preview" class="webview"></webview>
  </div>
</template>

<script lang="babel">
  import {ipcRenderer} from 'electron'
  import {currentFilePath} from '../vuex/getters'
  import {mapActions} from 'vuex'
  export default{
    data() {
      return {
        regexpHeight: /offsetHeight\[([0-9]*)\]/
      }
    },
    mounted() {
      this.$refs.preview.addEventListener('did-finish-load', () => {
        this.$store.watch(currentFilePath, this.renderPreview)
        this.$refs.preview.addEventListener('console-message', this.onConsoleMessage)
        this.$refs.preview.addEventListener('did-start-loading', () => {
          this.$refs.preview.stop()
        })
        this.$refs.preview.addEventListener('will-navigate', this.openOnBrowser)
        this.$refs.preview.addEventListener('new-window', this.openOnBrowser)
      })
    },
    methods: {
      ...mapActions({
        setPreviewHeight: 'setPreviewHeight',
        setWordCount: 'setWordCount'
      }),
      renderPreview(current) {
        if (!current) {
          this.updateHeight('-')
          this.setWordCount('-')
          return this.updatePreview('')
        }
        ipcRenderer.once(current, (e, {md}) => {
          this.updatePreview(md)
        })
        ipcRenderer.once(`${current}:count`, (e, {count}) => {
          this.setWordCount(count)
        })
        ipcRenderer.send('openMarkdown', current)
      },
      updatePreview(md) {
        this.$refs.preview.executeJavaScript(`
          update('${escape(md)}')
        `)
      },
      onConsoleMessage({message}) {
        if (message && this.regexpHeight.test(message)) {
          let height = message.replace(this.regexpHeight, '$1')
          this.updateHeight(height)
        }
      },
      updateHeight(height) {
        this.setPreviewHeight(height)
      },
      openOnBrowser({url}) {
        require('electron').shell.openExternal(url)
      }
    }
  }
</script>

<style>
  .preview-item {
    flex-grow: 1;
    display: flex;
  }
  .webview {
    flex-grow: 1;
  }
</style>
