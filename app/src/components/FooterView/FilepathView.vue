<style scoped>
  .filepath {
    display: inline-block;
    position: relative;
    vertical-align: middle;
    padding: 1px 5px;
    border: 1px solid #b9b9b9;
    border-radius: 2px;
    background: #ececec;
    box-shadow: inset 1px 1px rgba(0,0,0,.1);
    flex-grow: 1;
    margin: 0 5px;
  }
  .icon-info-circled {
    opacity: 0.3;
  }
  .placeholder {
    opacity: 0.4;
  }
</style>
<template>
  <div class="filepath">
    <span class="icon icon-pencil"></span>
      <span v-if="currentFilePath">
        {{currentFilePath}}
      </span>
      <span v-else class="placeholder">
        /path/to/file.md
      </span>
  </div>
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
