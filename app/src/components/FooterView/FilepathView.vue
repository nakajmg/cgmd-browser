<style scoped>
  .filepath {
    padding: 1px 5px;
    border: 1px solid #b9b9b9;
    margin: 2px 5px;
    border-radius: 2px;
    background: #ececec;
    box-shadow: inset 1px 1px rgba(0,0,0,.1);
    min-width: 200px;
  }
  .icon-info-circled {
    opacity: 0.3;
  }
  .placeholder {
    opacity: 0.4;
  }
</style>
<template>
  <p class="pull-left filepath">
    <span class="icon icon-info-circled"></span>
      <span v-if="currentFilePath">
        {{currentFilePath}}
      </span>
      <span v-else class="placeholder">
        /path/to/file.md
      </span>
  </p>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      ...mapGetters({
        currentFilePath: 'currentFilePath'
      })
    }
  }
</script>
