<style scoped>
  .favorite {
    text-align: right;
    font-weight: 600;
    opacity: 0.7;
    line-height: 18px;
  }
  .icon {
    font-size: 16px;
  }
</style>

<template>
  <div class="favorite">
    <span @click="unfavo" class="icon icon-star" v-if="isFavorite"></span>
    <span @click="favo" class="icon icon-star-empty" v-else></span>
  </div>
</template>

<script lang="babel">
  import {mapGetters, mapActions} from 'vuex'
  import _ from 'lodash'
  export default{
    props: [
      'filepath'
    ],
    computed: {
      isFavorite() {
        return _.includes(this.favorite, this.currentFilePath)
      },
      ...mapGetters({
        favorite: 'favorite',
        currentFilePath: 'currentFilePath'
      })
    },
    methods: {
      ...mapActions({
        addFavorite: 'addFavorite',
        removeFavorite: 'removeFavorite'
      }),
      favo() {
        this.addFavorite(this.currentFilePath)
      },
      unfavo() {
        this.removeFavorite(this.currentFilePath)
      }
    },
    components: {
    }
  }
</script>
