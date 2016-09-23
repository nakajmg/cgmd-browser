<style scoped>
  .preview-view {
    display: flex;
    flex-direction: column;
  }
  .tabs {
    display: flex;
  }
  .tab {
    flex-grow: 1;
    text-align: center;
    opacity: 0.3;
  }
  .active {
    opacity: 1;
  }
</style>

<template>
  <div class="preview-view">
    <div class="toolbar-actions">
      <div class="tabs">
        <div
          class="tab"
          :class="{'active': path === current}"
          v-for="path in items"
          @click="select(path)">
          {{abbrPath(path)}}
        </div>
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
        console.log(path)
        this.setCurrentFilePath(path)
      },
      ...mapActions({
        setCurrentFilePath: 'setCurrentFilePath'
      }),
      abbrPath(fullPath) {
        const arr = fullPath.split(PATH.sep)
        const path = `${arr[arr.length - 2]}${PATH.sep}${arr[arr.length - 1]}`
        return path
      }
    }
  }
</script>
