import './webpack-global.js'
import { join } from 'node:path'
import {
	build as vite,
	mergeConfig,
	type UserConfig,
} from 'vite'
import { detectBoundaries } from './plugins/detect-boundaries.js'
import { P, match } from 'ts-pattern'
import type { OutputAsset } from 'rollup'
import { rscTransform } from './plugins/rsc-transform.js'
import { injectClient } from './plugins/inject-client.js'
import { ResolvedSeiaConfig } from './config.js'

const defaultConfig = {
	build: {
		target: 'esnext',
		lib: {
			formats: ['es'],
		},
	},
}

export const build = async (config: ResolvedSeiaConfig) => {
	const {
		paths: { src, entry: entryFile },
	} = config

	const entry = join(src, entryFile)

	const boundariesOutput = await vite(
		mergeConfig(defaultConfig, {
			plugins: [
				detectBoundaries({
					config,
				}),
			],
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

	// RSC
	await vite(
		mergeConfig(defaultConfig, {
			plugins: [
				rscTransform({
					config,
				}),
			],
			build: {
				lib: {
					entry,
				},
				outDir: 'dist/rsc',
				ssr: true,
			},
			ssr: {
				external: true,
			},
		} satisfies UserConfig),
	)

	// SSR
	await vite(
		mergeConfig(defaultConfig, {
			build: {
				lib: {
					entry: boundariesManifest,
				},
				outDir: 'dist/ssr',
				ssr: true,
			},
			ssr: {
				external: true,
			},
		} satisfies UserConfig),
	)

	// Hydration
	await vite(
		mergeConfig(defaultConfig, {
			plugins: [
				injectClient({
					clientBoundaries: boundariesManifest,
					config,
				}),
			],
			build: {
				lib: {
					entry: '\0client.js',
					fileName: 'client',
				},
				emptyOutDir: false,
			},
		} satisfies UserConfig),
	)
}
