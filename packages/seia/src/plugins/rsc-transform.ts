import { transformSource } from 'react-server-dom-webpack/node-loader'
import { type Plugin } from 'vite'
import { ResolvedSeiaConfig } from '../config.js'
// TODO: use swc
// import { parse } from '@swc/core'

export interface Config {
	config: ResolvedSeiaConfig
}

export const rscTransform = ({
	config: { root },
}: Config): Plugin => {
	return {
		name: 'seia:rsc-transform',
		async transform(code, id) {
			if (!(root && id.startsWith(root))) return null

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
