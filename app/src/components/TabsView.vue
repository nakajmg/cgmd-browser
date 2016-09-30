<style scoped>
  .tabs-view {
    display: flex;
    flex-direction: column;
    background-color: #d1cfd1;
    min-height: 36px;
  }
  .tabs {
    display: flex;
    padding: 10px 30px 0px 10px;
    align-items: flex-end;
    /*flex-wrap: wrap;*/
  }
  .tab {
    text-align: center;
    padding: 5px 10px 5px 10px;
    border: 1px solid transparent;
    border-bottom: none;
    border-top-left-radius: 1px;
    border-top-right-radius: 1px;
    border-color: #989898;
    background-color: #e2e1e2;
    color: #888;
    position: relative;
    display: flex;
    min-height: 31px;
    transition: background-color 300ms ease;
    transition: color 300ms ease;
  }
  .tab:not(.active):hover {
    color: #444;
    background-color: rgb(235,235,235);
  }
  .tab .close {
    width: 30px;
    margin-right: -10px;
  }
  .tab .close:hover:before{
    content: '\E814';
    color: red;
  }
  .tab-text {
    white-space: nowrap;
  }
  .active {
    color: #000;
    background-color: rgb(246,246,246);
  }
  .active:after {
    position: absolute;
    content: '';
    display: block;
    width: 100%;
    border-bottom: 1px solid rgb(246,246,246);
    left: 0;
    bottom: -1px;
    z-index: 1;
  }
  .tab .icon-doc-text {
    margin-right: 5px;
  }
  .add {
    color: #999;
    background-color: #e2e1e2;
    text-align: center;
    font-size: 14px;
    line-height: 18px;
    width: 22px;
    border-right: 1px solid #9e9e9e;
    border-top: 1px solid #9e9e9e;
    border-top-right-radius: 2px;
  }
  .add:hover {
    color: #000;
    border-color: #777;
  }
  .empty {
    font-size: 12px;
  }
  .down {
    font-size: 13px;
  }
</style>

<template>
  <div class="tabs-view">
    <div class="tabs">
      <div
        class="tab"
        :class="{'active': path === current}"
        v-for="path in items"
        @click="select(path)">
        <span class="tab-text">
          <span class="icon icon-doc-text"></span>{{abbrPath(path)}}
        </span>
        <span class="icon icon-cancel close" @click="close(path)"></span>
      </div>
      <div class="empty tab active" v-if="isEmpty">
        <span>
          <span class="icon icon-down down"></span>
        </span>
      </div>
      <div class="add" @click="openFile">
        <span class="icon icon-plus"></span>
      </div>
    </div>
  </div>
</template>

<script lang="babel">
  import {mapGetters, mapActions} from 'vuex'
  import PATH from 'path'
  import {remote, ipcRenderer} from 'electron'
  export default {
    data() {
      return {
      }
    },
    computed: {
      ...mapGetters({
        items: 'filePaths',
        current: 'currentFilePath'
      }),
      isEmpty() {
        return this.items.length === 0
      }
    },
    components: {
    },
    methods: {
      select(filepath) {
        this.setCurrentFilePath(filepath)
      },
      ...mapActions({
        setCurrentFilePath: 'setCurrentFilePath',
        removeFilePaths: 'removeFilePaths',
        addFilePaths: 'addFilePaths'
      }),
      abbrPath(fullPath) {
        const arr = fullPath.split(PATH.sep)
        const path = `${arr[arr.length - 2]}${PATH.sep}${arr[arr.length - 1]}`
        return path
      },
      close(filepath) {
        this.removeFilePaths(filepath)
        ipcRenderer.send('stopWatching', filepath)
      },
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
    }
  }
</script>
