import { Plugin } from 'vite'
import { match } from 'ts-pattern'

export const detectBoundaries = (): Plugin => {
	const boundaries = new Set<string>()

	return {
		name: 'seia:detect-boundaries',
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
		onLog(level, log) {
			if (
				level === 'warn' &&
				log.code === 'MODULE_LEVEL_DIRECTIVE' &&
				log.message.includes('use client')
			)
				return false
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
