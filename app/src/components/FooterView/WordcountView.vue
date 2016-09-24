<style scoped>
  .count {
    padding: 1px 5px;
    font-weight: 600;
    border: 1px solid #b9b9b9;
    border-radius: 1px;
    background: #ececec;
    box-shadow: inset 1px 1px 1px rgba(0,0,0,.1);
    min-width: 80px;
    text-align: right;
    display: flex;
    align-items: center;
    margin-left: 0px;
    margin-right: 5px;
  }
  .text {
    flex-grow: 1;
  }
  .icon {
    margin-left: 1px;
  }
  .unit {
    font-size: 10px;
  }
</style>
<template>
  <div class="count">
    <span class="icon icon-pencil"></span>
    <span class="text">
      {{wordCount}} <span class="unit">文字</span>
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
