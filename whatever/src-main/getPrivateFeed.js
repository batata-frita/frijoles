const pull = require('pull-stream')
const Maybe = require('folktale/maybe')
const { path, compose, lensPath, set } = require('ramda')
const create = require('@most/create').create

const decrypt = sbot => message =>
  create((add, end, error) => {
    if (typeof path(['value', 'content'], message) !== 'string') {
      add(Maybe.Nothing())
      return end()
    }

    sbot.private.unbox(message.value.content, (err, content) => {
      if (err) return error(err)

      if (!content) {
        add(Maybe.Nothing())
        return end()
      }

      const decryptedMessage = compose(
        Maybe.Just,
        set(lensPath(['value', 'content']), content),
        set(lensPath(['private']), true)
      )(message)

      add(decryptedMessage)
      end()
    })
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
  })
    .flatMap(decrypt(sbot))
    .filter(value =>
      value.matchWith({
        Just: () => true,
        Nothing: () => false,
      })
    )
}
