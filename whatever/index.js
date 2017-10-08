const ssbClient = require('ssb-client')
const ssbKeys = require('ssb-keys')
const ssbFeed = require('ssb-feed')

const keys = ssbKeys.loadOrCreateSync('./app-private.key')
console.log('keys', keys)

ssbClient(
  {
    keys,
  },
  function(err, sbot) {
    if (err) throw err
    console.log('connected')

    const feed = ssbFeed(sbot, keys)

    feed.publish(
      {
        type: 'batata-frita/frijoles/new-world',
        anything: {
          value: 'given',
        },
      },
      function(err) {
        console.log('Posted message', err)
      }
    )
  }
)
