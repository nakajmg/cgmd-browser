<style lang="scss" scoped>
  .lint-items {
    width: 200px;
    border-left: 1px solid #c1c1c1;
    color: #333;
    overflow: scroll;
  }
  .lint-item {
    border-top: 1px solid #989898;
    &:first-of-type {
      border-top: none;
    }
    &:last-of-type {
      border-bottom: 1px solid #989898;
    }
  }
  .lint-item-heading {
    display: block;
    white-space: initial;
    margin: 0;
    padding: 2px 3px;
    display: flex;
    align-items: center;
    cursor: pointer;
    .key {
      cursor: pointer;
      flex-grow: 1;
      font-size: 12px;
      .actual {
        color: tomato;
      }
      .expect {
        color: #2fd82f;
      }
    }
    .count {
      cursor: pointer;
      background-color: tomato;
      color: #fff;
      width: 14px;
      line-height: 14px;
      text-align: center;
      font-size: 10px;
      margin-right: 5px;
      flex-shrink: 0;
      border-radius: 2px;
    }
    .expand {
      cursor: pointer !important;
      flex-shrink: 0;
      padding-right: 4px;
      padding-left: 2px;
    }

    .icon-up-open {
      display: none;
    }
  }
  .lint-item-toggle {
    display: none;
  }
  .lint-results {
    max-height: 0;
    overflow: hidden;
    transition: max-height 200ms ease;
  }
  .lint-item-toggle:checked + .lint-item-heading {
    .icon-down-open {
      display: none;
    }
    .icon-up-open {
      display: block;
    }
  }
  .lint-item-toggle:checked + .lint-item-heading + .lint-results {
    max-height: 100vh;
  }
  .lint-results-info {
    padding-left: 2px;
    border-top: 1px dashed #ccc;
    cursor: pointer;
    &:nth-of-type(2n) {
      background-color: #f9f9f9;
    }
    &:hover {
      background-color: #79b7ff;
      color: #fff;
    }
  }
  .lint-results-info-text {
    display: inline-block;
    min-width: 25px;
    text-align: right;
    &:first-of-type {
      margin-right: 3px;
    }
  }
</style>

<template>
  <div class="lint-items" v-show="textlintState">
    <div class="lint-item"
      v-for="(result, key) in results"
      v-if="currentFilePath"
      :key="key">
      <input type="checkbox" :id="key" class="lint-item-toggle" @click="highlight" ref="check">
      <label :for="key" class="lint-item-heading">
        <span class="count">{{result.length}}</span>
        <span class="key">
          <span class="actual">{{key.split('/')[0]}}</span> /
          <span class="expect">{{key.split('/')[1]}}</span>
        </span>
        <span class="expand">
          <span class="icon icon-down-open"></span>
          <span class="icon icon-up-open"></span>
        </span>
      </label>
      <div class="lint-results">
        <p v-for="(info, index) in result" class="lint-results-info" @click="jumpMarkedWord(key, index)">
          <span class="lint-results-info-text">{{info.line}}</span>:
          <span class="lint-results-info-text">{{info.column}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="babel">
  import {ipcRenderer} from 'electron'
  import {mapGetters} from 'vuex'
  import mediator from '../mediator'
  export default{
    data() {
      return {
        results: []
      }
    },
    computed: {
      ...mapGetters({
        currentFilePath: 'currentFilePath',
        textlintState: 'textlintState'
      })
    },
    mounted() {
      const separator = ' => '
      ipcRenderer.on('textlintResult', (e, {results, filepath}) => {
        const arranged = {}
        results.messages.forEach(({message, line, column}) => {
          const key = message.split(separator).join('/')
          arranged[key] || (arranged[key] = [])
          arranged[key].push({line, column})
        })
        this.results = []
        this.results = arranged
        mediator.$emit('lintCount', results.messages.length)
        // filepathがcurrentFilePathと異なる場合は [] をセットしてクリア
      })
    },
    methods: {
      highlight() {
        const keys = this.$refs.check.reduce((ret, el) => {
          if (el.checked) {
            ret.push(el.id)
          }
          return ret
        }, [])
        mediator.$emit('highlightWebview', keys)
      },
      jumpMarkedWord(key, index) {
        const [word] = key.split('/')
        mediator.$emit('jumpMarkedWord', {word, index})
      }
    }
  }
</script>
