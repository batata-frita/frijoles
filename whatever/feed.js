const most = require('most')
const pull = require('pull-stream')
const { path } = require('ramda')
const create = require('@most/create').create

const decrypt = sbot => message => create((add, end, error) => {
  if (typeof path(['value', 'content'], message) === 'string') {
    sbot.private.unbox(message.value.content, (err, content) => {
      if (err) error(err)
      else {
        add({
          ...message,
          value: {
            ...message.value,
            content
          },
          private: true
        })
      }
    })
  } else {
    add(message)
    end()
  }
})

module.exports = function feed(sbot) {
  return create(function(add, end, error) {
    pull(
      sbot.createLogStream(),
      pull.collect(function(err, msgs) {
        if (err) return error(err)
        msgs.forEach(add)
      })
    )
  })
    .flatMap(decrypt(sbot))
}
