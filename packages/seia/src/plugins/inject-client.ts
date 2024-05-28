import { type Plugin } from 'vite'
import { relative } from 'node:path'
import sum from 'hash-sum'
import { ResolvedSeiaConfig } from '../config.js'
import { changeExtension, trimPrefix } from '../utils.js'

export interface Options {
	clientBoundaries: Array<string>
	config: ResolvedSeiaConfig
}

export const injectClient = ({
	clientBoundaries,
	config: {
		paths: { src },
	},
}: Options): Plugin => {
	return {
		name: 'seia:inject-client',
		resolveId(source) {
			if (source.endsWith('\0client.js'))
				return '\0client.js'
		},
		load(id) {
			if (id === '\0client.js') {
				const modules = clientBoundaries.map(
					path => ['_' + sum(path), path],
				)

				const code = `
import { initClientModuleMap, run } from 'seia-js/client'

${modules
	.map(([id, path]) => `import * as ${id} from '${path}'`)
	.join('\n')}

const clientModuleMap = {
${modules
	.map(
		([id, path]) =>
			`'${'./' + changeExtension(relative(src, path), '.js')}': ${id},`,
	)
	.join('\n')}
}

initClientModuleMap(clientModuleMap)

run()
			`

				return code
			}
		},
	}
}
