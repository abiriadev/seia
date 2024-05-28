import { Plugin } from 'vite'
import { join } from 'node:path'
import { match } from 'ts-pattern'
import { ResolvedSeiaConfig } from '../config.js'
import { trimPrefix } from '../utils.js'

export interface Config {
	config: ResolvedSeiaConfig
}

export const detectBoundaries = ({
	config: {
		root,
		paths: { src },
	},
}: Config): Plugin => {
	const boundaries = new Set<string>()

	return {
		name: 'seia:detect-boundaries',
		onLog(level, { code, message }) {
			if (
				level === 'warn' &&
				code === 'MODULE_LEVEL_DIRECTIVE' &&
				message.includes('use client')
			)
				return false
		},
		moduleParsed({ id, ast }) {
			ast?.body.filter(node =>
				match(node)
					.with(
						{
							type: 'ExpressionStatement',
							expression: {
								type: 'Literal',
								value: 'use client',
							},
						},
						() => true,
					)
					.otherwise(() => false),
			)?.length &&
				boundaries.add(
					'.' + trimPrefix(id, join(root, src)),
				)
		},
		buildEnd() {
			this.emitFile({
				type: 'asset',
				name: 'boundaries-manifest.json',
				needsCodeReference: false,
				source: JSON.stringify([...boundaries]),
			})
		},
	}
}
