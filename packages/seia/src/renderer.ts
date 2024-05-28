import { createFromReadableStream } from 'react-server-dom-webpack/client.edge'
import { Worker } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { ReactNode } from 'react'
import { cwd } from 'node:process'
import { ResolvedSeiaConfig } from './config.js'

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

export const renderRscDom = async (
	componentAnchorId: string,
	config: ResolvedSeiaConfig,
): Promise<[Worker, ReactNode]> => {
	const [worker, rs] = await execWorker(
		componentAnchorId,
		config,
	)

	const dom = await createFromReadableStream(rs, {
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

									console.log(
										'file',
										file,
										'name',
										name,
									)

									if (
										!__webpack_module_loading__.has(
											id,
										)
									) {
										__webpack_module_loading__.set(
											id,
											import(
												cwd() +
													`/dist/ssr/${file.toString()}`
											).then(
												(m: any) =>
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

	return [worker, dom]
}
