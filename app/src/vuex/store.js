import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import * as actions from './actions'
import * as getters from './getters'
import * as types from './mutation-types'

Vue.use(Vuex)

const state = {
  currentFilePath: '',
  filePaths: [
//    '/usr/local/work/pxg/codegrid-draft/drafts/2016-react_ex/1.md',
//    '/usr/local/work/pxg/codegrid-draft/drafts/2016-react_ex/2.md'
  ]
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

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  strict: true
})
