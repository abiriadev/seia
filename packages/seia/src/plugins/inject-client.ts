import { type Plugin } from 'vite'
import sum from 'hash-sum'

export interface Options {
	clientBoundaries: Array<string>
}

export const injectClient = ({
	clientBoundaries,
}: Options): Plugin => {
	let _root: string | null = null

	return {
		name: 'seia:inject-client',
		configResolved({ root }) {
			_root = root
		},
		resolveId(source) {
			if (source.endsWith('\0client.js'))
				return '\0client.js'
		},
		load(id) {
			if (id === '\0client.js') {
				const modules = clientBoundaries.map(
					path => [
						'_' + sum(path),
						'.' + path.slice(_root!.length),
					],
				)

				const code = `
${modules
	.map(([id, path]) => `import * as ${id} from '${path}'`)
	.join('\n')}
import { initClientModuleMap, run } from 'seia-js/client'

const clientModuleMap = {
${modules
	.map(([id, path]) => `'${path}': ${id},`)
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
