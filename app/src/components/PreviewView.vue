<style lang="scss">
  .preview-item {
    flex-grow: 1;
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    z-index: 3;
    background-color: #ececec;
    /*overflow: scroll;*/
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
    top: 40px;
    right: 36px;
    background-color: #f6f6f6;
    color: #333;
    box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.1);
    border: 1px solid #c2c0c2;
    display: flex;
    flex-direction: column;
    align-items: center;

    .viewport-resizer__item {
      border-top: 1px solid #ccc;
      box-shadow: inset 0 1px 0 #fff;
      &.active {
        background-color: #333;
        color: #f6f6f6;
      }
      &:first-of-type {
        color: inherit;
        background-color: inherit;
        border: none;
      }

    }

    .icon-viewport-auto_size {
      display: flex;
      cursor: pointer;
      width: 38px;
      height: 38px;
      padding: 5px;
      font-size: 24px;
      align-items: center;
      justify-content: center;
    }
    .icon-viewport-mobile {
      @extend .icon-viewport-auto_size;
      font-size: 16px;
    }
    .icon-viewport-iphone_se {
      @extend .icon-viewport-auto_size;
      font-size: 16px;
    }
    .icon-viewport-iphone_7 {
      @extend .icon-viewport-auto_size;
      font-size: 20px;
    }
    .icon-viewport-iphone_7_plus {
      @extend .icon-viewport-auto_size;
      font-size: 24px;
    }
    .icon-viewport-small_tablet {
      @extend .icon-viewport-auto_size;
      font-size: 22px;
    }
    .icon-viewport-ipad {
      @extend .icon-viewport-auto_size;
    }
    .viewport-info {
      display: flex;
      font-size: 10px;
      padding: 5px 0;
      display: none;
    }
  }
  .viewport {
    width: 100%;
    height: 100%;
    display: flex;
    margin: auto;
    transition: all 100ms ease-out;
  }
  .webview {
    flex-grow: 1;
    height: 100%;
    /*box-shadow: rgba(193, 193, 193, .5) 2px 2px 0px;*/
    /*margin-top: 40px;*/
  }
</style>

<template>
  <div class="preview-item" ref="outer">
    <div class="viewport"
      :style="viewportStyle">
      <webview autosize="on" src="static/webview.html" ref="preview" class="webview" id="preview"></webview>
    </div>

    <div class="viewport-resizer"
      v-on:mouseleave="resetViewportDetail"
      v-if="viewportState">
      <div class="viewport-resizer__item"
        v-for="item in preset"
        @click="switchViewport(item)"
        v-on:mouseenter="showViewportDetail(item)"
        :class="{active: currentViewport.id === item.id}">
        <span class="icon"
          :title="item.name"
          :class="[item.icon ? item.icon : 'icon-mobile', `icon-viewport-${item.id}`]"></span>
      </div>
      <div class="viewport-info">
        <span v-if="hovered">
          <p>{{hovered.name}}</p>
          <p>{{hovered.width}}x{{hovered.height}}</p>
        </span>
        <span v-else>
          <p>{{currentViewport.name}}</p>
          <p>{{currentViewport.width}}x{{currentViewport.height}}</p>
        </span>
      </div>
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
  import mediator from '../mediator'
  import preset from './viewport.json'
  export default{
    data() {
      return {
        regexpHeight: /offsetHeight\[([0-9]*)\]/,
        regexpScroll: /scroll\[([0-9]*)\]/,
        scroll: {},
        switchWidth: 0,
        switchHeight: 0,
        viewport: '0x0',
        preset: preset,
        currentViewport: {
          name: 'Auto Size',
          width: 0,
          height: 0,
          icon: 'icon-resize-full',
          id: 'auto_size'
        },
        hovered: null,
        results: []
      }
    },
    computed: {
      ...mapGetters({
        searchState: 'searchState',
        currentFilePath: 'currentFilePath',
        viewportState: 'viewportState'
      }),
      viewportStyle() {
        if (this.switchWidth === 0 || this.switchWidth === '0') {
          return {}
        }
        else {
          const width = `${this.switchWidth}px`
          const height = `${this.switchHeight}px`
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

        mediator.$on('highlightWebview', this.highlightWords)
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
          return
        }
        if (message && this.regexpScroll.test(message)) {
          let scroll = message.replace(this.regexpScroll, '$1')
          this.setScroll(scroll)
          return
        }
        console.log(message)
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
        this.currentViewport = item
      },
      showViewportDetail(item) {
        this.hovered = item
      },
      resetViewportDetail() {
        this.hovered = null
      },
      highlightWords(keywords) {
        this.$refs.preview.executeJavaScript(`mark('${keywords}')`)
      }
    }
  }
</script>
