import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import type { OutputAsset } from 'rollup'
import { P, match } from 'ts-pattern'
import { type UserConfig, mergeConfig, build as vite } from 'vite'

import { type ResolvedSeiaConfig } from './config.js'
import { detectBoundaries } from './plugins/detect-boundaries.js'
import { filterCss } from './plugins/filter-css.js'
import { injectClient } from './plugins/inject-client.js'
import { rscTransform } from './plugins/rsc-transform.js'
import { silenceDirective } from './plugins/silence-directive.js'

const defaultConfig = {
	plugins: [silenceDirective()],
	build: {
		target: 'esnext',
		lib: {
			formats: ['es'],
		},
	},
}

const writeAsset = async (
	{ fileName, source }: OutputAsset,
	{ root, paths: { dist } }: ResolvedSeiaConfig,
): Promise<void> => {
	const resolvedDestination = join(root, dist, fileName)

	await mkdir(dirname(resolvedDestination), { recursive: true })

	return writeFile(resolvedDestination, source)
}

/**
 * Build the Seia project with the given configuration.
 */
export const build = async (config: ResolvedSeiaConfig) => {
	const {
		paths: { src, entry: entryFile },
	} = config

	const entry = join(src, entryFile)

	const rawBoundariesOutput = await vite(
		mergeConfig(defaultConfig, {
			plugins: [
				detectBoundaries({
					config,
				}),
			],
			build: {
				cssMinify: true,
				lib: {
					entry,
				},
				ssr: true,
				ssrEmitAssets: true,
				write: false,
			},
		} satisfies UserConfig),
	)

	// BoundariesOutput should be array
	if (!Array.isArray(rawBoundariesOutput))
		throw new Error('boundariesOutput is not an array')

	const [{ output: boundariesOutput }] = rawBoundariesOutput

	const assets = boundariesOutput.filter(
		(file): file is OutputAsset => file.type === 'asset',
	)

	const boundariesManifest = match(
		assets.find(({ fileName }) => fileName === 'boundaries-manifest.json')
			?.source,
	)
		.with(P.string, source => JSON.parse(source) as string[])
		.run()

	const styleAssets = assets.filter(({ fileName }) =>
		fileName.endsWith('.css'),
	)

	// Hydration
	await vite(
		mergeConfig(defaultConfig, {
			plugins: [
				filterCss(),
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
				emptyOutDir: true,
			},
		} satisfies UserConfig),
	)

	// Flush bundled style assets
	await Promise.all(styleAssets.map(async asset => writeAsset(asset, config)))

	// RSC
	await vite(
		mergeConfig(defaultConfig, {
			plugins: [
				filterCss(),
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
	if (boundariesManifest.length > 0)
		await vite(
			mergeConfig(defaultConfig, {
				plugins: [filterCss()],
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
}
