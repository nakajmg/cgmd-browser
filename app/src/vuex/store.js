import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import * as actions from './actions'
import * as getters from './getters'
import * as types from './mutation-types'

Vue.use(Vuex)

const state = {
  currentFilePath: '',
  wordCount: 0,
  filePaths: [
    '/usr/local/work/pxg/codegrid-draft/drafts/2016-react_ex/1.md',
    '/usr/local/work/pxg/codegrid-draft/drafts/2016-react_ex/2.md',
    '/usr/local/work/pxg/codegrid-draft/drafts/2016-electron/4.md'
  ],
  previewHeight: 0
}

const mutations = {
  [types.ADD_FILE_PATHS](state, filepath) {
    if (_.includes(state.filePaths, filepath)) return
    state.filePaths.push(filepath)
  },

  [types.REMOVE_FILE_PATHS](state, filepath) {
    const index = _.indexOf(state.filePaths, filepath)
    state.filePaths.splice(index, 1)
    let next = ''
    // 消したindexにpathがあればそれ
    if (state.filePaths[index]) {
      next = state.filePaths[index]
    }
    // ないときは最後の消したときかfilePathsが空のどっちか
    else if (state.filePaths.length !== 0) {
      next = state.filePaths[index - 1]
    }
    setTimeout(() => {
      state.currentFilePath = next
    }, 0)
  },

  [types.SET_CURRENT_FILE_PATH](state, filepath) {
    state.currentFilePath = filepath
  },

  [types.SET_PREVIEW_HEIGHT](state, height) {
    state.previewHeight = height
  },

  [types.SET_WORD_COUNT](state, count) {
    state.wordCount = count
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
