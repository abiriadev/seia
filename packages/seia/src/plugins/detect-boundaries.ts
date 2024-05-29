import { match } from 'ts-pattern'
import { Plugin } from 'vite'

import { ResolvedSeiaConfig } from '../config.js'
import { trimPrefix } from '../utils.js'

export interface Config {
	config: ResolvedSeiaConfig
}

export const detectBoundaries = ({ config: { root } }: Config): Plugin => {
	const boundaries = new Set<string>()

	return {
		name: 'seia:detect-boundaries',
		moduleParsed({ id, ast }) {
			if (
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
				)?.length
			)
				boundaries.add('.' + trimPrefix(id, root))
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
