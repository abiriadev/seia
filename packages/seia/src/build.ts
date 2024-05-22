import './webpack-global.js'
import { transformSource } from 'react-server-dom-webpack/node-loader'
import { build as vite, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { nodeExternals } from 'rollup-plugin-node-externals'

const plugin = (): Plugin => {
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

export const build = async () => {
	await vite({
		plugins: [nodeExternals(), plugin(), react()],
		build: {
			target: 'esnext',
			emptyOutDir: false,
			rollupOptions: {
				input: ['./src/App.tsx'],
				output: {
					dir: '.',
				},
				external: /node:/,
			},
		},
	})
}
