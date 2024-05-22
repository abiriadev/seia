interface TemporaryReference<T> {}

type TemporaryReferenceSet = WeakMap<
	TemporaryReference<any>,
	string
>

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

declare module 'react-server-dom-webpack/server.edge' {
	type ImportManifestEntry = {
		id: string
		chunks: Array<string>
		name: string
	}

	type ClientReferenceManifestEntry = ImportManifestEntry

	export type ClientManifest = {
		[id: string]: ClientReferenceManifestEntry
	}

	type Options = {
		environmentName?: string
		identifierPrefix?: string
		signal?: any // AbortSignal
		temporaryReferences?: TemporaryReferenceSet
		onError?: (error: any) => void
		onPostpone?: (reason: string) => void
	}

	export function renderToReadableStream(
		model: any, // ReactClientValue
		webpackMap: ClientManifest,
		options?: Options,
	): ReadableStream
}

declare module 'react-server-dom-webpack/client.edge' {
	type SSRManifest = {
		moduleMap: any
		moduleLoading: any
	}

	export type Options = {
		ssrManifest: SSRManifest
		nonce?: string
		encodeFormAction?: any // EncodeFormActionCallback
		temporaryReferences?: any // TemporaryReferenceSet
	}

	export function createFromReadableStream(
		stream: ReadableStream,
		options: Options,
	): ReactNode
}
