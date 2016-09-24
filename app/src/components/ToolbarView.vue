<style lang="scss">

  .btn-group .btn+.btn.active {
    border-left: 1px;
    margin-left: 0;
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
    flex-wrap: wrap;
    position: relative;
  }
  .btn-group {
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
    z-index: 1;
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
</style>

<template>
  <div class="header-toolbar">
    <div class="btn-group">
      <button class="btn btn-default"
        @click="openFile"
        title="ファイルを開く">
        <span class="icon icon-doc-text"></span>
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
          <tr v-for="fav in favorite">
            <td @click="open(fav)">{{abbrPath(fav)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="babel">
  import FilepathView from './FooterView/FilepathView.vue'
  import HeightView from './FooterView/HeightView.vue'
  import WordcountView from './FooterView/WordcountView.vue'
  import {remote} from 'electron'
  import PATH from 'path'
  import OPEN from 'open'
  import {mapActions, mapGetters} from 'vuex'
  export default{
    data() {
      return {
        isVisibleFavorite: false
      }
    },
    computed: {
      ...mapGetters({
        currentFilePath: 'currentFilePath',
        favorite: 'favorite',
        searchState: 'searchState'
      }),
      isNotCurrent() {
        return !this.currentFilePath
      }
    },
    methods: {
      ...mapActions({
        addFilePaths: 'addFilePaths',
        toggleSearchState: 'toggleSearchState'
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
      }
    },
    components: {
      FilepathView,
      HeightView,
      WordcountView
    }
  }
</script>

