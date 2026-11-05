const fs = require('node:fs')
const path = require('node:path')
const newman = require('newman')
const { createApp } = require('../index')
const collection = require('../postman/practice37.postman_collection.json')

// Newman запускает ту же коллекцию Postman, которую можно импортировать в GUI.
// Берём свободный локальный порт, чтобы не мешать уже запущенному серверу.
const server = createApp().listen(0, '127.0.0.1', () => {
  const baseUrl = `http://127.0.0.1:${server.address().port}`
  newman.run({ collection, envVar: [{ key: 'baseUrl', value: baseUrl }], reporters: ['cli'] }, (err, summary) => {
    const dir = path.join(__dirname, '..', 'verification')
    fs.mkdirSync(dir, { recursive: true })
    const result = {
      requests: summary?.run.stats.requests,
      assertions: summary?.run.stats.assertions,
      failures: summary?.run.failures.map(item => ({ name: item.source.name, error: item.error.message })) || [],
    }
    fs.writeFileSync(path.join(dir, 'postman-results.json'), JSON.stringify(result, null, 2))
    server.close(() => { process.exitCode = err || result.failures.length ? 1 : 0 })
  })
})
