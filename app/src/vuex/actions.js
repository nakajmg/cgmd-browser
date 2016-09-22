import * as types from './mutation-types'

export const addFilePaths = ({commit}, filepath) => {
  commit(types.ADD_FILE_PATHS, filepath)
}

export const removeFilePaths = ({commit}, filepath) => {
  commit(types.REMOVE_FILE_PATHS, filepath)
}

export const setCurrentFilePath = ({commit}, filepath) => {
  commit(types.SET_CURRENT_FILE_PATH, filepath)
}
