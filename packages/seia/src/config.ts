import { existsSync } from 'node:fs'
import { isAbsolute } from 'node:path'
import { cwd } from 'node:process'

import { z } from 'zod'

import { isObject } from './utils.js'

// TODO: well, typedoc doesn't support z.inter/z.input type well.
// we can manually write the type every time, but it's too much work.
// also, we can't document each field in the schema, because the type is inferred, not directly written.
// maybe we can completely rewrite the config resolver without zod, but as of
// now, we will stick with zod.
/**
 * The configuration object for the Seia CLI.
 */
export type SeiaConfig = z.input<typeof seiaConfigSchema>

/**
 * The resolved configuration object for the Seia CLI.
 */
export type ResolvedSeiaConfig = z.infer<typeof resolvedSeiaConfigSchema>

const relativePath = z.custom<string>(
	value => typeof value === 'string' && !isAbsolute(value),
)

export const resolvedSeiaConfigSchema = z.object({
	mode: z
		.enum(['development', 'production'])
		.default('production')
		.describe('Build mode'),
	root: z.string().default(cwd).describe('Absolute path to the project root'),
	paths: z
		.object({
			src: relativePath.default('src').describe('Source directory'),
			entry: relativePath
				.default(() =>
					// TODO: hardcoded path. should use config's `src` instead
					existsSync('./src/App.tsx') ? 'App.tsx' : 'App.jsx',
				)
				.describe(
					'Main entrypoint to resolve dependency graph.\nRelative to the project root.',
				),
			anchor: z
				.string()
				.regex(/^[\p{IDS}$_][\p{IDC}$]*$/v)
				.default('default')
				.describe(
					'Name of exported item to be used as a main component',
				),
			dist: relativePath
				.default('dist')
				.describe('Dist directory.\nRelative to the project root.'),
			ssr: relativePath
				.default('ssr')
				.describe('SSR output directory.\nRelative to the `dist`.'),
			rsc: relativePath
				.default('rsc')
				.describe('RSC output directory.\nRelative to the `dist`.'),
		})
		.default({}),
	serve: z
		.object({
			port: z
				.number()
				.int()
				.nonnegative()
				.lt(1 << 16)
				.default(5314)
				.describe('Port number to run SSR server'),
		})
		.default({}),
})

export const seiaConfigSchema = resolvedSeiaConfigSchema.omit({
	root: true,
	mode: true,
})

/**
 * Resolve the given {@link SeiaConfig} to a fully resolved {@link ResolvedSeiaConfig}.
 *
 * This function will fill in the default values for unspecified fields.
 *
 * Additionally, this function will perform validation on the given config object.
 *
 * In addition to the {@link SeiaConfig} fields, the resolved config will also contain additional fields such as `root` and `mode`.
 */
export const resolveSeiaConfig = (config: SeiaConfig): ResolvedSeiaConfig => {
	return resolvedSeiaConfigSchema.parse(config)
}

// Heavily inspired by: https://github.com/vitejs/vite/blob/15a6ebb414e3155583e3e9ad970afbdb598b0609/packages/vite/src/node/utils.ts#L1071-L1128
const mergeConfigRecursively = (
	defaults: Record<string, unknown>,
	overrides: Record<string, unknown>,
): Record<string, unknown> => {
	const merged: Record<string, unknown> = { ...defaults }

	for (const key in overrides) {
		if (!Object.hasOwn(overrides, key)) continue

		const value = overrides[key]

		// ignore nullish
		if (value === undefined || value === null) continue

		const existing = merged[key]

		// Accept new when existing one is nullish
		if (existing === undefined || existing === null) {
			merged[key] = value
			continue
		}

		// Recursively merge objects
		if (isObject(existing) && isObject(value)) {
			merged[key] = mergeConfigRecursively(existing, value)
			continue
		}

		merged[key] = value
	}

	return merged
}

/**
 * Smartly merge two {@link SeiaConfig}s.
 *
 * This function will merge two configs recursively, leaving the unspecified fields as is.
 *
 * This function is useful when you want to change only a few fields from the base config.
 *
 * The result will be a new object, and the original objects will not be mutated.
 *
 * This function does not perform validation. If you want to validate and produce a fully resolved config, use {@link resolveSeiaConfig} instead.
 *
 * @category Config
 *
 * @returns The merged config object.
 *
 * @example
 * ```ts
 * mergeSeiaConfig({
 *     paths: {
 *         src: '.',
 *     }
 * }, {
 *     paths: {
 *         entry: 'Page.tsx',
 *     }
 * })
 * // will be evaluated to:
 * // {
 * //     paths: {
 * //         src: '.',
 * //         entry: 'Page.tsx',
 * //     }
 * // }
 * ```
 */
export const mergeSeiaConfig = (
	defaults: SeiaConfig,
	overrides: SeiaConfig,
): SeiaConfig => mergeConfigRecursively(defaults, overrides)

/**
 * Extend the already resolved {@link ResolvedSeiaConfig} with additional fields.
 *
 * This function will merge two configs recursively, resulting in a fully resolved config.
 *
 * This function is useful when you want to change only a few fields from the resolved config.
 *
 * The result will be a new object, and the original objects will not be mutated.
 *
 * @category Config
 *
 * @returns The merged config object.
 */
export const extendResolvedSeiaConfig = (
	defaults: ResolvedSeiaConfig,
	overrides: SeiaConfig,
): ResolvedSeiaConfig =>
	mergeConfigRecursively(defaults, overrides) as ResolvedSeiaConfig
