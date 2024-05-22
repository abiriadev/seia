declare module 'react-server-dom-webpack/node-loader' {
	export type Source = string

	type TransformSourceContext = {
		format: string
		url: string
	}

	type TransformSourceFunction = (
		Source,
		TransformSourceContext,
		TransformSourceFunction,
	) => Promise<{ source: Source }>

	export async function transformSource(
		source: Source,
		context: TransformSourceContext,
		defaultTransformSource: TransformSourceFunction,
	): Promise<{ source: Source }>
}
