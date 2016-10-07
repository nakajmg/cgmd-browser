import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

const pastState = window.localStorage.getItem('prevue-state')
const state = pastState ? {...JSON.parse(pastState), wordCount: '-', previewHeight: '-', searchState: false, viewportState: false} : {
  currentFilePath: '',
  wordCount: '-',
  filePaths: [],
  previewHeight: '-',
  favorite: [],
  searchState: false,
  searchWord: '',
  mdDirectory: '',
  mdDirectoryState: true,
  viewportState: false,
  textlintState: false,
  textlintDictionary: ''
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
