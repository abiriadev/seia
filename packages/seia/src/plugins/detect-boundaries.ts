import { Plugin } from 'vite'
import { match } from 'ts-pattern'

export const detectBoundaries = (): Plugin => {
	return {
		name: 'seia:detect-boundaries',
		moduleParsed(info) {
			const isClient = !!info.ast?.body.filter(node =>
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
			)
		},
		onLog(level, log) {
			if (
				level === 'warn' &&
				log.code === 'MODULE_LEVEL_DIRECTIVE' &&
				log.message.includes('use client')
			)
				return false
		},
	}
}
