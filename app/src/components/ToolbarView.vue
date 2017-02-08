<style lang="scss">

  .btn-group .btn+.btn.active {
    border-left: 1px;
    margin-left: 0;
  }
  .btn-default:not([disabled]):not(.active):hover {
    background-image: none;
    background-color: #e0e0e0;
  }
  [disabled] {
    opacity: 0.5;
    pointer-events: none;
  }
  .header-toolbar {
    background-color: rgb(246,246,246);
    display: flex;
    padding: 6px 5px 6px 5px;
    border-top: 1px solid #989898;
    border-bottom: 1px solid #989898;
    /*flex-wrap: wrap;*/
    position: relative;
  }
  .btn-group {
    display: flex; // Overwrite for photon.css
    margin: 0 5px 0 6px;
  }
  .btn {
    border-radius: 2px;
  }
  .favorite-list {
    border: 1px solid #c7c7c7;
    position: absolute;
    top: 45px;
    left: 10px;
    border-radius: 2px;
    box-shadow: 2px 2px 0 rgba(0,0,0,.1);
    min-width: 125px;
    z-index: 4;
    .favorite-item {
      &:hover {
        color: #fff;
        background-color: #116cd6;
        cursor: pointer;
      }
    }
  }
  .table-striped td {
    text-align: left;
    padding: 5px;
  }
  .table-striped th {
    text-align: left;
    padding: 5px;
    font-weight: 600;
  }
  .table-striped th .icon-star{
    margin-right: 3px;
  }
  .header {
    display: flex;
    .favorite-text {
      padding-left: 3px;
      flex-grow: 1;
    }
    .icon-cancel {
      opacity: 0.5;
      padding-right: 5px;
      &:hover {
        opacity: 1;
      }
    }
  }
  .lint-count {
    position: absolute;
    width: 15px;
    line-height: 15px;
    background-color: tomato;
    color: #fff;
    border-radius: 50%;
    text-align: center;
    display: inline-block;
    font-size: 9px;
    top: -2px;
    right: -2px;
    box-shadow: -1px 1px 0 rgba(0,0,0,.1)
  }

  .dialog {
    margin: auto;
    width: 500px;
    border: 1px solid #4ea0ff;
    padding-bottom: 10px;
    border-radius: 2px;
    .dialog-header {
      background-color: #4ea0ff;
      color: #fff;
      display: flex;
      align-items: center;
      padding: 5px 15px 5px 7px;
      .text {
        padding-left: 5px;
        flex-grow: 1;
      }
      .icon-cancel {
        cursor: pointer;
      }
    }
    .dialog-item {
      padding: 10px 5px 0 1px;
      display: flex;
      align-items: center;
      .icon {
        width: 20px;
        text-align: center;
        color: #585858;
        padding-left: 5px;
      }
      .input {
        flex-grow: 1;
        margin-right: 5px;
        margin-left: 5px;
        opacity: 1;
        border: 1px solid #d0d0d0;
        border-radius: 2px;
        padding: 1px 5px;
      }
    }
  }
</style>

<template>
  <div class="header-toolbar">
    <div class="btn-group">
      <button class="btn btn-default"
        @click="openSetting"
        title="フォルダを開く">
        <span class="icon icon-cog"></span>
      </button>
      <button class="btn btn-default"
        @click="toggleMdDirectoryState"
        :class="{'active': mdDirectoryState}">
        <span class="icon icon-folder"></span>
      </button>
      <button @click="toggleFavorite"
        :class="{'active': isVisibleFavorite}"
        class="btn btn-default"
        title="お気に入りリスト">
        <span class="icon icon-star"></span>
      </button>
    </div>
    <filepath-view></filepath-view>
    <wordcount-view></wordcount-view>
    <height-view></height-view>

    <div class="btn-group">
      <button class="btn btn-default"
        @click="openOnEditor"
        :disabled="isNotCurrent"
        title="エディタで開く">
        <span class="icon icon-export"></span>
      </button>
      <button class="btn btn-default pull-right"
        @click="toggleSearchState"
        :disabled="isNotCurrent"
        :class="{'active': searchState}"
        title="検索">
        <span class="icon icon-search"></span>
      </button>
      <button class="btn btn-default"
        @click="toggleViewportState"
        :class="{'active': viewportState}"
        title="表示サイズの変更">
        <span class="icon icon-mobile"></span>
      </button>
      <button class="btn btn-default"
        @click="toggleTextlintState"
        :class="{'active': textlintState}"
        title="textlintの結果を見る">
        <span class="icon icon-book"></span>
        <span v-if="currentFilePath && lintCount" class="lint-count">{{lintCount}}</span>
      </button>
    </div>

    <button class="btn btn-default"
      @click="openHelpPage"
      title="ヘルプを見る">
      <span class="icon icon-help-circled"></span>
    </button>

    <div class="favorite-list" v-show="isVisibleFavorite">
      <table class="table-striped">
        <thead>
          <tr>
            <th class="header">
              <span class="icon icon-star"></span>
              <span class="favorite-text">Favorite</span>
              <span @click="toggleFavorite" class="icon icon-cancel"></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="path in favorite">
            <td @click="open(path)" class="favorite-item">{{abbrPath(path)}}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <dialog ref="dialog" class="dialog">
      <div class="dialog-header">
        <span class="icon icon-cog"></span>
        <span class="text">Settings</span>
        <span class="icon icon-cancel" @click="closeSetting"></span>
      </div>
      <div class="dialog-item">
        <span class="icon icon-folder"></span>
        <input class="input" disabled :value="mdDirectory">
        <button @click="setDirectory" class="btn btn-default" title="ディレクトリを開く">...</button>
      </div>
      <div class="dialog-item">
        <span class="icon icon-book"></span>
        <input class="input" disabled :value="textlintDictionary">
        <button @click="setDictionary" class="btn btn-default" title="辞書を開く">...</button>
      </div>
    </dialog>

  </div>
</template>

<script lang="babel">
  import FilepathView from './FooterView/FilepathView.vue'
  import HeightView from './FooterView/HeightView.vue'
  import WordcountView from './FooterView/WordcountView.vue'
  import {remote, ipcRenderer} from 'electron'
  import PATH from 'path'
  import OPEN from 'open'
  import {mapActions, mapGetters} from 'vuex'
  import mediator from '../mediator'
  export default{
    data() {
      return {
        isVisibleFavorite: false,
        lintCount: 0,
        stateSetting: false
      }
    },
    computed: {
      ...mapGetters({
        currentFilePath: 'currentFilePath',
        favorite: 'favorite',
        searchState: 'searchState',
        mdDirectory: 'mdDirectory',
        mdDirectoryState: 'mdDirectoryState',
        viewportState: 'viewportState',
        textlintState: 'textlintState',
        textlintDictionary: 'textlintDictionary'
      }),
      isNotCurrent() {
        return !this.currentFilePath
      }
    },
    mounted() {
      ipcRenderer.on('cmd-toggle-favorite-list', this.toggleFavorite)
      mediator.$on('lintCount', (count) => {
        this.lintCount = count
      })
    },
    methods: {
      ...mapActions({
        addFilePaths: 'addFilePaths',
        toggleSearchState: 'toggleSearchState',
        setMdDirectory: 'setMdDirectory',
        toggleMdDirectoryState: 'toggleMdDirectoryState',
        toggleViewportState: 'toggleViewportState',
        toggleTextlintState: 'toggleTextlintState',
        setTextlintDictionary: 'setTextlintDictionary'
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
      },
      abbrPath(fullPath) {
        const arr = fullPath.split(PATH.sep)
        const path = `${arr[arr.length - 2]}${PATH.sep}${arr[arr.length - 1]}`
        return path
      },
      toggleFavorite() {
        this.isVisibleFavorite = !this.isVisibleFavorite
      },
      open(filepath) {
        this.addFilePaths(filepath)
      },
      openOnEditor() {
        OPEN(this.currentFilePath)
      },
      openHelpPage() {
        OPEN('https://github.com/pxgrid/codegrid-markdown/blob/master/README.md')
      },
      openFolder() {
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
      setDirectory() {
        const dirPaths = remote.dialog.showOpenDialog({
          properties: ['openDirectory']
        })
        if (dirPaths) {
          this.setMdDirectory(dirPaths[0])
        }
      },
      setDictionary() {
        const filePaths = remote.dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [
            {name: 'YAML', extensions: ['yml']}
          ]
        })
        if (filePaths) {
          this.setTextlintDictionary(filePaths[0])
        }
      },
      openSetting() {
        this.$refs.dialog.showModal()
      },
      closeSetting() {
        this.$refs.dialog.close()
      }
    },
    components: {
      FilepathView,
      HeightView,
      WordcountView
    }
  }
</script>
