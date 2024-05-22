import './webpack-global.js'
import { build as vite } from 'vite'
import react from '@vitejs/plugin-react'
import { nodeExternals } from 'rollup-plugin-node-externals'
import { seia } from './vite-plugin-seia.js'

export const build = async () => {
	await vite({
		plugins: [nodeExternals(), seia(), react()],
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
