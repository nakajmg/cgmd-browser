<style scoped>
  .tabs-view {
    display: flex;
    flex-direction: column;
    background-color: #d1cfd1;
    min-height: 36px;
  }
  .tabs {
    display: flex;
    padding: 5px 30px 0px 10px;
    align-items: flex-end;
  }
  .tab {
    /*flex-grow: 1;*/
    text-align: center;
    opacity: 0.5;
    padding: 5px 0px 5px 10px;
    border: 1px solid transparent;
    border-bottom: none;
    border-top-left-radius: 1px;
    border-top-right-radius: 1px;
    border-color: #989898;
    background-color: #f3f3f3;
    position: relative;
    display: flex;
    min-height: 31px;
  }
  .tab .close {
    /*position: absolute;*/
    /*right: 10px;*/
    width: 30px;
  }
  .tab .close:hover:before{
    content: '\E814';
    color: red;
  }
  .active {
    opacity: 1;
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
  }
  .tab .icon-doc-text {
    margin-right: 5px;
  }
  .add {
    color: #999;
    background-color: #e2e1e2;
    text-align: center;
    font-size: 14px;
    line-height: 20px;
    width: 20px;
    border-right: 1px solid #9e9e9e;
    border-top: 1px solid #9e9e9e;
    border-top-right-radius: 2px;
  }
  .add:hover {
    color: #000;
  }
  .empty {
    font-size: 12px;
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
        <span>
          <span class="icon icon-doc-text"></span>{{abbrPath(path)}}
        </span>
        <span class="icon icon-cancel close" @click="close(path)"></span>
      </div>
      <div class="empty tab active" v-if="isEmpty">
        <span>
          <span class="icon icon-doc-text"></span>ファイルを開いてね
        </span>
        <span class="icon icon-cancel close"></span>
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
  import {remote} from 'electron'
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
      select(path) {
        this.setCurrentFilePath(path)
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
      close(path) {
        this.removeFilePaths(path)
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
