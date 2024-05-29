import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const { name, version } = require('../package.json')

export { name, version }
