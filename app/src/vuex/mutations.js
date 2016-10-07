import _ from 'lodash'
import * as types from './mutation-types'

export default {
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
    // setTimeoutしないと２回watchが反応することがある
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
  },

  [types.ADD_FAVORITE](state, filepath) {
    state.favorite.push(filepath)
  },

  [types.REMOVE_FAVORITE](state, filepath) {
    const index = _.indexOf(state.favorite, filepath)
    state.favorite.splice(index, 1)
  },

  [types.TOGGLE_FAVORITE](state, filepath) {
    const index = _.indexOf(state.favorite, filepath)
    if (index !== -1) {
      state.favorite.splice(index, 1)
    }
    else {
      state.favorite.push(filepath)
    }
  },

  [types.TOGGLE_SEARCH_STATE](state) {
    state.searchState = !state.searchState
  },

  [types.SET_SEARCH_STATE](state, bool) {
    state.searchState = bool
  },

  [types.SET_SEARCH_WORD](state, word) {
    state.searchWord = word
  },

  [types.TABS_MOVE_RIGHT](state) {
    if (state.filePaths.length === 0) return
    const index = _.indexOf(state.filePaths, state.currentFilePath)
    if (index === state.filePaths.length - 1) {
      state.currentFilePath = state.filePaths[0]
    }
    else {
      state.currentFilePath = state.filePaths[index + 1]
    }
  },

  [types.TABS_MOVE_LEFT](state) {
    if (state.filePaths.length === 0) return
    const index = _.indexOf(state.filePaths, state.currentFilePath)
    if (index === 0) {
      state.currentFilePath = state.filePaths[state.filePaths.length - 1]
    }
    else {
      state.currentFilePath = state.filePaths[index - 1]
    }
  },

  [types.SET_MD_DIRECTORY](state, dirpath) {
    state.mdDirectory = dirpath
  },

  [types.TOGGLE_MD_DIRECTORY_STATE](state) {
    state.mdDirectoryState = !state.mdDirectoryState
  },

  [types.TOGGLE_VIEWPORT_STATE](state) {
    state.viewportState = !state.viewportState
  },

  [types.TOGGLE_TEXTLINT_STATE](state) {
    state.textlintState = !state.textlintState
  },

  [types.SET_TEXTLINT_DICTIONARY](state, filepath) {
    state.textlintDictionary = filepath
  }
}
