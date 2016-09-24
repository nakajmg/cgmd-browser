<style scoped>
  .height {
    padding: 1px 5px;
    font-weight: 600;
    border: 1px solid #b9b9b9;
    border-radius: 1px;
    background: #ececec;
    box-shadow: inset 1px 1px 1px rgba(0,0,0,.1);
    min-width: 83px;
    text-align: right;
    display: flex;
    align-items: center;
    margin-left: 0px;
  }
  .text {
    flex-grow: 1;
  }
</style>
<template>
  <div class="height">
    <span class="icon icon-up-circled"></span>
    <span class="text">
      {{previewHeight}} px
    </span>
  </div>
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
