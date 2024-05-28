import { transformSource } from 'react-server-dom-webpack/node-loader'
import { type Plugin } from 'vite'
// TODO: use swc
// import { parse } from '@swc/core'

export const rscTransform = (): Plugin => {
	let _root: string | null = null

	return {
		name: 'seia:rsc-transform',
		configResolved({ root }) {
			_root = root
		},
		async transform(code, id) {
			if (!(_root && id.startsWith(_root)))
				return null

			const { source } = await transformSource(
				code,
				{
					format: 'module',
					url: id,
				},
				async (source: string) => ({ source }),
			)

			// TODO: use swc transformer?
			// but swc deprecated transformer
			// const res = await parse(source, {
			// 	target: 'es2022',
			// 	syntax: 'typescript',
			// 	tsx: true,
			// 	decorators: true,
			// 	dynamicImport: true,
			// })

			return source.replace(
				/react-server-dom-webpack\/server(\.\w+)?/,
				'seia-js/runtime',
			)
		},
	}
}
