import * as types from '../mutation-types'
import _ from 'lodash'

const state = {
  currentFilePath: null,
  filePaths: ['hoge']
}

const mutations = {
  [types.ADD_FILE_PATHS](state, filepath) {
    if (_.contains(state.filePaths, filepath)) return
    state.filePaths.push(filepath)
  },

  [types.REMOVE_FILE_PATHS](state, filepath) {
    const index = _.indexOf(state.filePaths, filepath)
    state.filePaths.splice(index, 1)
  },

  [types.SET_CURRENT_FILE_PATH](state, filepath) {
    state.currentFilePath = filepath
  }
}

export default {
  state,
  mutations
}
