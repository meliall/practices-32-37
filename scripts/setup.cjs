const { spawnSync } = require('node:child_process')
const path = require('node:path')
// Устанавливаем зависимости каждого самостоятельного проекта по его lock-файлу.
const projects = ['pr32-vue-router','pr33-forms-validation','pr34-pinia-cart','pr35-auth','pr36-express','pr37-express-basics']
for (const project of projects) {
  console.log(`Установка: ${project}`)
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['ci'], { cwd: path.join(__dirname, '..', project), stdio: 'inherit' })
  if (result.status !== 0) process.exit(result.status || 1)
}
