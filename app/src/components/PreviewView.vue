<style>
  .preview-item {
    flex-grow: 1;
    display: flex;
    position: relative;
    z-index: 3;
    background-color: #ececec;
    overflow: scroll;
  }
  .webview {
    flex-grow: 1;
  }
  .search-box {
    position: absolute;
    top: -1px;
    right: 35px;
    box-sizing: border-box;
    height: 35px;
    padding: 3px 5px 5px;
    background-color: #f6f6f6;
    border: 1px solid #c2c0c2;
    border-top: none;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
  }
  /*.search-box:before {*/
  /*content: '\E803';*/
  /*font-family: photon-entypo;*/
  /*position: absolute;*/
  /*color: #555;*/
  /*opacity: 0.1;*/
  /*font-size: 1.4em;*/
  /*margin-left: 5px;*/
  /*margin-top: 2px;*/
  /*}*/
  .search-input {
    box-sizing: border-box;
    width: 220px;
    padding: 3px;
    font-size: 12px;
    border-radius: 2px;
    border: 1px solid rgba(0,0,0,.1);
    outline-width: 2px;
    padding-right: 30px;
  }
  .search-count {
    position: absolute;
    top: 0;
    right: 30px;
    line-height: 32px;
    color: rgba(0,0,0,.3);
    font-size: 14px;
  }
  .state-visible {
    display: block;
  }
  .search-close {
    background: transparent;
    border: none;
    width: 15px;
    font-size: 15px;
    outline-width: 0;
  }
  .viewport-resizer {
    position: absolute;
    width: 100%;
    background-color: #222;
    box-shadow: 0 0 5px rgba(0,0,0,0.8);
  }
  .viewport {
    width: 100%;
    display: flex;
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    box-shadow: rgb(193, 193, 193) 2px 2px 0px;
  }
</style>

<template>
  <div class="preview-item" ref="outer">
    <div class="viewport"
      :style="viewportStyle">
      <webview autosize="on" src="/static/webview.html" ref="preview" class="webview" id="preview"></webview>
    </div>
    <div class="viewport-resizer">
      <span class="icon icon-mobile"></span>
      <select v-model="viewport">
        <option v-for="item in preset" :value="`${item.width}x${item.height}`">{{item.name}}</option>
      </select>
    </div>
    <div class="search-box" v-show="searchState">
      <input type="text" class="search-input" autofocus ref="search">
      <span class="search-count"></span>
      <button class="search-close" @click="closeSearchBox"><span class="icon icon-cancel"></span></button>
    </div>
  </div>
</template>

<script lang="babel">
  import {ipcRenderer} from 'electron'
  import {currentFilePath, searchState} from '../vuex/getters'
  import {mapActions, mapGetters} from 'vuex'
  import ElectronSearchText from 'electron-search-text'
  export default{
    data() {
      return {
        regexpHeight: /offsetHeight\[([0-9]*)\]/,
        regexpScroll: /scroll\[([0-9]*)\]/,
        scroll: {},
        switchWidth: '0',
        switchHeight: '0',
        viewport: '0x0',
        preset: [
          {
            name: 'None',
            width: 0,
            height: 0
          },
          {
            name: 'Mobile',
            width: 320,
            height: 480
          },
          {
            name: '5',
            width: 320,
            height: 568
          },
          {
            name: '7',
            width: 375,
            height: 667
          },
          {
            name: '7+',
            width: 414,
            height: 736
          },
          {
            name: 'Small Tablet',
            width: 600,
            height: 800
          },
          {
            name: 'iPad',
            width: 768,
            height: 1024
          }
        ]
      }
    },
    computed: {
      ...mapGetters({
        searchState: 'searchState',
        currentFilePath: 'currentFilePath'
      }),
      viewportStyle() {
        if (this.switchWidth === 0 || this.switchWidth === '0') {
          return {}
        }
        else {
          const width = `${this.switchWidth}px`
          const height = `${this.switchHeight}px`
          console.log(this.$refs.outer.offsetHeight)
          console.log(this.switchHeight)

          return { width, height }
        }
      },
      previewWidth() {
        if (!this.$refs.preview) return 0
        return this.$refs.preview.offsetWidth
      }
    },
    mounted() {
      this.$refs.preview.addEventListener('did-finish-load', () => {
        this.initSearchBox()
        if (this.currentFilePath) {
          this.renderPreview(this.currentFilePath)
        }
        this.$store.watch(currentFilePath, this.renderPreview)
        this.$refs.preview.addEventListener('console-message', this.onConsoleMessage)
        this.$refs.preview.addEventListener('did-start-loading', () => { this.$refs.preview.stop() })
        this.$refs.preview.addEventListener('will-navigate', this.openOnBrowser)
        this.$refs.preview.addEventListener('new-window', this.openOnBrowser)
        ipcRenderer.on('updateMarkdown', this.onUpdateMarkdown)
        ipcRenderer.on('attachFrameContent', this.onAttachFrameContent)
        ipcRenderer.on('attachExternalImage', this.onAttachExternalImage)
//        this.$refs.preview.openDevTools()
        this.$watch('viewport', (newVal, oldVal) => {
          let [width, height] = newVal.split('x')
          this.switchViewport({width, height})
        })
      })
    },
    methods: {
      ...mapActions({
        setPreviewHeight: 'setPreviewHeight',
        setWordCount: 'setWordCount',
        setSearchState: 'setSearchState'
      }),
      renderPreview(current) {
        if (!current) {
          this.updateHeight('-')
          this.setWordCount('-')
          this.updatePreview('')
          return
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
        let scroll = 0
        if (this.scroll[this.currentFilePath] !== undefined) {
          scroll = this.scroll[this.currentFilePath]
        }
        this.$refs.preview.executeJavaScript(`
          update('${escape(md)}',${scroll})
        `)
      },
      initSearchBox() {
        const search = new ElectronSearchText({
          target: '#preview',
          input: '.search-input',
          count: '.search-count',
          box: '.search-box',
          visibleClass: '.state-visible'
        })
        search.on('did-press-escape', this.closeSearchBox)
        this.$store.watch(searchState, this.focusSearch)
      },
      onConsoleMessage({message}) {
        if (message && this.regexpHeight.test(message)) {
          let height = message.replace(this.regexpHeight, '$1')
          this.updateHeight(height)
        }
        if (message && this.regexpScroll.test(message)) {
          let scroll = message.replace(this.regexpScroll, '$1')
          this.setScroll(scroll)
        }
      },
      updateHeight(height) {
        this.setPreviewHeight(height)
      },
      setScroll(scroll) {
        this.scroll[this.currentFilePath] = scroll
      },
      openOnBrowser({url}) {
        require('electron').shell.openExternal(url)
      },
      closeSearchBox() {
        this.setSearchState(false)
      },
      focusSearch(bool) {
        if (bool) this.$refs.search.focus()
      },
      onUpdateMarkdown(e, {filepath}) {
        if (this.currentFilePath === filepath) {
          this.renderPreview(filepath)
        }
      },
      onAttachFrameContent(e, {filepath, url, html}) {
        if (this.currentFilePath === filepath) {
          this.$refs.preview.executeJavaScript(`
              attach('${url}', '${escape(html)}')
            `)
        }
      },
      onAttachExternalImage(e, {filepath, src, data}) {
        if (this.currentFilePath === filepath) {
          this.$refs.preview.executeJavaScript(`
            attachImage('${src}', '${data}')
          `)
        }
      },
      switchViewport(item) {
        this.switchWidth = item.width
        this.switchHeight = item.height
      }
    }
  }
</script>
