import { ipcRenderer } from 'electron'
import { createStore } from 'redux'
import React from 'react'
import { render } from 'react-dom'
import subscribe from 'redux-heat'

const initialState = {
  events: [],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'APPEND_FEED_CONTENT':
      return { ...state, events: [...state.events, action.payload] }

    default:
      return state
  }
}

const store = createStore(reducer)

const appendFeedContent = content => ({ type: 'APPEND_FEED_CONTENT', payload: content })

const App = ({ events }) => (
  <div>
    {events.map(event => (
      <div>{event.value.value.content.text && event.value.value.content.text}</div>
    ))}
  </div>
)

const renderApp = events => render(<App events={events} />, document.getElementById('root'))

const renderEffect = ({ events }) => ({
  fn: renderApp,
  args: [events],
})

subscribe(store, [renderEffect])

ipcRenderer.on('post', (event, content) => store.dispatch(appendFeedContent(content)))

// const fixture = require('./fixture.json')
// fixture.forEach(content => store.dispatch(appendFeedContent(content)))
