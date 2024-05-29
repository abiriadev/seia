import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Worker } from 'node:worker_threads'

import { ReactNode } from 'react'
import { createFromReadableStream } from 'react-server-dom-webpack/client.edge'

import { ResolvedSeiaConfig } from './config.js'
import './webpack-global.js'

const workerUrl = join(
	fileURLToPath(new URL('.', import.meta.url)),
	'worker.js',
)

const execWorker = async (
	componentAnchorId: string,
	config: ResolvedSeiaConfig,
): Promise<[Worker, ReadableStream]> =>
	new Promise((resolve, reject) => {
		const worker = new Worker(workerUrl, {
			workerData: {
				anchorId: componentAnchorId,
				config,
			},
			execArgv: ['-C', 'react-server'],
		})

		worker.on('error', async e => {
			await worker.terminate()
			reject(e)
		})
		worker.on('message', rs => resolve([worker, rs]))
	})

export const renderRscPayloadStream = async (
	componentAnchorId: string,
	config: ResolvedSeiaConfig,
): Promise<[Worker, ReadableStream]> =>
	await execWorker(componentAnchorId, config)

export const renderRscPayloadStreamToDom = async (
	stream: ReadableStream,
	{ root, paths: { dist, ssr } }: ResolvedSeiaConfig,
) =>
	await createFromReadableStream(stream, {
		ssrManifest: {
			moduleMap: new Proxy(
				{},
				{
					get: (_, file) =>
						new Proxy(
							{},
							{
								get(_, name) {
									const id = `${file.toString()}#${name.toString()}`

									if (!__webpack_module_loading__.has(id)) {
										__webpack_module_loading__.set(
											id,
											import(
												join(
													root,
													dist,
													ssr,
													file.toString(),
												)
											).then((m: any) =>
												__webpack_module_cache__.set(
													id,
													m,
												),
											),
										)
									}

									return {
										id,
										name,
										chunks: [id],
									}
								},
							},
						),
				},
			),
			moduleLoading: null,
		},
	})

export const renderRscDom = async (
	componentAnchorId: string,
	config: ResolvedSeiaConfig,
): Promise<[Worker, ReactNode]> => {
	const [worker, rs] = await execWorker(componentAnchorId, config)

	const dom = await renderRscPayloadStreamToDom(rs, config)

	return [worker, dom]
}
