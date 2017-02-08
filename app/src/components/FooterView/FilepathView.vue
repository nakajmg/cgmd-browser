<style scoped>
  .filepath {
    display: flex;
    position: relative;
    vertical-align: middle;
    padding: 1px 5px;
    border: 1px solid #b9b9b9;
    border-radius: 2px;
    background: #ececec;
    box-shadow: inset 1px 1px rgba(0,0,0,.1);
    flex-grow: 1;
    margin: 0 5px;
    white-space: nowrap;
    overflow: auto;
  }
  .filepath-text {
    -webkit-user-select: initial;
  }
  .icon {
    opacity: 0.4;
    margin-right: 3px;
  }
  .placeholder {
    opacity: 0.4;
  }
  .spacer {
    flex-grow: 1;
  }
</style>
<template>
  <div class="filepath">
    <span class="icon icon-eye"></span>
      <span class="filepath-text" v-if="currentFilePath">
        {{currentFilePath}}
      </span>
      <span v-else class="placeholder">
        /path/to/file.md
      </span>
      <span class="spacer"></span>
    <favorite></favorite>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Favorite from './Favorite.vue'
  export default {
    computed: {
      ...mapGetters({
        currentFilePath: 'currentFilePath'
      })
    },
    components: {
      Favorite
    }
  }
</script>
