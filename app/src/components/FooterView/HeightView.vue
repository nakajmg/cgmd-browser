<style scoped>
  .height {
    padding: 1px 5px;
    font-weight: 600;
    border: 1px solid #b9b9b9;
    margin: 2px 5px;
    border-radius: 2px;
    background: #ececec;
    box-shadow: inset 1px 1px 1px rgba(0,0,0,.1);
  }
</style>
<template>
  <p class="pull-right height">
    <span class="icon icon-up-circled"></span>
    {{previewHeight}} px
  </p>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      ...mapGetters({
        previewHeight: 'previewHeight'
      })
    }
  }
</script>
