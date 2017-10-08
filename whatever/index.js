const ssbClient = require('ssb-client')
const feed = require('./feed')

ssbClient(function(err, sbot) {
  if (err) throw err
  console.log('connected as', sbot.id)

  const feed$ = feed(sbot)

  feed$.subscribe({
    next: message => {
      console.log('MESSAGE', message)
      sbot.close()
      process.exit(0)
    },
  })
})
