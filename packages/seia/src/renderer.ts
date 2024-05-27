import { createFromReadableStream } from 'react-server-dom-webpack/client.edge'
import { Worker } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { ReactNode } from 'react'
import { cwd } from 'node:process'

const workerUrl = join(
	fileURLToPath(new URL('.', import.meta.url)),
	'worker.js',
)

const execWorker = async (
	componentAnchorId: string,
): Promise<[Worker, ReadableStream]> =>
	new Promise((resolve, reject) => {
		const worker = new Worker(workerUrl, {
			workerData: componentAnchorId,
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
): Promise<[Worker, ReadableStream]> =>
	await execWorker(componentAnchorId)

export const renderRscDom = async (
	componentAnchorId: string,
): Promise<[Worker, ReactNode]> => {
	const [worker, rs] = await execWorker(componentAnchorId)

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
