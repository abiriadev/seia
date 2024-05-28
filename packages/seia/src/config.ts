import { isAbsolute } from 'node:path'
import { cwd } from 'node:process'
import { z } from 'zod'

export type SeiaConfig = z.infer<typeof SeiaConfigSchema>

export type ResolvedSeiaConfig = z.infer<
	typeof ResolvedSeiaConfigSchema
>

const relativePath = z.custom<string>(
	val => typeof val === 'string' && !isAbsolute(val),
)

export const SeiaConfigSchema = z
	.object({
		entry: relativePath
			.default('src/App.tsx')
			.describe(
				'Main entrypoint to resolve dependency graph.\nRelative to the project root.',
			),
		dist: relativePath
			.default('dist')
			.describe(
				'Dist directory.\nRelative to the project root.',
			),
		serve: z.object({
			port: z
				.number()
				.int()
				.nonnegative()
				.lt(1 << 16)
				.default(5314)
				.describe('Port number to run SSR server'),
		}),
	})
	.partial()

export const ResolvedSeiaConfigSchema =
	SeiaConfigSchema.extend({
		root: z
			.string()
			.default(cwd)
			.describe('Absolute path to the project root'),
		mode: z
			.enum(['development', 'production'])
			.default('production')
			.describe('Build mode'),
	})

export const resolveSeiaConfig = (
	config: SeiaConfig,
): ResolvedSeiaConfig => {
	return ResolvedSeiaConfigSchema.parse(config)
}

// TODO: make it recursive when the config type got complicated later
export const mergeSeiaConfig = (
	defaults: SeiaConfig,
	overrides: SeiaConfig,
): SeiaConfig => {
	return {
		...defaults,
		...overrides,
	}
}

// TODO: make it recursive when the config type got complicated later
export const extendResolvedSeiaConfig = (
	defaults: ResolvedSeiaConfig,
	overrides: SeiaConfig,
): ResolvedSeiaConfig => {
	return {
		...defaults,
		...overrides,
	}
}
