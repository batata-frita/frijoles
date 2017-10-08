const most = require('most')
const pull = require('pull-stream')
const create = require('@most/create').create

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
}
