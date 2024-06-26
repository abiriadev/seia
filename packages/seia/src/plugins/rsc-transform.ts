import { generate } from 'astring'
import { type ImportDeclaration } from 'estree'
import { transformSource } from 'react-server-dom-webpack/node-loader'
import { match } from 'ts-pattern'
import { type Plugin } from 'vite'

import { type ResolvedSeiaConfig } from '../config.js'
import { name } from '../package.js'

export interface Config {
	config: ResolvedSeiaConfig
}

export const rscTransform = ({ config: { root } }: Config): Plugin => {
	return {
		name: 'seia:rsc-transform',
		async transform(code, id) {
			if (
				!(
					id.startsWith(root) &&
					(id.endsWith('.jsx') || id.endsWith('.tsx'))
				)
			)
				return null

			const { source } = await transformSource(
				code,
				{
					format: 'module',
					url: id,
				},
				async (source: string) => ({ source }),
			)

			const ast = this.parse(source)

			ast.body = ast.body.map(stmt =>
				match(stmt)
					.with(
						{
							type: 'ImportDeclaration',
							source: {
								value: 'react-server-dom-webpack/server',
							},
						},
						(impdec): ImportDeclaration => ({
							...impdec,
							source: {
								...impdec.source,
								value: `${name}/runtime`,
								raw: `"${name}/runtime"`,
							},
						}),
					)
					.otherwise(_ => _),
			)

			return {
				// TODO: maybe we can provide our own source map and AST after `runtime` transform?
				code: generate(ast),
			}
		},
	}
}
