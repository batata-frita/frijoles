const { ipcRenderer } = require('electron')
const { createStore } = require('redux')

const initialState = {
  texts: [],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'APPEND_FEED_CONTENT':
      console.log('Content received', action)

      return { ...state, texts: [...state.texts, action.payload.text] }

    default:
      return state
  }
}

const store = createStore(reducer)

const appendFeedContent = content => ({ type: 'APPEND_FEED_CONTENT', payload: content })

ipcRenderer.on('post', (event, content) => store.dispatch(appendFeedContent(content)))

store.subscribe(() => {
  console.log('>>', store.getState().texts)
})
