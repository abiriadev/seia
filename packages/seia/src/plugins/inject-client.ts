import { type Plugin } from 'vite'

export const injectClient = (): Plugin => {
	return {
		name: 'seia:inject-client',
		resolveId(source) {
			if (source.endsWith('\0client.js'))
				return '\0client.js'
		},
		load(id) {
			if (id === '\0client.js')
				return `import 'seia-js/client'`
		},
	}
}
