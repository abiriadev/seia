import './webpack-global.js'
import {
	build as vite,
	mergeConfig,
	type UserConfig,
} from 'vite'
import { detectBoundaries } from './plugins/detect-boundaries.js'
import { P, match } from 'ts-pattern'
import type { OutputAsset } from 'rollup'

const defaultConfig = {
	build: {
		target: 'esnext',
		lib: {
			formats: ['es'],
		},
	},
}

export const build = async () => {
	const entry = 'src/App.tsx'

	const boundariesOutput = await vite(
		mergeConfig(defaultConfig, {
			plugins: [detectBoundaries()],
			build: {
				lib: {
					entry,
				},
				ssr: true,
				ssrEmitAssets: true,
				write: false,
			},
		} satisfies UserConfig),
	)

	const boundariesManifest = match(boundariesOutput)
		.with(
			[
				{
					output: P.select(),
				},
			],
			output =>
				match(
					output.find(
						(file): file is OutputAsset =>
							match(file)
								.with(
									{
										type: 'asset',
										fileName:
											'boundaries-manifest.json',
									},
									() => true,
								)
								.otherwise(() => false),
					)?.source,
				)
					.with(
						P.string,
						source =>
							JSON.parse(
								source,
							) as Array<string>,
					)
					.run(),
		)
		.run()

	console.log(boundariesManifest)
}
