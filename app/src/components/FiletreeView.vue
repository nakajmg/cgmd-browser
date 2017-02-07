<style scoped lang="scss">
  .file-tree {
    position: relative;
    overflow-y: scroll;
    overflow-x: visible;
    width: 0px;
    display: none;
    flex-shrink: 0;
    border-right: 1px solid #989898;
    transition: width 300ms ease;
    ul {
      width: 100%;
      margin-top: 31px;
    }
    &.active {
      display: block;
      width: 200px;
    }
  }

  .tree-search {
    padding: 3px 2px;
    border-bottom: 1px solid #cccccc;
    position: fixed;
    width: 199px;
    background-color: #fff;
    height: 31px;
    z-index: 1;
    input {
      padding-left: 17px;
      width: 100%;
      outline-width: 1px;
    }
    .icon-search {
      position: absolute;
      left: 7px;
      top: 5px;
      color: #9c9c9c;
    }
  }
  .tree-folder {
    border-bottom: 1px solid #e6e6e6;
    label[for] {
      display: block;
      line-height: 26px;
      margin: 0;
    }
    .icon-folder {
      margin-left: 10px;
      margin-right: 2px;
    }
  }
  .tree-folder-toggle {
    display: none;
    &:checked + .tree-file-list {
      display: table;
    }
  }
  .tree-file-list {
    display: none;
  }
  .tree-file {
    display: flex;
    padding: 2px 0;
    &.active {
      color: #fff;
      background-color: #116cd6;
    }
    &:before {
      content: '┣';
      margin-right: 5px;
      margin-left: 10px;
    }
    &:last-of-type {
      &:before {
        content: '┗'
      }
    }
    .icon-doc-text {
      margin-right: 2px;
    }
    .file-name {
      flex-grow: 1;
    }
    .tree-file-text {
      white-space: nowrap;
      width: 170px;
    }
  }
  .tree-epmty {
    padding: 5px;
    margin-top: 31px;
    border-bottom: 1px solid #cccccc;
  }
</style>

<template>
  <div class="file-tree" :class="{'active': mdDirectoryState}">
    <div class="tree-search">
      <span class="icon icon-search"></span>
      <input type="text" v-model="search" ref="input">
    </div>
    <ul v-if="isItem">
      <li class="tree-folder" v-for="(item, index) in filterdItem">
        <label :for="'file-folder' + index">
          <span class="icon icon-folder"></span>
          <span>{{item.name}}</span>
        </label>
        <input class="tree-folder-toggle" checked type="checkbox" :id="'file-folder' + index">
        <table class="table-striped tree-file-list">
          <tbody>
            <tr class="tree-file"
              v-for="(child, index) in item.children"
              v-if="child.extension"
              :class="{active: currentFilePath === child.path}">
              <span class="tree-file-text" @click="select(child.path)">
                <span class="icon icon-doc-text"></span>
                <span class="file-name">{{child.name}}</span>
              </span>
            </tr>
          </tbody>
        </table>
      </li>
    </ul>
    <div v-else class="tree-epmty">
      <span class="icon icon-block"></span>
      No Results
    </div>
  </div>
</template>

<script lang="babel">
  import dtree from 'directory-tree'
  import _ from 'lodash'
  import {mapActions, mapGetters} from 'vuex'
  import {mdDirectory} from '../vuex/getters'
  import {ipcRenderer} from 'electron'
  export default{
    data() {
      return {
        tree: null,
        search: ''
      }
    },
    computed: {
      ...mapGetters({
        currentFilePath: 'currentFilePath',
        mdDirectory: 'mdDirectory',
        searchWord: 'searchWord',
        mdDirectoryState: 'mdDirectoryState'
      }),
      filterdItem() {
        if (this.search === '') return this.tree
        if (!this.tree) return null
        return _.filter(this.tree, (item) => {
          return item.name.indexOf(this.search) !== -1
        })
      },
      isItem() {
        return this.filterdItem && !!this.filterdItem.length
      }
    },
    methods: {
      ...mapActions({
        addFilePaths: 'addFilePaths',
        setSearchWord: 'setSearchWord',
        toggleMdDirectoryState: 'toggleMdDirectoryState'
      }),
      select(filepath) {
        this.addFilePaths(filepath)
      },
      setDir(dirpath) {
        this.tree = dtree(dirpath, ['.md']).children
      },
      onSearchDirectory() {
        if (!this.mdDirectoryState) {
          this.toggleMdDirectoryState()
        }
        this.$refs.input.focus()
      }
    },
    mounted() {
      ipcRenderer.on('cmd-search-directory', this.onSearchDirectory)
      this.search = this.searchWord
      this.$store.watch(mdDirectory, (dirpath) => {
        const tree = dtree(dirpath, ['.md']).children
        this.tree = tree
      })
      if (this.mdDirectory) {
        this.setDir(this.mdDirectory)
      }
      this.$watch('search', _.debounce((searchWord) => {
        this.setSearchWord(searchWord)
      }, 500)
      )
    }
  }
</script>
