import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const {
	name,
	/**
	 * The version of the Seia framework and Seia CLI.
	 */
	version,
} = require('../package.json') as {
	name: string
	version: string
}

export { name, version }
