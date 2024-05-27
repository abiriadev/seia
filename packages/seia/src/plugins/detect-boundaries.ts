import { Plugin } from 'vite'
import { match } from 'ts-pattern'

export const detectBoundaries = (): Plugin => {
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
			)?.length && boundaries.add(id)
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
