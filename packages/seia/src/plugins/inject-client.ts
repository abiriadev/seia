import { type Plugin } from 'vite'
import { relative } from 'node:path'
import sum from 'hash-sum'
import { ResolvedSeiaConfig } from '../config.js'
import { isObject } from '../utils.js'
import { changeExtension } from '../utils-path.js'
import type { AstNodeLocation, ProgramNode } from 'rollup'
import type {
	ImportDeclaration,
	Program,
	Property,
} from 'estree'
import { name } from '../package.js'

export interface Options {
	clientBoundaries: Array<string>
	config: ResolvedSeiaConfig
}

export const injectClient = ({
	clientBoundaries,
	config,
}: Options): Plugin => {
	return {
		name: 'seia:inject-client',
		resolveId(source) {
			if (source.endsWith('\0client.js'))
				return '\0client.js'
		},
		load(id) {
			if (id === '\0client.js') {
				const rawAst = injectManifest(
					clientBoundaries.map(path => [
						'_' + sum(path),
						path,
					]),
					config,
				)

				const ast = injectSpan(
					rawAst,
				) as ProgramNode

				return {
					code: '',
					ast,
				}
			}
		},
	}
}

const dummySpan: AstNodeLocation = {
	start: 0,
	end: 0,
}

const s = <T>(v: T): T & AstNodeLocation => ({
	...v,
	...dummySpan,
})

type InjectedNode<T> =
	T extends Array<infer U>
		? Array<InjectedNode<U>>
		: T extends Record<string, unknown>
			? T & AstNodeLocation
			: T

const injectSpan = <T>(node: T): InjectedNode<T> => {
	if (Array.isArray(node))
		return node.map(injectSpan) as InjectedNode<T>

	if (isObject(node)) {
		for (const key in node) {
			const value = node[key]
			;(node as Record<string, unknown>)[key] =
				injectSpan(value)
		}

		return s(node) as InjectedNode<T>
	}

	return node as InjectedNode<T>
}

const injectManifest = (
	manifestArrary: Array<[string, string]>,
	{ paths: { src } }: ResolvedSeiaConfig,
): Program => ({
	type: 'Program',
	sourceType: 'module',
	body: [
		{
			type: 'ImportDeclaration',
			specifiers: [
				{
					type: 'ImportSpecifier',
					local: {
						type: 'Identifier',
						name: 'initClientModuleMap',
					},
					imported: {
						type: 'Identifier',
						name: 'initClientModuleMap',
					},
				},
				{
					type: 'ImportSpecifier',
					local: {
						type: 'Identifier',
						name: 'run',
					},
					imported: {
						type: 'Identifier',
						name: 'run',
					},
				},
			],
			source: {
				type: 'Literal',
				value: `${name}/client`,
			},
		},
		...manifestArrary.map(
			([id, path]): ImportDeclaration => ({
				type: 'ImportDeclaration',
				specifiers: [
					{
						type: 'ImportNamespaceSpecifier',
						local: {
							type: 'Identifier',
							name: id,
						},
					},
				],
				source: {
					type: 'Literal',
					value: path,
				},
			}),
		),
		{
			type: 'VariableDeclaration',
			declarations: [
				{
					type: 'VariableDeclarator',
					id: {
						type: 'Identifier',
						name: 'clientModuleMap',
					},
					init: {
						type: 'ObjectExpression',
						properties: manifestArrary.map(
							([id, path]): Property => ({
								type: 'Property',
								key: {
									type: 'Literal',
									value:
										'./' +
										changeExtension(
											relative(
												src,
												path,
											),
											'.js',
										),
								},
								value: {
									type: 'Identifier',
									name: id,
								},
								kind: 'init',
								method: false,
								shorthand: false,
								computed: false,
							}),
						),
					},
				},
			],
			kind: 'const',
		},
		{
			type: 'ExpressionStatement',
			expression: {
				type: 'CallExpression',
				callee: {
					type: 'Identifier',
					name: 'initClientModuleMap',
				},
				arguments: [
					{
						type: 'Identifier',
						name: 'clientModuleMap',
					},
				],
				optional: false,
			},
		},
		{
			type: 'ExpressionStatement',
			expression: {
				type: 'CallExpression',
				callee: {
					type: 'Identifier',
					name: 'run',
				},
				arguments: [],
				optional: false,
			},
		},
	],
})
