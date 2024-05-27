import { transformSource } from 'react-server-dom-webpack/node-loader'
import { type Plugin } from 'vite'

export const rscTransform = (): Plugin => {
	let base: string | null = null

	return {
		name: 'seia:rsc-transform',
		configResolved({ base: _base }) {
			base = _base
		},
		async transform(code, id) {
			if (!(base && id.startsWith(base))) {
				return null
			}

			const { source } = await transformSource(
				code,
				{
					format: 'module',
					url: id,
				},
				async (source: string) => ({ source }),
			)

			return source.replace(
				'react-server-dom-webpack/server',
				'seia-js/runtime',
			)
		},
	}
}
