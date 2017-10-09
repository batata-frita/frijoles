const ssbClient = require('ssb-client')
const feed = require('./feed')
const { createStore } = require('redux')
const { path } = require('ramda')

const initialState = {
  texts: [],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'APPEND_FEED_CONTENT':
      return { ...state, texts: [...state.texts, action.payload.text] }

    default:
      return state
  }
}

const store = createStore(reducer)

const appendFeedContent = content => ({ type: 'APPEND_FEED_CONTENT', payload: content })

ssbClient(function(err, sbot) {
  if (err) throw err
  console.log('connected as', sbot.id)

  const feed$ = feed(sbot)
    .filter(({private}) => private)
    .map(path(['value', 'content']))
    .filter(content => content.type === 'post')

  feed$.subscribe({
    next: content => store.dispatch(appendFeedContent(content)),
  })
})

store.subscribe(() => {
  console.log('>>', store.getState().texts)
})
