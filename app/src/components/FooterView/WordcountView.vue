<style scoped>
  .count {
    padding: 1px 5px;
    border: 1px solid #b9b9b9;
    border-radius: 1px;
    background: #ececec;
    box-shadow: inset 1px 1px 1px rgba(0,0,0,.1);
    min-width: 73px;
    text-align: right;
    display: flex;
    align-items: center;
    margin-left: 0px;
    margin-right: 5px;
  }
  .text {
    flex-grow: 1;
  }
</style>
<template>
  <div class="count">
    <span class="text">
      {{wordCount}} 文字
    </span>
  </div>
</template>

<script lang="babel">
  import {mapGetters} from 'vuex'
  export default{
    computed: {
      ...mapGetters({
        wordCount: 'wordCount'
      })
    },
    components: {
    }
  }
</script>
