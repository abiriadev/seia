import { transformSource } from 'react-server-dom-webpack/node-loader'
import { type Plugin } from 'vite'
import { ResolvedSeiaConfig } from '../config.js'
import { ImportDeclaration } from 'estree'
import { match } from 'ts-pattern'
import { generate } from 'astring'

export interface Config {
	config: ResolvedSeiaConfig
}

export const rscTransform = ({
	config: { root },
}: Config): Plugin => {
	return {
		name: 'seia:rsc-transform',
		async transform(code, id) {
			if (!(root && id.startsWith(root))) return null

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
								value: 'seia-js/runtime',
								raw: `"seia-js/runtime"`,
							},
						}),
					)
					.otherwise(_ => _),
			)

			return {
				code: generate(ast),
				ast,
			}
		},
	}
}
