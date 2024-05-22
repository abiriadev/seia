import { transformSource } from 'react-server-dom-webpack/node-loader'
import { type Plugin } from 'vite'

export const seia = (): Plugin => {
	return {
		name: 'seia',
		buildStart() {
			console.log(`セイア Builder`)
		},
		async transform(code, id) {
			if (!id.endsWith('.tsx')) return null

			const { source } = (await transformSource(
				code,
				{
					format: 'module',
					url: id,
				},
				async (source: string) => ({ source }),
			)) as { source: string }

			return source.replace(
				'react-server-dom-webpack/server',
				'seia-js/runtime',
			)
		},
	}
}
