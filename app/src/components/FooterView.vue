<template>
  <footer class="toolbar toolbar-footer">
    <!--<filepath-view></filepath-view>-->
    <toolbar-view></toolbar-view>
    <height-view></height-view>
  </footer>
</template>

<script>
  import HeightView from './FooterView/HeightView.vue'
  import FilepathView from './FooterView/FilepathView.vue'
  import ToolbarView from './ToolbarView.vue'

  export default{
    components: {
      HeightView,
      FilepathView,
      ToolbarView
    }
  }
</script>
