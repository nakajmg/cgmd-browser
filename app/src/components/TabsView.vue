<style scoped>
  .preview-view {
    display: flex;
    flex-direction: column;
    background-color: #d1cfd1;
    min-height: 32px;
    border-bottom: 1px solid #989898;
  }
  .tabs {
    display: flex;
    padding: 5px 30px 0px 30px;
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
  }
  .tab .icon {
    /*position: absolute;*/
    /*right: 10px;*/
    width: 30px;
  }
  .tab .icon:hover:before{
    content: '\E814';
    color: red;
  }
  .active {
    opacity: 1;
    background: #fff;
  }
  .active:after {
    position: absolute;
    content: '';
    display: block;
    width: 100%;
    border-bottom: 1px solid #fff;
    left: 0;
    bottom: -1px;
  }
</style>

<template>
  <div class="preview-view">
    <div class="tabs">
      <div
        class="tab"
        :class="{'active': path === current}"
        v-for="path in items"
        @click="select(path)">
        <span>
          {{abbrPath(path)}}
        </span>
        <span class="icon icon-cancel" @click="close(path)"></span>
      </div>
    </div>
  </div>
</template>

<script lang="babel">
  import {mapGetters, mapActions} from 'vuex'
  import PATH from 'path'
  export default {
    data() {
      return {
      }
    },
    computed: {
      ...mapGetters({
        items: 'filePaths',
        current: 'currentFilePath'
      })
    },
    components: {
    },
    methods: {
      select(path) {
        this.setCurrentFilePath(path)
      },
      ...mapActions({
        setCurrentFilePath: 'setCurrentFilePath',
        removeFilePaths: 'removeFilePaths'
      }),
      abbrPath(fullPath) {
        const arr = fullPath.split(PATH.sep)
        const path = `${arr[arr.length - 2]}${PATH.sep}${arr[arr.length - 1]}`
        return path
      },
      close(path) {
        this.removeFilePaths(path)
      }
    }
  }
</script>
