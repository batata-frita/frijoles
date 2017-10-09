const pull = require('pull-stream')
const { path, compose, lensPath, set } = require('ramda')
const create = require('@most/create').create

const decrypt = sbot => message =>
  create((add, end, error) => {
    if (typeof path(['value', 'content'], message) === 'string') {
      sbot.private.unbox(message.value.content, (err, content) => {
        if (err) return error(err)

        if (!content) {
          add(message)
          return end()
        }

        const decryptedMessage = compose(
          set(lensPath(['value', 'content']), content),
          set(lensPath(['private']), true)
        )(message)

        add(decryptedMessage)
        end()
      })
    } else {
      add(message)
      end()
    }
  })

module.exports = function feed(sbot) {
  return create(function(add, end, error) {
    pull(
      sbot.createLogStream({ reverse: true }),
      pull.collect(function(err, msgs) {
        if (err) return error(err)
        msgs.forEach(add)
      })
    )
  }).flatMap(decrypt(sbot))
}
