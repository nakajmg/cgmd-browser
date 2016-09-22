<template>
  <div class="preview-view">
    <div>
      <button v-for="item in items" @click="select(item)">
        {{item}}
      </button>
    </div>
    <preview-item></preview-item>
  </div>
</template>

<script lang="babel">
  import PreviewItem from './PreviewView/PreviewItem.vue'
  import {mapGetters, mapActions} from 'vuex'
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
      PreviewItem
    },
    methods: {
      select(path) {
        console.log(path)
        this.setCurrentFilePath(path)
      },
      ...mapActions({
        setCurrentFilePath: 'setCurrentFilePath'
      })
    }
  }
</script>

<style>
  .preview-view {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
</style>
