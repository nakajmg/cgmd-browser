import * as types from './mutation-types'

export const addFilePaths = ({commit}, filepath) => {
  commit(types.ADD_FILE_PATHS, filepath)
  commit(types.SET_CURRENT_FILE_PATH, filepath)
}

export const removeFilePaths = ({commit}, filepath) => {
  commit(types.REMOVE_FILE_PATHS, filepath)
}

export const setCurrentFilePath = ({commit}, filepath) => {
  commit(types.SET_CURRENT_FILE_PATH, filepath)
}

export const setPreviewHeight = ({commit}, height) => {
  commit(types.SET_PREVIEW_HEIGHT, height)
}

export const setWordCount = ({commit}, count) => {
  commit(types.SET_WORD_COUNT, count)
}

